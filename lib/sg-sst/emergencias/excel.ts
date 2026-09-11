import {
  BRIGADE_STATUS_LABELS,
  BRIGADE_TYPE_LABELS,
  DRILL_STATUS_LABELS,
  DRILL_TYPE_LABELS,
  EQUIPMENT_STATUS_LABELS,
  EQUIPMENT_TYPE_LABELS,
  emptyBrigadeDraft,
  emptyDrillDraft,
  emptyEquipmentDraft,
  parseBrigadeStatusLabel,
  parseBrigadeTypeLabel,
  parseDrillStatusLabel,
  parseDrillTypeLabel,
  parseEquipmentStatusLabel,
  parseEquipmentTypeLabel,
  type BrigadeManualStatus,
  type EquipmentManualStatus,
  type SstBrigadeMemberDraft,
  type SstBrigadeMemberView,
  type SstEmergencyDrill,
  type SstEmergencyDrillDraft,
  type SstEmergencyEquipmentDraft,
  type SstEmergencyEquipmentView,
} from "@/lib/sg-sst/emergencias/types";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const EMERGENCIAS_EXCEL_MAX_ROWS = 500;

export type BrigadeExcelImportRow = {
  rowNumber: number;
  draft: SstBrigadeMemberDraft;
  workerDocumentOrCode: string;
  farmName?: string;
  folio?: string;
};

export type EquipmentExcelImportRow = {
  rowNumber: number;
  draft: SstEmergencyEquipmentDraft;
  farmName?: string;
  code?: string;
};

export type DrillExcelImportRow = {
  rowNumber: number;
  draft: SstEmergencyDrillDraft;
  farmName?: string;
  folio?: string;
};

export type EmergenciasExcelImportResultRow = {
  rowNumber: number;
  key: string;
  sheet: "brigada" | "equipos" | "simulacros";
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const BRIGADE_HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id"],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "worker_code",
    "identificacion",
  ],
  brigadeType: ["tipo", "brigada", "rama", "brigade_type", "tipo_brigada"],
  trainingTitle: [
    "formacion",
    "formación",
    "curso",
    "training_title",
    "titulo",
    "título",
  ],
  trainedAt: ["fecha_formacion", "fecha_formación", "trained_at", "capacitado"],
  dueDate: ["vencimiento", "due_date", "fecha_vencimiento", "vence"],
  status: ["estado", "status"],
  evidenceUrl: ["evidencia", "url_evidencia", "evidence_url", "documento"],
  evidenceName: ["nombre_evidencia", "archivo", "evidence_name"],
  observations: ["observaciones", "notas", "observations"],
  farm: ["finca", "sede", "farm", "centro_trabajo"],
};

const EQUIPMENT_HEADER_ALIASES: Record<string, readonly string[]> = {
  code: ["codigo", "código", "code", "folio", "id"],
  elementName: ["elemento", "nombre", "element_name", "equipo"],
  equipmentType: ["tipo", "tipo_equipo", "equipment_type"],
  location: ["ubicacion", "ubicación", "location", "lugar"],
  inspectedAt: ["inspeccionado", "inspected_at", "fecha_inspeccion"],
  nextInspectionAt: [
    "proxima_inspeccion",
    "próxima_inspeccion",
    "next_inspection",
    "vence_inspeccion",
  ],
  responsibleName: ["responsable", "responsible_name"],
  status: ["estado", "status"],
  findings: ["hallazgos", "findings"],
  observations: ["observaciones", "notas"],
  farm: ["finca", "sede", "farm"],
};

const DRILL_HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id"],
  drillDate: ["fecha", "drill_date", "fecha_simulacro"],
  place: ["lugar", "place", "sitio"],
  drillType: ["tipo", "tipo_simulacro", "drill_type"],
  participantsCount: [
    "participantes",
    "participants",
    "asistentes",
    "participants_count",
  ],
  resultScore: ["calificacion", "calificación", "score", "puntaje"],
  resultLabel: ["resultado", "result_label", "concepto"],
  findings: ["hallazgos", "findings"],
  actions: ["acciones", "actions", "mejoras"],
  status: ["estado", "status"],
  evidenceUrl: ["evidencia", "url_evidencia", "evidence_url"],
  evidenceName: ["nombre_evidencia", "archivo"],
  observations: ["observaciones", "notas"],
  farm: ["finca", "sede", "farm"],
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
  aliases: Record<string, readonly string[]>,
): Partial<Record<string, number>> {
  const map: Partial<Record<string, number>> = {};
  headerRow.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    for (const [key, list] of Object.entries(aliases)) {
      if (list.some((alias) => normalizeHeader(alias) === normalized)) {
        map[key] = index;
      }
    }
  });
  return map;
}

function toBrigadeManualStatus(raw: string): BrigadeManualStatus {
  const parsed = parseBrigadeStatusLabel(raw);
  return parsed === "inactivo" ? "inactivo" : "vigente";
}

function toEquipmentManualStatus(raw: string): EquipmentManualStatus {
  const parsed = parseEquipmentStatusLabel(raw);
  if (parsed === "fuera_servicio") return "fuera_servicio";
  if (parsed === "requiere_mantenimiento") return "requiere_mantenimiento";
  return "operativo";
}

export function brigadeRowsFromMatrix(
  matrix: string[][],
): BrigadeExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], BRIGADE_HEADER_ALIASES);
  if (headerMap.worker === undefined) {
    throw new Error("Falta la columna trabajador / documento (hoja Brigada).");
  }

  const defaults = emptyBrigadeDraft();
  const rows: BrigadeExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    if (!workerRef) continue;

    const brigadeType =
      parseBrigadeTypeLabel(cellValue(raw, headerMap.brigadeType)) ??
      defaults.brigadeType;

    const draft: SstBrigadeMemberDraft = {
      workerId: "",
      brigadeType,
      trainingTitle: cellValue(raw, headerMap.trainingTitle),
      trainedAt: excelDateToIso(cellValue(raw, headerMap.trainedAt)),
      dueDate: excelDateToIso(cellValue(raw, headerMap.dueDate)),
      status: toBrigadeManualStatus(cellValue(raw, headerMap.status)),
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
      observations: cellValue(raw, headerMap.observations),
      farmId: null,
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      workerDocumentOrCode: workerRef,
      farmName: cellValue(raw, headerMap.farm) || undefined,
      folio: cellValue(raw, headerMap.folio) || undefined,
    });
  }
  return rows;
}

export function equipmentRowsFromMatrix(
  matrix: string[][],
): EquipmentExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], EQUIPMENT_HEADER_ALIASES);
  if (headerMap.elementName === undefined && headerMap.code === undefined) {
    throw new Error(
      "Falta una columna de identidad: elemento / nombre o codigo (hoja Equipos).",
    );
  }

  const defaults = emptyEquipmentDraft();
  const rows: EquipmentExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const elementName = cellValue(raw, headerMap.elementName);
    const code = cellValue(raw, headerMap.code) || undefined;
    if (!elementName && !code) continue;

    const equipmentType =
      parseEquipmentTypeLabel(cellValue(raw, headerMap.equipmentType)) ??
      defaults.equipmentType;

    const draft: SstEmergencyEquipmentDraft = {
      code: code ?? "",
      elementName,
      equipmentType,
      location: cellValue(raw, headerMap.location),
      inspectedAt: excelDateToIso(cellValue(raw, headerMap.inspectedAt)) || null,
      nextInspectionAt: excelDateToIso(
        cellValue(raw, headerMap.nextInspectionAt),
      ),
      responsibleName: cellValue(raw, headerMap.responsibleName),
      status: toEquipmentManualStatus(cellValue(raw, headerMap.status)),
      findings: cellValue(raw, headerMap.findings),
      observations: cellValue(raw, headerMap.observations),
      farmId: null,
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      farmName: cellValue(raw, headerMap.farm) || undefined,
      code,
    });
  }
  return rows;
}

export function drillRowsFromMatrix(matrix: string[][]): DrillExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], DRILL_HEADER_ALIASES);
  if (
    headerMap.drillDate === undefined &&
    headerMap.place === undefined &&
    headerMap.folio === undefined
  ) {
    throw new Error(
      "Falta una columna de identidad: fecha, lugar o folio (hoja Simulacros).",
    );
  }

  const defaults = emptyDrillDraft();
  const rows: DrillExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const place = cellValue(raw, headerMap.place);
    const drillDate = excelDateToIso(cellValue(raw, headerMap.drillDate));
    const folio = cellValue(raw, headerMap.folio) || undefined;
    if (!place && !drillDate && !folio) continue;

    const drillType =
      parseDrillTypeLabel(cellValue(raw, headerMap.drillType)) ??
      defaults.drillType;
    const status =
      parseDrillStatusLabel(cellValue(raw, headerMap.status)) ?? defaults.status;

    const scoreRaw = cellValue(raw, headerMap.resultScore);
    const resultScore = scoreRaw ? Number(scoreRaw.replace(",", ".")) : null;

    const draft: SstEmergencyDrillDraft = {
      drillDate: drillDate || todayIsoDate(),
      place: place || "Sin dato",
      drillType,
      participantsCount: Number(cellValue(raw, headerMap.participantsCount) || 0),
      resultScore: Number.isFinite(resultScore) ? resultScore : null,
      resultLabel: cellValue(raw, headerMap.resultLabel),
      findings: cellValue(raw, headerMap.findings),
      actions: cellValue(raw, headerMap.actions),
      status,
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
      observations: cellValue(raw, headerMap.observations),
      farmId: null,
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      farmName: cellValue(raw, headerMap.farm) || undefined,
      folio,
    });
  }
  return rows;
}

export function buildBrigadeExportRows(
  items: readonly SstBrigadeMemberView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    trabajador: item.workerName,
    documento: item.workerDocument,
    codigo_trabajador: item.workerCode,
    tipo: BRIGADE_TYPE_LABELS[item.brigadeType],
    formacion: item.trainingTitle,
    fecha_formacion: item.trainedAt,
    vencimiento: item.dueDate,
    estado: BRIGADE_STATUS_LABELS[item.effectiveStatus],
    finca: item.farmName ?? "",
    cargo: item.jobTitleSnapshot,
    empresa: item.companySnapshot,
    observaciones: item.observations,
    evidencia_url: item.evidenceUrl,
    dias_restantes: item.daysRemaining ?? "",
  }));
}

export function buildEquipmentExportRows(
  items: readonly SstEmergencyEquipmentView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    codigo: item.code,
    elemento: item.elementName,
    tipo: EQUIPMENT_TYPE_LABELS[item.equipmentType],
    ubicacion: item.location,
    inspeccionado: item.inspectedAt ?? "",
    proxima_inspeccion: item.nextInspectionAt,
    responsable: item.responsibleName,
    estado: EQUIPMENT_STATUS_LABELS[item.effectiveStatus],
    hallazgos: item.findings,
    finca: item.farmName ?? "",
    observaciones: item.observations,
    dias_restantes: item.daysRemaining ?? "",
  }));
}

export function buildDrillExportRows(
  items: readonly SstEmergencyDrill[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    fecha: item.drillDate,
    lugar: item.place,
    tipo: DRILL_TYPE_LABELS[item.drillType],
    participantes: item.participantsCount,
    calificacion: item.resultScore ?? "",
    resultado: item.resultLabel,
    hallazgos: item.findings,
    acciones: item.actions,
    estado: DRILL_STATUS_LABELS[item.status],
    finca: item.farmName ?? "",
    observaciones: item.observations,
    evidencia_url: item.evidenceUrl,
  }));
}

export function buildBrigadeTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      trabajador: "1234567890",
      tipo: "Primeros auxilios",
      formacion: "Soporte vital básico",
      fecha_formacion: "2026-01-15",
      vencimiento: "2027-01-15",
      estado: "Vigente",
      finca: "",
      observaciones: "",
      evidencia_url: "",
    },
  ];
}

export function buildEquipmentTemplateRows(): Record<string, string | number>[] {
  return [
    {
      codigo: "",
      elemento: "Extintor PQS 10 lb — Bodega A",
      tipo: "Extintor",
      ubicacion: "Bodega A / acceso principal",
      inspeccionado: "2026-03-01",
      proxima_inspeccion: "2026-09-01",
      responsable: "Coord. SG-SST",
      estado: "Operativo",
      hallazgos: "",
      finca: "",
      observaciones: "",
    },
  ];
}

export function buildDrillTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      fecha: "2026-05-20",
      lugar: "Planta central",
      tipo: "Evacuación",
      participantes: 45,
      calificacion: 85,
      resultado: "Satisfactorio",
      hallazgos: "Retraso en punto de encuentro silos.",
      acciones: "Reforzar señalización y megafonía.",
      estado: "Realizado",
      finca: "",
      observaciones: "",
    },
  ];
}
