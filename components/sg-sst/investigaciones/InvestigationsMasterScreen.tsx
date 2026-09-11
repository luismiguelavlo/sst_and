"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SemaphoreBadge } from "@/components/sg-sst/alerts/SemaphoreBadge";
import { useToast } from "@/components/ui/ToastProvider";
import {
  bulkImportInvestigationsAction,
  deleteInvestigationAction,
  saveInvestigationAction,
} from "@/lib/sg-sst/investigaciones/actions";
import {
  INVESTIGATION_EXCEL_MAX_ROWS,
  type InvestigationExcelImportRow,
} from "@/lib/sg-sst/investigaciones/excel";
import {
  downloadInvestigationsExcel,
  downloadInvestigationsTemplate,
  parseInvestigationsExcelFile,
} from "@/lib/sg-sst/investigaciones/excel-client";
import {
  INVESTIGATION_LEGAL_DAYS,
  INVESTIGATION_METHODOLOGIES,
  INVESTIGATION_METHODOLOGY_LABELS,
  INVESTIGATION_STATUS_LABELS,
  INVESTIGATION_STATUSES,
  INVESTIGATION_UPCOMING_MAX_DAYS,
  addDaysIso,
  draftFromInvestigation,
  emptyInvestigationDraft,
  isClosedLikeStatus,
  type AccidentOption,
  type InvestigationMethodology,
  type InvestigationStats,
  type InvestigationStatus,
  type SstInvestigationDraft,
  type SstInvestigationView,
} from "@/lib/sg-sst/investigaciones/types";

type InvestigationsMasterScreenProps = {
  investigations: SstInvestigationView[];
  stats: InvestigationStats;
  accidentOptions: AccidentOption[];
};

const STATUS_FILTERS: { id: InvestigationStatus | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "pendiente_inicio", label: "Pendiente" },
  { id: "en_campo", label: "En campo" },
  { id: "revision_copasst", label: "COPASST" },
  { id: "radicada_arl", label: "Radicada ARL" },
  { id: "cerrada", label: "Cerrada" },
];

const ALERT_FILTERS: {
  id: "all" | "overdue" | "upcoming" | "in_progress" | "closed";
  label: string;
}[] = [
  { id: "all", label: "Todas" },
  { id: "overdue", label: "Vencidas" },
  { id: "upcoming", label: `≤${INVESTIGATION_UPCOMING_MAX_DAYS}d` },
  { id: "in_progress", label: "En curso" },
  { id: "closed", label: "Cerradas" },
];

export function InvestigationsMasterScreen({
  investigations,
  stats,
  accidentOptions,
}: Readonly<InvestigationsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvestigationStatus | "all">(
    "all",
  );
  const [alertFilter, setAlertFilter] = useState<
    "all" | "overdue" | "upcoming" | "in_progress" | "closed"
  >("all");
  const [methodologyFilter, setMethodologyFilter] = useState<
    InvestigationMethodology | "all"
  >("all");
  const [preview, setPreview] = useState<InvestigationExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstInvestigationDraft | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return investigations.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (methodologyFilter !== "all" && item.methodology !== methodologyFilter) {
        return false;
      }
      if (alertFilter === "overdue" && !item.isOverdue) return false;
      if (alertFilter === "upcoming" && !item.isUpcoming) return false;
      if (alertFilter === "closed" && !item.isClosedLike) return false;
      if (
        alertFilter === "in_progress" &&
        (item.isClosedLike || item.isOverdue || item.isUpcoming)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        item.folio.toLowerCase().includes(q) ||
        item.accidentEventNumber.toLowerCase().includes(q) ||
        item.responsibleName.toLowerCase().includes(q) ||
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.investigationTeam.toLowerCase().includes(q) ||
        item.causesSummary.toLowerCase().includes(q)
      );
    });
  }, [investigations, statusFilter, methodologyFilter, alertFilter, query]);

  function handleExport() {
    downloadInvestigationsExcel(
      filtered,
      `investigaciones-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportadas ${filtered.length} investigaciones.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseInvestigationsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > INVESTIGATION_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${INVESTIGATION_EXCEL_MAX_ROWS} filas.`, {
          variant: "error",
        });
        return;
      }
      setFileName(file.name);
      setPreview(rows);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "No se pudo leer el Excel.",
        { variant: "error" },
      );
    } finally {
      event.target.value = "";
    }
  }

  function confirmImport() {
    startTransition(async () => {
      const result = await bulkImportInvestigationsAction({ rows: preview });
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
    setEditing(emptyInvestigationDraft());
  }

  function openEdit(item: SstInvestigationView) {
    setEditing(draftFromInvestigation(item));
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveInvestigationAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        editing.id ? "Investigación actualizada." : "Investigación iniciada.",
      );
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("¿Eliminar esta investigación?")) return;
    startTransition(async () => {
      const result = await deleteInvestigationAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Investigación eliminada.");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="manage_search" className="text-[16px] text-primary" />
            <span>Investigaciones · Res. 1401</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Control y seguimiento a investigaciones
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Plazo legal de {INVESTIGATION_LEGAL_DAYS} días calendario desde el accidente.
            Alertas de pendientes y próximas a vencer sincronizadas con el radar SST.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadInvestigationsTemplate()}
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
            Nueva investigación
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

      <div className="flex flex-wrap items-center gap-xs">
        <div className="flex items-center gap-xs rounded-lg bg-surface-container-low px-sm py-xs">
          <MaterialIcon name="gavel" className="text-[18px] text-secondary" />
          <span className="font-label-sm text-label-sm font-medium text-on-surface">
            Resolución 1401 de 2007 · {INVESTIGATION_LEGAL_DAYS} días calendario
          </span>
        </div>
        <div className="flex items-center gap-xs rounded-lg bg-error-container px-sm py-xs text-on-error-container">
          <MaterialIcon name="report_problem" className="text-[18px]" />
          <span className="font-label-sm text-label-sm font-semibold">
            Eventos graves / mortales: reporte ARL y MinTrabajo
          </span>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-sm sm:grid-cols-2 xl:grid-cols-4">
        <AlertKpi
          label="Vencidas legalmente"
          value={stats.overdue}
          detail="Plazo 15 días sin remisión"
          icon="error"
          tone="danger"
          onClick={() => setAlertFilter("overdue")}
          active={alertFilter === "overdue"}
        />
        <AlertKpi
          label="Próximas a vencer"
          value={stats.upcoming}
          detail={`Ventana 1 a ${INVESTIGATION_UPCOMING_MAX_DAYS} días`}
          icon="alarm"
          tone="warn"
          onClick={() => setAlertFilter("upcoming")}
          active={alertFilter === "upcoming"}
        />
        <AlertKpi
          label="En curso normal"
          value={stats.inProgress}
          detail={`Más de ${INVESTIGATION_UPCOMING_MAX_DAYS} días restantes`}
          icon="pending_actions"
          tone="info"
          onClick={() => setAlertFilter("in_progress")}
          active={alertFilter === "in_progress"}
        />
        <AlertKpi
          label="Cerradas / radicadas"
          value={stats.closed}
          detail="Semáforo vigente"
          icon="task_alt"
          tone="ok"
          onClick={() => setAlertFilter("closed")}
          active={alertFilter === "closed"}
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
                {preview.length} filas. El accidente se vincula por número de evento.
                Folio existente → actualización.
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
            placeholder="Folio INV-…, evento, trabajador o responsable…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {ALERT_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAlertFilter(item.id)}
              className={`rounded-lg px-2.5 py-1.5 font-label-sm text-label-sm ${
                alertFilter === item.id
                  ? "bg-secondary text-on-secondary"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {item.label}
            </button>
          ))}
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
          value={methodologyFilter}
          onChange={(event) =>
            setMethodologyFilter(
              event.target.value as InvestigationMethodology | "all",
            )
          }
        >
          <option value="all">Todas las metodologías</option>
          {INVESTIGATION_METHODOLOGIES.map((method) => (
            <option key={method} value={method}>
              {INVESTIGATION_METHODOLOGY_LABELS[method]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                <th className="px-md py-sm">Semáforo</th>
                <th className="px-sm py-sm">Folio / evento</th>
                <th className="px-sm py-sm">Trabajador</th>
                <th className="px-sm py-sm">Plazo legal</th>
                <th className="px-sm py-sm">Estado / método</th>
                <th className="px-sm py-sm">Responsable / equipo</th>
                <th className="px-sm py-sm min-w-[180px]">Causas / plan</th>
                <th className="px-md py-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/50">
                  <td className="px-md py-sm align-top">
                    <SemaphoreBadge
                      level={item.semaphore}
                      label={item.semaphoreLabel}
                      compact
                    />
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap">
                    <div className="font-mono text-[12px] font-semibold text-primary">
                      {item.folio}
                    </div>
                    <div className="font-label-md text-on-surface">
                      {item.accidentEventNumber}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      Accidente: {item.accidentDate}
                    </div>
                  </td>
                  <td className="px-sm py-sm align-top">
                    <div className="font-semibold text-on-surface">
                      {item.workerName || "—"}
                    </div>
                    {item.workerDocument ? (
                      <div className="text-[11px] text-on-surface-variant">
                        CC {item.workerDocument}
                      </div>
                    ) : null}
                    <div className="text-[11px] text-secondary">
                      {item.farmName ?? "Sin centro"}
                    </div>
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                    <div className="font-semibold">
                      Límite: {item.legalDueDate}
                    </div>
                    <div
                      className={
                        item.isOverdue
                          ? "font-semibold text-error"
                          : item.isUpcoming
                            ? "font-semibold text-secondary"
                            : "text-on-surface-variant"
                      }
                    >
                      {item.isClosedLike
                        ? "Cerrada / vigente"
                        : item.daysRemaining == null
                          ? "Sin plazo"
                          : item.daysRemaining < 0
                            ? `Vencida hace ${Math.abs(item.daysRemaining)}d`
                            : item.daysRemaining === 0
                              ? "Vence hoy"
                              : `${item.daysRemaining}d restantes`}
                    </div>
                    {item.closedAt ? (
                      <div className="text-[11px] text-on-surface-variant">
                        Cierre: {item.closedAt}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-sm py-sm align-top">
                    <StatusChip status={item.status} />
                    <div className="mt-1 text-[11px] text-on-surface-variant">
                      {INVESTIGATION_METHODOLOGY_LABELS[item.methodology]}
                    </div>
                    {item.investigationDate ? (
                      <div className="text-[11px] text-secondary">
                        Inv.: {item.investigationDate}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-sm py-sm align-top">
                    <div className="font-semibold text-on-surface">
                      {item.responsibleName}
                    </div>
                    <div className="mt-1 max-w-[220px] text-[12px] text-on-surface-variant line-clamp-2">
                      {item.investigationTeam || "Sin equipo registrado"}
                    </div>
                  </td>
                  <td className="px-sm py-sm align-top">
                    <p className="line-clamp-2 max-w-[240px] font-body-sm text-body-sm text-on-surface">
                      {item.causesSummary || "Sin causas registradas"}
                    </p>
                    <p className="mt-1 line-clamp-2 max-w-[240px] text-[11px] text-on-surface-variant">
                      {item.actionPlan || "Sin plan de acción"}
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
                    No hay investigaciones con los filtros actuales. Inicia una o
                    importa Excel.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="border-t border-surface-container-low px-md py-sm font-label-sm text-label-sm text-on-surface-variant">
          Mostrando {filtered.length} de {investigations.length} investigaciones
        </div>
      </div>

      {editing ? (
        <InvestigationFormModal
          draft={editing}
          accidentOptions={accidentOptions}
          pending={pending}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      ) : null}
    </div>
  );
}

function AlertKpi({
  label,
  value,
  detail,
  icon,
  tone,
  onClick,
  active,
}: Readonly<{
  label: string;
  value: number;
  detail: string;
  icon: string;
  tone: "danger" | "warn" | "info" | "ok";
  onClick: () => void;
  active: boolean;
}>) {
  const bar =
    tone === "danger"
      ? "bg-error"
      : tone === "warn"
        ? "bg-secondary-container"
        : tone === "ok"
          ? "bg-primary"
          : "bg-surface-tint";
  const valueClass =
    tone === "danger"
      ? "text-error"
      : tone === "warn"
        ? "text-on-surface"
        : "text-on-surface";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-sm text-left shadow-sm transition-shadow hover:shadow-md ${
        active ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className={`absolute top-0 right-0 left-0 h-1 ${bar}`} />
      <div className="flex items-center justify-between">
        <span
          className={`font-label-sm text-label-sm font-semibold tracking-wider uppercase ${
            tone === "danger" ? "text-error" : "text-on-surface-variant"
          }`}
        >
          {label}
        </span>
        <MaterialIcon
          name={icon}
          className={`text-[22px] ${
            tone === "danger"
              ? "text-error"
              : tone === "warn"
                ? "text-secondary-container"
                : "text-primary"
          }`}
        />
      </div>
      <div className="my-xs">
        <span
          className={`font-display-lg text-display-lg leading-none font-bold ${valueClass}`}
        >
          {String(value).padStart(2, "0")}
        </span>
        <span className="mt-xs block font-label-sm text-label-sm text-on-surface-variant">
          {detail}
        </span>
      </div>
    </button>
  );
}

function StatusChip({ status }: Readonly<{ status: InvestigationStatus }>) {
  const styles: Record<InvestigationStatus, string> = {
    pendiente_inicio: "bg-error-container text-on-error-container",
    en_campo: "bg-secondary-container text-on-secondary",
    revision_copasst: "bg-primary-container text-on-primary",
    radicada_arl: "bg-surface-container-high text-on-surface",
    cerrada: "bg-surface-container text-on-surface-variant",
  };
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 font-label-sm text-label-sm font-semibold ${styles[status]}`}
    >
      {INVESTIGATION_STATUS_LABELS[status]}
    </span>
  );
}

function InvestigationFormModal({
  draft,
  accidentOptions,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstInvestigationDraft;
  accidentOptions: AccidentOption[];
  pending: boolean;
  onChange: (draft: SstInvestigationDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  function patch(partial: Partial<SstInvestigationDraft>) {
    onChange({ ...draft, ...partial });
  }

  function onAccidentChange(accidentId: string) {
    const option = accidentOptions.find((item) => item.id === accidentId);
    if (!option) {
      patch({ accidentId, accidentDate: "", legalDueDate: "" });
      return;
    }
    patch({
      accidentId,
      accidentDate: option.eventDate,
      legalDueDate: addDaysIso(option.eventDate, INVESTIGATION_LEGAL_DAYS),
    });
  }

  const showClosedAt = isClosedLikeStatus(draft.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Editar investigación" : "Iniciar nueva investigación"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
          <Field label="Accidente relacionado *">
            <select
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.accidentId}
              onChange={(event) => onAccidentChange(event.target.value)}
            >
              <option value="">Seleccionar evento…</option>
              {accidentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.eventNumber} · {option.workerName} · {option.eventDate}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fecha del accidente">
            <input
              type="date"
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.accidentDate ?? ""}
              onChange={(event) => {
                const accidentDate = event.target.value;
                patch({
                  accidentDate,
                  legalDueDate: accidentDate
                    ? addDaysIso(accidentDate, INVESTIGATION_LEGAL_DAYS)
                    : draft.legalDueDate,
                });
              }}
            />
          </Field>
          <Field label="Fecha límite (plazo legal)">
            <input
              type="date"
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.legalDueDate ?? ""}
              onChange={(event) => patch({ legalDueDate: event.target.value })}
            />
          </Field>
          <Field label="Responsable *">
            <input
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.responsibleName}
              onChange={(event) =>
                patch({ responsibleName: event.target.value })
              }
              placeholder="Nombre del líder de investigación"
            />
          </Field>
          <Field label="Estado">
            <select
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.status}
              onChange={(event) =>
                patch({
                  status: event.target.value as InvestigationStatus,
                })
              }
            >
              {INVESTIGATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {INVESTIGATION_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fecha investigación">
            <input
              type="date"
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.investigationDate ?? ""}
              onChange={(event) =>
                patch({ investigationDate: event.target.value })
              }
            />
          </Field>
          <Field label="Metodología">
            <select
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.methodology}
              onChange={(event) =>
                patch({
                  methodology: event.target.value as InvestigationMethodology,
                })
              }
            >
              {INVESTIGATION_METHODOLOGIES.map((method) => (
                <option key={method} value={method}>
                  {INVESTIGATION_METHODOLOGY_LABELS[method]}
                </option>
              ))}
            </select>
          </Field>
          {showClosedAt ? (
            <Field label="Fecha de cierre *">
              <input
                type="date"
                className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
                value={draft.closedAt ?? ""}
                onChange={(event) => patch({ closedAt: event.target.value })}
              />
            </Field>
          ) : null}
          <Field label="Equipo investigador" className="md:col-span-2">
            <input
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.investigationTeam}
              onChange={(event) =>
                patch({ investigationTeam: event.target.value })
              }
              placeholder="COPASST, SST, supervisor, testigos…"
            />
          </Field>
          <Field label="Causas" className="md:col-span-2">
            <textarea
              rows={3}
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.causesSummary}
              onChange={(event) =>
                patch({ causesSummary: event.target.value })
              }
            />
          </Field>
          <Field label="Plan de acción" className="md:col-span-2">
            <textarea
              rows={3}
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.actionPlan}
              onChange={(event) => patch({ actionPlan: event.target.value })}
            />
          </Field>
          <Field label="URL evidencia">
            <input
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.evidenceUrl}
              onChange={(event) => patch({ evidenceUrl: event.target.value })}
              placeholder="https://…"
            />
          </Field>
          <Field label="Nombre evidencia">
            <input
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.evidenceName}
              onChange={(event) => patch({ evidenceName: event.target.value })}
            />
          </Field>
          <Field label="Observaciones" className="md:col-span-2">
            <textarea
              rows={2}
              className="w-full rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm"
              value={draft.observations}
              onChange={(event) => patch({ observations: event.target.value })}
            />
          </Field>
        </div>

        {accidentOptions.length === 0 ? (
          <p className="mt-sm rounded-lg bg-error-container px-sm py-xs font-body-sm text-on-error-container">
            No hay accidentes registrados. Crea primero un evento en Accidentes e
            incidentes para vincular la investigación.
          </p>
        ) : null}

        <div className="mt-md flex justify-end gap-sm">
          <button
            type="button"
            className="rounded-lg bg-surface-container px-md py-2.5 font-label-md"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending || !draft.accidentId}
            className="rounded-lg bg-primary px-md py-2.5 font-label-md font-semibold text-on-primary disabled:opacity-60"
            onClick={onSave}
          >
            {pending ? "Guardando…" : draft.id ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: Readonly<{
  label: string;
  children: ReactNode;
  className?: string;
}>) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
