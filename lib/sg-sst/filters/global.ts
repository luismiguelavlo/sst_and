export type SgsstGlobalFilters = {
  year: number | "all";
  month: number | "all";
  company: string | "all";
  farmId: string | "all";
  /** Centro de trabajo (texto operativo) */
  workCenter: string | "all";
  area: string | "all";
  /** Alias funcional de finca / predio (= farmId en este sistema) */
  workerId: string | "all";
  status: string | "all";
};

export type SgsstGlobalFilterOptions = {
  years: number[];
  companies: string[];
  areas: string[];
  workCenters: string[];
  statuses: string[];
};

export type GlobalFilterableRecord = {
  company?: string | null;
  farmId?: string | null;
  workCenter?: string | null;
  area?: string | null;
  workerId?: string | null;
  status?: string | null;
  /** Fecha ISO YYYY-MM-DD para filtrar año/mes */
  date?: string | null;
};

export function defaultGlobalFilters(now = new Date()): SgsstGlobalFilters {
  return {
    year: "all",
    month: "all",
    company: "all",
    farmId: "all",
    workCenter: "all",
    area: "all",
    workerId: "all",
    status: "all",
  };
}

export function matchesGlobalFilters(
  record: GlobalFilterableRecord,
  filters: SgsstGlobalFilters,
): boolean {
  if (filters.company !== "all") {
    if ((record.company ?? "").trim() !== filters.company) return false;
  }
  if (filters.farmId !== "all") {
    if ((record.farmId ?? "") !== filters.farmId) return false;
  }
  if (filters.workCenter !== "all") {
    if ((record.workCenter ?? "").trim() !== filters.workCenter) return false;
  }
  if (filters.area !== "all") {
    if ((record.area ?? "").trim() !== filters.area) return false;
  }
  if (filters.workerId !== "all") {
    if ((record.workerId ?? "") !== filters.workerId) return false;
  }
  // Estado laboral solo si el registro lo expone (p. ej. censo o vistas con workerStatus).
  if (filters.status !== "all" && record.status !== undefined) {
    if ((record.status ?? "") !== filters.status) return false;
  }
  // Año/mes solo si el registro trae fecha; si no, no se excluye (p. ej. censo).
  if (
    (filters.year !== "all" || filters.month !== "all") &&
    record.date !== undefined
  ) {
    const date = (record.date ?? "").trim();
    if (!date || date.length < 7) return false;
    const y = Number(date.slice(0, 4));
    const m = Number(date.slice(5, 7));
    if (filters.year !== "all" && y !== filters.year) return false;
    if (filters.month !== "all" && m !== filters.month) return false;
  }
  return true;
}

export function countActiveGlobalFilters(filters: SgsstGlobalFilters): number {
  let n = 0;
  if (filters.year !== "all") n += 1;
  if (filters.month !== "all") n += 1;
  if (filters.company !== "all") n += 1;
  if (filters.farmId !== "all") n += 1;
  if (filters.workCenter !== "all") n += 1;
  if (filters.area !== "all") n += 1;
  if (filters.workerId !== "all") n += 1;
  if (filters.status !== "all") n += 1;
  return n;
}

export function parseGlobalFiltersFromSearchParams(
  params: URLSearchParams,
): SgsstGlobalFilters {
  const base = defaultGlobalFilters();
  const yearRaw = params.get("gy");
  const monthRaw = params.get("gm");
  if (yearRaw && yearRaw !== "all") {
    const y = Number(yearRaw);
    if (Number.isFinite(y)) base.year = y;
  }
  if (monthRaw && monthRaw !== "all") {
    const m = Number(monthRaw);
    if (Number.isFinite(m) && m >= 1 && m <= 12) base.month = m;
  }
  base.company = params.get("gco") || "all";
  base.farmId = params.get("gf") || "all";
  base.workCenter = params.get("gwc") || "all";
  base.area = params.get("ga") || "all";
  base.workerId = params.get("gw") || "all";
  base.status = params.get("gst") || "all";
  return base;
}

export function globalFiltersToSearchParams(
  filters: SgsstGlobalFilters,
  current?: URLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(current?.toString() ?? "");
  const setOrDelete = (key: string, value: string | number, empty: string | number = "all") => {
    if (value === empty) next.delete(key);
    else next.set(key, String(value));
  };
  setOrDelete("gy", filters.year);
  setOrDelete("gm", filters.month);
  setOrDelete("gco", filters.company);
  setOrDelete("gf", filters.farmId);
  setOrDelete("gwc", filters.workCenter);
  setOrDelete("ga", filters.area);
  setOrDelete("gw", filters.workerId);
  setOrDelete("gst", filters.status);
  return next;
}

export const GLOBAL_MONTH_OPTIONS = [
  { value: "all", label: "Todos los meses" },
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
] as const;
