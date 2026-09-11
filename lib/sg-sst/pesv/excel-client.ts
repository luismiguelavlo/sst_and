"use client";

import * as XLSX from "xlsx";
import { downloadBinaryFile } from "@/lib/attendance/download-export";
import {
  buildDriverExportRows,
  buildDriverTemplateRows,
  buildPreopExportRows,
  buildVehicleExportRows,
  buildVehicleTemplateRows,
  driverRowsFromMatrix,
  vehicleRowsFromMatrix,
  type PesvDriverExcelImportRow,
  type PesvVehicleExcelImportRow,
} from "@/lib/sg-sst/pesv/excel";
import type {
  SstPesvDriver,
  SstPesvPreop,
  SstPesvVehicle,
} from "@/lib/sg-sst/pesv/types";

function matrixFromSheet(
  sheet: XLSX.WorkSheet,
): string[][] {
  const raw = XLSX.utils.sheet_to_json<(string | number | boolean | Date | null)[]>(
    sheet,
    { header: 1, defval: "", raw: false },
  );
  return raw.map((row) =>
    row.map((cell) => {
      if (cell instanceof Date) return cell.toISOString().slice(0, 10);
      if (cell === null || cell === undefined) return "";
      return String(cell).trim();
    }),
  );
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

async function fileToWorkbookOrMatrix(
  file: File,
): Promise<{ workbook?: XLSX.WorkBook; matrix?: string[][] }> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".csv")) {
    const text = await file.text();
    const matrix = text
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map(parseCsvLine);
    return { matrix };
  }
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
    return { workbook };
  }
  throw new Error("Usa Excel (.xlsx, .xls) o CSV.");
}

function findSheet(
  workbook: XLSX.WorkBook,
  candidates: readonly string[],
): XLSX.WorkSheet | null {
  for (const name of workbook.SheetNames) {
    const normalized = name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (candidates.some((c) => normalized.includes(c))) {
      return workbook.Sheets[name] ?? null;
    }
  }
  return null;
}

export async function parsePesvDriversExcelFile(
  file: File,
): Promise<PesvDriverExcelImportRow[]> {
  const parsed = await fileToWorkbookOrMatrix(file);
  if (parsed.matrix) {
    return driverRowsFromMatrix(parsed.matrix);
  }
  const workbook = parsed.workbook;
  if (!workbook) throw new Error("No se pudo leer el archivo.");
  const sheet =
    findSheet(workbook, ["conductor", "driver", "pesv"]) ??
    workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("El Excel no tiene hojas.");
  return driverRowsFromMatrix(matrixFromSheet(sheet));
}

export async function parsePesvVehiclesExcelFile(
  file: File,
): Promise<PesvVehicleExcelImportRow[]> {
  const parsed = await fileToWorkbookOrMatrix(file);
  if (parsed.matrix) {
    return vehicleRowsFromMatrix(parsed.matrix);
  }
  const workbook = parsed.workbook;
  if (!workbook) throw new Error("No se pudo leer el archivo.");
  const sheet =
    findSheet(workbook, ["flota", "vehiculo", "vehicle"]) ??
    workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("El Excel no tiene hojas.");
  return vehicleRowsFromMatrix(matrixFromSheet(sheet));
}

export function downloadPesvWorkbook(input: {
  drivers: readonly SstPesvDriver[];
  vehicles: readonly SstPesvVehicle[];
  preops: readonly SstPesvPreop[];
  fileName: string;
}): void {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildDriverExportRows(input.drivers)),
    "Conductores",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildVehicleExportRows(input.vehicles)),
    "Flota",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildPreopExportRows(input.preops)),
    "Preoperacionales",
  );
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    input.fileName.endsWith(".xlsx") ? input.fileName : `${input.fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadPesvTemplate(
  fileName = "plantilla-pesv-sst.xlsx",
): void {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildDriverTemplateRows()),
    "Conductores",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildVehicleTemplateRows()),
    "Flota",
  );
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
