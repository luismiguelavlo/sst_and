import {
  HEALTH_CASE_STATUS_LABELS,
  HEALTH_CASE_TYPE_LABELS,
  parseHealthCaseStatusLabel,
  parseHealthCaseTypeLabel,
  type SstHealthCase,
  type SstHealthCaseDraft,
} from "@/lib/sg-sst/casos-salud/types";

export const HEALTH_CASE_EXCEL_MAX_ROWS = 500;

export type HealthCaseExcelImportRow = {
  rowNumber: number;
  draft: SstHealthCaseDraft;
  workerDocumentOrCode: string;
  folio?: string;
};

export type HealthCaseExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  workerRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_caso"],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "id_trabajador",
    "worker_code",
    "identificacion",
  ],
  caseType: ["tipo_caso", "tipo", "categoria", "case_type"],
  openedAt: ["fecha_apertura", "apertura", "opened_at", "fecha"],
  status: ["estado", "status"],
  responsibleName: ["responsable", "responsible", "responsable_sst"],
  issuer: ["emisor", "entidad", "issuer", "eps_arl"],
  nextFollowUp: [
    "proximo_seguimiento",
    "próximo_seguimiento",
    "next_follow_up",
    "seguimiento",
  ],
  closedAt: ["fecha_cierre", "cierre", "closed_at"],
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

export function healthCaseRowsFromMatrix(matrix: string[][]): HealthCaseExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0]);
  if (headerMap.worker === undefined || headerMap.caseType === undefined) {
    throw new Error("Faltan columnas obligatorias: trabajador y tipo_caso.");
  }
  if (headerMap.openedAt === undefined) {
    throw new Error("Falta la columna fecha_apertura.");
  }

  const rows: HealthCaseExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    const caseType = parseHealthCaseTypeLabel(cellValue(raw, headerMap.caseType));
    const openedAt = excelDateToIso(cellValue(raw, headerMap.openedAt));
    const statusRaw = cellValue(raw, headerMap.status);
    const status = statusRaw
      ? parseHealthCaseStatusLabel(statusRaw)
      : ("abierto" as const);

    if (!workerRef && !openedAt) continue;
    if (!caseType) {
      throw new Error(`Fila ${index + 1}: tipo de caso inválido.`);
    }
    if (!status) {
      throw new Error(`Fila ${index + 1}: estado inválido.`);
    }

    const draft: SstHealthCaseDraft = {
      workerId: "",
      caseType,
      openedAt,
      status,
      responsibleName: cellValue(raw, headerMap.responsibleName),
      issuer: cellValue(raw, headerMap.issuer),
      nextFollowUp: excelDateToIso(cellValue(raw, headerMap.nextFollowUp)) || null,
      closedAt: excelDateToIso(cellValue(raw, headerMap.closedAt)) || null,
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

export function buildHealthCaseExportRows(
  cases: readonly SstHealthCase[],
): Record<string, string | number>[] {
  return cases.map((item) => ({
    folio: item.folio,
    trabajador: item.workerName,
    documento: item.workerDocument,
    id_trabajador: item.workerCode,
    empresa: item.companySnapshot,
    cargo: item.jobTitleSnapshot,
    finca: item.farmName ?? "",
    tipo_caso: HEALTH_CASE_TYPE_LABELS[item.caseType],
    fecha_apertura: item.openedAt,
    estado: HEALTH_CASE_STATUS_LABELS[item.status],
    responsable: item.responsibleName,
    emisor: item.issuer,
    proximo_seguimiento: item.nextFollowUp ?? "",
    fecha_cierre: item.closedAt ?? "",
    observaciones_administrativas: item.adminObservations,
    evidencia_url: item.evidenceUrl,
    evidencia_nombre: item.evidenceName,
  }));
}

export function buildHealthCaseTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      documento: "1088294102",
      tipo_caso: "Restricción",
      fecha_apertura: "2026-01-15",
      estado: "Abierto",
      responsable: "Dra. Claudia Ortiz (SST)",
      emisor: "SURA EPS",
      proximo_seguimiento: "2026-04-15",
      fecha_cierre: "",
      observaciones_administrativas:
        "Seguimiento administrativo. Sin datos clínicos ni CIE-10.",
      evidencia_url: "",
      evidencia_nombre: "",
    },
  ];
}
