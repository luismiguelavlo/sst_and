import {
  RESTRICTION_KIND_LABELS,
  RESTRICTION_STATUS_LABELS,
  parseRestrictionKindLabel,
  parseRestrictionStatusLabel,
  type RestrictionManualStatus,
  type SstRestrictionDraft,
  type SstRestrictionView,
} from "@/lib/sg-sst/restricciones/types";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const RESTRICTION_EXCEL_MAX_ROWS = 500;

export type RestrictionExcelImportRow = {
  rowNumber: number;
  draft: SstRestrictionDraft;
  workerDocumentOrCode: string;
  folio?: string;
};

export type RestrictionExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  workerRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_rst"],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "id_trabajador",
    "worker_code",
    "identificacion",
  ],
  kind: ["tipo", "tipo_restriccion", "restriction_kind", "clase"],
  issuedAt: ["fecha_emision", "fecha_emisión", "emision", "issued_at"],
  startDate: ["fecha_inicio", "inicio", "start_date"],
  dueDate: ["fecha_vencimiento", "vencimiento", "due_date", "vence"],
  detail: [
    "detalle",
    "restriccion",
    "restricción",
    "recomendacion",
    "recomendación",
    "detail",
  ],
  issuer: ["emisor", "entidad", "issuer", "ips"],
  responsibleName: [
    "responsable",
    "responsable_implementacion",
    "responsable_implementación",
    "responsible_name",
  ],
  measureImplemented: [
    "medida",
    "medida_implementada",
    "measure_implemented",
    "adaptacion",
  ],
  implementedAt: [
    "fecha_implementacion",
    "fecha_implementación",
    "implementado",
    "implemented_at",
  ],
  status: ["estado", "status"],
  nextFollowUp: [
    "proximo_seguimiento",
    "próximo_seguimiento",
    "seguimiento",
    "next_follow_up",
  ],
  observations: ["observaciones", "notas", "observations"],
  evidenceUrl: ["documento", "evidencia", "url_evidencia", "evidence_url", "pdf"],
  evidenceName: ["nombre_evidencia", "archivo", "evidence_name"],
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
  if (!raw) return todayIsoDate();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }
  return todayIsoDate();
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

function toManualStatusFromParsed(
  raw: string,
): RestrictionManualStatus {
  const parsed = parseRestrictionStatusLabel(raw);
  if (parsed === "pendiente_implementacion" || parsed === "cerrada") {
    return parsed;
  }
  return "vigente";
}

export function restrictionRowsFromMatrix(
  matrix: string[][],
): RestrictionExcelImportRow[] {
  if (matrix.length < 2) return [];
  const headerMap = mapHeaders(matrix[0]);
  if (headerMap.worker === undefined) {
    throw new Error(
      "El Excel debe incluir al menos la columna trabajador / documento.",
    );
  }

  const rows: RestrictionExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    if (!workerRef) continue;

    const kind =
      parseRestrictionKindLabel(cellValue(raw, headerMap.kind)) ?? "restriccion";
    const issuedAt = excelDateToIso(cellValue(raw, headerMap.issuedAt));
    const startDate = excelDateToIso(cellValue(raw, headerMap.startDate));
    const detail = cellValue(raw, headerMap.detail) || "Sin detalle";
    const responsibleName =
      cellValue(raw, headerMap.responsibleName) || "Sin responsable";

    const dueDateRaw = cellValue(raw, headerMap.dueDate);
    const implementedAtRaw = cellValue(raw, headerMap.implementedAt);
    const nextFollowUpRaw = cellValue(raw, headerMap.nextFollowUp);

    const draft: SstRestrictionDraft = {
      workerId: "",
      restrictionKind: kind,
      issuedAt,
      startDate,
      dueDate: dueDateRaw ? excelDateToIso(dueDateRaw) : null,
      detail,
      issuer: cellValue(raw, headerMap.issuer),
      responsibleName,
      measureImplemented: cellValue(raw, headerMap.measureImplemented),
      implementedAt: implementedAtRaw ? excelDateToIso(implementedAtRaw) : null,
      status: toManualStatusFromParsed(cellValue(raw, headerMap.status)),
      nextFollowUp: nextFollowUpRaw ? excelDateToIso(nextFollowUpRaw) : null,
      observations: cellValue(raw, headerMap.observations),
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      workerDocumentOrCode: workerRef,
      folio: cellValue(raw, headerMap.folio) || undefined,
    });
  }
  return rows;
}

export function buildRestrictionExportRows(
  items: readonly SstRestrictionView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    trabajador: item.workerName,
    documento: item.workerDocument,
    id_trabajador: item.workerCode,
    empresa: item.companySnapshot,
    cargo: item.jobTitleSnapshot,
    finca: item.farmName ?? "",
    tipo: RESTRICTION_KIND_LABELS[item.restrictionKind],
    fecha_emision: item.issuedAt,
    fecha_inicio: item.startDate,
    fecha_vencimiento: item.dueDate ?? "",
    detalle: item.detail,
    emisor: item.issuer,
    responsable: item.responsibleName,
    medida_implementada: item.measureImplemented,
    fecha_implementacion: item.implementedAt ?? "",
    estado: RESTRICTION_STATUS_LABELS[item.effectiveStatus],
    proximo_seguimiento: item.nextFollowUp ?? "",
    observaciones: item.observations,
    evidencia_url: item.evidenceUrl,
    evidencia_nombre: item.evidenceName,
    semaforo: item.semaphoreLabel,
    dias_restantes: item.daysRemaining ?? "",
  }));
}

export function buildRestrictionTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      documento: "1088294102",
      tipo: "Restricción",
      fecha_emision: "2026-01-15",
      fecha_inicio: "2026-01-16",
      fecha_vencimiento: "2026-04-16",
      detalle: "No levantar cargas mayores a 10 kg. Alternar posturas cada 30 minutos.",
      emisor: "IPS Salud del Eje",
      responsable: "Líder de cuadrilla",
      medida_implementada: "",
      fecha_implementacion: "",
      estado: "Vigente",
      proximo_seguimiento: "2026-02-15",
      observaciones: "Seguimiento administrativo SG-SST. Sin datos clínicos.",
      evidencia_url: "",
      evidencia_nombre: "",
    },
  ];
}
