import {
  computeDaysRemaining,
  computeSemaphore,
} from "@/lib/sg-sst/alerts/engine";
import {
  DEFAULT_ALERT_THRESHOLDS,
  type SstSemaphoreLevel,
  type SstWorkflowStatus,
} from "@/lib/sg-sst/alerts/types";

export const RESTRICTION_KINDS = [
  "restriccion",
  "recomendacion",
  "post_incapacidad",
  "definitiva_reubicacion",
] as const;
export type RestrictionKind = (typeof RESTRICTION_KINDS)[number];

export const RESTRICTION_STATUSES = [
  "vigente",
  "proxima_vencer",
  "vencida",
  "pendiente_implementacion",
  "cerrada",
] as const;
export type RestrictionStatus = (typeof RESTRICTION_STATUSES)[number];

/** Estados seleccionables manualmente en el formulario. */
export const RESTRICTION_MANUAL_STATUSES = [
  "vigente",
  "pendiente_implementacion",
  "cerrada",
] as const;
export type RestrictionManualStatus = (typeof RESTRICTION_MANUAL_STATUSES)[number];

export const RESTRICTION_KIND_LABELS: Record<RestrictionKind, string> = {
  restriccion: "Restricción",
  recomendacion: "Recomendación",
  post_incapacidad: "Post incapacidad",
  definitiva_reubicacion: "Definitiva / reubicación",
};

export const RESTRICTION_STATUS_LABELS: Record<RestrictionStatus, string> = {
  vigente: "Vigente",
  proxima_vencer: "Próxima a vencer",
  vencida: "Vencida",
  pendiente_implementacion: "Pendiente implementación",
  cerrada: "Cerrada",
};

export type SstRestriction = {
  id: string;
  folio: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  workerStatus: string;
  restrictionKind: RestrictionKind;
  issuedAt: string;
  startDate: string;
  dueDate: string | null;
  detail: string;
  issuer: string;
  responsibleName: string;
  measureImplemented: string;
  implementedAt: string | null;
  status: RestrictionStatus;
  nextFollowUp: string | null;
  observations: string;
  evidenceUrl: string;
  evidenceName: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  farmId: string | null;
  farmName: string | null;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstRestrictionDraft = {
  id?: string;
  workerId: string;
  restrictionKind: RestrictionKind;
  issuedAt: string;
  startDate: string;
  dueDate?: string | null;
  detail: string;
  issuer?: string;
  responsibleName: string;
  measureImplemented: string;
  implementedAt?: string | null;
  status: RestrictionManualStatus;
  nextFollowUp?: string | null;
  observations: string;
  evidenceUrl: string;
  evidenceName: string;
};

export type SstRestrictionView = SstRestriction & {
  daysRemaining: number | null;
  semaphore: SstSemaphoreLevel;
  semaphoreLabel: string;
  effectiveStatus: RestrictionStatus;
};

export type RestrictionStats = {
  total: number;
  active: number;
  byStatus: Record<RestrictionStatus, number>;
  byKind: Record<RestrictionKind, number>;
  bySemaphore: Record<SstSemaphoreLevel, number>;
};

export function isRestrictionKind(value: string): value is RestrictionKind {
  return (RESTRICTION_KINDS as readonly string[]).includes(value);
}

export function isRestrictionStatus(value: string): value is RestrictionStatus {
  return (RESTRICTION_STATUSES as readonly string[]).includes(value);
}

export function isRestrictionManualStatus(
  value: string,
): value is RestrictionManualStatus {
  return (RESTRICTION_MANUAL_STATUSES as readonly string[]).includes(value);
}

export function emptyRestrictionDraft(workerId = ""): SstRestrictionDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    workerId,
    restrictionKind: "restriccion",
    issuedAt: today,
    startDate: today,
    dueDate: "",
    detail: "",
    issuer: "",
    responsibleName: "",
    measureImplemented: "",
    implementedAt: "",
    status: "vigente",
    nextFollowUp: "",
    observations: "",
    evidenceUrl: "",
    evidenceName: "",
  };
}

export function validateRestrictionDraft(input: SstRestrictionDraft): string | null {
  if (!input.workerId.trim()) {
    return "Selecciona un trabajador de la base maestra.";
  }
  if (!isRestrictionKind(input.restrictionKind)) {
    return "Tipo de restricción / recomendación inválido.";
  }
  if (!input.issuedAt.trim()) {
    return "La fecha de emisión es obligatoria.";
  }
  if (!input.startDate.trim()) {
    return "La fecha de inicio es obligatoria.";
  }
  if (!input.detail.trim()) {
    return "El detalle de la restricción o recomendación es obligatorio.";
  }
  if (!input.responsibleName.trim()) {
    return "El responsable de implementación es obligatorio.";
  }
  if (!isRestrictionManualStatus(input.status)) {
    return "Estado inválido.";
  }
  return null;
}

const SEMAPHORE_LABELS: Record<SstSemaphoreLevel, string> = {
  critico: "Vencida",
  proximo: "1–30 días",
  seguimiento: "31–60 días",
  vigente: ">60 días / N/A",
};

export function resolveRestrictionDueDate(
  dueDate: string | null | undefined,
  nextFollowUp: string | null | undefined,
): string | null {
  const due = dueDate?.trim() || null;
  if (due) return due;
  const followUp = nextFollowUp?.trim() || null;
  return followUp;
}

export function toComplianceWorkflowStatus(
  status: RestrictionStatus,
): SstWorkflowStatus {
  if (status === "pendiente_implementacion") return "pending_implementation";
  if (status === "cerrada") return "closed";
  return "open";
}

export function deriveEffectiveStatus(
  stored: RestrictionStatus,
  daysRemaining: number | null,
): RestrictionStatus {
  if (stored === "pendiente_implementacion" || stored === "cerrada") {
    return stored;
  }
  if (daysRemaining !== null) {
    if (daysRemaining <= DEFAULT_ALERT_THRESHOLDS.criticalMaxDays) {
      return "vencida";
    }
    if (daysRemaining <= DEFAULT_ALERT_THRESHOLDS.orangeMaxDays) {
      return "proxima_vencer";
    }
  }
  return "vigente";
}

export function enrichRestrictionAsView(
  item: SstRestriction,
  today = new Date(),
): SstRestrictionView {
  const effectiveDue = resolveRestrictionDueDate(item.dueDate, item.nextFollowUp);
  const daysRemaining = computeDaysRemaining(effectiveDue, today);
  const workflowStatus = toComplianceWorkflowStatus(item.status);
  const semaphore = computeSemaphore(
    daysRemaining,
    DEFAULT_ALERT_THRESHOLDS,
    "restriccion",
    workflowStatus,
  );
  const effectiveStatus = deriveEffectiveStatus(item.status, daysRemaining);
  return {
    ...item,
    daysRemaining,
    semaphore,
    semaphoreLabel: SEMAPHORE_LABELS[semaphore],
    effectiveStatus,
  };
}

export function parseRestrictionKindLabel(raw: string): RestrictionKind | null {
  const normalized = raw.trim().toLowerCase();
  if (isRestrictionKind(normalized)) return normalized;
  const map: Record<string, RestrictionKind> = {
    restriccion: "restriccion",
    restricción: "restriccion",
    "restriccion (limitacion funcional)": "restriccion",
    recomendacion: "recomendacion",
    recomendación: "recomendacion",
    "recomendacion (preventiva / higiene)": "recomendacion",
    "post incapacidad": "post_incapacidad",
    "post-incapacidad": "post_incapacidad",
    post_incapacidad: "post_incapacidad",
    reintegro: "post_incapacidad",
    "definitiva / reubicacion": "definitiva_reubicacion",
    "definitiva reubicacion": "definitiva_reubicacion",
    definitiva_reubicacion: "definitiva_reubicacion",
    reubicacion: "definitiva_reubicacion",
    reubicación: "definitiva_reubicacion",
  };
  return map[normalized] ?? null;
}

export function parseRestrictionStatusLabel(raw: string): RestrictionStatus | null {
  const normalized = raw.trim().toLowerCase();
  if (isRestrictionStatus(normalized)) return normalized;
  const map: Record<string, RestrictionStatus> = {
    vigente: "vigente",
    "proxima a vencer": "proxima_vencer",
    "próxima a vencer": "proxima_vencer",
    proxima_vencer: "proxima_vencer",
    por_vencer: "proxima_vencer",
    vencida: "vencida",
    "pendiente implementacion": "pendiente_implementacion",
    "pendiente implementación": "pendiente_implementacion",
    pendiente_implementacion: "pendiente_implementacion",
    pendiente: "pendiente_implementacion",
    cerrada: "cerrada",
    resuelta: "cerrada",
  };
  return map[normalized] ?? null;
}

export function toManualStatus(status: RestrictionStatus): RestrictionManualStatus {
  if (status === "pendiente_implementacion" || status === "cerrada") {
    return status;
  }
  return "vigente";
}

export function draftFromRestriction(item: SstRestriction): SstRestrictionDraft {
  return {
    id: item.id,
    workerId: item.workerId,
    restrictionKind: item.restrictionKind,
    issuedAt: item.issuedAt,
    startDate: item.startDate,
    dueDate: item.dueDate ?? "",
    detail: item.detail,
    issuer: item.issuer,
    responsibleName: item.responsibleName,
    measureImplemented: item.measureImplemented,
    implementedAt: item.implementedAt ?? "",
    status: toManualStatus(item.status),
    nextFollowUp: item.nextFollowUp ?? "",
    observations: item.observations,
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
  };
}
