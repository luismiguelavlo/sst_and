"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useSgsstGlobalFilters } from "@/components/sg-sst/filters/SgsstGlobalFiltersContext";
import { GLOBAL_MONTH_OPTIONS } from "@/lib/sg-sst/filters/global";

export function SgsstGlobalFilterBar() {
  const { filters, patchFilters, resetFilters, activeCount, options, farms, workers, ready } =
    useSgsstGlobalFilters();

  return (
    <div className="border-b border-outline-variant/30 bg-surface-container-lowest/95 px-gutter py-sm backdrop-blur">
      <div className="mb-xs flex flex-wrap items-center justify-between gap-sm">
        <div className="flex items-center gap-xs font-label-sm text-label-sm font-semibold tracking-wider text-primary uppercase">
          <MaterialIcon name="filter_list" className="text-[16px]" />
          Filtros globales
          {activeCount > 0 ? (
            <span className="rounded-full bg-primary px-2 py-0.5 font-label-sm text-[10px] text-on-primary normal-case tracking-normal">
              {activeCount} activos
            </span>
          ) : null}
        </div>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={resetFilters}
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end gap-sm">
        <FilterSelect
          label="Año"
          value={String(filters.year)}
          disabled={!ready}
          onChange={(v) => patchFilters({ year: v === "all" ? "all" : Number(v) })}
        >
          <option value="all">Todos</option>
          {options.years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Mes"
          value={String(filters.month)}
          disabled={!ready}
          onChange={(v) => patchFilters({ month: v === "all" ? "all" : Number(v) })}
        >
          {GLOBAL_MONTH_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Empresa"
          value={filters.company}
          disabled={!ready}
          onChange={(v) => patchFilters({ company: v })}
          wide
        >
          <option value="all">Todas</option>
          {options.companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Finca / centro"
          value={filters.farmId}
          disabled={!ready}
          onChange={(v) => patchFilters({ farmId: v })}
          wide
        >
          <option value="all">Todos</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Centro de trabajo"
          value={filters.workCenter}
          disabled={!ready}
          onChange={(v) => patchFilters({ workCenter: v })}
          wide
        >
          <option value="all">Todos</option>
          {options.workCenters.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Área"
          value={filters.area}
          disabled={!ready}
          onChange={(v) => patchFilters({ area: v })}
          wide
        >
          <option value="all">Todas</option>
          {options.areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Trabajador"
          value={filters.workerId}
          disabled={!ready}
          onChange={(v) => patchFilters({ workerId: v })}
          wide
        >
          <option value="all">Todos</option>
          {workers.map((w) => (
            <option key={w.id} value={w.id}>
              {w.fullName} · {w.documentNumber}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Estado laboral"
          value={filters.status}
          disabled={!ready}
          onChange={(v) => patchFilters({ status: v })}
        >
          <option value="all">Todos</option>
          {options.statuses.map((s) => (
            <option key={s} value={s}>
              {s === "activo" ? "Activo" : s === "retirado" ? "Retirado" : s}
            </option>
          ))}
        </FilterSelect>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
  disabled,
  wide = false,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  wide?: boolean;
}>) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="font-label-sm text-[11px] text-on-surface-variant">{label}</span>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-sm py-1.5 font-body-sm text-body-sm ${
          wide ? "min-w-[160px]" : "min-w-[110px]"
        }`}
      >
        {children}
      </select>
    </label>
  );
}
