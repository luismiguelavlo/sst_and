"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  STATUS_FILTERS,
  progressBarClass,
  statusBadgeClass,
  statusDotClass,
  statusFilterLabel,
  statusLabel,
  type EmployeeAvatar,
  type EmployeeProgressRow,
  type EmployeeProgressStats,
  type StatusFilter,
} from "@/lib/employee-progress";

const PAGE_SIZE = 8;

export function EmployeeProgressDashboard({
  stats,
  rows,
}: Readonly<{ stats: EmployeeProgressStats; rows: readonly EmployeeProgressRow[] }>) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      if (!matchesStatus) {
        return false;
      }
      if (needle.length === 0) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(needle) ||
        row.email.toLowerCase().includes(needle) ||
        row.courseTitle.toLowerCase().includes(needle) ||
        row.deadlineLabel.toLowerCase().includes(needle)
      );
    });
  }, [query, rows, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = (currentPage - 1) * PAGE_SIZE + pageRows.length;

  function cycleStatusFilter() {
    const index = STATUS_FILTERS.indexOf(statusFilter);
    const next = STATUS_FILTERS.at((index + 1) % STATUS_FILTERS.length) ?? "all";
    setStatusFilter(next);
    setPage(1);
  }

  return (
    <div className="flex w-full flex-col gap-md">
      <div>
        <h1 className="font-headline-lg text-on-surface">Progreso de empleados</h1>
        <p className="mt-xs max-w-2xl font-body-md text-on-surface-variant">
          Incluye cursos asignados (aunque no se hayan iniciado), plazos y el avance al abrir cada
          lección.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-3">
        <article className="relative flex flex-col gap-sm overflow-hidden rounded-xl bg-surface-container-lowest p-md shadow-sm transition-shadow hover:shadow-md">
          <div className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/5 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="font-label-md tracking-wider text-on-surface-variant uppercase">
              Completados
            </span>
            <MaterialIcon name="done_all" className="text-primary" />
          </div>
          <div className="flex items-end gap-sm">
            <span className="text-[32px] leading-10 font-display-lg tracking-tight text-primary sm:text-display-lg">
              {stats.totalCompletions.toLocaleString("es-CO")}
            </span>
            <span className="mb-2 font-label-md text-on-surface-variant">cursos cerrados</span>
          </div>
        </article>

        <article className="relative flex flex-col gap-sm overflow-hidden rounded-xl bg-surface-container-lowest p-md shadow-sm transition-shadow hover:shadow-md">
          <div className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 rounded-full bg-secondary/5 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="font-label-md tracking-wider text-on-surface-variant uppercase">
              Avance promedio
            </span>
            <MaterialIcon name="trending_up" className="text-secondary" />
          </div>
          <div className="flex items-end gap-sm">
            <span className="text-[32px] leading-10 font-display-lg tracking-tight text-secondary sm:text-display-lg">
              {stats.avgProgress}%
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-variant">
            <div className="h-full rounded-full bg-secondary" style={{ width: `${stats.avgProgress}%` }} />
          </div>
        </article>

        <article className="relative flex flex-col gap-sm overflow-hidden rounded-xl bg-surface-container-lowest p-md shadow-sm transition-shadow hover:shadow-md">
          <div className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 rounded-full bg-tertiary/5 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="font-label-md tracking-wider text-on-surface-variant uppercase">
              Empleados activos
            </span>
            <MaterialIcon name="group" className="text-tertiary" />
          </div>
          <div className="flex items-end gap-sm">
            <span className="text-[32px] leading-10 font-display-lg tracking-tight text-tertiary sm:text-display-lg">
              {stats.activeEmployees}
            </span>
            {stats.previews.length > 0 ? (
              <div className="mb-2 ml-2 flex -space-x-3">
                {stats.previews.map((preview, index) => (
                  <Image
                    key={preview.src}
                    src={preview.src}
                    alt={preview.alt}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-full border-2 border-surface-container-lowest object-cover"
                    style={{ zIndex: 30 - index * 10 }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </article>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex flex-col items-center justify-between gap-md border-b border-surface-variant bg-surface-container-lowest p-md sm:flex-row">
          <h2 className="font-headline-md tracking-tight text-on-surface">Avance de empleados</h2>
          <div className="flex w-full items-center gap-sm sm:w-auto">
            <label className="flex flex-1 items-center rounded-lg bg-surface-container-low px-sm py-xs transition-all focus-within:ring-2 focus-within:ring-primary sm:w-64">
              <MaterialIcon name="search" className="text-[20px] text-on-surface-variant" />
              <input
                className="ml-xs w-full border-none bg-transparent font-body-sm text-on-surface outline-none placeholder:text-on-surface-variant/70"
                placeholder="Buscar empleados o cursos..."
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <button
              className="flex items-center justify-center rounded-lg bg-surface-container-high p-xs text-on-surface transition-colors hover:bg-surface-container-highest"
              type="button"
              onClick={cycleStatusFilter}
              title={`Filtro: ${statusFilterLabel(statusFilter)}`}
            >
              <MaterialIcon name="filter_list" />
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-md py-sm font-label-sm tracking-wider text-on-surface-variant uppercase whitespace-nowrap">
                  Empleado
                </th>
                <th className="px-md py-sm font-label-sm tracking-wider text-on-surface-variant uppercase whitespace-nowrap">
                  Curso
                </th>
                <th className="px-md py-sm font-label-sm tracking-wider text-on-surface-variant uppercase whitespace-nowrap">
                  Plazo
                </th>
                <th className="px-md py-sm font-label-sm tracking-wider text-on-surface-variant uppercase whitespace-nowrap">
                  Estado
                </th>
                <th className="px-md py-sm font-label-sm tracking-wider text-on-surface-variant uppercase whitespace-nowrap">
                  Avance
                </th>
                <th className="px-md py-sm text-right font-label-sm tracking-wider text-on-surface-variant uppercase whitespace-nowrap">
                  Lecciones
                </th>
                <th className="px-md py-sm text-right font-label-sm tracking-wider text-on-surface-variant uppercase whitespace-nowrap">
                  Última visita
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/50">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-md py-xl text-center font-body-md text-on-surface-variant">
                    {rows.length === 0
                      ? "Aún no hay empleados. Crea accesos en Accesos para ver su avance aquí."
                      : "Ningún empleado coincide con la búsqueda o el filtro."}
                  </td>
                </tr>
              ) : (
                pageRows.map((row, index) => (
                  <ProgressRow key={row.id} row={row} striped={index % 2 === 1} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-start justify-between gap-sm border-t border-surface-variant bg-surface-container-lowest p-sm sm:flex-row sm:items-center">
          <span className="font-label-sm text-on-surface-variant">
            Mostrando {rangeStart} a {rangeEnd} de {filtered.length} registros
          </span>
          <div className="flex items-center gap-xs">
            <button
              className="rounded p-xs text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-50"
              type="button"
              disabled={currentPage === 1}
              aria-label="Página anterior"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <MaterialIcon name="chevron_left" className="text-[20px]" />
            </button>
            <div className="flex items-center gap-xs font-label-sm">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={
                    pageNumber === currentPage
                      ? "flex h-6 w-6 items-center justify-center rounded bg-primary text-on-primary"
                      : "flex h-6 w-6 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container"
                  }
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button
              className="rounded p-xs text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-50"
              type="button"
              disabled={currentPage === pageCount}
              aria-label="Página siguiente"
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              <MaterialIcon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ row, striped }: Readonly<{ row: EmployeeProgressRow; striped: boolean }>) {
  return (
    <tr
      className={
        striped
          ? "bg-surface/30 transition-colors hover:bg-surface-container-lowest/50"
          : "transition-colors hover:bg-surface-container-lowest/50"
      }
    >
      <td className="px-md py-sm">
        <div className="flex items-center gap-sm">
          <EmployeeAvatarView avatar={row.avatar} />
          <div>
            <div className="font-label-md text-on-surface">{row.name}</div>
            <div className="font-label-sm font-normal text-on-surface-variant">{row.email}</div>
          </div>
        </div>
      </td>
      <td className="max-w-[200px] truncate px-md py-sm font-body-sm font-medium text-on-surface">
        <div className="truncate">{row.courseTitle}</div>
        {row.isAssigned && row.courseTitle !== "Sin cursos" ? (
          <div className="font-label-sm font-normal text-on-surface-variant">Asignado</div>
        ) : null}
      </td>
      <td className="px-md py-sm font-body-sm text-on-surface-variant whitespace-nowrap">
        {row.deadlineLabel}
      </td>
      <td className="px-md py-sm">
        <span
          className={`inline-flex items-center gap-xs rounded px-xs py-[2px] font-label-sm ${statusBadgeClass(row.status)}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass(row.status)}`} />
          {statusLabel(row.status)}
        </span>
      </td>
      <td className="px-md py-sm">
        <div className="flex w-32 items-center gap-sm">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-variant">
            <div
              className={`h-full rounded-full ${progressBarClass(row.status)}`}
              style={{ width: `${row.progressPercent}%` }}
            />
          </div>
          <span className="w-8 font-label-sm text-on-surface-variant">{row.progressPercent}%</span>
        </div>
      </td>
      <td className="px-md py-sm text-right font-body-sm text-on-surface">{row.lessonsLabel}</td>
      <td className="px-md py-sm text-right font-label-sm font-normal text-on-surface-variant">
        {row.activityLabel}
      </td>
    </tr>
  );
}

function EmployeeAvatarView({ avatar }: Readonly<{ avatar: EmployeeAvatar }>) {
  if (avatar.kind === "photo") {
    return (
      <Image
        src={avatar.src}
        alt={avatar.alt}
        width={40}
        height={40}
        unoptimized
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-label-md ${avatar.className}`}>
      {avatar.initials}
    </div>
  );
}
