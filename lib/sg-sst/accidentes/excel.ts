import {
  ACCIDENT_EVENT_TYPE_LABELS,
  ACCIDENT_STATUS_LABELS,
  emptyAccidentDraft,
  emptyCausesDraft,
  parseAccidentEventTypeLabel,
  parseAccidentStatusLabel,
  type SstAccidentEvent,
  type SstAccidentEventDraft,
} from "@/lib/sg-sst/accidentes/types";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const ACCIDENT_EXCEL_MAX_ROWS = 500;

export type AccidentExcelImportRow = {
  rowNumber: number;
  draft: SstAccidentEventDraft;
  workerDocumentOrCode: string;
  eventNumber?: string;
  farmName?: string;
};

export type AccidentExcelImportResultRow = {
  rowNumber: number;
  eventNumber: string;
  workerRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  eventNumber: [
    "numero_evento",
    "número_evento",
    "event_number",
    "folio",
    "codigo",
    "código",
  ],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "id_trabajador",
    "worker_code",
    "identificacion",
  ],
  eventDate: ["fecha", "fecha_evento", "event_date"],
  eventTime: ["hora", "hora_evento", "event_time"],
  company: ["empresa", "company"],
  jobTitle: ["cargo", "puesto", "job_title"],
  area: ["area", "área"],
  workCenter: ["centro", "centro_trabajo", "work_center"],
  farm: ["finca", "farm", "farm_name", "predio"],
  eventType: ["tipo_evento", "tipo", "event_type"],
  description: ["descripcion", "descripción", "description", "detalle"],
  accidentKind: ["tipo_accidente", "accident_kind", "clase"],
  mechanism: ["mecanismo", "mecanismo_evento", "mechanism"],
  agent: ["agente", "agent"],
  bodyPart: ["parte_cuerpo", "parte_del_cuerpo", "body_part"],
  injuryType: ["tipo_lesion", "tipo_lesión", "injury_type", "lesion"],
  lostDays: ["dias_perdidos", "días_perdidos", "lost_days"],
  origin: ["origen", "origin"],
  status: ["estado", "status"],
  investigationNotes: ["investigacion", "investigación", "investigation_notes"],
  correctiveActionNotes: [
    "accion_correctiva",
    "acción_correctiva",
    "corrective_action_notes",
  ],
  evidenceUrl: ["evidencia", "url_evidencia", "evidence_url", "documento"],
  evidenceName: ["nombre_evidencia", "archivo", "evidence_name"],
  immediateAct: ["acto_subestandar", "acto_subestándar", "immediate_act"],
  immediateCondition: [
    "condicion_subestandar",
    "condición_subestándar",
    "immediate_condition",
  ],
  basicPersonal: ["factor_personal", "basic_personal"],
  basicWork: ["factor_trabajo", "basic_work"],
  rootCause: ["causa_principal", "causa_raiz", "causa_raíz", "root_cause"],
  causeAgent: ["causa_agente", "agent_causa"],
  causeMechanism: ["causa_mecanismo", "mechanism_causa"],
  correctiveAction: ["accion_correctiva_causa", "corrective_action"],
  preventiveAction: ["accion_preventiva", "acción_preventiva", "preventive_action"],
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

function excelTime(raw: string): string {
  if (!raw) return "";
  if (/^\d{1,2}:\d{2}/.test(raw)) return raw.slice(0, 8);
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

function parseLostDays(raw: string): number {
  if (!raw.trim()) return 0;
  const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function accidentRowsFromMatrix(matrix: string[][]): AccidentExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0]);
  if (
    headerMap.worker === undefined &&
    headerMap.eventDate === undefined &&
    headerMap.eventNumber === undefined &&
    headerMap.description === undefined
  ) {
    throw new Error(
      "Falta al menos una columna usable (trabajador, fecha, folio o descripción).",
    );
  }

  const defaults = emptyAccidentDraft();
  const rows: AccidentExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    const eventDate =
      excelDateToIso(cellValue(raw, headerMap.eventDate)) || todayIsoDate();
    const eventTypeRaw = cellValue(raw, headerMap.eventType);
    const eventType =
      (eventTypeRaw ? parseAccidentEventTypeLabel(eventTypeRaw) : null) ??
      defaults.eventType;
    if (!workerRef && !cellValue(raw, headerMap.eventDate) && !eventTypeRaw) {
      continue;
    }

    const statusRaw = cellValue(raw, headerMap.status);
    const status =
      (statusRaw ? parseAccidentStatusLabel(statusRaw) : null) ?? defaults.status;

    const causes = emptyCausesDraft();
    causes.immediateAct = cellValue(raw, headerMap.immediateAct);
    causes.immediateCondition = cellValue(raw, headerMap.immediateCondition);
    causes.basicPersonal = cellValue(raw, headerMap.basicPersonal);
    causes.basicWork = cellValue(raw, headerMap.basicWork);
    causes.rootCause = cellValue(raw, headerMap.rootCause);
    causes.agent =
      cellValue(raw, headerMap.causeAgent) || cellValue(raw, headerMap.agent);
    causes.mechanism =
      cellValue(raw, headerMap.causeMechanism) || cellValue(raw, headerMap.mechanism);
    causes.correctiveAction = cellValue(raw, headerMap.correctiveAction);
    causes.preventiveAction = cellValue(raw, headerMap.preventiveAction);

    const hasAnyCause = Object.values(causes).some((value) => value.trim());

    const draft: SstAccidentEventDraft = {
      workerId: "",
      eventDate,
      eventTime: excelTime(cellValue(raw, headerMap.eventTime)) || null,
      companySnapshot: cellValue(raw, headerMap.company),
      jobTitleSnapshot: cellValue(raw, headerMap.jobTitle),
      areaSnapshot: cellValue(raw, headerMap.area),
      workCenterSnapshot: cellValue(raw, headerMap.workCenter),
      farmId: null,
      eventType,
      description: cellValue(raw, headerMap.description),
      accidentKind: cellValue(raw, headerMap.accidentKind),
      mechanism: cellValue(raw, headerMap.mechanism),
      agent: cellValue(raw, headerMap.agent),
      bodyPart: cellValue(raw, headerMap.bodyPart),
      injuryType: cellValue(raw, headerMap.injuryType),
      lostDays: parseLostDays(cellValue(raw, headerMap.lostDays)),
      origin: cellValue(raw, headerMap.origin),
      status,
      investigationNotes: cellValue(raw, headerMap.investigationNotes),
      correctiveActionNotes: cellValue(raw, headerMap.correctiveActionNotes),
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
      causes: hasAnyCause ? causes : undefined,
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      workerDocumentOrCode: workerRef,
      eventNumber: cellValue(raw, headerMap.eventNumber) || undefined,
      farmName: cellValue(raw, headerMap.farm) || undefined,
    });
  }
  return rows;
}

export function buildAccidentExportRows(
  events: readonly SstAccidentEvent[],
): Record<string, string | number>[] {
  return events.map((item) => ({
    numero_evento: item.eventNumber,
    fecha: item.eventDate,
    hora: item.eventTime ?? "",
    trabajador: item.workerName,
    documento: item.workerDocument,
    id_trabajador: item.workerCode,
    empresa: item.companySnapshot,
    cargo: item.jobTitleSnapshot,
    area: item.areaSnapshot,
    centro_trabajo: item.workCenterSnapshot,
    finca: item.farmName ?? "",
    tipo_evento: ACCIDENT_EVENT_TYPE_LABELS[item.eventType],
    descripcion: item.description,
    tipo_accidente: item.accidentKind,
    mecanismo: item.mechanism,
    agente: item.agent,
    parte_cuerpo: item.bodyPart,
    tipo_lesion: item.injuryType,
    dias_perdidos: item.lostDays,
    origen: item.origin,
    investigacion: item.investigationNotes,
    accion_correctiva: item.correctiveActionNotes,
    estado: ACCIDENT_STATUS_LABELS[item.status],
    evidencia_url: item.evidenceUrl,
    evidencia_nombre: item.evidenceName,
    acto_subestandar: item.causes?.immediateAct ?? "",
    condicion_subestandar: item.causes?.immediateCondition ?? "",
    factor_personal: item.causes?.basicPersonal ?? "",
    factor_trabajo: item.causes?.basicWork ?? "",
    causa_principal: item.causes?.rootCause ?? "",
    causa_agente: item.causes?.agent ?? "",
    causa_mecanismo: item.causes?.mechanism ?? "",
    accion_correctiva_causa: item.causes?.correctiveAction ?? "",
    accion_preventiva: item.causes?.preventiveAction ?? "",
  }));
}

export function buildAccidentTemplateRows(): Record<string, string | number>[] {
  return [
    {
      numero_evento: "",
      documento: "1088294102",
      fecha: "2026-03-10",
      hora: "08:30",
      tipo_evento: "Accidente de trabajo",
      descripcion: "Caída desde plataforma de carga",
      tipo_accidente: "Caída de personas",
      mecanismo: "Caída a distinto nivel",
      agente: "Plataforma metálica",
      parte_cuerpo: "Miembro inferior izquierdo",
      tipo_lesion: "Contusión",
      dias_perdidos: 3,
      origen: "Campo",
      estado: "En investigación",
      investigacion: "",
      accion_correctiva: "",
      evidencia_url: "",
      acto_subestandar: "No usar arnés en plataforma",
      condicion_subestandar: "Baranda incompleta",
      factor_personal: "Falta de percepción del riesgo",
      factor_trabajo: "Procedimiento incompleto",
      causa_principal: "Ausencia de control en plataforma elevada",
      accion_preventiva: "Inspección semanal de barandas",
    },
  ];
}
