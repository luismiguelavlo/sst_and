"use client";

import { useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { AnalyticsFilterBar } from "@/components/sg-sst/analytics/AnalyticsFilterBar";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import type { AnalyticsPeriodFilter } from "@/lib/sg-sst/analytics/filters";
import { loadIndicadoresSstAction } from "@/lib/sg-sst/indicadores/actions";
import type {
  IndicatorCard,
  IndicatorValue,
  IndicadoresSstReport,
} from "@/lib/sg-sst/indicadores/types";

type IndicadoresSstScreenProps = {
  initialReport: IndicadoresSstReport;
  farms: SstFarm[];
};

export function IndicadoresSstScreen({
  initialReport,
  farms,
}: Readonly<IndicadoresSstScreenProps>) {
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [report, setReport] = useState(initialReport);

  function applyFilters(next: AnalyticsPeriodFilter) {
    startTransition(async () => {
      try {
        const result = await loadIndicadoresSstAction(next);
        setReport(result.report);
      } catch (caught) {
        showToast(
          caught instanceof Error
            ? caught.message
            : "No se pudo actualizar los indicadores.",
          { variant: "error" },
        );
      }
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
            <MaterialIcon name="monitoring" className="text-[16px]" />
            Tablero gerencial
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            Indicadores SST
          </h1>
          <p className="mt-xs max-w-3xl font-body-md text-body-md text-on-surface-variant">
            Cálculo automático cuando hay información suficiente. Compara el
            periodo actual con el mes anterior y el mismo periodo del año
            anterior. No se inventan datos.
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
            {report.inputs.activeWorkers} trab. activos · {report.inputs.weekdays}{" "}
            días lab.
            {report.inputs.hhtEstimated !== null
              ? ` · HHT est. ${Math.round(report.inputs.hhtEstimated).toLocaleString("es-CO")}`
              : " · HHT no disponible"}
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

      <section className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-3">
        {report.cards.map((card) => (
          <IndicatorMetricCard
            key={card.id}
            card={card}
            showMonthComparison={report.filters.month !== "all"}
          />
        ))}
      </section>
    </div>
  );
}

function IndicatorMetricCard({
  card,
  showMonthComparison,
}: Readonly<{ card: IndicatorCard; showMonthComparison: boolean }>) {
  return (
    <article className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <header>
        <h3 className="font-label-md text-label-md font-semibold text-on-surface">
          {card.label}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {card.description}
        </p>
      </header>

      <div>
        <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
          Actual
        </div>
        <ValueDisplay value={card.current} large />
      </div>

      <div className="grid grid-cols-2 gap-sm border-t border-outline-variant/40 pt-sm">
        {showMonthComparison ? (
          <div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">
              Mes anterior
            </div>
            <ValueDisplay value={card.previousMonth} />
            <DeltaHint current={card.current} previous={card.previousMonth} />
          </div>
        ) : (
          <div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">
              Mes anterior
            </div>
            <div className="mt-0.5 rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm text-on-surface-variant">
              Seleccione un mes
            </div>
          </div>
        )}
        <div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">
            Año anterior
          </div>
          <ValueDisplay value={card.previousYear} />
          <DeltaHint current={card.current} previous={card.previousYear} />
        </div>
      </div>
    </article>
  );
}

function ValueDisplay({
  value,
  large = false,
}: Readonly<{ value: IndicatorValue; large?: boolean }>) {
  if (value.status === "insufficient") {
    return (
      <div
        className={`rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm text-on-surface-variant ${
          large ? "mt-1" : "mt-0.5"
        }`}
      >
        Sin datos suficientes
      </div>
    );
  }
  return (
    <div className={large ? "mt-1" : "mt-0.5"}>
      <div
        className={
          large
            ? "font-headline-md text-headline-md font-bold text-primary"
            : "font-label-md text-label-md font-semibold text-on-surface"
        }
      >
        {value.formatted}
      </div>
      {value.note && large ? (
        <div className="mt-0.5 font-label-sm text-label-sm text-on-surface-variant">
          {value.note}
        </div>
      ) : null}
    </div>
  );
}

function DeltaHint({
  current,
  previous,
}: Readonly<{ current: IndicatorValue; previous: IndicatorValue }>) {
  if (current.status !== "ok" || previous.status !== "ok") return null;
  const delta = current.value - previous.value;
  if (Math.abs(delta) < 0.0001) {
    return (
      <div className="font-label-sm text-label-sm text-on-surface-variant">
        Sin cambio
      </div>
    );
  }
  const up = delta > 0;
  return (
    <div
      className={`font-label-sm text-label-sm font-semibold ${
        up ? "text-on-surface-variant" : "text-secondary"
      }`}
    >
      {up ? "▲" : "▼"} {Math.abs(delta).toLocaleString("es-CO", { maximumFractionDigits: 2 })}
    </div>
  );
}
