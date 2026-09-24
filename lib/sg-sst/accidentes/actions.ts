"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  ACCIDENT_EXCEL_MAX_ROWS,
  type AccidentExcelImportResultRow,
  type AccidentExcelImportRow,
} from "@/lib/sg-sst/accidentes/excel";
import {
  createAccidentEvent,
  deleteAccidentEvent,
  findAccidentByEventNumber,
  getAccidentEvent,
  getAccidentStats,
  getCausesRanking,
  listAccidentEvents,
  updateAccidentEvent,
} from "@/lib/sg-sst/accidentes/repository";
import {
  normalizeAccidentDraftForImport,
  validateAccidentDraft,
  type AccidentStats,
  type CausesRanking,
  type SstAccidentEvent,
  type SstAccidentEventDraft,
} from "@/lib/sg-sst/accidentes/types";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  getWorker,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";
import {
  auditEntityCreate,
  auditEntityDelete,
  auditEntityImport,
  auditEntityUpdate,
} from "@/lib/sg-sst/trazabilidad/helpers";

export type AccidentActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type AccidentSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateAccidentPaths() {
  revalidatePath("/sg-sst/accidentes-e-incidentes");
  revalidatePath("/sg-sst/investigaciones");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

function resolveFarmId(
  farms: readonly SstFarm[],
  farmName: string | undefined,
): string | null {
  if (!farmName?.trim()) return null;
  const normalized = farmName.trim().toLowerCase();
  const match = farms.find(
    (farm) =>
      farm.name.toLowerCase() === normalized ||
      farm.code.toLowerCase() === normalized,
  );
  return match?.id ?? null;
}

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

export async function loadAccidentsMasterData(): Promise<{
  events: SstAccidentEvent[];
  stats: AccidentStats;
  causesRanking: CausesRanking;
  farms: SstFarm[];
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [events, stats, causesRanking, farms, workers] = await Promise.all([
    listAccidentEvents(),
    getAccidentStats(),
    getCausesRanking(),
    listSstFarms(),
    listWorkers({ status: "all" }),
  ]);
  return { events, stats, causesRanking, farms, workers };
}

export async function saveAccidentAction(
  draft: SstAccidentEventDraft,
): Promise<AccidentActionResult> {
  const admin = await requireAdmin();
  const error = validateAccidentDraft(draft);
  if (error) return { ok: false, error };
  try {
    const worker = draft.workerId ? await getWorker(draft.workerId) : null;
    const workerName = worker?.fullName ?? null;
    if (draft.id) {
      const saved = await updateAccidentEvent(draft.id, draft, admin.id);
      await auditEntityUpdate({
        actor: admin,
        module: "accidentes",
        entityType: "accident_event",
        entityId: saved.id,
        workerId: saved.workerId,
        subject: "el evento de accidente/incidente",
        ofWhom: workerName ?? saved.workerName,
        details: { folio: saved.eventNumber },
      });
      revalidateAccidentPaths();
      return { ok: true, id: saved.id };
    }
    const saved = await createAccidentEvent(draft, admin.id);
    await auditEntityCreate({
      actor: admin,
      module: "accidentes",
      entityType: "accident_event",
      entityId: saved.id,
      workerId: saved.workerId,
      subject: "el evento de accidente/incidente",
      ofWhom: workerName ?? saved.workerName,
      details: { folio: saved.eventNumber },
    });
    revalidateAccidentPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el evento de accidente/incidente.",
    };
  }
}

export async function deleteAccidentAction(
  id: string,
): Promise<AccidentSimpleResult> {
  const admin = await requireAdmin();
  try {
    const existing = await getAccidentEvent(id);
    await deleteAccidentEvent(id);
    if (existing) {
      await auditEntityDelete({
        actor: admin,
        module: "accidentes",
        entityType: "accident_event",
        entityId: existing.id,
        workerId: existing.workerId,
        subject: "el evento de accidente/incidente",
        ofWhom: existing.workerName,
        details: { folio: existing.eventNumber },
      });
    }
    revalidateAccidentPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportAccidentsResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: AccidentExcelImportResultRow[];
    }
  | { ok: false; error: string };

export async function bulkImportAccidentsAction(input: {
  rows: AccidentExcelImportRow[];
}): Promise<BulkImportAccidentsResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > ACCIDENT_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${ACCIDENT_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: AccidentExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const workerId = await resolveWorkerId(row.workerDocumentOrCode);
      if (!workerId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          eventNumber: row.eventNumber ?? "",
          workerRef: row.workerDocumentOrCode,
          status: "error",
          message: `Trabajador no encontrado: "${row.workerDocumentOrCode}"`,
        });
        continue;
      }

      // Centro desconocido: se importa igual sin vincular (campo opcional).
      const farmId = resolveFarmId(farms, row.farmName);

      const draft = normalizeAccidentDraftForImport({
        ...row.draft,
        workerId,
        farmId: farmId ?? row.draft.farmId ?? null,
      });
      const validationError = validateAccidentDraft(draft, "import");
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          eventNumber: row.eventNumber ?? "",
          workerRef: row.workerDocumentOrCode,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.eventNumber
          ? await findAccidentByEventNumber(row.eventNumber)
          : null;
        if (existing) {
          const saved = await updateAccidentEvent(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            eventNumber: saved.eventNumber,
            workerRef: row.workerDocumentOrCode,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createAccidentEvent(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            eventNumber: saved.eventNumber,
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
          eventNumber: row.eventNumber ?? "",
          workerRef: row.workerDocumentOrCode,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateAccidentPaths();
    await auditEntityImport({
      actor: admin,
      module: "accidentes",
      entityType: "accident_event",
      subjectPlural: "eventos de accidente/incidente",
      created,
      updated,
      failed,
      rows: input.rows.length,
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
