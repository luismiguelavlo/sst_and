"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  ACTION_EXCEL_MAX_ROWS,
  type ActionExcelImportResultRow,
  type ActionExcelImportRow,
} from "@/lib/sg-sst/acciones/excel";
import {
  createAction,
  deleteAction,
  findActionByFolio,
  getActionStats,
  listActionViews,
  updateAction,
} from "@/lib/sg-sst/acciones/repository";
import {
  validateActionDraft,
  type ActionStats,
  type SstCorrectiveActionDraft,
  type SstCorrectiveActionView,
} from "@/lib/sg-sst/acciones/types";

export type ActionActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type ActionSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateActionPaths() {
  revalidatePath("/sg-sst/acciones-correctivas");
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

export async function loadActionsMasterData(): Promise<{
  actions: SstCorrectiveActionView[];
  stats: ActionStats;
  farms: SstFarm[];
}> {
  await requireAdmin();
  const [actions, stats, farms] = await Promise.all([
    listActionViews(),
    getActionStats(),
    listSstFarms(),
  ]);
  return { actions, stats, farms };
}

export async function saveActionAction(
  draft: SstCorrectiveActionDraft,
): Promise<ActionActionResult> {
  const admin = await requireAdmin();
  const error = validateActionDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateAction(draft.id, draft, admin.id)
      : await createAction(draft, admin.id);
    revalidateActionPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar la acción correctiva.",
    };
  }
}

export async function deleteActionAction(
  id: string,
): Promise<ActionSimpleResult> {
  await requireAdmin();
  try {
    await deleteAction(id);
    revalidateActionPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportActionsResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: ActionExcelImportResultRow[];
    }
  | { ok: false; error: string };

export async function bulkImportActionsAction(input: {
  rows: ActionExcelImportRow[];
}): Promise<BulkImportActionsResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > ACTION_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${ACTION_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: ActionExcelImportResultRow[] = [];
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
          message: `Finca no encontrada: "${row.farmName}"`,
        });
        continue;
      }

      const draft: SstCorrectiveActionDraft = { ...row.draft, farmId };
      const validationError = validateActionDraft(draft);
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
        const existing = row.folio ? await findActionByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateAction(
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
          const saved = await createAction(draft, admin.id);
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

    revalidateActionPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
