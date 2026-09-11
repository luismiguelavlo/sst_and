import {
  normalizeFarmCode,
  type SstFarmRecord,
} from "@/lib/sg-sst/fincas/types";

export const FARM_EXCEL_MAX_ROWS = 2000;
export const FARM_IMPORT_CHUNK_SIZE = 25;

export type FarmExcelImportRow = {
  rowNumber: number;
  name: string;
  code: string;
  company: string;
  municipality: string;
  address: string;
  observations: string;
  active: boolean;
};

export type FarmExcelImportResultRow = {
  row: number;
  code: string;
  name: string;
  ok: boolean;
  action?: "created" | "updated";
  error?: string;
};

const HEADER_ALIASES: Record<
  keyof Omit<FarmExcelImportRow, "rowNumber">,
  readonly string[]
> = {
  name: [
    "nombre",
    "name",
    "centro_de_trabajo",
    "centro_trabajo",
    "finca",
    "predio",
    "sede",
  ],
  code: ["codigo", "code", "cod", "id_centro", "id"],
  company: ["empresa", "razon_social", "company"],
  municipality: ["municipio", "municipality", "ciudad", "lugar"],
  address: ["direccion", "address", "ubicacion"],
  observations: ["observaciones", "notes", "obs"],
  active: ["activo", "active", "estado"],
};

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

function parseActive(value: string): boolean {
  const v = value.trim().toLowerCase();
  if (!v) return true;
  if (["0", "no", "false", "inactivo", "inactive", "n"].includes(v)) return false;
  return true;
}

function cellToString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "number" && Number.isFinite(value)) {
    // Evitar 1e+21 / decimales en códigos numéricos de Excel
    if (Number.isInteger(value) || Math.abs(value) >= 1e6) {
      return String(Math.round(value));
    }
    return String(value);
  }
  return String(value).trim();
}

/**
 * Mapeo exclusivo: cada columna alimenta como máximo un campo;
 * la primera columna que coincida gana.
 */
function mapHeaders(headers: readonly string[]): Partial<
  Record<keyof typeof HEADER_ALIASES, number>
> {
  const map: Partial<Record<keyof typeof HEADER_ALIASES, number>> = {};
  const usedColumns = new Set<number>();

  for (const [field, aliases] of Object.entries(HEADER_ALIASES) as [
    keyof typeof HEADER_ALIASES,
    readonly string[],
  ][]) {
    const normalizedAliases = aliases.map(normalizeHeader);
    const index = headers.findIndex(
      (header, i) =>
        !usedColumns.has(i) && normalizedAliases.includes(normalizeHeader(header)),
    );
    if (index >= 0) {
      map[field] = index;
      usedColumns.add(index);
    }
  }
  return map;
}

export function farmRowsFromMatrix(
  matrix: readonly (readonly unknown[])[],
): FarmExcelImportRow[] {
  if (matrix.length < 2) return [];
  const headerRow = (matrix[0] ?? []).map((h) => cellToString(h));
  const headerMap = mapHeaders(headerRow);

  if (headerMap.name === undefined && headerMap.code === undefined) {
    throw new Error(
      "El Excel debe incluir al menos una columna de nombre (centro_de_trabajo) o codigo.",
    );
  }

  const rows: FarmExcelImportRow[] = [];
  const seenCodes = new Set<string>();

  for (let i = 1; i < matrix.length; i += 1) {
    const line = matrix[i] ?? [];
    const name =
      headerMap.name !== undefined ? cellToString(line[headerMap.name]) : "";
    const code =
      headerMap.code !== undefined
        ? normalizeFarmCode(cellToString(line[headerMap.code]))
        : "";
    if (!name && !code) continue;

    // Si el código se repite en el mismo archivo, nos quedamos con la última fila
    // pero no descartamos silenciosamente el resto del archivo.
    if (code && seenCodes.has(code)) {
      const existingIdx = rows.findIndex((r) => r.code === code);
      if (existingIdx >= 0) rows.splice(existingIdx, 1);
    }
    if (code) seenCodes.add(code);

    rows.push({
      rowNumber: i + 1,
      name,
      code,
      company:
        headerMap.company !== undefined
          ? cellToString(line[headerMap.company])
          : "",
      municipality:
        headerMap.municipality !== undefined
          ? cellToString(line[headerMap.municipality])
          : "",
      address:
        headerMap.address !== undefined
          ? cellToString(line[headerMap.address])
          : "",
      observations:
        headerMap.observations !== undefined
          ? cellToString(line[headerMap.observations])
          : "",
      active:
        headerMap.active !== undefined
          ? parseActive(cellToString(line[headerMap.active]))
          : true,
    });
  }
  return rows;
}

export function buildFarmExportRows(farms: readonly SstFarmRecord[]) {
  return farms.map((farm) => ({
    codigo: farm.code,
    nombre: farm.name,
    centro_de_trabajo: farm.name,
    empresa: farm.company,
    municipio: farm.municipality,
    direccion: farm.address,
    activo: farm.active ? "si" : "no",
    observaciones: farm.observations,
  }));
}

export function buildFarmTemplateRows() {
  return [
    {
      codigo: "ESP",
      nombre: "Planta Principal",
      empresa: "Grupo Manzanares S.A.S.",
      municipio: "Santa Rosa de Cabal",
      direccion: "Vereda El Rosario",
      activo: "si",
      observaciones: "Ejemplo — reemplazar / agregar filas",
    },
    {
      codigo: "PAR",
      nombre: "Centro El Paraíso",
      empresa: "Grupo Manzanares S.A.S.",
      municipio: "Pereira",
      direccion: "",
      activo: "si",
      observaciones: "",
    },
  ];
}
