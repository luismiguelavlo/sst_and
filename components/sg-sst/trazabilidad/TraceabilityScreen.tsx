"use client";

import { useMemo, useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import { loadSstAuditTrailAction } from "@/lib/sg-sst/trazabilidad/actions";
import {
  SST_AUDIT_ACTION_LABELS,
  SST_AUDIT_ACTIONS,
  SST_AUDIT_MODULE_LABELS,
  SST_AUDIT_MODULES,
  type SstAuditAction,
  type SstAuditEvent,
  type SstAuditModule,
} from "@/lib/sg-sst/trazabilidad/types";

type Props = {
  initialEvents: SstAuditEvent[];
  initialTotal: number;
  workerId?: string | null;
  title?: string;
  compact?: boolean;
};

function formatOccurredAt(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { date: iso.slice(0, 10) || "—", time: iso.slice(11, 19) || "—" };
  }
  return {
    date: d.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    time: d.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
  };
}

export function TraceabilityScreen({
  initialEvents,
  initialTotal,
  workerId = null,
  title = "Trazabilidad",
  compact = false,
}: Readonly<Props>) {
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [events, setEvents] = useState(initialEvents);
  const [total, setTotal] = useState(initialTotal);
  const [query, setQuery] = useState("");
  const [module, setModule] = useState<SstAuditModule | "all">("all");
  const [action, setAction] = useState<SstAuditAction | "all">("all");

  const modules = useMemo(() => [...SST_AUDIT_MODULES], []);
  const actions = useMemo(() => [...SST_AUDIT_ACTIONS], []);

  function reload() {
    startTransition(async () => {
      try {
        const result = await loadSstAuditTrailAction({
          query,
          module,
          action,
          workerId,
          limit: compact ? 30 : 150,
        });
        setEvents(result.events);
        setTotal(result.total);
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "No se pudo cargar el historial.",
          { variant: "error" },
        );
      }
    });
  }

  return (
    <div
      className={
        compact
          ? "flex w-full flex-col gap-md"
          : "flex w-full flex-col gap-md px-gutter py-md pb-xl"
      }
    >
      {!compact ? (
        <header className="flex flex-wrap items-end justify-between gap-md">
          <div>
            <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
              <MaterialIcon name="history" className="text-[16px]" />
              Auditoría SG-SST
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary">{title}</h1>
            <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
              Historial de cambios importantes: usuario, fecha, hora y acción realizada.
            </p>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant">
            {total} evento(s)
          </p>
        </header>
      ) : (
        <div className="flex items-center justify-between gap-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {total} evento(s)
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <label className="flex min-w-[200px] flex-1 flex-col gap-0.5">
          <span className="font-label-sm text-[11px] text-on-surface-variant">Buscar</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Usuario, resumen, trabajador…"
            className="rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-sm py-1.5 font-body-sm text-body-sm"
          />
        </label>
        {!workerId ? (
          <label className="flex flex-col gap-0.5">
            <span className="font-label-sm text-[11px] text-on-surface-variant">Módulo</span>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value as SstAuditModule | "all")}
              className="min-w-[160px] rounded-lg border border-outline-variant/50 px-sm py-1.5 font-body-sm text-body-sm"
            >
              <option value="all">Todos</option>
              {modules.map((m) => (
                <option key={m} value={m}>
                  {SST_AUDIT_MODULE_LABELS[m]}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="flex flex-col gap-0.5">
          <span className="font-label-sm text-[11px] text-on-surface-variant">Acción</span>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as SstAuditAction | "all")}
            className="min-w-[140px] rounded-lg border border-outline-variant/50 px-sm py-1.5 font-body-sm text-body-sm"
          >
            <option value="all">Todas</option>
            {actions.map((a) => (
              <option key={a} value={a}>
                {SST_AUDIT_ACTION_LABELS[a]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={pending}
          onClick={reload}
          className="rounded-lg bg-primary px-md py-sm font-label-md text-label-md font-semibold text-on-primary disabled:opacity-50"
        >
          {pending ? "Cargando…" : "Filtrar"}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        {events.length === 0 ? (
          <p className="px-md py-lg text-center font-body-sm text-on-surface-variant">
            Sin eventos de trazabilidad todavía. Se registran al crear, actualizar o eliminar
            registros importantes.
          </p>
        ) : (
          <ul className="divide-y divide-outline-variant/20">
            {events.map((event) => {
              const when = formatOccurredAt(event.occurredAt);
              return (
                <li key={event.id} className="px-md py-sm">
                  <div className="flex flex-wrap items-start justify-between gap-sm">
                    <p className="font-body-md text-body-md text-on-surface">{event.summary}</p>
                    <div className="shrink-0 text-right font-label-sm text-[11px] text-outline">
                      <div>{when.date}</div>
                      <div>{when.time}</div>
                    </div>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-xs font-label-sm text-[11px] text-on-surface-variant">
                    <span className="rounded bg-surface-container px-1.5 py-0.5">
                      {event.actorName}
                    </span>
                    <span className="rounded bg-surface-container px-1.5 py-0.5">
                      {SST_AUDIT_MODULE_LABELS[event.module] ?? event.module}
                    </span>
                    <span className="rounded bg-surface-container px-1.5 py-0.5">
                      {SST_AUDIT_ACTION_LABELS[event.action]}
                    </span>
                    {event.details.folio ? (
                      <span className="rounded bg-surface-container px-1.5 py-0.5">
                        {event.details.folio}
                      </span>
                    ) : null}
                  </div>
                  {event.details.changes && event.details.changes.length > 0 ? (
                    <ul className="mt-sm space-y-0.5 font-body-sm text-[12px] text-on-surface-variant">
                      {event.details.changes.slice(0, 4).map((change) => (
                        <li key={`${event.id}-${change.field}`}>
                          {change.label}:{" "}
                          <span className="text-outline">{change.from}</span>
                          {" → "}
                          <span className="text-on-surface">{change.to}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
