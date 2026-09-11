"use client";

import * as XLSX from "xlsx";
import { downloadBinaryFile } from "@/lib/attendance/download-export";
import {
  buildCommitmentExportRows,
  buildCopasstTemplateSheets,
  buildMeetingExportRows,
  buildMemberExportRows,
  buildTrainingExportRows,
  commitmentRowsFromMatrix,
  meetingRowsFromMatrix,
  memberRowsFromMatrix,
  trainingRowsFromMatrix,
  type CopasstCommitmentExcelImportRow,
  type CopasstMeetingExcelImportRow,
  type CopasstMemberExcelImportRow,
  type CopasstTrainingExcelImportRow,
} from "@/lib/sg-sst/copasst/excel";
import type {
  SstCopasstCommitmentView,
  SstCopasstMeeting,
  SstCopasstMemberView,
  SstCopasstTraining,
} from "@/lib/sg-sst/copasst/types";

export type CopasstImportBundle = {
  members: CopasstMemberExcelImportRow[];
  meetings: CopasstMeetingExcelImportRow[];
  commitments: CopasstCommitmentExcelImportRow[];
  trainings: CopasstTrainingExcelImportRow[];
  activeKind: "members" | "meetings" | "commitments" | "trainings";
};

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

function normalizeSheetName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findSheet(
  workbook: XLSX.WorkBook,
  candidates: readonly string[],
): XLSX.WorkSheet | null {
  for (const name of workbook.SheetNames) {
    const normalized = normalizeSheetName(name);
    if (candidates.some((c) => normalized.includes(c))) {
      return workbook.Sheets[name] ?? null;
    }
  }
  return null;
}

function detectKindFromHeaders(
  matrix: string[][],
): CopasstImportBundle["activeKind"] | null {
  if (matrix.length === 0) return null;
  const headers = matrix[0].map((h) => normalizeSheetName(String(h))).join("|");
  if (
    headers.includes("rol") ||
    headers.includes("trabajador") ||
    headers.includes("periodo")
  ) {
    return "members";
  }
  if (
    headers.includes("proxima") ||
    headers.includes("tipo") ||
    headers.includes("resumen")
  ) {
    return "meetings";
  }
  if (
    headers.includes("compromiso") ||
    headers.includes("descripcion") ||
    headers.includes("vencimiento") ||
    headers.includes("responsable")
  ) {
    return "commitments";
  }
  if (
    headers.includes("instructor") ||
    headers.includes("asistentes") ||
    headers.includes("horas") ||
    headers.includes("capacitacion")
  ) {
    return "trainings";
  }
  return null;
}

export async function parseCopasstExcelFile(
  file: File,
  preferredKind?: CopasstImportBundle["activeKind"],
): Promise<CopasstImportBundle> {
  const lower = file.name.toLowerCase();
  const empty: CopasstImportBundle = {
    members: [],
    meetings: [],
    commitments: [],
    trainings: [],
    activeKind: preferredKind ?? "members",
  };

  if (lower.endsWith(".csv")) {
    const text = await file.text();
    const matrix = text
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map(parseCsvLine);
    const kind =
      preferredKind ?? detectKindFromHeaders(matrix) ?? "members";
    if (kind === "members") empty.members = memberRowsFromMatrix(matrix);
    if (kind === "meetings") empty.meetings = meetingRowsFromMatrix(matrix);
    if (kind === "commitments") {
      empty.commitments = commitmentRowsFromMatrix(matrix);
    }
    if (kind === "trainings") empty.trainings = trainingRowsFromMatrix(matrix);
    empty.activeKind = kind;
    return empty;
  }

  if (!lower.endsWith(".xlsx") && !lower.endsWith(".xls")) {
    throw new Error("Usa Excel (.xlsx, .xls) o CSV.");
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

  const memberSheet = findSheet(workbook, [
    "integrante",
    "miembro",
    "member",
  ]);
  const meetingSheet = findSheet(workbook, ["acta", "reunion", "meeting"]);
  const commitmentSheet = findSheet(workbook, [
    "compromiso",
    "commitment",
    "tarea",
  ]);
  const trainingSheet = findSheet(workbook, [
    "capacitacion",
    "training",
    "formacion",
  ]);

  if (memberSheet) {
    empty.members = memberRowsFromMatrix(matrixFromSheet(memberSheet));
  }
  if (meetingSheet) {
    empty.meetings = meetingRowsFromMatrix(matrixFromSheet(meetingSheet));
  }
  if (commitmentSheet) {
    empty.commitments = commitmentRowsFromMatrix(
      matrixFromSheet(commitmentSheet),
    );
  }
  if (trainingSheet) {
    empty.trainings = trainingRowsFromMatrix(matrixFromSheet(trainingSheet));
  }

  const total =
    empty.members.length +
    empty.meetings.length +
    empty.commitments.length +
    empty.trainings.length;

  if (total === 0) {
    const first = workbook.Sheets[workbook.SheetNames[0]];
    if (!first) throw new Error("El Excel no tiene hojas.");
    const matrix = matrixFromSheet(first);
    const kind =
      preferredKind ?? detectKindFromHeaders(matrix) ?? "members";
    if (kind === "members") empty.members = memberRowsFromMatrix(matrix);
    if (kind === "meetings") empty.meetings = meetingRowsFromMatrix(matrix);
    if (kind === "commitments") {
      empty.commitments = commitmentRowsFromMatrix(matrix);
    }
    if (kind === "trainings") empty.trainings = trainingRowsFromMatrix(matrix);
    empty.activeKind = kind;
    return empty;
  }

  if (preferredKind && empty[preferredKind].length > 0) {
    empty.activeKind = preferredKind;
  } else if (empty.members.length > 0) {
    empty.activeKind = "members";
  } else if (empty.meetings.length > 0) {
    empty.activeKind = "meetings";
  } else if (empty.commitments.length > 0) {
    empty.activeKind = "commitments";
  } else {
    empty.activeKind = "trainings";
  }

  return empty;
}

export function downloadCopasstWorkbook(input: {
  members: readonly SstCopasstMemberView[];
  meetings: readonly SstCopasstMeeting[];
  commitments: readonly SstCopasstCommitmentView[];
  trainings: readonly SstCopasstTraining[];
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
    XLSX.utils.json_to_sheet(buildCommitmentExportRows(input.commitments)),
    "Compromisos",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet(buildTrainingExportRows(input.trainings)),
    "Capacitaciones",
  );
  const buffer = XLSX.write(book, {
    bookType: "xlsx",
    type: "array",
  }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    input.fileName.endsWith(".xlsx")
      ? input.fileName
      : `${input.fileName}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}

export function downloadCopasstTemplate(
  fileName = "plantilla-copasst-sst.xlsx",
): void {
  const sheets = buildCopasstTemplateSheets();
  const book = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(
      book,
      XLSX.utils.json_to_sheet(rows),
      name,
    );
  }
  const buffer = XLSX.write(book, {
    bookType: "xlsx",
    type: "array",
  }) as ArrayBuffer;
  downloadBinaryFile(
    buffer,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
