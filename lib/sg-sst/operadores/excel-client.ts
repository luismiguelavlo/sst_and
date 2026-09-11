"use client";

import * as XLSX from "xlsx";
import { downloadBinaryFile } from "@/lib/attendance/download-export";
import {
  buildOperatorExportRows,
  buildOperatorTemplateRows,
  operatorRowsFromMatrix,
  type OperatorExcelImportRow,
} from "@/lib/sg-sst/operadores/excel";
import type { SstOperatorView } from "@/lib/sg-sst/operadores/types";

export async function parseOperatorsExcelFile(
  file: File,
): Promise<OperatorExcelImportRow[]> {
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
        if (cell instanceof Date) return cell.toISOString().slice(0, 10);
        if (cell === null || cell === undefined) return "";
        return String(cell).trim();
      }),
    );
  } else {
    throw new Error("Usa Excel (.xlsx, .xls) o CSV.");
  }
  return operatorRowsFromMatrix(matrix);
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

export function downloadOperatorsExcel(
  items: readonly SstOperatorView[],
  fileName: string,
): void {
  const rows = buildOperatorExportRows(items);
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Operadores");
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadOperatorsTemplate(
  fileName = "plantilla-operadores-sst.xlsx",
): void {
  const rows = buildOperatorTemplateRows();
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
