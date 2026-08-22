"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import {
  markAllMyNotificationsRead,
  markNotificationAsRead,
  sendCustomNotification,
} from "@/lib/notifications/actions";
import type { AppNotification } from "@/lib/notifications";
import type { AssignableLearner } from "@/lib/assignments";

export function NotificationsScreen({
  initialItems,
  initialUnread,
  isAdmin,
  learners,
}: Readonly<{
  initialItems: AppNotification[];
  initialUnread: number;
  isAdmin: boolean;
  learners: AssignableLearner[];
}>) {
  const [tab, setTab] = useState<"inbox" | "send">("inbox");
  const [items, setItems] = useState(initialItems);
  const [unreadCount, setUnreadCount] = useState(initialUnread);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-lg">
      <header className="flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-headline-lg text-primary">Notificaciones</h1>
          <p className="mt-xs font-body-md text-on-surface-variant">
            Alertas de cursos asignados y mensajes del área de SST.
            {unreadCount > 0 ? ` · ${unreadCount} sin leer` : null}
          </p>
        </div>
        {isAdmin ? (
          <div className="flex gap-xs rounded-lg bg-surface-container-high p-xs">
            <TabButton active={tab === "inbox"} onClick={() => setTab("inbox")} label="Bandeja" />
            <TabButton active={tab === "send"} onClick={() => setTab("send")} label="Enviar alerta" />
          </div>
        ) : null}
      </header>

      {tab === "inbox" ? (
        <InboxPanel
          items={items}
          unreadCount={unreadCount}
          onItemsChange={setItems}
          onUnreadChange={setUnreadCount}
        />
      ) : (
        <SendAlertPanel learners={learners} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: Readonly<{ active: boolean; onClick: () => void; label: string }>) {
  return (
    <button
      type="button"
      className={
        active
          ? "rounded-md bg-surface-container-lowest px-md py-xs font-label-md text-on-surface shadow-sm"
          : "rounded-md px-md py-xs font-label-md text-on-surface-variant hover:text-on-surface"
      }
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function InboxPanel({
  items,
  unreadCount,
  onItemsChange,
  onUnreadChange,
}: Readonly<{
  items: AppNotification[];
  unreadCount: number;
  onItemsChange: (items: AppNotification[]) => void;
  onUnreadChange: (count: number) => void;
}>) {
  async function markOne(item: AppNotification) {
    if (item.read) {
      return;
    }
    const result = await markNotificationAsRead(item.id);
    if (result.ok) {
      onUnreadChange(result.unreadCount);
      onItemsChange(items.map((row) => (row.id === item.id ? { ...row, read: true } : row)));
    }
  }

  async function markAll() {
    const result = await markAllMyNotificationsRead();
    if (result.ok) {
      onUnreadChange(0);
      onItemsChange(items.map((row) => ({ ...row, read: true })));
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-lg text-center shadow-sm">
        <MaterialIcon name="notifications_none" className="mx-auto text-[40px] text-outline" />
        <p className="mt-sm font-headline-md text-on-surface">Sin notificaciones</p>
        <p className="mt-xs font-body-sm text-on-surface-variant">
          Cuando te asignen un curso o SST envíe una alerta, aparecerá aquí.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant/20 px-md py-sm">
        <h2 className="font-headline-md text-on-surface">Bandeja</h2>
        {unreadCount > 0 ? (
          <button
            type="button"
            className="font-label-sm text-primary hover:underline"
            onClick={() => {
              void markAll();
            }}
          >
            Marcar todas como leídas
          </button>
        ) : null}
      </div>
      <ul className="divide-y divide-outline-variant/15">
        {items.map((item) => (
          <li key={item.id}>
            {item.href ? (
              <Link
                href={item.href}
                className={rowClass(item.read)}
                onClick={() => {
                  void markOne(item);
                }}
              >
                <InboxRow item={item} />
              </Link>
            ) : (
              <button
                type="button"
                className={`${rowClass(item.read)} w-full text-left`}
                onClick={() => {
                  void markOne(item);
                }}
              >
                <InboxRow item={item} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function InboxRow({ item }: Readonly<{ item: AppNotification }>) {
  return (
    <div className="flex gap-sm">
      <div
        className={
          item.kind === "course_assigned"
            ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container"
            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container"
        }
      >
        <MaterialIcon name={item.kind === "course_assigned" ? "school" : "campaign"} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-sm">
          <p className="font-label-md text-on-surface">{item.title}</p>
          {!item.read ? (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
          ) : null}
        </div>
        <p className="mt-xs font-body-sm text-on-surface-variant">{item.body}</p>
        <p className="mt-xs font-label-sm text-outline">{item.createdAtLabel}</p>
      </div>
    </div>
  );
}

function rowClass(read: boolean): string {
  return read
    ? "block px-md py-md transition-colors hover:bg-surface-container"
    : "block bg-primary/5 px-md py-md transition-colors hover:bg-primary/10";
}

function SendAlertPanel({ learners }: Readonly<{ learners: AssignableLearner[] }>) {
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [href, setHref] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) {
      return learners;
    }
    return learners.filter(
      (learner) =>
        learner.name.toLowerCase().includes(needle) ||
        learner.email.toLowerCase().includes(needle) ||
        learner.cohort.toLowerCase().includes(needle),
    );
  }, [learners, query]);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function selectAllFiltered() {
    setSelected((current) => {
      const next = new Set(current);
      for (const learner of filtered) {
        next.add(learner.id);
      }
      return [...next];
    });
  }

  async function onSubmit() {
    setStatus("sending");
    const result = await sendCustomNotification({
      userIds: selected,
      title,
      body,
      href,
    });
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      setStatus("idle");
      return;
    }
    showToast(`Alerta enviada a ${result.sent} empleado(s).`);
    setStatus("sent");
    setTitle("");
    setBody("");
    setHref("");
    setSelected([]);
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <section className="grid gap-md lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <h2 className="mb-sm font-headline-md text-on-surface">Destinatarios</h2>
        <input
          className="mb-sm w-full rounded-lg border border-outline-variant bg-surface px-sm py-sm font-body-md text-on-surface outline-none focus:border-primary"
          placeholder="Buscar empleado..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="mb-sm flex flex-wrap gap-sm">
          <button
            type="button"
            className="font-label-sm text-primary hover:underline"
            onClick={selectAllFiltered}
          >
            Seleccionar visibles
          </button>
          <button
            type="button"
            className="font-label-sm text-on-surface-variant hover:underline"
            onClick={() => setSelected([])}
          >
            Limpiar
          </button>
          <span className="font-label-sm text-outline">{selected.length} seleccionados</span>
        </div>
        <ul className="max-h-80 space-y-xs overflow-y-auto">
          {filtered.map((learner) => {
            const checked = selected.includes(learner.id);
            return (
              <li key={learner.id}>
                <label className="flex cursor-pointer items-center gap-sm rounded-lg px-sm py-xs hover:bg-surface-container">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(learner.id)}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-label-md text-on-surface">{learner.name}</span>
                    <span className="block truncate font-body-sm text-on-surface-variant">
                      {learner.email}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <h2 className="mb-sm font-headline-md text-on-surface">Mensaje</h2>
        <label className="mb-sm block">
          <span className="mb-xs block font-label-sm text-on-surface-variant">Título</span>
          <input
            className="w-full rounded-lg border border-outline-variant bg-surface px-sm py-sm font-body-md text-on-surface outline-none focus:border-primary"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej. Recordatorio de inducción SST"
          />
        </label>
        <label className="mb-sm block">
          <span className="mb-xs block font-label-sm text-on-surface-variant">Mensaje</span>
          <textarea
            className="min-h-[140px] w-full resize-y rounded-lg border border-outline-variant bg-surface p-sm font-body-md text-on-surface outline-none focus:border-primary"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Escribe la alerta que verán los empleados seleccionados."
          />
        </label>
        <label className="mb-md block">
          <span className="mb-xs block font-label-sm text-on-surface-variant">
            Enlace opcional (ruta interna)
          </span>
          <input
            className="w-full rounded-lg border border-outline-variant bg-surface px-sm py-sm font-body-md text-on-surface outline-none focus:border-primary"
            value={href}
            onChange={(event) => setHref(event.target.value)}
            placeholder="/my-courses"
          />
        </label>
        <button
          type="button"
          className="rounded-lg bg-primary px-md py-sm font-label-md text-on-primary disabled:opacity-60"
          disabled={status === "sending"}
          onClick={() => {
            void onSubmit();
          }}
        >
          {status === "sending" ? "Enviando..." : "Enviar notificación"}
        </button>
      </div>
    </section>
  );
}
