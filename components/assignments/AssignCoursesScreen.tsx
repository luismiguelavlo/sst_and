"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { assignCoursesAction, unassignCourseAction } from "@/lib/assignments/actions";
import {
  learnerFiltersFrom,
  selectionLabel,
  type ActiveAssignment,
  type AssignableCourse,
  type AssignableCourseCover,
  type AssignableLearner,
  type AssignmentRecord,
  type LearnerAvatar,
} from "@/lib/assignments";

type AssignCoursesScreenProps = Readonly<{
  learners: readonly AssignableLearner[];
  courses: readonly AssignableCourse[];
  initialHistory: readonly AssignmentRecord[];
  initialActive: readonly ActiveAssignment[];
}>;

export function AssignCoursesScreen({
  learners,
  courses,
  initialHistory,
  initialActive,
}: AssignCoursesScreenProps) {
  const [learnerQuery, setLearnerQuery] = useState("");
  const [courseQuery, setCourseQuery] = useState("");
  const [learnerFilter, setLearnerFilter] = useState("Todos");
  const [selectedLearnerIds, setSelectedLearnerIds] = useState<readonly string[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<readonly string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeOpen, setActiveOpen] = useState(true);
  const [history, setHistory] = useState<readonly AssignmentRecord[]>(initialHistory);
  const [active, setActive] = useState<readonly ActiveAssignment[]>(initialActive);
  const [activeQuery, setActiveQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [unassigningId, setUnassigningId] = useState<string | null>(null);

  const filters = useMemo(() => learnerFiltersFrom(learners), [learners]);

  const visibleLearners = useMemo(() => {
    const needle = learnerQuery.trim().toLowerCase();
    return learners.filter((learner) => {
      const matchesCohort = learnerFilter === "Todos" || learner.cohort === learnerFilter;
      if (!matchesCohort) {
        return false;
      }
      if (needle.length === 0) {
        return true;
      }
      return (
        learner.name.toLowerCase().includes(needle) ||
        learner.email.toLowerCase().includes(needle) ||
        learner.cohort.toLowerCase().includes(needle)
      );
    });
  }, [learnerFilter, learnerQuery, learners]);

  const visibleCourses = useMemo(() => {
    const needle = courseQuery.trim().toLowerCase();
    if (needle.length === 0) {
      return courses;
    }
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(needle) ||
        course.meta.toLowerCase().includes(needle) ||
        course.id.toLowerCase().includes(needle),
    );
  }, [courseQuery, courses]);

  const visibleActive = useMemo(() => {
    const needle = activeQuery.trim().toLowerCase();
    if (needle.length === 0) {
      return active;
    }
    return active.filter(
      (item) =>
        item.employeeName.toLowerCase().includes(needle) ||
        item.employeeEmail.toLowerCase().includes(needle) ||
        item.courseTitle.toLowerCase().includes(needle),
    );
  }, [active, activeQuery]);

  const selectedLearners = learners.filter((learner) => selectedLearnerIds.includes(learner.id));
  const canAssign = selectedLearnerIds.length > 0 && selectedCourseIds.length > 0 && !pending;

  function toggleId(current: readonly string[], id: string): readonly string[] {
    return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  }

  function selectAllVisible() {
    const visibleIds = visibleLearners.map((learner) => learner.id);
    const allSelected = visibleIds.every((id) => selectedLearnerIds.includes(id));
    if (allSelected) {
      setSelectedLearnerIds((current) => current.filter((id) => !visibleIds.includes(id)));
      return;
    }
    setSelectedLearnerIds((current) => [...new Set([...current, ...visibleIds])]);
  }

  function cycleLearnerFilter() {
    const index = filters.indexOf(learnerFilter);
    setLearnerFilter(filters.at((index + 1) % filters.length) ?? "Todos");
  }

  function resetForm() {
    setSelectedLearnerIds([]);
    setSelectedCourseIds([]);
    setDeadline("");
    setMessage("");
  }

  function assignCourses() {
    if (!canAssign) {
      return;
    }
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await assignCoursesAction({
        userIds: selectedLearnerIds,
        courseIds: selectedCourseIds,
        deadline,
        message,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setHistory(result.history);
      setActive(result.active);
      setSuccess(
        `Asignación guardada: ${selectedCourseIds.length} curso(s) para ${selectedLearnerIds.length} empleado(s).`,
      );
      resetForm();
      setActiveOpen(true);
    });
  }

  function unassign(assignmentId: string, label: string) {
    const confirmed = window.confirm(`¿Desasignar ${label}? El empleado perderá el acceso si el curso no es público.`);
    if (!confirmed) {
      return;
    }
    setError(null);
    setSuccess(null);
    setUnassigningId(assignmentId);
    startTransition(async () => {
      const result = await unassignCourseAction(assignmentId);
      setUnassigningId(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setActive(result.active);
      setHistory(result.history);
      setSuccess("Asignación eliminada.");
    });
  }

  const overflowCount = Math.max(0, selectedLearners.length - 2);

  return (
    <div className="mx-auto flex h-full w-full max-w-container-max flex-col gap-lg">
      <div className="relative flex flex-col justify-between gap-base overflow-hidden rounded-xl bg-surface-container p-lg shadow-sm md:flex-row md:items-end">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 -mb-24 h-48 w-48 rounded-full bg-secondary/5 blur-2xl" />
        <div className="relative z-10 flex max-w-2xl flex-col gap-xs">
          <h1 className="font-display-lg text-[32px] leading-10 text-on-surface sm:text-display-lg">
            Asignar cursos
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Elige empleados y asígnales módulos SST. Puedes definir una fecha límite e incluir
            instrucciones.
          </p>
        </div>
        <div className="relative z-10 mt-md flex flex-wrap items-center gap-sm md:mt-0">
          <button
            className="flex items-center justify-center gap-xs rounded-lg bg-surface px-md py-sm font-label-md text-label-md text-primary shadow-sm transition-shadow hover:shadow-md"
            type="button"
            onClick={() => setActiveOpen((open) => !open)}
          >
            <MaterialIcon name="person_off" className="text-[20px]" />
            Asignaciones activas ({active.length})
          </button>
          <button
            className="flex items-center justify-center gap-xs rounded-lg bg-surface px-md py-sm font-label-md text-label-md text-primary shadow-sm transition-shadow hover:shadow-md"
            type="button"
            onClick={() => setHistoryOpen((open) => !open)}
          >
            <MaterialIcon name="history" className="text-[20px]" />
            Historial
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-on-error-container">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-lg bg-secondary-container px-md py-sm font-body-sm text-on-secondary-container">
          {success}
        </p>
      ) : null}

      {activeOpen ? (
        <section className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-headline-md text-on-surface">Asignaciones activas</h2>
            <div className="relative w-full sm:w-72">
              <MaterialIcon
                name="search"
                className="absolute top-1/2 left-sm -translate-y-1/2 text-outline"
              />
              <input
                className="w-full rounded-lg bg-surface-container-low py-sm pr-md pl-12 font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Buscar empleado o curso..."
                type="search"
                value={activeQuery}
                onChange={(event) => setActiveQuery(event.target.value)}
              />
            </div>
          </div>
          {visibleActive.length === 0 ? (
            <p className="font-body-sm text-on-surface-variant">No hay asignaciones activas.</p>
          ) : (
            <ul className="flex max-h-80 flex-col gap-xs overflow-y-auto">
              {visibleActive.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-sm rounded-lg bg-surface-container-low px-md py-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-label-md text-on-surface">
                      {item.employeeName}{" "}
                      <span className="font-body-sm text-on-surface-variant">
                        · {item.employeeEmail}
                      </span>
                    </p>
                    <p className="truncate font-body-sm text-on-surface">{item.courseTitle}</p>
                    <p className="font-body-sm text-on-surface-variant">
                      Límite: {item.deadline} · {item.assignedAt}
                      {item.message !== "—" ? ` · ${item.message}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    className="shrink-0 rounded-lg bg-error-container px-md py-sm font-label-md text-on-error-container disabled:opacity-50"
                    onClick={() =>
                      unassign(item.id, `"${item.courseTitle}" de ${item.employeeName}`)
                    }
                  >
                    {unassigningId === item.id ? "Quitando..." : "Desasignar"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {historyOpen ? (
        <section className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <h2 className="mb-sm font-headline-md text-on-surface">Asignaciones recientes</h2>
          {history.length === 0 ? (
            <p className="font-body-sm text-on-surface-variant">Aún no hay asignaciones.</p>
          ) : (
            <ul className="flex flex-col gap-xs">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg bg-surface-container-low px-md py-sm font-body-sm text-on-surface"
                >
                  {item.courseCount} cursos → {item.learnerCount} empleados · {item.deadline} ·{" "}
                  {item.createdAt}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <div className="grid flex-1 grid-cols-1 gap-md lg:grid-cols-2 xl:gap-gutter">
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
          <div className="flex flex-col gap-md bg-surface-container-low p-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <MaterialIcon name="group" className="text-[20px] text-primary" />
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Seleccionar empleados
                </h2>
              </div>
              <span className="rounded-full bg-primary px-sm py-xs font-label-sm text-label-sm text-on-primary">
                {selectionLabel(selectedLearnerIds.length)}
              </span>
            </div>
            <div className="relative">
              <MaterialIcon
                name="search"
                className="absolute top-1/2 left-sm -translate-y-1/2 text-outline"
              />
              <input
                className="w-full rounded-lg bg-surface py-sm pr-md pl-12 font-body-md text-body-md text-on-surface outline-none transition-shadow placeholder:text-outline focus:ring-2 focus:ring-primary/20"
                placeholder="Buscar por nombre, correo o cargo..."
                type="search"
                value={learnerQuery}
                onChange={(event) => setLearnerQuery(event.target.value)}
              />
              <button
                className="absolute top-1/2 right-sm -translate-y-1/2 rounded px-sm py-xs font-label-sm text-label-sm text-primary hover:bg-primary/5"
                type="button"
                onClick={cycleLearnerFilter}
              >
                {learnerFilter === "Todos" ? "Filtro" : learnerFilter}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-xs">
            {visibleLearners.length === 0 ? (
              <p className="p-md font-body-sm text-on-surface-variant">
                No hay empleados activos para asignar. Créalos en Accesos.
              </p>
            ) : (
              <ul className="flex flex-col gap-xs">
                {visibleLearners.map((learner) => (
                  <li key={learner.id}>
                    <LearnerRow
                      learner={learner}
                      checked={selectedLearnerIds.includes(learner.id)}
                      onToggle={() =>
                        setSelectedLearnerIds((current) => toggleId(current, learner.id))
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border-t border-outline/10 bg-surface-container-low p-sm">
            <button
              className="w-full rounded-lg bg-surface py-sm font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-variant"
              type="button"
              onClick={selectAllVisible}
            >
              Seleccionar visibles
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-md">
          <div className="flex max-h-[400px] flex-1 flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
            <div className="flex flex-col gap-md bg-surface-container-low p-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                    <MaterialIcon name="library_books" className="text-[20px] text-secondary" />
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Seleccionar cursos
                  </h2>
                </div>
                <span className="rounded-full bg-secondary px-sm py-xs font-label-sm text-label-sm text-on-secondary">
                  {selectionLabel(selectedCourseIds.length)}
                </span>
              </div>
              <div className="relative">
                <MaterialIcon
                  name="search"
                  className="absolute top-1/2 left-sm -translate-y-1/2 text-outline"
                />
                <input
                  className="w-full rounded-lg bg-surface py-sm pr-md pl-12 font-body-md text-body-md text-on-surface outline-none transition-shadow placeholder:text-outline focus:ring-2 focus:ring-secondary/20"
                  placeholder="Buscar por título, categoría o nivel..."
                  type="search"
                  value={courseQuery}
                  onChange={(event) => setCourseQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-xs">
              {visibleCourses.length === 0 ? (
                <p className="p-md font-body-sm text-on-surface-variant">
                  No hay cursos publicados. Publícalos desde el catálogo.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-xs">
                  {visibleCourses.map((course) => (
                    <li key={course.id}>
                      <CourseRow
                        course={course}
                        checked={selectedCourseIds.includes(course.id)}
                        onToggle={() =>
                          setSelectedCourseIds((current) => toggleId(current, course.id))
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
            <div className="flex flex-col gap-md p-md">
              <div className="mb-xs flex items-center gap-sm">
                <MaterialIcon name="tune" className="text-outline" />
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Detalle de la asignación
                </h3>
              </div>
              <div className="flex flex-col gap-sm">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="deadline">
                  Fecha límite
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="calendar_month"
                    className="absolute top-1/2 left-sm -translate-y-1/2 text-outline"
                  />
                  <input
                    id="deadline"
                    className="w-full rounded-lg border border-outline-variant/50 bg-surface py-sm pr-md pl-12 font-body-md text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    type="date"
                    value={deadline}
                    onChange={(event) => setDeadline(event.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-sm">
                <label
                  className="font-label-md text-label-md text-on-surface"
                  htmlFor="custom-message"
                >
                  Mensaje (opcional)
                </label>
                <textarea
                  id="custom-message"
                  className="w-full resize-none rounded-lg border border-outline-variant/50 bg-surface p-sm font-body-md text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Agrega indicaciones o contexto para esta asignación..."
                  rows={3}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 mt-md flex flex-col items-center justify-between gap-md rounded-xl bg-surface-container-lowest/90 p-md shadow-[0_-4px_24px_rgba(0,0,0,0.05)] backdrop-blur-md sm:flex-row">
        <div className="flex flex-col items-center gap-sm text-center sm:flex-row sm:text-left">
          <div
            className="mr-sm flex -space-x-2"
            style={{ opacity: selectedLearners.length > 0 ? 1 : 0.3 }}
          >
            {selectedLearners.slice(0, 2).map((learner) => (
              <div
                key={learner.id}
                className="h-8 w-8 overflow-hidden rounded-full border-2 border-surface-container-lowest bg-surface-variant"
              >
                <LearnerAvatarView avatar={learner.avatar} compact />
              </div>
            ))}
            {overflowCount > 0 ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-surface-container-high font-label-sm text-[10px] text-label-sm text-on-surface-variant">
                +{overflowCount}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface">
              Listo para asignar{" "}
              <span className="font-bold text-secondary">{selectedCourseIds.length}</span> cursos a{" "}
              <span className="font-bold text-primary">{selectedLearnerIds.length}</span> empleados.
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Los empleados verán estos cursos en su catálogo.
            </span>
          </div>
        </div>
        <div className="flex w-full items-center gap-sm sm:w-auto">
          <button
            className="flex-1 rounded-lg bg-surface px-md py-sm font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-variant sm:flex-none"
            type="button"
            onClick={resetForm}
          >
            Cancelar
          </button>
          <button
            className="group flex flex-1 items-center justify-center gap-xs rounded-lg bg-primary px-lg py-sm font-label-md text-label-md text-on-primary shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            type="button"
            disabled={!canAssign}
            onClick={assignCourses}
          >
            <MaterialIcon
              name="send"
              className="text-[20px] transition-transform group-hover:translate-x-1"
            />
            {pending ? "Asignando..." : "Asignar cursos"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LearnerRow({
  learner,
  checked,
  onToggle,
}: Readonly<{ learner: AssignableLearner; checked: boolean; onToggle: () => void }>) {
  return (
    <label className="group flex cursor-pointer items-center gap-md rounded-lg p-sm transition-colors hover:bg-surface-container-low">
      <SelectionBox checked={checked} accent="primary" />
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-variant">
        <LearnerAvatarView avatar={learner.avatar} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-label-md text-label-md text-on-surface transition-colors group-hover:text-primary">
          {learner.name}
        </span>
        <span className="truncate font-body-sm text-body-sm text-on-surface-variant">
          {learner.email}
        </span>
      </div>
      <div className="hidden rounded bg-surface-container px-sm py-xs font-label-sm text-label-sm text-on-surface-variant sm:flex">
        {learner.cohort}
      </div>
      <input className="sr-only" type="checkbox" checked={checked} onChange={onToggle} />
    </label>
  );
}

function CourseRow({
  course,
  checked,
  onToggle,
}: Readonly<{ course: AssignableCourse; checked: boolean; onToggle: () => void }>) {
  return (
    <label className="group flex cursor-pointer items-start gap-md rounded-lg p-sm transition-colors hover:bg-surface-container-low">
      <div className="mt-1">
        <SelectionBox checked={checked} accent="secondary" />
      </div>
      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-surface-variant">
        <CourseCover cover={course.cover} />
        <div className="absolute inset-0 bg-surface-tint/20 mix-blend-multiply" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-label-md text-label-md text-on-surface transition-colors group-hover:text-secondary">
          {course.title}
        </span>
        <span className="line-clamp-1 font-body-sm text-body-sm text-on-surface-variant">
          {course.meta}
        </span>
      </div>
      <input className="sr-only" type="checkbox" checked={checked} onChange={onToggle} />
    </label>
  );
}

function SelectionBox({
  checked,
  accent,
}: Readonly<{ checked: boolean; accent: "primary" | "secondary" }>) {
  const checkedClass =
    accent === "primary" ? "border-primary bg-primary" : "border-secondary bg-secondary";
  const iconClass = accent === "primary" ? "text-on-primary" : "text-on-secondary";

  return (
    <div
      className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${checked ? checkedClass : "border-outline"}`}
    >
      <MaterialIcon
        name="check"
        filled
        className={`text-[16px] transition-opacity ${iconClass} ${checked ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

function LearnerAvatarView({
  avatar,
  compact = false,
}: Readonly<{ avatar: LearnerAvatar; compact?: boolean }>) {
  if (avatar.kind === "photo") {
    return (
      <Image
        src={avatar.src}
        alt={avatar.alt}
        width={compact ? 32 : 40}
        height={compact ? 32 : 40}
        unoptimized
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center font-label-md text-label-md ${compact ? "text-[10px]" : ""} ${avatar.className}`}
    >
      {avatar.initials}
    </div>
  );
}

function CourseCover({ cover }: Readonly<{ cover: AssignableCourseCover }>) {
  if (cover.kind === "photo") {
    return (
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        unoptimized
        className="object-cover"
        sizes="64px"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-tertiary text-on-tertiary">
      <MaterialIcon name={cover.icon} />
    </div>
  );
}
