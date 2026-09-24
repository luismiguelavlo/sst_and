"use client";

import { useMemo } from "react";
import { ACTIVITY_STATUS_COLORS, type WorkActivity } from "@/lib/agenda/types";

type Props = {
  year: number;
  month: number; // 0-indexed
  activities: WorkActivity[];
  onSelectDay: (isoDate: string) => void;
  onSelectActivity: (activity: WorkActivity) => void;
};

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function localIsoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AgendaMonthView({
  year,
  month,
  activities,
  onSelectDay,
  onSelectActivity,
}: Readonly<Props>) {
  const { cells } = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startWd = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startWd + daysInMonth) / 7) * 7;

    const cells: (number | null)[] = [];
    for (let i = 0; i < startWd; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length < totalCells) cells.push(null);

    return { cells };
  }, [year, month]);

  const activitiesByDay = useMemo(() => {
    const map = new Map<string, WorkActivity[]>();
    for (const act of activities) {
      const key = localIsoDate(new Date(act.startsAt));
      const existing = map.get(key) ?? [];
      existing.push(act);
      map.set(key, existing);
    }
    return map;
  }, [activities]);

  const todayStr = localIsoDate(new Date());

  return (
    <div className="flex flex-col gap-0">
      <div className="grid grid-cols-7 border-b border-outline-variant/20">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-xs text-center font-label-sm text-on-surface-variant">
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 divide-x divide-outline-variant/10">
        {cells.map((day, idx) => {
          const isoDate =
            day !== null
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              : null;
          const dayActivities = isoDate ? (activitiesByDay.get(isoDate) ?? []) : [];
          const isToday = isoDate === todayStr;

          return (
            <div
              key={`cell-${idx}`}
              className={`group min-h-[90px] border-b border-outline-variant/10 p-xs transition-colors ${
                day !== null ? "cursor-pointer hover:bg-surface-container" : "bg-surface-container/30"
              }`}
              onClick={() => {
                if (isoDate) onSelectDay(isoDate);
              }}
            >
              {day !== null && (
                <>
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-label-sm transition-colors ${
                      isToday
                        ? "bg-primary text-on-primary"
                        : "text-on-surface group-hover:bg-surface-container-high"
                    }`}
                  >
                    {day}
                  </span>

                  <div className="mt-xs space-y-[2px]">
                    {dayActivities.slice(0, 3).map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectActivity(act);
                        }}
                        className={`w-full truncate rounded px-xs py-[1px] text-left font-label-xs transition-opacity hover:opacity-80 ${ACTIVITY_STATUS_COLORS[act.status]}`}
                      >
                        {act.title}
                      </button>
                    ))}
                    {dayActivities.length > 3 && (
                      <span className="block px-xs font-label-xs text-on-surface-variant">
                        +{dayActivities.length - 3} más
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-sm px-xs py-sm">
        {(["pendiente", "en_curso", "hecha", "cancelada"] as const).map((s) => (
          <span
            key={s}
            className={`rounded-full px-sm py-[2px] font-label-xs ${ACTIVITY_STATUS_COLORS[s]}`}
          >
            {s === "pendiente"
              ? "Pendiente"
              : s === "en_curso"
                ? "En curso"
                : s === "hecha"
                  ? "Hecha"
                  : "Cancelada"}
          </span>
        ))}
      </div>
    </div>
  );
}
