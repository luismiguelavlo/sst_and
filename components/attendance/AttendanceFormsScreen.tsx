"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import { deleteAttendanceFormAction, exportAttendanceResponsesAction } from "@/lib/attendance/actions";
import type { AttendanceFormListItem, AttendanceFormStatus } from "@/lib/attendance";

const PAGE_SIZE = 8;

type DateFilter = "all" | "7d" | "30d" | "90d";
type StatusFilter = "all" | AttendanceFormStatus;

export function AttendanceFormsScreen({
  forms,
}: Readonly<{ forms: readonly AttendanceFormListItem[] }>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const now = Date.now();
    const windowMs =
      dateFilter === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : dateFilter === "30d"
          ? 30 * 24 * 60 * 60 * 1000
          : dateFilter === "90d"
            ? 90 * 24 * 60 * 60 * 1000
            : null;

    return forms.filter((form) => {
      if (statusFilter !== "all" && form.status !== statusFilter) {
        return false;
      }
      if (windowMs !== null) {
        const created = new Date(form.createdAtIso).getTime();
        if (Number.isNaN(created) || now - created > windowMs) {
          return false;
        }
      }
      if (needle.length === 0) {
        return true;
      }
      return (
        form.title.toLowerCase().includes(needle) ||
        form.topic.toLowerCase().includes(needle) ||
        form.responsibleName.toLowerCase().includes(needle)
      );
    });
  }, [dateFilter, forms, query, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allPageSelected =
    pageRows.length > 0 && pageRows.every((row) => selected.includes(row.id));
  const somePageSelected = pageRows.some((row) => selected.includes(row.id));

  function toggleSelectAll() {
    if (allPageSelected) {
      setSelected((current) => current.filter((id) => !pageRows.some((row) => row.id === id)));
      return;
    }
    setSelected((current) => {
      const next = new Set(current);
      for (const row of pageRows) {
        next.add(row.id);
      }
      return [...next];
    });
  }

  function toggleRow(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function onDelete(id: string, title: string) {
    if (!window.confirm(`¿Eliminar el formulario «${title}»?`)) {
      return;
    }
    setDeletingId(id);
    const result = await deleteAttendanceFormAction(id);
    setDeletingId(null);
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      return;
    }
    setSelected((current) => current.filter((item) => item !== id));
    showToast("Formulario eliminado.");
    router.refresh();
  }

  async function copyShareLink(form: AttendanceFormListItem) {
    if (form.status !== "published") {
      showToast("Publica el formulario antes de compartir el enlace.", { variant: "error" });
      return;
    }
    const url = `${window.location.origin}/my-attendance/${form.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Enlace copiado al portapapeles.");
    } catch {
      showToast("No se pudo copiar el enlace.", { variant: "error" });
    }
  }

  async function exportSelected() {
    if (selected.length === 0) {
      return;
    }
    const result = await exportAttendanceResponsesAction(selected);
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      return;
    }
    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = result.fileName;
    anchor.click();
    URL.revokeObjectURL(href);
    showToast("Resultados descargados (Excel/CSV).");
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-md">
      <header className="mb-md flex flex-col justify-between gap-md md:mb-lg md:flex-row md:items-end">
        <div className="space-y-xs">
          <h1 className="font-display-lg tracking-tight text-on-surface">
            Gestión de Formularios de Asistencia
          </h1>
          <p className="max-w-2xl font-body-lg text-on-surface-variant">
            Administre, analice y comparta todos los registros de asistencia generados. Seleccione
            formularios para exportar datos agregados.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-sm">
          <button
            type="button"
            className="group flex items-center gap-xs rounded-lg bg-surface-container-high px-md py-sm font-label-md text-on-surface shadow-sm transition-all hover:bg-surface-container-highest"
            onClick={() => setFiltersOpen((value) => !value)}
          >
            <MaterialIcon
              name="filter_list"
              className="text-[20px] text-outline transition-colors group-hover:text-primary"
            />
            Filtros Avanzados
          </button>
          <Link
            href="/assign-attendance"
            className="flex items-center gap-xs rounded-lg bg-surface-container-high px-md py-sm font-label-md text-on-surface shadow-sm transition-all hover:bg-surface-container-highest"
          >
            <MaterialIcon name="group_add" className="text-[20px]" />
            Asignar
          </Link>
          <Link
            href="/attendance-forms/new"
            className="flex items-center gap-xs rounded-lg bg-secondary-container px-md py-sm font-label-md text-on-secondary-container shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <MaterialIcon name="add" className="text-[20px]" />
            Nuevo
          </Link>
          <button
            type="button"
            disabled={selected.length === 0}
            className="group flex items-center gap-xs rounded-lg bg-primary px-lg py-sm font-label-md text-on-primary shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-sm disabled:transform-none"
            onClick={() => {
              void exportSelected();
            }}
          >
            <MaterialIcon name="download" className="text-[20px]" />
            Descargar Resultados (Excel)
            {selected.length > 0 ? (
              <span className="ml-xs rounded-full bg-on-primary px-2 py-0.5 text-[10px] font-bold text-primary">
                {selected.length}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      <div className="relative mb-md overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-sm shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center justify-between gap-sm md:flex-row">
          <div className="w-full flex-1 md:w-auto">
            <div className="flex items-center rounded-lg bg-surface-container px-md py-sm transition-colors focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary hover:bg-surface-container-high">
              <MaterialIcon name="search" className="mr-sm text-outline" />
              <input
                className="w-full border-none bg-transparent font-body-md text-on-surface outline-none placeholder:text-outline-variant"
                placeholder="Buscar por nombre de formulario, curso o instructor..."
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
          <div className="z-10 flex w-full items-center gap-sm md:w-auto">
            <FilterSelect
              icon="calendar_today"
              value={dateFilter}
              onChange={(value) => {
                setDateFilter(value as DateFilter);
                setPage(1);
              }}
              options={[
                { value: "all", label: "Cualquier fecha" },
                { value: "7d", label: "Últimos 7 días" },
                { value: "30d", label: "Últimos 30 días" },
                { value: "90d", label: "Últimos 90 días" },
              ]}
            />
            <div className="hidden h-8 w-px bg-outline-variant/30 md:block" />
            <FilterSelect
              icon="toggle_on"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value as StatusFilter);
                setPage(1);
              }}
              options={[
                { value: "all", label: "Todos los Estados" },
                { value: "published", label: "Activo" },
                { value: "draft", label: "Borrador" },
              ]}
            />
          </div>
        </div>

        {filtersOpen ? (
          <div className="relative z-10 mt-sm grid gap-sm border-t border-outline-variant/20 pt-sm md:grid-cols-3">
            <p className="font-body-sm text-on-surface-variant md:col-span-3">
              Mostrando {filtered.length} de {forms.length} formularios con los filtros actuales.
              Las respuestas detalladas aparecerán cuando se habilite el registro de asistencia.
            </p>
          </div>
        ) : null}
      </div>

      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-md">
        {pageRows.length === 0 ? (
          <div className="p-lg text-center">
            <MaterialIcon name="assignment" className="mx-auto text-[40px] text-outline" />
            <p className="mt-sm font-headline-md text-on-surface">Sin formularios</p>
            <p className="mt-xs font-body-sm text-on-surface-variant">
              {forms.length === 0
                ? "Crea el primero para registrar asistencia en capacitaciones o eventos."
                : "Ningún formulario coincide con la búsqueda o los filtros."}
            </p>
            {forms.length === 0 ? (
              <Link
                href="/attendance-forms/new"
                className="mt-md inline-flex items-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary"
              >
                <MaterialIcon name="add" />
                Nuevo formulario
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  <th className="w-12 p-md">
                    <Checkbox
                      checked={allPageSelected}
                      indeterminate={somePageSelected && !allPageSelected}
                      onChange={toggleSelectAll}
                      ariaLabel="Seleccionar todos"
                    />
                  </th>
                  <th className="p-md font-label-sm tracking-wider text-outline uppercase">
                    Nombre del Formulario
                  </th>
                  <th className="hidden p-md font-label-sm tracking-wider text-outline uppercase sm:table-cell">
                    Fecha de Creación
                  </th>
                  <th className="p-md text-right font-label-sm tracking-wider text-outline uppercase">
                    Respuestas
                  </th>
                  <th className="p-md font-label-sm tracking-wider text-outline uppercase">Estado</th>
                  <th className="p-md text-right font-label-sm tracking-wider text-outline uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {pageRows.map((form) => {
                  const isSelected = selected.includes(form.id);
                  const isActive = form.status === "published";
                  return (
                    <tr
                      key={form.id}
                      className={
                        isSelected
                          ? "group bg-primary/5 transition-colors"
                          : "group cursor-default transition-colors hover:bg-surface-container-lowest/50"
                      }
                    >
                      <td className="p-md">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleRow(form.id)}
                          ariaLabel={`Seleccionar ${form.title}`}
                        />
                      </td>
                      <td className="p-md">
                        <div className="flex items-center gap-sm">
                          <div
                            className={
                              isActive
                                ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container/20 text-primary"
                                : "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest text-outline"
                            }
                          >
                            <MaterialIcon name="description" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate font-label-md text-on-surface">{form.title}</h3>
                            <p className="truncate font-body-sm text-on-surface-variant">
                              {form.topic || "Sin tema"} · {form.responsibleName || "Sin responsable"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden p-md font-body-sm text-on-surface-variant sm:table-cell">
                        {form.createdAtLabel}
                        <br />
                        <span className="text-[12px] text-outline">{form.createdAtTimeLabel}</span>
                      </td>
                      <td className="p-md text-right">
                        <div className="inline-flex items-center gap-xs rounded-full bg-surface-container px-2 py-1">
                          <span className="font-label-md text-on-surface">{form.responseCount}</span>
                          <span className="font-body-sm text-on-surface-variant">
                            / {form.assigneeCount}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                          <div
                            className={
                              isActive
                                ? form.responseCount > 0
                                  ? "h-full rounded-full bg-secondary"
                                  : "h-full w-full animate-pulse rounded-full bg-secondary opacity-30"
                                : "h-full rounded-full bg-outline"
                            }
                            style={{
                              width:
                                isActive && form.responseCount > 0
                                  ? "100%"
                                  : isActive
                                    ? "100%"
                                    : "0%",
                            }}
                          />
                        </div>
                      </td>
                      <td className="p-md">
                        {isActive ? (
                          <span className="inline-flex items-center gap-xs rounded-full bg-secondary-container/20 px-2 py-1 font-label-sm text-on-surface">
                            <span className="h-2 w-2 rounded-full bg-secondary" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-xs rounded-full bg-surface-container-highest px-2 py-1 font-label-sm text-on-surface-variant">
                            <span className="h-2 w-2 rounded-full bg-outline" />
                            Borrador
                          </span>
                        )}
                      </td>
                      <td className="p-md text-right">
                        <div className="flex items-center justify-end gap-xs opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                          <Link
                            href={`/assign-attendance?formId=${form.id}`}
                            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                            aria-label="Asignar empleados"
                            title="Asignar empleados"
                          >
                            <MaterialIcon name="group_add" className="text-[20px]" />
                          </Link>
                          <Link
                            href={`/attendance-forms/${form.id}/edit`}
                            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                            aria-label="Ver / editar"
                            title="Ver / editar"
                          >
                            <MaterialIcon name="visibility" className="text-[20px]" />
                          </Link>
                          <Link
                            href={`/attendance-forms/${form.id}/edit`}
                            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-secondary"
                            aria-label="Editar"
                            title="Editar"
                          >
                            <MaterialIcon name="edit" className="text-[20px]" />
                          </Link>
                          <button
                            type="button"
                            disabled={!isActive}
                            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary disabled:cursor-not-allowed disabled:text-outline"
                            aria-label="Compartir link"
                            title="Compartir link"
                            onClick={() => {
                              void copyShareLink(form);
                            }}
                          >
                            <MaterialIcon name="share" className="text-[20px]" />
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === form.id}
                            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-error-container hover:text-error disabled:opacity-50"
                            aria-label="Eliminar"
                            title="Eliminar"
                            onClick={() => {
                              void onDelete(form.id, form.title);
                            }}
                          >
                            <MaterialIcon name="delete" className="text-[20px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-low p-sm">
          <span className="font-body-sm text-on-surface-variant">
            {filtered.length === 0
              ? "Sin resultados"
              : `Mostrando ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, filtered.length)} de ${filtered.length} formularios`}
          </span>
          <div className="flex items-center gap-xs">
            <button
              type="button"
              className="rounded p-1 text-outline transition-colors hover:bg-surface-container-highest disabled:opacity-50"
              disabled={currentPage <= 1}
              aria-label="Página anterior"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <MaterialIcon name="chevron_left" className="text-[20px]" />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1)
              .filter((pageNumber) => {
                if (pageCount <= 5) {
                  return true;
                }
                return (
                  pageNumber === 1 ||
                  pageNumber === pageCount ||
                  Math.abs(pageNumber - currentPage) <= 1
                );
              })
              .map((pageNumber, index, list) => {
                const prev = list[index - 1];
                const showEllipsis = prev !== undefined && pageNumber - prev > 1;
                return (
                  <span key={pageNumber} className="flex items-center gap-1">
                    {showEllipsis ? (
                      <span className="flex h-8 w-8 items-center justify-center text-outline">…</span>
                    ) : null}
                    <button
                      type="button"
                      className={
                        pageNumber === currentPage
                          ? "flex h-8 w-8 items-center justify-center rounded bg-primary font-label-sm text-on-primary"
                          : "flex h-8 w-8 items-center justify-center rounded font-label-sm text-on-surface transition-colors hover:bg-surface-container-highest"
                      }
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </span>
                );
              })}
            <button
              type="button"
              className="rounded p-1 text-on-surface transition-colors hover:bg-surface-container-highest disabled:opacity-50"
              disabled={currentPage >= pageCount}
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

function FilterSelect({
  icon,
  value,
  onChange,
  options,
}: Readonly<{
  icon: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
}>) {
  const label = options.find((option) => option.value === value)?.label ?? value;
  return (
    <label className="group relative flex cursor-pointer items-center gap-xs rounded-lg border border-transparent bg-surface-container px-sm py-sm transition-colors hover:border-outline-variant/30 hover:bg-surface-container-high">
      <MaterialIcon
        name={icon}
        className="text-[20px] text-outline transition-colors group-hover:text-on-surface"
      />
      <span className="font-label-md text-on-surface-variant group-hover:text-on-surface">
        {label}
      </span>
      <MaterialIcon
        name="expand_more"
        className="text-[18px] text-outline group-hover:text-on-surface"
      />
      <select
        className="absolute inset-0 cursor-pointer opacity-0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
}: Readonly<{
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel: string;
}>) {
  return (
    <label className="relative flex cursor-pointer items-center">
      <input
        className="peer sr-only"
        type="checkbox"
        checked={checked}
        ref={(element) => {
          if (element) {
            element.indeterminate = indeterminate;
          }
        }}
        onChange={onChange}
        aria-label={ariaLabel}
      />
      <div className="flex h-5 w-5 items-center justify-center rounded border-2 border-outline transition-all peer-checked:border-primary peer-checked:bg-primary peer-indeterminate:border-primary peer-indeterminate:bg-primary">
        <MaterialIcon
          name={indeterminate && !checked ? "remove" : "check"}
          className={`text-[14px] font-bold text-on-primary ${checked || indeterminate ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </label>
  );
}
