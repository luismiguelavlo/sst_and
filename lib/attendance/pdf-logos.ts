import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { COMPANY_LOGOS } from "@/lib/company-logos";

const LOGO_HEIGHT_PX = 56;

export type PdfLogoImage = {
  buffer: Buffer;
  width: number;
  height: number;
  alt: string;
};

export async function loadCompanyLogoImages(): Promise<PdfLogoImage[]> {
  const publicDir = path.join(process.cwd(), "public");
  const images = await Promise.all(
    COMPANY_LOGOS.map(async (logo) => {
      const svgPath = path.join(publicDir, logo.file);
      const svgBuffer = await readFile(svgPath);
      const pngBuffer = await sharp(svgBuffer)
        .resize({ height: LOGO_HEIGHT_PX, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      const metadata = await sharp(pngBuffer).metadata();
      return {
        buffer: pngBuffer,
        width: metadata.width ?? LOGO_HEIGHT_PX,
        height: metadata.height ?? LOGO_HEIGHT_PX,
        alt: logo.alt,
      };
    }),
  );
  return images;
}

export function drawCompanyLogosHeader(
  doc: PDFKit.PDFDocument,
  logos: readonly PdfLogoImage[],
): number {
  const marginLeft = doc.page.margins.left;
  const marginRight = doc.page.margins.right;
  const pageWidth = doc.page.width - marginLeft - marginRight;
  const logoHeight = 36;
  const gap = 28;
  const totalLogoWidth = logos.reduce((sum, logo) => {
    const aspect = logo.width / logo.height;
    return sum + logoHeight * aspect;
  }, 0);
  const totalGap = gap * Math.max(0, logos.length - 1);
  let x = marginLeft + Math.max(0, (pageWidth - totalLogoWidth - totalGap) / 2);
  const y = doc.page.margins.top;

  for (const logo of logos) {
    const aspect = logo.width / logo.height;
    const logoWidth = logoHeight * aspect;
    doc.image(logo.buffer, x, y, {
      fit: [logoWidth, logoHeight],
    });
    x += logoWidth + gap;
  }

  const headerBottom = y + logoHeight + 14;
  doc.y = headerBottom;
  doc
    .moveTo(marginLeft, headerBottom - 6)
    .lineTo(marginLeft + pageWidth, headerBottom - 6)
    .strokeColor("#d8dee6")
    .lineWidth(0.5)
    .stroke();

  return headerBottom;
}
