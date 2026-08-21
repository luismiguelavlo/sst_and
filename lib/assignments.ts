export type LearnerAvatar =
  | { kind: "photo"; src: string; alt: string }
  | { kind: "initials"; initials: string; className: string };

export type AssignableLearner = {
  id: string;
  name: string;
  email: string;
  /** Cargo / área del empleado (filtro en la UI). */
  cohort: string;
  avatar: LearnerAvatar;
};

export type AssignableCourseCover =
  | { kind: "photo"; src: string; alt: string }
  | { kind: "icon"; icon: string };

export type AssignableCourse = {
  id: string;
  title: string;
  meta: string;
  cover: AssignableCourseCover;
};

export type AssignmentRecord = {
  id: string;
  createdAt: string;
  learnerCount: number;
  courseCount: number;
  deadline: string;
};

export type ActiveAssignment = {
  id: string;
  employeeName: string;
  employeeEmail: string;
  courseTitle: string;
  deadline: string;
  message: string;
  assignedAt: string;
};

export function selectionLabel(count: number): string {
  return `${count} seleccionados`;
}

export function learnerFiltersFrom(learners: readonly AssignableLearner[]): readonly string[] {
  const cohorts = [...new Set(learners.map((learner) => learner.cohort).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "es"),
  );
  return ["Todos", ...cohorts];
}
