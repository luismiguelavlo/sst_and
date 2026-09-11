"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  HEALTH_CASE_EXCEL_MAX_ROWS,
  type HealthCaseExcelImportResultRow,
  type HealthCaseExcelImportRow,
} from "@/lib/sg-sst/casos-salud/excel";
import {
  createHealthCase,
  deleteHealthCase,
  findHealthCaseByFolio,
  getHealthCaseStats,
  listHealthCases,
  updateHealthCase,
} from "@/lib/sg-sst/casos-salud/repository";
import {
  isHealthCaseStatus,
  isHealthCaseType,
  validateHealthCaseDraft,
  type HealthCaseStats,
  type SstHealthCase,
  type SstHealthCaseDraft,
} from "@/lib/sg-sst/casos-salud/types";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";

export type HealthCaseActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type HealthCaseSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateHealthCasePaths() {
  revalidatePath("/sg-sst/casos-de-salud");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadHealthCasesMasterData(): Promise<{
  cases: SstHealthCase[];
  stats: HealthCaseStats;
  farms: SstFarm[];
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [cases, stats, farms, workers] = await Promise.all([
    listHealthCases(),
    getHealthCaseStats(),
    listSstFarms(),
    listWorkers({ status: "all" }),
  ]);
  return { cases, stats, farms, workers };
}

export async function saveHealthCaseAction(
  draft: SstHealthCaseDraft,
): Promise<HealthCaseActionResult> {
  const admin = await requireAdmin();
  const error = validateHealthCaseDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateHealthCase(draft.id, draft, admin.id)
      : await createHealthCase(draft, admin.id);
    revalidateHealthCasePaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo guardar el caso de salud.",
    };
  }
}

export async function deleteHealthCaseAction(
  id: string,
): Promise<HealthCaseSimpleResult> {
  await requireAdmin();
  try {
    await deleteHealthCase(id);
    revalidateHealthCasePaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportHealthCasesResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: HealthCaseExcelImportResultRow[];
    }
  | { ok: false; error: string };

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

export async function bulkImportHealthCasesAction(input: {
  rows: HealthCaseExcelImportRow[];
}): Promise<BulkImportHealthCasesResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > HEALTH_CASE_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${HEALTH_CASE_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: HealthCaseExcelImportResultRow[] = [];
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

      const draft: SstHealthCaseDraft = {
        ...row.draft,
        workerId,
        caseType: isHealthCaseType(row.draft.caseType)
          ? row.draft.caseType
          : "restriccion",
        openedAt: row.draft.openedAt.trim() || todayIsoDate(),
        status: isHealthCaseStatus(row.draft.status)
          ? row.draft.status
          : "abierto",
        responsibleName: row.draft.responsibleName.trim() || "Sin responsable",
      };
      const validationError = validateHealthCaseDraft(draft, "import");
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
        const existing = row.folio ? await findHealthCaseByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateHealthCase(
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
          const saved = await createHealthCase(draft, admin.id);
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

    revalidateHealthCasePaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
