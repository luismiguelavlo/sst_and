import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const CHEMICAL_UNITS = [
  "L",
  "mL",
  "kg",
  "g",
  "gal",
  "und",
  "caneca",
  "saco",
  "otro",
] as const;
export type ChemicalUnit = (typeof CHEMICAL_UNITS)[number];

export const CHEMICAL_UNIT_LABELS: Record<ChemicalUnit, string> = {
  L: "Litros (L)",
  mL: "Mililitros (mL)",
  kg: "Kilogramos (kg)",
  g: "Gramos (g)",
  gal: "Galones",
  und: "Unidades",
  caneca: "Caneca",
  saco: "Saco",
  otro: "Otro",
};

export const CHEMICAL_STATUSES = [
  "activo",
  "agotado",
  "restringido",
  "descontinuado",
  "vencido",
] as const;
export type ChemicalStatus = (typeof CHEMICAL_STATUSES)[number];

export const CHEMICAL_STATUS_LABELS: Record<ChemicalStatus, string> = {
  activo: "Activo",
  agotado: "Agotado",
  restringido: "Uso restringido",
  descontinuado: "Descontinuado",
  vencido: "Vencido",
};

export const CHEMICAL_TRAINING_STATUSES = [
  "vigente",
  "pendiente",
  "vencida",
  "no_aplica",
] as const;
export type ChemicalTrainingStatus = (typeof CHEMICAL_TRAINING_STATUSES)[number];

export const CHEMICAL_TRAINING_LABELS: Record<ChemicalTrainingStatus, string> = {
  vigente: "Capacitación vigente",
  pendiente: "Pendiente",
  vencida: "Vencida",
  no_aplica: "No aplica",
};

export type SstChemical = {
  id: string;
  code: string;
  productName: string;
  farmId: string | null;
  farmName: string | null;
  area: string;
  responsibleName: string;
  safetySheetUrl: string;
  safetySheetName: string;
  safetySheetUpdatedAt: string | null;
  requiredEpp: string;
  storageConditions: string;
  quantity: number;
  unit: ChemicalUnit;
  lastInspectionAt: string | null;
  nextInspectionAt: string | null;
  inspectionNotes: string;
  trainingStatus: ChemicalTrainingStatus;
  lastTrainingAt: string | null;
  trainingNotes: string;
  status: ChemicalStatus;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstChemicalDraft = {
  id?: string;
  code?: string;
  productName: string;
  farmId: string | null;
  area: string;
  responsibleName: string;
  safetySheetUrl: string;
  safetySheetName: string;
  safetySheetUpdatedAt: string;
  requiredEpp: string;
  storageConditions: string;
  quantity: number;
  unit: ChemicalUnit;
  lastInspectionAt: string;
  nextInspectionAt: string;
  inspectionNotes: string;
  trainingStatus: ChemicalTrainingStatus;
  lastTrainingAt: string;
  trainingNotes: string;
  status: ChemicalStatus;
  observations: string;
};

export type ChemicalStats = {
  total: number;
  active: number;
  withoutSafetySheet: number;
  inspectionDue: number;
  trainingPending: number;
};

export function isChemicalUnit(value: string): value is ChemicalUnit {
  return (CHEMICAL_UNITS as readonly string[]).includes(value);
}

export function isChemicalStatus(value: string): value is ChemicalStatus {
  return (CHEMICAL_STATUSES as readonly string[]).includes(value);
}

export function isChemicalTrainingStatus(
  value: string,
): value is ChemicalTrainingStatus {
  return (CHEMICAL_TRAINING_STATUSES as readonly string[]).includes(value);
}

export function emptyChemicalDraft(): SstChemicalDraft {
  return {
    productName: "",
    farmId: null,
    area: "",
    responsibleName: "",
    safetySheetUrl: "",
    safetySheetName: "",
    safetySheetUpdatedAt: todayIsoDate(),
    requiredEpp: "",
    storageConditions: "",
    quantity: 0,
    unit: "L",
    lastInspectionAt: "",
    nextInspectionAt: "",
    inspectionNotes: "",
    trainingStatus: "pendiente",
    lastTrainingAt: "",
    trainingNotes: "",
    status: "activo",
    observations: "",
  };
}

export function draftFromChemical(item: SstChemical): SstChemicalDraft {
  return {
    id: item.id,
    code: item.code,
    productName: item.productName,
    farmId: item.farmId,
    area: item.area,
    responsibleName: item.responsibleName,
    safetySheetUrl: item.safetySheetUrl,
    safetySheetName: item.safetySheetName,
    safetySheetUpdatedAt: item.safetySheetUpdatedAt ?? "",
    requiredEpp: item.requiredEpp,
    storageConditions: item.storageConditions,
    quantity: item.quantity,
    unit: item.unit,
    lastInspectionAt: item.lastInspectionAt ?? "",
    nextInspectionAt: item.nextInspectionAt ?? "",
    inspectionNotes: item.inspectionNotes,
    trainingStatus: item.trainingStatus,
    lastTrainingAt: item.lastTrainingAt ?? "",
    trainingNotes: item.trainingNotes,
    status: item.status,
    observations: item.observations,
  };
}

export function hasSafetySheet(item: Pick<SstChemical, "safetySheetUrl" | "safetySheetName">): boolean {
  return Boolean(item.safetySheetUrl.trim() || item.safetySheetName.trim());
}

export function validateChemicalDraft(
  input: SstChemicalDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    if (!input.productName.trim()) return "Producto vacío.";
    return null;
  }
  if (!input.productName.trim()) return "El producto es obligatorio.";
  if (!input.responsibleName.trim()) return "El responsable es obligatorio.";
  if (!isChemicalUnit(input.unit)) return "Unidad inválida.";
  if (!isChemicalStatus(input.status)) return "Estado inválido.";
  if (!isChemicalTrainingStatus(input.trainingStatus)) {
    return "Estado de capacitación inválido.";
  }
  if (!Number.isFinite(input.quantity) || input.quantity < 0) {
    return "La cantidad debe ser un número mayor o igual a 0.";
  }
  return null;
}

export function normalizeChemicalDraftForImport(
  draft: SstChemicalDraft,
  rowNumber: number,
): SstChemicalDraft {
  return {
    ...draft,
    productName: draft.productName.trim() || `Producto ${rowNumber}`,
    responsibleName: draft.responsibleName.trim() || "Sin responsable",
    area: draft.area.trim(),
    safetySheetUrl: draft.safetySheetUrl.trim(),
    safetySheetName: draft.safetySheetName.trim(),
    safetySheetUpdatedAt: draft.safetySheetUpdatedAt.trim() || todayIsoDate(),
    requiredEpp: draft.requiredEpp.trim() || "Sin dato",
    storageConditions: draft.storageConditions.trim() || "Sin dato",
    quantity: Number.isFinite(draft.quantity) && draft.quantity >= 0 ? draft.quantity : 0,
    unit: isChemicalUnit(draft.unit) ? draft.unit : "L",
    lastInspectionAt: draft.lastInspectionAt.trim(),
    nextInspectionAt: draft.nextInspectionAt.trim(),
    inspectionNotes: draft.inspectionNotes.trim(),
    trainingStatus: isChemicalTrainingStatus(draft.trainingStatus)
      ? draft.trainingStatus
      : "pendiente",
    lastTrainingAt: draft.lastTrainingAt.trim(),
    trainingNotes: draft.trainingNotes.trim(),
    status: isChemicalStatus(draft.status) ? draft.status : "activo",
    observations: draft.observations.trim(),
  };
}

export function formatQuantity(quantity: number, unit: ChemicalUnit): string {
  const value = Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(2);
  return `${value} ${unit}`;
}
