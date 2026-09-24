"use client";

import { useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { AnalyticsFilterBar } from "@/components/sg-sst/analytics/AnalyticsFilterBar";
import { RankingCard } from "@/components/sg-sst/analytics/RankingCard";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import { loadAnalisisSstAction } from "@/lib/sg-sst/analisis/actions";
import type {
  AnalyticsPeriodFilter,
  AnalisisSstReport,
} from "@/lib/sg-sst/analytics/filters";

type AnalisisSstScreenProps = {
  initialReport: AnalisisSstReport;
  farms: SstFarm[];
};

export function AnalisisSstScreen({
  initialReport,
  farms,
}: Readonly<AnalisisSstScreenProps>) {
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [report, setReport] = useState(initialReport);

  function applyFilters(next: AnalyticsPeriodFilter) {
    startTransition(async () => {
      try {
        const result = await loadAnalisisSstAction(next);
        setReport(result.report);
      } catch (caught) {
        showToast(
          caught instanceof Error ? caught.message : "No se pudo actualizar el análisis.",
          { variant: "error" },
        );
      }
    });
  }

  const withData = report.blocks.filter((b) => b.hasData).length;

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
            <MaterialIcon name="analytics" className="text-[16px]" />
            Inteligencia operativa
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            Análisis SST
          </h1>
          <p className="mt-xs max-w-3xl font-body-md text-body-md text-on-surface-variant">
            Rankings y tendencias calculados solo con información registrada.
            Si no hay registros, se muestra &quot;Sin datos suficientes&quot;.
          </p>
        </div>
        <div className="rounded-xl bg-surface-container-lowest px-base py-sm shadow-sm">
          <div className="font-label-sm text-label-sm text-on-surface-variant">
            Periodo
          </div>
          <div className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            {report.periodLabel}
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">
            {withData}/{report.blocks.length} preguntas con datos
            {pending ? " · actualizando…" : ""}
          </div>
        </div>
      </header>

      <AnalyticsFilterBar
        filters={report.filters}
        years={report.filterOptions.years}
        companies={report.filterOptions.companies}
        areas={report.filterOptions.areas}
        farms={farms}
        pending={pending}
        onChange={applyFilters}
      />

      <section className="grid grid-cols-1 gap-md lg:grid-cols-2 xl:grid-cols-3">
        {report.blocks.map((block) => (
          <RankingCard key={block.id} block={block} />
        ))}
      </section>
    </div>
  );
}
