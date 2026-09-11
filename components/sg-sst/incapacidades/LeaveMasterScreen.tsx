"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportLeavesAction,
  deleteLeaveAction,
  saveLeaveAction,
} from "@/lib/sg-sst/incapacidades/actions";
import {
  downloadLeavesExcel,
  downloadLeavesTemplate,
  parseLeavesExcelFile,
} from "@/lib/sg-sst/incapacidades/excel-client";
import {
  LEAVE_EXCEL_MAX_ROWS,
  type LeaveExcelImportRow,
} from "@/lib/sg-sst/incapacidades/excel";
import {
  LEAVE_ORIGINS,
  LEAVE_ORIGIN_LABELS,
  LEAVE_STATUSES,
  LEAVE_STATUS_LABELS,
  REINTEGRATION_STATUSES,
  REINTEGRATION_STATUS_LABELS,
  computeDaysOrdered,
  emptyLeaveDraft,
  type LeaveOrigin,
  type LeaveStats,
  type LeaveStatus,
  type LeaveWorkerRanking,
  type ReintegrationStatus,
  type SstLeaveDraft,
  type SstLeaveView,
} from "@/lib/sg-sst/incapacidades/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type LeaveMasterScreenProps = {
  leaves: SstLeaveView[];
  stats: LeaveStats;
  ranking: LeaveWorkerRanking[];
  farms: SstFarm[];
  workers: SstWorker[];
};

function leaveToDraft(leave: SstLeaveView): SstLeaveDraft {
  return {
    id: leave.id,
    workerId: leave.workerId,
    startDate: leave.startDate,
    endDate: leave.endDate,
    daysOrdered: leave.daysOrdered,
    origin: leave.origin,
    isExtension: leave.isExtension,
    accumulatedDays: leave.accumulatedDays,
    status: leave.status,
    sstFollowUp: leave.sstFollowUp,
    reintegrationRequired: leave.reintegrationRequired,
    reintegrationDate: leave.reintegrationDate ?? "",
    reintegrationStatus: leave.reintegrationStatus,
    cie10: leave.cie10,
    diagnosisLabel: leave.diagnosisLabel,
    issuer: leave.issuer,
    adminObservations: leave.adminObservations,
    evidenceUrl: leave.evidenceUrl,
    evidenceName: leave.evidenceName,
  };
}

export function LeaveMasterScreen({
  leaves,
  stats,
  ranking,
  farms,
  workers,
}: Readonly<LeaveMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "all">("all");
  const [originFilter, setOriginFilter] = useState<LeaveOrigin | "all">("all");
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<LeaveExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstLeaveDraft | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<SstWorker | null>(null);

  const maxRankingDays = ranking[0]?.accumulatedDays || 1;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leaves.filter((leave) => {
      if (statusFilter !== "all" && leave.status !== statusFilter) return false;
      if (originFilter !== "all" && leave.origin !== originFilter) return false;
      if (farmId !== "all" && leave.farmId !== farmId) return false;
      if (!q) return true;
      return (
        leave.workerName.toLowerCase().includes(q) ||
        leave.workerDocument.toLowerCase().includes(q) ||
        leave.workerCode.toLowerCase().includes(q) ||
        leave.folio.toLowerCase().includes(q) ||
        leave.cie10.toLowerCase().includes(q) ||
        leave.diagnosisLabel.toLowerCase().includes(q)
      );
    });
  }, [leaves, statusFilter, originFilter, farmId, query]);

  const comunDays =
    stats.daysByOrigin.comun +
    stats.daysByOrigin.maternidad +
    stats.daysByOrigin.transito;
  const laboralDays =
    stats.daysByOrigin.laboral_at + stats.daysByOrigin.laboral_el;
  const originTotal = comunDays + laboralDays || 1;

  function openCreate() {
    setEditing(emptyLeaveDraft());
    setSelectedWorker(null);
  }

  function openEdit(leave: SstLeaveView) {
    setEditing(leaveToDraft(leave));
    setSelectedWorker(workers.find((w) => w.id === leave.workerId) ?? null);
  }

  function applyWorker(worker: SstWorker | null) {
    setSelectedWorker(worker);
    if (!editing) return;
    setEditing({ ...editing, workerId: worker?.id ?? "" });
  }

  function patchDraft(patch: Partial<SstLeaveDraft>) {
    if (!editing) return;
    const next = { ...editing, ...patch };
    if (patch.startDate !== undefined || patch.endDate !== undefined) {
      next.daysOrdered = computeDaysOrdered(next.startDate, next.endDate);
      if (next.accumulatedDays == null || next.accumulatedDays <= 0) {
        next.accumulatedDays = next.daysOrdered;
      }
    }
    setEditing(next);
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveLeaveAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editing.id ? "Incapacidad actualizada." : "Incapacidad registrada.");
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteLeaveAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Incapacidad eliminada.");
      router.refresh();
    });
  }

  function handleExport() {
    downloadLeavesExcel(
      filtered,
      `incapacidades-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportadas ${filtered.length} incapacidades.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseLeavesExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > LEAVE_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${LEAVE_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
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
      const result = await bulkImportLeavesAction({ rows: preview });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        `Importación: ${result.created} creadas, ${result.updated} actualizadas, ${result.failed} con error.`,
        { variant: result.failed > 0 ? "info" : "success" },
      );
      setPreview([]);
      setFileName("");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md rounded-xl bg-surface-container-lowest p-md shadow-sm xl:flex-row xl:items-end">
        <div className="max-w-4xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="event_busy" className="text-[16px] text-primary" />
            <span>Gestión operativa</span>
            <MaterialIcon name="chevron_right" className="text-[14px]" />
            <span className="font-bold text-primary">Incapacidades y reintegros</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
            Registro y control de incapacidades, prórrogas y reintegros laborales
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Monitoreo de ausentismo, alertas de vencimiento/cierre y reintegro. CIE-10 y
            etiqueta diagnóstica solo en este módulo administrativo.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadLeavesTemplate()}
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
            Exportar Excel
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm"
          >
            <MaterialIcon name="add_circle" className="text-[20px]" />
            Registrar incapacidad
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

      <section className="grid grid-cols-1 gap-sm md:grid-cols-2 xl:grid-cols-5">
        <AlertCard
          title="Vencida sin cierre"
          value={stats.alerts.vencidaSinCierre}
          detail="Terminó vigencia; sin cierre ni prórroga radicada."
          tone="error"
          icon="report_problem"
          badge="Crítico"
        />
        <AlertCard
          title="Termina ≤ 3 días"
          value={stats.alerts.terminaEn3}
          detail="Fecha límite inminente. Confirmar evolución / prórroga."
          tone="secondary"
          icon="timer"
          badge="Inminente"
        />
        <AlertCard
          title="Termina ≤ 7 días"
          value={stats.alerts.terminaEn7}
          detail="Seguimiento intermedio (4–7 días)."
          tone="muted"
          icon="calendar_clock"
          badge="Seguimiento"
        />
        <AlertCard
          title="Prórroga"
          value={stats.alerts.prorrogas}
          detail="Incapacidades marcadas como prórroga activa."
          tone="error"
          icon="history_toggle_off"
          badge="Prórroga"
        />
        <AlertCard
          title="Reintegro pendiente"
          value={stats.alerts.reintegroPendiente}
          detail="Reintegro requerido sin estado completado."
          tone="secondary"
          icon="assignment_turned_in"
          badge="Post-examen"
        />
      </section>

      <div className="grid grid-cols-1 gap-md xl:grid-cols-12">
        <div className="flex flex-col gap-sm xl:col-span-4">
          <div className="flex flex-1 flex-col rounded-xl bg-surface-container-lowest p-md shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                Indicadores
              </span>
              <span className="rounded bg-surface-container px-2 py-0.5 font-label-sm text-label-sm font-bold text-primary">
                {stats.total} registros
              </span>
            </div>
            <div className="my-md grid grid-cols-2 gap-sm">
              <div className="rounded-lg bg-surface-container-low p-base">
                <span className="block font-label-sm text-label-sm text-on-surface-variant">
                  Días totales
                </span>
                <div className="mt-1 font-headline-lg text-headline-lg font-bold text-primary">
                  {stats.totalDays}
                </div>
              </div>
              <div className="rounded-lg bg-surface-container-low p-base">
                <span className="block font-label-sm text-label-sm text-on-surface-variant">
                  Activas / por vencer
                </span>
                <div className="mt-1 font-headline-lg text-headline-lg font-bold text-on-surface">
                  {stats.byStatus.activa + stats.byStatus.por_vencer}
                </div>
              </div>
            </div>
            <div className="space-y-2 rounded-lg bg-surface p-base">
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="font-semibold">Distribución por origen (días)</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(comunDays / originTotal) * 100}%` }}
                />
                <div
                  className="h-full bg-secondary-container"
                  style={{ width: `${(laboralDays / originTotal) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[12px] font-label-sm">
                <span>
                  Común / otros: <strong className="text-primary">{comunDays}</strong>
                </span>
                <span>
                  Laboral: <strong className="text-secondary">{laboralDays}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm xl:col-span-8">
          <div className="mb-base flex items-center gap-2">
            <span className="h-4 w-1.5 rounded-full bg-primary" />
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Ranking: trabajadores con más días acumulados
            </h2>
          </div>
          <p className="mb-sm font-body-sm text-body-sm text-on-surface-variant">
            Suma de días ordenados por trabajador (top 10).
          </p>
          <div className="space-y-base">
            {ranking.map((item, index) => (
              <div
                key={item.workerId}
                className="rounded-lg p-base transition-colors hover:bg-surface-container-low"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      {index + 1}. {item.workerName}
                    </span>
                    <span className="ml-2 text-[12px] text-on-surface-variant">
                      {item.jobTitle}
                      {item.farmName ? ` · ${item.farmName}` : ""}
                    </span>
                    <span className="ml-2 rounded bg-surface-container px-1.5 py-0.5 text-[11px] font-bold text-on-surface-variant">
                      {LEAVE_ORIGIN_LABELS[item.dominantOrigin]}
                    </span>
                  </div>
                  <div className="shrink-0 font-headline-md text-headline-md font-bold text-primary">
                    {item.accumulatedDays}{" "}
                    <span className="text-body-sm font-normal text-on-surface-variant">
                      días
                    </span>
                  </div>
                </div>
                <div className="h-3.5 w-full overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${Math.max(8, (item.accumulatedDays / maxRankingDays) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {ranking.length === 0 ? (
              <p className="py-md text-center text-on-surface-variant">
                Sin datos de ranking. Registra la primera incapacidad.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {preview.length > 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <div className="font-label-md text-label-md font-bold">
                Vista previa: {fileName}
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {preview.length} filas. Folio existente → actualización.
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

      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-sm shadow-sm lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <MaterialIcon
            name="search"
            className="absolute top-2.5 left-3 text-[20px] text-outline"
          />
          <input
            className="w-full rounded-lg bg-surface-container-low py-2.5 pr-4 pl-10 font-body-sm text-body-sm focus:outline-none"
            placeholder="Buscar por nombre, cédula, folio, CIE-10..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as LeaveStatus | "all")
          }
        >
          <option value="all">Todos los estados</option>
          {LEAVE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {LEAVE_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
          value={originFilter}
          onChange={(event) =>
            setOriginFilter(event.target.value as LeaveOrigin | "all")
          }
        >
          <option value="all">Todos los orígenes</option>
          {LEAVE_ORIGINS.map((origin) => (
            <option key={origin} value={origin}>
              {LEAVE_ORIGIN_LABELS[origin]}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
          value={farmId}
          onChange={(event) => setFarmId(event.target.value)}
        >
          <option value="all">Todas las fincas</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                <th className="px-md py-sm">Estado</th>
                <th className="px-sm py-sm">Colaborador</th>
                <th className="px-sm py-sm">Periodo / Días</th>
                <th className="px-sm py-sm">Origen</th>
                <th className="px-sm py-sm">CIE-10 / Dx</th>
                <th className="px-sm py-sm">Reintegro</th>
                <th className="px-md py-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((leave) => (
                <tr key={leave.id} className="hover:bg-surface-container-low/50">
                  <td className="px-md py-sm">
                    <StatusChip status={leave.status} />
                    {leave.isExtension ? (
                      <div className="mt-1 text-[11px] font-bold text-error">Prórroga</div>
                    ) : null}
                  </td>
                  <td className="px-sm py-sm">
                    <div className="font-semibold text-on-surface">{leave.workerName}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      {leave.jobTitleSnapshot} · {leave.farmName ?? "Sin finca"}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      {leave.folio} · CC {leave.workerDocument}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      {leave.companySnapshot}
                    </div>
                  </td>
                  <td className="px-sm py-sm whitespace-nowrap">
                    <div>
                      {leave.startDate} → {leave.endDate}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      {leave.daysOrdered} d · acum. {leave.accumulatedDays} d
                      {leave.daysRemaining >= 0
                        ? ` · quedan ${leave.daysRemaining}d`
                        : ` · vencida ${Math.abs(leave.daysRemaining)}d`}
                    </div>
                  </td>
                  <td className="px-sm py-sm whitespace-nowrap">
                    {LEAVE_ORIGIN_LABELS[leave.origin]}
                  </td>
                  <td className="px-sm py-sm">
                    <div className="font-semibold">{leave.cie10 || "—"}</div>
                    <div className="max-w-[200px] truncate text-[11px] text-on-surface-variant">
                      {leave.diagnosisLabel || "Sin etiqueta"}
                    </div>
                  </td>
                  <td className="px-sm py-sm">
                    {leave.reintegrationRequired ? (
                      <>
                        <div className="text-[12px] font-semibold">
                          {REINTEGRATION_STATUS_LABELS[leave.reintegrationStatus]}
                        </div>
                        <div className="text-[11px] text-on-surface-variant">
                          {leave.reintegrationDate ?? "Sin fecha"}
                        </div>
                      </>
                    ) : (
                      <span className="text-[11px] text-outline">No aplica</span>
                    )}
                  </td>
                  <td className="px-md py-sm text-right">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        className="rounded-lg bg-surface-container p-1.5"
                        onClick={() => openEdit(leave)}
                        title="Editar"
                      >
                        <MaterialIcon name="edit" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-error-container p-1.5 text-on-error-container"
                        disabled={pending}
                        onClick={() => remove(leave.id)}
                        title="Eliminar"
                      >
                        <MaterialIcon name="delete" className="text-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-md py-lg text-center text-on-surface-variant">
                    No hay incapacidades con los filtros actuales.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
            <div className="mb-md flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {editing.id ? "Editar incapacidad" : "Registrar incapacidad"}
              </h2>
              <button type="button" onClick={() => setEditing(null)}>
                <MaterialIcon name="close" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
              <label className="flex flex-col gap-xs md:col-span-2">
                <span className="font-label-sm text-label-sm">Trabajador (base maestra)</span>
                <WorkerSelect
                  workers={workers}
                  value={editing.workerId}
                  onChange={applyWorker}
                  includeRetired
                  required
                />
                {selectedWorker ? (
                  <span className="text-[11px] text-on-surface-variant">
                    Empresa snapshot: {selectedWorker.company} · {selectedWorker.jobTitle}
                  </span>
                ) : null}
              </label>

              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Fecha inicio</span>
                <input
                  type="date"
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.startDate}
                  onChange={(event) => patchDraft({ startDate: event.target.value })}
                  required
                />
              </label>
              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Fecha final</span>
                <input
                  type="date"
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.endDate}
                  onChange={(event) => patchDraft({ endDate: event.target.value })}
                  required
                />
              </label>

              <Field
                label="Días (calculados)"
                value={String(
                  editing.daysOrdered ??
                    computeDaysOrdered(editing.startDate, editing.endDate),
                )}
                onChange={(value) =>
                  patchDraft({ daysOrdered: Number(value) || 0 })
                }
                type="number"
              />
              <Field
                label="Días acumulados"
                value={String(editing.accumulatedDays ?? "")}
                onChange={(value) =>
                  patchDraft({ accumulatedDays: Number(value) || 0 })
                }
                type="number"
              />

              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Origen</span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.origin}
                  onChange={(event) =>
                    patchDraft({ origin: event.target.value as LeaveOrigin })
                  }
                >
                  {LEAVE_ORIGINS.map((origin) => (
                    <option key={origin} value={origin}>
                      {LEAVE_ORIGIN_LABELS[origin]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Prórroga</span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.isExtension ? "si" : "no"}
                  onChange={(event) =>
                    patchDraft({ isExtension: event.target.value === "si" })
                  }
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </label>

              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Estado (opcional)</span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.status ?? ""}
                  onChange={(event) =>
                    patchDraft({
                      status: (event.target.value || undefined) as LeaveStatus | undefined,
                    })
                  }
                >
                  <option value="">Derivar automáticamente</option>
                  {LEAVE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {LEAVE_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Reintegro requerido</span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={
                    editing.reintegrationRequired === true
                      ? "si"
                      : editing.reintegrationRequired === false
                        ? "no"
                        : "auto"
                  }
                  onChange={(event) => {
                    const v = event.target.value;
                    patchDraft({
                      reintegrationRequired:
                        v === "auto" ? null : v === "si",
                    });
                  }}
                >
                  <option value="auto">Auto (&gt;15 días)</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </label>

              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Fecha reintegro</span>
                <input
                  type="date"
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.reintegrationDate ?? ""}
                  onChange={(event) =>
                    patchDraft({ reintegrationDate: event.target.value })
                  }
                />
              </label>

              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Estado reintegro</span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.reintegrationStatus ?? "no_aplica"}
                  onChange={(event) =>
                    patchDraft({
                      reintegrationStatus: event.target
                        .value as ReintegrationStatus,
                    })
                  }
                >
                  {REINTEGRATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {REINTEGRATION_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="CIE-10"
                value={editing.cie10}
                onChange={(value) => patchDraft({ cie10: value })}
              />
              <Field
                label="Diagnóstico (etiqueta)"
                value={editing.diagnosisLabel}
                onChange={(value) => patchDraft({ diagnosisLabel: value })}
              />
              <Field
                label="Emisor (EPS/ARL/IPS)"
                value={editing.issuer}
                onChange={(value) => patchDraft({ issuer: value })}
              />
              <Field
                label="URL evidencia"
                value={editing.evidenceUrl}
                onChange={(value) => patchDraft({ evidenceUrl: value })}
              />
              <Field
                label="Nombre evidencia"
                value={editing.evidenceName}
                onChange={(value) => patchDraft({ evidenceName: value })}
              />

              <label className="flex flex-col gap-xs md:col-span-2">
                <span className="font-label-sm text-label-sm">Seguimiento SST</span>
                <textarea
                  className="min-h-20 rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.sstFollowUp}
                  onChange={(event) => patchDraft({ sstFollowUp: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-xs md:col-span-2">
                <span className="font-label-sm text-label-sm">
                  Observaciones administrativas
                </span>
                <textarea
                  className="min-h-20 rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.adminObservations}
                  onChange={(event) =>
                    patchDraft({ adminObservations: event.target.value })
                  }
                />
              </label>
            </div>

            <div className="mt-md flex justify-end gap-sm">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-sm py-2"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                className="rounded-lg bg-primary px-sm py-2 font-semibold text-on-primary disabled:opacity-60"
                onClick={save}
              >
                {pending ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AlertCard({
  title,
  value,
  detail,
  tone,
  icon,
  badge,
}: Readonly<{
  title: string;
  value: number;
  detail: string;
  tone: "error" | "secondary" | "muted";
  icon: string;
  badge: string;
}>) {
  const titleClass =
    tone === "error"
      ? "text-error"
      : tone === "secondary"
        ? "text-secondary"
        : "text-on-surface-variant";
  const badgeClass =
    tone === "error"
      ? "bg-error-container text-on-error-container"
      : tone === "secondary"
        ? "bg-secondary-fixed text-on-secondary-fixed"
        : "bg-surface-container text-on-surface-variant";
  const dotClass =
    tone === "error" ? "bg-error" : tone === "secondary" ? "bg-secondary" : "bg-outline";

  return (
    <div className="rounded-xl bg-surface-container-lowest p-base shadow-sm">
      <div className="flex items-center justify-between pb-1">
        <span
          className={`flex items-center gap-1.5 font-label-sm text-label-sm font-bold tracking-wider uppercase ${titleClass}`}
        >
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          {title}
        </span>
        <MaterialIcon name={icon} className={`text-[20px] ${titleClass}`} />
      </div>
      <div className="mt-1 flex items-baseline justify-between">
        <div className="text-[32px] leading-tight font-bold text-on-surface">{value}</div>
        <span className={`rounded px-2 py-0.5 font-label-sm text-label-sm font-bold ${badgeClass}`}>
          {badge}
        </span>
      </div>
      <p className="mt-1 text-[12px] leading-tight text-on-surface-variant">{detail}</p>
    </div>
  );
}

function StatusChip({ status }: Readonly<{ status: LeaveStatus }>) {
  const styles: Record<LeaveStatus, string> = {
    activa: "bg-secondary-fixed text-on-secondary-fixed",
    por_vencer: "bg-amber-100 text-amber-900",
    vencida_sin_cierre: "bg-error-container text-on-error-container",
    cerrada: "bg-surface-container text-on-surface-variant",
    en_reintegro: "bg-primary-container text-on-primary-container",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${styles[status]}`}
    >
      {LEAVE_STATUS_LABELS[status]}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}>) {
  return (
    <label className="flex flex-col gap-xs">
      <span className="font-label-sm text-label-sm">{label}</span>
      <input
        type={type}
        className="rounded-lg bg-surface-container-low px-sm py-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
