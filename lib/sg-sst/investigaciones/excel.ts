import {
  INVESTIGATION_METHODOLOGY_LABELS,
  INVESTIGATION_STATUS_LABELS,
  parseInvestigationMethodologyLabel,
  parseInvestigationStatusLabel,
  type SstInvestigationDraft,
  type SstInvestigationView,
} from "@/lib/sg-sst/investigaciones/types";

export const INVESTIGATION_EXCEL_MAX_ROWS = 500;

export type InvestigationExcelImportRow = {
  rowNumber: number;
  draft: SstInvestigationDraft;
  accidentEventNumber: string;
  folio?: string;
};

export type InvestigationExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  accidentRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_inv"],
  accident: [
    "accidente",
    "numero_evento",
    "número_evento",
    "event_number",
    "accidente_relacionado",
    "evento",
  ],
  accidentDate: [
    "fecha_accidente",
    "accident_date",
    "fecha_evento",
  ],
  legalDueDate: [
    "fecha_limite",
    "fecha_límite",
    "legal_due_date",
    "vencimiento",
    "plazo_legal",
  ],
  responsibleName: [
    "responsable",
    "responsible_name",
    "lider",
    "líder",
  ],
  status: ["estado", "status"],
  investigationDate: [
    "fecha_investigacion",
    "fecha_investigación",
    "investigation_date",
  ],
  investigationTeam: [
    "equipo",
    "equipo_investigador",
    "investigation_team",
    "comite",
    "comité",
  ],
  methodology: [
    "metodologia",
    "metodología",
    "methodology",
    "metodo",
  ],
  causesSummary: ["causas", "causes_summary", "analisis_causas"],
  actionPlan: [
    "plan_accion",
    "plan_acción",
    "action_plan",
    "plan",
  ],
  evidenceUrl: [
    "evidencia",
    "url_evidencia",
    "evidence_url",
    "documento",
  ],
  evidenceName: ["nombre_evidencia", "archivo", "evidence_name"],
  closedAt: ["fecha_cierre", "closed_at", "cierre"],
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
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }
  return raw;
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

export function investigationRowsFromMatrix(
  matrix: string[][],
): InvestigationExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0]);
  if (headerMap.accident === undefined) {
    throw new Error("Falta la columna obligatoria: accidente / número_evento.");
  }
  if (headerMap.responsibleName === undefined) {
    throw new Error("Falta la columna obligatoria: responsable.");
  }

  const rows: InvestigationExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const accidentEventNumber = cellValue(raw, headerMap.accident);
    const responsibleName = cellValue(raw, headerMap.responsibleName);
    if (!accidentEventNumber && !responsibleName) continue;

    const statusRaw = cellValue(raw, headerMap.status);
    const methodologyRaw = cellValue(raw, headerMap.methodology);
    const status = parseInvestigationStatusLabel(statusRaw) ?? "pendiente_inicio";
    const methodology =
      parseInvestigationMethodologyLabel(methodologyRaw) ?? "ishikawa";

    const draft: SstInvestigationDraft = {
      accidentId: "",
      accidentDate: excelDateToIso(cellValue(raw, headerMap.accidentDate)) || "",
      legalDueDate: excelDateToIso(cellValue(raw, headerMap.legalDueDate)) || "",
      responsibleName,
      status,
      investigationDate:
        excelDateToIso(cellValue(raw, headerMap.investigationDate)) || null,
      investigationTeam: cellValue(raw, headerMap.investigationTeam),
      methodology,
      causesSummary: cellValue(raw, headerMap.causesSummary),
      actionPlan: cellValue(raw, headerMap.actionPlan),
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
      closedAt: excelDateToIso(cellValue(raw, headerMap.closedAt)) || null,
      observations: cellValue(raw, headerMap.observations),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      accidentEventNumber,
      folio: cellValue(raw, headerMap.folio) || undefined,
    });
  }
  return rows;
}

export function buildInvestigationExportRows(
  items: readonly SstInvestigationView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    accidente: item.accidentEventNumber,
    trabajador: item.workerName,
    documento: item.workerDocument,
    fecha_accidente: item.accidentDate,
    fecha_limite: item.legalDueDate,
    responsable: item.responsibleName,
    estado: INVESTIGATION_STATUS_LABELS[item.status],
    fecha_investigacion: item.investigationDate ?? "",
    equipo_investigador: item.investigationTeam,
    metodologia: INVESTIGATION_METHODOLOGY_LABELS[item.methodology],
    causas: item.causesSummary,
    plan_accion: item.actionPlan,
    evidencia_url: item.evidenceUrl,
    evidencia_nombre: item.evidenceName,
    fecha_cierre: item.closedAt ?? "",
    observaciones: item.observations,
    dias_restantes: item.daysRemaining ?? "",
    semaforo: item.semaphoreLabel,
    finca: item.farmName ?? "",
  }));
}

export function buildInvestigationTemplateRows(): Record<
  string,
  string | number
>[] {
  return [
    {
      folio: "",
      accidente: "AT-2026-001",
      fecha_accidente: "2026-03-01",
      fecha_limite: "2026-03-16",
      responsable: "Ing. Andrés Valencia",
      estado: "Pendiente de inicio",
      fecha_investigacion: "",
      equipo_investigador: "COPASST / SST / Supervisor",
      metodologia: "Ishikawa (espina de pescado)",
      causas: "",
      plan_accion: "",
      evidencia_url: "",
      evidencia_nombre: "",
      fecha_cierre: "",
      observaciones: "Investigación Res. 1401 — plazo 15 días.",
    },
  ];
}
