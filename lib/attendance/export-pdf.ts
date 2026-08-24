import "server-only";

import PDFDocument from "pdfkit";
import type { AttendanceResponseExportRow } from "@/lib/attendance";

export async function responsesToPdf(
  rows: readonly AttendanceResponseExportRow[],
  fieldLabels: Readonly<Record<string, string>> = {},
): Promise<Buffer> {
  const customKeys = collectCustomKeys(rows);

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
    doc.moveDown(0.8);

    rows.forEach((row, index) => {
      ensureSpace(doc, 72);

      doc.font("Helvetica-Bold").fontSize(11).fillColor("#0d1c2e");
      doc.text(`${index + 1}. ${row.firstName} ${row.lastName}`.trim(), {
        width: contentWidth,
      });

      doc.font("Helvetica").fontSize(9).fillColor("#3d4f5f");
      doc.text(`Formulario: ${row.formTitle || "—"}`, { width: contentWidth });
      doc.text(
        [
          `Cédula: ${row.cedula || "—"}`,
          `Cargo: ${row.jobTitle || "—"}`,
          `Empresa: ${row.company || "—"}`,
        ].join("   ·   "),
        { width: contentWidth },
      );
      doc.text(`Tema visto: ${row.topicSelected || "—"}`, { width: contentWidth });
      doc.text(
        [
          `Enviado: ${row.submittedAtLabel || "—"}`,
          `Calidad: ${row.qualityRating === null ? "—" : `${row.qualityRating}/5`}`,
          row.userEmail ? `Email: ${row.userEmail}` : null,
        ]
          .filter(Boolean)
          .join("   ·   "),
        { width: contentWidth },
      );

      if (row.qualityComment.trim().length > 0) {
        doc.text(`Comentario: ${row.qualityComment}`, { width: contentWidth });
      }

      for (const key of customKeys) {
        const value = (row.customAnswers[key] ?? "").trim();
        if (value.length === 0) {
          continue;
        }
        const label = fieldLabels[key] ?? key;
        doc.text(`${label}: ${value}`, { width: contentWidth });
      }

      doc.moveDown(0.35);
      const lineY = doc.y;
      doc
        .moveTo(doc.page.margins.left, lineY)
        .lineTo(doc.page.margins.left + contentWidth, lineY)
        .strokeColor("#d8dee6")
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(0.55);
    });

    doc.end();
  });
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
