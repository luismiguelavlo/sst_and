import "server-only";

import { getSql } from "@/lib/db";
import { nextSequentialCode } from "@/lib/sg-sst/next-sequential-code";
import {
  createComplianceRecord,
  deleteComplianceRecord,
  findComplianceRecordByCode,
  updateComplianceRecord,
} from "@/lib/sg-sst/alerts/repository";
import type { SstRecordDraft, SstWorkflowStatus } from "@/lib/sg-sst/alerts/types";
import {
  computeHealthCaseStats,
  isHealthCaseStatus,
  isHealthCaseType,
  type HealthCaseStats,
  type HealthCaseStatus,
  type HealthCaseType,
  type SstHealthCase,
  type SstHealthCaseDraft,
  HEALTH_CASE_TYPE_LABELS,
} from "@/lib/sg-sst/casos-salud/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type HealthCaseRow = {
  id: string;
  folio: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  worker_status: string;
  case_type: string;
  opened_at: string;
  status: string;
  responsible_name: string;
  issuer: string;
  next_follow_up: string | null;
  closed_at: string | null;
  admin_observations: string;
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

function mapCase(row: HealthCaseRow): SstHealthCase {
  if (!isHealthCaseType(row.case_type)) {
    throw new Error(`Tipo de caso inválido: ${row.case_type}`);
  }
  if (!isHealthCaseStatus(row.status)) {
    throw new Error(`Estado de caso inválido: ${row.status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    workerStatus: row.worker_status,
    caseType: row.case_type,
    openedAt: row.opened_at,
    status: row.status,
    responsibleName: row.responsible_name,
    issuer: row.issuer,
    nextFollowUp: row.next_follow_up,
    closedAt: row.closed_at,
    adminObservations: row.admin_observations,
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

function workflowFromStatus(status: HealthCaseStatus): SstWorkflowStatus {
  if (status === "cerrado") return "closed";
  if (status === "en_seguimiento" || status === "pendiente") return "in_progress";
  return "open";
}

function complianceDraftFromCase(item: SstHealthCase): SstRecordDraft {
  return {
    recordType: "restriccion",
    title: `CS — ${HEALTH_CASE_TYPE_LABELS[item.caseType]} — ${item.workerName}`,
    code: item.folio,
    workerId: item.workerId,
    subjectName: item.workerName,
    subjectDocument: item.workerDocument,
    subjectJobTitle: item.jobTitleSnapshot,
    farmId: item.farmId,
    dueDate: item.nextFollowUp,
    issuedAt: item.openedAt,
    workflowStatus: workflowFromStatus(item.status),
    responsibleName: item.responsibleName,
    externalEntity: item.issuer,
    notes: item.adminObservations.slice(0, 500),
  };
}

async function selectCaseById(id: string): Promise<SstHealthCase | null> {
  const sql = getSql();
  const rows = await sql<HealthCaseRow[]>`
    SELECT
      c.id, c.folio, c.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      c.case_type, c.opened_at::text, c.status, c.responsible_name, c.issuer,
      c.next_follow_up::text, c.closed_at::text, c.admin_observations,
      c.evidence_url, c.evidence_name, c.company_snapshot, c.job_title_snapshot,
      c.farm_id, f.name AS farm_name, c.compliance_record_id,
      c.created_at::text, c.updated_at::text
    FROM campus_sst.sst_casos_salud c
    INNER JOIN campus_sst.sst_workers w ON w.id = c.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
    WHERE c.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapCase(rows[0]) : null;
}

async function nextCaseFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_casos_salud", "folio", `CS-${year}-`);
}

async function syncComplianceRecord(item: SstHealthCase, userId: string): Promise<void> {
  const draft = complianceDraftFromCase(item);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("restriccion", item.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_casos_salud
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_casos_salud
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

export async function listHealthCases(filters?: {
  caseType?: HealthCaseType | "all";
  status?: HealthCaseStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstHealthCase[]> {
  const sql = getSql();
  const caseType =
    filters?.caseType && filters.caseType !== "all" ? filters.caseType : null;
  const status = filters?.status && filters.status !== "all" ? filters.status : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<HealthCaseRow[]>`
    SELECT
      c.id, c.folio, c.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      c.case_type, c.opened_at::text, c.status, c.responsible_name, c.issuer,
      c.next_follow_up::text, c.closed_at::text, c.admin_observations,
      c.evidence_url, c.evidence_name, c.company_snapshot, c.job_title_snapshot,
      c.farm_id, f.name AS farm_name, c.compliance_record_id,
      c.created_at::text, c.updated_at::text
    FROM campus_sst.sst_casos_salud c
    INNER JOIN campus_sst.sst_workers w ON w.id = c.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
    WHERE (${caseType}::text IS NULL OR c.case_type = ${caseType})
      AND (${status}::text IS NULL OR c.status = ${status})
      AND (${farmId}::uuid IS NULL OR c.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(c.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(c.responsible_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(c.issuer) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE WHEN c.status = 'cerrado' THEN 1 ELSE 0 END,
      CASE WHEN c.next_follow_up IS NULL THEN 1 ELSE 0 END,
      c.next_follow_up ASC NULLS LAST,
      c.opened_at DESC
  `;
  return rows.map(mapCase);
}

export async function getHealthCase(id: string): Promise<SstHealthCase | null> {
  return selectCaseById(id);
}

export async function findHealthCaseByFolio(folio: string): Promise<SstHealthCase | null> {
  const sql = getSql();
  const rows = await sql<HealthCaseRow[]>`
    SELECT
      c.id, c.folio, c.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      c.case_type, c.opened_at::text, c.status, c.responsible_name, c.issuer,
      c.next_follow_up::text, c.closed_at::text, c.admin_observations,
      c.evidence_url, c.evidence_name, c.company_snapshot, c.job_title_snapshot,
      c.farm_id, f.name AS farm_name, c.compliance_record_id,
      c.created_at::text, c.updated_at::text
    FROM campus_sst.sst_casos_salud c
    INNER JOIN campus_sst.sst_workers w ON w.id = c.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
    WHERE lower(c.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapCase(rows[0]) : null;
}

export async function getHealthCaseStats(): Promise<HealthCaseStats> {
  return computeHealthCaseStats(await listHealthCases());
}

export async function createHealthCase(
  draft: SstHealthCaseDraft,
  userId: string,
): Promise<SstHealthCase> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const folio = await nextCaseFolio(sql);
  const nextFollowUp = draft.nextFollowUp?.trim() || null;
  const closedAt =
    draft.status === "cerrado"
      ? draft.closedAt?.trim() || new Date().toISOString().slice(0, 10)
      : draft.closedAt?.trim() || null;

  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_casos_salud (
      folio, worker_id, case_type, opened_at, status, responsible_name, issuer,
      next_follow_up, closed_at, admin_observations, evidence_url, evidence_name,
      company_snapshot, job_title_snapshot, farm_id, created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.workerId},
      ${draft.caseType},
      ${draft.openedAt},
      ${draft.status},
      ${draft.responsibleName.trim()},
      ${draft.issuer.trim()},
      ${nextFollowUp},
      ${closedAt},
      ${draft.adminObservations.trim()},
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
  const created = await selectCaseById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el caso de salud.");
  await syncComplianceRecord(created, userId);
  return (await selectCaseById(created.id)) ?? created;
}

export async function updateHealthCase(
  id: string,
  draft: SstHealthCaseDraft,
  userId: string,
): Promise<SstHealthCase> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const nextFollowUp = draft.nextFollowUp?.trim() || null;
  const closedAt =
    draft.status === "cerrado"
      ? draft.closedAt?.trim() || new Date().toISOString().slice(0, 10)
      : draft.closedAt?.trim() || null;

  await sql`
    UPDATE campus_sst.sst_casos_salud
    SET
      worker_id = ${draft.workerId},
      case_type = ${draft.caseType},
      opened_at = ${draft.openedAt},
      status = ${draft.status},
      responsible_name = ${draft.responsibleName.trim()},
      issuer = ${draft.issuer.trim()},
      next_follow_up = ${nextFollowUp},
      closed_at = ${closedAt},
      admin_observations = ${draft.adminObservations.trim()},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      company_snapshot = ${worker.company},
      job_title_snapshot = ${worker.jobTitle},
      farm_id = ${worker.farmId},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectCaseById(id);
  if (!updated) throw new Error("Caso de salud no encontrado.");
  await syncComplianceRecord(updated, userId);
  return (await selectCaseById(id)) ?? updated;
}

export async function deleteHealthCase(id: string): Promise<void> {
  const current = await selectCaseById(id);
  if (!current) throw new Error("Caso de salud no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_casos_salud WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
