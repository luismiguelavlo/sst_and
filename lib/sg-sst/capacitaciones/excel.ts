import {
  TRAINING_MODALITY_LABELS,
  TRAINING_STATUS_LABELS,
  TRAINING_TOPIC_LABELS,
  parseModalityLabel,
  parseStatusLabel,
  parseTopicLabel,
  type SstTrainingDraft,
  type SstTrainingView,
} from "@/lib/sg-sst/capacitaciones/types";

export const TRAINING_EXCEL_MAX_ROWS = 500;

export type TrainingExcelImportRow = {
  rowNumber: number;
  draft: SstTrainingDraft;
  workerDocumentOrCode: string;
  folio?: string;
};

export type TrainingExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  workerRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_cap", "id_capacitacion"],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "id_trabajador",
    "worker_code",
    "identificacion",
  ],
  topic: ["tema", "topic", "modulo", "módulo", "tema_capacitacion"],
  trainingDate: ["fecha", "fecha_capacitacion", "fecha_capacitación", "training_date"],
  hours: ["horas", "hhc", "hours"],
  instructor: ["instructor", "entidad", "facilitador"],
  modality: ["modalidad", "modality"],
  evidenceUrl: ["evidencia_url", "url_evidencia", "evidence_url", "asistencia"],
  evidenceName: ["evidencia", "nombre_evidencia", "evidence_name", "archivo_evidencia"],
  certificateUrl: ["certificado_url", "url_certificado", "certificate_url"],
  certificateName: [
    "certificado",
    "nombre_certificado",
    "certificate_name",
    "archivo_certificado",
  ],
  nextTrainingDate: [
    "proxima_capacitacion",
    "próxima_capacitacion",
    "proxima",
    "next_training_date",
    "vencimiento",
  ],
  status: ["estado", "status"],
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

export function trainingRowsFromMatrix(matrix: string[][]): TrainingExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0]);
  if (headerMap.worker === undefined) {
    throw new Error("Falta la columna obligatoria: trabajador / documento.");
  }
  if (headerMap.topic === undefined) {
    throw new Error("Falta la columna obligatoria: tema.");
  }
  if (headerMap.trainingDate === undefined) {
    throw new Error("Falta la columna obligatoria: fecha.");
  }

  const rows: TrainingExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    const topic = parseTopicLabel(cellValue(raw, headerMap.topic));
    const trainingDate = excelDateToIso(cellValue(raw, headerMap.trainingDate));

    if (!workerRef && !topic && !trainingDate) continue;
    if (!topic) {
      throw new Error(`Fila ${index + 1}: tema inválido.`);
    }
    if (!trainingDate) {
      throw new Error(`Fila ${index + 1}: fecha de capacitación inválida.`);
    }

    const modalityRaw = cellValue(raw, headerMap.modality);
    const modality = modalityRaw ? parseModalityLabel(modalityRaw) : "presencial";
    if (!modality) {
      throw new Error(`Fila ${index + 1}: modalidad inválida.`);
    }

    const statusRaw = cellValue(raw, headerMap.status);
    const status = statusRaw ? parseStatusLabel(statusRaw) : null;
    if (statusRaw && !status) {
      throw new Error(`Fila ${index + 1}: estado inválido.`);
    }

    const hoursRaw = cellValue(raw, headerMap.hours);
    const hours = hoursRaw ? Number(hoursRaw.replace(",", ".")) : 0;
    if (!Number.isFinite(hours) || hours < 0) {
      throw new Error(`Fila ${index + 1}: horas inválidas.`);
    }

    const draft: SstTrainingDraft = {
      workerId: "",
      topic,
      trainingDate,
      hours,
      instructor: cellValue(raw, headerMap.instructor),
      modality,
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
      certificateUrl: cellValue(raw, headerMap.certificateUrl),
      certificateName: cellValue(raw, headerMap.certificateName),
      nextTrainingDate:
        excelDateToIso(cellValue(raw, headerMap.nextTrainingDate)) || null,
      status,
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

export function buildTrainingExportRows(
  items: readonly SstTrainingView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    trabajador: item.workerName,
    documento: item.workerDocument,
    id_trabajador: item.workerCode,
    empresa: item.companySnapshot,
    cargo: item.jobTitleSnapshot,
    finca: item.farmName ?? "",
    tema: TRAINING_TOPIC_LABELS[item.topic],
    fecha: item.trainingDate,
    horas: item.hours,
    instructor: item.instructor,
    modalidad: TRAINING_MODALITY_LABELS[item.modality],
    evidencia_url: item.evidenceUrl,
    evidencia: item.evidenceName,
    certificado_url: item.certificateUrl,
    certificado: item.certificateName,
    proxima_capacitacion: item.nextTrainingDate ?? "",
    estado: TRAINING_STATUS_LABELS[item.status],
    observaciones: item.observations,
    dias_restantes: item.daysRemaining ?? "",
    semaforo: item.semaphoreLabel,
  }));
}

export function buildTrainingTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      documento: "1088294102",
      tema: "Inducción",
      fecha: "2026-03-01",
      horas: 4,
      instructor: "Ing. Andrés Valencia",
      modalidad: "Presencial",
      evidencia_url: "",
      evidencia: "Lista asistencia F-SST-004.pdf",
      certificado_url: "",
      certificado: "",
      proxima_capacitacion: "2027-03-01",
      estado: "Realizada",
      observaciones: "Inducción de ingreso SG-SST",
    },
  ];
}
