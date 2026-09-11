import { computeDaysRemaining } from "@/lib/sg-sst/alerts/engine";
import type { SstWorkflowStatus } from "@/lib/sg-sst/alerts/types";

export const INSPECTION_TYPES = [
  "locativas",
  "epp",
  "botiquines",
  "extintores",
  "equipos",
  "herramientas",
  "vehiculos",
  "tractor",
  "trabajo_alturas",
  "emergencias",
  "orden_aseo",
  "quimicos",
  "puestos_trabajo",
] as const;
export type InspectionType = (typeof INSPECTION_TYPES)[number];

export const INSPECTION_STATUSES = [
  "programada",
  "en_proceso",
  "realizada",
  "pendiente",
  "vencida",
] as const;
export type InspectionStatus = (typeof INSPECTION_STATUSES)[number];

/** Estados seleccionables en el formulario (vencida también puede derivarse). */
export const INSPECTION_MANUAL_STATUSES = INSPECTION_STATUSES;
export type InspectionManualStatus = InspectionStatus;

export const FINDING_SEVERITIES = ["baja", "media", "alta", "critica"] as const;
export type FindingSeverity = (typeof FINDING_SEVERITIES)[number];

export const FINDING_STATUSES = ["abierto", "en_proceso", "cerrado"] as const;
export type FindingStatus = (typeof FINDING_STATUSES)[number];

export const INSPECTION_TYPE_LABELS: Record<InspectionType, string> = {
  locativas: "Locativas",
  epp: "EPP",
  botiquines: "Botiquines",
  extintores: "Extintores",
  equipos: "Equipos",
  herramientas: "Herramientas",
  vehiculos: "Vehículos",
  tractor: "Tractor",
  trabajo_alturas: "Trabajo en alturas",
  emergencias: "Emergencias",
  orden_aseo: "Orden y aseo",
  quimicos: "Químicos",
  puestos_trabajo: "Puestos de trabajo",
};

export const INSPECTION_TYPE_ICONS: Record<InspectionType, string> = {
  locativas: "home_work",
  epp: "security",
  botiquines: "medical_services",
  extintores: "fire_extinguisher",
  equipos: "precision_manufacturing",
  herramientas: "construction",
  vehiculos: "directions_car",
  tractor: "agriculture",
  trabajo_alturas: "height",
  emergencias: "emergency",
  orden_aseo: "cleaning_services",
  quimicos: "science",
  puestos_trabajo: "desk",
};

export const INSPECTION_STATUS_LABELS: Record<InspectionStatus, string> = {
  programada: "Programada",
  en_proceso: "En proceso",
  realizada: "Realizada",
  pendiente: "Pendiente",
  vencida: "Vencida",
};

export const FINDING_SEVERITY_LABELS: Record<FindingSeverity, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  critica: "Crítica",
};

export const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  abierto: "Abierto",
  en_proceso: "En proceso",
  cerrado: "Cerrado",
};

export type SstInspectionFinding = {
  id: string;
  inspectionId: string;
  severity: FindingSeverity;
  title: string;
  description: string;
  actionPlan: string;
  assigneeName: string;
  dueDate: string | null;
  status: FindingStatus;
  evidenceUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type SstInspectionFindingDraft = {
  id?: string;
  severity: FindingSeverity;
  title: string;
  description: string;
  actionPlan: string;
  assigneeName: string;
  dueDate?: string | null;
  status: FindingStatus;
  evidenceUrl: string;
};

export type SstInspection = {
  id: string;
  folio: string;
  inspectionType: InspectionType;
  responsibleName: string;
  farmId: string | null;
  farmName: string | null;
  workCenter: string;
  scheduledDate: string;
  performedDate: string | null;
  status: InspectionStatus;
  findingsSummary: string;
  findingsCount: number;
  evidenceUrl: string;
  evidenceName: string;
  generatedAction: string;
  nextInspectionDate: string | null;
  observations: string;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
  findings: SstInspectionFinding[];
};

export type SstInspectionDraft = {
  id?: string;
  inspectionType: InspectionType;
  responsibleName: string;
  farmId?: string | null;
  workCenter: string;
  scheduledDate: string;
  performedDate?: string | null;
  status: InspectionManualStatus;
  findingsSummary: string;
  evidenceUrl: string;
  evidenceName: string;
  generatedAction: string;
  nextInspectionDate?: string | null;
  observations: string;
  findings?: SstInspectionFindingDraft[];
};

export type SstInspectionView = SstInspection & {
  daysRemaining: number | null;
  effectiveStatus: InspectionStatus;
  isThisWeek: boolean;
};

export type InspectionStats = {
  total: number;
  scheduledThisMonth: number;
  performed: number;
  pending: number;
  overdue: number;
  openFindings: number;
  byStatus: Record<InspectionStatus, number>;
  byType: Record<InspectionType, number>;
};

export type WeekRange = {
  start: string;
  end: string;
  label: string;
};

export function isInspectionType(value: string): value is InspectionType {
  return (INSPECTION_TYPES as readonly string[]).includes(value);
}

export function isInspectionStatus(value: string): value is InspectionStatus {
  return (INSPECTION_STATUSES as readonly string[]).includes(value);
}

export function isFindingSeverity(value: string): value is FindingSeverity {
  return (FINDING_SEVERITIES as readonly string[]).includes(value);
}

export function isFindingStatus(value: string): value is FindingStatus {
  return (FINDING_STATUSES as readonly string[]).includes(value);
}

function toDateOnlyIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Semana laboral lun–dom (ISO week start Monday). */
export function getCurrentWeekRange(today = new Date()): WeekRange {
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  const fmt = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
  return {
    start: toDateOnlyIso(start),
    end: toDateOnlyIso(end),
    label: `${fmt.format(start)} – ${fmt.format(end)}`,
  };
}

export function isDateInRange(
  iso: string | null | undefined,
  start: string,
  end: string,
): boolean {
  if (!iso?.trim()) return false;
  return iso >= start && iso <= end;
}

export function emptyFindingDraft(): SstInspectionFindingDraft {
  return {
    severity: "media",
    title: "",
    description: "",
    actionPlan: "",
    assigneeName: "",
    dueDate: "",
    status: "abierto",
    evidenceUrl: "",
  };
}

export function emptyInspectionDraft(): SstInspectionDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    inspectionType: "locativas",
    responsibleName: "",
    farmId: null,
    workCenter: "",
    scheduledDate: today,
    performedDate: "",
    status: "programada",
    findingsSummary: "",
    evidenceUrl: "",
    evidenceName: "",
    generatedAction: "",
    nextInspectionDate: "",
    observations: "",
    findings: [],
  };
}

export function draftFromInspection(item: SstInspection): SstInspectionDraft {
  return {
    id: item.id,
    inspectionType: item.inspectionType,
    responsibleName: item.responsibleName,
    farmId: item.farmId,
    workCenter: item.workCenter,
    scheduledDate: item.scheduledDate,
    performedDate: item.performedDate ?? "",
    status: item.status,
    findingsSummary: item.findingsSummary,
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
    generatedAction: item.generatedAction,
    nextInspectionDate: item.nextInspectionDate ?? "",
    observations: item.observations,
    findings: item.findings.map((finding) => ({
      id: finding.id,
      severity: finding.severity,
      title: finding.title,
      description: finding.description,
      actionPlan: finding.actionPlan,
      assigneeName: finding.assigneeName,
      dueDate: finding.dueDate ?? "",
      status: finding.status,
      evidenceUrl: finding.evidenceUrl,
    })),
  };
}

export function validateFindingDraft(
  input: SstInspectionFindingDraft,
  index?: number,
): string | null {
  const prefix = index != null ? `Hallazgo ${index + 1}: ` : "";
  if (!input.title.trim()) {
    return `${prefix}El título del hallazgo es obligatorio.`;
  }
  if (!isFindingSeverity(input.severity)) {
    return `${prefix}Severidad inválida.`;
  }
  if (!isFindingStatus(input.status)) {
    return `${prefix}Estado de hallazgo inválido.`;
  }
  return null;
}

export function validateInspectionDraft(input: SstInspectionDraft): string | null {
  if (!isInspectionType(input.inspectionType)) {
    return "Tipo de inspección inválido.";
  }
  if (!input.responsibleName.trim()) {
    return "El responsable técnico es obligatorio.";
  }
  if (!input.scheduledDate.trim()) {
    return "La fecha programada es obligatoria.";
  }
  if (!isInspectionStatus(input.status)) {
    return "Estado inválido.";
  }
  if (input.findings) {
    for (let i = 0; i < input.findings.length; i += 1) {
      const error = validateFindingDraft(input.findings[i], i);
      if (error) return error;
    }
  }
  return null;
}

/**
 * Si la fecha programada ya pasó y el estado es programada/pendiente → vencida.
 */
export function deriveEffectiveStatus(
  stored: InspectionStatus,
  scheduledDate: string,
  today = new Date(),
): InspectionStatus {
  if (stored === "realizada" || stored === "en_proceso" || stored === "vencida") {
    return stored;
  }
  if (stored === "programada" || stored === "pendiente") {
    const days = computeDaysRemaining(scheduledDate, today);
    if (days !== null && days < 0) {
      return "vencida";
    }
  }
  return stored;
}

export function resolveComplianceDueDate(
  item: Pick<SstInspection, "status" | "scheduledDate" | "nextInspectionDate">,
  effectiveStatus?: InspectionStatus,
): string | null {
  const status = effectiveStatus ?? item.status;
  if (status === "realizada") {
    return item.nextInspectionDate?.trim() || item.scheduledDate;
  }
  return item.scheduledDate;
}

export function toComplianceWorkflowStatus(
  effectiveStatus: InspectionStatus,
): SstWorkflowStatus {
  if (effectiveStatus === "vencida") return "pending_closure";
  if (effectiveStatus === "realizada") return "closed";
  if (effectiveStatus === "en_proceso") return "in_progress";
  return "open";
}

export function enrichInspectionAsView(
  item: SstInspection,
  today = new Date(),
  week = getCurrentWeekRange(today),
): SstInspectionView {
  const effectiveStatus = deriveEffectiveStatus(item.status, item.scheduledDate, today);
  const due = resolveComplianceDueDate(item, effectiveStatus);
  return {
    ...item,
    daysRemaining: computeDaysRemaining(due, today),
    effectiveStatus,
    isThisWeek: isDateInRange(item.scheduledDate, week.start, week.end),
  };
}

export function parseInspectionTypeLabel(raw: string): InspectionType | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isInspectionType(normalized)) return normalized;
  const map: Record<string, InspectionType> = {
    locativa: "locativas",
    locativas: "locativas",
    epp: "epp",
    botiquin: "botiquines",
    botiquines: "botiquines",
    extintor: "extintores",
    extintores: "extintores",
    equipo: "equipos",
    equipos: "equipos",
    herramienta: "herramientas",
    herramientas: "herramientas",
    vehiculo: "vehiculos",
    vehiculos: "vehiculos",
    tractor: "tractor",
    "trabajo en alturas": "trabajo_alturas",
    trabajo_alturas: "trabajo_alturas",
    alturas: "trabajo_alturas",
    emergencia: "emergencias",
    emergencias: "emergencias",
    "orden y aseo": "orden_aseo",
    orden_aseo: "orden_aseo",
    aseo: "orden_aseo",
    quimico: "quimicos",
    quimicos: "quimicos",
    "puestos de trabajo": "puestos_trabajo",
    puestos_trabajo: "puestos_trabajo",
  };
  return map[normalized] ?? null;
}

export function parseInspectionStatusLabel(raw: string): InspectionStatus | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isInspectionStatus(normalized)) return normalized;
  const map: Record<string, InspectionStatus> = {
    programada: "programada",
    programado: "programada",
    "en proceso": "en_proceso",
    en_proceso: "en_proceso",
    realizada: "realizada",
    realizado: "realizada",
    pendiente: "pendiente",
    vencida: "vencida",
    vencido: "vencida",
  };
  return map[normalized] ?? null;
}

export function parseFindingSeverityLabel(raw: string): FindingSeverity | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isFindingSeverity(normalized)) return normalized;
  const map: Record<string, FindingSeverity> = {
    baja: "baja",
    media: "media",
    alta: "alta",
    critica: "critica",
    critico: "critica",
  };
  return map[normalized] ?? null;
}

export function parseFindingStatusLabel(raw: string): FindingStatus | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isFindingStatus(normalized)) return normalized;
  const map: Record<string, FindingStatus> = {
    abierto: "abierto",
    "en proceso": "en_proceso",
    en_proceso: "en_proceso",
    cerrado: "cerrado",
  };
  return map[normalized] ?? null;
}

export function formatWeekBannerTitle(week: WeekRange): string {
  return `Esta semana deben realizarse (${week.label})`;
}
