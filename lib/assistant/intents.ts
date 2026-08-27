export type AssistantIntentId =
  | "pending_courses"
  | "in_progress_courses"
  | "list_certificates"
  | "pending_attendance"
  | "howto_complete_course"
  | "menu";

export type AssistantAction = {
  label: string;
  href: string;
};

export type AssistantReply = {
  intentId: AssistantIntentId;
  text: string;
  actions: readonly AssistantAction[];
};

export type AssistantSuggestion = {
  intentId: AssistantIntentId;
  label: string;
};

export const ASSISTANT_SUGGESTIONS: readonly AssistantSuggestion[] = [
  { intentId: "pending_courses", label: "¿Qué cursos me faltan?" },
  { intentId: "in_progress_courses", label: "¿Qué cursos tengo en progreso?" },
  { intentId: "list_certificates", label: "¿Qué certificados tengo?" },
  { intentId: "pending_attendance", label: "¿Tengo asistencia pendiente?" },
  { intentId: "howto_complete_course", label: "¿Cómo completo un curso?" },
] as const;

export const ASSISTANT_INTENTS = new Set<AssistantIntentId>(
  ASSISTANT_SUGGESTIONS.map((item) => item.intentId),
);

export function isAssistantIntentId(value: string): value is AssistantIntentId {
  return ASSISTANT_INTENTS.has(value as AssistantIntentId) || value === "menu";
}

/** Matching simple por palabras clave (sin IA). */
export function matchIntentFromText(raw: string): AssistantIntentId | null {
  const text = raw.trim().toLowerCase();
  if (text.length === 0) {
    return null;
  }
  if (
    /(faltan|pendiente|incompleto|sin (hacer|completar)|me falta)/.test(text) &&
    /curso/.test(text)
  ) {
    return "pending_courses";
  }
  if (/(progreso|en curso|avanz)/.test(text) && /curso/.test(text)) {
    return "in_progress_courses";
  }
  if (/certificad|diploma/.test(text)) {
    return "list_certificates";
  }
  if (/asistenc|formulario/.test(text)) {
    return "pending_attendance";
  }
  if (/(c[oó]mo|como).*(complet|termin|finaliz)/.test(text)) {
    return "howto_complete_course";
  }
  if (/men[uú]|ayuda|opcion|opción/.test(text)) {
    return "menu";
  }
  return null;
}
