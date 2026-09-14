"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import {
  bulkImportFarmsAction,
  deleteFarmAction,
  saveFarmAction,
  setFarmActiveAction,
} from "@/lib/sg-sst/fincas/actions";
import {
  FARM_EXCEL_MAX_ROWS,
  FARM_IMPORT_CHUNK_SIZE,
  type FarmExcelImportRow,
} from "@/lib/sg-sst/fincas/excel";
import {
  downloadFarmsExcel,
  downloadFarmsTemplate,
  parseFarmsExcelFile,
} from "@/lib/sg-sst/fincas/excel-client";
import {
  draftFromFarm,
  emptyFarmDraft,
  type FarmStats,
  type SstFarmDraft,
  type SstFarmRecord,
} from "@/lib/sg-sst/fincas/types";
import {
  formatChunkImportToast,
  runChunkedBulkImport,
} from "@/lib/sg-sst/import-chunks";

type FarmsMasterScreenProps = {
  farms: SstFarmRecord[];
  stats: FarmStats;
};

type StatusFilter = "all" | "active" | "inactive";

export function FarmsMasterScreen({
  farms,
  stats,
}: Readonly<FarmsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [preview, setPreview] = useState<FarmExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstFarmDraft | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return farms.filter((farm) => {
      if (status === "active" && !farm.active) return false;
      if (status === "inactive" && farm.active) return false;
      if (!q) return true;
      return (
        farm.name.toLowerCase().includes(q) ||
        farm.code.toLowerCase().includes(q) ||
        farm.company.toLowerCase().includes(q) ||
        farm.municipality.toLowerCase().includes(q) ||
        farm.address.toLowerCase().includes(q)
      );
    });
  }, [farms, query, status]);

  function handleExport() {
    downloadFarmsExcel(
      filtered,
      `centros-de-trabajo-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} centros.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseFarmsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas válidas (columna finca / nombre / código).", {
          variant: "error",
        });
        return;
      }
      if (rows.length > FARM_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${FARM_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
        return;
      }
      setPreview(rows);
      setFileName(file.name);
      showToast(`Archivo leído: ${rows.length} centros listos para importar.`);
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
        (chunk) => bulkImportFarmsAction({ rows: chunk }),
        {
          chunkSize: FARM_IMPORT_CHUNK_SIZE,
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

  function submitDraft(draft: SstFarmDraft) {
    startTransition(async () => {
      const result = await saveFarmAction(draft);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(draft.id ? "Centro actualizado." : "Centro creado.");
      setEditing(null);
      router.refresh();
    });
  }

  function toggleActive(farm: SstFarmRecord) {
    startTransition(async () => {
      const result = await setFarmActiveAction(farm.id, !farm.active);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(result.message ?? "Estado actualizado.");
      router.refresh();
    });
  }

  function removeFarm(farm: SstFarmRecord) {
    const linked = farm.workersCount + farm.recordsCount;
    const ok = window.confirm(
      linked > 0
        ? `"${farm.name}" tiene vínculos. Se desactivará en lugar de borrarse. ¿Continuar?`
        : `¿Eliminar el centro "${farm.name}" (${farm.code})?`,
    );
    if (!ok) return;
    startTransition(async () => {
      const result = await deleteFarmAction(farm.id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(result.message ?? "Listo.");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md">
      <header className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
            <MaterialIcon name="apartment" className="text-[16px]" />
            Catálogo operativo
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            Centros de trabajo
          </h1>
          <p className="mt-xs max-w-3xl font-body-md text-body-md text-on-surface-variant">
            Administra los centros de trabajo usados en filtros, trabajadores y
            registros SST. Desactivar conserva el historial; eliminar solo aplica
            si no hay vínculos.
          </p>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => setEditing(emptyFarmDraft())}
          className="inline-flex items-center gap-xs rounded-lg bg-primary px-base py-sm font-label-md text-label-md font-semibold text-on-primary"
        >
          <MaterialIcon name="add" />
          Nuevo centro
        </button>
      </header>

      <section className="grid grid-cols-2 gap-sm md:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Activos" value={stats.active} accent />
        <StatCard label="Inactivos" value={stats.inactive} />
        <StatCard label="Con trabajadores" value={stats.withWorkers} />
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
              placeholder="Buscar por nombre, código, empresa o municipio…"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-sm pr-sm pl-xl font-body-sm text-body-sm"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-sm font-body-sm text-body-sm"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
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
            onClick={() => downloadFarmsTemplate()}
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
              Vista previa: {preview.length} filas de {fileName}
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
          <table className="w-full min-w-[880px] text-left font-body-sm text-body-sm">
            <thead>
              <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                <th className="rounded-l-lg px-base py-sm">Código</th>
                <th className="px-base py-sm">Centro de trabajo</th>
                <th className="px-base py-sm">Empresa</th>
                <th className="px-base py-sm">Municipio</th>
                <th className="px-base py-sm">Uso</th>
                <th className="px-base py-sm">Estado</th>
                <th className="rounded-r-lg px-base py-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((farm) => (
                <tr
                  key={farm.id}
                  className="border-b border-outline-variant/40 hover:bg-surface-container-low/50"
                >
                  <td className="px-base py-sm font-mono font-semibold text-primary">
                    {farm.code}
                  </td>
                  <td className="px-base py-sm">
                    <div className="font-semibold text-on-surface">{farm.name}</div>
                    {farm.address ? (
                      <div className="text-[12px] text-on-surface-variant">
                        {farm.address}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-base py-sm text-on-surface-variant">
                    {farm.company || "—"}
                  </td>
                  <td className="px-base py-sm text-on-surface-variant">
                    {farm.municipality || "—"}
                  </td>
                  <td className="px-base py-sm text-on-surface-variant">
                    {farm.workersCount} trab. · {farm.recordsCount} reg.
                  </td>
                  <td className="px-base py-sm">
                    <span
                      className={`rounded-full px-sm py-0.5 font-label-sm text-label-sm font-semibold ${
                        farm.active
                          ? "bg-secondary-fixed text-on-secondary-fixed"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {farm.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-base py-sm">
                    <div className="flex flex-wrap gap-xs">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => setEditing(draftFromFarm(farm))}
                        className="rounded-lg bg-surface-container px-sm py-xs font-label-sm text-label-sm font-semibold text-primary"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => toggleActive(farm)}
                        className="rounded-lg bg-surface-container px-sm py-xs font-label-sm text-label-sm font-semibold text-primary"
                      >
                        {farm.active ? "Desactivar" : "Reactivar"}
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => removeFarm(farm)}
                        className="rounded-lg bg-error-container px-sm py-xs font-label-sm text-label-sm font-semibold text-on-error-container"
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
                    colSpan={7}
                    className="px-base py-lg text-center text-on-surface-variant"
                  >
                    No hay centros con esos filtros.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {editing ? (
        <FarmFormDialog
          draft={editing}
          pending={pending}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSubmit={submitDraft}
        />
      ) : null}
    </div>
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

function FarmFormDialog({
  draft,
  pending,
  onChange,
  onClose,
  onSubmit,
}: Readonly<{
  draft: SstFarmDraft;
  pending: boolean;
  onChange: (draft: SstFarmDraft) => void;
  onClose: () => void;
  onSubmit: (draft: SstFarmDraft) => void;
}>) {
  function patch<K extends keyof SstFarmDraft>(key: K, value: SstFarmDraft[K]) {
    onChange({ ...draft, [key]: value });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/40 p-sm sm:items-center">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between gap-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Editar centro" : "Nuevo centro"}
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
          <Field label="Código *">
            <input
              value={draft.code}
              onChange={(e) => patch("code", e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm font-mono text-body-sm uppercase"
              placeholder="ESP"
            />
          </Field>
          <Field label="Nombre *">
            <input
              value={draft.name}
              onChange={(e) => patch("name", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              placeholder="Planta Principal"
            />
          </Field>
          <Field label="Empresa / razón social">
            <input
              value={draft.company}
              onChange={(e) => patch("company", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            />
          </Field>
          <Field label="Municipio / lugar">
            <input
              value={draft.municipality}
              onChange={(e) => patch("municipality", e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Dirección / ubicación">
              <input
                value={draft.address}
                onChange={(e) => patch("address", e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Observaciones">
              <textarea
                value={draft.observations}
                onChange={(e) => patch("observations", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-outline-variant px-sm py-sm text-body-sm"
              />
            </Field>
          </div>
          <label className="flex items-center gap-sm font-label-sm text-label-sm text-on-surface sm:col-span-2">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => patch("active", e.target.checked)}
            />
            Centro activo (aparece en selectores de los módulos)
          </label>
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
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <label className="flex flex-col gap-xs">
      <span className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
