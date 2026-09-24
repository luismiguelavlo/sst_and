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
  date: Date;
  activities: WorkActivity[];
  onSelectActivity: (activity: WorkActivity) => void;
  onSelectSlot: (isoDatetime: string) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function AgendaDayView({
  date,
  activities,
  onSelectActivity,
  onSelectSlot,
}: Readonly<Props>) {
  const activitiesByHour = useMemo(() => {
    const map = new Map<number, WorkActivity[]>();
    for (const act of activities) {
      const d = act.startsAt.slice(0, 10);
      if (d !== isoDate(date)) continue;
      const h = new Date(act.startsAt).getHours();
      const arr = map.get(h) ?? [];
      arr.push(act);
      map.set(h, arr);
    }
    return map;
  }, [activities, date]);

  const dayLabel = date.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentHour = new Date().getHours();
  const isToday = isoDate(date) === isoDate(new Date());

  return (
    <div className="flex flex-col">
      {/* Date header */}
      <div className="flex items-center gap-sm border-b border-outline-variant/20 px-md py-sm">
        <MaterialIcon name="today" className="text-primary" />
        <h3 className="font-headline-sm capitalize text-on-surface">{dayLabel}</h3>
      </div>

      {/* Time grid */}
      <div className="flex flex-col divide-y divide-outline-variant/10">
        {HOURS.map((hour) => {
          const hourActivities = activitiesByHour.get(hour) ?? [];
          const isCurrentHour = isToday && hour === currentHour;

          return (
            <div
              key={hour}
              className={`flex cursor-pointer gap-sm p-sm hover:bg-surface-container transition-colors ${
                isCurrentHour ? "bg-primary/5" : ""
              }`}
              onClick={() => {
                const dt = new Date(date);
                dt.setHours(hour, 0, 0, 0);
                onSelectSlot(`${isoDate(dt)}T${String(hour).padStart(2, "0")}:00`);
              }}
            >
              {/* Hour label */}
              <div className="w-14 shrink-0 text-right font-label-xs text-on-surface-variant pt-xs">
                {`${String(hour).padStart(2, "0")}:00`}
                {isCurrentHour && (
                  <div className="mt-xs h-1 w-1 rounded-full bg-primary mx-auto" />
                )}
              </div>

              {/* Activities */}
              <div className="flex-1 space-y-xs min-h-[44px]">
                {hourActivities.map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectActivity(act);
                    }}
                    className={`w-full rounded-xl px-md py-sm text-left transition-all hover:opacity-90 hover:shadow-sm ${ACTIVITY_STATUS_COLORS[act.status]}`}
                  >
                    <div className="flex items-center justify-between gap-sm">
                      <span className="font-label-md truncate">{act.title}</span>
                      <div className="flex items-center gap-xs shrink-0">
                        {act.category && (
                          <span className="rounded-full bg-surface-container/60 px-sm py-[2px] font-label-xs">
                            {act.category}
                          </span>
                        )}
                        <span className={`rounded-full px-sm py-[2px] font-label-xs ${ACTIVITY_PRIORITY_COLORS[act.priority]}`}>
                          {ACTIVITY_PRIORITY_LABELS[act.priority]}
                        </span>
                      </div>
                    </div>
                    <div className="mt-[2px] flex items-center gap-xs font-label-xs text-current/70">
                      <MaterialIcon name="schedule" className="text-xs" />
                      <span>
                        {new Date(act.startsAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                        {" → "}
                        {new Date(act.endsAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="ml-sm">{ACTIVITY_STATUS_LABELS[act.status]}</span>
                    </div>
                    {act.description && (
                      <p className="mt-xs font-body-xs line-clamp-1 text-current/60">{act.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
