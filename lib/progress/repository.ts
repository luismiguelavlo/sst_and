import "server-only";

import { CERTIFICATE_FALLBACK_COVER } from "@/lib/certificates";
import { maybeIssueCertificate } from "@/lib/certificates/repository";
import { initialsFromName } from "@/lib/credentials";
import { getSql } from "@/lib/db";
import type {
  EmployeeProgressRow,
  EmployeeProgressStats,
  ProgressStatus,
} from "@/lib/employee-progress";
import type { LessonProgressState, MyCourseItem, MyCourseStatus } from "@/lib/my-courses";
import {
  isSstCategory,
  isSstLevel,
  sstCategoryLabel,
  sstLevelLabel,
} from "@/lib/sst";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const AT_RISK_DAYS = 14;

type ProgressQueryRow = {
  user_id: string;
  name: string;
  email: string;
  photo_url: string | null;
  course_title: string | null;
  viewed: number;
  total: number;
  last_viewed_at: Date | null;
  deadline: Date | null;
  is_assigned: boolean;
};

export async function recordLessonView(
  userId: string,
  sectionId: string,
): Promise<{ certificateId: string | null }> {
  if (!UUID_PATTERN.test(userId) || !UUID_PATTERN.test(sectionId)) {
    return { certificateId: null };
  }
  const sql = getSql();
  await sql`
    INSERT INTO campus_sst.lesson_progress (user_id, course_id, section_id)
    SELECT ${userId}::uuid, s.course_id, s.id
    FROM campus_sst.course_sections s
    JOIN campus_sst.users u ON u.id = ${userId}::uuid
    WHERE s.id = ${sectionId}::uuid AND u.role = 'user'
    ON CONFLICT (user_id, section_id) DO UPDATE SET viewed_at = now()
  `;

  try {
    const certificateId = await maybeIssueCertificate(userId, sectionId);
    return { certificateId };
  } catch {
    return { certificateId: null };
  }
}

export async function getCourseLessonProgress(
  userId: string,
  courseId: string,
): Promise<LessonProgressState> {
  const empty: LessonProgressState = {
    viewedSectionIds: [],
    viewedCount: 0,
    totalCount: 0,
    progressPercent: 0,
  };
  if (!UUID_PATTERN.test(userId) || !UUID_PATTERN.test(courseId)) {
    return empty;
  }

  const sql = getSql();
  const [totals, viewed] = await Promise.all([
    sql<{ total: number }[]>`
      SELECT count(*)::int AS total
      FROM campus_sst.course_sections
      WHERE course_id = ${courseId}::uuid
    `,
    sql<{ section_id: string }[]>`
      SELECT section_id::text
      FROM campus_sst.lesson_progress
      WHERE user_id = ${userId}::uuid AND course_id = ${courseId}::uuid
    `,
  ]);

  const totalCount = totals[0]?.total ?? 0;
  const viewedSectionIds = viewed.map((row) => row.section_id);
  const viewedCount = viewedSectionIds.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.min(100, Math.round((viewedCount / totalCount) * 100));

  return { viewedSectionIds, viewedCount, totalCount, progressPercent };
}

export async function listMyCoursesForUser(userId: string): Promise<MyCourseItem[]> {
  if (!UUID_PATTERN.test(userId)) {
    return [];
  }

  const sql = getSql();
  const rows = await sql<
    {
      id: string;
      slug: string;
      title: string;
      category: string;
      level: string;
      cover_url: string | null;
      deadline: Date | null;
      message: string | null;
      assigned_at: Date | null;
      is_assigned: boolean;
      viewed: number;
      total: number;
      first_section_id: string | null;
    }[]
  >`
    WITH my_courses AS (
      SELECT DISTINCT course_id
      FROM campus_sst.course_assignments
      WHERE user_id = ${userId}::uuid
      UNION
      SELECT DISTINCT course_id
      FROM campus_sst.lesson_progress
      WHERE user_id = ${userId}::uuid
    ),
    section_totals AS (
      SELECT course_id, count(*)::int AS total
      FROM campus_sst.course_sections
      GROUP BY course_id
    ),
    viewed AS (
      SELECT course_id, count(DISTINCT section_id)::int AS viewed
      FROM campus_sst.lesson_progress
      WHERE user_id = ${userId}::uuid
      GROUP BY course_id
    ),
    first_section AS (
      SELECT DISTINCT ON (course_id) course_id, id AS section_id
      FROM campus_sst.course_sections
      ORDER BY course_id, position ASC
    )
    SELECT
      c.id::text,
      c.slug,
      c.title,
      c.category,
      c.level,
      c.cover_url,
      a.deadline,
      a.message,
      a.created_at AS assigned_at,
      (a.id IS NOT NULL) AS is_assigned,
      coalesce(v.viewed, 0)::int AS viewed,
      coalesce(st.total, 0)::int AS total,
      fs.section_id::text AS first_section_id
    FROM my_courses mc
    JOIN campus_sst.courses c ON c.id = mc.course_id
    LEFT JOIN campus_sst.course_assignments a
      ON a.course_id = c.id AND a.user_id = ${userId}::uuid
    LEFT JOIN section_totals st ON st.course_id = c.id
    LEFT JOIN viewed v ON v.course_id = c.id
    LEFT JOIN first_section fs ON fs.course_id = c.id
    WHERE c.status = 'published'
    ORDER BY
      CASE WHEN a.deadline IS NOT NULL THEN 0 ELSE 1 END,
      a.deadline ASC NULLS LAST,
      c.title ASC
  `;

  return rows
    .filter((row): row is typeof row & { category: import("@/lib/sst").SstCategory; level: import("@/lib/sst").SstLevel } =>
      isSstCategory(row.category) && isSstLevel(row.level),
    )
    .map((row) => {
      const viewed = Math.min(row.viewed, row.total);
      const progressPercent =
        row.total === 0 ? 0 : Math.min(100, Math.round((viewed / row.total) * 100));
      const status = resolveMyCourseStatus(viewed, row.total, row.deadline);
      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        categoryLabel: sstCategoryLabel(row.category),
        levelLabel: sstLevelLabel(row.level),
        coverUrl: row.cover_url ?? CERTIFICATE_FALLBACK_COVER,
        coverAlt: `Portada de ${row.title}`,
        progressPercent,
        lessonsLabel: row.total === 0 ? "Sin lecciones" : `${viewed} / ${row.total} lecciones`,
        status,
        deadlineLabel: row.deadline
          ? formatDeadline(row.deadline)
          : row.is_assigned
            ? "Sin fecha límite"
            : "Sin plazo",
        deadlineIso: row.deadline ? row.deadline.toISOString().slice(0, 10) : null,
        message: row.message?.trim() || null,
        assignedLabel: row.assigned_at ? formatAssigned(row.assigned_at) : null,
        isAssigned: row.is_assigned,
        firstLessonId: row.first_section_id,
      };
    });
}

function resolveMyCourseStatus(
  viewed: number,
  total: number,
  deadline: Date | null,
): MyCourseStatus {
  if (total > 0 && viewed >= total) {
    return "completed";
  }
  if (deadline) {
    const end = new Date(deadline);
    end.setHours(23, 59, 59, 999);
    if (Date.now() > end.getTime() && viewed < total) {
      return "overdue";
    }
  }
  if (viewed === 0) {
    return "not-started";
  }
  return "in-progress";
}

function formatDeadline(date: Date): string {
  return new Intl.DateTimeFormat("es-CR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAssigned(date: Date): string {
  return `Asignado el ${formatDeadline(date)}`;
}

export async function loadEmployeeProgressDashboard(): Promise<{
  stats: EmployeeProgressStats;
  rows: EmployeeProgressRow[];
}> {
  const sql = getSql();
  const rows = await sql<ProgressQueryRow[]>`
    WITH enrollments AS (
      SELECT
        a.user_id,
        a.course_id,
        a.deadline,
        true AS is_assigned
      FROM campus_sst.course_assignments a
      UNION
      SELECT
        p.user_id,
        p.course_id,
        NULL::date AS deadline,
        false AS is_assigned
      FROM campus_sst.lesson_progress p
      WHERE NOT EXISTS (
        SELECT 1
        FROM campus_sst.course_assignments a
        WHERE a.user_id = p.user_id AND a.course_id = p.course_id
      )
      GROUP BY p.user_id, p.course_id
    ),
    progress AS (
      SELECT
        p.user_id,
        p.course_id,
        count(DISTINCT p.section_id)::int AS viewed,
        max(p.viewed_at) AS last_viewed_at
      FROM campus_sst.lesson_progress p
      GROUP BY p.user_id, p.course_id
    ),
    sections AS (
      SELECT course_id, count(*)::int AS total
      FROM campus_sst.course_sections
      GROUP BY course_id
    )
    SELECT
      u.id::text AS user_id,
      u.name,
      u.email,
      u.photo_url,
      c.title AS course_title,
      coalesce(pr.viewed, 0)::int AS viewed,
      coalesce(sec.total, 0)::int AS total,
      pr.last_viewed_at,
      e.deadline,
      coalesce(e.is_assigned, false) AS is_assigned
    FROM campus_sst.users u
    LEFT JOIN enrollments e ON e.user_id = u.id
    LEFT JOIN campus_sst.courses c ON c.id = e.course_id
    LEFT JOIN progress pr ON pr.user_id = u.id AND pr.course_id = e.course_id
    LEFT JOIN sections sec ON sec.course_id = e.course_id
    WHERE u.role = 'user'
    ORDER BY
      u.name ASC,
      CASE WHEN e.deadline IS NOT NULL THEN 0 ELSE 1 END,
      e.deadline ASC NULLS LAST,
      c.title ASC NULLS LAST
  `;

  const mapped = rows.map(toProgressRow);
  const withCourse = mapped.filter((row) => row.courseTitle !== "Sin cursos");
  const started = withCourse.filter((row) => row.status !== "not-started");
  const avgProgress =
    started.length === 0
      ? 0
      : Math.round(started.reduce((sum, row) => sum + row.progressPercent, 0) / started.length);

  const previewSeen = new Set<string>();
  const previews: { src: string; alt: string }[] = [];
  for (const row of mapped) {
    if (row.avatar.kind !== "photo" || previewSeen.has(row.avatar.src) || previews.length >= 3) {
      continue;
    }
    previewSeen.add(row.avatar.src);
    previews.push({ src: row.avatar.src, alt: row.avatar.alt });
  }

  const activeEmployees = await sql<[{ count: number }]>`
    SELECT count(*)::int AS count
    FROM campus_sst.users
    WHERE role = 'user' AND status = 'active'
  `;

  return {
    stats: {
      totalCompletions: withCourse.filter((row) => row.status === "completed").length,
      avgProgress,
      activeEmployees: activeEmployees[0]?.count ?? 0,
      previews,
    },
    rows: mapped,
  };
}

function toProgressRow(row: ProgressQueryRow): EmployeeProgressRow {
  const hasCourse = Boolean(row.course_title);
  const total = hasCourse ? row.total : 0;
  const viewed = hasCourse ? Math.min(row.viewed, total) : 0;
  const progressPercent = total === 0 ? 0 : Math.round((viewed / total) * 100);
  const status = hasCourse
    ? resolveStatus(viewed, total, row.last_viewed_at, row.deadline)
    : "not-started";
  const photo = row.photo_url && row.photo_url.startsWith("http") ? row.photo_url : null;

  return {
    id: `${row.user_id}-${row.course_title ?? "none"}-${row.deadline?.toISOString() ?? "na"}`,
    name: row.name,
    email: row.email,
    courseTitle: row.course_title ?? "Sin cursos",
    status,
    progressPercent,
    lessonsLabel: !hasCourse || total === 0 ? "—" : `${viewed} / ${total}`,
    activityLabel: row.last_viewed_at
      ? formatActivity(row.last_viewed_at)
      : hasCourse
        ? "Sin iniciar"
        : "—",
    deadlineLabel: row.deadline
      ? formatDeadline(row.deadline)
      : row.is_assigned
        ? "Sin fecha límite"
        : hasCourse
          ? "—"
          : "—",
    isAssigned: row.is_assigned,
    avatar: photo
      ? { kind: "photo", src: photo, alt: `Foto de ${row.name}` }
      : {
          kind: "initials",
          initials: initialsFromName(row.name),
          className: "bg-primary-container text-on-primary-container",
        },
  };
}

function resolveStatus(
  viewed: number,
  total: number,
  lastViewedAt: Date | null,
  deadline: Date | null,
): ProgressStatus {
  if (total > 0 && viewed >= total) {
    return "completed";
  }
  if (deadline) {
    const end = new Date(deadline);
    end.setHours(23, 59, 59, 999);
    if (Date.now() > end.getTime() && viewed < total) {
      return "at-risk";
    }
  }
  if (total === 0 || viewed === 0) {
    return "not-started";
  }
  if (lastViewedAt) {
    const elapsed = Date.now() - lastViewedAt.getTime();
    if (elapsed > AT_RISK_DAYS * 24 * 60 * 60 * 1000) {
      return "at-risk";
    }
  }
  return "in-progress";
}

function formatActivity(date: Date): string {
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "short" }).format(date);
}
