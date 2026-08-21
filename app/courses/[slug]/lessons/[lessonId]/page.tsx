import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonWorkspace } from "@/components/learn/LessonWorkspace";
import { logout } from "@/lib/auth/actions";
import { requireAuth } from "@/lib/auth/guards";
import { getCourseOverview } from "@/lib/courses/load-module";
import type { LessonProgressState } from "@/lib/my-courses";
import { getCourseLessonProgress, recordLessonView } from "@/lib/progress/repository";

type LessonPageProps = {
  params: Promise<{ slug: string; lessonId: string }>;
};

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const course = await getCourseOverview(slug, { includeDrafts: true });
  const lesson = course?.lessons.find((item) => item.id === lessonId);
  if (!course || !lesson) {
    return { title: "Lección · Campus SST" };
  }
  return {
    title: `${lesson.title} · ${course.title}`,
    description: lesson.about[0] ?? course.description,
  };
}

export default async function CourseLessonPage({ params }: Readonly<LessonPageProps>) {
  const [{ slug, lessonId }, user] = await Promise.all([params, requireAuth()]);
  const isAdmin = user.role === "admin";
  const course = await getCourseOverview(slug, {
    includeDrafts: isAdmin,
    viewerUserId: isAdmin ? undefined : user.id,
  });
  const lesson = course?.lessons.find((item) => item.id === lessonId);
  if (!course || !lesson) {
    notFound();
  }

  let issuedCertificateId: string | null = null;
  let progress: LessonProgressState = {
    viewedSectionIds: [],
    viewedCount: 0,
    totalCount: course.lessons.length,
    progressPercent: 0,
  };

  if (user.role === "user" && course.courseId) {
    try {
      if (lesson.kind !== "quiz") {
        const result = await recordLessonView(user.id, lesson.id);
        issuedCertificateId = result.certificateId;
      }
      progress = await getCourseLessonProgress(user.id, course.courseId);
    } catch {
      // El avance no debe bloquear la lección.
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body-md text-on-surface">
      <header className="flex items-center justify-between gap-sm border-b border-outline-variant/20 px-md py-sm">
        <Link href="/my-courses" className="font-headline-md text-primary">
          Campus SST
        </Link>
        <div className="flex items-center gap-md">
          <span className="hidden font-label-sm text-on-surface-variant sm:inline">{user.name}</span>
          <form action={logout}>
            <button
              type="submit"
              className="font-label-sm text-on-surface-variant transition-colors hover:text-error"
            >
              Salir
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-md py-lg md:px-lg">
        {issuedCertificateId ? (
          <div className="mb-md flex flex-col gap-sm rounded-xl bg-secondary-container px-md py-sm text-on-secondary-container sm:flex-row sm:items-center sm:justify-between">
            <p className="font-label-md">
              Curso completado. Tu certificado de competencia ya está disponible.
            </p>
            <Link
              href={`/certificates/${issuedCertificateId}`}
              className="rounded-lg bg-primary px-md py-sm font-label-md text-on-primary"
            >
              Ver certificado
            </Link>
          </div>
        ) : null}
        <LessonWorkspace module={course.module} lessonId={lesson.id} progress={progress} />
      </main>
    </div>
  );
}
