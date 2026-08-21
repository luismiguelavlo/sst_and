import Image from "next/image";
import Link from "next/link";
import { CourseDiscussions } from "@/components/courses/CourseDiscussions";
import { CourseManageActions } from "@/components/courses/CourseManageActions";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { courseLessonPath, levelBadgeClassName } from "@/lib/courses";
import type { CourseOverview } from "@/lib/courses/load-module";
import type { DiscussionThread } from "@/lib/discussions";
import { lessonKindIcon, lessonKindLabel, type Lesson } from "@/lib/lessons";

export function CourseDetail({
  course,
  canManage,
  discussions = [],
}: Readonly<{
  course: CourseOverview;
  canManage: boolean;
  discussions?: readonly DiscussionThread[];
}>) {
  const firstLesson = course.lessons[0];
  const badgeClass =
    course.levelLabel === "Básico" ||
    course.levelLabel === "Intermedio" ||
    course.levelLabel === "Avanzado"
      ? levelBadgeClassName(course.levelLabel)
      : "bg-surface-container-high text-on-surface";

  return (
    <div className="flex w-full flex-col gap-gutter">
      <nav
        aria-label="Ruta de navegación"
        className="flex flex-wrap items-center gap-xs font-label-md text-on-surface-variant"
      >
        <Link className="transition-colors hover:text-primary" href="/course-catalog">
          Cursos
        </Link>
        <MaterialIcon name="chevron_right" className="text-[16px]" />
        <span className="text-on-surface">{course.title}</span>
      </nav>

      {canManage ? (
        <CourseManageActions slug={course.slug} status={course.status} title={course.title} />
      ) : null}

      <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="relative min-h-56 lg:col-span-5">
            <Image
              src={course.coverUrl}
              alt={course.coverAlt}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="flex flex-col gap-md p-md sm:p-lg lg:col-span-7">
            <div className="flex flex-wrap items-center gap-xs">
              <span className={`rounded-full px-sm py-xs font-label-sm ${badgeClass}`}>
                {course.levelLabel}
              </span>
              <span className="rounded-full bg-surface-container-high px-sm py-xs font-label-sm text-on-surface">
                {course.categoryLabel}
              </span>
              {course.status === "draft" && canManage ? (
                <span className="rounded-full bg-secondary-container px-sm py-xs font-label-sm text-on-secondary-container">
                  Borrador
                </span>
              ) : null}
            </div>
            <div>
              <h1 className="font-headline-lg text-on-surface">{course.title}</h1>
              <p className="mt-sm font-body-md text-on-surface-variant">{course.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-md font-label-md text-on-surface-variant">
              <span className="flex items-center gap-xs">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-label-sm ${course.instructorAvatarClassName}`}
                >
                  {course.instructorInitials}
                </span>
                {course.instructorName}
              </span>
              <span className="flex items-center gap-xs">
                <MaterialIcon name="view_agenda" className="text-[18px]" />
                {course.durationLabel}
              </span>
              {course.issueCertificate ? (
                <span className="flex items-center gap-xs">
                  <MaterialIcon name="workspace_premium" className="text-[18px]" />
                  Certificado al completar
                </span>
              ) : null}
            </div>
            {firstLesson ? (
              <Link
                href={courseLessonPath(course.slug, firstLesson.id)}
                className="inline-flex w-fit items-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90"
              >
                Empezar curso
                <MaterialIcon name="arrow_forward" className="text-[18px]" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-surface-container-lowest p-md shadow-sm sm:p-lg">
        <h2 className="mb-md font-headline-md text-on-surface">Lecciones</h2>
        {course.lessons.length === 0 ? (
          <p className="font-body-md text-on-surface-variant">Este curso aún no tiene lecciones.</p>
        ) : (
          <ol className="flex flex-col">
            {course.lessons.map((lesson, index) => (
              <LessonRow key={lesson.id} slug={course.slug} lesson={lesson} index={index} />
            ))}
          </ol>
        )}
      </section>

      {course.enableDiscussions && course.courseId ? (
        <CourseDiscussions
          courseId={course.courseId}
          courseSlug={course.slug}
          initialThreads={discussions}
        />
      ) : null}
    </div>
  );
}

function LessonRow({
  slug,
  lesson,
  index,
}: Readonly<{ slug: string; lesson: Lesson; index: number }>) {
  return (
    <li className="border-b border-outline-variant/20 last:border-b-0">
      <Link
        href={courseLessonPath(slug, lesson.id)}
        className="group flex items-start gap-md rounded-lg p-sm transition-colors hover:bg-surface-container-low sm:p-md"
      >
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-label-sm text-on-surface-variant">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MaterialIcon name={lessonKindIcon(lesson.kind)} className="text-[18px]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="mb-xs block font-label-sm tracking-wider text-on-surface-variant uppercase">
            {lessonKindLabel(lesson.kind)}
          </span>
          <span className="block font-headline-md text-on-surface group-hover:text-primary">
            {lesson.title}
          </span>
          <span className="mt-xs block font-body-sm text-on-surface-variant">
            {lesson.durationLabel}
          </span>
        </span>
        <MaterialIcon
          name="chevron_right"
          className="mt-2 text-outline transition-colors group-hover:text-primary"
        />
      </Link>
    </li>
  );
}
