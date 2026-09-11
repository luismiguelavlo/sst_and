"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  EPP_EXCEL_MAX_ROWS,
  type EppExcelImportResultRow,
  type EppExcelImportRow,
} from "@/lib/sg-sst/epp/excel";
import {
  createCatalogItem,
  createDelivery,
  deleteCatalogItem,
  deleteDelivery,
  ensureCatalogDefaults,
  findCatalogByCode,
  findCatalogByName,
  findDeliveryByFolio,
  getEppStats,
  listCatalog,
  listDeliveryViews,
  updateCatalogItem,
  updateDelivery,
} from "@/lib/sg-sst/epp/repository";
import {
  normalizeDeliveryDraftForImport,
  validateCatalogDraft,
  validateDeliveryDraft,
  type EppStats,
  type SstEppCatalogDraft,
  type SstEppCatalogItem,
  type SstEppDeliveryDraft,
  type SstEppDeliveryView,
} from "@/lib/sg-sst/epp/types";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

export type EppActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type EppSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateEppPaths() {
  revalidatePath("/sg-sst/epp");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadEppMasterData(): Promise<{
  deliveries: SstEppDeliveryView[];
  catalog: SstEppCatalogItem[];
  stats: EppStats;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
  workers: SstWorker[];
}> {
  await requireAdmin();
  await ensureCatalogDefaults();
  const [deliveries, catalog, stats, farms, workers] = await Promise.all([
    listDeliveryViews(),
    listCatalog(),
    getEppStats(),
    listSstFarms(),
    listWorkers({ status: "all" }),
  ]);
  return { deliveries, catalog, stats, farms, workers };
}

export async function saveEppDeliveryAction(
  draft: SstEppDeliveryDraft,
): Promise<EppActionResult> {
  const admin = await requireAdmin();
  const error = validateDeliveryDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateDelivery(draft.id, draft, admin.id)
      : await createDelivery(draft, admin.id);
    revalidateEppPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar la entrega de EPP.",
    };
  }
}

export async function deleteEppDeliveryAction(
  id: string,
): Promise<EppSimpleResult> {
  await requireAdmin();
  try {
    await deleteDelivery(id);
    revalidateEppPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function saveEppCatalogAction(
  draft: SstEppCatalogDraft,
): Promise<EppActionResult> {
  await requireAdmin();
  const error = validateCatalogDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateCatalogItem(draft.id, draft)
      : await createCatalogItem(draft);
    revalidateEppPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el ítem del catálogo.",
    };
  }
}

export async function deleteEppCatalogAction(
  id: string,
): Promise<EppSimpleResult> {
  await requireAdmin();
  try {
    await deleteCatalogItem(id);
    revalidateEppPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportEppResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: EppExcelImportResultRow[];
    }
  | { ok: false; error: string };

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

export async function bulkImportEppDeliveriesAction(input: {
  rows: EppExcelImportRow[];
}): Promise<BulkImportEppResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > EPP_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${EPP_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    await ensureCatalogDefaults();
    const results: EppExcelImportResultRow[] = [];
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

      const catalog =
        (await findCatalogByCode(row.catalogCodeOrName)) ??
        (await findCatalogByName(row.catalogCodeOrName));
      if (!catalog) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          folio: row.folio ?? "",
          workerRef: row.workerDocumentOrCode,
          status: "error",
          message: `EPP no encontrado en catálogo: "${row.catalogCodeOrName}"`,
        });
        continue;
      }

      const usefulLifeDays =
        row.draft.usefulLifeDays > 0
          ? row.draft.usefulLifeDays
          : catalog.usefulLifeDays;

      const draft = normalizeDeliveryDraftForImport({
        ...row.draft,
        workerId,
        catalogItemId: catalog.id,
        usefulLifeDays,
      });
      const validationError = validateDeliveryDraft(draft, "import");
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
        const existing = row.folio ? await findDeliveryByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateDelivery(
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
          const saved = await createDelivery(draft, admin.id);
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

    revalidateEppPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
