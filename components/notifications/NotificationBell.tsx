"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  getMyNotifications,
  markAllMyNotificationsRead,
  markNotificationAsRead,
} from "@/lib/notifications/actions";
import type { AppNotification } from "@/lib/notifications";

export function NotificationBell({ initialUnread = 0 }: Readonly<{ initialUnread?: number }>) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialUnread);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await getMyNotifications();
    setLoading(false);
    if (result.ok) {
      setItems(result.items.slice(0, 8));
      setUnreadCount(result.unreadCount);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  async function openPanel() {
    const next = !open;
    setOpen(next);
    if (next) {
      await refresh();
    }
  }

  async function onItemClick(item: AppNotification) {
    if (!item.read) {
      const result = await markNotificationAsRead(item.id);
      if (result.ok) {
        setUnreadCount(result.unreadCount);
        setItems((current) =>
          current.map((row) => (row.id === item.id ? { ...row, read: true } : row)),
        );
      }
    }
    setOpen(false);
  }

  async function onMarkAll() {
    const result = await markAllMyNotificationsRead();
    if (result.ok) {
      setUnreadCount(0);
      setItems((current) => current.map((row) => ({ ...row, read: true })));
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="relative rounded-lg p-xs text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        aria-label={
          unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : "Notificaciones"
        }
        aria-expanded={open}
        onClick={() => {
          void openPanel();
        }}
      >
        <MaterialIcon name="notifications" />
        {unreadCount > 0 ? (
          <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-0.5 font-label-sm text-[10px] text-on-error">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-sm w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-lg">
          <div className="flex items-center justify-between gap-sm border-b border-outline-variant/20 px-md py-sm">
            <h2 className="font-headline-md text-on-surface">Alertas</h2>
            {unreadCount > 0 ? (
              <button
                type="button"
                className="font-label-sm text-primary hover:underline"
                onClick={() => {
                  void onMarkAll();
                }}
              >
                Marcar todas
              </button>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-md py-lg text-center font-body-sm text-on-surface-variant">
                Cargando...
              </p>
            ) : null}
            {!loading && items.length === 0 ? (
              <p className="px-md py-lg text-center font-body-sm text-on-surface-variant">
                No tienes notificaciones.
              </p>
            ) : null}
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.id} className="border-b border-outline-variant/15 last:border-b-0">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={itemClass(item.read)}
                      onClick={() => {
                        void onItemClick(item);
                      }}
                    >
                      <NotificationRow item={item} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`${itemClass(item.read)} w-full text-left`}
                      onClick={() => {
                        void onItemClick(item);
                      }}
                    >
                      <NotificationRow item={item} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-outline-variant/20 px-md py-sm">
            <Link
              href="/notifications"
              className="block text-center font-label-sm text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              Ver todas
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotificationRow({ item }: Readonly<{ item: AppNotification }>) {
  return (
    <>
      <div className="flex items-start justify-between gap-sm">
        <p className="font-label-md text-on-surface">{item.title}</p>
        {!item.read ? (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
        ) : null}
      </div>
      <p className="mt-xs line-clamp-2 font-body-sm text-on-surface-variant">{item.body}</p>
      <p className="mt-xs font-label-sm text-outline">{item.createdAtLabel}</p>
    </>
  );
}

function itemClass(read: boolean): string {
  return read
    ? "block px-md py-sm transition-colors hover:bg-surface-container"
    : "block bg-primary/5 px-md py-sm transition-colors hover:bg-primary/10";
}
