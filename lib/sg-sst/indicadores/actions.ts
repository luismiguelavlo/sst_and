"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  defaultAnalyticsFilters,
  type AnalyticsPeriodFilter,
} from "@/lib/sg-sst/analytics/filters";
import { buildIndicadoresReport } from "@/lib/sg-sst/indicadores/repository";
import type { IndicadoresSstReport } from "@/lib/sg-sst/indicadores/types";

export async function loadIndicadoresSstAction(
  filters?: Partial<AnalyticsPeriodFilter>,
): Promise<{
  report: IndicadoresSstReport;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
}> {
  await requireAdmin();
  const base = defaultAnalyticsFilters();
  const merged: AnalyticsPeriodFilter = {
    year: filters?.year ?? base.year,
    month: filters?.month ?? base.month,
    company: filters?.company ?? "all",
    farmId: filters?.farmId ?? "all",
    area: filters?.area ?? "all",
  };
  const [report, farms] = await Promise.all([
    buildIndicadoresReport(merged),
    listSstFarms(),
  ]);
  return { report, farms };
}
