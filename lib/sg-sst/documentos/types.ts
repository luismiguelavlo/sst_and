import {
  computeDaysRemaining,
  computeSemaphore,
} from "@/lib/sg-sst/alerts/engine";
import {
  DEFAULT_ALERT_THRESHOLDS,
  type SstSemaphoreLevel,
  type SstWorkflowStatus,
} from "@/lib/sg-sst/alerts/types";

export const SG_DOC_TYPES = [
  "politica_sst",
  "objetivos",
  "plan_anual",
  "matriz_peligros",
  "profesiograma",
  "plan_emergencias",
  "pesv",
  "procedimientos",
  "protocolos",
  "programas",
  "cronogramas",
  "reglamento_higiene",
  "copasst",
  "ccl",
  "brigada",
] as const;
export type SgDocType = (typeof SG_DOC_TYPES)[number];

export const SG_DOC_TYPE_LABELS: Record<SgDocType, string> = {
  politica_sst: "Política SST",
  objetivos: "Objetivos",
  plan_anual: "Plan anual",
  matriz_peligros: "Matriz de peligros",
  profesiograma: "Profesiograma",
  plan_emergencias: "Plan de emergencias",
  pesv: "PESV",
  procedimientos: "Procedimientos",
  protocolos: "Protocolos",
  programas: "Programas",
  cronogramas: "Cronogramas",
  reglamento_higiene: "Reglamento de higiene",
  copasst: "COPASST",
  ccl: "CCL",
  brigada: "Brigada",
};

export const SG_DOC_STATUSES = [
  "vigente",
  "en_revision",
  "observado",
  "obsoleto",
] as const;
export type SgDocStatus = (typeof SG_DOC_STATUSES)[number];

export const SG_DOC_STATUS_LABELS: Record<SgDocStatus, string> = {
  vigente: "Vigente",
  en_revision: "En revisión",
  observado: "Observado",
  obsoleto: "Obsoleto",
};

export const DEFAULT_SG_DOC_COMPANY = "Grupo Manzanares S.A.S.";

export type SstSgDocument = {
  id: string;
  code: string;
  title: string;
  docType: SgDocType;
  company: string;
  responsibleName: string;
  elaboratedAt: string | null;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
  hasReviewCycle: boolean;
  versionLabel: string;
  status: SgDocStatus;
  fileUrl: string;
  fileName: string;
  observations: string;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstSgDocumentDraft = {
  id?: string;
  code: string;
  title: string;
  docType: SgDocType;
  company: string;
  responsibleName: string;
  elaboratedAt: string;
  lastReviewedAt: string;
  nextReviewAt: string;
  hasReviewCycle: boolean;
  versionLabel: string;
  status: SgDocStatus;
  fileUrl: string;
  fileName: string;
  observations: string;
};

export type SstSgDocumentView = SstSgDocument & {
  daysRemaining: number | null;
  semaphore: SstSemaphoreLevel;
  semaphoreLabel: string;
  tracksReview: boolean;
  isOverdue: boolean;
};

export type DocumentStats = {
  total: number;
  byStatus: Record<SgDocStatus, number>;
  byDocType: Record<SgDocType, number>;
  withFile: number;
  trackingReview: number;
  overdueReview: number;
  bySemaphore: Record<SstSemaphoreLevel, number>;
};

export function isSgDocType(value: string): value is SgDocType {
  return (SG_DOC_TYPES as readonly string[]).includes(value);
}

export function isSgDocStatus(value: string): value is SgDocStatus {
  return (SG_DOC_STATUSES as readonly string[]).includes(value);
}

export function emptyDocumentDraft(): SstSgDocumentDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    code: "",
    title: "",
    docType: "politica_sst",
    company: DEFAULT_SG_DOC_COMPANY,
    responsibleName: "",
    elaboratedAt: today,
    lastReviewedAt: today,
    nextReviewAt: "",
    hasReviewCycle: true,
    versionLabel: "1.0",
    status: "vigente",
    fileUrl: "",
    fileName: "",
    observations: "",
  };
}

export function draftFromDocument(doc: SstSgDocument): SstSgDocumentDraft {
  return {
    id: doc.id,
    code: doc.code,
    title: doc.title,
    docType: doc.docType,
    company: doc.company,
    responsibleName: doc.responsibleName,
    elaboratedAt: doc.elaboratedAt ?? "",
    lastReviewedAt: doc.lastReviewedAt ?? "",
    nextReviewAt: doc.nextReviewAt ?? "",
    hasReviewCycle: doc.hasReviewCycle,
    versionLabel: doc.versionLabel,
    status: doc.status,
    fileUrl: doc.fileUrl,
    fileName: doc.fileName,
    observations: doc.observations,
  };
}

/** Solo genera alertas si hay ciclo de revisión y fecha próxima. */
export function documentTracksReview(
  doc: Pick<SstSgDocument, "hasReviewCycle" | "nextReviewAt" | "status">,
): boolean {
  return (
    doc.hasReviewCycle &&
    Boolean(doc.nextReviewAt?.trim()) &&
    doc.status !== "obsoleto"
  );
}

export function toDocumentComplianceWorkflow(
  status: SgDocStatus,
): SstWorkflowStatus {
  if (status === "obsoleto") return "closed";
  if (status === "en_revision") return "in_progress";
  if (status === "observado") return "pending_closure";
  return "open";
}

export function validateDocumentDraft(input: SstSgDocumentDraft): string | null {
  if (!input.code.trim()) {
    return "El código del documento es obligatorio.";
  }
  if (!input.title.trim()) {
    return "El título del documento es obligatorio.";
  }
  if (!isSgDocType(input.docType)) {
    return "Tipo de documento inválido.";
  }
  if (!input.company.trim()) {
    return "La empresa es obligatoria.";
  }
  if (!input.responsibleName.trim()) {
    return "El responsable es obligatorio.";
  }
  if (!input.versionLabel.trim()) {
    return "La versión es obligatoria.";
  }
  if (!isSgDocStatus(input.status)) {
    return "Estado del documento inválido.";
  }
  return null;
}

const SEMAPHORE_LABELS: Record<SstSemaphoreLevel, string> = {
  critico: "Vencido",
  proximo: "1–30 días",
  seguimiento: "31–60 días",
  vigente: "Sin alerta / >60 d",
};

export function enrichDocumentAsView(
  doc: SstSgDocument,
  today = new Date(),
): SstSgDocumentView {
  const tracksReview = documentTracksReview(doc);
  const daysRemaining = tracksReview
    ? computeDaysRemaining(doc.nextReviewAt, today)
    : null;
  const workflowStatus = tracksReview
    ? toDocumentComplianceWorkflow(doc.status)
    : "closed";
  const semaphore = tracksReview
    ? computeSemaphore(
        daysRemaining,
        DEFAULT_ALERT_THRESHOLDS,
        "documento",
        workflowStatus,
      )
    : "vigente";
  return {
    ...doc,
    daysRemaining,
    semaphore,
    semaphoreLabel: tracksReview
      ? SEMAPHORE_LABELS[semaphore]
      : "Sin vencimiento automático",
    tracksReview,
    isOverdue: daysRemaining !== null && daysRemaining <= 0,
  };
}

function normalizeLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function parseDocTypeLabel(raw: string): SgDocType | null {
  const normalized = normalizeLabel(raw);
  if (isSgDocType(normalized)) return normalized;
  const map: Record<string, SgDocType> = {
    politica_sst: "politica_sst",
    "politica sst": "politica_sst",
    politica: "politica_sst",
    objetivos: "objetivos",
    plan_anual: "plan_anual",
    "plan anual": "plan_anual",
    matriz_peligros: "matriz_peligros",
    "matriz de peligros": "matriz_peligros",
    "matriz peligros": "matriz_peligros",
    profesiograma: "profesiograma",
    plan_emergencias: "plan_emergencias",
    "plan de emergencias": "plan_emergencias",
    "plan emergencias": "plan_emergencias",
    pesv: "pesv",
    procedimientos: "procedimientos",
    protocolos: "protocolos",
    programas: "programas",
    cronogramas: "cronogramas",
    reglamento_higiene: "reglamento_higiene",
    "reglamento de higiene": "reglamento_higiene",
    "reglamento higiene": "reglamento_higiene",
    copasst: "copasst",
    ccl: "ccl",
    brigada: "brigada",
  };
  return map[normalized] ?? null;
}

export function parseDocStatusLabel(raw: string): SgDocStatus | null {
  const normalized = normalizeLabel(raw);
  if (isSgDocStatus(normalized)) return normalized;
  const map: Record<string, SgDocStatus> = {
    vigente: "vigente",
    "aprobado y vigente": "vigente",
    aprobado: "vigente",
    en_revision: "en_revision",
    "en revision": "en_revision",
    "en revision tecnica": "en_revision",
    "en revision anual": "en_revision",
    revision: "en_revision",
    observado: "observado",
    "requiere ajuste": "observado",
    "requiere ajuste / observado": "observado",
    obsoleto: "obsoleto",
    historico: "obsoleto",
    "obsoleto / historico": "obsoleto",
  };
  return map[normalized] ?? null;
}

export function parseYesNo(raw: string, fallback = true): boolean {
  const v = normalizeLabel(raw);
  if (!v) return fallback;
  if (["si", "yes", "true", "1", "activo", "con ciclo"].includes(v)) return true;
  if (["no", "false", "0", "sin ciclo", "n/a", "na"].includes(v)) return false;
  return fallback;
}
