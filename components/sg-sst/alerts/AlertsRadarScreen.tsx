"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ComplianceExcelIoBar } from "@/components/sg-sst/alerts/ComplianceExcelIoBar";
import { SemaphoreBadge, SemaphoreDot } from "@/components/sg-sst/alerts/SemaphoreBadge";
import type { AlertKindSummary } from "@/lib/sg-sst/alerts/engine";
import {
  SST_RECORD_TYPES,
  type SstAlertKind,
  type SstAlertView,
  type SstFarm,
  type SstSemaphoreLevel,
} from "@/lib/sg-sst/alerts/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type AlertsRadarScreenProps = {
  alerts: SstAlertView[];
  counts: Record<SstSemaphoreLevel, number>;
  kindSummaries: AlertKindSummary[];
  farms: SstFarm[];
  criticalCount: number;
};

const CATEGORIES: {
  id: AlertKindSummary["category"];
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "talento",
    title: "A. Talento Humano y Cursos Normativos",
    description: "Inducciones, licencias PESV, alturas y certificaciones.",
    icon: "school",
  },
  {
    id: "salud",
    title: "B. Salud Ocupacional e Incapacidades",
    description: "EMOs, restricciones, incapacidades y reintegros.",
    icon: "medical_services",
  },
  {
    id: "operacion",
    title: "C. Operación, EPP e Investigaciones",
    description: "Inspecciones, EPP, investigaciones y acciones correctivas.",
    icon: "fact_check",
  },
  {
    id: "sistema",
    title: "D. Documentación del Sistema",
    description: "Control documental y revisiones del SG-SST.",
    icon: "description",
  },
];

export function AlertsRadarScreen({
  alerts,
  counts,
  kindSummaries,
  farms,
  criticalCount,
}: Readonly<AlertsRadarScreenProps>) {
  const [farmId, setFarmId] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filteredSummaries = useMemo(() => {
    const filteredAlerts =
      farmId === "all" ? alerts : alerts.filter((alert) => alert.farmId === farmId);
    const q = query.trim().toLowerCase();
    return kindSummaries.map((summary) => {
      const matching = filteredAlerts.filter((alert) => {
        if (!alert.alertKinds.includes(summary.kind)) return false;
        if (!q) return true;
        return (
          alert.subjectName.toLowerCase().includes(q) ||
          alert.title.toLowerCase().includes(q) ||
          alert.code.toLowerCase().includes(q) ||
          alert.folio.toLowerCase().includes(q) ||
          (alert.subjectDocument ?? "").toLowerCase().includes(q)
        );
      });
      return { ...summary, total: matching.length };
    });
  }, [alerts, farmId, kindSummaries, query]);

  return (
    <div className="flex w-full flex-col px-gutter pb-xl">
      <div className="mb-md flex flex-col items-start justify-between gap-sm rounded-xl bg-error-container p-base text-on-error-container shadow-sm md:flex-row md:items-center">
        <div className="flex min-w-0 items-center gap-xs">
          <MaterialIcon name="warning" className="shrink-0 animate-bounce text-[24px] text-error" />
          <p className="truncate font-label-md text-label-md">
            <strong>Radar Activo:</strong> Se detectaron {criticalCount} inconsistencias de alta
            severidad que comprometen el cumplimiento legal ante Mintrabajo.
          </p>
        </div>
        <span className="rounded-full bg-error px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-error uppercase tracking-wider">
          Prioridad Alta
        </span>
      </div>

      <div className="flex flex-col justify-between gap-md pb-md lg:flex-row lg:items-end">
        <div className="max-w-4xl space-y-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-ping rounded-full bg-error" />
            <span className="font-label-sm text-label-sm font-bold tracking-widest text-primary uppercase">
              Tablero de Control · Radar Semafórico
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-balance text-on-surface">
            🚨 ALERTAS SST — Detección temprana de riesgos y vencimientos
          </h1>
          <p className="max-w-3xl font-body-md text-body-md text-on-surface-variant">
            Cálculo automático sobre registros operativos: cursos, EMOs, incapacidades, EPP,
            inspecciones, documentos, licencias y certificaciones (Decreto 1072 / Res. 0312 / Res.
            4272).
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-xs sm:items-end">
          <div className="flex flex-wrap items-center justify-end gap-xs">
            <Link
              href={`${SGSST_BASE}/alertas-sst/matriz`}
              className="flex items-center gap-1.5 rounded-lg bg-surface-container-lowest px-sm py-2 font-label-md text-label-md font-semibold text-primary shadow-sm transition-all hover:bg-surface-container-high"
            >
              <MaterialIcon name="table_view" className="text-[18px]" />
              <span>Matriz operativa</span>
            </Link>
            <Link
              href={`${SGSST_BASE}/alertas-sst/configuracion`}
              className="flex items-center gap-1.5 rounded-lg bg-surface-container-high px-sm py-2 font-label-md text-label-md font-semibold text-on-surface transition-all hover:bg-surface-dim"
            >
              <MaterialIcon name="tune" className="text-[18px]" />
              <span>Configurar umbrales</span>
            </Link>
          </div>
          <ComplianceExcelIoBar
            records={alerts}
            recordTypes={SST_RECORD_TYPES}
            exportFileName={`radar-alertas-sst-${new Date().toISOString().slice(0, 10)}.xlsx`}
            templateFileName="plantilla-alertas-sst.xlsx"
            sheetName="Radar Alertas"
          />
        </div>
      </div>

      <div className="my-md grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          level="critico"
          title="Vencido / Crítico"
          range="≤ 0 días"
          count={counts.critico}
          hint="Acción inmediata / bloqueo operativo"
        />
        <MetricCard
          level="proximo"
          title="Próximo a Vencer"
          range="1 a 30 días"
          count={counts.proximo}
          hint="Programación del mes"
        />
        <MetricCard
          level="seguimiento"
          title="Requiere Seguimiento"
          range="31 a 60 días"
          count={counts.seguimiento}
          hint="Monitoreo preventivo"
        />
        <MetricCard
          level="vigente"
          title="Vigente / Conforme"
          range="> 60 días"
          count={counts.vigente}
          hint="En regla"
        />
      </div>

      <div className="mb-lg flex flex-col items-center justify-between gap-sm rounded-xl bg-surface-container-lowest p-sm shadow-sm md:flex-row">
        <div className="flex w-full flex-wrap items-center gap-xs md:w-auto">
          <span className="pl-1 font-label-sm text-label-sm font-semibold text-on-surface-variant uppercase">
            Finca:
          </span>
          <FilterChip active={farmId === "all"} onClick={() => setFarmId("all")}>
            Todas ({farms.length})
          </FilterChip>
          {farms.map((farm) => (
            <FilterChip
              key={farm.id}
              active={farmId === farm.id}
              onClick={() => setFarmId(farm.id)}
            >
              {farm.name}
            </FilterChip>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <MaterialIcon
            name="search"
            className="absolute top-2 left-2.5 text-[18px] text-outline"
          />
          <input
            className="w-full rounded-lg bg-surface-container-low py-1.5 pr-3 pl-8 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Buscar trabajador, EMO, EPP..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-xl">
        {CATEGORIES.map((category) => {
          const items = filteredSummaries.filter((item) => item.category === category.id);
          return (
            <section key={category.id} className="space-y-md">
              <div className="flex items-center justify-between gap-base">
                <div className="flex items-center gap-xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-on-primary">
                    <MaterialIcon name={category.icon} className="text-[20px]" />
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                      {category.title}
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {category.description}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-surface-container-high px-2.5 py-1 font-label-sm text-label-sm font-bold text-on-surface-variant">
                  {items.length} Indicadores
                </span>
              </div>
              <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                  <KindCard key={item.kind} summary={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function MetricCard({
  level,
  title,
  range,
  count,
  hint,
}: Readonly<{
  level: SstSemaphoreLevel;
  title: string;
  range: string;
  count: number;
  hint: string;
}>) {
  const surfaces: Record<SstSemaphoreLevel, string> = {
    critico: "bg-error-container text-on-error-container",
    proximo: "bg-surface-container-highest text-on-surface",
    seguimiento: "bg-surface-container text-on-surface",
    vigente: "bg-surface-container-low text-on-surface",
  };
  const numberColor: Record<SstSemaphoreLevel, string> = {
    critico: "text-error",
    proximo: "text-amber-700",
    seguimiento: "text-yellow-700",
    vigente: "text-primary",
  };
  return (
    <div className={`flex flex-col justify-between rounded-xl p-md shadow-sm ${surfaces[level]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SemaphoreDot level={level} />
          <span className="font-label-sm text-label-sm font-bold tracking-wider uppercase">
            {title}
          </span>
        </div>
        <span className="font-label-sm text-label-sm opacity-80">{range}</span>
      </div>
      <div className="mt-base flex items-baseline justify-between">
        <span className={`font-display-lg text-display-lg font-bold tracking-tight ${numberColor[level]}`}>
          {count}
        </span>
      </div>
      <p className="mt-xs font-body-sm text-body-sm opacity-80">{hint}</p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: Readonly<{ active: boolean; onClick: () => void; children: React.ReactNode }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-primary px-sm py-1 font-label-sm text-label-sm font-semibold text-on-primary"
          : "rounded-full bg-surface-container px-sm py-1 font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high"
      }
    >
      {children}
    </button>
  );
}

function KindCard({ summary }: Readonly<{ summary: AlertKindSummary }>) {
  const href = `${SGSST_BASE}/alertas-sst/matriz?kind=${summary.kind as SstAlertKind}`;
  return (
    <Link
      href={href}
      className="group flex cursor-pointer flex-col justify-between rounded-xl bg-surface-container-lowest p-md shadow-sm transition-all hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between">
          <SemaphoreBadge
            level={summary.dominantSemaphore}
            label={
              summary.dominantSemaphore === "critico"
                ? "Vencido"
                : summary.dominantSemaphore === "proximo"
                  ? "< 30 días"
                  : summary.dominantSemaphore === "seguimiento"
                    ? "31-60 días"
                    : "Vigente"
            }
            compact
          />
          <MaterialIcon
            name={summary.icon}
            className="text-[20px] text-outline transition-colors group-hover:text-primary"
          />
        </div>
        <h3 className="mt-base font-headline-md text-headline-md text-on-surface">{summary.label}</h3>
        <p className="mt-xs font-body-sm text-body-sm font-medium text-on-surface">
          {summary.total === 0
            ? "Sin casos activos"
            : `${summary.total} caso${summary.total === 1 ? "" : "s"} activo${summary.total === 1 ? "" : "s"}`}
        </p>
        <div className="mt-base space-y-1 rounded bg-surface-container-low p-xs font-label-sm text-label-sm text-on-surface-variant">
          {summary.byFarm.length === 0 ? (
            <div>Sin desglose por finca</div>
          ) : (
            summary.byFarm.map((farm) => (
              <div key={farm.farmName} className="flex justify-between">
                <span>{farm.farmName}:</span>
                <span className="font-bold text-on-surface">{farm.count}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-md flex items-center justify-between pt-base font-label-md text-label-md font-semibold text-primary transition-transform group-hover:translate-x-1">
        <span>Gestionar alerta</span>
        <MaterialIcon name="arrow_forward" className="text-[18px]" />
      </div>
    </Link>
  );
}
