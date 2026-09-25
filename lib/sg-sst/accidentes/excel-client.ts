"use client";

import * as XLSX from "xlsx";
import { downloadBinaryFile } from "@/lib/attendance/download-export";
import {
  accidentRowsFromMatrix,
  buildAccidentExportRows,
  buildAccidentTemplateRows,
  type AccidentExcelImportRow,
} from "@/lib/sg-sst/accidentes/excel";
import type { SstAccidentEvent } from "@/lib/sg-sst/accidentes/types";

/** Normaliza celdas: fechas, cédulas numéricas y notación científica. */
function cellToImportString(cell: unknown): string {
  if (cell === null || cell === undefined) return "";
  if (cell instanceof Date && !Number.isNaN(cell.getTime())) {
    const y = cell.getFullYear();
    const m = String(cell.getMonth() + 1).padStart(2, "0");
    const d = String(cell.getDate()).padStart(2, "0");
    if (
      cell.getHours() !== 0 ||
      cell.getMinutes() !== 0 ||
      cell.getSeconds() !== 0
    ) {
      const hh = String(cell.getHours()).padStart(2, "0");
      const mm = String(cell.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    }
    return `${y}-${m}-${d}`;
  }
  if (typeof cell === "number" && Number.isFinite(cell)) {
    // Serial de fecha Excel (~45 000 = 2023) vs cédulas (≥ 100 000) vs contadores (1..N)
    if (cell >= 20_000 && cell < 100_000) {
      const utc = Date.UTC(1899, 11, 30) + Math.floor(cell) * 86_400_000;
      return new Date(utc).toISOString().slice(0, 10);
    }
    if (Number.isInteger(cell) || Math.abs(cell) >= 1e6) {
      return String(Math.round(cell));
    }
    return String(cell);
  }
  const text = String(cell).trim();
  if (!text) return "";
  const iso = text.match(/^(\d{4}-\d{2}-\d{2})(?:[T\s].*)?$/);
  if (iso) return iso[1] ?? text;
  if (/^\d+\.0+$/.test(text)) return text.replace(/\.0+$/, "");
  if (/^\d+(\.\d+)?e\+?\d+$/i.test(text)) {
    const n = Number(text);
    if (Number.isFinite(n) && n > 0) return String(Math.round(n));
  }
  return text;
}

export async function parseAccidentsExcelFile(
  file: File,
): Promise<AccidentExcelImportRow[]> {
  const lower = file.name.toLowerCase();
  let matrix: string[][];
  if (lower.endsWith(".csv")) {
    const text = await file.text();
    matrix = text
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map(parseCsvLine);
  } else if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, {
      type: "array",
      cellDates: true,
      dense: true,
    });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error("El Excel no tiene hojas.");
    const raw = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
      header: 1,
      defval: "",
      raw: false,
      blankrows: false,
    });
    matrix = raw.map((row) => {
      const cells = Array.isArray(row) ? row : [];
      return cells.map((cell) => cellToImportString(cell));
    });
  } else {
    throw new Error("Usa Excel (.xlsx, .xls) o CSV.");
  }
  return accidentRowsFromMatrix(matrix);
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if ((char === "," || char === ";") && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current);
  return cells;
}

export function downloadAccidentsExcel(
  events: readonly SstAccidentEvent[],
  fileName: string,
): void {
  const rows = buildAccidentExportRows(events);
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Accidentes");
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadAccidentsTemplate(
  fileName = "plantilla-accidentes-incidentes-sst.xlsx",
): void {
  const rows = buildAccidentTemplateRows();
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Plantilla");
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
