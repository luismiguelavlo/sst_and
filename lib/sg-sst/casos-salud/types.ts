import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";

export const HEALTH_CASE_TYPES = [
  "accidente_laboral",
  "enfermedad_laboral",
  "enfermedad_comun",
  "restriccion",
  "recomendacion_medica",
  "reintegro",
  "reubicacion",
  "seguimiento_eps",
  "seguimiento_arl",
] as const;
export type HealthCaseType = (typeof HEALTH_CASE_TYPES)[number];

export const HEALTH_CASE_STATUSES = [
  "abierto",
  "en_seguimiento",
  "pendiente",
  "cerrado",
] as const;
export type HealthCaseStatus = (typeof HEALTH_CASE_STATUSES)[number];

export const HEALTH_CASE_TYPE_LABELS: Record<HealthCaseType, string> = {
  accidente_laboral: "Accidente laboral",
  enfermedad_laboral: "Enfermedad laboral",
  enfermedad_comun: "Enfermedad común",
  restriccion: "Restricción",
  recomendacion_medica: "Recomendación médica",
  reintegro: "Reintegro",
  reubicacion: "Reubicación",
  seguimiento_eps: "Seguimiento EPS",
  seguimiento_arl: "Seguimiento ARL",
};

export const HEALTH_CASE_STATUS_LABELS: Record<HealthCaseStatus, string> = {
  abierto: "Abierto",
  en_seguimiento: "En seguimiento",
  pendiente: "Pendiente",
  cerrado: "Cerrado",
};

export type SstHealthCase = {
  id: string;
  folio: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  workerStatus: string;
  caseType: HealthCaseType;
  openedAt: string;
  status: HealthCaseStatus;
  responsibleName: string;
  issuer: string;
  nextFollowUp: string | null;
  closedAt: string | null;
  adminObservations: string;
  evidenceUrl: string;
  evidenceName: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  farmId: string | null;
  farmName: string | null;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstHealthCaseDraft = {
  id?: string;
  workerId: string;
  caseType: HealthCaseType;
  openedAt: string;
  status: HealthCaseStatus;
  responsibleName: string;
  issuer: string;
  nextFollowUp?: string | null;
  closedAt?: string | null;
  adminObservations: string;
  evidenceUrl: string;
  evidenceName: string;
};

export type HealthCaseStats = {
  total: number;
  abiertos: number;
  enSeguimiento: number;
  pendientes: number;
  cerrados: number;
  proximosSeguimientos: number;
  byType: Record<HealthCaseType, number>;
};

export function isHealthCaseType(value: string): value is HealthCaseType {
  return (HEALTH_CASE_TYPES as readonly string[]).includes(value);
}

export function isHealthCaseStatus(value: string): value is HealthCaseStatus {
  return (HEALTH_CASE_STATUSES as readonly string[]).includes(value);
}

export function emptyHealthCaseDraft(workerId = ""): SstHealthCaseDraft {
  return {
    workerId,
    caseType: "restriccion",
    openedAt: new Date().toISOString().slice(0, 10),
    status: "abierto",
    responsibleName: "",
    issuer: "",
    nextFollowUp: "",
    closedAt: "",
    adminObservations: "",
    evidenceUrl: "",
    evidenceName: "",
  };
}

export function validateHealthCaseDraft(
  input: SstHealthCaseDraft,
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
  if (!isHealthCaseType(input.caseType)) {
    return "Tipo de caso inválido.";
  }
  if (!input.openedAt.trim()) {
    return "La fecha de apertura es obligatoria.";
  }
  if (!isHealthCaseStatus(input.status)) {
    return "Estado inválido.";
  }
  if (input.status === "cerrado" && !input.closedAt?.trim()) {
    return "La fecha de cierre es obligatoria cuando el caso está cerrado.";
  }
  return null;
}

export function parseHealthCaseTypeLabel(raw: string): HealthCaseType | null {
  const normalized = raw.trim().toLowerCase();
  if (isHealthCaseType(normalized)) return normalized;
  const map: Record<string, HealthCaseType> = {
    "accidente laboral": "accidente_laboral",
    accidente: "accidente_laboral",
    "enfermedad laboral": "enfermedad_laboral",
    "enfermedad comun": "enfermedad_comun",
    "enfermedad común": "enfermedad_comun",
    restriccion: "restriccion",
    "restricción": "restriccion",
    "restriccion medica": "restriccion",
    "recomendacion medica": "recomendacion_medica",
    "recomendación médica": "recomendacion_medica",
    recomendacion: "recomendacion_medica",
    reintegro: "reintegro",
    "reintegro laboral": "reintegro",
    reubicacion: "reubicacion",
    "reubicación": "reubicacion",
    "reubicacion puesto": "reubicacion",
    "seguimiento eps": "seguimiento_eps",
    eps: "seguimiento_eps",
    "seguimiento arl": "seguimiento_arl",
    arl: "seguimiento_arl",
  };
  return map[normalized] ?? null;
}

export function parseHealthCaseStatusLabel(raw: string): HealthCaseStatus | null {
  const normalized = raw.trim().toLowerCase();
  if (isHealthCaseStatus(normalized)) return normalized;
  const map: Record<string, HealthCaseStatus> = {
    abierto: "abierto",
    "en seguimiento": "en_seguimiento",
    en_seguimiento: "en_seguimiento",
    pendiente: "pendiente",
    "pendiente dictamen": "pendiente",
    cerrado: "cerrado",
  };
  return map[normalized] ?? null;
}

export function isUpcomingFollowUp(
  nextFollowUp: string | null,
  status: HealthCaseStatus,
  today = new Date(),
  withinDays = 7,
): boolean {
  if (status === "cerrado" || !nextFollowUp) return false;
  const [y, m, d] = nextFollowUp.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.round((due.getTime() - start.getTime()) / 86_400_000);
  return diff >= 0 && diff <= withinDays;
}

export function computeHealthCaseStats(
  cases: readonly SstHealthCase[],
  today = new Date(),
): HealthCaseStats {
  const byType = Object.fromEntries(
    HEALTH_CASE_TYPES.map((type) => [type, 0]),
  ) as Record<HealthCaseType, number>;
  let abiertos = 0;
  let enSeguimiento = 0;
  let pendientes = 0;
  let cerrados = 0;
  let proximosSeguimientos = 0;

  for (const item of cases) {
    byType[item.caseType] += 1;
    if (item.status === "abierto") abiertos += 1;
    if (item.status === "en_seguimiento") enSeguimiento += 1;
    if (item.status === "pendiente") pendientes += 1;
    if (item.status === "cerrado") cerrados += 1;
    if (isUpcomingFollowUp(item.nextFollowUp, item.status, today)) {
      proximosSeguimientos += 1;
    }
  }

  return {
    total: cases.length,
    abiertos,
    enSeguimiento,
    pendientes,
    cerrados,
    proximosSeguimientos,
    byType,
  };
}
