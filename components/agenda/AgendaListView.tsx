"use client";

import { useMemo } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  ACTIVITY_PRIORITY_COLORS,
  ACTIVITY_PRIORITY_LABELS,
  ACTIVITY_STATUS_COLORS,
  ACTIVITY_STATUS_LABELS,
  type WorkActivity,
} from "@/lib/agenda/types";

type Props = {
  activities: WorkActivity[];
  onSelectActivity: (activity: WorkActivity) => void;
  onStatusChange: (id: string, status: WorkActivity["status"]) => void;
};

type GroupedActivities = {
  label: string;
  isoDate: string;
  activities: WorkActivity[];
};

export function AgendaListView({
  activities,
  onSelectActivity,
  onStatusChange,
}: Readonly<Props>) {
  const groups = useMemo<GroupedActivities[]>(() => {
    const map = new Map<string, WorkActivity[]>();
    for (const act of activities) {
      const key = act.startsAt.slice(0, 10);
      const arr = map.get(key) ?? [];
      arr.push(act);
      map.set(key, arr);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([isoDate, acts]) => ({
        isoDate,
        label: new Date(isoDate + "T12:00:00").toLocaleDateString("es-CO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        activities: [...acts].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
      }));
  }, [activities]);

  const todayStr = new Date().toISOString().slice(0, 10);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-sm py-16 text-on-surface-variant">
        <MaterialIcon name="event_busy" className="text-4xl" />
        <p className="font-body-md">No hay actividades en este período.</p>
      </div>
    );
  }

  return (
    <div className="space-y-lg py-sm">
      {groups.map((group) => {
        const isToday = group.isoDate === todayStr;
        return (
          <div key={group.isoDate}>
            {/* Date header */}
            <div className={`mb-sm flex items-center gap-sm px-md py-xs ${isToday ? "text-primary" : "text-on-surface-variant"}`}>
              <div className={`h-px flex-1 ${isToday ? "bg-primary/30" : "bg-outline-variant/20"}`} />
              <span className="font-label-sm capitalize">{group.label}</span>
              {isToday && (
                <span className="rounded-full bg-primary/10 px-sm py-[2px] font-label-xs text-primary">
                  Hoy
                </span>
              )}
              <div className={`h-px flex-1 ${isToday ? "bg-primary/30" : "bg-outline-variant/20"}`} />
            </div>

            {/* Activities */}
            <div className="space-y-xs px-md">
              {group.activities.map((act) => (
                <div
                  key={act.id}
                  className="group relative flex items-start gap-md rounded-2xl bg-surface-container p-md ring-1 ring-outline-variant/20 transition-all hover:shadow-sm hover:ring-outline-variant/40"
                >
                  {/* Priority stripe */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${
                      act.priority === "alta"
                        ? "bg-error"
                        : act.priority === "media"
                        ? "bg-secondary"
                        : "bg-surface-container-high"
                    }`}
                  />

                  {/* Content */}
                  <button
                    type="button"
                    onClick={() => onSelectActivity(act)}
                    className="flex-1 text-left pl-sm"
                  >
                    <div className="flex flex-wrap items-center gap-sm">
                      <span className="font-label-md text-on-surface">{act.title}</span>
                      {act.category && (
                        <span className="rounded-full bg-surface-container-high px-sm py-[2px] font-label-xs text-on-surface-variant">
                          {act.category}
                        </span>
                      )}
                    </div>
                    <div className="mt-xs flex flex-wrap items-center gap-sm font-label-xs text-on-surface-variant">
                      <MaterialIcon name="schedule" className="text-xs" />
                      <span>
                        {new Date(act.startsAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                        {" → "}
                        {new Date(act.endsAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className={`rounded-full px-sm py-[2px] ${ACTIVITY_PRIORITY_COLORS[act.priority]}`}>
                        {ACTIVITY_PRIORITY_LABELS[act.priority]}
                      </span>
                    </div>
                    {act.description && (
                      <p className="mt-xs font-body-xs text-on-surface-variant line-clamp-2">{act.description}</p>
                    )}
                  </button>

                  {/* Status quick-change */}
                  <div className="shrink-0 flex flex-col items-end gap-xs">
                    <span className={`rounded-full px-sm py-[2px] font-label-xs ${ACTIVITY_STATUS_COLORS[act.status]}`}>
                      {ACTIVITY_STATUS_LABELS[act.status]}
                    </span>
                    {act.status === "pendiente" && (
                      <button
                        type="button"
                        onClick={() => onStatusChange(act.id, "en_curso")}
                        className="flex items-center gap-xs rounded-full bg-primary/10 px-sm py-[2px] font-label-xs text-primary hover:bg-primary/20 transition-colors"
                      >
                        <MaterialIcon name="play_arrow" className="text-xs" />
                        Iniciar
                      </button>
                    )}
                    {act.status === "en_curso" && (
                      <button
                        type="button"
                        onClick={() => onStatusChange(act.id, "hecha")}
                        className="flex items-center gap-xs rounded-full bg-tertiary/15 px-sm py-[2px] font-label-xs text-tertiary hover:bg-tertiary/25 transition-colors"
                      >
                        <MaterialIcon name="check" className="text-xs" />
                        Completar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
