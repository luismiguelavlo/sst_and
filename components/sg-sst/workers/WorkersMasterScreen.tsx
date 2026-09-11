"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import { bulkImportWorkersAction } from "@/lib/sg-sst/workers/actions";
import {
  downloadWorkersExcel,
  downloadWorkersTemplate,
  parseWorkersExcelFile,
} from "@/lib/sg-sst/workers/excel-client";
import { WORKER_EXCEL_MAX_ROWS, type WorkerExcelImportRow } from "@/lib/sg-sst/workers/excel";
import type { SstWorker, WorkerStats } from "@/lib/sg-sst/workers/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type WorkersMasterScreenProps = {
  workers: SstWorker[];
  stats: WorkerStats;
  farms: SstFarm[];
};

export function WorkersMasterScreen({
  workers,
  stats,
  farms,
}: Readonly<WorkersMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "activo" | "retirado">("activo");
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<WorkerExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workers.filter((worker) => {
      if (statusFilter !== "all" && worker.status !== statusFilter) return false;
      if (farmId !== "all" && worker.farmId !== farmId) return false;
      if (!q) return true;
      return (
        worker.fullName.toLowerCase().includes(q) ||
        worker.documentNumber.toLowerCase().includes(q) ||
        worker.workerCode.toLowerCase().includes(q) ||
        worker.jobTitle.toLowerCase().includes(q) ||
        (worker.farmName ?? "").toLowerCase().includes(q)
      );
    });
  }, [workers, statusFilter, farmId, query]);

  function handleExport() {
    downloadWorkersExcel(
      filtered,
      `base-maestra-trabajadores-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} trabajadores.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseWorkersExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > WORKER_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${WORKER_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
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
      const result = await bulkImportWorkersAction({ rows: preview });
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

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="hub" className="text-[16px] text-secondary" />
            <span className="text-secondary font-bold">Sincronizado en tiempo real</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Base Maestra Centralizada de Trabajadores
          </h1>
          <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            Registro unificado de talento humano y habilitaciones operativas. Al crear un trabajador
            queda disponible en listas desplegables de todos los módulos. El retiro conserva el
            historial (custodia documental).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <button
            type="button"
            onClick={() => downloadWorkersTemplate()}
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
            Importar Nómina / Excel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="download" className="text-[18px]" />
            Exportar Maestro (.XLSX)
          </button>
          <Link
            href={`${SGSST_BASE}/trabajadores/nuevo`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm"
          >
            <MaterialIcon name="person_add" className="text-[20px]" />
            Nuevo Trabajador
          </Link>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </header>

      <div className="flex items-start gap-md rounded-xl bg-surface-container-low p-md shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
          <MaterialIcon name="hub" className="text-[24px]" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-md text-label-md font-bold text-primary">
              Centralización y No Duplicidad Operativa
            </span>
            <span className="rounded bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-on-surface-variant">
              Dec. 1072 Custodia 20 Años
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No dupliques nombres en cada módulo: selecciona el trabajador desde esta base maestra.
            Si se retira, su historial médico y de formación se conserva intacto.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi
          label="Censo Total"
          icon="groups"
          value={stats.total}
          detail={
            <>
              <span className="font-bold text-secondary">{stats.active}</span> Activos •{" "}
              <span className="text-outline">{stats.retired}</span> Retirados
            </>
          }
        />
        <Kpi label="Alturas Res. 4272" icon="stairs" value={stats.heights} detail="Habilitados" />
        <Kpi
          label="Maquinaria & PESV"
          icon="directions_car"
          value={stats.driversOrTractor}
          detail="Conductores / Tractoristas"
        />
        <Kpi
          label="Aplicadores Químicos"
          icon="science"
          value={stats.chemicals}
          detail="Manipulan químicos"
        />
        <Kpi label="Brigada" icon="fire_extinguisher" value={stats.brigade} detail="Emergencias" />
        <Kpi
          label="COPASST / CCL"
          icon="groups"
          value={stats.copasst + stats.ccl}
          detail={`${stats.copasst} COPASST · ${stats.ccl} CCL`}
        />
      </section>

      {preview.length > 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <div className="font-label-md text-label-md font-bold">Vista previa: {fileName}</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {preview.length} filas. Documento o ID existente → actualización.
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
          <div className="max-h-40 overflow-auto text-body-sm">
            {preview.slice(0, 6).map((row) => (
              <div key={row.rowNumber} className="border-t border-surface-container py-1">
                Fila {row.rowNumber}: {row.draft.fullName} · {row.draft.documentNumber} ·{" "}
                {row.draft.jobTitle}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-sm shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <MaterialIcon
            name="search"
            className="absolute top-2.5 left-3 text-[20px] text-outline"
          />
          <input
            className="w-full rounded-lg bg-surface-container-low py-2.5 pr-4 pl-10 font-body-sm text-body-sm focus:outline-none"
            placeholder="Buscar por Cédula, Nombre, ID Trabajador, Cargo o Finca..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "all" | "activo" | "retirado")
          }
        >
          <option value="all">Todos ({stats.total})</option>
          <option value="activo">Activos ({stats.active})</option>
          <option value="retirado">Retirados ({stats.retired})</option>
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
                <th className="px-md py-sm">ID / Documento</th>
                <th className="px-sm py-sm">Trabajador</th>
                <th className="px-sm py-sm">Cargo / Área</th>
                <th className="px-sm py-sm">Finca</th>
                <th className="px-sm py-sm">Habilitaciones</th>
                <th className="px-sm py-sm">Estado</th>
                <th className="px-md py-sm text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((worker) => (
                <tr key={worker.id} className="hover:bg-surface-container-low/50">
                  <td className="px-md py-sm whitespace-nowrap">
                    <div className="font-label-md text-label-md font-bold text-primary">
                      {worker.workerCode}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      {worker.documentType} {worker.documentNumber}
                    </div>
                  </td>
                  <td className="px-sm py-sm">
                    <div className="font-semibold text-on-surface">{worker.fullName}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      {worker.phone || worker.email || "Sin contacto"}
                    </div>
                  </td>
                  <td className="px-sm py-sm">
                    <div>{worker.jobTitle}</div>
                    <div className="text-[11px] text-on-surface-variant">{worker.area}</div>
                  </td>
                  <td className="px-sm py-sm">{worker.farmName ?? "—"}</td>
                  <td className="px-sm py-sm">
                    <div className="flex flex-wrap gap-1">
                      {worker.worksHeights ? <Tag>Alturas</Tag> : null}
                      {worker.drives ? <Tag>Conduce</Tag> : null}
                      {worker.operatesTractor ? <Tag>Tractor</Tag> : null}
                      {worker.handlesChemicals ? <Tag>Químicos</Tag> : null}
                      {worker.inBrigade ? <Tag>Brigada</Tag> : null}
                      {worker.inCopasst ? <Tag>COPASST</Tag> : null}
                      {worker.inCcl ? <Tag>CCL</Tag> : null}
                    </div>
                  </td>
                  <td className="px-sm py-sm whitespace-nowrap">
                    {worker.status === "activo" ? (
                      <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-secondary">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-outline">
                        <span className="h-1.5 w-1.5 rounded-full bg-outline" /> Retirado (Custodiado)
                      </span>
                    )}
                  </td>
                  <td className="px-md py-sm text-right">
                    <Link
                      href={`${SGSST_BASE}/trabajadores/${worker.id}`}
                      className="inline-flex rounded-lg bg-primary p-1.5 text-on-primary"
                      title="Abrir ficha"
                    >
                      <MaterialIcon name="open_in_new" className="text-[18px]" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-md py-lg text-center text-on-surface-variant">
                    No hay trabajadores con los filtros actuales.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  icon,
  value,
  detail,
}: Readonly<{
  label: string;
  icon: string;
  value: number;
  detail: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col justify-between space-y-2 rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
          {label}
        </span>
        <MaterialIcon name={icon} className="text-[20px] text-primary" />
      </div>
      <div>
        <div className="font-headline-lg text-headline-lg font-bold tracking-tight text-primary">
          {value}
        </div>
        <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant">{detail}</div>
      </div>
    </div>
  );
}

function Tag({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span className="rounded bg-surface-container px-1.5 py-0.5 text-[10px] font-semibold text-primary">
      {children}
    </span>
  );
}
