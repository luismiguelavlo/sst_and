import "server-only";

import { COURSES } from "@/lib/courses";
import { getCourseWithSections, type CourseWithSections } from "@/lib/courses/repository";
import { initialsFromName } from "@/lib/credentials";
import {
  getStaticCourseModule,
  type CourseModule,
  type CourseResource,
  type Lesson,
} from "@/lib/lessons";
import { toPublicQuiz } from "@/lib/quiz";
import { CourseSectionKind, sstCategoryLabel, sstLevelLabel } from "@/lib/sst";

const FALLBACK_COVER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAv-fQJ7vcfgqu3LwFkbBlAZv0tXuQCIilb8DYMIfnuLjcwSLLeP4eQv3BHrPuPXzJqb1wI6J1C7sVwx-6AisNOJ0JLVsAWdPi6QjYjF1eUbFafspt7ZFxHCtf-8sZHI1JAwt_mEb2_RfB8mleWOzcye282ObZYkSU-Cgiw_KsSq2hL_c7eT1YR9A1o0IGy3UyxhKM9icu_L_C9_5cLyMgNUG5oO5nmMqWXTmRUq2BxeOBPQVjGEoWE";

export type CourseOverview = {
  courseId: string | null;
  slug: string;
  title: string;
  description: string;
  categoryLabel: string;
  levelLabel: string;
  coverUrl: string;
  coverAlt: string;
  instructorName: string;
  instructorInitials: string;
  instructorAvatarClassName: string;
  status: "draft" | "published";
  issueCertificate: boolean;
  enableDiscussions: boolean;
  durationLabel: string;
  lessons: readonly Lesson[];
  module: CourseModule;
};

export async function getCourseOverview(
  slug: string,
  options?: { includeDrafts?: boolean; viewerUserId?: string },
): Promise<CourseOverview | undefined> {
  const includeDrafts = options?.includeDrafts ?? false;
  try {
    const dbCourse = await getCourseWithSections(slug, includeDrafts, options?.viewerUserId);
    if (dbCourse) {
      return overviewFromDb(dbCourse);
    }
  } catch {
    // Postgres may be down; fall back to the static catalog.
  }
  return overviewFromStatic(slug);
}

export async function getCourseModule(
  slug: string,
  options?: { includeDrafts?: boolean; viewerUserId?: string },
): Promise<CourseModule | undefined> {
  const overview = await getCourseOverview(slug, options);
  return overview?.module;
}

function overviewFromDb(course: CourseWithSections): CourseOverview {
  const module = moduleFromDb(course);
  const author = course.author_name ?? "Equipo SST";
  const realLessons = course.sections.length;
  return {
    courseId: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    categoryLabel: sstCategoryLabel(course.category),
    levelLabel: sstLevelLabel(course.level),
    coverUrl: module.posterUrl,
    coverAlt: module.posterAlt,
    instructorName: author,
    instructorInitials: initialsFromName(author),
    instructorAvatarClassName: "bg-primary-container text-on-primary-container",
    status: course.status,
    issueCertificate: course.issue_certificate,
    enableDiscussions: course.enable_discussions,
    durationLabel: realLessons === 1 ? "1 lección" : `${realLessons} lecciones`,
    lessons: module.lessons,
    module,
  };
}

function overviewFromStatic(slug: string): CourseOverview | undefined {
  const module = getStaticCourseModule(slug);
  if (!module) {
    return undefined;
  }
  const catalog = COURSES.find((course) => course.id === module.slug || course.id === slug);
  return {
    courseId: null,
    slug: module.slug,
    title: catalog?.title ?? module.courseTitle,
    description: catalog?.description ?? module.lessons[0]?.about[0] ?? "",
    categoryLabel: catalog?.category ?? "Cultura preventiva",
    levelLabel: catalog?.level ?? "Básico",
    coverUrl: module.posterUrl,
    coverAlt: module.posterAlt,
    instructorName: catalog?.instructor.name ?? "Equipo SST",
    instructorInitials: catalog?.instructor.initials ?? "SST",
    instructorAvatarClassName:
      catalog?.instructor.avatarClassName ?? "bg-primary-container text-on-primary-container",
    status: "published",
    issueCertificate: true,
    enableDiscussions: false,
    durationLabel: catalog?.durationLabel ?? `${module.lessons.length} lecciones`,
    lessons: module.lessons,
    module,
  };
}

function moduleFromDb(course: CourseWithSections): CourseModule {
  const lessons: Lesson[] = course.sections.map((section) => ({
    id: section.id,
    kind: section.kind,
    title: section.title,
    durationLabel: durationForKind(section.kind),
    about: section.body
      ? [section.body]
      : section.kind === CourseSectionKind.Quiz
        ? ["Responde todas las preguntas. Debes acertar el 100% para completar esta lección."]
        : [`Revisa el contenido de esta sección: ${section.title}.`],
    totalSeconds: 0,
    startSeconds: 0,
    youtubeUrl: section.youtube_url ?? undefined,
    mediaUrl: section.media_url ?? undefined,
    mediaFilename: section.media_filename ?? undefined,
    quiz:
      section.kind === CourseSectionKind.Quiz && section.quiz_data
        ? toPublicQuiz(section.quiz_data)
        : undefined,
  }));

  const resources: CourseResource[] = course.sections
    .filter((section) => section.kind === CourseSectionKind.Document && section.media_url)
    .map((section) => ({
      name: section.media_filename ?? section.title,
      icon: "picture_as_pdf",
      href: section.media_url ?? undefined,
    }));

  const posterFromImage = lessons.find((lesson) => lesson.kind === "image")?.mediaUrl;

  return {
    slug: course.slug,
    courseTitle: course.title,
    moduleLabel: course.status === "draft" ? "Borrador" : "Curso SST",
    progressPercent: 0,
    posterUrl: course.cover_url ?? posterFromImage ?? FALLBACK_COVER,
    posterAlt: `Portada del curso ${course.title}`,
    lessons:
      lessons.length > 0
        ? lessons
        : [
            {
              id: `${course.slug}-empty`,
              kind: "reading",
              title: course.title,
              durationLabel: "—",
              about: [course.description || "Este curso aún no tiene secciones."],
              totalSeconds: 0,
              startSeconds: 0,
            },
          ],
    resources,
  };
}

function durationForKind(kind: CourseSectionKind): string {
  if (kind === CourseSectionKind.Video) {
    return "YouTube";
  }
  if (kind === CourseSectionKind.UploadedVideo) {
    return "Video";
  }
  if (kind === CourseSectionKind.Image) {
    return "Imagen";
  }
  if (kind === CourseSectionKind.Quiz) {
    return "Evaluación";
  }
  return "Documento";
}
