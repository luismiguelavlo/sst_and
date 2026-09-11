"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportActionsAction,
  deleteActionAction,
  saveActionAction,
} from "@/lib/sg-sst/acciones/actions";
import {
  ACTION_EXCEL_MAX_ROWS,
  type ActionExcelImportRow,
} from "@/lib/sg-sst/acciones/excel";
import {
  downloadActionsExcel,
  downloadActionsTemplate,
  parseActionsExcelFile,
} from "@/lib/sg-sst/acciones/excel-client";
import {
  formatChunkImportToast,
  runChunkedBulkImport,
} from "@/lib/sg-sst/import-chunks";
import {
  ACTION_EFFICACY_LABELS,
  ACTION_EFFICACY_STATUSES,
  ACTION_KIND_LABELS,
  ACTION_KINDS,
  ACTION_MANUAL_STATUSES,
  ACTION_SOURCE_LABELS,
  ACTION_SOURCE_TYPES,
  ACTION_STATUS_LABELS,
  draftFromAction,
  emptyActionDraft,
  type ActionEfficacyStatus,
  type ActionKind,
  type ActionManualStatus,
  type ActionSourceType,
  type ActionStats,
  type ActionStatus,
  type SstCorrectiveActionDraft,
  type SstCorrectiveActionView,
} from "@/lib/sg-sst/acciones/types";

type ActionsMasterScreenProps = {
  actions: SstCorrectiveActionView[];
  stats: ActionStats;
  farms: SstFarm[];
};

const STATUS_FILTERS: { id: ActionStatus | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "vencida", label: "Vencidas" },
  { id: "proxima_vencer", label: "Próximas" },
  { id: "en_ejecucion", label: "En ejecución" },
  { id: "cerrada", label: "Cerradas" },
];

export function ActionsMasterScreen({
  actions,
  stats,
  farms,
}: Readonly<ActionsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ActionStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<ActionSourceType | "all">("all");
  const [efficacyFilter, setEfficacyFilter] = useState<ActionEfficacyStatus | "all">(
    "all",
  );
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<ActionExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstCorrectiveActionDraft | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return actions.filter((item) => {
      if (statusFilter !== "all" && item.effectiveStatus !== statusFilter) return false;
      if (sourceFilter !== "all" && item.sourceType !== sourceFilter) return false;
      if (efficacyFilter !== "all" && item.efficacyStatus !== efficacyFilter) {
        return false;
      }
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.folio.toLowerCase().includes(q) ||
        item.finding.toLowerCase().includes(q) ||
        item.actionPlan.toLowerCase().includes(q) ||
        item.responsibleName.toLowerCase().includes(q) ||
        item.sourceRef.toLowerCase().includes(q) ||
        ACTION_SOURCE_LABELS[item.sourceType].toLowerCase().includes(q) ||
        (item.farmName ?? "").toLowerCase().includes(q)
      );
    });
  }, [actions, statusFilter, sourceFilter, efficacyFilter, farmId, query]);

  function handleExport() {
    downloadActionsExcel(
      filtered,
      `acciones-correctivas-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} registros.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseActionsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > ACTION_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${ACTION_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
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
        bulkImportActionsAction({ rows: chunk }),
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

  function openCreate() {
    setEditing(emptyActionDraft());
  }

  function openEdit(item: SstCorrectiveActionView) {
    setEditing(draftFromAction(item));
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveActionAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editing.id ? "Acción actualizada." : "Acción creada.");
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("¿Eliminar esta acción correctiva?")) return;
    startTransition(async () => {
      const result = await deleteActionAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Acción eliminada.");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <span className="rounded bg-surface-container-high px-xs py-0.5 font-medium text-primary">
              Capítulo 17
            </span>
            <span>·</span>
            <span>Ciclo PHVA · ISO 45001:10.2</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Gestión de Acciones Correctivas, Preventivas y de Mejora (CAPA)
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Cierre de hallazgos derivados de accidentes, incidentes, inspecciones, auditorías,
            COPASST, CCL, PESV y SG-SST (Dec. 1072 / Res. 0312).
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadActionsTemplate()}
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
            Nueva acción
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

      <section
        aria-label="Métricas clave de acciones correctivas"
        className="grid grid-cols-2 gap-sm md:grid-cols-3 xl:grid-cols-5"
      >
        <Kpi
          label="Abiertas"
          value={stats.abiertas}
          detail={`${stats.total} registros en total`}
          icon="pending_actions"
        />
        <Kpi
          label="Vencidas"
          value={stats.vencidas}
          detail="Compromiso superado"
          icon="error"
          accent="text-error"
        />
        <Kpi
          label="Próximas a vencer"
          value={stats.proximas}
          detail="≤ 30 días al compromiso"
          icon="schedule"
        />
        <Kpi
          label="Cerradas"
          value={stats.cerradas}
          detail="Con cierre registrado"
          icon="check_circle"
          accent="text-primary"
        />
        <Kpi
          label="% Cumplimiento"
          value={`${stats.cumplimientoPct}%`}
          detail="Cerradas / total"
          icon="trending_up"
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

      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-sm shadow-sm">
        <div className="flex flex-col gap-sm lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <MaterialIcon
              name="search"
              className="absolute top-2.5 left-3 text-[20px] text-outline"
            />
            <input
              className="w-full rounded-lg bg-surface-container-low py-2.5 pr-4 pl-10 font-body-sm text-body-sm focus:outline-none"
              placeholder="Buscar por folio (AC-…), hallazgo, responsable o referencia…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
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
        </div>
        <div className="grid grid-cols-1 gap-xs sm:grid-cols-3">
          <select
            className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
            value={sourceFilter}
            onChange={(event) =>
              setSourceFilter(event.target.value as ActionSourceType | "all")
            }
          >
            <option value="all">Todas las fuentes</option>
            {ACTION_SOURCE_TYPES.map((source) => (
              <option key={source} value={source}>
                {ACTION_SOURCE_LABELS[source]}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
            value={efficacyFilter}
            onChange={(event) =>
              setEfficacyFilter(event.target.value as ActionEfficacyStatus | "all")
            }
          >
            <option value="all">Toda la eficacia</option>
            {ACTION_EFFICACY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {ACTION_EFFICACY_LABELS[status]}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
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
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between bg-surface-container-low/60 px-md py-sm">
          <div className="flex items-center gap-xs">
            <MaterialIcon name="analytics" className="text-[20px] text-primary" />
            <span className="font-label-md text-label-md font-semibold text-primary">
              Registro maestro CAPA
            </span>
            <span className="rounded bg-surface-container-high px-xs py-0.5 font-mono text-[11px]">
              {filtered.length} visibles
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                <th className="px-md py-sm">ID / Tipo</th>
                <th className="px-sm py-sm">Fuente &amp; hallazgo</th>
                <th className="px-sm py-sm min-w-[200px]">Plan de acción</th>
                <th className="px-sm py-sm">Responsable &amp; sede</th>
                <th className="px-sm py-sm">Plazos</th>
                <th className="px-sm py-sm">Estado</th>
                <th className="px-sm py-sm">Eficacia</th>
                <th className="px-md py-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/50">
                  <td className="px-md py-sm align-top whitespace-nowrap">
                    <div className="font-mono text-[12px] font-semibold text-primary">
                      {item.folio}
                    </div>
                    <KindChip kind={item.actionKind} />
                  </td>
                  <td className="px-sm py-sm align-top">
                    <div className="text-[11px] font-semibold text-secondary">
                      {ACTION_SOURCE_LABELS[item.sourceType]}
                      {item.sourceRef ? ` · ${item.sourceRef}` : ""}
                    </div>
                    <p className="mt-1 line-clamp-3 max-w-[240px] font-body-sm text-body-sm">
                      {item.finding}
                    </p>
                  </td>
                  <td className="px-sm py-sm align-top">
                    <p className="line-clamp-3 max-w-[260px] font-body-sm text-body-sm">
                      {item.actionPlan}
                    </p>
                    {item.evidenceUrl ? (
                      <a
                        href={item.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary underline"
                      >
                        <MaterialIcon name="attach_file" className="text-[14px]" />
                        {item.evidenceName || "Evidencia"}
                      </a>
                    ) : null}
                  </td>
                  <td className="px-sm py-sm align-top">
                    <div className="font-semibold text-on-surface">
                      {item.responsibleName}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      {item.farmName ?? "Sin centro"}
                    </div>
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                    <div>
                      <span className="text-outline">Compromiso:</span> {item.commitDate}
                    </div>
                    <div>
                      <span className="text-outline">Cierre:</span>{" "}
                      {item.closedAt ?? "—"}
                    </div>
                    <div className="font-semibold">
                      {item.daysRemaining != null
                        ? `${item.daysRemaining}d restantes`
                        : "Sin plazo"}
                    </div>
                  </td>
                  <td className="px-sm py-sm align-top">
                    <StatusBadge status={item.effectiveStatus} />
                  </td>
                  <td className="px-sm py-sm align-top">
                    <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[11px] font-semibold">
                      {ACTION_EFFICACY_LABELS[item.efficacyStatus]}
                    </span>
                  </td>
                  <td className="px-md py-sm text-right align-top">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        className="rounded-lg bg-surface-container p-1.5"
                        onClick={() => openEdit(item)}
                        title="Editar"
                      >
                        <MaterialIcon name="edit" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-error-container p-1.5 text-on-error-container"
                        disabled={pending}
                        onClick={() => remove(item.id)}
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
                  <td
                    colSpan={8}
                    className="px-md py-lg text-center text-on-surface-variant"
                  >
                    No hay acciones con los filtros actuales. Crea la primera o importa
                    Excel.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <ActionFormModal
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

function ActionFormModal({
  draft,
  farms,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstCorrectiveActionDraft;
  farms: SstFarm[];
  pending: boolean;
  onChange: (draft: SstCorrectiveActionDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Editar acción CAPA" : "Nueva acción correctiva"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fuente / origen</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.sourceType}
              onChange={(event) =>
                onChange({
                  ...draft,
                  sourceType: event.target.value as ActionSourceType,
                })
              }
            >
              {ACTION_SOURCE_TYPES.map((source) => (
                <option key={source} value={source}>
                  {ACTION_SOURCE_LABELS[source]}
                </option>
              ))}
            </select>
          </label>

          <Field
            label="Referencia de origen"
            value={draft.sourceRef}
            onChange={(value) => onChange({ ...draft, sourceRef: value })}
            placeholder="Ej. INS-2026-001 / AT-…"
          />

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Tipo de acción</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.actionKind}
              onChange={(event) =>
                onChange({
                  ...draft,
                  actionKind: event.target.value as ActionKind,
                })
              }
            >
              {ACTION_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {ACTION_KIND_LABELS[kind]}
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
                  status: event.target.value as ActionManualStatus,
                })
              }
            >
              {ACTION_MANUAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {ACTION_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Hallazgo</span>
            <textarea
              className="min-h-20 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.finding}
              onChange={(event) => onChange({ ...draft, finding: event.target.value })}
              placeholder="Descripción del hallazgo o no conformidad…"
            />
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Plan de acción</span>
            <textarea
              className="min-h-24 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.actionPlan}
              onChange={(event) =>
                onChange({ ...draft, actionPlan: event.target.value })
              }
              placeholder="Qué se hará, con qué recurso y cómo se verificará…"
            />
          </label>

          <Field
            label="Responsable"
            value={draft.responsibleName}
            onChange={(value) => onChange({ ...draft, responsibleName: value })}
          />

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Centro de trabajo (opcional)</span>
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
            <span className="font-label-sm text-label-sm">Fecha de compromiso</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.commitDate}
              onChange={(event) =>
                onChange({ ...draft, commitDate: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha de cierre</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.closedAt ?? ""}
              onChange={(event) =>
                onChange({ ...draft, closedAt: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Verificación de eficacia</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.efficacyStatus}
              onChange={(event) =>
                onChange({
                  ...draft,
                  efficacyStatus: event.target.value as ActionEfficacyStatus,
                })
              }
            >
              {ACTION_EFFICACY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {ACTION_EFFICACY_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <Field
            label="Nombre evidencia"
            value={draft.evidenceName}
            onChange={(value) => onChange({ ...draft, evidenceName: value })}
          />
          <Field
            label="URL evidencia"
            value={draft.evidenceUrl}
            onChange={(value) => onChange({ ...draft, evidenceUrl: value })}
          />

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Observaciones</span>
            <textarea
              className="min-h-20 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.observations}
              onChange={(event) =>
                onChange({ ...draft, observations: event.target.value })
              }
            />
          </label>
        </div>

        <div className="mt-md flex justify-end gap-sm">
          <button
            type="button"
            className="rounded-lg bg-surface-container px-base py-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            className="rounded-lg bg-primary px-base py-sm font-semibold text-on-primary disabled:opacity-60"
            onClick={onSave}
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}>) {
  return (
    <label className="flex flex-col gap-xs">
      <span className="font-label-sm text-label-sm">{label}</span>
      <input
        className="rounded-lg bg-surface-container-low px-sm py-sm"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Kpi({
  label,
  value,
  detail,
  icon,
  accent,
}: Readonly<{
  label: string;
  value: string | number;
  detail: React.ReactNode;
  icon: string;
  accent?: string;
}>) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-sm shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
          {label}
        </span>
        <MaterialIcon name={icon} className="text-[20px] text-primary" />
      </div>
      <div
        className={`font-headline-md text-headline-md font-bold tracking-tight ${accent ?? "text-on-surface"}`}
      >
        {value}
      </div>
      <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
        {detail}
      </div>
    </div>
  );
}

function KindChip({ kind }: Readonly<{ kind: ActionKind }>) {
  const styles: Record<ActionKind, string> = {
    correctiva: "bg-error-container text-on-error-container",
    preventiva: "bg-secondary-fixed text-on-secondary-fixed",
    mejora: "bg-tertiary-container text-on-tertiary-container",
  };
  return (
    <span
      className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${styles[kind]}`}
    >
      {ACTION_KIND_LABELS[kind]}
    </span>
  );
}

function StatusBadge({ status }: Readonly<{ status: ActionStatus }>) {
  const styles: Record<ActionStatus, string> = {
    vencida: "bg-error-container text-on-error-container",
    proxima_vencer: "bg-amber-100 text-amber-900",
    en_ejecucion: "bg-surface-container-high text-on-surface",
    cerrada: "bg-emerald-100 text-emerald-900",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${styles[status]}`}
    >
      {ACTION_STATUS_LABELS[status]}
    </span>
  );
}
