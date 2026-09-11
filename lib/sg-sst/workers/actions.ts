"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  WORKER_EXCEL_MAX_ROWS,
  type WorkerExcelImportResultRow,
  type WorkerExcelImportRow,
} from "@/lib/sg-sst/workers/excel";
import {
  createWorker,
  findWorkerByCode,
  findWorkerByDocument,
  getWorker,
  getWorkerStats,
  listActiveWorkersForSelect,
  listWorkers,
  retireWorker,
  updateWorker,
} from "@/lib/sg-sst/workers/repository";
import {
  validateWorkerDraft,
  type SstWorker,
  type SstWorkerDraft,
  type WorkerStats,
  type WorkerStatus,
} from "@/lib/sg-sst/workers/types";

export type WorkerActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type WorkerSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateWorkerPaths(id?: string) {
  revalidatePath("/sg-sst/trabajadores");
  revalidatePath("/sg-sst/trabajadores/nuevo");
  if (id) {
    revalidatePath(`/sg-sst/trabajadores/${id}`);
  }
  revalidatePath("/sg-sst");
  revalidatePath("/sg-sst/alertas-sst");
}

export async function loadWorkersMasterData(filters?: {
  status?: WorkerStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<{
  workers: SstWorker[];
  stats: WorkerStats;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
}> {
  await requireAdmin();
  const [workers, stats, farms] = await Promise.all([
    listWorkers(filters),
    getWorkerStats(),
    listSstFarms(),
  ]);
  return { workers, stats, farms };
}

export async function loadWorkerFormData(id?: string) {
  await requireAdmin();
  const [farms, worker] = await Promise.all([
    listSstFarms(),
    id ? getWorker(id) : Promise.resolve(null),
  ]);
  return { farms, worker };
}

export async function loadWorkersForSelectAction(options?: {
  activeOnly?: boolean;
}): Promise<SstWorker[]> {
  await requireAdmin();
  if (options?.activeOnly) {
    return listActiveWorkersForSelect();
  }
  return listWorkers({ status: "all" });
}

export async function saveWorkerAction(draft: SstWorkerDraft): Promise<WorkerActionResult> {
  const admin = await requireAdmin();
  const error = validateWorkerDraft(draft);
  if (error) {
    return { ok: false, error };
  }
  try {
    const saved = draft.id
      ? await updateWorker(draft.id, draft, admin.id)
      : await createWorker(draft, admin.id);
    revalidateWorkerPaths(saved.id);
    return { ok: true, id: saved.id };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "No se pudo guardar.";
    if (message.includes("unique") || message.includes("duplicate")) {
      return { ok: false, error: "Ya existe un trabajador con ese documento o ID." };
    }
    return { ok: false, error: message };
  }
}

export async function retireWorkerAction(input: {
  id: string;
  retirementDate: string;
  retirementReason: string;
}): Promise<WorkerSimpleResult> {
  const admin = await requireAdmin();
  if (!input.retirementDate) {
    return { ok: false, error: "La fecha de retiro es obligatoria." };
  }
  try {
    await retireWorker(
      input.id,
      input.retirementDate,
      input.retirementReason,
      admin.id,
    );
    revalidateWorkerPaths(input.id);
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo retirar al trabajador.",
    };
  }
}

export type BulkImportWorkersResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: WorkerExcelImportResultRow[];
    }
  | { ok: false; error: string };

export async function bulkImportWorkersAction(input: {
  rows: WorkerExcelImportRow[];
}): Promise<BulkImportWorkersResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > WORKER_EXCEL_MAX_ROWS) {
    return { ok: false, error: `Máximo ${WORKER_EXCEL_MAX_ROWS} filas por importación.` };
  }

  try {
    const farms = await listSstFarms();
    const results: WorkerExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const farmNeedle = row.farmNameOrCode.trim().toLowerCase();
      let farmId: string | null = null;
      if (farmNeedle) {
        const farm = farms.find(
          (item) =>
            item.name.toLowerCase() === farmNeedle ||
            item.code.toLowerCase() === farmNeedle ||
            item.name.toLowerCase().includes(farmNeedle),
        );
        if (!farm) {
          failed += 1;
          results.push({
            rowNumber: row.rowNumber,
            workerCode: row.draft.workerCode ?? "",
            fullName: row.draft.fullName,
            status: "error",
            message: `Centro de trabajo no encontrado: "${row.farmNameOrCode}"`,
          });
          continue;
        }
        farmId = farm.id;
      }

      const draft: SstWorkerDraft = { ...row.draft, farmId };
      const validationError = validateWorkerDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          workerCode: draft.workerCode ?? "",
          fullName: draft.fullName,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existingByDoc = await findWorkerByDocument(
          draft.documentType,
          draft.documentNumber,
        );
        const existingByCode = draft.workerCode
          ? await findWorkerByCode(draft.workerCode)
          : null;
        const existing = existingByDoc ?? existingByCode;

        if (existing) {
          const saved = await updateWorker(
            existing.id,
            { ...draft, id: existing.id, workerCode: existing.workerCode },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            workerCode: saved.workerCode,
            fullName: saved.fullName,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createWorker(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            workerCode: saved.workerCode,
            fullName: saved.fullName,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          workerCode: draft.workerCode ?? "",
          fullName: draft.fullName,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateWorkerPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
