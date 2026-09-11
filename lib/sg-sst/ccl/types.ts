import { computeDaysRemaining } from "@/lib/sg-sst/alerts/engine";
import type { SstWorkflowStatus } from "@/lib/sg-sst/alerts/types";

/* ─── Roles & statuses ─────────────────────────────────────────────────── */

export const CCL_MEMBER_ROLES = [
  "presidente",
  "secretario",
  "representante_empleador",
  "representante_trabajadores",
  "suplente",
] as const;
export type CclMemberRole = (typeof CCL_MEMBER_ROLES)[number];

export const CCL_MEMBER_STATUSES = [
  "activo",
  "retirado",
  "periodo_vencido",
] as const;
export type CclMemberStatus = (typeof CCL_MEMBER_STATUSES)[number];

export const CCL_MEETING_TYPES = ["ordinaria", "extraordinaria"] as const;
export type CclMeetingType = (typeof CCL_MEETING_TYPES)[number];

export const CCL_MEETING_STATUSES = [
  "programada",
  "realizada",
  "cancelada",
] as const;
export type CclMeetingStatus = (typeof CCL_MEETING_STATUSES)[number];

export const CCL_CASE_STATUSES = [
  "abierto",
  "en_tramite",
  "seguimiento",
  "cerrado",
  "archivado",
] as const;
export type CclCaseStatus = (typeof CCL_CASE_STATUSES)[number];

/** Estados seleccionables; vencido se deriva de due_date. */
export const CCL_COMMITMENT_MANUAL_STATUSES = ["abierto", "cerrado"] as const;
export type CclCommitmentManualStatus =
  (typeof CCL_COMMITMENT_MANUAL_STATUSES)[number];

export const CCL_COMMITMENT_STATUSES = [
  "abierto",
  "vencido",
  "cerrado",
] as const;
export type CclCommitmentStatus = (typeof CCL_COMMITMENT_STATUSES)[number];

export const CCL_MEMBER_ROLE_LABELS: Record<CclMemberRole, string> = {
  presidente: "Presidente",
  secretario: "Secretario",
  representante_empleador: "Representante empleador",
  representante_trabajadores: "Representante trabajadores",
  suplente: "Suplente",
};

export const CCL_MEMBER_STATUS_LABELS: Record<CclMemberStatus, string> = {
  activo: "Activo",
  retirado: "Retirado",
  periodo_vencido: "Periodo vencido",
};

export const CCL_MEETING_TYPE_LABELS: Record<CclMeetingType, string> = {
  ordinaria: "Ordinaria",
  extraordinaria: "Extraordinaria",
};

export const CCL_MEETING_STATUS_LABELS: Record<CclMeetingStatus, string> = {
  programada: "Programada",
  realizada: "Realizada",
  cancelada: "Cancelada",
};

export const CCL_CASE_STATUS_LABELS: Record<CclCaseStatus, string> = {
  abierto: "Abierto",
  en_tramite: "En trámite",
  seguimiento: "Seguimiento",
  cerrado: "Cerrado",
  archivado: "Archivado",
};

export const CCL_COMMITMENT_STATUS_LABELS: Record<CclCommitmentStatus, string> =
  {
    abierto: "Abierto",
    vencido: "Vencido",
    cerrado: "Cerrado",
  };

/* ─── Entities ─────────────────────────────────────────────────────────── */

export type SstCclMember = {
  id: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  role: CclMemberRole;
  periodLabel: string;
  startDate: string;
  endDate: string;
  status: CclMemberStatus;
  farmId: string | null;
  farmName: string | null;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstCclMemberDraft = {
  id?: string;
  workerId: string;
  role: CclMemberRole;
  periodLabel: string;
  startDate: string;
  endDate: string;
  status: CclMemberStatus;
  farmId?: string | null;
  observations: string;
};

export type SstCclMeeting = {
  id: string;
  folio: string;
  meetingDate: string;
  meetingType: CclMeetingType;
  title: string;
  summary: string;
  actUrl: string;
  actName: string;
  status: CclMeetingStatus;
  farmId: string | null;
  farmName: string | null;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstCclMeetingDraft = {
  id?: string;
  meetingDate: string;
  meetingType: CclMeetingType;
  title: string;
  summary: string;
  actUrl: string;
  actName: string;
  status: CclMeetingStatus;
  farmId?: string | null;
  observations: string;
};

/**
 * Caso CCL — solo trazabilidad administrativa.
 * Nunca identidades, testimonios ni narrativas sensibles en listados/dashboard.
 */
export type SstCclCase = {
  id: string;
  code: string;
  openedAt: string;
  dueDate: string | null;
  closedAt: string | null;
  status: CclCaseStatus;
  activitySummary: string;
  followUp: string;
  meetingId: string | null;
  meetingFolio: string | null;
  complianceRecordId: string | null;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstCclCaseDraft = {
  id?: string;
  openedAt: string;
  dueDate?: string | null;
  closedAt?: string | null;
  status: CclCaseStatus;
  activitySummary: string;
  followUp: string;
  meetingId?: string | null;
  observations: string;
};

export type SstCclCaseView = SstCclCase & {
  daysRemaining: number | null;
};

export type SstCclCommitment = {
  id: string;
  folio: string;
  meetingId: string | null;
  meetingFolio: string | null;
  caseId: string | null;
  caseCode: string | null;
  description: string;
  responsibleName: string;
  dueDate: string;
  closedAt: string | null;
  status: CclCommitmentStatus;
  followUp: string;
  complianceRecordId: string | null;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstCclCommitmentDraft = {
  id?: string;
  meetingId?: string | null;
  caseId?: string | null;
  description: string;
  responsibleName: string;
  dueDate: string;
  closedAt?: string | null;
  status: CclCommitmentManualStatus;
  followUp: string;
  observations: string;
};

export type SstCclCommitmentView = SstCclCommitment & {
  daysRemaining: number | null;
  effectiveStatus: CclCommitmentStatus;
};

export type CclStats = {
  vigenciaLabel: string;
  vigenciaDetail: string;
  casosAbiertos: number;
  casosEnTramite: number;
  compromisosAbiertos: number;
  actasPeriodo: number;
  miembrosActivos: number;
};

/* ─── Guards ───────────────────────────────────────────────────────────── */

export function isCclMemberRole(value: string): value is CclMemberRole {
  return (CCL_MEMBER_ROLES as readonly string[]).includes(value);
}

export function isCclMemberStatus(value: string): value is CclMemberStatus {
  return (CCL_MEMBER_STATUSES as readonly string[]).includes(value);
}

export function isCclMeetingType(value: string): value is CclMeetingType {
  return (CCL_MEETING_TYPES as readonly string[]).includes(value);
}

export function isCclMeetingStatus(value: string): value is CclMeetingStatus {
  return (CCL_MEETING_STATUSES as readonly string[]).includes(value);
}

export function isCclCaseStatus(value: string): value is CclCaseStatus {
  return (CCL_CASE_STATUSES as readonly string[]).includes(value);
}

export function isCclCommitmentStatus(
  value: string,
): value is CclCommitmentStatus {
  return (CCL_COMMITMENT_STATUSES as readonly string[]).includes(value);
}

export function isCclCommitmentManualStatus(
  value: string,
): value is CclCommitmentManualStatus {
  return (CCL_COMMITMENT_MANUAL_STATUSES as readonly string[]).includes(value);
}

export function isCaseClosedLike(status: CclCaseStatus): boolean {
  return status === "cerrado" || status === "archivado";
}

/* ─── Derivation ───────────────────────────────────────────────────────── */

export function deriveMemberStatus(
  stored: CclMemberStatus,
  endDate: string,
  today = new Date(),
): CclMemberStatus {
  if (stored === "retirado") return "retirado";
  const days = computeDaysRemaining(endDate, today);
  if (days !== null && days < 0) return "periodo_vencido";
  return stored === "periodo_vencido" ? "activo" : stored;
}

export function deriveCommitmentStatus(
  stored: CclCommitmentStatus | CclCommitmentManualStatus,
  dueDate: string,
  today = new Date(),
): CclCommitmentStatus {
  if (stored === "cerrado") return "cerrado";
  const days = computeDaysRemaining(dueDate, today);
  if (days !== null && days < 0) return "vencido";
  return "abierto";
}

export function toCaseComplianceWorkflow(
  status: CclCaseStatus,
): SstWorkflowStatus {
  if (isCaseClosedLike(status)) return "closed";
  if (status === "en_tramite" || status === "seguimiento") return "in_progress";
  return "open";
}

export function toCommitmentComplianceWorkflow(
  status: CclCommitmentStatus,
): SstWorkflowStatus {
  if (status === "cerrado") return "closed";
  if (status === "vencido") return "pending_closure";
  return "open";
}

export function enrichCaseAsView(
  item: SstCclCase,
  today = new Date(),
): SstCclCaseView {
  return {
    ...item,
    daysRemaining: item.dueDate
      ? computeDaysRemaining(item.dueDate, today)
      : null,
  };
}

export function enrichCommitmentAsView(
  item: SstCclCommitment,
  today = new Date(),
): SstCclCommitmentView {
  const effectiveStatus = deriveCommitmentStatus(
    item.status,
    item.dueDate,
    today,
  );
  return {
    ...item,
    daysRemaining: computeDaysRemaining(item.dueDate, today),
    effectiveStatus,
  };
}

/* ─── Drafts / validation ──────────────────────────────────────────────── */

export function emptyMemberDraft(): SstCclMemberDraft {
  const year = new Date().getFullYear();
  return {
    workerId: "",
    role: "representante_trabajadores",
    periodLabel: `${year} - ${year + 2}`,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: `${year + 2}-12-31`,
    status: "activo",
    farmId: null,
    observations: "",
  };
}

export function emptyMeetingDraft(): SstCclMeetingDraft {
  return {
    meetingDate: new Date().toISOString().slice(0, 10),
    meetingType: "ordinaria",
    title: "",
    summary: "",
    actUrl: "",
    actName: "",
    status: "realizada",
    farmId: null,
    observations: "",
  };
}

export function emptyCaseDraft(): SstCclCaseDraft {
  return {
    openedAt: new Date().toISOString().slice(0, 10),
    dueDate: "",
    closedAt: "",
    status: "abierto",
    activitySummary: "En trámite · Término legal",
    followUp: "",
    meetingId: null,
    observations: "",
  };
}

export function emptyCommitmentDraft(): SstCclCommitmentDraft {
  return {
    meetingId: null,
    caseId: null,
    description: "",
    responsibleName: "",
    dueDate: new Date().toISOString().slice(0, 10),
    closedAt: "",
    status: "abierto",
    followUp: "",
    observations: "",
  };
}

export function draftFromMember(item: SstCclMember): SstCclMemberDraft {
  return {
    id: item.id,
    workerId: item.workerId,
    role: item.role,
    periodLabel: item.periodLabel,
    startDate: item.startDate,
    endDate: item.endDate,
    status: item.status === "periodo_vencido" ? "activo" : item.status,
    farmId: item.farmId,
    observations: item.observations,
  };
}

export function draftFromMeeting(item: SstCclMeeting): SstCclMeetingDraft {
  return {
    id: item.id,
    meetingDate: item.meetingDate,
    meetingType: item.meetingType,
    title: item.title,
    summary: item.summary,
    actUrl: item.actUrl,
    actName: item.actName,
    status: item.status,
    farmId: item.farmId,
    observations: item.observations,
  };
}

export function draftFromCase(item: SstCclCase): SstCclCaseDraft {
  return {
    id: item.id,
    openedAt: item.openedAt,
    dueDate: item.dueDate ?? "",
    closedAt: item.closedAt ?? "",
    status: item.status,
    activitySummary: item.activitySummary,
    followUp: item.followUp,
    meetingId: item.meetingId,
    observations: item.observations,
  };
}

export function draftFromCommitment(
  item: SstCclCommitment,
): SstCclCommitmentDraft {
  return {
    id: item.id,
    meetingId: item.meetingId,
    caseId: item.caseId,
    description: item.description,
    responsibleName: item.responsibleName,
    dueDate: item.dueDate,
    closedAt: item.closedAt ?? "",
    status: item.status === "cerrado" ? "cerrado" : "abierto",
    followUp: item.followUp,
    observations: item.observations,
  };
}

export function validateMemberDraft(input: SstCclMemberDraft): string | null {
  if (!input.workerId.trim()) return "Seleccione el trabajador integrante.";
  if (!isCclMemberRole(input.role)) return "Rol inválido.";
  if (!input.startDate.trim()) return "La fecha de inicio es obligatoria.";
  if (!input.endDate.trim()) return "La fecha de fin es obligatoria.";
  if (input.endDate < input.startDate) {
    return "La fecha de fin debe ser posterior al inicio.";
  }
  if (!isCclMemberStatus(input.status) || input.status === "periodo_vencido") {
    return "Estado inválido.";
  }
  return null;
}

export function validateMeetingDraft(input: SstCclMeetingDraft): string | null {
  if (!input.meetingDate.trim()) return "La fecha de la acta es obligatoria.";
  if (!isCclMeetingType(input.meetingType)) return "Tipo de reunión inválido.";
  if (!input.title.trim()) return "El título es obligatorio.";
  if (!isCclMeetingStatus(input.status)) return "Estado inválido.";
  return null;
}

export function validateCaseDraft(input: SstCclCaseDraft): string | null {
  if (!input.openedAt.trim()) return "La fecha de apertura es obligatoria.";
  if (!isCclCaseStatus(input.status)) return "Estado inválido.";
  if (!input.activitySummary.trim()) {
    return "El resumen de actividad (etiqueta paramétrica) es obligatorio.";
  }
  if (input.activitySummary.trim().length > 200) {
    return "El resumen de actividad no puede superar 200 caracteres.";
  }
  if (isCaseClosedLike(input.status) && !input.closedAt?.trim()) {
    return "Indique fecha de cierre para casos cerrado/archivado.";
  }
  return null;
}

export function validateCommitmentDraft(
  input: SstCclCommitmentDraft,
): string | null {
  if (!input.description.trim()) return "La descripción es obligatoria.";
  if (!input.responsibleName.trim()) return "El responsable es obligatorio.";
  if (!input.dueDate.trim()) return "La fecha de vencimiento es obligatoria.";
  if (!isCclCommitmentManualStatus(input.status)) return "Estado inválido.";
  return null;
}

/* ─── Label parsers (Excel) ────────────────────────────────────────────── */

function normalizeLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function parseMemberRoleLabel(raw: string): CclMemberRole | null {
  const n = normalizeLabel(raw);
  if (isCclMemberRole(n)) return n;
  const map: Record<string, CclMemberRole> = {
    presidente: "presidente",
    presidenta: "presidente",
    secretario: "secretario",
    secretaria: "secretario",
    "representante empleador": "representante_empleador",
    "rep empleador": "representante_empleador",
    "representante trabajadores": "representante_trabajadores",
    "rep trabajadores": "representante_trabajadores",
    suplente: "suplente",
  };
  return map[n] ?? null;
}

export function parseMemberStatusLabel(raw: string): CclMemberStatus | null {
  const n = normalizeLabel(raw);
  if (isCclMemberStatus(n)) return n;
  const map: Record<string, CclMemberStatus> = {
    activo: "activo",
    activa: "activo",
    retirado: "retirado",
    retirada: "retirado",
    "periodo vencido": "periodo_vencido",
    vencido: "periodo_vencido",
  };
  return map[n] ?? null;
}

export function parseMeetingTypeLabel(raw: string): CclMeetingType | null {
  const n = normalizeLabel(raw);
  if (isCclMeetingType(n)) return n;
  const map: Record<string, CclMeetingType> = {
    ordinaria: "ordinaria",
    extraordinaria: "extraordinaria",
  };
  return map[n] ?? null;
}

export function parseMeetingStatusLabel(raw: string): CclMeetingStatus | null {
  const n = normalizeLabel(raw);
  if (isCclMeetingStatus(n)) return n;
  const map: Record<string, CclMeetingStatus> = {
    programada: "programada",
    realizada: "realizada",
    cancelada: "cancelada",
  };
  return map[n] ?? null;
}

export function parseCaseStatusLabel(raw: string): CclCaseStatus | null {
  const n = normalizeLabel(raw);
  if (isCclCaseStatus(n)) return n;
  const map: Record<string, CclCaseStatus> = {
    abierto: "abierto",
    abierta: "abierto",
    "en tramite": "en_tramite",
    en_tramite: "en_tramite",
    tramite: "en_tramite",
    seguimiento: "seguimiento",
    cerrado: "cerrado",
    cerrada: "cerrado",
    archivado: "archivado",
    archivada: "archivado",
  };
  return map[n] ?? null;
}

export function parseCommitmentStatusLabel(
  raw: string,
): CclCommitmentStatus | null {
  const n = normalizeLabel(raw);
  if (isCclCommitmentStatus(n)) return n;
  const map: Record<string, CclCommitmentStatus> = {
    abierto: "abierto",
    abierta: "abierto",
    vencido: "vencido",
    vencida: "vencido",
    cerrado: "cerrado",
    cerrada: "cerrado",
  };
  return map[n] ?? null;
}
