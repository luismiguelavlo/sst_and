"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportAccidentsAction,
  deleteAccidentAction,
  saveAccidentAction,
} from "@/lib/sg-sst/accidentes/actions";
import {
  ACCIDENT_EXCEL_MAX_ROWS,
  type AccidentExcelImportRow,
} from "@/lib/sg-sst/accidentes/excel";
import {
  downloadAccidentsExcel,
  downloadAccidentsTemplate,
  parseAccidentsExcelFile,
} from "@/lib/sg-sst/accidentes/excel-client";
import {
  formatChunkImportToast,
  runChunkedBulkImport,
} from "@/lib/sg-sst/import-chunks";
import {
  ACCIDENT_EVENT_TYPE_LABELS,
  ACCIDENT_EVENT_TYPES,
  ACCIDENT_STATUS_LABELS,
  ACCIDENT_STATUSES,
  draftFromAccident,
  emptyAccidentDraft,
  emptyCausesDraft,
  type AccidentEventType,
  type AccidentStats,
  type AccidentStatus,
  type CausesRanking,
  type CountBucket,
  type SstAccidentEvent,
  type SstAccidentEventDraft,
} from "@/lib/sg-sst/accidentes/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type AccidentsMasterScreenProps = {
  events: SstAccidentEvent[];
  stats: AccidentStats;
  causesRanking: CausesRanking;
  farms: SstFarm[];
  workers: SstWorker[];
};

type MainTab = "eventos" | "causas";

const STATUS_CHIP: Record<AccidentStatus, string> = {
  en_investigacion: "bg-error-container text-on-error-container",
  en_seguimiento: "bg-secondary-fixed text-on-secondary-fixed",
  cerrado: "bg-surface-container-high text-on-surface-variant",
};

function BarList({
  title,
  items,
  emptyLabel = "Sin datos",
}: Readonly<{ title: string; items: CountBucket[]; emptyLabel?: string }>) {
  const max = items[0]?.count || 1;
  return (
    <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <h3 className="mb-sm font-headline-md text-headline-md text-on-surface">{title}</h3>
      <div className="space-y-sm">
        {items.slice(0, 8).map((item) => (
          <div key={`${title}-${item.key}`}>
            <div className="mb-1 flex items-center justify-between gap-2 font-label-sm text-label-sm">
              <span className="truncate text-on-surface">{item.label}</span>
              <span className="shrink-0 font-bold text-primary">{item.count}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(6, (item.count / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="py-sm text-center font-body-sm text-body-sm text-on-surface-variant">
            {emptyLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function AccidentsMasterScreen({
  events,
  stats,
  causesRanking,
  farms,
  workers,
}: Readonly<AccidentsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<MainTab>("eventos");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<AccidentEventType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AccidentStatus | "all">("all");
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<AccidentExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstAccidentEventDraft | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<SstWorker | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const maxCause = causesRanking.items[0]?.count || 1;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((item) => {
      if (typeFilter !== "all" && item.eventType !== typeFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.eventNumber.toLowerCase().includes(q) ||
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.workerCode.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.mechanism.toLowerCase().includes(q) ||
        item.bodyPart.toLowerCase().includes(q) ||
        ACCIDENT_EVENT_TYPE_LABELS[item.eventType].toLowerCase().includes(q)
      );
    });
  }, [events, typeFilter, statusFilter, farmId, query]);

  const selected = useMemo(
    () => events.find((item) => item.id === selectedId) ?? null,
    [events, selectedId],
  );

  function openCreate() {
    setEditing(emptyAccidentDraft());
    setSelectedWorker(null);
  }

  function openEdit(item: SstAccidentEvent) {
    setEditing(draftFromAccident(item));
    setSelectedWorker(workers.find((w) => w.id === item.workerId) ?? null);
    setSelectedId(item.id);
  }

  function applyWorker(worker: SstWorker | null) {
    setSelectedWorker(worker);
    if (!editing) return;
    setEditing({
      ...editing,
      workerId: worker?.id ?? "",
      companySnapshot: worker?.company ?? editing.companySnapshot,
      jobTitleSnapshot: worker?.jobTitle ?? editing.jobTitleSnapshot,
      areaSnapshot: worker?.area ?? editing.areaSnapshot,
      workCenterSnapshot: worker?.workCenter ?? editing.workCenterSnapshot,
      farmId: worker?.farmId ?? editing.farmId,
    });
  }

  function patchDraft(patch: Partial<SstAccidentEventDraft>) {
    if (!editing) return;
    setEditing({ ...editing, ...patch });
  }

  function patchCauses(patch: Partial<NonNullable<SstAccidentEventDraft["causes"]>>) {
    if (!editing) return;
    setEditing({
      ...editing,
      causes: { ...(editing.causes ?? emptyCausesDraft()), ...patch },
    });
  }

  function handleExport() {
    downloadAccidentsExcel(
      filtered,
      `accidentes-incidentes-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} eventos.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseAccidentsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > ACCIDENT_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${ACCIDENT_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
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
      const result = await runChunkedBulkImport(preview, (chunk) =>
        bulkImportAccidentsAction({ rows: chunk }),
      );
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(formatChunkImportToast(result), {
        variant: result.failed > 0 ? "info" : "success",
      });
      setPreview([]);
      setFileName("");
      router.refresh();
    });
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveAccidentAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editing.id ? "Evento actualizado." : "Evento registrado.");
      setEditing(null);
      setSelectedId(result.id);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("¿Eliminar este evento y su investigación vinculada?")) return;
    startTransition(async () => {
      const result = await deleteAccidentAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Evento eliminado.");
      if (selectedId === id) setSelectedId(null);
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-4xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="emergency" className="text-[16px] text-primary" />
            <span>SG-SST · Res. 1401 / Dec. 1072</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Accidentes e incidentes
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Registro de eventos, causas y apertura automática de investigación para
            accidentes de trabajo (15 días hábiles legales).
          </p>
        </div>
        <div className="flex flex-wrap gap-xs">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-sm py-2 font-label-md text-label-md"
            onClick={() => downloadAccidentsTemplate()}
          >
            <MaterialIcon name="download" className="text-[18px]" />
            Plantilla
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-sm py-2 font-label-md text-label-md"
            onClick={handleExport}
          >
            <MaterialIcon name="file_export" className="text-[18px]" />
            Exportar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-sm py-2 font-label-md text-label-md"
            onClick={() => inputRef.current?.click()}
          >
            <MaterialIcon name="upload_file" className="text-[18px]" />
            Importar
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-sm py-2 font-label-md text-label-md font-semibold text-on-primary"
            onClick={openCreate}
          >
            <MaterialIcon name="add" className="text-[18px]" />
            Nuevo evento
          </button>
        </div>
      </header>

      <div className="grid gap-sm sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total eventos", value: stats.total, icon: "emergency" },
          {
            label: "Accidentes de trabajo",
            value: stats.accidentesTrabajo,
            icon: "personal_injury",
          },
          { label: "Incidentes", value: stats.incidentes, icon: "warning" },
          {
            label: "En investigación",
            value: stats.enInvestigacion,
            icon: "policy",
          },
          {
            label: "Días perdidos",
            value: stats.lostDaysSum,
            icon: "event_busy",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl bg-surface-container-lowest p-base shadow-sm"
          >
            <div className="mb-1 flex items-center gap-1 text-on-surface-variant">
              <MaterialIcon name={kpi.icon} className="text-[16px]" />
              <span className="font-label-sm text-label-sm">{kpi.label}</span>
            </div>
            <div className="font-headline-lg text-headline-lg font-bold text-on-surface">
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-xs rounded-xl bg-surface-container-lowest p-1 shadow-sm">
        {(
          [
            { id: "eventos", label: "Eventos", icon: "list_alt" },
            { id: "causas", label: "Causas", icon: "account_tree" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-sm py-2 font-label-md text-label-md transition-colors ${
              tab === item.id
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
            onClick={() => setTab(item.id)}
          >
            <MaterialIcon name={item.icon} className="text-[18px]" />
            {item.label}
          </button>
        ))}
      </div>

      {tab === "eventos" ? (
        <>
          <div className="grid gap-md lg:grid-cols-2 xl:grid-cols-3">
            <BarList title="Tendencia mensual" items={stats.monthlyTrend} />
            <BarList title="Por empresa" items={stats.byCompany} />
            <BarList title="Por centro" items={stats.byFarm} />
            <BarList title="Por área" items={stats.byArea} />
            <BarList title="Por cargo" items={stats.byJob} />
            <BarList title="Por mecanismo" items={stats.byMechanism} />
            <BarList title="Por parte del cuerpo" items={stats.byBodyPart} />
            <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
              <h3 className="mb-sm font-headline-md text-headline-md text-on-surface">
                Estados
              </h3>
              <div className="space-y-sm">
                {ACCIDENT_STATUSES.map((status) => (
                  <div
                    key={status}
                    className="flex items-center justify-between rounded-lg bg-surface-container-low px-sm py-2"
                  >
                    <span className="font-label-md text-label-md">
                      {ACCIDENT_STATUS_LABELS[status]}
                    </span>
                    <strong className="text-primary">{stats.byStatus[status]}</strong>
                  </div>
                ))}
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
                    {preview.length} filas. Número de evento existente → actualización.
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

          <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
            <div className="mb-md flex flex-col gap-sm lg:flex-row lg:items-end">
              <label className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Buscar
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2 font-body-sm text-body-sm"
                  placeholder="Número, trabajador, mecanismo…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Tipo
                </span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as AccidentEventType | "all")
                  }
                >
                  <option value="all">Todos</option>
                  {ACCIDENT_EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {ACCIDENT_EVENT_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Estado
                </span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as AccidentStatus | "all")
                  }
                >
                  <option value="all">Todos</option>
                  {ACCIDENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {ACCIDENT_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Centro de trabajo
                </span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                >
                  <option value="all">Todas</option>
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant/30 font-label-sm text-label-sm text-on-surface-variant">
                    <th className="px-2 py-2">Evento</th>
                    <th className="px-2 py-2">Fecha</th>
                    <th className="px-2 py-2">Trabajador</th>
                    <th className="px-2 py-2">Tipo</th>
                    <th className="px-2 py-2">Mecanismo</th>
                    <th className="px-2 py-2">Días</th>
                    <th className="px-2 py-2">Estado</th>
                    <th className="px-2 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-outline-variant/15 hover:bg-surface-container-low ${
                        selectedId === item.id ? "bg-primary-fixed/40" : ""
                      }`}
                    >
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          className="font-label-md text-label-md font-bold text-primary"
                          onClick={() => setSelectedId(item.id)}
                        >
                          {item.eventNumber}
                        </button>
                      </td>
                      <td className="px-2 py-2 font-body-sm text-body-sm">
                        {item.eventDate}
                        {item.eventTime ? (
                          <span className="block text-on-surface-variant">
                            {item.eventTime.slice(0, 5)}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-2 py-2">
                        <div className="font-label-md text-label-md">{item.workerName}</div>
                        <div className="text-[12px] text-on-surface-variant">
                          {item.jobTitleSnapshot || item.companySnapshot}
                        </div>
                      </td>
                      <td className="px-2 py-2 font-body-sm text-body-sm">
                        {ACCIDENT_EVENT_TYPE_LABELS[item.eventType]}
                      </td>
                      <td className="px-2 py-2 font-body-sm text-body-sm">
                        {item.mechanism || "—"}
                      </td>
                      <td className="px-2 py-2 font-label-md text-label-md font-bold">
                        {item.lostDays}
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-bold ${STATUS_CHIP[item.status]}`}
                        >
                          {ACCIDENT_STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            className="rounded bg-surface-container px-2 py-1 text-[12px]"
                            onClick={() => openEdit(item)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="rounded bg-error-container px-2 py-1 text-[12px] text-on-error-container"
                            onClick={() => remove(item.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-2 py-xl text-center text-on-surface-variant"
                      >
                        No hay eventos con los filtros actuales.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          {selected ? (
            <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
              <div className="mb-sm flex items-center justify-between gap-2">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Detalle {selected.eventNumber}
                </h2>
                <button
                  type="button"
                  className="rounded-lg bg-primary px-sm py-1.5 font-label-md text-label-md text-on-primary"
                  onClick={() => openEdit(selected)}
                >
                  Editar
                </button>
              </div>
              <p className="mb-sm font-body-md text-body-md text-on-surface">
                {selected.description || "Sin descripción."}
              </p>
              <div className="grid gap-sm sm:grid-cols-2 lg:grid-cols-4 font-body-sm text-body-sm">
                <div>
                  <span className="text-on-surface-variant">Área:</span>{" "}
                  {selected.areaSnapshot || "—"}
                </div>
                <div>
                  <span className="text-on-surface-variant">Centro:</span>{" "}
                  {selected.workCenterSnapshot || "—"}
                </div>
                <div>
                  <span className="text-on-surface-variant">Parte cuerpo:</span>{" "}
                  {selected.bodyPart || "—"}
                </div>
                <div>
                  <span className="text-on-surface-variant">Lesión:</span>{" "}
                  {selected.injuryType || "—"}
                </div>
              </div>
              {selected.causes?.rootCause ? (
                <p className="mt-sm rounded-lg bg-surface-container-low px-sm py-2 font-body-sm text-body-sm">
                  <strong>Causa principal:</strong> {selected.causes.rootCause}
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-base flex items-center gap-2">
            <span className="h-4 w-1.5 rounded-full bg-primary" />
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Principales causas
            </h2>
          </div>
          <p className="mb-md font-body-sm text-body-sm text-on-surface-variant">
            Ranking por causa raíz, actos/condiciones subestándar y factores básicos.
            Universo con análisis: {causesRanking.totalWithCauses} eventos.
          </p>
          <div className="space-y-base">
            {causesRanking.items.map((item, index) => (
              <div
                key={`${item.category}-${item.label}`}
                className="rounded-lg p-base transition-colors hover:bg-surface-container-low"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      {index + 1}. {item.label}
                    </span>
                  </div>
                  <div className="shrink-0 font-headline-md text-headline-md font-bold text-primary">
                    {item.count}{" "}
                    <span className="text-body-sm font-normal text-on-surface-variant">
                      ({item.percent}%)
                    </span>
                  </div>
                </div>
                <div className="h-3.5 w-full overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${Math.max(8, (item.count / maxCause) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {causesRanking.items.length === 0 ? (
              <p className="py-md text-center text-on-surface-variant">
                Sin causas registradas. Edita un evento y completa la pestaña de causas.
              </p>
            ) : null}
          </div>
        </div>
      )}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40 p-sm sm:items-center">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-2xl">
            <div className="mb-md flex items-center justify-between gap-2">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {editing.id ? "Editar evento" : "Nuevo evento"}
              </h2>
              <button
                type="button"
                className="rounded-full bg-surface-container p-2"
                onClick={() => setEditing(null)}
              >
                <MaterialIcon name="close" />
              </button>
            </div>

            <div className="grid gap-sm sm:grid-cols-2">
              <label className="sm:col-span-2 flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Trabajador *
                </span>
                <WorkerSelect
                  workers={workers}
                  value={editing.workerId}
                  includeRetired
                  required
                  onChange={applyWorker}
                />
                {selectedWorker ? (
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {selectedWorker.company} · {selectedWorker.jobTitle} ·{" "}
                    {selectedWorker.area}
                  </span>
                ) : null}
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Fecha *
                </span>
                <input
                  type="date"
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.eventDate}
                  onChange={(e) => patchDraft({ eventDate: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Hora
                </span>
                <input
                  type="time"
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={(editing.eventTime ?? "").slice(0, 5)}
                  onChange={(e) => patchDraft({ eventTime: e.target.value || null })}
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Tipo de evento *
                </span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.eventType}
                  onChange={(e) =>
                    patchDraft({ eventType: e.target.value as AccidentEventType })
                  }
                >
                  {ACCIDENT_EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {ACCIDENT_EVENT_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Estado *
                </span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.status}
                  onChange={(e) =>
                    patchDraft({ status: e.target.value as AccidentStatus })
                  }
                >
                  {ACCIDENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {ACCIDENT_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Empresa
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.companySnapshot ?? ""}
                  onChange={(e) => patchDraft({ companySnapshot: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Cargo
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.jobTitleSnapshot ?? ""}
                  onChange={(e) => patchDraft({ jobTitleSnapshot: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Área
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.areaSnapshot ?? ""}
                  onChange={(e) => patchDraft({ areaSnapshot: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Centro de trabajo
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.workCenterSnapshot ?? ""}
                  onChange={(e) => patchDraft({ workCenterSnapshot: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Centro de trabajo
                </span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.farmId ?? ""}
                  onChange={(e) => patchDraft({ farmId: e.target.value || null })}
                >
                  <option value="">Sin centro</option>
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Descripción
                </span>
                <textarea
                  className="min-h-20 rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.description}
                  onChange={(e) => patchDraft({ description: e.target.value })}
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Tipo de accidente
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.accidentKind}
                  onChange={(e) => patchDraft({ accidentKind: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Mecanismo
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.mechanism}
                  onChange={(e) => patchDraft({ mechanism: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Agente
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.agent}
                  onChange={(e) => patchDraft({ agent: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Parte del cuerpo
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.bodyPart}
                  onChange={(e) => patchDraft({ bodyPart: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Tipo de lesión
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.injuryType}
                  onChange={(e) => patchDraft({ injuryType: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Días perdidos
                </span>
                <input
                  type="number"
                  min={0}
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.lostDays}
                  onChange={(e) =>
                    patchDraft({ lostDays: Number.parseInt(e.target.value, 10) || 0 })
                  }
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Origen
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.origin}
                  onChange={(e) => patchDraft({ origin: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Notas de investigación
                </span>
                <textarea
                  className="min-h-16 rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.investigationNotes}
                  onChange={(e) => patchDraft({ investigationNotes: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Acción correctiva
                </span>
                <textarea
                  className="min-h-16 rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.correctiveActionNotes}
                  onChange={(e) =>
                    patchDraft({ correctiveActionNotes: e.target.value })
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Evidencia (URL)
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.evidenceUrl}
                  onChange={(e) => patchDraft({ evidenceUrl: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Nombre evidencia
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-sm py-2"
                  value={editing.evidenceName}
                  onChange={(e) => patchDraft({ evidenceName: e.target.value })}
                />
              </label>
            </div>

            <div className="mt-md border-t border-outline-variant/20 pt-md">
              <h3 className="mb-sm font-headline-md text-headline-md text-on-surface">
                Causas del evento
              </h3>
              <div className="grid gap-sm sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Acto subestándar
                  </span>
                  <textarea
                    className="min-h-14 rounded-lg bg-surface-container-low px-sm py-2"
                    value={editing.causes?.immediateAct ?? ""}
                    onChange={(e) => patchCauses({ immediateAct: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Condición subestándar
                  </span>
                  <textarea
                    className="min-h-14 rounded-lg bg-surface-container-low px-sm py-2"
                    value={editing.causes?.immediateCondition ?? ""}
                    onChange={(e) =>
                      patchCauses({ immediateCondition: e.target.value })
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Factor personal
                  </span>
                  <textarea
                    className="min-h-14 rounded-lg bg-surface-container-low px-sm py-2"
                    value={editing.causes?.basicPersonal ?? ""}
                    onChange={(e) => patchCauses({ basicPersonal: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Factor de trabajo
                  </span>
                  <textarea
                    className="min-h-14 rounded-lg bg-surface-container-low px-sm py-2"
                    value={editing.causes?.basicWork ?? ""}
                    onChange={(e) => patchCauses({ basicWork: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Causa principal (raíz)
                  </span>
                  <textarea
                    className="min-h-14 rounded-lg bg-surface-container-low px-sm py-2"
                    value={editing.causes?.rootCause ?? ""}
                    onChange={(e) => patchCauses({ rootCause: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Agente (análisis)
                  </span>
                  <input
                    className="rounded-lg bg-surface-container-low px-sm py-2"
                    value={editing.causes?.agent ?? ""}
                    onChange={(e) => patchCauses({ agent: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Mecanismo (análisis)
                  </span>
                  <input
                    className="rounded-lg bg-surface-container-low px-sm py-2"
                    value={editing.causes?.mechanism ?? ""}
                    onChange={(e) => patchCauses({ mechanism: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Acción correctiva (causa)
                  </span>
                  <textarea
                    className="min-h-14 rounded-lg bg-surface-container-low px-sm py-2"
                    value={editing.causes?.correctiveAction ?? ""}
                    onChange={(e) =>
                      patchCauses({ correctiveAction: e.target.value })
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Acción preventiva
                  </span>
                  <textarea
                    className="min-h-14 rounded-lg bg-surface-container-low px-sm py-2"
                    value={editing.causes?.preventiveAction ?? ""}
                    onChange={(e) =>
                      patchCauses({ preventiveAction: e.target.value })
                    }
                  />
                </label>
              </div>
            </div>

            {editing.eventType === "accidente_trabajo" && !editing.id ? (
              <p className="mt-sm rounded-lg bg-primary-fixed/50 px-sm py-2 font-label-sm text-label-sm text-on-primary-fixed-variant">
                Al guardar se creará automáticamente la investigación INV-AAAA-### con
                vencimiento legal a +15 días y alerta de cumplimiento.
              </p>
            ) : null}

            <div className="mt-md flex justify-end gap-xs">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-md py-2"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                className="rounded-lg bg-primary px-md py-2 font-semibold text-on-primary disabled:opacity-60"
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
