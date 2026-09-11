"use client";

import * as XLSX from "xlsx";
import { downloadBinaryFile } from "@/lib/attendance/download-export";
import {
  buildEppCatalogTemplateRows,
  buildEppDeliveryExportRows,
  buildEppDeliveryTemplateRows,
  eppDeliveryRowsFromMatrix,
  type EppExcelImportRow,
} from "@/lib/sg-sst/epp/excel";
import type { SstEppCatalogItem, SstEppDeliveryView } from "@/lib/sg-sst/epp/types";

export async function parseEppDeliveriesExcelFile(
  file: File,
): Promise<EppExcelImportRow[]> {
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
  return eppDeliveryRowsFromMatrix(matrix);
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

export function downloadEppDeliveriesExcel(
  deliveries: readonly SstEppDeliveryView[],
  fileName: string,
): void {
  const rows = buildEppDeliveryExportRows(deliveries);
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Entregas EPP");
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadEppDeliveriesTemplate(
  fileName = "plantilla-entregas-epp-sst.xlsx",
): void {
  const rows = buildEppDeliveryTemplateRows();
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

export function downloadEppCatalogTemplate(
  catalog: readonly SstEppCatalogItem[] = [],
  fileName = "plantilla-catalogo-epp-sst.xlsx",
): void {
  const rows = buildEppCatalogTemplateRows(catalog);
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Catálogo");
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
