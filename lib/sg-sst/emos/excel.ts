import {
  EMO_CONCEPT_LABELS,
  EMO_EXAM_TYPE_LABELS,
  isEmoPeriodicity,
  parseConceptLabel,
  parseExamTypeLabel,
  type EmoPeriodicity,
  type SstEmoDraft,
  type SstEmoView,
} from "@/lib/sg-sst/emos/types";

export const EMO_EXCEL_MAX_ROWS = 500;

export type EmoExcelImportRow = {
  rowNumber: number;
  draft: SstEmoDraft;
  workerDocumentOrCode: string;
  folio?: string;
};

export type EmoExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  workerRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_emo"],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "id_trabajador",
    "worker_code",
    "identificacion",
  ],
  examType: ["tipo_examen", "tipo", "tipo_emo", "exam_type"],
  examDate: ["fecha_examen", "fecha", "exam_date", "fecha_valoracion"],
  nextDueDate: ["proxima_fecha", "próxima_fecha", "vencimiento", "next_due", "proxima"],
  periodicity: ["periodicidad", "meses", "periodicity_months"],
  ips: ["ips", "entidad", "prestador"],
  concept: ["concepto", "aptitud", "concepto_aptitud"],
  adminObservations: [
    "observaciones",
    "observaciones_administrativas",
    "recomendaciones",
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

function mapHeaders(headerRow: string[]): Partial<Record<keyof typeof HEADER_ALIASES, number>> {
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

function parseYesNoNull(raw: string): boolean | null {
  const v = raw.trim().toLowerCase();
  if (!v) return null;
  if (["si", "sí", "yes", "true", "1", "apto"].includes(v)) return true;
  if (["no", "false", "0", "no apto"].includes(v)) return false;
  return null;
}

export function emoRowsFromMatrix(matrix: string[][]): EmoExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0]);
  if (headerMap.worker === undefined || headerMap.examType === undefined) {
    throw new Error("Faltan columnas obligatorias: trabajador y tipo_examen.");
  }
  if (headerMap.examDate === undefined || headerMap.concept === undefined) {
    throw new Error("Faltan columnas obligatorias: fecha_examen y concepto.");
  }
  if (headerMap.ips === undefined) {
    throw new Error("Falta la columna IPS.");
  }

  const rows: EmoExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    const examType = parseExamTypeLabel(cellValue(raw, headerMap.examType));
    const concept = parseConceptLabel(cellValue(raw, headerMap.concept));
    const examDate = excelDateToIso(cellValue(raw, headerMap.examDate));
    const ips = cellValue(raw, headerMap.ips);

    if (!workerRef && !examDate && !ips) continue;
    if (!examType) {
      throw new Error(`Fila ${index + 1}: tipo de examen inválido.`);
    }
    if (!concept) {
      throw new Error(`Fila ${index + 1}: concepto inválido.`);
    }

    const periodicityRaw = Number(cellValue(raw, headerMap.periodicity));
    const periodicityMonths: EmoPeriodicity | null = isEmoPeriodicity(periodicityRaw)
      ? periodicityRaw
      : null;

    const draft: SstEmoDraft = {
      workerId: "",
      examType,
      examDate,
      nextDueDate: excelDateToIso(cellValue(raw, headerMap.nextDueDate)) || null,
      periodicityMonths,
      ips,
      concept,
      adminObservations: cellValue(raw, headerMap.adminObservations),
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
      heightsCleared: parseYesNoNull(""),
      pesvCleared: null,
      chemicalsCleared: null,
      notifySupervisor: false,
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

export function buildEmoExportRows(
  emos: readonly SstEmoView[],
): Record<string, string | number>[] {
  return emos.map((emo) => ({
    folio: emo.folio,
    trabajador: emo.workerName,
    documento: emo.workerDocument,
    id_trabajador: emo.workerCode,
    empresa: emo.companySnapshot,
    cargo: emo.jobTitleSnapshot,
    finca: emo.farmName ?? "",
    tipo_examen: EMO_EXAM_TYPE_LABELS[emo.examType],
    fecha_examen: emo.examDate,
    proxima_fecha: emo.nextDueDate ?? "",
    periodicidad: emo.periodicityMonths ?? "",
    ips: emo.ips,
    concepto: EMO_CONCEPT_LABELS[emo.concept],
    observaciones_administrativas: emo.adminObservations,
    evidencia_url: emo.evidenceUrl,
    evidencia_nombre: emo.evidenceName,
    semaforo: emo.semaphoreLabel,
    dias_restantes: emo.daysRemaining ?? "",
  }));
}

export function buildEmoTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      documento: "1088294102",
      tipo_examen: "Periódico",
      fecha_examen: "2026-01-15",
      proxima_fecha: "2027-01-15",
      periodicidad: 12,
      ips: "IPS Salud del Eje",
      concepto: "Apto",
      observaciones_administrativas: "Sin restricciones laborales administrativas.",
      evidencia_url: "",
      evidencia_nombre: "",
    },
  ];
}
