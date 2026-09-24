export const ACTIVITY_STATUSES = [
  "pendiente",
  "en_curso",
  "hecha",
  "cancelada",
] as const;
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];

export const ACTIVITY_PRIORITIES = ["baja", "media", "alta"] as const;
export type ActivityPriority = (typeof ACTIVITY_PRIORITIES)[number];

export const ACTIVITY_OWNERSHIP_FILTERS = [
  "all",
  "mine",
  "assigned_to_me",
] as const;
export type ActivityOwnershipFilter = (typeof ACTIVITY_OWNERSHIP_FILTERS)[number];

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  hecha: "Hecha",
  cancelada: "Cancelada",
};

export const ACTIVITY_PRIORITY_LABELS: Record<ActivityPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const ACTIVITY_OWNERSHIP_LABELS: Record<ActivityOwnershipFilter, string> = {
  all: "Todas",
  mine: "Mías",
  assigned_to_me: "Asignadas a mí",
};

export const ACTIVITY_STATUS_COLORS: Record<ActivityStatus, string> = {
  pendiente: "bg-surface-container-high text-on-surface-variant",
  en_curso: "bg-primary/10 text-primary",
  hecha: "bg-tertiary/15 text-tertiary",
  cancelada: "bg-error/10 text-error",
};

export const ACTIVITY_PRIORITY_COLORS: Record<ActivityPriority, string> = {
  baja: "bg-surface-container text-on-surface-variant",
  media: "bg-secondary/10 text-secondary",
  alta: "bg-error/10 text-error",
};

export type AdminUserOption = {
  id: string;
  name: string;
  email: string;
};

export type WorkActivity = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  category: string;
  assigneeId: string | null;
  assigneeName: string | null;
  createdBy: string | null;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ActivityDraft = {
  id?: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  category: string;
  assigneeId: string;
};

export type ActivityListFilters = {
  from?: string;
  to?: string;
  status?: ActivityStatus | "all";
  priority?: ActivityPriority | "all";
  ownership?: ActivityOwnershipFilter;
  currentUserId?: string;
  query?: string;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Valor local `YYYY-MM-DDTHH:mm` para inputs datetime-local. */
export function toDatetimeLocalValue(value?: string | Date | null): string {
  const d = value
    ? value instanceof Date
      ? value
      : new Date(value.length === 16 && !value.endsWith("Z") ? value : value)
    : new Date();
  if (Number.isNaN(d.getTime())) {
    const fallback = new Date();
    return `${fallback.getFullYear()}-${pad2(fallback.getMonth() + 1)}-${pad2(fallback.getDate())}T${pad2(fallback.getHours())}:${pad2(fallback.getMinutes())}`;
  }
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Convierte datetime-local a ISO para persistir en timestamptz. */
export function datetimeLocalToIso(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString();
}

export function emptyActivityDraft(startsAt?: string): ActivityDraft {
  const start = toDatetimeLocalValue(startsAt);
  const endDate = new Date(start);
  endDate.setHours(endDate.getHours() + 1);
  return {
    title: "",
    description: "",
    startsAt: start,
    endsAt: toDatetimeLocalValue(endDate),
    status: "pendiente",
    priority: "media",
    category: "",
    assigneeId: "",
  };
}

export function draftFromActivity(activity: WorkActivity): ActivityDraft {
  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    startsAt: toDatetimeLocalValue(activity.startsAt),
    endsAt: toDatetimeLocalValue(activity.endsAt),
    status: activity.status,
    priority: activity.priority,
    category: activity.category,
    assigneeId: activity.assigneeId ?? "",
  };
}

export function validateActivityDraft(draft: ActivityDraft): string | null {
  if (!draft.title.trim()) return "El título es obligatorio.";
  if (draft.title.trim().length > 200) return "El título no puede superar 200 caracteres.";
  if (draft.category.trim().length > 80) return "La categoría no puede superar 80 caracteres.";
  if (!draft.startsAt) return "La fecha de inicio es obligatoria.";
  if (!draft.endsAt) return "La fecha de fin es obligatoria.";
  if (draft.endsAt < draft.startsAt) return "La fecha de fin debe ser posterior al inicio.";
  return null;
}

export function isActivityStatus(value: string): value is ActivityStatus {
  return (ACTIVITY_STATUSES as readonly string[]).includes(value);
}

export function isActivityPriority(value: string): value is ActivityPriority {
  return (ACTIVITY_PRIORITIES as readonly string[]).includes(value);
}

export function isActivityOwnershipFilter(
  value: string,
): value is ActivityOwnershipFilter {
  return (ACTIVITY_OWNERSHIP_FILTERS as readonly string[]).includes(value);
}
