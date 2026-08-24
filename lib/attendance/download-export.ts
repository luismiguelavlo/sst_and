"use client";

export function downloadTextFile(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  triggerBlobDownload(blob, fileName);
}

export function downloadBase64File(
  base64: string,
  fileName: string,
  mimeType: string,
): void {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  const blob = new Blob([bytes], { type: mimeType });
  triggerBlobDownload(blob, fileName);
}

function triggerBlobDownload(blob: Blob, fileName: string): void {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(href);
}
