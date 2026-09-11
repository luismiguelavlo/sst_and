"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportHealthCasesAction,
  deleteHealthCaseAction,
  saveHealthCaseAction,
} from "@/lib/sg-sst/casos-salud/actions";
import {
  downloadHealthCasesExcel,
  downloadHealthCasesTemplate,
  parseHealthCasesExcelFile,
} from "@/lib/sg-sst/casos-salud/excel-client";
import {
  HEALTH_CASE_EXCEL_MAX_ROWS,
  type HealthCaseExcelImportRow,
} from "@/lib/sg-sst/casos-salud/excel";
import {
  emptyHealthCaseDraft,
  HEALTH_CASE_STATUS_LABELS,
  HEALTH_CASE_STATUSES,
  HEALTH_CASE_TYPE_LABELS,
  HEALTH_CASE_TYPES,
  isUpcomingFollowUp,
  type HealthCaseStats,
  type HealthCaseStatus,
  type HealthCaseType,
  type SstHealthCase,
  type SstHealthCaseDraft,
} from "@/lib/sg-sst/casos-salud/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type HealthCasesMasterScreenProps = {
  cases: SstHealthCase[];
  stats: HealthCaseStats;
  farms: SstFarm[];
  workers: SstWorker[];
};

const STATUS_CHIP_STYLES: Record<HealthCaseStatus, string> = {
  abierto: "bg-primary-fixed text-primary",
  en_seguimiento: "bg-secondary-fixed text-on-secondary-fixed",
  pendiente: "bg-error-container text-on-error-container",
  cerrado: "bg-surface-container-high text-on-surface-variant",
};

export function HealthCasesMasterScreen({
  cases,
  stats,
  farms,
  workers,
}: Readonly<HealthCasesMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [caseType, setCaseType] = useState<HealthCaseType | "all">("all");
  const [status, setStatus] = useState<HealthCaseStatus | "all">("all");
  const [farmId, setFarmId] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<SstHealthCaseDraft | null>(null);
  const [preview, setPreview] = useState<HealthCaseExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((item) => {
      if (caseType !== "all" && item.caseType !== caseType) return false;
      if (status !== "all" && item.status !== status) return false;
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.workerCode.toLowerCase().includes(q) ||
        item.folio.toLowerCase().includes(q) ||
        item.responsibleName.toLowerCase().includes(q) ||
        item.issuer.toLowerCase().includes(q)
      );
    });
  }, [cases, caseType, status, farmId, query]);

  const selected = useMemo(
    () => filtered.find((item) => item.id === selectedId) ?? null,
    [filtered, selectedId],
  );

  function openCreate() {
    setEditing(emptyHealthCaseDraft());
  }

  function openEdit(item: SstHealthCase) {
    setEditing({
      id: item.id,
      workerId: item.workerId,
      caseType: item.caseType,
      openedAt: item.openedAt,
      status: item.status,
      responsibleName: item.responsibleName,
      issuer: item.issuer,
      nextFollowUp: item.nextFollowUp ?? "",
      closedAt: item.closedAt ?? "",
      adminObservations: item.adminObservations,
      evidenceUrl: item.evidenceUrl,
      evidenceName: item.evidenceName,
    });
  }

  function handleExport() {
    downloadHealthCasesExcel(
      filtered,
      `casos-salud-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} casos.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseHealthCasesExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > HEALTH_CASE_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${HEALTH_CASE_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
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
      const result = await bulkImportHealthCasesAction({ rows: preview });
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

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveHealthCaseAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editing.id ? "Caso actualizado." : "Caso aperturado.");
      setEditing(null);
      setSelectedId(result.id);
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteHealthCaseAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Caso eliminado.");
      if (selectedId === id) setSelectedId(null);
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-4xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="medical_services" className="text-[16px] text-primary" />
            <span>Gestión de personal y salud</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Casos de Salud Abiertos
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Seguimiento administrativo SST, acompañamiento ARL/EPS y trazabilidad de eventos
            laborales sin almacenamiento de diagnósticos clínicos.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadHealthCasesTemplate()}
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
            Aperturar caso
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
          <MaterialIcon name="verified_user" className="text-[22px]" />
        </div>
        <div>
          <div className="font-label-md text-label-md font-bold text-primary">
            Protocolo de confidencialidad ocupacional
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            En cumplimiento de la Res. 2346/2007 y Dec. 1072/2015, este módulo documenta solo
            trazabilidad técnico-administrativa.{" "}
            <span className="font-medium text-error">
              Queda prohibido el ingreso de historia clínica o diagnósticos CIE-10.
            </span>
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-sm sm:grid-cols-2 xl:grid-cols-5">
        <Kpi
          label="Casos abiertos"
          value={stats.abiertos}
          detail="Activos hoy"
          icon="folder_open"
        />
        <Kpi
          label="En seguimiento"
          value={stats.enSeguimiento}
          detail="Acompañamiento activo"
          icon="sync"
        />
        <Kpi
          label="Pendientes"
          value={stats.pendientes}
          detail="Dictamen / gestión"
          icon="hourglass_top"
          accent="text-error"
        />
        <Kpi
          label="Próx. seguimientos"
          value={stats.proximosSeguimientos}
          detail="Dentro de 7 días"
          icon="event"
        />
        <Kpi
          label="Cerrados"
          value={stats.cerrados}
          detail={`${stats.total} casos totales`}
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

      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-sm shadow-sm">
        <div className="flex items-center justify-between gap-sm">
          <div className="flex items-center gap-2">
            <MaterialIcon name="filter_alt" className="text-[18px] text-primary" />
            <span className="font-label-sm text-label-sm font-bold tracking-wider text-on-surface uppercase">
              Clasificación por categorías
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {filtered.length} de {stats.total} casos
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <CategoryChip
            active={caseType === "all"}
            label="Todos"
            count={stats.total}
            onClick={() => setCaseType("all")}
          />
          {HEALTH_CASE_TYPES.map((type) => (
            <CategoryChip
              key={type}
              active={caseType === type}
              label={HEALTH_CASE_TYPE_LABELS[type]}
              count={stats.byType[type]}
              onClick={() => setCaseType(type)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-sm lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <MaterialIcon
              name="search"
              className="absolute top-2.5 left-3 text-[20px] text-outline"
            />
            <input
              className="w-full rounded-lg bg-surface-container-low py-2.5 pr-4 pl-10 font-body-sm text-body-sm focus:outline-none"
              placeholder="Buscar por folio, cédula, nombre o responsable..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as HealthCaseStatus | "all")
            }
          >
            <option value="all">Todos los estados</option>
            {HEALTH_CASE_STATUSES.map((item) => (
              <option key={item} value={item}>
                {HEALTH_CASE_STATUS_LABELS[item]}
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

      <div className="grid grid-cols-1 items-start gap-md xl:grid-cols-12">
        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm xl:col-span-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                  <th className="px-md py-sm">Folio</th>
                  <th className="px-sm py-sm">Colaborador</th>
                  <th className="px-sm py-sm">Tipo</th>
                  <th className="px-sm py-sm">Apertura</th>
                  <th className="px-sm py-sm">Estado</th>
                  <th className="px-sm py-sm">Próx. seguimiento</th>
                  <th className="px-md py-sm text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filtered.map((item) => {
                  const upcoming = isUpcomingFollowUp(item.nextFollowUp, item.status);
                  return (
                    <tr
                      key={item.id}
                      className={`cursor-pointer hover:bg-surface-container-low/50 ${
                        selectedId === item.id ? "bg-surface-container-low/70" : ""
                      }`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <td className="px-md py-sm whitespace-nowrap">
                        <div className="font-semibold text-primary">{item.folio}</div>
                        <div className="text-[11px] text-on-surface-variant">
                          {item.issuer || "Sin emisor"}
                        </div>
                      </td>
                      <td className="px-sm py-sm">
                        <div className="font-semibold text-on-surface">{item.workerName}</div>
                        <div className="text-[11px] text-on-surface-variant">
                          {item.jobTitleSnapshot} · {item.farmName ?? "Sin centro"}
                        </div>
                        <div className="text-[11px] text-on-surface-variant">
                          {item.workerCode} · CC {item.workerDocument}
                        </div>
                      </td>
                      <td className="px-sm py-sm whitespace-nowrap">
                        {HEALTH_CASE_TYPE_LABELS[item.caseType]}
                      </td>
                      <td className="px-sm py-sm whitespace-nowrap">
                        <div>{item.openedAt}</div>
                        {item.closedAt ? (
                          <div className="text-[11px] text-on-surface-variant">
                            Cierre {item.closedAt}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-sm py-sm">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 text-[11px] font-bold ${STATUS_CHIP_STYLES[item.status]}`}
                        >
                          {HEALTH_CASE_STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td className="px-sm py-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              upcoming
                                ? "bg-error"
                                : item.status === "cerrado"
                                  ? "bg-outline"
                                  : "bg-secondary"
                            }`}
                          />
                          <span>{item.nextFollowUp ?? "—"}</span>
                        </div>
                        {item.responsibleName ? (
                          <div className="text-[11px] text-on-surface-variant">
                            Resp: {item.responsibleName}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-md py-sm text-right">
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
                            <MaterialIcon name="edit" className="text-[18px]" />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg bg-error-container p-1.5 text-on-error-container"
                            title="Eliminar"
                            disabled={pending}
                            onClick={(event) => {
                              event.stopPropagation();
                              remove(item.id);
                            }}
                          >
                            <MaterialIcon name="delete" className="text-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-md py-lg text-center text-on-surface-variant"
                    >
                      No hay casos con los filtros actuales. Registra el primero o importa
                      Excel.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="xl:col-span-4">
          {selected ? (
            <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
              <div className="mb-sm flex items-start justify-between gap-sm">
                <div>
                  <div className="font-label-sm text-label-sm tracking-wider text-primary uppercase">
                    Detalle del caso
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    {selected.folio}
                  </h2>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-surface-container p-1.5"
                  onClick={() => setSelectedId(null)}
                >
                  <MaterialIcon name="close" className="text-[18px]" />
                </button>
              </div>
              <dl className="space-y-sm font-body-sm text-body-sm">
                <DetailRow label="Trabajador" value={selected.workerName} />
                <DetailRow
                  label="Documento"
                  value={`${selected.workerCode} · CC ${selected.workerDocument}`}
                />
                <DetailRow
                  label="Tipo"
                  value={HEALTH_CASE_TYPE_LABELS[selected.caseType]}
                />
                <DetailRow
                  label="Estado"
                  value={HEALTH_CASE_STATUS_LABELS[selected.status]}
                />
                <DetailRow label="Apertura" value={selected.openedAt} />
                <DetailRow
                  label="Próximo seguimiento"
                  value={selected.nextFollowUp ?? "—"}
                />
                <DetailRow label="Cierre" value={selected.closedAt ?? "—"} />
                <DetailRow label="Responsable" value={selected.responsibleName || "—"} />
                <DetailRow label="Emisor" value={selected.issuer || "—"} />
                <DetailRow label="Cargo" value={selected.jobTitleSnapshot || "—"} />
                <DetailRow label="Centro de trabajo" value={selected.farmName ?? "Sin centro"} />
                <DetailRow
                  label="Observaciones administrativas"
                  value={selected.adminObservations || "Sin observaciones"}
                />
              </dl>
              {selected.evidenceUrl ? (
                <a
                  href={selected.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-sm inline-flex items-center gap-1 text-primary underline"
                >
                  <MaterialIcon name="attach_file" className="text-[16px]" />
                  {selected.evidenceName || "Ver evidencia"}
                </a>
              ) : (
                <p className="mt-sm text-[11px] text-outline">Sin evidencia adjunta</p>
              )}
              <button
                type="button"
                className="mt-md inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-sm py-2.5 font-label-md text-label-md text-on-primary"
                onClick={() => openEdit(selected)}
              >
                <MaterialIcon name="edit" className="text-[18px]" />
                Editar caso
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-surface-container-lowest p-md text-center shadow-sm">
              <MaterialIcon
                name="visibility"
                className="mx-auto mb-2 text-[28px] text-outline"
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Selecciona un caso en la matriz para ver el detalle administrativo.
              </p>
            </div>
          )}
        </aside>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
            <div className="mb-md flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {editing.id ? "Editar caso de salud" : "Aperturar nuevo caso"}
              </h2>
              <button type="button" onClick={() => setEditing(null)}>
                <MaterialIcon name="close" />
              </button>
            </div>
            <div className="mb-sm rounded-lg bg-surface-container-low p-sm font-body-sm text-body-sm text-on-surface-variant">
              No ingresar historia clínica ni CIE-10. Solo observaciones administrativas.
            </div>
            <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
              <label className="flex flex-col gap-xs md:col-span-2">
                <span className="font-label-sm text-label-sm">Trabajador (base maestra)</span>
                <WorkerSelect
                  workers={workers}
                  value={editing.workerId || null}
                  includeRetired
                  required
                  onChange={(worker) =>
                    setEditing({ ...editing, workerId: worker?.id ?? "" })
                  }
                />
              </label>
              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Tipo de caso</span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.caseType}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      caseType: event.target.value as HealthCaseType,
                    })
                  }
                >
                  {HEALTH_CASE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {HEALTH_CASE_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Estado</span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.status}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      status: event.target.value as HealthCaseStatus,
                    })
                  }
                >
                  {HEALTH_CASE_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {HEALTH_CASE_STATUS_LABELS[item]}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Fecha de apertura"
                type="date"
                value={editing.openedAt}
                onChange={(value) => setEditing({ ...editing, openedAt: value })}
              />
              <Field
                label="Próximo seguimiento"
                type="date"
                value={editing.nextFollowUp ?? ""}
                onChange={(value) => setEditing({ ...editing, nextFollowUp: value })}
              />
              <Field
                label="Fecha de cierre"
                type="date"
                value={editing.closedAt ?? ""}
                onChange={(value) => setEditing({ ...editing, closedAt: value })}
              />
              <Field
                label="Responsable"
                value={editing.responsibleName}
                onChange={(value) => setEditing({ ...editing, responsibleName: value })}
              />
              <Field
                label="Emisor (EPS / ARL / IPS)"
                value={editing.issuer}
                onChange={(value) => setEditing({ ...editing, issuer: value })}
              />
              <Field
                label="URL evidencia"
                value={editing.evidenceUrl}
                onChange={(value) => setEditing({ ...editing, evidenceUrl: value })}
              />
              <Field
                label="Nombre evidencia"
                value={editing.evidenceName}
                onChange={(value) => setEditing({ ...editing, evidenceName: value })}
              />
              <label className="flex flex-col gap-xs md:col-span-2">
                <span className="font-label-sm text-label-sm">
                  Observaciones administrativas
                </span>
                <textarea
                  className="min-h-24 rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.adminObservations}
                  onChange={(event) =>
                    setEditing({ ...editing, adminObservations: event.target.value })
                  }
                  placeholder="Solo trazabilidad administrativa. Sin diagnósticos."
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
                {pending ? "Guardando..." : "Guardar caso"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
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
    <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
          {label}
        </span>
        <MaterialIcon name={icon} className="text-[20px] text-primary" />
      </div>
      <div
        className={`font-headline-lg text-headline-lg font-bold tracking-tight ${accent ?? "text-primary"}`}
      >
        {value}
      </div>
      <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant">{detail}</div>
    </div>
  );
}

function CategoryChip({
  active,
  label,
  count,
  onClick,
}: Readonly<{
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 font-label-sm text-label-sm ${
        active
          ? "bg-primary text-on-primary shadow-sm"
          : "bg-surface-container-low text-on-surface hover:bg-surface-container"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 text-[11px] font-bold ${
          active
            ? "bg-primary-container text-on-primary-container"
            : "bg-surface-container text-on-surface-variant"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function DetailRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="font-label-sm text-label-sm text-on-surface-variant">{label}</dt>
      <dd className="text-on-surface">{value}</dd>
    </div>
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
  type?: "text" | "date";
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
