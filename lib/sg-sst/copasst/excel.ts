import {
  COPASST_COMMITMENT_STATUS_LABELS,
  COPASST_MEETING_STATUS_LABELS,
  COPASST_MEETING_TYPE_LABELS,
  COPASST_MEMBER_STATUS_LABELS,
  COPASST_ROLE_LABELS,
  COPASST_TRAINING_STATUS_LABELS,
  emptyCommitmentDraft,
  emptyMeetingDraft,
  emptyMemberDraft,
  emptyTrainingDraft,
  parseCommitmentStatusLabel,
  parseCopasstRoleLabel,
  parseMeetingStatusLabel,
  parseMeetingTypeLabel,
  parseMemberStatusLabel,
  parseTrainingStatusLabel,
  toCommitmentManualStatus,
  toMemberManualStatus,
  type SstCopasstCommitmentDraft,
  type SstCopasstCommitmentView,
  type SstCopasstMeeting,
  type SstCopasstMeetingDraft,
  type SstCopasstMemberDraft,
  type SstCopasstMemberView,
  type SstCopasstTraining,
  type SstCopasstTrainingDraft,
} from "@/lib/sg-sst/copasst/types";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const COPASST_EXCEL_MAX_ROWS = 500;

export type CopasstMemberExcelImportRow = {
  rowNumber: number;
  draft: SstCopasstMemberDraft;
  workerDocumentOrCode: string;
  farmName?: string;
};

export type CopasstMeetingExcelImportRow = {
  rowNumber: number;
  draft: SstCopasstMeetingDraft;
  farmName?: string;
  folio?: string;
};

export type CopasstCommitmentExcelImportRow = {
  rowNumber: number;
  draft: SstCopasstCommitmentDraft;
  meetingFolio?: string;
  farmName?: string;
  folio?: string;
};

export type CopasstTrainingExcelImportRow = {
  rowNumber: number;
  draft: SstCopasstTrainingDraft;
  folio?: string;
};

export type CopasstExcelImportResultRow = {
  rowNumber: number;
  key: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const MEMBER_ALIASES: Record<string, readonly string[]> = {
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "worker_code",
    "identificacion",
  ],
  role: ["rol", "cargo_copasst", "role"],
  periodLabel: ["periodo", "period_label", "vigencia"],
  startDate: ["inicio", "fecha_inicio", "start_date"],
  endDate: ["fin", "fecha_fin", "end_date", "vencimiento"],
  status: ["estado", "status"],
  company: ["empresa", "company", "company_snapshot"],
  jobTitle: ["cargo", "puesto", "job_title"],
  farm: ["finca", "sede", "farm"],
  observations: ["observaciones", "notas"],
};

const MEETING_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "acta"],
  meetingDate: ["fecha", "fecha_reunion", "meeting_date"],
  meetingType: ["tipo", "tipo_reunion", "meeting_type"],
  title: ["titulo", "título", "tema", "title"],
  summary: ["resumen", "summary", "desarrollo"],
  actUrl: ["acta_url", "url_acta", "documento", "act_url"],
  actName: ["nombre_acta", "archivo", "act_name"],
  nextMeetingDate: [
    "proxima",
    "próxima",
    "proxima_reunion",
    "next_meeting_date",
  ],
  status: ["estado", "status"],
  farm: ["finca", "sede", "farm"],
  observations: ["observaciones", "notas"],
};

const COMMITMENT_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código"],
  meetingFolio: ["acta", "folio_acta", "meeting_folio", "reunion"],
  description: ["descripcion", "descripción", "compromiso", "description"],
  responsibleName: ["responsable", "responsible_name"],
  dueDate: ["vencimiento", "fecha_limite", "due_date", "plazo"],
  closedAt: ["fecha_cierre", "cierre", "closed_at"],
  status: ["estado", "status"],
  followUp: ["seguimiento", "follow_up"],
  evidenceUrl: ["evidencia", "url_evidencia", "evidence_url"],
  evidenceName: ["nombre_evidencia", "archivo", "evidence_name"],
  farm: ["finca", "sede", "farm"],
  observations: ["observaciones", "notas"],
};

const TRAINING_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código"],
  title: ["titulo", "título", "tema", "title", "capacitacion"],
  trainingDate: ["fecha", "fecha_capacitacion", "training_date"],
  hours: ["horas", "hours", "duracion"],
  instructor: ["instructor", "facilitador", "ponente"],
  attendeesCount: ["asistentes", "attendees", "participantes"],
  evidenceUrl: ["evidencia", "url_evidencia", "evidence_url"],
  evidenceName: ["nombre_evidencia", "archivo", "evidence_name"],
  status: ["estado", "status"],
  observations: ["observaciones", "notas"],
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

function parseNumber(raw: string, fallback = 0): number {
  if (!raw.trim()) return fallback;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

export function memberRowsFromMatrix(
  matrix: string[][],
): CopasstMemberExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], MEMBER_ALIASES);
  if (headerMap.worker === undefined) {
    throw new Error("Falta la columna trabajador / documento.");
  }

  const defaults = emptyMemberDraft();
  const rows: CopasstMemberExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;
    const workerRef = cellValue(raw, headerMap.worker);
    if (!workerRef) continue;

    const role =
      parseCopasstRoleLabel(cellValue(raw, headerMap.role)) ?? defaults.role;
    const statusRaw = cellValue(raw, headerMap.status);
    const parsedStatus =
      parseMemberStatusLabel(statusRaw) ?? ("activo" as const);

    rows.push({
      rowNumber: index + 1,
      workerDocumentOrCode: workerRef,
      farmName: cellValue(raw, headerMap.farm) || undefined,
      draft: {
        workerId: "",
        companySnapshot: cellValue(raw, headerMap.company),
        jobTitleSnapshot: cellValue(raw, headerMap.jobTitle),
        role,
        periodLabel: cellValue(raw, headerMap.periodLabel),
        startDate: excelDateToIso(cellValue(raw, headerMap.startDate)),
        endDate: excelDateToIso(cellValue(raw, headerMap.endDate)),
        status: toMemberManualStatus(parsedStatus),
        farmId: null,
        observations: cellValue(raw, headerMap.observations),
      },
    });
  }
  return rows;
}

export function meetingRowsFromMatrix(
  matrix: string[][],
): CopasstMeetingExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], MEETING_ALIASES);
  if (
    headerMap.meetingDate === undefined &&
    headerMap.title === undefined &&
    headerMap.folio === undefined
  ) {
    throw new Error("Falta una columna de identidad: fecha, título o folio.");
  }

  const defaults = emptyMeetingDraft();
  const rows: CopasstMeetingExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;
    const title = cellValue(raw, headerMap.title);
    const meetingDate = excelDateToIso(cellValue(raw, headerMap.meetingDate));
    const folio = cellValue(raw, headerMap.folio) || undefined;
    if (!title && !meetingDate && !folio) continue;

    const meetingType =
      parseMeetingTypeLabel(cellValue(raw, headerMap.meetingType)) ??
      defaults.meetingType;
    const status =
      parseMeetingStatusLabel(cellValue(raw, headerMap.status)) ??
      defaults.status;

    rows.push({
      rowNumber: index + 1,
      folio,
      farmName: cellValue(raw, headerMap.farm) || undefined,
      draft: {
        meetingDate: meetingDate || todayIsoDate(),
        meetingType,
        title: title || "Sin título",
        summary: cellValue(raw, headerMap.summary),
        actUrl: cellValue(raw, headerMap.actUrl),
        actName: cellValue(raw, headerMap.actName),
        nextMeetingDate:
          excelDateToIso(cellValue(raw, headerMap.nextMeetingDate)) || null,
        status,
        farmId: null,
        observations: cellValue(raw, headerMap.observations),
      },
    });
  }
  return rows;
}

export function commitmentRowsFromMatrix(
  matrix: string[][],
): CopasstCommitmentExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], COMMITMENT_ALIASES);
  if (
    headerMap.description === undefined &&
    headerMap.responsibleName === undefined &&
    headerMap.folio === undefined
  ) {
    throw new Error(
      "Falta una columna de identidad: descripción, responsable o folio.",
    );
  }

  const defaults = emptyCommitmentDraft();
  const rows: CopasstCommitmentExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;
    const description = cellValue(raw, headerMap.description);
    const responsibleName = cellValue(raw, headerMap.responsibleName);
    const folio = cellValue(raw, headerMap.folio) || undefined;
    if (!description && !responsibleName && !folio) continue;

    const parsed =
      parseCommitmentStatusLabel(cellValue(raw, headerMap.status)) ??
      ("abierto" as const);

    rows.push({
      rowNumber: index + 1,
      folio,
      meetingFolio: cellValue(raw, headerMap.meetingFolio) || undefined,
      farmName: cellValue(raw, headerMap.farm) || undefined,
      draft: {
        meetingId: null,
        description: description || "Sin detalle",
        responsibleName: responsibleName || "Sin responsable",
        dueDate:
          excelDateToIso(cellValue(raw, headerMap.dueDate)) ||
          defaults.dueDate ||
          todayIsoDate(),
        closedAt: excelDateToIso(cellValue(raw, headerMap.closedAt)) || null,
        status: toCommitmentManualStatus(parsed),
        followUp: cellValue(raw, headerMap.followUp),
        evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
        evidenceName: cellValue(raw, headerMap.evidenceName),
        farmId: null,
        observations: cellValue(raw, headerMap.observations),
      },
    });
  }
  return rows;
}

export function trainingRowsFromMatrix(
  matrix: string[][],
): CopasstTrainingExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], TRAINING_ALIASES);
  if (
    headerMap.title === undefined &&
    headerMap.trainingDate === undefined &&
    headerMap.folio === undefined
  ) {
    throw new Error("Falta una columna de identidad: título, fecha o folio.");
  }

  const defaults = emptyTrainingDraft();
  const rows: CopasstTrainingExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;
    const title = cellValue(raw, headerMap.title);
    const trainingDate = excelDateToIso(cellValue(raw, headerMap.trainingDate));
    const folio = cellValue(raw, headerMap.folio) || undefined;
    if (!title && !trainingDate && !folio) continue;

    const status =
      parseTrainingStatusLabel(cellValue(raw, headerMap.status)) ??
      defaults.status;

    rows.push({
      rowNumber: index + 1,
      folio,
      draft: {
        title: title || "Sin título",
        trainingDate: trainingDate || todayIsoDate(),
        hours: parseNumber(cellValue(raw, headerMap.hours), defaults.hours),
        instructor: cellValue(raw, headerMap.instructor),
        attendeesCount: Math.round(
          parseNumber(cellValue(raw, headerMap.attendeesCount), 0),
        ),
        evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
        evidenceName: cellValue(raw, headerMap.evidenceName),
        status,
        observations: cellValue(raw, headerMap.observations),
      },
    });
  }
  return rows;
}

export function buildMemberExportRows(
  items: readonly SstCopasstMemberView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    trabajador: item.workerDocument || item.workerCode,
    nombre: item.workerName,
    rol: COPASST_ROLE_LABELS[item.role],
    periodo: item.periodLabel,
    fecha_inicio: item.startDate,
    fecha_fin: item.endDate,
    estado: COPASST_MEMBER_STATUS_LABELS[item.effectiveStatus],
    empresa: item.companySnapshot,
    cargo: item.jobTitleSnapshot,
    finca: item.farmName ?? "",
    observaciones: item.observations,
  }));
}

export function buildMeetingExportRows(
  items: readonly SstCopasstMeeting[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    fecha: item.meetingDate,
    tipo: COPASST_MEETING_TYPE_LABELS[item.meetingType],
    titulo: item.title,
    resumen: item.summary,
    proxima_reunion: item.nextMeetingDate ?? "",
    estado: COPASST_MEETING_STATUS_LABELS[item.status],
    finca: item.farmName ?? "",
    acta_url: item.actUrl,
    nombre_acta: item.actName,
    observaciones: item.observations,
  }));
}

export function buildCommitmentExportRows(
  items: readonly SstCopasstCommitmentView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    folio_acta: item.meetingFolio ?? "",
    descripcion: item.description,
    responsable: item.responsibleName,
    vencimiento: item.dueDate,
    fecha_cierre: item.closedAt ?? "",
    estado: COPASST_COMMITMENT_STATUS_LABELS[item.effectiveStatus],
    seguimiento: item.followUp,
    finca: item.farmName ?? "",
    evidencia_url: item.evidenceUrl,
    evidencia_nombre: item.evidenceName,
    observaciones: item.observations,
    dias_restantes: item.daysRemaining ?? "",
  }));
}

export function buildTrainingExportRows(
  items: readonly SstCopasstTraining[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    titulo: item.title,
    fecha: item.trainingDate,
    horas: item.hours,
    instructor: item.instructor,
    asistentes: item.attendeesCount,
    estado: COPASST_TRAINING_STATUS_LABELS[item.status],
    evidencia_url: item.evidenceUrl,
    evidencia_nombre: item.evidenceName,
    observaciones: item.observations,
  }));
}

export function buildCopasstTemplateSheets(): {
  Integrantes: Record<string, string | number>[];
  Actas: Record<string, string | number>[];
  Compromisos: Record<string, string | number>[];
  Capacitaciones: Record<string, string | number>[];
} {
  const year = new Date().getFullYear();
  return {
    Integrantes: [
      {
        trabajador: "1234567890",
        rol: "Presidente",
        periodo: `${year}-${year + 2}`,
        fecha_inicio: `${year}-01-01`,
        fecha_fin: `${year + 2}-12-31`,
        estado: "Activo",
        empresa: "",
        cargo: "",
        finca: "",
        observaciones: "",
      },
    ],
    Actas: [
      {
        folio: "",
        fecha: `${year}-03-15`,
        tipo: "Ordinaria",
        titulo: "Reunión ordinaria COPASST",
        resumen: "Seguimiento de compromisos y revisiones.",
        proxima_reunion: `${year}-06-15`,
        estado: "Programada",
        finca: "",
        acta_url: "",
        nombre_acta: "",
        observaciones: "",
      },
    ],
    Compromisos: [
      {
        folio: "",
        folio_acta: "",
        descripcion: "Actualizar señalización de rutas de evacuación.",
        responsable: "Coord. SG-SST",
        vencimiento: `${year}-04-30`,
        fecha_cierre: "",
        estado: "Abierto",
        seguimiento: "",
        finca: "",
        evidencia_url: "",
        evidencia_nombre: "",
        observaciones: "",
      },
    ],
    Capacitaciones: [
      {
        folio: "",
        titulo: "Funciones y responsabilidades del COPASST",
        fecha: `${year}-02-20`,
        horas: 4,
        instructor: "ARL",
        asistentes: 8,
        estado: "Programada",
        evidencia_url: "",
        evidencia_nombre: "",
        observaciones: "",
      },
    ],
  };
}
