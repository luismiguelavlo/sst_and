import "server-only";

import { getSql } from "@/lib/db";
import {
  isActivityPriority,
  isActivityStatus,
  type ActivityDraft,
  type ActivityListFilters,
  type ActivityPriority,
  type ActivityStatus,
  type AdminUserOption,
  type WorkActivity,
} from "./types";

type ActivityRow = {
  id: string;
  title: string;
  description: string;
  starts_at: string | Date;
  ends_at: string | Date;
  status: string;
  priority: string;
  category: string;
  assignee_id: string | null;
  assignee_name: string | null;
  created_by: string | null;
  created_by_name: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

function toIso(value: string | Date): string {
  return typeof value === "string" ? value : value.toISOString();
}

function rowToActivity(row: ActivityRow): WorkActivity {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startsAt: toIso(row.starts_at),
    endsAt: toIso(row.ends_at),
    status: isActivityStatus(row.status) ? row.status : "pendiente",
    priority: isActivityPriority(row.priority) ? row.priority : "media",
    category: row.category ?? "",
    assigneeId: row.assignee_id,
    assigneeName: row.assignee_name,
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export async function listAdminUsers(): Promise<AdminUserOption[]> {
  const sql = getSql();
  const rows = await sql<{ id: string; name: string; email: string }[]>`
    SELECT id::text, name, email
    FROM campus_sst.users
    WHERE role = 'admin' AND status = 'active'
    ORDER BY name ASC
  `;
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
  }));
}

export async function listActivities(
  filters: ActivityListFilters = {},
): Promise<WorkActivity[]> {
  const sql = getSql();
  const ownership = filters.ownership ?? "all";
  const userId = filters.currentUserId ?? null;

  const rows = await sql<ActivityRow[]>`
    SELECT
      a.id,
      a.title,
      a.description,
      a.starts_at,
      a.ends_at,
      a.status,
      a.priority,
      a.category,
      a.assignee_id,
      assignee.name AS assignee_name,
      a.created_by,
      creator.name AS created_by_name,
      a.created_at,
      a.updated_at
    FROM campus_sst.work_activities a
    LEFT JOIN campus_sst.users assignee ON assignee.id = a.assignee_id
    LEFT JOIN campus_sst.users creator ON creator.id = a.created_by
    WHERE TRUE
      ${filters.from ? sql`AND a.starts_at >= ${filters.from}::timestamptz` : sql``}
      ${filters.to ? sql`AND a.starts_at <= ${filters.to}::timestamptz` : sql``}
      ${filters.status && filters.status !== "all"
        ? sql`AND a.status = ${filters.status}`
        : sql``}
      ${filters.priority && filters.priority !== "all"
        ? sql`AND a.priority = ${filters.priority}`
        : sql``}
      ${filters.query
        ? sql`AND (
            a.title ILIKE ${"%" + filters.query + "%"}
            OR a.category ILIKE ${"%" + filters.query + "%"}
            OR a.description ILIKE ${"%" + filters.query + "%"}
          )`
        : sql``}
      ${ownership === "mine" && userId
        ? sql`AND a.created_by = ${userId}::uuid`
        : sql``}
      ${ownership === "assigned_to_me" && userId
        ? sql`AND a.assignee_id = ${userId}::uuid`
        : sql``}
    ORDER BY a.starts_at ASC
  `;
  return rows.map(rowToActivity);
}

export async function getActivity(id: string): Promise<WorkActivity | null> {
  const sql = getSql();
  const rows = await sql<ActivityRow[]>`
    SELECT
      a.id,
      a.title,
      a.description,
      a.starts_at,
      a.ends_at,
      a.status,
      a.priority,
      a.category,
      a.assignee_id,
      assignee.name AS assignee_name,
      a.created_by,
      creator.name AS created_by_name,
      a.created_at,
      a.updated_at
    FROM campus_sst.work_activities a
    LEFT JOIN campus_sst.users assignee ON assignee.id = a.assignee_id
    LEFT JOIN campus_sst.users creator ON creator.id = a.created_by
    WHERE a.id = ${id}::uuid
    LIMIT 1
  `;
  return rows[0] ? rowToActivity(rows[0]) : null;
}

export async function createActivity(
  draft: ActivityDraft,
  createdBy: string,
): Promise<WorkActivity> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.work_activities
      (title, description, starts_at, ends_at, status, priority, category, assignee_id, created_by, updated_by)
    VALUES (
      ${draft.title.trim()},
      ${draft.description.trim()},
      ${draft.startsAt}::timestamptz,
      ${draft.endsAt}::timestamptz,
      ${draft.status as ActivityStatus},
      ${draft.priority as ActivityPriority},
      ${draft.category.trim()},
      ${draft.assigneeId || null},
      ${createdBy}::uuid,
      ${createdBy}::uuid
    )
    RETURNING id::text
  `;
  const created = await getActivity(rows[0].id);
  if (!created) throw new Error("No se pudo cargar la actividad creada.");
  return created;
}

export async function updateActivity(
  id: string,
  draft: ActivityDraft,
  updatedBy: string,
): Promise<WorkActivity> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.work_activities
    SET
      title = ${draft.title.trim()},
      description = ${draft.description.trim()},
      starts_at = ${draft.startsAt}::timestamptz,
      ends_at = ${draft.endsAt}::timestamptz,
      status = ${draft.status as ActivityStatus},
      priority = ${draft.priority as ActivityPriority},
      category = ${draft.category.trim()},
      assignee_id = ${draft.assigneeId || null},
      updated_by = ${updatedBy}::uuid,
      updated_at = now()
    WHERE id = ${id}::uuid
  `;
  const updated = await getActivity(id);
  if (!updated) throw new Error("No se pudo cargar la actividad actualizada.");
  return updated;
}

export async function deleteActivity(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM campus_sst.work_activities WHERE id = ${id}::uuid`;
}
