"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  EMO_EXCEL_MAX_ROWS,
  type EmoExcelImportResultRow,
  type EmoExcelImportRow,
} from "@/lib/sg-sst/emos/excel";
import {
  createEmo,
  deleteEmo,
  findEmoByFolio,
  getEmo,
  getEmoStats,
  listEmoViews,
  listEmosByWorker,
  updateEmo,
} from "@/lib/sg-sst/emos/repository";
import {
  isEmoConcept,
  isEmoExamType,
  validateEmoDraft,
  type EmoStats,
  type SstEmo,
  type SstEmoDraft,
  type SstEmoView,
} from "@/lib/sg-sst/emos/types";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";
import { getWorkerStats } from "@/lib/sg-sst/workers/repository";

export type EmoActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type EmoSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateEmoPaths(id?: string) {
  revalidatePath("/sg-sst/examenes-medicos-ocupacionales");
  revalidatePath("/sg-sst/examenes-medicos-ocupacionales/nuevo");
  if (id) {
    revalidatePath(`/sg-sst/examenes-medicos-ocupacionales/${id}`);
  }
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadEmosMasterData(): Promise<{
  emos: SstEmoView[];
  stats: EmoStats;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
  workerCensus: number;
}> {
  await requireAdmin();
  const [emos, stats, farms, workerStats] = await Promise.all([
    listEmoViews(),
    getEmoStats(),
    listSstFarms(),
    getWorkerStats(),
  ]);
  return { emos, stats, farms, workerCensus: workerStats.active };
}

export async function loadEmoFormData(id?: string): Promise<{
  farms: Awaited<ReturnType<typeof listSstFarms>>;
  workers: SstWorker[];
  emo: SstEmo | null;
  history: SstEmo[];
}> {
  await requireAdmin();
  const [farms, workers, emo] = await Promise.all([
    listSstFarms(),
    listWorkers({ status: "all" }),
    id ? getEmo(id) : Promise.resolve(null),
  ]);
  const history = emo ? await listEmosByWorker(emo.workerId) : [];
  return { farms, workers, emo, history };
}

export async function saveEmoAction(draft: SstEmoDraft): Promise<EmoActionResult> {
  const admin = await requireAdmin();
  const error = validateEmoDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateEmo(draft.id, draft, admin.id)
      : await createEmo(draft, admin.id);
    revalidateEmoPaths(saved.id);
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo guardar el EMO.",
    };
  }
}

export async function deleteEmoAction(id: string): Promise<EmoSimpleResult> {
  await requireAdmin();
  try {
    await deleteEmo(id);
    revalidateEmoPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportEmosResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: EmoExcelImportResultRow[];
    }
  | { ok: false; error: string };

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

export async function bulkImportEmosAction(input: {
  rows: EmoExcelImportRow[];
}): Promise<BulkImportEmosResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > EMO_EXCEL_MAX_ROWS) {
    return { ok: false, error: `Máximo ${EMO_EXCEL_MAX_ROWS} filas por importación.` };
  }

  try {
    const results: EmoExcelImportResultRow[] = [];
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

      const draft: SstEmoDraft = {
        ...row.draft,
        workerId,
        examType: isEmoExamType(row.draft.examType)
          ? row.draft.examType
          : "ingreso",
        examDate: row.draft.examDate.trim() || todayIsoDate(),
        concept: isEmoConcept(row.draft.concept) ? row.draft.concept : "apto",
        ips: row.draft.ips.trim() || "Sin dato",
      };
      const validationError = validateEmoDraft(draft, "import");
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
        const existing = row.folio ? await findEmoByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateEmo(existing.id, { ...draft, id: existing.id }, admin.id);
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
          const saved = await createEmo(draft, admin.id);
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

    revalidateEmoPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
