import "server-only";

import { initialsFromName } from "@/lib/credentials";
import { getSql } from "@/lib/db";
import type { DiscussionAuthor, DiscussionThread } from "@/lib/discussions";

type DiscussionRow = {
  id: string;
  parent_id: string | null;
  body: string;
  created_at: Date;
  user_id: string;
  name: string;
  job_title: string;
  photo_url: string | null;
  role: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function listCourseDiscussions(
  courseId: string,
  viewer: { id: string; role: "admin" | "user" },
): Promise<DiscussionThread[]> {
  if (!UUID_PATTERN.test(courseId)) {
    return [];
  }

  const sql = getSql();
  const rows = await sql<DiscussionRow[]>`
    SELECT
      d.id::text,
      d.parent_id::text,
      d.body,
      d.created_at,
      u.id::text AS user_id,
      u.name,
      u.job_title,
      u.photo_url,
      u.role
    FROM campus_sst.course_discussions d
    JOIN campus_sst.users u ON u.id = d.user_id
    WHERE d.course_id = ${courseId}::uuid
    ORDER BY d.created_at ASC
  `;

  const roots = rows.filter((row) => row.parent_id === null);
  const replies = rows.filter((row) => row.parent_id !== null);

  return roots.map((root) => ({
    id: root.id,
    body: root.body,
    createdAt: formatDiscussionDate(root.created_at),
    author: toAuthor(root),
    canDelete: viewer.role === "admin" || viewer.id === root.user_id,
    replies: replies
      .filter((reply) => reply.parent_id === root.id)
      .map((reply) => ({
        id: reply.id,
        body: reply.body,
        createdAt: formatDiscussionDate(reply.created_at),
        author: toAuthor(reply),
        canDelete: viewer.role === "admin" || viewer.id === reply.user_id,
      })),
  }));
}

export async function createDiscussionPost(input: {
  courseId: string;
  userId: string;
  body: string;
  parentId?: string | null;
}): Promise<{ id: string }> {
  if (!UUID_PATTERN.test(input.courseId) || !UUID_PATTERN.test(input.userId)) {
    throw new Error("Datos inválidos para la consulta.");
  }
  const body = input.body.trim();
  if (body.length < 2) {
    throw new Error("Escribe un mensaje más largo.");
  }
  if (body.length > 2000) {
    throw new Error("El mensaje no puede superar 2000 caracteres.");
  }

  const sql = getSql();
  const course = await sql<{ id: string; enable_discussions: boolean }[]>`
    SELECT id::text, enable_discussions
    FROM campus_sst.courses
    WHERE id = ${input.courseId}::uuid
    LIMIT 1
  `;
  if (!course[0]) {
    throw new Error("El curso no existe.");
  }
  if (!course[0].enable_discussions) {
    throw new Error("Las consultas están deshabilitadas en este curso.");
  }

  const parentId = input.parentId?.trim() || null;
  if (parentId) {
    if (!UUID_PATTERN.test(parentId)) {
      throw new Error("Respuesta inválida.");
    }
    const parent = await sql<{ id: string; parent_id: string | null }[]>`
      SELECT id::text, parent_id::text
      FROM campus_sst.course_discussions
      WHERE id = ${parentId}::uuid AND course_id = ${input.courseId}::uuid
      LIMIT 1
    `;
    if (!parent[0] || parent[0].parent_id !== null) {
      throw new Error("Solo puedes responder a consultas principales.");
    }
  }

  const inserted = parentId
    ? await sql<{ id: string }[]>`
        INSERT INTO campus_sst.course_discussions (course_id, user_id, parent_id, body)
        VALUES (
          ${input.courseId}::uuid,
          ${input.userId}::uuid,
          ${parentId}::uuid,
          ${body}
        )
        RETURNING id::text
      `
    : await sql<{ id: string }[]>`
        INSERT INTO campus_sst.course_discussions (course_id, user_id, parent_id, body)
        VALUES (
          ${input.courseId}::uuid,
          ${input.userId}::uuid,
          null,
          ${body}
        )
        RETURNING id::text
      `;
  const row = inserted[0];
  if (!row) {
    throw new Error("No se pudo publicar la consulta.");
  }
  return row;
}

export async function deleteDiscussionPost(input: {
  postId: string;
  userId: string;
  role: "admin" | "user";
}): Promise<void> {
  if (!UUID_PATTERN.test(input.postId) || !UUID_PATTERN.test(input.userId)) {
    throw new Error("Consulta inválida.");
  }
  const sql = getSql();
  const rows =
    input.role === "admin"
      ? await sql<{ id: string }[]>`
          DELETE FROM campus_sst.course_discussions
          WHERE id = ${input.postId}::uuid
          RETURNING id::text
        `
      : await sql<{ id: string }[]>`
          DELETE FROM campus_sst.course_discussions
          WHERE id = ${input.postId}::uuid AND user_id = ${input.userId}::uuid
          RETURNING id::text
        `;
  if (!rows[0]) {
    throw new Error("No se pudo eliminar la consulta.");
  }
}

function toAuthor(row: DiscussionRow): DiscussionAuthor {
  const photo = row.photo_url && row.photo_url.startsWith("http") ? row.photo_url : null;
  return {
    id: row.user_id,
    name: row.name,
    jobTitle: row.job_title,
    initials: initialsFromName(row.name),
    photoUrl: photo,
    role: row.role === "admin" ? "admin" : "user",
  };
}

function formatDiscussionDate(date: Date): string {
  return new Intl.DateTimeFormat("es-CR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
