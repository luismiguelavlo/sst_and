"use client";

import * as XLSX from "xlsx";
import {
  complianceRowsFromMatrix,
  type SstExcelImportRow,
} from "@/lib/sg-sst/alerts/excel";
import type { SstAlertView, SstRecordType } from "@/lib/sg-sst/alerts/types";
import { buildComplianceExportRows, buildComplianceTemplateRows } from "@/lib/sg-sst/alerts/excel";
import { downloadBinaryFile } from "@/lib/attendance/download-export";

export async function parseComplianceExcelFile(
  file: File,
  options: {
    allowedTypes: readonly SstRecordType[];
    defaultType: SstRecordType;
  },
): Promise<SstExcelImportRow[]> {
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith(".xlsx") && !lowerName.endsWith(".xls") && !lowerName.endsWith(".csv")) {
    throw new Error("Formato no soportado. Usa Excel (.xlsx, .xls) o CSV.");
  }

  let matrix: string[][];
  if (lowerName.endsWith(".csv")) {
    const text = await file.text();
    matrix = text
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0)
      .map(parseCsvLine);
  } else {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error("El archivo Excel no contiene hojas.");
    }
    const sheet = workbook.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json<(string | number | boolean | Date | null)[]>(sheet, {
      header: 1,
      defval: "",
      raw: false,
    });
    matrix = raw.map((row) =>
      row.map((cell) => {
        if (cell instanceof Date) {
          return cell.toISOString().slice(0, 10);
        }
        if (cell === null || cell === undefined) {
          return "";
        }
        return String(cell).trim();
      }),
    );
  }

  return complianceRowsFromMatrix(matrix, options);
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
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

export function downloadComplianceExcel(
  records: readonly SstAlertView[],
  fileName: string,
  sheetName = "Registros SST",
): void {
  const rows = buildComplianceExportRows(records);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadComplianceTemplate(
  defaultType: SstRecordType,
  fileName = "plantilla-registros-sst.xlsx",
): void {
  const rows = buildComplianceTemplateRows(defaultType);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
