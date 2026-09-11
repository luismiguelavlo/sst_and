import "server-only";

import { getSql } from "@/lib/db";
import {
  createComplianceRecord,
  deleteComplianceRecord,
  findComplianceRecordByCode,
  updateComplianceRecord,
} from "@/lib/sg-sst/alerts/repository";
import type { SstRecordDraft } from "@/lib/sg-sst/alerts/types";
import {
  addDaysIso,
  computeAccidentStats,
  computeCausesRanking,
  isAccidentEventType,
  isAccidentStatus,
  toInvestigationWorkflowStatus,
  type AccidentEventType,
  type AccidentStats,
  type AccidentStatus,
  type CausesRanking,
  type SstAccidentCauses,
  type SstAccidentCausesDraft,
  type SstAccidentEvent,
  type SstAccidentEventDraft,
} from "@/lib/sg-sst/accidentes/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type AccidentRow = {
  id: string;
  event_number: string;
  event_date: string;
  event_time: string | null;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  company_snapshot: string;
  job_title_snapshot: string;
  area_snapshot: string;
  work_center_snapshot: string;
  farm_id: string | null;
  farm_name: string | null;
  event_type: string;
  description: string;
  accident_kind: string;
  mechanism: string;
  agent: string;
  body_part: string;
  injury_type: string;
  lost_days: number;
  origin: string;
  status: string;
  investigation_notes: string;
  corrective_action_notes: string;
  evidence_url: string;
  evidence_name: string;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

type CauseRow = {
  id: string;
  accident_id: string;
  immediate_act: string;
  immediate_condition: string;
  basic_personal: string;
  basic_work: string;
  root_cause: string;
  agent: string;
  mechanism: string;
  corrective_action: string;
  preventive_action: string;
  created_at: string;
  updated_at: string;
};

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapCauses(row: CauseRow): SstAccidentCauses {
  return {
    id: row.id,
    accidentId: row.accident_id,
    immediateAct: row.immediate_act,
    immediateCondition: row.immediate_condition,
    basicPersonal: row.basic_personal,
    basicWork: row.basic_work,
    rootCause: row.root_cause,
    agent: row.agent,
    mechanism: row.mechanism,
    correctiveAction: row.corrective_action,
    preventiveAction: row.preventive_action,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAccident(
  row: AccidentRow,
  causes: SstAccidentCauses | null = null,
): SstAccidentEvent {
  if (!isAccidentEventType(row.event_type)) {
    throw new Error(`Tipo de evento inválido: ${row.event_type}`);
  }
  if (!isAccidentStatus(row.status)) {
    throw new Error(`Estado de accidente inválido: ${row.status}`);
  }
  return {
    id: row.id,
    eventNumber: row.event_number,
    eventDate: row.event_date,
    eventTime: row.event_time,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    companySnapshot: row.company_snapshot,
    jobTitleSnapshot: row.job_title_snapshot,
    areaSnapshot: row.area_snapshot,
    workCenterSnapshot: row.work_center_snapshot,
    farmId: row.farm_id,
    farmName: row.farm_name,
    eventType: row.event_type,
    description: row.description,
    accidentKind: row.accident_kind,
    mechanism: row.mechanism,
    agent: row.agent,
    bodyPart: row.body_part,
    injuryType: row.injury_type,
    lostDays: row.lost_days,
    origin: row.origin,
    status: row.status,
    investigationNotes: row.investigation_notes,
    correctiveActionNotes: row.corrective_action_notes,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    causes,
  };
}

const ACCIDENT_SELECT = `
  e.id, e.event_number, e.event_date::text, e.event_time::text,
  e.worker_id, w.worker_code, w.full_name AS worker_name,
  w.document_number AS worker_document,
  e.company_snapshot, e.job_title_snapshot, e.area_snapshot, e.work_center_snapshot,
  e.farm_id, f.name AS farm_name, e.event_type, e.description, e.accident_kind,
  e.mechanism, e.agent, e.body_part, e.injury_type, e.lost_days, e.origin, e.status,
  e.investigation_notes, e.corrective_action_notes, e.evidence_url, e.evidence_name,
  e.compliance_record_id, e.created_at::text, e.updated_at::text
`;

async function nextEventNumber(
  sql: ReturnType<typeof getSql>,
  eventType: AccidentEventType,
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = eventType === "accidente_trabajo" ? "AT" : "INC";
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM campus_sst.sst_accident_events
    WHERE event_number LIKE ${`${prefix}-${year}-%`}
  `;
  const next = (rows[0]?.count ?? 0) + 1;
  return `${prefix}-${year}-${String(next).padStart(3, "0")}`;
}

async function nextInvestigationFolio(
  sql: ReturnType<typeof getSql>,
): Promise<string> {
  const year = new Date().getFullYear();
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM campus_sst.sst_investigations
    WHERE folio LIKE ${`INV-${year}-%`}
  `;
  const next = (rows[0]?.count ?? 0) + 1;
  return `INV-${year}-${String(next).padStart(3, "0")}`;
}

export async function listCausesByAccidentIds(
  accidentIds: readonly string[],
): Promise<Map<string, SstAccidentCauses>> {
  const map = new Map<string, SstAccidentCauses>();
  if (accidentIds.length === 0) return map;
  const sql = getSql();
  const rows = await sql<CauseRow[]>`
    SELECT
      id, accident_id, immediate_act, immediate_condition, basic_personal,
      basic_work, root_cause, agent, mechanism, corrective_action, preventive_action,
      created_at::text, updated_at::text
    FROM campus_sst.sst_accident_causes
    WHERE accident_id = ANY(${accidentIds as string[]})
  `;
  for (const row of rows) {
    map.set(row.accident_id, mapCauses(row));
  }
  return map;
}

async function selectAccidentById(id: string): Promise<SstAccidentEvent | null> {
  const sql = getSql();
  const rows = await sql<AccidentRow[]>`
    SELECT ${sql.unsafe(ACCIDENT_SELECT)}
    FROM campus_sst.sst_accident_events e
    INNER JOIN campus_sst.sst_workers w ON w.id = e.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
    WHERE e.id = ${id}
    LIMIT 1
  `;
  if (!rows[0]) return null;
  const causesMap = await listCausesByAccidentIds([id]);
  return mapAccident(rows[0], causesMap.get(id) ?? null);
}

export async function upsertAccidentCauses(
  accidentId: string,
  draft: SstAccidentCausesDraft,
): Promise<SstAccidentCauses> {
  const sql = getSql();
  const rows = await sql<CauseRow[]>`
    INSERT INTO campus_sst.sst_accident_causes (
      accident_id, immediate_act, immediate_condition, basic_personal, basic_work,
      root_cause, agent, mechanism, corrective_action, preventive_action
    ) VALUES (
      ${accidentId},
      ${draft.immediateAct.trim()},
      ${draft.immediateCondition.trim()},
      ${draft.basicPersonal.trim()},
      ${draft.basicWork.trim()},
      ${draft.rootCause.trim()},
      ${draft.agent.trim()},
      ${draft.mechanism.trim()},
      ${draft.correctiveAction.trim()},
      ${draft.preventiveAction.trim()}
    )
    ON CONFLICT (accident_id) DO UPDATE SET
      immediate_act = EXCLUDED.immediate_act,
      immediate_condition = EXCLUDED.immediate_condition,
      basic_personal = EXCLUDED.basic_personal,
      basic_work = EXCLUDED.basic_work,
      root_cause = EXCLUDED.root_cause,
      agent = EXCLUDED.agent,
      mechanism = EXCLUDED.mechanism,
      corrective_action = EXCLUDED.corrective_action,
      preventive_action = EXCLUDED.preventive_action,
      updated_at = now()
    RETURNING
      id, accident_id, immediate_act, immediate_condition, basic_personal,
      basic_work, root_cause, agent, mechanism, corrective_action, preventive_action,
      created_at::text, updated_at::text
  `;
  return mapCauses(rows[0]);
}

function investigationComplianceDraft(item: {
  folio: string;
  accidentDate: string;
  legalDueDate: string;
  status: string;
  workerId: string;
  workerName: string;
  workerDocument: string;
  jobTitle: string;
  farmId: string | null;
  eventNumber: string;
}): SstRecordDraft {
  return {
    recordType: "investigacion",
    title: `Investigación ${item.folio} — ${item.eventNumber}`,
    code: item.folio,
    workerId: item.workerId,
    subjectName: item.workerName,
    subjectDocument: item.workerDocument,
    subjectJobTitle: item.jobTitle,
    farmId: item.farmId,
    dueDate: item.legalDueDate,
    issuedAt: item.accidentDate,
    workflowStatus: toInvestigationWorkflowStatus(item.legalDueDate, item.status),
    responsibleName: undefined,
    notes: `Investigación automática Res. 1401/2007 — evento ${item.eventNumber}`,
  };
}

async function syncInvestigationCompliance(
  investigation: {
    id: string;
    folio: string;
    accidentDate: string;
    legalDueDate: string;
    status: string;
    complianceRecordId: string | null;
    workerId: string;
    workerName: string;
    workerDocument: string;
    jobTitle: string;
    farmId: string | null;
    eventNumber: string;
  },
  userId: string,
): Promise<void> {
  const draft = investigationComplianceDraft(investigation);
  const sql = getSql();
  if (investigation.complianceRecordId) {
    await updateComplianceRecord(investigation.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("investigacion", investigation.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_investigations
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${investigation.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_investigations
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${investigation.id}
  `;
}

async function autoCreateInvestigationForAccident(
  accident: SstAccidentEvent,
  userId: string,
): Promise<void> {
  if (accident.eventType !== "accidente_trabajo") return;
  const sql = getSql();
  const existing = await sql<{ id: string }[]>`
    SELECT id FROM campus_sst.sst_investigations
    WHERE accident_id = ${accident.id}
    LIMIT 1
  `;
  if (existing[0]) return;

  const folio = await nextInvestigationFolio(sql);
  const legalDueDate = addDaysIso(accident.eventDate, 15);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_investigations (
      folio, accident_id, accident_date, legal_due_date, status,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${accident.id},
      ${accident.eventDate},
      ${legalDueDate},
      ${"pendiente_inicio"},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;

  await syncInvestigationCompliance(
    {
      id: rows[0].id,
      folio,
      accidentDate: accident.eventDate,
      legalDueDate,
      status: "pendiente_inicio",
      complianceRecordId: null,
      workerId: accident.workerId,
      workerName: accident.workerName,
      workerDocument: accident.workerDocument,
      jobTitle: accident.jobTitleSnapshot,
      farmId: accident.farmId,
      eventNumber: accident.eventNumber,
    },
    userId,
  );
}

export async function listAccidentEvents(filters?: {
  eventType?: AccidentEventType | "all";
  status?: AccidentStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstAccidentEvent[]> {
  const sql = getSql();
  const eventType =
    filters?.eventType && filters.eventType !== "all" ? filters.eventType : null;
  const status = filters?.status && filters.status !== "all" ? filters.status : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<AccidentRow[]>`
    SELECT ${sql.unsafe(ACCIDENT_SELECT)}
    FROM campus_sst.sst_accident_events e
    INNER JOIN campus_sst.sst_workers w ON w.id = e.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
    WHERE (${eventType}::text IS NULL OR e.event_type = ${eventType})
      AND (${status}::text IS NULL OR e.status = ${status})
      AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(e.event_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(e.description) LIKE ${q ? `%${q}%` : ""}
        OR lower(e.mechanism) LIKE ${q ? `%${q}%` : ""}
        OR lower(e.body_part) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY e.event_date DESC, e.created_at DESC
  `;

  const causesMap = await listCausesByAccidentIds(rows.map((row) => row.id));
  return rows.map((row) => mapAccident(row, causesMap.get(row.id) ?? null));
}

export async function getAccidentEvent(id: string): Promise<SstAccidentEvent | null> {
  return selectAccidentById(id);
}

export async function findAccidentByEventNumber(
  eventNumber: string,
): Promise<SstAccidentEvent | null> {
  const sql = getSql();
  const rows = await sql<AccidentRow[]>`
    SELECT ${sql.unsafe(ACCIDENT_SELECT)}
    FROM campus_sst.sst_accident_events e
    INNER JOIN campus_sst.sst_workers w ON w.id = e.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
    WHERE lower(e.event_number) = lower(${eventNumber.trim()})
    LIMIT 1
  `;
  if (!rows[0]) return null;
  const causesMap = await listCausesByAccidentIds([rows[0].id]);
  return mapAccident(rows[0], causesMap.get(rows[0].id) ?? null);
}

export async function getAccidentStats(): Promise<AccidentStats> {
  return computeAccidentStats(await listAccidentEvents());
}

export async function getCausesRanking(): Promise<CausesRanking> {
  return computeCausesRanking(await listAccidentEvents());
}

export async function createAccidentEvent(
  draft: SstAccidentEventDraft,
  userId: string,
): Promise<SstAccidentEvent> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const eventNumber = await nextEventNumber(sql, draft.eventType);
  const company = draft.companySnapshot?.trim() || worker.company;
  const jobTitle = draft.jobTitleSnapshot?.trim() || worker.jobTitle;
  const area = draft.areaSnapshot?.trim() || worker.area;
  const workCenter = draft.workCenterSnapshot?.trim() || worker.workCenter;
  const farmId = emptyToNull(draft.farmId) ?? worker.farmId;

  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_accident_events (
      event_number, event_date, event_time, worker_id,
      company_snapshot, job_title_snapshot, area_snapshot, work_center_snapshot,
      farm_id, event_type, description, accident_kind, mechanism, agent,
      body_part, injury_type, lost_days, origin, status,
      investigation_notes, corrective_action_notes, evidence_url, evidence_name,
      created_by, updated_by
    ) VALUES (
      ${eventNumber},
      ${draft.eventDate},
      ${emptyToNull(draft.eventTime)},
      ${draft.workerId},
      ${company},
      ${jobTitle},
      ${area},
      ${workCenter},
      ${farmId},
      ${draft.eventType},
      ${draft.description.trim()},
      ${draft.accidentKind.trim()},
      ${draft.mechanism.trim()},
      ${draft.agent.trim()},
      ${draft.bodyPart.trim()},
      ${draft.injuryType.trim()},
      ${Math.max(0, Math.trunc(draft.lostDays))},
      ${draft.origin.trim()},
      ${draft.status},
      ${draft.investigationNotes.trim()},
      ${draft.correctiveActionNotes.trim()},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;

  if (draft.causes) {
    await upsertAccidentCauses(rows[0].id, draft.causes);
  }

  const created = await selectAccidentById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el evento.");

  if (created.eventType === "accidente_trabajo") {
    await autoCreateInvestigationForAccident(created, userId);
  }

  return (await selectAccidentById(created.id)) ?? created;
}

export async function updateAccidentEvent(
  id: string,
  draft: SstAccidentEventDraft,
  userId: string,
): Promise<SstAccidentEvent> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const company = draft.companySnapshot?.trim() || worker.company;
  const jobTitle = draft.jobTitleSnapshot?.trim() || worker.jobTitle;
  const area = draft.areaSnapshot?.trim() || worker.area;
  const workCenter = draft.workCenterSnapshot?.trim() || worker.workCenter;
  const farmId = emptyToNull(draft.farmId) ?? worker.farmId;

  await sql`
    UPDATE campus_sst.sst_accident_events
    SET
      event_date = ${draft.eventDate},
      event_time = ${emptyToNull(draft.eventTime)},
      worker_id = ${draft.workerId},
      company_snapshot = ${company},
      job_title_snapshot = ${jobTitle},
      area_snapshot = ${area},
      work_center_snapshot = ${workCenter},
      farm_id = ${farmId},
      event_type = ${draft.eventType},
      description = ${draft.description.trim()},
      accident_kind = ${draft.accidentKind.trim()},
      mechanism = ${draft.mechanism.trim()},
      agent = ${draft.agent.trim()},
      body_part = ${draft.bodyPart.trim()},
      injury_type = ${draft.injuryType.trim()},
      lost_days = ${Math.max(0, Math.trunc(draft.lostDays))},
      origin = ${draft.origin.trim()},
      status = ${draft.status},
      investigation_notes = ${draft.investigationNotes.trim()},
      corrective_action_notes = ${draft.correctiveActionNotes.trim()},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;

  if (draft.causes !== undefined) {
    await upsertAccidentCauses(id, draft.causes);
  }

  const updated = await selectAccidentById(id);
  if (!updated) throw new Error("Evento no encontrado.");

  if (updated.eventType === "accidente_trabajo") {
    await autoCreateInvestigationForAccident(updated, userId);
  }

  return (await selectAccidentById(id)) ?? updated;
}

export async function deleteAccidentEvent(id: string): Promise<void> {
  const current = await selectAccidentById(id);
  if (!current) throw new Error("Evento no encontrado.");
  const sql = getSql();

  const investigations = await sql<
    { id: string; compliance_record_id: string | null }[]
  >`
    SELECT id, compliance_record_id
    FROM campus_sst.sst_investigations
    WHERE accident_id = ${id}
  `;

  for (const inv of investigations) {
    await sql`DELETE FROM campus_sst.sst_investigations WHERE id = ${inv.id}`;
    if (inv.compliance_record_id) {
      try {
        await deleteComplianceRecord(inv.compliance_record_id);
      } catch {
        // ignore missing compliance
      }
    }
  }

  await sql`DELETE FROM campus_sst.sst_accident_events WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
