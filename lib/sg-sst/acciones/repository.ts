import "server-only";

import { getSql } from "@/lib/db";
import { nextSequentialCode } from "@/lib/sg-sst/next-sequential-code";
import {
  createComplianceRecord,
  deleteComplianceRecord,
  findComplianceRecordByCode,
  updateComplianceRecord,
} from "@/lib/sg-sst/alerts/repository";
import type { SstRecordDraft } from "@/lib/sg-sst/alerts/types";
import {
  ACTION_KIND_LABELS,
  ACTION_SOURCE_LABELS,
  deriveEffectiveStatus,
  enrichActionAsView,
  isActionEfficacyStatus,
  isActionKind,
  isActionSourceType,
  isActionStatus,
  resolveStatusToPersist,
  toComplianceWorkflowStatus,
  type ActionEfficacyStatus,
  type ActionKind,
  type ActionSourceType,
  type ActionStats,
  type ActionStatus,
  type SstCorrectiveAction,
  type SstCorrectiveActionDraft,
  type SstCorrectiveActionView,
} from "@/lib/sg-sst/acciones/types";

type ActionRow = {
  id: string;
  folio: string;
  source_type: string;
  source_ref: string;
  finding: string;
  action_plan: string;
  action_kind: string;
  responsible_name: string;
  commit_date: string;
  closed_at: string | null;
  status: string;
  evidence_url: string;
  evidence_name: string;
  efficacy_status: string;
  observations: string;
  farm_id: string | null;
  farm_name: string | null;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapAction(row: ActionRow): SstCorrectiveAction {
  if (!isActionSourceType(row.source_type)) {
    throw new Error(`Fuente inválida: ${row.source_type}`);
  }
  if (!isActionKind(row.action_kind)) {
    throw new Error(`Tipo de acción inválido: ${row.action_kind}`);
  }
  if (!isActionStatus(row.status)) {
    throw new Error(`Estado inválido: ${row.status}`);
  }
  if (!isActionEfficacyStatus(row.efficacy_status)) {
    throw new Error(`Eficacia inválida: ${row.efficacy_status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    sourceType: row.source_type,
    sourceRef: row.source_ref,
    finding: row.finding,
    actionPlan: row.action_plan,
    actionKind: row.action_kind,
    responsibleName: row.responsible_name,
    commitDate: row.commit_date,
    closedAt: row.closed_at,
    status: row.status,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    efficacyStatus: row.efficacy_status,
    observations: row.observations,
    farmId: row.farm_id,
    farmName: row.farm_name,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const ACTION_SELECT = `
  a.id, a.folio, a.source_type, a.source_ref, a.finding, a.action_plan,
  a.action_kind, a.responsible_name, a.commit_date::text, a.closed_at::text,
  a.status, a.evidence_url, a.evidence_name, a.efficacy_status, a.observations,
  a.farm_id, f.name AS farm_name, a.compliance_record_id,
  a.created_at::text, a.updated_at::text
`;

async function selectActionById(id: string): Promise<SstCorrectiveAction | null> {
  const sql = getSql();
  const rows = await sql<ActionRow[]>`
    SELECT ${sql.unsafe(ACTION_SELECT)}
    FROM campus_sst.sst_corrective_actions a
    LEFT JOIN campus_sst.sst_farms f ON f.id = a.farm_id
    WHERE a.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapAction(rows[0]) : null;
}

async function nextActionFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_corrective_actions", "folio", `AC-${year}-`);
}

function resolveClosedAt(
  status: ActionStatus,
  closedAt: string | null | undefined,
): string | null {
  if (status !== "cerrada") {
    return null;
  }
  return emptyToNull(closedAt) ?? new Date().toISOString().slice(0, 10);
}

function complianceDraftFromAction(
  item: SstCorrectiveAction,
  effectiveStatus: ActionStatus,
): SstRecordDraft {
  return {
    recordType: "accion_correctiva",
    title: `${ACTION_KIND_LABELS[item.actionKind]} ${item.folio} — ${ACTION_SOURCE_LABELS[item.sourceType]}`,
    code: item.folio,
    subjectName: item.responsibleName || item.folio,
    farmId: item.farmId,
    dueDate: item.commitDate,
    issuedAt: item.createdAt.slice(0, 10),
    workflowStatus: toComplianceWorkflowStatus(effectiveStatus),
    responsibleName: item.responsibleName,
    notes: item.finding.slice(0, 500),
  };
}

async function syncComplianceRecord(
  item: SstCorrectiveAction,
  userId: string,
): Promise<void> {
  const effectiveStatus = deriveEffectiveStatus(item.status, item.commitDate);
  const draft = complianceDraftFromAction(item, effectiveStatus);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("accion_correctiva", item.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_corrective_actions
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_corrective_actions
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

export async function listActions(filters?: {
  sourceType?: ActionSourceType | "all";
  status?: ActionStatus | "all";
  kind?: ActionKind | "all";
  efficacy?: ActionEfficacyStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstCorrectiveAction[]> {
  const sql = getSql();
  const sourceType =
    filters?.sourceType && filters.sourceType !== "all" ? filters.sourceType : null;
  const status = filters?.status && filters.status !== "all" ? filters.status : null;
  const kind = filters?.kind && filters.kind !== "all" ? filters.kind : null;
  const efficacy =
    filters?.efficacy && filters.efficacy !== "all" ? filters.efficacy : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<ActionRow[]>`
    SELECT ${sql.unsafe(ACTION_SELECT)}
    FROM campus_sst.sst_corrective_actions a
    LEFT JOIN campus_sst.sst_farms f ON f.id = a.farm_id
    WHERE (${sourceType}::text IS NULL OR a.source_type = ${sourceType})
      AND (${status}::text IS NULL OR a.status = ${status})
      AND (${kind}::text IS NULL OR a.action_kind = ${kind})
      AND (${efficacy}::text IS NULL OR a.efficacy_status = ${efficacy})
      AND (${farmId}::uuid IS NULL OR a.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(a.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(a.finding) LIKE ${q ? `%${q}%` : ""}
        OR lower(a.action_plan) LIKE ${q ? `%${q}%` : ""}
        OR lower(a.responsible_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(a.source_ref) LIKE ${q ? `%${q}%` : ""}
        OR lower(COALESCE(f.name, '')) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE a.status
        WHEN 'vencida' THEN 0
        WHEN 'proxima_vencer' THEN 1
        WHEN 'en_ejecucion' THEN 2
        ELSE 3
      END,
      a.commit_date ASC,
      a.created_at DESC
  `;
  return rows.map(mapAction);
}

export async function listActionViews(
  filters?: Parameters<typeof listActions>[0],
): Promise<SstCorrectiveActionView[]> {
  return (await listActions(filters)).map((item) => enrichActionAsView(item));
}

export async function getAction(id: string): Promise<SstCorrectiveAction | null> {
  return selectActionById(id);
}

export async function findActionByFolio(
  folio: string,
): Promise<SstCorrectiveAction | null> {
  const sql = getSql();
  const rows = await sql<ActionRow[]>`
    SELECT ${sql.unsafe(ACTION_SELECT)}
    FROM campus_sst.sst_corrective_actions a
    LEFT JOIN campus_sst.sst_farms f ON f.id = a.farm_id
    WHERE lower(a.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapAction(rows[0]) : null;
}

export async function getActionStats(): Promise<ActionStats> {
  const views = await listActionViews();
  const byStatus: Record<ActionStatus, number> = {
    en_ejecucion: 0,
    proxima_vencer: 0,
    vencida: 0,
    cerrada: 0,
  };
  const bySource: Record<ActionSourceType, number> = {
    accidente: 0,
    incidente: 0,
    inspeccion: 0,
    auditoria: 0,
    hallazgo: 0,
    copasst: 0,
    ccl: 0,
    pesv: 0,
    sg_sst: 0,
  };
  const byKind: Record<ActionKind, number> = {
    correctiva: 0,
    preventiva: 0,
    mejora: 0,
  };

  for (const view of views) {
    byStatus[view.effectiveStatus] += 1;
    bySource[view.sourceType] += 1;
    byKind[view.actionKind] += 1;
  }

  const cerradas = byStatus.cerrada;
  const total = views.length;
  const abiertas = total - cerradas;
  const cumplimientoPct =
    total > 0 ? Math.round((cerradas / total) * 1000) / 10 : 0;

  return {
    total,
    abiertas,
    vencidas: byStatus.vencida,
    proximas: byStatus.proxima_vencer,
    cerradas,
    cumplimientoPct,
    byStatus,
    bySource,
    byKind,
  };
}

export async function createAction(
  draft: SstCorrectiveActionDraft,
  userId: string,
): Promise<SstCorrectiveAction> {
  const sql = getSql();
  const folio = await nextActionFolio(sql);
  const status = resolveStatusToPersist(draft);
  const closedAt = resolveClosedAt(status, draft.closedAt);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_corrective_actions (
      folio, source_type, source_ref, finding, action_plan, action_kind,
      responsible_name, commit_date, closed_at, status,
      evidence_url, evidence_name, efficacy_status, observations, farm_id,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.sourceType},
      ${draft.sourceRef.trim()},
      ${draft.finding.trim()},
      ${draft.actionPlan.trim()},
      ${draft.actionKind},
      ${draft.responsibleName.trim()},
      ${draft.commitDate},
      ${closedAt},
      ${status},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${draft.efficacyStatus},
      ${draft.observations.trim()},
      ${emptyToNull(draft.farmId ?? null)},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectActionById(rows[0].id);
  if (!created) throw new Error("No se pudo crear la acción correctiva.");
  await syncComplianceRecord(created, userId);
  return (await selectActionById(created.id)) ?? created;
}

export async function updateAction(
  id: string,
  draft: SstCorrectiveActionDraft,
  userId: string,
): Promise<SstCorrectiveAction> {
  const sql = getSql();
  const status = resolveStatusToPersist(draft);
  const closedAt = resolveClosedAt(status, draft.closedAt);
  await sql`
    UPDATE campus_sst.sst_corrective_actions
    SET
      source_type = ${draft.sourceType},
      source_ref = ${draft.sourceRef.trim()},
      finding = ${draft.finding.trim()},
      action_plan = ${draft.actionPlan.trim()},
      action_kind = ${draft.actionKind},
      responsible_name = ${draft.responsibleName.trim()},
      commit_date = ${draft.commitDate},
      closed_at = ${closedAt},
      status = ${status},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      efficacy_status = ${draft.efficacyStatus},
      observations = ${draft.observations.trim()},
      farm_id = ${emptyToNull(draft.farmId ?? null)},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectActionById(id);
  if (!updated) throw new Error("Acción correctiva no encontrada.");
  await syncComplianceRecord(updated, userId);
  return (await selectActionById(id)) ?? updated;
}

export async function deleteAction(id: string): Promise<void> {
  const current = await selectActionById(id);
  if (!current) throw new Error("Acción correctiva no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_corrective_actions WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
