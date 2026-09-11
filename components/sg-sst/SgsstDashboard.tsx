"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { SgsstHomeMetrics } from "@/lib/sg-sst/dashboard/actions";
import { SGSST_BASE, SGSST_NAV } from "@/lib/sg-sst/nav";

type SgsstDashboardProps = {
  metrics: SgsstHomeMetrics;
};

export function SgsstDashboard({ metrics }: Readonly<SgsstDashboardProps>) {
  return (
    <div className="flex w-full flex-col">
      <NormativeBanner farmCount={metrics.farms.length} />
      <PageHeader />
      <KpiGrid metrics={metrics} />
      <AlertSummary metrics={metrics} />
      <ModuleDirectory />
    </div>
  );
}

function NormativeBanner({ farmCount }: Readonly<{ farmCount: number }>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-base bg-surface-container-low px-gutter py-sm text-on-surface">
      <div className="flex flex-wrap items-center gap-sm">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary font-label-sm text-label-sm text-on-primary">
          <MaterialIcon name="verified" className="text-[16px]" />
        </span>
        <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
          MARCO LEGAL VIGENTE COLOMBIA:
        </span>
        <span className="font-body-sm text-body-sm text-on-surface">
          Decreto Único Reglamentario 1072/2015 • Estándares Mínimos Res. 0312/2019 • Seguridad en
          Alturas Res. 4272/2021
        </span>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant">
        {farmCount} predio{farmCount === 1 ? "" : "s"} en operación
      </span>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col justify-between gap-md px-gutter pt-md pb-base md:flex-row md:items-end">
      <div>
        <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
          <MaterialIcon name="shield" className="text-[16px]" />
          <span>Panel Táctico Gerencial</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
          PANEL DE CONTROL SG-SST
        </h1>
        <p className="mt-xs max-w-4xl font-body-md text-body-md text-on-surface-variant">
          Indicadores operativos alimentados por los módulos activos del sistema.
        </p>
      </div>
      <Link
        href={`${SGSST_BASE}/alertas-sst`}
        className="inline-flex items-center gap-sm rounded-xl bg-primary px-md py-sm font-label-md text-label-md font-semibold text-on-primary shadow-sm"
      >
        <MaterialIcon name="radar" />
        Ir a Alertas SST
      </Link>
    </div>
  );
}

function KpiGrid({ metrics }: Readonly<{ metrics: SgsstHomeMetrics }>) {
  const daysLabel =
    metrics.daysWithoutAt === null ? "Sin AT registrados" : `${metrics.daysWithoutAt}`;

  return (
    <section className="px-gutter py-sm">
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          href={`${SGSST_BASE}/trabajadores`}
          eyebrow="Censo laboral"
          icon="badge"
          value={String(metrics.workersActive)}
          trend={<span className="font-label-sm text-label-sm text-on-surface-variant">activos</span>}
          title="Trabajadores activos"
          footer={
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Total histórico: {metrics.workersTotal}
            </span>
          }
        />
        <KpiCard
          href={`${SGSST_BASE}/accidentes-e-incidentes`}
          eyebrow="Siniestralidad"
          icon="emergency"
          value={String(metrics.accidentsAt)}
          trend={
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              AT · {metrics.incidents} incidentes
            </span>
          }
          title="Accidentes de trabajo"
          footer={
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Días de incapacidad AT: {metrics.lostDays}
            </span>
          }
        />
        <KpiCard
          href={`${SGSST_BASE}/accidentes-e-incidentes`}
          eyebrow="Récord de seguridad"
          icon="trophy"
          value={daysLabel}
          valueClassName="text-primary"
          trend={
            metrics.daysWithoutAt !== null ? (
              <span className="font-label-sm text-label-sm text-on-surface-variant">días</span>
            ) : null
          }
          title="Días sin accidente de trabajo"
          footer={
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Desde el último AT registrado
            </span>
          }
        />
        <KpiCard
          href={`${SGSST_BASE}/incapacidades-y-reintegros`}
          eyebrow="Ausentismo"
          icon="event_busy"
          value={String(metrics.leaveDays)}
          trend={<span className="font-label-sm text-label-sm text-on-surface-variant">días</span>}
          title="Días de incapacidad"
          footer={
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Acumulado en incapacidades registradas
            </span>
          }
        />
        <KpiCard
          href={`${SGSST_BASE}/casos-de-salud`}
          eyebrow="Vigilancia médica"
          icon="clinical_notes"
          value={String(metrics.healthCasesOpen)}
          trend={<span className="font-label-sm text-label-sm text-on-surface-variant">abiertos</span>}
          title="Casos de salud"
          footer={
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Incluye seguimiento activo
            </span>
          }
        />
        <KpiCard
          href={`${SGSST_BASE}/restricciones-y-recomendaciones`}
          eyebrow="Adecuación de cargo"
          icon="pan_tool"
          value={String(metrics.restrictionsActive)}
          trend={
            <span className="font-label-sm text-label-sm text-on-surface-variant">trabajadores</span>
          }
          title="Restricciones vigentes"
          footer={
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Con seguimiento de implementación
            </span>
          }
        />
        <KpiCard
          href={`${SGSST_BASE}/examenes-medicos-ocupacionales`}
          eyebrow="EMOs"
          icon="stethoscope"
          value={String(metrics.emosCritical + metrics.emosProximos)}
          trend={
            <span className="font-label-sm text-label-sm text-on-surface-variant">a gestionar</span>
          }
          title="EMOs críticos / próximos"
          footer={
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Críticos: {metrics.emosCritical} · Próximos: {metrics.emosProximos}
            </span>
          }
        />
        <KpiCard
          href={`${SGSST_BASE}/acciones-correctivas`}
          eyebrow="CAPA"
          icon="build"
          value={String(metrics.actionsOpen)}
          trend={
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {metrics.actionsOverdue} vencidas
            </span>
          }
          title="Acciones abiertas"
          footer={
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Correctivas, preventivas y de mejora
            </span>
          }
        />
      </div>
    </section>
  );
}

function AlertSummary({ metrics }: Readonly<{ metrics: SgsstHomeMetrics }>) {
  const cards = [
    {
      label: "Críticas",
      value: metrics.alertsCritical,
      className: "bg-error-container text-on-error-container",
      href: `${SGSST_BASE}/alertas-sst`,
    },
    {
      label: "Próximas",
      value: metrics.alertsProximos,
      className: "bg-secondary-fixed text-on-secondary-fixed",
      href: `${SGSST_BASE}/alertas-sst/matriz`,
    },
    {
      label: "Seguimiento",
      value: metrics.alertsSeguimiento,
      className: "bg-surface-container-high text-on-surface",
      href: `${SGSST_BASE}/alertas-sst/matriz`,
    },
  ];

  return (
    <section className="px-gutter py-sm">
      <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <div className="mb-md flex flex-wrap items-center justify-between gap-base">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Radar de alertas</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Semáforo consolidado desde registros de cumplimiento de todos los módulos.
            </p>
          </div>
          <Link
            href={`${SGSST_BASE}/alertas-sst`}
            className="font-label-md text-label-md font-semibold text-primary"
          >
            Ver radar completo →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className={`rounded-xl px-md py-md transition-opacity hover:opacity-90 ${card.className}`}
            >
              <div className="font-label-sm text-label-sm uppercase tracking-wider opacity-80">
                {card.label}
              </div>
              <div className="mt-xs font-display-lg text-display-lg leading-none font-bold">
                {card.value}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleDirectory() {
  const sections = SGSST_NAV.filter((section) => section.title !== "Principal");

  return (
    <section className="space-y-md px-gutter py-md pb-lg">
      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface">Módulos operativos</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Acceso directo a las pantallas implementadas del SG-SST.
        </p>
      </div>
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-sm font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 gap-sm sm:grid-cols-2 xl:grid-cols-3">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-sm rounded-xl bg-surface-container-lowest px-md py-sm shadow-sm transition-colors hover:bg-surface-container"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-primary">
                  <MaterialIcon name={item.icon} />
                </span>
                <span className="font-label-md text-label-md font-semibold text-on-surface">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

type KpiCardProps = {
  href: string;
  eyebrow: string;
  icon: string;
  value: string;
  valueClassName?: string;
  trend: React.ReactNode;
  title: string;
  footer: React.ReactNode;
};

function KpiCard({
  href,
  eyebrow,
  icon,
  value,
  valueClassName = "text-primary",
  trend,
  title,
  footer,
}: Readonly<KpiCardProps>) {
  return (
    <Link
      href={href}
      className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-md shadow-sm transition-shadow hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
            {eyebrow}
          </span>
          <span className="rounded-lg bg-surface-container p-xs text-primary">
            <MaterialIcon name={icon} className="text-[20px]" />
          </span>
        </div>
        <div className="mt-sm flex items-baseline gap-base">
          <span className={`font-display-lg text-display-lg leading-none ${valueClassName}`}>
            {value}
          </span>
          {trend}
        </div>
        <p className="mt-xs font-label-md text-label-md font-semibold text-on-surface">{title}</p>
      </div>
      <div className="-mx-md -mb-md mt-md rounded-b-xl bg-surface-container-low px-md py-sm">
        {footer}
      </div>
    </Link>
  );
}
