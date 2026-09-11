import { computeDaysRemaining } from "@/lib/sg-sst/alerts/engine";
import {
  DEFAULT_ALERT_THRESHOLDS,
  type SstSemaphoreLevel,
} from "@/lib/sg-sst/alerts/types";
import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";

export const TRAINING_TOPICS = [
  "induccion",
  "reinduccion",
  "alturas",
  "tractor",
  "pesv",
  "emergencias",
  "primeros_auxilios",
  "epp",
  "quimicos",
  "biomecanico",
  "psicosocial",
  "salud_mental",
  "sst",
  "brigada",
  "copasst",
  "ccl",
] as const;
export type TrainingTopic = (typeof TRAINING_TOPICS)[number];

export const TRAINING_MODALITIES = ["presencial", "virtual", "mixta"] as const;
export type TrainingModality = (typeof TRAINING_MODALITIES)[number];

export const TRAINING_STATUSES = [
  "programada",
  "realizada",
  "proxima",
  "vencida",
  "pendiente",
] as const;
export type TrainingStatus = (typeof TRAINING_STATUSES)[number];

export const TRAINING_TOPIC_LABELS: Record<TrainingTopic, string> = {
  induccion: "Inducción",
  reinduccion: "Reinducción",
  alturas: "Alturas",
  tractor: "Tractor / operadores",
  pesv: "PESV",
  emergencias: "Emergencias",
  primeros_auxilios: "Primeros auxilios",
  epp: "EPP",
  quimicos: "Químicos",
  biomecanico: "Biomecánico",
  psicosocial: "Psicosocial",
  salud_mental: "Salud mental",
  sst: "SST",
  brigada: "Brigada",
  copasst: "COPASST",
  ccl: "CCL",
};

export const TRAINING_MODALITY_LABELS: Record<TrainingModality, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  mixta: "Mixta",
};

export const TRAINING_STATUS_LABELS: Record<TrainingStatus, string> = {
  programada: "Programada",
  realizada: "Realizada",
  proxima: "Próxima",
  vencida: "Vencida",
  pendiente: "Pendiente",
};

export type SstTraining = {
  id: string;
  folio: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  workerStatus: string;
  topic: TrainingTopic;
  trainingDate: string;
  hours: number;
  instructor: string;
  modality: TrainingModality;
  evidenceUrl: string;
  evidenceName: string;
  certificateUrl: string;
  certificateName: string;
  nextTrainingDate: string | null;
  status: TrainingStatus;
  companySnapshot: string;
  jobTitleSnapshot: string;
  farmId: string | null;
  farmName: string | null;
  observations: string;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstTrainingDraft = {
  id?: string;
  workerId: string;
  topic: TrainingTopic;
  trainingDate: string;
  hours: number;
  instructor: string;
  modality: TrainingModality;
  evidenceUrl: string;
  evidenceName: string;
  certificateUrl: string;
  certificateName: string;
  nextTrainingDate?: string | null;
  status?: TrainingStatus | null;
  observations: string;
};

export type SstTrainingView = SstTraining & {
  daysRemaining: number | null;
  semaphore: SstSemaphoreLevel;
  semaphoreLabel: string;
};

export type TrainingStats = {
  total: number;
  realizadas: number;
  pendientes: number;
  proximas: number;
  vencidas: number;
  programadas: number;
  cumplimiento: number;
  hoursTotal: number;
};

export function isTrainingTopic(value: string): value is TrainingTopic {
  return (TRAINING_TOPICS as readonly string[]).includes(value);
}

export function isTrainingModality(value: string): value is TrainingModality {
  return (TRAINING_MODALITIES as readonly string[]).includes(value);
}

export function isTrainingStatus(value: string): value is TrainingStatus {
  return (TRAINING_STATUSES as readonly string[]).includes(value);
}

export function emptyTrainingDraft(workerId = ""): SstTrainingDraft {
  return {
    workerId,
    topic: "induccion",
    trainingDate: new Date().toISOString().slice(0, 10),
    hours: 0,
    instructor: "",
    modality: "presencial",
    evidenceUrl: "",
    evidenceName: "",
    certificateUrl: "",
    certificateName: "",
    nextTrainingDate: "",
    status: null,
    observations: "",
  };
}

export function draftFromTraining(item: SstTraining): SstTrainingDraft {
  return {
    id: item.id,
    workerId: item.workerId,
    topic: item.topic,
    trainingDate: item.trainingDate,
    hours: item.hours,
    instructor: item.instructor,
    modality: item.modality,
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
    certificateUrl: item.certificateUrl,
    certificateName: item.certificateName,
    nextTrainingDate: item.nextTrainingDate ?? "",
    status: item.status,
    observations: item.observations,
  };
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

export function resolveComplianceDueDate(
  nextTrainingDate: string | null | undefined,
  trainingDate: string,
): string {
  const next = nextTrainingDate?.trim() || null;
  if (next) return next;
  return addDaysIso(trainingDate, 365);
}

/**
 * Deriva el estado operativo a partir de la próxima capacitación cuando hay fecha.
 * Sin próxima fecha: programada (fecha futura), pendiente (explícito) o realizada.
 */
export function deriveTrainingStatus(
  input: {
    trainingDate: string;
    nextTrainingDate?: string | null;
    status?: TrainingStatus | null;
  },
  today = new Date(),
): TrainingStatus {
  const next = input.nextTrainingDate?.trim() || null;
  const days = computeDaysRemaining(next, today);

  if (days !== null) {
    if (days <= DEFAULT_ALERT_THRESHOLDS.criticalMaxDays) return "vencida";
    if (days <= DEFAULT_ALERT_THRESHOLDS.orangeMaxDays) return "proxima";
    return "realizada";
  }

  if (input.status === "pendiente") return "pendiente";
  if (input.status === "programada") return "programada";

  const trainingDays = computeDaysRemaining(input.trainingDate.trim() || null, today);
  if (trainingDays !== null && trainingDays > 0) return "programada";
  return "realizada";
}

export function validateTrainingDraft(
  input: SstTrainingDraft,
  mode: DraftValidationMode = "form",
): string | null {
  // Importación Excel: solo workerId; defaults cubren el resto.
  if (mode === "import") {
    if (!input.workerId.trim()) {
      return "Selecciona un trabajador de la base maestra.";
    }
    return null;
  }
  if (!input.workerId.trim()) {
    return "Selecciona un trabajador de la base maestra.";
  }
  if (!isTrainingTopic(input.topic)) {
    return "Tema de capacitación inválido.";
  }
  if (!input.trainingDate.trim()) {
    return "La fecha de capacitación es obligatoria.";
  }
  if (!Number.isFinite(input.hours) || input.hours < 0) {
    return "Las horas deben ser un número mayor o igual a 0.";
  }
  if (!isTrainingModality(input.modality)) {
    return "Modalidad inválida.";
  }
  if (input.status != null && !isTrainingStatus(input.status)) {
    return "Estado inválido.";
  }
  return null;
}

const SEMAPHORE_LABELS: Record<SstSemaphoreLevel, string> = {
  critico: "Vencida",
  proximo: "Próxima (≤30 d)",
  seguimiento: "Programada / pendiente",
  vigente: "Realizada / vigente",
};

function semaphoreFromStatus(status: TrainingStatus): SstSemaphoreLevel {
  switch (status) {
    case "vencida":
      return "critico";
    case "proxima":
      return "proximo";
    case "programada":
    case "pendiente":
      return "seguimiento";
    case "realizada":
    default:
      return "vigente";
  }
}

export function enrichTrainingAsView(
  item: SstTraining,
  today = new Date(),
): SstTrainingView {
  const status = deriveTrainingStatus(item, today);
  const daysRemaining = computeDaysRemaining(item.nextTrainingDate, today);
  const semaphore = semaphoreFromStatus(status);
  return {
    ...item,
    status,
    daysRemaining,
    semaphore,
    semaphoreLabel: SEMAPHORE_LABELS[semaphore],
  };
}

export function parseTopicLabel(raw: string): TrainingTopic | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isTrainingTopic(normalized)) return normalized;
  const map: Record<string, TrainingTopic> = {
    induccion: "induccion",
    reinduccion: "reinduccion",
    alturas: "alturas",
    "trabajo en alturas": "alturas",
    tractor: "tractor",
    tractores: "tractor",
    operadores: "tractor",
    "tractor / operadores": "tractor",
    pesv: "pesv",
    "seguridad vial": "pesv",
    emergencias: "emergencias",
    primeros_auxilios: "primeros_auxilios",
    "primeros auxilios": "primeros_auxilios",
    epp: "epp",
    quimicos: "quimicos",
    quimico: "quimicos",
    biomecanico: "biomecanico",
    ergonomia: "biomecanico",
    psicosocial: "psicosocial",
    salud_mental: "salud_mental",
    "salud mental": "salud_mental",
    sst: "sst",
    "sst general": "sst",
    brigada: "brigada",
    copasst: "copasst",
    ccl: "ccl",
  };
  return map[normalized] ?? null;
}

export function parseModalityLabel(raw: string): TrainingModality | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isTrainingModality(normalized)) return normalized;
  const map: Record<string, TrainingModality> = {
    presencial: "presencial",
    virtual: "virtual",
    "e-learning": "virtual",
    elearning: "virtual",
    mixta: "mixta",
    hibrida: "mixta",
  };
  return map[normalized] ?? null;
}

export function parseStatusLabel(raw: string): TrainingStatus | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isTrainingStatus(normalized)) return normalized;
  const map: Record<string, TrainingStatus> = {
    programada: "programada",
    realizada: "realizada",
    vigente: "realizada",
    proxima: "proxima",
    "proxima a vencer": "proxima",
    "por vencer": "proxima",
    vencida: "vencida",
    pendiente: "pendiente",
  };
  return map[normalized] ?? null;
}
