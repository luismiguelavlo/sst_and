"use client";

import { useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useOptionalSgsstGlobalFilters } from "@/components/sg-sst/filters/SgsstGlobalFiltersContext";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import { matchesGlobalFilters } from "@/lib/sg-sst/filters/global";
import {
  formatChunkImportToast,
  runChunkedBulkImport,
} from "@/lib/sg-sst/import-chunks";
import {
  bulkImportChemicalsAction,
  deleteChemicalAction,
  saveChemicalAction,
} from "@/lib/sg-sst/quimicos/actions";
import {
  CHEMICAL_EXCEL_MAX_ROWS,
  CHEMICAL_IMPORT_CHUNK_SIZE,
  type ChemicalExcelImportRow,
} from "@/lib/sg-sst/quimicos/excel";
import {
  downloadChemicalsExcel,
  downloadChemicalsTemplate,
  parseChemicalsExcelFile,
} from "@/lib/sg-sst/quimicos/excel-client";
import {
  CHEMICAL_STATUS_LABELS,
  CHEMICAL_STATUSES,
  CHEMICAL_TRAINING_LABELS,
  CHEMICAL_TRAINING_STATUSES,
  CHEMICAL_UNIT_LABELS,
  CHEMICAL_UNITS,
  draftFromChemical,
  emptyChemicalDraft,
  formatQuantity,
  hasSafetySheet,
  type ChemicalStats,
  type ChemicalStatus,
  type ChemicalTrainingStatus,
  type ChemicalUnit,
  type SstChemical,
  type SstChemicalDraft,
} from "@/lib/sg-sst/quimicos/types";

type ChemicalsMasterScreenProps = {
  items: SstChemical[];
  stats: ChemicalStats;
  farms: SstFarm[];
};

type StatusFilter = ChemicalStatus | "all";

export function ChemicalsMasterScreen({
  items,
  stats,
  farms,
}: Readonly<ChemicalsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const globalFilters = useOptionalSgsstGlobalFilters();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<ChemicalExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstChemicalDraft | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const today = new Date().toISOString().slice(0, 10);
    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (
        globalFilters &&
        !matchesGlobalFilters(
          {
            farmId: item.farmId,
            area: item.area,
            date: item.nextInspectionAt ?? item.lastInspectionAt,
          },
          globalFilters.filters,
        )
      ) {
        return false;
      }
      if (!q) return true;
      return (
        item.productName.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.responsibleName.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        (item.farmName ?? "").toLowerCase().includes(q) ||
        item.requiredEpp.toLowerCase().includes(q) ||
        (item.nextInspectionAt && item.nextInspectionAt <= today && q.includes("inspec"))
      );
    });
  }, [items, status, farmId, query, globalFilters]);

  function handleExport() {
    downloadChemicalsExcel(
      filtered,
      `inventario-quimicos-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} productos.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseChemicalsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas válidas (columna producto).", {
          variant: "error",
        });
        return;
      }
      if (rows.length > CHEMICAL_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${CHEMICAL_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
        return;
      }
      setPreview(rows);
      setFileName(file.name);
      showToast(`Archivo leído: ${rows.length} productos listos para importar.`);
    } catch (caught) {
      showToast(
        caught instanceof Error ? caught.message : "No se pudo leer el archivo.",
        { variant: "error" },
      );
    } finally {
      event.target.value = "";
    }
  }

  function confirmImport() {
    if (preview.length === 0) return;
    startTransition(async () => {
      const result = await runChunkedBulkImport(
        preview,
        (chunk) => bulkImportChemicalsAction({ rows: chunk }),
        {
          chunkSize: CHEMICAL_IMPORT_CHUNK_SIZE,
          continueOnChunkError: true,
        },
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

  function submitDraft(draft: SstChemicalDraft) {
    startTransition(async () => {
      const result = await saveChemicalAction(draft);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(draft.id ? "Producto actualizado." : "Producto creado.");
      setEditing(null);
      router.refresh();
    });
  }

  function removeItem(item: SstChemical) {
    const ok = window.confirm(
      `¿Eliminar "${item.productName}" (${item.code}) del inventario?`,
    );
    if (!ok) return;
    startTransition(async () => {
      const result = await deleteChemicalAction(item.id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Producto eliminado.");
      router.refresh();
    });
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md">
      <header className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
            <MaterialIcon name="science" className="text-[16px]" />
            Riesgos operativos
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            Inventario de químicos
          </h1>
          <p className="mt-xs max-w-3xl font-body-md text-body-md text-on-surface-variant">
            Control de sustancias químicas por centro de trabajo: ficha de
            seguridad, EPP, almacenamiento, inspecciones y capacitación asociada.
          </p>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => setEditing(emptyChemicalDraft())}
          className="inline-flex items-center gap-xs rounded-lg bg-primary px-base py-sm font-label-md text-label-md font-semibold text-on-primary"
        >
          <MaterialIcon name="add" />
          Nuevo producto
        </button>
      </header>

      <section className="grid grid-cols-2 gap-sm md:grid-cols-5">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Activos" value={stats.active} accent />
        <StatCard label="Sin ficha" value={stats.withoutSafetySheet} />
        <StatCard label="Inspección vencida" value={stats.inspectionDue} />
        <StatCard label="Capacitación pendiente" value={stats.trainingPending} />
      </section>

      <section className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <div className="flex flex-wrap items-center gap-sm">
          <div className="relative min-w-[220px] flex-1">
            <MaterialIcon
              name="search"
              className="pointer-events-none absolute top-1/2 left-sm -translate-y-1/2 text-on-surface-variant"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto, código, responsable, área…"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-sm pr-sm pl-xl font-body-sm text-body-sm"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-sm font-body-sm text-body-sm"
          >
            <option value="all">Todos los estados</option>
            {CHEMICAL_STATUSES.map((value) => (
              <option key={value} value={value}>
                {CHEMICAL_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
          <select
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-sm font-body-sm text-body-sm"
          >
            <option value="all">Todos los centros</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-xs rounded-lg bg-surface-container px-base py-sm font-label-sm text-label-sm font-semibold text-primary"
          >
            <MaterialIcon name="download" className="text-[18px]" />
            Exportar
          </button>
          <button
            type="button"
            onClick={() => downloadChemicalsTemplate()}
            className="inline-flex items-center gap-xs rounded-lg bg-surface-container px-base py-sm font-label-sm text-label-sm font-semibold text-primary"
          >
            <MaterialIcon name="description" className="text-[18px]" />
            Plantilla
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-xs rounded-lg bg-surface-container px-base py-sm font-label-sm text-label-sm font-semibold text-primary"
          >
            <MaterialIcon name="upload" className="text-[18px]" />
            Importar
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {preview.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-sm rounded-lg bg-secondary-fixed px-base py-sm text-on-secondary-fixed">
            <span className="font-label-sm text-label-sm">
              Vista previa: {preview.length} filas de {fileName}. Mismo producto +
              centro → actualización (el código no mezcla productos distintos).
            </span>
            <div className="flex gap-sm">
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setPreview([]);
                  setFileName("");
                }}
                className="rounded-lg px-sm py-xs font-label-sm text-label-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={confirmImport}
                className="rounded-lg bg-primary px-sm py-xs font-label-sm text-label-sm font-semibold text-on-primary"
              >
                Confirmar importación
              </button>
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left font-body-sm text-body-sm">
            <thead>
              <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                <th className="rounded-l-lg px-base py-sm">Producto</th>
                <th className="px-base py-sm">Centro / área</th>
                <th className="px-base py-sm">Cantidad</th>
                <th className="px-base py-sm">Ficha</th>
                <th className="px-base py-sm">Inspección</th>
                <th className="px-base py-sm">Capacitación</th>
                <th className="px-base py-sm">Estado</th>
                <th className="rounded-r-lg px-base py-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const inspectionOverdue =
                  Boolean(item.nextInspectionAt) &&
                  (item.nextInspectionAt as string) <= today;
                return (
                  <tr
                    key={item.id}
                    className="border-b border-outline-variant/40 hover:bg-surface-container-low/50"
                  >
                    <td className="px-base py-sm">
                      <div className="font-semibold text-on-surface">
                        {item.productName}
                      </div>
                      <div className="font-mono text-[12px] text-primary">
                        {item.code}
                      </div>
                      <div className="text-[12px] text-on-surface-variant">
                        Resp. {item.responsibleName || "—"}
                      </div>
                    </td>
                    <td className="px-base py-sm text-on-surface-variant">
                      <div>{item.farmName || "Sin centro"}</div>
                      {item.area ? (
                        <div className="text-[12px]">{item.area}</div>
                      ) : null}
                    </td>
                    <td className="px-base py-sm font-semibold text-on-surface">
                      {formatQuantity(item.quantity, item.unit)}
                    </td>
                    <td className="px-base py-sm">
                      {hasSafetySheet(item) ? (
                        <div>
                          <span className="rounded-full bg-secondary-fixed px-sm py-0.5 font-label-sm text-label-sm font-semibold text-on-secondary-fixed">
                            Con ficha
                          </span>
                          <div className="mt-0.5 text-[12px] text-on-surface-variant">
                            {item.safetySheetUpdatedAt || "Sin fecha"}
                          </div>
                        </div>
                      ) : (
                        <span className="rounded-full bg-error-container px-sm py-0.5 font-label-sm text-label-sm font-semibold text-on-error-container">
                          Sin ficha
                        </span>
                      )}
                    </td>
                    <td className="px-base py-sm text-on-surface-variant">
                      <div
                        className={
                          inspectionOverdue
                            ? "font-semibold text-error"
                            : undefined
                        }
                      >
                        {item.nextInspectionAt || "—"}
                      </div>
                      <div className="text-[12px]">
                        Última: {item.lastInspectionAt || "—"}
                      </div>
                    </td>
                    <td className="px-base py-sm">
                      <span className="rounded-full bg-surface-container-high px-sm py-0.5 font-label-sm text-label-sm font-semibold text-on-surface">
                        {CHEMICAL_TRAINING_LABELS[item.trainingStatus]}
                      </span>
                    </td>
                    <td className="px-base py-sm">
                      <StatusChip status={item.status} />
                    </td>
                    <td className="px-base py-sm">
                      <div className="flex flex-wrap gap-xs">
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => setEditing(draftFromChemical(item))}
                          className="rounded-lg bg-surface-container px-sm py-xs font-label-sm text-label-sm font-semibold text-primary"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => removeItem(item)}
                          className="rounded-lg bg-error-container px-sm py-xs font-label-sm text-label-sm font-semibold text-on-error-container"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-base py-lg text-center text-on-surface-variant"
                  >
                    No hay productos con esos filtros. Crea uno o importa la
                    plantilla.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {editing ? (
        <ChemicalFormDialog
          draft={editing}
          farms={farms}
          pending={pending}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSubmit={submitDraft}
        />
      ) : null}
    </div>
  );
}

function StatusChip({ status }: Readonly<{ status: ChemicalStatus }>) {
  const tone =
    status === "activo"
      ? "bg-secondary-fixed text-on-secondary-fixed"
      : status === "agotado" || status === "vencido"
        ? "bg-error-container text-on-error-container"
        : "bg-surface-container-high text-on-surface-variant";
  return (
    <span
      className={`rounded-full px-sm py-0.5 font-label-sm text-label-sm font-semibold ${tone}`}
    >
      {CHEMICAL_STATUS_LABELS[status]}
    </span>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: Readonly<{ label: string; value: number; accent?: boolean }>) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
        {label}
      </div>
      <div
        className={`mt-xs font-headline-md text-headline-md font-bold ${
          accent ? "text-primary" : "text-on-surface"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ChemicalFormDialog({
  draft,
  farms,
  pending,
  onChange,
  onClose,
  onSubmit,
}: Readonly<{
  draft: SstChemicalDraft;
  farms: SstFarm[];
  pending: boolean;
  onChange: (draft: SstChemicalDraft) => void;
  onClose: () => void;
  onSubmit: (draft: SstChemicalDraft) => void;
}>) {
  function patch<K extends keyof SstChemicalDraft>(key: K, value: SstChemicalDraft[K]) {
    onChange({ ...draft, [key]: value });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/40 p-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between gap-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Editar producto químico" : "Nuevo producto químico"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-xs text-on-surface-variant hover:bg-surface-container"
            aria-label="Cerrar"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
          <Field label="Producto *">
            <input
              value={draft.productName}
              onChange={(e) => patch("productName", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              placeholder="Glifosato 48%"
            />
          </Field>
          <Field label="Código (opcional)">
            <input
              value={draft.code ?? ""}
              onChange={(e) => patch("code", e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm font-mono text-body-sm uppercase"
              placeholder="QUI-2026-001"
            />
          </Field>
          <Field label="Centro de trabajo / finca">
            <select
              value={draft.farmId ?? ""}
              onChange={(e) => patch("farmId", e.target.value || null)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            >
              <option value="">Sin centro</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Área / ubicación">
            <input
              value={draft.area}
              onChange={(e) => patch("area", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              placeholder="Bodega agroquímicos"
            />
          </Field>
          <Field label="Responsable *">
            <input
              value={draft.responsibleName}
              onChange={(e) => patch("responsibleName", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            />
          </Field>
          <Field label="Fecha actualización ficha">
            <input
              type="date"
              value={draft.safetySheetUpdatedAt}
              onChange={(e) => patch("safetySheetUpdatedAt", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            />
          </Field>
          <Field label="Ficha de seguridad (nombre)">
            <input
              value={draft.safetySheetName}
              onChange={(e) => patch("safetySheetName", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              placeholder="MSDS-producto.pdf"
            />
          </Field>
          <Field label="URL ficha de seguridad">
            <input
              value={draft.safetySheetUrl}
              onChange={(e) => patch("safetySheetUrl", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              placeholder="https://…"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="EPP requerido">
              <input
                value={draft.requiredEpp}
                onChange={(e) => patch("requiredEpp", e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
                placeholder="Guantes, gafas, respirador…"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Almacenamiento">
              <textarea
                value={draft.storageConditions}
                onChange={(e) => patch("storageConditions", e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              />
            </Field>
          </div>
          <Field label="Cantidad">
            <input
              type="number"
              min={0}
              step="0.001"
              value={draft.quantity}
              onChange={(e) => patch("quantity", Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            />
          </Field>
          <Field label="Unidad">
            <select
              value={draft.unit}
              onChange={(e) => patch("unit", e.target.value as ChemicalUnit)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            >
              {CHEMICAL_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {CHEMICAL_UNIT_LABELS[unit]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Última inspección">
            <input
              type="date"
              value={draft.lastInspectionAt}
              onChange={(e) => patch("lastInspectionAt", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            />
          </Field>
          <Field label="Próxima inspección">
            <input
              type="date"
              value={draft.nextInspectionAt}
              onChange={(e) => patch("nextInspectionAt", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notas de inspección">
              <input
                value={draft.inspectionNotes}
                onChange={(e) => patch("inspectionNotes", e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              />
            </Field>
          </div>
          <Field label="Capacitación">
            <select
              value={draft.trainingStatus}
              onChange={(e) =>
                patch("trainingStatus", e.target.value as ChemicalTrainingStatus)
              }
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            >
              {CHEMICAL_TRAINING_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {CHEMICAL_TRAINING_LABELS[value]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fecha capacitación">
            <input
              type="date"
              value={draft.lastTrainingAt}
              onChange={(e) => patch("lastTrainingAt", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notas de capacitación">
              <input
                value={draft.trainingNotes}
                onChange={(e) => patch("trainingNotes", e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              />
            </Field>
          </div>
          <Field label="Estado">
            <select
              value={draft.status}
              onChange={(e) => patch("status", e.target.value as ChemicalStatus)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            >
              {CHEMICAL_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {CHEMICAL_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Observaciones">
              <textarea
                value={draft.observations}
                onChange={(e) => patch("observations", e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              />
            </Field>
          </div>
        </div>

        <div className="mt-md flex justify-end gap-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-base py-sm font-label-md text-label-md text-on-surface-variant"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => onSubmit(draft)}
            className="rounded-lg bg-primary px-base py-sm font-label-md text-label-md font-semibold text-on-primary disabled:opacity-60"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <label className="flex flex-col gap-xs">
      <span className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
