import { computeDaysRemaining } from "@/lib/sg-sst/alerts/engine";
import type { SstWorkflowStatus } from "@/lib/sg-sst/alerts/types";
import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const BRIGADE_TYPES = [
  "primeros_auxilios",
  "evacuacion",
  "incendios",
  "rescate",
] as const;
export type BrigadeType = (typeof BRIGADE_TYPES)[number];

export const BRIGADE_STATUSES = [
  "vigente",
  "proximo",
  "vencido",
  "inactivo",
] as const;
export type BrigadeStatus = (typeof BRIGADE_STATUSES)[number];

/** Estados seleccionables en formulario (vigente/próximo/vencido se derivan). */
export const BRIGADE_MANUAL_STATUSES = ["vigente", "inactivo"] as const;
export type BrigadeManualStatus = (typeof BRIGADE_MANUAL_STATUSES)[number];

export const EQUIPMENT_TYPES = [
  "extintor",
  "botiquin",
  "camilla",
  "senalizacion",
  "linterna",
  "otro",
] as const;
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

export const EQUIPMENT_STATUSES = [
  "operativo",
  "requiere_mantenimiento",
  "fuera_servicio",
  "vencido_inspeccion",
] as const;
export type EquipmentStatus = (typeof EQUIPMENT_STATUSES)[number];

export const EQUIPMENT_MANUAL_STATUSES = [
  "operativo",
  "requiere_mantenimiento",
  "fuera_servicio",
] as const;
export type EquipmentManualStatus = (typeof EQUIPMENT_MANUAL_STATUSES)[number];

export const DRILL_TYPES = [
  "evacuacion",
  "incendio",
  "derrame",
  "sismo",
  "primeros_auxilios",
  "integral",
  "otro",
] as const;
export type DrillType = (typeof DRILL_TYPES)[number];

export const DRILL_STATUSES = ["programado", "realizado", "cancelado"] as const;
export type DrillStatus = (typeof DRILL_STATUSES)[number];

export const BRIGADE_TYPE_LABELS: Record<BrigadeType, string> = {
  primeros_auxilios: "Primeros auxilios",
  evacuacion: "Evacuación",
  incendios: "Incendios",
  rescate: "Rescate",
};

export const BRIGADE_STATUS_LABELS: Record<BrigadeStatus, string> = {
  vigente: "Vigente",
  proximo: "Próximo a vencer",
  vencido: "Vencido",
  inactivo: "Inactivo",
};

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  extintor: "Extintor",
  botiquin: "Botiquín",
  camilla: "Camilla",
  senalizacion: "Señalización",
  linterna: "Linterna",
  otro: "Otro",
};

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  operativo: "Operativo",
  requiere_mantenimiento: "Requiere mantenimiento",
  fuera_servicio: "Fuera de servicio",
  vencido_inspeccion: "Inspección vencida",
};

export const DRILL_TYPE_LABELS: Record<DrillType, string> = {
  evacuacion: "Evacuación",
  incendio: "Incendio",
  derrame: "Derrame",
  sismo: "Sismo",
  primeros_auxilios: "Primeros auxilios",
  integral: "Integral",
  otro: "Otro",
};

export const DRILL_STATUS_LABELS: Record<DrillStatus, string> = {
  programado: "Programado",
  realizado: "Realizado",
  cancelado: "Cancelado",
};

export type SstBrigadeMember = {
  id: string;
  folio: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  workerStatus: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  brigadeType: BrigadeType;
  trainingTitle: string;
  trainedAt: string;
  dueDate: string;
  status: BrigadeStatus;
  farmId: string | null;
  farmName: string | null;
  evidenceUrl: string;
  evidenceName: string;
  complianceRecordId: string | null;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstBrigadeMemberDraft = {
  id?: string;
  workerId: string;
  brigadeType: BrigadeType;
  trainingTitle: string;
  trainedAt: string;
  dueDate: string;
  /** `inactivo` se respeta; en otro caso se deriva desde due_date. */
  status?: BrigadeManualStatus | null;
  farmId?: string | null;
  evidenceUrl: string;
  evidenceName: string;
  observations: string;
  companySnapshot?: string;
  jobTitleSnapshot?: string;
};

export type SstBrigadeMemberView = SstBrigadeMember & {
  daysRemaining: number | null;
  effectiveStatus: BrigadeStatus;
};

export type SstEmergencyEquipment = {
  id: string;
  code: string;
  elementName: string;
  equipmentType: EquipmentType;
  location: string;
  inspectedAt: string | null;
  nextInspectionAt: string;
  responsibleName: string;
  status: EquipmentStatus;
  findings: string;
  farmId: string | null;
  farmName: string | null;
  complianceRecordId: string | null;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstEmergencyEquipmentDraft = {
  id?: string;
  /** Vacío en alta → se genera EQ-EM-YYYY-NNN. Editable y único. */
  code?: string;
  elementName: string;
  equipmentType: EquipmentType;
  location: string;
  inspectedAt?: string | null;
  nextInspectionAt: string;
  responsibleName: string;
  status: EquipmentManualStatus;
  findings: string;
  farmId?: string | null;
  observations: string;
};

export type SstEmergencyEquipmentView = SstEmergencyEquipment & {
  daysRemaining: number | null;
  effectiveStatus: EquipmentStatus;
  dueSoon: boolean;
};

export type SstEmergencyDrill = {
  id: string;
  folio: string;
  drillDate: string;
  place: string;
  drillType: DrillType;
  participantsCount: number;
  resultScore: number | null;
  resultLabel: string;
  findings: string;
  actions: string;
  status: DrillStatus;
  farmId: string | null;
  farmName: string | null;
  evidenceUrl: string;
  evidenceName: string;
  observations: string;
  createdAt: string;
  updatedAt: string;
};

export type SstEmergencyDrillDraft = {
  id?: string;
  drillDate: string;
  place: string;
  drillType: DrillType;
  participantsCount: number;
  resultScore?: number | null;
  resultLabel: string;
  findings: string;
  actions: string;
  status: DrillStatus;
  farmId?: string | null;
  evidenceUrl: string;
  evidenceName: string;
  observations: string;
};

export type EmergenciasStats = {
  brigadistasVigentes: number;
  formacionesVencidas: number;
  formacionesProximas: number;
  equiposPorInspeccionar: number;
  equiposVencidos: number;
  simulacrosDelAnio: number;
  brigadeTotal: number;
  equipmentTotal: number;
  drillsTotal: number;
  byBrigadeType: Record<BrigadeType, number>;
  byEquipmentType: Record<EquipmentType, number>;
  byDrillType: Record<DrillType, number>;
};

export function isBrigadeType(value: string): value is BrigadeType {
  return (BRIGADE_TYPES as readonly string[]).includes(value);
}

export function isBrigadeStatus(value: string): value is BrigadeStatus {
  return (BRIGADE_STATUSES as readonly string[]).includes(value);
}

export function isBrigadeManualStatus(
  value: string,
): value is BrigadeManualStatus {
  return (BRIGADE_MANUAL_STATUSES as readonly string[]).includes(value);
}

export function isEquipmentType(value: string): value is EquipmentType {
  return (EQUIPMENT_TYPES as readonly string[]).includes(value);
}

export function isEquipmentStatus(value: string): value is EquipmentStatus {
  return (EQUIPMENT_STATUSES as readonly string[]).includes(value);
}

export function isEquipmentManualStatus(
  value: string,
): value is EquipmentManualStatus {
  return (EQUIPMENT_MANUAL_STATUSES as readonly string[]).includes(value);
}

export function isDrillType(value: string): value is DrillType {
  return (DRILL_TYPES as readonly string[]).includes(value);
}

export function isDrillStatus(value: string): value is DrillStatus {
  return (DRILL_STATUSES as readonly string[]).includes(value);
}

export function emptyBrigadeDraft(workerId = ""): SstBrigadeMemberDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    workerId,
    brigadeType: "primeros_auxilios",
    trainingTitle: "",
    trainedAt: today,
    dueDate: today,
    status: "vigente",
    farmId: null,
    evidenceUrl: "",
    evidenceName: "",
    observations: "",
  };
}

export function draftFromBrigade(item: SstBrigadeMember): SstBrigadeMemberDraft {
  return {
    id: item.id,
    workerId: item.workerId,
    brigadeType: item.brigadeType,
    trainingTitle: item.trainingTitle,
    trainedAt: item.trainedAt,
    dueDate: item.dueDate,
    status: item.status === "inactivo" ? "inactivo" : "vigente",
    farmId: item.farmId,
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
    observations: item.observations,
    companySnapshot: item.companySnapshot,
    jobTitleSnapshot: item.jobTitleSnapshot,
  };
}

export function emptyEquipmentDraft(): SstEmergencyEquipmentDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    code: "",
    elementName: "",
    equipmentType: "extintor",
    location: "",
    inspectedAt: today,
    nextInspectionAt: today,
    responsibleName: "",
    status: "operativo",
    findings: "",
    farmId: null,
    observations: "",
  };
}

export function draftFromEquipment(
  item: SstEmergencyEquipment,
): SstEmergencyEquipmentDraft {
  const manual: EquipmentManualStatus =
    item.status === "fuera_servicio"
      ? "fuera_servicio"
      : item.status === "requiere_mantenimiento"
        ? "requiere_mantenimiento"
        : "operativo";
  return {
    id: item.id,
    code: item.code,
    elementName: item.elementName,
    equipmentType: item.equipmentType,
    location: item.location,
    inspectedAt: item.inspectedAt ?? "",
    nextInspectionAt: item.nextInspectionAt,
    responsibleName: item.responsibleName,
    status: manual,
    findings: item.findings,
    farmId: item.farmId,
    observations: item.observations,
  };
}

export function emptyDrillDraft(): SstEmergencyDrillDraft {
  return {
    drillDate: new Date().toISOString().slice(0, 10),
    place: "",
    drillType: "evacuacion",
    participantsCount: 0,
    resultScore: null,
    resultLabel: "",
    findings: "",
    actions: "",
    status: "programado",
    farmId: null,
    evidenceUrl: "",
    evidenceName: "",
    observations: "",
  };
}

export function draftFromDrill(item: SstEmergencyDrill): SstEmergencyDrillDraft {
  return {
    id: item.id,
    drillDate: item.drillDate,
    place: item.place,
    drillType: item.drillType,
    participantsCount: item.participantsCount,
    resultScore: item.resultScore,
    resultLabel: item.resultLabel,
    findings: item.findings,
    actions: item.actions,
    status: item.status,
    farmId: item.farmId,
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
    observations: item.observations,
  };
}

/**
 * Deriva vigente / próximo / vencido desde due_date cuando no está inactivo.
 * próximo si daysRemaining <= 30; vencido si daysRemaining < 0.
 */
export function deriveBrigadeStatus(
  stored: BrigadeStatus | BrigadeManualStatus | null | undefined,
  dueDate: string,
  today = new Date(),
): BrigadeStatus {
  if (stored === "inactivo") {
    return "inactivo";
  }
  const days = computeDaysRemaining(dueDate, today);
  if (days !== null && days < 0) {
    return "vencido";
  }
  if (days !== null && days <= 30) {
    return "proximo";
  }
  return "vigente";
}

export function resolveBrigadeStatusToPersist(
  draft: SstBrigadeMemberDraft,
  today = new Date(),
): BrigadeStatus {
  if (draft.status === "inactivo") {
    return "inactivo";
  }
  return deriveBrigadeStatus("vigente", draft.dueDate, today);
}

/**
 * Deriva vencido_inspeccion cuando next_inspection_at < hoy y no está fuera_servicio.
 */
export function deriveEquipmentStatus(
  stored: EquipmentStatus | EquipmentManualStatus,
  nextInspectionAt: string,
  today = new Date(),
): EquipmentStatus {
  if (stored === "fuera_servicio") {
    return "fuera_servicio";
  }
  const days = computeDaysRemaining(nextInspectionAt, today);
  if (days !== null && days < 0) {
    return "vencido_inspeccion";
  }
  if (stored === "requiere_mantenimiento") {
    return "requiere_mantenimiento";
  }
  return "operativo";
}

export function resolveEquipmentStatusToPersist(
  draft: SstEmergencyEquipmentDraft,
  today = new Date(),
): EquipmentStatus {
  return deriveEquipmentStatus(draft.status, draft.nextInspectionAt, today);
}

export function isEquipmentDueSoon(
  nextInspectionAt: string,
  status: EquipmentStatus,
  today = new Date(),
): boolean {
  if (status === "fuera_servicio" || status === "vencido_inspeccion") {
    return false;
  }
  const days = computeDaysRemaining(nextInspectionAt, today);
  return days !== null && days >= 0 && days <= 30;
}

export function toBrigadeComplianceWorkflow(
  status: BrigadeStatus,
): SstWorkflowStatus {
  if (status === "inactivo") return "closed";
  if (status === "vencido") return "pending_closure";
  return "open";
}

export function toEquipmentComplianceWorkflow(
  status: EquipmentStatus,
): SstWorkflowStatus {
  if (status === "fuera_servicio") return "closed";
  if (status === "vencido_inspeccion") return "pending_closure";
  return "open";
}

export function enrichBrigadeAsView(
  item: SstBrigadeMember,
  today = new Date(),
): SstBrigadeMemberView {
  const daysRemaining = computeDaysRemaining(item.dueDate, today);
  const effectiveStatus = deriveBrigadeStatus(item.status, item.dueDate, today);
  return { ...item, daysRemaining, effectiveStatus };
}

export function enrichEquipmentAsView(
  item: SstEmergencyEquipment,
  today = new Date(),
): SstEmergencyEquipmentView {
  const daysRemaining = computeDaysRemaining(item.nextInspectionAt, today);
  const effectiveStatus = deriveEquipmentStatus(
    item.status,
    item.nextInspectionAt,
    today,
  );
  return {
    ...item,
    daysRemaining,
    effectiveStatus,
    dueSoon: isEquipmentDueSoon(item.nextInspectionAt, effectiveStatus, today),
  };
}

export function validateBrigadeDraft(
  input: SstBrigadeMemberDraft,
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
  if (!isBrigadeType(input.brigadeType)) {
    return "Tipo de brigada inválido.";
  }
  if (!input.trainingTitle.trim()) {
    return "El título de la formación es obligatorio.";
  }
  if (!input.trainedAt.trim()) {
    return "La fecha de formación es obligatoria.";
  }
  if (!input.dueDate.trim()) {
    return "La fecha de vencimiento es obligatoria.";
  }
  if (input.status != null && !isBrigadeManualStatus(input.status)) {
    return "Estado inválido.";
  }
  return null;
}

export function validateEquipmentDraft(
  input: SstEmergencyEquipmentDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    if (!input.elementName.trim()) {
      return "El nombre del elemento es obligatorio.";
    }
    return null;
  }

  if (!input.elementName.trim()) {
    return "El nombre del elemento es obligatorio.";
  }
  if (!isEquipmentType(input.equipmentType)) {
    return "Tipo de equipo inválido.";
  }
  if (!input.location.trim()) {
    return "La ubicación es obligatoria.";
  }
  if (!input.nextInspectionAt.trim()) {
    return "La próxima inspección es obligatoria.";
  }
  if (!input.responsibleName.trim()) {
    return "El responsable es obligatorio.";
  }
  if (!isEquipmentManualStatus(input.status)) {
    return "Estado inválido.";
  }
  if (input.code?.trim() && input.code.trim().length > 40) {
    return "El código no puede superar 40 caracteres.";
  }
  return null;
}

export function validateDrillDraft(
  input: SstEmergencyDrillDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    return null;
  }

  if (!input.drillDate.trim()) {
    return "La fecha del simulacro es obligatoria.";
  }
  if (!input.place.trim()) {
    return "El lugar es obligatorio.";
  }
  if (!isDrillType(input.drillType)) {
    return "Tipo de simulacro inválido.";
  }
  if (
    !Number.isFinite(input.participantsCount) ||
    input.participantsCount < 0
  ) {
    return "El número de participantes debe ser ≥ 0.";
  }
  if (
    input.resultScore != null &&
    (!Number.isFinite(input.resultScore) ||
      input.resultScore < 0 ||
      input.resultScore > 100)
  ) {
    return "La calificación debe estar entre 0 y 100.";
  }
  if (!isDrillStatus(input.status)) {
    return "Estado inválido.";
  }
  return null;
}

/** Completa campos faltantes para importación Excel de brigada. */
export function normalizeBrigadeDraftForImport(
  draft: SstBrigadeMemberDraft,
): SstBrigadeMemberDraft {
  const defaults = emptyBrigadeDraft(draft.workerId);
  const today = todayIsoDate();
  return {
    ...draft,
    brigadeType: isBrigadeType(draft.brigadeType)
      ? draft.brigadeType
      : defaults.brigadeType,
    trainingTitle: draft.trainingTitle.trim() || "Sin título",
    trainedAt: draft.trainedAt.trim() || today,
    dueDate: draft.dueDate.trim() || today,
    status: isBrigadeManualStatus(draft.status ?? "")
      ? draft.status
      : defaults.status,
  };
}

/** Completa campos faltantes para importación Excel de equipos. */
export function normalizeEquipmentDraftForImport(
  draft: SstEmergencyEquipmentDraft,
): SstEmergencyEquipmentDraft {
  const defaults = emptyEquipmentDraft();
  const today = todayIsoDate();
  return {
    ...draft,
    elementName: draft.elementName.trim() || draft.code?.trim() || "Sin nombre",
    equipmentType: isEquipmentType(draft.equipmentType)
      ? draft.equipmentType
      : defaults.equipmentType,
    location: draft.location.trim() || "Sin dato",
    nextInspectionAt: draft.nextInspectionAt.trim() || today,
    responsibleName: draft.responsibleName.trim() || "Sin responsable",
    status: isEquipmentManualStatus(draft.status)
      ? draft.status
      : defaults.status,
  };
}

/** Completa campos faltantes para importación Excel de simulacros. */
export function normalizeDrillDraftForImport(
  draft: SstEmergencyDrillDraft,
): SstEmergencyDrillDraft {
  const defaults = emptyDrillDraft();
  return {
    ...draft,
    drillDate: draft.drillDate.trim() || todayIsoDate(),
    place: draft.place.trim() || "Sin dato",
    drillType: isDrillType(draft.drillType) ? draft.drillType : defaults.drillType,
    status: isDrillStatus(draft.status) ? draft.status : defaults.status,
    participantsCount: Number.isFinite(draft.participantsCount)
      ? Math.max(0, draft.participantsCount)
      : 0,
    resultScore:
      draft.resultScore != null &&
      Number.isFinite(draft.resultScore) &&
      draft.resultScore >= 0 &&
      draft.resultScore <= 100
        ? draft.resultScore
        : null,
  };
}

function normalizeLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function parseBrigadeTypeLabel(raw: string): BrigadeType | null {
  const normalized = normalizeLabel(raw);
  if (isBrigadeType(normalized)) return normalized;
  const map: Record<string, BrigadeType> = {
    "primeros auxilios": "primeros_auxilios",
    primeros_auxilios: "primeros_auxilios",
    pa: "primeros_auxilios",
    evacuacion: "evacuacion",
    "evacuación": "evacuacion",
    incendios: "incendios",
    incendio: "incendios",
    rescate: "rescate",
  };
  return map[normalized] ?? null;
}

export function parseBrigadeStatusLabel(raw: string): BrigadeStatus | null {
  const normalized = normalizeLabel(raw);
  if (isBrigadeStatus(normalized)) return normalized;
  const map: Record<string, BrigadeStatus> = {
    vigente: "vigente",
    vigentes: "vigente",
    proximo: "proximo",
    "proximo a vencer": "proximo",
    "próximo a vencer": "proximo",
    por_vencer: "proximo",
    "por vencer": "proximo",
    vencido: "vencido",
    vencidos: "vencido",
    inactivo: "inactivo",
    inactivos: "inactivo",
  };
  return map[normalized] ?? null;
}

export function parseEquipmentTypeLabel(raw: string): EquipmentType | null {
  const normalized = normalizeLabel(raw);
  if (isEquipmentType(normalized)) return normalized;
  const map: Record<string, EquipmentType> = {
    extintor: "extintor",
    botiquin: "botiquin",
    botiquín: "botiquin",
    camilla: "camilla",
    senalizacion: "senalizacion",
    señalizacion: "senalizacion",
    "señalización": "senalizacion",
    linterna: "linterna",
    otro: "otro",
  };
  return map[normalized] ?? null;
}

export function parseEquipmentStatusLabel(raw: string): EquipmentStatus | null {
  const normalized = normalizeLabel(raw);
  if (isEquipmentStatus(normalized)) return normalized;
  const map: Record<string, EquipmentStatus> = {
    operativo: "operativo",
    "requiere mantenimiento": "requiere_mantenimiento",
    requiere_mantenimiento: "requiere_mantenimiento",
    "fuera de servicio": "fuera_servicio",
    fuera_servicio: "fuera_servicio",
    "inspeccion vencida": "vencido_inspeccion",
    "inspección vencida": "vencido_inspeccion",
    vencido_inspeccion: "vencido_inspeccion",
    vencido: "vencido_inspeccion",
  };
  return map[normalized] ?? null;
}

export function parseDrillTypeLabel(raw: string): DrillType | null {
  const normalized = normalizeLabel(raw);
  if (isDrillType(normalized)) return normalized;
  const map: Record<string, DrillType> = {
    evacuacion: "evacuacion",
    "evacuación": "evacuacion",
    incendio: "incendio",
    incendios: "incendio",
    derrame: "derrame",
    sismo: "sismo",
    "primeros auxilios": "primeros_auxilios",
    primeros_auxilios: "primeros_auxilios",
    integral: "integral",
    otro: "otro",
  };
  return map[normalized] ?? null;
}

export function parseDrillStatusLabel(raw: string): DrillStatus | null {
  const normalized = normalizeLabel(raw);
  if (isDrillStatus(normalized)) return normalized;
  const map: Record<string, DrillStatus> = {
    programado: "programado",
    programada: "programado",
    realizado: "realizado",
    realizada: "realizado",
    cancelado: "cancelado",
    cancelada: "cancelado",
  };
  return map[normalized] ?? null;
}
