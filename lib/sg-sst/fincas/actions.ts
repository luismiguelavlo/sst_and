"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import {
  FARM_EXCEL_MAX_ROWS,
  type FarmExcelImportResultRow,
  type FarmExcelImportRow,
} from "@/lib/sg-sst/fincas/excel";
import {
  createFarm,
  deleteFarm,
  findFarmByCode,
  getFarmStats,
  listFarmRecords,
  setFarmActive,
  updateFarm,
} from "@/lib/sg-sst/fincas/repository";
import {
  validateFarmDraft,
  type FarmStats,
  type SstFarmDraft,
  type SstFarmRecord,
} from "@/lib/sg-sst/fincas/types";

export type FarmActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type FarmSimpleResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

function revalidateFarmPaths() {
  revalidatePath("/sg-sst/centros-de-trabajo");
  revalidatePath("/sg-sst");
  revalidatePath("/sg-sst/trabajadores");
  revalidatePath("/sg-sst/alertas-sst");
}

export async function loadFarmsMasterData(): Promise<{
  farms: SstFarmRecord[];
  stats: FarmStats;
}> {
  await requireAdmin();
  const [farms, stats] = await Promise.all([
    listFarmRecords({ includeInactive: true }),
    getFarmStats(),
  ]);
  return { farms, stats };
}

export async function saveFarmAction(
  draft: SstFarmDraft,
): Promise<FarmActionResult> {
  await requireAdmin();
  const error = validateFarmDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateFarm(draft.id, draft)
      : await createFarm(draft);
    revalidateFarmPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo guardar el centro de trabajo.",
    };
  }
}

export async function setFarmActiveAction(
  id: string,
  active: boolean,
): Promise<FarmSimpleResult> {
  await requireAdmin();
  try {
    await setFarmActive(id, active);
    revalidateFarmPaths();
    return {
      ok: true,
      message: active ? "Centro reactivado." : "Centro desactivado.",
    };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo cambiar el estado del centro.",
    };
  }
}

export async function deleteFarmAction(id: string): Promise<FarmSimpleResult> {
  await requireAdmin();
  try {
    const result = await deleteFarm(id);
    revalidateFarmPaths();
    if (result === "deactivated") {
      return {
        ok: true,
        message:
          "El centro tiene registros vinculados; se desactivó en lugar de eliminarlo.",
      };
    }
    return { ok: true, message: "Centro eliminado." };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo eliminar el centro.",
    };
  }
}

export async function bulkImportFarmsAction(input: {
  rows: FarmExcelImportRow[];
}): Promise<
  | { ok: true; results: FarmExcelImportResultRow[] }
  | { ok: false; error: string }
> {
  await requireAdmin();
  const rows = input.rows;
  if (!Array.isArray(rows) || rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (rows.length > FARM_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${FARM_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  const results: FarmExcelImportResultRow[] = [];
  for (const [index, row] of rows.entries()) {
    const draft: SstFarmDraft = {
      name: row.name,
      code: row.code,
      company: row.company,
      municipality: row.municipality,
      address: row.address,
      observations: row.observations,
      active: row.active,
    };
    const validation = validateFarmDraft(draft);
    if (validation) {
      results.push({
        row: index + 2,
        code: row.code,
        ok: false,
        error: validation,
      });
      continue;
    }
    try {
      const existing = await findFarmByCode(row.code);
      if (existing) {
        await updateFarm(existing.id, { ...draft, id: existing.id });
        results.push({
          row: index + 2,
          code: row.code,
          ok: true,
          action: "updated",
        });
      } else {
        await createFarm(draft);
        results.push({
          row: index + 2,
          code: row.code,
          ok: true,
          action: "created",
        });
      }
    } catch (caught) {
      results.push({
        row: index + 2,
        code: row.code,
        ok: false,
        error:
          caught instanceof Error ? caught.message : "Error al importar la fila.",
      });
    }
  }

  revalidateFarmPaths();
  return { ok: true, results };
}
