import {
  EPP_CATEGORY_LABELS,
  EPP_REASON_LABELS,
  emptyDeliveryDraft,
  parseEppCategoryLabel,
  parseEppReasonLabel,
  type EppCategory,
  type SstEppCatalogItem,
  type SstEppDeliveryDraft,
  type SstEppDeliveryView,
} from "@/lib/sg-sst/epp/types";
import { todayIsoDate } from "@/lib/sg-sst/draft-mode";

export const EPP_EXCEL_MAX_ROWS = 500;

export type EppExcelImportRow = {
  rowNumber: number;
  draft: SstEppDeliveryDraft;
  workerDocumentOrCode: string;
  catalogCodeOrName: string;
  folio?: string;
};

export type EppExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  workerRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_epp"],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "id_trabajador",
    "worker_code",
    "identificacion",
  ],
  catalog: [
    "epp",
    "catalogo",
    "catálogo",
    "codigo_epp",
    "código_epp",
    "catalog_code",
    "nombre_epp",
    "item",
  ],
  quantity: ["cantidad", "quantity", "qty"],
  sizeLabel: ["talla", "size", "talla_epp"],
  deliveryDate: ["fecha_entrega", "fecha", "delivery_date", "entrega"],
  usefulLifeDays: [
    "vida_util",
    "vida_útil",
    "vida_util_dias",
    "useful_life_days",
    "dias_vida_util",
  ],
  nextReplenishmentDate: [
    "proxima_reposicion",
    "próxima_reposición",
    "next_replenishment",
    "reposicion",
  ],
  reason: ["motivo", "razon", "razón", "reason", "tipo_entrega"],
  responsibleName: ["responsable", "responsible_name", "entregado_por"],
  observations: ["observaciones", "notas", "observations"],
  evidenceUrl: ["documento", "evidencia", "url_evidencia", "evidence_url", "pdf"],
  evidenceName: ["nombre_evidencia", "archivo", "evidence_name"],
  unitCost: ["costo", "costo_unitario", "unit_cost", "valor"],
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

export function eppDeliveryRowsFromMatrix(matrix: string[][]): EppExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0]);
  if (headerMap.worker === undefined && headerMap.catalog === undefined) {
    throw new Error(
      "Falta al menos una columna usable: trabajador o epp.",
    );
  }

  const defaults = emptyDeliveryDraft();
  const rows: EppExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    const catalogRef = cellValue(raw, headerMap.catalog);
    const deliveryDate =
      excelDateToIso(cellValue(raw, headerMap.deliveryDate)) || todayIsoDate();
    if (!workerRef && !catalogRef) continue;

    const reasonRaw = cellValue(raw, headerMap.reason);
    const reason =
      (reasonRaw ? parseEppReasonLabel(reasonRaw) : null) ?? defaults.reason;

    const quantity = Number(cellValue(raw, headerMap.quantity) || "1");
    const usefulLifeDays = Number(
      cellValue(raw, headerMap.usefulLifeDays) || "180",
    );
    const unitCost = Number(cellValue(raw, headerMap.unitCost) || "0");

    const draft: SstEppDeliveryDraft = {
      workerId: "",
      catalogItemId: "",
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      sizeLabel: cellValue(raw, headerMap.sizeLabel),
      deliveryDate,
      usefulLifeDays:
        Number.isFinite(usefulLifeDays) && usefulLifeDays > 0
          ? usefulLifeDays
          : 180,
      nextReplenishmentDate:
        excelDateToIso(cellValue(raw, headerMap.nextReplenishmentDate)) || null,
      reason,
      responsibleName: cellValue(raw, headerMap.responsibleName),
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
      observations: cellValue(raw, headerMap.observations),
      unitCostCop: Number.isFinite(unitCost) ? unitCost : 0,
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      workerDocumentOrCode: workerRef,
      catalogCodeOrName: catalogRef,
      folio: cellValue(raw, headerMap.folio) || undefined,
    });
  }
  return rows;
}

export function buildEppDeliveryExportRows(
  deliveries: readonly SstEppDeliveryView[],
): Record<string, string | number>[] {
  return deliveries.map((item) => ({
    folio: item.folio,
    trabajador: item.workerName,
    documento: item.workerDocument,
    id_trabajador: item.workerCode,
    empresa: item.companySnapshot,
    cargo: item.jobTitleSnapshot,
    centro_trabajo: item.workCenterSnapshot,
    finca: item.farmName ?? "",
    codigo_epp: item.catalogCode,
    epp: item.catalogName,
    categoria: EPP_CATEGORY_LABELS[item.catalogCategory],
    cantidad: item.quantity,
    talla: item.sizeLabel,
    fecha_entrega: item.deliveryDate,
    vida_util_dias: item.usefulLifeDays,
    proxima_reposicion: item.nextReplenishmentDate ?? "",
    motivo: EPP_REASON_LABELS[item.reason],
    responsable: item.responsibleName,
    observaciones: item.observations,
    evidencia_url: item.evidenceUrl,
    evidencia_nombre: item.evidenceName,
    costo_unitario: item.unitCostCop,
    semaforo: item.semaphoreLabel,
    dias_restantes: item.daysRemaining ?? "",
  }));
}

export function buildEppDeliveryTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      documento: "1088294102",
      codigo_epp: "EPP-BOT-001",
      cantidad: 1,
      talla: "40",
      fecha_entrega: "2026-03-01",
      vida_util_dias: 180,
      proxima_reposicion: "",
      motivo: "Dotación",
      responsable: "Almacenista Finca Norte",
      observaciones: "Entrega según matriz de peligros.",
      evidencia_url: "",
      evidencia_nombre: "",
      costo_unitario: 85000,
    },
  ];
}

export function buildEppCatalogTemplateRows(
  catalog: readonly SstEppCatalogItem[] = [],
): Record<string, string | number>[] {
  if (catalog.length === 0) {
    return (Object.keys(EPP_CATEGORY_LABELS) as EppCategory[]).map(
      (category, index) => ({
        codigo: `EPP-NEW-${String(index + 1).padStart(3, "0")}`,
        categoria: EPP_CATEGORY_LABELS[category],
        nombre: EPP_CATEGORY_LABELS[category],
        vida_util_dias: 180,
        activo: "si",
      }),
    );
  }
  return catalog.map((item) => ({
    codigo: item.code,
    categoria: EPP_CATEGORY_LABELS[item.category],
    nombre: item.name,
    vida_util_dias: item.usefulLifeDays,
    activo: item.active ? "si" : "no",
  }));
}

export function parseCatalogCategoryFromExcel(raw: string): EppCategory | null {
  return parseEppCategoryLabel(raw);
}
