import { computeDaysRemaining } from "@/lib/sg-sst/alerts/engine";
import type { SstWorkflowStatus } from "@/lib/sg-sst/alerts/types";
import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const ACTION_SOURCE_TYPES = [
  "accidente",
  "incidente",
  "inspeccion",
  "auditoria",
  "hallazgo",
  "copasst",
  "ccl",
  "pesv",
  "sg_sst",
] as const;
export type ActionSourceType = (typeof ACTION_SOURCE_TYPES)[number];

export const ACTION_KINDS = ["correctiva", "preventiva", "mejora"] as const;
export type ActionKind = (typeof ACTION_KINDS)[number];

export const ACTION_STATUSES = [
  "en_ejecucion",
  "proxima_vencer",
  "vencida",
  "cerrada",
] as const;
export type ActionStatus = (typeof ACTION_STATUSES)[number];

/** Estados seleccionables en el formulario (vencida / próxima se derivan). */
export const ACTION_MANUAL_STATUSES = ["en_ejecucion", "cerrada"] as const;
export type ActionManualStatus = (typeof ACTION_MANUAL_STATUSES)[number];

export const ACTION_EFFICACY_STATUSES = [
  "pendiente",
  "en_seguimiento",
  "eficaz",
  "no_eficaz",
] as const;
export type ActionEfficacyStatus = (typeof ACTION_EFFICACY_STATUSES)[number];

export const ACTION_SOURCE_LABELS: Record<ActionSourceType, string> = {
  accidente: "Accidente",
  incidente: "Incidente",
  inspeccion: "Inspección",
  auditoria: "Auditoría",
  hallazgo: "Hallazgo",
  copasst: "COPASST",
  ccl: "CCL",
  pesv: "PESV",
  sg_sst: "SG-SST",
};

export const ACTION_KIND_LABELS: Record<ActionKind, string> = {
  correctiva: "Correctiva",
  preventiva: "Preventiva",
  mejora: "Mejora",
};

export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  en_ejecucion: "En ejecución",
  proxima_vencer: "Próxima a vencer",
  vencida: "Vencida",
  cerrada: "Cerrada",
};

export const ACTION_EFFICACY_LABELS: Record<ActionEfficacyStatus, string> = {
  pendiente: "Pendiente",
  en_seguimiento: "En seguimiento",
  eficaz: "Eficaz",
  no_eficaz: "No eficaz",
};

export type SstCorrectiveAction = {
  id: string;
  folio: string;
  sourceType: ActionSourceType;
  sourceRef: string;
  finding: string;
  actionPlan: string;
  actionKind: ActionKind;
  responsibleName: string;
  commitDate: string;
  closedAt: string | null;
  status: ActionStatus;
  evidenceUrl: string;
  evidenceName: string;
  efficacyStatus: ActionEfficacyStatus;
  observations: string;
  farmId: string | null;
  farmName: string | null;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstCorrectiveActionDraft = {
  id?: string;
  sourceType: ActionSourceType;
  sourceRef: string;
  finding: string;
  actionPlan: string;
  actionKind: ActionKind;
  responsibleName: string;
  commitDate: string;
  closedAt?: string | null;
  status: ActionManualStatus;
  evidenceUrl: string;
  evidenceName: string;
  efficacyStatus: ActionEfficacyStatus;
  observations: string;
  farmId?: string | null;
};

export type SstCorrectiveActionView = SstCorrectiveAction & {
  daysRemaining: number | null;
  effectiveStatus: ActionStatus;
};

export type ActionStats = {
  total: number;
  abiertas: number;
  vencidas: number;
  proximas: number;
  cerradas: number;
  cumplimientoPct: number;
  byStatus: Record<ActionStatus, number>;
  bySource: Record<ActionSourceType, number>;
  byKind: Record<ActionKind, number>;
};

export function isActionSourceType(value: string): value is ActionSourceType {
  return (ACTION_SOURCE_TYPES as readonly string[]).includes(value);
}

export function isActionKind(value: string): value is ActionKind {
  return (ACTION_KINDS as readonly string[]).includes(value);
}

export function isActionStatus(value: string): value is ActionStatus {
  return (ACTION_STATUSES as readonly string[]).includes(value);
}

export function isActionManualStatus(value: string): value is ActionManualStatus {
  return (ACTION_MANUAL_STATUSES as readonly string[]).includes(value);
}

export function isActionEfficacyStatus(
  value: string,
): value is ActionEfficacyStatus {
  return (ACTION_EFFICACY_STATUSES as readonly string[]).includes(value);
}

export function emptyActionDraft(): SstCorrectiveActionDraft {
  return {
    sourceType: "inspeccion",
    sourceRef: "",
    finding: "",
    actionPlan: "",
    actionKind: "correctiva",
    responsibleName: "",
    commitDate: todayIsoDate(),
    closedAt: "",
    status: "en_ejecucion",
    evidenceUrl: "",
    evidenceName: "",
    efficacyStatus: "pendiente",
    observations: "",
    farmId: null,
  };
}

/** Completa campos faltantes para importación Excel. */
export function normalizeActionDraftForImport(
  draft: SstCorrectiveActionDraft,
): SstCorrectiveActionDraft {
  const defaults = emptyActionDraft();
  return {
    ...draft,
    sourceType: isActionSourceType(draft.sourceType)
      ? draft.sourceType
      : ACTION_SOURCE_TYPES[0],
    finding: draft.finding.trim() || "Sin detalle",
    actionPlan: draft.actionPlan.trim() || "Sin título",
    actionKind: isActionKind(draft.actionKind) ? draft.actionKind : "correctiva",
    responsibleName: draft.responsibleName.trim() || "Sin responsable",
    commitDate: draft.commitDate.trim() || todayIsoDate(),
    status: isActionManualStatus(draft.status) ? draft.status : defaults.status,
    efficacyStatus: isActionEfficacyStatus(draft.efficacyStatus)
      ? draft.efficacyStatus
      : "pendiente",
  };
}

export function validateActionDraft(
  input: SstCorrectiveActionDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    if (
      !input.finding.trim() &&
      !input.actionPlan.trim() &&
      !input.responsibleName.trim()
    ) {
      return "Fila sin hallazgo, plan de acción ni responsable.";
    }
    return null;
  }

  if (!isActionSourceType(input.sourceType)) {
    return "Fuente / origen inválido.";
  }
  if (!input.finding.trim()) {
    return "El hallazgo es obligatorio.";
  }
  if (!input.actionPlan.trim()) {
    return "El plan de acción es obligatorio.";
  }
  if (!isActionKind(input.actionKind)) {
    return "Tipo de acción inválido.";
  }
  if (!input.responsibleName.trim()) {
    return "El responsable es obligatorio.";
  }
  if (!input.commitDate.trim()) {
    return "La fecha de compromiso es obligatoria.";
  }
  if (!isActionManualStatus(input.status)) {
    return "Estado inválido.";
  }
  if (!isActionEfficacyStatus(input.efficacyStatus)) {
    return "Estado de eficacia inválido.";
  }
  return null;
}

/**
 * Deriva vencida / próxima a vencer desde commit_date cuando no está cerrada.
 * proxima si daysRemaining <= 30; vencida si daysRemaining < 0.
 */
export function deriveEffectiveStatus(
  stored: ActionStatus,
  commitDate: string,
  today = new Date(),
): ActionStatus {
  if (stored === "cerrada") {
    return "cerrada";
  }
  const days = computeDaysRemaining(commitDate, today);
  if (days !== null && days < 0) {
    return "vencida";
  }
  if (days !== null && days <= 30) {
    return "proxima_vencer";
  }
  return "en_ejecucion";
}

export function resolveStatusToPersist(
  draft: SstCorrectiveActionDraft,
  today = new Date(),
): ActionStatus {
  if (draft.status === "cerrada") {
    return "cerrada";
  }
  return deriveEffectiveStatus("en_ejecucion", draft.commitDate, today);
}

export function toComplianceWorkflowStatus(
  status: ActionStatus,
): SstWorkflowStatus {
  if (status === "cerrada") return "closed";
  if (status === "vencida") return "pending_closure";
  return "open";
}

export function enrichActionAsView(
  item: SstCorrectiveAction,
  today = new Date(),
): SstCorrectiveActionView {
  const daysRemaining = computeDaysRemaining(item.commitDate, today);
  const effectiveStatus = deriveEffectiveStatus(item.status, item.commitDate, today);
  return {
    ...item,
    daysRemaining,
    effectiveStatus,
  };
}

export function toManualStatus(status: ActionStatus): ActionManualStatus {
  return status === "cerrada" ? "cerrada" : "en_ejecucion";
}

export function draftFromAction(item: SstCorrectiveAction): SstCorrectiveActionDraft {
  return {
    id: item.id,
    sourceType: item.sourceType,
    sourceRef: item.sourceRef,
    finding: item.finding,
    actionPlan: item.actionPlan,
    actionKind: item.actionKind,
    responsibleName: item.responsibleName,
    commitDate: item.commitDate,
    closedAt: item.closedAt ?? "",
    status: toManualStatus(item.status),
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
    efficacyStatus: item.efficacyStatus,
    observations: item.observations,
    farmId: item.farmId,
  };
}

function normalizeLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function parseSourceTypeLabel(raw: string): ActionSourceType | null {
  const normalized = normalizeLabel(raw);
  if (isActionSourceType(normalized)) return normalized;
  const map: Record<string, ActionSourceType> = {
    accidente: "accidente",
    "accidente de trabajo": "accidente",
    at: "accidente",
    incidente: "incidente",
    "cuasi accidente": "incidente",
    cuasiaccidente: "incidente",
    inspeccion: "inspeccion",
    "inspeccion de seguridad": "inspeccion",
    auditoria: "auditoria",
    "auditoria interna": "auditoria",
    hallazgo: "hallazgo",
    copasst: "copasst",
    ccl: "ccl",
    "comite de convivencia": "ccl",
    pesv: "pesv",
    "seguridad vial": "pesv",
    sg_sst: "sg_sst",
    "sg-sst": "sg_sst",
    "revision por la direccion": "sg_sst",
  };
  return map[normalized] ?? null;
}

export function parseActionKindLabel(raw: string): ActionKind | null {
  const normalized = normalizeLabel(raw);
  if (isActionKind(normalized)) return normalized;
  const map: Record<string, ActionKind> = {
    correctiva: "correctiva",
    preventiva: "preventiva",
    mejora: "mejora",
    "accion correctiva": "correctiva",
    "accion preventiva": "preventiva",
    "accion de mejora": "mejora",
  };
  return map[normalized] ?? null;
}

export function parseActionStatusLabel(raw: string): ActionStatus | null {
  const normalized = normalizeLabel(raw);
  if (isActionStatus(normalized)) return normalized;
  const map: Record<string, ActionStatus> = {
    "en ejecucion": "en_ejecucion",
    en_ejecucion: "en_ejecucion",
    ejecucion: "en_ejecucion",
    "proxima a vencer": "proxima_vencer",
    proxima_vencer: "proxima_vencer",
    proximas: "proxima_vencer",
    vencida: "vencida",
    vencidas: "vencida",
    cerrada: "cerrada",
    cerradas: "cerrada",
  };
  return map[normalized] ?? null;
}

export function parseEfficacyLabel(raw: string): ActionEfficacyStatus | null {
  const normalized = normalizeLabel(raw);
  if (isActionEfficacyStatus(normalized)) return normalized;
  const map: Record<string, ActionEfficacyStatus> = {
    pendiente: "pendiente",
    "en seguimiento": "en_seguimiento",
    en_seguimiento: "en_seguimiento",
    eficaz: "eficaz",
    "no eficaz": "no_eficaz",
    no_eficaz: "no_eficaz",
  };
  return map[normalized] ?? null;
}
