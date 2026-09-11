"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  PESV_EXCEL_MAX_ROWS,
  type PesvDriverExcelImportRow,
  type PesvExcelImportResultRow,
  type PesvVehicleExcelImportRow,
} from "@/lib/sg-sst/pesv/excel";
import {
  createDriver,
  createPreop,
  createVehicle,
  deleteDriver,
  deletePreop,
  deleteVehicle,
  findDriverByFolio,
  findVehicleByPlate,
  getPesvStats,
  listDrivers,
  listPreops,
  listVehicles,
  updateDriver,
  updatePreop,
  updateVehicle,
} from "@/lib/sg-sst/pesv/repository";
import {
  normalizeDriverDraftForImport,
  normalizeVehicleDraftForImport,
  validateDriverDraft,
  validatePreopDraft,
  validateVehicleDraft,
  type PesvStats,
  type SstPesvDriver,
  type SstPesvDriverDraft,
  type SstPesvPreop,
  type SstPesvPreopDraft,
  type SstPesvVehicle,
  type SstPesvVehicleDraft,
} from "@/lib/sg-sst/pesv/types";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

export type PesvActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type PesvSimpleResult = { ok: true } | { ok: false; error: string };

function revalidatePesvPaths() {
  revalidatePath("/sg-sst/pesv");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadPesvMasterData(): Promise<{
  drivers: SstPesvDriver[];
  vehicles: SstPesvVehicle[];
  preops: SstPesvPreop[];
  stats: PesvStats;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [drivers, vehicles, preops, stats, farms, workers] = await Promise.all([
    listDrivers(),
    listVehicles(),
    listPreops(),
    getPesvStats(),
    listSstFarms(),
    listWorkers({ status: "all" }),
  ]);
  return { drivers, vehicles, preops, stats, farms, workers };
}

export async function saveVehicleAction(
  draft: SstPesvVehicleDraft,
): Promise<PesvActionResult> {
  const admin = await requireAdmin();
  const error = validateVehicleDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateVehicle(draft.id, draft, admin.id)
      : await createVehicle(draft, admin.id);
    revalidatePesvPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo guardar el vehículo.",
    };
  }
}

export async function deleteVehicleAction(id: string): Promise<PesvSimpleResult> {
  await requireAdmin();
  try {
    await deleteVehicle(id);
    revalidatePesvPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function saveDriverAction(
  draft: SstPesvDriverDraft,
): Promise<PesvActionResult> {
  const admin = await requireAdmin();
  const error = validateDriverDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateDriver(draft.id, draft, admin.id)
      : await createDriver(draft, admin.id);
    revalidatePesvPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el conductor.",
    };
  }
}

export async function deleteDriverAction(id: string): Promise<PesvSimpleResult> {
  await requireAdmin();
  try {
    await deleteDriver(id);
    revalidatePesvPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function savePreopAction(
  draft: SstPesvPreopDraft,
): Promise<PesvActionResult> {
  const admin = await requireAdmin();
  const error = validatePreopDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updatePreop(draft.id, draft, admin.id)
      : await createPreop(draft, admin.id);
    revalidatePesvPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el preoperacional.",
    };
  }
}

export async function deletePreopAction(id: string): Promise<PesvSimpleResult> {
  await requireAdmin();
  try {
    await deletePreop(id);
    revalidatePesvPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportPesvResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: PesvExcelImportResultRow[];
    }
  | { ok: false; error: string };

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

export async function bulkImportPesvDriversAction(input: {
  rows: PesvDriverExcelImportRow[];
}): Promise<BulkImportPesvResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > PESV_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${PESV_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: PesvExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const workerId = await resolveWorkerId(row.workerDocumentOrCode);
      if (!workerId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.workerDocumentOrCode,
          status: "error",
          message: `Trabajador no encontrado: "${row.workerDocumentOrCode}"`,
        });
        continue;
      }

      let vehicleId: string | null = row.draft.vehicleId ?? null;
      if (row.vehiclePlate) {
        const vehicle = await findVehicleByPlate(row.vehiclePlate);
        vehicleId = vehicle?.id ?? null;
      }

      const draft = normalizeDriverDraftForImport({
        ...row.draft,
        workerId,
        vehicleId,
      });
      const validationError = validateDriverDraft(draft, "import");
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.workerDocumentOrCode,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.folio ? await findDriverByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateDriver(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createDriver(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.workerDocumentOrCode,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidatePesvPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

export async function bulkImportPesvVehiclesAction(input: {
  rows: PesvVehicleExcelImportRow[];
}): Promise<BulkImportPesvResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > PESV_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${PESV_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: PesvExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      let responsibleWorkerId: string | null = null;
      if (row.responsibleDocumentOrCode) {
        // Responsable desconocido: se importa sin vincular (campo opcional).
        responsibleWorkerId = await resolveWorkerId(
          row.responsibleDocumentOrCode,
        );
      }

      const draft = normalizeVehicleDraftForImport(
        {
          ...row.draft,
          responsibleWorkerId,
        },
        row.rowNumber,
      );
      const validationError = validateVehicleDraft(draft, "import");
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: draft.plate || row.plateKey,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = await findVehicleByPlate(draft.plate);
        if (existing) {
          const saved = await updateVehicle(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.plate,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createVehicle(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.plate,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: draft.plate || row.plateKey,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidatePesvPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
