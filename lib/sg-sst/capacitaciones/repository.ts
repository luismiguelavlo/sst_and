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
  deriveTrainingStatus,
  enrichTrainingAsView,
  isTrainingModality,
  isTrainingStatus,
  isTrainingTopic,
  resolveComplianceDueDate,
  type SstTraining,
  type SstTrainingDraft,
  type SstTrainingView,
  type TrainingModality,
  type TrainingStats,
  type TrainingStatus,
  type TrainingTopic,
} from "@/lib/sg-sst/capacitaciones/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type TrainingRow = {
  id: string;
  folio: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  worker_status: string;
  topic: string;
  training_date: string;
  hours: string | number;
  instructor: string;
  modality: string;
  evidence_url: string;
  evidence_name: string;
  certificate_url: string;
  certificate_name: string;
  next_training_date: string | null;
  status: string;
  company_snapshot: string;
  job_title_snapshot: string;
  farm_id: string | null;
  farm_name: string | null;
  observations: string;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapTraining(row: TrainingRow): SstTraining {
  if (!isTrainingTopic(row.topic)) {
    throw new Error(`Tema de capacitación inválido: ${row.topic}`);
  }
  if (!isTrainingModality(row.modality)) {
    throw new Error(`Modalidad inválida: ${row.modality}`);
  }
  if (!isTrainingStatus(row.status)) {
    throw new Error(`Estado inválido: ${row.status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    workerStatus: row.worker_status,
    topic: row.topic,
    trainingDate: row.training_date,
    hours: Number(row.hours),
    instructor: row.instructor,
    modality: row.modality,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    certificateUrl: row.certificate_url,
    certificateName: row.certificate_name,
    nextTrainingDate: row.next_training_date,
    status: row.status,
    companySnapshot: row.company_snapshot,
    jobTitleSnapshot: row.job_title_snapshot,
    farmId: row.farm_id,
    farmName: row.farm_name,
    observations: row.observations,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function selectTrainingById(id: string): Promise<SstTraining | null> {
  const sql = getSql();
  const rows = await sql<TrainingRow[]>`
    SELECT
      t.id, t.folio, t.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      t.topic, t.training_date::text, t.hours, t.instructor, t.modality,
      t.evidence_url, t.evidence_name, t.certificate_url, t.certificate_name,
      t.next_training_date::text, t.status,
      t.company_snapshot, t.job_title_snapshot, t.farm_id, f.name AS farm_name,
      t.observations, t.compliance_record_id, t.created_at::text, t.updated_at::text
    FROM campus_sst.sst_trainings t
    INNER JOIN campus_sst.sst_workers w ON w.id = t.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = t.farm_id
    WHERE t.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapTraining(rows[0]) : null;
}

async function nextTrainingFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_trainings", "folio", `CAP-${year}-`);
}

function resolveStatus(draft: SstTrainingDraft): TrainingStatus {
  return deriveTrainingStatus({
    trainingDate: draft.trainingDate,
    nextTrainingDate: emptyToNull(draft.nextTrainingDate),
    status: draft.status ?? null,
  });
}

function complianceDraftFromTraining(item: SstTraining): SstRecordDraft {
  const dueDate = resolveComplianceDueDate(item.nextTrainingDate, item.trainingDate);
  return {
    recordType: "curso",
    title: `Capacitación ${item.topic} — ${item.workerName}`,
    code: item.folio,
    workerId: item.workerId,
    subjectName: item.workerName,
    subjectDocument: item.workerDocument,
    subjectJobTitle: item.jobTitleSnapshot,
    farmId: item.farmId,
    dueDate,
    issuedAt: item.trainingDate,
    workflowStatus: "open",
    externalEntity: item.instructor,
    notes: [
      `Estado: ${item.status}`,
      `Tema: ${item.topic}`,
      item.observations.trim(),
    ]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 500),
  };
}

async function syncComplianceRecord(item: SstTraining, userId: string): Promise<void> {
  const draft = complianceDraftFromTraining(item);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("curso", item.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_trainings
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_trainings
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

export async function listTrainings(filters?: {
  topic?: TrainingTopic | "all";
  status?: TrainingStatus | "all";
  modality?: TrainingModality | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstTraining[]> {
  const sql = getSql();
  const topic = filters?.topic && filters.topic !== "all" ? filters.topic : null;
  const status = filters?.status && filters.status !== "all" ? filters.status : null;
  const modality =
    filters?.modality && filters.modality !== "all" ? filters.modality : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<TrainingRow[]>`
    SELECT
      t.id, t.folio, t.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      t.topic, t.training_date::text, t.hours, t.instructor, t.modality,
      t.evidence_url, t.evidence_name, t.certificate_url, t.certificate_name,
      t.next_training_date::text, t.status,
      t.company_snapshot, t.job_title_snapshot, t.farm_id, f.name AS farm_name,
      t.observations, t.compliance_record_id, t.created_at::text, t.updated_at::text
    FROM campus_sst.sst_trainings t
    INNER JOIN campus_sst.sst_workers w ON w.id = t.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = t.farm_id
    WHERE (${topic}::text IS NULL OR t.topic = ${topic})
      AND (${status}::text IS NULL OR t.status = ${status})
      AND (${modality}::text IS NULL OR t.modality = ${modality})
      AND (${farmId}::uuid IS NULL OR t.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(t.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(t.instructor) LIKE ${q ? `%${q}%` : ""}
        OR lower(t.topic) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE t.status
        WHEN 'vencida' THEN 0
        WHEN 'proxima' THEN 1
        WHEN 'pendiente' THEN 2
        WHEN 'programada' THEN 3
        ELSE 4
      END,
      CASE WHEN t.next_training_date IS NULL THEN 1 ELSE 0 END,
      t.next_training_date ASC NULLS LAST,
      t.training_date DESC
  `;
  return rows.map(mapTraining);
}

export async function listTrainingViews(
  filters?: Parameters<typeof listTrainings>[0],
): Promise<SstTrainingView[]> {
  return (await listTrainings(filters)).map((item) => enrichTrainingAsView(item));
}

export async function getTraining(id: string): Promise<SstTraining | null> {
  return selectTrainingById(id);
}

export async function findTrainingByFolio(folio: string): Promise<SstTraining | null> {
  const sql = getSql();
  const rows = await sql<TrainingRow[]>`
    SELECT
      t.id, t.folio, t.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      t.topic, t.training_date::text, t.hours, t.instructor, t.modality,
      t.evidence_url, t.evidence_name, t.certificate_url, t.certificate_name,
      t.next_training_date::text, t.status,
      t.company_snapshot, t.job_title_snapshot, t.farm_id, f.name AS farm_name,
      t.observations, t.compliance_record_id, t.created_at::text, t.updated_at::text
    FROM campus_sst.sst_trainings t
    INNER JOIN campus_sst.sst_workers w ON w.id = t.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = t.farm_id
    WHERE lower(t.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapTraining(rows[0]) : null;
}

export async function getTrainingStats(): Promise<TrainingStats> {
  const views = await listTrainingViews();
  let realizadas = 0;
  let pendientes = 0;
  let proximas = 0;
  let vencidas = 0;
  let programadas = 0;
  let hoursTotal = 0;

  for (const view of views) {
    hoursTotal += view.hours;
    switch (view.status) {
      case "realizada":
        realizadas += 1;
        break;
      case "pendiente":
        pendientes += 1;
        break;
      case "proxima":
        proximas += 1;
        break;
      case "vencida":
        vencidas += 1;
        break;
      case "programada":
        programadas += 1;
        break;
    }
  }

  const denom = realizadas + pendientes + vencidas;
  const cumplimiento = denom > 0 ? Math.round((realizadas / denom) * 1000) / 10 : 0;

  return {
    total: views.length,
    realizadas,
    pendientes,
    proximas,
    vencidas,
    programadas,
    cumplimiento,
    hoursTotal,
  };
}

export async function createTraining(
  draft: SstTrainingDraft,
  userId: string,
): Promise<SstTraining> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const folio = await nextTrainingFolio(sql);
  const status = resolveStatus(draft);
  const nextDate = emptyToNull(draft.nextTrainingDate);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_trainings (
      folio, worker_id, topic, training_date, hours, instructor, modality,
      evidence_url, evidence_name, certificate_url, certificate_name,
      next_training_date, status, company_snapshot, job_title_snapshot, farm_id,
      observations, created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.workerId},
      ${draft.topic},
      ${draft.trainingDate},
      ${draft.hours},
      ${draft.instructor.trim()},
      ${draft.modality},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${draft.certificateUrl.trim()},
      ${draft.certificateName.trim()},
      ${nextDate},
      ${status},
      ${worker.company},
      ${worker.jobTitle},
      ${worker.farmId},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectTrainingById(rows[0].id);
  if (!created) throw new Error("No se pudo crear la capacitación.");
  await syncComplianceRecord(created, userId);
  return (await selectTrainingById(created.id)) ?? created;
}

export async function updateTraining(
  id: string,
  draft: SstTrainingDraft,
  userId: string,
): Promise<SstTraining> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const status = resolveStatus(draft);
  const nextDate = emptyToNull(draft.nextTrainingDate);
  await sql`
    UPDATE campus_sst.sst_trainings
    SET
      worker_id = ${draft.workerId},
      topic = ${draft.topic},
      training_date = ${draft.trainingDate},
      hours = ${draft.hours},
      instructor = ${draft.instructor.trim()},
      modality = ${draft.modality},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      certificate_url = ${draft.certificateUrl.trim()},
      certificate_name = ${draft.certificateName.trim()},
      next_training_date = ${nextDate},
      status = ${status},
      company_snapshot = ${worker.company},
      job_title_snapshot = ${worker.jobTitle},
      farm_id = ${worker.farmId},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectTrainingById(id);
  if (!updated) throw new Error("Capacitación no encontrada.");
  await syncComplianceRecord(updated, userId);
  return (await selectTrainingById(id)) ?? updated;
}

export async function deleteTraining(id: string): Promise<void> {
  const current = await selectTrainingById(id);
  if (!current) throw new Error("Capacitación no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_trainings WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
