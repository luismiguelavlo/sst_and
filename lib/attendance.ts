export type AttendanceFormStatus = "draft" | "published";

export type CustomFieldType = "text" | "select" | "number" | "textarea";

export type AttendanceCustomField = {
  id: string;
  label: string;
  type: CustomFieldType;
  required: boolean;
  options: string[];
};

export type AttendanceFormDraft = {
  id?: string;
  title: string;
  eventDate: string;
  responsibleName: string;
  /** Opciones del campo «Tema visto» que verá quien diligencia. */
  topicOptions: string[];
  enableQualityRating: boolean;
  enableSignature: boolean;
  customFields: AttendanceCustomField[];
  status: AttendanceFormStatus;
};

export type AttendanceFormListItem = {
  id: string;
  title: string;
  topic: string;
  responsibleName: string;
  eventDateLabel: string;
  createdAtLabel: string;
  createdAtTimeLabel: string;
  createdAtIso: string;
  status: AttendanceFormStatus;
  fieldCount: number;
  responseCount: number;
  assigneeCount: number;
  updatedAtLabel: string;
};

export type AttendanceAssignableForm = {
  id: string;
  title: string;
  meta: string;
};

export type AttendanceActiveAssignment = {
  id: string;
  formId: string;
  formTitle: string;
  employeeName: string;
  employeeEmail: string;
  assignedAt: string;
  submitted: boolean;
};

export type AttendancePendingItem = {
  id: string;
  title: string;
  topicSummary: string;
  responsibleName: string;
  eventDateLabel: string;
  createdAtLabel: string;
};

export type AttendanceFormForFill = {
  id: string;
  title: string;
  eventDate: string;
  eventDateLabel: string;
  responsibleName: string;
  topicOptions: string[];
  enableQualityRating: boolean;
  enableSignature: boolean;
  customFields: AttendanceCustomField[];
};

export type AttendanceSubmissionInput = {
  formId: string;
  firstName: string;
  lastName: string;
  cedula: string;
  jobTitle: string;
  company: string;
  topicSelected: string;
  customAnswers: Record<string, string>;
  qualityRating: number | null;
  qualityComment: string;
  signatureData: string | null;
};

export type AttendanceResponseExportRow = {
  formId: string;
  formTitle: string;
  submittedAtLabel: string;
  userEmail: string;
  userName: string;
  firstName: string;
  lastName: string;
  cedula: string;
  jobTitle: string;
  company: string;
  topicSelected: string;
  qualityRating: number | null;
  qualityComment: string;
  signatureData: string | null;
  customAnswers: Record<string, string>;
};

export type AttendanceResponseListItem = {
  id: string;
  source: "assigned" | "public";
  firstName: string;
  lastName: string;
  cedula: string;
  jobTitle: string;
  company: string;
  topicSelected: string;
  qualityRating: number | null;
  qualityComment: string;
  submittedAtLabel: string;
  userEmail: string | null;
  userName: string | null;
  customAnswers: Record<string, string>;
};

/** Campos fijos que siempre aparecen al diligenciar (sin contar calidad/firma). */
export const FIXED_FIELD_COUNT = 8;

export const ATTENDANCE_COMPANIES = [
  "Grupo Manzanares",
  "Bienes Raíces Santander",
  "Promotora de Inversiones El Cerro",
  "Osya",
] as const;

export type AttendanceCompany = (typeof ATTENDANCE_COMPANIES)[number];

export const CUSTOM_FIELD_TYPE_OPTIONS: readonly { value: CustomFieldType; label: string }[] = [
  { value: "text", label: "Texto" },
  { value: "select", label: "Lista desplegable" },
  { value: "number", label: "Número" },
  { value: "textarea", label: "Párrafo" },
];

export function createEmptyCustomField(): AttendanceCustomField {
  return {
    id: crypto.randomUUID(),
    label: "Nuevo campo",
    type: "text",
    required: false,
    options: [],
  };
}

export function createDefaultAttendanceDraft(): AttendanceFormDraft {
  return {
    title: "F004 Lista de Asistencia Capacitación / Evento",
    eventDate: "",
    responsibleName: "PESV",
    topicOptions: [""],
    enableQualityRating: true,
    enableSignature: true,
    customFields: [],
    status: "draft",
  };
}

export function isAttendanceCompany(value: string): value is AttendanceCompany {
  return (ATTENDANCE_COMPANIES as readonly string[]).includes(value);
}

export function customFieldTypeLabel(type: CustomFieldType): string {
  return CUSTOM_FIELD_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

export function isCustomFieldType(value: string): value is CustomFieldType {
  return value === "text" || value === "select" || value === "number" || value === "textarea";
}

export function isAttendanceFormStatus(value: string): value is AttendanceFormStatus {
  return value === "draft" || value === "published";
}

export function normalizeTopicOptions(options: readonly string[]): string[] {
  return options.map((option) => option.trim()).filter((option) => option.length > 0);
}

export function topicSummary(options: readonly string[]): string {
  const normalized = normalizeTopicOptions(options);
  if (normalized.length === 0) {
    return "Sin tema";
  }
  if (normalized.length === 1) {
    return normalized[0] ?? "Sin tema";
  }
  return `${normalized[0]} (+${normalized.length - 1})`;
}

export function countAttendanceFields(draft: AttendanceFormDraft): {
  total: number;
  required: number;
} {
  const customRequired = draft.customFields.filter((field) => field.required).length;
  const extras = (draft.enableQualityRating ? 2 : 0) + (draft.enableSignature ? 1 : 0);
  const extrasRequired = (draft.enableQualityRating ? 1 : 0) + (draft.enableSignature ? 1 : 0);
  return {
    total: FIXED_FIELD_COUNT + draft.customFields.length + extras,
    required: FIXED_FIELD_COUNT + customRequired + extrasRequired,
  };
}

export function validateAttendanceDraft(draft: AttendanceFormDraft): string | null {
  if (draft.title.trim().length < 3) {
    return "El título del formulario es obligatorio.";
  }
  if (draft.responsibleName.trim().length === 0) {
    return "Indica el nombre del responsable.";
  }
  const topics = normalizeTopicOptions(draft.topicOptions);
  if (topics.length === 0) {
    return "Agrega al menos una opción en «Tema visto».";
  }
  if (draft.eventDate.trim().length > 0 && !/^\d{4}-\d{2}-\d{2}$/.test(draft.eventDate.trim())) {
    return "La fecha del evento no es válida.";
  }
  for (const [index, field] of draft.customFields.entries()) {
    if (field.label.trim().length === 0) {
      return `El campo adicional ${index + 1} necesita una etiqueta.`;
    }
    if (!isCustomFieldType(field.type)) {
      return `El campo "${field.label}" tiene un tipo inválido.`;
    }
    if (field.type === "select" && field.options.filter((option) => option.trim().length > 0).length < 2) {
      return `El campo "${field.label}" necesita al menos 2 opciones.`;
    }
  }
  return null;
}

export function validateAttendanceSubmission(
  form: AttendanceFormForFill,
  input: AttendanceSubmissionInput,
): string | null {
  if (input.firstName.trim().length === 0) {
    return "Indica tus nombres.";
  }
  if (input.lastName.trim().length === 0) {
    return "Indica tus apellidos.";
  }
  if (input.cedula.trim().length === 0) {
    return "Indica tu cédula.";
  }
  if (input.jobTitle.trim().length === 0) {
    return "Indica tu cargo.";
  }
  if (!isAttendanceCompany(input.company.trim())) {
    return "Selecciona una empresa válida.";
  }
  const topics = normalizeTopicOptions(form.topicOptions);
  if (!topics.includes(input.topicSelected.trim())) {
    return "Selecciona un tema visto válido.";
  }
  for (const field of form.customFields) {
    const value = (input.customAnswers[field.id] ?? "").trim();
    if (field.required && value.length === 0) {
      return `Completa el campo «${field.label}».`;
    }
    if (field.type === "select" && value.length > 0 && !field.options.includes(value)) {
      return `La opción de «${field.label}» no es válida.`;
    }
    if (field.type === "number" && value.length > 0 && Number.isNaN(Number(value))) {
      return `«${field.label}» debe ser un número.`;
    }
  }
  if (form.enableQualityRating) {
    if (input.qualityRating === null || input.qualityRating < 1 || input.qualityRating > 5) {
      return "Califica la calidad del evento (1 a 5).";
    }
  }
  if (form.enableSignature && (input.signatureData?.trim().length ?? 0) < 8) {
    return "La firma es obligatoria.";
  }
  return null;
}

export function responsesToCsv(
  rows: readonly AttendanceResponseExportRow[],
  fieldLabels: Readonly<Record<string, string>> = {},
): string {
  const customKeys = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row.customAnswers)) {
      customKeys.add(key);
    }
  }
  const customCols = [...customKeys];
  const header = [
    "formulario_id",
    "formulario",
    "enviado",
    "email",
    "usuario",
    "nombres",
    "apellidos",
    "cedula",
    "cargo",
    "empresa",
    "tema_visto",
    "calificacion",
    "comentario_calidad",
    "tiene_firma",
    ...customCols.map((key) => fieldLabels[key] ?? `campo_${key}`),
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        csvCell(row.formId),
        csvCell(row.formTitle),
        csvCell(row.submittedAtLabel),
        csvCell(row.userEmail),
        csvCell(row.userName),
        csvCell(row.firstName),
        csvCell(row.lastName),
        csvCell(row.cedula),
        csvCell(row.jobTitle),
        csvCell(row.company),
        csvCell(row.topicSelected),
        csvCell(row.qualityRating === null ? "" : String(row.qualityRating)),
        csvCell(row.qualityComment),
        csvCell(row.signatureData ? "si" : "no"),
        ...customCols.map((key) => csvCell(row.customAnswers[key] ?? "")),
      ].join(","),
    ),
  ];
  return `\uFEFF${lines.join("\n")}`;
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}
