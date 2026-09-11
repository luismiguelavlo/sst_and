"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SemaphoreBadge } from "@/components/sg-sst/alerts/SemaphoreBadge";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportTrainingsAction,
  deleteTrainingAction,
  saveTrainingAction,
} from "@/lib/sg-sst/capacitaciones/actions";
import {
  TRAINING_EXCEL_MAX_ROWS,
  type TrainingExcelImportRow,
} from "@/lib/sg-sst/capacitaciones/excel";
import {
  downloadTrainingsExcel,
  downloadTrainingsTemplate,
  parseTrainingsExcelFile,
} from "@/lib/sg-sst/capacitaciones/excel-client";
import {
  TRAINING_MODALITIES,
  TRAINING_MODALITY_LABELS,
  TRAINING_STATUS_LABELS,
  TRAINING_STATUSES,
  TRAINING_TOPIC_LABELS,
  TRAINING_TOPICS,
  deriveTrainingStatus,
  draftFromTraining,
  emptyTrainingDraft,
  type SstTrainingDraft,
  type SstTrainingView,
  type TrainingModality,
  type TrainingStats,
  type TrainingStatus,
  type TrainingTopic,
} from "@/lib/sg-sst/capacitaciones/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type TrainingsMasterScreenProps = {
  items: SstTrainingView[];
  stats: TrainingStats;
  farms: SstFarm[];
  workers: SstWorker[];
};

const STATUS_FILTERS: { id: TrainingStatus | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "realizada", label: "Realizadas" },
  { id: "proxima", label: "Próximas" },
  { id: "vencida", label: "Vencidas" },
  { id: "pendiente", label: "Pendientes" },
  { id: "programada", label: "Programadas" },
];

export function TrainingsMasterScreen({
  items,
  stats,
  farms,
  workers,
}: Readonly<TrainingsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<TrainingTopic | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TrainingStatus | "all">("all");
  const [modalityFilter, setModalityFilter] = useState<TrainingModality | "all">(
    "all",
  );
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<TrainingExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstTrainingDraft | null>(null);

  const topicCounts = useMemo(() => {
    const counts: Record<TrainingTopic | "all", number> = {
      all: items.length,
      induccion: 0,
      reinduccion: 0,
      alturas: 0,
      tractor: 0,
      pesv: 0,
      emergencias: 0,
      primeros_auxilios: 0,
      epp: 0,
      quimicos: 0,
      biomecanico: 0,
      psicosocial: 0,
      salud_mental: 0,
      sst: 0,
      brigada: 0,
      copasst: 0,
      ccl: 0,
    };
    for (const item of items) {
      counts[item.topic] += 1;
    }
    return counts;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (topicFilter !== "all" && item.topic !== topicFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (modalityFilter !== "all" && item.modality !== modalityFilter) {
        return false;
      }
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.workerCode.toLowerCase().includes(q) ||
        item.folio.toLowerCase().includes(q) ||
        item.instructor.toLowerCase().includes(q) ||
        TRAINING_TOPIC_LABELS[item.topic].toLowerCase().includes(q) ||
        item.jobTitleSnapshot.toLowerCase().includes(q)
      );
    });
  }, [items, topicFilter, statusFilter, modalityFilter, farmId, query]);

  function handleExport() {
    downloadTrainingsExcel(
      filtered,
      `capacitaciones-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} registros.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseTrainingsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > TRAINING_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${TRAINING_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
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
      const result = await bulkImportTrainingsAction({ rows: preview });
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
    setEditing(emptyTrainingDraft());
  }

  function openEdit(item: SstTrainingView) {
    setEditing(draftFromTraining(item));
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveTrainingAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editing.id ? "Capacitación actualizada." : "Capacitación registrada.");
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("¿Eliminar este registro de capacitación?")) return;
    startTransition(async () => {
      const result = await deleteTrainingAction(id);
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
            <MaterialIcon name="school" className="text-[16px] text-primary" />
            <span>Capacitaciones · Dec. 1072 Art. 2.2.4.6.11</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Plan maestro de capacitaciones, inducción y entrenamiento SST
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Base maestra por trabajador: tema, horas, evidencia, certificado y próxima
            capacitación. Folios CAP-YYYY-### con sincronización a Alertas SST (curso).
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadTrainingsTemplate()}
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
            Registrar capacitación
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

      <section className="grid grid-cols-2 gap-sm md:grid-cols-3 xl:grid-cols-5">
        <Kpi
          label="Realizadas"
          value={stats.realizadas}
          detail={`${stats.hoursTotal.toLocaleString("es-CO")} h acumuladas`}
          icon="check_circle"
          accent="text-primary"
        />
        <Kpi
          label="Pendientes"
          value={stats.pendientes}
          detail="Sin ejecución completa"
          icon="pending_actions"
        />
        <Kpi
          label="Próximas"
          value={stats.proximas}
          detail="≤ 30 días"
          icon="notifications_active"
        />
        <Kpi
          label="Vencidas"
          value={stats.vencidas}
          detail="Requiere reprogramar"
          icon="warning"
          accent="text-error"
        />
        <Kpi
          label="Cumplimiento"
          value={stats.cumplimiento}
          detail="Realizadas / (R+P+V)"
          icon="monitoring"
          accent="text-secondary"
          suffix="%"
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
                {preview.length} filas. Folio existente → actualización. Documento o código
                deben existir en base maestra.
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

      <section className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <div className="mb-sm flex items-center justify-between gap-sm">
          <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
            Temas de capacitación
          </span>
          <span className="font-label-sm text-label-sm text-secondary">
            {TRAINING_TOPICS.length} módulos
          </span>
        </div>
        <div className="flex gap-xs overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <TopicChip
            active={topicFilter === "all"}
            label={`Todos (${topicCounts.all})`}
            onClick={() => setTopicFilter("all")}
          />
          {TRAINING_TOPICS.map((topic) => (
            <TopicChip
              key={topic}
              active={topicFilter === topic}
              label={`${TRAINING_TOPIC_LABELS[topic]} (${topicCounts[topic]})`}
              onClick={() => setTopicFilter(topic)}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-sm shadow-sm lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <MaterialIcon
            name="search"
            className="absolute top-2.5 left-3 text-[20px] text-outline"
          />
          <input
            className="w-full rounded-lg bg-surface-container-low py-2.5 pr-4 pl-10 font-body-sm text-body-sm focus:outline-none"
            placeholder="Cédula, nombre, folio CAP-…, instructor o cargo…"
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
          value={modalityFilter}
          onChange={(event) =>
            setModalityFilter(event.target.value as TrainingModality | "all")
          }
        >
          <option value="all">Todas las modalidades</option>
          {TRAINING_MODALITIES.map((modality) => (
            <option key={modality} value={modality}>
              {TRAINING_MODALITY_LABELS[modality]}
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
                <th className="px-sm py-sm">Trabajador</th>
                <th className="px-sm py-sm">Tema</th>
                <th className="px-sm py-sm">Fecha / horas</th>
                <th className="px-sm py-sm">Instructor</th>
                <th className="px-sm py-sm">Modalidad</th>
                <th className="px-sm py-sm">Evidencia</th>
                <th className="px-sm py-sm">Certificado</th>
                <th className="px-sm py-sm">Próxima</th>
                <th className="px-sm py-sm">Observaciones</th>
                <th className="px-md py-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className={
                    item.status === "vencida"
                      ? "bg-error-container/20 hover:bg-error-container/30"
                      : "hover:bg-surface-container-low/50"
                  }
                >
                  <td className="px-md py-sm align-top">
                    <SemaphoreBadge
                      level={item.semaphore}
                      label={TRAINING_STATUS_LABELS[item.status]}
                      compact
                    />
                    <div className="mt-1 font-mono text-[11px] text-on-surface-variant">
                      {item.folio}
                    </div>
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
                  <td className="px-sm py-sm align-top text-[12px]">
                    {TRAINING_TOPIC_LABELS[item.topic]}
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                    <div>{item.trainingDate}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      {item.hours} h
                    </div>
                  </td>
                  <td className="px-sm py-sm align-top text-[12px]">
                    {item.instructor || "—"}
                  </td>
                  <td className="px-sm py-sm align-top text-[12px]">
                    {TRAINING_MODALITY_LABELS[item.modality]}
                  </td>
                  <td className="px-sm py-sm align-top">
                    <EvidenceLink
                      url={item.evidenceUrl}
                      name={item.evidenceName}
                      emptyLabel="Sin evidencia"
                    />
                  </td>
                  <td className="px-sm py-sm align-top">
                    <EvidenceLink
                      url={item.certificateUrl}
                      name={item.certificateName}
                      emptyLabel="Sin certificado"
                    />
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                    <span
                      className={
                        item.daysRemaining != null && item.daysRemaining <= 0
                          ? "font-semibold text-error"
                          : ""
                      }
                    >
                      {item.nextTrainingDate ?? "—"}
                    </span>
                    {item.daysRemaining != null ? (
                      <div className="text-[11px] text-on-surface-variant">
                        {item.daysRemaining}d
                      </div>
                    ) : null}
                  </td>
                  <td className="px-sm py-sm align-top">
                    <p className="line-clamp-2 max-w-[180px] font-body-sm text-body-sm text-on-surface-variant">
                      {item.observations || "—"}
                    </p>
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
                    colSpan={11}
                    className="px-md py-lg text-center text-on-surface-variant"
                  >
                    No hay capacitaciones con los filtros actuales. Registra la primera o
                    importa Excel.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <TrainingFormModal
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

function TopicChip({
  active,
  label,
  onClick,
}: Readonly<{ active: boolean; label: string; onClick: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-sm py-1.5 font-label-sm text-label-sm whitespace-nowrap transition-colors ${
        active
          ? "bg-primary text-on-primary shadow-sm"
          : "bg-surface-container-low text-on-surface hover:bg-surface-container"
      }`}
    >
      {label}
    </button>
  );
}

function EvidenceLink({
  url,
  name,
  emptyLabel,
}: Readonly<{ url: string; name: string; emptyLabel: string }>) {
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex max-w-[140px] items-center gap-1 truncate text-[11px] text-primary underline"
      >
        <MaterialIcon name="attach_file" className="text-[14px]" />
        {name || "Ver archivo"}
      </a>
    );
  }
  if (name) {
    return <span className="text-[12px]">{name}</span>;
  }
  return <span className="text-[11px] text-on-surface-variant">{emptyLabel}</span>;
}

function Kpi({
  label,
  value,
  detail,
  icon,
  accent = "text-on-surface",
  suffix = "",
}: Readonly<{
  label: string;
  value: number;
  detail: string;
  icon: string;
  accent?: string;
  suffix?: string;
}>) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-xs flex items-center justify-between">
        <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
          {label}
        </span>
        <MaterialIcon name={icon} className={`text-[20px] ${accent}`} />
      </div>
      <div className={`font-headline-md text-headline-md font-bold ${accent}`}>
        {value}
        {suffix}
      </div>
      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{detail}</p>
    </div>
  );
}

function TrainingFormModal({
  draft,
  workers,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstTrainingDraft;
  workers: SstWorker[];
  pending: boolean;
  onChange: (draft: SstTrainingDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  const previewStatus = deriveTrainingStatus({
    trainingDate: draft.trainingDate,
    nextTrainingDate: draft.nextTrainingDate,
    status: draft.status ?? null,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between gap-sm">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {draft.id ? "Editar capacitación" : "Registrar capacitación"}
            </h2>
            <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
              Estado calculado:{" "}
              <span
                className={
                  previewStatus === "vencida"
                    ? "font-bold text-error"
                    : "font-semibold text-primary"
                }
              >
                {TRAINING_STATUS_LABELS[previewStatus]}
              </span>
            </p>
          </div>
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
            <span className="font-label-sm text-label-sm">Tema</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.topic}
              onChange={(event) =>
                onChange({
                  ...draft,
                  topic: event.target.value as TrainingTopic,
                })
              }
            >
              {TRAINING_TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {TRAINING_TOPIC_LABELS[topic]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Modalidad</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.modality}
              onChange={(event) =>
                onChange({
                  ...draft,
                  modality: event.target.value as TrainingModality,
                })
              }
            >
              {TRAINING_MODALITIES.map((modality) => (
                <option key={modality} value={modality}>
                  {TRAINING_MODALITY_LABELS[modality]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.trainingDate}
              onChange={(event) =>
                onChange({ ...draft, trainingDate: event.target.value })
              }
              required
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Horas</span>
            <input
              type="number"
              min={0}
              step={0.5}
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.hours}
              onChange={(event) =>
                onChange({ ...draft, hours: Number(event.target.value) || 0 })
              }
            />
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Instructor / entidad</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.instructor}
              onChange={(event) =>
                onChange({ ...draft, instructor: event.target.value })
              }
              placeholder="SENA, ARL, instructor interno…"
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
              placeholder="Lista de asistencia…"
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
              placeholder="https://…"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Nombre certificado</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.certificateName}
              onChange={(event) =>
                onChange({ ...draft, certificateName: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">URL certificado</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.certificateUrl}
              onChange={(event) =>
                onChange({ ...draft, certificateUrl: event.target.value })
              }
              placeholder="https://…"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Próxima capacitación</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.nextTrainingDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, nextTrainingDate: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">
              Estado manual (opcional)
            </span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.status ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                onChange({
                  ...draft,
                  status: value ? (value as TrainingStatus) : null,
                });
              }}
            >
              <option value="">Auto (por próxima fecha)</option>
              {TRAINING_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {TRAINING_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Observaciones</span>
            <textarea
              className="min-h-[88px] rounded-lg bg-surface-container-low px-sm py-sm"
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
            className="rounded-lg bg-surface-container px-md py-2.5"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            className="rounded-lg bg-primary px-md py-2.5 font-semibold text-on-primary disabled:opacity-60"
            onClick={onSave}
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
