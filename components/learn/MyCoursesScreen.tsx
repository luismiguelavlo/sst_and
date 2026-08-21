import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { courseDetailPath, courseLessonPath } from "@/lib/courses";
import { myCourseStatusLabel, type MyCourseItem } from "@/lib/my-courses";

export function MyCoursesScreen({
  courses,
}: Readonly<{ courses: readonly MyCourseItem[] }>) {
  const overdue = courses.filter((course) => course.status === "overdue").length;
  const inProgress = courses.filter((course) => course.status === "in-progress").length;
  const completed = courses.filter((course) => course.status === "completed").length;

  return (
    <div className="flex w-full flex-col gap-lg">
      <div>
        <h1 className="mb-xs font-headline-lg text-primary">Mis cursos</h1>
        <p className="max-w-2xl font-body-md text-on-surface-variant">
          Aquí ves los cursos asignados y los que ya empezaste, con plazos, mensajes del equipo SST
          y tu avance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-sm sm:grid-cols-3">
        <StatCard label="En curso" value={String(inProgress)} icon="play_circle" />
        <StatCard label="Vencidos" value={String(overdue)} icon="event_busy" />
        <StatCard label="Completados" value={String(completed)} icon="task_alt" />
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-low/50 px-md py-xl text-center">
          <MaterialIcon name="school" className="mb-sm text-[40px] text-outline" />
          <h2 className="font-headline-md text-on-surface">Aún no tienes cursos</h2>
          <p className="mt-xs font-body-md text-on-surface-variant">
            Cuando te asignen un módulo o explores el catálogo y abras una lección, aparecerá aquí.
          </p>
          <Link
            href="/course-catalog"
            className="mt-md inline-flex items-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary"
          >
            Explorar cursos
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-md">
          {courses.map((course) => (
            <li key={course.id}>
              <MyCourseCard course={course} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: Readonly<{ label: string; value: string; icon: string }>) {
  return (
    <div className="flex items-center gap-md rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MaterialIcon name={icon} />
      </div>
      <div>
        <p className="font-headline-md text-on-surface">{value}</p>
        <p className="font-label-sm text-on-surface-variant">{label}</p>
      </div>
    </div>
  );
}

function MyCourseCard({ course }: Readonly<{ course: MyCourseItem }>) {
  const continueHref = course.firstLessonId
    ? courseLessonPath(course.slug, course.firstLessonId)
    : courseDetailPath(course.slug);

  return (
    <article className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="relative min-h-40 md:col-span-3">
          <Image
            src={course.coverUrl}
            alt={course.coverAlt}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        <div className="flex flex-col gap-sm p-md md:col-span-9 md:p-lg">
          <div className="flex flex-wrap items-center gap-xs">
            <StatusBadge status={course.status} />
            {course.isAssigned ? (
              <span className="rounded-full bg-secondary-container px-sm py-xs font-label-sm text-on-secondary-container">
                Asignado
              </span>
            ) : (
              <span className="rounded-full bg-surface-container-high px-sm py-xs font-label-sm text-on-surface-variant">
                Iniciado por ti
              </span>
            )}
            <span className="rounded-full bg-surface-container-high px-sm py-xs font-label-sm text-on-surface-variant">
              {course.categoryLabel}
            </span>
          </div>

          <div>
            <h2 className="font-headline-md text-on-surface">{course.title}</h2>
            <p className="mt-xs font-body-sm text-on-surface-variant">
              {course.levelLabel} · {course.lessonsLabel}
              {course.assignedLabel ? ` · ${course.assignedLabel}` : ""}
            </p>
          </div>

          <div className="flex flex-col gap-xs">
            <div className="flex items-center justify-between gap-sm">
              <span className="font-label-sm text-on-surface-variant">Avance</span>
              <span className="font-label-sm text-on-surface">{course.progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-md">
            <p className="flex items-center gap-xs font-body-sm text-on-surface-variant">
              <MaterialIcon name="event" className="text-[18px]" />
              Plazo: {course.deadlineLabel}
            </p>
          </div>

          {course.message ? (
            <div className="rounded-lg bg-surface-container-low px-md py-sm">
              <p className="mb-xs font-label-sm text-on-surface-variant">Mensaje de asignación</p>
              <p className="whitespace-pre-wrap font-body-sm text-on-surface">{course.message}</p>
            </div>
          ) : null}

          <div className="mt-xs flex flex-wrap gap-sm">
            <Link
              href={continueHref}
              className="inline-flex items-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary"
            >
              {course.progressPercent > 0 ? "Continuar" : "Empezar"}
              <MaterialIcon name="arrow_forward" className="text-[18px]" />
            </Link>
            <Link
              href={courseDetailPath(course.slug)}
              className="inline-flex items-center gap-xs rounded-lg border border-outline-variant/40 px-md py-sm font-label-md text-primary"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }: Readonly<{ status: MyCourseItem["status"] }>) {
  const className =
    status === "completed"
      ? "bg-primary/10 text-primary"
      : status === "overdue"
        ? "bg-error-container text-on-error-container"
        : status === "in-progress"
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-surface-container-high text-on-surface-variant";

  return (
    <span className={`rounded-full px-sm py-xs font-label-sm ${className}`}>
      {myCourseStatusLabel(status)}
    </span>
  );
}
