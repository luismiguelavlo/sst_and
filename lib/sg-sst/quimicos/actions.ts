"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  CHEMICAL_EXCEL_MAX_ROWS,
  type ChemicalExcelImportRow,
  type ChemicalExcelImportResultRow,
} from "@/lib/sg-sst/quimicos/excel";
import {
  createChemical,
  deleteChemical,
  findChemicalByCode,
  findChemicalByProductAndFarm,
  getChemicalStats,
  listChemicals,
  updateChemical,
} from "@/lib/sg-sst/quimicos/repository";
import {
  normalizeChemicalDraftForImport,
  validateChemicalDraft,
  type ChemicalStats,
  type ChemicalStatus,
  type SstChemical,
  type SstChemicalDraft,
} from "@/lib/sg-sst/quimicos/types";

export type ChemicalActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type ChemicalSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateChemicalPaths() {
  revalidatePath("/sg-sst/quimicos");
  revalidatePath("/sg-sst");
  revalidatePath("/sg-sst/alertas-sst");
}

export async function loadChemicalsMasterData(filters?: {
  status?: ChemicalStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<{
  items: SstChemical[];
  stats: ChemicalStats;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
}> {
  await requireAdmin();
  const [items, stats, farms] = await Promise.all([
    listChemicals(filters),
    getChemicalStats(),
    listSstFarms(),
  ]);
  return { items, stats, farms };
}

export async function saveChemicalAction(
  draft: SstChemicalDraft,
): Promise<ChemicalActionResult> {
  const admin = await requireAdmin();
  const error = validateChemicalDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateChemical(draft.id, draft, admin.id)
      : await createChemical(draft, admin.id);
    revalidateChemicalPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el producto químico.",
    };
  }
}

export async function deleteChemicalAction(
  id: string,
): Promise<ChemicalSimpleResult> {
  await requireAdmin();
  try {
    await deleteChemical(id);
    revalidateChemicalPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo eliminar el producto.",
    };
  }
}

export async function bulkImportChemicalsAction(input: {
  rows: ChemicalExcelImportRow[];
}): Promise<
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: ChemicalExcelImportResultRow[];
    }
  | { ok: false; error: string }
> {
  const admin = await requireAdmin();
  if (!Array.isArray(input.rows) || input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > CHEMICAL_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${CHEMICAL_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  const farms = await listSstFarms();
  const results: ChemicalExcelImportResultRow[] = [];
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const row of input.rows) {
    const farmNeedle = row.farmNameOrCode.trim().toLowerCase();
    let farmId: string | null = null;
    if (farmNeedle) {
      const farm =
        farms.find(
          (item) =>
            item.name.toLowerCase() === farmNeedle ||
            item.code.toLowerCase() === farmNeedle,
        ) ??
        farms.find(
          (item) =>
            item.name.toLowerCase().includes(farmNeedle) ||
            farmNeedle.includes(item.name.toLowerCase()),
        );
      farmId = farm?.id ?? null;
    }

    const draft = normalizeChemicalDraftForImport(
      { ...row.draft, farmId },
      row.rowNumber,
    );
    const validation = validateChemicalDraft(draft, "import");
    if (validation) {
      failed += 1;
      results.push({
        rowNumber: row.rowNumber,
        code: draft.code ?? "",
        productName: draft.productName,
        status: "error",
        message: validation,
      });
      continue;
    }

    try {
      // Anti-duplicado (mismo criterio que trabajadores/centros):
      // 1) producto + centro
      // 2) código SOLO si pertenece al mismo producto (evita mezclar filas con códigos cortos).
      const existingByProduct = await findChemicalByProductAndFarm(
        draft.productName,
        farmId,
      );
      let existing = existingByProduct;
      if (!existing && draft.code?.trim()) {
        const byCode = await findChemicalByCode(draft.code.trim());
        if (
          byCode &&
          byCode.productName.trim().toLowerCase() ===
            draft.productName.trim().toLowerCase()
        ) {
          existing = byCode;
        }
      }

      if (existing) {
        const saved = await updateChemical(
          existing.id,
          {
            ...draft,
            id: existing.id,
            code: existing.code,
          },
          admin.id,
        );
        updated += 1;
        results.push({
          rowNumber: row.rowNumber,
          code: saved.code,
          productName: saved.productName,
          status: "updated",
          message: "Actualizado (mismo producto/centro)",
          id: saved.id,
        });
      } else {
        // Si el código del Excel ya lo usa OTRO producto, generar uno nuevo.
        let createDraft = draft;
        if (draft.code?.trim()) {
          const codeOwner = await findChemicalByCode(draft.code.trim());
          if (codeOwner) {
            createDraft = { ...draft, code: undefined };
          }
        }
        const saved = await createChemical(createDraft, admin.id);
        created += 1;
        results.push({
          rowNumber: row.rowNumber,
          code: saved.code,
          productName: saved.productName,
          status: "created",
          message: "Creado",
          id: saved.id,
        });
      }
    } catch (caught) {
      failed += 1;
      results.push({
        rowNumber: row.rowNumber,
        code: draft.code ?? "",
        productName: draft.productName,
        status: "error",
        message: caught instanceof Error ? caught.message : "Error al guardar",
      });
    }
  }

  revalidateChemicalPaths();
  return {
    ok: true,
    created,
    updated,
    failed,
    results: results.filter((r) => r.status === "error").slice(0, 40),
  };
}
