"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  TRAINING_EXCEL_MAX_ROWS,
  type TrainingExcelImportResultRow,
  type TrainingExcelImportRow,
} from "@/lib/sg-sst/capacitaciones/excel";
import {
  createTraining,
  deleteTraining,
  findTrainingByFolio,
  getTraining,
  getTrainingStats,
  listTrainingViews,
  updateTraining,
} from "@/lib/sg-sst/capacitaciones/repository";
import {
  TRAINING_TOPICS,
  isTrainingModality,
  isTrainingStatus,
  isTrainingTopic,
  validateTrainingDraft,
  type SstTrainingDraft,
  type SstTrainingView,
  type TrainingStats,
} from "@/lib/sg-sst/capacitaciones/types";
import { isBusinessFolioCode, todayIsoDate } from "@/lib/sg-sst/draft-mode";
import {
  getWorker,
  listWorkers,
  resolveWorkerId,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";
import {
  auditEntityCreate,
  auditEntityDelete,
  auditEntityImport,
  auditEntityUpdate,
} from "@/lib/sg-sst/trazabilidad/helpers";
import {
  diffLabeledFields,
  summarizeFieldChanges,
} from "@/lib/sg-sst/trazabilidad/types";

export type TrainingActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type TrainingSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateTrainingPaths() {
  revalidatePath("/sg-sst/capacitaciones");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadTrainingsMasterData(): Promise<{
  items: SstTrainingView[];
  stats: TrainingStats;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [items, stats, farms, workers] = await Promise.all([
    listTrainingViews(),
    getTrainingStats(),
    listSstFarms(),
    listWorkers({ status: "all" }),
  ]);
  return { items, stats, farms, workers };
}

export async function saveTrainingAction(
  draft: SstTrainingDraft,
): Promise<TrainingActionResult> {
  const admin = await requireAdmin();
  const error = validateTrainingDraft(draft);
  if (error) return { ok: false, error };
  try {
    const worker = await getWorker(draft.workerId);
    const workerName = worker?.fullName ?? "trabajador";
    if (draft.id) {
      const previous = await getTraining(draft.id);
      const saved = await updateTraining(draft.id, draft, admin.id);
      const changes = previous
        ? diffLabeledFields(
            {
              nextTrainingDate: previous.nextTrainingDate,
              trainingDate: previous.trainingDate,
              topic: previous.topic,
              status: previous.status,
            },
            {
              nextTrainingDate: draft.nextTrainingDate,
              trainingDate: draft.trainingDate,
              topic: draft.topic,
              status: draft.status,
            },
            {
              nextTrainingDate: "la fecha de vencimiento de la capacitación",
              trainingDate: "la fecha de la capacitación",
              topic: "el tema de capacitación",
              status: "el estado de la capacitación",
            },
          )
        : [];
      await auditEntityUpdate({
        actor: admin,
        module: "capacitaciones",
        entityType: "training",
        entityId: saved.id,
        workerId: saved.workerId,
        subject: "la capacitación",
        ofWhom: workerName,
        focus: summarizeFieldChanges(changes),
        details: { changes, folio: saved.folio },
      });
      revalidateTrainingPaths();
      return { ok: true, id: saved.id };
    }
    const saved = await createTraining(draft, admin.id);
    await auditEntityCreate({
      actor: admin,
      module: "capacitaciones",
      entityType: "training",
      entityId: saved.id,
      workerId: saved.workerId,
      subject: "la capacitación",
      ofWhom: workerName,
      details: { folio: saved.folio },
    });
    revalidateTrainingPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar la capacitación.",
    };
  }
}

export async function deleteTrainingAction(
  id: string,
): Promise<TrainingSimpleResult> {
  const admin = await requireAdmin();
  try {
    const existing = await getTraining(id);
    await deleteTraining(id);
    if (existing) {
      await auditEntityDelete({
        actor: admin,
        module: "capacitaciones",
        entityType: "training",
        entityId: existing.id,
        workerId: existing.workerId,
        subject: "la capacitación",
        ofWhom: existing.workerName,
        details: { folio: existing.folio },
      });
    }
    revalidateTrainingPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportTrainingsResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: TrainingExcelImportResultRow[];
    }
  | { ok: false; error: string };

// NOTA: resolveWorkerId movido a workers/repository.ts

export async function bulkImportTrainingsAction(input: {
  rows: TrainingExcelImportRow[];
}): Promise<BulkImportTrainingsResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > TRAINING_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${TRAINING_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: TrainingExcelImportResultRow[] = [];
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

      const hours = Number.isFinite(row.draft.hours) && row.draft.hours >= 0
        ? row.draft.hours
        : 0;
      const draft: SstTrainingDraft = {
        ...row.draft,
        workerId,
        topic: isTrainingTopic(row.draft.topic)
          ? row.draft.topic
          : TRAINING_TOPICS[0],
        trainingDate: row.draft.trainingDate.trim() || todayIsoDate(),
        hours,
        modality: isTrainingModality(row.draft.modality)
          ? row.draft.modality
          : "presencial",
        status:
          row.draft.status != null && isTrainingStatus(row.draft.status)
            ? row.draft.status
            : row.draft.status,
      };
      const validationError = validateTrainingDraft(draft, "import");
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
        const existing =
          row.folio && isBusinessFolioCode(row.folio)
            ? await findTrainingByFolio(row.folio)
            : null;
        if (existing) {
          const saved = await updateTraining(
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
          const saved = await createTraining(draft, admin.id);
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

    revalidateTrainingPaths();
    await auditEntityImport({
      actor: admin,
      module: "capacitaciones",
      entityType: "training",
      subjectPlural: "capacitaciones",
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
