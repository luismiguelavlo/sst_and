"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TraceabilityScreen } from "@/components/sg-sst/trazabilidad/TraceabilityScreen";
import type { FichaRow, WorkerSstFicha } from "@/lib/sg-sst/search/types";
import type { SstAuditEvent } from "@/lib/sg-sst/trazabilidad/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type Props = {
  ficha: WorkerSstFicha;
  auditEvents?: SstAuditEvent[];
  auditTotal?: number;
};

export function WorkerSstFichaScreen({
  ficha,
  auditEvents = [],
  auditTotal = 0,
}: Readonly<Props>) {
  const { worker } = ficha;

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <div className="flex flex-wrap items-start justify-between gap-md">
        <div>
          <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
            <MaterialIcon name="badge" className="text-[16px]" />
            Ficha SST del trabajador
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            {worker.fullName}
          </h1>
          <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
            Trazabilidad completa: salud, riesgos, formación y controles operativos.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <Link
            href={`${SGSST_BASE}/trabajadores/${worker.id}`}
            className="inline-flex items-center gap-xs rounded-lg bg-surface-container px-sm py-sm font-label-md text-label-md"
          >
            <MaterialIcon name="edit" className="text-[18px]" />
            Editar ficha laboral
          </Link>
          <Link
            href={`${SGSST_BASE}/trabajadores`}
            className="inline-flex items-center gap-xs rounded-lg bg-primary px-sm py-sm font-label-md text-label-md font-semibold text-on-primary"
          >
            Volver a trabajadores
          </Link>
        </div>
      </div>

      <section className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Información laboral
        </h2>
        <div className="mt-sm grid grid-cols-1 gap-sm sm:grid-cols-2 xl:grid-cols-4">
          <Info label="Documento" value={`${worker.documentType} ${worker.documentNumber}`} />
          <Info label="Código" value={worker.workerCode || "—"} />
          <Info label="Cargo" value={worker.jobTitle} />
          <Info label="Estado" value={worker.status} />
          <Info label="Empresa" value={worker.company} />
          <Info label="Área" value={worker.area || "—"} />
          <Info label="Centro de trabajo" value={worker.workCenter || "—"} />
          <Info label="Finca" value={worker.farmName || "—"} />
          <Info label="Ingreso" value={worker.hireDate || "—"} />
          <Info label="Nivel de riesgo" value={String(worker.riskLevel)} />
          <Info
            label="Perfiles"
            value={[
              worker.worksHeights ? "Alturas" : null,
              worker.drives ? "PESV" : null,
              worker.operatesTractor ? "Tractor" : null,
            ]
              .filter(Boolean)
              .join(" · ") || "General"}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-md xl:grid-cols-2">
        <FichaSection title="Exámenes médicos" icon="stethoscope" rows={ficha.exams} />
        <FichaSection title="Restricciones" icon="pan_tool" rows={ficha.restrictions} />
        <FichaSection title="Incapacidades" icon="calendar_today" rows={ficha.leaves} />
        <FichaSection title="Accidentes / incidentes" icon="emergency" rows={ficha.accidents} />
        <FichaSection title="Capacitaciones" icon="school" rows={ficha.trainings} />
        <FichaSection title="EPP entregado" icon="safety_check" rows={ficha.epp} />
        <FichaSection title="Trabajo en alturas" icon="stairs" rows={ficha.heights} />
        <FichaSection title="PESV" icon="directions_car" rows={ficha.pesv} />
        <FichaSection title="Tractor / operadores" icon="precision_manufacturing" rows={ficha.tractor} />
        <FichaSection title="Casos abiertos" icon="clinical_notes" rows={ficha.healthCases} />
        <FichaSection
          title="Inspecciones del centro"
          icon="rule"
          rows={ficha.inspections}
          className="xl:col-span-2"
        />
      </div>

      <section className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <TraceabilityScreen
          compact
          workerId={worker.id}
          title="Historial de cambios"
          initialEvents={auditEvents}
          initialTotal={auditTotal}
        />
      </section>
    </div>
  );
}

function Info({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <div className="font-label-sm text-label-sm text-on-surface-variant">{label}</div>
      <div className="font-label-md text-label-md font-semibold text-on-surface">{value}</div>
    </div>
  );
}

function FichaSection({
  title,
  icon,
  rows,
  className = "",
}: Readonly<{
  title: string;
  icon: string;
  rows: FichaRow[];
  className?: string;
}>) {
  return (
    <section className={`rounded-xl bg-surface-container-lowest p-md shadow-sm ${className}`}>
      <div className="mb-sm flex items-center justify-between gap-sm">
        <h2 className="flex items-center gap-xs font-headline-md text-headline-md text-on-surface">
          <MaterialIcon name={icon} className="text-[20px] text-primary" />
          {title}
        </h2>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {rows.length}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm text-on-surface-variant">
          Sin registros
        </p>
      ) : (
        <ul className="flex flex-col gap-sm">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={row.href}
                className="block rounded-lg bg-surface-container-low px-sm py-sm transition-colors hover:bg-surface-container"
              >
                <div className="flex items-baseline justify-between gap-sm">
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {row.title}
                  </span>
                  <span className="shrink-0 font-label-sm text-label-sm text-on-surface-variant">
                    {row.date ?? "—"}
                  </span>
                </div>
                <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                  {row.detail}
                </p>
                <p className="mt-0.5 font-label-sm text-[11px] uppercase tracking-wider text-outline">
                  {row.status.replaceAll("_", " ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
