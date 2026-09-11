import {
  computeDaysRemaining,
  computeSemaphore,
} from "@/lib/sg-sst/alerts/engine";
import {
  DEFAULT_ALERT_THRESHOLDS,
  type SstSemaphoreLevel,
  type SstWorkflowStatus,
} from "@/lib/sg-sst/alerts/types";

export const EPP_CATEGORIES = [
  "botas",
  "guantes",
  "gafas",
  "casco",
  "proteccion_auditiva",
  "proteccion_respiratoria",
  "arnes",
  "eslinga",
  "impermeable",
  "vaqueta",
  "otros",
] as const;
export type EppCategory = (typeof EPP_CATEGORIES)[number];

export const EPP_CATEGORY_LABELS: Record<EppCategory, string> = {
  botas: "Botas",
  guantes: "Guantes",
  gafas: "Gafas",
  casco: "Casco",
  proteccion_auditiva: "Protección auditiva",
  proteccion_respiratoria: "Protección respiratoria",
  arnes: "Arnés",
  eslinga: "Eslinga",
  impermeable: "Impermeable",
  vaqueta: "Vaqueta",
  otros: "Otros",
};

export const EPP_REASONS = ["dotacion", "reposicion", "ingreso"] as const;
export type EppReason = (typeof EPP_REASONS)[number];

export const EPP_REASON_LABELS: Record<EppReason, string> = {
  dotacion: "Dotación",
  reposicion: "Reposición",
  ingreso: "Ingreso",
};

export type SstEppCatalogItem = {
  id: string;
  code: string;
  category: EppCategory;
  name: string;
  usefulLifeDays: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SstEppCatalogDraft = {
  id?: string;
  code: string;
  category: EppCategory;
  name: string;
  usefulLifeDays: number;
  active: boolean;
};

export type SstEppDelivery = {
  id: string;
  folio: string;
  workerId: string;
  workerCode: string;
  workerName: string;
  workerDocument: string;
  workerStatus: string;
  catalogItemId: string;
  catalogCode: string;
  catalogName: string;
  catalogCategory: EppCategory;
  quantity: number;
  sizeLabel: string;
  deliveryDate: string;
  usefulLifeDays: number;
  nextReplenishmentDate: string | null;
  reason: EppReason;
  responsibleName: string;
  evidenceUrl: string;
  evidenceName: string;
  observations: string;
  companySnapshot: string;
  jobTitleSnapshot: string;
  farmId: string | null;
  farmName: string | null;
  workCenterSnapshot: string;
  unitCostCop: number;
  complianceRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstEppDeliveryDraft = {
  id?: string;
  workerId: string;
  catalogItemId: string;
  quantity: number;
  sizeLabel: string;
  deliveryDate: string;
  usefulLifeDays: number;
  nextReplenishmentDate?: string | null;
  reason: EppReason;
  responsibleName: string;
  evidenceUrl: string;
  evidenceName: string;
  observations: string;
  unitCostCop?: number;
};

export type SstEppDeliveryView = SstEppDelivery & {
  daysRemaining: number | null;
  semaphore: SstSemaphoreLevel;
  semaphoreLabel: string;
  isOverdue: boolean;
};

export type EppNameCount = {
  name: string;
  category: EppCategory;
  count: number;
};

export type EppConsumptionBucket = {
  label: string;
  quantity: number;
  costCop: number;
};

export type EppStats = {
  deliveriesThisMonth: number;
  pendingReplenishment: number;
  upcomingReplenishment: number;
  topDelivered: EppNameCount[];
  topReplaced: EppNameCount[];
  byCompany: EppConsumptionBucket[];
  byWorkCenter: EppConsumptionBucket[];
  bySemaphore: Record<SstSemaphoreLevel, number>;
  total: number;
};

export function isEppCategory(value: string): value is EppCategory {
  return (EPP_CATEGORIES as readonly string[]).includes(value);
}

export function isEppReason(value: string): value is EppReason {
  return (EPP_REASONS as readonly string[]).includes(value);
}

export function emptyCatalogDraft(): SstEppCatalogDraft {
  return {
    code: "",
    category: "botas",
    name: "",
    usefulLifeDays: 180,
    active: true,
  };
}

export function emptyDeliveryDraft(workerId = ""): SstEppDeliveryDraft {
  return {
    workerId,
    catalogItemId: "",
    quantity: 1,
    sizeLabel: "",
    deliveryDate: new Date().toISOString().slice(0, 10),
    usefulLifeDays: 180,
    nextReplenishmentDate: "",
    reason: "dotacion",
    responsibleName: "",
    evidenceUrl: "",
    evidenceName: "",
    observations: "",
    unitCostCop: 0,
  };
}

export function draftFromCatalog(item: SstEppCatalogItem): SstEppCatalogDraft {
  return {
    id: item.id,
    code: item.code,
    category: item.category,
    name: item.name,
    usefulLifeDays: item.usefulLifeDays,
    active: item.active,
  };
}

export function draftFromDelivery(item: SstEppDelivery): SstEppDeliveryDraft {
  return {
    id: item.id,
    workerId: item.workerId,
    catalogItemId: item.catalogItemId,
    quantity: item.quantity,
    sizeLabel: item.sizeLabel,
    deliveryDate: item.deliveryDate,
    usefulLifeDays: item.usefulLifeDays,
    nextReplenishmentDate: item.nextReplenishmentDate ?? "",
    reason: item.reason,
    responsibleName: item.responsibleName,
    evidenceUrl: item.evidenceUrl,
    evidenceName: item.evidenceName,
    observations: item.observations,
    unitCostCop: item.unitCostCop,
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

export function resolveNextReplenishmentDate(
  draft: Pick<SstEppDeliveryDraft, "deliveryDate" | "usefulLifeDays" | "nextReplenishmentDate">,
): string | null {
  if (draft.nextReplenishmentDate?.trim()) {
    return draft.nextReplenishmentDate.trim();
  }
  if (!draft.deliveryDate.trim() || !Number.isFinite(draft.usefulLifeDays)) {
    return null;
  }
  return addDaysIso(draft.deliveryDate, Math.max(1, Math.trunc(draft.usefulLifeDays)));
}

export function validateCatalogDraft(input: SstEppCatalogDraft): string | null {
  if (!input.code.trim()) {
    return "El código del EPP es obligatorio.";
  }
  if (!isEppCategory(input.category)) {
    return "Categoría de EPP inválida.";
  }
  if (!input.name.trim()) {
    return "El nombre del EPP es obligatorio.";
  }
  if (!Number.isFinite(input.usefulLifeDays) || input.usefulLifeDays <= 0) {
    return "La vida útil debe ser un número de días mayor a cero.";
  }
  return null;
}

export function validateDeliveryDraft(input: SstEppDeliveryDraft): string | null {
  if (!input.workerId.trim()) {
    return "Selecciona un trabajador de la base maestra.";
  }
  if (!input.catalogItemId.trim()) {
    return "Selecciona un EPP del catálogo.";
  }
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    return "La cantidad debe ser mayor a cero.";
  }
  if (!input.deliveryDate.trim()) {
    return "La fecha de entrega es obligatoria.";
  }
  if (!Number.isFinite(input.usefulLifeDays) || input.usefulLifeDays <= 0) {
    return "La vida útil debe ser un número de días mayor a cero.";
  }
  if (!isEppReason(input.reason)) {
    return "Motivo de entrega inválido.";
  }
  if (!input.responsibleName.trim()) {
    return "El responsable de la entrega es obligatorio.";
  }
  return null;
}

const SEMAPHORE_LABELS: Record<SstSemaphoreLevel, string> = {
  critico: "Vencido",
  proximo: "1–30 días",
  seguimiento: "31–60 días",
  vigente: ">60 días",
};

export function toEppComplianceWorkflow(
  nextReplenishmentDate: string | null,
  today = new Date(),
): SstWorkflowStatus {
  const daysRemaining = computeDaysRemaining(nextReplenishmentDate, today);
  if (daysRemaining !== null && daysRemaining <= 0) {
    return "pending_delivery";
  }
  return "open";
}

export function enrichDeliveryAsView(
  item: SstEppDelivery,
  today = new Date(),
): SstEppDeliveryView {
  const daysRemaining = computeDaysRemaining(item.nextReplenishmentDate, today);
  const workflowStatus = toEppComplianceWorkflow(item.nextReplenishmentDate, today);
  const semaphore = computeSemaphore(
    daysRemaining,
    DEFAULT_ALERT_THRESHOLDS,
    "epp",
    workflowStatus,
  );
  return {
    ...item,
    daysRemaining,
    semaphore,
    semaphoreLabel: SEMAPHORE_LABELS[semaphore],
    isOverdue: daysRemaining !== null && daysRemaining <= 0,
  };
}

export function parseEppCategoryLabel(raw: string): EppCategory | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isEppCategory(normalized)) return normalized;
  const map: Record<string, EppCategory> = {
    botas: "botas",
    "botas de seguridad": "botas",
    calzado: "botas",
    guantes: "guantes",
    "guantes industriales": "guantes",
    gafas: "gafas",
    monogafas: "gafas",
    casco: "casco",
    "casco de seguridad": "casco",
    proteccion_auditiva: "proteccion_auditiva",
    "proteccion auditiva": "proteccion_auditiva",
    auditiva: "proteccion_auditiva",
    proteccion_respiratoria: "proteccion_respiratoria",
    "proteccion respiratoria": "proteccion_respiratoria",
    respiratoria: "proteccion_respiratoria",
    arnes: "arnes",
    "arnes multiproposito": "arnes",
    eslinga: "eslinga",
    eslingas: "eslinga",
    impermeable: "impermeable",
    vaqueta: "vaqueta",
    polainas: "vaqueta",
    otros: "otros",
    otro: "otros",
  };
  return map[normalized] ?? null;
}

export function parseEppReasonLabel(raw: string): EppReason | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (isEppReason(normalized)) return normalized;
  const map: Record<string, EppReason> = {
    dotacion: "dotacion",
    reposicion: "reposicion",
    ingreso: "ingreso",
    entrega: "dotacion",
    renovacion: "reposicion",
  };
  return map[normalized] ?? null;
}

/** Defaults usados cuando el catálogo está vacío. */
export const EPP_CATALOG_DEFAULTS: ReadonlyArray<{
  code: string;
  category: EppCategory;
  name: string;
  usefulLifeDays: number;
}> = [
  {
    code: "EPP-BOT-001",
    category: "botas",
    name: "Botas de seguridad dieléctricas",
    usefulLifeDays: 180,
  },
  {
    code: "EPP-GUA-001",
    category: "guantes",
    name: "Guantes de nitrilo / vaqueta",
    usefulLifeDays: 60,
  },
  {
    code: "EPP-GAF-001",
    category: "gafas",
    name: "Gafas de policarbonato UV400",
    usefulLifeDays: 120,
  },
  {
    code: "EPP-CAS-001",
    category: "casco",
    name: "Casco dieléctrico Clase E Tipo II",
    usefulLifeDays: 730,
  },
  {
    code: "EPP-AUD-001",
    category: "proteccion_auditiva",
    name: "Copas / tapones auditivos NRR 27",
    usefulLifeDays: 180,
  },
  {
    code: "EPP-RES-001",
    category: "proteccion_respiratoria",
    name: "Media cara con cartuchos químicos",
    usefulLifeDays: 30,
  },
  {
    code: "EPP-ARN-001",
    category: "arnes",
    name: "Arnés de cuerpo entero 4 argollas",
    usefulLifeDays: 1095,
  },
  {
    code: "EPP-ESL-001",
    category: "eslinga",
    name: "Eslinga doble en Y con absorbedor",
    usefulLifeDays: 1095,
  },
  {
    code: "EPP-IMP-001",
    category: "impermeable",
    name: "Impermeable dos piezas alta visibilidad",
    usefulLifeDays: 365,
  },
  {
    code: "EPP-VAQ-001",
    category: "vaqueta",
    name: "Polainas / vaqueta agroprotección",
    usefulLifeDays: 240,
  },
  {
    code: "EPP-OTR-001",
    category: "otros",
    name: "Otros EPP de finca",
    usefulLifeDays: 180,
  },
];
