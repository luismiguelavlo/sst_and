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
  enrichInvestigationAsView,
  isClosedLikeStatus,
  isInvestigationMethodology,
  isInvestigationStatus,
  resolveLegalDueDate,
  toComplianceWorkflowStatus,
  type AccidentOption,
  type InvestigationMethodology,
  type InvestigationStats,
  type InvestigationStatus,
  type SstInvestigation,
  type SstInvestigationDraft,
  type SstInvestigationView,
} from "@/lib/sg-sst/investigaciones/types";

type InvestigationRow = {
  id: string;
  folio: string;
  accident_id: string;
  accident_event_number: string;
  accident_date: string;
  legal_due_date: string;
  responsible_name: string;
  status: string;
  investigation_date: string | null;
  investigation_team: string;
  methodology: string;
  causes_summary: string;
  action_plan: string;
  evidence_url: string;
  evidence_name: string;
  closed_at: string | null;
  observations: string;
  worker_id: string | null;
  worker_code: string | null;
  worker_name: string | null;
  worker_document: string | null;
  farm_id: string | null;
  farm_name: string | null;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

type AccidentOptionRow = {
  id: string;
  event_number: string;
  worker_name: string;
  event_date: string;
};

type AccidentLookupRow = {
  id: string;
  event_number: string;
  event_date: string;
  worker_id: string;
  worker_name: string;
};

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapInvestigation(row: InvestigationRow): SstInvestigation {
  if (!isInvestigationStatus(row.status)) {
    throw new Error(`Estado de investigación inválido: ${row.status}`);
  }
  if (!isInvestigationMethodology(row.methodology)) {
    throw new Error(`Metodología inválida: ${row.methodology}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    accidentId: row.accident_id,
    accidentEventNumber: row.accident_event_number,
    accidentDate: row.accident_date,
    legalDueDate: row.legal_due_date,
    responsibleName: row.responsible_name,
    status: row.status,
    investigationDate: row.investigation_date,
    investigationTeam: row.investigation_team,
    methodology: row.methodology,
    causesSummary: row.causes_summary,
    actionPlan: row.action_plan,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    closedAt: row.closed_at,
    observations: row.observations,
    workerId: row.worker_id,
    workerCode: row.worker_code ?? "",
    workerName: row.worker_name ?? "",
    workerDocument: row.worker_document ?? "",
    farmId: row.farm_id,
    farmName: row.farm_name,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const INVESTIGATION_SELECT = `
  i.id, i.folio, i.accident_id,
  a.event_number AS accident_event_number,
  i.accident_date::text, i.legal_due_date::text,
  i.responsible_name, i.status, i.investigation_date::text,
  i.investigation_team, i.methodology, i.causes_summary, i.action_plan,
  i.evidence_url, i.evidence_name, i.closed_at::text, i.observations,
  a.worker_id, w.worker_code, w.full_name AS worker_name,
  w.document_number AS worker_document,
  a.farm_id, f.name AS farm_name,
  i.compliance_record_id, i.created_at::text, i.updated_at::text
`;

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

async function selectInvestigationById(
  id: string,
): Promise<SstInvestigation | null> {
  const sql = getSql();
  const rows = await sql<InvestigationRow[]>`
    SELECT ${sql.unsafe(INVESTIGATION_SELECT)}
    FROM campus_sst.sst_investigations i
    INNER JOIN campus_sst.sst_accident_events a ON a.id = i.accident_id
    LEFT JOIN campus_sst.sst_workers w ON w.id = a.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = a.farm_id
    WHERE i.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapInvestigation(rows[0]) : null;
}

async function getAccidentById(accidentId: string): Promise<AccidentLookupRow | null> {
  const sql = getSql();
  const rows = await sql<AccidentLookupRow[]>`
    SELECT
      a.id, a.event_number, a.event_date::text,
      a.worker_id, COALESCE(w.full_name, '') AS worker_name
    FROM campus_sst.sst_accident_events a
    LEFT JOIN campus_sst.sst_workers w ON w.id = a.worker_id
    WHERE a.id = ${accidentId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function findAccidentByEventNumber(
  eventNumber: string,
): Promise<AccidentLookupRow | null> {
  const sql = getSql();
  const rows = await sql<AccidentLookupRow[]>`
    SELECT
      a.id, a.event_number, a.event_date::text,
      a.worker_id, COALESCE(w.full_name, '') AS worker_name
    FROM campus_sst.sst_accident_events a
    LEFT JOIN campus_sst.sst_workers w ON w.id = a.worker_id
    WHERE lower(a.event_number) = lower(${eventNumber.trim()})
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function listAccidentOptions(): Promise<AccidentOption[]> {
  const sql = getSql();
  const rows = await sql<AccidentOptionRow[]>`
    SELECT
      a.id,
      a.event_number,
      COALESCE(w.full_name, a.job_title_snapshot, 'Sin trabajador') AS worker_name,
      a.event_date::text
    FROM campus_sst.sst_accident_events a
    LEFT JOIN campus_sst.sst_workers w ON w.id = a.worker_id
    ORDER BY a.event_date DESC, a.event_number DESC
  `;
  return rows.map((row) => ({
    id: row.id,
    eventNumber: row.event_number,
    workerName: row.worker_name,
    eventDate: row.event_date,
  }));
}

function complianceDraftFromInvestigation(
  item: SstInvestigation,
): SstRecordDraft {
  return {
    recordType: "investigacion",
    title: `Investigación ${item.folio} — ${item.accidentEventNumber}`,
    code: item.folio,
    workerId: item.workerId,
    subjectName: item.workerName || item.responsibleName,
    subjectDocument: item.workerDocument || undefined,
    subjectJobTitle: undefined,
    farmId: item.farmId,
    dueDate: item.legalDueDate,
    issuedAt: item.investigationDate ?? item.accidentDate,
    workflowStatus: toComplianceWorkflowStatus(item.status),
    responsibleName: item.responsibleName,
    notes: (item.causesSummary || item.actionPlan || item.observations).slice(
      0,
      500,
    ),
  };
}

async function syncComplianceRecord(
  item: SstInvestigation,
  userId: string,
): Promise<void> {
  const draft = complianceDraftFromInvestigation(item);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("investigacion", item.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_investigations
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_investigations
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

export async function listInvestigations(filters?: {
  status?: InvestigationStatus | "all";
  methodology?: InvestigationMethodology | "all";
  query?: string;
}): Promise<SstInvestigation[]> {
  const sql = getSql();
  const status =
    filters?.status && filters.status !== "all" ? filters.status : null;
  const methodology =
    filters?.methodology && filters.methodology !== "all"
      ? filters.methodology
      : null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<InvestigationRow[]>`
    SELECT ${sql.unsafe(INVESTIGATION_SELECT)}
    FROM campus_sst.sst_investigations i
    INNER JOIN campus_sst.sst_accident_events a ON a.id = i.accident_id
    LEFT JOIN campus_sst.sst_workers w ON w.id = a.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = a.farm_id
    WHERE (${status}::text IS NULL OR i.status = ${status})
      AND (${methodology}::text IS NULL OR i.methodology = ${methodology})
      AND (
        ${q}::text IS NULL
        OR lower(i.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(a.event_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(i.responsible_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(COALESCE(w.full_name, '')) LIKE ${q ? `%${q}%` : ""}
        OR lower(i.investigation_team) LIKE ${q ? `%${q}%` : ""}
        OR lower(i.causes_summary) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE
        WHEN i.status IN ('cerrada', 'radicada_arl') THEN 1
        ELSE 0
      END,
      i.legal_due_date ASC,
      i.created_at DESC
  `;
  return rows.map(mapInvestigation);
}

export async function listInvestigationViews(
  filters?: Parameters<typeof listInvestigations>[0],
): Promise<SstInvestigationView[]> {
  return (await listInvestigations(filters)).map((item) =>
    enrichInvestigationAsView(item),
  );
}

export async function getInvestigation(
  id: string,
): Promise<SstInvestigation | null> {
  return selectInvestigationById(id);
}

export async function findInvestigationByFolio(
  folio: string,
): Promise<SstInvestigation | null> {
  const sql = getSql();
  const rows = await sql<InvestigationRow[]>`
    SELECT ${sql.unsafe(INVESTIGATION_SELECT)}
    FROM campus_sst.sst_investigations i
    INNER JOIN campus_sst.sst_accident_events a ON a.id = i.accident_id
    LEFT JOIN campus_sst.sst_workers w ON w.id = a.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = a.farm_id
    WHERE lower(i.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapInvestigation(rows[0]) : null;
}

export async function getInvestigationStats(): Promise<InvestigationStats> {
  const views = await listInvestigationViews();
  const byStatus = Object.fromEntries(
    (
      [
        "pendiente_inicio",
        "en_campo",
        "revision_copasst",
        "radicada_arl",
        "cerrada",
      ] as const
    ).map((status) => [status, 0]),
  ) as Record<InvestigationStatus, number>;
  const bySemaphore: Record<SstSemaphoreLevel, number> = {
    critico: 0,
    proximo: 0,
    seguimiento: 0,
    vigente: 0,
  };

  let overdue = 0;
  let upcoming = 0;
  let inProgress = 0;
  let closed = 0;

  for (const view of views) {
    byStatus[view.status] += 1;
    bySemaphore[view.semaphore] += 1;
    if (view.isClosedLike) {
      closed += 1;
      continue;
    }
    if (view.isOverdue) {
      overdue += 1;
    } else if (view.isUpcoming) {
      upcoming += 1;
    } else {
      inProgress += 1;
    }
  }

  return {
    total: views.length,
    overdue,
    upcoming,
    inProgress,
    closed,
    byStatus,
    bySemaphore,
  };
}

export async function createInvestigation(
  draft: SstInvestigationDraft,
  userId: string,
): Promise<SstInvestigation> {
  const accident = await getAccidentById(draft.accidentId);
  if (!accident) {
    throw new Error("Accidente relacionado no encontrado.");
  }
  const accidentDate = draft.accidentDate?.trim() || accident.event_date;
  const legalDueDate = resolveLegalDueDate(accidentDate, draft.legalDueDate);
  const closedAt = isClosedLikeStatus(draft.status)
    ? emptyToNull(draft.closedAt) ?? new Date().toISOString().slice(0, 10)
    : emptyToNull(draft.closedAt);

  const sql = getSql();
  const folio = await nextInvestigationFolio(sql);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_investigations (
      folio, accident_id, accident_date, legal_due_date, responsible_name,
      status, investigation_date, investigation_team, methodology,
      causes_summary, action_plan, evidence_url, evidence_name,
      closed_at, observations, created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.accidentId},
      ${accidentDate},
      ${legalDueDate},
      ${draft.responsibleName.trim()},
      ${draft.status},
      ${emptyToNull(draft.investigationDate)},
      ${draft.investigationTeam.trim()},
      ${draft.methodology},
      ${draft.causesSummary.trim()},
      ${draft.actionPlan.trim()},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${closedAt},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectInvestigationById(rows[0].id);
  if (!created) throw new Error("No se pudo crear la investigación.");
  await syncComplianceRecord(created, userId);
  return (await selectInvestigationById(created.id)) ?? created;
}

export async function updateInvestigation(
  id: string,
  draft: SstInvestigationDraft,
  userId: string,
): Promise<SstInvestigation> {
  const accident = await getAccidentById(draft.accidentId);
  if (!accident) {
    throw new Error("Accidente relacionado no encontrado.");
  }
  const accidentDate = draft.accidentDate?.trim() || accident.event_date;
  const legalDueDate = resolveLegalDueDate(accidentDate, draft.legalDueDate);
  const closedAt = isClosedLikeStatus(draft.status)
    ? emptyToNull(draft.closedAt) ?? new Date().toISOString().slice(0, 10)
    : emptyToNull(draft.closedAt);

  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_investigations
    SET
      accident_id = ${draft.accidentId},
      accident_date = ${accidentDate},
      legal_due_date = ${legalDueDate},
      responsible_name = ${draft.responsibleName.trim()},
      status = ${draft.status},
      investigation_date = ${emptyToNull(draft.investigationDate)},
      investigation_team = ${draft.investigationTeam.trim()},
      methodology = ${draft.methodology},
      causes_summary = ${draft.causesSummary.trim()},
      action_plan = ${draft.actionPlan.trim()},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      closed_at = ${closedAt},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectInvestigationById(id);
  if (!updated) throw new Error("Investigación no encontrada.");
  await syncComplianceRecord(updated, userId);
  return (await selectInvestigationById(id)) ?? updated;
}

export async function deleteInvestigation(id: string): Promise<void> {
  const current = await selectInvestigationById(id);
  if (!current) throw new Error("Investigación no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_investigations WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
