export const SST_RECORD_TYPES = [
  "curso",
  "certificacion",
  "examen_medico",
  "incapacidad",
  "restriccion",
  "reintegro",
  "inspeccion",
  "epp",
  "investigacion",
  "accion_correctiva",
  "documento",
  "licencia",
] as const;

export type SstRecordType = (typeof SST_RECORD_TYPES)[number];

export const SST_WORKFLOW_STATUSES = [
  "open",
  "in_progress",
  "pending_implementation",
  "pending_delivery",
  "pending_closure",
  "closed",
  "cancelled",
] as const;

export type SstWorkflowStatus = (typeof SST_WORKFLOW_STATUSES)[number];

export const SST_SEMAPHORE_LEVELS = ["critico", "proximo", "seguimiento", "vigente"] as const;

export type SstSemaphoreLevel = (typeof SST_SEMAPHORE_LEVELS)[number];

/** Indicadores automáticos del radar (18 tipos del requerimiento). */
export const SST_ALERT_KINDS = [
  "cursos_vencidos",
  "cursos_proximos",
  "examenes_medicos_vencidos",
  "examenes_medicos_proximos",
  "incapacidades_proximas",
  "incapacidades_vencidas_sin_cierre",
  "restricciones_proximas",
  "restricciones_pendientes_implementacion",
  "reintegros_pendientes",
  "inspecciones_pendientes",
  "epp_pendientes_entrega",
  "epp_proximos_reposicion",
  "investigaciones_pendientes",
  "acciones_correctivas_vencidas",
  "documentos_proximos_revision",
  "documentos_vencidos",
  "licencias_proximas",
  "certificaciones_proximas",
] as const;

export type SstAlertKind = (typeof SST_ALERT_KINDS)[number];

export type SstAlertThresholds = {
  criticalMaxDays: number;
  orangeMaxDays: number;
  yellowMaxDays: number;
  useBusinessDays: boolean;
  typeOverrides: Partial<
    Record<
      SstRecordType,
      {
        orangeMaxDays?: number;
        yellowMaxDays?: number;
      }
    >
  >;
};

export const DEFAULT_ALERT_THRESHOLDS: SstAlertThresholds = {
  criticalMaxDays: 0,
  orangeMaxDays: 30,
  yellowMaxDays: 60,
  useBusinessDays: false,
  typeOverrides: {},
};

export type SstFarm = {
  id: string;
  name: string;
  code: string;
  active: boolean;
};

export type SstComplianceRecord = {
  id: string;
  folio: string;
  recordType: SstRecordType;
  title: string;
  code: string;
  modulePath: string;
  workerId: string | null;
  subjectName: string;
  subjectDocument: string | null;
  subjectJobTitle: string | null;
  farmId: string | null;
  farmName: string | null;
  dueDate: string | null;
  issuedAt: string | null;
  workflowStatus: SstWorkflowStatus;
  responsibleName: string | null;
  responsibleRole: string | null;
  externalEntity: string | null;
  phone: string | null;
  notes: string;
  metadata: Record<string, unknown>;
  closedAt: string | null;
  closeNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstAlertView = SstComplianceRecord & {
  daysRemaining: number | null;
  semaphore: SstSemaphoreLevel;
  alertKinds: SstAlertKind[];
  semaphoreLabel: string;
};

export type SstAlertKindMeta = {
  kind: SstAlertKind;
  label: string;
  description: string;
  category: "talento" | "salud" | "operacion" | "sistema";
  icon: string;
  recordTypes: readonly SstRecordType[];
  modulePath: string;
};

export const ALERT_KIND_META: Record<SstAlertKind, SstAlertKindMeta> = {
  cursos_vencidos: {
    kind: "cursos_vencidos",
    label: "Cursos vencidos",
    description: "Cursos normativos con vigencia vencida o en día 0.",
    category: "talento",
    icon: "school",
    recordTypes: ["curso"],
    modulePath: "capacitaciones",
  },
  cursos_proximos: {
    kind: "cursos_proximos",
    label: "Cursos próximos a vencer",
    description: "Cursos dentro de la ventana naranja de anticipación.",
    category: "talento",
    icon: "school",
    recordTypes: ["curso"],
    modulePath: "capacitaciones",
  },
  examenes_medicos_vencidos: {
    kind: "examenes_medicos_vencidos",
    label: "Exámenes médicos vencidos",
    description: "EMOs periódicos o de ingreso fuera de vigencia.",
    category: "salud",
    icon: "clinical_notes",
    recordTypes: ["examen_medico"],
    modulePath: "examenes-medicos-ocupacionales",
  },
  examenes_medicos_proximos: {
    kind: "examenes_medicos_proximos",
    label: "Exámenes médicos próximos a vencer",
    description: "EMOs dentro de la ventana de anticipación.",
    category: "salud",
    icon: "stethoscope",
    recordTypes: ["examen_medico"],
    modulePath: "examenes-medicos-ocupacionales",
  },
  incapacidades_proximas: {
    kind: "incapacidades_proximas",
    label: "Incapacidades próximas a vencer",
    description: "Incapacidades con fecha de corte cercana.",
    category: "salud",
    icon: "personal_injury",
    recordTypes: ["incapacidad"],
    modulePath: "incapacidades-y-reintegros",
  },
  incapacidades_vencidas_sin_cierre: {
    kind: "incapacidades_vencidas_sin_cierre",
    label: "Incapacidades vencidas sin cierre",
    description: "Incapacidades vencidas pendientes de cierre administrativo.",
    category: "salud",
    icon: "event_busy",
    recordTypes: ["incapacidad"],
    modulePath: "incapacidades-y-reintegros",
  },
  restricciones_proximas: {
    kind: "restricciones_proximas",
    label: "Restricciones próximas a vencer",
    description: "Restricciones médicas/ergonómicas por vencer.",
    category: "salud",
    icon: "pan_tool",
    recordTypes: ["restriccion"],
    modulePath: "restricciones-y-recomendaciones",
  },
  restricciones_pendientes_implementacion: {
    kind: "restricciones_pendientes_implementacion",
    label: "Restricciones pendientes de implementación",
    description: "Restricciones sin acta de reubicación o implementación.",
    category: "salud",
    icon: "pending_actions",
    recordTypes: ["restriccion"],
    modulePath: "restricciones-y-recomendaciones",
  },
  reintegros_pendientes: {
    kind: "reintegros_pendientes",
    label: "Reintegros pendientes",
    description: "Procesos de reintegro laboral sin cierre.",
    category: "salud",
    icon: "transfer_within_a_station",
    recordTypes: ["reintegro"],
    modulePath: "incapacidades-y-reintegros",
  },
  inspecciones_pendientes: {
    kind: "inspecciones_pendientes",
    label: "Inspecciones pendientes",
    description: "Inspecciones programadas sin ejecutar o vencidas.",
    category: "operacion",
    icon: "fact_check",
    recordTypes: ["inspeccion"],
    modulePath: "inspecciones",
  },
  epp_pendientes_entrega: {
    kind: "epp_pendientes_entrega",
    label: "EPP pendientes de entrega",
    description: "Dotaciones EPP pendientes de entrega al trabajador.",
    category: "operacion",
    icon: "safety_check",
    recordTypes: ["epp"],
    modulePath: "epp",
  },
  epp_proximos_reposicion: {
    kind: "epp_proximos_reposicion",
    label: "EPP próximos a reposición",
    description: "Elementos de protección con vida útil por agotar.",
    category: "operacion",
    icon: "autorenew",
    recordTypes: ["epp"],
    modulePath: "epp",
  },
  investigaciones_pendientes: {
    kind: "investigaciones_pendientes",
    label: "Investigaciones pendientes",
    description: "Investigaciones de AT/incidentes sin cierre (Res. 1401).",
    category: "operacion",
    icon: "policy",
    recordTypes: ["investigacion"],
    modulePath: "investigaciones",
  },
  acciones_correctivas_vencidas: {
    kind: "acciones_correctivas_vencidas",
    label: "Acciones correctivas vencidas",
    description: "ACPM / CAPA fuera de plazo.",
    category: "operacion",
    icon: "assignment_turned_in",
    recordTypes: ["accion_correctiva"],
    modulePath: "acciones-correctivas",
  },
  documentos_proximos_revision: {
    kind: "documentos_proximos_revision",
    label: "Documentos próximos a revisión",
    description: "Documentos SG-SST dentro de ventana de revisión.",
    category: "sistema",
    icon: "description",
    recordTypes: ["documento"],
    modulePath: "documentos-sg-sst",
  },
  documentos_vencidos: {
    kind: "documentos_vencidos",
    label: "Documentos vencidos",
    description: "Documentos SG-SST con revisión vencida.",
    category: "sistema",
    icon: "folder_off",
    recordTypes: ["documento"],
    modulePath: "documentos-sg-sst",
  },
  licencias_proximas: {
    kind: "licencias_proximas",
    label: "Licencias próximas a vencer",
    description: "Licencias de conducción / PESV próximas a vencer.",
    category: "talento",
    icon: "commute",
    recordTypes: ["licencia"],
    modulePath: "pesv",
  },
  certificaciones_proximas: {
    kind: "certificaciones_proximas",
    label: "Certificaciones próximas a vencer",
    description: "Certificaciones de alturas u oficio próximas a vencer.",
    category: "talento",
    icon: "height",
    recordTypes: ["certificacion"],
    modulePath: "trabajo-en-alturas",
  },
};

export const RECORD_TYPE_META: Record<
  SstRecordType,
  { label: string; modulePath: string; icon: string }
> = {
  curso: { label: "Curso normativo", modulePath: "capacitaciones", icon: "school" },
  certificacion: {
    label: "Certificación",
    modulePath: "trabajo-en-alturas",
    icon: "height",
  },
  examen_medico: {
    label: "Examen médico",
    modulePath: "examenes-medicos-ocupacionales",
    icon: "clinical_notes",
  },
  incapacidad: {
    label: "Incapacidad",
    modulePath: "incapacidades-y-reintegros",
    icon: "personal_injury",
  },
  restriccion: {
    label: "Restricción",
    modulePath: "restricciones-y-recomendaciones",
    icon: "pan_tool",
  },
  reintegro: {
    label: "Reintegro",
    modulePath: "incapacidades-y-reintegros",
    icon: "transfer_within_a_station",
  },
  inspeccion: { label: "Inspección", modulePath: "inspecciones", icon: "fact_check" },
  epp: { label: "EPP", modulePath: "epp", icon: "safety_check" },
  investigacion: { label: "Investigación", modulePath: "investigaciones", icon: "policy" },
  accion_correctiva: {
    label: "Acción correctiva",
    modulePath: "acciones-correctivas",
    icon: "assignment_turned_in",
  },
  documento: { label: "Documento SG-SST", modulePath: "documentos-sg-sst", icon: "description" },
  licencia: { label: "Licencia / PESV", modulePath: "pesv", icon: "commute" },
};

export const MODULE_RECORD_TYPES: Partial<Record<string, readonly SstRecordType[]>> = {
  // Dedicated modules handle these via their own pages.
};

export function isSstRecordType(value: string): value is SstRecordType {
  return (SST_RECORD_TYPES as readonly string[]).includes(value);
}

export function isSstAlertKind(value: string): value is SstAlertKind {
  return (SST_ALERT_KINDS as readonly string[]).includes(value);
}

export function isSstSemaphoreLevel(value: string): value is SstSemaphoreLevel {
  return (SST_SEMAPHORE_LEVELS as readonly string[]).includes(value);
}

export function isSstWorkflowStatus(value: string): value is SstWorkflowStatus {
  return (SST_WORKFLOW_STATUSES as readonly string[]).includes(value);
}

export type SstRecordDraft = {
  id?: string;
  recordType: SstRecordType;
  title: string;
  code: string;
  workerId?: string | null;
  subjectName: string;
  subjectDocument?: string;
  subjectJobTitle?: string;
  farmId?: string | null;
  dueDate?: string | null;
  issuedAt?: string | null;
  workflowStatus: SstWorkflowStatus;
  responsibleName?: string;
  responsibleRole?: string;
  externalEntity?: string;
  phone?: string;
  notes?: string;
};

export function validateSstRecordDraft(input: SstRecordDraft): string | null {
  if (!isSstRecordType(input.recordType)) {
    return "Tipo de registro inválido.";
  }
  if (!input.title.trim()) {
    return "El título es obligatorio.";
  }
  if (!input.code.trim()) {
    return "El código es obligatorio.";
  }
  if (!input.subjectName.trim()) {
    return "El sujeto / trabajador es obligatorio.";
  }
  if (!isSstWorkflowStatus(input.workflowStatus)) {
    return "Estado de flujo inválido.";
  }
  return null;
}

export type SstThresholdDraft = {
  criticalMaxDays: number;
  orangeMaxDays: number;
  yellowMaxDays: number;
  useBusinessDays: boolean;
  typeOverrides?: SstAlertThresholds["typeOverrides"];
};

export function validateThresholdDraft(input: SstThresholdDraft): string | null {
  if (!Number.isFinite(input.criticalMaxDays) || input.criticalMaxDays < 0) {
    return "El umbral crítico debe ser ≥ 0.";
  }
  if (!Number.isFinite(input.orangeMaxDays) || input.orangeMaxDays < 1) {
    return "El umbral naranja debe ser ≥ 1.";
  }
  if (!Number.isFinite(input.yellowMaxDays) || input.yellowMaxDays < 2) {
    return "El umbral amarillo debe ser ≥ 2.";
  }
  if (input.criticalMaxDays > input.orangeMaxDays) {
    return "Crítico no puede superar el umbral naranja.";
  }
  if (input.orangeMaxDays >= input.yellowMaxDays) {
    return "El umbral naranja debe ser menor que el amarillo.";
  }
  return null;
}
