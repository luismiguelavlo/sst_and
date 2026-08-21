export type MyCourseStatus = "not-started" | "in-progress" | "completed" | "overdue";

export type MyCourseItem = {
  id: string;
  slug: string;
  title: string;
  categoryLabel: string;
  levelLabel: string;
  coverUrl: string;
  coverAlt: string;
  progressPercent: number;
  lessonsLabel: string;
  status: MyCourseStatus;
  deadlineLabel: string;
  deadlineIso: string | null;
  message: string | null;
  assignedLabel: string | null;
  isAssigned: boolean;
  firstLessonId: string | null;
};

export type LessonProgressState = {
  viewedSectionIds: readonly string[];
  viewedCount: number;
  totalCount: number;
  progressPercent: number;
};

export function myCourseStatusLabel(status: MyCourseStatus): string {
  switch (status) {
    case "completed":
      return "Completado";
    case "in-progress":
      return "En curso";
    case "overdue":
      return "Vencido";
    default:
      return "Sin iniciar";
  }
}
