import {
  EQUIPMENT_TYPE_LABELS,
  FITNESS_CONCEPT_LABELS,
  KEY_STATUS_LABELS,
  emptyOperatorDraft,
  parseEquipmentTypeLabel,
  parseFitnessConceptLabel,
  parseYesNo,
  type SstOperatorDraft,
  type SstOperatorView,
} from "@/lib/sg-sst/operadores/types";

export const OPERATOR_EXCEL_MAX_ROWS = 500;

export type OperatorExcelImportRow = {
  rowNumber: number;
  draft: SstOperatorDraft;
  workerDocumentOrCode: string;
  farmNameOrCode: string;
  folio?: string;
};

export type OperatorExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  workerRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_ope"],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "id_trabajador",
    "worker_code",
    "identificacion",
  ],
  farm: ["finca", "sede", "farm", "farm_id"],
  equipmentName: ["equipo", "equipment", "equipment_name", "maquina", "máquina"],
  equipmentType: ["tipo_equipo", "tipo", "equipment_type"],
  trainingName: [
    "capacitacion",
    "capacitación",
    "training",
    "training_name",
    "curso",
  ],
  trainingDate: ["fecha_capacitacion", "fecha_capacitación", "training_date"],
  trainingDueDate: [
    "fecha_vencimiento",
    "vencimiento",
    "reentrenamiento",
    "training_due_date",
    "proxima_capacitacion",
  ],
  licenseCategory: ["licencia", "categoria_licencia", "categoría", "license"],
  licenseDueDate: [
    "vencimiento_licencia",
    "license_due_date",
    "fecha_vencimiento_licencia",
  ],
  occupationalExamDate: [
    "examen_ocupacional",
    "fecha_examen",
    "emo",
    "occupational_exam_date",
  ],
  fitnessConcept: ["aptitud", "concepto", "fitness", "fitness_concept"],
  inductionDone: ["induccion", "inducción", "induction", "induction_done"],
  inductionDate: ["fecha_induccion", "fecha_inducción", "induction_date"],
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

export function operatorRowsFromMatrix(matrix: string[][]): OperatorExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0]);
  if (
    headerMap.worker === undefined &&
    headerMap.equipmentName === undefined &&
    headerMap.folio === undefined
  ) {
    throw new Error(
      "Falta al menos una columna usable: trabajador, equipo o folio.",
    );
  }

  const defaults = emptyOperatorDraft();
  const rows: OperatorExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    const equipmentName = cellValue(raw, headerMap.equipmentName);
    const trainingName = cellValue(raw, headerMap.trainingName);
    if (!workerRef && !equipmentName && !trainingName) continue;

    const typeRaw = cellValue(raw, headerMap.equipmentType);
    const equipmentType =
      (typeRaw ? parseEquipmentTypeLabel(typeRaw) : null) ??
      defaults.equipmentType;

    const fitnessRaw = cellValue(raw, headerMap.fitnessConcept);
    const fitnessConcept =
      (fitnessRaw ? parseFitnessConceptLabel(fitnessRaw) : null) ??
      defaults.fitnessConcept;

    const inductionRaw = cellValue(raw, headerMap.inductionDone);
    const inductionParsed = parseYesNo(inductionRaw);

    const draft: SstOperatorDraft = {
      workerId: "",
      farmId: null,
      equipmentName,
      equipmentType,
      trainingName,
      trainingDate: excelDateToIso(cellValue(raw, headerMap.trainingDate)) || null,
      trainingDueDate:
        excelDateToIso(cellValue(raw, headerMap.trainingDueDate)) || null,
      licenseCategory: cellValue(raw, headerMap.licenseCategory),
      licenseDueDate:
        excelDateToIso(cellValue(raw, headerMap.licenseDueDate)) || null,
      occupationalExamDate:
        excelDateToIso(cellValue(raw, headerMap.occupationalExamDate)) || null,
      fitnessConcept,
      inductionDone: inductionParsed ?? false,
      inductionDate:
        excelDateToIso(cellValue(raw, headerMap.inductionDate)) || null,
      observations: cellValue(raw, headerMap.observations),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      workerDocumentOrCode: workerRef,
      farmNameOrCode: cellValue(raw, headerMap.farm),
      folio: cellValue(raw, headerMap.folio) || undefined,
    });
  }
  return rows;
}

export function buildOperatorExportRows(
  items: readonly SstOperatorView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    trabajador: item.workerName,
    documento: item.workerDocument,
    id_trabajador: item.workerCode,
    empresa: item.companySnapshot,
    cargo: item.jobTitleSnapshot,
    finca: item.farmName ?? "",
    equipo: item.equipmentName,
    tipo_equipo: EQUIPMENT_TYPE_LABELS[item.equipmentType],
    capacitacion: item.trainingName,
    fecha_capacitacion: item.trainingDate ?? "",
    fecha_vencimiento: item.trainingDueDate ?? "",
    licencia: item.licenseCategory,
    vencimiento_licencia: item.licenseDueDate ?? "",
    examen_ocupacional: item.occupationalExamDate ?? "",
    aptitud: FITNESS_CONCEPT_LABELS[item.fitnessConcept],
    induccion: item.inductionDone ? "Sí" : "No",
    fecha_induccion: item.inductionDate ?? "",
    estado: KEY_STATUS_LABELS[item.keyStatus],
    motivos_bloqueo: item.blockReasons,
    observaciones: item.observations,
  }));
}

export function buildOperatorTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      documento: "1088294102",
      finca: "Finca La Esperanza",
      equipo: "John Deere 5075E",
      tipo_equipo: "Tractor",
      capacitacion: "Operación de tractor agrícola con TDF",
      fecha_capacitacion: "2025-06-15",
      fecha_vencimiento: "2026-06-15",
      licencia: "",
      vencimiento_licencia: "",
      examen_ocupacional: "2025-05-20",
      aptitud: "Apto",
      induccion: "Sí",
      fecha_induccion: "2025-06-01",
      observaciones: "",
    },
  ];
}
