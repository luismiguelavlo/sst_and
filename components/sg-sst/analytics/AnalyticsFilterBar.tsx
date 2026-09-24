"use client";

import type { ReactNode } from "react";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import type { AnalyticsPeriodFilter } from "@/lib/sg-sst/analytics/filters";

const MONTHS = [
  { value: "all", label: "Año completo" },
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
] as const;

type AnalyticsFilterBarProps = {
  filters: AnalyticsPeriodFilter;
  years: number[];
  companies: string[];
  areas: string[];
  farms: SstFarm[];
  pending?: boolean;
  onChange: (next: AnalyticsPeriodFilter) => void;
};

export function AnalyticsFilterBar({
  filters,
  years,
  companies,
  areas,
  farms,
  pending = false,
  onChange,
}: Readonly<AnalyticsFilterBarProps>) {
  function patch<K extends keyof AnalyticsPeriodFilter>(
    key: K,
    value: AnalyticsPeriodFilter[K],
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-wrap items-end gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <FilterField label="Año">
        <select
          disabled={pending}
          value={filters.year}
          onChange={(e) => patch("year", Number(e.target.value))}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-sm font-body-sm text-body-sm"
        >
          {years.includes(filters.year) ? null : (
            <option value={filters.year}>{filters.year}</option>
          )}
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Mes">
        <select
          disabled={pending}
          value={String(filters.month)}
          onChange={(e) => {
            const v = e.target.value;
            patch("month", v === "all" ? "all" : Number(v));
          }}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-sm font-body-sm text-body-sm"
        >
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Empresa">
        <select
          disabled={pending}
          value={filters.company}
          onChange={(e) => patch("company", e.target.value)}
          className="min-w-[180px] rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-sm font-body-sm text-body-sm"
        >
          <option value="all">Todas</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Centro de trabajo">
        <select
          disabled={pending}
          value={filters.farmId}
          onChange={(e) => patch("farmId", e.target.value)}
          className="min-w-[180px] rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-sm font-body-sm text-body-sm"
        >
          <option value="all">Todos</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Área">
        <select
          disabled={pending}
          value={filters.area}
          onChange={(e) => patch("area", e.target.value)}
          className="min-w-[160px] rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-sm font-body-sm text-body-sm"
        >
          <option value="all">Todas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </FilterField>
    </div>
  );
}

function FilterField({
  label,
  children,
}: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <label className="flex flex-col gap-xs">
      <span className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
