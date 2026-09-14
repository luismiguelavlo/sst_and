"use client";

import * as XLSX from "xlsx";
import { downloadBinaryFile } from "@/lib/attendance/download-export";
import {
  buildWorkerExportRows,
  buildWorkerTemplateRows,
  workerRowsFromMatrix,
  type WorkerExcelImportRow,
} from "@/lib/sg-sst/workers/excel";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

function cellToImportString(cell: unknown): string {
  if (cell === null || cell === undefined) return "";
  if (cell instanceof Date && !Number.isNaN(cell.getTime())) {
    return cell.toISOString().slice(0, 10);
  }
  if (typeof cell === "number" && Number.isFinite(cell)) {
    // Cédulas / IDs leídos como número (evita 1.088e+9 y decimales .0).
    if (Number.isInteger(cell) || Math.abs(cell) >= 1e6) {
      return String(Math.round(cell));
    }
    return String(cell);
  }
  const text = String(cell).trim();
  if (!text) return "";
  // Datetime ISO con zona → solo fecha.
  const iso = text.match(/^(\d{4}-\d{2}-\d{2})(?:[T\s].*)?$/);
  if (iso) return iso[1] ?? text;
  if (/^\d+\.0+$/.test(text)) return text.replace(/\.0+$/, "");
  if (/^\d+(\.\d+)?e\+?\d+$/i.test(text)) {
    const n = Number(text);
    if (Number.isFinite(n) && n > 0) return String(Math.round(n));
  }
  return text;
}

export async function parseWorkersExcelFile(file: File): Promise<WorkerExcelImportRow[]> {
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
  return workerRowsFromMatrix(matrix);
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

export function downloadWorkersExcel(workers: readonly SstWorker[], fileName: string): void {
  const rows = buildWorkerExportRows(workers);
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Trabajadores");
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadWorkersTemplate(fileName = "plantilla-trabajadores-sst.xlsx"): void {
  const rows = buildWorkerTemplateRows();
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
