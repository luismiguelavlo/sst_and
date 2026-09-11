import { computeDaysRemaining } from "@/lib/sg-sst/alerts/engine";
import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";

export const EQUIPMENT_TYPES = [
  "tractor",
  "cosechadora",
  "fumigadora",
  "camion",
  "otro",
] as const;
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

export const FITNESS_CONCEPTS = [
  "apto",
  "apto_recomendaciones",
  "no_apto",
  "pendiente",
] as const;
export type FitnessConcept = (typeof FITNESS_CONCEPTS)[number];

export const KEY_STATUSES = ["autorizado", "bloqueado"] as const;
export type KeyStatus = (typeof KEY_STATUSES)[number];

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  tractor: "Tractor",
  cosechadora: "Cosechadora",
  fumigadora: "Fumigadora",
  camion: "Camión",
  otro: "Otro",
};

export const FITNESS_CONCEPT_LABELS: Record<FitnessConcept, string> = {
  apto: "Apto",
  apto_recomendaciones: "Apto con recomendaciones",
  no_apto: "No apto",
  pendiente: "Pendiente",
};

export const KEY_STATUS_LABELS: Record<KeyStatus, string> = {
  autorizado: "Autorizado",
  bloqueado: "Bloqueado",
};

export type OperatorBlockCategory =
  | "formacion_vencida"
  | "formacion_pendiente"
  | "documentacion_pendiente"
  | "aptitud_pendiente"
  | "requisitos_incompletos";

export const BLOCK_CATEGORY_LABELS: Record<OperatorBlockCategory, string> = {
  formacion_vencida: "Formación vencida",
  formacion_pendiente: "Formación pendiente",
  documentacion_pendiente: "Documentación pendiente",
  aptitud_pendiente: "Aptitud pendiente",
  requisitos_incompletos: "Requisitos incompletos",
};

export type SstOperator = {
  id: string;
  folio: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  workerStatus: string;
  farmId: string | null;
  farmName: string | null;
  equipmentName: string;
  equipmentType: EquipmentType;
  trainingName: string;
  trainingDate: string | null;
  trainingDueDate: string | null;
  licenseCategory: string;
  licenseDueDate: string | null;
  occupationalExamDate: string | null;
  fitnessConcept: FitnessConcept;
  inductionDone: boolean;
  inductionDate: string | null;
  keyStatus: KeyStatus;
  blockReasons: string;
  observations: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstOperatorDraft = {
  id?: string;
  workerId: string;
  farmId?: string | null;
  equipmentName: string;
  equipmentType: EquipmentType;
  trainingName: string;
  trainingDate?: string | null;
  trainingDueDate?: string | null;
  licenseCategory: string;
  licenseDueDate?: string | null;
  occupationalExamDate?: string | null;
  fitnessConcept: FitnessConcept;
  inductionDone: boolean;
  inductionDate?: string | null;
  observations: string;
};

export type SstOperatorView = SstOperator & {
  trainingDaysRemaining: number | null;
  licenseDaysRemaining: number | null;
  blockReasonList: string[];
  blockCategories: OperatorBlockCategory[];
};

export type OperatorStats = {
  total: number;
  authorized: number;
  blocked: number;
  atRisk: number;
  byEquipmentType: Record<EquipmentType, number>;
  byBlockCategory: Record<OperatorBlockCategory, number>;
};

export function isEquipmentType(value: string): value is EquipmentType {
  return (EQUIPMENT_TYPES as readonly string[]).includes(value);
}

export function isFitnessConcept(value: string): value is FitnessConcept {
  return (FITNESS_CONCEPTS as readonly string[]).includes(value);
}

export function isKeyStatus(value: string): value is KeyStatus {
  return (KEY_STATUSES as readonly string[]).includes(value);
}

export function emptyOperatorDraft(workerId = ""): SstOperatorDraft {
  return {
    workerId,
    farmId: null,
    equipmentName: "",
    equipmentType: "tractor",
    trainingName: "",
    trainingDate: "",
    trainingDueDate: "",
    licenseCategory: "",
    licenseDueDate: "",
    occupationalExamDate: "",
    fitnessConcept: "pendiente",
    inductionDone: false,
    inductionDate: "",
    observations: "",
  };
}

export function draftFromOperator(item: SstOperator): SstOperatorDraft {
  return {
    id: item.id,
    workerId: item.workerId,
    farmId: item.farmId,
    equipmentName: item.equipmentName,
    equipmentType: item.equipmentType,
    trainingName: item.trainingName,
    trainingDate: item.trainingDate ?? "",
    trainingDueDate: item.trainingDueDate ?? "",
    licenseCategory: item.licenseCategory,
    licenseDueDate: item.licenseDueDate ?? "",
    occupationalExamDate: item.occupationalExamDate ?? "",
    fitnessConcept: item.fitnessConcept,
    inductionDone: item.inductionDone,
    inductionDate: item.inductionDate ?? "",
    observations: item.observations,
  };
}

/** Completa campos faltantes para importación Excel. */
export function normalizeOperatorDraftForImport(
  draft: SstOperatorDraft,
): SstOperatorDraft {
  const defaults = emptyOperatorDraft(draft.workerId);
  return {
    ...draft,
    equipmentName: draft.equipmentName.trim() || "Sin equipo",
    equipmentType: isEquipmentType(draft.equipmentType)
      ? draft.equipmentType
      : defaults.equipmentType,
    trainingName: draft.trainingName.trim() || "Sin capacitación",
    fitnessConcept: isFitnessConcept(draft.fitnessConcept)
      ? draft.fitnessConcept
      : defaults.fitnessConcept,
  };
}

export function validateOperatorDraft(
  input: SstOperatorDraft,
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
  if (!input.equipmentName.trim()) {
    return "El nombre del equipo es obligatorio.";
  }
  if (!isEquipmentType(input.equipmentType)) {
    return "Tipo de equipo inválido.";
  }
  if (!input.trainingName.trim()) {
    return "El nombre de la capacitación es obligatorio.";
  }
  if (!isFitnessConcept(input.fitnessConcept)) {
    return "Concepto de aptitud inválido.";
  }
  return null;
}

function isDateStrictlyAfterToday(
  iso: string | null | undefined,
  today = new Date(),
): boolean {
  if (!iso?.trim()) return false;
  const days = computeDaysRemaining(iso.trim(), today);
  return days !== null && days > 0;
}

function isDateExpiredOrToday(
  iso: string | null | undefined,
  today = new Date(),
): boolean {
  if (!iso?.trim()) return false;
  const days = computeDaysRemaining(iso.trim(), today);
  return days !== null && days <= 0;
}

export function collectBlockReasons(
  input: {
    trainingDueDate?: string | null;
    licenseDueDate?: string | null;
    fitnessConcept: FitnessConcept;
    inductionDone: boolean;
  },
  today = new Date(),
): { reasons: string[]; categories: OperatorBlockCategory[] } {
  const reasons: string[] = [];
  const categories: OperatorBlockCategory[] = [];

  const trainingDue = input.trainingDueDate?.trim() || null;
  if (!trainingDue) {
    reasons.push("Formación pendiente");
    categories.push("formacion_pendiente");
  } else if (isDateExpiredOrToday(trainingDue, today)) {
    reasons.push("Formación vencida");
    categories.push("formacion_vencida");
  }

  const licenseDue = input.licenseDueDate?.trim() || null;
  if (licenseDue && isDateExpiredOrToday(licenseDue, today)) {
    reasons.push("Documentación pendiente");
    categories.push("documentacion_pendiente");
  }

  if (input.fitnessConcept === "pendiente") {
    reasons.push("Aptitud pendiente");
    categories.push("aptitud_pendiente");
  } else if (input.fitnessConcept === "no_apto") {
    reasons.push("Aptitud pendiente");
    categories.push("aptitud_pendiente");
  }

  if (!input.inductionDone) {
    reasons.push("Requisitos incompletos");
    categories.push("requisitos_incompletos");
  }

  return { reasons, categories };
}

export function resolveAuthorization(
  input: {
    trainingDueDate?: string | null;
    licenseDueDate?: string | null;
    fitnessConcept: FitnessConcept;
    inductionDone: boolean;
  },
  today = new Date(),
): { keyStatus: KeyStatus; blockReasons: string; categories: OperatorBlockCategory[] } {
  const trainingOk = isDateStrictlyAfterToday(input.trainingDueDate, today);
  const fitnessOk =
    input.fitnessConcept === "apto" || input.fitnessConcept === "apto_recomendaciones";
  const inductionOk = input.inductionDone;
  const licenseDue = input.licenseDueDate?.trim() || null;
  const licenseOk = !licenseDue || isDateStrictlyAfterToday(licenseDue, today);

  if (trainingOk && fitnessOk && inductionOk && licenseOk) {
    return { keyStatus: "autorizado", blockReasons: "", categories: [] };
  }

  const { reasons, categories } = collectBlockReasons(input, today);
  return {
    keyStatus: "bloqueado",
    blockReasons: reasons.join("; "),
    categories,
  };
}

export function parseBlockReasons(raw: string): string[] {
  return raw
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function categorizeBlockReasons(reasons: string[]): OperatorBlockCategory[] {
  const categories = new Set<OperatorBlockCategory>();
  for (const reason of reasons) {
    const lower = reason.toLowerCase();
    if (lower.includes("formación vencida") || lower.includes("formacion vencida")) {
      categories.add("formacion_vencida");
    } else if (
      lower.includes("formación pendiente") ||
      lower.includes("formacion pendiente")
    ) {
      categories.add("formacion_pendiente");
    } else if (
      lower.includes("documentación") ||
      lower.includes("documentacion") ||
      lower.includes("licencia")
    ) {
      categories.add("documentacion_pendiente");
    } else if (lower.includes("aptitud")) {
      categories.add("aptitud_pendiente");
    } else if (lower.includes("requisito") || lower.includes("inducción") || lower.includes("induccion")) {
      categories.add("requisitos_incompletos");
    }
  }
  return [...categories];
}

export function enrichOperatorAsView(
  item: SstOperator,
  today = new Date(),
): SstOperatorView {
  const blockReasonList = parseBlockReasons(item.blockReasons);
  const auth = resolveAuthorization(
    {
      trainingDueDate: item.trainingDueDate,
      licenseDueDate: item.licenseDueDate,
      fitnessConcept: item.fitnessConcept,
      inductionDone: item.inductionDone,
    },
    today,
  );
  return {
    ...item,
    trainingDaysRemaining: computeDaysRemaining(item.trainingDueDate, today),
    licenseDaysRemaining: computeDaysRemaining(item.licenseDueDate, today),
    blockReasonList,
    blockCategories:
      item.keyStatus === "bloqueado"
        ? auth.categories.length > 0
          ? auth.categories
          : categorizeBlockReasons(blockReasonList)
        : [],
  };
}

export function parseEquipmentTypeLabel(raw: string): EquipmentType | null {
  const normalized = raw.trim().toLowerCase();
  if (isEquipmentType(normalized)) return normalized;
  const map: Record<string, EquipmentType> = {
    tractor: "tractor",
    cosechadora: "cosechadora",
    fumigadora: "fumigadora",
    camion: "camion",
    camión: "camion",
    otro: "otro",
    otros: "otro",
  };
  return map[normalized] ?? null;
}

export function parseFitnessConceptLabel(raw: string): FitnessConcept | null {
  const normalized = raw.trim().toLowerCase();
  if (isFitnessConcept(normalized)) return normalized;
  const map: Record<string, FitnessConcept> = {
    apto: "apto",
    "apto con recomendaciones": "apto_recomendaciones",
    "apto recomendaciones": "apto_recomendaciones",
    apto_recomendaciones: "apto_recomendaciones",
    "no apto": "no_apto",
    no_apto: "no_apto",
    pendiente: "pendiente",
  };
  return map[normalized] ?? null;
}

export function parseYesNo(raw: string): boolean | null {
  const v = raw.trim().toLowerCase();
  if (!v) return null;
  if (["si", "sí", "yes", "true", "1", "x"].includes(v)) return true;
  if (["no", "false", "0"].includes(v)) return false;
  return null;
}

export function isOperatorAtRisk(view: SstOperatorView): boolean {
  if (view.keyStatus !== "autorizado") return false;
  const trainingSoon =
    view.trainingDaysRemaining !== null &&
    view.trainingDaysRemaining > 0 &&
    view.trainingDaysRemaining <= 30;
  const licenseSoon =
    view.licenseDaysRemaining !== null &&
    view.licenseDaysRemaining > 0 &&
    view.licenseDaysRemaining <= 30;
  return trainingSoon || licenseSoon;
}
