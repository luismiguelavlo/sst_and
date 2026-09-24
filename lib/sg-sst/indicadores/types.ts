import {
  countWeekdays,
  formatPeriodLabel,
  periodBounds,
  previousMonthFilters,
  previousYearFilters,
  type AnalyticsPeriodFilter,
} from "@/lib/sg-sst/analytics/filters";

/** Factor estándar colombiano (eventos / HHT) × 240.000 */
export const SST_INDEX_FACTOR = 240_000;
export const HOURS_PER_DAY = 8;

export type IndicatorValue =
  | {
      status: "ok";
      value: number;
      formatted: string;
      note?: string;
    }
  | {
      status: "insufficient";
      message: string;
    };

export type IndicatorCard = {
  id: string;
  label: string;
  description: string;
  current: IndicatorValue;
  previousMonth: IndicatorValue;
  previousYear: IndicatorValue;
};

export type IndicadoresSstReport = {
  filters: AnalyticsPeriodFilter;
  periodLabel: string;
  generatedAt: string;
  cards: IndicatorCard[];
  inputs: {
    activeWorkers: number;
    weekdays: number;
    hhtEstimated: number | null;
    hhtSource: "estimated" | "none";
  };
  filterOptions: {
    years: number[];
    companies: string[];
    areas: string[];
  };
};

export type PeriodRawMetrics = {
  accidentCount: number;
  accidentsWithLostDays: number;
  lostDaysAccidents: number;
  leaveDays: number;
  trainingsTotal: number;
  trainingsCompliant: number;
  inspectionsTotal: number;
  inspectionsCompliant: number;
  actionsTotal: number;
  actionsCompliant: number;
  planDocsTotal: number;
  planDocsCompliant: number;
  activeWorkers: number;
};

export function estimateHht(
  activeWorkers: number,
  from: string,
  toExclusive: string,
): number | null {
  if (activeWorkers <= 0) return null;
  const weekdays = countWeekdays(from, toExclusive);
  if (weekdays <= 0) return null;
  return activeWorkers * HOURS_PER_DAY * weekdays;
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${formatNumber(value, 1)}%`;
}

function insufficient(message = "Sin datos suficientes"): IndicatorValue {
  return { status: "insufficient", message };
}

function ok(value: number, formatted: string, note?: string): IndicatorValue {
  return { status: "ok", value, formatted, note };
}

export function computeFrequencyIndex(
  accidentsWithDisability: number,
  hht: number | null,
): IndicatorValue {
  if (hht === null || hht <= 0) {
    return insufficient("Sin HHT suficientes para calcular el índice de frecuencia.");
  }
  // Se calcula aunque accidents = 0 (índice 0 es válido si hay HHT).
  const value = (accidentsWithDisability * SST_INDEX_FACTOR) / hht;
  return ok(value, formatNumber(value), "IF = (AT con incapacidad × 240.000) / HHT");
}

export function computeSeverityIndex(
  lostDays: number,
  hht: number | null,
): IndicatorValue {
  if (hht === null || hht <= 0) {
    return insufficient("Sin HHT suficientes para calcular el índice de severidad.");
  }
  const value = (lostDays * SST_INDEX_FACTOR) / hht;
  return ok(value, formatNumber(value), "IS = (días perdidos × 240.000) / HHT");
}

export function computeAbsenteeismRate(
  leaveDays: number,
  activeWorkers: number,
  from: string,
  toExclusive: string,
): IndicatorValue {
  if (activeWorkers <= 0) {
    return insufficient("Sin trabajadores activos para calcular ausentismo.");
  }
  const weekdays = countWeekdays(from, toExclusive);
  if (weekdays <= 0) {
    return insufficient("Periodo sin días laborables.");
  }
  const available = activeWorkers * weekdays;
  if (available <= 0) return insufficient();
  const value = (leaveDays / available) * 100;
  return ok(
    value,
    formatPercent(value),
    "Ausentismo = días incapacidad / (trabajadores × días laborables)",
  );
}

export function computeComplianceRate(
  compliant: number,
  total: number,
  emptyMessage: string,
): IndicatorValue {
  if (total <= 0) return insufficient(emptyMessage);
  const value = (compliant / total) * 100;
  return ok(value, formatPercent(value));
}

export function computePlainCount(
  value: number,
  hasUniverse: boolean,
  emptyMessage: string,
  unit: string,
): IndicatorValue {
  if (!hasUniverse && value <= 0) return insufficient(emptyMessage);
  return ok(value, `${formatNumber(value, 0)} ${unit}`);
}

export function buildIndicatorCards(
  filters: AnalyticsPeriodFilter,
  current: PeriodRawMetrics,
  prevMonth: PeriodRawMetrics,
  prevYear: PeriodRawMetrics,
): IndicatorCard[] {
  const curBounds = periodBounds(filters);
  const prevMBounds = periodBounds(previousMonthFilters(filters));
  const prevYBounds = periodBounds(previousYearFilters(filters));

  const hhtCur = estimateHht(current.activeWorkers, curBounds.from, curBounds.toExclusive);
  const hhtPrevM = estimateHht(
    prevMonth.activeWorkers,
    prevMBounds.from,
    prevMBounds.toExclusive,
  );
  const hhtPrevY = estimateHht(
    prevYear.activeWorkers,
    prevYBounds.from,
    prevYBounds.toExclusive,
  );

  const defs: {
    id: string;
    label: string;
    description: string;
    pick: (m: PeriodRawMetrics, hht: number | null, from: string, to: string) => IndicatorValue;
  }[] = [
    {
      id: "if",
      label: "Índice de frecuencia",
      description: "Accidentes de trabajo con incapacidad por HHT.",
      pick: (m, hht) => computeFrequencyIndex(m.accidentsWithLostDays, hht),
    },
    {
      id: "is",
      label: "Índice de severidad",
      description: "Días perdidos por accidentes relativos a HHT.",
      pick: (m, hht) => computeSeverityIndex(m.lostDaysAccidents, hht),
    },
    {
      id: "absenteeism",
      label: "Ausentismo",
      description: "Días de incapacidad sobre días laborables disponibles.",
      pick: (m, _h, from, to) =>
        computeAbsenteeismRate(m.leaveDays, m.activeWorkers, from, to),
    },
    {
      id: "hht",
      label: "HHT",
      description: "Horas hombre trabajadas estimadas (trabajadores × 8 × días laborables).",
      pick: (_m, hht) =>
        hht === null
          ? insufficient("Sin trabajadores activos para estimar HHT.")
          : ok(hht, formatNumber(hht, 0), "Estimado a partir de la nómina activa"),
    },
    {
      id: "lost_days",
      label: "Días perdidos",
      description: "Suma de días perdidos por accidentes en el periodo.",
      pick: (m) =>
        computePlainCount(
          m.lostDaysAccidents,
          m.accidentCount > 0 || m.lostDaysAccidents > 0,
          "Sin accidentes registrados en el periodo.",
          "días",
        ),
    },
    {
      id: "accident_freq",
      label: "Frecuencia de accidentes",
      description: "Cantidad de accidentes de trabajo en el periodo.",
      pick: (m) =>
        computePlainCount(
          m.accidentCount,
          m.accidentCount > 0,
          "Sin eventos registrados en el periodo.",
          "eventos",
        ),
    },
    {
      id: "severity_raw",
      label: "Severidad (días)",
      description: "Magnitud absoluta de días perdidos (sin relativizar a HHT).",
      pick: (m) =>
        computePlainCount(
          m.lostDaysAccidents,
          m.accidentCount > 0 || m.lostDaysAccidents > 0,
          "Sin datos de días perdidos en el periodo.",
          "días",
        ),
    },
    {
      id: "training_compliance",
      label: "Cumplimiento de capacitaciones",
      description: "Capacitaciones realizadas / total del periodo.",
      pick: (m) =>
        computeComplianceRate(
          m.trainingsCompliant,
          m.trainingsTotal,
          "Sin capacitaciones en el periodo.",
        ),
    },
    {
      id: "inspection_compliance",
      label: "Cumplimiento de inspecciones",
      description: "Inspecciones realizadas / programadas en el periodo.",
      pick: (m) =>
        computeComplianceRate(
          m.inspectionsCompliant,
          m.inspectionsTotal,
          "Sin inspecciones en el periodo.",
        ),
    },
    {
      id: "actions_compliance",
      label: "Cumplimiento de acciones correctivas",
      description: "Acciones cerradas / total con compromiso en el periodo.",
      pick: (m) =>
        computeComplianceRate(
          m.actionsCompliant,
          m.actionsTotal,
          "Sin acciones correctivas en el periodo.",
        ),
    },
    {
      id: "plan_compliance",
      label: "Cumplimiento del plan anual",
      description:
        "Documentos con ciclo de revisión al día (estado actual; sin serie histórica).",
      pick: (m) =>
        computeComplianceRate(
          m.planDocsCompliant,
          m.planDocsTotal,
          "Sin documentos del plan anual con ciclo de revisión.",
        ),
    },
  ];

  const monthOverMonthUnavailable =
    filters.month === "all"
      ? insufficient("Seleccione un mes para comparar con el mes anterior.")
      : null;

  return defs.map((def) => ({
    id: def.id,
    label: def.label,
    description: def.description,
    current: def.pick(current, hhtCur, curBounds.from, curBounds.toExclusive),
    previousMonth:
      monthOverMonthUnavailable ??
      def.pick(prevMonth, hhtPrevM, prevMBounds.from, prevMBounds.toExclusive),
    previousYear: def.pick(
      prevYear,
      hhtPrevY,
      prevYBounds.from,
      prevYBounds.toExclusive,
    ),
  }));
}

export {
  formatPeriodLabel,
  periodBounds,
  previousMonthFilters,
  previousYearFilters,
  countWeekdays,
};
