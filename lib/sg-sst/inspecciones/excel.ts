import {
  INSPECTION_STATUS_LABELS,
  INSPECTION_TYPE_LABELS,
  INSPECTION_TYPES,
  parseInspectionStatusLabel,
  parseInspectionTypeLabel,
  type InspectionManualStatus,
  type SstInspectionDraft,
  type SstInspectionView,
} from "@/lib/sg-sst/inspecciones/types";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const INSPECTION_EXCEL_MAX_ROWS = 500;

export type InspectionExcelImportRow = {
  rowNumber: number;
  draft: SstInspectionDraft;
  farmName?: string;
  folio?: string;
};

export type InspectionExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  farmRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_ins"],
  type: ["tipo", "tipo_inspeccion", "inspection_type", "categoria"],
  responsibleName: ["responsable", "responsable_tecnico", "responsible_name", "inspector"],
  farm: ["finca", "farm", "farm_name", "predio"],
  workCenter: ["centro_trabajo", "centro", "work_center", "area", "área"],
  scheduledDate: [
    "fecha_programada",
    "programada",
    "scheduled_date",
    "fecha_programacion",
  ],
  performedDate: ["fecha_realizada", "realizada", "performed_date", "ejecucion"],
  status: ["estado", "status"],
  findingsSummary: ["hallazgos", "resumen_hallazgos", "findings_summary", "novedades"],
  evidenceUrl: ["evidencia", "url_evidencia", "evidence_url", "documento"],
  evidenceName: ["nombre_evidencia", "archivo", "evidence_name"],
  generatedAction: ["accion", "acción", "accion_generada", "generated_action", "plan"],
  nextInspectionDate: [
    "proxima_inspeccion",
    "próxima_inspeccion",
    "next_inspection_date",
    "proxima",
  ],
  observations: ["observaciones", "notas", "observations"],
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

function toManualStatus(raw: string): InspectionManualStatus {
  return parseInspectionStatusLabel(raw) ?? "programada";
}

export function inspectionRowsFromMatrix(
  matrix: string[][],
): InspectionExcelImportRow[] {
  if (matrix.length < 2) return [];
  const headerMap = mapHeaders(matrix[0]);
  // Identidad usable: al menos una columna de inspección.
  if (
    headerMap.type === undefined &&
    headerMap.responsibleName === undefined &&
    headerMap.scheduledDate === undefined &&
    headerMap.folio === undefined
  ) {
    throw new Error(
      "El Excel debe incluir al menos una columna usable (tipo, responsable, fecha_programada o folio).",
    );
  }

  const rows: InspectionExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const typeRaw = cellValue(raw, headerMap.type);
    const responsibleRaw = cellValue(raw, headerMap.responsibleName);
    const scheduledRaw = cellValue(raw, headerMap.scheduledDate);
    const folio = cellValue(raw, headerMap.folio);

    if (!typeRaw && !responsibleRaw && !scheduledRaw && !folio) continue;

    const responsibleName = responsibleRaw || "Sin responsable";
    const scheduledDate = excelDateToIso(scheduledRaw);
    const inspectionType =
      parseInspectionTypeLabel(typeRaw) ?? INSPECTION_TYPES[0];

    const performedRaw = cellValue(raw, headerMap.performedDate);
    const nextRaw = cellValue(raw, headerMap.nextInspectionDate);

    const draft: SstInspectionDraft = {
      inspectionType,
      responsibleName,
      farmId: null,
      workCenter: cellValue(raw, headerMap.workCenter),
      scheduledDate,
      performedDate: performedRaw ? excelDateToIso(performedRaw) : null,
      status: toManualStatus(cellValue(raw, headerMap.status)),
      findingsSummary: cellValue(raw, headerMap.findingsSummary),
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
      generatedAction: cellValue(raw, headerMap.generatedAction),
      nextInspectionDate: nextRaw ? excelDateToIso(nextRaw) : null,
      observations: cellValue(raw, headerMap.observations),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      farmName: cellValue(raw, headerMap.farm) || undefined,
      folio: folio || undefined,
    });
  }
  return rows;
}

export function buildInspectionExportRows(
  items: readonly SstInspectionView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    tipo: INSPECTION_TYPE_LABELS[item.inspectionType],
    responsable: item.responsibleName,
    finca: item.farmName ?? "",
    centro_trabajo: item.workCenter,
    fecha_programada: item.scheduledDate,
    fecha_realizada: item.performedDate ?? "",
    estado: INSPECTION_STATUS_LABELS[item.effectiveStatus],
    hallazgos: item.findingsSummary,
    hallazgos_count: item.findingsCount,
    evidencia_url: item.evidenceUrl,
    evidencia_nombre: item.evidenceName,
    accion_generada: item.generatedAction,
    proxima_inspeccion: item.nextInspectionDate ?? "",
    observaciones: item.observations,
    dias_restantes: item.daysRemaining ?? "",
  }));
}

export function buildInspectionTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      tipo: "Extintores",
      responsable: "Ing. Andrés Valencia",
      finca: "Finca San José",
      centro_trabajo: "Isla combustibles",
      fecha_programada: "2026-03-20",
      fecha_realizada: "",
      estado: "Programada",
      hallazgos: "",
      evidencia_url: "",
      evidencia_nombre: "",
      accion_generada: "",
      proxima_inspeccion: "",
      observaciones: "Inspección planeada SG-SST.",
    },
  ];
}
