"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportPesvDriversAction,
  bulkImportPesvVehiclesAction,
  deleteDriverAction,
  deletePreopAction,
  deleteVehicleAction,
  saveDriverAction,
  savePreopAction,
  saveVehicleAction,
} from "@/lib/sg-sst/pesv/actions";
import {
  PESV_EXCEL_MAX_ROWS,
  type PesvDriverExcelImportRow,
  type PesvVehicleExcelImportRow,
} from "@/lib/sg-sst/pesv/excel";
import {
  downloadPesvTemplate,
  downloadPesvWorkbook,
  parsePesvDriversExcelFile,
  parsePesvVehiclesExcelFile,
} from "@/lib/sg-sst/pesv/excel-client";
import {
  PESV_AUTH_LABELS,
  PESV_AUTH_STATUSES,
  PESV_FITNESS_CONCEPTS,
  PESV_FITNESS_LABELS,
  PESV_PREOP_STATUS_LABELS,
  PESV_PREOP_STATUSES,
  PESV_VEHICLE_STATUS_LABELS,
  PESV_VEHICLE_STATUSES,
  draftFromDriver,
  draftFromPreop,
  draftFromVehicle,
  emptyDriverDraft,
  emptyPreopDraft,
  emptyVehicleDraft,
  type PesvAuthStatus,
  type PesvFitnessConcept,
  type PesvPreopStatus,
  type PesvStats,
  type PesvVehicleStatus,
  type SstPesvDriver,
  type SstPesvDriverDraft,
  type SstPesvPreop,
  type SstPesvPreopDraft,
  type SstPesvVehicle,
  type SstPesvVehicleDraft,
} from "@/lib/sg-sst/pesv/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type TabId = "conductores" | "flota" | "preops";

type PesvMasterScreenProps = {
  drivers: SstPesvDriver[];
  vehicles: SstPesvVehicle[];
  preops: SstPesvPreop[];
  stats: PesvStats;
  farms: SstFarm[];
  workers: SstWorker[];
};

type ImportKind = "drivers" | "vehicles";

export function PesvMasterScreen({
  drivers,
  vehicles,
  preops,
  stats,
  farms,
  workers,
}: Readonly<PesvMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const driverInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<TabId>("conductores");
  const [query, setQuery] = useState("");
  const [authFilter, setAuthFilter] = useState<PesvAuthStatus | "all">("all");
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState<
    PesvVehicleStatus | "all"
  >("all");
  const [preopStatusFilter, setPreopStatusFilter] = useState<
    PesvPreopStatus | "all"
  >("all");

  const [editingDriver, setEditingDriver] = useState<SstPesvDriverDraft | null>(
    null,
  );
  const [editingVehicle, setEditingVehicle] =
    useState<SstPesvVehicleDraft | null>(null);
  const [editingPreop, setEditingPreop] = useState<SstPesvPreopDraft | null>(
    null,
  );

  const [importKind, setImportKind] = useState<ImportKind>("drivers");
  const [driverPreview, setDriverPreview] = useState<PesvDriverExcelImportRow[]>(
    [],
  );
  const [vehiclePreview, setVehiclePreview] = useState<
    PesvVehicleExcelImportRow[]
  >([]);
  const [fileName, setFileName] = useState("");

  const filteredDrivers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return drivers.filter((item) => {
      if (authFilter !== "all" && item.authorizationStatus !== authFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.workerCode.toLowerCase().includes(q) ||
        item.folio.toLowerCase().includes(q) ||
        item.plateSnapshot.toLowerCase().includes(q) ||
        (item.vehiclePlate?.toLowerCase().includes(q) ?? false) ||
        item.licenseCategory.toLowerCase().includes(q)
      );
    });
  }, [drivers, authFilter, query]);

  const filteredVehicles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((item) => {
      if (vehicleStatusFilter !== "all" && item.status !== vehicleStatusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.plate.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.vehicleType.toLowerCase().includes(q) ||
        item.workCenter.toLowerCase().includes(q) ||
        (item.responsibleName?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [vehicles, vehicleStatusFilter, query]);

  const filteredPreops = useMemo(() => {
    const q = query.trim().toLowerCase();
    return preops.filter((item) => {
      if (preopStatusFilter !== "all" && item.status !== preopStatusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.folio.toLowerCase().includes(q) ||
        item.vehiclePlate.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.finding.toLowerCase().includes(q)
      );
    });
  }, [preops, preopStatusFilter, query]);

  function handleExport() {
    downloadPesvWorkbook({
      drivers: filteredDrivers,
      vehicles: filteredVehicles,
      preops: filteredPreops,
      fileName: `pesv-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    });
    showToast("Exportado libro PESV (Conductores / Flota / Preops).");
  }

  async function handleDriverFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parsePesvDriversExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > PESV_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${PESV_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
        return;
      }
      setImportKind("drivers");
      setFileName(file.name);
      setDriverPreview(rows);
      setVehiclePreview([]);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "No se pudo leer el Excel.", {
        variant: "error",
      });
    } finally {
      event.target.value = "";
    }
  }

  async function handleVehicleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parsePesvVehiclesExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > PESV_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${PESV_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
        return;
      }
      setImportKind("vehicles");
      setFileName(file.name);
      setVehiclePreview(rows);
      setDriverPreview([]);
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
      const result =
        importKind === "drivers"
          ? await bulkImportPesvDriversAction({ rows: driverPreview })
          : await bulkImportPesvVehiclesAction({ rows: vehiclePreview });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        `Importación: ${result.created} creados, ${result.updated} actualizados, ${result.failed} con error.`,
        { variant: result.failed > 0 ? "info" : "success" },
      );
      setDriverPreview([]);
      setVehiclePreview([]);
      setFileName("");
      router.refresh();
    });
  }

  function saveDriver() {
    if (!editingDriver) return;
    startTransition(async () => {
      const result = await saveDriverAction(editingDriver);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editingDriver.id ? "Conductor actualizado." : "Conductor registrado.");
      setEditingDriver(null);
      router.refresh();
    });
  }

  function saveVehicle() {
    if (!editingVehicle) return;
    startTransition(async () => {
      const result = await saveVehicleAction(editingVehicle);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editingVehicle.id ? "Vehículo actualizado." : "Vehículo registrado.");
      setEditingVehicle(null);
      router.refresh();
    });
  }

  function savePreop() {
    if (!editingPreop) return;
    startTransition(async () => {
      const result = await savePreopAction(editingPreop);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        editingPreop.id ? "Preoperacional actualizado." : "Preoperacional registrado.",
      );
      setEditingPreop(null);
      router.refresh();
    });
  }

  function removeDriver(id: string) {
    if (!window.confirm("¿Eliminar este conductor PESV?")) return;
    startTransition(async () => {
      const result = await deleteDriverAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Conductor eliminado.");
      router.refresh();
    });
  }

  function removeVehicle(id: string) {
    if (!window.confirm("¿Eliminar este vehículo? Se eliminarán sus preops.")) return;
    startTransition(async () => {
      const result = await deleteVehicleAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Vehículo eliminado.");
      router.refresh();
    });
  }

  function removePreop(id: string) {
    if (!window.confirm("¿Eliminar este preoperacional?")) return;
    startTransition(async () => {
      const result = await deletePreopAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Preoperacional eliminado.");
      router.refresh();
    });
  }

  const previewCount =
    importKind === "drivers" ? driverPreview.length : vehiclePreview.length;

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md rounded-xl bg-surface-container-low p-gutter shadow-sm lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-base py-xs font-label-sm text-label-sm uppercase tracking-wide text-on-primary">
              Pilar 3 · Infraestructura y vehículos
            </span>
            <span className="rounded-full bg-surface-container-highest px-base py-xs font-label-sm text-label-sm text-on-surface-variant">
              Res. 40595 / Ley 2251
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Plan Estratégico de Seguridad Vial (PESV)
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Conductores autorizados, flota vehicular, preoperacionales diarios e indicadores
            de siniestralidad.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadPesvTemplate()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-3.5 py-2.5 font-label-md text-label-md text-primary shadow-sm"
          >
            <MaterialIcon name="table_view" className="text-[18px]" />
            Plantilla
          </button>
          <button
            type="button"
            onClick={() => driverInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-highest px-3.5 py-2.5 font-label-md text-label-md text-on-surface"
          >
            <MaterialIcon name="upload_file" className="text-[18px]" />
            Importar conductores
          </button>
          <button
            type="button"
            onClick={() => vehicleInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-highest px-3.5 py-2.5 font-label-md text-label-md text-on-surface"
          >
            <MaterialIcon name="upload_file" className="text-[18px]" />
            Importar flota
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-3.5 py-2.5 font-label-md text-label-md text-primary shadow-sm"
          >
            <MaterialIcon name="download" className="text-[18px]" />
            Exportar .XLSX
          </button>
          <button
            type="button"
            onClick={() => setEditingVehicle(emptyVehicleDraft())}
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3.5 py-2.5 font-label-md text-label-md text-on-secondary shadow-sm"
          >
            <MaterialIcon name="rv_hookup" className="text-[18px]" />
            + Vehículo
          </button>
          <button
            type="button"
            onClick={() => setEditingDriver(emptyDriverDraft())}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 font-label-md text-label-md text-on-primary shadow-sm"
          >
            <MaterialIcon name="person_add" className="text-[18px]" />
            + Conductor
          </button>
          <input
            ref={driverInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleDriverFile}
          />
          <input
            ref={vehicleInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleVehicleFile}
          />
        </div>
      </header>

      <section className="grid grid-cols-1 gap-sm sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Preoperacionales (30 d)"
          value={`${stats.preopsPct}%`}
          detail={`${stats.preopsLast30d} preops / ${stats.vehicleCount} vehículos`}
          icon="fact_check"
        />
        <Kpi
          label="Conductores habilitados"
          value={`${stats.driversAuthorized}`}
          detail={`/ ${stats.driversTotal} evaluados`}
          icon="badge"
        />
        <Kpi
          label="Flota apta"
          value={stats.vehiclesAptos}
          detail={`/ ${stats.vehicleCount} unidades`}
          icon="directions_car"
        />
        <Kpi
          label="Docs < 30 días"
          value={stats.docsDueSoon}
          detail="SOAT / RTM / póliza / licencia"
          icon="notification_important"
          accent="text-error"
        />
        <Kpi
          label="Incidentes"
          value={stats.incidents}
          detail="Detenido o categoría incidente"
          icon="minor_crash"
        />
        <Kpi
          label="Accidentes"
          value={stats.accidents}
          detail="Categoría con accidente"
          icon="car_crash"
        />
        <Kpi
          label="Kilómetros"
          value={stats.totalKm.toLocaleString("es-CO")}
          detail="Suma odómetro flota"
          icon="speed"
        />
        <Kpi
          label="Hallazgos abiertos"
          value={stats.openFindings}
          detail="Abiertos + programados"
          icon="build_circle"
        />
      </section>

      {previewCount > 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <div className="font-label-md text-label-md font-bold">
                Vista previa ({importKind === "drivers" ? "conductores" : "flota"}):{" "}
                {fileName}
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {previewCount} filas listas para importar.
              </div>
            </div>
            <div className="flex gap-xs">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-base py-sm"
                onClick={() => {
                  setDriverPreview([]);
                  setVehiclePreview([]);
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
        </div>
      ) : null}

      <div className="flex flex-col gap-md">
        <div className="flex items-center gap-xs overflow-x-auto rounded-xl bg-surface-container-low p-xs">
          <TabButton
            active={tab === "conductores"}
            onClick={() => setTab("conductores")}
            icon="badge"
            label="Conductores"
            count={drivers.length}
          />
          <TabButton
            active={tab === "flota"}
            onClick={() => setTab("flota")}
            icon="agriculture"
            label="Flota"
            count={vehicles.length}
          />
          <TabButton
            active={tab === "preops"}
            onClick={() => setTab("preops")}
            icon="assignment_turned_in"
            label="Preoperacionales"
            count={stats.openFindings}
            countAccent
          />
        </div>

        <div className="flex flex-col gap-md rounded-xl bg-surface-container-lowest p-gutter shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <MaterialIcon
              name="search"
              className="absolute top-1/2 left-base -translate-y-1/2 text-[20px] text-outline"
            />
            <input
              className="w-full rounded-lg bg-surface-container-low py-xs pr-base pl-xl font-body-sm text-body-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder={
                tab === "conductores"
                  ? "Buscar por nombre, cédula o placa…"
                  : tab === "flota"
                    ? "Buscar por placa, marca o responsable…"
                    : "Buscar por folio, placa o hallazgo…"
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          {tab === "conductores" ? (
            <select
              className="rounded-lg bg-surface-container-low px-base py-xs font-body-sm"
              value={authFilter}
              onChange={(event) =>
                setAuthFilter(event.target.value as PesvAuthStatus | "all")
              }
            >
              <option value="all">Todos los estados</option>
              {PESV_AUTH_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {PESV_AUTH_LABELS[status]}
                </option>
              ))}
            </select>
          ) : null}
          {tab === "flota" ? (
            <select
              className="rounded-lg bg-surface-container-low px-base py-xs font-body-sm"
              value={vehicleStatusFilter}
              onChange={(event) =>
                setVehicleStatusFilter(
                  event.target.value as PesvVehicleStatus | "all",
                )
              }
            >
              <option value="all">Todos los estados</option>
              {PESV_VEHICLE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {PESV_VEHICLE_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          ) : null}
          {tab === "preops" ? (
            <div className="flex flex-wrap items-center gap-sm">
              <select
                className="rounded-lg bg-surface-container-low px-base py-xs font-body-sm"
                value={preopStatusFilter}
                onChange={(event) =>
                  setPreopStatusFilter(
                    event.target.value as PesvPreopStatus | "all",
                  )
                }
              >
                <option value="all">Todos los estados</option>
                {PESV_PREOP_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {PESV_PREOP_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setEditingPreop(emptyPreopDraft())}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 font-label-md text-label-md text-on-primary"
              >
                <MaterialIcon name="add" className="text-[18px]" />
                Preoperacional
              </button>
            </div>
          ) : null}
        </div>

        {tab === "conductores" ? (
          <DriversTable
            items={filteredDrivers}
            pending={pending}
            onEdit={(item) => setEditingDriver(draftFromDriver(item))}
            onDelete={removeDriver}
          />
        ) : null}
        {tab === "flota" ? (
          <VehiclesTable
            items={filteredVehicles}
            pending={pending}
            onEdit={(item) => setEditingVehicle(draftFromVehicle(item))}
            onDelete={removeVehicle}
          />
        ) : null}
        {tab === "preops" ? (
          <PreopsTable
            items={filteredPreops}
            pending={pending}
            onEdit={(item) => setEditingPreop(draftFromPreop(item))}
            onDelete={removePreop}
          />
        ) : null}
      </div>

      {editingDriver ? (
        <DriverFormModal
          draft={editingDriver}
          workers={workers}
          vehicles={vehicles}
          pending={pending}
          onChange={setEditingDriver}
          onClose={() => setEditingDriver(null)}
          onSave={saveDriver}
        />
      ) : null}
      {editingVehicle ? (
        <VehicleFormModal
          draft={editingVehicle}
          workers={workers}
          farms={farms}
          pending={pending}
          onChange={setEditingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSave={saveVehicle}
        />
      ) : null}
      {editingPreop ? (
        <PreopFormModal
          draft={editingPreop}
          vehicles={vehicles}
          pending={pending}
          onChange={setEditingPreop}
          onClose={() => setEditingPreop(null)}
          onSave={savePreop}
        />
      ) : null}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
  countAccent,
}: Readonly<{
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count: number;
  countAccent?: boolean;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-xs rounded-lg px-gutter py-sm font-label-md text-label-md transition-all ${
        active
          ? "bg-primary text-on-primary shadow-sm"
          : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
      }`}
    >
      <MaterialIcon name={icon} className="text-[20px]" />
      <span>{label}</span>
      <span
        className={`rounded-full px-xs py-0.5 text-label-sm ${
          active
            ? "bg-primary-container text-on-primary-container"
            : countAccent
              ? "bg-error-container text-on-error-container"
              : "bg-surface-container-highest text-on-surface-variant"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function DriversTable({
  items,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  items: SstPesvDriver[];
  pending: boolean;
  onEdit: (item: SstPesvDriver) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
      <table className="w-full text-left font-body-sm text-body-sm">
        <thead className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-outline uppercase">
          <tr>
            <th className="px-gutter py-sm">Conductor</th>
            <th className="px-base py-sm">Cargo y sede</th>
            <th className="px-base py-sm">Vehículo</th>
            <th className="px-base py-sm">Licencia</th>
            <th className="px-base py-sm">Curso / EMO</th>
            <th className="px-base py-sm">Autorización</th>
            <th className="px-gutter py-sm text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-surface-container-low/50">
              <td className="px-gutter py-sm align-top">
                <div className="font-semibold text-on-surface">{item.workerName}</div>
                <div className="text-[11px] text-on-surface-variant">
                  CC {item.workerDocument} · {item.workerCode}
                </div>
                <div className="font-mono text-[11px] text-secondary">{item.folio}</div>
              </td>
              <td className="px-base py-sm align-top">
                <div className="font-medium">{item.jobTitleSnapshot || "—"}</div>
                <div className="text-[11px] text-outline">
                  {item.farmName ?? item.companySnapshot}
                </div>
              </td>
              <td className="px-base py-sm align-top">
                <div className="font-semibold text-primary">
                  {item.plateSnapshot || item.vehiclePlate || "—"}
                </div>
                <div className="text-[11px] text-outline">{item.vehicleType || "—"}</div>
              </td>
              <td className="px-base py-sm align-top">
                <div className="inline-flex items-center gap-1">
                  <span className="rounded bg-surface-container-high px-1.5 py-0.5 text-[11px] font-bold text-primary">
                    {item.licenseCategory || "—"}
                  </span>
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  Vence: {item.licenseDueDate ?? "Sin fecha"}
                </div>
              </td>
              <td className="px-base py-sm align-top text-[12px]">
                <div>Curso: {item.roadSafetyCourseDue ?? "N/A"}</div>
                <div>
                  EMO: {PESV_FITNESS_LABELS[item.fitnessConcept]}
                  {item.medicalExamDate ? ` (${item.medicalExamDate})` : ""}
                </div>
              </td>
              <td className="px-base py-sm align-top">
                <AuthBadge status={item.authorizationStatus} />
              </td>
              <td className="px-gutter py-sm text-right align-top">
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
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-md py-lg text-center text-on-surface-variant">
                No hay conductores con los filtros actuales.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function VehiclesTable({
  items,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  items: SstPesvVehicle[];
  pending: boolean;
  onEdit: (item: SstPesvVehicle) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
      <table className="w-full text-left font-body-sm text-body-sm">
        <thead className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-outline uppercase">
          <tr>
            <th className="px-gutter py-sm">Placa / tipo</th>
            <th className="px-base py-sm">Marca / modelo</th>
            <th className="px-base py-sm">Responsable</th>
            <th className="px-base py-sm">Documentos</th>
            <th className="px-base py-sm">Km / kit</th>
            <th className="px-base py-sm">Estado</th>
            <th className="px-gutter py-sm text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-surface-container-low/50">
              <td className="px-gutter py-sm align-top">
                <div className="font-semibold text-primary">{item.plate}</div>
                <div className="text-[11px] text-outline">{item.vehicleType}</div>
              </td>
              <td className="px-base py-sm align-top">
                <div className="font-medium">
                  {item.brand} {item.model}
                </div>
                <div className="text-[11px] text-outline">{item.workCenter || "—"}</div>
              </td>
              <td className="px-base py-sm align-top">
                <div>{item.responsibleName ?? "Sin asignar"}</div>
                <div className="text-[11px] text-outline">
                  {item.farmName ?? "—"}
                </div>
              </td>
              <td className="px-base py-sm align-top text-[12px]">
                <div>SOAT: {item.soatDueDate ?? "—"}</div>
                <div>RTM: {item.rtmDueDate ?? "—"}</div>
                <div>Póliza: {item.insuranceDueDate ?? "—"}</div>
              </td>
              <td className="px-base py-sm align-top text-[12px]">
                <div>{item.odometerKm.toLocaleString("es-CO")} km</div>
                <div>
                  Kit {item.kitOk ? "OK" : "NO"} · Ext.{" "}
                  {item.extinguisherOk ? "OK" : "NO"}
                </div>
              </td>
              <td className="px-base py-sm align-top">
                <VehicleStatusBadge status={item.status} />
              </td>
              <td className="px-gutter py-sm text-right align-top">
                <div className="inline-flex gap-1">
                  <button
                    type="button"
                    className="rounded-lg bg-surface-container p-1.5"
                    onClick={() => onEdit(item)}
                  >
                    <MaterialIcon name="edit" className="text-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-error-container p-1.5 text-on-error-container"
                    disabled={pending}
                    onClick={() => onDelete(item.id)}
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-md py-lg text-center text-on-surface-variant">
                No hay vehículos con los filtros actuales.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function PreopsTable({
  items,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  items: SstPesvPreop[];
  pending: boolean;
  onEdit: (item: SstPesvPreop) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
      <table className="w-full text-left font-body-sm text-body-sm">
        <thead className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-outline uppercase">
          <tr>
            <th className="px-gutter py-sm">Fecha / folio</th>
            <th className="px-base py-sm">Vehículo</th>
            <th className="px-base py-sm">Categoría</th>
            <th className="px-base py-sm">Hallazgo</th>
            <th className="px-base py-sm">Estado</th>
            <th className="px-gutter py-sm text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-surface-container-low/50">
              <td className="px-gutter py-sm align-top">
                <div className="font-semibold">{item.inspectionDate}</div>
                <div className="font-mono text-[11px] text-secondary">{item.folio}</div>
              </td>
              <td className="px-base py-sm align-top">
                <div className="font-semibold text-primary">{item.vehiclePlate}</div>
                <div className="text-[11px] text-outline">{item.vehicleType}</div>
              </td>
              <td className="px-base py-sm align-top">{item.category}</td>
              <td className="px-base py-sm align-top">
                <p className="line-clamp-3 max-w-[280px]">{item.finding || "—"}</p>
                {item.evidenceUrl ? (
                  <a
                    href={item.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary underline"
                  >
                    <MaterialIcon name="attach_file" className="text-[14px]" />
                    Evidencia
                  </a>
                ) : null}
              </td>
              <td className="px-base py-sm align-top">
                <PreopStatusBadge status={item.status} />
              </td>
              <td className="px-gutter py-sm text-right align-top">
                <div className="inline-flex gap-1">
                  <button
                    type="button"
                    className="rounded-lg bg-surface-container p-1.5"
                    onClick={() => onEdit(item)}
                  >
                    <MaterialIcon name="edit" className="text-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-error-container p-1.5 text-on-error-container"
                    disabled={pending}
                    onClick={() => onDelete(item.id)}
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-md py-lg text-center text-on-surface-variant">
                No hay preoperacionales con los filtros actuales.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function DriverFormModal({
  draft,
  workers,
  vehicles,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstPesvDriverDraft;
  workers: SstWorker[];
  vehicles: SstPesvVehicle[];
  pending: boolean;
  onChange: (draft: SstPesvDriverDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <ModalShell
      title={draft.id ? "Editar conductor PESV" : "Registrar conductor"}
      pending={pending}
      onClose={onClose}
      onSave={onSave}
    >
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
        <span className="font-label-sm text-label-sm">Vehículo asignado</span>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-sm"
          value={draft.vehicleId ?? ""}
          onChange={(event) => {
            const vehicle = vehicles.find((v) => v.id === event.target.value);
            onChange({
              ...draft,
              vehicleId: event.target.value || null,
              plateSnapshot: vehicle?.plate ?? draft.plateSnapshot,
              vehicleType: vehicle?.vehicleType ?? draft.vehicleType,
            });
          }}
        >
          <option value="">Sin vehículo</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plate} · {vehicle.vehicleType}
            </option>
          ))}
        </select>
      </label>
      <Field
        label="Tipo vehículo (snapshot)"
        value={draft.vehicleType}
        onChange={(value) => onChange({ ...draft, vehicleType: value })}
      />
      <Field
        label="Placa (snapshot)"
        value={draft.plateSnapshot}
        onChange={(value) => onChange({ ...draft, plateSnapshot: value })}
      />
      <Field
        label="Categoría licencia"
        value={draft.licenseCategory}
        onChange={(value) => onChange({ ...draft, licenseCategory: value })}
      />
      <DateField
        label="Vencimiento licencia"
        value={draft.licenseDueDate ?? ""}
        onChange={(value) => onChange({ ...draft, licenseDueDate: value })}
      />
      <DateField
        label="Fecha curso seguridad vial"
        value={draft.roadSafetyCourseDate ?? ""}
        onChange={(value) => onChange({ ...draft, roadSafetyCourseDate: value })}
      />
      <DateField
        label="Vencimiento curso"
        value={draft.roadSafetyCourseDue ?? ""}
        onChange={(value) => onChange({ ...draft, roadSafetyCourseDue: value })}
      />
      <DateField
        label="Examen médico"
        value={draft.medicalExamDate ?? ""}
        onChange={(value) => onChange({ ...draft, medicalExamDate: value })}
      />
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm">Aptitud</span>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-sm"
          value={draft.fitnessConcept}
          onChange={(event) =>
            onChange({
              ...draft,
              fitnessConcept: event.target.value as PesvFitnessConcept,
            })
          }
        >
          {PESV_FITNESS_CONCEPTS.map((concept) => (
            <option key={concept} value={concept}>
              {PESV_FITNESS_LABELS[concept]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm">Forzar suspendido</span>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-sm"
          value={draft.authorizationStatus === "suspendido" ? "suspendido" : "auto"}
          onChange={(event) =>
            onChange({
              ...draft,
              authorizationStatus:
                event.target.value === "suspendido" ? "suspendido" : undefined,
            })
          }
        >
          <option value="auto">Calcular automáticamente</option>
          <option value="suspendido">Suspendido</option>
        </select>
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
    </ModalShell>
  );
}

function VehicleFormModal({
  draft,
  workers,
  farms,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstPesvVehicleDraft;
  workers: SstWorker[];
  farms: SstFarm[];
  pending: boolean;
  onChange: (draft: SstPesvVehicleDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <ModalShell
      title={draft.id ? "Editar vehículo" : "Añadir vehículo"}
      pending={pending}
      onClose={onClose}
      onSave={onSave}
    >
      <Field
        label="Placa"
        value={draft.plate}
        onChange={(value) => onChange({ ...draft, plate: value.toUpperCase() })}
      />
      <Field
        label="Tipo"
        value={draft.vehicleType}
        onChange={(value) => onChange({ ...draft, vehicleType: value })}
      />
      <Field
        label="Marca"
        value={draft.brand}
        onChange={(value) => onChange({ ...draft, brand: value })}
      />
      <Field
        label="Modelo"
        value={draft.model}
        onChange={(value) => onChange({ ...draft, model: value })}
      />
      <label className="flex flex-col gap-xs md:col-span-2">
        <span className="font-label-sm text-label-sm">Responsable</span>
        <WorkerSelect
          workers={workers}
          value={draft.responsibleWorkerId}
          includeRetired
          onChange={(worker) =>
            onChange({ ...draft, responsibleWorkerId: worker?.id ?? null })
          }
        />
      </label>
      <Field
        label="Centro de trabajo"
        value={draft.workCenter}
        onChange={(value) => onChange({ ...draft, workCenter: value })}
      />
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm">Centro de trabajo</span>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-sm"
          value={draft.farmId ?? ""}
          onChange={(event) =>
            onChange({ ...draft, farmId: event.target.value || null })
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
        <span className="font-label-sm text-label-sm">Estado</span>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-sm"
          value={draft.status}
          onChange={(event) =>
            onChange({
              ...draft,
              status: event.target.value as PesvVehicleStatus,
            })
          }
        >
          {PESV_VEHICLE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {PESV_VEHICLE_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
      <DateField
        label="SOAT vence"
        value={draft.soatDueDate ?? ""}
        onChange={(value) => onChange({ ...draft, soatDueDate: value })}
      />
      <DateField
        label="RTM vence"
        value={draft.rtmDueDate ?? ""}
        onChange={(value) => onChange({ ...draft, rtmDueDate: value })}
      />
      <DateField
        label="Póliza vence"
        value={draft.insuranceDueDate ?? ""}
        onChange={(value) => onChange({ ...draft, insuranceDueDate: value })}
      />
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm">Odómetro (km)</span>
        <input
          type="number"
          min={0}
          className="rounded-lg bg-surface-container-low px-sm py-sm"
          value={draft.odometerKm}
          onChange={(event) =>
            onChange({ ...draft, odometerKm: Number(event.target.value) || 0 })
          }
        />
      </label>
      <label className="flex items-center gap-2 pt-6">
        <input
          type="checkbox"
          checked={draft.kitOk}
          onChange={(event) =>
            onChange({ ...draft, kitOk: event.target.checked })
          }
        />
        <span className="font-label-sm text-label-sm">Kit completo</span>
      </label>
      <label className="flex items-center gap-2 pt-6">
        <input
          type="checkbox"
          checked={draft.extinguisherOk}
          onChange={(event) =>
            onChange({ ...draft, extinguisherOk: event.target.checked })
          }
        />
        <span className="font-label-sm text-label-sm">Extintor OK</span>
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
    </ModalShell>
  );
}

function PreopFormModal({
  draft,
  vehicles,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstPesvPreopDraft;
  vehicles: SstPesvVehicle[];
  pending: boolean;
  onChange: (draft: SstPesvPreopDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <ModalShell
      title={draft.id ? "Editar preoperacional" : "Nuevo preoperacional"}
      pending={pending}
      onClose={onClose}
      onSave={onSave}
    >
      <label className="flex flex-col gap-xs md:col-span-2">
        <span className="font-label-sm text-label-sm">Vehículo</span>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-sm"
          value={draft.vehicleId}
          required
          onChange={(event) =>
            onChange({ ...draft, vehicleId: event.target.value })
          }
        >
          <option value="">Seleccionar…</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plate} · {vehicle.brand} {vehicle.model}
            </option>
          ))}
        </select>
      </label>
      <DateField
        label="Fecha inspección"
        value={draft.inspectionDate}
        onChange={(value) => onChange({ ...draft, inspectionDate: value })}
      />
      <Field
        label="Categoría"
        value={draft.category}
        onChange={(value) => onChange({ ...draft, category: value })}
      />
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm">Estado</span>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-sm"
          value={draft.status}
          onChange={(event) =>
            onChange({
              ...draft,
              status: event.target.value as PesvPreopStatus,
            })
          }
        >
          {PESV_PREOP_STATUSES.map((status) => (
            <option key={status} value={status}>
              {PESV_PREOP_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm">Odómetro (opcional)</span>
        <input
          type="number"
          min={0}
          className="rounded-lg bg-surface-container-low px-sm py-sm"
          value={draft.odometerKm ?? ""}
          onChange={(event) =>
            onChange({
              ...draft,
              odometerKm: event.target.value
                ? Number(event.target.value)
                : null,
            })
          }
        />
      </label>
      <Field
        label="URL evidencia"
        value={draft.evidenceUrl}
        onChange={(value) => onChange({ ...draft, evidenceUrl: value })}
      />
      <label className="flex flex-col gap-xs md:col-span-2">
        <span className="font-label-sm text-label-sm">Hallazgo</span>
        <textarea
          className="min-h-24 rounded-lg bg-surface-container-low px-sm py-sm"
          value={draft.finding}
          onChange={(event) =>
            onChange({ ...draft, finding: event.target.value })
          }
        />
      </label>
    </ModalShell>
  );
}

function ModalShell({
  title,
  pending,
  onClose,
  onSave,
  children,
}: Readonly<{
  title: string;
  pending: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <MaterialIcon name="close" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-sm md:grid-cols-2">{children}</div>
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

function DateField({
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
        type="date"
        className="rounded-lg bg-surface-container-low px-sm py-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function AuthBadge({ status }: Readonly<{ status: PesvAuthStatus }>) {
  const styles: Record<PesvAuthStatus, string> = {
    autorizado: "bg-surface-container-high text-primary",
    por_vencer: "bg-secondary-fixed text-on-secondary-fixed",
    no_autorizado: "bg-error-container text-on-error-container",
    suspendido: "bg-tertiary-container text-on-tertiary-container",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-base py-xs text-[11px] font-bold ${styles[status]}`}
    >
      {PESV_AUTH_LABELS[status].toUpperCase()}
    </span>
  );
}

function VehicleStatusBadge({
  status,
}: Readonly<{ status: PesvVehicleStatus }>) {
  const styles: Record<PesvVehicleStatus, string> = {
    apto: "bg-surface-container-high text-primary",
    alerta: "bg-secondary-fixed text-on-secondary-fixed",
    detenido: "bg-error-container text-on-error-container",
  };
  return (
    <span
      className={`inline-flex rounded-full px-base py-xs text-[11px] font-bold ${styles[status]}`}
    >
      {PESV_VEHICLE_STATUS_LABELS[status]}
    </span>
  );
}

function PreopStatusBadge({ status }: Readonly<{ status: PesvPreopStatus }>) {
  const styles: Record<PesvPreopStatus, string> = {
    abierto: "bg-error-container text-on-error-container",
    programado: "bg-secondary-fixed text-on-secondary-fixed",
    cerrado: "bg-surface-container-high text-primary",
    detenido: "bg-tertiary-container text-on-tertiary-container",
  };
  return (
    <span
      className={`inline-flex rounded-full px-base py-xs text-[11px] font-bold ${styles[status]}`}
    >
      {PESV_PREOP_STATUS_LABELS[status]}
    </span>
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
