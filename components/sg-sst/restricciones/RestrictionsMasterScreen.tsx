"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SemaphoreBadge } from "@/components/sg-sst/alerts/SemaphoreBadge";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportRestrictionsAction,
  deleteRestrictionAction,
  saveRestrictionAction,
} from "@/lib/sg-sst/restricciones/actions";
import {
  RESTRICTION_EXCEL_MAX_ROWS,
  type RestrictionExcelImportRow,
} from "@/lib/sg-sst/restricciones/excel";
import {
  downloadRestrictionsExcel,
  downloadRestrictionsTemplate,
  parseRestrictionsExcelFile,
} from "@/lib/sg-sst/restricciones/excel-client";
import {
  RESTRICTION_KIND_LABELS,
  RESTRICTION_KINDS,
  RESTRICTION_MANUAL_STATUSES,
  RESTRICTION_STATUS_LABELS,
  draftFromRestriction,
  emptyRestrictionDraft,
  type RestrictionKind,
  type RestrictionManualStatus,
  type RestrictionStats,
  type RestrictionStatus,
  type SstRestrictionDraft,
  type SstRestrictionView,
} from "@/lib/sg-sst/restricciones/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type RestrictionsMasterScreenProps = {
  restrictions: SstRestrictionView[];
  stats: RestrictionStats;
  farms: SstFarm[];
  workers: SstWorker[];
};

const STATUS_FILTERS: { id: RestrictionStatus | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "vigente", label: "Vigentes" },
  { id: "proxima_vencer", label: "Por vencer" },
  { id: "vencida", label: "Vencidas" },
  { id: "pendiente_implementacion", label: "Pendientes" },
  { id: "cerrada", label: "Cerradas" },
];

export function RestrictionsMasterScreen({
  restrictions,
  stats,
  farms,
  workers,
}: Readonly<RestrictionsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RestrictionStatus | "all">("all");
  const [kindFilter, setKindFilter] = useState<RestrictionKind | "all">("all");
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<RestrictionExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstRestrictionDraft | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restrictions.filter((item) => {
      if (statusFilter !== "all" && item.effectiveStatus !== statusFilter) return false;
      if (kindFilter !== "all" && item.restrictionKind !== kindFilter) return false;
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.workerCode.toLowerCase().includes(q) ||
        item.folio.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q) ||
        item.responsibleName.toLowerCase().includes(q) ||
        item.jobTitleSnapshot.toLowerCase().includes(q)
      );
    });
  }, [restrictions, statusFilter, kindFilter, farmId, query]);

  function handleExport() {
    downloadRestrictionsExcel(
      filtered,
      `restricciones-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} registros.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseRestrictionsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > RESTRICTION_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${RESTRICTION_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
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
      const result = await bulkImportRestrictionsAction({ rows: preview });
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
    setEditing(emptyRestrictionDraft());
  }

  function openEdit(item: SstRestrictionView) {
    setEditing(draftFromRestriction(item));
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveRestrictionAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editing.id ? "Registro actualizado." : "Registro creado.");
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("¿Eliminar este registro de restricción / recomendación?")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteRestrictionAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Registro eliminado.");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="pan_tool" className="text-[16px] text-primary" />
            <span>Restricciones y recomendaciones</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Base maestra de restricciones y recomendaciones
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Seguimiento administrativo de limitaciones laborales, adaptaciones de puesto y
            recomendaciones de medicina laboral. Sin historia clínica ni diagnósticos.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadRestrictionsTemplate()}
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
            <MaterialIcon name="add" className="text-[20px]" />
            Nuevo registro
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

      <div className="flex items-start gap-sm rounded-xl bg-surface-container-low p-md shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
          <MaterialIcon name="privacy_tip" className="text-[22px]" />
        </div>
        <div>
          <div className="font-label-md text-label-md font-bold text-primary">
            Privacidad laboral
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Solo se registran medidas administrativas (tipo, vigencia, responsable, evidencia
            de implementación). Diagnósticos, CIE-10 e historia clínica permanecen en la IPS.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-sm md:grid-cols-3 xl:grid-cols-6">
        <Kpi
          label="Total activos"
          value={stats.active}
          detail={`${stats.total} registros en total`}
          icon="clinical_notes"
        />
        <Kpi
          label="Vigentes"
          value={stats.byStatus.vigente}
          detail="Medidas en seguimiento"
          icon="verified"
          accent="text-primary"
        />
        <Kpi
          label="Por vencer"
          value={stats.byStatus.proxima_vencer}
          detail="Revaloración 1–30 d"
          icon="schedule"
        />
        <Kpi
          label="Vencidas"
          value={stats.byStatus.vencida}
          detail="Requieren gestión"
          icon="error"
          accent="text-error"
        />
        <Kpi
          label="Pendientes"
          value={stats.byStatus.pendiente_implementacion}
          detail="Adaptación de puesto"
          icon="pending_actions"
        />
        <Kpi
          label="Cerradas"
          value={stats.byStatus.cerrada}
          detail="Alta / levantadas"
          icon="task_alt"
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
                {preview.length} filas. Folio existente → actualización. Documento debe existir
                en base maestra.
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
            placeholder="Cédula, nombre, cargo o folio (RST-…)…"
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
        <select
          className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
          value={kindFilter}
          onChange={(event) =>
            setKindFilter(event.target.value as RestrictionKind | "all")
          }
        >
          <option value="all">Todos los tipos</option>
          {RESTRICTION_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {RESTRICTION_KIND_LABELS[kind]}
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
                <th className="px-sm py-sm">Trabajador &amp; finca</th>
                <th className="px-sm py-sm">Tipo &amp; folio</th>
                <th className="px-sm py-sm">Cronograma</th>
                <th className="px-sm py-sm min-w-[200px]">Detalle</th>
                <th className="px-sm py-sm">Responsable / medida</th>
                <th className="px-sm py-sm">Seguimiento</th>
                <th className="px-md py-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/50">
                  <td className="px-md py-sm align-top">
                    <SemaphoreBadge
                      level={item.semaphore}
                      label={RESTRICTION_STATUS_LABELS[item.effectiveStatus]}
                      compact
                    />
                  </td>
                  <td className="px-sm py-sm align-top">
                    <div className="font-semibold text-on-surface">{item.workerName}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      CC {item.workerDocument}
                    </div>
                    <div className="text-[11px] font-semibold text-secondary">
                      {item.jobTitleSnapshot} · {item.farmName ?? "Sin finca"}
                    </div>
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap">
                    <KindChip kind={item.restrictionKind} />
                    <div className="mt-1 font-mono text-[11px] text-on-surface-variant">
                      {item.folio}
                    </div>
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                    <div>
                      <span className="text-outline">Emisión:</span> {item.issuedAt}
                    </div>
                    <div>
                      <span className="text-outline">Inicio:</span> {item.startDate}
                    </div>
                    <div className="font-semibold">
                      Vence: {item.dueDate ?? "Sin fecha"}
                      {item.daysRemaining != null ? ` (${item.daysRemaining}d)` : ""}
                    </div>
                  </td>
                  <td className="px-sm py-sm align-top">
                    <p className="line-clamp-3 max-w-[260px] font-body-sm text-body-sm text-on-surface">
                      {item.detail}
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
                    <div className="font-semibold text-on-surface">{item.responsibleName}</div>
                    <div className="mt-1 max-w-[220px] text-[12px] text-on-surface-variant line-clamp-2">
                      {item.measureImplemented || "Sin medida registrada"}
                    </div>
                    {item.implementedAt ? (
                      <div className="text-[11px] text-secondary">
                        Implementado: {item.implementedAt}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap">
                    <div className="font-semibold">
                      {item.nextFollowUp ?? "—"}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      {item.semaphoreLabel}
                    </div>
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
                  <td colSpan={8} className="px-md py-lg text-center text-on-surface-variant">
                    No hay registros con los filtros actuales. Crea el primero o importa Excel.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <RestrictionFormModal
          draft={editing}
          workers={workers}
          pending={pending}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      ) : null}
    </div>
  );
}

function RestrictionFormModal({
  draft,
  workers,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstRestrictionDraft;
  workers: SstWorker[];
  pending: boolean;
  onChange: (draft: SstRestrictionDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Editar restricción / recomendación" : "Nuevo registro"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Trabajador</span>
            <WorkerSelect
              workers={workers}
              value={draft.workerId}
              required
              onChange={(worker) =>
                onChange({ ...draft, workerId: worker?.id ?? "" })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Tipo</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.restrictionKind}
              onChange={(event) =>
                onChange({
                  ...draft,
                  restrictionKind: event.target.value as RestrictionKind,
                })
              }
            >
              {RESTRICTION_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {RESTRICTION_KIND_LABELS[kind]}
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
                  status: event.target.value as RestrictionManualStatus,
                })
              }
            >
              {RESTRICTION_MANUAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {RESTRICTION_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha de emisión</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.issuedAt}
              onChange={(event) => onChange({ ...draft, issuedAt: event.target.value })}
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha de inicio</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.startDate}
              onChange={(event) => onChange({ ...draft, startDate: event.target.value })}
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha de vencimiento</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.dueDate ?? ""}
              onChange={(event) => onChange({ ...draft, dueDate: event.target.value })}
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Próximo seguimiento</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.nextFollowUp ?? ""}
              onChange={(event) =>
                onChange({ ...draft, nextFollowUp: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">
              Restricción / recomendación (detalle administrativo)
            </span>
            <textarea
              className="min-h-24 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.detail}
              onChange={(event) => onChange({ ...draft, detail: event.target.value })}
              placeholder="Descripción operativa de la limitación o recomendación…"
            />
          </label>

          <Field
            label="Responsable de implementación"
            value={draft.responsibleName}
            onChange={(value) => onChange({ ...draft, responsibleName: value })}
          />
          <Field
            label="Entidad emisora (opcional)"
            value={draft.issuer ?? ""}
            onChange={(value) => onChange({ ...draft, issuer: value })}
          />

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Medida implementada</span>
            <textarea
              className="min-h-20 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.measureImplemented}
              onChange={(event) =>
                onChange({ ...draft, measureImplemented: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha de implementación</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.implementedAt ?? ""}
              onChange={(event) =>
                onChange({ ...draft, implementedAt: event.target.value })
              }
            />
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
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label className="flex flex-col gap-xs">
      <span className="font-label-sm text-label-sm">{label}</span>
      <input
        className="rounded-lg bg-surface-container-low px-sm py-sm"
        value={value}
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
      <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant">{detail}</div>
    </div>
  );
}

function KindChip({ kind }: Readonly<{ kind: RestrictionKind }>) {
  const styles: Record<RestrictionKind, string> = {
    restriccion: "bg-error-container text-on-error-container",
    recomendacion: "bg-secondary-fixed text-on-secondary-fixed",
    post_incapacidad: "bg-tertiary-container text-on-tertiary-container",
    definitiva_reubicacion: "bg-surface-container-highest text-on-surface",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${styles[kind]}`}
    >
      {RESTRICTION_KIND_LABELS[kind]}
    </span>
  );
}
