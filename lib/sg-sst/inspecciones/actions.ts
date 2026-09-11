"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  INSPECTION_EXCEL_MAX_ROWS,
  type InspectionExcelImportResultRow,
  type InspectionExcelImportRow,
} from "@/lib/sg-sst/inspecciones/excel";
import {
  createInspection,
  deleteInspection,
  findInspectionByFolio,
  getInspectionStats,
  listInspectionViews,
  listThisWeekInspections,
  updateInspection,
} from "@/lib/sg-sst/inspecciones/repository";
import {
  getCurrentWeekRange,
  validateInspectionDraft,
  type InspectionStats,
  type SstInspectionDraft,
  type SstInspectionView,
  type WeekRange,
} from "@/lib/sg-sst/inspecciones/types";

export type InspectionActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type InspectionSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateInspectionPaths() {
  revalidatePath("/sg-sst/inspecciones");
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

export async function loadInspectionsMasterData(): Promise<{
  inspections: SstInspectionView[];
  stats: InspectionStats;
  farms: SstFarm[];
  week: WeekRange;
  weekItems: SstInspectionView[];
}> {
  await requireAdmin();
  const [inspections, stats, farms, weekBundle] = await Promise.all([
    listInspectionViews(),
    getInspectionStats(),
    listSstFarms(),
    listThisWeekInspections(),
  ]);
  return {
    inspections,
    stats,
    farms,
    week: weekBundle.week,
    weekItems: weekBundle.items,
  };
}

export async function saveInspectionAction(
  draft: SstInspectionDraft,
): Promise<InspectionActionResult> {
  const admin = await requireAdmin();
  const error = validateInspectionDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateInspection(draft.id, draft, admin.id)
      : await createInspection(draft, admin.id);
    revalidateInspectionPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar la inspección.",
    };
  }
}

export async function deleteInspectionAction(
  id: string,
): Promise<InspectionSimpleResult> {
  await requireAdmin();
  try {
    await deleteInspection(id);
    revalidateInspectionPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportInspectionsResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: InspectionExcelImportResultRow[];
    }
  | { ok: false; error: string };

export async function bulkImportInspectionsAction(input: {
  rows: InspectionExcelImportRow[];
}): Promise<BulkImportInspectionsResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > INSPECTION_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${INSPECTION_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: InspectionExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const farmId = resolveFarmId(farms, row.farmName);
      if (row.farmName?.trim() && !farmId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          folio: row.folio ?? "",
          farmRef: row.farmName,
          status: "error",
          message: `Centro de trabajo no encontrado: "${row.farmName}"`,
        });
        continue;
      }

      const draft: SstInspectionDraft = { ...row.draft, farmId };
      const validationError = validateInspectionDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          folio: row.folio ?? "",
          farmRef: row.farmName ?? "",
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.folio ? await findInspectionByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateInspection(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            folio: saved.folio,
            farmRef: row.farmName ?? "",
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createInspection(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            folio: saved.folio,
            farmRef: row.farmName ?? "",
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
          farmRef: row.farmName ?? "",
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateInspectionPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

/** Expuesto por si el cliente necesita recalcular el rango semanal. */
export async function getInspectionWeekRangeAction(): Promise<WeekRange> {
  await requireAdmin();
  return getCurrentWeekRange();
}
