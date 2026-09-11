import { computeDaysRemaining } from "@/lib/sg-sst/alerts/engine";
import {
  DEFAULT_ALERT_THRESHOLDS,
  type SstSemaphoreLevel,
} from "@/lib/sg-sst/alerts/types";
import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";

export const HEIGHTS_TRAINING_LEVELS = [
  "autorizado_32h",
  "reentrenamiento_8h",
  "coordinador_80h",
  "jefe_area",
] as const;
export type HeightsTrainingLevel = (typeof HEIGHTS_TRAINING_LEVELS)[number];

export const HEIGHTS_FITNESS_CONCEPTS = [
  "apto",
  "apto_recomendaciones",
  "no_apto",
  "pendiente",
] as const;
export type HeightsFitnessConcept = (typeof HEIGHTS_FITNESS_CONCEPTS)[number];

export const HEIGHTS_AUTHORIZATION_STATUSES = [
  "autorizado",
  "no_autorizado",
  "por_vencer",
] as const;
export type HeightsAuthorizationStatus =
  (typeof HEIGHTS_AUTHORIZATION_STATUSES)[number];

export const HEIGHTS_TRAINING_LEVEL_LABELS: Record<HeightsTrainingLevel, string> = {
  autorizado_32h: "Trabajador autorizado (32 h)",
  reentrenamiento_8h: "Reentrenamiento anual (8 h)",
  coordinador_80h: "Coordinador de alturas (80 h)",
  jefe_area: "Jefe de área",
};

export const HEIGHTS_FITNESS_LABELS: Record<HeightsFitnessConcept, string> = {
  apto: "Apto",
  apto_recomendaciones: "Apto con recomendaciones",
  no_apto: "No apto",
  pendiente: "Pendiente",
};

export const HEIGHTS_STATUS_LABELS: Record<HeightsAuthorizationStatus, string> = {
  autorizado: "Autorizado",
  no_autorizado: "NO AUTORIZADO",
  por_vencer: "Por vencer",
};

export type SstHeightsAuthorization = {
  id: string;
  folio: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  workerStatus: string;
  trainingLevel: HeightsTrainingLevel;
  trainingDate: string | null;
  trainingDueDate: string | null;
  retrainingDone: boolean;
  certificateUrl: string;
  certificateName: string;
  medicalExamDate: string | null;
  medicalExamDueDate: string | null;
  fitnessConcept: HeightsFitnessConcept;
  authorizationStatus: HeightsAuthorizationStatus;
  observations: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  farmId: string | null;
  farmName: string | null;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstHeightsDraft = {
  id?: string;
  workerId: string;
  trainingLevel: HeightsTrainingLevel;
  trainingDate?: string | null;
  trainingDueDate?: string | null;
  retrainingDone?: boolean;
  certificateUrl: string;
  certificateName: string;
  medicalExamDate?: string | null;
  medicalExamDueDate?: string | null;
  fitnessConcept: HeightsFitnessConcept;
  observations: string;
};

export type SstHeightsView = SstHeightsAuthorization & {
  trainingDaysRemaining: number | null;
  medicalDaysRemaining: number | null;
  daysRemaining: number | null;
  semaphore: SstSemaphoreLevel;
  semaphoreLabel: string;
  missingRequirements: string[];
};

export type HeightsStats = {
  total: number;
  habilitados: number;
  vencidos: number;
  proximosAVencer: number;
  examenesPendientes: number;
  documentacionPendiente: number;
  noAutorizados: number;
};

export function isHeightsTrainingLevel(value: string): value is HeightsTrainingLevel {
  return (HEIGHTS_TRAINING_LEVELS as readonly string[]).includes(value);
}

export function isHeightsFitnessConcept(
  value: string,
): value is HeightsFitnessConcept {
  return (HEIGHTS_FITNESS_CONCEPTS as readonly string[]).includes(value);
}

export function isHeightsAuthorizationStatus(
  value: string,
): value is HeightsAuthorizationStatus {
  return (HEIGHTS_AUTHORIZATION_STATUSES as readonly string[]).includes(value);
}

export function emptyHeightsDraft(workerId = ""): SstHeightsDraft {
  return {
    workerId,
    trainingLevel: "autorizado_32h",
    trainingDate: "",
    trainingDueDate: "",
    retrainingDone: false,
    certificateUrl: "",
    certificateName: "",
    medicalExamDate: "",
    medicalExamDueDate: "",
    fitnessConcept: "pendiente",
    observations: "",
  };
}

export function draftFromHeights(item: SstHeightsAuthorization): SstHeightsDraft {
  return {
    id: item.id,
    workerId: item.workerId,
    trainingLevel: item.trainingLevel,
    trainingDate: item.trainingDate ?? "",
    trainingDueDate: item.trainingDueDate ?? "",
    retrainingDone: item.retrainingDone,
    certificateUrl: item.certificateUrl,
    certificateName: item.certificateName,
    medicalExamDate: item.medicalExamDate ?? "",
    medicalExamDueDate: item.medicalExamDueDate ?? "",
    fitnessConcept: item.fitnessConcept,
    observations: item.observations,
  };
}

/** Completa enums faltantes para importación Excel. */
export function normalizeHeightsDraftForImport(
  draft: SstHeightsDraft,
): SstHeightsDraft {
  const defaults = emptyHeightsDraft(draft.workerId);
  return {
    ...draft,
    trainingLevel: isHeightsTrainingLevel(draft.trainingLevel)
      ? draft.trainingLevel
      : defaults.trainingLevel,
    fitnessConcept: isHeightsFitnessConcept(draft.fitnessConcept)
      ? draft.fitnessConcept
      : defaults.fitnessConcept,
  };
}

export function validateHeightsDraft(
  input: SstHeightsDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    if (!input.workerId.trim()) {
      return "Selecciona un trabajador de la base maestra.";
    }
    return null;
  }

  if (!input.workerId.trim()) {
    return "Selecciona un trabajador de la base maestra.";
  }
  if (!isHeightsTrainingLevel(input.trainingLevel)) {
    return "Nivel / formación inválido.";
  }
  if (!isHeightsFitnessConcept(input.fitnessConcept)) {
    return "Concepto de aptitud inválido.";
  }
  return null;
}

export function hasHeightsCertificate(
  certificateUrl: string,
  certificateName: string,
): boolean {
  return Boolean(certificateUrl.trim()) || Boolean(certificateName.trim());
}

export function leastDueDate(
  a: string | null | undefined,
  b: string | null | undefined,
): string | null {
  const left = a?.trim() || null;
  const right = b?.trim() || null;
  if (!left) return right;
  if (!right) return left;
  return left <= right ? left : right;
}

/**
 * Regla de autorización operativa (Res. 4272):
 * - autorizado solo si formación y EMO vigentes (> hoy), aptitud apta y certificado presente
 * - por_vencer si autorizado pero algún vencimiento ≤ 30 días
 * - en caso contrario no_autorizado
 */
export function computeAuthorization(
  input: {
    trainingDueDate: string | null | undefined;
    medicalExamDueDate: string | null | undefined;
    fitnessConcept: HeightsFitnessConcept;
    certificateUrl: string;
    certificateName: string;
  },
  today = new Date(),
): HeightsAuthorizationStatus {
  const trainingDays = computeDaysRemaining(input.trainingDueDate?.trim() || null, today);
  const medicalDays = computeDaysRemaining(
    input.medicalExamDueDate?.trim() || null,
    today,
  );
  const trainingOk = trainingDays !== null && trainingDays > 0;
  const medicalOk = medicalDays !== null && medicalDays > 0;
  const fitnessOk =
    input.fitnessConcept === "apto" || input.fitnessConcept === "apto_recomendaciones";
  const certificateOk = hasHeightsCertificate(
    input.certificateUrl,
    input.certificateName,
  );

  if (!trainingOk || !medicalOk || !fitnessOk || !certificateOk) {
    return "no_autorizado";
  }

  const within30 =
    trainingDays <= DEFAULT_ALERT_THRESHOLDS.orangeMaxDays ||
    medicalDays <= DEFAULT_ALERT_THRESHOLDS.orangeMaxDays;
  return within30 ? "por_vencer" : "autorizado";
}

export function listMissingRequirements(
  input: {
    trainingDueDate: string | null | undefined;
    medicalExamDueDate: string | null | undefined;
    fitnessConcept: HeightsFitnessConcept;
    certificateUrl: string;
    certificateName: string;
  },
  today = new Date(),
): string[] {
  const missing: string[] = [];
  const trainingDays = computeDaysRemaining(input.trainingDueDate?.trim() || null, today);
  const medicalDays = computeDaysRemaining(
    input.medicalExamDueDate?.trim() || null,
    today,
  );

  if (trainingDays === null) {
    missing.push("Sin fecha de vencimiento de formación");
  } else if (trainingDays <= 0) {
    missing.push("Formación vencida");
  }

  if (medicalDays === null) {
    missing.push("Sin vencimiento de examen médico");
  } else if (medicalDays <= 0) {
    missing.push("Examen médico vencido");
  }

  if (input.fitnessConcept === "pendiente") {
    missing.push("Concepto de aptitud pendiente");
  } else if (input.fitnessConcept === "no_apto") {
    missing.push("Concepto no apto");
  }

  if (!hasHeightsCertificate(input.certificateUrl, input.certificateName)) {
    missing.push("Certificado faltante");
  }

  return missing;
}

const SEMAPHORE_LABELS: Record<SstSemaphoreLevel, string> = {
  critico: "Vencido / bloqueado",
  proximo: "1–30 días",
  seguimiento: "31–60 días",
  vigente: ">60 días",
};

function semaphoreFromStatus(
  status: HeightsAuthorizationStatus,
  daysRemaining: number | null,
): SstSemaphoreLevel {
  if (status === "no_autorizado") return "critico";
  if (status === "por_vencer") return "proximo";
  if (daysRemaining === null) return "vigente";
  if (daysRemaining <= DEFAULT_ALERT_THRESHOLDS.yellowMaxDays) return "seguimiento";
  return "vigente";
}

export function enrichHeightsAsView(
  item: SstHeightsAuthorization,
  today = new Date(),
): SstHeightsView {
  const trainingDaysRemaining = computeDaysRemaining(item.trainingDueDate, today);
  const medicalDaysRemaining = computeDaysRemaining(item.medicalExamDueDate, today);
  const effectiveDue = leastDueDate(item.trainingDueDate, item.medicalExamDueDate);
  const daysRemaining = computeDaysRemaining(effectiveDue, today);
  const missingRequirements = listMissingRequirements(item, today);
  const authorizationStatus = computeAuthorization(item, today);
  const semaphore = semaphoreFromStatus(authorizationStatus, daysRemaining);

  return {
    ...item,
    authorizationStatus,
    trainingDaysRemaining,
    medicalDaysRemaining,
    daysRemaining,
    semaphore,
    semaphoreLabel: SEMAPHORE_LABELS[semaphore],
    missingRequirements,
  };
}

export function parseTrainingLevelLabel(raw: string): HeightsTrainingLevel | null {
  const normalized = raw.trim().toLowerCase();
  if (isHeightsTrainingLevel(normalized)) return normalized;
  const map: Record<string, HeightsTrainingLevel> = {
    autorizado_32h: "autorizado_32h",
    "trabajador autorizado (32 h)": "autorizado_32h",
    "trabajador autorizado 32h": "autorizado_32h",
    "autorizado 32h": "autorizado_32h",
    "32h": "autorizado_32h",
    reentrenamiento_8h: "reentrenamiento_8h",
    "reentrenamiento anual (8 h)": "reentrenamiento_8h",
    "reentrenamiento 8h": "reentrenamiento_8h",
    "8h": "reentrenamiento_8h",
    coordinador_80h: "coordinador_80h",
    "coordinador de alturas (80 h)": "coordinador_80h",
    "coordinador 80h": "coordinador_80h",
    "80h": "coordinador_80h",
    jefe_area: "jefe_area",
    "jefe de area": "jefe_area",
    "jefe de área": "jefe_area",
  };
  return map[normalized] ?? null;
}

export function parseFitnessLabel(raw: string): HeightsFitnessConcept | null {
  const normalized = raw.trim().toLowerCase();
  if (isHeightsFitnessConcept(normalized)) return normalized;
  const map: Record<string, HeightsFitnessConcept> = {
    apto: "apto",
    "apto sin restricciones": "apto",
    "apto con recomendaciones": "apto_recomendaciones",
    "apto recomendaciones": "apto_recomendaciones",
    apto_recomendaciones: "apto_recomendaciones",
    "apto con recomendacion": "apto_recomendaciones",
    "no apto": "no_apto",
    no_apto: "no_apto",
    pendiente: "pendiente",
  };
  return map[normalized] ?? null;
}

export function parseYesNo(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  return ["si", "sí", "yes", "true", "1", "x"].includes(v);
}
