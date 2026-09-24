"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import {
  defaultAnalyticsFilters,
  type AnalyticsPeriodFilter,
  type AnalisisSstReport,
} from "@/lib/sg-sst/analytics/filters";
import {
  buildAnalisisReport,
  listAnalyticsFilterOptions,
} from "@/lib/sg-sst/analisis/repository";

export async function loadAnalisisSstAction(
  filters?: Partial<AnalyticsPeriodFilter>,
): Promise<{
  report: AnalisisSstReport;
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
    buildAnalisisReport(merged),
    listSstFarms(),
  ]);
  return { report, farms };
}

export async function loadAnalisisFilterMetaAction() {
  await requireAdmin();
  const [options, farms] = await Promise.all([
    listAnalyticsFilterOptions(),
    listSstFarms(),
  ]);
  return { options, farms };
}
