import "server-only";

import { getSql } from "@/lib/db";
import {
  isNotificationKind,
  type AppNotification,
  type NotificationKind,
} from "@/lib/notifications";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type NotificationRow = {
  id: string;
  kind: string;
  title: string;
  body: string;
  href: string | null;
  read_at: Date | null;
  created_at: Date;
};

export async function listNotificationsForUser(
  userId: string,
  limit = 40,
): Promise<AppNotification[]> {
  if (!UUID_PATTERN.test(userId)) {
    return [];
  }
  const sql = getSql();
  const rows = await sql<NotificationRow[]>`
    SELECT
      id::text,
      kind,
      title,
      body,
      href,
      read_at,
      created_at
    FROM campus_sst.notifications
    WHERE user_id = ${userId}::uuid
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.filter((row) => isNotificationKind(row.kind)).map(toNotification);
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  if (!UUID_PATTERN.test(userId)) {
    return 0;
  }
  const sql = getSql();
  const rows = await sql<{ count: number }[]>`
    SELECT count(*)::int AS count
    FROM campus_sst.notifications
    WHERE user_id = ${userId}::uuid AND read_at IS NULL
  `;
  return rows[0]?.count ?? 0;
}

export async function markNotificationRead(userId: string, notificationId: string): Promise<void> {
  if (!UUID_PATTERN.test(userId) || !UUID_PATTERN.test(notificationId)) {
    throw new Error("Notificación inválida.");
  }
  const sql = getSql();
  await sql`
    UPDATE campus_sst.notifications
    SET read_at = coalesce(read_at, now())
    WHERE id = ${notificationId}::uuid AND user_id = ${userId}::uuid
  `;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  if (!UUID_PATTERN.test(userId)) {
    return;
  }
  const sql = getSql();
  await sql`
    UPDATE campus_sst.notifications
    SET read_at = now()
    WHERE user_id = ${userId}::uuid AND read_at IS NULL
  `;
}

export async function createNotifications(input: {
  userIds: readonly string[];
  createdBy: string | null;
  kind: NotificationKind;
  title: string;
  body: string;
  href?: string | null;
}): Promise<number> {
  const title = input.title.trim();
  const body = input.body.trim();
  if (title.length === 0) {
    throw new Error("El título de la notificación es obligatorio.");
  }
  const recipients = [...new Set(input.userIds.filter((id) => UUID_PATTERN.test(id)))];
  if (recipients.length === 0) {
    throw new Error("Selecciona al menos un destinatario.");
  }

  const sql = getSql();
  let created = 0;
  await sql.begin(async (tx) => {
    for (const userId of recipients) {
      await tx`
        INSERT INTO campus_sst.notifications (
          user_id, created_by, kind, title, body, href
        )
        VALUES (
          ${userId}::uuid,
          ${input.createdBy && UUID_PATTERN.test(input.createdBy) ? input.createdBy : null}::uuid,
          ${input.kind},
          ${title.slice(0, 200)},
          ${body},
          ${input.href?.trim() || null}
        )
      `;
      created += 1;
    }
  });
  return created;
}

export async function notifyCourseAssignments(input: {
  userIds: readonly string[];
  courseIds: readonly string[];
  assignedBy: string;
  deadline: string | null;
  message: string;
}): Promise<void> {
  const courseIds = input.courseIds.filter((id) => UUID_PATTERN.test(id));
  const userIds = input.userIds.filter((id) => UUID_PATTERN.test(id));
  if (courseIds.length === 0 || userIds.length === 0) {
    return;
  }

  const sql = getSql();
  const courses = await sql<{ id: string; title: string; slug: string }[]>`
    SELECT id::text, title, slug
    FROM campus_sst.courses
    WHERE id IN ${sql(courseIds)}
  `;
  if (courses.length === 0) {
    return;
  }

  const note = input.message.trim();
  const deadlineLabel = input.deadline
    ? ` Fecha límite: ${formatDeadline(input.deadline)}.`
    : "";

  for (const course of courses) {
    const bodyParts = [
      `SST te asignó el curso «${course.title}».${deadlineLabel}`,
      note.length > 0 ? note : null,
    ].filter(Boolean);

    await createNotifications({
      userIds,
      createdBy: input.assignedBy,
      kind: "course_assigned",
      title: `Nuevo curso: ${course.title}`,
      body: bodyParts.join(" "),
      href: `/courses/${course.slug}`,
    });
  }
}

export async function notifyAttendanceFormPublished(input: {
  formId: string;
  formTitle: string;
  createdBy: string;
  userIds: readonly string[];
}): Promise<void> {
  if (!UUID_PATTERN.test(input.formId) || input.userIds.length === 0) {
    return;
  }
  await createNotifications({
    userIds: input.userIds,
    createdBy: input.createdBy,
    kind: "attendance_form",
    title: "Nuevo formulario de asistencia",
    body: `Tienes un nuevo formulario por diligenciar: «${input.formTitle.trim()}».`,
    href: `/my-attendance/${input.formId}`,
  });
}

function toNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    kind: row.kind as NotificationKind,
    title: row.title,
    body: row.body,
    href: row.href,
    read: row.read_at !== null,
    createdAt: row.created_at.toISOString(),
    createdAtLabel: formatRelative(row.created_at),
  };
}

function formatDeadline(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRelative(value: Date): string {
  const diffMs = Date.now() - value.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) {
    return "Ahora";
  }
  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Hace ${hours} h`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `Hace ${days} d`;
  }
  return value.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
