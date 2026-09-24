"use client";

import * as XLSX from "xlsx";
import { downloadBinaryFile } from "@/lib/attendance/download-export";
import {
  buildChemicalExportRows,
  buildChemicalTemplateRows,
  chemicalRowsFromMatrix,
  type ChemicalExcelImportRow,
} from "@/lib/sg-sst/quimicos/excel";
import type { SstChemical } from "@/lib/sg-sst/quimicos/types";

function cellToImportString(cell: unknown): string {
  if (cell === null || cell === undefined) return "";
  if (cell instanceof Date && !Number.isNaN(cell.getTime())) {
    return cell.toISOString().slice(0, 10);
  }
  if (typeof cell === "number" && Number.isFinite(cell)) {
    if (Number.isInteger(cell) || Math.abs(cell) >= 1e6) {
      return String(Math.round(cell));
    }
    return String(cell);
  }
  const text = String(cell).trim();
  if (!text) return "";
  const iso = text.match(/^(\d{4}-\d{2}-\d{2})(?:[T\s].*)?$/);
  if (iso) return iso[1] ?? text;
  return text;
}

export async function parseChemicalsExcelFile(
  file: File,
): Promise<ChemicalExcelImportRow[]> {
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
    const preferred =
      workbook.SheetNames.find((n) => /quim|chem|invent/i.test(n)) ??
      workbook.SheetNames[0];
    if (!preferred) throw new Error("El Excel no tiene hojas.");
    const raw = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[preferred]!, {
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
  return chemicalRowsFromMatrix(matrix);
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

export function downloadChemicalsExcel(
  items: readonly SstChemical[],
  fileName: string,
): void {
  const rows = buildChemicalExportRows(items);
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Quimicos");
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadChemicalsTemplate(
  fileName = "plantilla-inventario-quimicos.xlsx",
): void {
  const rows = buildChemicalTemplateRows();
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
