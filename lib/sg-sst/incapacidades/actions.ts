"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  LEAVE_EXCEL_MAX_ROWS,
  type LeaveExcelImportResultRow,
  type LeaveExcelImportRow,
} from "@/lib/sg-sst/incapacidades/excel";
import {
  createLeave,
  deleteLeave,
  findLeaveByFolio,
  getLeave,
  getLeaveStats,
  getLeaveWorkerRanking,
  listLeaveViews,
  updateLeave,
} from "@/lib/sg-sst/incapacidades/repository";
import {
  validateLeaveDraft,
  type LeaveStats,
  type LeaveWorkerRanking,
  type SstLeave,
  type SstLeaveDraft,
  type SstLeaveView,
} from "@/lib/sg-sst/incapacidades/types";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

export type LeaveActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type LeaveSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateLeavePaths() {
  revalidatePath("/sg-sst/incapacidades-y-reintegros");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadLeavesMasterData(): Promise<{
  leaves: SstLeaveView[];
  stats: LeaveStats;
  ranking: LeaveWorkerRanking[];
  farms: Awaited<ReturnType<typeof listSstFarms>>;
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [leaves, stats, ranking, farms, workers] = await Promise.all([
    listLeaveViews(),
    getLeaveStats(),
    getLeaveWorkerRanking(10),
    listSstFarms(),
    listWorkers({ status: "all" }),
  ]);
  return { leaves, stats, ranking, farms, workers };
}

export async function saveLeaveAction(draft: SstLeaveDraft): Promise<LeaveActionResult> {
  const admin = await requireAdmin();
  const error = validateLeaveDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateLeave(draft.id, draft, admin.id)
      : await createLeave(draft, admin.id);
    revalidateLeavePaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo guardar la incapacidad.",
    };
  }
}

export async function deleteLeaveAction(id: string): Promise<LeaveSimpleResult> {
  await requireAdmin();
  try {
    await deleteLeave(id);
    revalidateLeavePaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function getLeaveAction(id: string): Promise<SstLeave | null> {
  await requireAdmin();
  return getLeave(id);
}

export type BulkImportLeavesResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: LeaveExcelImportResultRow[];
    }
  | { ok: false; error: string };

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

export async function bulkImportLeavesAction(input: {
  rows: LeaveExcelImportRow[];
}): Promise<BulkImportLeavesResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > LEAVE_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${LEAVE_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: LeaveExcelImportResultRow[] = [];
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

      const draft: SstLeaveDraft = { ...row.draft, workerId };
      const validationError = validateLeaveDraft(draft);
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
        const existing = row.folio ? await findLeaveByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateLeave(
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
          const saved = await createLeave(draft, admin.id);
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

    revalidateLeavePaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
