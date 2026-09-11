import {
  DEFAULT_SG_DOC_COMPANY,
  emptyDocumentDraft,
  parseDocStatusLabel,
  parseDocTypeLabel,
  parseYesNo,
  SG_DOC_STATUS_LABELS,
  SG_DOC_TYPE_LABELS,
  type SstSgDocumentDraft,
  type SstSgDocumentView,
} from "@/lib/sg-sst/documentos/types";

export const DOCUMENT_EXCEL_MAX_ROWS = 500;

export type DocumentExcelImportRow = {
  rowNumber: number;
  draft: SstSgDocumentDraft;
  code: string;
};

export type DocumentExcelImportResultRow = {
  rowNumber: number;
  code: string;
  title: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  code: ["codigo", "código", "code", "id_documento", "folio"],
  title: ["titulo", "título", "documento", "nombre", "title"],
  docType: ["tipo", "tipo_documento", "doc_type", "tipologia", "tipología"],
  company: ["empresa", "company", "razon_social", "razón_social"],
  responsibleName: ["responsable", "responsible", "responsable_sst"],
  elaboratedAt: [
    "fecha_elaboracion",
    "fecha_elaboración",
    "elaboracion",
    "elaboración",
    "elaborated_at",
  ],
  lastReviewedAt: [
    "fecha_revision",
    "fecha_revisión",
    "ultima_revision",
    "última_revisión",
    "last_reviewed_at",
  ],
  nextReviewAt: [
    "proxima_revision",
    "próxima_revisión",
    "next_review_at",
    "vencimiento",
    "proxima",
  ],
  hasReviewCycle: [
    "ciclo_revision",
    "ciclo_revisión",
    "has_review_cycle",
    "con_ciclo",
    "alerta_revision",
  ],
  versionLabel: ["version", "versión", "version_label", "ver"],
  status: ["estado", "status", "estado_documento"],
  fileUrl: ["url", "file_url", "evidencia_url", "enlace", "documento_url"],
  fileName: ["archivo", "file_name", "nombre_archivo", "evidencia"],
  observations: ["observaciones", "notas", "observations"],
};

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function cellValue(row: string[], index: number | undefined): string {
  if (index === undefined) return "";
  return (row[index] ?? "").toString().trim();
}

function excelDateToIso(raw: string): string {
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }
  return raw;
}

function mapHeaders(
  headerRow: string[],
): Partial<Record<keyof typeof HEADER_ALIASES, number>> {
  const map: Partial<Record<keyof typeof HEADER_ALIASES, number>> = {};
  headerRow.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    for (const [key, aliases] of Object.entries(HEADER_ALIASES) as [
      keyof typeof HEADER_ALIASES,
      readonly string[],
    ][]) {
      if (aliases.some((alias) => normalizeHeader(alias) === normalized)) {
        map[key] = index;
      }
    }
  });
  return map;
}

export function documentRowsFromMatrix(matrix: string[][]): DocumentExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0]);
  if (headerMap.code === undefined && headerMap.title === undefined) {
    throw new Error("Falta una columna de identidad: codigo o titulo.");
  }

  const defaults = emptyDocumentDraft();
  const rows: DocumentExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const code = cellValue(raw, headerMap.code);
    const title = cellValue(raw, headerMap.title);
    if (!code && !title) continue;

    const docType =
      parseDocTypeLabel(cellValue(raw, headerMap.docType)) ?? defaults.docType;
    const status =
      parseDocStatusLabel(cellValue(raw, headerMap.status)) ?? defaults.status;

    const hasReviewCycle = parseYesNo(
      cellValue(raw, headerMap.hasReviewCycle),
      defaults.hasReviewCycle,
    );
    const nextReviewAt = excelDateToIso(cellValue(raw, headerMap.nextReviewAt));

    const draft: SstSgDocumentDraft = {
      code,
      title,
      docType,
      company: cellValue(raw, headerMap.company) || DEFAULT_SG_DOC_COMPANY,
      responsibleName: cellValue(raw, headerMap.responsibleName),
      elaboratedAt: excelDateToIso(cellValue(raw, headerMap.elaboratedAt)),
      lastReviewedAt: excelDateToIso(cellValue(raw, headerMap.lastReviewedAt)),
      nextReviewAt: hasReviewCycle ? nextReviewAt : "",
      hasReviewCycle,
      versionLabel: cellValue(raw, headerMap.versionLabel) || defaults.versionLabel,
      status,
      fileUrl: cellValue(raw, headerMap.fileUrl),
      fileName: cellValue(raw, headerMap.fileName),
      observations: cellValue(raw, headerMap.observations),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      code,
    });
  }
  return rows;
}

export function buildDocumentExportRows(
  docs: readonly SstSgDocumentView[],
): Record<string, string | number>[] {
  return docs.map((doc) => ({
    codigo: doc.code,
    titulo: doc.title,
    tipo: SG_DOC_TYPE_LABELS[doc.docType],
    empresa: doc.company,
    responsable: doc.responsibleName,
    fecha_elaboracion: doc.elaboratedAt ?? "",
    ultima_revision: doc.lastReviewedAt ?? "",
    proxima_revision: doc.nextReviewAt ?? "",
    ciclo_revision: doc.hasReviewCycle ? "Sí" : "No",
    version: doc.versionLabel,
    estado: SG_DOC_STATUS_LABELS[doc.status],
    archivo: doc.fileName,
    url: doc.fileUrl,
    observaciones: doc.observations,
    semaforo: doc.semaphoreLabel,
    dias_restantes: doc.daysRemaining ?? "",
  }));
}

export function buildDocumentTemplateRows(): Record<string, string | number>[] {
  return [
    {
      codigo: "POL-SST-001",
      titulo: "Política de Seguridad y Salud en el Trabajo",
      tipo: "Política SST",
      empresa: DEFAULT_SG_DOC_COMPANY,
      responsable: "Responsable SG-SST",
      fecha_elaboracion: "2025-01-15",
      ultima_revision: "2026-01-15",
      proxima_revision: "2027-01-15",
      ciclo_revision: "Sí",
      version: "3.0",
      estado: "Vigente",
      archivo: "politica-sst-v3.pdf",
      url: "",
      observaciones: "Aprobada por gerencia.",
    },
    {
      codigo: "OBJ-SST-001",
      titulo: "Objetivos del SG-SST",
      tipo: "Objetivos",
      empresa: DEFAULT_SG_DOC_COMPANY,
      responsable: "Responsable SG-SST",
      fecha_elaboracion: "2025-02-01",
      ultima_revision: "2026-02-01",
      proxima_revision: "",
      ciclo_revision: "No",
      version: "1.0",
      estado: "Vigente",
      archivo: "",
      url: "",
      observaciones: "Sin vencimiento automático; revisión por ciclo de mejora.",
    },
  ];
}
