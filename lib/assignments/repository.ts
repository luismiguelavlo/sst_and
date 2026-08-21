import "server-only";

import { randomUUID } from "node:crypto";
import type { ActiveAssignment, AssignableCourse, AssignableLearner, AssignmentRecord } from "@/lib/assignments";
import { initialsFromName } from "@/lib/credentials";
import { getSql } from "@/lib/db";
import {
  isSstCategory,
  isSstLevel,
  sstCategoryLabel,
  sstLevelLabel,
  type SstCategory,
  type SstLevel,
} from "@/lib/sst";

type WorkerRow = {
  id: string;
  name: string;
  email: string;
  job_title: string;
  photo_url: string | null;
};

type CourseRow = {
  id: string;
  title: string;
  category: string;
  level: string;
  cover_url: string | null;
  section_count: number;
  is_public: boolean;
};

type HistoryRow = {
  batch_id: string;
  created_at: Date;
  learner_count: number;
  course_count: number;
  deadline: Date | null;
};

const AVATAR_CLASSES = [
  "bg-primary-container text-on-primary-container",
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-container text-on-tertiary-container",
] as const;

export async function listAssignableLearners(): Promise<AssignableLearner[]> {
  const sql = getSql();
  const rows = await sql<WorkerRow[]>`
    SELECT
      id::text,
      name,
      email,
      job_title,
      photo_url
    FROM campus_sst.users
    WHERE role = 'user' AND status IN ('active', 'pending')
    ORDER BY name ASC
  `;

  return rows.map((row, index) => {
    const photo = row.photo_url && row.photo_url.startsWith("http") ? row.photo_url : null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      cohort: row.job_title.trim() || "Empleado",
      avatar: photo
        ? { kind: "photo" as const, src: photo, alt: `Foto de ${row.name}` }
        : {
            kind: "initials" as const,
            initials: initialsFromName(row.name),
            className: AVATAR_CLASSES[index % AVATAR_CLASSES.length] ?? AVATAR_CLASSES[0],
          },
    };
  });
}

export async function listAssignableCourses(): Promise<AssignableCourse[]> {
  const sql = getSql();
  const rows = await sql<CourseRow[]>`
    SELECT
      c.id::text,
      c.title,
      c.category,
      c.level,
      c.cover_url,
      c.is_public,
      count(s.id)::int AS section_count
    FROM campus_sst.courses c
    LEFT JOIN campus_sst.course_sections s ON s.course_id = c.id
    WHERE c.status = 'published'
    GROUP BY c.id
    ORDER BY c.title ASC
  `;

  return rows
    .filter((row) => isSstCategory(row.category) && isSstLevel(row.level))
    .map((row) => {
      const category = sstCategoryLabel(row.category as SstCategory);
      const level = sstLevelLabel(row.level as SstLevel);
      const lessons =
        row.section_count === 1 ? "1 lección" : `${row.section_count} lecciones`;
      const visibility = row.is_public ? "Público" : "Solo asignados";
      return {
        id: row.id,
        title: row.title,
        meta: `${category} · ${level} · ${lessons} · ${visibility}`,
        cover: row.cover_url
          ? { kind: "photo" as const, src: row.cover_url, alt: `Portada de ${row.title}` }
          : { kind: "icon" as const, icon: "menu_book" },
      };
    });
}

export async function listAssignmentHistory(limit = 20): Promise<AssignmentRecord[]> {
  const sql = getSql();
  const rows = await sql<HistoryRow[]>`
    SELECT
      batch_id::text,
      min(created_at) AS created_at,
      count(DISTINCT user_id)::int AS learner_count,
      count(DISTINCT course_id)::int AS course_count,
      max(deadline) AS deadline
    FROM campus_sst.course_assignments
    GROUP BY batch_id
    ORDER BY min(created_at) DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: row.batch_id,
    createdAt: formatDateTime(row.created_at),
    learnerCount: row.learner_count,
    courseCount: row.course_count,
    deadline: row.deadline ? formatDate(row.deadline) : "Sin fecha límite",
  }));
}

export async function createCourseAssignments(input: {
  userIds: readonly string[];
  courseIds: readonly string[];
  assignedBy: string;
  deadline: string | null;
  message: string | null;
}): Promise<{ batchId: string; created: number }> {
  if (input.userIds.length === 0 || input.courseIds.length === 0) {
    throw new Error("Selecciona al menos un empleado y un curso.");
  }

  const sql = getSql();
  const batchId = randomUUID();
  const deadline = parseDeadline(input.deadline);
  const message = input.message?.trim() || null;

  const workers = await sql<{ id: string }[]>`
    SELECT id::text
    FROM campus_sst.users
    WHERE role = 'user'
      AND status IN ('active', 'pending')
      AND id IN ${sql(input.userIds)}
  `;
  const courses = await sql<{ id: string }[]>`
    SELECT id::text
    FROM campus_sst.courses
    WHERE status = 'published'
      AND id IN ${sql(input.courseIds)}
  `;

  if (workers.length === 0) {
    throw new Error("No se encontraron empleados válidos.");
  }
  if (courses.length === 0) {
    throw new Error("No se encontraron cursos publicados.");
  }

  let created = 0;
  await sql.begin(async (tx) => {
    for (const worker of workers) {
      for (const course of courses) {
        await tx`
          INSERT INTO campus_sst.course_assignments (
            batch_id, user_id, course_id, assigned_by, deadline, message
          )
          VALUES (
            ${batchId}::uuid,
            ${worker.id}::uuid,
            ${course.id}::uuid,
            ${input.assignedBy}::uuid,
            ${deadline},
            ${message}
          )
          ON CONFLICT (user_id, course_id) DO UPDATE SET
            batch_id = EXCLUDED.batch_id,
            assigned_by = EXCLUDED.assigned_by,
            deadline = EXCLUDED.deadline,
            message = EXCLUDED.message,
            created_at = now()
        `;
        created += 1;
      }
    }
  });

  return { batchId, created };
}

export async function listActiveAssignments(limit = 100): Promise<ActiveAssignment[]> {
  const sql = getSql();
  const rows = await sql<
    {
      id: string;
      employee_name: string;
      employee_email: string;
      course_title: string;
      deadline: Date | null;
      message: string | null;
      created_at: Date;
    }[]
  >`
    SELECT
      a.id::text,
      u.name AS employee_name,
      u.email AS employee_email,
      c.title AS course_title,
      a.deadline,
      a.message,
      a.created_at
    FROM campus_sst.course_assignments a
    JOIN campus_sst.users u ON u.id = a.user_id
    JOIN campus_sst.courses c ON c.id = a.course_id
    ORDER BY a.created_at DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: row.id,
    employeeName: row.employee_name,
    employeeEmail: row.employee_email,
    courseTitle: row.course_title,
    deadline: row.deadline ? formatDate(row.deadline) : "Sin fecha límite",
    message: row.message?.trim() || "—",
    assignedAt: formatDateTime(row.created_at),
  }));
}

export async function deleteCourseAssignment(assignmentId: string): Promise<void> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assignmentId)) {
    throw new Error("Asignación inválida.");
  }
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    DELETE FROM campus_sst.course_assignments
    WHERE id = ${assignmentId}::uuid
    RETURNING id::text
  `;
  if (!rows[0]) {
    throw new Error("La asignación no existe.");
  }
}

export async function userHasCourseAssignment(userId: string, courseId: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql<[{ exists: boolean }]>`
    SELECT EXISTS (
      SELECT 1
      FROM campus_sst.course_assignments
      WHERE user_id = ${userId}::uuid AND course_id = ${courseId}::uuid
    ) AS exists
  `;
  return rows[0]?.exists ?? false;
}

function parseDeadline(value: string | null): string | null {
  if (!value || value.trim().length === 0) {
    return null;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    throw new Error("La fecha límite no es válida.");
  }
  return value.trim();
}

function formatDate(value: Date): string {
  return value.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value: Date): string {
  return value.toLocaleString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
