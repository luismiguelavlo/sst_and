import {
  computeDaysRemaining,
  computeSemaphore,
} from "@/lib/sg-sst/alerts/engine";
import {
  DEFAULT_ALERT_THRESHOLDS,
  type SstSemaphoreLevel,
  type SstWorkflowStatus,
} from "@/lib/sg-sst/alerts/types";
import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";

/** Plazo legal Res. 1401 de 2007 (días calendario). */
export const INVESTIGATION_LEGAL_DAYS = 15;

/** Ventana KPI “próximas a vencer” (días restantes). */
export const INVESTIGATION_UPCOMING_MAX_DAYS = 4;

export const INVESTIGATION_STATUSES = [
  "pendiente_inicio",
  "en_campo",
  "revision_copasst",
  "radicada_arl",
  "cerrada",
] as const;
export type InvestigationStatus = (typeof INVESTIGATION_STATUSES)[number];

export const INVESTIGATION_METHODOLOGIES = [
  "ishikawa",
  "arbol",
  "5_porques",
  "scra",
] as const;
export type InvestigationMethodology = (typeof INVESTIGATION_METHODOLOGIES)[number];

export const INVESTIGATION_STATUS_LABELS: Record<InvestigationStatus, string> = {
  pendiente_inicio: "Pendiente de inicio",
  en_campo: "En campo",
  revision_copasst: "Revisión COPASST",
  radicada_arl: "Radicada ARL",
  cerrada: "Cerrada",
};

export const INVESTIGATION_METHODOLOGY_LABELS: Record<
  InvestigationMethodology,
  string
> = {
  ishikawa: "Ishikawa (espina de pescado)",
  arbol: "Árbol de causas",
  "5_porques": "5 porqués",
  scra: "SCRA",
};

export type AccidentOption = {
  id: string;
  eventNumber: string;
  workerName: string;
  eventDate: string;
};

export type SstInvestigation = {
  id: string;
  folio: string;
  accidentId: string;
  accidentEventNumber: string;
  accidentDate: string;
  legalDueDate: string;
  responsibleName: string;
  status: InvestigationStatus;
  investigationDate: string | null;
  investigationTeam: string;
  methodology: InvestigationMethodology;
  causesSummary: string;
  actionPlan: string;
  evidenceUrl: string;
  evidenceName: string;
  closedAt: string | null;
  observations: string;
  workerId: string | null;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  farmId: string | null;
  farmName: string | null;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstInvestigationDraft = {
  id?: string;
  accidentId: string;
  accidentDate?: string;
  legalDueDate?: string;
  responsibleName: string;
  status: InvestigationStatus;
  investigationDate?: string | null;
  investigationTeam: string;
  methodology: InvestigationMethodology;
  causesSummary: string;
  actionPlan: string;
  evidenceUrl: string;
  evidenceName: string;
  closedAt?: string | null;
  observations: string;
};

export type SstInvestigationView = SstInvestigation & {
  daysRemaining: number | null;
  semaphore: SstSemaphoreLevel;
  semaphoreLabel: string;
  isClosedLike: boolean;
  isOverdue: boolean;
  isUpcoming: boolean;
};

export type InvestigationStats = {
  total: number;
  overdue: number;
  upcoming: number;
  inProgress: number;
  closed: number;
  byStatus: Record<InvestigationStatus, number>;
  bySemaphore: Record<SstSemaphoreLevel, number>;
};

export function isInvestigationStatus(value: string): value is InvestigationStatus {
  return (INVESTIGATION_STATUSES as readonly string[]).includes(value);
}

export function isInvestigationMethodology(
  value: string,
): value is InvestigationMethodology {
  return (INVESTIGATION_METHODOLOGIES as readonly string[]).includes(value);
}

export function isClosedLikeStatus(status: InvestigationStatus): boolean {
  return status === "cerrada" || status === "radicada_arl";
}

export function addDaysIso(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function resolveLegalDueDate(
  accidentDate: string,
  legalDueDate?: string | null,
): string {
  if (legalDueDate?.trim()) {
    return legalDueDate.trim();
  }
  return addDaysIso(accidentDate, INVESTIGATION_LEGAL_DAYS);
}

export function toComplianceWorkflowStatus(
  status: InvestigationStatus,
): SstWorkflowStatus {
  if (status === "cerrada" || status === "radicada_arl") return "closed";
  if (status === "en_campo") return "in_progress";
  if (status === "revision_copasst") return "pending_closure";
  return "open";
}

export function emptyInvestigationDraft(
  accidentId = "",
): SstInvestigationDraft {
  return {
    accidentId,
    accidentDate: "",
    legalDueDate: "",
    responsibleName: "",
    status: "pendiente_inicio",
    investigationDate: "",
    investigationTeam: "",
    methodology: "ishikawa",
    causesSummary: "",
    actionPlan: "",
    evidenceUrl: "",
    evidenceName: "",
    closedAt: "",
    observations: "",
  };
}

export function draftFromInvestigation(
  item: SstInvestigation,
): SstInvestigationDraft {
  return {
    id: item.id,
    accidentId: item.accidentId,
    accidentDate: item.accidentDate,
    legalDueDate: item.legalDueDate,
    responsibleName: item.responsibleName,
    status: item.status,
    investigationDate: item.investigationDate ?? "",
    investigationTeam: item.investigationTeam,
    methodology: item.methodology,
    causesSummary: item.causesSummary,
    actionPlan: item.actionPlan,
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
    closedAt: item.closedAt ?? "",
    observations: item.observations,
  };
}

export function validateInvestigationDraft(
  input: SstInvestigationDraft,
  mode: DraftValidationMode = "form",
): string | null {
  // Importación Excel: solo FK accidente; defaults cubren el resto.
  if (mode === "import") {
    if (!input.accidentId.trim()) {
      return "Selecciona el accidente relacionado.";
    }
    return null;
  }
  if (!input.accidentId.trim()) {
    return "Selecciona el accidente relacionado.";
  }
  if (!input.responsibleName.trim()) {
    return "El responsable de la investigación es obligatorio.";
  }
  if (!isInvestigationStatus(input.status)) {
    return "Estado de investigación inválido.";
  }
  if (!isInvestigationMethodology(input.methodology)) {
    return "Metodología inválida.";
  }
  if (isClosedLikeStatus(input.status) && !input.closedAt?.trim()) {
    return "La fecha de cierre es obligatoria para estados cerrada / radicada ARL.";
  }
  return null;
}

const SEMAPHORE_LABELS: Record<SstSemaphoreLevel, string> = {
  critico: "Vencida",
  proximo: "Próxima a vencer",
  seguimiento: "En seguimiento",
  vigente: "Vigente / cerrada",
};

export function enrichInvestigationAsView(
  item: SstInvestigation,
  today = new Date(),
): SstInvestigationView {
  const closedLike = isClosedLikeStatus(item.status);
  const daysRemaining = computeDaysRemaining(item.legalDueDate, today);
  const workflowStatus = toComplianceWorkflowStatus(item.status);
  const semaphore = computeSemaphore(
    daysRemaining,
    DEFAULT_ALERT_THRESHOLDS,
    "investigacion",
    workflowStatus,
  );
  return {
    ...item,
    daysRemaining,
    semaphore,
    semaphoreLabel: SEMAPHORE_LABELS[semaphore],
    isClosedLike: closedLike,
    isOverdue:
      !closedLike && daysRemaining !== null && daysRemaining <= 0,
    isUpcoming:
      !closedLike &&
      daysRemaining !== null &&
      daysRemaining > 0 &&
      daysRemaining <= INVESTIGATION_UPCOMING_MAX_DAYS,
  };
}

export function parseInvestigationStatusLabel(
  raw: string,
): InvestigationStatus | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isInvestigationStatus(normalized)) return normalized;
  const map: Record<string, InvestigationStatus> = {
    pendiente_inicio: "pendiente_inicio",
    pendiente: "pendiente_inicio",
    "pendiente de inicio": "pendiente_inicio",
    en_campo: "en_campo",
    "en campo": "en_campo",
    revision_copasst: "revision_copasst",
    "revision copasst": "revision_copasst",
    copasst: "revision_copasst",
    radicada_arl: "radicada_arl",
    "radicada arl": "radicada_arl",
    radicada: "radicada_arl",
    cerrada: "cerrada",
    cerrado: "cerrada",
  };
  return map[normalized] ?? null;
}

export function parseInvestigationMethodologyLabel(
  raw: string,
): InvestigationMethodology | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isInvestigationMethodology(normalized)) return normalized;
  const map: Record<string, InvestigationMethodology> = {
    ishikawa: "ishikawa",
    "espina de pescado": "ishikawa",
    espina: "ishikawa",
    arbol: "arbol",
    "arbol de causas": "arbol",
    "5_porques": "5_porques",
    "5 porques": "5_porques",
    cinco_porques: "5_porques",
    "cinco porques": "5_porques",
    scra: "scra",
  };
  return map[normalized] ?? null;
}
