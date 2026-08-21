import "server-only";

import { cache } from "react";
import type { Course, CourseLevel } from "@/lib/courses";
import type { CourseEditorData } from "@/lib/course-draft";
import { initialsFromName } from "@/lib/credentials";
import { getSql } from "@/lib/db";
import {
  createEmptyQuizData,
  isQuizData,
  type QuizData,
} from "@/lib/quiz";
import {
  isCourseSectionKind,
  isSstCategory,
  isSstLevel,
  sstCategoryLabel,
  sstLevelLabel,
  type CourseSectionKind,
  type SstCategory,
  type SstLevel,
} from "@/lib/sst";

export type { CourseEditorData };

export type CourseRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: SstCategory;
  level: SstLevel;
  cover_url: string | null;
  cover_public_id: string | null;
  is_public: boolean;
  issue_certificate: boolean;
  enable_discussions: boolean;
  status: "draft" | "published";
  created_by: string | null;
  author_name: string | null;
  created_at: Date;
};

export type SectionRecord = {
  id: string;
  course_id: string;
  position: number;
  title: string;
  kind: CourseSectionKind;
  body: string | null;
  youtube_url: string | null;
  media_url: string | null;
  media_public_id: string | null;
  media_filename: string | null;
  quiz_data: QuizData | null;
};

export type CourseDraftInput = {
  title: string;
  description: string;
  category: SstCategory;
  level: SstLevel;
  coverUrl?: string;
  coverPublicId?: string;
  isPublic: boolean;
  issueCertificate: boolean;
  enableDiscussions: boolean;
  status: "draft" | "published";
  createdBy: string;
  sections: readonly {
    id?: string;
    title: string;
    kind: CourseSectionKind;
    body: string;
    youtubeUrl: string;
    mediaUrl: string;
    mediaPublicId: string;
    mediaFilename: string;
    quiz: QuizData;
  }[];
};

export type CourseWithSections = CourseRecord & {
  sections: SectionRecord[];
};

export async function createCourseRecord(input: CourseDraftInput): Promise<{ id: string; slug: string }> {
  const sql = getSql();
  const slug = await uniqueSlug(slugify(input.title));

  return sql.begin(async (tx) => {
    const rows = await tx<CourseRecord[]>`
      INSERT INTO campus_sst.courses (
        slug, title, description, category, level, cover_url, cover_public_id,
        is_public, issue_certificate, enable_discussions, status, created_by
      )
      VALUES (
        ${slug},
        ${input.title.trim()},
        ${input.description.trim()},
        ${input.category},
        ${input.level},
        ${input.coverUrl ?? null},
        ${input.coverPublicId ?? null},
        ${input.isPublic},
        ${input.issueCertificate},
        ${input.enableDiscussions},
        ${input.status},
        ${input.createdBy}::uuid
      )
      RETURNING id::text, slug
    `;
    const course = rows[0];
    if (!course) {
      throw new Error("No se pudo crear el curso.");
    }

    for (const [index, section] of input.sections.entries()) {
      const quizPayload = section.kind === "quiz" ? section.quiz : null;
      await tx`
        INSERT INTO campus_sst.course_sections (
          course_id, position, title, kind, body, youtube_url, media_url, media_public_id, media_filename, quiz_data
        )
        VALUES (
          ${course.id}::uuid,
          ${index + 1},
          ${section.title.trim()},
          ${section.kind},
          ${section.body.trim() || null},
          ${section.youtubeUrl.trim() || null},
          ${section.mediaUrl.trim() || null},
          ${section.mediaPublicId.trim() || null},
          ${section.mediaFilename.trim() || null},
          ${quizPayload ? tx.json(quizPayload) : null}
        )
      `;
    }

    return { id: course.id, slug: course.slug };
  });
}

export async function listCatalogCourses(options: {
  includeDrafts: boolean;
  viewerUserId?: string;
}): Promise<Course[]> {
  const sql = getSql();
  const viewerUserId = options.viewerUserId ?? null;
  const rows = options.includeDrafts
    ? await sql<(CourseRecord & { section_count: number })[]>`
        SELECT
          c.id::text,
          c.slug,
          c.title,
          c.description,
          c.category,
          c.level,
          c.cover_url,
          c.cover_public_id,
          c.is_public,
          c.issue_certificate,
          c.enable_discussions,
          c.status,
          c.created_by::text,
          u.name AS author_name,
          c.created_at,
          count(s.id)::int AS section_count
        FROM campus_sst.courses c
        LEFT JOIN campus_sst.users u ON u.id = c.created_by
        LEFT JOIN campus_sst.course_sections s ON s.course_id = c.id
        GROUP BY c.id, u.name
        ORDER BY c.created_at DESC
      `
    : viewerUserId
      ? await sql<(CourseRecord & { section_count: number })[]>`
          SELECT
            c.id::text,
            c.slug,
            c.title,
            c.description,
            c.category,
            c.level,
            c.cover_url,
            c.cover_public_id,
            c.is_public,
            c.issue_certificate,
            c.enable_discussions,
            c.status,
            c.created_by::text,
            u.name AS author_name,
            c.created_at,
            count(s.id)::int AS section_count
          FROM campus_sst.courses c
          LEFT JOIN campus_sst.users u ON u.id = c.created_by
          LEFT JOIN campus_sst.course_sections s ON s.course_id = c.id
          WHERE c.status = 'published'
            AND (
              c.is_public = true
              OR EXISTS (
                SELECT 1
                FROM campus_sst.course_assignments a
                WHERE a.course_id = c.id AND a.user_id = ${viewerUserId}::uuid
              )
            )
          GROUP BY c.id, u.name
          ORDER BY c.created_at DESC
        `
      : await sql<(CourseRecord & { section_count: number })[]>`
          SELECT
            c.id::text,
            c.slug,
            c.title,
            c.description,
            c.category,
            c.level,
            c.cover_url,
            c.cover_public_id,
            c.is_public,
            c.issue_certificate,
            c.enable_discussions,
            c.status,
            c.created_by::text,
            u.name AS author_name,
            c.created_at,
            count(s.id)::int AS section_count
          FROM campus_sst.courses c
          LEFT JOIN campus_sst.users u ON u.id = c.created_by
          LEFT JOIN campus_sst.course_sections s ON s.course_id = c.id
          WHERE c.status = 'published' AND c.is_public = true
          GROUP BY c.id, u.name
          ORDER BY c.created_at DESC
        `;

  return rows
    .filter((row) => isSstCategory(row.category) && isSstLevel(row.level))
    .map((row) => toCatalogCourse(row, row.section_count));
}

export const getCourseWithSections = cache(async (
  slug: string,
  includeDrafts: boolean,
  viewerUserId?: string,
): Promise<CourseWithSections | null> => {
  const sql = getSql();
  const courses = includeDrafts
    ? await sql<CourseRecord[]>`
        SELECT
          c.id::text,
          c.slug,
          c.title,
          c.description,
          c.category,
          c.level,
          c.cover_url,
          c.cover_public_id,
          c.is_public,
          c.issue_certificate,
          c.enable_discussions,
          c.status,
          c.created_by::text,
          u.name AS author_name,
          c.created_at
        FROM campus_sst.courses c
        LEFT JOIN campus_sst.users u ON u.id = c.created_by
        WHERE c.slug = ${slug}
        LIMIT 1
      `
    : viewerUserId
      ? await sql<CourseRecord[]>`
          SELECT
            c.id::text,
            c.slug,
            c.title,
            c.description,
            c.category,
            c.level,
            c.cover_url,
            c.cover_public_id,
            c.is_public,
            c.issue_certificate,
            c.enable_discussions,
            c.status,
            c.created_by::text,
            u.name AS author_name,
            c.created_at
          FROM campus_sst.courses c
          LEFT JOIN campus_sst.users u ON u.id = c.created_by
          WHERE c.slug = ${slug}
            AND c.status = 'published'
            AND (
              c.is_public = true
              OR EXISTS (
                SELECT 1
                FROM campus_sst.course_assignments a
                WHERE a.course_id = c.id AND a.user_id = ${viewerUserId}::uuid
              )
            )
          LIMIT 1
        `
      : await sql<CourseRecord[]>`
          SELECT
            c.id::text,
            c.slug,
            c.title,
            c.description,
            c.category,
            c.level,
            c.cover_url,
            c.cover_public_id,
            c.is_public,
            c.issue_certificate,
            c.enable_discussions,
            c.status,
            c.created_by::text,
            u.name AS author_name,
            c.created_at
          FROM campus_sst.courses c
          LEFT JOIN campus_sst.users u ON u.id = c.created_by
          WHERE c.slug = ${slug} AND c.status = 'published' AND c.is_public = true
          LIMIT 1
        `;

  const course = courses[0];
  if (!course || !isSstCategory(course.category) || !isSstLevel(course.level)) {
    return null;
  }

  const sections = await sql<SectionRecord[]>`
    SELECT
      id::text,
      course_id::text,
      position,
      title,
      kind,
      body,
      youtube_url,
      media_url,
      media_public_id,
      media_filename,
      quiz_data
    FROM campus_sst.course_sections
    WHERE course_id = ${course.id}::uuid
    ORDER BY position ASC
  `;

  return {
    ...course,
    category: course.category,
    level: course.level,
    sections: sections
      .filter((section) => isCourseSectionKind(section.kind))
      .map((section) => ({
        ...section,
        quiz_data: normalizeQuizData(section.quiz_data),
      })),
  };
});

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getCourseForEditor(slug: string): Promise<CourseEditorData | null> {
  const course = await getCourseWithSections(slug, true);
  if (!course) {
    return null;
  }
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    coverUrl: course.cover_url ?? "",
    coverPublicId: course.cover_public_id ?? "",
    isPublic: course.is_public,
    issueCertificate: course.issue_certificate,
    enableDiscussions: course.enable_discussions,
    status: course.status,
    sections: course.sections.map((section) => ({
      id: section.id,
      title: section.title,
      kind: section.kind,
      body: section.body ?? "",
      youtubeUrl: section.youtube_url ?? "",
      mediaUrl: section.media_url ?? "",
      mediaPublicId: section.media_public_id ?? "",
      mediaFilename: section.media_filename ?? "",
      quiz: section.quiz_data ?? createEmptyQuizData(),
    })),
  };
}

export async function getSectionQuizData(sectionId: string): Promise<{
  courseId: string;
  quiz: QuizData;
} | null> {
  if (!UUID_PATTERN.test(sectionId)) {
    return null;
  }
  const sql = getSql();
  const rows = await sql<{ course_id: string; kind: string; quiz_data: unknown }[]>`
    SELECT course_id::text, kind, quiz_data
    FROM campus_sst.course_sections
    WHERE id = ${sectionId}::uuid
    LIMIT 1
  `;
  const row = rows[0];
  if (!row || row.kind !== "quiz" || !isQuizData(row.quiz_data)) {
    return null;
  }
  return { courseId: row.course_id, quiz: row.quiz_data };
}

export async function updateCourseRecord(
  courseId: string,
  input: Omit<CourseDraftInput, "createdBy">,
): Promise<{ id: string; slug: string }> {
  if (!UUID_PATTERN.test(courseId)) {
    throw new Error("Curso inválido.");
  }
  const sql = getSql();

  return sql.begin(async (tx) => {
    const existing = await tx<{ id: string; slug: string }[]>`
      SELECT id::text, slug
      FROM campus_sst.courses
      WHERE id = ${courseId}::uuid
      LIMIT 1
    `;
    const course = existing[0];
    if (!course) {
      throw new Error("El curso no existe.");
    }

    await tx`
      UPDATE campus_sst.courses SET
        title = ${input.title.trim()},
        description = ${input.description.trim()},
        category = ${input.category},
        level = ${input.level},
        cover_url = ${input.coverUrl ?? null},
        cover_public_id = ${input.coverPublicId ?? null},
        is_public = ${input.isPublic},
        issue_certificate = ${input.issueCertificate},
        enable_discussions = ${input.enableDiscussions},
        status = ${input.status},
        updated_at = now()
      WHERE id = ${courseId}::uuid
    `;

    const keptIds: string[] = [];
    for (const [index, section] of input.sections.entries()) {
      const position = index + 1;
      const sectionId = section.id ?? "";
      const canReuse = UUID_PATTERN.test(sectionId);
      const quizPayload = section.kind === "quiz" ? section.quiz : null;
      if (canReuse) {
        const updated = await tx<{ id: string }[]>`
          UPDATE campus_sst.course_sections SET
            position = ${position},
            title = ${section.title.trim()},
            kind = ${section.kind},
            body = ${section.body.trim() || null},
            youtube_url = ${section.youtubeUrl.trim() || null},
            media_url = ${section.mediaUrl.trim() || null},
            media_public_id = ${section.mediaPublicId.trim() || null},
            media_filename = ${section.mediaFilename.trim() || null},
            quiz_data = ${quizPayload ? tx.json(quizPayload) : null},
            updated_at = now()
          WHERE id = ${sectionId}::uuid AND course_id = ${courseId}::uuid
          RETURNING id::text
        `;
        if (updated[0]?.id) {
          keptIds.push(updated[0].id);
          continue;
        }
      }

      const inserted = await tx<{ id: string }[]>`
        INSERT INTO campus_sst.course_sections (
          course_id, position, title, kind, body, youtube_url, media_url, media_public_id, media_filename, quiz_data
        )
        VALUES (
          ${courseId}::uuid,
          ${position},
          ${section.title.trim()},
          ${section.kind},
          ${section.body.trim() || null},
          ${section.youtubeUrl.trim() || null},
          ${section.mediaUrl.trim() || null},
          ${section.mediaPublicId.trim() || null},
          ${section.mediaFilename.trim() || null},
          ${quizPayload ? tx.json(quizPayload) : null}
        )
        RETURNING id::text
      `;
      if (inserted[0]?.id) {
        keptIds.push(inserted[0].id);
      }
    }

    if (keptIds.length === 0) {
      await tx`DELETE FROM campus_sst.course_sections WHERE course_id = ${courseId}::uuid`;
    } else {
      await tx`
        DELETE FROM campus_sst.course_sections
        WHERE course_id = ${courseId}::uuid
          AND id NOT IN ${tx(keptIds)}
      `;
    }

    return { id: course.id, slug: course.slug };
  });
}

function normalizeQuizData(value: unknown): QuizData | null {
  return isQuizData(value) ? value : null;
}

export async function setCourseStatus(
  slug: string,
  status: "draft" | "published",
): Promise<{ slug: string; status: "draft" | "published" }> {
  const sql = getSql();
  const rows = await sql<{ slug: string; status: "draft" | "published" }[]>`
    UPDATE campus_sst.courses
    SET status = ${status}, updated_at = now()
    WHERE slug = ${slug}
    RETURNING slug, status
  `;
  const row = rows[0];
  if (!row) {
    throw new Error("El curso no existe.");
  }
  return row;
}

export async function deleteCourseRecord(slug: string): Promise<void> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    DELETE FROM campus_sst.courses
    WHERE slug = ${slug}
    RETURNING id::text
  `;
  if (!rows[0]) {
    throw new Error("El curso no existe.");
  }
}

function toCatalogCourse(row: CourseRecord & { section_count: number }, sectionCount: number): Course {
  const author = row.author_name ?? "Equipo SST";
  return {
    id: row.slug,
    title: row.title,
    description: row.description,
    category: sstCategoryLabel(row.category),
    level: sstLevelLabel(row.level) as CourseLevel,
    weeks: Math.max(1, sectionCount),
    rating: 0,
    popularity: row.created_at.getTime(),
    instructor: {
      name: author,
      initials: initialsFromName(author),
      avatarClassName: "bg-primary-container text-on-primary-container",
    },
    imageUrl: row.cover_url ?? FALLBACK_COVER,
    imageAlt: `Portada del curso ${row.title}`,
    durationLabel: sectionCount === 1 ? "1 lección" : `${sectionCount} lecciones`,
    status: row.status,
  };
}

const FALLBACK_COVER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAv-fQJ7vcfgqu3LwFkbBlAZv0tXuQCIilb8DYMIfnuLjcwSLLeP4eQv3BHrPuPXzJqb1wI6J1C7sVwx-6AisNOJ0JLVsAWdPi6QjYjF1eUbFafspt7ZFxHCtf-8sZHI1JAwt_mEb2_RfB8mleWOzcye282ObZYkSU-Cgiw_KsSq2hL_c7eT1YR9A1o0IGy3UyxhKM9icu_L_C9_5cLyMgNUG5oO5nmMqWXTmRUq2BxeOBPQVjGEoWE";

function slugify(value: string): string {
  const base = value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base.length > 0 ? base : "curso-sst";
}

async function uniqueSlug(base: string): Promise<string> {
  const sql = getSql();
  const existing = await sql<[{ slug: string }]>`
    SELECT slug FROM campus_sst.courses WHERE slug = ${base} OR slug LIKE ${`${base}-%`}
  `;
  const taken = new Set(existing.map((row) => row.slug));
  if (!taken.has(base)) {
    return base;
  }
  let index = 2;
  while (taken.has(`${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}
