"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  changeActivityStatusAction,
  loadActivitiesAction,
} from "@/lib/agenda/actions";
import {
  ACTIVITY_OWNERSHIP_FILTERS,
  ACTIVITY_OWNERSHIP_LABELS,
  ACTIVITY_PRIORITIES,
  ACTIVITY_PRIORITY_LABELS,
  ACTIVITY_STATUSES,
  ACTIVITY_STATUS_LABELS,
  type ActivityOwnershipFilter,
  type AdminUserOption,
  type WorkActivity,
} from "@/lib/agenda/types";
import { ActivityDialog } from "./ActivityDialog";
import { AgendaDayView } from "./AgendaDayView";
import { AgendaListView } from "./AgendaListView";
import { AgendaMonthView } from "./AgendaMonthView";
import { AgendaWeekView } from "./AgendaWeekView";

type ViewMode = "mes" | "semana" | "dia" | "lista";

type Props = {
  initialActivities: WorkActivity[];
  currentUserId: string;
  adminUsers: AdminUserOption[];
};

const VIEW_LABELS: Record<ViewMode, string> = {
  mes: "Mes",
  semana: "Semana",
  dia: "Día",
  lista: "Lista",
};
const VIEW_ICONS: Record<ViewMode, string> = {
  mes: "calendar_month",
  semana: "view_week",
  dia: "today",
  lista: "format_list_bulleted",
};

function getMonday(d: Date): Date {
  const day = d.getDay();
  const diff = (day + 6) % 7;
  const mon = new Date(d);
  mon.setDate(d.getDate() - diff);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

function formatMonthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });
}

function formatWeekLabel(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${weekStart.toLocaleDateString("es-CO", opts)} – ${end.toLocaleDateString("es-CO", opts)}`;
}

function rangeForView(params: {
  view: ViewMode;
  year: number;
  month: number;
  weekStart: Date;
  dayDate: Date;
}): { from: string; to: string } {
  const { view, year, month, weekStart, dayDate } = params;
  if (view === "mes") {
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return { from: from.toISOString(), to: to.toISOString() };
  }
  if (view === "semana") {
    const from = new Date(weekStart);
    const to = new Date(weekStart);
    to.setDate(to.getDate() + 6);
    to.setHours(23, 59, 59, 999);
    return { from: from.toISOString(), to: to.toISOString() };
  }
  if (view === "dia") {
    const from = new Date(dayDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(dayDate);
    to.setHours(23, 59, 59, 999);
    return { from: from.toISOString(), to: to.toISOString() };
  }
  // lista: ventana amplia (3 meses atrás / 6 adelante)
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 6, 0, 23, 59, 59, 999);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function AgendaScreen({
  initialActivities,
  currentUserId,
  adminUsers,
}: Readonly<Props>) {
  const [view, setView] = useState<ViewMode>("mes");
  const [activities, setActivities] = useState<WorkActivity[]>(initialActivities);
  const [isPending, startTransition] = useTransition();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [weekStart, setWeekStart] = useState(() => getMonday(today));
  const [dayDate, setDayDate] = useState(today);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterOwnership, setFilterOwnership] =
    useState<ActivityOwnershipFilter>("all");
  const [query, setQuery] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editActivity, setEditActivity] = useState<WorkActivity | null>(null);
  const [slotStart, setSlotStart] = useState<string | undefined>(undefined);

  const reload = useCallback(() => {
    const range = rangeForView({ view, year, month, weekStart, dayDate });
    startTransition(async () => {
      const fresh = await loadActivitiesAction({
        ...range,
        status: filterStatus !== "all" ? (filterStatus as WorkActivity["status"]) : "all",
        priority:
          filterPriority !== "all"
            ? (filterPriority as WorkActivity["priority"])
            : "all",
        ownership: filterOwnership,
        currentUserId,
      });
      setActivities(fresh);
    });
  }, [
    view,
    year,
    month,
    weekStart,
    dayDate,
    filterStatus,
    filterPriority,
    filterOwnership,
    currentUserId,
  ]);

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = useMemo(() => {
    return activities.filter((act) => {
      if (filterStatus !== "all" && act.status !== filterStatus) return false;
      if (filterPriority !== "all" && act.priority !== filterPriority) return false;
      if (filterOwnership === "mine" && act.createdBy !== currentUserId) return false;
      if (filterOwnership === "assigned_to_me" && act.assigneeId !== currentUserId) {
        return false;
      }
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (
          !act.title.toLowerCase().includes(q) &&
          !act.category.toLowerCase().includes(q) &&
          !act.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [
    activities,
    filterStatus,
    filterPriority,
    filterOwnership,
    currentUserId,
    query,
  ]);

  const handleOpenNew = useCallback((startsAt?: string) => {
    setEditActivity(null);
    setSlotStart(startsAt);
    setDialogOpen(true);
  }, []);

  const handleSelectActivity = useCallback((act: WorkActivity) => {
    setEditActivity(act);
    setSlotStart(undefined);
    setDialogOpen(true);
  }, []);

  const handleSaved = useCallback((saved: WorkActivity) => {
    setActivities((prev) => {
      const idx = prev.findIndex((a) => a.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    });
    setDialogOpen(false);
  }, []);

  const handleDeleted = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setDialogOpen(false);
  }, []);

  const handleStatusChange = useCallback(
    (id: string, status: WorkActivity["status"]) => {
      startTransition(async () => {
        const result = await changeActivityStatusAction(id, status);
        if (result.ok) {
          setActivities((prev) =>
            prev.map((a) => (a.id === id ? result.activity : a)),
          );
        }
      });
    },
    [],
  );

  const handleSelectDay = useCallback((isoDate: string) => {
    const d = new Date(`${isoDate}T12:00:00`);
    setDayDate(d);
    setView("dia");
  }, []);

  function navPrev() {
    if (view === "mes") {
      if (month === 0) {
        setYear((y) => y - 1);
        setMonth(11);
      } else setMonth((m) => m - 1);
    } else if (view === "semana") {
      setWeekStart((w) => {
        const d = new Date(w);
        d.setDate(d.getDate() - 7);
        return d;
      });
    } else if (view === "dia") {
      setDayDate((d) => {
        const n = new Date(d);
        n.setDate(n.getDate() - 1);
        return n;
      });
    }
  }

  function navNext() {
    if (view === "mes") {
      if (month === 11) {
        setYear((y) => y + 1);
        setMonth(0);
      } else setMonth((m) => m + 1);
    } else if (view === "semana") {
      setWeekStart((w) => {
        const d = new Date(w);
        d.setDate(d.getDate() + 7);
        return d;
      });
    } else if (view === "dia") {
      setDayDate((d) => {
        const n = new Date(d);
        n.setDate(n.getDate() + 1);
        return n;
      });
    }
  }

  function navToday() {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setWeekStart(getMonday(now));
    setDayDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  const navLabel =
    view === "mes"
      ? formatMonthLabel(year, month)
      : view === "semana"
        ? formatWeekLabel(weekStart)
        : view === "dia"
          ? dayDate.toLocaleDateString("es-CO", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })
          : "Todas las actividades";

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex flex-col gap-sm border-b border-outline-variant/20 bg-surface-container-low px-lg py-md shadow-sm">
        <div className="flex flex-wrap items-center gap-sm">
          <div className="flex min-w-0 flex-1 items-center gap-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MaterialIcon name="calendar_month" className="text-primary" />
            </div>
            <div>
              <h1 className="font-headline-sm leading-none text-on-surface">
                Agenda de trabajo
              </h1>
              <p className="font-body-xs capitalize text-on-surface-variant">{navLabel}</p>
            </div>
          </div>

          <div className="flex overflow-hidden rounded-xl bg-surface-container ring-1 ring-outline-variant/20">
            {(["mes", "semana", "dia", "lista"] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`flex items-center gap-xs px-sm py-sm font-label-sm transition-colors ${
                  view === v
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
                aria-current={view === v ? "true" : undefined}
              >
                <MaterialIcon name={VIEW_ICONS[v]} className="text-sm" />
                <span className="hidden sm:inline">{VIEW_LABELS[v]}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleOpenNew()}
            className="flex items-center gap-xs rounded-xl bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90"
          >
            <MaterialIcon name="add" />
            <span className="hidden sm:inline">Nueva actividad</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-sm">
          {view !== "lista" && (
            <div className="flex items-center gap-xs">
              <button
                type="button"
                onClick={navPrev}
                className="rounded-lg p-xs text-on-surface-variant transition-colors hover:bg-surface-container-high"
                aria-label="Anterior"
              >
                <MaterialIcon name="chevron_left" />
              </button>
              <button
                type="button"
                onClick={navToday}
                className="rounded-lg px-md py-xs font-label-sm text-primary transition-colors hover:bg-primary/10"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={navNext}
                className="rounded-lg p-xs text-on-surface-variant transition-colors hover:bg-surface-container-high"
                aria-label="Siguiente"
              >
                <MaterialIcon name="chevron_right" />
              </button>
            </div>
          )}

          <div className="flex overflow-hidden rounded-xl ring-1 ring-outline-variant/20">
            {ACTIVITY_OWNERSHIP_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilterOwnership(f)}
                className={`px-sm py-xs font-label-sm transition-colors ${
                  filterOwnership === f
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-surface text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {ACTIVITY_OWNERSHIP_LABELS[f]}
              </button>
            ))}
          </div>

          <div className="relative min-w-[160px] flex-1">
            <MaterialIcon
              name="search"
              className="absolute left-sm top-1/2 -translate-y-1/2 text-sm text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="Buscar actividades…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-surface py-xs pl-8 pr-md font-label-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-outline-variant bg-surface px-md py-xs font-label-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos los estados</option>
            {ACTIVITY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ACTIVITY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-xl border border-outline-variant bg-surface px-md py-xs font-label-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todas las prioridades</option>
            {ACTIVITY_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {ACTIVITY_PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>

          {isPending && (
            <MaterialIcon name="progress_activity" className="animate-spin text-primary" />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {view === "mes" && (
          <AgendaMonthView
            year={year}
            month={month}
            activities={filtered}
            onSelectDay={handleSelectDay}
            onSelectActivity={handleSelectActivity}
          />
        )}
        {view === "semana" && (
          <AgendaWeekView
            weekStart={weekStart}
            activities={filtered}
            onSelectActivity={handleSelectActivity}
            onSelectSlot={(dt) => handleOpenNew(dt)}
          />
        )}
        {view === "dia" && (
          <AgendaDayView
            date={dayDate}
            activities={filtered}
            onSelectActivity={handleSelectActivity}
            onSelectSlot={(dt) => handleOpenNew(dt)}
          />
        )}
        {view === "lista" && (
          <AgendaListView
            activities={filtered}
            onSelectActivity={handleSelectActivity}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {dialogOpen && (
        <ActivityDialog
          activity={editActivity}
          initialStartsAt={slotStart}
          adminUsers={adminUsers}
          onClose={() => setDialogOpen(false)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
