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
  findFarmByName,
  getFarmStats,
  listFarmRecords,
  setFarmActive,
  updateFarm,
} from "@/lib/sg-sst/fincas/repository";
import {
  normalizeFarmCode,
  normalizeFarmDraftForImport,
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
  const normalized: SstFarmDraft = {
    ...draft,
    code: normalizeFarmCode(draft.code),
    name: draft.name.trim(),
  };
  const error = validateFarmDraft(normalized);
  if (error) return { ok: false, error };
  try {
    const saved = normalized.id
      ? await updateFarm(normalized.id, normalized)
      : await createFarm(normalized);
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
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: FarmExcelImportResultRow[];
    }
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
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const row of rows) {
    const draft = normalizeFarmDraftForImport({
      name: row.name.trim(),
      code: normalizeFarmCode(row.code),
      company: row.company.trim(),
      municipality: row.municipality.trim(),
      address: row.address.trim(),
      observations: row.observations.trim(),
      active: row.active,
    });
    const validation = validateFarmDraft(draft, "import");
    if (validation) {
      failed += 1;
      results.push({
        row: row.rowNumber,
        code: draft.code || row.code,
        name: draft.name,
        ok: false,
        error: validation,
      });
      continue;
    }
    try {
      const existing =
        (await findFarmByCode(draft.code)) ?? (await findFarmByName(draft.name));
      if (existing) {
        await updateFarm(existing.id, { ...draft, id: existing.id });
        updated += 1;
        results.push({
          row: row.rowNumber,
          code: draft.code,
          name: draft.name,
          ok: true,
          action: "updated",
        });
      } else {
        await createFarm(draft);
        created += 1;
        results.push({
          row: row.rowNumber,
          code: draft.code,
          name: draft.name,
          ok: true,
          action: "created",
        });
      }
    } catch (caught) {
      failed += 1;
      results.push({
        row: row.rowNumber,
        code: draft.code,
        name: draft.name,
        ok: false,
        error:
          caught instanceof Error ? caught.message : "Error al importar la fila.",
      });
    }
  }

  revalidateFarmPaths();
  return { ok: true, created, updated, failed, results };
}
