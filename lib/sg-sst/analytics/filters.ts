export type AnalyticsPeriodFilter = {
  year: number;
  /** 1–12 o "all" para año completo */
  month: number | "all";
  company: string | "all";
  farmId: string | "all";
  area: string | "all";
};

export type RankingItem = {
  label: string;
  value: number;
  secondaryLabel?: string;
};

export type RankingBlock = {
  id: string;
  question: string;
  items: RankingItem[];
  unit: string;
  hasData: boolean;
  emptyMessage: string;
};

export type AnalisisSstReport = {
  filters: AnalyticsPeriodFilter;
  periodLabel: string;
  generatedAt: string;
  blocks: RankingBlock[];
  filterOptions: {
    years: number[];
    companies: string[];
    areas: string[];
  };
};

export function defaultAnalyticsFilters(
  now = new Date(),
): AnalyticsPeriodFilter {
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    company: "all",
    farmId: "all",
    area: "all",
  };
}

export function periodBounds(filters: AnalyticsPeriodFilter): {
  from: string;
  toExclusive: string;
} {
  const { year, month } = filters;
  if (month === "all") {
    return { from: `${year}-01-01`, toExclusive: `${year + 1}-01-01` };
  }
  const mm = String(month).padStart(2, "0");
  const from = `${year}-${mm}-01`;
  if (month === 12) {
    return { from, toExclusive: `${year + 1}-01-01` };
  }
  return {
    from,
    toExclusive: `${year}-${String(month + 1).padStart(2, "0")}-01`,
  };
}

export function previousMonthFilters(
  filters: AnalyticsPeriodFilter,
): AnalyticsPeriodFilter {
  if (filters.month === "all") {
    return { ...filters, year: filters.year - 1 };
  }
  if (filters.month === 1) {
    return { ...filters, year: filters.year - 1, month: 12 };
  }
  return { ...filters, month: filters.month - 1 };
}

export function previousYearFilters(
  filters: AnalyticsPeriodFilter,
): AnalyticsPeriodFilter {
  return { ...filters, year: filters.year - 1 };
}

export function formatPeriodLabel(filters: AnalyticsPeriodFilter): string {
  if (filters.month === "all") return `Año ${filters.year}`;
  const names = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return `${names[filters.month - 1]} ${filters.year}`;
}

export function countWeekdays(fromIso: string, toExclusiveIso: string): number {
  let count = 0;
  const cursor = new Date(`${fromIso}T12:00:00`);
  const end = new Date(`${toExclusiveIso}T12:00:00`);
  while (cursor < end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}
