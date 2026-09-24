"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { deleteActivityAction, saveActivityAction } from "@/lib/agenda/actions";
import {
  ACTIVITY_PRIORITIES,
  ACTIVITY_PRIORITY_LABELS,
  ACTIVITY_STATUSES,
  ACTIVITY_STATUS_LABELS,
  draftFromActivity,
  emptyActivityDraft,
  type ActivityDraft,
  type AdminUserOption,
  type WorkActivity,
} from "@/lib/agenda/types";

type Props = {
  activity?: WorkActivity | null;
  initialStartsAt?: string;
  adminUsers: AdminUserOption[];
  onClose: () => void;
  onSaved: (activity: WorkActivity) => void;
  onDeleted?: (id: string) => void;
};

export function ActivityDialog({
  activity,
  initialStartsAt,
  adminUsers,
  onClose,
  onSaved,
  onDeleted,
}: Readonly<Props>) {
  const [draft, setDraft] = useState<ActivityDraft>(() =>
    activity ? draftFromActivity(activity) : emptyActivityDraft(initialStartsAt),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function set<K extends keyof ActivityDraft>(key: K, value: ActivityDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveActivityAction(draft);
      if (result.ok) {
        onSaved(result.activity);
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete() {
    if (!activity?.id) return;
    if (!window.confirm("¿Eliminar esta actividad?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteActivityAction(activity.id);
      if (result.ok) {
        onDeleted?.(activity.id);
      } else {
        setError(result.error ?? "No se pudo eliminar.");
      }
    });
  }

  const isEdit = Boolean(activity?.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-dialog-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-surface shadow-xl ring-1 ring-outline-variant/30">
        <div className="flex items-center gap-sm bg-surface-container px-lg py-md">
          <MaterialIcon name={isEdit ? "edit_calendar" : "add_task"} className="text-primary" />
          <h2 id="activity-dialog-title" className="flex-1 font-headline-sm text-on-surface">
            {isEdit ? "Editar actividad" : "Nueva actividad"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-xs text-on-surface-variant transition-colors hover:bg-surface-container-high"
            aria-label="Cerrar"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md p-lg">
          <div>
            <label className="mb-xs block font-label-sm text-on-surface-variant" htmlFor="act-title">
              Título *
            </label>
            <input
              id="act-title"
              ref={titleRef}
              type="text"
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ej: Reunión comité SG-SST"
              maxLength={200}
              className="w-full rounded-xl border border-outline-variant bg-surface-container px-md py-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="mb-xs block font-label-sm text-on-surface-variant" htmlFor="act-starts">
                Inicio *
              </label>
              <input
                id="act-starts"
                type="datetime-local"
                value={draft.startsAt}
                onChange={(e) => set("startsAt", e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-md py-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="mb-xs block font-label-sm text-on-surface-variant" htmlFor="act-ends">
                Fin *
              </label>
              <input
                id="act-ends"
                type="datetime-local"
                value={draft.endsAt}
                onChange={(e) => set("endsAt", e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-md py-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="mb-xs block font-label-sm text-on-surface-variant" htmlFor="act-status">
                Estado
              </label>
              <select
                id="act-status"
                value={draft.status}
                onChange={(e) => set("status", e.target.value as ActivityDraft["status"])}
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-md py-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {ACTIVITY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {ACTIVITY_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-xs block font-label-sm text-on-surface-variant" htmlFor="act-priority">
                Prioridad
              </label>
              <select
                id="act-priority"
                value={draft.priority}
                onChange={(e) => set("priority", e.target.value as ActivityDraft["priority"])}
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-md py-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {ACTIVITY_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {ACTIVITY_PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="mb-xs block font-label-sm text-on-surface-variant" htmlFor="act-cat">
                Categoría
              </label>
              <input
                id="act-cat"
                type="text"
                value={draft.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Ej: Capacitación, Inspección…"
                maxLength={80}
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-md py-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-xs block font-label-sm text-on-surface-variant" htmlFor="act-assignee">
                Asignado
              </label>
              <select
                id="act-assignee"
                value={draft.assigneeId}
                onChange={(e) => set("assigneeId", e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-md py-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sin asignar</option>
                {adminUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-xs block font-label-sm text-on-surface-variant" htmlFor="act-desc">
              Descripción / notas
            </label>
            <textarea
              id="act-desc"
              rows={3}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Detalles de la actividad…"
              className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container px-md py-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-error/10 px-md py-sm font-label-sm text-error">{error}</p>
          )}

          <div className="flex items-center justify-between gap-sm pt-xs">
            {isEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-xl px-md py-sm font-label-md text-error transition-colors hover:bg-error/10 disabled:opacity-60"
              >
                Eliminar
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-sm">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-lg py-sm font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-xs rounded-xl bg-primary px-lg py-sm font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {isPending && (
                  <MaterialIcon name="progress_activity" className="animate-spin text-sm" />
                )}
                {isEdit ? "Guardar cambios" : "Crear actividad"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
