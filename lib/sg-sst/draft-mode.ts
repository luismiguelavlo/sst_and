/** Modo de validación de borradores SG-SST. */
export type DraftValidationMode = "form" | "import";

/** Fecha ISO YYYY-MM-DD de hoy (útil para defaults de importación). */
export function todayIsoDate(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}
