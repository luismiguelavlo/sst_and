"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { AttendancePendingItem } from "@/lib/attendance";

export function MyAttendanceScreen({
  forms,
}: Readonly<{ forms: readonly AttendancePendingItem[] }>) {
  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-md">
      <header className="space-y-xs">
        <h1 className="font-display-lg tracking-tight text-on-surface">Formularios de asistencia</h1>
        <p className="max-w-2xl font-body-lg text-on-surface-variant">
          Solo aparecen los formularios publicados que aún no has diligenciado.
        </p>
      </header>

      {forms.length === 0 ? (
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center shadow-sm">
          <MaterialIcon name="task_alt" className="mx-auto text-[40px] text-secondary" />
          <p className="mt-sm font-headline-md text-on-surface">Estás al día</p>
          <p className="mt-xs font-body-sm text-on-surface-variant">
            No tienes formularios de asistencia pendientes.
          </p>
        </div>
      ) : (
        <ul className="space-y-sm">
          {forms.map((form) => (
            <li key={form.id}>
              <Link
                href={`/my-attendance/${form.id}`}
                className="flex items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm transition-all hover:border-primary/40 hover:bg-surface-container-low"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-container/20 text-primary">
                  <MaterialIcon name="description" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-label-md text-on-surface">{form.title}</h2>
                  <p className="truncate font-body-sm text-on-surface-variant">
                    {form.topicSummary} · {form.responsibleName || "Sin responsable"}
                  </p>
                  <p className="mt-xs font-label-sm text-outline">
                    Evento: {form.eventDateLabel} · Publicado: {form.createdAtLabel}
                  </p>
                </div>
                <span className="hidden items-center gap-xs rounded-lg bg-secondary-container px-sm py-xs font-label-sm text-on-secondary-container sm:inline-flex">
                  Diligenciar
                  <MaterialIcon name="chevron_right" className="text-[18px]" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
