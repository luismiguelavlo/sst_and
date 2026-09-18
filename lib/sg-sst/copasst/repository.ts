import "server-only";

import { getSql } from "@/lib/db";
import { nextSequentialCode } from "@/lib/sg-sst/next-sequential-code";
import {
  closeComplianceRecord,
  createComplianceRecord,
  deleteComplianceRecord,
  findComplianceRecordByCode,
  updateComplianceRecord,
} from "@/lib/sg-sst/alerts/repository";
import type { SstRecordDraft } from "@/lib/sg-sst/alerts/types";
import {
  deriveCommitmentStatus,
  enrichCommitmentAsView,
  enrichMemberAsView,
  isCopasstCommitmentStatus,
  isCopasstMeetingStatus,
  isCopasstMeetingType,
  isCopasstMemberStatus,
  isCopasstRole,
  isCopasstTrainingStatus,
  resolveCommitmentStatusToPersist,
  resolveMemberStatusToPersist,
  toCommitmentComplianceWorkflow,
  type CopasstCommitmentStatus,
  type CopasstStats,
  type SstCopasstCommitment,
  type SstCopasstCommitmentDraft,
  type SstCopasstCommitmentView,
  type SstCopasstMeeting,
  type SstCopasstMeetingDraft,
  type SstCopasstMember,
  type SstCopasstMemberDraft,
  type SstCopasstMemberView,
  type SstCopasstTraining,
  type SstCopasstTrainingDraft,
} from "@/lib/sg-sst/copasst/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type MemberRow = {
  id: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  company_snapshot: string;
  job_title_snapshot: string;
  role: string;
  period_label: string;
  start_date: string;
  end_date: string;
  status: string;
  farm_id: string | null;
  farm_name: string | null;
  observations: string;
  created_at: string;
  updated_at: string;
};

type MeetingRow = {
  id: string;
  folio: string;
  meeting_date: string;
  meeting_type: string;
  title: string;
  summary: string;
  act_url: string;
  act_name: string;
  next_meeting_date: string | null;
  status: string;
  farm_id: string | null;
  farm_name: string | null;
  observations: string;
  created_at: string;
  updated_at: string;
};

type CommitmentRow = {
  id: string;
  folio: string;
  meeting_id: string | null;
  meeting_folio: string | null;
  description: string;
  responsible_name: string;
  due_date: string;
  closed_at: string | null;
  status: string;
  follow_up: string;
  evidence_url: string;
  evidence_name: string;
  farm_id: string | null;
  farm_name: string | null;
  compliance_record_id: string | null;
  observations: string;
  created_at: string;
  updated_at: string;
};

type TrainingRow = {
  id: string;
  folio: string;
  title: string;
  training_date: string;
  hours: number;
  instructor: string;
  attendees_count: number;
  evidence_url: string;
  evidence_name: string;
  status: string;
  observations: string;
  created_at: string;
  updated_at: string;
};

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapMember(row: MemberRow): SstCopasstMember {
  if (!isCopasstRole(row.role)) throw new Error(`Rol inválido: ${row.role}`);
  if (!isCopasstMemberStatus(row.status)) {
    throw new Error(`Estado de integrante inválido: ${row.status}`);
  }
  return {
    id: row.id,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    companySnapshot: row.company_snapshot,
    jobTitleSnapshot: row.job_title_snapshot,
    role: row.role,
    periodLabel: row.period_label,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    farmId: row.farm_id,
    farmName: row.farm_name,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMeeting(row: MeetingRow): SstCopasstMeeting {
  if (!isCopasstMeetingType(row.meeting_type)) {
    throw new Error(`Tipo de reunión inválido: ${row.meeting_type}`);
  }
  if (!isCopasstMeetingStatus(row.status)) {
    throw new Error(`Estado de reunión inválido: ${row.status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    meetingDate: row.meeting_date,
    meetingType: row.meeting_type,
    title: row.title,
    summary: row.summary,
    actUrl: row.act_url,
    actName: row.act_name,
    nextMeetingDate: row.next_meeting_date,
    status: row.status,
    farmId: row.farm_id,
    farmName: row.farm_name,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCommitment(row: CommitmentRow): SstCopasstCommitment {
  if (!isCopasstCommitmentStatus(row.status)) {
    throw new Error(`Estado de compromiso inválido: ${row.status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    meetingId: row.meeting_id,
    meetingFolio: row.meeting_folio,
    description: row.description,
    responsibleName: row.responsible_name,
    dueDate: row.due_date,
    closedAt: row.closed_at,
    status: row.status,
    followUp: row.follow_up,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    farmId: row.farm_id,
    farmName: row.farm_name,
    complianceRecordId: row.compliance_record_id,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTraining(row: TrainingRow): SstCopasstTraining {
  if (!isCopasstTrainingStatus(row.status)) {
    throw new Error(`Estado de capacitación inválido: ${row.status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    title: row.title,
    trainingDate: row.training_date,
    hours: Number(row.hours),
    instructor: row.instructor,
    attendeesCount: Number(row.attendees_count),
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    status: row.status,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const MEMBER_SELECT = `
  m.id, m.worker_id,
  w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
  m.company_snapshot, m.job_title_snapshot, m.role, m.period_label,
  m.start_date::text, m.end_date::text, m.status,
  m.farm_id, f.name AS farm_name, m.observations,
  m.created_at::text, m.updated_at::text
`;

const MEETING_SELECT = `
  mt.id, mt.folio, mt.meeting_date::text, mt.meeting_type, mt.title, mt.summary,
  mt.act_url, mt.act_name, mt.next_meeting_date::text, mt.status,
  mt.farm_id, f.name AS farm_name, mt.observations,
  mt.created_at::text, mt.updated_at::text
`;

const COMMITMENT_SELECT = `
  c.id, c.folio, c.meeting_id, mt.folio AS meeting_folio,
  c.description, c.responsible_name, c.due_date::text, c.closed_at::text,
  c.status, c.follow_up, c.evidence_url, c.evidence_name,
  c.farm_id, f.name AS farm_name, c.compliance_record_id, c.observations,
  c.created_at::text, c.updated_at::text
`;

const TRAINING_SELECT = `
  t.id, t.folio, t.title, t.training_date::text, t.hours, t.instructor,
  t.attendees_count, t.evidence_url, t.evidence_name, t.status, t.observations,
  t.created_at::text, t.updated_at::text
`;

async function selectMemberById(id: string): Promise<SstCopasstMember | null> {
  const sql = getSql();
  const rows = await sql<MemberRow[]>`
    SELECT ${sql.unsafe(MEMBER_SELECT)}
    FROM campus_sst.sst_copasst_members m
    INNER JOIN campus_sst.sst_workers w ON w.id = m.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = m.farm_id
    WHERE m.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapMember(rows[0]) : null;
}

async function selectMeetingById(id: string): Promise<SstCopasstMeeting | null> {
  const sql = getSql();
  const rows = await sql<MeetingRow[]>`
    SELECT ${sql.unsafe(MEETING_SELECT)}
    FROM campus_sst.sst_copasst_meetings mt
    LEFT JOIN campus_sst.sst_farms f ON f.id = mt.farm_id
    WHERE mt.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapMeeting(rows[0]) : null;
}

async function selectCommitmentById(
  id: string,
): Promise<SstCopasstCommitment | null> {
  const sql = getSql();
  const rows = await sql<CommitmentRow[]>`
    SELECT ${sql.unsafe(COMMITMENT_SELECT)}
    FROM campus_sst.sst_copasst_commitments c
    LEFT JOIN campus_sst.sst_copasst_meetings mt ON mt.id = c.meeting_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
    WHERE c.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapCommitment(rows[0]) : null;
}

async function selectTrainingById(
  id: string,
): Promise<SstCopasstTraining | null> {
  const sql = getSql();
  const rows = await sql<TrainingRow[]>`
    SELECT ${sql.unsafe(TRAINING_SELECT)}
    FROM campus_sst.sst_copasst_trainings t
    WHERE t.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapTraining(rows[0]) : null;
}

async function nextMeetingFolio(
  sql: ReturnType<typeof getSql>,
): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_copasst_meetings", "folio", `COP-ACTA-${year}-`);
}

async function nextCommitmentFolio(
  sql: ReturnType<typeof getSql>,
): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_copasst_commitments", "folio", `COP-COM-${year}-`);
}

async function nextTrainingFolio(
  sql: ReturnType<typeof getSql>,
): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_copasst_trainings", "folio", `COP-CAP-${year}-`);
}

function resolveClosedAt(
  status: CopasstCommitmentStatus,
  closedAt: string | null | undefined,
): string | null {
  if (status !== "cerrado") return null;
  return emptyToNull(closedAt) ?? new Date().toISOString().slice(0, 10);
}

function complianceDraftFromCommitment(
  item: SstCopasstCommitment,
  effectiveStatus: CopasstCommitmentStatus,
): SstRecordDraft {
  return {
    recordType: "accion_correctiva",
    title: `COPASST compromiso ${item.folio}`,
    code: item.folio,
    subjectName: item.responsibleName || item.folio,
    farmId: item.farmId,
    dueDate: item.dueDate,
    issuedAt: item.createdAt.slice(0, 10),
    workflowStatus: toCommitmentComplianceWorkflow(effectiveStatus),
    responsibleName: item.responsibleName,
    notes: item.description.slice(0, 500),
  };
}

async function syncCommitmentCompliance(
  item: SstCopasstCommitment,
  userId: string,
): Promise<void> {
  const effectiveStatus = deriveCommitmentStatus(item.status, item.dueDate);
  const draft = complianceDraftFromCommitment(item, effectiveStatus);
  const sql = getSql();

  let recordId = item.complianceRecordId;

  if (!recordId) {
    const existing = await findComplianceRecordByCode(
      "accion_correctiva",
      item.folio,
    );
    if (existing) {
      recordId = existing.id;
      await sql`
        UPDATE campus_sst.sst_copasst_commitments
        SET compliance_record_id = ${existing.id}, updated_at = now()
        WHERE id = ${item.id}
      `;
    }
  }

  if (recordId) {
    await updateComplianceRecord(recordId, draft, userId);
  } else {
    const created = await createComplianceRecord(draft, userId);
    recordId = created.id;
    await sql`
      UPDATE campus_sst.sst_copasst_commitments
      SET compliance_record_id = ${created.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
  }

  if (effectiveStatus === "cerrado" && recordId) {
    try {
      await closeComplianceRecord(
        recordId,
        `Cierre COPASST compromiso ${item.folio}`,
        userId,
      );
    } catch {
      // ignore missing / already closed
    }
  }
}

export async function listMembers(): Promise<SstCopasstMember[]> {
  const sql = getSql();
  const rows = await sql<MemberRow[]>`
    SELECT ${sql.unsafe(MEMBER_SELECT)}
    FROM campus_sst.sst_copasst_members m
    INNER JOIN campus_sst.sst_workers w ON w.id = m.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = m.farm_id
    ORDER BY
      CASE m.role
        WHEN 'presidente' THEN 0
        WHEN 'vicepresidente' THEN 1
        WHEN 'secretario' THEN 2
        WHEN 'representante_empleador' THEN 3
        WHEN 'representante_trabajadores' THEN 4
        ELSE 5
      END,
      m.start_date DESC
  `;
  return rows.map(mapMember);
}

export async function listMemberViews(): Promise<SstCopasstMemberView[]> {
  return (await listMembers()).map((item) => enrichMemberAsView(item));
}

export async function findMemberByWorkerAndStart(
  workerId: string,
  startDate: string,
): Promise<SstCopasstMember | null> {
  const sql = getSql();
  const rows = await sql<MemberRow[]>`
    SELECT ${sql.unsafe(MEMBER_SELECT)}
    FROM campus_sst.sst_copasst_members m
    INNER JOIN campus_sst.sst_workers w ON w.id = m.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = m.farm_id
    WHERE m.worker_id = ${workerId}
      AND m.start_date = ${startDate}
    LIMIT 1
  `;
  return rows[0] ? mapMember(rows[0]) : null;
}

export async function createMember(
  draft: SstCopasstMemberDraft,
  userId: string,
): Promise<SstCopasstMember> {
  const worker = await getWorker(draft.workerId);
  if (!worker) throw new Error("Trabajador no encontrado.");
  const sql = getSql();
  const status = resolveMemberStatusToPersist(draft);
  const company = draft.companySnapshot.trim() || worker.company;
  const jobTitle = draft.jobTitleSnapshot.trim() || worker.jobTitle;
  const farmId = emptyToNull(draft.farmId ?? null) ?? worker.farmId;
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_copasst_members (
      worker_id, company_snapshot, job_title_snapshot, role, period_label,
      start_date, end_date, status, farm_id, observations,
      created_by, updated_by
    ) VALUES (
      ${draft.workerId},
      ${company},
      ${jobTitle},
      ${draft.role},
      ${draft.periodLabel.trim()},
      ${draft.startDate},
      ${draft.endDate},
      ${status},
      ${farmId},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectMemberById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el integrante.");
  return created;
}

export async function updateMember(
  id: string,
  draft: SstCopasstMemberDraft,
  userId: string,
): Promise<SstCopasstMember> {
  const worker = await getWorker(draft.workerId);
  if (!worker) throw new Error("Trabajador no encontrado.");
  const sql = getSql();
  const status = resolveMemberStatusToPersist(draft);
  const company = draft.companySnapshot.trim() || worker.company;
  const jobTitle = draft.jobTitleSnapshot.trim() || worker.jobTitle;
  await sql`
    UPDATE campus_sst.sst_copasst_members
    SET
      worker_id = ${draft.workerId},
      company_snapshot = ${company},
      job_title_snapshot = ${jobTitle},
      role = ${draft.role},
      period_label = ${draft.periodLabel.trim()},
      start_date = ${draft.startDate},
      end_date = ${draft.endDate},
      status = ${status},
      farm_id = ${emptyToNull(draft.farmId ?? null)},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectMemberById(id);
  if (!updated) throw new Error("Integrante no encontrado.");
  return updated;
}

export async function deleteMember(id: string): Promise<void> {
  const current = await selectMemberById(id);
  if (!current) throw new Error("Integrante no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_copasst_members WHERE id = ${id}`;
}

export async function listMeetings(): Promise<SstCopasstMeeting[]> {
  const sql = getSql();
  const rows = await sql<MeetingRow[]>`
    SELECT ${sql.unsafe(MEETING_SELECT)}
    FROM campus_sst.sst_copasst_meetings mt
    LEFT JOIN campus_sst.sst_farms f ON f.id = mt.farm_id
    ORDER BY mt.meeting_date DESC, mt.created_at DESC
  `;
  return rows.map(mapMeeting);
}

export async function findMeetingByFolio(
  folio: string,
): Promise<SstCopasstMeeting | null> {
  const sql = getSql();
  const rows = await sql<MeetingRow[]>`
    SELECT ${sql.unsafe(MEETING_SELECT)}
    FROM campus_sst.sst_copasst_meetings mt
    LEFT JOIN campus_sst.sst_farms f ON f.id = mt.farm_id
    WHERE lower(mt.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapMeeting(rows[0]) : null;
}

export async function createMeeting(
  draft: SstCopasstMeetingDraft,
  userId: string,
): Promise<SstCopasstMeeting> {
  const sql = getSql();
  const folio = await nextMeetingFolio(sql);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_copasst_meetings (
      folio, meeting_date, meeting_type, title, summary,
      act_url, act_name, next_meeting_date, status, farm_id, observations,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.meetingDate},
      ${draft.meetingType},
      ${draft.title.trim()},
      ${draft.summary.trim()},
      ${draft.actUrl.trim()},
      ${draft.actName.trim()},
      ${emptyToNull(draft.nextMeetingDate ?? null)},
      ${draft.status},
      ${emptyToNull(draft.farmId ?? null)},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectMeetingById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el acta / reunión.");
  return created;
}

export async function updateMeeting(
  id: string,
  draft: SstCopasstMeetingDraft,
  userId: string,
): Promise<SstCopasstMeeting> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_copasst_meetings
    SET
      meeting_date = ${draft.meetingDate},
      meeting_type = ${draft.meetingType},
      title = ${draft.title.trim()},
      summary = ${draft.summary.trim()},
      act_url = ${draft.actUrl.trim()},
      act_name = ${draft.actName.trim()},
      next_meeting_date = ${emptyToNull(draft.nextMeetingDate ?? null)},
      status = ${draft.status},
      farm_id = ${emptyToNull(draft.farmId ?? null)},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectMeetingById(id);
  if (!updated) throw new Error("Acta / reunión no encontrada.");
  return updated;
}

export async function deleteMeeting(id: string): Promise<void> {
  const current = await selectMeetingById(id);
  if (!current) throw new Error("Acta / reunión no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_copasst_meetings WHERE id = ${id}`;
}

export async function listCommitments(): Promise<SstCopasstCommitment[]> {
  const sql = getSql();
  const rows = await sql<CommitmentRow[]>`
    SELECT ${sql.unsafe(COMMITMENT_SELECT)}
    FROM campus_sst.sst_copasst_commitments c
    LEFT JOIN campus_sst.sst_copasst_meetings mt ON mt.id = c.meeting_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
    ORDER BY
      CASE c.status
        WHEN 'vencido' THEN 0
        WHEN 'abierto' THEN 1
        ELSE 2
      END,
      c.due_date ASC,
      c.created_at DESC
  `;
  return rows.map(mapCommitment);
}

export async function listCommitmentViews(): Promise<
  SstCopasstCommitmentView[]
> {
  return (await listCommitments()).map((item) => enrichCommitmentAsView(item));
}

export async function findCommitmentByFolio(
  folio: string,
): Promise<SstCopasstCommitment | null> {
  const sql = getSql();
  const rows = await sql<CommitmentRow[]>`
    SELECT ${sql.unsafe(COMMITMENT_SELECT)}
    FROM campus_sst.sst_copasst_commitments c
    LEFT JOIN campus_sst.sst_copasst_meetings mt ON mt.id = c.meeting_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
    WHERE lower(c.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapCommitment(rows[0]) : null;
}

export async function createCommitment(
  draft: SstCopasstCommitmentDraft,
  userId: string,
): Promise<SstCopasstCommitment> {
  const sql = getSql();
  const folio = await nextCommitmentFolio(sql);
  const status = resolveCommitmentStatusToPersist(draft);
  const closedAt = resolveClosedAt(status, draft.closedAt);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_copasst_commitments (
      folio, meeting_id, description, responsible_name, due_date, closed_at,
      status, follow_up, evidence_url, evidence_name, farm_id, observations,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${emptyToNull(draft.meetingId ?? null)},
      ${draft.description.trim()},
      ${draft.responsibleName.trim()},
      ${draft.dueDate},
      ${closedAt},
      ${status},
      ${draft.followUp.trim()},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${emptyToNull(draft.farmId ?? null)},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectCommitmentById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el compromiso.");
  await syncCommitmentCompliance(created, userId);
  return (await selectCommitmentById(created.id)) ?? created;
}

export async function updateCommitment(
  id: string,
  draft: SstCopasstCommitmentDraft,
  userId: string,
): Promise<SstCopasstCommitment> {
  const sql = getSql();
  const status = resolveCommitmentStatusToPersist(draft);
  const closedAt = resolveClosedAt(status, draft.closedAt);
  await sql`
    UPDATE campus_sst.sst_copasst_commitments
    SET
      meeting_id = ${emptyToNull(draft.meetingId ?? null)},
      description = ${draft.description.trim()},
      responsible_name = ${draft.responsibleName.trim()},
      due_date = ${draft.dueDate},
      closed_at = ${closedAt},
      status = ${status},
      follow_up = ${draft.followUp.trim()},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      farm_id = ${emptyToNull(draft.farmId ?? null)},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectCommitmentById(id);
  if (!updated) throw new Error("Compromiso no encontrado.");
  await syncCommitmentCompliance(updated, userId);
  return (await selectCommitmentById(id)) ?? updated;
}

export async function deleteCommitment(id: string): Promise<void> {
  const current = await selectCommitmentById(id);
  if (!current) throw new Error("Compromiso no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_copasst_commitments WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}

export async function listTrainings(): Promise<SstCopasstTraining[]> {
  const sql = getSql();
  const rows = await sql<TrainingRow[]>`
    SELECT ${sql.unsafe(TRAINING_SELECT)}
    FROM campus_sst.sst_copasst_trainings t
    ORDER BY t.training_date DESC, t.created_at DESC
  `;
  return rows.map(mapTraining);
}

export async function findTrainingByFolio(
  folio: string,
): Promise<SstCopasstTraining | null> {
  const sql = getSql();
  const rows = await sql<TrainingRow[]>`
    SELECT ${sql.unsafe(TRAINING_SELECT)}
    FROM campus_sst.sst_copasst_trainings t
    WHERE lower(t.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapTraining(rows[0]) : null;
}

export async function createTraining(
  draft: SstCopasstTrainingDraft,
  userId: string,
): Promise<SstCopasstTraining> {
  const sql = getSql();
  const folio = await nextTrainingFolio(sql);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_copasst_trainings (
      folio, title, training_date, hours, instructor, attendees_count,
      evidence_url, evidence_name, status, observations,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.title.trim()},
      ${draft.trainingDate},
      ${draft.hours},
      ${draft.instructor.trim()},
      ${draft.attendeesCount},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${draft.status},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectTrainingById(rows[0].id);
  if (!created) throw new Error("No se pudo crear la capacitación.");
  return created;
}

export async function updateTraining(
  id: string,
  draft: SstCopasstTrainingDraft,
  userId: string,
): Promise<SstCopasstTraining> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_copasst_trainings
    SET
      title = ${draft.title.trim()},
      training_date = ${draft.trainingDate},
      hours = ${draft.hours},
      instructor = ${draft.instructor.trim()},
      attendees_count = ${draft.attendeesCount},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      status = ${draft.status},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectTrainingById(id);
  if (!updated) throw new Error("Capacitación no encontrada.");
  return updated;
}

export async function deleteTraining(id: string): Promise<void> {
  const current = await selectTrainingById(id);
  if (!current) throw new Error("Capacitación no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_copasst_trainings WHERE id = ${id}`;
}

export async function getCopasstStats(): Promise<CopasstStats> {
  const [members, meetings, commitments, trainings] = await Promise.all([
    listMemberViews(),
    listMeetings(),
    listCommitmentViews(),
    listTrainings(),
  ]);

  const activeMembers = members.filter((m) => m.effectiveStatus === "activo");
  const periodEnds = activeMembers.map((m) => m.endDate).filter(Boolean).sort();
  const periodEndDate = periodEnds[0] ?? null;

  const nextFromProgramada = meetings
    .filter((m) => m.status === "programada")
    .map((m) => m.meetingDate);
  const nextFromFollowUp = meetings
    .map((m) => m.nextMeetingDate)
    .filter((d): d is string => Boolean(d));
  const nextCandidates = [...nextFromProgramada, ...nextFromFollowUp].sort();
  const today = new Date().toISOString().slice(0, 10);
  const nextMeetingDate =
    nextCandidates.find((d) => d >= today) ?? nextCandidates[0] ?? null;

  return {
    periodEndDate,
    nextMeetingDate,
    meetingsDone: meetings.filter((m) => m.status === "realizada").length,
    commitmentsOpen: commitments.filter(
      (c) => c.effectiveStatus === "abierto",
    ).length,
    commitmentsOverdue: commitments.filter(
      (c) => c.effectiveStatus === "vencido",
    ).length,
    membersActive: activeMembers.length,
    meetingsTotal: meetings.length,
    trainingsTotal: trainings.length,
  };
}
