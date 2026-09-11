import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";

export const LEAVE_ORIGINS = [
  "comun",
  "laboral_at",
  "laboral_el",
  "maternidad",
  "transito",
] as const;
export type LeaveOrigin = (typeof LEAVE_ORIGINS)[number];

export const LEAVE_STATUSES = [
  "activa",
  "por_vencer",
  "vencida_sin_cierre",
  "cerrada",
  "en_reintegro",
] as const;
export type LeaveStatus = (typeof LEAVE_STATUSES)[number];

export const REINTEGRATION_STATUSES = [
  "no_aplica",
  "pendiente",
  "programado",
  "completado",
] as const;
export type ReintegrationStatus = (typeof REINTEGRATION_STATUSES)[number];

export const LEAVE_ORIGIN_LABELS: Record<LeaveOrigin, string> = {
  comun: "Común (EPS)",
  laboral_at: "Laboral AT (ARL)",
  laboral_el: "Laboral EL (ARL)",
  maternidad: "Maternidad",
  transito: "Tránsito",
};

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  activa: "Activa",
  por_vencer: "Por vencer",
  vencida_sin_cierre: "Vencida sin cierre",
  cerrada: "Cerrada",
  en_reintegro: "En reintegro",
};

export const REINTEGRATION_STATUS_LABELS: Record<ReintegrationStatus, string> = {
  no_aplica: "No aplica",
  pendiente: "Pendiente",
  programado: "Programado",
  completado: "Completado",
};

export type SstLeave = {
  id: string;
  folio: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  workerStatus: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  farmId: string | null;
  farmName: string | null;
  startDate: string;
  endDate: string;
  daysOrdered: number;
  origin: LeaveOrigin;
  isExtension: boolean;
  accumulatedDays: number;
  status: LeaveStatus;
  sstFollowUp: string;
  reintegrationRequired: boolean;
  reintegrationDate: string | null;
  reintegrationStatus: ReintegrationStatus;
  cie10: string;
  diagnosisLabel: string;
  issuer: string;
  adminObservations: string;
  evidenceUrl: string;
  evidenceName: string;
  complianceRecordId: string | null;
  reintegrationComplianceId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstLeaveDraft = {
  id?: string;
  workerId: string;
  startDate: string;
  endDate: string;
  daysOrdered?: number;
  origin: LeaveOrigin;
  isExtension: boolean;
  accumulatedDays?: number;
  status?: LeaveStatus;
  sstFollowUp: string;
  reintegrationRequired?: boolean | null;
  reintegrationDate?: string | null;
  reintegrationStatus?: ReintegrationStatus;
  cie10: string;
  diagnosisLabel: string;
  issuer: string;
  adminObservations: string;
  evidenceUrl: string;
  evidenceName: string;
};

export type SstLeaveView = SstLeave & {
  daysRemaining: number;
};

export type LeaveAlertStats = {
  vencidaSinCierre: number;
  terminaEn3: number;
  terminaEn7: number;
  prorrogas: number;
  reintegroPendiente: number;
};

export type LeaveStats = {
  total: number;
  totalDays: number;
  byStatus: Record<LeaveStatus, number>;
  byOrigin: Record<LeaveOrigin, number>;
  daysByOrigin: Record<LeaveOrigin, number>;
  alerts: LeaveAlertStats;
};

export type LeaveWorkerRanking = {
  workerId: string;
  workerName: string;
  workerDocument: string;
  jobTitle: string;
  farmName: string | null;
  accumulatedDays: number;
  leaveCount: number;
  dominantOrigin: LeaveOrigin;
};

export function isLeaveOrigin(value: string): value is LeaveOrigin {
  return (LEAVE_ORIGINS as readonly string[]).includes(value);
}

export function isLeaveStatus(value: string): value is LeaveStatus {
  return (LEAVE_STATUSES as readonly string[]).includes(value);
}

export function isReintegrationStatus(value: string): value is ReintegrationStatus {
  return (REINTEGRATION_STATUSES as readonly string[]).includes(value);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Inclusive calendar days between two ISO dates (YYYY-MM-DD). */
export function daysBetween(startIso: string, endIso: string): number {
  const start = parseDateOnly(startIso);
  const end = parseDateOnly(endIso);
  const ms = startOfDay(end).getTime() - startOfDay(start).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

export function computeDaysOrdered(startDate: string, endDate: string): number {
  if (!startDate.trim() || !endDate.trim()) return 0;
  const days = daysBetween(startDate.trim(), endDate.trim());
  return days > 0 ? days : 0;
}

export function computeDaysRemaining(endDate: string, today = new Date()): number {
  return Math.round(
    (startOfDay(parseDateOnly(endDate)).getTime() - startOfDay(today).getTime()) /
      86_400_000,
  );
}

/**
 * Derives operational status from end date and reintegration flags.
 * Preserves explicit `cerrada`; otherwise recalculates from dates.
 */
export function deriveLeaveStatus(input: {
  endDate: string;
  reintegrationRequired: boolean;
  reintegrationStatus: ReintegrationStatus;
  explicitStatus?: LeaveStatus | null;
  today?: Date;
}): LeaveStatus {
  if (input.explicitStatus === "cerrada") {
    return "cerrada";
  }

  const remaining = computeDaysRemaining(input.endDate, input.today ?? new Date());

  if (
    input.reintegrationRequired &&
    input.reintegrationStatus !== "completado" &&
    input.reintegrationStatus !== "no_aplica" &&
    remaining < 0
  ) {
    return "en_reintegro";
  }

  if (input.explicitStatus === "en_reintegro") {
    return "en_reintegro";
  }

  if (remaining < 0) {
    return "vencida_sin_cierre";
  }
  if (remaining <= 7) {
    return "por_vencer";
  }
  return "activa";
}

export function resolveReintegrationRequired(input: {
  daysOrdered: number;
  accumulatedDays: number;
  reintegrationRequired?: boolean | null;
}): boolean {
  if (input.reintegrationRequired === true) return true;
  if (input.reintegrationRequired === false) return false;
  return input.daysOrdered > 15 || input.accumulatedDays > 15;
}

export function emptyLeaveDraft(workerId = ""): SstLeaveDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    workerId,
    startDate: today,
    endDate: today,
    daysOrdered: 1,
    origin: "comun",
    isExtension: false,
    accumulatedDays: 1,
    status: "activa",
    sstFollowUp: "",
    reintegrationRequired: null,
    reintegrationDate: "",
    reintegrationStatus: "no_aplica",
    cie10: "",
    diagnosisLabel: "",
    issuer: "",
    adminObservations: "",
    evidenceUrl: "",
    evidenceName: "",
  };
}

export function validateLeaveDraft(
  input: SstLeaveDraft,
  mode: DraftValidationMode = "form",
): string | null {
  // Importación Excel: solo workerId; defaults cubren el resto.
  if (mode === "import") {
    if (!input.workerId.trim()) {
      return "Selecciona un trabajador de la base maestra.";
    }
    return null;
  }
  if (!input.workerId.trim()) {
    return "Selecciona un trabajador de la base maestra.";
  }
  if (!input.startDate.trim()) {
    return "La fecha de inicio es obligatoria.";
  }
  if (!input.endDate.trim()) {
    return "La fecha final es obligatoria.";
  }
  if (input.endDate < input.startDate) {
    return "La fecha final no puede ser anterior al inicio.";
  }
  if (!isLeaveOrigin(input.origin)) {
    return "Origen de incapacidad inválido.";
  }
  if (
    input.reintegrationStatus != null &&
    !isReintegrationStatus(input.reintegrationStatus)
  ) {
    return "Estado de reintegro inválido.";
  }
  if (input.status != null && !isLeaveStatus(input.status)) {
    return "Estado inválido.";
  }
  return null;
}

export function enrichLeaveAsView(leave: SstLeave, today = new Date()): SstLeaveView {
  return {
    ...leave,
    daysRemaining: computeDaysRemaining(leave.endDate, today),
  };
}

export function computeLeaveAlertStats(
  leaves: readonly SstLeaveView[],
): LeaveAlertStats {
  const alerts: LeaveAlertStats = {
    vencidaSinCierre: 0,
    terminaEn3: 0,
    terminaEn7: 0,
    prorrogas: 0,
    reintegroPendiente: 0,
  };

  for (const leave of leaves) {
    if (leave.status === "cerrada") continue;

    if (leave.status === "vencida_sin_cierre") {
      alerts.vencidaSinCierre += 1;
    }
    if (leave.daysRemaining >= 0 && leave.daysRemaining <= 3) {
      alerts.terminaEn3 += 1;
    } else if (leave.daysRemaining > 3 && leave.daysRemaining <= 7) {
      alerts.terminaEn7 += 1;
    }
    if (leave.isExtension) {
      alerts.prorrogas += 1;
    }
    if (
      leave.reintegrationRequired &&
      leave.reintegrationStatus !== "completado" &&
      leave.reintegrationStatus !== "no_aplica"
    ) {
      alerts.reintegroPendiente += 1;
    }
  }

  return alerts;
}

export function parseLeaveOriginLabel(raw: string): LeaveOrigin | null {
  const normalized = raw.trim().toLowerCase();
  if (isLeaveOrigin(normalized)) return normalized;
  const map: Record<string, LeaveOrigin> = {
    comun: "comun",
    común: "comun",
    "comun (eps)": "comun",
    "común (eps)": "comun",
    eps: "comun",
    laboral: "laboral_at",
    "laboral at": "laboral_at",
    "laboral_at": "laboral_at",
    at: "laboral_at",
    "laboral el": "laboral_el",
    "laboral_el": "laboral_el",
    el: "laboral_el",
    maternidad: "maternidad",
    transito: "transito",
    tránsito: "transito",
  };
  return map[normalized] ?? null;
}

export function parseLeaveStatusLabel(raw: string): LeaveStatus | null {
  const normalized = raw.trim().toLowerCase();
  if (isLeaveStatus(normalized)) return normalized;
  const map: Record<string, LeaveStatus> = {
    activa: "activa",
    "por vencer": "por_vencer",
    por_vencer: "por_vencer",
    "vencida sin cierre": "vencida_sin_cierre",
    vencida_sin_cierre: "vencida_sin_cierre",
    cerrada: "cerrada",
    "en reintegro": "en_reintegro",
    en_reintegro: "en_reintegro",
  };
  return map[normalized] ?? null;
}

export function parseReintegrationStatusLabel(raw: string): ReintegrationStatus | null {
  const normalized = raw.trim().toLowerCase();
  if (isReintegrationStatus(normalized)) return normalized;
  const map: Record<string, ReintegrationStatus> = {
    "no aplica": "no_aplica",
    no_aplica: "no_aplica",
    pendiente: "pendiente",
    programado: "programado",
    completado: "completado",
  };
  return map[normalized] ?? null;
}

export function parseYesNo(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  return ["si", "sí", "yes", "true", "1"].includes(v);
}
