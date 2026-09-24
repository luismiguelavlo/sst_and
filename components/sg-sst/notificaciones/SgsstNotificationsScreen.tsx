"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import {
  markAllSstNotificationsReadAction,
  markSstNotificationReadAction,
} from "@/lib/sg-sst/notificaciones/actions";
import {
  notificationBucketLabel,
  type SstNotificationCenter,
  type SstNotificationItem,
} from "@/lib/sg-sst/notificaciones/types";
import type { SstSemaphoreLevel } from "@/lib/sg-sst/alerts/types";

type Props = {
  initialCenter: SstNotificationCenter;
};

const ORDER: SstSemaphoreLevel[] = ["critico", "proximo", "seguimiento"];

export function SgsstNotificationsScreen({
  initialCenter,
}: Readonly<Props>) {
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [center, setCenter] = useState(initialCenter);

  function markOne(item: SstNotificationItem) {
    if (item.read) return;
    startTransition(async () => {
      const result = await markSstNotificationReadAction(item.id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      setCenter(result.center);
    });
  }

  function markAll() {
    startTransition(async () => {
      const result = await markAllSstNotificationsReadAction();
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      setCenter(result.center);
      showToast("Notificaciones marcadas como leídas.");
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-wrap items-end justify-between gap-md">
        <div>
          <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
            <MaterialIcon name="notifications" className="text-[16px]" />
            Centro de notificaciones
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            Notificaciones SST
          </h1>
          <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
            Vencimientos y seguimientos del sistema de alertas. Puede marcar cada
            ítem como leído.
          </p>
        </div>
        <button
          type="button"
          disabled={pending || center.counts.unread === 0}
          onClick={markAll}
          className="rounded-lg bg-primary px-md py-sm font-label-md text-label-md font-semibold text-on-primary disabled:opacity-50"
        >
          Marcar todas como leídas
        </button>
      </header>

      <section className="grid grid-cols-1 gap-sm sm:grid-cols-3">
        <CountCard
          emoji="🔴"
          label="Vencimientos críticos"
          value={center.counts.critico}
          className="bg-error-container text-on-error-container"
        />
        <CountCard
          emoji="🟠"
          label="Vencimientos próximos"
          value={center.counts.proximo}
          className="bg-secondary-fixed text-on-secondary-fixed"
        />
        <CountCard
          emoji="🟡"
          label="Seguimientos pendientes"
          value={center.counts.seguimiento}
          className="bg-surface-container-high text-on-surface"
        />
      </section>

      {ORDER.map((level) => {
        const items = center.items.filter((i) => i.semaphore === level);
        if (items.length === 0) return null;
        return (
          <section key={level} className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
            <h2 className="mb-sm font-headline-md text-headline-md text-on-surface">
              {notificationBucketLabel(level)} ({items.length})
            </h2>
            <ul className="flex flex-col gap-sm">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={
                    item.read
                      ? "rounded-lg bg-surface-container-low px-md py-sm opacity-70"
                      : "rounded-lg bg-surface-container-low px-md py-sm"
                  }
                >
                  <div className="flex flex-wrap items-start justify-between gap-sm">
                    <div>
                      <Link
                        href={item.href}
                        className="font-label-md text-label-md font-semibold text-primary hover:underline"
                        onClick={() => markOne(item)}
                      >
                        {item.title}
                      </Link>
                      <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                        {item.body}
                      </p>
                    </div>
                    {!item.read ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => markOne(item)}
                        className="shrink-0 font-label-sm text-label-sm text-primary hover:underline"
                      >
                        Marcar leída
                      </button>
                    ) : (
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Leída
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {center.items.length === 0 ? (
        <p className="rounded-xl bg-surface-container-lowest px-md py-lg text-center font-body-md text-body-md text-on-surface-variant shadow-sm">
          No hay notificaciones pendientes.
        </p>
      ) : null}
    </div>
  );
}

function CountCard({
  emoji,
  label,
  value,
  className,
}: Readonly<{
  emoji: string;
  label: string;
  value: number;
  className: string;
}>) {
  return (
    <div className={`rounded-xl px-md py-md ${className}`}>
      <div className="font-label-sm text-label-sm uppercase tracking-wider opacity-80">
        {emoji} {label}
      </div>
      <div className="mt-xs font-display-lg text-display-lg leading-none font-bold">
        {value}
      </div>
    </div>
  );
}
