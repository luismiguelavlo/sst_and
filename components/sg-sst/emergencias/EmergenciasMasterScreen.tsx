"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportBrigadeAction,
  bulkImportDrillsAction,
  bulkImportEquipmentAction,
  deleteBrigadeAction,
  deleteDrillAction,
  deleteEquipmentAction,
  saveBrigadeAction,
  saveDrillAction,
  saveEquipmentAction,
} from "@/lib/sg-sst/emergencias/actions";
import {
  EMERGENCIAS_EXCEL_MAX_ROWS,
  type BrigadeExcelImportRow,
  type DrillExcelImportRow,
  type EquipmentExcelImportRow,
} from "@/lib/sg-sst/emergencias/excel";
import {
  downloadEmergenciasTemplate,
  downloadEmergenciasWorkbook,
  parseBrigadeExcelFile,
  parseDrillExcelFile,
  parseEquipmentExcelFile,
} from "@/lib/sg-sst/emergencias/excel-client";
import {
  BRIGADE_MANUAL_STATUSES,
  BRIGADE_STATUS_LABELS,
  BRIGADE_TYPE_LABELS,
  BRIGADE_TYPES,
  DRILL_STATUS_LABELS,
  DRILL_STATUSES,
  DRILL_TYPE_LABELS,
  DRILL_TYPES,
  EQUIPMENT_MANUAL_STATUSES,
  EQUIPMENT_STATUS_LABELS,
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_TYPES,
  deriveBrigadeStatus,
  deriveEquipmentStatus,
  draftFromBrigade,
  draftFromDrill,
  draftFromEquipment,
  emptyBrigadeDraft,
  emptyDrillDraft,
  emptyEquipmentDraft,
  type BrigadeManualStatus,
  type BrigadeStatus,
  type BrigadeType,
  type DrillStatus,
  type DrillType,
  type EmergenciasStats,
  type EquipmentManualStatus,
  type EquipmentStatus,
  type EquipmentType,
  type SstBrigadeMemberDraft,
  type SstBrigadeMemberView,
  type SstEmergencyDrill,
  type SstEmergencyDrillDraft,
  type SstEmergencyEquipmentDraft,
  type SstEmergencyEquipmentView,
} from "@/lib/sg-sst/emergencias/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type TabId = "brigada" | "equipos" | "simulacros";
type ImportKind = "brigada" | "equipos" | "simulacros";

type EmergenciasMasterScreenProps = {
  brigade: SstBrigadeMemberView[];
  equipment: SstEmergencyEquipmentView[];
  drills: SstEmergencyDrill[];
  stats: EmergenciasStats;
  farms: SstFarm[];
  workers: SstWorker[];
};

const BRIGADE_CHIP: Record<BrigadeStatus, string> = {
  vigente: "bg-surface-container-high text-primary",
  proximo: "bg-secondary-fixed text-on-secondary-fixed",
  vencido: "bg-error-container text-on-error-container",
  inactivo: "bg-surface-container text-on-surface-variant",
};

const EQUIPMENT_CHIP: Record<EquipmentStatus, string> = {
  operativo: "bg-surface-container-high text-primary",
  requiere_mantenimiento: "bg-secondary-fixed text-on-secondary-fixed",
  vencido_inspeccion: "bg-error-container text-on-error-container",
  fuera_servicio: "bg-surface-container text-on-surface-variant",
};

const DRILL_CHIP: Record<DrillStatus, string> = {
  programado: "bg-primary-fixed text-on-primary-fixed",
  realizado: "bg-surface-container-high text-primary",
  cancelado: "bg-surface-container text-on-surface-variant",
};

export function EmergenciasMasterScreen({
  brigade,
  equipment,
  drills,
  stats,
  farms,
  workers,
}: Readonly<EmergenciasMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const brigadeInputRef = useRef<HTMLInputElement>(null);
  const equipmentInputRef = useRef<HTMLInputElement>(null);
  const drillInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<TabId>("brigada");
  const [query, setQuery] = useState("");
  const [brigadeTypeFilter, setBrigadeTypeFilter] = useState<
    BrigadeType | "all"
  >("all");
  const [brigadeStatusFilter, setBrigadeStatusFilter] = useState<
    BrigadeStatus | "all"
  >("all");
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState<
    EquipmentType | "all"
  >("all");
  const [equipmentStatusFilter, setEquipmentStatusFilter] = useState<
    EquipmentStatus | "all"
  >("all");
  const [drillTypeFilter, setDrillTypeFilter] = useState<DrillType | "all">(
    "all",
  );
  const [drillStatusFilter, setDrillStatusFilter] = useState<
    DrillStatus | "all"
  >("all");
  const [farmId, setFarmId] = useState("all");

  const [editingBrigade, setEditingBrigade] =
    useState<SstBrigadeMemberDraft | null>(null);
  const [editingEquipment, setEditingEquipment] =
    useState<SstEmergencyEquipmentDraft | null>(null);
  const [editingDrill, setEditingDrill] =
    useState<SstEmergencyDrillDraft | null>(null);

  const [importKind, setImportKind] = useState<ImportKind>("brigada");
  const [brigadePreview, setBrigadePreview] = useState<BrigadeExcelImportRow[]>(
    [],
  );
  const [equipmentPreview, setEquipmentPreview] = useState<
    EquipmentExcelImportRow[]
  >([]);
  const [drillPreview, setDrillPreview] = useState<DrillExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");

  const filteredBrigade = useMemo(() => {
    const q = query.trim().toLowerCase();
    return brigade.filter((item) => {
      if (brigadeTypeFilter !== "all" && item.brigadeType !== brigadeTypeFilter) {
        return false;
      }
      if (
        brigadeStatusFilter !== "all" &&
        item.effectiveStatus !== brigadeStatusFilter
      ) {
        return false;
      }
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.folio.toLowerCase().includes(q) ||
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.workerCode.toLowerCase().includes(q) ||
        item.trainingTitle.toLowerCase().includes(q) ||
        BRIGADE_TYPE_LABELS[item.brigadeType].toLowerCase().includes(q)
      );
    });
  }, [brigade, brigadeTypeFilter, brigadeStatusFilter, farmId, query]);

  const filteredEquipment = useMemo(() => {
    const q = query.trim().toLowerCase();
    return equipment.filter((item) => {
      if (
        equipmentTypeFilter !== "all" &&
        item.equipmentType !== equipmentTypeFilter
      ) {
        return false;
      }
      if (
        equipmentStatusFilter !== "all" &&
        item.effectiveStatus !== equipmentStatusFilter
      ) {
        return false;
      }
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.elementName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.responsibleName.toLowerCase().includes(q) ||
        EQUIPMENT_TYPE_LABELS[item.equipmentType].toLowerCase().includes(q)
      );
    });
  }, [equipment, equipmentTypeFilter, equipmentStatusFilter, farmId, query]);

  const filteredDrills = useMemo(() => {
    const q = query.trim().toLowerCase();
    return drills.filter((item) => {
      if (drillTypeFilter !== "all" && item.drillType !== drillTypeFilter) {
        return false;
      }
      if (drillStatusFilter !== "all" && item.status !== drillStatusFilter) {
        return false;
      }
      if (farmId !== "all" && item.farmId !== farmId) return false;
      if (!q) return true;
      return (
        item.folio.toLowerCase().includes(q) ||
        item.place.toLowerCase().includes(q) ||
        item.resultLabel.toLowerCase().includes(q) ||
        item.findings.toLowerCase().includes(q) ||
        DRILL_TYPE_LABELS[item.drillType].toLowerCase().includes(q)
      );
    });
  }, [drills, drillTypeFilter, drillStatusFilter, farmId, query]);

  function handleExport() {
    downloadEmergenciasWorkbook({
      brigade: filteredBrigade,
      equipment: filteredEquipment,
      drills: filteredDrills,
      fileName: `emergencias-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    });
    showToast("Exportado libro Emergencias (Brigada / Equipos / Simulacros).");
  }

  async function handleImportFile(
    event: React.ChangeEvent<HTMLInputElement>,
    kind: ImportKind,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (kind === "brigada") {
        const rows = await parseBrigadeExcelFile(file);
        if (rows.length === 0) {
          showToast("El archivo no tiene filas.", { variant: "error" });
          return;
        }
        if (rows.length > EMERGENCIAS_EXCEL_MAX_ROWS) {
          showToast(`Máximo ${EMERGENCIAS_EXCEL_MAX_ROWS} filas.`, {
            variant: "error",
          });
          return;
        }
        setImportKind("brigada");
        setBrigadePreview(rows);
        setEquipmentPreview([]);
        setDrillPreview([]);
      } else if (kind === "equipos") {
        const rows = await parseEquipmentExcelFile(file);
        if (rows.length === 0) {
          showToast("El archivo no tiene filas.", { variant: "error" });
          return;
        }
        if (rows.length > EMERGENCIAS_EXCEL_MAX_ROWS) {
          showToast(`Máximo ${EMERGENCIAS_EXCEL_MAX_ROWS} filas.`, {
            variant: "error",
          });
          return;
        }
        setImportKind("equipos");
        setEquipmentPreview(rows);
        setBrigadePreview([]);
        setDrillPreview([]);
      } else {
        const rows = await parseDrillExcelFile(file);
        if (rows.length === 0) {
          showToast("El archivo no tiene filas.", { variant: "error" });
          return;
        }
        if (rows.length > EMERGENCIAS_EXCEL_MAX_ROWS) {
          showToast(`Máximo ${EMERGENCIAS_EXCEL_MAX_ROWS} filas.`, {
            variant: "error",
          });
          return;
        }
        setImportKind("simulacros");
        setDrillPreview(rows);
        setBrigadePreview([]);
        setEquipmentPreview([]);
      }
      setFileName(file.name);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "No se pudo leer el Excel.",
        { variant: "error" },
      );
    } finally {
      event.target.value = "";
    }
  }

  function clearPreview() {
    setBrigadePreview([]);
    setEquipmentPreview([]);
    setDrillPreview([]);
    setFileName("");
  }

  function confirmImport() {
    startTransition(async () => {
      const result =
        importKind === "brigada"
          ? await bulkImportBrigadeAction({ rows: brigadePreview })
          : importKind === "equipos"
            ? await bulkImportEquipmentAction({ rows: equipmentPreview })
            : await bulkImportDrillsAction({ rows: drillPreview });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        `Importación: ${result.created} creados, ${result.updated} actualizados, ${result.failed} con error.`,
        { variant: result.failed > 0 ? "info" : "success" },
      );
      clearPreview();
      router.refresh();
    });
  }

  function saveBrigade() {
    if (!editingBrigade) return;
    startTransition(async () => {
      const result = await saveBrigadeAction(editingBrigade);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        editingBrigade.id ? "Brigadista actualizado." : "Brigadista registrado.",
      );
      setEditingBrigade(null);
      router.refresh();
    });
  }

  function saveEquipment() {
    if (!editingEquipment) return;
    startTransition(async () => {
      const result = await saveEquipmentAction(editingEquipment);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        editingEquipment.id ? "Equipo actualizado." : "Equipo registrado.",
      );
      setEditingEquipment(null);
      router.refresh();
    });
  }

  function saveDrill() {
    if (!editingDrill) return;
    startTransition(async () => {
      const result = await saveDrillAction(editingDrill);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        editingDrill.id ? "Simulacro actualizado." : "Simulacro registrado.",
      );
      setEditingDrill(null);
      router.refresh();
    });
  }

  function removeBrigade(id: string) {
    if (!window.confirm("¿Eliminar este brigadista?")) return;
    startTransition(async () => {
      const result = await deleteBrigadeAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Brigadista eliminado.");
      router.refresh();
    });
  }

  function removeEquipment(id: string) {
    if (!window.confirm("¿Eliminar este equipo de emergencia?")) return;
    startTransition(async () => {
      const result = await deleteEquipmentAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Equipo eliminado.");
      router.refresh();
    });
  }

  function removeDrill(id: string) {
    if (!window.confirm("¿Eliminar este simulacro?")) return;
    startTransition(async () => {
      const result = await deleteDrillAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Simulacro eliminado.");
      router.refresh();
    });
  }

  const previewCount =
    importKind === "brigada"
      ? brigadePreview.length
      : importKind === "equipos"
        ? equipmentPreview.length
        : drillPreview.length;

  function openCreateForTab() {
    if (tab === "brigada") setEditingBrigade(emptyBrigadeDraft());
    else if (tab === "equipos") setEditingEquipment(emptyEquipmentDraft());
    else setEditingDrill(emptyDrillDraft());
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md rounded-xl bg-surface-container-low p-gutter shadow-sm lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-base py-xs font-label-sm text-label-sm uppercase tracking-wide text-on-primary">
              Plan de emergencias
            </span>
            <span className="rounded-full bg-surface-container-highest px-base py-xs font-label-sm text-label-sm text-on-surface-variant">
              Dec. 1072 / PPRE
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Emergencias SG-SST
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Brigada de emergencia, matriz de equipos e historial de simulacros con
            sincronización a alertas de cumplimiento.
          </p>
        </div>
        <div className="flex flex-wrap gap-xs">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-surface-container-lowest px-sm py-2 font-label-md text-label-md text-primary shadow-sm"
            onClick={() => downloadEmergenciasTemplate()}
          >
            <MaterialIcon name="download" className="text-[18px]" />
            Plantilla
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-surface-container-lowest px-sm py-2 font-label-md text-label-md text-primary shadow-sm"
            onClick={handleExport}
          >
            <MaterialIcon name="file_export" className="text-[18px]" />
            Exportar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-sm py-2 font-label-md text-label-md"
            onClick={() => {
              if (tab === "brigada") brigadeInputRef.current?.click();
              else if (tab === "equipos") equipmentInputRef.current?.click();
              else drillInputRef.current?.click();
            }}
          >
            <MaterialIcon name="upload_file" className="text-[18px]" />
            Importar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-sm py-2 font-label-md text-label-md font-semibold text-on-primary"
            onClick={openCreateForTab}
          >
            <MaterialIcon name="add" className="text-[18px]" />
            {tab === "brigada"
              ? "Nuevo brigadista"
              : tab === "equipos"
                ? "Nuevo equipo"
                : "Nuevo simulacro"}
          </button>
          <input
            ref={brigadeInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(event) => handleImportFile(event, "brigada")}
          />
          <input
            ref={equipmentInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(event) => handleImportFile(event, "equipos")}
          />
          <input
            ref={drillInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(event) => handleImportFile(event, "simulacros")}
          />
        </div>
      </header>

      <section className="grid grid-cols-1 gap-sm sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <Kpi
          label="Brigadistas vigentes"
          value={stats.brigadistasVigentes}
          detail={`/ ${stats.brigadeTotal} registrados`}
          icon="badge"
        />
        <Kpi
          label="Formaciones vencidas"
          value={stats.formacionesVencidas}
          detail="Reentrenamiento pendiente"
          icon="event_busy"
          accent="text-error"
        />
        <Kpi
          label="Formaciones próximas"
          value={stats.formacionesProximas}
          detail="≤ 30 días"
          icon="schedule"
          accent="text-secondary"
        />
        <Kpi
          label="Equipos por inspeccionar"
          value={stats.equiposPorInspeccionar}
          detail="Próximos 30 días"
          icon="medical_services"
        />
        <Kpi
          label="Equipos vencidos"
          value={stats.equiposVencidos}
          detail="Inspección vencida"
          icon="warning"
          accent="text-error"
        />
        <Kpi
          label="Simulacros del año"
          value={stats.simulacrosDelAnio}
          detail={`${stats.drillsTotal} históricos`}
          icon="crisis_alert"
        />
      </section>

      {previewCount > 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <div className="font-label-md text-label-md font-bold">
                Vista previa ({importKind}): {fileName}
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {previewCount} filas listas para importar.
              </div>
            </div>
            <div className="flex gap-xs">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-base py-sm"
                onClick={clearPreview}
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

      <div className="flex gap-xs overflow-x-auto rounded-xl bg-surface-container-low p-xs">
        {(
          [
            {
              id: "brigada" as const,
              label: "Brigada",
              icon: "badge",
              count: brigade.length,
            },
            {
              id: "equipos" as const,
              label: "Equipos",
              icon: "medical_services",
              count: equipment.length,
            },
            {
              id: "simulacros" as const,
              label: "Simulacros",
              icon: "crisis_alert",
              count: drills.length,
            },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-md py-xs font-label-md text-label-md whitespace-nowrap transition-all ${
              tab === item.id
                ? "bg-primary-container text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
            onClick={() => setTab(item.id)}
          >
            <MaterialIcon name={item.icon} className="text-[18px]" />
            {item.label}
            <span className="rounded bg-surface-container-lowest/40 px-1.5 text-[11px]">
              {item.count}
            </span>
          </button>
        ))}
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
              tab === "brigada"
                ? "Buscar brigadista, folio o formación…"
                : tab === "equipos"
                  ? "Buscar código, elemento o ubicación…"
                  : "Buscar folio, lugar o hallazgos…"
            }
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-xs">
          <select
            className="rounded-lg bg-surface-container-low px-sm py-xs font-label-sm text-label-sm"
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
          {tab === "brigada" ? (
            <>
              <select
                className="rounded-lg bg-surface-container-low px-sm py-xs font-label-sm text-label-sm"
                value={brigadeTypeFilter}
                onChange={(event) =>
                  setBrigadeTypeFilter(event.target.value as BrigadeType | "all")
                }
              >
                <option value="all">Todas las ramas</option>
                {BRIGADE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {BRIGADE_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              <select
                className="rounded-lg bg-surface-container-low px-sm py-xs font-label-sm text-label-sm"
                value={brigadeStatusFilter}
                onChange={(event) =>
                  setBrigadeStatusFilter(
                    event.target.value as BrigadeStatus | "all",
                  )
                }
              >
                <option value="all">Todos los estados</option>
                {(Object.keys(BRIGADE_STATUS_LABELS) as BrigadeStatus[]).map(
                  (status) => (
                    <option key={status} value={status}>
                      {BRIGADE_STATUS_LABELS[status]}
                    </option>
                  ),
                )}
              </select>
            </>
          ) : null}
          {tab === "equipos" ? (
            <>
              <select
                className="rounded-lg bg-surface-container-low px-sm py-xs font-label-sm text-label-sm"
                value={equipmentTypeFilter}
                onChange={(event) =>
                  setEquipmentTypeFilter(
                    event.target.value as EquipmentType | "all",
                  )
                }
              >
                <option value="all">Todos los tipos</option>
                {EQUIPMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {EQUIPMENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              <select
                className="rounded-lg bg-surface-container-low px-sm py-xs font-label-sm text-label-sm"
                value={equipmentStatusFilter}
                onChange={(event) =>
                  setEquipmentStatusFilter(
                    event.target.value as EquipmentStatus | "all",
                  )
                }
              >
                <option value="all">Todos los estados</option>
                {(Object.keys(EQUIPMENT_STATUS_LABELS) as EquipmentStatus[]).map(
                  (status) => (
                    <option key={status} value={status}>
                      {EQUIPMENT_STATUS_LABELS[status]}
                    </option>
                  ),
                )}
              </select>
            </>
          ) : null}
          {tab === "simulacros" ? (
            <>
              <select
                className="rounded-lg bg-surface-container-low px-sm py-xs font-label-sm text-label-sm"
                value={drillTypeFilter}
                onChange={(event) =>
                  setDrillTypeFilter(event.target.value as DrillType | "all")
                }
              >
                <option value="all">Todos los tipos</option>
                {DRILL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {DRILL_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              <select
                className="rounded-lg bg-surface-container-low px-sm py-xs font-label-sm text-label-sm"
                value={drillStatusFilter}
                onChange={(event) =>
                  setDrillStatusFilter(event.target.value as DrillStatus | "all")
                }
              >
                <option value="all">Todos los estados</option>
                {DRILL_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {DRILL_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </>
          ) : null}
        </div>
      </div>

      {tab === "brigada" ? (
        <BrigadeTable
          items={filteredBrigade}
          pending={pending}
          onEdit={(item) => setEditingBrigade(draftFromBrigade(item))}
          onDelete={removeBrigade}
        />
      ) : null}
      {tab === "equipos" ? (
        <EquipmentTable
          items={filteredEquipment}
          pending={pending}
          onEdit={(item) => setEditingEquipment(draftFromEquipment(item))}
          onDelete={removeEquipment}
        />
      ) : null}
      {tab === "simulacros" ? (
        <DrillTable
          items={filteredDrills}
          pending={pending}
          onEdit={(item) => setEditingDrill(draftFromDrill(item))}
          onDelete={removeDrill}
        />
      ) : null}

      {editingBrigade ? (
        <BrigadeFormModal
          draft={editingBrigade}
          workers={workers}
          farms={farms}
          pending={pending}
          onChange={setEditingBrigade}
          onClose={() => setEditingBrigade(null)}
          onSave={saveBrigade}
        />
      ) : null}
      {editingEquipment ? (
        <EquipmentFormModal
          draft={editingEquipment}
          farms={farms}
          pending={pending}
          onChange={setEditingEquipment}
          onClose={() => setEditingEquipment(null)}
          onSave={saveEquipment}
        />
      ) : null}
      {editingDrill ? (
        <DrillFormModal
          draft={editingDrill}
          farms={farms}
          pending={pending}
          onChange={setEditingDrill}
          onClose={() => setEditingDrill(null)}
          onSave={saveDrill}
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
      <div className={`font-headline-md text-headline-md font-bold ${accent}`}>
        {value}
      </div>
      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
        {detail}
      </p>
    </div>
  );
}

function BrigadeTable({
  items,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  items: SstBrigadeMemberView[];
  pending: boolean;
  onEdit: (item: SstBrigadeMemberView) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-sm text-body-sm">
          <thead className="bg-surface-container-high font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
            <tr>
              <th className="px-md py-sm">Folio / Brigadista</th>
              <th className="px-md py-sm">Rama</th>
              <th className="px-md py-sm">Formación</th>
              <th className="px-md py-sm">Vencimiento</th>
              <th className="px-md py-sm">Estado</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-surface-container-low/60 transition-colors"
              >
                <td className="px-md py-sm">
                  <div className="font-semibold text-on-surface">
                    {item.workerName}
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">
                    {item.folio} · C.C. {item.workerDocument}
                  </div>
                </td>
                <td className="px-md py-sm">
                  {BRIGADE_TYPE_LABELS[item.brigadeType]}
                </td>
                <td className="px-md py-sm">
                  <div>{item.trainingTitle || "—"}</div>
                  <div className="text-[11px] text-on-surface-variant">
                    Capacitado: {item.trainedAt}
                  </div>
                </td>
                <td className="px-md py-sm">
                  <div>{item.dueDate}</div>
                  <div className="text-[11px] text-on-surface-variant">
                    {item.daysRemaining === null
                      ? ""
                      : item.daysRemaining < 0
                        ? `${Math.abs(item.daysRemaining)} días vencido`
                        : `${item.daysRemaining} días`}
                  </div>
                </td>
                <td className="px-md py-sm">
                  <span
                    className={`inline-flex rounded px-xs py-0.5 font-label-sm text-label-sm font-semibold ${BRIGADE_CHIP[item.effectiveStatus]}`}
                  >
                    {BRIGADE_STATUS_LABELS[item.effectiveStatus]}
                  </span>
                </td>
                <td className="px-md py-sm text-right">
                  <button
                    type="button"
                    className="mr-1 rounded p-1 text-on-surface-variant hover:bg-surface-container hover:text-primary"
                    onClick={() => onEdit(item)}
                    disabled={pending}
                    aria-label="Editar"
                  >
                    <MaterialIcon name="edit" className="text-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                    onClick={() => onDelete(item.id)}
                    disabled={pending}
                    aria-label="Eliminar"
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-md py-lg text-center text-on-surface-variant"
                >
                  No hay brigadistas con los filtros actuales.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EquipmentTable({
  items,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  items: SstEmergencyEquipmentView[];
  pending: boolean;
  onEdit: (item: SstEmergencyEquipmentView) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-sm text-body-sm">
          <thead className="bg-surface-container-high font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
            <tr>
              <th className="px-md py-sm">Código / Elemento</th>
              <th className="px-md py-sm">Tipo</th>
              <th className="px-md py-sm">Ubicación</th>
              <th className="px-md py-sm">Próxima inspección</th>
              <th className="px-md py-sm">Estado</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-surface-container-low/60 transition-colors"
              >
                <td className="px-md py-sm">
                  <div className="font-semibold text-on-surface">
                    {item.elementName}
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">
                    {item.code} · {item.responsibleName || "Sin responsable"}
                  </div>
                </td>
                <td className="px-md py-sm">
                  {EQUIPMENT_TYPE_LABELS[item.equipmentType]}
                </td>
                <td className="px-md py-sm">{item.location || "—"}</td>
                <td className="px-md py-sm">
                  <div>{item.nextInspectionAt}</div>
                  <div className="text-[11px] text-on-surface-variant">
                    {item.inspectedAt
                      ? `Última: ${item.inspectedAt}`
                      : "Sin inspección previa"}
                  </div>
                </td>
                <td className="px-md py-sm">
                  <span
                    className={`inline-flex rounded px-xs py-0.5 font-label-sm text-label-sm font-semibold ${EQUIPMENT_CHIP[item.effectiveStatus]}`}
                  >
                    {EQUIPMENT_STATUS_LABELS[item.effectiveStatus]}
                  </span>
                </td>
                <td className="px-md py-sm text-right">
                  <button
                    type="button"
                    className="mr-1 rounded p-1 text-on-surface-variant hover:bg-surface-container hover:text-primary"
                    onClick={() => onEdit(item)}
                    disabled={pending}
                    aria-label="Editar"
                  >
                    <MaterialIcon name="edit" className="text-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                    onClick={() => onDelete(item.id)}
                    disabled={pending}
                    aria-label="Eliminar"
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-md py-lg text-center text-on-surface-variant"
                >
                  No hay equipos con los filtros actuales.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DrillTable({
  items,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  items: SstEmergencyDrill[];
  pending: boolean;
  onEdit: (item: SstEmergencyDrill) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-sm text-body-sm">
          <thead className="bg-surface-container-high font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
            <tr>
              <th className="px-md py-sm">Folio / Fecha</th>
              <th className="px-md py-sm">Tipo</th>
              <th className="px-md py-sm">Lugar</th>
              <th className="px-md py-sm">Resultado</th>
              <th className="px-md py-sm">Estado</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-surface-container-low/60 transition-colors"
              >
                <td className="px-md py-sm">
                  <div className="font-semibold text-on-surface">{item.folio}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">
                    {item.drillDate} · {item.participantsCount} participantes
                  </div>
                </td>
                <td className="px-md py-sm">
                  {DRILL_TYPE_LABELS[item.drillType]}
                </td>
                <td className="px-md py-sm">{item.place}</td>
                <td className="px-md py-sm">
                  <div>{item.resultLabel || "—"}</div>
                  <div className="text-[11px] text-on-surface-variant">
                    {item.resultScore != null
                      ? `Calificación: ${item.resultScore}`
                      : ""}
                  </div>
                </td>
                <td className="px-md py-sm">
                  <span
                    className={`inline-flex rounded px-xs py-0.5 font-label-sm text-label-sm font-semibold ${DRILL_CHIP[item.status]}`}
                  >
                    {DRILL_STATUS_LABELS[item.status]}
                  </span>
                </td>
                <td className="px-md py-sm text-right">
                  <button
                    type="button"
                    className="mr-1 rounded p-1 text-on-surface-variant hover:bg-surface-container hover:text-primary"
                    onClick={() => onEdit(item)}
                    disabled={pending}
                    aria-label="Editar"
                  >
                    <MaterialIcon name="edit" className="text-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                    onClick={() => onDelete(item.id)}
                    disabled={pending}
                    aria-label="Eliminar"
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-md py-lg text-center text-on-surface-variant"
                >
                  No hay simulacros con los filtros actuales.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BrigadeFormModal({
  draft,
  workers,
  farms,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstBrigadeMemberDraft;
  workers: SstWorker[];
  farms: SstFarm[];
  pending: boolean;
  onChange: (draft: SstBrigadeMemberDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  const preview = deriveBrigadeStatus(draft.status, draft.dueDate);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between gap-sm">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {draft.id ? "Editar brigadista" : "Registrar brigadista"}
            </h2>
            <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
              Estado calculado:{" "}
              <span className="font-semibold text-primary">
                {BRIGADE_STATUS_LABELS[preview]}
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
                onChange({
                  ...draft,
                  workerId: worker?.id ?? "",
                  companySnapshot: worker?.company ?? draft.companySnapshot,
                  jobTitleSnapshot: worker?.jobTitle ?? draft.jobTitleSnapshot,
                  farmId: worker?.farmId ?? draft.farmId,
                })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Rama / tipo</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.brigadeType}
              onChange={(event) =>
                onChange({
                  ...draft,
                  brigadeType: event.target.value as BrigadeType,
                })
              }
            >
              {BRIGADE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {BRIGADE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Estado manual</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.status ?? "vigente"}
              onChange={(event) =>
                onChange({
                  ...draft,
                  status: event.target.value as BrigadeManualStatus,
                })
              }
            >
              {BRIGADE_MANUAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status === "vigente"
                    ? "Activo (deriva vigencia)"
                    : BRIGADE_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Formación</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.trainingTitle}
              onChange={(event) =>
                onChange({ ...draft, trainingTitle: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha formación</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.trainedAt}
              onChange={(event) =>
                onChange({ ...draft, trainedAt: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Vencimiento</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.dueDate}
              onChange={(event) =>
                onChange({ ...draft, dueDate: event.target.value })
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
              <option value="">Sin finca</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
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
        <div className="mt-md flex justify-end gap-xs">
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

function EquipmentFormModal({
  draft,
  farms,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstEmergencyEquipmentDraft;
  farms: SstFarm[];
  pending: boolean;
  onChange: (draft: SstEmergencyEquipmentDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  const preview = deriveEquipmentStatus(draft.status, draft.nextInspectionAt);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between gap-sm">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {draft.id ? "Editar equipo" : "Registrar equipo"}
            </h2>
            <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
              Estado calculado:{" "}
              <span className="font-semibold text-primary">
                {EQUIPMENT_STATUS_LABELS[preview]}
              </span>
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <MaterialIcon name="close" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">
              Código {draft.id ? "" : "(vacío = automático)"}
            </span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.code ?? ""}
              placeholder="EQ-EM-YYYY-NNN"
              onChange={(event) =>
                onChange({ ...draft, code: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Tipo</span>
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
          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Elemento</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.elementName}
              onChange={(event) =>
                onChange({ ...draft, elementName: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Ubicación</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.location}
              onChange={(event) =>
                onChange({ ...draft, location: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
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
            <span className="font-label-sm text-label-sm">Inspeccionado</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.inspectedAt ?? ""}
              onChange={(event) =>
                onChange({ ...draft, inspectedAt: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Próxima inspección</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.nextInspectionAt}
              onChange={(event) =>
                onChange({ ...draft, nextInspectionAt: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Estado</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.status}
              onChange={(event) =>
                onChange({
                  ...draft,
                  status: event.target.value as EquipmentManualStatus,
                })
              }
            >
              {EQUIPMENT_MANUAL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {EQUIPMENT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
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
              <option value="">Sin finca</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Hallazgos</span>
            <textarea
              className="min-h-16 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.findings}
              onChange={(event) =>
                onChange({ ...draft, findings: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Observaciones</span>
            <textarea
              className="min-h-16 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.observations}
              onChange={(event) =>
                onChange({ ...draft, observations: event.target.value })
              }
            />
          </label>
        </div>
        <div className="mt-md flex justify-end gap-xs">
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

function DrillFormModal({
  draft,
  farms,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstEmergencyDrillDraft;
  farms: SstFarm[];
  pending: boolean;
  onChange: (draft: SstEmergencyDrillDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between gap-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Editar simulacro" : "Registrar simulacro"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <MaterialIcon name="close" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.drillDate}
              onChange={(event) =>
                onChange({ ...draft, drillDate: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Tipo</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.drillType}
              onChange={(event) =>
                onChange({
                  ...draft,
                  drillType: event.target.value as DrillType,
                })
              }
            >
              {DRILL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {DRILL_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Lugar</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.place}
              onChange={(event) =>
                onChange({ ...draft, place: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Participantes</span>
            <input
              type="number"
              min={0}
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.participantsCount}
              onChange={(event) =>
                onChange({
                  ...draft,
                  participantsCount: Number(event.target.value) || 0,
                })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Estado</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.status}
              onChange={(event) =>
                onChange({
                  ...draft,
                  status: event.target.value as DrillStatus,
                })
              }
            >
              {DRILL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {DRILL_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Calificación</span>
            <input
              type="number"
              min={0}
              max={100}
              step={0.01}
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.resultScore ?? ""}
              onChange={(event) =>
                onChange({
                  ...draft,
                  resultScore: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Resultado</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.resultLabel}
              onChange={(event) =>
                onChange({ ...draft, resultLabel: event.target.value })
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
              <option value="">Sin finca</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
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
          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Hallazgos</span>
            <textarea
              className="min-h-16 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.findings}
              onChange={(event) =>
                onChange({ ...draft, findings: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Acciones</span>
            <textarea
              className="min-h-16 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.actions}
              onChange={(event) =>
                onChange({ ...draft, actions: event.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Observaciones</span>
            <textarea
              className="min-h-16 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.observations}
              onChange={(event) =>
                onChange({ ...draft, observations: event.target.value })
              }
            />
          </label>
        </div>
        <div className="mt-md flex justify-end gap-xs">
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
