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
  getHeightsStats,
  listHeightsViews,
  updateHeightsAuthorization,
} from "@/lib/sg-sst/alturas/repository";
import {
  validateHeightsDraft,
  type HeightsStats,
  type SstHeightsDraft,
  type SstHeightsView,
} from "@/lib/sg-sst/alturas/types";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

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
    const saved = draft.id
      ? await updateHeightsAuthorization(draft.id, draft, admin.id)
      : await createHeightsAuthorization(draft, admin.id);
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
  await requireAdmin();
  try {
    await deleteHeightsAuthorization(id);
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

      const draft: SstHeightsDraft = { ...row.draft, workerId };
      const validationError = validateHeightsDraft(draft);
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
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
