"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  HEIGHTS_EXCEL_MAX_ROWS,
  type HeightsExcelImportResultRow,
  type HeightsExcelImportRow,
} from "@/lib/sg-sst/alturas/excel";
import {
  createHeightsAuthorization,
  deleteHeightsAuthorization,
  findHeightsByFolio,
  getHeightsAuthorization,
  getHeightsStats,
  listHeightsViews,
  updateHeightsAuthorization,
} from "@/lib/sg-sst/alturas/repository";
import {
  normalizeHeightsDraftForImport,
  validateHeightsDraft,
  type HeightsStats,
  type SstHeightsDraft,
  type SstHeightsView,
} from "@/lib/sg-sst/alturas/types";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  getWorker,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";
import { recordSstAudit } from "@/lib/sg-sst/trazabilidad/repository";
import {
  buildAuditSummary,
  buildImportAuditSummary,
  diffLabeledFields,
  summarizeFieldChanges,
} from "@/lib/sg-sst/trazabilidad/types";

export type HeightsActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type HeightsSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateHeightsPaths() {
  revalidatePath("/sg-sst/trabajo-en-alturas");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadHeightsMasterData(): Promise<{
  items: SstHeightsView[];
  stats: HeightsStats;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [items, stats, farms, workers] = await Promise.all([
    listHeightsViews(),
    getHeightsStats(),
    listSstFarms(),
    listWorkers({ status: "all" }),
  ]);
  return { items, stats, farms, workers };
}

export async function saveHeightsAction(
  draft: SstHeightsDraft,
): Promise<HeightsActionResult> {
  const admin = await requireAdmin();
  const error = validateHeightsDraft(draft);
  if (error) return { ok: false, error };
  try {
    const worker = await getWorker(draft.workerId);
    const workerName = worker?.fullName ?? "trabajador";

    if (draft.id) {
      const previous = await getHeightsAuthorization(draft.id);
      const saved = await updateHeightsAuthorization(draft.id, draft, admin.id);
      const changes = previous
        ? diffLabeledFields(
            {
              trainingDueDate: previous.trainingDueDate,
              medicalExamDueDate: previous.medicalExamDueDate,
              trainingDate: previous.trainingDate,
              medicalExamDate: previous.medicalExamDate,
              fitnessConcept: previous.fitnessConcept,
              trainingLevel: previous.trainingLevel,
              observations: previous.observations,
              certificateName: previous.certificateName,
            },
            {
              trainingDueDate: draft.trainingDueDate,
              medicalExamDueDate: draft.medicalExamDueDate,
              trainingDate: draft.trainingDate,
              medicalExamDate: draft.medicalExamDate,
              fitnessConcept: draft.fitnessConcept,
              trainingLevel: draft.trainingLevel,
              observations: draft.observations,
              certificateName: draft.certificateName,
            },
            {
              trainingDueDate: "la fecha de vencimiento del curso de alturas",
              medicalExamDueDate: "la fecha de vencimiento del examen médico de alturas",
              trainingDate: "la fecha de formación en alturas",
              medicalExamDate: "la fecha del examen médico de alturas",
              fitnessConcept: "el concepto de aptitud",
              trainingLevel: "el nivel de formación",
              observations: "las observaciones",
              certificateName: "el certificado",
            },
          )
        : [];
      const focus = summarizeFieldChanges(changes);
      await recordSstAudit({
        actor: admin,
        action: "update",
        module: "alturas",
        entityType: "heights_authorization",
        entityId: saved.id,
        workerId: saved.workerId,
        summary: buildAuditSummary({
          actorName: admin.name,
          verb: "actualizó",
          subject: "la autorización de trabajo en alturas",
          ofWhom: workerName,
          focus,
        }),
        details: { changes, folio: saved.folio },
      });
      revalidateHeightsPaths();
      return { ok: true, id: saved.id };
    }

    const saved = await createHeightsAuthorization(draft, admin.id);
    await recordSstAudit({
      actor: admin,
      action: "create",
      module: "alturas",
      entityType: "heights_authorization",
      entityId: saved.id,
      workerId: saved.workerId,
      summary: buildAuditSummary({
        actorName: admin.name,
        verb: "creó",
        subject: "la autorización de trabajo en alturas",
        ofWhom: workerName,
      }),
      details: { folio: saved.folio },
    });
    revalidateHeightsPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar la autorización de alturas.",
    };
  }
}

export async function deleteHeightsAction(
  id: string,
): Promise<HeightsSimpleResult> {
  const admin = await requireAdmin();
  try {
    const existing = await getHeightsAuthorization(id);
    await deleteHeightsAuthorization(id);
    if (existing) {
      await recordSstAudit({
        actor: admin,
        action: "delete",
        module: "alturas",
        entityType: "heights_authorization",
        entityId: existing.id,
        workerId: existing.workerId,
        summary: buildAuditSummary({
          actorName: admin.name,
          verb: "eliminó",
          subject: "la autorización de trabajo en alturas",
          ofWhom: existing.workerName,
        }),
        details: { folio: existing.folio },
      });
    }
    revalidateHeightsPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportHeightsResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: HeightsExcelImportResultRow[];
    }
  | { ok: false; error: string };

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

export async function bulkImportHeightsAction(input: {
  rows: HeightsExcelImportRow[];
}): Promise<BulkImportHeightsResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > HEIGHTS_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${HEIGHTS_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: HeightsExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const workerId = await resolveWorkerId(row.workerDocumentOrCode);
      if (!workerId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          folio: row.folio ?? "",
          workerRef: row.workerDocumentOrCode,
          status: "error",
          message: `Trabajador no encontrado: "${row.workerDocumentOrCode}"`,
        });
        continue;
      }

      const draft = normalizeHeightsDraftForImport({
        ...row.draft,
        workerId,
      });
      const validationError = validateHeightsDraft(draft, "import");
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          folio: row.folio ?? "",
          workerRef: row.workerDocumentOrCode,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.folio ? await findHeightsByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateHeightsAuthorization(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            folio: saved.folio,
            workerRef: row.workerDocumentOrCode,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createHeightsAuthorization(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            folio: saved.folio,
            workerRef: row.workerDocumentOrCode,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          folio: row.folio ?? "",
          workerRef: row.workerDocumentOrCode,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateHeightsPaths();
    await recordSstAudit({
      actor: admin,
      action: "import",
      module: "alturas",
      entityType: "heights_authorization",
      summary: buildImportAuditSummary({
        actorName: admin.name,
        subjectPlural: "autorizaciones de trabajo en alturas",
        created,
        updated,
        failed,
      }),
      details: {
        extra: { created, updated, failed, rows: input.rows.length },
      },
    });
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
