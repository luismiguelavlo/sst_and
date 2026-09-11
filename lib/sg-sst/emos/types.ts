import {
  computeDaysRemaining,
  computeSemaphore,
} from "@/lib/sg-sst/alerts/engine";
import {
  DEFAULT_ALERT_THRESHOLDS,
  type SstSemaphoreLevel,
} from "@/lib/sg-sst/alerts/types";

export const EMO_EXAM_TYPES = [
  "ingreso",
  "periodico",
  "egreso",
  "post_incapacidad",
  "otro",
] as const;
export type EmoExamType = (typeof EMO_EXAM_TYPES)[number];

export const EMO_CONCEPTS = [
  "apto",
  "apto_recomendaciones",
  "apto_restricciones",
  "no_apto",
] as const;
export type EmoConcept = (typeof EMO_CONCEPTS)[number];

export const EMO_PERIODICITY_MONTHS = [6, 12, 24] as const;
export type EmoPeriodicity = (typeof EMO_PERIODICITY_MONTHS)[number];

export const EMO_EXAM_TYPE_LABELS: Record<EmoExamType, string> = {
  ingreso: "Ingreso",
  periodico: "Periódico",
  egreso: "Egreso",
  post_incapacidad: "Post incapacidad",
  otro: "Otros",
};

export const EMO_CONCEPT_LABELS: Record<EmoConcept, string> = {
  apto: "Apto",
  apto_recomendaciones: "Apto con recomendaciones",
  apto_restricciones: "Apto con restricciones",
  no_apto: "No apto",
};

export type SstEmo = {
  id: string;
  folio: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  workerStatus: string;
  examType: EmoExamType;
  examDate: string;
  nextDueDate: string | null;
  periodicityMonths: EmoPeriodicity | null;
  ips: string;
  concept: EmoConcept;
  adminObservations: string;
  evidenceUrl: string;
  evidenceName: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  farmId: string | null;
  farmName: string | null;
  heightsCleared: boolean | null;
  pesvCleared: boolean | null;
  chemicalsCleared: boolean | null;
  notifySupervisor: boolean;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstEmoDraft = {
  id?: string;
  workerId: string;
  examType: EmoExamType;
  examDate: string;
  nextDueDate?: string | null;
  periodicityMonths?: EmoPeriodicity | null;
  ips: string;
  concept: EmoConcept;
  adminObservations: string;
  evidenceUrl: string;
  evidenceName: string;
  heightsCleared?: boolean | null;
  pesvCleared?: boolean | null;
  chemicalsCleared?: boolean | null;
  notifySupervisor?: boolean;
};

export type SstEmoView = SstEmo & {
  daysRemaining: number | null;
  semaphore: SstSemaphoreLevel;
  semaphoreLabel: string;
};

export type EmoStats = {
  total: number;
  workersCovered: number;
  bySemaphore: Record<SstSemaphoreLevel, number>;
  byConcept: Record<EmoConcept, number>;
};

export function isEmoExamType(value: string): value is EmoExamType {
  return (EMO_EXAM_TYPES as readonly string[]).includes(value);
}

export function isEmoConcept(value: string): value is EmoConcept {
  return (EMO_CONCEPTS as readonly string[]).includes(value);
}

export function isEmoPeriodicity(value: number): value is EmoPeriodicity {
  return (EMO_PERIODICITY_MONTHS as readonly number[]).includes(value);
}

export function emptyEmoDraft(workerId = ""): SstEmoDraft {
  return {
    workerId,
    examType: "periodico",
    examDate: new Date().toISOString().slice(0, 10),
    nextDueDate: "",
    periodicityMonths: 12,
    ips: "",
    concept: "apto",
    adminObservations: "",
    evidenceUrl: "",
    evidenceName: "",
    heightsCleared: null,
    pesvCleared: null,
    chemicalsCleared: null,
    notifySupervisor: false,
  };
}

export function addMonthsIso(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setMonth(date.getMonth() + months);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function resolveNextDueDate(draft: SstEmoDraft): string | null {
  if (draft.examType === "egreso") {
    return null;
  }
  if (draft.nextDueDate?.trim()) {
    return draft.nextDueDate.trim();
  }
  if (draft.periodicityMonths && draft.examDate) {
    return addMonthsIso(draft.examDate, draft.periodicityMonths);
  }
  return null;
}

export function validateEmoDraft(input: SstEmoDraft): string | null {
  if (!input.workerId.trim()) {
    return "Selecciona un trabajador de la base maestra.";
  }
  if (!isEmoExamType(input.examType)) {
    return "Tipo de examen inválido.";
  }
  if (!input.examDate.trim()) {
    return "La fecha del examen es obligatoria.";
  }
  if (!isEmoConcept(input.concept)) {
    return "Concepto de aptitud inválido.";
  }
  if (!input.ips.trim()) {
    return "La IPS es obligatoria.";
  }
  if (
    input.periodicityMonths != null &&
    !isEmoPeriodicity(Number(input.periodicityMonths))
  ) {
    return "Periodicidad inválida (6, 12 o 24 meses).";
  }
  return null;
}

const SEMAPHORE_LABELS: Record<SstSemaphoreLevel, string> = {
  critico: "Vencido",
  proximo: "1–30 días",
  seguimiento: "31–60 días",
  vigente: ">60 días / N/A",
};

export function enrichEmoAsView(emo: SstEmo, today = new Date()): SstEmoView {
  const daysRemaining = computeDaysRemaining(emo.nextDueDate, today);
  const workflowStatus =
    emo.examType === "egreso" || emo.concept === "no_apto" ? "closed" : "open";
  const semaphore = computeSemaphore(
    daysRemaining,
    DEFAULT_ALERT_THRESHOLDS,
    "examen_medico",
    workflowStatus,
  );
  return {
    ...emo,
    daysRemaining,
    semaphore,
    semaphoreLabel: SEMAPHORE_LABELS[semaphore],
  };
}

export function parseExamTypeLabel(raw: string): EmoExamType | null {
  const normalized = raw.trim().toLowerCase();
  if (isEmoExamType(normalized)) return normalized;
  const map: Record<string, EmoExamType> = {
    ingreso: "ingreso",
    periódico: "periodico",
    periodico: "periodico",
    egreso: "egreso",
    "post incapacidad": "post_incapacidad",
    "post-incapacidad": "post_incapacidad",
    post_incapacidad: "post_incapacidad",
    reintegro: "post_incapacidad",
    otros: "otro",
    otro: "otro",
  };
  return map[normalized] ?? null;
}

export function parseConceptLabel(raw: string): EmoConcept | null {
  const normalized = raw.trim().toLowerCase();
  if (isEmoConcept(normalized)) return normalized;
  const map: Record<string, EmoConcept> = {
    apto: "apto",
    "apto con recomendaciones": "apto_recomendaciones",
    "apto recomendaciones": "apto_recomendaciones",
    apto_recomendaciones: "apto_recomendaciones",
    "apto con restricciones": "apto_restricciones",
    "apto restricciones": "apto_restricciones",
    apto_restricciones: "apto_restricciones",
    "no apto": "no_apto",
    no_apto: "no_apto",
  };
  return map[normalized] ?? null;
}
