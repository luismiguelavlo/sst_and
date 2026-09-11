"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import {
  INVESTIGATION_EXCEL_MAX_ROWS,
  type InvestigationExcelImportResultRow,
  type InvestigationExcelImportRow,
} from "@/lib/sg-sst/investigaciones/excel";
import {
  createInvestigation,
  deleteInvestigation,
  findAccidentByEventNumber,
  findInvestigationByFolio,
  getInvestigationStats,
  listAccidentOptions,
  listInvestigationViews,
  updateInvestigation,
} from "@/lib/sg-sst/investigaciones/repository";
import {
  validateInvestigationDraft,
  type AccidentOption,
  type InvestigationStats,
  type SstInvestigationDraft,
  type SstInvestigationView,
} from "@/lib/sg-sst/investigaciones/types";

export type InvestigationActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type InvestigationSimpleResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateInvestigationPaths() {
  revalidatePath("/sg-sst/investigaciones");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadInvestigationsMasterData(): Promise<{
  investigations: SstInvestigationView[];
  stats: InvestigationStats;
  accidentOptions: AccidentOption[];
}> {
  await requireAdmin();
  const [investigations, stats, accidentOptions] = await Promise.all([
    listInvestigationViews(),
    getInvestigationStats(),
    listAccidentOptions(),
  ]);
  return { investigations, stats, accidentOptions };
}

export async function saveInvestigationAction(
  draft: SstInvestigationDraft,
): Promise<InvestigationActionResult> {
  const admin = await requireAdmin();
  const error = validateInvestigationDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateInvestigation(draft.id, draft, admin.id)
      : await createInvestigation(draft, admin.id);
    revalidateInvestigationPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar la investigación.",
    };
  }
}

export async function deleteInvestigationAction(
  id: string,
): Promise<InvestigationSimpleResult> {
  await requireAdmin();
  try {
    await deleteInvestigation(id);
    revalidateInvestigationPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportInvestigationsResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: InvestigationExcelImportResultRow[];
    }
  | { ok: false; error: string };

export async function bulkImportInvestigationsAction(input: {
  rows: InvestigationExcelImportRow[];
}): Promise<BulkImportInvestigationsResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > INVESTIGATION_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${INVESTIGATION_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: InvestigationExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const accident = await findAccidentByEventNumber(row.accidentEventNumber);
      if (!accident) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          folio: row.folio ?? "",
          accidentRef: row.accidentEventNumber,
          status: "error",
          message: `Accidente no encontrado: "${row.accidentEventNumber}"`,
        });
        continue;
      }

      const draft: SstInvestigationDraft = {
        ...row.draft,
        accidentId: accident.id,
        accidentDate: row.draft.accidentDate?.trim() || accident.event_date,
      };
      const validationError = validateInvestigationDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          folio: row.folio ?? "",
          accidentRef: row.accidentEventNumber,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.folio
          ? await findInvestigationByFolio(row.folio)
          : null;
        if (existing) {
          const saved = await updateInvestigation(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            folio: saved.folio,
            accidentRef: row.accidentEventNumber,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createInvestigation(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            folio: saved.folio,
            accidentRef: row.accidentEventNumber,
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
          accidentRef: row.accidentEventNumber,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateInvestigationPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo importar el Excel.",
    };
  }
}
