"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  RESTRICTION_EXCEL_MAX_ROWS,
  type RestrictionExcelImportResultRow,
  type RestrictionExcelImportRow,
} from "@/lib/sg-sst/restricciones/excel";
import {
  createRestriction,
  deleteRestriction,
  findRestrictionByFolio,
  getRestrictionStats,
  listRestrictionViews,
  updateRestriction,
} from "@/lib/sg-sst/restricciones/repository";
import {
  validateRestrictionDraft,
  type RestrictionStats,
  type SstRestrictionDraft,
  type SstRestrictionView,
} from "@/lib/sg-sst/restricciones/types";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

export type RestrictionActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type RestrictionSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateRestrictionPaths() {
  revalidatePath("/sg-sst/restricciones-y-recomendaciones");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadRestrictionsMasterData(): Promise<{
  restrictions: SstRestrictionView[];
  stats: RestrictionStats;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [restrictions, stats, farms, workers] = await Promise.all([
    listRestrictionViews(),
    getRestrictionStats(),
    listSstFarms(),
    listWorkers({ status: "all" }),
  ]);
  return { restrictions, stats, farms, workers };
}

export async function saveRestrictionAction(
  draft: SstRestrictionDraft,
): Promise<RestrictionActionResult> {
  const admin = await requireAdmin();
  const error = validateRestrictionDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateRestriction(draft.id, draft, admin.id)
      : await createRestriction(draft, admin.id);
    revalidateRestrictionPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar la restricción.",
    };
  }
}

export async function deleteRestrictionAction(
  id: string,
): Promise<RestrictionSimpleResult> {
  await requireAdmin();
  try {
    await deleteRestriction(id);
    revalidateRestrictionPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportRestrictionsResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: RestrictionExcelImportResultRow[];
    }
  | { ok: false; error: string };

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

export async function bulkImportRestrictionsAction(input: {
  rows: RestrictionExcelImportRow[];
}): Promise<BulkImportRestrictionsResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > RESTRICTION_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${RESTRICTION_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: RestrictionExcelImportResultRow[] = [];
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

      const draft: SstRestrictionDraft = { ...row.draft, workerId };
      const validationError = validateRestrictionDraft(draft);
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
        const existing = row.folio ? await findRestrictionByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateRestriction(
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
          const saved = await createRestriction(draft, admin.id);
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

    revalidateRestrictionPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
