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
  enrichOperatorAsView,
  isEquipmentType,
  isFitnessConcept,
  isKeyStatus,
  resolveAuthorization,
  type EquipmentType,
  type KeyStatus,
  type OperatorBlockCategory,
  type OperatorStats,
  type SstOperator,
  type SstOperatorDraft,
  type SstOperatorView,
} from "@/lib/sg-sst/operadores/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type OperatorRow = {
  id: string;
  folio: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  worker_status: string;
  farm_id: string | null;
  farm_name: string | null;
  equipment_name: string;
  equipment_type: string;
  training_name: string;
  training_date: string | null;
  training_due_date: string | null;
  license_category: string;
  license_due_date: string | null;
  occupational_exam_date: string | null;
  fitness_concept: string;
  induction_done: boolean;
  induction_date: string | null;
  key_status: string;
  block_reasons: string;
  observations: string;
  company_snapshot: string;
  job_title_snapshot: string;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapOperator(row: OperatorRow): SstOperator {
  if (!isEquipmentType(row.equipment_type)) {
    throw new Error(`Tipo de equipo inválido: ${row.equipment_type}`);
  }
  if (!isFitnessConcept(row.fitness_concept)) {
    throw new Error(`Concepto de aptitud inválido: ${row.fitness_concept}`);
  }
  if (!isKeyStatus(row.key_status)) {
    throw new Error(`Estado de llave inválido: ${row.key_status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    workerStatus: row.worker_status,
    farmId: row.farm_id,
    farmName: row.farm_name,
    equipmentName: row.equipment_name,
    equipmentType: row.equipment_type,
    trainingName: row.training_name,
    trainingDate: row.training_date,
    trainingDueDate: row.training_due_date,
    licenseCategory: row.license_category,
    licenseDueDate: row.license_due_date,
    occupationalExamDate: row.occupational_exam_date,
    fitnessConcept: row.fitness_concept,
    inductionDone: row.induction_done,
    inductionDate: row.induction_date,
    keyStatus: row.key_status,
    blockReasons: row.block_reasons,
    observations: row.observations,
    companySnapshot: row.company_snapshot,
    jobTitleSnapshot: row.job_title_snapshot,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function selectOperatorById(id: string): Promise<SstOperator | null> {
  const sql = getSql();
  const rows = await sql<OperatorRow[]>`
    SELECT
      o.id, o.folio, o.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      o.farm_id, f.name AS farm_name,
      o.equipment_name, o.equipment_type, o.training_name,
      o.training_date::text, o.training_due_date::text,
      o.license_category, o.license_due_date::text,
      o.occupational_exam_date::text, o.fitness_concept,
      o.induction_done, o.induction_date::text,
      o.key_status, o.block_reasons, o.observations,
      o.company_snapshot, o.job_title_snapshot,
      o.compliance_record_id, o.created_at::text, o.updated_at::text
    FROM campus_sst.sst_machine_operators o
    INNER JOIN campus_sst.sst_workers w ON w.id = o.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = o.farm_id
    WHERE o.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapOperator(rows[0]) : null;
}

async function nextOperatorFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM campus_sst.sst_machine_operators
    WHERE folio LIKE ${`OPE-${year}-%`}
  `;
  const next = (rows[0]?.count ?? 0) + 1;
  return `OPE-${year}-${String(next).padStart(3, "0")}`;
}

function authFieldsFromDraft(draft: SstOperatorDraft) {
  return resolveAuthorization({
    trainingDueDate: emptyToNull(draft.trainingDueDate),
    licenseDueDate: emptyToNull(draft.licenseDueDate),
    fitnessConcept: draft.fitnessConcept,
    inductionDone: draft.inductionDone,
  });
}

function complianceDraftFromOperator(item: SstOperator): SstRecordDraft {
  const useLicense = Boolean(item.licenseCategory.trim());
  return {
    recordType: useLicense ? "licencia" : "certificacion",
    title: useLicense
      ? `Licencia ${item.licenseCategory} — ${item.workerName}`
      : `Capacitación operador — ${item.workerName}`,
    code: item.folio,
    workerId: item.workerId,
    subjectName: item.workerName,
    subjectDocument: item.workerDocument,
    subjectJobTitle: item.jobTitleSnapshot,
    farmId: item.farmId,
    dueDate: useLicense ? item.licenseDueDate : item.trainingDueDate,
    issuedAt: useLicense
      ? item.occupationalExamDate ?? item.trainingDate
      : item.trainingDate,
    workflowStatus: item.keyStatus === "autorizado" ? "open" : "pending_closure",
    externalEntity: item.equipmentName,
    notes: [item.trainingName, item.blockReasons, item.observations]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 500),
  };
}

async function syncComplianceRecord(
  item: SstOperator,
  userId: string,
): Promise<void> {
  const draft = complianceDraftFromOperator(item);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode(draft.recordType, item.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_machine_operators
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_machine_operators
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

export async function listOperators(filters?: {
  equipmentType?: EquipmentType | "all";
  keyStatus?: KeyStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstOperator[]> {
  const sql = getSql();
  const equipmentType =
    filters?.equipmentType && filters.equipmentType !== "all"
      ? filters.equipmentType
      : null;
  const keyStatus =
    filters?.keyStatus && filters.keyStatus !== "all" ? filters.keyStatus : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<OperatorRow[]>`
    SELECT
      o.id, o.folio, o.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      o.farm_id, f.name AS farm_name,
      o.equipment_name, o.equipment_type, o.training_name,
      o.training_date::text, o.training_due_date::text,
      o.license_category, o.license_due_date::text,
      o.occupational_exam_date::text, o.fitness_concept,
      o.induction_done, o.induction_date::text,
      o.key_status, o.block_reasons, o.observations,
      o.company_snapshot, o.job_title_snapshot,
      o.compliance_record_id, o.created_at::text, o.updated_at::text
    FROM campus_sst.sst_machine_operators o
    INNER JOIN campus_sst.sst_workers w ON w.id = o.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = o.farm_id
    WHERE (${equipmentType}::text IS NULL OR o.equipment_type = ${equipmentType})
      AND (${keyStatus}::text IS NULL OR o.key_status = ${keyStatus})
      AND (${farmId}::uuid IS NULL OR o.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(o.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(o.equipment_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(o.training_name) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE WHEN o.key_status = 'bloqueado' THEN 0 ELSE 1 END,
      CASE WHEN o.training_due_date IS NULL THEN 1 ELSE 0 END,
      o.training_due_date ASC NULLS LAST,
      o.updated_at DESC
  `;
  return rows.map(mapOperator);
}

export async function listOperatorViews(
  filters?: Parameters<typeof listOperators>[0],
): Promise<SstOperatorView[]> {
  return (await listOperators(filters)).map((item) => enrichOperatorAsView(item));
}

export async function getOperator(id: string): Promise<SstOperator | null> {
  return selectOperatorById(id);
}

export async function findOperatorByFolio(folio: string): Promise<SstOperator | null> {
  const sql = getSql();
  const rows = await sql<OperatorRow[]>`
    SELECT
      o.id, o.folio, o.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      o.farm_id, f.name AS farm_name,
      o.equipment_name, o.equipment_type, o.training_name,
      o.training_date::text, o.training_due_date::text,
      o.license_category, o.license_due_date::text,
      o.occupational_exam_date::text, o.fitness_concept,
      o.induction_done, o.induction_date::text,
      o.key_status, o.block_reasons, o.observations,
      o.company_snapshot, o.job_title_snapshot,
      o.compliance_record_id, o.created_at::text, o.updated_at::text
    FROM campus_sst.sst_machine_operators o
    INNER JOIN campus_sst.sst_workers w ON w.id = o.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = o.farm_id
    WHERE lower(o.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapOperator(rows[0]) : null;
}

export async function getOperatorStats(): Promise<OperatorStats> {
  const views = await listOperatorViews();
  const byEquipmentType: Record<EquipmentType, number> = {
    tractor: 0,
    cosechadora: 0,
    fumigadora: 0,
    camion: 0,
    otro: 0,
  };
  const byBlockCategory: Record<OperatorBlockCategory, number> = {
    formacion_vencida: 0,
    formacion_pendiente: 0,
    documentacion_pendiente: 0,
    aptitud_pendiente: 0,
    requisitos_incompletos: 0,
  };

  let authorized = 0;
  let blocked = 0;
  let atRisk = 0;

  for (const view of views) {
    byEquipmentType[view.equipmentType] += 1;
    if (view.keyStatus === "autorizado") {
      authorized += 1;
      const trainingSoon =
        view.trainingDaysRemaining !== null &&
        view.trainingDaysRemaining > 0 &&
        view.trainingDaysRemaining <= 30;
      const licenseSoon =
        view.licenseDaysRemaining !== null &&
        view.licenseDaysRemaining > 0 &&
        view.licenseDaysRemaining <= 30;
      if (trainingSoon || licenseSoon) atRisk += 1;
    } else {
      blocked += 1;
      for (const category of view.blockCategories) {
        byBlockCategory[category] += 1;
      }
    }
  }

  return {
    total: views.length,
    authorized,
    blocked,
    atRisk,
    byEquipmentType,
    byBlockCategory,
  };
}

export async function createOperator(
  draft: SstOperatorDraft,
  userId: string,
): Promise<SstOperator> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const folio = await nextOperatorFolio(sql);
  const farmId = emptyToNull(draft.farmId) ?? worker.farmId;
  const auth = authFieldsFromDraft(draft);

  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_machine_operators (
      folio, worker_id, farm_id,
      equipment_name, equipment_type,
      training_name, training_date, training_due_date,
      license_category, license_due_date,
      occupational_exam_date, fitness_concept,
      induction_done, induction_date,
      key_status, block_reasons, observations,
      company_snapshot, job_title_snapshot,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.workerId},
      ${farmId},
      ${draft.equipmentName.trim()},
      ${draft.equipmentType},
      ${draft.trainingName.trim()},
      ${emptyToNull(draft.trainingDate)},
      ${emptyToNull(draft.trainingDueDate)},
      ${draft.licenseCategory.trim()},
      ${emptyToNull(draft.licenseDueDate)},
      ${emptyToNull(draft.occupationalExamDate)},
      ${draft.fitnessConcept},
      ${draft.inductionDone},
      ${emptyToNull(draft.inductionDate)},
      ${auth.keyStatus},
      ${auth.blockReasons},
      ${draft.observations.trim()},
      ${worker.company},
      ${worker.jobTitle},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectOperatorById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el operador.");
  await syncComplianceRecord(created, userId);
  return (await selectOperatorById(created.id)) ?? created;
}

export async function updateOperator(
  id: string,
  draft: SstOperatorDraft,
  userId: string,
): Promise<SstOperator> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const farmId = emptyToNull(draft.farmId) ?? worker.farmId;
  const auth = authFieldsFromDraft(draft);

  await sql`
    UPDATE campus_sst.sst_machine_operators
    SET
      worker_id = ${draft.workerId},
      farm_id = ${farmId},
      equipment_name = ${draft.equipmentName.trim()},
      equipment_type = ${draft.equipmentType},
      training_name = ${draft.trainingName.trim()},
      training_date = ${emptyToNull(draft.trainingDate)},
      training_due_date = ${emptyToNull(draft.trainingDueDate)},
      license_category = ${draft.licenseCategory.trim()},
      license_due_date = ${emptyToNull(draft.licenseDueDate)},
      occupational_exam_date = ${emptyToNull(draft.occupationalExamDate)},
      fitness_concept = ${draft.fitnessConcept},
      induction_done = ${draft.inductionDone},
      induction_date = ${emptyToNull(draft.inductionDate)},
      key_status = ${auth.keyStatus},
      block_reasons = ${auth.blockReasons},
      observations = ${draft.observations.trim()},
      company_snapshot = ${worker.company},
      job_title_snapshot = ${worker.jobTitle},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectOperatorById(id);
  if (!updated) throw new Error("Operador no encontrado.");
  await syncComplianceRecord(updated, userId);
  return (await selectOperatorById(id)) ?? updated;
}

export async function deleteOperator(id: string): Promise<void> {
  const current = await selectOperatorById(id);
  if (!current) throw new Error("Operador no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_machine_operators WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
