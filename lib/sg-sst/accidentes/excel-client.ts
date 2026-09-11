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
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error("El Excel no tiene hojas.");
    const raw = XLSX.utils.sheet_to_json<(string | number | boolean | Date | null)[]>(
      workbook.Sheets[sheetName],
      { header: 1, defval: "", raw: false },
    );
    matrix = raw.map((row) =>
      row.map((cell) => {
        if (cell instanceof Date) {
          const iso = cell.toISOString();
          if (
            cell.getHours() !== 0 ||
            cell.getMinutes() !== 0 ||
            cell.getSeconds() !== 0
          ) {
            return iso.slice(11, 19);
          }
          return iso.slice(0, 10);
        }
        if (cell === null || cell === undefined) return "";
        return String(cell).trim();
      }),
    );
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
