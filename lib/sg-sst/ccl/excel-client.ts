"use client";

import * as XLSX from "xlsx";
import { downloadBinaryFile } from "@/lib/attendance/download-export";
import {
  buildCaseExportRows,
  buildCaseTemplateRows,
  buildCommitmentExportRows,
  buildCommitmentTemplateRows,
  buildMeetingExportRows,
  buildMeetingTemplateRows,
  buildMemberExportRows,
  buildMemberTemplateRows,
  caseRowsFromMatrix,
  commitmentRowsFromMatrix,
  meetingRowsFromMatrix,
  memberRowsFromMatrix,
  type CclCaseExcelImportRow,
  type CclCommitmentExcelImportRow,
  type CclMeetingExcelImportRow,
  type CclMemberExcelImportRow,
} from "@/lib/sg-sst/ccl/excel";
import type {
  SstCclCaseView,
  SstCclCommitmentView,
  SstCclMeeting,
  SstCclMember,
} from "@/lib/sg-sst/ccl/types";

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

export type CclWorkbookImport = {
  members: CclMemberExcelImportRow[];
  meetings: CclMeetingExcelImportRow[];
  cases: CclCaseExcelImportRow[];
  commitments: CclCommitmentExcelImportRow[];
};

export async function parseCclWorkbookFile(
  file: File,
): Promise<CclWorkbookImport> {
  const parsed = await fileToWorkbookOrMatrix(file);
  if (parsed.matrix) {
    return {
      members: memberRowsFromMatrix(parsed.matrix),
      meetings: [],
      cases: [],
      commitments: [],
    };
  }
  const workbook = parsed.workbook;
  if (!workbook) throw new Error("No se pudo leer el archivo.");

  const memberSheet =
    findSheet(workbook, ["integrante", "miembro", "member"]) ?? null;
  const meetingSheet =
    findSheet(workbook, ["acta", "reunion", "meeting"]) ?? null;
  const caseSheet =
    findSheet(workbook, ["caso", "expediente", "case"]) ?? null;
  const commitmentSheet =
    findSheet(workbook, ["compromiso", "commitment", "accion"]) ?? null;

  const first = workbook.Sheets[workbook.SheetNames[0]];
  return {
    members: memberSheet
      ? memberRowsFromMatrix(matrixFromSheet(memberSheet))
      : first && !meetingSheet && !caseSheet && !commitmentSheet
        ? memberRowsFromMatrix(matrixFromSheet(first))
        : [],
    meetings: meetingSheet
      ? meetingRowsFromMatrix(matrixFromSheet(meetingSheet))
      : [],
    cases: caseSheet ? caseRowsFromMatrix(matrixFromSheet(caseSheet)) : [],
    commitments: commitmentSheet
      ? commitmentRowsFromMatrix(matrixFromSheet(commitmentSheet))
      : [],
  };
}

export function downloadCclWorkbook(input: {
  members: readonly SstCclMember[];
  meetings: readonly SstCclMeeting[];
  cases: readonly SstCclCaseView[];
  commitments: readonly SstCclCommitmentView[];
  fileName: string;
}): void {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildMemberExportRows(input.members)),
    "Integrantes",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildMeetingExportRows(input.meetings)),
    "Actas",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildCaseExportRows(input.cases)),
    "Casos",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildCommitmentExportRows(input.commitments)),
    "Compromisos",
  );
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    input.fileName.endsWith(".xlsx") ? input.fileName : `${input.fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadCclTemplate(
  fileName = "plantilla-ccl-sst.xlsx",
): void {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildMemberTemplateRows()),
    "Integrantes",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildMeetingTemplateRows()),
    "Actas",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildCaseTemplateRows()),
    "Casos",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildCommitmentTemplateRows()),
    "Compromisos",
  );
  const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
