"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SemaphoreBadge } from "@/components/sg-sst/alerts/SemaphoreBadge";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportHeightsAction,
  deleteHeightsAction,
  saveHeightsAction,
} from "@/lib/sg-sst/alturas/actions";
import {
  HEIGHTS_EXCEL_MAX_ROWS,
  type HeightsExcelImportRow,
} from "@/lib/sg-sst/alturas/excel";
import {
  downloadHeightsExcel,
  downloadHeightsTemplate,
  parseHeightsExcelFile,
} from "@/lib/sg-sst/alturas/excel-client";
import {
  formatChunkImportToast,
  runChunkedBulkImport,
} from "@/lib/sg-sst/import-chunks";
import {
  HEIGHTS_FITNESS_CONCEPTS,
  HEIGHTS_FITNESS_LABELS,
  HEIGHTS_STATUS_LABELS,
  HEIGHTS_TRAINING_LEVEL_LABELS,
  HEIGHTS_TRAINING_LEVELS,
  computeAuthorization,
  draftFromHeights,
  emptyHeightsDraft,
  type HeightsAuthorizationStatus,
  type HeightsFitnessConcept,
  type HeightsStats,
  type HeightsTrainingLevel,
  type SstHeightsDraft,
  type SstHeightsView,
} from "@/lib/sg-sst/alturas/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type HeightsMasterScreenProps = {
  items: SstHeightsView[];
  stats: HeightsStats;
  farms: SstFarm[];
  workers: SstWorker[];
};

const STATUS_FILTERS: { id: HeightsAuthorizationStatus | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "autorizado", label: "Autorizados" },
  { id: "por_vencer", label: "Por vencer" },
  { id: "no_autorizado", label: "NO AUTORIZADO" },
];

export function HeightsMasterScreen({
  items,
  stats,
  farms,
  workers,
}: Readonly<HeightsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    HeightsAuthorizationStatus | "all"
  >("all");
  const [levelFilter, setLevelFilter] = useState<HeightsTrainingLevel | "all">("all");
  const [fitnessFilter, setFitnessFilter] = useState<HeightsFitnessConcept | "all">(
    "all",
  );
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<HeightsExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstHeightsDraft | null>(null);

  const unauthorized = useMemo(
    () => items.filter((item) => item.authorizationStatus === "no_autorizado"),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.authorizationStatus !== statusFilter) {
        return false;
      }
      if (levelFilter !== "all" && item.trainingLevel !== levelFilter) return false;
      if (fitnessFilter !== "all" && item.fitnessConcept !== fitnessFilter) {
        return false;
      }
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.workerCode.toLowerCase().includes(q) ||
        item.folio.toLowerCase().includes(q) ||
        item.certificateName.toLowerCase().includes(q) ||
        item.jobTitleSnapshot.toLowerCase().includes(q)
      );
    });
  }, [items, statusFilter, levelFilter, fitnessFilter, farmId, query]);

  function handleExport() {
    downloadHeightsExcel(
      filtered,
      `trabajo-en-alturas-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} registros.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseHeightsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > HEIGHTS_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${HEIGHTS_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
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
        bulkImportHeightsAction({ rows: chunk }),
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
    setEditing(emptyHeightsDraft());
  }

  function openEdit(item: SstHeightsView) {
    setEditing(draftFromHeights(item));
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveHeightsAction(editing);
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
    if (!window.confirm("¿Eliminar esta autorización de trabajo en alturas?")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteHeightsAction(id);
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
            <MaterialIcon name="height" className="text-[16px] text-primary" />
            <span>Trabajo en alturas · Res. 4272/2021</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Autorizaciones operativas de trabajo en alturas
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Control de formación, certificado y EMO de alturas. Sin requisitos vigentes el
            sistema marca <strong>NO AUTORIZADO PARA ALTURAS</strong>.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadHeightsTemplate()}
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
            Nueva autorización
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
          label="Habilitados"
          value={stats.habilitados}
          detail={`${stats.total} registros`}
          icon="verified"
          accent="text-primary"
        />
        <Kpi
          label="Vencidos"
          value={stats.vencidos}
          detail="Formación o EMO vencido"
          icon="error"
          accent="text-error"
        />
        <Kpi
          label="Próximos a vencer"
          value={stats.proximosAVencer}
          detail="≤ 30 días"
          icon="schedule"
        />
        <Kpi
          label="Exámenes pendientes"
          value={stats.examenesPendientes}
          detail="EMO / concepto"
          icon="clinical_notes"
        />
        <Kpi
          label="Docs. pendientes"
          value={stats.documentacionPendiente}
          detail="Sin certificado"
          icon="folder_special"
        />
      </section>

      {unauthorized.length > 0 ? (
        <section className="relative overflow-hidden rounded-xl bg-error-container p-md text-on-error-container shadow-sm">
          <div className="flex flex-col gap-md md:flex-row md:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-error text-on-error">
              <MaterialIcon name="gavel" className="text-[28px]" />
            </div>
            <div className="min-w-0 flex-1 space-y-sm">
              <div className="flex flex-wrap items-center gap-sm">
                <span className="rounded-full bg-error px-3 py-1 font-label-sm text-label-sm font-bold tracking-wide text-on-error uppercase">
                  NO AUTORIZADO PARA ALTURAS
                </span>
                <span className="font-label-sm text-label-sm font-bold text-error">
                  {unauthorized.length} trabajador
                  {unauthorized.length === 1 ? "" : "es"} inhabilitado
                  {unauthorized.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="font-body-sm text-body-sm max-w-4xl">
                Falta formación vigente, EMO apto o certificado. No deben asignarse a labores
                &gt; 2,0 m hasta completar requisitos.
              </p>
              <ul className="grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
                {unauthorized.slice(0, 9).map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg bg-on-error-container/10 px-sm py-1.5"
                  >
                    <div className="font-semibold text-on-error-container">
                      {item.workerName}
                    </div>
                    <div className="text-[11px] opacity-80">
                      CC {item.workerDocument} · {item.folio}
                    </div>
                    <div className="mt-0.5 text-[11px] font-medium">
                      {item.missingRequirements.slice(0, 2).join(" · ") ||
                        "Requisitos incompletos"}
                    </div>
                  </li>
                ))}
              </ul>
              {unauthorized.length > 9 ? (
                <p className="font-label-sm text-label-sm opacity-80">
                  +{unauthorized.length - 9} más. Usa el filtro «NO AUTORIZADO».
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

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
            placeholder="Cédula, nombre, folio ALT-… o certificado…"
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
          value={levelFilter}
          onChange={(event) =>
            setLevelFilter(event.target.value as HeightsTrainingLevel | "all")
          }
        >
          <option value="all">Todos los niveles</option>
          {HEIGHTS_TRAINING_LEVELS.map((level) => (
            <option key={level} value={level}>
              {HEIGHTS_TRAINING_LEVEL_LABELS[level]}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
          value={fitnessFilter}
          onChange={(event) =>
            setFitnessFilter(event.target.value as HeightsFitnessConcept | "all")
          }
        >
          <option value="all">Concepto médico</option>
          {HEIGHTS_FITNESS_CONCEPTS.map((concept) => (
            <option key={concept} value={concept}>
              {HEIGHTS_FITNESS_LABELS[concept]}
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

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                <th className="px-md py-sm">Estado</th>
                <th className="px-sm py-sm">Trabajador</th>
                <th className="px-sm py-sm">Nivel / formación</th>
                <th className="px-sm py-sm">F. formación</th>
                <th className="px-sm py-sm">Venc. formación</th>
                <th className="px-sm py-sm">Reent.</th>
                <th className="px-sm py-sm">Certificado</th>
                <th className="px-sm py-sm">Examen médico</th>
                <th className="px-sm py-sm">Venc. examen</th>
                <th className="px-sm py-sm">Aptitud</th>
                <th className="px-sm py-sm">Observaciones</th>
                <th className="px-md py-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className={
                    item.authorizationStatus === "no_autorizado"
                      ? "bg-error-container/20 hover:bg-error-container/30"
                      : "hover:bg-surface-container-low/50"
                  }
                >
                  <td className="px-md py-sm align-top">
                    <SemaphoreBadge
                      level={item.semaphore}
                      label={HEIGHTS_STATUS_LABELS[item.authorizationStatus]}
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
                      {item.jobTitleSnapshot} · {item.farmName ?? "Sin centro"}
                    </div>
                  </td>
                  <td className="px-sm py-sm align-top text-[12px]">
                    {HEIGHTS_TRAINING_LEVEL_LABELS[item.trainingLevel]}
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                    {item.trainingDate ?? "—"}
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                    <span
                      className={
                        item.trainingDaysRemaining != null &&
                        item.trainingDaysRemaining <= 0
                          ? "font-semibold text-error"
                          : ""
                      }
                    >
                      {item.trainingDueDate ?? "—"}
                    </span>
                    {item.trainingDaysRemaining != null ? (
                      <div className="text-[11px] text-on-surface-variant">
                        {item.trainingDaysRemaining}d
                      </div>
                    ) : null}
                  </td>
                  <td className="px-sm py-sm align-top text-[12px]">
                    {item.retrainingDone ? "Sí" : "No"}
                  </td>
                  <td className="px-sm py-sm align-top">
                    {item.certificateUrl ? (
                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-[140px] items-center gap-1 truncate text-[11px] text-primary underline"
                      >
                        <MaterialIcon name="attach_file" className="text-[14px]" />
                        {item.certificateName || "Certificado"}
                      </a>
                    ) : item.certificateName ? (
                      <span className="text-[12px]">{item.certificateName}</span>
                    ) : (
                      <span className="text-[11px] font-semibold text-error">Pendiente</span>
                    )}
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                    {item.medicalExamDate ?? "—"}
                  </td>
                  <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                    <span>{item.medicalExamDueDate ?? "—"}</span>
                    {item.medicalDaysRemaining != null ? (
                      <div className="text-[11px] text-on-surface-variant">
                        {item.medicalDaysRemaining}d
                      </div>
                    ) : null}
                  </td>
                  <td className="px-sm py-sm align-top text-[12px]">
                    {HEIGHTS_FITNESS_LABELS[item.fitnessConcept]}
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
                    colSpan={12}
                    className="px-md py-lg text-center text-on-surface-variant"
                  >
                    No hay registros con los filtros actuales. Crea el primero o importa
                    Excel.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <HeightsFormModal
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

function Kpi({
  label,
  value,
  detail,
  icon,
  accent = "text-on-surface",
}: Readonly<{
  label: string;
  value: number;
  detail: string;
  icon: string;
  accent?: string;
}>) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-xs flex items-center justify-between">
        <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
          {label}
        </span>
        <MaterialIcon name={icon} className={`text-[20px] ${accent}`} />
      </div>
      <div className={`font-headline-md text-headline-md font-bold ${accent}`}>{value}</div>
      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{detail}</p>
    </div>
  );
}

function HeightsFormModal({
  draft,
  workers,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstHeightsDraft;
  workers: SstWorker[];
  pending: boolean;
  onChange: (draft: SstHeightsDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  const previewStatus = computeAuthorization({
    trainingDueDate: draft.trainingDueDate,
    medicalExamDueDate: draft.medicalExamDueDate,
    fitnessConcept: draft.fitnessConcept,
    certificateUrl: draft.certificateUrl,
    certificateName: draft.certificateName,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between gap-sm">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {draft.id ? "Editar autorización" : "Nueva autorización de alturas"}
            </h2>
            <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
              Estado calculado:{" "}
              <span
                className={
                  previewStatus === "no_autorizado"
                    ? "font-bold text-error"
                    : "font-semibold text-primary"
                }
              >
                {HEIGHTS_STATUS_LABELS[previewStatus]}
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
            <span className="font-label-sm text-label-sm">Nivel / formación</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.trainingLevel}
              onChange={(event) =>
                onChange({
                  ...draft,
                  trainingLevel: event.target.value as HeightsTrainingLevel,
                })
              }
            >
              {HEIGHTS_TRAINING_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {HEIGHTS_TRAINING_LEVEL_LABELS[level]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 self-end rounded-lg bg-surface-container-low px-sm py-sm">
            <input
              type="checkbox"
              checked={Boolean(draft.retrainingDone)}
              onChange={(event) =>
                onChange({ ...draft, retrainingDone: event.target.checked })
              }
            />
            <span className="font-label-sm text-label-sm">Reentrenamiento realizado</span>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha de formación</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.trainingDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, trainingDate: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Vencimiento formación</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.trainingDueDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, trainingDueDate: event.target.value })
              }
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
              placeholder="Certificado SENA / centro avalado"
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
            <span className="font-label-sm text-label-sm">Fecha examen médico</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.medicalExamDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, medicalExamDate: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Vencimiento examen</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.medicalExamDueDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, medicalExamDueDate: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Concepto de aptitud</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.fitnessConcept}
              onChange={(event) =>
                onChange({
                  ...draft,
                  fitnessConcept: event.target.value as HeightsFitnessConcept,
                })
              }
            >
              {HEIGHTS_FITNESS_CONCEPTS.map((concept) => (
                <option key={concept} value={concept}>
                  {HEIGHTS_FITNESS_LABELS[concept]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Observaciones</span>
            <textarea
              rows={3}
              className="rounded-lg bg-surface-container-low px-sm py-sm"
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
            className="rounded-lg bg-surface-container px-4 py-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary disabled:opacity-60"
            onClick={onSave}
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
