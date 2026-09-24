import "server-only";

import { getSql } from "@/lib/db";
import {
  SST_AUDIT_ACTIONS,
  SST_AUDIT_MODULES,
  type RecordSstAuditInput,
  type SstAuditAction,
  type SstAuditDetails,
  type SstAuditEvent,
  type SstAuditListFilters,
  type SstAuditModule,
} from "@/lib/sg-sst/trazabilidad/types";

type AuditRow = {
  id: string;
  occurred_at: string;
  actor_user_id: string | null;
  actor_name: string;
  action: string;
  module: string;
  entity_type: string;
  entity_id: string | null;
  worker_id: string | null;
  worker_name: string | null;
  summary: string;
  details: SstAuditDetails | string | null;
};

function parseDetails(raw: AuditRow["details"]): SstAuditDetails {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as SstAuditDetails;
    } catch {
      return {};
    }
  }
  return raw;
}

function mapRow(row: AuditRow): SstAuditEvent {
  const action = SST_AUDIT_ACTIONS.includes(row.action as SstAuditAction)
    ? (row.action as SstAuditAction)
    : "update";
  const module = SST_AUDIT_MODULES.includes(row.module as SstAuditModule)
    ? (row.module as SstAuditModule)
    : "trabajadores";
  return {
    id: row.id,
    occurredAt: row.occurred_at,
    actorUserId: row.actor_user_id,
    actorName: row.actor_name,
    action,
    module,
    entityType: row.entity_type,
    entityId: row.entity_id,
    workerId: row.worker_id,
    workerName: row.worker_name,
    summary: row.summary,
    details: parseDetails(row.details),
  };
}

/**
 * Registra un evento de trazabilidad. Nunca lanza: un fallo de auditoría
 * no debe romper la operación de negocio.
 */
export async function recordSstAudit(input: RecordSstAuditInput): Promise<void> {
  try {
    const sql = getSql();
    const summary = input.summary.trim();
    if (!summary) return;
    await sql`
      INSERT INTO campus_sst.sst_audit_events (
        actor_user_id,
        actor_name,
        action,
        module,
        entity_type,
        entity_id,
        worker_id,
        summary,
        details
      ) VALUES (
        ${input.actor.id}::uuid,
        ${input.actor.name.trim() || "Usuario"},
        ${input.action},
        ${input.module},
        ${input.entityType?.trim() ?? ""},
        ${input.entityId ? input.entityId : null}::uuid,
        ${input.workerId ? input.workerId : null}::uuid,
        ${summary},
        ${sql.json(input.details ?? {})}
      )
    `;
  } catch (error) {
    console.error("[sst-audit] No se pudo registrar trazabilidad:", error);
  }
}

export async function listSstAuditEvents(
  filters: SstAuditListFilters = {},
): Promise<SstAuditEvent[]> {
  const sql = getSql();
  const module = filters.module && filters.module !== "all" ? filters.module : null;
  const action = filters.action && filters.action !== "all" ? filters.action : null;
  const workerId = filters.workerId?.trim() || null;
  const actorUserId = filters.actorUserId?.trim() || null;
  const query = filters.query?.trim() || null;
  const like = query ? `%${query}%` : null;
  const limit = Math.min(Math.max(filters.limit ?? 100, 1), 500);
  const offset = Math.max(filters.offset ?? 0, 0);

  try {
    const rows = await sql<AuditRow[]>`
      SELECT
        e.id::text,
        e.occurred_at::text,
        e.actor_user_id::text,
        e.actor_name,
        e.action,
        e.module,
        e.entity_type,
        e.entity_id::text,
        e.worker_id::text,
        w.full_name AS worker_name,
        e.summary,
        e.details
      FROM campus_sst.sst_audit_events e
      LEFT JOIN campus_sst.sst_workers w ON w.id = e.worker_id
      WHERE (${module}::text IS NULL OR e.module = ${module})
        AND (${action}::text IS NULL OR e.action = ${action})
        AND (${workerId}::uuid IS NULL OR e.worker_id = ${workerId}::uuid)
        AND (${actorUserId}::uuid IS NULL OR e.actor_user_id = ${actorUserId}::uuid)
        AND (
          ${like}::text IS NULL
          OR e.summary ILIKE ${like}
          OR e.actor_name ILIKE ${like}
          OR COALESCE(w.full_name, '') ILIKE ${like}
          OR COALESCE(e.entity_type, '') ILIKE ${like}
        )
      ORDER BY e.occurred_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return rows.map(mapRow);
  } catch {
    // Tabla aún no migrada: devolver vacío sin romper pantallas.
    return [];
  }
}

export async function countSstAuditEvents(
  filters: SstAuditListFilters = {},
): Promise<number> {
  const sql = getSql();
  const module = filters.module && filters.module !== "all" ? filters.module : null;
  const action = filters.action && filters.action !== "all" ? filters.action : null;
  const workerId = filters.workerId?.trim() || null;
  const actorUserId = filters.actorUserId?.trim() || null;
  const query = filters.query?.trim() || null;
  const like = query ? `%${query}%` : null;

  try {
    const rows = await sql<{ total: number }[]>`
      SELECT COUNT(*)::int AS total
      FROM campus_sst.sst_audit_events e
      LEFT JOIN campus_sst.sst_workers w ON w.id = e.worker_id
      WHERE (${module}::text IS NULL OR e.module = ${module})
        AND (${action}::text IS NULL OR e.action = ${action})
        AND (${workerId}::uuid IS NULL OR e.worker_id = ${workerId}::uuid)
        AND (${actorUserId}::uuid IS NULL OR e.actor_user_id = ${actorUserId}::uuid)
        AND (
          ${like}::text IS NULL
          OR e.summary ILIKE ${like}
          OR e.actor_name ILIKE ${like}
          OR COALESCE(w.full_name, '') ILIKE ${like}
        )
    `;
    return rows[0]?.total ?? 0;
  } catch {
    return 0;
  }
}
