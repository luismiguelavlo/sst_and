import { computeDaysRemaining } from "@/lib/sg-sst/alerts/engine";
import type { SstWorkflowStatus } from "@/lib/sg-sst/alerts/types";

export const ACCIDENT_EVENT_TYPES = [
  "accidente_trabajo",
  "incidente",
  "accidente_vial",
  "evento_peligroso",
  "otros",
] as const;
export type AccidentEventType = (typeof ACCIDENT_EVENT_TYPES)[number];

export const ACCIDENT_STATUSES = [
  "en_investigacion",
  "en_seguimiento",
  "cerrado",
] as const;
export type AccidentStatus = (typeof ACCIDENT_STATUSES)[number];

export const ACCIDENT_EVENT_TYPE_LABELS: Record<AccidentEventType, string> = {
  accidente_trabajo: "Accidente de trabajo",
  incidente: "Incidente",
  accidente_vial: "Accidente vial",
  evento_peligroso: "Evento peligroso",
  otros: "Otros",
};

export const ACCIDENT_STATUS_LABELS: Record<AccidentStatus, string> = {
  en_investigacion: "En investigación",
  en_seguimiento: "En seguimiento",
  cerrado: "Cerrado",
};

export type SstAccidentCauses = {
  id: string;
  accidentId: string;
  immediateAct: string;
  immediateCondition: string;
  basicPersonal: string;
  basicWork: string;
  rootCause: string;
  agent: string;
  mechanism: string;
  correctiveAction: string;
  preventiveAction: string;
  createdAt: string;
  updatedAt: string;
};

export type SstAccidentCausesDraft = {
  immediateAct: string;
  immediateCondition: string;
  basicPersonal: string;
  basicWork: string;
  rootCause: string;
  agent: string;
  mechanism: string;
  correctiveAction: string;
  preventiveAction: string;
};

export type SstAccidentEvent = {
  id: string;
  eventNumber: string;
  eventDate: string;
  eventTime: string | null;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  areaSnapshot: string;
  workCenterSnapshot: string;
  farmId: string | null;
  farmName: string | null;
  eventType: AccidentEventType;
  description: string;
  accidentKind: string;
  mechanism: string;
  agent: string;
  bodyPart: string;
  injuryType: string;
  lostDays: number;
  origin: string;
  status: AccidentStatus;
  investigationNotes: string;
  correctiveActionNotes: string;
  evidenceUrl: string;
  evidenceName: string;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
  causes: SstAccidentCauses | null;
};

export type SstAccidentEventDraft = {
  id?: string;
  workerId: string;
  eventDate: string;
  eventTime?: string | null;
  companySnapshot?: string;
  jobTitleSnapshot?: string;
  areaSnapshot?: string;
  workCenterSnapshot?: string;
  farmId?: string | null;
  eventType: AccidentEventType;
  description: string;
  accidentKind: string;
  mechanism: string;
  agent: string;
  bodyPart: string;
  injuryType: string;
  lostDays: number;
  origin: string;
  status: AccidentStatus;
  investigationNotes: string;
  correctiveActionNotes: string;
  evidenceUrl: string;
  evidenceName: string;
  causes?: SstAccidentCausesDraft;
};

export type CountBucket = {
  key: string;
  label: string;
  count: number;
};

export type AccidentStats = {
  total: number;
  accidentesTrabajo: number;
  incidentes: number;
  enInvestigacion: number;
  enSeguimiento: number;
  cerrados: number;
  lostDaysSum: number;
  byStatus: Record<AccidentStatus, number>;
  byType: Record<AccidentEventType, number>;
  byMonth: CountBucket[];
  byCompany: CountBucket[];
  byFarm: CountBucket[];
  byArea: CountBucket[];
  byJob: CountBucket[];
  byMechanism: CountBucket[];
  byBodyPart: CountBucket[];
  monthlyTrend: CountBucket[];
};

export type CauseRankingItem = {
  category: string;
  label: string;
  count: number;
  percent: number;
};

export type CausesRanking = {
  totalWithCauses: number;
  items: CauseRankingItem[];
};

export function isAccidentEventType(value: string): value is AccidentEventType {
  return (ACCIDENT_EVENT_TYPES as readonly string[]).includes(value);
}

export function isAccidentStatus(value: string): value is AccidentStatus {
  return (ACCIDENT_STATUSES as readonly string[]).includes(value);
}

export function emptyCausesDraft(): SstAccidentCausesDraft {
  return {
    immediateAct: "",
    immediateCondition: "",
    basicPersonal: "",
    basicWork: "",
    rootCause: "",
    agent: "",
    mechanism: "",
    correctiveAction: "",
    preventiveAction: "",
  };
}

export function emptyAccidentDraft(workerId = ""): SstAccidentEventDraft {
  return {
    workerId,
    eventDate: new Date().toISOString().slice(0, 10),
    eventTime: "",
    companySnapshot: "",
    jobTitleSnapshot: "",
    areaSnapshot: "",
    workCenterSnapshot: "",
    farmId: null,
    eventType: "accidente_trabajo",
    description: "",
    accidentKind: "",
    mechanism: "",
    agent: "",
    bodyPart: "",
    injuryType: "",
    lostDays: 0,
    origin: "",
    status: "en_investigacion",
    investigationNotes: "",
    correctiveActionNotes: "",
    evidenceUrl: "",
    evidenceName: "",
    causes: emptyCausesDraft(),
  };
}

export function draftFromAccident(item: SstAccidentEvent): SstAccidentEventDraft {
  return {
    id: item.id,
    workerId: item.workerId,
    eventDate: item.eventDate,
    eventTime: item.eventTime ?? "",
    companySnapshot: item.companySnapshot,
    jobTitleSnapshot: item.jobTitleSnapshot,
    areaSnapshot: item.areaSnapshot,
    workCenterSnapshot: item.workCenterSnapshot,
    farmId: item.farmId,
    eventType: item.eventType,
    description: item.description,
    accidentKind: item.accidentKind,
    mechanism: item.mechanism,
    agent: item.agent,
    bodyPart: item.bodyPart,
    injuryType: item.injuryType,
    lostDays: item.lostDays,
    origin: item.origin,
    status: item.status,
    investigationNotes: item.investigationNotes,
    correctiveActionNotes: item.correctiveActionNotes,
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
    causes: item.causes
      ? {
          immediateAct: item.causes.immediateAct,
          immediateCondition: item.causes.immediateCondition,
          basicPersonal: item.causes.basicPersonal,
          basicWork: item.causes.basicWork,
          rootCause: item.causes.rootCause,
          agent: item.causes.agent,
          mechanism: item.causes.mechanism,
          correctiveAction: item.causes.correctiveAction,
          preventiveAction: item.causes.preventiveAction,
        }
      : emptyCausesDraft(),
  };
}

export function validateAccidentDraft(input: SstAccidentEventDraft): string | null {
  if (!input.workerId.trim()) {
    return "Selecciona un trabajador de la base maestra.";
  }
  if (!input.eventDate.trim()) {
    return "La fecha del evento es obligatoria.";
  }
  if (!isAccidentEventType(input.eventType)) {
    return "Tipo de evento inválido.";
  }
  if (!isAccidentStatus(input.status)) {
    return "Estado inválido.";
  }
  if (!Number.isFinite(input.lostDays) || input.lostDays < 0) {
    return "Los días perdidos deben ser un número mayor o igual a 0.";
  }
  return null;
}

export function parseAccidentEventTypeLabel(raw: string): AccidentEventType | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isAccidentEventType(normalized)) return normalized;
  const map: Record<string, AccidentEventType> = {
    "accidente de trabajo": "accidente_trabajo",
    accidente: "accidente_trabajo",
    at: "accidente_trabajo",
    incidente: "incidente",
    "accidente vial": "accidente_vial",
    vial: "accidente_vial",
    "evento peligroso": "evento_peligroso",
    peligroso: "evento_peligroso",
    otros: "otros",
    otro: "otros",
  };
  return map[normalized] ?? null;
}

export function parseAccidentStatusLabel(raw: string): AccidentStatus | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isAccidentStatus(normalized)) return normalized;
  const map: Record<string, AccidentStatus> = {
    "en investigacion": "en_investigacion",
    investigacion: "en_investigacion",
    "en seguimiento": "en_seguimiento",
    seguimiento: "en_seguimiento",
    cerrado: "cerrado",
    cerrada: "cerrado",
  };
  return map[normalized] ?? null;
}

export function addDaysIso(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toInvestigationWorkflowStatus(
  legalDueDate: string,
  status: string,
  today = new Date(),
): SstWorkflowStatus {
  if (status === "cerrada" || status === "radicada_arl") return "closed";
  const days = computeDaysRemaining(legalDueDate, today);
  if (days !== null && days < 0) return "pending_closure";
  if (status === "en_campo" || status === "revision_copasst") return "in_progress";
  return "open";
}

function countByLabel(
  items: readonly string[],
  emptyLabel = "Sin dato",
): CountBucket[] {
  const map = new Map<string, number>();
  for (const raw of items) {
    const label = raw.trim() || emptyLabel;
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ key: label, label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "es"));
}

function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  const date = new Date(y, m - 1, 1);
  return new Intl.DateTimeFormat("es-CO", { month: "short", year: "numeric" }).format(
    date,
  );
}

export function computeAccidentStats(
  events: readonly SstAccidentEvent[],
): AccidentStats {
  const byStatus: Record<AccidentStatus, number> = {
    en_investigacion: 0,
    en_seguimiento: 0,
    cerrado: 0,
  };
  const byType = Object.fromEntries(
    ACCIDENT_EVENT_TYPES.map((type) => [type, 0]),
  ) as Record<AccidentEventType, number>;

  let lostDaysSum = 0;
  const monthMap = new Map<string, number>();

  for (const event of events) {
    byStatus[event.status] += 1;
    byType[event.eventType] += 1;
    lostDaysSum += event.lostDays;
    const key = monthKey(event.eventDate);
    monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
  }

  const byMonth = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({ key, label: monthLabel(key), count }));

  return {
    total: events.length,
    accidentesTrabajo: byType.accidente_trabajo,
    incidentes: byType.incidente,
    enInvestigacion: byStatus.en_investigacion,
    enSeguimiento: byStatus.en_seguimiento,
    cerrados: byStatus.cerrado,
    lostDaysSum,
    byStatus,
    byType,
    byMonth,
    byCompany: countByLabel(events.map((e) => e.companySnapshot)),
    byFarm: countByLabel(events.map((e) => e.farmName ?? "")),
    byArea: countByLabel(events.map((e) => e.areaSnapshot)),
    byJob: countByLabel(events.map((e) => e.jobTitleSnapshot)),
    byMechanism: countByLabel(events.map((e) => e.mechanism)),
    byBodyPart: countByLabel(events.map((e) => e.bodyPart)),
    monthlyTrend: byMonth,
  };
}

export function computeCausesRanking(
  events: readonly SstAccidentEvent[],
): CausesRanking {
  const buckets: { category: string; label: string; values: string[] }[] = [
    { category: "root_cause", label: "Causa principal (raíz)", values: [] },
    { category: "immediate_act", label: "Acto subestándar", values: [] },
    { category: "immediate_condition", label: "Condición subestándar", values: [] },
    { category: "basic_personal", label: "Factor personal", values: [] },
    { category: "basic_work", label: "Factor de trabajo", values: [] },
    { category: "agent", label: "Agente", values: [] },
    { category: "mechanism", label: "Mecanismo", values: [] },
  ];

  let totalWithCauses = 0;
  for (const event of events) {
    if (!event.causes) continue;
    totalWithCauses += 1;
    const c = event.causes;
    if (c.rootCause.trim()) buckets[0].values.push(c.rootCause.trim());
    if (c.immediateAct.trim()) buckets[1].values.push(c.immediateAct.trim());
    if (c.immediateCondition.trim()) buckets[2].values.push(c.immediateCondition.trim());
    if (c.basicPersonal.trim()) buckets[3].values.push(c.basicPersonal.trim());
    if (c.basicWork.trim()) buckets[4].values.push(c.basicWork.trim());
    if (c.agent.trim()) buckets[5].values.push(c.agent.trim());
    if (c.mechanism.trim()) buckets[6].values.push(c.mechanism.trim());
  }

  const detailed: CauseRankingItem[] = [];
  for (const bucket of buckets) {
    const counted = countByLabel(bucket.values);
    for (const item of counted) {
      detailed.push({
        category: bucket.category,
        label: `${bucket.label}: ${item.label}`,
        count: item.count,
        percent: 0,
      });
    }
  }

  detailed.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "es"));
  const top = detailed.slice(0, 12);
  const denom = top.reduce((sum, item) => sum + item.count, 0) || 1;
  for (const item of top) {
    item.percent = Math.round((item.count / denom) * 100);
  }

  return { totalWithCauses, items: top };
}
