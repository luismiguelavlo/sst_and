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
  computeAuthorization,
  enrichHeightsAsView,
  isHeightsFitnessConcept,
  isHeightsTrainingLevel,
  leastDueDate,
  type HeightsAuthorizationStatus,
  type HeightsFitnessConcept,
  type HeightsStats,
  type HeightsTrainingLevel,
  type SstHeightsAuthorization,
  type SstHeightsDraft,
  type SstHeightsView,
} from "@/lib/sg-sst/alturas/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type HeightsRow = {
  id: string;
  folio: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  worker_status: string;
  training_level: string;
  training_date: string | null;
  training_due_date: string | null;
  retraining_done: boolean;
  certificate_url: string;
  certificate_name: string;
  medical_exam_date: string | null;
  medical_exam_due_date: string | null;
  fitness_concept: string;
  authorization_status: string;
  observations: string;
  company_snapshot: string;
  job_title_snapshot: string;
  farm_id: string | null;
  farm_name: string | null;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

function mapHeights(row: HeightsRow): SstHeightsAuthorization {
  if (!isHeightsTrainingLevel(row.training_level)) {
    throw new Error(`Nivel de formación inválido: ${row.training_level}`);
  }
  if (!isHeightsFitnessConcept(row.fitness_concept)) {
    throw new Error(`Concepto de aptitud inválido: ${row.fitness_concept}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    workerStatus: row.worker_status,
    trainingLevel: row.training_level,
    trainingDate: row.training_date,
    trainingDueDate: row.training_due_date,
    retrainingDone: row.retraining_done,
    certificateUrl: row.certificate_url,
    certificateName: row.certificate_name,
    medicalExamDate: row.medical_exam_date,
    medicalExamDueDate: row.medical_exam_due_date,
    fitnessConcept: row.fitness_concept,
    authorizationStatus: row.authorization_status as HeightsAuthorizationStatus,
    observations: row.observations,
    companySnapshot: row.company_snapshot,
    jobTitleSnapshot: row.job_title_snapshot,
    farmId: row.farm_id,
    farmName: row.farm_name,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

async function selectHeightsById(id: string): Promise<SstHeightsAuthorization | null> {
  const sql = getSql();
  const rows = await sql<HeightsRow[]>`
    SELECT
      h.id, h.folio, h.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      h.training_level, h.training_date::text, h.training_due_date::text,
      h.retraining_done, h.certificate_url, h.certificate_name,
      h.medical_exam_date::text, h.medical_exam_due_date::text,
      h.fitness_concept, h.authorization_status, h.observations,
      h.company_snapshot, h.job_title_snapshot, h.farm_id, f.name AS farm_name,
      h.compliance_record_id, h.created_at::text, h.updated_at::text
    FROM campus_sst.sst_heights_authorizations h
    INNER JOIN campus_sst.sst_workers w ON w.id = h.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = h.farm_id
    WHERE h.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapHeights(rows[0]) : null;
}

async function nextHeightsFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM campus_sst.sst_heights_authorizations
    WHERE folio LIKE ${`ALT-${year}-%`}
  `;
  const next = (rows[0]?.count ?? 0) + 1;
  return `ALT-${year}-${String(next).padStart(3, "0")}`;
}

function resolveStatus(draft: SstHeightsDraft): HeightsAuthorizationStatus {
  return computeAuthorization({
    trainingDueDate: emptyToNull(draft.trainingDueDate),
    medicalExamDueDate: emptyToNull(draft.medicalExamDueDate),
    fitnessConcept: draft.fitnessConcept,
    certificateUrl: draft.certificateUrl,
    certificateName: draft.certificateName,
  });
}

function complianceDraftFromHeights(item: SstHeightsAuthorization): SstRecordDraft {
  const dueDate = leastDueDate(item.trainingDueDate, item.medicalExamDueDate);
  return {
    recordType: "certificacion",
    title: `Certificación alturas — ${item.workerName}`,
    code: item.folio,
    workerId: item.workerId,
    subjectName: item.workerName,
    subjectDocument: item.workerDocument,
    subjectJobTitle: item.jobTitleSnapshot,
    farmId: item.farmId,
    dueDate,
    issuedAt: item.trainingDate,
    // Prefer open + due_date so Alertas SST surfaces vencimientos even when blocked.
    workflowStatus: "open",
    externalEntity: "",
    notes: [
      `Estado: ${item.authorizationStatus}`,
      item.observations.trim(),
    ]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 500),
  };
}

async function syncComplianceRecord(
  item: SstHeightsAuthorization,
  userId: string,
): Promise<void> {
  const draft = complianceDraftFromHeights(item);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("certificacion", item.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_heights_authorizations
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_heights_authorizations
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

export async function listHeightsAuthorizations(filters?: {
  status?: HeightsAuthorizationStatus | "all";
  trainingLevel?: HeightsTrainingLevel | "all";
  fitness?: HeightsFitnessConcept | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstHeightsAuthorization[]> {
  const sql = getSql();
  const status = filters?.status && filters.status !== "all" ? filters.status : null;
  const trainingLevel =
    filters?.trainingLevel && filters.trainingLevel !== "all"
      ? filters.trainingLevel
      : null;
  const fitness = filters?.fitness && filters.fitness !== "all" ? filters.fitness : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<HeightsRow[]>`
    SELECT
      h.id, h.folio, h.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      h.training_level, h.training_date::text, h.training_due_date::text,
      h.retraining_done, h.certificate_url, h.certificate_name,
      h.medical_exam_date::text, h.medical_exam_due_date::text,
      h.fitness_concept, h.authorization_status, h.observations,
      h.company_snapshot, h.job_title_snapshot, h.farm_id, f.name AS farm_name,
      h.compliance_record_id, h.created_at::text, h.updated_at::text
    FROM campus_sst.sst_heights_authorizations h
    INNER JOIN campus_sst.sst_workers w ON w.id = h.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = h.farm_id
    WHERE (${status}::text IS NULL OR h.authorization_status = ${status})
      AND (${trainingLevel}::text IS NULL OR h.training_level = ${trainingLevel})
      AND (${fitness}::text IS NULL OR h.fitness_concept = ${fitness})
      AND (${farmId}::uuid IS NULL OR h.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(h.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(h.certificate_name) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE h.authorization_status
        WHEN 'no_autorizado' THEN 0
        WHEN 'por_vencer' THEN 1
        ELSE 2
      END,
      CASE WHEN h.training_due_date IS NULL THEN 1 ELSE 0 END,
      LEAST(
        COALESCE(h.training_due_date, '9999-12-31'::date),
        COALESCE(h.medical_exam_due_date, '9999-12-31'::date)
      ) ASC,
      h.folio ASC
  `;
  return rows.map(mapHeights);
}

export async function listHeightsViews(
  filters?: Parameters<typeof listHeightsAuthorizations>[0],
): Promise<SstHeightsView[]> {
  return (await listHeightsAuthorizations(filters)).map((item) =>
    enrichHeightsAsView(item),
  );
}

export async function getHeightsAuthorization(
  id: string,
): Promise<SstHeightsAuthorization | null> {
  return selectHeightsById(id);
}

export async function findHeightsByFolio(
  folio: string,
): Promise<SstHeightsAuthorization | null> {
  const sql = getSql();
  const rows = await sql<HeightsRow[]>`
    SELECT
      h.id, h.folio, h.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      h.training_level, h.training_date::text, h.training_due_date::text,
      h.retraining_done, h.certificate_url, h.certificate_name,
      h.medical_exam_date::text, h.medical_exam_due_date::text,
      h.fitness_concept, h.authorization_status, h.observations,
      h.company_snapshot, h.job_title_snapshot, h.farm_id, f.name AS farm_name,
      h.compliance_record_id, h.created_at::text, h.updated_at::text
    FROM campus_sst.sst_heights_authorizations h
    INNER JOIN campus_sst.sst_workers w ON w.id = h.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = h.farm_id
    WHERE lower(h.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapHeights(rows[0]) : null;
}

export async function getHeightsStats(): Promise<HeightsStats> {
  const views = await listHeightsViews();
  let habilitados = 0;
  let vencidos = 0;
  let proximosAVencer = 0;
  let examenesPendientes = 0;
  let documentacionPendiente = 0;
  let noAutorizados = 0;

  for (const view of views) {
    if (
      view.authorizationStatus === "autorizado" ||
      view.authorizationStatus === "por_vencer"
    ) {
      habilitados += 1;
    }
    if (view.authorizationStatus === "por_vencer") {
      proximosAVencer += 1;
    }
    if (view.authorizationStatus === "no_autorizado") {
      noAutorizados += 1;
    }
    const trainingExpired =
      view.trainingDaysRemaining !== null && view.trainingDaysRemaining <= 0;
    const medicalExpired =
      view.medicalDaysRemaining !== null && view.medicalDaysRemaining <= 0;
    if (trainingExpired || medicalExpired) {
      vencidos += 1;
    }
    if (
      view.fitnessConcept === "pendiente" ||
      !view.medicalExamDate ||
      !view.medicalExamDueDate
    ) {
      examenesPendientes += 1;
    }
    if (!view.certificateUrl.trim() && !view.certificateName.trim()) {
      documentacionPendiente += 1;
    }
  }

  return {
    total: views.length,
    habilitados,
    vencidos,
    proximosAVencer,
    examenesPendientes,
    documentacionPendiente,
    noAutorizados,
  };
}

export async function createHeightsAuthorization(
  draft: SstHeightsDraft,
  userId: string,
): Promise<SstHeightsAuthorization> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const folio = await nextHeightsFolio(sql);
  const status = resolveStatus(draft);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_heights_authorizations (
      folio, worker_id, training_level, training_date, training_due_date,
      retraining_done, certificate_url, certificate_name,
      medical_exam_date, medical_exam_due_date, fitness_concept,
      authorization_status, observations,
      company_snapshot, job_title_snapshot, farm_id,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.workerId},
      ${draft.trainingLevel},
      ${emptyToNull(draft.trainingDate)},
      ${emptyToNull(draft.trainingDueDate)},
      ${draft.retrainingDone ?? false},
      ${draft.certificateUrl.trim()},
      ${draft.certificateName.trim()},
      ${emptyToNull(draft.medicalExamDate)},
      ${emptyToNull(draft.medicalExamDueDate)},
      ${draft.fitnessConcept},
      ${status},
      ${draft.observations.trim()},
      ${worker.company},
      ${worker.jobTitle},
      ${worker.farmId},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectHeightsById(rows[0].id);
  if (!created) throw new Error("No se pudo crear la autorización de alturas.");
  await syncComplianceRecord(created, userId);
  return (await selectHeightsById(created.id)) ?? created;
}

export async function updateHeightsAuthorization(
  id: string,
  draft: SstHeightsDraft,
  userId: string,
): Promise<SstHeightsAuthorization> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const status = resolveStatus(draft);
  await sql`
    UPDATE campus_sst.sst_heights_authorizations
    SET
      worker_id = ${draft.workerId},
      training_level = ${draft.trainingLevel},
      training_date = ${emptyToNull(draft.trainingDate)},
      training_due_date = ${emptyToNull(draft.trainingDueDate)},
      retraining_done = ${draft.retrainingDone ?? false},
      certificate_url = ${draft.certificateUrl.trim()},
      certificate_name = ${draft.certificateName.trim()},
      medical_exam_date = ${emptyToNull(draft.medicalExamDate)},
      medical_exam_due_date = ${emptyToNull(draft.medicalExamDueDate)},
      fitness_concept = ${draft.fitnessConcept},
      authorization_status = ${status},
      observations = ${draft.observations.trim()},
      company_snapshot = ${worker.company},
      job_title_snapshot = ${worker.jobTitle},
      farm_id = ${worker.farmId},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectHeightsById(id);
  if (!updated) throw new Error("Autorización de alturas no encontrada.");
  await syncComplianceRecord(updated, userId);
  return (await selectHeightsById(id)) ?? updated;
}

export async function deleteHeightsAuthorization(id: string): Promise<void> {
  const current = await selectHeightsById(id);
  if (!current) throw new Error("Autorización de alturas no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_heights_authorizations WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
