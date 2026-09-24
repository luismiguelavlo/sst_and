"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type {
  ComplianceDimensionScore,
  ComplianceSemaphore,
  SgsstComplianceReport,
} from "@/lib/sg-sst/cumplimiento/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type ComplianceSectionProps = {
  report: SgsstComplianceReport;
};

const SEMAPHORE_STYLES: Record<
  ComplianceSemaphore,
  { bar: string; badge: string; label: string }
> = {
  green: {
    bar: "bg-secondary",
    badge: "bg-secondary-container text-on-secondary-container",
    label: "Conforme",
  },
  yellow: {
    bar: "bg-amber-500",
    badge: "bg-secondary-fixed text-on-secondary-fixed",
    label: "En riesgo",
  },
  red: {
    bar: "bg-error",
    badge: "bg-error-container text-on-error-container",
    label: "Crítico",
  },
};

export function ComplianceDashboardSection({
  report,
}: Readonly<ComplianceSectionProps>) {
  const { thresholds, overall } = report;

  return (
    <section className="px-gutter py-sm">
      <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <div className="mb-md flex flex-wrap items-start justify-between gap-base">
          <div>
            <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
              <MaterialIcon name="verified" className="text-[16px]" />
              Cumplimiento SG-SST
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Cumplimiento del sistema
            </h2>
            <p className="mt-xs max-w-2xl font-body-sm text-body-sm text-on-surface-variant">
              Semáforo: 🟢 ≥{thresholds.greenMinPct}% · 🟡 ≥{thresholds.yellowMinPct}% y &lt;
              {thresholds.greenMinPct}% · 🔴 &lt;{thresholds.yellowMinPct}%. Sin inventar datos
              cuando no hay registros.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-sm">
            {overall.status === "ok" ? (
              <div
                className={`rounded-xl px-md py-sm ${SEMAPHORE_STYLES[overall.semaphore].badge}`}
              >
                <div className="font-label-sm text-label-sm uppercase tracking-wider opacity-80">
                  Promedio
                </div>
                <div className="font-headline-md text-headline-md font-bold leading-none">
                  {overall.pct.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-surface-container-low px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
                {overall.message}
              </div>
            )}
            <Link
              href={`${SGSST_BASE}/configuracion`}
              className="inline-flex items-center gap-xs rounded-lg bg-surface-container px-sm py-sm font-label-md text-label-md font-semibold text-on-surface"
            >
              <MaterialIcon name="tune" className="text-[18px]" />
              Configurar umbrales
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-sm md:grid-cols-2 xl:grid-cols-5">
          {report.dimensions.map((dim) => (
            <ComplianceCard key={dim.id} dimension={dim} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ComplianceCard({
  dimension,
}: Readonly<{ dimension: ComplianceDimensionScore }>) {
  if (dimension.status === "insufficient") {
    return (
      <Link
        href={dimension.href}
        className="flex flex-col gap-sm rounded-xl bg-surface-container-low p-sm transition-colors hover:bg-surface-container"
      >
        <div className="flex items-center gap-xs">
          <MaterialIcon name={dimension.icon} className="text-[18px] text-primary" />
          <span className="font-label-md text-label-md font-semibold text-on-surface">
            {dimension.label}
          </span>
        </div>
        <div className="rounded-lg bg-surface-container-lowest px-sm py-sm font-body-sm text-body-sm text-on-surface-variant">
          Sin datos suficientes
        </div>
      </Link>
    );
  }

  const style = SEMAPHORE_STYLES[dimension.semaphore];
  const width = Math.max(4, Math.min(100, Math.round(dimension.pct)));

  return (
    <Link
      href={dimension.href}
      className="flex flex-col gap-sm rounded-xl bg-surface-container-low p-sm transition-colors hover:bg-surface-container"
    >
      <div className="flex items-start justify-between gap-xs">
        <div className="flex items-center gap-xs">
          <MaterialIcon name={dimension.icon} className="text-[18px] text-primary" />
          <span className="font-label-md text-label-md font-semibold text-on-surface">
            {dimension.label}
          </span>
        </div>
        <span
          className={`shrink-0 rounded-md px-1.5 py-0.5 font-label-sm text-label-sm font-semibold ${style.badge}`}
        >
          {style.label}
        </span>
      </div>
      <div className="flex items-baseline gap-xs">
        <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {dimension.pct.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
        <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${width}%` }} />
      </div>
      <p className="font-label-sm text-label-sm text-on-surface-variant line-clamp-2">
        {dimension.detail}
      </p>
    </Link>
  );
}
