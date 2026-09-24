import type { SessionUser } from "@/lib/auth/types";

export const SST_AUDIT_ACTIONS = [
  "create",
  "update",
  "delete",
  "import",
  "retire",
  "close",
  "config",
] as const;

export type SstAuditAction = (typeof SST_AUDIT_ACTIONS)[number];

export const SST_AUDIT_MODULES = [
  "trabajadores",
  "alturas",
  "emos",
  "capacitaciones",
  "accidentes",
  "epp",
  "restricciones",
  "incapacidades",
  "acciones",
  "inspecciones",
  "documentos",
  "alertas",
  "cumplimiento",
  "quimicos",
  "fincas",
  "casos_salud",
  "operadores",
  "pesv",
  "copasst",
  "ccl",
  "emergencias",
  "investigaciones",
] as const;

export type SstAuditModule = (typeof SST_AUDIT_MODULES)[number];

export const SST_AUDIT_MODULE_LABELS: Record<SstAuditModule, string> = {
  trabajadores: "Trabajadores",
  alturas: "Trabajo en alturas",
  emos: "Exámenes médicos",
  capacitaciones: "Capacitaciones",
  accidentes: "Accidentes e incidentes",
  epp: "EPP",
  restricciones: "Restricciones",
  incapacidades: "Incapacidades",
  acciones: "Acciones correctivas",
  inspecciones: "Inspecciones",
  documentos: "Documentos SG-SST",
  alertas: "Alertas SST",
  cumplimiento: "Cumplimiento",
  quimicos: "Químicos",
  fincas: "Centros de trabajo",
  casos_salud: "Casos de salud",
  operadores: "Operadores",
  pesv: "PESV",
  copasst: "COPASST",
  ccl: "CCL",
  emergencias: "Emergencias",
  investigaciones: "Investigaciones",
};

export const SST_AUDIT_ACTION_LABELS: Record<SstAuditAction, string> = {
  create: "Creación",
  update: "Actualización",
  delete: "Eliminación",
  import: "Importación",
  retire: "Retiro",
  close: "Cierre",
  config: "Configuración",
};

export type SstAuditFieldChange = {
  field: string;
  label: string;
  from: string;
  to: string;
};

export type SstAuditDetails = {
  changes?: SstAuditFieldChange[];
  folio?: string;
  extra?: Record<string, string | number | boolean | null>;
};

export type SstAuditEvent = {
  id: string;
  occurredAt: string;
  actorUserId: string | null;
  actorName: string;
  action: SstAuditAction;
  module: SstAuditModule;
  entityType: string;
  entityId: string | null;
  workerId: string | null;
  workerName: string | null;
  summary: string;
  details: SstAuditDetails;
};

export type RecordSstAuditInput = {
  actor: Pick<SessionUser, "id" | "name">;
  action: SstAuditAction;
  module: SstAuditModule;
  summary: string;
  entityType?: string;
  entityId?: string | null;
  workerId?: string | null;
  details?: SstAuditDetails;
};

export type SstAuditListFilters = {
  module?: SstAuditModule | "all";
  action?: SstAuditAction | "all";
  workerId?: string | null;
  actorUserId?: string | null;
  query?: string;
  limit?: number;
  offset?: number;
};

export type AuditableScalar = string | number | boolean | null | undefined;

export function normalizeAuditScalar(value: AuditableScalar): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "sí" : "no";
  return String(value).trim();
}

/** Compara campos etiquetados y devuelve solo los que cambiaron. */
export function diffLabeledFields(
  before: Record<string, AuditableScalar>,
  after: Record<string, AuditableScalar>,
  labels: Record<string, string>,
): SstAuditFieldChange[] {
  const changes: SstAuditFieldChange[] = [];
  for (const [field, label] of Object.entries(labels)) {
    const from = normalizeAuditScalar(before[field]);
    const to = normalizeAuditScalar(after[field]);
    if (from === to) continue;
    changes.push({ field, label, from: from || "—", to: to || "—" });
  }
  return changes;
}

/**
 * Resumen legible estilo:
 * "Andrea actualizó la fecha de vencimiento del curso de alturas de Juan Pérez."
 */
export function buildAuditSummary(input: {
  actorName: string;
  verb: string;
  subject: string;
  ofWhom?: string | null;
  focus?: string | null;
}): string {
  const actor = input.actorName.trim() || "Usuario";
  const whom = input.ofWhom?.trim();
  const focus = input.focus?.trim();
  const subject = input.subject.trim();
  // Si hay foco (campo concreto), ese es el complemento principal.
  if (focus && whom) {
    return `${actor} ${input.verb} ${focus} de ${whom}.`;
  }
  if (focus && subject) {
    return `${actor} ${input.verb} ${focus} de ${subject}.`;
  }
  if (focus) {
    return `${actor} ${input.verb} ${focus}.`;
  }
  if (whom) {
    return `${actor} ${input.verb} ${subject} de ${whom}.`;
  }
  return `${actor} ${input.verb} ${subject}.`;
}

export function summarizeFieldChanges(
  changes: readonly SstAuditFieldChange[],
): string | null {
  if (changes.length === 0) return null;
  if (changes.length === 1) return changes[0].label;
  if (changes.length === 2) {
    return `${changes[0].label} y ${changes[1].label}`;
  }
  return `${changes
    .slice(0, 2)
    .map((c) => c.label)
    .join(", ")} y ${changes.length - 2} cambio(s) más`;
}

export function buildImportAuditSummary(input: {
  actorName: string;
  subjectPlural: string;
  created: number;
  updated: number;
  failed: number;
}): string {
  const actor = input.actorName.trim() || "Usuario";
  const parts: string[] = [];
  if (input.created > 0) parts.push(`${input.created} nuevo(s)`);
  if (input.updated > 0) parts.push(`${input.updated} actualizado(s)`);
  if (input.failed > 0) parts.push(`${input.failed} con error`);
  const detail = parts.length > 0 ? ` (${parts.join(", ")})` : "";
  return `${actor} importó ${input.subjectPlural}${detail}.`;
}
