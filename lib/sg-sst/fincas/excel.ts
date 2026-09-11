import {
  normalizeFarmCode,
  type SstFarmRecord,
} from "@/lib/sg-sst/fincas/types";

export const FARM_EXCEL_MAX_ROWS = 500;

export type FarmExcelImportRow = {
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
  ok: boolean;
  action?: "created" | "updated";
  error?: string;
};

const HEADER_MAP: Record<keyof FarmExcelImportRow, string[]> = {
  name: ["nombre", "name", "finca", "predio"],
  code: ["codigo", "código", "code"],
  company: ["empresa", "razon_social", "razón_social", "company"],
  municipality: ["municipio", "municipality", "ciudad", "lugar"],
  address: ["direccion", "dirección", "address", "ubicacion", "ubicación"],
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

export function farmRowsFromMatrix(matrix: string[][]): FarmExcelImportRow[] {
  if (matrix.length < 2) return [];
  const headers = matrix[0]!.map(normalizeHeader);
  const indexOf = (keys: string[]) =>
    headers.findIndex((h) => keys.includes(h));

  const nameIdx = indexOf(HEADER_MAP.name);
  const codeIdx = indexOf(HEADER_MAP.code);
  if (nameIdx < 0 || codeIdx < 0) {
    throw new Error("Faltan columnas obligatorias: nombre y código.");
  }

  const companyIdx = indexOf(HEADER_MAP.company);
  const municipalityIdx = indexOf(HEADER_MAP.municipality);
  const addressIdx = indexOf(HEADER_MAP.address);
  const observationsIdx = indexOf(HEADER_MAP.observations);
  const activeIdx = indexOf(HEADER_MAP.active);

  const rows: FarmExcelImportRow[] = [];
  for (let i = 1; i < matrix.length; i += 1) {
    const line = matrix[i] ?? [];
    const name = String(line[nameIdx] ?? "").trim();
    const code = normalizeFarmCode(String(line[codeIdx] ?? ""));
    if (!name && !code) continue;
    rows.push({
      name,
      code,
      company: companyIdx >= 0 ? String(line[companyIdx] ?? "").trim() : "",
      municipality:
        municipalityIdx >= 0 ? String(line[municipalityIdx] ?? "").trim() : "",
      address: addressIdx >= 0 ? String(line[addressIdx] ?? "").trim() : "",
      observations:
        observationsIdx >= 0 ? String(line[observationsIdx] ?? "").trim() : "",
      active: activeIdx >= 0 ? parseActive(String(line[activeIdx] ?? "")) : true,
    });
  }
  return rows;
}

export function buildFarmExportRows(farms: readonly SstFarmRecord[]) {
  return farms.map((farm) => ({
    codigo: farm.code,
    nombre: farm.name,
    empresa: farm.company,
    municipio: farm.municipality,
    direccion: farm.address,
    activo: farm.active ? "si" : "no",
    trabajadores: farm.workersCount,
    registros_cumplimiento: farm.recordsCount,
    observaciones: farm.observations,
  }));
}

export function buildFarmTemplateRows() {
  return [
    {
      codigo: "ESP",
      nombre: "Finca La Esperanza",
      empresa: "Grupo Manzanares S.A.S.",
      municipio: "Santa Rosa de Cabal",
      direccion: "Vereda El Rosario",
      activo: "si",
      observaciones: "Predio principal",
    },
  ];
}
