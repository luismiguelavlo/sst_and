"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  OPERATOR_EXCEL_MAX_ROWS,
  type OperatorExcelImportResultRow,
  type OperatorExcelImportRow,
} from "@/lib/sg-sst/operadores/excel";
import {
  createOperator,
  deleteOperator,
  findOperatorByFolio,
  getOperatorStats,
  listOperatorViews,
  updateOperator,
} from "@/lib/sg-sst/operadores/repository";
import {
  validateOperatorDraft,
  type OperatorStats,
  type SstOperatorDraft,
  type SstOperatorView,
} from "@/lib/sg-sst/operadores/types";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

export type OperatorActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type OperatorSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateOperatorPaths() {
  revalidatePath("/sg-sst/tractoristas-operadores");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadOperatorsMasterData(): Promise<{
  operators: SstOperatorView[];
  stats: OperatorStats;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [operators, stats, farms, workers] = await Promise.all([
    listOperatorViews(),
    getOperatorStats(),
    listSstFarms(),
    listWorkers({ status: "all" }),
  ]);
  return { operators, stats, farms, workers };
}

export async function saveOperatorAction(
  draft: SstOperatorDraft,
): Promise<OperatorActionResult> {
  const admin = await requireAdmin();
  const error = validateOperatorDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateOperator(draft.id, draft, admin.id)
      : await createOperator(draft, admin.id);
    revalidateOperatorPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el operador.",
    };
  }
}

export async function deleteOperatorAction(
  id: string,
): Promise<OperatorSimpleResult> {
  await requireAdmin();
  try {
    await deleteOperator(id);
    revalidateOperatorPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportOperatorsResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: OperatorExcelImportResultRow[];
    }
  | { ok: false; error: string };

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

function resolveFarmId(
  farmNameOrCode: string,
  farms: Awaited<ReturnType<typeof listSstFarms>>,
): string | null {
  const needle = farmNameOrCode.trim().toLowerCase();
  if (!needle) return null;
  const match = farms.find(
    (farm) =>
      farm.name.toLowerCase() === needle ||
      farm.code.toLowerCase() === needle ||
      farm.name.toLowerCase().includes(needle),
  );
  return match?.id ?? null;
}

export async function bulkImportOperatorsAction(input: {
  rows: OperatorExcelImportRow[];
}): Promise<BulkImportOperatorsResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > OPERATOR_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${OPERATOR_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: OperatorExcelImportResultRow[] = [];
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

      let farmId: string | null = null;
      if (row.farmNameOrCode.trim()) {
        farmId = resolveFarmId(row.farmNameOrCode, farms);
        if (!farmId) {
          failed += 1;
          results.push({
            rowNumber: row.rowNumber,
            folio: row.folio ?? "",
            workerRef: row.workerDocumentOrCode,
            status: "error",
            message: `Centro de trabajo no encontrado: "${row.farmNameOrCode}"`,
          });
          continue;
        }
      }

      const draft: SstOperatorDraft = {
        ...row.draft,
        workerId,
        farmId,
      };
      const validationError = validateOperatorDraft(draft);
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
        const existing = row.folio ? await findOperatorByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateOperator(
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
          const saved = await createOperator(draft, admin.id);
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

    revalidateOperatorPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
