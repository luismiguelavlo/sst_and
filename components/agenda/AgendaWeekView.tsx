"use client";

import { useMemo } from "react";
import { ACTIVITY_STATUS_COLORS, type WorkActivity } from "@/lib/agenda/types";

type Props = {
  weekStart: Date;
  activities: WorkActivity[];
  onSelectActivity: (activity: WorkActivity) => void;
  onSelectSlot: (isoDatetime: string) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const WEEKDAYS_LONG = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function localIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AgendaWeekView({
  weekStart,
  activities,
  onSelectActivity,
  onSelectSlot,
}: Readonly<Props>) {
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const activitiesByDay = useMemo(() => {
    const map = new Map<string, WorkActivity[]>();
    for (const act of activities) {
      const key = localIsoDate(new Date(act.startsAt));
      const arr = map.get(key) ?? [];
      arr.push(act);
      map.set(key, arr);
    }
    return map;
  }, [activities]);

  const todayStr = localIsoDate(new Date());

  return (
    <div className="flex flex-col overflow-auto">
      <div className="sticky top-0 z-10 grid grid-cols-[48px_repeat(7,1fr)] border-b border-outline-variant/20 bg-surface">
        <div />
        {days.map((d, idx) => {
          const isToday = localIsoDate(d) === todayStr;
          return (
            <div key={localIsoDate(d)} className="py-xs text-center">
              <p className="font-label-xs text-on-surface-variant">{WEEKDAYS_LONG[idx]}</p>
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-label-md ${
                  isToday ? "bg-primary text-on-primary" : "text-on-surface"
                }`}
              >
                {d.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[48px_repeat(7,1fr)]">
        {HOURS.map((hour) => (
          <div key={`row-${hour}`} className="contents">
            <div className="border-b border-outline-variant/10 py-xs pr-xs text-right font-label-xs text-on-surface-variant">
              {hour === 0 ? "" : `${String(hour).padStart(2, "0")}:00`}
            </div>

            {days.map((d) => {
              const dayStr = localIsoDate(d);
              const dayActivities = (activitiesByDay.get(dayStr) ?? []).filter((act) => {
                return new Date(act.startsAt).getHours() === hour;
              });

              return (
                <div
                  key={`${dayStr}-${hour}`}
                  className="relative min-h-[44px] cursor-pointer border-b border-l border-outline-variant/10 p-[2px] transition-colors hover:bg-surface-container"
                  onClick={() => {
                    onSelectSlot(`${dayStr}T${String(hour).padStart(2, "0")}:00`);
                  }}
                >
                  {dayActivities.map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectActivity(act);
                      }}
                      className={`mb-[2px] w-full truncate rounded-lg px-xs py-[2px] text-left font-label-xs transition-opacity hover:opacity-80 ${ACTIVITY_STATUS_COLORS[act.status]}`}
                    >
                      <span className="font-semibold">
                        {new Date(act.startsAt).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>{" "}
                      {act.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
