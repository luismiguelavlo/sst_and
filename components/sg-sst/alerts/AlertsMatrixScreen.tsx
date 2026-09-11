"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ComplianceExcelIoBar } from "@/components/sg-sst/alerts/ComplianceExcelIoBar";
import { SemaphoreBadge } from "@/components/sg-sst/alerts/SemaphoreBadge";
import { useToast } from "@/components/ui/ToastProvider";
import {
  closeAlertAction,
  extendAlertAction,
} from "@/lib/sg-sst/alerts/actions";
import {
  ALERT_KIND_META,
  SST_RECORD_TYPES,
  type SstAlertKind,
  type SstAlertView,
  type SstFarm,
  type SstSemaphoreLevel,
} from "@/lib/sg-sst/alerts/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type AlertsMatrixScreenProps = {
  alerts: SstAlertView[];
  farms: SstFarm[];
  counts: Record<SstSemaphoreLevel, number>;
  initialKind?: SstAlertKind | null;
  criticalCount: number;
};

export function AlertsMatrixScreen({
  alerts,
  farms,
  counts,
  initialKind = null,
  criticalCount,
}: Readonly<AlertsMatrixScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [farmId, setFarmId] = useState("all");
  const [level, setLevel] = useState<SstSemaphoreLevel | "all">("all");
  const [kind, setKind] = useState<SstAlertKind | "all">(initialKind ?? "all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(alerts[0]?.id ?? null);
  const [closeNotes, setCloseNotes] = useState("");
  const [extendDate, setExtendDate] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alerts.filter((alert) => {
      if (farmId !== "all" && alert.farmId !== farmId) return false;
      if (level !== "all" && alert.semaphore !== level) return false;
      if (kind !== "all" && !alert.alertKinds.includes(kind)) return false;
      if (!q) return true;
      return (
        alert.subjectName.toLowerCase().includes(q) ||
        alert.title.toLowerCase().includes(q) ||
        alert.folio.toLowerCase().includes(q) ||
        alert.code.toLowerCase().includes(q) ||
        (alert.subjectDocument ?? "").toLowerCase().includes(q)
      );
    });
  }, [alerts, farmId, kind, level, query]);

  const selected = filtered.find((alert) => alert.id === selectedId) ?? filtered[0] ?? null;

  function onClose() {
    if (!selected) return;
    startTransition(async () => {
      const result = await closeAlertAction(selected.id, closeNotes);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      setCloseNotes("");
      showToast("Alerta cerrada y documentada.");
      router.refresh();
    });
  }

  function onExtend() {
    if (!selected) return;
    startTransition(async () => {
      const result = await extendAlertAction(selected.id, extendDate, "Prórroga desde matriz");
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      setExtendDate("");
      showToast("Vigencia actualizada. El semáforo se recalculará.");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col px-gutter pb-xl">
      <div className="flex flex-col justify-between gap-base py-md lg:flex-row lg:items-center">
        <div className="flex items-center gap-sm">
          <Link
            href={`${SGSST_BASE}/alertas-sst`}
            className="flex items-center gap-xs rounded-lg bg-surface-container-low px-sm py-1.5 font-label-md text-label-md text-primary shadow-sm transition-colors hover:bg-surface-container"
          >
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            <span>Volver al Radar</span>
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
            Consola Operativa de Cumplimiento Legal
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <span className="flex h-2.5 w-2.5 animate-ping rounded-full bg-error" />
          <span className="font-label-sm text-label-sm font-semibold text-error">
            {criticalCount} Casos Críticos Requieren Acción Inmediata
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-md xl:grid-cols-12">
        <div className="flex flex-col gap-xs xl:col-span-8">
          <div className="flex items-center gap-xs">
            <MaterialIcon name="notification_important" className="text-[28px] text-primary" />
            <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-primary">
              Matriz Operativa de Gestión de Alertas SG-SST
            </h1>
          </div>
          <p className="max-w-3xl font-body-md text-body-md text-on-surface-variant">
            Cada fila es clickeable y lleva al registro correspondiente. Gestiona cierre, prórroga y
            trazabilidad desde el panel lateral.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-xs rounded-xl bg-surface-container-lowest p-xs shadow-sm xl:col-span-4">
          {(
            [
              ["critico", counts.critico, "Crítico"],
              ["proximo", counts.proximo, "Próximo"],
              ["seguimiento", counts.seguimiento, "Control"],
              ["vigente", counts.vigente, "Al Día"],
            ] as const
          ).map(([key, value, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setLevel(level === key ? "all" : key)}
              className="flex flex-col items-center justify-center rounded-lg p-xs text-center"
            >
              <span className="font-label-sm text-label-sm font-bold">{label}</span>
              <span className="font-headline-md text-headline-md font-bold">{value}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-md flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-sm shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <div className="flex flex-wrap items-center gap-xs">
            <span className="mr-1 font-label-sm text-label-sm font-bold tracking-wider text-on-surface-variant uppercase">
              Centro:
            </span>
            <Chip active={farmId === "all"} onClick={() => setFarmId("all")}>
              Todas
            </Chip>
            {farms.map((farm) => (
              <Chip key={farm.id} active={farmId === farm.id} onClick={() => setFarmId(farm.id)}>
                {farm.name}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-xs">
            <Chip active={level === "critico"} onClick={() => setLevel("critico")}>
              🔴 Crítico
            </Chip>
            <Chip active={level === "proximo"} onClick={() => setLevel("proximo")}>
              🟠 Próximo
            </Chip>
            <Chip active={level === "seguimiento"} onClick={() => setLevel("seguimiento")}>
              🟡 Seguimiento
            </Chip>
            <Chip active={level === "vigente"} onClick={() => setLevel("vigente")}>
              🟢 Al Día
            </Chip>
          </div>
        </div>
        <div className="flex items-center gap-xs overflow-x-auto py-1">
          <span className="mr-1 shrink-0 font-label-sm text-label-sm font-bold tracking-wider text-on-surface-variant uppercase">
            Módulo:
          </span>
          <Chip active={kind === "all"} onClick={() => setKind("all")}>
            Todos
          </Chip>
          {Object.values(ALERT_KIND_META).map((meta) => (
            <Chip
              key={meta.kind}
              active={kind === meta.kind}
              onClick={() => setKind(meta.kind)}
            >
              {meta.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-sm grid grid-cols-1 items-start gap-sm md:grid-cols-12">
        <div className="flex items-center gap-xs rounded-xl bg-surface-container-lowest px-sm py-1.5 shadow-sm md:col-span-7">
          <MaterialIcon name="search" className="text-[20px] text-outline" />
          <input
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
            placeholder="Buscar por cédula, nombre, folio o código..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="md:col-span-5">
          <ComplianceExcelIoBar
            records={filtered}
            recordTypes={SST_RECORD_TYPES}
            exportFileName={`matriz-alertas-sst-${new Date().toISOString().slice(0, 10)}.xlsx`}
            templateFileName="plantilla-alertas-sst.xlsx"
            sheetName="Matriz Alertas"
          />
        </div>
      </div>

      <div className="mt-base grid grid-cols-1 items-start gap-md lg:grid-cols-12">
        <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between bg-surface-container-low px-md py-sm">
            <div className="flex items-center gap-xs">
              <span className="font-label-md text-label-md font-bold text-primary">
                Registros Filtrados:
              </span>
              <span className="rounded-full bg-primary px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-primary">
                {filtered.length} Casos
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead>
                <tr className="bg-surface-container-high/60 font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                  <th className="px-md py-sm">Semáforo</th>
                  <th className="px-xs py-sm">Módulo & Alerta</th>
                  <th className="px-xs py-sm">Sujeto / Centro</th>
                  <th className="px-xs py-sm">Vencimiento</th>
                  <th className="px-xs py-sm">Responsable</th>
                  <th className="px-md py-sm text-right">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filtered.map((alert) => {
                  const isSelected = selected?.id === alert.id;
                  return (
                    <tr
                      key={alert.id}
                      className={`cursor-pointer transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-surface-container-low"}`}
                      onClick={() => setSelectedId(alert.id)}
                    >
                      <td className="px-md py-sm whitespace-nowrap">
                        <SemaphoreBadge level={alert.semaphore} label={alert.semaphoreLabel} />
                      </td>
                      <td className="px-xs py-sm">
                        <Link
                          href={`${SGSST_BASE}/registros/${alert.id}`}
                          className="flex items-center gap-1 font-label-md text-label-md font-bold text-primary hover:underline"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <span>{alert.title}</span>
                          <MaterialIcon name="open_in_new" className="text-[14px] text-secondary" />
                        </Link>
                        <span className="block text-[11px] text-on-surface-variant">
                          Cod: {alert.code} · {alert.folio}
                        </span>
                      </td>
                      <td className="px-xs py-sm">
                        <div className="font-label-md text-label-md font-semibold text-on-surface">
                          {alert.subjectName}
                        </div>
                        <div className="text-[11px] text-on-surface-variant">
                          {alert.subjectDocument ? `C.C. ${alert.subjectDocument} • ` : ""}
                          {alert.farmName ?? "Sin centro"}
                        </div>
                      </td>
                      <td className="px-xs py-sm whitespace-nowrap">
                        <span
                          className={`block font-label-sm text-label-sm font-bold ${alert.semaphore === "critico" ? "text-error" : "text-on-surface"}`}
                        >
                          {alert.dueDate ?? "Sin fecha"}
                        </span>
                      </td>
                      <td className="px-xs py-sm whitespace-nowrap">
                        <div className="font-label-sm text-label-sm font-medium text-on-surface">
                          {alert.responsibleName ?? "—"}
                        </div>
                        <div className="text-[11px] text-on-surface-variant">
                          {alert.responsibleRole ?? ""}
                        </div>
                      </td>
                      <td className="px-md py-sm text-right whitespace-nowrap">
                        <Link
                          href={`${SGSST_BASE}/registros/${alert.id}`}
                          className="inline-flex rounded-lg bg-primary p-1.5 text-on-primary"
                          onClick={(event) => event.stopPropagation()}
                          title="Abrir registro"
                        >
                          <MaterialIcon name="task_alt" className="text-[18px]" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-md py-lg text-center text-on-surface-variant">
                      No hay alertas con los filtros actuales.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-xl bg-surface-container-lowest p-md shadow-sm lg:col-span-4">
          {selected ? (
            <div className="space-y-md">
              <div>
                <div className="mb-xs flex items-center justify-between gap-xs">
                  <SemaphoreBadge level={selected.semaphore} label={selected.semaphoreLabel} />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {selected.folio}
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">{selected.title}</h2>
                <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
                  {selected.subjectName}
                  {selected.farmName ? ` · ${selected.farmName}` : ""}
                </p>
                <p className="mt-sm font-body-sm text-body-sm text-on-surface">{selected.notes}</p>
              </div>
              <Link
                href={`${SGSST_BASE}/registros/${selected.id}`}
                className="flex items-center justify-center gap-xs rounded-lg bg-primary px-base py-sm font-label-md text-label-md font-semibold text-on-primary"
              >
                Ir al registro completo
                <MaterialIcon name="arrow_forward" className="text-[18px]" />
              </Link>
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Cerrar con evidencia
                </label>
                <textarea
                  className="min-h-20 w-full rounded-lg bg-surface-container-low p-sm font-body-sm text-body-sm"
                  value={closeNotes}
                  onChange={(event) => setCloseNotes(event.target.value)}
                  placeholder="Describe el cierre / evidencias..."
                />
                <button
                  type="button"
                  disabled={pending}
                  onClick={onClose}
                  className="w-full rounded-lg bg-secondary px-base py-sm font-label-md text-label-md font-semibold text-on-secondary disabled:opacity-60"
                >
                  Cerrar alerta
                </button>
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Prorrogar vencimiento
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm"
                  value={extendDate}
                  onChange={(event) => setExtendDate(event.target.value)}
                />
                <button
                  type="button"
                  disabled={pending}
                  onClick={onExtend}
                  className="w-full rounded-lg bg-surface-container-high px-base py-sm font-label-md text-label-md font-semibold text-on-surface disabled:opacity-60"
                >
                  Guardar prórroga
                </button>
              </div>
            </div>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Selecciona una fila para ver trazabilidad y plan de cierre.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: Readonly<{ active: boolean; onClick: () => void; children: React.ReactNode }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "shrink-0 rounded-lg bg-primary px-2.5 py-1 font-label-sm text-label-sm font-semibold text-on-primary"
          : "shrink-0 rounded-lg bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm text-on-surface hover:bg-surface-container"
      }
    >
      {children}
    </button>
  );
}
