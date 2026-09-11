import {
  LEAVE_ORIGIN_LABELS,
  LEAVE_STATUS_LABELS,
  REINTEGRATION_STATUS_LABELS,
  computeDaysOrdered,
  parseLeaveOriginLabel,
  parseLeaveStatusLabel,
  parseReintegrationStatusLabel,
  parseYesNo,
  type SstLeaveDraft,
  type SstLeaveView,
} from "@/lib/sg-sst/incapacidades/types";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const LEAVE_EXCEL_MAX_ROWS = 500;

export type LeaveExcelImportRow = {
  rowNumber: number;
  draft: SstLeaveDraft;
  workerDocumentOrCode: string;
  folio?: string;
};

export type LeaveExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  workerRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_incapacidad"],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "id_trabajador",
    "worker_code",
    "identificacion",
  ],
  startDate: ["fecha_inicio", "inicio", "start_date", "desde"],
  endDate: ["fecha_final", "fecha_fin", "fin", "end_date", "hasta"],
  daysOrdered: ["dias", "días", "dias_ordenados", "days_ordered", "numero_dias"],
  origin: ["origen", "origin", "tipo_origen"],
  isExtension: ["prorroga", "prórroga", "is_extension", "extension"],
  accumulatedDays: ["dias_acumulados", "días_acumulados", "accumulated_days", "acumulado"],
  status: ["estado", "status"],
  sstFollowUp: ["seguimiento_sst", "seguimiento", "sst_follow_up"],
  reintegrationRequired: [
    "reintegro_requerido",
    "reintegro",
    "reintegration_required",
  ],
  reintegrationDate: ["fecha_reintegro", "reintegration_date"],
  reintegrationStatus: ["estado_reintegro", "reintegration_status"],
  cie10: ["cie10", "cie_10", "diagnostico_cie"],
  diagnosisLabel: ["diagnostico", "diagnosis_label", "diagnóstico"],
  issuer: ["emisor", "ips", "eps", "arl", "issuer"],
  adminObservations: [
    "observaciones",
    "observaciones_administrativas",
    "notas",
  ],
  evidenceUrl: ["documento", "evidencia", "url_evidencia", "evidence_url", "pdf"],
  evidenceName: ["nombre_evidencia", "archivo", "evidence_name"],
};

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function cellValue(row: string[], index: number | undefined): string {
  if (index === undefined) return "";
  return (row[index] ?? "").toString().trim();
}

function excelDateToIso(raw: string): string {
  if (!raw) return todayIsoDate();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }
  return todayIsoDate();
}

function mapHeaders(
  headerRow: string[],
): Partial<Record<keyof typeof HEADER_ALIASES, number>> {
  const map: Partial<Record<keyof typeof HEADER_ALIASES, number>> = {};
  headerRow.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    for (const [key, aliases] of Object.entries(HEADER_ALIASES) as [
      keyof typeof HEADER_ALIASES,
      readonly string[],
    ][]) {
      if (aliases.some((alias) => normalizeHeader(alias) === normalized)) {
        map[key] = index;
      }
    }
  });
  return map;
}

export function leaveRowsFromMatrix(matrix: string[][]): LeaveExcelImportRow[] {
  if (matrix.length < 2) return [];
  const headerMap = mapHeaders(matrix[0]);
  if (headerMap.worker === undefined) {
    throw new Error(
      "El Excel debe incluir al menos la columna trabajador / documento.",
    );
  }

  const rows: LeaveExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    if (!workerRef) continue;

    let startDate = excelDateToIso(cellValue(raw, headerMap.startDate));
    let endDate = excelDateToIso(cellValue(raw, headerMap.endDate));
    if (endDate < startDate) endDate = startDate;
    const origin =
      parseLeaveOriginLabel(cellValue(raw, headerMap.origin)) ?? "comun";

    const daysRaw = Number(cellValue(raw, headerMap.daysOrdered));
    const daysOrdered =
      Number.isFinite(daysRaw) && daysRaw > 0
        ? daysRaw
        : computeDaysOrdered(startDate, endDate);

    const accumRaw = Number(cellValue(raw, headerMap.accumulatedDays));
    const statusRaw = cellValue(raw, headerMap.status);
    const reiStatusRaw = cellValue(raw, headerMap.reintegrationStatus);
    const reiRequiredRaw = cellValue(raw, headerMap.reintegrationRequired);
    const reintegrationDateRaw = cellValue(raw, headerMap.reintegrationDate);

    const draft: SstLeaveDraft = {
      workerId: "",
      startDate,
      endDate,
      daysOrdered,
      origin,
      isExtension: parseYesNo(cellValue(raw, headerMap.isExtension)),
      accumulatedDays:
        Number.isFinite(accumRaw) && accumRaw > 0 ? accumRaw : daysOrdered,
      status: statusRaw ? (parseLeaveStatusLabel(statusRaw) ?? undefined) : undefined,
      sstFollowUp: cellValue(raw, headerMap.sstFollowUp),
      reintegrationRequired: reiRequiredRaw
        ? parseYesNo(reiRequiredRaw)
        : null,
      reintegrationDate: reintegrationDateRaw
        ? excelDateToIso(reintegrationDateRaw)
        : null,
      reintegrationStatus: reiStatusRaw
        ? (parseReintegrationStatusLabel(reiStatusRaw) ?? "no_aplica")
        : "no_aplica",
      cie10: cellValue(raw, headerMap.cie10),
      diagnosisLabel: cellValue(raw, headerMap.diagnosisLabel),
      issuer: cellValue(raw, headerMap.issuer),
      adminObservations: cellValue(raw, headerMap.adminObservations),
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      workerDocumentOrCode: workerRef,
      folio: cellValue(raw, headerMap.folio) || undefined,
    });
  }
  return rows;
}

export function buildLeaveExportRows(
  leaves: readonly SstLeaveView[],
): Record<string, string | number | boolean>[] {
  return leaves.map((leave) => ({
    folio: leave.folio,
    trabajador: leave.workerName,
    documento: leave.workerDocument,
    id_trabajador: leave.workerCode,
    empresa: leave.companySnapshot,
    cargo: leave.jobTitleSnapshot,
    finca: leave.farmName ?? "",
    fecha_inicio: leave.startDate,
    fecha_final: leave.endDate,
    dias: leave.daysOrdered,
    origen: LEAVE_ORIGIN_LABELS[leave.origin],
    prorroga: leave.isExtension ? "Sí" : "No",
    dias_acumulados: leave.accumulatedDays,
    estado: LEAVE_STATUS_LABELS[leave.status],
    seguimiento_sst: leave.sstFollowUp,
    reintegro_requerido: leave.reintegrationRequired ? "Sí" : "No",
    fecha_reintegro: leave.reintegrationDate ?? "",
    estado_reintegro: REINTEGRATION_STATUS_LABELS[leave.reintegrationStatus],
    cie10: leave.cie10,
    diagnostico: leave.diagnosisLabel,
    emisor: leave.issuer,
    observaciones_administrativas: leave.adminObservations,
    evidencia_url: leave.evidenceUrl,
    evidencia_nombre: leave.evidenceName,
    dias_restantes: leave.daysRemaining,
  }));
}

export function buildLeaveTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      documento: "1088294102",
      fecha_inicio: "2026-09-01",
      fecha_final: "2026-09-10",
      dias: 10,
      origen: "Común (EPS)",
      prorroga: "No",
      dias_acumulados: 10,
      estado: "Activa",
      seguimiento_sst: "Contacto telefónico programado",
      reintegro_requerido: "No",
      fecha_reintegro: "",
      estado_reintegro: "No aplica",
      cie10: "M54.5",
      diagnostico: "Lumbago no especificado",
      emisor: "EPS Sura",
      observaciones_administrativas: "",
      evidencia_url: "",
      evidencia_nombre: "",
    },
  ];
}
