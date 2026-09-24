import "server-only";

import { getSql } from "@/lib/db";
import {
  formatPeriodLabel,
  periodBounds,
  previousMonthFilters,
  previousYearFilters,
  type AnalyticsPeriodFilter,
} from "@/lib/sg-sst/analytics/filters";
import { listAnalyticsFilterOptions } from "@/lib/sg-sst/analisis/repository";
import {
  buildIndicatorCards,
  countWeekdays,
  estimateHht,
  type IndicadoresSstReport,
  type PeriodRawMetrics,
} from "@/lib/sg-sst/indicadores/types";

async function loadPeriodMetrics(
  filters: AnalyticsPeriodFilter,
): Promise<PeriodRawMetrics> {
  const sql = getSql();
  const { from, toExclusive } = periodBounds(filters);
  const company = filters.company === "all" ? null : filters.company;
  const farmId = filters.farmId === "all" ? null : filters.farmId;
  const area = filters.area === "all" ? null : filters.area;

  const [
    accidents,
    leave,
    trainings,
    inspections,
    actions,
    planDocs,
    workers,
  ] = await Promise.all([
    sql<{ total: number; with_lost: number; lost_days: number }[]>`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE e.lost_days > 0)::int AS with_lost,
        COALESCE(SUM(e.lost_days), 0)::int AS lost_days
      FROM campus_sst.sst_accident_events e
      WHERE e.event_type = 'accidente_trabajo'
        AND e.event_date >= ${from}::date AND e.event_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR e.company_snapshot = ${company})
        AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR e.area_snapshot = ${area})
    `,
    sql<{ days: number }[]>`
      SELECT COALESCE(SUM(sub.weekday_days), 0)::int AS days
      FROM (
        SELECT (
          SELECT COUNT(*)::int
          FROM generate_series(
            GREATEST(i.start_date, ${from}::date),
            LEAST(i.end_date, (${toExclusive}::date - INTERVAL '1 day')::date),
            '1 day'::interval
          ) AS d(day)
          WHERE EXTRACT(ISODOW FROM d.day) < 6
        ) AS weekday_days
        FROM campus_sst.sst_incapacidades i
        INNER JOIN campus_sst.sst_workers w ON w.id = i.worker_id
        WHERE i.start_date < ${toExclusive}::date AND i.end_date >= ${from}::date
          AND (${company}::text IS NULL OR i.company_snapshot = ${company} OR w.company = ${company})
          AND (${farmId}::uuid IS NULL OR i.farm_id = ${farmId}::uuid OR w.farm_id = ${farmId}::uuid)
          AND (${area}::text IS NULL OR w.area = ${area})
      ) sub
    `,
    sql<{ total: number; compliant: number }[]>`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE t.status = 'realizada')::int AS compliant
      FROM campus_sst.sst_trainings t
      INNER JOIN campus_sst.sst_workers w ON w.id = t.worker_id
      WHERE t.training_date >= ${from}::date AND t.training_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR t.company_snapshot = ${company} OR w.company = ${company})
        AND (${farmId}::uuid IS NULL OR t.farm_id = ${farmId}::uuid OR w.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR w.area = ${area})
    `,
    sql<{ total: number; compliant: number }[]>`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE i.status = 'realizada')::int AS compliant
      FROM campus_sst.sst_inspections i
      WHERE i.scheduled_date >= ${from}::date AND i.scheduled_date < ${toExclusive}::date
        AND (${farmId}::uuid IS NULL OR i.farm_id = ${farmId}::uuid)
    `,
    sql<{ total: number; compliant: number }[]>`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE a.status = 'cerrada')::int AS compliant
      FROM campus_sst.sst_corrective_actions a
      WHERE a.commit_date >= ${from}::date AND a.commit_date < ${toExclusive}::date
        AND (${farmId}::uuid IS NULL OR a.farm_id = ${farmId}::uuid)
    `,
    sql<{ total: number; compliant: number }[]>`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (
          WHERE d.status = 'vigente'
            AND (
              d.next_review_at IS NULL
              OR d.next_review_at >= CURRENT_DATE
            )
        )::int AS compliant
      FROM campus_sst.sst_sg_documents d
      WHERE d.doc_type = 'plan_anual'
        AND d.has_review_cycle = true
    `,    sql<{ n: number }[]>`
      SELECT COUNT(*)::int AS n
      FROM campus_sst.sst_workers w
      WHERE w.status = 'activo'
        AND (${company}::text IS NULL OR w.company = ${company})
        AND (${farmId}::uuid IS NULL OR w.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR w.area = ${area})
    `,
  ]);

  return {
    accidentCount: accidents[0]?.total ?? 0,
    accidentsWithLostDays: accidents[0]?.with_lost ?? 0,
    lostDaysAccidents: accidents[0]?.lost_days ?? 0,
    leaveDays: leave[0]?.days ?? 0,
    trainingsTotal: trainings[0]?.total ?? 0,
    trainingsCompliant: trainings[0]?.compliant ?? 0,
    inspectionsTotal: inspections[0]?.total ?? 0,
    inspectionsCompliant: inspections[0]?.compliant ?? 0,
    actionsTotal: actions[0]?.total ?? 0,
    actionsCompliant: actions[0]?.compliant ?? 0,
    planDocsTotal: planDocs[0]?.total ?? 0,
    planDocsCompliant: planDocs[0]?.compliant ?? 0,
    activeWorkers: workers[0]?.n ?? 0,
  };
}

export async function buildIndicadoresReport(
  filters: AnalyticsPeriodFilter,
): Promise<IndicadoresSstReport> {
  const [current, prevMonthRaw, prevYearRaw, options] = await Promise.all([
    loadPeriodMetrics(filters),
    loadPeriodMetrics(previousMonthFilters(filters)),
    loadPeriodMetrics(previousYearFilters(filters)),
    listAnalyticsFilterOptions(),
  ]);

  // El plan anual no tiene serie histórica por periodo: no inventar MoM/YoY.
  const prevMonth: PeriodRawMetrics = {
    ...prevMonthRaw,
    planDocsTotal: 0,
    planDocsCompliant: 0,
  };
  const prevYear: PeriodRawMetrics = {
    ...prevYearRaw,
    planDocsTotal: 0,
    planDocsCompliant: 0,
  };

  const { from, toExclusive } = periodBounds(filters);
  const weekdays = countWeekdays(from, toExclusive);
  const hhtEstimated = estimateHht(current.activeWorkers, from, toExclusive);

  return {
    filters,
    periodLabel: formatPeriodLabel(filters),
    generatedAt: new Date().toISOString(),
    cards: buildIndicatorCards(filters, current, prevMonth, prevYear),
    inputs: {
      activeWorkers: current.activeWorkers,
      weekdays,
      hhtEstimated,
      hhtSource: hhtEstimated === null ? "none" : "estimated",
    },
    filterOptions: options,
  };
}
