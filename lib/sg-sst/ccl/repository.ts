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
  deriveCommitmentStatus,
  deriveMemberStatus,
  enrichCaseAsView,
  enrichCommitmentAsView,
  isCaseClosedLike,
  isCclCaseStatus,
  isCclCommitmentStatus,
  isCclMeetingStatus,
  isCclMeetingType,
  isCclMemberRole,
  isCclMemberStatus,
  toCaseComplianceWorkflow,
  toCommitmentComplianceWorkflow,
  type CclCaseStatus,
  type CclCommitmentStatus,
  type CclStats,
  type SstCclCase,
  type SstCclCaseDraft,
  type SstCclCaseView,
  type SstCclCommitment,
  type SstCclCommitmentDraft,
  type SstCclCommitmentView,
  type SstCclMeeting,
  type SstCclMeetingDraft,
  type SstCclMember,
  type SstCclMemberDraft,
} from "@/lib/sg-sst/ccl/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

/* ─── Row types ────────────────────────────────────────────────────────── */

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
  status: string;
  farm_id: string | null;
  farm_name: string | null;
  observations: string;
  created_at: string;
  updated_at: string;
};

type CaseRow = {
  id: string;
  code: string;
  opened_at: string;
  due_date: string | null;
  closed_at: string | null;
  status: string;
  activity_summary: string;
  follow_up: string;
  meeting_id: string | null;
  meeting_folio: string | null;
  compliance_record_id: string | null;
  observations: string;
  created_at: string;
  updated_at: string;
};

type CommitmentRow = {
  id: string;
  folio: string;
  meeting_id: string | null;
  meeting_folio: string | null;
  case_id: string | null;
  case_code: string | null;
  description: string;
  responsible_name: string;
  due_date: string;
  closed_at: string | null;
  status: string;
  follow_up: string;
  compliance_record_id: string | null;
  observations: string;
  created_at: string;
  updated_at: string;
};

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapMember(row: MemberRow): SstCclMember {
  if (!isCclMemberRole(row.role)) {
    throw new Error(`Rol CCL inválido: ${row.role}`);
  }
  if (!isCclMemberStatus(row.status)) {
    throw new Error(`Estado de integrante inválido: ${row.status}`);
  }
  const status = deriveMemberStatus(row.status, row.end_date);
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
    status,
    farmId: row.farm_id,
    farmName: row.farm_name,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMeeting(row: MeetingRow): SstCclMeeting {
  if (!isCclMeetingType(row.meeting_type)) {
    throw new Error(`Tipo de acta inválido: ${row.meeting_type}`);
  }
  if (!isCclMeetingStatus(row.status)) {
    throw new Error(`Estado de acta inválido: ${row.status}`);
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
    status: row.status,
    farmId: row.farm_id,
    farmName: row.farm_name,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCase(row: CaseRow): SstCclCase {
  if (!isCclCaseStatus(row.status)) {
    throw new Error(`Estado de caso inválido: ${row.status}`);
  }
  return {
    id: row.id,
    code: row.code,
    openedAt: row.opened_at,
    dueDate: row.due_date,
    closedAt: row.closed_at,
    status: row.status,
    activitySummary: row.activity_summary,
    followUp: row.follow_up,
    meetingId: row.meeting_id,
    meetingFolio: row.meeting_folio,
    complianceRecordId: row.compliance_record_id,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCommitment(row: CommitmentRow): SstCclCommitment {
  if (!isCclCommitmentStatus(row.status)) {
    throw new Error(`Estado de compromiso inválido: ${row.status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    meetingId: row.meeting_id,
    meetingFolio: row.meeting_folio,
    caseId: row.case_id,
    caseCode: row.case_code,
    description: row.description,
    responsibleName: row.responsible_name,
    dueDate: row.due_date,
    closedAt: row.closed_at,
    status: row.status,
    followUp: row.follow_up,
    complianceRecordId: row.compliance_record_id,
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
  a.id, a.folio, a.meeting_date::text, a.meeting_type, a.title, a.summary,
  a.act_url, a.act_name, a.status, a.farm_id, f.name AS farm_name,
  a.observations, a.created_at::text, a.updated_at::text
`;

const CASE_SELECT = `
  c.id, c.code, c.opened_at::text, c.due_date::text, c.closed_at::text,
  c.status, c.activity_summary, c.follow_up,
  c.meeting_id, mt.folio AS meeting_folio,
  c.compliance_record_id, c.observations,
  c.created_at::text, c.updated_at::text
`;

const COMMITMENT_SELECT = `
  k.id, k.folio, k.meeting_id, mt.folio AS meeting_folio,
  k.case_id, cs.code AS case_code,
  k.description, k.responsible_name, k.due_date::text, k.closed_at::text,
  k.status, k.follow_up, k.compliance_record_id, k.observations,
  k.created_at::text, k.updated_at::text
`;

async function selectMemberById(id: string): Promise<SstCclMember | null> {
  const sql = getSql();
  const rows = await sql<MemberRow[]>`
    SELECT ${sql.unsafe(MEMBER_SELECT)}
    FROM campus_sst.sst_ccl_members m
    INNER JOIN campus_sst.sst_workers w ON w.id = m.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = m.farm_id
    WHERE m.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapMember(rows[0]) : null;
}

async function selectMeetingById(id: string): Promise<SstCclMeeting | null> {
  const sql = getSql();
  const rows = await sql<MeetingRow[]>`
    SELECT ${sql.unsafe(MEETING_SELECT)}
    FROM campus_sst.sst_ccl_meetings a
    LEFT JOIN campus_sst.sst_farms f ON f.id = a.farm_id
    WHERE a.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapMeeting(rows[0]) : null;
}

async function selectCaseById(id: string): Promise<SstCclCase | null> {
  const sql = getSql();
  const rows = await sql<CaseRow[]>`
    SELECT ${sql.unsafe(CASE_SELECT)}
    FROM campus_sst.sst_ccl_cases c
    LEFT JOIN campus_sst.sst_ccl_meetings mt ON mt.id = c.meeting_id
    WHERE c.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapCase(rows[0]) : null;
}

async function selectCommitmentById(
  id: string,
): Promise<SstCclCommitment | null> {
  const sql = getSql();
  const rows = await sql<CommitmentRow[]>`
    SELECT ${sql.unsafe(COMMITMENT_SELECT)}
    FROM campus_sst.sst_ccl_commitments k
    LEFT JOIN campus_sst.sst_ccl_meetings mt ON mt.id = k.meeting_id
    LEFT JOIN campus_sst.sst_ccl_cases cs ON cs.id = k.case_id
    WHERE k.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapCommitment(rows[0]) : null;
}

async function nextMeetingFolio(
  sql: ReturnType<typeof getSql>,
): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_ccl_meetings", "folio", `CCL-ACTA-${year}-`);
}

async function nextCaseCode(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_ccl_cases", "code", `CCL-${year}-EXP-`);
}

async function nextCommitmentFolio(
  sql: ReturnType<typeof getSql>,
): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_ccl_commitments", "folio", `CCL-COM-${year}-`);
}

function resolveCaseClosedAt(
  status: CclCaseStatus,
  closedAt: string | null | undefined,
): string | null {
  if (!isCaseClosedLike(status)) return null;
  return emptyToNull(closedAt) ?? new Date().toISOString().slice(0, 10);
}

function resolveCommitmentClosedAt(
  status: CclCommitmentStatus,
  closedAt: string | null | undefined,
): string | null {
  if (status !== "cerrado") return null;
  return emptyToNull(closedAt) ?? new Date().toISOString().slice(0, 10);
}

/**
 * Compliance: título y sujeto sin datos sensibles (solo código).
 * Solo sincroniza cuando hay due_date.
 */
function complianceDraftFromCase(item: SstCclCase): SstRecordDraft | null {
  if (!item.dueDate) return null;
  return {
    recordType: "investigacion",
    title: `CCL caso ${item.code}`,
    code: item.code,
    subjectName: item.code,
    dueDate: item.dueDate,
    issuedAt: item.openedAt,
    workflowStatus: toCaseComplianceWorkflow(item.status),
    notes: item.activitySummary.slice(0, 200),
  };
}

function complianceDraftFromCommitment(
  item: SstCclCommitment,
  effectiveStatus: CclCommitmentStatus,
): SstRecordDraft {
  return {
    recordType: "accion_correctiva",
    title: `Compromiso CCL ${item.folio}`,
    code: item.folio,
    subjectName: item.responsibleName || item.folio,
    dueDate: item.dueDate,
    issuedAt: item.createdAt.slice(0, 10),
    workflowStatus: toCommitmentComplianceWorkflow(effectiveStatus),
    responsibleName: item.responsibleName,
    notes: item.description.slice(0, 500),
  };
}

async function syncCaseCompliance(
  item: SstCclCase,
  userId: string,
): Promise<void> {
  const draft = complianceDraftFromCase(item);
  const sql = getSql();

  if (!draft) {
    if (item.complianceRecordId) {
      try {
        await deleteComplianceRecord(item.complianceRecordId);
      } catch {
        // ignore
      }
      await sql`
        UPDATE campus_sst.sst_ccl_cases
        SET compliance_record_id = NULL, updated_at = now()
        WHERE id = ${item.id}
      `;
    }
    return;
  }

  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("investigacion", item.code);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_ccl_cases
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_ccl_cases
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

async function syncCommitmentCompliance(
  item: SstCclCommitment,
  userId: string,
): Promise<void> {
  const effectiveStatus = deriveCommitmentStatus(item.status, item.dueDate);
  const draft = complianceDraftFromCommitment(item, effectiveStatus);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode(
    "accion_correctiva",
    item.folio,
  );
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_ccl_commitments
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_ccl_commitments
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

/* ─── Members ──────────────────────────────────────────────────────────── */

export async function listMembers(): Promise<SstCclMember[]> {
  const sql = getSql();
  const rows = await sql<MemberRow[]>`
    SELECT ${sql.unsafe(MEMBER_SELECT)}
    FROM campus_sst.sst_ccl_members m
    INNER JOIN campus_sst.sst_workers w ON w.id = m.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = m.farm_id
    ORDER BY
      CASE m.role
        WHEN 'presidente' THEN 0
        WHEN 'secretario' THEN 1
        WHEN 'representante_empleador' THEN 2
        WHEN 'representante_trabajadores' THEN 3
        ELSE 4
      END,
      w.full_name ASC
  `;
  return rows.map(mapMember);
}

export async function createMember(
  draft: SstCclMemberDraft,
  userId: string,
): Promise<SstCclMember> {
  const worker = await getWorker(draft.workerId);
  if (!worker) throw new Error("Trabajador no encontrado en la base maestra.");
  const status = deriveMemberStatus(draft.status, draft.endDate);
  const farmId = emptyToNull(draft.farmId ?? null) ?? worker.farmId;
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_ccl_members (
      worker_id, company_snapshot, job_title_snapshot, role, period_label,
      start_date, end_date, status, farm_id, observations, created_by, updated_by
    ) VALUES (
      ${draft.workerId},
      ${worker.company},
      ${worker.jobTitle},
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
  if (!created) throw new Error("No se pudo crear el integrante CCL.");
  return created;
}

export async function updateMember(
  id: string,
  draft: SstCclMemberDraft,
  userId: string,
): Promise<SstCclMember> {
  const worker = await getWorker(draft.workerId);
  if (!worker) throw new Error("Trabajador no encontrado en la base maestra.");
  const status = deriveMemberStatus(draft.status, draft.endDate);
  const farmId = emptyToNull(draft.farmId ?? null) ?? worker.farmId;
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_ccl_members
    SET
      worker_id = ${draft.workerId},
      company_snapshot = ${worker.company},
      job_title_snapshot = ${worker.jobTitle},
      role = ${draft.role},
      period_label = ${draft.periodLabel.trim()},
      start_date = ${draft.startDate},
      end_date = ${draft.endDate},
      status = ${status},
      farm_id = ${farmId},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectMemberById(id);
  if (!updated) throw new Error("Integrante CCL no encontrado.");
  return updated;
}

export async function deleteMember(id: string): Promise<void> {
  const current = await selectMemberById(id);
  if (!current) throw new Error("Integrante CCL no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_ccl_members WHERE id = ${id}`;
}

/* ─── Meetings ─────────────────────────────────────────────────────────── */

export async function listMeetings(): Promise<SstCclMeeting[]> {
  const sql = getSql();
  const rows = await sql<MeetingRow[]>`
    SELECT ${sql.unsafe(MEETING_SELECT)}
    FROM campus_sst.sst_ccl_meetings a
    LEFT JOIN campus_sst.sst_farms f ON f.id = a.farm_id
    ORDER BY a.meeting_date DESC, a.created_at DESC
  `;
  return rows.map(mapMeeting);
}

export async function findMeetingByFolio(
  folio: string,
): Promise<SstCclMeeting | null> {
  const sql = getSql();
  const rows = await sql<MeetingRow[]>`
    SELECT ${sql.unsafe(MEETING_SELECT)}
    FROM campus_sst.sst_ccl_meetings a
    LEFT JOIN campus_sst.sst_farms f ON f.id = a.farm_id
    WHERE lower(a.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapMeeting(rows[0]) : null;
}

export async function createMeeting(
  draft: SstCclMeetingDraft,
  userId: string,
): Promise<SstCclMeeting> {
  const sql = getSql();
  const folio = await nextMeetingFolio(sql);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_ccl_meetings (
      folio, meeting_date, meeting_type, title, summary,
      act_url, act_name, status, farm_id, observations, created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.meetingDate},
      ${draft.meetingType},
      ${draft.title.trim()},
      ${draft.summary.trim()},
      ${draft.actUrl.trim()},
      ${draft.actName.trim()},
      ${draft.status},
      ${emptyToNull(draft.farmId ?? null)},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectMeetingById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el acta CCL.");
  return created;
}

export async function updateMeeting(
  id: string,
  draft: SstCclMeetingDraft,
  userId: string,
): Promise<SstCclMeeting> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_ccl_meetings
    SET
      meeting_date = ${draft.meetingDate},
      meeting_type = ${draft.meetingType},
      title = ${draft.title.trim()},
      summary = ${draft.summary.trim()},
      act_url = ${draft.actUrl.trim()},
      act_name = ${draft.actName.trim()},
      status = ${draft.status},
      farm_id = ${emptyToNull(draft.farmId ?? null)},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectMeetingById(id);
  if (!updated) throw new Error("Acta CCL no encontrada.");
  return updated;
}

export async function deleteMeeting(id: string): Promise<void> {
  const current = await selectMeetingById(id);
  if (!current) throw new Error("Acta CCL no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_ccl_meetings WHERE id = ${id}`;
}

/* ─── Cases (anon) ─────────────────────────────────────────────────────── */

export async function listCases(): Promise<SstCclCase[]> {
  const sql = getSql();
  const rows = await sql<CaseRow[]>`
    SELECT ${sql.unsafe(CASE_SELECT)}
    FROM campus_sst.sst_ccl_cases c
    LEFT JOIN campus_sst.sst_ccl_meetings mt ON mt.id = c.meeting_id
    ORDER BY
      CASE c.status
        WHEN 'abierto' THEN 0
        WHEN 'en_tramite' THEN 1
        WHEN 'seguimiento' THEN 2
        WHEN 'cerrado' THEN 3
        ELSE 4
      END,
      c.due_date ASC NULLS LAST,
      c.opened_at DESC
  `;
  return rows.map(mapCase);
}

export async function listCaseViews(): Promise<SstCclCaseView[]> {
  return (await listCases()).map((item) => enrichCaseAsView(item));
}

export async function findCaseByCode(code: string): Promise<SstCclCase | null> {
  const sql = getSql();
  const rows = await sql<CaseRow[]>`
    SELECT ${sql.unsafe(CASE_SELECT)}
    FROM campus_sst.sst_ccl_cases c
    LEFT JOIN campus_sst.sst_ccl_meetings mt ON mt.id = c.meeting_id
    WHERE lower(c.code) = lower(${code.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapCase(rows[0]) : null;
}

export async function createCase(
  draft: SstCclCaseDraft,
  userId: string,
): Promise<SstCclCase> {
  const sql = getSql();
  const code = await nextCaseCode(sql);
  const closedAt = resolveCaseClosedAt(draft.status, draft.closedAt);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_ccl_cases (
      code, opened_at, due_date, closed_at, status, activity_summary,
      follow_up, meeting_id, observations, created_by, updated_by
    ) VALUES (
      ${code},
      ${draft.openedAt},
      ${emptyToNull(draft.dueDate)},
      ${closedAt},
      ${draft.status},
      ${draft.activitySummary.trim()},
      ${draft.followUp.trim()},
      ${emptyToNull(draft.meetingId ?? null)},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectCaseById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el caso CCL.");
  await syncCaseCompliance(created, userId);
  return (await selectCaseById(created.id)) ?? created;
}

export async function updateCase(
  id: string,
  draft: SstCclCaseDraft,
  userId: string,
): Promise<SstCclCase> {
  const sql = getSql();
  const closedAt = resolveCaseClosedAt(draft.status, draft.closedAt);
  await sql`
    UPDATE campus_sst.sst_ccl_cases
    SET
      opened_at = ${draft.openedAt},
      due_date = ${emptyToNull(draft.dueDate)},
      closed_at = ${closedAt},
      status = ${draft.status},
      activity_summary = ${draft.activitySummary.trim()},
      follow_up = ${draft.followUp.trim()},
      meeting_id = ${emptyToNull(draft.meetingId ?? null)},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectCaseById(id);
  if (!updated) throw new Error("Caso CCL no encontrado.");
  await syncCaseCompliance(updated, userId);
  return (await selectCaseById(id)) ?? updated;
}

export async function deleteCase(id: string): Promise<void> {
  const current = await selectCaseById(id);
  if (!current) throw new Error("Caso CCL no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_ccl_cases WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore
    }
  }
}

/* ─── Commitments ──────────────────────────────────────────────────────── */

export async function listCommitments(): Promise<SstCclCommitment[]> {
  const sql = getSql();
  const rows = await sql<CommitmentRow[]>`
    SELECT ${sql.unsafe(COMMITMENT_SELECT)}
    FROM campus_sst.sst_ccl_commitments k
    LEFT JOIN campus_sst.sst_ccl_meetings mt ON mt.id = k.meeting_id
    LEFT JOIN campus_sst.sst_ccl_cases cs ON cs.id = k.case_id
    ORDER BY
      CASE k.status
        WHEN 'vencido' THEN 0
        WHEN 'abierto' THEN 1
        ELSE 2
      END,
      k.due_date ASC,
      k.created_at DESC
  `;
  return rows.map(mapCommitment);
}

export async function listCommitmentViews(): Promise<SstCclCommitmentView[]> {
  return (await listCommitments()).map((item) => enrichCommitmentAsView(item));
}

export async function findCommitmentByFolio(
  folio: string,
): Promise<SstCclCommitment | null> {
  const sql = getSql();
  const rows = await sql<CommitmentRow[]>`
    SELECT ${sql.unsafe(COMMITMENT_SELECT)}
    FROM campus_sst.sst_ccl_commitments k
    LEFT JOIN campus_sst.sst_ccl_meetings mt ON mt.id = k.meeting_id
    LEFT JOIN campus_sst.sst_ccl_cases cs ON cs.id = k.case_id
    WHERE lower(k.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapCommitment(rows[0]) : null;
}

export async function createCommitment(
  draft: SstCclCommitmentDraft,
  userId: string,
): Promise<SstCclCommitment> {
  const sql = getSql();
  const folio = await nextCommitmentFolio(sql);
  const status = deriveCommitmentStatus(draft.status, draft.dueDate);
  const closedAt = resolveCommitmentClosedAt(status, draft.closedAt);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_ccl_commitments (
      folio, meeting_id, case_id, description, responsible_name,
      due_date, closed_at, status, follow_up, observations, created_by, updated_by
    ) VALUES (
      ${folio},
      ${emptyToNull(draft.meetingId ?? null)},
      ${emptyToNull(draft.caseId ?? null)},
      ${draft.description.trim()},
      ${draft.responsibleName.trim()},
      ${draft.dueDate},
      ${closedAt},
      ${status},
      ${draft.followUp.trim()},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectCommitmentById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el compromiso CCL.");
  await syncCommitmentCompliance(created, userId);
  return (await selectCommitmentById(created.id)) ?? created;
}

export async function updateCommitment(
  id: string,
  draft: SstCclCommitmentDraft,
  userId: string,
): Promise<SstCclCommitment> {
  const sql = getSql();
  const status = deriveCommitmentStatus(draft.status, draft.dueDate);
  const closedAt = resolveCommitmentClosedAt(status, draft.closedAt);
  await sql`
    UPDATE campus_sst.sst_ccl_commitments
    SET
      meeting_id = ${emptyToNull(draft.meetingId ?? null)},
      case_id = ${emptyToNull(draft.caseId ?? null)},
      description = ${draft.description.trim()},
      responsible_name = ${draft.responsibleName.trim()},
      due_date = ${draft.dueDate},
      closed_at = ${closedAt},
      status = ${status},
      follow_up = ${draft.followUp.trim()},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectCommitmentById(id);
  if (!updated) throw new Error("Compromiso CCL no encontrado.");
  await syncCommitmentCompliance(updated, userId);
  return (await selectCommitmentById(id)) ?? updated;
}

export async function deleteCommitment(id: string): Promise<void> {
  const current = await selectCommitmentById(id);
  if (!current) throw new Error("Compromiso CCL no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_ccl_commitments WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore
    }
  }
}

/* ─── Stats ────────────────────────────────────────────────────────────── */

export async function getCclStats(): Promise<CclStats> {
  const [members, meetings, cases, commitments] = await Promise.all([
    listMembers(),
    listMeetings(),
    listCases(),
    listCommitmentViews(),
  ]);

  const year = new Date().getFullYear();
  const activos = members.filter((m) => m.status === "activo");
  const periodLabels = [
    ...new Set(activos.map((m) => m.periodLabel.trim()).filter(Boolean)),
  ];
  const vigenciaLabel =
    periodLabels[0] ||
    (activos.length > 0
      ? `${activos[0].startDate.slice(0, 4)} - ${activos[0].endDate.slice(0, 4)}`
      : "Sin periodo");

  let vigenciaDetail = `${activos.length} integrantes activos`;
  if (activos.length > 0) {
    const ends = activos.map((m) => m.endDate).sort();
    vigenciaDetail = `Hasta ${ends[ends.length - 1]} · ${activos.length} activos`;
  }

  return {
    vigenciaLabel,
    vigenciaDetail,
    casosAbiertos: cases.filter((c) => c.status === "abierto").length,
    casosEnTramite: cases.filter(
      (c) => c.status === "en_tramite" || c.status === "seguimiento",
    ).length,
    compromisosAbiertos: commitments.filter(
      (c) => c.effectiveStatus === "abierto" || c.effectiveStatus === "vencido",
    ).length,
    actasPeriodo: meetings.filter(
      (m) =>
        m.meetingDate.startsWith(String(year)) && m.status !== "cancelada",
    ).length,
    miembrosActivos: activos.length,
  };
}
