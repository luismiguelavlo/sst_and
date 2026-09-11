import {
  CCL_CASE_STATUS_LABELS,
  CCL_COMMITMENT_STATUS_LABELS,
  CCL_MEETING_STATUS_LABELS,
  CCL_MEETING_TYPE_LABELS,
  CCL_MEMBER_ROLE_LABELS,
  CCL_MEMBER_STATUS_LABELS,
  emptyCaseDraft,
  emptyCommitmentDraft,
  emptyMeetingDraft,
  emptyMemberDraft,
  parseCaseStatusLabel,
  parseCommitmentStatusLabel,
  parseMeetingStatusLabel,
  parseMeetingTypeLabel,
  parseMemberRoleLabel,
  parseMemberStatusLabel,
  type SstCclCaseDraft,
  type SstCclCaseView,
  type SstCclCommitmentDraft,
  type SstCclCommitmentView,
  type SstCclMeeting,
  type SstCclMeetingDraft,
  type SstCclMember,
  type SstCclMemberDraft,
} from "@/lib/sg-sst/ccl/types";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const CCL_EXCEL_MAX_ROWS = 500;

export type CclMemberExcelImportRow = {
  rowNumber: number;
  draft: SstCclMemberDraft;
  workerDocumentOrCode: string;
  farmName?: string;
};

export type CclMeetingExcelImportRow = {
  rowNumber: number;
  draft: SstCclMeetingDraft;
  farmName?: string;
  folio?: string;
};

export type CclCaseExcelImportRow = {
  rowNumber: number;
  draft: SstCclCaseDraft;
  code?: string;
  meetingFolio?: string;
};

export type CclCommitmentExcelImportRow = {
  rowNumber: number;
  draft: SstCclCommitmentDraft;
  folio?: string;
  meetingFolio?: string;
  caseCode?: string;
};

export type CclExcelImportResultRow = {
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
  role: ["rol", "cargo_ccl", "role"],
  periodLabel: ["periodo", "period_label", "vigencia"],
  startDate: ["inicio", "fecha_inicio", "start_date"],
  endDate: ["fin", "fecha_fin", "end_date"],
  status: ["estado", "status"],
  farm: ["finca", "sede", "farm"],
  observations: ["observaciones", "notas"],
};

const MEETING_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "acta", "codigo", "código"],
  meetingDate: ["fecha", "fecha_reunion", "meeting_date"],
  meetingType: ["tipo", "tipo_reunion", "meeting_type"],
  title: ["titulo", "título", "title", "asunto"],
  summary: ["resumen", "summary", "contenido"],
  actUrl: ["url_acta", "act_url", "documento", "url"],
  actName: ["nombre_acta", "act_name", "archivo"],
  status: ["estado", "status"],
  farm: ["finca", "sede", "farm"],
  observations: ["observaciones", "notas"],
};

const CASE_ALIASES: Record<string, readonly string[]> = {
  code: ["codigo", "código", "code", "expediente", "caso"],
  openedAt: ["apertura", "fecha_apertura", "opened_at", "radicado"],
  dueDate: ["vencimiento", "due_date", "termino", "término", "plazo"],
  closedAt: ["cierre", "fecha_cierre", "closed_at"],
  status: ["estado", "status"],
  activitySummary: [
    "actividad",
    "resumen_actividad",
    "activity_summary",
    "etiqueta",
  ],
  followUp: ["seguimiento", "follow_up", "nota_admin"],
  meetingFolio: ["acta", "folio_acta", "meeting_folio"],
  observations: ["observaciones", "notas"],
};

const COMMITMENT_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código"],
  description: ["descripcion", "descripción", "description", "compromiso"],
  responsibleName: ["responsable", "responsible_name"],
  dueDate: ["vencimiento", "due_date", "plazo", "fecha_compromiso"],
  closedAt: ["cierre", "fecha_cierre", "closed_at"],
  status: ["estado", "status"],
  followUp: ["seguimiento", "follow_up"],
  meetingFolio: ["acta", "folio_acta", "meeting_folio"],
  caseCode: ["caso", "codigo_caso", "case_code", "expediente"],
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
    for (const [key, aliasList] of Object.entries(aliases)) {
      if (aliasList.some((alias) => normalizeHeader(alias) === normalized)) {
        map[key] = index;
      }
    }
  });
  return map;
}

export function memberRowsFromMatrix(
  matrix: string[][],
): CclMemberExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], MEMBER_ALIASES);
  if (headerMap.worker === undefined) {
    throw new Error("Falta la columna trabajador / documento.");
  }

  const defaults = emptyMemberDraft();
  const rows: CclMemberExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerDocumentOrCode = cellValue(raw, headerMap.worker);
    if (!workerDocumentOrCode) continue;

    const role =
      parseMemberRoleLabel(cellValue(raw, headerMap.role)) ?? defaults.role;
    const statusRaw = cellValue(raw, headerMap.status);
    const parsedStatus = parseMemberStatusLabel(statusRaw);
    const status =
      parsedStatus && parsedStatus !== "periodo_vencido"
        ? parsedStatus
        : defaults.status;

    const draft: SstCclMemberDraft = {
      workerId: "",
      role,
      periodLabel: cellValue(raw, headerMap.periodLabel),
      startDate: excelDateToIso(cellValue(raw, headerMap.startDate)),
      endDate: excelDateToIso(cellValue(raw, headerMap.endDate)),
      status,
      farmId: null,
      observations: cellValue(raw, headerMap.observations),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      workerDocumentOrCode,
      farmName: cellValue(raw, headerMap.farm) || undefined,
    });
  }
  return rows;
}

export function meetingRowsFromMatrix(
  matrix: string[][],
): CclMeetingExcelImportRow[] {
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
  const rows: CclMeetingExcelImportRow[] = [];
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

    const draft: SstCclMeetingDraft = {
      meetingDate: meetingDate || todayIsoDate(),
      meetingType,
      title: title || "Sin título",
      summary: cellValue(raw, headerMap.summary),
      actUrl: cellValue(raw, headerMap.actUrl),
      actName: cellValue(raw, headerMap.actName),
      status,
      farmId: null,
      observations: cellValue(raw, headerMap.observations),
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

export function caseRowsFromMatrix(matrix: string[][]): CclCaseExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], CASE_ALIASES);
  if (
    headerMap.openedAt === undefined &&
    headerMap.activitySummary === undefined &&
    headerMap.code === undefined
  ) {
    throw new Error(
      "Falta una columna de identidad: apertura, resumen o codigo.",
    );
  }

  const defaults = emptyCaseDraft();
  const rows: CclCaseExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const activitySummary = cellValue(raw, headerMap.activitySummary);
    const openedAt = excelDateToIso(cellValue(raw, headerMap.openedAt));
    const code = cellValue(raw, headerMap.code) || undefined;
    if (!activitySummary && !openedAt && !code) continue;

    const status =
      parseCaseStatusLabel(cellValue(raw, headerMap.status)) ?? defaults.status;

    const draft: SstCclCaseDraft = {
      openedAt: openedAt || todayIsoDate(),
      dueDate: excelDateToIso(cellValue(raw, headerMap.dueDate)) || null,
      closedAt: excelDateToIso(cellValue(raw, headerMap.closedAt)) || null,
      status,
      activitySummary: activitySummary || defaults.activitySummary,
      followUp: cellValue(raw, headerMap.followUp),
      meetingId: null,
      observations: cellValue(raw, headerMap.observations),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      code,
      meetingFolio: cellValue(raw, headerMap.meetingFolio) || undefined,
    });
  }
  return rows;
}

export function commitmentRowsFromMatrix(
  matrix: string[][],
): CclCommitmentExcelImportRow[] {
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
  const rows: CclCommitmentExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const description = cellValue(raw, headerMap.description);
    const responsibleName = cellValue(raw, headerMap.responsibleName);
    const folio = cellValue(raw, headerMap.folio) || undefined;
    if (!description && !responsibleName && !folio) continue;

    const statusRaw = cellValue(raw, headerMap.status);
    const parsed = statusRaw ? parseCommitmentStatusLabel(statusRaw) : null;
    const status =
      parsed === "cerrado" ? ("cerrado" as const) : defaults.status;

    const draft: SstCclCommitmentDraft = {
      meetingId: null,
      caseId: null,
      description: description || "Sin detalle",
      responsibleName: responsibleName || "Sin responsable",
      dueDate:
        excelDateToIso(cellValue(raw, headerMap.dueDate)) ||
        defaults.dueDate ||
        todayIsoDate(),
      closedAt: excelDateToIso(cellValue(raw, headerMap.closedAt)) || null,
      status,
      followUp: cellValue(raw, headerMap.followUp),
      observations: cellValue(raw, headerMap.observations),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      folio,
      meetingFolio: cellValue(raw, headerMap.meetingFolio) || undefined,
      caseCode: cellValue(raw, headerMap.caseCode) || undefined,
    });
  }
  return rows;
}

export function buildMemberExportRows(
  items: readonly SstCclMember[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    documento: item.workerDocument,
    codigo_trabajador: item.workerCode,
    nombre: item.workerName,
    rol: CCL_MEMBER_ROLE_LABELS[item.role],
    periodo: item.periodLabel,
    fecha_inicio: item.startDate,
    fecha_fin: item.endDate,
    estado: CCL_MEMBER_STATUS_LABELS[item.status],
    cargo: item.jobTitleSnapshot,
    empresa: item.companySnapshot,
    finca: item.farmName ?? "",
    observaciones: item.observations,
  }));
}

export function buildMeetingExportRows(
  items: readonly SstCclMeeting[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    fecha: item.meetingDate,
    tipo: CCL_MEETING_TYPE_LABELS[item.meetingType],
    titulo: item.title,
    resumen: item.summary,
    estado: CCL_MEETING_STATUS_LABELS[item.status],
    finca: item.farmName ?? "",
    url_acta: item.actUrl,
    nombre_acta: item.actName,
    observaciones: item.observations,
  }));
}

/** Exportación anónima: sin identidades ni hechos sensibles. */
export function buildCaseExportRows(
  items: readonly SstCclCaseView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    codigo: item.code,
    fecha_apertura: item.openedAt,
    vencimiento: item.dueDate ?? "",
    fecha_cierre: item.closedAt ?? "",
    estado: CCL_CASE_STATUS_LABELS[item.status],
    resumen_actividad: item.activitySummary,
    seguimiento_admin: item.followUp,
    folio_acta: item.meetingFolio ?? "",
    dias_restantes: item.daysRemaining ?? "",
    observaciones: item.observations,
  }));
}

export function buildCommitmentExportRows(
  items: readonly SstCclCommitmentView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    descripcion: item.description,
    responsable: item.responsibleName,
    vencimiento: item.dueDate,
    fecha_cierre: item.closedAt ?? "",
    estado: CCL_COMMITMENT_STATUS_LABELS[item.effectiveStatus],
    seguimiento: item.followUp,
    folio_acta: item.meetingFolio ?? "",
    codigo_caso: item.caseCode ?? "",
    dias_restantes: item.daysRemaining ?? "",
    observaciones: item.observations,
  }));
}

export function buildMemberTemplateRows(): Record<string, string | number>[] {
  return [
    {
      documento: "1234567890",
      rol: "Presidente",
      periodo: "2026 - 2028",
      fecha_inicio: "2026-01-15",
      fecha_fin: "2028-01-14",
      estado: "Activo",
      finca: "",
      observaciones: "",
    },
  ];
}

export function buildMeetingTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      fecha: "2026-03-15",
      tipo: "Ordinaria",
      titulo: "Sesión ordinaria Q1",
      resumen: "Cronograma trimestral y revisión de indicadores.",
      estado: "Realizada",
      finca: "",
      url_acta: "",
      nombre_acta: "",
      observaciones: "",
    },
  ];
}

export function buildCaseTemplateRows(): Record<string, string | number>[] {
  return [
    {
      codigo: "",
      fecha_apertura: "2026-02-01",
      vencimiento: "2026-04-02",
      fecha_cierre: "",
      estado: "En trámite",
      resumen_actividad: "En trámite · Término legal",
      seguimiento_admin: "Bitácora paramétrica al día.",
      folio_acta: "",
      observaciones: "",
    },
  ];
}

export function buildCommitmentTemplateRows(): Record<
  string,
  string | number
>[] {
  return [
    {
      folio: "",
      descripcion: "Difundir política de convivencia en sedes.",
      responsable: "Secretaría CCL",
      vencimiento: "2026-04-30",
      fecha_cierre: "",
      estado: "Abierto",
      seguimiento: "",
      folio_acta: "",
      codigo_caso: "",
      observaciones: "",
    },
  ];
}
