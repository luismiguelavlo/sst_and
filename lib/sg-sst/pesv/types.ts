import { computeDaysRemaining } from "@/lib/sg-sst/alerts/engine";
import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const PESV_VEHICLE_STATUSES = ["apto", "alerta", "detenido"] as const;
export type PesvVehicleStatus = (typeof PESV_VEHICLE_STATUSES)[number];

export const PESV_FITNESS_CONCEPTS = [
  "apto",
  "apto_recomendaciones",
  "no_apto",
  "pendiente",
] as const;
export type PesvFitnessConcept = (typeof PESV_FITNESS_CONCEPTS)[number];

export const PESV_AUTH_STATUSES = [
  "autorizado",
  "no_autorizado",
  "suspendido",
  "por_vencer",
] as const;
export type PesvAuthStatus = (typeof PESV_AUTH_STATUSES)[number];

export const PESV_PREOP_STATUSES = [
  "abierto",
  "programado",
  "cerrado",
  "detenido",
] as const;
export type PesvPreopStatus = (typeof PESV_PREOP_STATUSES)[number];

export const PESV_VEHICLE_STATUS_LABELS: Record<PesvVehicleStatus, string> = {
  apto: "Apto",
  alerta: "Alerta",
  detenido: "Detenido",
};

export const PESV_FITNESS_LABELS: Record<PesvFitnessConcept, string> = {
  apto: "Apto",
  apto_recomendaciones: "Apto con recomendaciones",
  no_apto: "No apto",
  pendiente: "Pendiente",
};

export const PESV_AUTH_LABELS: Record<PesvAuthStatus, string> = {
  autorizado: "Autorizado",
  no_autorizado: "No autorizado",
  suspendido: "Suspendido",
  por_vencer: "Por vencer",
};

export const PESV_PREOP_STATUS_LABELS: Record<PesvPreopStatus, string> = {
  abierto: "Abierto",
  programado: "Programado",
  cerrado: "Cerrado",
  detenido: "Detenido",
};

export type SstPesvVehicle = {
  id: string;
  plate: string;
  vehicleType: string;
  brand: string;
  model: string;
  responsibleWorkerId: string | null;
  responsibleName: string | null;
  responsibleDocument: string | null;
  workCenter: string;
  farmId: string | null;
  farmName: string | null;
  status: PesvVehicleStatus;
  soatDueDate: string | null;
  rtmDueDate: string | null;
  insuranceDueDate: string | null;
  odometerKm: number;
  kitOk: boolean;
  extinguisherOk: boolean;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstPesvVehicleDraft = {
  id?: string;
  plate: string;
  vehicleType: string;
  brand: string;
  model: string;
  responsibleWorkerId?: string | null;
  workCenter: string;
  farmId?: string | null;
  status: PesvVehicleStatus;
  soatDueDate?: string | null;
  rtmDueDate?: string | null;
  insuranceDueDate?: string | null;
  odometerKm: number;
  kitOk: boolean;
  extinguisherOk: boolean;
  observations: string;
};

export type SstPesvDriver = {
  id: string;
  folio: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  workerStatus: string;
  vehicleId: string | null;
  vehiclePlate: string | null;
  vehicleType: string;
  plateSnapshot: string;
  licenseCategory: string;
  licenseDueDate: string | null;
  roadSafetyCourseDate: string | null;
  roadSafetyCourseDue: string | null;
  medicalExamDate: string | null;
  fitnessConcept: PesvFitnessConcept;
  authorizationStatus: PesvAuthStatus;
  observations: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  farmId: string | null;
  farmName: string | null;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstPesvDriverDraft = {
  id?: string;
  workerId: string;
  vehicleId?: string | null;
  vehicleType: string;
  plateSnapshot: string;
  licenseCategory: string;
  licenseDueDate?: string | null;
  roadSafetyCourseDate?: string | null;
  roadSafetyCourseDue?: string | null;
  medicalExamDate?: string | null;
  fitnessConcept: PesvFitnessConcept;
  /** Si es `suspendido`, se respeta; en otro caso se recalcula. */
  authorizationStatus?: PesvAuthStatus;
  observations: string;
};

export type SstPesvPreop = {
  id: string;
  folio: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleType: string;
  inspectionDate: string;
  category: string;
  finding: string;
  status: PesvPreopStatus;
  odometerKm: number | null;
  evidenceUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type SstPesvPreopDraft = {
  id?: string;
  vehicleId: string;
  inspectionDate: string;
  category: string;
  finding: string;
  status: PesvPreopStatus;
  odometerKm?: number | null;
  evidenceUrl: string;
};

export type PesvStats = {
  preopsPct: number;
  preopsLast30d: number;
  vehicleCount: number;
  driversAuthorized: number;
  driversTotal: number;
  vehiclesAptos: number;
  docsDueSoon: number;
  openFindings: number;
  totalKm: number;
  incidents: number;
  accidents: number;
};

export function isPesvVehicleStatus(value: string): value is PesvVehicleStatus {
  return (PESV_VEHICLE_STATUSES as readonly string[]).includes(value);
}

export function isPesvFitnessConcept(value: string): value is PesvFitnessConcept {
  return (PESV_FITNESS_CONCEPTS as readonly string[]).includes(value);
}

export function isPesvAuthStatus(value: string): value is PesvAuthStatus {
  return (PESV_AUTH_STATUSES as readonly string[]).includes(value);
}

export function isPesvPreopStatus(value: string): value is PesvPreopStatus {
  return (PESV_PREOP_STATUSES as readonly string[]).includes(value);
}

export function emptyVehicleDraft(): SstPesvVehicleDraft {
  return {
    plate: "",
    vehicleType: "camioneta",
    brand: "",
    model: "",
    responsibleWorkerId: null,
    workCenter: "",
    farmId: null,
    status: "apto",
    soatDueDate: "",
    rtmDueDate: "",
    insuranceDueDate: "",
    odometerKm: 0,
    kitOk: true,
    extinguisherOk: true,
    observations: "",
  };
}

export function draftFromVehicle(vehicle: SstPesvVehicle): SstPesvVehicleDraft {
  return {
    id: vehicle.id,
    plate: vehicle.plate,
    vehicleType: vehicle.vehicleType,
    brand: vehicle.brand,
    model: vehicle.model,
    responsibleWorkerId: vehicle.responsibleWorkerId,
    workCenter: vehicle.workCenter,
    farmId: vehicle.farmId,
    status: vehicle.status,
    soatDueDate: vehicle.soatDueDate ?? "",
    rtmDueDate: vehicle.rtmDueDate ?? "",
    insuranceDueDate: vehicle.insuranceDueDate ?? "",
    odometerKm: vehicle.odometerKm,
    kitOk: vehicle.kitOk,
    extinguisherOk: vehicle.extinguisherOk,
    observations: vehicle.observations,
  };
}

export function emptyDriverDraft(workerId = ""): SstPesvDriverDraft {
  return {
    workerId,
    vehicleId: null,
    vehicleType: "",
    plateSnapshot: "",
    licenseCategory: "",
    licenseDueDate: "",
    roadSafetyCourseDate: "",
    roadSafetyCourseDue: "",
    medicalExamDate: "",
    fitnessConcept: "pendiente",
    observations: "",
  };
}

export function draftFromDriver(driver: SstPesvDriver): SstPesvDriverDraft {
  return {
    id: driver.id,
    workerId: driver.workerId,
    vehicleId: driver.vehicleId,
    vehicleType: driver.vehicleType,
    plateSnapshot: driver.plateSnapshot,
    licenseCategory: driver.licenseCategory,
    licenseDueDate: driver.licenseDueDate ?? "",
    roadSafetyCourseDate: driver.roadSafetyCourseDate ?? "",
    roadSafetyCourseDue: driver.roadSafetyCourseDue ?? "",
    medicalExamDate: driver.medicalExamDate ?? "",
    fitnessConcept: driver.fitnessConcept,
    authorizationStatus: driver.authorizationStatus,
    observations: driver.observations,
  };
}

export function emptyPreopDraft(vehicleId = ""): SstPesvPreopDraft {
  return {
    vehicleId,
    inspectionDate: todayIsoDate(),
    category: "general",
    finding: "",
    status: "abierto",
    odometerKm: null,
    evidenceUrl: "",
  };
}

/** Completa placa/enums faltantes para importación de vehículos. */
export function normalizeVehicleDraftForImport(
  draft: SstPesvVehicleDraft,
  rowNumber = 0,
): SstPesvVehicleDraft {
  const defaults = emptyVehicleDraft();
  const plate =
    draft.plate.trim().toUpperCase() ||
    `SIN-PLACA-${rowNumber || Date.now().toString(36).toUpperCase()}`;
  return {
    ...draft,
    plate,
    vehicleType: draft.vehicleType.trim() || defaults.vehicleType,
    status: isPesvVehicleStatus(draft.status) ? draft.status : defaults.status,
    odometerKm:
      Number.isFinite(draft.odometerKm) && draft.odometerKm >= 0
        ? draft.odometerKm
        : 0,
  };
}

/** Completa enums faltantes para importación de conductores. */
export function normalizeDriverDraftForImport(
  draft: SstPesvDriverDraft,
): SstPesvDriverDraft {
  const defaults = emptyDriverDraft(draft.workerId);
  return {
    ...draft,
    fitnessConcept: isPesvFitnessConcept(draft.fitnessConcept)
      ? draft.fitnessConcept
      : defaults.fitnessConcept,
    authorizationStatus:
      draft.authorizationStatus == null ||
      isPesvAuthStatus(draft.authorizationStatus)
        ? draft.authorizationStatus
        : undefined,
  };
}

export function validateVehicleDraft(
  input: SstPesvVehicleDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    if (!input.plate.trim()) {
      return "La placa es obligatoria.";
    }
    return null;
  }

  if (!input.plate.trim()) {
    return "La placa es obligatoria.";
  }
  if (!input.vehicleType.trim()) {
    return "El tipo de vehículo es obligatorio.";
  }
  if (!isPesvVehicleStatus(input.status)) {
    return "Estado de vehículo inválido.";
  }
  if (!Number.isFinite(input.odometerKm) || input.odometerKm < 0) {
    return "El odómetro debe ser un número ≥ 0.";
  }
  return null;
}

export function validateDriverDraft(
  input: SstPesvDriverDraft,
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
  if (!isPesvFitnessConcept(input.fitnessConcept)) {
    return "Concepto de aptitud inválido.";
  }
  if (
    input.authorizationStatus != null &&
    !isPesvAuthStatus(input.authorizationStatus)
  ) {
    return "Estado de autorización inválido.";
  }
  return null;
}

export function draftFromPreop(preop: SstPesvPreop): SstPesvPreopDraft {
  return {
    id: preop.id,
    vehicleId: preop.vehicleId,
    inspectionDate: preop.inspectionDate,
    category: preop.category,
    finding: preop.finding,
    status: preop.status,
    odometerKm: preop.odometerKm,
    evidenceUrl: preop.evidenceUrl,
  };
}

/**
 * Autorización PESV:
 * - autorizado si licencia > hoy, fitness apto|apto_recomendaciones y (curso null o > hoy)
 * - por_vencer si cumple lo anterior pero licencia/curso ≤ 30 días
 * - suspendido si fitness = no_apto (o se fuerza manualmente)
 * - no_autorizado en cualquier otro incumplimiento
 */
export function resolveDriverAuthorization(
  input: Pick<
    SstPesvDriverDraft,
    | "licenseDueDate"
    | "roadSafetyCourseDue"
    | "fitnessConcept"
    | "authorizationStatus"
  >,
  today = new Date(),
): PesvAuthStatus {
  if (input.authorizationStatus === "suspendido") {
    return "suspendido";
  }
  if (input.fitnessConcept === "no_apto") {
    return "suspendido";
  }

  const fitnessOk =
    input.fitnessConcept === "apto" ||
    input.fitnessConcept === "apto_recomendaciones";
  const licenseDays = computeDaysRemaining(
    emptyToNull(input.licenseDueDate),
    today,
  );
  const courseDue = emptyToNull(input.roadSafetyCourseDue);
  const courseDays = computeDaysRemaining(courseDue, today);
  const licenseOk = licenseDays !== null && licenseDays > 0;
  const courseOk = courseDue === null || (courseDays !== null && courseDays > 0);

  if (!fitnessOk || !licenseOk || !courseOk) {
    return "no_autorizado";
  }

  const within30 =
    (licenseDays !== null && licenseDays <= 30) ||
    (courseDays !== null && courseDays <= 30);
  return within30 ? "por_vencer" : "autorizado";
}

export function isDocDueSoon(
  dueDate: string | null | undefined,
  today = new Date(),
): boolean {
  const days = computeDaysRemaining(emptyToNull(dueDate), today);
  return days !== null && days >= 0 && days <= 30;
}

export function isIncidentCategory(category: string): boolean {
  return /incidente/i.test(category);
}

export function isAccidentCategory(category: string): boolean {
  return /accidente/i.test(category);
}

export function validatePreopDraft(input: SstPesvPreopDraft): string | null {
  if (!input.vehicleId.trim()) {
    return "Selecciona un vehículo.";
  }
  if (!input.inspectionDate.trim()) {
    return "La fecha de inspección es obligatoria.";
  }
  if (!input.category.trim()) {
    return "La categoría es obligatoria.";
  }
  if (!isPesvPreopStatus(input.status)) {
    return "Estado de preoperacional inválido.";
  }
  if (
    input.odometerKm != null &&
    (!Number.isFinite(input.odometerKm) || input.odometerKm < 0)
  ) {
    return "El odómetro debe ser un número ≥ 0.";
  }
  return null;
}

export function parseFitnessLabel(raw: string): PesvFitnessConcept | null {
  const normalized = raw.trim().toLowerCase();
  if (isPesvFitnessConcept(normalized)) return normalized;
  const map: Record<string, PesvFitnessConcept> = {
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

export function parseVehicleStatusLabel(raw: string): PesvVehicleStatus | null {
  const normalized = raw.trim().toLowerCase();
  if (isPesvVehicleStatus(normalized)) return normalized;
  const map: Record<string, PesvVehicleStatus> = {
    apto: "apto",
    alerta: "alerta",
    detenido: "detenido",
  };
  return map[normalized] ?? null;
}

export function parseAuthStatusLabel(raw: string): PesvAuthStatus | null {
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, "_");
  if (isPesvAuthStatus(normalized)) return normalized;
  const map: Record<string, PesvAuthStatus> = {
    autorizado: "autorizado",
    no_autorizado: "no_autorizado",
    "no autorizado": "no_autorizado",
    suspendido: "suspendido",
    por_vencer: "por_vencer",
    "por vencer": "por_vencer",
  };
  return map[normalized] ?? map[raw.trim().toLowerCase()] ?? null;
}

export function parsePreopStatusLabel(raw: string): PesvPreopStatus | null {
  const normalized = raw.trim().toLowerCase();
  if (isPesvPreopStatus(normalized)) return normalized;
  return null;
}

export function parseYesNo(raw: string, fallback = true): boolean {
  const v = raw.trim().toLowerCase();
  if (!v) return fallback;
  if (["si", "sí", "yes", "true", "1", "ok", "x"].includes(v)) return true;
  if (["no", "false", "0"].includes(v)) return false;
  return fallback;
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function nullishDate(value: string | null | undefined): string | null {
  return emptyToNull(value);
}
