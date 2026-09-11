"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportOperatorsAction,
  deleteOperatorAction,
  saveOperatorAction,
} from "@/lib/sg-sst/operadores/actions";
import {
  OPERATOR_EXCEL_MAX_ROWS,
  type OperatorExcelImportRow,
} from "@/lib/sg-sst/operadores/excel";
import {
  downloadOperatorsExcel,
  downloadOperatorsTemplate,
  parseOperatorsExcelFile,
} from "@/lib/sg-sst/operadores/excel-client";
import {
  BLOCK_CATEGORY_LABELS,
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_TYPES,
  FITNESS_CONCEPT_LABELS,
  FITNESS_CONCEPTS,
  KEY_STATUS_LABELS,
  KEY_STATUSES,
  draftFromOperator,
  emptyOperatorDraft,
  type EquipmentType,
  type FitnessConcept,
  type KeyStatus,
  type OperatorBlockCategory,
  type OperatorStats,
  type SstOperatorDraft,
  type SstOperatorView,
} from "@/lib/sg-sst/operadores/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type OperatorsMasterScreenProps = {
  operators: SstOperatorView[];
  stats: OperatorStats;
  farms: SstFarm[];
  workers: SstWorker[];
};

const BLOCK_CATEGORY_ORDER: OperatorBlockCategory[] = [
  "formacion_vencida",
  "formacion_pendiente",
  "documentacion_pendiente",
  "aptitud_pendiente",
  "requisitos_incompletos",
];

const BLOCK_CATEGORY_ICONS: Record<OperatorBlockCategory, string> = {
  formacion_vencida: "history_toggle_off",
  formacion_pendiente: "pending_actions",
  documentacion_pendiente: "badge",
  aptitud_pendiente: "medical_services",
  requisitos_incompletos: "rule",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function OperatorsMasterScreen({
  operators,
  stats,
  farms,
  workers,
}: Readonly<OperatorsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [farmId, setFarmId] = useState("all");
  const [equipmentType, setEquipmentType] = useState<EquipmentType | "all">("all");
  const [keyStatus, setKeyStatus] = useState<KeyStatus | "all">("all");
  const [preview, setPreview] = useState<OperatorExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstOperatorDraft | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return operators.filter((item) => {
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (equipmentType !== "all" && item.equipmentType !== equipmentType) return false;
      if (keyStatus !== "all" && item.keyStatus !== keyStatus) return false;
      if (!q) return true;
      return (
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.workerCode.toLowerCase().includes(q) ||
        item.folio.toLowerCase().includes(q) ||
        item.equipmentName.toLowerCase().includes(q) ||
        item.trainingName.toLowerCase().includes(q)
      );
    });
  }, [operators, farmId, equipmentType, keyStatus, query]);

  const unauthorized = useMemo(
    () => operators.filter((item) => item.keyStatus === "bloqueado"),
    [operators],
  );

  function handleExport() {
    downloadOperatorsExcel(
      filtered,
      `operadores-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} operadores.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseOperatorsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > OPERATOR_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${OPERATOR_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
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
      const result = await bulkImportOperatorsAction({ rows: preview });
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
    setEditing(emptyOperatorDraft());
  }

  function openEdit(item: SstOperatorView) {
    setEditing(draftFromOperator(item));
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveOperatorAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editing.id ? "Operador actualizado." : "Operador registrado.");
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("¿Eliminar este registro de operador?")) return;
    startTransition(async () => {
      const result = await deleteOperatorAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Registro eliminado.");
      router.refresh();
    });
  }

  const coverage =
    stats.total > 0 ? Math.round((stats.authorized / stats.total) * 100) : 0;

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="agriculture" className="text-[16px] text-primary" />
            <span>Tractoristas / operadores</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Tractoristas y operadores de maquinaria agrícola
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Control de capacitación, aptitud, inducción y licencia. Bloqueo automático de
            llave cuando faltan requisitos o hay vigencias vencidas.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadOperatorsTemplate()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="download" className="text-[18px]" />
            Plantilla Excel
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="upload_file" className="text-[18px]" />
            Importar
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-high px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="table_view" className="text-[18px]" />
            Exportar (.XLSX)
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 font-label-md text-label-md font-semibold text-on-primary shadow-sm"
          >
            <MaterialIcon name="person_add" className="text-[18px]" />
            Registrar operador
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

      {preview.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-sm rounded-xl bg-secondary-fixed/40 px-md py-sm">
          <span className="font-body-sm text-body-sm">
            Listos para importar: <strong>{preview.length}</strong> filas de{" "}
            <strong>{fileName}</strong>
          </span>
          <div className="flex gap-sm">
            <button
              type="button"
              className="rounded-lg bg-surface-container px-base py-sm"
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
              className="rounded-lg bg-primary px-base py-sm font-semibold text-on-primary disabled:opacity-60"
              onClick={confirmImport}
            >
              {pending ? "Importando…" : "Confirmar importación"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Operadores habilitados"
          value={stats.authorized}
          detail={`${stats.total} registrados · ${coverage}% autorizados`}
          icon="verified"
        />
        <Kpi
          label="En riesgo / por vencer"
          value={stats.atRisk}
          detail="< 30 días (capacitación o licencia)"
          icon="notification_important"
          accent="text-secondary"
        />
        <Kpi
          label="No autorizados"
          value={stats.blocked}
          detail="Llave bloqueada en almacén / patio"
          icon="lock"
          accent="text-error"
        />
        <Kpi
          label="Total flota / operadores"
          value={stats.total}
          detail="Registros en matriz de habilitación"
          icon="agriculture"
        />
      </div>

      {unauthorized.length > 0 ? (
        <section className="space-y-md rounded-xl bg-surface-container-lowest p-gutter shadow-sm">
          <div className="flex flex-col justify-between gap-sm md:flex-row md:items-center">
            <div className="flex items-center gap-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error text-on-error shadow-md">
                <MaterialIcon name="gpp_bad" className="text-[24px]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-xs">
                  <h2 className="font-headline-md text-headline-md tracking-tight text-error">
                    Personal no autorizado para operar
                  </h2>
                  <span className="rounded-full bg-error px-base py-xs font-label-sm text-label-sm font-bold text-on-error">
                    {unauthorized.length} inhabilitados
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Identificación automática: formación, documentación, aptitud e inducción.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm sm:grid-cols-3 lg:grid-cols-5">
            {BLOCK_CATEGORY_ORDER.map((category) => (
              <div
                key={category}
                className="flex flex-col gap-xs rounded-lg bg-surface-container-low p-sm"
              >
                <span className="flex items-center gap-xs font-label-sm text-label-sm font-medium text-on-surface-variant">
                  <MaterialIcon
                    name={BLOCK_CATEGORY_ICONS[category]}
                    className="text-[16px] text-error"
                  />
                  {BLOCK_CATEGORY_LABELS[category]}
                </span>
                <span className="font-headline-md text-headline-md font-bold text-primary">
                  {stats.byBlockCategory[category]}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-md pt-xs md:grid-cols-2 xl:grid-cols-3">
            {unauthorized.slice(0, 6).map((item) => (
              <article
                key={item.id}
                className="relative flex flex-col justify-between rounded-xl bg-surface p-gutter shadow-sm"
              >
                <div className="flex items-start justify-between gap-sm">
                  <div className="flex items-center gap-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container font-headline-md text-headline-md font-bold text-error">
                      {initials(item.workerName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-bold leading-tight text-on-surface">
                        {item.workerName}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        C.C. {item.workerDocument}
                      </span>
                      <span className="mt-xs font-label-sm text-label-sm font-medium text-on-surface-variant">
                        {item.equipmentName} · {EQUIPMENT_TYPE_LABELS[item.equipmentType]}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-error px-base py-xs font-label-sm text-label-sm font-bold text-on-error">
                    BLOQUEADO
                  </span>
                </div>
                <div className="mt-md space-y-xs rounded-lg bg-error-container/30 p-sm">
                  <div className="flex items-center gap-xs font-label-sm text-label-sm font-bold text-error">
                    <MaterialIcon name="emergency_home" className="text-[18px]" />
                    {item.blockReasonList[0] ?? "Requisitos incompletos"}
                  </div>
                  {item.blockReasonList.length > 1 ? (
                    <p className="font-body-sm text-body-sm text-on-error-container">
                      {item.blockReasonList.slice(1).join("; ")}
                    </p>
                  ) : null}
                  <div className="text-[11px] font-label-sm text-outline">
                    {item.farmName ?? "Sin finca"} · {item.folio}
                  </div>
                </div>
                <div className="mt-md flex items-center gap-sm">
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-xs rounded-lg bg-primary px-base py-xs font-label-sm text-label-sm font-semibold text-on-primary shadow-sm"
                    onClick={() => openEdit(item)}
                  >
                    <MaterialIcon name="edit" className="text-[16px]" />
                    Actualizar requisitos
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-md rounded-xl bg-surface-container-lowest p-gutter shadow-sm">
        <div className="flex flex-col items-stretch justify-between gap-md lg:flex-row lg:items-center">
          <div className="relative max-w-lg flex-1">
            <MaterialIcon
              name="search"
              className="absolute top-1/2 left-base -translate-y-1/2 text-[20px] text-outline"
            />
            <input
              className="w-full rounded-lg bg-surface-container-low py-xs pr-base pl-10 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:bg-surface-container focus:outline-none"
              placeholder="Buscar por nombre, cédula, equipo o folio…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-sm">
            <select
              className="cursor-pointer rounded-lg bg-surface-container-low px-base py-xs font-label-md text-label-md text-on-surface"
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
            <select
              className="cursor-pointer rounded-lg bg-surface-container-low px-base py-xs font-label-md text-label-md text-on-surface"
              value={equipmentType}
              onChange={(event) =>
                setEquipmentType(event.target.value as EquipmentType | "all")
              }
            >
              <option value="all">Todo tipo de equipo</option>
              {EQUIPMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {EQUIPMENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            <select
              className="cursor-pointer rounded-lg bg-surface-container-low px-base py-xs font-label-md text-label-md text-on-surface"
              value={keyStatus}
              onChange={(event) =>
                setKeyStatus(event.target.value as KeyStatus | "all")
              }
            >
              <option value="all">Todos los estados</option>
              {KEY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {KEY_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <button
              type="button"
              title="Restablecer filtros"
              className="flex items-center justify-center rounded-lg bg-surface-container p-xs text-primary"
              onClick={() => {
                setQuery("");
                setFarmId("all");
                setEquipmentType("all");
                setKeyStatus("all");
              }}
            >
              <MaterialIcon name="filter_alt_off" className="text-[20px]" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-xs pt-xs">
          <span className="font-label-sm text-label-sm text-outline">Filtros:</span>
          <span className="rounded-full bg-secondary-fixed px-base py-xs font-label-sm text-label-sm text-on-secondary-fixed">
            {filtered.length} de {operators.length} registros
          </span>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between p-gutter">
          <div>
            <h3 className="font-headline-md text-headline-md text-primary">
              Matriz de habilitación y competencia
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Capacitación + aptitud + inducción + licencia (si aplica).
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm text-on-surface">
            <thead className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
              <tr>
                <th className="px-base py-sm">Trabajador</th>
                <th className="px-base py-sm">Finca</th>
                <th className="px-base py-sm">Equipo / tipo</th>
                <th className="px-base py-sm">Capacitación</th>
                <th className="px-base py-sm">Vencimiento</th>
                <th className="px-base py-sm">Licencia</th>
                <th className="px-base py-sm">EMO / aptitud</th>
                <th className="px-base py-sm">Inducción</th>
                <th className="px-base py-sm text-center">Estado</th>
                <th className="px-base py-sm">Observaciones</th>
                <th className="px-base py-sm text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-surface-container-high align-top"
                >
                  <td className="px-base py-sm">
                    <div className="font-semibold">{item.workerName}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      {item.workerDocument} · {item.folio}
                    </div>
                    <div className="text-[11px] text-outline">{item.jobTitleSnapshot}</div>
                  </td>
                  <td className="px-base py-sm whitespace-nowrap">
                    {item.farmName ?? "—"}
                  </td>
                  <td className="px-base py-sm">
                    <div className="font-semibold">{item.equipmentName}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      {EQUIPMENT_TYPE_LABELS[item.equipmentType]}
                    </div>
                  </td>
                  <td className="px-base py-sm">
                    <div className="max-w-[180px]">{item.trainingName}</div>
                    <div className="text-[11px] text-outline">
                      {item.trainingDate ?? "Sin fecha"}
                    </div>
                  </td>
                  <td className="px-base py-sm whitespace-nowrap">
                    <div className="font-semibold">{item.trainingDueDate ?? "—"}</div>
                    {item.trainingDaysRemaining !== null ? (
                      <TrainingDueHint days={item.trainingDaysRemaining} />
                    ) : null}
                  </td>
                  <td className="px-base py-sm">
                    <div>{item.licenseCategory || "—"}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      {item.licenseDueDate ?? ""}
                    </div>
                  </td>
                  <td className="px-base py-sm">
                    <div>{FITNESS_CONCEPT_LABELS[item.fitnessConcept]}</div>
                    <div className="text-[11px] text-outline">
                      {item.occupationalExamDate ?? "Sin EMO"}
                    </div>
                  </td>
                  <td className="px-base py-sm whitespace-nowrap">
                    {item.inductionDone ? (
                      <span className="font-semibold text-secondary">Sí</span>
                    ) : (
                      <span className="font-semibold text-error">No</span>
                    )}
                    <div className="text-[11px] text-outline">
                      {item.inductionDate ?? ""}
                    </div>
                  </td>
                  <td className="px-base py-sm text-center">
                    <KeyStatusChip status={item.keyStatus} />
                    {item.blockReasonList.length > 0 ? (
                      <div className="mt-1 max-w-[140px] text-[10px] text-error line-clamp-2">
                        {item.blockReasons}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-base py-sm">
                    <div className="max-w-[160px] text-[12px] text-on-surface-variant line-clamp-2">
                      {item.observations || "—"}
                    </div>
                  </td>
                  <td className="px-base py-sm text-right">
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
                    No hay operadores con los filtros actuales. Registra el primero o
                    importa Excel.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <OperatorFormModal
          draft={editing}
          workers={workers}
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

function OperatorFormModal({
  draft,
  workers,
  farms,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstOperatorDraft;
  workers: SstWorker[];
  farms: SstFarm[];
  pending: boolean;
  onChange: (draft: SstOperatorDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Editar operador" : "Registrar operador"}
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
                onChange({
                  ...draft,
                  workerId: worker?.id ?? "",
                  farmId: draft.farmId || worker?.farmId || null,
                })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Finca</span>
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
              <option value="">Sin finca / usar del trabajador</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </label>

          <Field
            label="Equipo"
            value={draft.equipmentName}
            onChange={(value) => onChange({ ...draft, equipmentName: value })}
          />

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Tipo de equipo</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.equipmentType}
              onChange={(event) =>
                onChange({
                  ...draft,
                  equipmentType: event.target.value as EquipmentType,
                })
              }
            >
              {EQUIPMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {EQUIPMENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </label>

          <Field
            label="Capacitación"
            value={draft.trainingName}
            onChange={(value) => onChange({ ...draft, trainingName: value })}
          />

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha capacitación</span>
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
            <span className="font-label-sm text-label-sm">
              Vencimiento / reentrenamiento
            </span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.trainingDueDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, trainingDueDate: event.target.value })
              }
            />
          </label>

          <Field
            label="Licencia (categoría)"
            value={draft.licenseCategory}
            onChange={(value) => onChange({ ...draft, licenseCategory: value })}
          />

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Vencimiento licencia</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.licenseDueDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, licenseDueDate: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Examen ocupacional</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.occupationalExamDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, occupationalExamDate: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Aptitud</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.fitnessConcept}
              onChange={(event) =>
                onChange({
                  ...draft,
                  fitnessConcept: event.target.value as FitnessConcept,
                })
              }
            >
              {FITNESS_CONCEPTS.map((concept) => (
                <option key={concept} value={concept}>
                  {FITNESS_CONCEPT_LABELS[concept]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-sm md:col-span-2">
            <input
              type="checkbox"
              checked={draft.inductionDone}
              onChange={(event) =>
                onChange({ ...draft, inductionDone: event.target.checked })
              }
            />
            <span className="font-label-sm text-label-sm">Inducción de maquinaria realizada</span>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha inducción</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.inductionDate ?? ""}
              onChange={(event) =>
                onChange({ ...draft, inductionDate: event.target.value })
              }
            />
          </label>

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

        <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">
          El estado de llave (autorizado / bloqueado) se calcula automáticamente al
          guardar según capacitación, aptitud, inducción y licencia.
        </p>

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
      <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
        {detail}
      </div>
    </div>
  );
}

function KeyStatusChip({ status }: Readonly<{ status: KeyStatus }>) {
  const styles: Record<KeyStatus, string> = {
    autorizado: "bg-secondary-fixed text-on-secondary-fixed",
    bloqueado: "bg-error text-on-error",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${styles[status]}`}
    >
      {KEY_STATUS_LABELS[status]}
    </span>
  );
}

function TrainingDueHint({ days }: Readonly<{ days: number }>) {
  let colorClass = "text-on-surface-variant";
  if (days <= 0) colorClass = "text-error";
  else if (days <= 30) colorClass = "text-secondary";
  return (
    <div className={`text-[11px] ${colorClass}`}>
      {days <= 0 ? "Vencida" : `${days} d`}
    </div>
  );
}
