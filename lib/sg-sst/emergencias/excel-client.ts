"use client";

import * as XLSX from "xlsx";
import { downloadBinaryFile } from "@/lib/attendance/download-export";
import {
  brigadeRowsFromMatrix,
  buildBrigadeExportRows,
  buildBrigadeTemplateRows,
  buildDrillExportRows,
  buildDrillTemplateRows,
  buildEquipmentExportRows,
  buildEquipmentTemplateRows,
  drillRowsFromMatrix,
  equipmentRowsFromMatrix,
  type BrigadeExcelImportRow,
  type DrillExcelImportRow,
  type EquipmentExcelImportRow,
} from "@/lib/sg-sst/emergencias/excel";
import type {
  SstBrigadeMemberView,
  SstEmergencyDrill,
  SstEmergencyEquipmentView,
} from "@/lib/sg-sst/emergencias/types";

function matrixFromSheet(sheet: XLSX.WorkSheet): string[][] {
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

export async function parseBrigadeExcelFile(
  file: File,
): Promise<BrigadeExcelImportRow[]> {
  const parsed = await fileToWorkbookOrMatrix(file);
  if (parsed.matrix) {
    return brigadeRowsFromMatrix(parsed.matrix);
  }
  const workbook = parsed.workbook;
  if (!workbook) throw new Error("No se pudo leer el archivo.");
  const sheet =
    findSheet(workbook, ["brigada", "brigadista", "brigade"]) ??
    workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("El Excel no tiene hojas.");
  return brigadeRowsFromMatrix(matrixFromSheet(sheet));
}

export async function parseEquipmentExcelFile(
  file: File,
): Promise<EquipmentExcelImportRow[]> {
  const parsed = await fileToWorkbookOrMatrix(file);
  if (parsed.matrix) {
    return equipmentRowsFromMatrix(parsed.matrix);
  }
  const workbook = parsed.workbook;
  if (!workbook) throw new Error("No se pudo leer el archivo.");
  const sheet =
    findSheet(workbook, ["equipo", "equipment", "matriz"]) ??
    workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("El Excel no tiene hojas.");
  return equipmentRowsFromMatrix(matrixFromSheet(sheet));
}

export async function parseDrillExcelFile(
  file: File,
): Promise<DrillExcelImportRow[]> {
  const parsed = await fileToWorkbookOrMatrix(file);
  if (parsed.matrix) {
    return drillRowsFromMatrix(parsed.matrix);
  }
  const workbook = parsed.workbook;
  if (!workbook) throw new Error("No se pudo leer el archivo.");
  const sheet =
    findSheet(workbook, ["simulacro", "drill", "ejercicio"]) ??
    workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("El Excel no tiene hojas.");
  return drillRowsFromMatrix(matrixFromSheet(sheet));
}

export function downloadEmergenciasWorkbook(input: {
  brigade: readonly SstBrigadeMemberView[];
  equipment: readonly SstEmergencyEquipmentView[];
  drills: readonly SstEmergencyDrill[];
  fileName: string;
}): void {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildBrigadeExportRows(input.brigade)),
    "Brigada",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildEquipmentExportRows(input.equipment)),
    "Equipos",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildDrillExportRows(input.drills)),
    "Simulacros",
  );
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    input.fileName.endsWith(".xlsx") ? input.fileName : `${input.fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadEmergenciasTemplate(
  fileName = "plantilla-emergencias-sst.xlsx",
): void {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildBrigadeTemplateRows()),
    "Brigada",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildEquipmentTemplateRows()),
    "Equipos",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildDrillTemplateRows()),
    "Simulacros",
  );
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
