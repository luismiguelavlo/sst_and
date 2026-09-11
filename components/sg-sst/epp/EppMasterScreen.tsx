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
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm, SstSemaphoreLevel } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportEppDeliveriesAction,
  deleteEppCatalogAction,
  deleteEppDeliveryAction,
  saveEppCatalogAction,
  saveEppDeliveryAction,
} from "@/lib/sg-sst/epp/actions";
import {
  EPP_EXCEL_MAX_ROWS,
  type EppExcelImportRow,
} from "@/lib/sg-sst/epp/excel";
import {
  downloadEppCatalogTemplate,
  downloadEppDeliveriesExcel,
  downloadEppDeliveriesTemplate,
  parseEppDeliveriesExcelFile,
} from "@/lib/sg-sst/epp/excel-client";
import {
  EPP_CATEGORIES,
  EPP_CATEGORY_LABELS,
  EPP_REASON_LABELS,
  EPP_REASONS,
  addDaysIso,
  draftFromCatalog,
  draftFromDelivery,
  emptyCatalogDraft,
  emptyDeliveryDraft,
  type EppCategory,
  type EppReason,
  type EppStats,
  type SstEppCatalogDraft,
  type SstEppCatalogItem,
  type SstEppDeliveryDraft,
  type SstEppDeliveryView,
} from "@/lib/sg-sst/epp/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type EppMasterScreenProps = {
  deliveries: SstEppDeliveryView[];
  catalog: SstEppCatalogItem[];
  stats: EppStats;
  farms: SstFarm[];
  workers: SstWorker[];
};

type TabId = "entregas" | "catalogo";

const SEM_FILTERS: { id: SstSemaphoreLevel | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "critico", label: "Vencidos" },
  { id: "proximo", label: "1–30 d" },
  { id: "seguimiento", label: "31–60 d" },
  { id: "vigente", label: ">60 d" },
];

export function EppMasterScreen({
  deliveries,
  catalog,
  stats,
  farms,
  workers,
}: Readonly<EppMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<TabId>("entregas");
  const [query, setQuery] = useState("");
  const [semaphore, setSemaphore] = useState<SstSemaphoreLevel | "all">("all");
  const [category, setCategory] = useState<EppCategory | "all">("all");
  const [reason, setReason] = useState<EppReason | "all">("all");
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<EppExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editingDelivery, setEditingDelivery] = useState<SstEppDeliveryDraft | null>(
    null,
  );
  const [editingCatalog, setEditingCatalog] = useState<SstEppCatalogDraft | null>(
    null,
  );

  const activeCatalog = useMemo(
    () => catalog.filter((item) => item.active),
    [catalog],
  );

  const filteredDeliveries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deliveries.filter((item) => {
      if (semaphore !== "all" && item.semaphore !== semaphore) return false;
      if (category !== "all" && item.catalogCategory !== category) return false;
      if (reason !== "all" && item.reason !== reason) return false;
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.workerCode.toLowerCase().includes(q) ||
        item.folio.toLowerCase().includes(q) ||
        item.catalogName.toLowerCase().includes(q) ||
        item.catalogCode.toLowerCase().includes(q) ||
        item.responsibleName.toLowerCase().includes(q)
      );
    });
  }, [deliveries, semaphore, category, reason, farmId, query]);

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        EPP_CATEGORY_LABELS[item.category].toLowerCase().includes(q)
      );
    });
  }, [catalog, category, query]);

  function handleExport() {
    downloadEppDeliveriesExcel(
      filteredDeliveries,
      `entregas-epp-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportadas ${filteredDeliveries.length} entregas.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseEppDeliveriesExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > EPP_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${EPP_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
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
      const result = await bulkImportEppDeliveriesAction({ rows: preview });
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

  function saveDelivery() {
    if (!editingDelivery) return;
    startTransition(async () => {
      const result = await saveEppDeliveryAction(editingDelivery);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editingDelivery.id ? "Entrega actualizada." : "Entrega registrada.");
      setEditingDelivery(null);
      router.refresh();
    });
  }

  function removeDelivery(id: string) {
    if (!window.confirm("¿Eliminar esta entrega de EPP?")) return;
    startTransition(async () => {
      const result = await deleteEppDeliveryAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Entrega eliminada.");
      router.refresh();
    });
  }

  function saveCatalog() {
    if (!editingCatalog) return;
    startTransition(async () => {
      const result = await saveEppCatalogAction(editingCatalog);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editingCatalog.id ? "Catálogo actualizado." : "Ítem creado.");
      setEditingCatalog(null);
      router.refresh();
    });
  }

  function removeCatalog(id: string) {
    if (
      !window.confirm(
        "¿Eliminar este ítem del catálogo? Si tiene entregas, se desactivará.",
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteEppCatalogAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Catálogo actualizado.");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="safety_check" className="text-[16px] text-primary" />
            <span>Equipos de protección personal</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Dotación y gestión de EPP
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Control de ciclo de vida útil, entregas según base maestra y alertas de
            reposición para planificación presupuestal.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadEppDeliveriesTemplate()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="table_view" className="text-[18px]" />
            Plantilla entregas
          </button>
          <button
            type="button"
            onClick={() => downloadEppCatalogTemplate(catalog)}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="category" className="text-[18px]" />
            Plantilla catálogo
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
            onClick={() => setEditingDelivery(emptyDeliveryDraft())}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm"
          >
            <MaterialIcon name="add" className="text-[20px]" />
            Registrar entrega
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

      <section className="grid grid-cols-2 gap-sm md:grid-cols-3 xl:grid-cols-4">
        <Kpi
          label="Entregas del mes"
          value={stats.deliveriesThisMonth}
          detail={`${stats.total} entregas totales`}
          icon="inventory_2"
        />
        <Kpi
          label="Pendientes"
          value={stats.pendingReplenishment}
          detail="Reposición vencida"
          icon="error"
          accent="text-error"
        />
        <Kpi
          label="Próximas reposiciones"
          value={stats.upcomingReplenishment}
          detail="≤ 30 días"
          icon="autorenew"
        />
        <Kpi
          label="Semáforo"
          value={`${stats.bySemaphore.critico}/${stats.bySemaphore.proximo}`}
          detail={`Seguim. ${stats.bySemaphore.seguimiento} · Vig. ${stats.bySemaphore.vigente}`}
          icon="traffic"
        />
      </section>

      <section className="grid grid-cols-1 gap-sm lg:grid-cols-2 xl:grid-cols-4">
        <TopList
          title="EPP más entregados"
          items={stats.topDelivered.map((item) => ({
            label: item.name,
            value: item.count,
            hint: EPP_CATEGORY_LABELS[item.category],
          }))}
        />
        <TopList
          title="EPP más repuestos"
          items={stats.topReplaced.map((item) => ({
            label: item.name,
            value: item.count,
            hint: EPP_CATEGORY_LABELS[item.category],
          }))}
        />
        <TopList
          title="Consumo por empresa"
          items={stats.byCompany.slice(0, 5).map((item) => ({
            label: item.label,
            value: item.quantity,
            hint: item.costCop > 0 ? `$${Math.round(item.costCop).toLocaleString("es-CO")}` : "",
          }))}
        />
        <TopList
          title="Consumo por centro"
          items={stats.byWorkCenter.slice(0, 5).map((item) => ({
            label: item.label,
            value: item.quantity,
            hint: item.costCop > 0 ? `$${Math.round(item.costCop).toLocaleString("es-CO")}` : "",
          }))}
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
                {preview.length} filas. Folio existente → actualización. Documento y código
                EPP deben existir.
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

      <div className="flex flex-wrap gap-1 rounded-xl bg-surface-container-lowest p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("entregas")}
          className={`rounded-lg px-md py-2 font-label-md text-label-md ${
            tab === "entregas"
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:bg-surface-container-low"
          }`}
        >
          Entregas
        </button>
        <button
          type="button"
          onClick={() => setTab("catalogo")}
          className={`rounded-lg px-md py-2 font-label-md text-label-md ${
            tab === "catalogo"
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:bg-surface-container-low"
          }`}
        >
          Catálogo
        </button>
        {tab === "catalogo" ? (
          <button
            type="button"
            onClick={() => setEditingCatalog(emptyCatalogDraft())}
            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-surface-container-low px-sm py-1.5 font-label-sm text-label-sm text-primary"
          >
            <MaterialIcon name="add" className="text-[16px]" />
            Nuevo ítem
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-sm shadow-sm lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <MaterialIcon
            name="search"
            className="absolute top-2.5 left-3 text-[20px] text-outline"
          />
          <input
            className="w-full rounded-lg bg-surface-container-low py-2.5 pr-4 pl-10 font-body-sm text-body-sm focus:outline-none"
            placeholder={
              tab === "entregas"
                ? "Cédula, nombre, folio o EPP…"
                : "Código, nombre o categoría…"
            }
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {tab === "entregas" ? (
          <div className="flex flex-wrap gap-1">
            {SEM_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSemaphore(item.id)}
                className={`rounded-lg px-2.5 py-1.5 font-label-sm text-label-sm ${
                  semaphore === item.id
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface-variant"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
        <select
          className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as EppCategory | "all")
          }
        >
          <option value="all">Todas las categorías</option>
          {EPP_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {EPP_CATEGORY_LABELS[item]}
            </option>
          ))}
        </select>
        {tab === "entregas" ? (
          <>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value as EppReason | "all")
              }
            >
              <option value="all">Todos los motivos</option>
              {EPP_REASONS.map((item) => (
                <option key={item} value={item}>
                  {EPP_REASON_LABELS[item]}
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
          </>
        ) : null}
      </div>

      {tab === "entregas" ? (
        <DeliveriesTable
          rows={filteredDeliveries}
          pending={pending}
          onEdit={(item) => setEditingDelivery(draftFromDelivery(item))}
          onDelete={removeDelivery}
        />
      ) : (
        <CatalogTable
          rows={filteredCatalog}
          pending={pending}
          onEdit={(item) => setEditingCatalog(draftFromCatalog(item))}
          onDelete={removeCatalog}
        />
      )}

      {editingDelivery ? (
        <DeliveryFormModal
          draft={editingDelivery}
          workers={workers}
          catalog={activeCatalog}
          pending={pending}
          onChange={setEditingDelivery}
          onClose={() => setEditingDelivery(null)}
          onSave={saveDelivery}
        />
      ) : null}

      {editingCatalog ? (
        <CatalogFormModal
          draft={editingCatalog}
          pending={pending}
          onChange={setEditingCatalog}
          onClose={() => setEditingCatalog(null)}
          onSave={saveCatalog}
        />
      ) : null}
    </div>
  );
}

function DeliveriesTable({
  rows,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  rows: SstEppDeliveryView[];
  pending: boolean;
  onEdit: (item: SstEppDeliveryView) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
              <th className="px-md py-sm">Semáforo</th>
              <th className="px-sm py-sm">Trabajador</th>
              <th className="px-sm py-sm">EPP</th>
              <th className="px-sm py-sm">Entrega / reposición</th>
              <th className="px-sm py-sm">Motivo</th>
              <th className="px-sm py-sm">Responsable</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {rows.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low/50">
                <td className="px-md py-sm align-top">
                  <SemaphoreBadge
                    level={item.semaphore}
                    label={item.semaphoreLabel}
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
                  <div className="font-mono text-[11px] text-on-surface-variant">
                    {item.folio}
                  </div>
                </td>
                <td className="px-sm py-sm align-top">
                  <div className="font-semibold">{item.catalogName}</div>
                  <div className="text-[11px] text-on-surface-variant">
                    {EPP_CATEGORY_LABELS[item.catalogCategory]} · {item.catalogCode}
                  </div>
                  <div className="text-[11px]">
                    Cant. {item.quantity}
                    {item.sizeLabel ? ` · Talla ${item.sizeLabel}` : ""}
                  </div>
                </td>
                <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                  <div>
                    <span className="text-outline">Entrega:</span> {item.deliveryDate}
                  </div>
                  <div>
                    <span className="text-outline">Vida útil:</span> {item.usefulLifeDays} d
                  </div>
                  <div className="font-semibold">
                    Reposición: {item.nextReplenishmentDate ?? "—"}
                    {item.daysRemaining != null ? ` (${item.daysRemaining}d)` : ""}
                  </div>
                </td>
                <td className="px-sm py-sm align-top">
                  <span className="rounded bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold">
                    {EPP_REASON_LABELS[item.reason]}
                  </span>
                  {item.evidenceUrl ? (
                    <a
                      href={item.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 flex items-center gap-1 text-[11px] text-primary underline"
                    >
                      <MaterialIcon name="attach_file" className="text-[14px]" />
                      {item.evidenceName || "Evidencia"}
                    </a>
                  ) : null}
                </td>
                <td className="px-sm py-sm align-top">
                  <div className="font-semibold">{item.responsibleName}</div>
                  <div className="mt-1 max-w-[200px] text-[12px] text-on-surface-variant line-clamp-2">
                    {item.observations || "Sin observaciones"}
                  </div>
                </td>
                <td className="px-md py-sm text-right align-top">
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg bg-surface-container p-1.5"
                      onClick={() => onEdit(item)}
                      title="Editar"
                    >
                      <MaterialIcon name="edit" className="text-[18px]" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-error-container p-1.5 text-on-error-container"
                      disabled={pending}
                      onClick={() => onDelete(item.id)}
                      title="Eliminar"
                    >
                      <MaterialIcon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-md py-lg text-center text-on-surface-variant">
                  No hay entregas con los filtros actuales.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CatalogTable({
  rows,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  rows: SstEppCatalogItem[];
  pending: boolean;
  onEdit: (item: SstEppCatalogItem) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
              <th className="px-md py-sm">Código</th>
              <th className="px-sm py-sm">Categoría</th>
              <th className="px-sm py-sm">Nombre</th>
              <th className="px-sm py-sm">Vida útil</th>
              <th className="px-sm py-sm">Estado</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {rows.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low/50">
                <td className="px-md py-sm font-mono text-[12px]">{item.code}</td>
                <td className="px-sm py-sm">
                  {EPP_CATEGORY_LABELS[item.category]}
                </td>
                <td className="px-sm py-sm font-semibold">{item.name}</td>
                <td className="px-sm py-sm">{item.usefulLifeDays} días</td>
                <td className="px-sm py-sm">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                      item.active
                        ? "bg-primary-fixed text-on-primary-fixed-variant"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {item.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-md py-sm text-right">
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg bg-surface-container p-1.5"
                      onClick={() => onEdit(item)}
                      title="Editar"
                    >
                      <MaterialIcon name="edit" className="text-[18px]" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-error-container p-1.5 text-on-error-container"
                      disabled={pending}
                      onClick={() => onDelete(item.id)}
                      title="Eliminar / desactivar"
                    >
                      <MaterialIcon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-md py-lg text-center text-on-surface-variant">
                  No hay ítems en el catálogo con los filtros actuales.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeliveryFormModal({
  draft,
  workers,
  catalog,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstEppDeliveryDraft;
  workers: SstWorker[];
  catalog: SstEppCatalogItem[];
  pending: boolean;
  onChange: (draft: SstEppDeliveryDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  const selectedCatalog = catalog.find((item) => item.id === draft.catalogItemId);
  const previewNext =
    draft.deliveryDate && draft.usefulLifeDays > 0
      ? addDaysIso(draft.deliveryDate, Math.trunc(draft.usefulLifeDays))
      : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Editar entrega de EPP" : "Acta de entrega de EPP"}
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

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">EPP (catálogo)</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.catalogItemId}
              onChange={(event) => {
                const item = catalog.find((row) => row.id === event.target.value);
                onChange({
                  ...draft,
                  catalogItemId: event.target.value,
                  usefulLifeDays: item?.usefulLifeDays ?? draft.usefulLifeDays,
                  nextReplenishmentDate: "",
                });
              }}
            >
              <option value="">Seleccionar EPP…</option>
              {catalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {EPP_CATEGORY_LABELS[item.category]} — {item.name} ({item.code})
                </option>
              ))}
            </select>
            {selectedCatalog ? (
              <span className="text-[11px] text-on-surface-variant">
                Vida útil sugerida: {selectedCatalog.usefulLifeDays} días
              </span>
            ) : null}
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Cantidad</span>
            <input
              type="number"
              min={1}
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.quantity}
              onChange={(event) =>
                onChange({ ...draft, quantity: Number(event.target.value) || 1 })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Talla</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.sizeLabel}
              onChange={(event) =>
                onChange({ ...draft, sizeLabel: event.target.value })
              }
              placeholder="Ej. 40 / M / Única"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha de entrega</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.deliveryDate}
              onChange={(event) =>
                onChange({
                  ...draft,
                  deliveryDate: event.target.value,
                  nextReplenishmentDate: "",
                })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Vida útil (días)</span>
            <input
              type="number"
              min={1}
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.usefulLifeDays}
              onChange={(event) =>
                onChange({
                  ...draft,
                  usefulLifeDays: Number(event.target.value) || 1,
                  nextReplenishmentDate: "",
                })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Próxima reposición</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.nextReplenishmentDate || previewNext}
              onChange={(event) =>
                onChange({ ...draft, nextReplenishmentDate: event.target.value })
              }
            />
            <span className="text-[11px] text-on-surface-variant">
              Automática: entrega + vida útil ({previewNext || "—"})
            </span>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Motivo</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.reason}
              onChange={(event) =>
                onChange({ ...draft, reason: event.target.value as EppReason })
              }
            >
              {EPP_REASONS.map((item) => (
                <option key={item} value={item}>
                  {EPP_REASON_LABELS[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Responsable</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.responsibleName}
              onChange={(event) =>
                onChange({ ...draft, responsibleName: event.target.value })
              }
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
            />
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
            className="rounded-lg bg-surface-container px-md py-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            className="rounded-lg bg-primary px-md py-2 font-semibold text-on-primary disabled:opacity-60"
            onClick={onSave}
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogFormModal({
  draft,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstEppCatalogDraft;
  pending: boolean;
  onChange: (draft: SstEppCatalogDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Editar ítem de catálogo" : "Nuevo ítem de catálogo"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-sm">
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Código</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.code}
              onChange={(event) =>
                onChange({ ...draft, code: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Categoría</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.category}
              onChange={(event) =>
                onChange({
                  ...draft,
                  category: event.target.value as EppCategory,
                })
              }
            >
              {EPP_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {EPP_CATEGORY_LABELS[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Nombre</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.name}
              onChange={(event) =>
                onChange({ ...draft, name: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Vida útil (días)</span>
            <input
              type="number"
              min={1}
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.usefulLifeDays}
              onChange={(event) =>
                onChange({
                  ...draft,
                  usefulLifeDays: Number(event.target.value) || 1,
                })
              }
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(event) =>
                onChange({ ...draft, active: event.target.checked })
              }
            />
            <span className="font-label-sm text-label-sm">Activo</span>
          </label>
        </div>

        <div className="mt-md flex justify-end gap-sm">
          <button
            type="button"
            className="rounded-lg bg-surface-container px-md py-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            className="rounded-lg bg-primary px-md py-2 font-semibold text-on-primary disabled:opacity-60"
            onClick={onSave}
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
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
  detail: ReactNode;
  icon: string;
  accent?: string;
}>) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-xs flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {label}
        </span>
        <MaterialIcon name={icon} className={`text-[20px] ${accent ?? "text-primary"}`} />
      </div>
      <div className={`font-headline-md text-headline-md ${accent ?? "text-on-surface"}`}>
        {value}
      </div>
      <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{detail}</div>
    </div>
  );
}

function TopList({
  title,
  items,
}: Readonly<{
  title: string;
  items: ReadonlyArray<{ label: string; value: number; hint?: string }>;
}>) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <h3 className="mb-sm font-label-md text-label-md font-bold text-on-surface">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">Sin datos</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={`${title}-${item.label}`}
              className="flex items-start justify-between gap-2 text-[13px]"
            >
              <div className="min-w-0">
                <div className="truncate font-semibold text-on-surface">{item.label}</div>
                {item.hint ? (
                  <div className="text-[11px] text-on-surface-variant">{item.hint}</div>
                ) : null}
              </div>
              <span className="shrink-0 font-semibold text-primary">{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
