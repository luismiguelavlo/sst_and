export type ProgressStatus = "not-started" | "in-progress" | "completed" | "at-risk";

export type EmployeeAvatar =
  | { kind: "photo"; src: string; alt: string }
  | { kind: "initials"; initials: string; className: string };

export type EmployeeProgressRow = {
  id: string;
  name: string;
  email: string;
  courseTitle: string;
  status: ProgressStatus;
  progressPercent: number;
  lessonsLabel: string;
  activityLabel: string;
  deadlineLabel: string;
  isAssigned: boolean;
  avatar: EmployeeAvatar;
};

export type EmployeeProgressStats = {
  totalCompletions: number;
  avgProgress: number;
  activeEmployees: number;
  previews: readonly { src: string; alt: string }[];
};

export const STATUS_FILTERS = ["all", "in-progress", "completed", "at-risk", "not-started"] as const;

export type StatusFilter = (typeof STATUS_FILTERS)[number];

export function statusLabel(status: ProgressStatus): string {
  if (status === "completed") {
    return "Completado";
  }
  if (status === "at-risk") {
    return "En riesgo";
  }
  if (status === "not-started") {
    return "Sin iniciar";
  }
  return "En curso";
}

export function statusFilterLabel(filter: StatusFilter): string {
  if (filter === "all") {
    return "Todos";
  }
  return statusLabel(filter);
}

export function progressBarClass(status: ProgressStatus): string {
  if (status === "completed") {
    return "bg-primary";
  }
  if (status === "at-risk") {
    return "bg-error";
  }
  if (status === "not-started") {
    return "bg-outline-variant";
  }
  return "bg-secondary";
}

export function statusBadgeClass(status: ProgressStatus): string {
  if (status === "completed") {
    return "bg-primary-container/20 text-primary";
  }
  if (status === "at-risk") {
    return "bg-error-container text-on-error-container";
  }
  if (status === "not-started") {
    return "bg-surface-container-high text-on-surface-variant";
  }
  return "bg-secondary-container/20 text-secondary";
}

export function statusDotClass(status: ProgressStatus): string {
  if (status === "completed") {
    return "bg-primary";
  }
  if (status === "at-risk") {
    return "bg-error";
  }
  if (status === "not-started") {
    return "bg-outline";
  }
  return "bg-secondary";
}
