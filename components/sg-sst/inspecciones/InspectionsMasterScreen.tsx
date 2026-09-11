"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportInspectionsAction,
  deleteInspectionAction,
  saveInspectionAction,
} from "@/lib/sg-sst/inspecciones/actions";
import {
  INSPECTION_EXCEL_MAX_ROWS,
  type InspectionExcelImportRow,
} from "@/lib/sg-sst/inspecciones/excel";
import {
  downloadInspectionsExcel,
  downloadInspectionsTemplate,
  parseInspectionsExcelFile,
} from "@/lib/sg-sst/inspecciones/excel-client";
import {
  FINDING_SEVERITIES,
  FINDING_SEVERITY_LABELS,
  FINDING_STATUSES,
  FINDING_STATUS_LABELS,
  INSPECTION_MANUAL_STATUSES,
  INSPECTION_STATUS_LABELS,
  INSPECTION_TYPE_ICONS,
  INSPECTION_TYPE_LABELS,
  INSPECTION_TYPES,
  draftFromInspection,
  emptyFindingDraft,
  emptyInspectionDraft,
  formatWeekBannerTitle,
  type FindingSeverity,
  type FindingStatus,
  type InspectionStats,
  type InspectionStatus,
  type InspectionType,
  type SstInspectionDraft,
  type SstInspectionFindingDraft,
  type SstInspectionView,
  type WeekRange,
} from "@/lib/sg-sst/inspecciones/types";

type InspectionsMasterScreenProps = {
  inspections: SstInspectionView[];
  stats: InspectionStats;
  farms: SstFarm[];
  week: WeekRange;
  weekItems: SstInspectionView[];
};

const STATUS_FILTERS: { id: InspectionStatus | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "programada", label: "Programadas" },
  { id: "en_proceso", label: "En proceso" },
  { id: "pendiente", label: "Pendientes" },
  { id: "realizada", label: "Realizadas" },
  { id: "vencida", label: "Vencidas" },
];

export function InspectionsMasterScreen({
  inspections,
  stats,
  farms,
  week,
  weekItems,
}: Readonly<InspectionsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InspectionStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<InspectionType | "all">("all");
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<InspectionExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstInspectionDraft | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => inspections.find((item) => item.id === selectedId) ?? null,
    [inspections, selectedId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inspections.filter((item) => {
      if (statusFilter !== "all" && item.effectiveStatus !== statusFilter) return false;
      if (typeFilter !== "all" && item.inspectionType !== typeFilter) return false;
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.folio.toLowerCase().includes(q) ||
        item.responsibleName.toLowerCase().includes(q) ||
        item.workCenter.toLowerCase().includes(q) ||
        (item.farmName ?? "").toLowerCase().includes(q) ||
        item.findingsSummary.toLowerCase().includes(q) ||
        INSPECTION_TYPE_LABELS[item.inspectionType].toLowerCase().includes(q)
      );
    });
  }, [inspections, statusFilter, typeFilter, farmId, query]);

  const monthProgress =
    stats.scheduledThisMonth > 0
      ? Math.round((stats.performed / stats.scheduledThisMonth) * 100)
      : 0;

  function handleExport() {
    downloadInspectionsExcel(
      filtered,
      `inspecciones-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} registros.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseInspectionsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > INSPECTION_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${INSPECTION_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
        return;
      }
      setFileName(file.name);
      setPreview(rows);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "No se pudo leer el Excel.", {
        variant: "error",
      });
    } finally {
      event.target.value = "";
    }
  }

  function confirmImport() {
    startTransition(async () => {
      const result = await bulkImportInspectionsAction({ rows: preview });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        `Importación: ${result.created} creados, ${result.updated} actualizados, ${result.failed} con error.`,
        { variant: result.failed > 0 ? "info" : "success" },
      );
      setPreview([]);
      setFileName("");
      router.refresh();
    });
  }

  function openCreate() {
    setEditing(emptyInspectionDraft());
  }

  function openEdit(item: SstInspectionView) {
    setEditing(draftFromInspection(item));
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveInspectionAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editing.id ? "Inspección actualizada." : "Inspección programada.");
      setEditing(null);
      setSelectedId(result.id);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("¿Eliminar esta inspección y sus hallazgos?")) return;
    startTransition(async () => {
      const result = await deleteInspectionAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Inspección eliminada.");
      if (selectedId === id) setSelectedId(null);
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="fact_check" className="text-[16px] text-primary" />
            <span>Inspecciones planeadas</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Inspecciones de seguridad y hallazgos SG-SST
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Programa sistemático de verificación locativa, equipos, maquinaria y condiciones
            de trabajo seguro en centros de trabajo.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadInspectionsTemplate()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="table_view" className="text-[18px]" />
            Plantilla
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="upload_file" className="text-[18px]" />
            Importar Excel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="download" className="text-[18px]" />
            Cronograma (.XLSX)
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm"
          >
            <MaterialIcon name="add_circle" className="text-[20px]" />
            Programar inspección
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </header>

      <section className="flex flex-col gap-sm rounded-xl bg-gradient-to-r from-primary to-primary-container p-md text-on-primary shadow-md">
        <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-xs">
            <MaterialIcon name="calendar_month" className="text-[24px] text-secondary-fixed" />
            <h2 className="font-headline-md tracking-tight text-on-primary">
              {formatWeekBannerTitle(week)}
            </h2>
          </div>
          <span className="font-label-sm text-secondary-fixed">
            {weekItems.length} inspección(es) en ventana semanal
          </span>
        </div>
        <p className="font-body-sm text-on-primary-container">
          Responsable → Centro de trabajo → Tipo → Fecha programada
        </p>
        {weekItems.length > 0 ? (
          <div className="mt-xs grid grid-cols-1 gap-sm md:grid-cols-2 lg:grid-cols-5">
            {weekItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className="flex flex-col gap-xs rounded-lg bg-surface-container-lowest p-sm text-left text-on-surface shadow-sm"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-label-sm uppercase tracking-wider text-primary">
                    {item.scheduledDate}
                  </span>
                  <StatusPill status={item.effectiveStatus} />
                </div>
                <div className="font-label-md leading-tight text-on-surface">
                  {item.responsibleName || "Sin responsable"}
                </div>
                <div className="rounded bg-surface-container-low p-xs">
                  <div className="text-[10px] font-label-sm uppercase text-outline">
                    Lugar / centro
                  </div>
                  <div className="truncate font-label-md text-primary">
                    {item.farmName ?? "Sin centro"}
                  </div>
                  <div className="truncate text-[11px] text-on-surface-variant">
                    {item.workCenter || "—"}
                  </div>
                </div>
                <div className="flex items-center gap-1 pt-xs text-[11px] font-label-md text-primary">
                  <MaterialIcon
                    name={INSPECTION_TYPE_ICONS[item.inspectionType]}
                    className="text-[16px]"
                  />
                  <span className="truncate">
                    {INSPECTION_TYPE_LABELS[item.inspectionType]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-on-primary/10 px-sm py-sm font-body-sm text-on-primary">
            No hay inspecciones programadas para esta semana.
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-sm md:grid-cols-3 xl:grid-cols-6">
        <Kpi
          label="Programadas (mes)"
          value={stats.scheduledThisMonth}
          detail={`${stats.performed} ejecutadas (${monthProgress}% avance)`}
          icon="assignment"
          progress={monthProgress}
        />
        <Kpi
          label="Realizadas"
          value={stats.performed}
          detail="Con acta / evidencia"
          icon="task_alt"
          accent="text-secondary"
        />
        <Kpi
          label="Pendientes"
          value={stats.pending}
          detail="En ciclo de ejecución"
          icon="pending_actions"
        />
        <Kpi
          label="Vencidas"
          value={stats.overdue}
          detail="Requieren cierre"
          icon="error"
          accent="text-error"
          danger
        />
        <Kpi
          label="Hallazgos abiertos"
          value={stats.openFindings}
          detail="Planes de acción activos"
          icon="troubleshoot"
          accent="text-tertiary"
        />
        <Kpi
          label="Total registros"
          value={stats.total}
          detail="13 categorías SG-SST"
          icon="fact_check"
        />
      </section>

      {preview.length > 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <div className="font-label-md text-label-md font-bold">
                Vista previa: {fileName}
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {preview.length} filas. Folio existente → actualización. El centro de trabajo debe existir.
              </div>
            </div>
            <div className="flex gap-xs">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-sm py-1.5"
                onClick={() => {
                  setPreview([]);
                  setFileName("");
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                className="rounded-lg bg-primary px-sm py-1.5 font-semibold text-on-primary disabled:opacity-60"
                onClick={confirmImport}
              >
                {pending ? "Importando..." : "Confirmar importación"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-md lg:grid-cols-12">
        <section className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm lg:col-span-8">
          <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-headline-md text-on-surface">Matriz técnica de inspecciones</h3>
              <p className="font-body-sm text-outline">
                Seguimiento normativo de las 13 categorías SG-SST
              </p>
            </div>
            <span className="font-label-sm text-outline">
              Mostrando {filtered.length} de {inspections.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-xs sm:grid-cols-2 md:grid-cols-4">
            <label className="flex flex-col gap-0.5">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline">
                Categoría
              </span>
              <select
                className="rounded-lg bg-surface-container-low px-xs py-2 font-body-sm"
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as InspectionType | "all")
                }
              >
                <option value="all">Todas las 13 categorías</option>
                {INSPECTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {INSPECTION_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-0.5">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline">
                Centro de trabajo
              </span>
              <select
                className="rounded-lg bg-surface-container-low px-xs py-2 font-body-sm"
                value={farmId}
                onChange={(event) => setFarmId(event.target.value)}
              >
                <option value="all">Todos los centros</option>
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-0.5 sm:col-span-2">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline">
                Buscar
              </span>
              <div className="relative">
                <MaterialIcon
                  name="search"
                  className="absolute top-2.5 left-3 text-[20px] text-outline"
                />
                <input
                  className="w-full rounded-lg bg-surface-container-low py-2 pr-4 pl-10 font-body-sm"
                  placeholder="Folio INS-…, responsable, centro…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </label>
          </div>

          <div className="flex flex-wrap gap-1">
            {STATUS_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStatusFilter(item.id)}
                className={`rounded-lg px-2.5 py-1.5 font-label-sm text-label-sm ${
                  statusFilter === item.id
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface-variant"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-body-sm">
              <thead>
                <tr className="bg-surface-container-high font-label-sm text-[11px] tracking-wider text-on-surface-variant uppercase">
                  <th className="p-xs">Tipo</th>
                  <th className="p-xs">Responsable</th>
                  <th className="p-xs">Centro / área</th>
                  <th className="p-xs">Programada / realizada</th>
                  <th className="p-xs">Estado</th>
                  <th className="p-xs">Hallazgos</th>
                  <th className="p-xs">Evidencia</th>
                  <th className="p-xs">Acción</th>
                  <th className="p-xs">Próxima</th>
                  <th className="p-xs text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low text-[13px]">
                {filtered.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <tr
                      key={item.id}
                      className={`cursor-pointer transition-colors hover:bg-surface-container-low ${
                        isSelected ? "bg-surface-container-low" : ""
                      }`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <td className="p-xs align-top">
                        <span className="inline-flex items-center gap-1 font-label-md text-primary">
                          <MaterialIcon
                            name={INSPECTION_TYPE_ICONS[item.inspectionType]}
                            className="text-[16px]"
                          />
                          {INSPECTION_TYPE_LABELS[item.inspectionType]}
                        </span>
                        <div className="mt-0.5 font-mono text-[10px] text-outline">
                          {item.folio}
                        </div>
                      </td>
                      <td className="p-xs align-top">
                        <div className="font-label-md leading-tight text-on-surface">
                          {item.responsibleName}
                        </div>
                      </td>
                      <td className="p-xs align-top">
                        <div className="font-label-md leading-tight">
                          {item.farmName ?? "Sin centro"}
                        </div>
                        <div className="text-[11px] text-outline">{item.workCenter || "—"}</div>
                      </td>
                      <td className="p-xs align-top whitespace-nowrap">
                        <div
                          className={
                            item.effectiveStatus === "vencida"
                              ? "font-medium text-error"
                              : "text-on-surface"
                          }
                        >
                          {item.scheduledDate}
                        </div>
                        <div className="text-[11px] text-outline">
                          {item.performedDate ?? "Sin ejecutar"}
                        </div>
                      </td>
                      <td className="p-xs align-top">
                        <StatusPill status={item.effectiveStatus} />
                      </td>
                      <td className="p-xs align-top">
                        <div className="flex items-center gap-1">
                          <span className="rounded-full bg-surface-container px-1.5 py-0.5 text-[10px] font-label-sm">
                            {item.findingsCount}
                          </span>
                          <span className="truncate text-[11px] text-outline max-w-[120px]">
                            {item.findingsSummary || "Sin novedad"}
                          </span>
                        </div>
                      </td>
                      <td className="p-xs align-top">
                        {item.evidenceUrl ? (
                          <a
                            href={item.evidenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-primary"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MaterialIcon name="attach_file" className="text-[14px]" />
                            {item.evidenceName || "Ver"}
                          </a>
                        ) : (
                          <span className="text-[11px] text-outline">—</span>
                        )}
                      </td>
                      <td className="max-w-[140px] truncate p-xs align-top text-on-surface-variant">
                        {item.generatedAction || "—"}
                      </td>
                      <td className="p-xs align-top whitespace-nowrap font-label-sm text-outline">
                        {item.nextInspectionDate ?? "—"}
                      </td>
                      <td className="p-xs text-right align-top">
                        <div className="inline-flex gap-1">
                          <button
                            type="button"
                            className="rounded-lg bg-surface-container p-1.5"
                            title="Editar"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEdit(item);
                            }}
                          >
                            <MaterialIcon name="edit" className="text-[16px]" />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg bg-error-container p-1.5 text-on-error-container"
                            disabled={pending}
                            title="Eliminar"
                            onClick={(event) => {
                              event.stopPropagation();
                              remove(item.id);
                            }}
                          >
                            <MaterialIcon name="delete" className="text-[16px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-md py-lg text-center text-on-surface-variant">
                      No hay inspecciones con los filtros actuales.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="flex flex-col gap-sm lg:col-span-4">
          <FindingsDetailPanel
            inspection={selected}
            onEdit={() => selected && openEdit(selected)}
          />
        </aside>
      </div>

      {editing ? (
        <InspectionFormModal
          draft={editing}
          farms={farms}
          pending={pending}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      ) : null}
    </div>
  );
}

function StatusPill({ status }: Readonly<{ status: InspectionStatus }>) {
  const styles: Record<InspectionStatus, string> = {
    programada: "bg-surface-container text-on-surface",
    en_proceso: "bg-secondary-fixed text-on-secondary-fixed",
    realizada: "bg-surface-container-high text-primary",
    pendiente: "bg-secondary-fixed/70 text-on-secondary-fixed",
    vencida: "bg-error-container text-on-error-container",
  };
  const dots: Record<InspectionStatus, string> = {
    programada: "bg-outline",
    en_proceso: "bg-secondary",
    realizada: "bg-primary",
    pendiente: "bg-secondary",
    vencida: "bg-error",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-xs py-0.5 font-label-sm text-[11px] ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {INSPECTION_STATUS_LABELS[status]}
    </span>
  );
}

function Kpi({
  label,
  value,
  detail,
  icon,
  accent = "text-primary",
  progress,
  danger,
}: Readonly<{
  label: string;
  value: number;
  detail: string;
  icon: string;
  accent?: string;
  progress?: number;
  danger?: boolean;
}>) {
  return (
    <div
      className={`flex flex-col justify-between rounded-xl p-md shadow-sm ${
        danger
          ? "bg-error-container text-on-error-container"
          : "bg-surface-container-lowest"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-label-sm uppercase tracking-wider text-outline">{label}</span>
        <MaterialIcon
          name={icon}
          className={`text-[20px] ${danger ? "text-error" : accent}`}
        />
      </div>
      <div className="mt-xs">
        <div className={`font-display-lg leading-none ${danger ? "text-error" : accent}`}>
          {value}
        </div>
        <div className="mt-1 font-body-sm text-outline">{detail}</div>
      </div>
      {progress != null ? (
        <div className="mt-sm h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
          <div
            className="h-1.5 rounded-full bg-primary"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function FindingsDetailPanel({
  inspection,
  onEdit,
}: Readonly<{
  inspection: SstInspectionView | null;
  onEdit: () => void;
}>) {
  if (!inspection) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <div className="font-label-sm uppercase tracking-wider text-outline">Hallazgos</div>
        <p className="mt-sm font-body-sm text-on-surface-variant">
          Selecciona una inspección en la matriz para ver hallazgos, plan de acción y
          evidencia.
        </p>
      </div>
    );
  }

  const openFindings = inspection.findings.filter((f) => f.status !== "cerrado");
  const critical = inspection.findings.find((f) => f.severity === "critica");

  return (
    <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="flex items-start justify-between gap-sm">
        <div>
          <div className="flex items-center gap-xs">
            {critical ? (
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-error" />
            ) : null}
            <span className="font-label-sm uppercase tracking-wider text-outline">
              {inspection.folio}
            </span>
          </div>
          <h3 className="mt-1 font-headline-md text-[18px] leading-tight text-on-surface">
            {INSPECTION_TYPE_LABELS[inspection.inspectionType]}
          </h3>
          <p className="font-body-sm text-[12px] text-outline">
            {inspection.farmName ?? "Sin centro"}
            {inspection.workCenter ? ` · ${inspection.workCenter}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg bg-primary p-1.5 text-on-primary"
          title="Editar"
        >
          <MaterialIcon name="edit" className="text-[16px]" />
        </button>
      </div>

      <div className="rounded-lg bg-surface-container-low p-sm text-[12px]">
        <div className="flex justify-between gap-2">
          <span className="text-outline">Responsable</span>
          <span className="font-semibold text-primary">{inspection.responsibleName}</span>
        </div>
        <div className="mt-1 flex justify-between gap-2">
          <span className="text-outline">Estado</span>
          <StatusPill status={inspection.effectiveStatus} />
        </div>
        <div className="mt-1 flex justify-between gap-2">
          <span className="text-outline">Acción generada</span>
          <span className="max-w-[60%] text-right font-semibold">
            {inspection.generatedAction || "Sin acción"}
          </span>
        </div>
      </div>

      <div>
        <div className="mb-xs font-label-sm uppercase tracking-wider text-[11px] text-on-surface">
          Hallazgos ({openFindings.length} abiertos / {inspection.findings.length} total)
        </div>
        {inspection.findings.length === 0 ? (
          <p className="font-body-sm text-on-surface-variant">
            {inspection.findingsSummary || "Sin hallazgos registrados."}
          </p>
        ) : (
          <ul className="flex flex-col gap-xs">
            {inspection.findings.map((finding) => (
              <li
                key={finding.id}
                className="rounded-lg border border-outline-variant/20 bg-surface-container p-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-label-sm text-[11px] ${
                      finding.severity === "critica" || finding.severity === "alta"
                        ? "text-error"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {FINDING_SEVERITY_LABELS[finding.severity]} ·{" "}
                    {FINDING_STATUS_LABELS[finding.status]}
                  </span>
                  <span className="text-[11px] text-outline">
                    {finding.dueDate ?? "Sin plazo"}
                  </span>
                </div>
                <div className="mt-1 font-semibold text-on-surface">{finding.title}</div>
                {finding.description ? (
                  <p className="mt-1 text-[12px] text-on-surface-variant">
                    {finding.description}
                  </p>
                ) : null}
                {finding.actionPlan ? (
                  <div className="mt-2 flex items-start gap-1 text-[12px]">
                    <MaterialIcon name="priority_high" className="mt-0.5 text-[16px] text-primary" />
                    <div>
                      <div className="font-semibold">Plan de acción</div>
                      <div className="text-outline">{finding.actionPlan}</div>
                      {finding.assigneeName ? (
                        <div className="mt-1 text-[11px]">
                          Asignado: <strong>{finding.assigneeName}</strong>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function InspectionFormModal({
  draft,
  farms,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstInspectionDraft;
  farms: SstFarm[];
  pending: boolean;
  onChange: (draft: SstInspectionDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  const findings = draft.findings ?? [];

  function patchFinding(index: number, patch: Partial<SstInspectionFindingDraft>) {
    const next = findings.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange({ ...draft, findings: next });
  }

  function addFinding() {
    onChange({ ...draft, findings: [...findings, emptyFindingDraft()] });
  }

  function removeFinding(index: number) {
    onChange({
      ...draft,
      findings: findings.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Editar inspección" : "Programar inspección"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Tipo de inspección</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.inspectionType}
              onChange={(event) =>
                onChange({
                  ...draft,
                  inspectionType: event.target.value as InspectionType,
                })
              }
            >
              {INSPECTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {INSPECTION_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Estado</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.status}
              onChange={(event) =>
                onChange({
                  ...draft,
                  status: event.target.value as InspectionStatus,
                })
              }
            >
              {INSPECTION_MANUAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {INSPECTION_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Responsable técnico</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.responsibleName}
              onChange={(event) =>
                onChange({ ...draft, responsibleName: event.target.value })
              }
              required
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Centro de trabajo</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.farmId ?? ""}
              onChange={(event) =>
                onChange({
                  ...draft,
                  farmId: event.target.value || null,
                })
              }
            >
              <option value="">Sin centro</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Centro de trabajo / área</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.workCenter}
              onChange={(event) => onChange({ ...draft, workCenter: event.target.value })}
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha programada</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.scheduledDate}
              onChange={(event) =>
                onChange({ ...draft, scheduledDate: event.target.value })
              }
              required
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha realizada</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.performedDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, performedDate: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Próxima inspección</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.nextInspectionDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, nextInspectionDate: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Acción generada</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.generatedAction}
              onChange={(event) =>
                onChange({ ...draft, generatedAction: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Resumen de hallazgos</span>
            <textarea
              className="min-h-[72px] rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.findingsSummary}
              onChange={(event) =>
                onChange({ ...draft, findingsSummary: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">URL evidencia</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.evidenceUrl}
              onChange={(event) =>
                onChange({ ...draft, evidenceUrl: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Nombre evidencia</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.evidenceName}
              onChange={(event) =>
                onChange({ ...draft, evidenceName: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Observaciones</span>
            <textarea
              className="min-h-[64px] rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.observations}
              onChange={(event) =>
                onChange({ ...draft, observations: event.target.value })
              }
            />
          </label>
        </div>

        <div className="mt-md border-t border-outline-variant/30 pt-md">
          <div className="mb-sm flex items-center justify-between">
            <h3 className="font-label-md font-bold text-on-surface">
              Hallazgos (opcional)
            </h3>
            <button
              type="button"
              onClick={addFinding}
              className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-sm py-1.5 font-label-sm text-primary"
            >
              <MaterialIcon name="add" className="text-[16px]" />
              Agregar hallazgo
            </button>
          </div>

          {findings.length === 0 ? (
            <p className="font-body-sm text-on-surface-variant">
              Puedes registrar hallazgos con severidad, plan de acción y responsable.
            </p>
          ) : (
            <div className="flex flex-col gap-sm">
              {findings.map((finding, index) => (
                <div
                  key={finding.id ?? `new-${index}`}
                  className="grid grid-cols-1 gap-xs rounded-lg bg-surface-container-low p-sm md:grid-cols-2"
                >
                  <label className="flex flex-col gap-0.5 md:col-span-2">
                    <span className="font-label-sm text-[11px]">Título</span>
                    <input
                      className="rounded-lg bg-surface-container-lowest px-sm py-1.5"
                      value={finding.title}
                      onChange={(event) =>
                        patchFinding(index, { title: event.target.value })
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-0.5">
                    <span className="font-label-sm text-[11px]">Severidad</span>
                    <select
                      className="rounded-lg bg-surface-container-lowest px-sm py-1.5"
                      value={finding.severity}
                      onChange={(event) =>
                        patchFinding(index, {
                          severity: event.target.value as FindingSeverity,
                        })
                      }
                    >
                      {FINDING_SEVERITIES.map((severity) => (
                        <option key={severity} value={severity}>
                          {FINDING_SEVERITY_LABELS[severity]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-0.5">
                    <span className="font-label-sm text-[11px]">Estado</span>
                    <select
                      className="rounded-lg bg-surface-container-lowest px-sm py-1.5"
                      value={finding.status}
                      onChange={(event) =>
                        patchFinding(index, {
                          status: event.target.value as FindingStatus,
                        })
                      }
                    >
                      {FINDING_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {FINDING_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-0.5 md:col-span-2">
                    <span className="font-label-sm text-[11px]">Descripción</span>
                    <textarea
                      className="min-h-[56px] rounded-lg bg-surface-container-lowest px-sm py-1.5"
                      value={finding.description}
                      onChange={(event) =>
                        patchFinding(index, { description: event.target.value })
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-0.5 md:col-span-2">
                    <span className="font-label-sm text-[11px]">Plan de acción</span>
                    <textarea
                      className="min-h-[56px] rounded-lg bg-surface-container-lowest px-sm py-1.5"
                      value={finding.actionPlan}
                      onChange={(event) =>
                        patchFinding(index, { actionPlan: event.target.value })
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-0.5">
                    <span className="font-label-sm text-[11px]">Asignado</span>
                    <input
                      className="rounded-lg bg-surface-container-lowest px-sm py-1.5"
                      value={finding.assigneeName}
                      onChange={(event) =>
                        patchFinding(index, { assigneeName: event.target.value })
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-0.5">
                    <span className="font-label-sm text-[11px]">Fecha límite</span>
                    <input
                      type="date"
                      className="rounded-lg bg-surface-container-lowest px-sm py-1.5"
                      value={finding.dueDate ?? ""}
                      onChange={(event) =>
                        patchFinding(index, { dueDate: event.target.value })
                      }
                    />
                  </label>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      className="font-label-sm text-error"
                      onClick={() => removeFinding(index)}
                    >
                      Quitar hallazgo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-md flex justify-end gap-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-surface-container px-md py-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onSave}
            className="rounded-lg bg-primary px-md py-2 font-semibold text-on-primary disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
