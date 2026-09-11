"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  EMERGENCIAS_EXCEL_MAX_ROWS,
  type BrigadeExcelImportRow,
  type DrillExcelImportRow,
  type EmergenciasExcelImportResultRow,
  type EquipmentExcelImportRow,
} from "@/lib/sg-sst/emergencias/excel";
import {
  createBrigadeMember,
  createEmergencyDrill,
  createEmergencyEquipment,
  deleteBrigadeMember,
  deleteEmergencyDrill,
  deleteEmergencyEquipment,
  findBrigadeByFolio,
  findDrillByFolio,
  findEquipmentByCode,
  getEmergenciasStats,
  listBrigadeViews,
  listEmergencyDrills,
  listEquipmentViews,
  updateBrigadeMember,
  updateEmergencyDrill,
  updateEmergencyEquipment,
} from "@/lib/sg-sst/emergencias/repository";
import {
  validateBrigadeDraft,
  validateDrillDraft,
  validateEquipmentDraft,
  type EmergenciasStats,
  type SstBrigadeMemberDraft,
  type SstBrigadeMemberView,
  type SstEmergencyDrill,
  type SstEmergencyDrillDraft,
  type SstEmergencyEquipmentDraft,
  type SstEmergencyEquipmentView,
} from "@/lib/sg-sst/emergencias/types";
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listActiveWorkersForSelect,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

export type EmergenciasActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type EmergenciasSimpleResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateEmergenciasPaths() {
  revalidatePath("/sg-sst/emergencias");
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

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

export async function loadEmergenciasMasterData(): Promise<{
  brigade: SstBrigadeMemberView[];
  equipment: SstEmergencyEquipmentView[];
  drills: SstEmergencyDrill[];
  stats: EmergenciasStats;
  farms: SstFarm[];
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [brigade, equipment, drills, stats, farms, workers] = await Promise.all([
    listBrigadeViews(),
    listEquipmentViews(),
    listEmergencyDrills(),
    getEmergenciasStats(),
    listSstFarms(),
    listActiveWorkersForSelect(),
  ]);
  return { brigade, equipment, drills, stats, farms, workers };
}

export async function saveBrigadeAction(
  draft: SstBrigadeMemberDraft,
): Promise<EmergenciasActionResult> {
  const admin = await requireAdmin();
  const error = validateBrigadeDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateBrigadeMember(draft.id, draft, admin.id)
      : await createBrigadeMember(draft, admin.id);
    revalidateEmergenciasPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el brigadista.",
    };
  }
}

export async function deleteBrigadeAction(
  id: string,
): Promise<EmergenciasSimpleResult> {
  await requireAdmin();
  try {
    await deleteBrigadeMember(id);
    revalidateEmergenciasPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function saveEquipmentAction(
  draft: SstEmergencyEquipmentDraft,
): Promise<EmergenciasActionResult> {
  const admin = await requireAdmin();
  const error = validateEquipmentDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateEmergencyEquipment(draft.id, draft, admin.id)
      : await createEmergencyEquipment(draft, admin.id);
    revalidateEmergenciasPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el equipo.",
    };
  }
}

export async function deleteEquipmentAction(
  id: string,
): Promise<EmergenciasSimpleResult> {
  await requireAdmin();
  try {
    await deleteEmergencyEquipment(id);
    revalidateEmergenciasPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function saveDrillAction(
  draft: SstEmergencyDrillDraft,
): Promise<EmergenciasActionResult> {
  const admin = await requireAdmin();
  const error = validateDrillDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateEmergencyDrill(draft.id, draft, admin.id)
      : await createEmergencyDrill(draft, admin.id);
    revalidateEmergenciasPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el simulacro.",
    };
  }
}

export async function deleteDrillAction(
  id: string,
): Promise<EmergenciasSimpleResult> {
  await requireAdmin();
  try {
    await deleteEmergencyDrill(id);
    revalidateEmergenciasPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportEmergenciasResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: EmergenciasExcelImportResultRow[];
    }
  | { ok: false; error: string };

export async function bulkImportBrigadeAction(input: {
  rows: BrigadeExcelImportRow[];
}): Promise<BulkImportEmergenciasResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > EMERGENCIAS_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${EMERGENCIAS_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: EmergenciasExcelImportResultRow[] = [];
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
          sheet: "brigada",
          status: "error",
          message: `Trabajador no encontrado: "${row.workerDocumentOrCode}"`,
        });
        continue;
      }

      const farmId = resolveFarmId(farms, row.farmName);
      if (row.farmName?.trim() && !farmId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.workerDocumentOrCode,
          sheet: "brigada",
          status: "error",
          message: `Centro de trabajo no encontrado: "${row.farmName}"`,
        });
        continue;
      }

      const draft: SstBrigadeMemberDraft = {
        ...row.draft,
        workerId,
        farmId,
      };
      const validationError = validateBrigadeDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.workerDocumentOrCode,
          sheet: "brigada",
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.folio ? await findBrigadeByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateBrigadeMember(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            sheet: "brigada",
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createBrigadeMember(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            sheet: "brigada",
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
          sheet: "brigada",
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateEmergenciasPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

export async function bulkImportEquipmentAction(input: {
  rows: EquipmentExcelImportRow[];
}): Promise<BulkImportEmergenciasResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > EMERGENCIAS_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${EMERGENCIAS_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: EmergenciasExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const farmId = resolveFarmId(farms, row.farmName);
      if (row.farmName?.trim() && !farmId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.code ?? row.draft.elementName,
          sheet: "equipos",
          status: "error",
          message: `Centro de trabajo no encontrado: "${row.farmName}"`,
        });
        continue;
      }

      const draft: SstEmergencyEquipmentDraft = {
        ...row.draft,
        farmId,
        code: row.code || row.draft.code,
      };
      const validationError = validateEquipmentDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: draft.code ?? draft.elementName,
          sheet: "equipos",
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = draft.code?.trim()
          ? await findEquipmentByCode(draft.code.trim())
          : null;
        if (existing) {
          const saved = await updateEmergencyEquipment(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.code,
            sheet: "equipos",
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createEmergencyEquipment(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.code,
            sheet: "equipos",
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: draft.code ?? draft.elementName,
          sheet: "equipos",
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateEmergenciasPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

export async function bulkImportDrillsAction(input: {
  rows: DrillExcelImportRow[];
}): Promise<BulkImportEmergenciasResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > EMERGENCIAS_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${EMERGENCIAS_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: EmergenciasExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const farmId = resolveFarmId(farms, row.farmName);
      if (row.farmName?.trim() && !farmId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.draft.place,
          sheet: "simulacros",
          status: "error",
          message: `Centro de trabajo no encontrado: "${row.farmName}"`,
        });
        continue;
      }

      const draft: SstEmergencyDrillDraft = { ...row.draft, farmId };
      const validationError = validateDrillDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? draft.place,
          sheet: "simulacros",
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.folio ? await findDrillByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateEmergencyDrill(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            sheet: "simulacros",
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createEmergencyDrill(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            sheet: "simulacros",
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? draft.place,
          sheet: "simulacros",
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateEmergenciasPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
