import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CertificatesGallery } from "@/components/certificates/CertificatesGallery";
import type { EmployeeAvatar } from "@/lib/employee-progress";
import type {
  EmployeeCourseProgress,
  EmployeeDossier,
  EmployeeLessonProgress,
  EmployeeProfileSummary,
} from "@/lib/employees";
import { myCourseStatusLabel, type MyCourseStatus } from "@/lib/my-courses";
import type { CredentialStatus } from "@/lib/credentials";

export function EmployeeDossierScreen({ dossier }: Readonly<{ dossier: EmployeeDossier }>) {
  const { profile, courses, certificates } = dossier;
  const completed = courses.filter((course) => course.status === "completed").length;
  const inProgress = courses.filter(
    (course) => course.status === "in-progress" || course.status === "overdue",
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-lg">
      <Link href="/dashboard" className="font-label-md text-primary hover:underline">
        ← Tablero de empleados
      </Link>

      <ProfileHeader
        profile={profile}
        completed={completed}
        inProgress={inProgress}
        certificateCount={certificates.length}
      />

      <section className="flex flex-col gap-md">
        <div>
          <h2 className="font-headline-md text-on-surface">Cursos y progreso</h2>
          <p className="mt-xs font-body-sm text-on-surface-variant">
            Detalle de lecciones vistas, plazos y certificados emitidos.
          </p>
        </div>
        {courses.length === 0 ? (
          <div className="rounded-xl bg-surface-container-lowest p-lg text-center shadow-sm">
            <MaterialIcon name="school" className="mx-auto text-[40px] text-outline" />
            <p className="mt-sm font-headline-md text-on-surface">Sin cursos</p>
            <p className="mt-xs font-body-sm text-on-surface-variant">
              Este empleado aún no tiene cursos asignados ni avance registrado.
            </p>
            <Link
              href="/assign-courses"
              className="mt-md inline-flex rounded-lg bg-primary px-md py-sm font-label-md text-on-primary"
            >
              Asignar un curso
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            {courses.map((course) => (
              <CourseProgressCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <CertificatesGallery
        certificates={certificates}
        title="Certificados"
        description={`Documentos emitidos a ${profile.name}. Ábrelos para imprimirlos desde el navegador.`}
        emptyTitle="Sin certificados"
        emptyDescription="Cuando complete un curso con certificación, el documento aparecerá aquí para verlo e imprimirlo."
        showCatalogLink={false}
      />
    </div>
  );
}

function ProfileHeader({
  profile,
  completed,
  inProgress,
  certificateCount,
}: Readonly<{
  profile: EmployeeProfileSummary;
  completed: number;
  inProgress: number;
  certificateCount: number;
}>) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-md shadow-sm sm:p-lg">
      <div className="flex flex-col gap-md sm:flex-row sm:items-start">
        <ProfileAvatar avatar={profile.avatar} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-sm">
            <h1 className="font-headline-lg text-on-surface">{profile.name}</h1>
            <StatusPill status={profile.status} />
          </div>
          <p className="mt-xs font-body-md text-on-surface-variant">{profile.jobTitle}</p>
          <p className="mt-xs font-body-sm text-on-surface-variant">{profile.email}</p>
          {profile.cedula ? (
            <p className="mt-xs font-body-sm text-on-surface-variant">Cédula {profile.cedula}</p>
          ) : null}
          {profile.bio ? (
            <p className="mt-sm max-w-2xl font-body-sm text-on-surface">{profile.bio}</p>
          ) : null}
          <p className="mt-sm font-label-sm text-outline">Alta: {profile.createdAtLabel}</p>
        </div>
      </div>
      <div className="mt-md grid grid-cols-2 gap-sm sm:grid-cols-3">
        <Stat label="Cursos completados" value={String(completed)} />
        <Stat label="En curso o vencidos" value={String(inProgress)} />
        <Stat label="Certificados" value={String(certificateCount)} />
      </div>
    </section>
  );
}

function CourseProgressCard({ course }: Readonly<{ course: EmployeeCourseProgress }>) {
  return (
    <article className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="flex flex-col gap-md p-md sm:flex-row">
        <div className="relative h-28 w-full overflow-hidden rounded-lg sm:h-24 sm:w-40">
          <Image
            src={course.coverUrl}
            alt={course.coverAlt}
            fill
            unoptimized
            className="object-cover"
            sizes="160px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-sm">
            <div>
              <h3 className="font-headline-md text-on-surface">{course.title}</h3>
              <p className="mt-xs font-body-sm text-on-surface-variant">
                {course.categoryLabel} · {course.levelLabel}
              </p>
            </div>
            <CourseStatusBadge status={course.status} />
          </div>
          <div className="mt-sm flex items-center gap-sm">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-variant">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
            <span className="font-label-sm text-on-surface-variant">{course.progressPercent}%</span>
          </div>
          <p className="mt-xs font-body-sm text-on-surface-variant">
            {course.lessonsLabel} · Plazo: {course.deadlineLabel}
            {course.assignedLabel ? ` · ${course.assignedLabel}` : null}
          </p>
          {course.message ? (
            <p className="mt-xs font-body-sm text-on-surface">{course.message}</p>
          ) : null}
          <div className="mt-sm flex flex-wrap gap-sm">
            {course.certificateId ? (
              <>
                <Link
                  href={`/certificates/${course.certificateId}`}
                  className="inline-flex items-center gap-xs rounded-lg bg-primary px-sm py-xs font-label-sm text-on-primary"
                >
                  <MaterialIcon name="workspace_premium" className="text-[18px]" />
                  Ver certificado
                </Link>
                <Link
                  href={`/certificates/${course.certificateId}?print=1`}
                  className="inline-flex items-center gap-xs rounded-lg border border-outline-variant/40 px-sm py-xs font-label-sm text-primary"
                >
                  <MaterialIcon name="print" className="text-[18px]" />
                  Imprimir
                </Link>
              </>
            ) : null}
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-xs rounded-lg border border-outline-variant/40 px-sm py-xs font-label-sm text-on-surface-variant"
            >
              <MaterialIcon name="menu_book" className="text-[18px]" />
              Ver curso
            </Link>
          </div>
        </div>
      </div>
      <details className="border-t border-outline-variant/20">
        <summary className="cursor-pointer list-none px-md py-sm font-label-md text-primary hover:bg-surface-container">
          Ver lecciones ({course.lessons.length})
        </summary>
        {course.lessons.length === 0 ? (
          <p className="px-md pb-md font-body-sm text-on-surface-variant">
            Este curso no tiene lecciones.
          </p>
        ) : (
          <ul className="divide-y divide-outline-variant/15 px-md pb-md">
            {course.lessons.map((lesson, index) => (
              <LessonRow key={lesson.id} lesson={lesson} index={index} />
            ))}
          </ul>
        )}
      </details>
    </article>
  );
}

function LessonRow({
  lesson,
  index,
}: Readonly<{ lesson: EmployeeLessonProgress; index: number }>) {
  return (
    <li className="flex items-start gap-sm py-sm">
      <MaterialIcon
        name={lesson.completed ? "check_circle" : "radio_button_unchecked"}
        className={lesson.completed ? "text-primary" : "text-outline"}
      />
      <div className="min-w-0 flex-1">
        <p className="font-label-md text-on-surface">
          {index + 1}. {lesson.title}
        </p>
        <p className="font-body-sm text-on-surface-variant">
          {lesson.kindLabel}
          {lesson.completedAtLabel ? ` · Vista el ${lesson.completedAtLabel}` : " · Pendiente"}
        </p>
      </div>
    </li>
  );
}

function ProfileAvatar({ avatar }: Readonly<{ avatar: EmployeeAvatar }>) {
  if (avatar.kind === "photo") {
    return (
      <Image
        src={avatar.src}
        alt={avatar.alt}
        width={88}
        height={88}
        unoptimized
        className="h-[88px] w-[88px] rounded-full object-cover"
      />
    );
  }
  return (
    <div
      className={`flex h-[88px] w-[88px] items-center justify-center rounded-full font-headline-md ${avatar.className}`}
    >
      {avatar.initials}
    </div>
  );
}

function Stat({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-lg bg-surface-container-low px-sm py-sm">
      <p className="font-label-sm text-on-surface-variant">{label}</p>
      <p className="mt-xs font-headline-md text-on-surface">{value}</p>
    </div>
  );
}

function StatusPill({ status }: Readonly<{ status: CredentialStatus }>) {
  if (status === "locked") {
    return (
      <span className="rounded-full bg-error-container px-sm py-xs font-label-sm text-on-error-container">
        Bloqueado
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="rounded-full bg-surface-container-high px-sm py-xs font-label-sm text-on-surface-variant">
        Pendiente
      </span>
    );
  }
  return (
    <span className="rounded-full bg-primary-container/20 px-sm py-xs font-label-sm text-primary">
      Activo
    </span>
  );
}

function CourseStatusBadge({ status }: Readonly<{ status: MyCourseStatus }>) {
  const className =
    status === "completed"
      ? "bg-primary-container/20 text-primary"
      : status === "overdue"
        ? "bg-error-container text-on-error-container"
        : status === "in-progress"
          ? "bg-secondary-container/20 text-secondary"
          : "bg-surface-container-high text-on-surface-variant";
  return (
    <span className={`rounded-full px-sm py-xs font-label-sm ${className}`}>
      {myCourseStatusLabel(status)}
    </span>
  );
}
