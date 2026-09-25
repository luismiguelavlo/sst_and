/**
 * Utilidades compartidas para importación Excel en módulos SG-SST.
 */

import { todayIsoDate } from "./draft-mode";

/**
 * Convierte una celda Excel de fecha a formato ISO YYYY-MM-DD.
 * 
 * Soporta múltiples formatos:
 * - ISO: "2024-03-15"
 * - Seriales Excel: 44985 (días desde 1899-12-30)
 * - Objetos Date de SheetJS
 * - Formatos slash: "3/15/24", "15/3/2024"
 * - Fallback a Date.parse
 * 
 * @param raw - Valor de celda (string, number, Date)
 * @param fallbackToToday - Si true, devuelve hoy cuando el parsing falla; si false, devuelve cadena vacía
 * @returns Fecha en formato YYYY-MM-DD
 */
export function excelDateToIso(
  raw: string | number | Date | null | undefined,
  fallbackToToday = false,
): string {
  if (raw == null) return fallbackToToday ? todayIsoDate() : "";
  
  // Si es Date object (SheetJS puede devolver Date)
  if (raw instanceof Date) {
    if (Number.isNaN(raw.getTime())) {
      return fallbackToToday ? todayIsoDate() : "";
    }
    return raw.toISOString().slice(0, 10);
  }
  
  // Si es número (serial Excel o timestamp)
  if (typeof raw === "number") {
    // Seriales Excel están en rango ~25000-60000 (1968-2064)
    if (raw >= 25000 && raw <= 60000) {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + raw * 86400000);
      return date.toISOString().slice(0, 10);
    }
    // Timestamps Unix (ms)
    if (raw > 1000000000000 && raw < 9999999999999) {
      return new Date(raw).toISOString().slice(0, 10);
    }
    // Timestamps Unix (segundos)
    if (raw > 1000000000 && raw < 9999999999) {
      return new Date(raw * 1000).toISOString().slice(0, 10);
    }
    // Número fuera de rango esperado
    return fallbackToToday ? todayIsoDate() : "";
  }
  
  // String
  const str = raw.toString().trim();
  if (!str) return fallbackToToday ? todayIsoDate() : "";
  
  // Ya está en ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  
  // Formato slash: M/D/YY o D/M/YYYY
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slashMatch) {
    const [, a, b, yearPart] = slashMatch;
    const year = yearPart.length === 2 
      ? (parseInt(yearPart, 10) > 50 ? 1900 : 2000) + parseInt(yearPart, 10)
      : parseInt(yearPart, 10);
    
    // Heurística: si a > 12, es día (D/M/YYYY); si no, asumimos M/D/YY
    const month = parseInt(a, 10) > 12 ? parseInt(b, 10) : parseInt(a, 10);
    const day = parseInt(a, 10) > 12 ? parseInt(a, 10) : parseInt(b, 10);
    
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(year, month - 1, day);
      if (!Number.isNaN(date.getTime())) {
        return date.toISOString().slice(0, 10);
      }
    }
  }
  
  // Intentar Date.parse
  const parsed = Date.parse(str);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }
  
  return fallbackToToday ? todayIsoDate() : "";
}

/**
 * Normaliza el valor de una celda para importación (maneja cédulas en notación científica,
 * seriales Excel de fechas, y valores comunes).
 * 
 * @param cell - Valor de celda
 * @returns String normalizado para importación
 */
export function cellToImportString(cell: unknown): string {
  if (cell == null) return "";
  
  if (typeof cell === "string") {
    return cell.trim();
  }
  
  if (typeof cell === "number") {
    // Números grandes (cédulas) en notación científica: 1.088e+9 → "1088000000"
    if (cell >= 1e6) {
      return Math.floor(cell).toString();
    }
    // Seriales Excel de fechas (25000-60000)
    if (cell >= 25000 && cell <= 60000) {
      return excelDateToIso(cell, false);
    }
    // Otros números
    return cell.toString();
  }
  
  if (cell instanceof Date) {
    return excelDateToIso(cell, false);
  }
  
  return String(cell).trim();
}
