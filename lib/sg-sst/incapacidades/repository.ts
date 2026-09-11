import "server-only";

import { getSql } from "@/lib/db";
import {
  createComplianceRecord,
  deleteComplianceRecord,
  findComplianceRecordByCode,
  updateComplianceRecord,
} from "@/lib/sg-sst/alerts/repository";
import type { SstRecordDraft, SstWorkflowStatus } from "@/lib/sg-sst/alerts/types";
import {
  computeDaysOrdered,
  computeLeaveAlertStats,
  deriveLeaveStatus,
  enrichLeaveAsView,
  isLeaveOrigin,
  isLeaveStatus,
  isReintegrationStatus,
  resolveReintegrationRequired,
  type LeaveOrigin,
  type LeaveStats,
  type LeaveStatus,
  type LeaveWorkerRanking,
  type ReintegrationStatus,
  type SstLeave,
  type SstLeaveDraft,
  type SstLeaveView,
} from "@/lib/sg-sst/incapacidades/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type LeaveRow = {
  id: string;
  folio: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  worker_status: string;
  company_snapshot: string;
  job_title_snapshot: string;
  farm_id: string | null;
  farm_name: string | null;
  start_date: string;
  end_date: string;
  days_ordered: number;
  origin: string;
  is_extension: boolean;
  accumulated_days: number;
  status: string;
  sst_follow_up: string;
  reintegration_required: boolean;
  reintegration_date: string | null;
  reintegration_status: string;
  cie10: string;
  diagnosis_label: string;
  issuer: string;
  admin_observations: string;
  evidence_url: string;
  evidence_name: string;
  compliance_record_id: string | null;
  reintegration_compliance_id: string | null;
  created_at: string;
  updated_at: string;
};

function mapLeave(row: LeaveRow): SstLeave {
  if (!isLeaveOrigin(row.origin)) {
    throw new Error(`Origen inválido: ${row.origin}`);
  }
  if (!isLeaveStatus(row.status)) {
    throw new Error(`Estado inválido: ${row.status}`);
  }
  if (!isReintegrationStatus(row.reintegration_status)) {
    throw new Error(`Estado de reintegro inválido: ${row.reintegration_status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    workerStatus: row.worker_status,
    companySnapshot: row.company_snapshot,
    jobTitleSnapshot: row.job_title_snapshot,
    farmId: row.farm_id,
    farmName: row.farm_name,
    startDate: row.start_date,
    endDate: row.end_date,
    daysOrdered: row.days_ordered,
    origin: row.origin,
    isExtension: row.is_extension,
    accumulatedDays: row.accumulated_days,
    status: row.status,
    sstFollowUp: row.sst_follow_up,
    reintegrationRequired: row.reintegration_required,
    reintegrationDate: row.reintegration_date,
    reintegrationStatus: row.reintegration_status,
    cie10: row.cie10,
    diagnosisLabel: row.diagnosis_label,
    issuer: row.issuer,
    adminObservations: row.admin_observations,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    complianceRecordId: row.compliance_record_id,
    reintegrationComplianceId: row.reintegration_compliance_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function selectLeaveById(id: string): Promise<SstLeave | null> {
  const sql = getSql();
  const rows = await sql<LeaveRow[]>`
    SELECT
      i.id, i.folio, i.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      i.company_snapshot, i.job_title_snapshot, i.farm_id, f.name AS farm_name,
      i.start_date::text, i.end_date::text, i.days_ordered, i.origin, i.is_extension,
      i.accumulated_days, i.status, i.sst_follow_up,
      i.reintegration_required, i.reintegration_date::text, i.reintegration_status,
      i.cie10, i.diagnosis_label, i.issuer, i.admin_observations,
      i.evidence_url, i.evidence_name,
      i.compliance_record_id, i.reintegration_compliance_id,
      i.created_at::text, i.updated_at::text
    FROM campus_sst.sst_incapacidades i
    INNER JOIN campus_sst.sst_workers w ON w.id = i.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = i.farm_id
    WHERE i.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapLeave(rows[0]) : null;
}

async function nextLeaveFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM campus_sst.sst_incapacidades
    WHERE folio LIKE ${`INC-${year}-%`}
  `;
  const next = (rows[0]?.count ?? 0) + 1;
  return `INC-${year}-${String(next).padStart(3, "0")}`;
}

async function sumWorkerAccumulatedDays(
  workerId: string,
  excludeId?: string,
): Promise<number> {
  const sql = getSql();
  const rows = await sql<{ total: number }[]>`
    SELECT COALESCE(SUM(days_ordered), 0)::int AS total
    FROM campus_sst.sst_incapacidades
    WHERE worker_id = ${workerId}
      AND (${excludeId ?? null}::uuid IS NULL OR id <> ${excludeId ?? null})
  `;
  return rows[0]?.total ?? 0;
}

function normalizeDraftFields(draft: SstLeaveDraft, previousAccumulated = 0) {
  const daysOrdered =
    draft.daysOrdered != null && draft.daysOrdered > 0
      ? draft.daysOrdered
      : computeDaysOrdered(draft.startDate, draft.endDate);

  const accumulatedDays =
    draft.accumulatedDays != null && draft.accumulatedDays > 0
      ? draft.accumulatedDays
      : previousAccumulated + daysOrdered;

  const reintegrationRequired = resolveReintegrationRequired({
    daysOrdered,
    accumulatedDays,
    reintegrationRequired: draft.reintegrationRequired,
  });

  let reintegrationStatus: ReintegrationStatus =
    draft.reintegrationStatus ?? "no_aplica";
  if (reintegrationRequired && reintegrationStatus === "no_aplica") {
    reintegrationStatus = "pendiente";
  }
  if (!reintegrationRequired) {
    reintegrationStatus = "no_aplica";
  }

  const status = deriveLeaveStatus({
    endDate: draft.endDate,
    reintegrationRequired,
    reintegrationStatus,
    explicitStatus: draft.status ?? null,
  });

  return {
    daysOrdered,
    accumulatedDays,
    reintegrationRequired,
    reintegrationStatus,
    status,
    reintegrationDate: draft.reintegrationDate?.trim() || null,
  };
}

function incapacidadWorkflow(status: LeaveStatus): SstWorkflowStatus {
  if (status === "cerrada") return "closed";
  if (status === "vencida_sin_cierre") return "pending_closure";
  if (status === "en_reintegro" || status === "por_vencer") return "in_progress";
  return "open";
}

function reintegroWorkflow(status: ReintegrationStatus): SstWorkflowStatus {
  if (status === "completado") return "closed";
  if (status === "programado") return "in_progress";
  return "open";
}

function complianceDraftFromLeave(leave: SstLeave): SstRecordDraft {
  return {
    recordType: "incapacidad",
    title: `Incapacidad ${leave.origin} — ${leave.workerName}`,
    code: leave.folio,
    workerId: leave.workerId,
    subjectName: leave.workerName,
    subjectDocument: leave.workerDocument,
    subjectJobTitle: leave.jobTitleSnapshot,
    farmId: leave.farmId,
    dueDate: leave.endDate,
    issuedAt: leave.startDate,
    workflowStatus: incapacidadWorkflow(leave.status),
    externalEntity: leave.issuer,
    notes: leave.adminObservations.slice(0, 500),
  };
}

function reintegroDraftFromLeave(leave: SstLeave): SstRecordDraft {
  return {
    recordType: "reintegro",
    title: `Reintegro — ${leave.workerName}`,
    code: `${leave.folio}-REI`,
    workerId: leave.workerId,
    subjectName: leave.workerName,
    subjectDocument: leave.workerDocument,
    subjectJobTitle: leave.jobTitleSnapshot,
    farmId: leave.farmId,
    dueDate: leave.reintegrationDate ?? leave.endDate,
    issuedAt: leave.endDate,
    workflowStatus: reintegroWorkflow(leave.reintegrationStatus),
    externalEntity: leave.issuer,
    notes: leave.sstFollowUp.slice(0, 500) || leave.adminObservations.slice(0, 500),
  };
}

async function upsertCompliance(
  leave: SstLeave,
  userId: string,
  kind: "incapacidad" | "reintegro",
): Promise<string> {
  const draft =
    kind === "incapacidad"
      ? complianceDraftFromLeave(leave)
      : reintegroDraftFromLeave(leave);
  const existingId =
    kind === "incapacidad"
      ? leave.complianceRecordId
      : leave.reintegrationComplianceId;
  const sql = getSql();

  if (existingId) {
    await updateComplianceRecord(existingId, draft, userId);
    return existingId;
  }

  const existing = await findComplianceRecordByCode(draft.recordType, draft.code);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    if (kind === "incapacidad") {
      await sql`
        UPDATE campus_sst.sst_incapacidades
        SET compliance_record_id = ${existing.id}, updated_at = now()
        WHERE id = ${leave.id}
      `;
    } else {
      await sql`
        UPDATE campus_sst.sst_incapacidades
        SET reintegration_compliance_id = ${existing.id}, updated_at = now()
        WHERE id = ${leave.id}
      `;
    }
    return existing.id;
  }

  const created = await createComplianceRecord(draft, userId);
  if (kind === "incapacidad") {
    await sql`
      UPDATE campus_sst.sst_incapacidades
      SET compliance_record_id = ${created.id}, updated_at = now()
      WHERE id = ${leave.id}
    `;
  } else {
    await sql`
      UPDATE campus_sst.sst_incapacidades
      SET reintegration_compliance_id = ${created.id}, updated_at = now()
      WHERE id = ${leave.id}
    `;
  }
  return created.id;
}

async function syncComplianceRecords(leave: SstLeave, userId: string): Promise<void> {
  await upsertCompliance(leave, userId, "incapacidad");

  const needsReintegro =
    leave.reintegrationRequired && leave.reintegrationStatus !== "completado";

  if (needsReintegro) {
    const refreshed = (await selectLeaveById(leave.id)) ?? leave;
    await upsertCompliance(refreshed, userId, "reintegro");
    return;
  }

  if (leave.reintegrationComplianceId) {
    try {
      await deleteComplianceRecord(leave.reintegrationComplianceId);
    } catch {
      // ignore missing
    }
    const sql = getSql();
    await sql`
      UPDATE campus_sst.sst_incapacidades
      SET reintegration_compliance_id = NULL, updated_at = now()
      WHERE id = ${leave.id}
    `;
  }
}

export async function listLeaves(filters?: {
  origin?: LeaveOrigin | "all";
  status?: LeaveStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstLeave[]> {
  const sql = getSql();
  const origin = filters?.origin && filters.origin !== "all" ? filters.origin : null;
  const status = filters?.status && filters.status !== "all" ? filters.status : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<LeaveRow[]>`
    SELECT
      i.id, i.folio, i.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      i.company_snapshot, i.job_title_snapshot, i.farm_id, f.name AS farm_name,
      i.start_date::text, i.end_date::text, i.days_ordered, i.origin, i.is_extension,
      i.accumulated_days, i.status, i.sst_follow_up,
      i.reintegration_required, i.reintegration_date::text, i.reintegration_status,
      i.cie10, i.diagnosis_label, i.issuer, i.admin_observations,
      i.evidence_url, i.evidence_name,
      i.compliance_record_id, i.reintegration_compliance_id,
      i.created_at::text, i.updated_at::text
    FROM campus_sst.sst_incapacidades i
    INNER JOIN campus_sst.sst_workers w ON w.id = i.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = i.farm_id
    WHERE (${origin}::text IS NULL OR i.origin = ${origin})
      AND (${status}::text IS NULL OR i.status = ${status})
      AND (${farmId}::uuid IS NULL OR i.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(i.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(i.cie10) LIKE ${q ? `%${q}%` : ""}
        OR lower(i.diagnosis_label) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE i.status
        WHEN 'vencida_sin_cierre' THEN 0
        WHEN 'en_reintegro' THEN 1
        WHEN 'por_vencer' THEN 2
        WHEN 'activa' THEN 3
        ELSE 4
      END,
      i.end_date ASC,
      i.start_date DESC
  `;
  return rows.map(mapLeave);
}

export async function listLeaveViews(
  filters?: Parameters<typeof listLeaves>[0],
): Promise<SstLeaveView[]> {
  return (await listLeaves(filters)).map((leave) => enrichLeaveAsView(leave));
}

export async function getLeave(id: string): Promise<SstLeave | null> {
  return selectLeaveById(id);
}

export async function findLeaveByFolio(folio: string): Promise<SstLeave | null> {
  const sql = getSql();
  const rows = await sql<LeaveRow[]>`
    SELECT
      i.id, i.folio, i.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      i.company_snapshot, i.job_title_snapshot, i.farm_id, f.name AS farm_name,
      i.start_date::text, i.end_date::text, i.days_ordered, i.origin, i.is_extension,
      i.accumulated_days, i.status, i.sst_follow_up,
      i.reintegration_required, i.reintegration_date::text, i.reintegration_status,
      i.cie10, i.diagnosis_label, i.issuer, i.admin_observations,
      i.evidence_url, i.evidence_name,
      i.compliance_record_id, i.reintegration_compliance_id,
      i.created_at::text, i.updated_at::text
    FROM campus_sst.sst_incapacidades i
    INNER JOIN campus_sst.sst_workers w ON w.id = i.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = i.farm_id
    WHERE lower(i.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapLeave(rows[0]) : null;
}

export async function getLeaveStats(): Promise<LeaveStats> {
  const views = await listLeaveViews();
  const byStatus: Record<LeaveStatus, number> = {
    activa: 0,
    por_vencer: 0,
    vencida_sin_cierre: 0,
    cerrada: 0,
    en_reintegro: 0,
  };
  const byOrigin: Record<LeaveOrigin, number> = {
    comun: 0,
    laboral_at: 0,
    laboral_el: 0,
    maternidad: 0,
    transito: 0,
  };
  const daysByOrigin: Record<LeaveOrigin, number> = {
    comun: 0,
    laboral_at: 0,
    laboral_el: 0,
    maternidad: 0,
    transito: 0,
  };
  let totalDays = 0;
  for (const view of views) {
    byStatus[view.status] += 1;
    byOrigin[view.origin] += 1;
    daysByOrigin[view.origin] += view.daysOrdered;
    totalDays += view.daysOrdered;
  }
  return {
    total: views.length,
    totalDays,
    byStatus,
    byOrigin,
    daysByOrigin,
    alerts: computeLeaveAlertStats(views),
  };
}

export async function getLeaveWorkerRanking(limit = 10): Promise<LeaveWorkerRanking[]> {
  const leaves = await listLeaves();
  const byWorker = new Map<
    string,
    {
      workerId: string;
      workerName: string;
      workerDocument: string;
      jobTitle: string;
      farmName: string | null;
      accumulatedDays: number;
      leaveCount: number;
      originDays: Record<LeaveOrigin, number>;
    }
  >();

  for (const leave of leaves) {
    const current = byWorker.get(leave.workerId) ?? {
      workerId: leave.workerId,
      workerName: leave.workerName,
      workerDocument: leave.workerDocument,
      jobTitle: leave.jobTitleSnapshot,
      farmName: leave.farmName,
      accumulatedDays: 0,
      leaveCount: 0,
      originDays: {
        comun: 0,
        laboral_at: 0,
        laboral_el: 0,
        maternidad: 0,
        transito: 0,
      },
    };
    current.accumulatedDays += leave.daysOrdered;
    current.leaveCount += 1;
    current.originDays[leave.origin] += leave.daysOrdered;
    byWorker.set(leave.workerId, current);
  }

  return [...byWorker.values()]
    .map((entry) => {
      let dominantOrigin: LeaveOrigin = "comun";
      let max = -1;
      for (const origin of Object.keys(entry.originDays) as LeaveOrigin[]) {
        if (entry.originDays[origin] > max) {
          max = entry.originDays[origin];
          dominantOrigin = origin;
        }
      }
      return {
        workerId: entry.workerId,
        workerName: entry.workerName,
        workerDocument: entry.workerDocument,
        jobTitle: entry.jobTitle,
        farmName: entry.farmName,
        accumulatedDays: entry.accumulatedDays,
        leaveCount: entry.leaveCount,
        dominantOrigin,
      };
    })
    .sort((a, b) => b.accumulatedDays - a.accumulatedDays)
    .slice(0, limit);
}

export async function createLeave(
  draft: SstLeaveDraft,
  userId: string,
): Promise<SstLeave> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const previous = await sumWorkerAccumulatedDays(draft.workerId);
  const fields = normalizeDraftFields(draft, previous);
  const sql = getSql();
  const folio = await nextLeaveFolio(sql);

  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_incapacidades (
      folio, worker_id, company_snapshot, job_title_snapshot, farm_id,
      start_date, end_date, days_ordered, origin, is_extension, accumulated_days,
      status, sst_follow_up, reintegration_required, reintegration_date,
      reintegration_status, cie10, diagnosis_label, issuer,
      admin_observations, evidence_url, evidence_name,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.workerId},
      ${worker.company},
      ${worker.jobTitle},
      ${worker.farmId},
      ${draft.startDate},
      ${draft.endDate},
      ${fields.daysOrdered},
      ${draft.origin},
      ${draft.isExtension},
      ${fields.accumulatedDays},
      ${fields.status},
      ${draft.sstFollowUp.trim()},
      ${fields.reintegrationRequired},
      ${fields.reintegrationDate},
      ${fields.reintegrationStatus},
      ${draft.cie10.trim()},
      ${draft.diagnosisLabel.trim()},
      ${draft.issuer.trim()},
      ${draft.adminObservations.trim()},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;

  const created = await selectLeaveById(rows[0].id);
  if (!created) throw new Error("No se pudo crear la incapacidad.");
  await syncComplianceRecords(created, userId);
  return (await selectLeaveById(created.id)) ?? created;
}

export async function updateLeave(
  id: string,
  draft: SstLeaveDraft,
  userId: string,
): Promise<SstLeave> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const previous = await sumWorkerAccumulatedDays(draft.workerId, id);
  const fields = normalizeDraftFields(draft, previous);
  const sql = getSql();

  await sql`
    UPDATE campus_sst.sst_incapacidades
    SET
      worker_id = ${draft.workerId},
      company_snapshot = ${worker.company},
      job_title_snapshot = ${worker.jobTitle},
      farm_id = ${worker.farmId},
      start_date = ${draft.startDate},
      end_date = ${draft.endDate},
      days_ordered = ${fields.daysOrdered},
      origin = ${draft.origin},
      is_extension = ${draft.isExtension},
      accumulated_days = ${fields.accumulatedDays},
      status = ${fields.status},
      sst_follow_up = ${draft.sstFollowUp.trim()},
      reintegration_required = ${fields.reintegrationRequired},
      reintegration_date = ${fields.reintegrationDate},
      reintegration_status = ${fields.reintegrationStatus},
      cie10 = ${draft.cie10.trim()},
      diagnosis_label = ${draft.diagnosisLabel.trim()},
      issuer = ${draft.issuer.trim()},
      admin_observations = ${draft.adminObservations.trim()},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;

  const updated = await selectLeaveById(id);
  if (!updated) throw new Error("Incapacidad no encontrada.");
  await syncComplianceRecords(updated, userId);
  return (await selectLeaveById(id)) ?? updated;
}

export async function deleteLeave(id: string): Promise<void> {
  const current = await selectLeaveById(id);
  if (!current) throw new Error("Incapacidad no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_incapacidades WHERE id = ${id}`;

  for (const complianceId of [
    current.complianceRecordId,
    current.reintegrationComplianceId,
  ]) {
    if (!complianceId) continue;
    try {
      await deleteComplianceRecord(complianceId);
    } catch {
      // ignore missing compliance
    }
  }
}
