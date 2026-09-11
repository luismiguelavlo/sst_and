"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import {
  enrichRecordAsAlert,
  countBySemaphore,
  summarizeByAlertKind,
} from "@/lib/sg-sst/alerts/engine";
import {
  RECORD_TYPE_META,
  normalizeSstRecordDraftForImport,
  validateSstRecordDraft,
  validateThresholdDraft,
  type SstAlertKind,
  type SstRecordDraft,
  type SstRecordType,
  type SstThresholdDraft,
  type SstWorkflowStatus,
} from "@/lib/sg-sst/alerts/types";
import {
  SST_EXCEL_MAX_ROWS,
  type SstExcelImportResultRow,
  type SstExcelImportRow,
} from "@/lib/sg-sst/alerts/excel";
import {
  addAlertActionNote,
  closeComplianceRecord,
  createComplianceRecord,
  deleteComplianceRecord,
  extendComplianceRecord,
  findComplianceRecordByCode,
  getAlertSettings,
  getComplianceRecord,
  listAlertActions,
  listComplianceRecords,
  listSstFarms,
  resetAlertSettings,
  saveAlertSettings,
  updateComplianceRecord,
  updateWorkflowStatus,
} from "@/lib/sg-sst/alerts/repository";
import { findWorkerByDocumentNumber, listWorkers } from "@/lib/sg-sst/workers/repository";

export type SstActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type SstSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateSstPaths(modulePath?: string, id?: string) {
  revalidatePath("/sg-sst");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst/alertas-sst/configuracion");
  if (modulePath) {
    revalidatePath(`/sg-sst/${modulePath}`);
  }
  if (id) {
    revalidatePath(`/sg-sst/registros/${id}`);
  }
}

export async function loadAlertsDashboardData(options?: {
  farmId?: string | null;
  includeClosed?: boolean;
}) {
  await requireAdmin();
  const [settings, farms, records] = await Promise.all([
    getAlertSettings(),
    listSstFarms(),
    listComplianceRecords({
      farmId: options?.farmId,
      includeClosed: options?.includeClosed ?? true,
    }),
  ]);
  const alerts = records.map((record) => enrichRecordAsAlert(record, settings));
  const openAlerts = alerts.filter(
    (alert) => alert.workflowStatus !== "closed" && alert.workflowStatus !== "cancelled",
  );
  return {
    settings,
    farms,
    alerts: openAlerts,
    allAlerts: alerts,
    counts: countBySemaphore(openAlerts),
    kindSummaries: summarizeByAlertKind(openAlerts),
    criticalCount: openAlerts.filter((alert) => alert.semaphore === "critico").length,
  };
}

export async function loadModuleRecordsData(recordTypes: readonly SstRecordType[]) {
  await requireAdmin();
  const [settings, farms, records, workers] = await Promise.all([
    getAlertSettings(),
    listSstFarms(),
    listComplianceRecords({ recordTypes, includeClosed: true }),
    listWorkers({ status: "all" }),
  ]);
  const alerts = records.map((record) => enrichRecordAsAlert(record, settings));
  return { settings, farms, records: alerts, workers };
}

export async function loadRecordDetail(id: string) {
  await requireAdmin();
  const [settings, farms, record, actions] = await Promise.all([
    getAlertSettings(),
    listSstFarms(),
    getComplianceRecord(id),
    listAlertActions(id),
  ]);
  if (!record) {
    return null;
  }
  return {
    settings,
    farms,
    record: enrichRecordAsAlert(record, settings),
    actions,
  };
}

export async function saveComplianceRecordAction(
  draft: SstRecordDraft,
): Promise<SstActionResult> {
  const admin = await requireAdmin();
  const error = validateSstRecordDraft(draft);
  if (error) {
    return { ok: false, error };
  }
  try {
    const saved = draft.id
      ? await updateComplianceRecord(draft.id, draft, admin.id)
      : await createComplianceRecord(draft, admin.id);
    revalidateSstPaths(saved.modulePath, saved.id);
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo guardar el registro.",
    };
  }
}

export type BulkImportComplianceResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: SstExcelImportResultRow[];
    }
  | { ok: false; error: string };

function resolveFarmId(
  farmNameOrCode: string,
  farms: Awaited<ReturnType<typeof listSstFarms>>,
): string | null {
  const needle = farmNameOrCode.trim().toLowerCase();
  if (!needle) {
    return null;
  }
  const match = farms.find(
    (farm) =>
      farm.name.toLowerCase() === needle ||
      farm.code.toLowerCase() === needle ||
      farm.name.toLowerCase().includes(needle),
  );
  return match?.id ?? null;
}

export async function bulkImportComplianceRecordsAction(input: {
  rows: SstExcelImportRow[];
  allowedTypes: readonly SstRecordType[];
}): Promise<BulkImportComplianceResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > SST_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${SST_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: SstExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      if (!input.allowedTypes.includes(row.draft.recordType)) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          code: row.draft.code,
          title: row.draft.title,
          status: "error",
          message: `Tipo ${row.draft.recordType} no permitido en este módulo.`,
        });
        continue;
      }

      const farmId = resolveFarmId(row.farmNameOrCode, farms);
      if (row.farmNameOrCode.trim() && !farmId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          code: row.draft.code,
          title: row.draft.title,
          status: "error",
          message: `Centro de trabajo no encontrado: "${row.farmNameOrCode}".`,
        });
        continue;
      }

      let workerId = row.draft.workerId ?? null;
      const doc = row.draft.subjectDocument?.trim();
      if (!workerId && doc) {
        const matched = await findWorkerByDocumentNumber(doc);
        if (matched) {
          workerId = matched.id;
        }
      }

      const draft = normalizeSstRecordDraftForImport(
        {
          ...row.draft,
          farmId,
          workerId,
          subjectName: row.draft.subjectName.trim(),
        },
        row.rowNumber,
      );
      const validationError = validateSstRecordDraft(draft, "import");
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          code: draft.code,
          title: draft.title,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = await findComplianceRecordByCode(draft.recordType, draft.code);
        if (existing) {
          const saved = await updateComplianceRecord(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            code: saved.code,
            title: saved.title,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createComplianceRecord(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            code: saved.code,
            title: saved.title,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          code: draft.code,
          title: draft.title,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar.",
        });
      }
    }

    revalidateSstPaths();
    for (const type of input.allowedTypes) {
      revalidatePath(`/sg-sst/${RECORD_TYPE_META[type].modulePath}`);
    }

    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

export async function deleteComplianceRecordAction(id: string): Promise<SstSimpleResult> {
  await requireAdmin();
  try {
    const current = await getComplianceRecord(id);
    await deleteComplianceRecord(id);
    revalidateSstPaths(current?.modulePath, id);
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar el registro.",
    };
  }
}

export async function closeAlertAction(
  id: string,
  closeNotes: string,
): Promise<SstSimpleResult> {
  const admin = await requireAdmin();
  if (!closeNotes.trim()) {
    return { ok: false, error: "Debes documentar el cierre." };
  }
  try {
    const updated = await closeComplianceRecord(id, closeNotes, admin.id);
    revalidateSstPaths(updated.modulePath, id);
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo cerrar la alerta.",
    };
  }
}

export async function extendAlertAction(
  id: string,
  newDueDate: string,
  message: string,
): Promise<SstSimpleResult> {
  const admin = await requireAdmin();
  if (!newDueDate) {
    return { ok: false, error: "La nueva fecha es obligatoria." };
  }
  try {
    const updated = await extendComplianceRecord(id, newDueDate, message, admin.id);
    revalidateSstPaths(updated.modulePath, id);
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo prorrogar la alerta.",
    };
  }
}

export async function addAlertNoteAction(id: string, message: string): Promise<SstSimpleResult> {
  const admin = await requireAdmin();
  if (!message.trim()) {
    return { ok: false, error: "La nota no puede estar vacía." };
  }
  try {
    await addAlertActionNote(id, message, admin.id);
    const current = await getComplianceRecord(id);
    revalidateSstPaths(current?.modulePath, id);
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo guardar la nota.",
    };
  }
}

export async function updateAlertStatusAction(
  id: string,
  status: SstWorkflowStatus,
  message = "",
): Promise<SstSimpleResult> {
  const admin = await requireAdmin();
  try {
    const updated = await updateWorkflowStatus(id, status, message, admin.id);
    revalidateSstPaths(updated.modulePath, id);
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo actualizar el estado.",
    };
  }
}

export async function saveAlertThresholdsAction(
  draft: SstThresholdDraft,
): Promise<SstSimpleResult> {
  const admin = await requireAdmin();
  const error = validateThresholdDraft(draft);
  if (error) {
    return { ok: false, error };
  }
  try {
    await saveAlertSettings(draft, admin.id);
    revalidateSstPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudieron guardar los umbrales.",
    };
  }
}

export async function resetAlertThresholdsAction(): Promise<SstSimpleResult> {
  const admin = await requireAdmin();
  try {
    await resetAlertSettings(admin.id);
    revalidateSstPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudieron restablecer los umbrales.",
    };
  }
}

export async function getCriticalAlertCountAction(): Promise<number> {
  await requireAdmin();
  try {
    const data = await loadAlertsDashboardData({ includeClosed: false });
    return data.criticalCount;
  } catch {
    return 0;
  }
}

export type AlertsExportRow = {
  folio: string;
  semaforo: string;
  tipo: string;
  titulo: string;
  sujeto: string;
  finca: string;
  vencimiento: string;
  dias: string;
  responsable: string;
  estado: string;
  alertas: string;
};

export async function buildAlertsExportRows(kind?: SstAlertKind): Promise<AlertsExportRow[]> {
  const data = await loadAlertsDashboardData({ includeClosed: false });
  const source = kind
    ? data.alerts.filter((alert) => alert.alertKinds.includes(kind))
    : data.alerts;
  return source.map((alert) => ({
    folio: alert.folio,
    semaforo: alert.semaphore,
    tipo: alert.recordType,
    titulo: alert.title,
    sujeto: alert.subjectName,
    finca: alert.farmName ?? "",
    vencimiento: alert.dueDate ?? "",
    dias: alert.daysRemaining === null ? "" : String(alert.daysRemaining),
    responsable: alert.responsibleName ?? "",
    estado: alert.workflowStatus,
    alertas: alert.alertKinds.join(", "),
  }));
}
