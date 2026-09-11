"use client";

import * as XLSX from "xlsx";
import { downloadBinaryFile } from "@/lib/attendance/download-export";
import {
  buildFarmExportRows,
  buildFarmTemplateRows,
  farmRowsFromMatrix,
  type FarmExcelImportRow,
} from "@/lib/sg-sst/fincas/excel";
import type { SstFarmRecord } from "@/lib/sg-sst/fincas/types";

export async function parseFarmsExcelFile(
  file: File,
): Promise<FarmExcelImportRow[]> {
  const lower = file.name.toLowerCase();
  let matrix: unknown[][];

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
    // Preferir hoja "Centros" si existe; si no, la primera.
    const preferred =
      workbook.SheetNames.find((n) => /centro|finca|predio/i.test(n)) ??
      workbook.SheetNames[0];
    if (!preferred) throw new Error("El Excel no tiene hojas.");
    const sheet = workbook.Sheets[preferred];
    if (!sheet) throw new Error("No se pudo leer la hoja del Excel.");

    const raw = XLSX.utils.sheet_to_json<(string | number | boolean | Date | null)[]>(
      sheet,
      {
        header: 1,
        defval: "",
        raw: true,
        blankrows: false,
      },
    );
    matrix = raw.map((row) => (Array.isArray(row) ? [...row] : []));
  } else {
    throw new Error("Usa Excel (.xlsx, .xls) o CSV.");
  }

  return farmRowsFromMatrix(matrix);
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

export function downloadFarmsExcel(
  farms: readonly SstFarmRecord[],
  fileName: string,
): void {
  const rows = buildFarmExportRows(farms);
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Centros");
  const buffer = XLSX.write(book, {
    type: "array",
    bookType: "xlsx",
  }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadFarmsTemplate(
  fileName = "plantilla-centros-de-trabajo.xlsx",
): void {
  const rows = buildFarmTemplateRows();
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Centros");
  const buffer = XLSX.write(book, {
    type: "array",
    bookType: "xlsx",
  }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
