import "server-only";

import PDFDocument from "pdfkit";
import type { AttendanceResponseExportRow } from "@/lib/attendance";
import { drawCompanyLogosHeader, loadCompanyLogoImages, type PdfLogoImage } from "@/lib/attendance/pdf-logos";

const SIGNATURE_COL_WIDTH = 185;
const COLUMN_GAP = 12;
const SIGNATURE_MAX_HEIGHT = 62;
const RECORD_PADDING = 8;

type TextLine = {
  text: string;
  bold?: boolean;
  size?: number;
  color?: string;
  spacing?: number;
};

export async function responsesToPdf(
  rows: readonly AttendanceResponseExportRow[],
  fieldLabels: Readonly<Record<string, string>> = {},
): Promise<Buffer> {
  const customKeys = collectCustomKeys(rows);
  const logos = await loadCompanyLogoImages();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 40,
      info: {
        Title: "Respuestas de asistencia",
        Author: "Campus SST",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on("error", reject);
    doc.on("pageAdded", () => {
      drawPageHeader(doc, logos);
    });

    drawPageHeader(doc, logos);

    const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const generatedAt = new Date().toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    doc.font("Helvetica-Bold").fontSize(16).fillColor("#0d1c2e");
    doc.text("Respuestas de asistencia", { width: contentWidth });
    doc.moveDown(0.2);
    doc.font("Helvetica").fontSize(10).fillColor("#5a6a7a");
    doc.text(`${rows.length} registro${rows.length === 1 ? "" : "s"} · Generado ${generatedAt}`, {
      width: contentWidth,
    });
    doc.moveDown(0.7);

    rows.forEach((row, index) => {
      drawRecordRow(doc, row, index, customKeys, fieldLabels, contentWidth);
    });

    doc.end();
  });
}

function drawRecordRow(
  doc: PDFKit.PDFDocument,
  row: AttendanceResponseExportRow,
  index: number,
  customKeys: readonly string[],
  fieldLabels: Readonly<Record<string, string>>,
  contentWidth: number,
): void {
  const marginLeft = doc.page.margins.left;
  const leftWidth = contentWidth - SIGNATURE_COL_WIDTH - COLUMN_GAP;
  const signatureX = marginLeft + leftWidth + COLUMN_GAP;
  const lines = buildLeftColumnLines(row, index, customKeys, fieldLabels);
  const signatureBuffer = dataUrlToBuffer(row.signatureData);
  const leftHeight = measureTextBlockHeight(doc, lines, leftWidth - RECORD_PADDING * 2);
  const signatureBlockHeight = signatureBuffer ? SIGNATURE_MAX_HEIGHT + 18 : 28;
  const recordHeight = Math.max(leftHeight + RECORD_PADDING * 2, signatureBlockHeight + RECORD_PADDING);

  ensureSpace(doc, recordHeight + 10);
  const startY = doc.y;

  doc
    .roundedRect(marginLeft, startY, contentWidth, recordHeight, 5)
    .fillAndStroke("#f8fafc", "#dde4ec");

  doc
    .moveTo(signatureX - COLUMN_GAP / 2, startY + 6)
    .lineTo(signatureX - COLUMN_GAP / 2, startY + recordHeight - 6)
    .strokeColor("#dde4ec")
    .lineWidth(0.75)
    .stroke();

  let textY = startY + RECORD_PADDING;
  for (const line of lines) {
    doc
      .font(line.bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(line.size ?? 9)
      .fillColor(line.color ?? "#3d4f5f");
    doc.text(line.text, marginLeft + RECORD_PADDING, textY, {
      width: leftWidth - RECORD_PADDING * 2,
      lineBreak: true,
    });
    textY = doc.y + (line.spacing ?? 3);
  }

  doc.font("Helvetica-Bold").fontSize(8).fillColor("#5a6a7a");
  doc.text("Firma", signatureX, startY + RECORD_PADDING, {
    width: SIGNATURE_COL_WIDTH,
    align: "center",
    lineBreak: false,
  });

  const signatureY = startY + RECORD_PADDING + 12;
  if (signatureBuffer) {
    try {
      doc.image(signatureBuffer, signatureX + 8, signatureY, {
        fit: [SIGNATURE_COL_WIDTH - 16, SIGNATURE_MAX_HEIGHT],
      });
    } catch {
      doc.font("Helvetica").fontSize(8).fillColor("#8a3a3a");
      doc.text("No disponible", signatureX, signatureY + 20, {
        width: SIGNATURE_COL_WIDTH,
        align: "center",
        lineBreak: false,
      });
    }
  } else if (row.signatureData) {
    doc.font("Helvetica").fontSize(8).fillColor("#8a3a3a");
    doc.text("Formato no compatible", signatureX, signatureY + 20, {
      width: SIGNATURE_COL_WIDTH,
      align: "center",
      lineBreak: false,
    });
  } else {
    doc.font("Helvetica").fontSize(8).fillColor("#8a9aaa");
    doc.text("Sin firma", signatureX, signatureY + 22, {
      width: SIGNATURE_COL_WIDTH,
      align: "center",
      lineBreak: false,
    });
  }

  doc.y = startY + recordHeight + 8;
}

function buildLeftColumnLines(
  row: AttendanceResponseExportRow,
  index: number,
  customKeys: readonly string[],
  fieldLabels: Readonly<Record<string, string>>,
): TextLine[] {
  const lines: TextLine[] = [
    {
      text: `${index + 1}. ${row.firstName} ${row.lastName}`.trim(),
      bold: true,
      size: 11,
      color: "#0d1c2e",
      spacing: 4,
    },
    {
      text: `Formulario: ${row.formTitle || "—"}`,
      spacing: 2,
    },
    {
      text: [
        `Cédula: ${row.cedula || "—"}`,
        `Cargo: ${row.jobTitle || "—"}`,
        `Empresa: ${row.company || "—"}`,
      ].join("   ·   "),
      spacing: 2,
    },
    {
      text: `Tema visto: ${row.topicSelected || "—"}`,
      spacing: 2,
    },
    {
      text: [
        `Enviado: ${row.submittedAtLabel || "—"}`,
        `Calidad: ${row.qualityRating === null ? "—" : `${row.qualityRating}/5`}`,
        row.userEmail ? `Email: ${row.userEmail}` : null,
      ]
        .filter(Boolean)
        .join("   ·   "),
      spacing: 2,
    },
  ];

  if (row.qualityComment.trim().length > 0) {
    lines.push({
      text: `Comentario: ${row.qualityComment}`,
      spacing: 2,
    });
  }

  for (const key of customKeys) {
    const value = (row.customAnswers[key] ?? "").trim();
    if (value.length === 0) {
      continue;
    }
    const label = fieldLabels[key] ?? key;
    lines.push({
      text: `${label}: ${value}`,
      spacing: 2,
    });
  }

  return lines;
}

function measureTextBlockHeight(
  doc: PDFKit.PDFDocument,
  lines: readonly TextLine[],
  width: number,
): number {
  let height = 0;
  for (const line of lines) {
    doc.font(line.bold ? "Helvetica-Bold" : "Helvetica").fontSize(line.size ?? 9);
    height += doc.heightOfString(line.text, { width }) + (line.spacing ?? 3);
  }
  return height;
}

function drawPageHeader(doc: PDFKit.PDFDocument, logos: readonly PdfLogoImage[]): void {
  drawCompanyLogosHeader(doc, logos);
}

function collectCustomKeys(rows: readonly AttendanceResponseExportRow[]): string[] {
  const customKeys = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row.customAnswers)) {
      customKeys.add(key);
    }
  }
  return [...customKeys];
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number): void {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) {
    doc.addPage();
  }
}

function dataUrlToBuffer(dataUrl: string | null): Buffer | null {
  if (!dataUrl) {
    return null;
  }
  const trimmed = dataUrl.trim();
  const match = /^data:image\/(png|jpe?g);base64,(.+)$/i.exec(trimmed);
  if (!match?.[2]) {
    return null;
  }
  try {
    return Buffer.from(match[2], "base64");
  } catch {
    return null;
  }
}
