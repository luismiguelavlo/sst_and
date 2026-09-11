import {
  HEIGHTS_FITNESS_LABELS,
  HEIGHTS_STATUS_LABELS,
  HEIGHTS_TRAINING_LEVEL_LABELS,
  emptyHeightsDraft,
  parseFitnessLabel,
  parseTrainingLevelLabel,
  parseYesNo,
  type SstHeightsDraft,
  type SstHeightsView,
} from "@/lib/sg-sst/alturas/types";

export const HEIGHTS_EXCEL_MAX_ROWS = 500;

export type HeightsExcelImportRow = {
  rowNumber: number;
  draft: SstHeightsDraft;
  workerDocumentOrCode: string;
  folio?: string;
};

export type HeightsExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  workerRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_alt"],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "id_trabajador",
    "worker_code",
    "identificacion",
  ],
  trainingLevel: [
    "nivel",
    "formacion",
    "formación",
    "nivel_formacion",
    "training_level",
  ],
  trainingDate: ["fecha_formacion", "fecha_formación", "training_date"],
  trainingDueDate: [
    "vencimiento_formacion",
    "vencimiento_formación",
    "fecha_vencimiento",
    "training_due_date",
  ],
  retrainingDone: ["reentrenamiento", "retraining_done", "reentrenamiento_hecho"],
  certificateUrl: [
    "certificado_url",
    "url_certificado",
    "certificate_url",
    "documento",
    "pdf",
  ],
  certificateName: [
    "certificado",
    "nombre_certificado",
    "certificate_name",
    "archivo",
  ],
  medicalExamDate: ["fecha_examen", "examen_medico", "medical_exam_date"],
  medicalExamDueDate: [
    "vencimiento_examen",
    "vencimiento_medico",
    "medical_exam_due_date",
  ],
  fitnessConcept: ["concepto", "aptitud", "concepto_aptitud", "fitness_concept"],
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

export function heightsRowsFromMatrix(matrix: string[][]): HeightsExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0]);
  if (headerMap.worker === undefined && headerMap.folio === undefined) {
    throw new Error(
      "Falta al menos una columna usable: trabajador / documento o folio.",
    );
  }

  const defaults = emptyHeightsDraft();
  const rows: HeightsExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    const levelRaw = cellValue(raw, headerMap.trainingLevel);
    const trainingLevel =
      (levelRaw ? parseTrainingLevelLabel(levelRaw) : null) ??
      defaults.trainingLevel;
    if (!workerRef && !levelRaw) continue;

    const fitnessRaw = cellValue(raw, headerMap.fitnessConcept);
    const fitnessConcept =
      (fitnessRaw ? parseFitnessLabel(fitnessRaw) : null) ??
      defaults.fitnessConcept;

    const draft: SstHeightsDraft = {
      workerId: "",
      trainingLevel,
      trainingDate: excelDateToIso(cellValue(raw, headerMap.trainingDate)) || null,
      trainingDueDate:
        excelDateToIso(cellValue(raw, headerMap.trainingDueDate)) || null,
      retrainingDone: parseYesNo(cellValue(raw, headerMap.retrainingDone)),
      certificateUrl: cellValue(raw, headerMap.certificateUrl),
      certificateName: cellValue(raw, headerMap.certificateName),
      medicalExamDate:
        excelDateToIso(cellValue(raw, headerMap.medicalExamDate)) || null,
      medicalExamDueDate:
        excelDateToIso(cellValue(raw, headerMap.medicalExamDueDate)) || null,
      fitnessConcept,
      observations: cellValue(raw, headerMap.observations),
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

export function buildHeightsExportRows(
  items: readonly SstHeightsView[],
): Record<string, string | number | boolean>[] {
  return items.map((item) => ({
    folio: item.folio,
    trabajador: item.workerName,
    documento: item.workerDocument,
    id_trabajador: item.workerCode,
    empresa: item.companySnapshot,
    cargo: item.jobTitleSnapshot,
    finca: item.farmName ?? "",
    nivel_formacion: HEIGHTS_TRAINING_LEVEL_LABELS[item.trainingLevel],
    fecha_formacion: item.trainingDate ?? "",
    vencimiento_formacion: item.trainingDueDate ?? "",
    reentrenamiento: item.retrainingDone ? "Sí" : "No",
    certificado_url: item.certificateUrl,
    certificado: item.certificateName,
    fecha_examen: item.medicalExamDate ?? "",
    vencimiento_examen: item.medicalExamDueDate ?? "",
    concepto_aptitud: HEIGHTS_FITNESS_LABELS[item.fitnessConcept],
    estado: HEIGHTS_STATUS_LABELS[item.authorizationStatus],
    observaciones: item.observations,
    dias_restantes: item.daysRemaining ?? "",
    semaforo: item.semaphoreLabel,
  }));
}

export function buildHeightsTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      documento: "1088294102",
      nivel_formacion: "Trabajador autorizado (32 h)",
      fecha_formacion: "2025-06-15",
      vencimiento_formacion: "2026-06-15",
      reentrenamiento: "No",
      certificado_url: "",
      certificado: "Certificado SENA alturas.pdf",
      fecha_examen: "2025-07-01",
      vencimiento_examen: "2026-07-01",
      concepto_aptitud: "Apto",
      observaciones: "Autorizado para poda y cosecha > 2.0 m",
    },
  ];
}
