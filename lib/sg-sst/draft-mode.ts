/** Modo de validación de borradores SG-SST. */
export type DraftValidationMode = "form" | "import";

/** Fecha ISO YYYY-MM-DD de hoy (útil para defaults de importación). */
export function todayIsoDate(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/**
 * Determina si un valor parece ser un código de negocio válido (folio, número de evento, etc.)
 * y no un simple índice de fila de plantilla.
 * 
 * Devuelve `true` si el valor contiene letras, guiones o es un número >9999.
 * Devuelve `false` si es un número simple 1..9999 (probablemente índice de fila).
 * 
 * Ejemplos:
 * - `isBusinessFolioCode("AT-2026-001")` → true
 * - `isBusinessFolioCode("ALT-123")` → true
 * - `isBusinessFolioCode("1")` → false (índice de fila)
 * - `isBusinessFolioCode("9999")` → false (índice de fila)
 * - `isBusinessFolioCode("10000")` → true (probablemente código válido)
 */
export function isBusinessFolioCode(value: string | null | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  
  // Si contiene letras o guiones, es un código de negocio
  if (/[a-z\-]/i.test(trimmed)) return true;
  
  // Si es solo dígitos, solo es válido si es >9999
  const numValue = parseInt(trimmed, 10);
  return !Number.isNaN(numValue) && numValue > 9999;
}
