import "server-only";

import { getSql } from "@/lib/db";
import {
  createComplianceRecord,
  deleteComplianceRecord,
  findComplianceRecordByCode,
  updateComplianceRecord,
} from "@/lib/sg-sst/alerts/repository";
import type { SstRecordDraft, SstSemaphoreLevel } from "@/lib/sg-sst/alerts/types";
import {
  enrichRestrictionAsView,
  isRestrictionKind,
  isRestrictionStatus,
  resolveRestrictionDueDate,
  toComplianceWorkflowStatus,
  type RestrictionKind,
  type RestrictionStats,
  type RestrictionStatus,
  type SstRestriction,
  type SstRestrictionDraft,
  type SstRestrictionView,
} from "@/lib/sg-sst/restricciones/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type RestrictionRow = {
  id: string;
  folio: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  worker_status: string;
  restriction_kind: string;
  issued_at: string;
  start_date: string;
  due_date: string | null;
  detail: string;
  issuer: string;
  responsible_name: string;
  measure_implemented: string;
  implemented_at: string | null;
  status: string;
  next_follow_up: string | null;
  observations: string;
  evidence_url: string;
  evidence_name: string;
  company_snapshot: string;
  job_title_snapshot: string;
  farm_id: string | null;
  farm_name: string | null;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

function mapRestriction(row: RestrictionRow): SstRestriction {
  if (!isRestrictionKind(row.restriction_kind)) {
    throw new Error(`Tipo de restricción inválido: ${row.restriction_kind}`);
  }
  if (!isRestrictionStatus(row.status)) {
    throw new Error(`Estado de restricción inválido: ${row.status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    workerStatus: row.worker_status,
    restrictionKind: row.restriction_kind,
    issuedAt: row.issued_at,
    startDate: row.start_date,
    dueDate: row.due_date,
    detail: row.detail,
    issuer: row.issuer,
    responsibleName: row.responsible_name,
    measureImplemented: row.measure_implemented,
    implementedAt: row.implemented_at,
    status: row.status,
    nextFollowUp: row.next_follow_up,
    observations: row.observations,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    companySnapshot: row.company_snapshot,
    jobTitleSnapshot: row.job_title_snapshot,
    farmId: row.farm_id,
    farmName: row.farm_name,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function selectRestrictionById(id: string): Promise<SstRestriction | null> {
  const sql = getSql();
  const rows = await sql<RestrictionRow[]>`
    SELECT
      r.id, r.folio, r.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      r.restriction_kind, r.issued_at::text, r.start_date::text, r.due_date::text,
      r.detail, r.issuer, r.responsible_name, r.measure_implemented, r.implemented_at::text,
      r.status, r.next_follow_up::text, r.observations, r.evidence_url, r.evidence_name,
      r.company_snapshot, r.job_title_snapshot, r.farm_id, f.name AS farm_name,
      r.compliance_record_id, r.created_at::text, r.updated_at::text
    FROM campus_sst.sst_restricciones r
    INNER JOIN campus_sst.sst_workers w ON w.id = r.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = r.farm_id
    WHERE r.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapRestriction(rows[0]) : null;
}

async function nextRestrictionFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM campus_sst.sst_restricciones
    WHERE folio LIKE ${`RST-${year}-%`}
  `;
  const next = (rows[0]?.count ?? 0) + 1;
  return `RST-${year}-${String(next).padStart(3, "0")}`;
}

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function complianceDraftFromRestriction(item: SstRestriction): SstRecordDraft {
  const dueDate = resolveRestrictionDueDate(item.dueDate, item.nextFollowUp);
  return {
    recordType: "restriccion",
    title: `${RESTRICTION_KIND_TITLE[item.restrictionKind]} — ${item.workerName}`,
    code: item.folio,
    workerId: item.workerId,
    subjectName: item.workerName,
    subjectDocument: item.workerDocument,
    subjectJobTitle: item.jobTitleSnapshot,
    farmId: item.farmId,
    dueDate,
    issuedAt: item.issuedAt,
    workflowStatus: toComplianceWorkflowStatus(item.status),
    responsibleName: item.responsibleName,
    externalEntity: item.issuer,
    notes: item.detail.slice(0, 500),
  };
}

const RESTRICTION_KIND_TITLE: Record<RestrictionKind, string> = {
  restriccion: "Restricción",
  recomendacion: "Recomendación",
  post_incapacidad: "Post incapacidad",
  definitiva_reubicacion: "Reubicación definitiva",
};

async function syncComplianceRecord(
  item: SstRestriction,
  userId: string,
): Promise<void> {
  const draft = complianceDraftFromRestriction(item);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("restriccion", item.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_restricciones
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_restricciones
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

export async function listRestrictions(filters?: {
  kind?: RestrictionKind | "all";
  status?: RestrictionStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstRestriction[]> {
  const sql = getSql();
  const kind = filters?.kind && filters.kind !== "all" ? filters.kind : null;
  const status = filters?.status && filters.status !== "all" ? filters.status : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<RestrictionRow[]>`
    SELECT
      r.id, r.folio, r.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      r.restriction_kind, r.issued_at::text, r.start_date::text, r.due_date::text,
      r.detail, r.issuer, r.responsible_name, r.measure_implemented, r.implemented_at::text,
      r.status, r.next_follow_up::text, r.observations, r.evidence_url, r.evidence_name,
      r.company_snapshot, r.job_title_snapshot, r.farm_id, f.name AS farm_name,
      r.compliance_record_id, r.created_at::text, r.updated_at::text
    FROM campus_sst.sst_restricciones r
    INNER JOIN campus_sst.sst_workers w ON w.id = r.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = r.farm_id
    WHERE (${kind}::text IS NULL OR r.restriction_kind = ${kind})
      AND (${status}::text IS NULL OR r.status = ${status})
      AND (${farmId}::uuid IS NULL OR r.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(r.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(r.detail) LIKE ${q ? `%${q}%` : ""}
        OR lower(r.responsible_name) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE WHEN r.due_date IS NULL THEN 1 ELSE 0 END,
      r.due_date ASC NULLS LAST,
      r.issued_at DESC
  `;
  return rows.map(mapRestriction);
}

export async function listRestrictionViews(
  filters?: Parameters<typeof listRestrictions>[0],
): Promise<SstRestrictionView[]> {
  return (await listRestrictions(filters)).map((item) => enrichRestrictionAsView(item));
}

export async function getRestriction(id: string): Promise<SstRestriction | null> {
  return selectRestrictionById(id);
}

export async function findRestrictionByFolio(
  folio: string,
): Promise<SstRestriction | null> {
  const sql = getSql();
  const rows = await sql<RestrictionRow[]>`
    SELECT
      r.id, r.folio, r.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      r.restriction_kind, r.issued_at::text, r.start_date::text, r.due_date::text,
      r.detail, r.issuer, r.responsible_name, r.measure_implemented, r.implemented_at::text,
      r.status, r.next_follow_up::text, r.observations, r.evidence_url, r.evidence_name,
      r.company_snapshot, r.job_title_snapshot, r.farm_id, f.name AS farm_name,
      r.compliance_record_id, r.created_at::text, r.updated_at::text
    FROM campus_sst.sst_restricciones r
    INNER JOIN campus_sst.sst_workers w ON w.id = r.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = r.farm_id
    WHERE lower(r.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapRestriction(rows[0]) : null;
}

export async function getRestrictionStats(): Promise<RestrictionStats> {
  const views = await listRestrictionViews();
  const bySemaphore: Record<SstSemaphoreLevel, number> = {
    critico: 0,
    proximo: 0,
    seguimiento: 0,
    vigente: 0,
  };
  const byStatus: Record<RestrictionStatus, number> = {
    vigente: 0,
    proxima_vencer: 0,
    vencida: 0,
    pendiente_implementacion: 0,
    cerrada: 0,
  };
  const byKind: Record<RestrictionKind, number> = {
    restriccion: 0,
    recomendacion: 0,
    post_incapacidad: 0,
    definitiva_reubicacion: 0,
  };
  let active = 0;
  for (const view of views) {
    bySemaphore[view.semaphore] += 1;
    byStatus[view.effectiveStatus] += 1;
    byKind[view.restrictionKind] += 1;
    if (view.effectiveStatus !== "cerrada") active += 1;
  }
  return {
    total: views.length,
    active,
    byStatus,
    byKind,
    bySemaphore,
  };
}

export async function createRestriction(
  draft: SstRestrictionDraft,
  userId: string,
): Promise<SstRestriction> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const folio = await nextRestrictionFolio(sql);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_restricciones (
      folio, worker_id, restriction_kind, issued_at, start_date, due_date,
      detail, issuer, responsible_name, measure_implemented, implemented_at,
      status, next_follow_up, observations, evidence_url, evidence_name,
      company_snapshot, job_title_snapshot, farm_id,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.workerId},
      ${draft.restrictionKind},
      ${draft.issuedAt},
      ${draft.startDate},
      ${emptyToNull(draft.dueDate)},
      ${draft.detail.trim()},
      ${(draft.issuer ?? "").trim()},
      ${draft.responsibleName.trim()},
      ${draft.measureImplemented.trim()},
      ${emptyToNull(draft.implementedAt)},
      ${draft.status},
      ${emptyToNull(draft.nextFollowUp)},
      ${draft.observations.trim()},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${worker.company},
      ${worker.jobTitle},
      ${worker.farmId},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectRestrictionById(rows[0].id);
  if (!created) throw new Error("No se pudo crear la restricción.");
  await syncComplianceRecord(created, userId);
  return (await selectRestrictionById(created.id)) ?? created;
}

export async function updateRestriction(
  id: string,
  draft: SstRestrictionDraft,
  userId: string,
): Promise<SstRestriction> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_restricciones
    SET
      worker_id = ${draft.workerId},
      restriction_kind = ${draft.restrictionKind},
      issued_at = ${draft.issuedAt},
      start_date = ${draft.startDate},
      due_date = ${emptyToNull(draft.dueDate)},
      detail = ${draft.detail.trim()},
      issuer = ${(draft.issuer ?? "").trim()},
      responsible_name = ${draft.responsibleName.trim()},
      measure_implemented = ${draft.measureImplemented.trim()},
      implemented_at = ${emptyToNull(draft.implementedAt)},
      status = ${draft.status},
      next_follow_up = ${emptyToNull(draft.nextFollowUp)},
      observations = ${draft.observations.trim()},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      company_snapshot = ${worker.company},
      job_title_snapshot = ${worker.jobTitle},
      farm_id = ${worker.farmId},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectRestrictionById(id);
  if (!updated) throw new Error("Restricción no encontrada.");
  await syncComplianceRecord(updated, userId);
  return (await selectRestrictionById(id)) ?? updated;
}

export async function deleteRestriction(id: string): Promise<void> {
  const current = await selectRestrictionById(id);
  if (!current) throw new Error("Restricción no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_restricciones WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
