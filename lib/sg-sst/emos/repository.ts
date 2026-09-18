import "server-only";

import { getSql } from "@/lib/db";
import { nextSequentialCode, withSequentialCodeRetry } from "@/lib/sg-sst/next-sequential-code";
import {
  createComplianceRecord,
  deleteComplianceRecord,
  findComplianceRecordByCode,
  updateComplianceRecord,
} from "@/lib/sg-sst/alerts/repository";
import type { SstRecordDraft, SstSemaphoreLevel } from "@/lib/sg-sst/alerts/types";
import {
  enrichEmoAsView,
  isEmoConcept,
  isEmoExamType,
  isEmoPeriodicity,
  resolveNextDueDate,
  type EmoConcept,
  type EmoExamType,
  type EmoStats,
  type SstEmo,
  type SstEmoDraft,
  type SstEmoView,
} from "@/lib/sg-sst/emos/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type EmoRow = {
  id: string;
  folio: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  worker_status: string;
  exam_type: string;
  exam_date: string;
  next_due_date: string | null;
  periodicity_months: number | null;
  ips: string;
  concept: string;
  admin_observations: string;
  evidence_url: string;
  evidence_name: string;
  company_snapshot: string;
  job_title_snapshot: string;
  farm_id: string | null;
  farm_name: string | null;
  heights_cleared: boolean | null;
  pesv_cleared: boolean | null;
  chemicals_cleared: boolean | null;
  notify_supervisor: boolean;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

function mapEmo(row: EmoRow): SstEmo {
  if (!isEmoExamType(row.exam_type)) {
    throw new Error(`Tipo EMO inválido: ${row.exam_type}`);
  }
  if (!isEmoConcept(row.concept)) {
    throw new Error(`Concepto EMO inválido: ${row.concept}`);
  }
  const periodicity =
    row.periodicity_months != null && isEmoPeriodicity(row.periodicity_months)
      ? row.periodicity_months
      : null;
  return {
    id: row.id,
    folio: row.folio,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    workerStatus: row.worker_status,
    examType: row.exam_type,
    examDate: row.exam_date,
    nextDueDate: row.next_due_date,
    periodicityMonths: periodicity,
    ips: row.ips,
    concept: row.concept,
    adminObservations: row.admin_observations,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    companySnapshot: row.company_snapshot,
    jobTitleSnapshot: row.job_title_snapshot,
    farmId: row.farm_id,
    farmName: row.farm_name,
    heightsCleared: row.heights_cleared,
    pesvCleared: row.pesv_cleared,
    chemicalsCleared: row.chemicals_cleared,
    notifySupervisor: row.notify_supervisor,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function selectEmoById(id: string): Promise<SstEmo | null> {
  const sql = getSql();
  const rows = await sql<EmoRow[]>`
    SELECT
      e.id, e.folio, e.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      e.exam_type, e.exam_date::text, e.next_due_date::text, e.periodicity_months,
      e.ips, e.concept, e.admin_observations, e.evidence_url, e.evidence_name,
      e.company_snapshot, e.job_title_snapshot, e.farm_id, f.name AS farm_name,
      e.heights_cleared, e.pesv_cleared, e.chemicals_cleared, e.notify_supervisor,
      e.compliance_record_id, e.created_at::text, e.updated_at::text
    FROM campus_sst.sst_emos e
    INNER JOIN campus_sst.sst_workers w ON w.id = e.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
    WHERE e.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapEmo(rows[0]) : null;
}

async function nextEmoFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_emos", "folio", `EMO-${year}-`);
}

function complianceDraftFromEmo(emo: SstEmo): SstRecordDraft {
  return {
    recordType: "examen_medico",
    title: `EMO ${emo.examType} — ${emo.workerName}`,
    code: emo.folio,
    workerId: emo.workerId,
    subjectName: emo.workerName,
    subjectDocument: emo.workerDocument,
    subjectJobTitle: emo.jobTitleSnapshot,
    farmId: emo.farmId,
    dueDate: emo.nextDueDate,
    issuedAt: emo.examDate,
    workflowStatus:
      emo.examType === "egreso" || emo.concept === "no_apto" ? "closed" : "open",
    externalEntity: emo.ips,
    notes: emo.adminObservations.slice(0, 500),
  };
}

async function syncComplianceRecord(emo: SstEmo, userId: string): Promise<void> {
  const draft = complianceDraftFromEmo(emo);
  const sql = getSql();
  if (emo.complianceRecordId) {
    await updateComplianceRecord(emo.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("examen_medico", emo.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_emos
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${emo.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_emos
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${emo.id}
  `;
}

export async function listEmos(filters?: {
  examType?: EmoExamType | "all";
  concept?: EmoConcept | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstEmo[]> {
  const sql = getSql();
  const examType = filters?.examType && filters.examType !== "all" ? filters.examType : null;
  const concept = filters?.concept && filters.concept !== "all" ? filters.concept : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<EmoRow[]>`
    SELECT
      e.id, e.folio, e.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      e.exam_type, e.exam_date::text, e.next_due_date::text, e.periodicity_months,
      e.ips, e.concept, e.admin_observations, e.evidence_url, e.evidence_name,
      e.company_snapshot, e.job_title_snapshot, e.farm_id, f.name AS farm_name,
      e.heights_cleared, e.pesv_cleared, e.chemicals_cleared, e.notify_supervisor,
      e.compliance_record_id, e.created_at::text, e.updated_at::text
    FROM campus_sst.sst_emos e
    INNER JOIN campus_sst.sst_workers w ON w.id = e.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
    WHERE (${examType}::text IS NULL OR e.exam_type = ${examType})
      AND (${concept}::text IS NULL OR e.concept = ${concept})
      AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(e.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(e.ips) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE WHEN e.next_due_date IS NULL THEN 1 ELSE 0 END,
      e.next_due_date ASC NULLS LAST,
      e.exam_date DESC
  `;
  return rows.map(mapEmo);
}

export async function listEmoViews(
  filters?: Parameters<typeof listEmos>[0],
): Promise<SstEmoView[]> {
  return (await listEmos(filters)).map((emo) => enrichEmoAsView(emo));
}

export async function getEmo(id: string): Promise<SstEmo | null> {
  return selectEmoById(id);
}

export async function listEmosByWorker(workerId: string): Promise<SstEmo[]> {
  const sql = getSql();
  const rows = await sql<EmoRow[]>`
    SELECT
      e.id, e.folio, e.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      e.exam_type, e.exam_date::text, e.next_due_date::text, e.periodicity_months,
      e.ips, e.concept, e.admin_observations, e.evidence_url, e.evidence_name,
      e.company_snapshot, e.job_title_snapshot, e.farm_id, f.name AS farm_name,
      e.heights_cleared, e.pesv_cleared, e.chemicals_cleared, e.notify_supervisor,
      e.compliance_record_id, e.created_at::text, e.updated_at::text
    FROM campus_sst.sst_emos e
    INNER JOIN campus_sst.sst_workers w ON w.id = e.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
    WHERE e.worker_id = ${workerId}
    ORDER BY e.exam_date DESC
  `;
  return rows.map(mapEmo);
}

export async function findEmoByFolio(folio: string): Promise<SstEmo | null> {
  const sql = getSql();
  const rows = await sql<EmoRow[]>`
    SELECT
      e.id, e.folio, e.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      e.exam_type, e.exam_date::text, e.next_due_date::text, e.periodicity_months,
      e.ips, e.concept, e.admin_observations, e.evidence_url, e.evidence_name,
      e.company_snapshot, e.job_title_snapshot, e.farm_id, f.name AS farm_name,
      e.heights_cleared, e.pesv_cleared, e.chemicals_cleared, e.notify_supervisor,
      e.compliance_record_id, e.created_at::text, e.updated_at::text
    FROM campus_sst.sst_emos e
    INNER JOIN campus_sst.sst_workers w ON w.id = e.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
    WHERE lower(e.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapEmo(rows[0]) : null;
}

export async function getEmoStats(): Promise<EmoStats> {
  const views = await listEmoViews();
  const bySemaphore: Record<SstSemaphoreLevel, number> = {
    critico: 0,
    proximo: 0,
    seguimiento: 0,
    vigente: 0,
  };
  const byConcept: Record<EmoConcept, number> = {
    apto: 0,
    apto_recomendaciones: 0,
    apto_restricciones: 0,
    no_apto: 0,
  };
  const workers = new Set<string>();
  for (const view of views) {
    bySemaphore[view.semaphore] += 1;
    byConcept[view.concept] += 1;
    workers.add(view.workerId);
  }
  return {
    total: views.length,
    workersCovered: workers.size,
    bySemaphore,
    byConcept,
  };
}

export async function createEmo(draft: SstEmoDraft, userId: string): Promise<SstEmo> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const nextDue = resolveNextDueDate(draft);
  const rows = await withSequentialCodeRetry(async () => {
    const folio = await nextEmoFolio(sql);
    return sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_emos (
      folio, worker_id, exam_type, exam_date, next_due_date, periodicity_months,
      ips, concept, admin_observations, evidence_url, evidence_name,
      company_snapshot, job_title_snapshot, farm_id,
      heights_cleared, pesv_cleared, chemicals_cleared, notify_supervisor,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.workerId},
      ${draft.examType},
      ${draft.examDate},
      ${nextDue},
      ${draft.periodicityMonths ?? null},
      ${draft.ips.trim()},
      ${draft.concept},
      ${draft.adminObservations.trim()},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${worker.company},
      ${worker.jobTitle},
      ${worker.farmId},
      ${draft.heightsCleared ?? null},
      ${draft.pesvCleared ?? null},
      ${draft.chemicalsCleared ?? null},
      ${draft.notifySupervisor ?? false},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  });
  const created = await selectEmoById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el EMO.");
  await syncComplianceRecord(created, userId);
  return (await selectEmoById(created.id)) ?? created;
}

export async function updateEmo(
  id: string,
  draft: SstEmoDraft,
  userId: string,
): Promise<SstEmo> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const nextDue = resolveNextDueDate(draft);
  await sql`
    UPDATE campus_sst.sst_emos
    SET
      worker_id = ${draft.workerId},
      exam_type = ${draft.examType},
      exam_date = ${draft.examDate},
      next_due_date = ${nextDue},
      periodicity_months = ${draft.periodicityMonths ?? null},
      ips = ${draft.ips.trim()},
      concept = ${draft.concept},
      admin_observations = ${draft.adminObservations.trim()},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      company_snapshot = ${worker.company},
      job_title_snapshot = ${worker.jobTitle},
      farm_id = ${worker.farmId},
      heights_cleared = ${draft.heightsCleared ?? null},
      pesv_cleared = ${draft.pesvCleared ?? null},
      chemicals_cleared = ${draft.chemicalsCleared ?? null},
      notify_supervisor = ${draft.notifySupervisor ?? false},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectEmoById(id);
  if (!updated) throw new Error("EMO no encontrado.");
  await syncComplianceRecord(updated, userId);
  return (await selectEmoById(id)) ?? updated;
}

export async function deleteEmo(id: string): Promise<void> {
  const current = await selectEmoById(id);
  if (!current) throw new Error("EMO no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_emos WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
