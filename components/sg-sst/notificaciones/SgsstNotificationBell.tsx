"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  loadSstNotificationsAction,
  markAllSstNotificationsReadAction,
  markSstNotificationReadAction,
} from "@/lib/sg-sst/notificaciones/actions";
import {
  notificationBucketLabel,
  type SstNotificationCenter,
  type SstNotificationItem,
} from "@/lib/sg-sst/notificaciones/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type Props = {
  initialCenter?: SstNotificationCenter | null;
};

export function SgsstNotificationBell({ initialCenter = null }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const [center, setCenter] = useState<SstNotificationCenter | null>(initialCenter);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await loadSstNotificationsAction();
      setCenter(next);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialCenter) void refresh();
  }, [initialCenter, refresh]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const unread = center?.counts.unread ?? 0;

  async function onItemClick(item: SstNotificationItem) {
    if (!item.read) {
      const result = await markSstNotificationReadAction(item.id);
      if (result.ok) setCenter(result.center);
    }
    setOpen(false);
  }

  async function onMarkAll() {
    const result = await markAllSstNotificationsReadAction();
    if (result.ok) setCenter(result.center);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={
          unread > 0 ? `Notificaciones SST, ${unread} sin leer` : "Notificaciones SST"
        }
        aria-expanded={open}
        className="relative rounded-lg p-xs text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) void refresh();
        }}
      >
        <MaterialIcon name="notifications" className="text-[22px]" />
        {unread > 0 ? (
          <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-0.5 font-label-sm text-[10px] text-on-error">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-sm w-[min(100vw-2rem,24rem)] overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-lg">
          <div className="border-b border-outline-variant/20 px-md py-sm">
            <div className="flex items-center justify-between gap-sm">
              <h2 className="font-label-md text-label-md font-bold text-on-surface">
                Notificaciones SST
              </h2>
              {unread > 0 ? (
                <button
                  type="button"
                  className="font-label-sm text-label-sm text-primary hover:underline"
                  onClick={() => void onMarkAll()}
                >
                  Marcar todas
                </button>
              ) : null}
            </div>
            <div className="mt-sm grid grid-cols-3 gap-xs font-label-sm text-[11px]">
              <SummaryChip
                color="text-error"
                label={`🔴 ${center?.counts.critico ?? 0} críticos`}
              />
              <SummaryChip
                color="text-amber-600"
                label={`🟠 ${center?.counts.proximo ?? 0} próximos`}
              />
              <SummaryChip
                color="text-yellow-700"
                label={`🟡 ${center?.counts.seguimiento ?? 0} seguim.`}
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && !center ? (
              <p className="px-md py-lg text-center font-body-sm text-on-surface-variant">
                Cargando…
              </p>
            ) : null}
            {center && center.items.length === 0 ? (
              <p className="px-md py-lg text-center font-body-sm text-on-surface-variant">
                Sin vencimientos pendientes.
              </p>
            ) : null}
            <ul>
              {(center?.items ?? []).slice(0, 12).map((item) => (
                <li key={item.id} className="border-b border-outline-variant/15 last:border-0">
                  <Link
                    href={item.href}
                    className={
                      item.read
                        ? "block px-md py-sm hover:bg-surface-container"
                        : "block bg-primary/5 px-md py-sm hover:bg-primary/10"
                    }
                    onClick={() => void onItemClick(item)}
                  >
                    <div className="flex items-start justify-between gap-sm">
                      <p className="font-label-md text-label-md text-on-surface">{item.title}</p>
                      {!item.read ? (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      ) : null}
                    </div>
                    <p className="mt-0.5 line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">
                      {item.body}
                    </p>
                    <p className="mt-0.5 font-label-sm text-[11px] text-outline">
                      {notificationBucketLabel(item.semaphore)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-outline-variant/20 px-md py-sm">
            <Link
              href={`${SGSST_BASE}/notificaciones`}
              className="block text-center font-label-sm text-label-sm text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              Ver centro completo →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SummaryChip({
  color,
  label,
}: Readonly<{ color: string; label: string }>) {
  return (
    <span className={`rounded-md bg-surface-container-low px-1.5 py-1 ${color}`}>{label}</span>
  );
}
