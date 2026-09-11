import { computeDaysRemaining } from "@/lib/sg-sst/alerts/engine";
import type { SstWorkflowStatus } from "@/lib/sg-sst/alerts/types";
import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const COPASST_ROLES = [
  "presidente",
  "vicepresidente",
  "secretario",
  "representante_empleador",
  "representante_trabajadores",
  "suplente",
] as const;
export type CopasstRole = (typeof COPASST_ROLES)[number];

export const COPASST_MEMBER_STATUSES = [
  "activo",
  "retirado",
  "periodo_vencido",
] as const;
export type CopasstMemberStatus = (typeof COPASST_MEMBER_STATUSES)[number];

export const COPASST_MEMBER_MANUAL_STATUSES = ["activo", "retirado"] as const;
export type CopasstMemberManualStatus =
  (typeof COPASST_MEMBER_MANUAL_STATUSES)[number];

export const COPASST_MEETING_TYPES = ["ordinaria", "extraordinaria"] as const;
export type CopasstMeetingType = (typeof COPASST_MEETING_TYPES)[number];

export const COPASST_MEETING_STATUSES = [
  "programada",
  "realizada",
  "cancelada",
] as const;
export type CopasstMeetingStatus = (typeof COPASST_MEETING_STATUSES)[number];

export const COPASST_COMMITMENT_STATUSES = [
  "abierto",
  "vencido",
  "cerrado",
] as const;
export type CopasstCommitmentStatus =
  (typeof COPASST_COMMITMENT_STATUSES)[number];

/** Estados seleccionables en el formulario (vencido se deriva). */
export const COPASST_COMMITMENT_MANUAL_STATUSES = ["abierto", "cerrado"] as const;
export type CopasstCommitmentManualStatus =
  (typeof COPASST_COMMITMENT_MANUAL_STATUSES)[number];

export const COPASST_TRAINING_STATUSES = [
  "programada",
  "realizada",
  "cancelada",
] as const;
export type CopasstTrainingStatus = (typeof COPASST_TRAINING_STATUSES)[number];

export const COPASST_ROLE_LABELS: Record<CopasstRole, string> = {
  presidente: "Presidente",
  vicepresidente: "Vicepresidente",
  secretario: "Secretario",
  representante_empleador: "Representante empleador",
  representante_trabajadores: "Representante trabajadores",
  suplente: "Suplente",
};

export const COPASST_MEMBER_STATUS_LABELS: Record<CopasstMemberStatus, string> = {
  activo: "Activo",
  retirado: "Retirado",
  periodo_vencido: "Periodo vencido",
};

export const COPASST_MEETING_TYPE_LABELS: Record<CopasstMeetingType, string> = {
  ordinaria: "Ordinaria",
  extraordinaria: "Extraordinaria",
};

export const COPASST_MEETING_STATUS_LABELS: Record<
  CopasstMeetingStatus,
  string
> = {
  programada: "Programada",
  realizada: "Realizada",
  cancelada: "Cancelada",
};

export const COPASST_COMMITMENT_STATUS_LABELS: Record<
  CopasstCommitmentStatus,
  string
> = {
  abierto: "Abierto",
  vencido: "Vencido",
  cerrado: "Cerrado",
};

export const COPASST_TRAINING_STATUS_LABELS: Record<
  CopasstTrainingStatus,
  string
> = {
  programada: "Programada",
  realizada: "Realizada",
  cancelada: "Cancelada",
};

export type SstCopasstMember = {
  id: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  role: CopasstRole;
  periodLabel: string;
  startDate: string;
  endDate: string;
  status: CopasstMemberStatus;
  farmId: string | null;
  farmName: string | null;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstCopasstMemberDraft = {
  id?: string;
  workerId: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  role: CopasstRole;
  periodLabel: string;
  startDate: string;
  endDate: string;
  status: CopasstMemberManualStatus;
  farmId?: string | null;
  observations: string;
};

export type SstCopasstMemberView = SstCopasstMember & {
  daysRemaining: number | null;
  effectiveStatus: CopasstMemberStatus;
};

export type SstCopasstMeeting = {
  id: string;
  folio: string;
  meetingDate: string;
  meetingType: CopasstMeetingType;
  title: string;
  summary: string;
  actUrl: string;
  actName: string;
  nextMeetingDate: string | null;
  status: CopasstMeetingStatus;
  farmId: string | null;
  farmName: string | null;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstCopasstMeetingDraft = {
  id?: string;
  meetingDate: string;
  meetingType: CopasstMeetingType;
  title: string;
  summary: string;
  actUrl: string;
  actName: string;
  nextMeetingDate?: string | null;
  status: CopasstMeetingStatus;
  farmId?: string | null;
  observations: string;
};

export type SstCopasstCommitment = {
  id: string;
  folio: string;
  meetingId: string | null;
  meetingFolio: string | null;
  description: string;
  responsibleName: string;
  dueDate: string;
  closedAt: string | null;
  status: CopasstCommitmentStatus;
  followUp: string;
  evidenceUrl: string;
  evidenceName: string;
  farmId: string | null;
  farmName: string | null;
  complianceRecordId: string | null;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstCopasstCommitmentDraft = {
  id?: string;
  meetingId?: string | null;
  description: string;
  responsibleName: string;
  dueDate: string;
  closedAt?: string | null;
  status: CopasstCommitmentManualStatus;
  followUp: string;
  evidenceUrl: string;
  evidenceName: string;
  farmId?: string | null;
  observations: string;
};

export type SstCopasstCommitmentView = SstCopasstCommitment & {
  daysRemaining: number | null;
  effectiveStatus: CopasstCommitmentStatus;
};

export type SstCopasstTraining = {
  id: string;
  folio: string;
  title: string;
  trainingDate: string;
  hours: number;
  instructor: string;
  attendeesCount: number;
  evidenceUrl: string;
  evidenceName: string;
  status: CopasstTrainingStatus;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstCopasstTrainingDraft = {
  id?: string;
  title: string;
  trainingDate: string;
  hours: number;
  instructor: string;
  attendeesCount: number;
  evidenceUrl: string;
  evidenceName: string;
  status: CopasstTrainingStatus;
  observations: string;
};

export type CopasstStats = {
  periodEndDate: string | null;
  nextMeetingDate: string | null;
  meetingsDone: number;
  commitmentsOpen: number;
  commitmentsOverdue: number;
  membersActive: number;
  meetingsTotal: number;
  trainingsTotal: number;
};

export function isCopasstRole(value: string): value is CopasstRole {
  return (COPASST_ROLES as readonly string[]).includes(value);
}

export function isCopasstMemberStatus(
  value: string,
): value is CopasstMemberStatus {
  return (COPASST_MEMBER_STATUSES as readonly string[]).includes(value);
}

export function isCopasstMemberManualStatus(
  value: string,
): value is CopasstMemberManualStatus {
  return (COPASST_MEMBER_MANUAL_STATUSES as readonly string[]).includes(value);
}

export function isCopasstMeetingType(
  value: string,
): value is CopasstMeetingType {
  return (COPASST_MEETING_TYPES as readonly string[]).includes(value);
}

export function isCopasstMeetingStatus(
  value: string,
): value is CopasstMeetingStatus {
  return (COPASST_MEETING_STATUSES as readonly string[]).includes(value);
}

export function isCopasstCommitmentStatus(
  value: string,
): value is CopasstCommitmentStatus {
  return (COPASST_COMMITMENT_STATUSES as readonly string[]).includes(value);
}

export function isCopasstCommitmentManualStatus(
  value: string,
): value is CopasstCommitmentManualStatus {
  return (COPASST_COMMITMENT_MANUAL_STATUSES as readonly string[]).includes(
    value,
  );
}

export function isCopasstTrainingStatus(
  value: string,
): value is CopasstTrainingStatus {
  return (COPASST_TRAINING_STATUSES as readonly string[]).includes(value);
}

export function emptyMemberDraft(): SstCopasstMemberDraft {
  const today = new Date().toISOString().slice(0, 10);
  const year = new Date().getFullYear();
  return {
    workerId: "",
    companySnapshot: "",
    jobTitleSnapshot: "",
    role: "representante_trabajadores",
    periodLabel: `${year}-${year + 2}`,
    startDate: today,
    endDate: `${year + 2}-12-31`,
    status: "activo",
    farmId: null,
    observations: "",
  };
}

export function emptyMeetingDraft(): SstCopasstMeetingDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    meetingDate: today,
    meetingType: "ordinaria",
    title: "",
    summary: "",
    actUrl: "",
    actName: "",
    nextMeetingDate: "",
    status: "programada",
    farmId: null,
    observations: "",
  };
}

export function emptyCommitmentDraft(): SstCopasstCommitmentDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    meetingId: null,
    description: "",
    responsibleName: "",
    dueDate: today,
    closedAt: "",
    status: "abierto",
    followUp: "",
    evidenceUrl: "",
    evidenceName: "",
    farmId: null,
    observations: "",
  };
}

export function emptyTrainingDraft(): SstCopasstTrainingDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: "",
    trainingDate: today,
    hours: 2,
    instructor: "",
    attendeesCount: 0,
    evidenceUrl: "",
    evidenceName: "",
    status: "programada",
    observations: "",
  };
}

export function validateMemberDraft(
  input: SstCopasstMemberDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    if (!input.workerId.trim()) return "El trabajador es obligatorio.";
    return null;
  }

  if (!input.workerId.trim()) return "El trabajador es obligatorio.";
  if (!isCopasstRole(input.role)) return "Rol COPASST inválido.";
  if (!input.startDate.trim()) return "La fecha de inicio es obligatoria.";
  if (!input.endDate.trim()) return "La fecha de fin es obligatoria.";
  if (input.endDate < input.startDate) {
    return "La fecha de fin debe ser posterior al inicio.";
  }
  if (!isCopasstMemberManualStatus(input.status)) return "Estado inválido.";
  return null;
}

export function validateMeetingDraft(
  input: SstCopasstMeetingDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    if (!input.meetingDate.trim() && !input.title.trim()) {
      return "Fila sin fecha ni título.";
    }
    return null;
  }

  if (!input.meetingDate.trim()) return "La fecha de reunión es obligatoria.";
  if (!isCopasstMeetingType(input.meetingType)) {
    return "Tipo de reunión inválido.";
  }
  if (!input.title.trim()) return "El título / tema es obligatorio.";
  if (!isCopasstMeetingStatus(input.status)) return "Estado inválido.";
  return null;
}

export function validateCommitmentDraft(
  input: SstCopasstCommitmentDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    return null;
  }

  if (!input.description.trim()) return "La descripción es obligatoria.";
  if (!input.responsibleName.trim()) return "El responsable es obligatorio.";
  if (!input.dueDate.trim()) return "La fecha de vencimiento es obligatoria.";
  if (!isCopasstCommitmentManualStatus(input.status)) {
    return "Estado inválido.";
  }
  return null;
}

export function validateTrainingDraft(
  input: SstCopasstTrainingDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    if (!input.title.trim() && !input.trainingDate.trim()) {
      return "Fila sin título ni fecha.";
    }
    return null;
  }

  if (!input.title.trim()) return "El título es obligatorio.";
  if (!input.trainingDate.trim()) return "La fecha es obligatoria.";
  if (!Number.isFinite(input.hours) || input.hours < 0) {
    return "Las horas deben ser un número válido.";
  }
  if (
    !Number.isFinite(input.attendeesCount) ||
    input.attendeesCount < 0 ||
    !Number.isInteger(input.attendeesCount)
  ) {
    return "El número de asistentes es inválido.";
  }
  if (!isCopasstTrainingStatus(input.status)) return "Estado inválido.";
  return null;
}

export function normalizeMemberDraftForImport(
  draft: SstCopasstMemberDraft,
): SstCopasstMemberDraft {
  const defaults = emptyMemberDraft();
  const today = todayIsoDate();
  return {
    ...draft,
    role: isCopasstRole(draft.role) ? draft.role : defaults.role,
    startDate: draft.startDate.trim() || today,
    endDate: draft.endDate.trim() || defaults.endDate,
    status: isCopasstMemberManualStatus(draft.status)
      ? draft.status
      : defaults.status,
    periodLabel: draft.periodLabel.trim() || defaults.periodLabel,
  };
}

export function normalizeMeetingDraftForImport(
  draft: SstCopasstMeetingDraft,
): SstCopasstMeetingDraft {
  const defaults = emptyMeetingDraft();
  return {
    ...draft,
    meetingDate: draft.meetingDate.trim() || todayIsoDate(),
    title: draft.title.trim() || "Sin título",
    meetingType: isCopasstMeetingType(draft.meetingType)
      ? draft.meetingType
      : defaults.meetingType,
    status: isCopasstMeetingStatus(draft.status)
      ? draft.status
      : defaults.status,
  };
}

export function normalizeCommitmentDraftForImport(
  draft: SstCopasstCommitmentDraft,
): SstCopasstCommitmentDraft {
  const defaults = emptyCommitmentDraft();
  return {
    ...draft,
    description: draft.description.trim() || "Sin detalle",
    responsibleName: draft.responsibleName.trim() || "Sin responsable",
    dueDate: draft.dueDate.trim() || todayIsoDate(),
    status: isCopasstCommitmentManualStatus(draft.status)
      ? draft.status
      : defaults.status,
  };
}

export function normalizeTrainingDraftForImport(
  draft: SstCopasstTrainingDraft,
): SstCopasstTrainingDraft {
  const defaults = emptyTrainingDraft();
  return {
    ...draft,
    title: draft.title.trim() || "Sin título",
    trainingDate: draft.trainingDate.trim() || todayIsoDate(),
    hours: Number.isFinite(draft.hours) && draft.hours >= 0 ? draft.hours : defaults.hours,
    attendeesCount:
      Number.isFinite(draft.attendeesCount) && draft.attendeesCount >= 0
        ? Math.round(draft.attendeesCount)
        : 0,
    status: isCopasstTrainingStatus(draft.status)
      ? draft.status
      : defaults.status,
  };
}

export function deriveMemberStatus(
  stored: CopasstMemberStatus,
  endDate: string,
  today = new Date(),
): CopasstMemberStatus {
  if (stored === "retirado") return "retirado";
  const days = computeDaysRemaining(endDate, today);
  if (days !== null && days < 0) return "periodo_vencido";
  return "activo";
}

export function resolveMemberStatusToPersist(
  draft: SstCopasstMemberDraft,
  today = new Date(),
): CopasstMemberStatus {
  if (draft.status === "retirado") return "retirado";
  return deriveMemberStatus("activo", draft.endDate, today);
}

export function deriveCommitmentStatus(
  stored: CopasstCommitmentStatus,
  dueDate: string,
  today = new Date(),
): CopasstCommitmentStatus {
  if (stored === "cerrado") return "cerrado";
  const days = computeDaysRemaining(dueDate, today);
  if (days !== null && days < 0) return "vencido";
  return "abierto";
}

export function resolveCommitmentStatusToPersist(
  draft: SstCopasstCommitmentDraft,
  today = new Date(),
): CopasstCommitmentStatus {
  if (draft.status === "cerrado") return "cerrado";
  return deriveCommitmentStatus("abierto", draft.dueDate, today);
}

export function toCommitmentComplianceWorkflow(
  status: CopasstCommitmentStatus,
): SstWorkflowStatus {
  if (status === "cerrado") return "closed";
  if (status === "vencido") return "pending_closure";
  return "open";
}

export function enrichMemberAsView(
  item: SstCopasstMember,
  today = new Date(),
): SstCopasstMemberView {
  return {
    ...item,
    daysRemaining: computeDaysRemaining(item.endDate, today),
    effectiveStatus: deriveMemberStatus(item.status, item.endDate, today),
  };
}

export function enrichCommitmentAsView(
  item: SstCopasstCommitment,
  today = new Date(),
): SstCopasstCommitmentView {
  return {
    ...item,
    daysRemaining: computeDaysRemaining(item.dueDate, today),
    effectiveStatus: deriveCommitmentStatus(item.status, item.dueDate, today),
  };
}

export function toMemberManualStatus(
  status: CopasstMemberStatus,
): CopasstMemberManualStatus {
  return status === "retirado" ? "retirado" : "activo";
}

export function toCommitmentManualStatus(
  status: CopasstCommitmentStatus,
): CopasstCommitmentManualStatus {
  return status === "cerrado" ? "cerrado" : "abierto";
}

export function draftFromMember(item: SstCopasstMember): SstCopasstMemberDraft {
  return {
    id: item.id,
    workerId: item.workerId,
    companySnapshot: item.companySnapshot,
    jobTitleSnapshot: item.jobTitleSnapshot,
    role: item.role,
    periodLabel: item.periodLabel,
    startDate: item.startDate,
    endDate: item.endDate,
    status: toMemberManualStatus(item.status),
    farmId: item.farmId,
    observations: item.observations,
  };
}

export function draftFromMeeting(
  item: SstCopasstMeeting,
): SstCopasstMeetingDraft {
  return {
    id: item.id,
    meetingDate: item.meetingDate,
    meetingType: item.meetingType,
    title: item.title,
    summary: item.summary,
    actUrl: item.actUrl,
    actName: item.actName,
    nextMeetingDate: item.nextMeetingDate ?? "",
    status: item.status,
    farmId: item.farmId,
    observations: item.observations,
  };
}

export function draftFromCommitment(
  item: SstCopasstCommitment,
): SstCopasstCommitmentDraft {
  return {
    id: item.id,
    meetingId: item.meetingId,
    description: item.description,
    responsibleName: item.responsibleName,
    dueDate: item.dueDate,
    closedAt: item.closedAt ?? "",
    status: toCommitmentManualStatus(item.status),
    followUp: item.followUp,
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
    farmId: item.farmId,
    observations: item.observations,
  };
}

export function draftFromTraining(
  item: SstCopasstTraining,
): SstCopasstTrainingDraft {
  return {
    id: item.id,
    title: item.title,
    trainingDate: item.trainingDate,
    hours: item.hours,
    instructor: item.instructor,
    attendeesCount: item.attendeesCount,
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
    status: item.status,
    observations: item.observations,
  };
}

function normalizeLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function parseCopasstRoleLabel(raw: string): CopasstRole | null {
  const normalized = normalizeLabel(raw);
  if (isCopasstRole(normalized)) return normalized;
  const map: Record<string, CopasstRole> = {
    presidente: "presidente",
    vicepresidente: "vicepresidente",
    "vice presidente": "vicepresidente",
    secretario: "secretario",
    "representante empleador": "representante_empleador",
    "rep empleador": "representante_empleador",
    empleador: "representante_empleador",
    "representante trabajadores": "representante_trabajadores",
    "rep trabajadores": "representante_trabajadores",
    trabajadores: "representante_trabajadores",
    suplente: "suplente",
  };
  return map[normalized] ?? null;
}

export function parseMemberStatusLabel(
  raw: string,
): CopasstMemberStatus | null {
  const normalized = normalizeLabel(raw);
  if (isCopasstMemberStatus(normalized)) return normalized;
  const map: Record<string, CopasstMemberStatus> = {
    activo: "activo",
    activos: "activo",
    retirado: "retirado",
    retirados: "retirado",
    "periodo vencido": "periodo_vencido",
    periodo_vencido: "periodo_vencido",
    vencido: "periodo_vencido",
  };
  return map[normalized] ?? null;
}

export function parseMeetingTypeLabel(raw: string): CopasstMeetingType | null {
  const normalized = normalizeLabel(raw);
  if (isCopasstMeetingType(normalized)) return normalized;
  const map: Record<string, CopasstMeetingType> = {
    ordinaria: "ordinaria",
    extraordinaria: "extraordinaria",
  };
  return map[normalized] ?? null;
}

export function parseMeetingStatusLabel(
  raw: string,
): CopasstMeetingStatus | null {
  const normalized = normalizeLabel(raw);
  if (isCopasstMeetingStatus(normalized)) return normalized;
  const map: Record<string, CopasstMeetingStatus> = {
    programada: "programada",
    programado: "programada",
    realizada: "realizada",
    realizado: "realizada",
    cancelada: "cancelada",
    cancelado: "cancelada",
  };
  return map[normalized] ?? null;
}

export function parseCommitmentStatusLabel(
  raw: string,
): CopasstCommitmentStatus | null {
  const normalized = normalizeLabel(raw);
  if (isCopasstCommitmentStatus(normalized)) return normalized;
  const map: Record<string, CopasstCommitmentStatus> = {
    abierto: "abierto",
    abiertos: "abierto",
    vencido: "vencido",
    vencidos: "vencido",
    cerrado: "cerrado",
    cerrados: "cerrado",
  };
  return map[normalized] ?? null;
}

export function parseTrainingStatusLabel(
  raw: string,
): CopasstTrainingStatus | null {
  const parsed = parseMeetingStatusLabel(raw);
  if (!parsed) return null;
  return isCopasstTrainingStatus(parsed) ? parsed : null;
}
