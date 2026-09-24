import {
  isChemicalStatus,
  isChemicalTrainingStatus,
  isChemicalUnit,
  type SstChemical,
  type SstChemicalDraft,
} from "@/lib/sg-sst/quimicos/types";

export const CHEMICAL_EXCEL_MAX_ROWS = 1000;
export const CHEMICAL_IMPORT_CHUNK_SIZE = 25;

export type ChemicalExcelImportRow = {
  rowNumber: number;
  draft: SstChemicalDraft;
  farmNameOrCode: string;
};

export type ChemicalExcelImportResultRow = {
  rowNumber: number;
  code: string;
  productName: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  code: ["codigo", "code", "id_quimico"],
  // Evitar alias genérico "nombre" (puede chocar con otras columnas).
  productName: ["producto", "product", "sustancia", "químico", "quimico", "nombre_producto"],
  farm: ["finca", "centro_de_trabajo", "farm", "predio", "sede"],
  area: ["area", "área", "zona", "ubicacion_area"],
  responsibleName: ["responsable", "responsible", "encargado"],
  safetySheetUrl: ["ficha_url", "url_ficha", "link_ficha", "safety_sheet_url"],
  safetySheetName: [
    "ficha_seguridad",
    "ficha",
    "msds",
    "hoja_seguridad",
    "safety_sheet",
  ],
  safetySheetUpdatedAt: [
    "fecha_actualizacion",
    "actualizacion_ficha",
    "fecha_ficha",
  ],
  requiredEpp: ["epp_requerido", "epp", "required_epp", "elementos_epp"],
  storageConditions: [
    "almacenamiento",
    "almacen",
    "storage",
    "condiciones_almacenamiento",
  ],
  quantity: ["cantidad", "quantity", "qty", "stock"],
  unit: ["unidad", "unit", "uom"],
  lastInspectionAt: ["ultima_inspeccion", "last_inspection"],
  nextInspectionAt: [
    "proxima_inspeccion",
    "next_inspection",
    "vencimiento_inspeccion",
    "inspeccion",
  ],
  inspectionNotes: ["notas_inspeccion", "obs_inspeccion"],
  trainingStatus: ["capacitacion", "estado_capacitacion", "training_status"],
  lastTrainingAt: ["fecha_capacitacion", "ultima_capacitacion"],
  trainingNotes: ["notas_capacitacion", "obs_capacitacion"],
  status: ["estado", "status"],
  observations: ["observaciones", "notas", "observations"],
};

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "_");
}

function mapHeaders(headers: readonly string[]): Partial<Record<string, number>> {
  const map: Partial<Record<string, number>> = {};
  const used = new Set<number>();
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    const normalizedAliases = aliases.map(normalizeHeader);
    const index = headers.findIndex(
      (header, i) =>
        !used.has(i) && normalizedAliases.includes(normalizeHeader(header)),
    );
    if (index >= 0) {
      map[field] = index;
      used.add(index);
    }
  }
  return map;
}

function cell(row: readonly string[], index: number | undefined): string {
  if (index === undefined) return "";
  return (row[index] ?? "").trim();
}

function parseDate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const iso = trimmed.match(/^(\d{4}-\d{2}-\d{2})(?:[T\s].*)?$/);
  if (iso) return iso[1] ?? "";
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const serial = Number(trimmed);
    if (Number.isFinite(serial) && serial > 20000) {
      const epoch = new Date(Date.UTC(1899, 11, 30));
      epoch.setUTCDate(epoch.getUTCDate() + Math.floor(serial));
      return epoch.toISOString().slice(0, 10);
    }
  }
  const match = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) {
    const [, d, m, y] = match;
    return `${y}-${m!.padStart(2, "0")}-${d!.padStart(2, "0")}`;
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return "";
}

function parseQuantity(value: string): number {
  const n = Number(String(value).replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parseUnit(value: string) {
  const v = value.trim();
  if (isChemicalUnit(v)) return v;
  const lower = v.toLowerCase();
  if (["litro", "litros", "lt"].includes(lower)) return "L" as const;
  if (["ml", "mililitro", "mililitros"].includes(lower)) return "mL" as const;
  if (["kilo", "kilos", "kilogramo", "kilogramos"].includes(lower)) return "kg" as const;
  if (["gramo", "gramos"].includes(lower)) return "g" as const;
  if (["galon", "galones", "gallon"].includes(lower)) return "gal" as const;
  if (["unidad", "unidades", "u"].includes(lower)) return "und" as const;
  return "L" as const;
}

function parseStatus(value: string) {
  const v = value.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  if (!v) return "activo" as const;
  if (["agotado", "sin_stock", "0"].includes(v)) return "agotado" as const;
  if (["restringido", "restriccion"].includes(v)) return "restringido" as const;
  if (["descontinuado", "baja"].includes(v)) return "descontinuado" as const;
  if (["vencido", "caducado"].includes(v)) return "vencido" as const;
  if (isChemicalStatus(v)) return v;
  return "activo" as const;
}

function parseTraining(value: string) {
  const v = value.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  if (!v) return "pendiente" as const;
  if (["vigente", "ok", "si", "yes"].includes(v)) return "vigente" as const;
  if (["vencida", "vencido"].includes(v)) return "vencida" as const;
  if (["no_aplica", "na", "n/a"].includes(v)) return "no_aplica" as const;
  if (isChemicalTrainingStatus(v)) return v;
  return "pendiente" as const;
}

export function chemicalRowsFromMatrix(
  matrix: readonly (readonly string[])[],
): ChemicalExcelImportRow[] {
  if (matrix.length === 0) return [];
  const headerMap = mapHeaders(matrix[0] ?? []);
  if (headerMap.productName === undefined) {
    throw new Error("El Excel debe incluir la columna producto (o nombre).");
  }

  const rows: ChemicalExcelImportRow[] = [];
  const seenKeys = new Map<string, number>();

  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index] ?? [];
    const productName = cell(raw, headerMap.productName);
    if (!productName) continue;

    const farmNameOrCode = cell(raw, headerMap.farm);
    const dedupeKey = `${productName.trim().toLowerCase()}::${farmNameOrCode.trim().toLowerCase()}`;

    const draft: SstChemicalDraft = {
      code: cell(raw, headerMap.code) || undefined,
      productName,
      farmId: null,
      area: cell(raw, headerMap.area),
      responsibleName: cell(raw, headerMap.responsibleName),
      safetySheetUrl: cell(raw, headerMap.safetySheetUrl),
      safetySheetName: cell(raw, headerMap.safetySheetName),
      safetySheetUpdatedAt: parseDate(cell(raw, headerMap.safetySheetUpdatedAt)),
      requiredEpp: cell(raw, headerMap.requiredEpp),
      storageConditions: cell(raw, headerMap.storageConditions),
      quantity: parseQuantity(cell(raw, headerMap.quantity)),
      unit: parseUnit(cell(raw, headerMap.unit)),
      lastInspectionAt: parseDate(cell(raw, headerMap.lastInspectionAt)),
      nextInspectionAt: parseDate(cell(raw, headerMap.nextInspectionAt)),
      inspectionNotes: cell(raw, headerMap.inspectionNotes),
      trainingStatus: parseTraining(cell(raw, headerMap.trainingStatus)),
      lastTrainingAt: parseDate(cell(raw, headerMap.lastTrainingAt)),
      trainingNotes: cell(raw, headerMap.trainingNotes),
      status: parseStatus(cell(raw, headerMap.status)),
      observations: cell(raw, headerMap.observations),
    };

    const row: ChemicalExcelImportRow = {
      rowNumber: index + 1,
      draft,
      farmNameOrCode,
    };

    // Misma sustancia + mismo centro repetida en el Excel → última fila gana.
    const existingIdx = seenKeys.get(dedupeKey);
    if (existingIdx !== undefined) {
      rows[existingIdx] = row;
    } else {
      seenKeys.set(dedupeKey, rows.length);
      rows.push(row);
    }
  }
  return rows;
}

export function buildChemicalExportRows(
  items: readonly SstChemical[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    codigo: item.code,
    producto: item.productName,
    finca: item.farmName ?? "",
    area: item.area,
    responsable: item.responsibleName,
    ficha_seguridad: item.safetySheetName,
    ficha_url: item.safetySheetUrl,
    fecha_actualizacion: item.safetySheetUpdatedAt ?? "",
    epp_requerido: item.requiredEpp,
    almacenamiento: item.storageConditions,
    cantidad: item.quantity,
    unidad: item.unit,
    ultima_inspeccion: item.lastInspectionAt ?? "",
    proxima_inspeccion: item.nextInspectionAt ?? "",
    notas_inspeccion: item.inspectionNotes,
    capacitacion: item.trainingStatus,
    fecha_capacitacion: item.lastTrainingAt ?? "",
    notas_capacitacion: item.trainingNotes,
    estado: item.status,
    observaciones: item.observations,
  }));
}

export function buildChemicalTemplateRows(): Record<string, string | number>[] {
  return [
    {
      codigo: "QUI-2026-001",
      producto: "Glifosato 48%",
      finca: "Planta Principal",
      area: "Bodega agroquímicos",
      responsable: "Jefe de campo",
      ficha_seguridad: "MSDS-Glifosato.pdf",
      ficha_url: "",
      fecha_actualizacion: "2026-01-15",
      epp_requerido: "Guantes nitrilo, gafas, impermeable, respirador",
      almacenamiento: "Lugar fresco, ventilado, separado de alimentos",
      cantidad: 120,
      unidad: "L",
      ultima_inspeccion: "2026-03-01",
      proxima_inspeccion: "2026-06-01",
      notas_inspeccion: "",
      capacitacion: "vigente",
      fecha_capacitacion: "2025-11-20",
      notas_capacitacion: "",
      estado: "activo",
      observaciones: "Fila de ejemplo — reemplazar",
    },
  ];
}
