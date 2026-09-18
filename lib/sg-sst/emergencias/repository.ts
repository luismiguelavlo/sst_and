import "server-only";

import { getSql } from "@/lib/db";
import { nextSequentialCode, withSequentialCodeRetry } from "@/lib/sg-sst/next-sequential-code";
import {
  createComplianceRecord,
  deleteComplianceRecord,
  findComplianceRecordByCode,
  updateComplianceRecord,
} from "@/lib/sg-sst/alerts/repository";
import type { SstRecordDraft } from "@/lib/sg-sst/alerts/types";
import {
  BRIGADE_TYPE_LABELS,
  deriveBrigadeStatus,
  deriveEquipmentStatus,
  enrichBrigadeAsView,
  enrichEquipmentAsView,
  isBrigadeStatus,
  isBrigadeType,
  isDrillStatus,
  isDrillType,
  isEquipmentStatus,
  isEquipmentType,
  resolveBrigadeStatusToPersist,
  resolveEquipmentStatusToPersist,
  toBrigadeComplianceWorkflow,
  toEquipmentComplianceWorkflow,
  type BrigadeStatus,
  type BrigadeType,
  type DrillStatus,
  type DrillType,
  type EmergenciasStats,
  type EquipmentStatus,
  type EquipmentType,
  type SstBrigadeMember,
  type SstBrigadeMemberDraft,
  type SstBrigadeMemberView,
  type SstEmergencyDrill,
  type SstEmergencyDrillDraft,
  type SstEmergencyEquipment,
  type SstEmergencyEquipmentDraft,
  type SstEmergencyEquipmentView,
} from "@/lib/sg-sst/emergencias/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type BrigadeRow = {
  id: string;
  folio: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  worker_status: string;
  company_snapshot: string;
  job_title_snapshot: string;
  brigade_type: string;
  training_title: string;
  trained_at: string;
  due_date: string;
  status: string;
  farm_id: string | null;
  farm_name: string | null;
  evidence_url: string;
  evidence_name: string;
  compliance_record_id: string | null;
  observations: string;
  created_at: string;
  updated_at: string;
};

type EquipmentRow = {
  id: string;
  code: string;
  element_name: string;
  equipment_type: string;
  location: string;
  inspected_at: string | null;
  next_inspection_at: string;
  responsible_name: string;
  status: string;
  findings: string;
  farm_id: string | null;
  farm_name: string | null;
  compliance_record_id: string | null;
  observations: string;
  created_at: string;
  updated_at: string;
};

type DrillRow = {
  id: string;
  folio: string;
  drill_date: string;
  place: string;
  drill_type: string;
  participants_count: number;
  result_score: string | number | null;
  result_label: string;
  findings: string;
  actions: string;
  status: string;
  farm_id: string | null;
  farm_name: string | null;
  evidence_url: string;
  evidence_name: string;
  observations: string;
  created_at: string;
  updated_at: string;
};

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapBrigade(row: BrigadeRow): SstBrigadeMember {
  if (!isBrigadeType(row.brigade_type)) {
    throw new Error(`Tipo de brigada inválido: ${row.brigade_type}`);
  }
  if (!isBrigadeStatus(row.status)) {
    throw new Error(`Estado de brigada inválido: ${row.status}`);
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
    brigadeType: row.brigade_type,
    trainingTitle: row.training_title,
    trainedAt: row.trained_at,
    dueDate: row.due_date,
    status: row.status,
    farmId: row.farm_id,
    farmName: row.farm_name,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    complianceRecordId: row.compliance_record_id,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEquipment(row: EquipmentRow): SstEmergencyEquipment {
  if (!isEquipmentType(row.equipment_type)) {
    throw new Error(`Tipo de equipo inválido: ${row.equipment_type}`);
  }
  if (!isEquipmentStatus(row.status)) {
    throw new Error(`Estado de equipo inválido: ${row.status}`);
  }
  return {
    id: row.id,
    code: row.code,
    elementName: row.element_name,
    equipmentType: row.equipment_type,
    location: row.location,
    inspectedAt: row.inspected_at,
    nextInspectionAt: row.next_inspection_at,
    responsibleName: row.responsible_name,
    status: row.status,
    findings: row.findings,
    farmId: row.farm_id,
    farmName: row.farm_name,
    complianceRecordId: row.compliance_record_id,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDrill(row: DrillRow): SstEmergencyDrill {
  if (!isDrillType(row.drill_type)) {
    throw new Error(`Tipo de simulacro inválido: ${row.drill_type}`);
  }
  if (!isDrillStatus(row.status)) {
    throw new Error(`Estado de simulacro inválido: ${row.status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    drillDate: row.drill_date,
    place: row.place,
    drillType: row.drill_type,
    participantsCount: Number(row.participants_count) || 0,
    resultScore:
      row.result_score === null || row.result_score === undefined
        ? null
        : Number(row.result_score),
    resultLabel: row.result_label,
    findings: row.findings,
    actions: row.actions,
    status: row.status,
    farmId: row.farm_id,
    farmName: row.farm_name,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const BRIGADE_SELECT = `
  b.id, b.folio, b.worker_id,
  w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
  w.status AS worker_status,
  b.company_snapshot, b.job_title_snapshot, b.brigade_type, b.training_title,
  b.trained_at::text, b.due_date::text, b.status,
  b.farm_id, f.name AS farm_name, b.evidence_url, b.evidence_name,
  b.compliance_record_id, b.observations, b.created_at::text, b.updated_at::text
`;

const EQUIPMENT_SELECT = `
  e.id, e.code, e.element_name, e.equipment_type, e.location,
  e.inspected_at::text, e.next_inspection_at::text, e.responsible_name, e.status,
  e.findings, e.farm_id, f.name AS farm_name, e.compliance_record_id,
  e.observations, e.created_at::text, e.updated_at::text
`;

const DRILL_SELECT = `
  d.id, d.folio, d.drill_date::text, d.place, d.drill_type, d.participants_count,
  d.result_score, d.result_label, d.findings, d.actions, d.status,
  d.farm_id, f.name AS farm_name, d.evidence_url, d.evidence_name,
  d.observations, d.created_at::text, d.updated_at::text
`;

async function nextBrigadeFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_brigade_members", "folio", `BRIG-${year}-`);
}

async function nextEquipmentCode(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_emergency_equipment", "code", `EQ-EM-${year}-`);
}

async function nextDrillFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_emergency_drills", "folio", `SIM-${year}-`);
}

async function selectBrigadeById(id: string): Promise<SstBrigadeMember | null> {
  const sql = getSql();
  const rows = await sql<BrigadeRow[]>`
    SELECT ${sql.unsafe(BRIGADE_SELECT)}
    FROM campus_sst.sst_brigade_members b
    INNER JOIN campus_sst.sst_workers w ON w.id = b.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = b.farm_id
    WHERE b.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapBrigade(rows[0]) : null;
}

async function selectEquipmentById(
  id: string,
): Promise<SstEmergencyEquipment | null> {
  const sql = getSql();
  const rows = await sql<EquipmentRow[]>`
    SELECT ${sql.unsafe(EQUIPMENT_SELECT)}
    FROM campus_sst.sst_emergency_equipment e
    LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
    WHERE e.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapEquipment(rows[0]) : null;
}

async function selectDrillById(id: string): Promise<SstEmergencyDrill | null> {
  const sql = getSql();
  const rows = await sql<DrillRow[]>`
    SELECT ${sql.unsafe(DRILL_SELECT)}
    FROM campus_sst.sst_emergency_drills d
    LEFT JOIN campus_sst.sst_farms f ON f.id = d.farm_id
    WHERE d.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapDrill(rows[0]) : null;
}

function complianceDraftFromBrigade(item: SstBrigadeMember): SstRecordDraft {
  const effective = deriveBrigadeStatus(item.status, item.dueDate);
  const typeLabel = BRIGADE_TYPE_LABELS[item.brigadeType];
  return {
    recordType: "curso",
    title: `Brigada ${typeLabel} — ${item.workerName}`,
    code: item.folio,
    workerId: item.workerId,
    subjectName: item.workerName,
    subjectDocument: item.workerDocument,
    subjectJobTitle: item.jobTitleSnapshot,
    farmId: item.farmId,
    dueDate: item.dueDate,
    issuedAt: item.trainedAt,
    workflowStatus: toBrigadeComplianceWorkflow(effective),
    notes: [
      item.trainingTitle.trim(),
      `Estado: ${effective}`,
      item.observations.trim(),
    ]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 500),
  };
}

async function syncBrigadeCompliance(
  item: SstBrigadeMember,
  userId: string,
): Promise<void> {
  const draft = complianceDraftFromBrigade(item);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("curso", item.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_brigade_members
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_brigade_members
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

function complianceDraftFromEquipment(
  item: SstEmergencyEquipment,
): SstRecordDraft {
  const effective = deriveEquipmentStatus(item.status, item.nextInspectionAt);
  const element = item.elementName || item.code;
  return {
    recordType: "inspeccion",
    title: `Equipo emergencia ${element}`,
    code: item.code,
    workerId: null,
    subjectName: item.responsibleName || element,
    subjectJobTitle: item.location || undefined,
    farmId: item.farmId,
    dueDate: item.nextInspectionAt,
    issuedAt: item.inspectedAt ?? item.createdAt.slice(0, 10),
    workflowStatus: toEquipmentComplianceWorkflow(effective),
    responsibleName: item.responsibleName,
    notes: (item.findings || item.observations).slice(0, 500),
  };
}

async function syncEquipmentCompliance(
  item: SstEmergencyEquipment,
  userId: string,
): Promise<void> {
  const draft = complianceDraftFromEquipment(item);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("inspeccion", item.code);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_emergency_equipment
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_emergency_equipment
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

export async function listBrigadeMembers(filters?: {
  brigadeType?: BrigadeType | "all";
  status?: BrigadeStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstBrigadeMember[]> {
  const sql = getSql();
  const brigadeType =
    filters?.brigadeType && filters.brigadeType !== "all"
      ? filters.brigadeType
      : null;
  const status =
    filters?.status && filters.status !== "all" ? filters.status : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<BrigadeRow[]>`
    SELECT ${sql.unsafe(BRIGADE_SELECT)}
    FROM campus_sst.sst_brigade_members b
    INNER JOIN campus_sst.sst_workers w ON w.id = b.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = b.farm_id
    WHERE (${brigadeType}::text IS NULL OR b.brigade_type = ${brigadeType})
      AND (${status}::text IS NULL OR b.status = ${status})
      AND (${farmId}::uuid IS NULL OR b.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(b.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(b.training_title) LIKE ${q ? `%${q}%` : ""}
        OR lower(COALESCE(f.name, '')) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE b.status
        WHEN 'vencido' THEN 0
        WHEN 'proximo' THEN 1
        WHEN 'vigente' THEN 2
        ELSE 3
      END,
      b.due_date ASC,
      b.created_at DESC
  `;
  return rows.map(mapBrigade);
}

export async function listBrigadeViews(
  filters?: Parameters<typeof listBrigadeMembers>[0],
): Promise<SstBrigadeMemberView[]> {
  return (await listBrigadeMembers(filters)).map((item) =>
    enrichBrigadeAsView(item),
  );
}

export async function getBrigadeMember(
  id: string,
): Promise<SstBrigadeMember | null> {
  return selectBrigadeById(id);
}

export async function findBrigadeByFolio(
  folio: string,
): Promise<SstBrigadeMember | null> {
  const sql = getSql();
  const rows = await sql<BrigadeRow[]>`
    SELECT ${sql.unsafe(BRIGADE_SELECT)}
    FROM campus_sst.sst_brigade_members b
    INNER JOIN campus_sst.sst_workers w ON w.id = b.worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = b.farm_id
    WHERE lower(b.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapBrigade(rows[0]) : null;
}

export async function createBrigadeMember(
  draft: SstBrigadeMemberDraft,
  userId: string,
): Promise<SstBrigadeMember> {
  const worker = await getWorker(draft.workerId);
  if (!worker) throw new Error("Trabajador no encontrado.");
  const sql = getSql();
  const status = resolveBrigadeStatusToPersist(draft);
  const farmId = emptyToNull(draft.farmId ?? null) ?? worker.farmId;
  const rows = await withSequentialCodeRetry(async () => {
    const folio = await nextBrigadeFolio(sql);
    return sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_brigade_members (
      folio, worker_id, company_snapshot, job_title_snapshot, brigade_type,
      training_title, trained_at, due_date, status, farm_id,
      evidence_url, evidence_name, observations, created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.workerId},
      ${(draft.companySnapshot ?? worker.company).trim()},
      ${(draft.jobTitleSnapshot ?? worker.jobTitle).trim()},
      ${draft.brigadeType},
      ${draft.trainingTitle.trim()},
      ${draft.trainedAt},
      ${draft.dueDate},
      ${status},
      ${farmId},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  });
  const created = await selectBrigadeById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el brigadista.");
  await syncBrigadeCompliance(created, userId);
  return (await selectBrigadeById(created.id)) ?? created;
}

export async function updateBrigadeMember(
  id: string,
  draft: SstBrigadeMemberDraft,
  userId: string,
): Promise<SstBrigadeMember> {
  const worker = await getWorker(draft.workerId);
  if (!worker) throw new Error("Trabajador no encontrado.");
  const sql = getSql();
  const status = resolveBrigadeStatusToPersist(draft);
  const farmId = emptyToNull(draft.farmId ?? null) ?? worker.farmId;
  await sql`
    UPDATE campus_sst.sst_brigade_members
    SET
      worker_id = ${draft.workerId},
      company_snapshot = ${(draft.companySnapshot ?? worker.company).trim()},
      job_title_snapshot = ${(draft.jobTitleSnapshot ?? worker.jobTitle).trim()},
      brigade_type = ${draft.brigadeType},
      training_title = ${draft.trainingTitle.trim()},
      trained_at = ${draft.trainedAt},
      due_date = ${draft.dueDate},
      status = ${status},
      farm_id = ${farmId},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectBrigadeById(id);
  if (!updated) throw new Error("Brigadista no encontrado.");
  await syncBrigadeCompliance(updated, userId);
  return (await selectBrigadeById(id)) ?? updated;
}

export async function deleteBrigadeMember(id: string): Promise<void> {
  const current = await selectBrigadeById(id);
  if (!current) throw new Error("Brigadista no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_brigade_members WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}

export async function listEmergencyEquipment(filters?: {
  equipmentType?: EquipmentType | "all";
  status?: EquipmentStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstEmergencyEquipment[]> {
  const sql = getSql();
  const equipmentType =
    filters?.equipmentType && filters.equipmentType !== "all"
      ? filters.equipmentType
      : null;
  const status =
    filters?.status && filters.status !== "all" ? filters.status : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<EquipmentRow[]>`
    SELECT ${sql.unsafe(EQUIPMENT_SELECT)}
    FROM campus_sst.sst_emergency_equipment e
    LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
    WHERE (${equipmentType}::text IS NULL OR e.equipment_type = ${equipmentType})
      AND (${status}::text IS NULL OR e.status = ${status})
      AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(e.code) LIKE ${q ? `%${q}%` : ""}
        OR lower(e.element_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(e.location) LIKE ${q ? `%${q}%` : ""}
        OR lower(e.responsible_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(COALESCE(f.name, '')) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE e.status
        WHEN 'vencido_inspeccion' THEN 0
        WHEN 'requiere_mantenimiento' THEN 1
        WHEN 'operativo' THEN 2
        ELSE 3
      END,
      e.next_inspection_at ASC,
      e.created_at DESC
  `;
  return rows.map(mapEquipment);
}

export async function listEquipmentViews(
  filters?: Parameters<typeof listEmergencyEquipment>[0],
): Promise<SstEmergencyEquipmentView[]> {
  return (await listEmergencyEquipment(filters)).map((item) =>
    enrichEquipmentAsView(item),
  );
}

export async function getEmergencyEquipment(
  id: string,
): Promise<SstEmergencyEquipment | null> {
  return selectEquipmentById(id);
}

export async function findEquipmentByCode(
  code: string,
): Promise<SstEmergencyEquipment | null> {
  const sql = getSql();
  const rows = await sql<EquipmentRow[]>`
    SELECT ${sql.unsafe(EQUIPMENT_SELECT)}
    FROM campus_sst.sst_emergency_equipment e
    LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
    WHERE lower(e.code) = lower(${code.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapEquipment(rows[0]) : null;
}

export async function createEmergencyEquipment(
  draft: SstEmergencyEquipmentDraft,
  userId: string,
): Promise<SstEmergencyEquipment> {
  const sql = getSql();
  const requested = draft.code?.trim() ?? "";
  if (requested) {
    const existing = await findEquipmentByCode(requested);
    if (existing) {
      throw new Error(`Ya existe un equipo con el código ${requested}.`);
    }
  }
  const status = resolveEquipmentStatusToPersist(draft);
  const rows = await withSequentialCodeRetry(async () => {
    const code = requested || (await nextEquipmentCode(sql));
    return sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_emergency_equipment (
      code, element_name, equipment_type, location, inspected_at,
      next_inspection_at, responsible_name, status, findings, farm_id,
      observations, created_by, updated_by
    ) VALUES (
      ${code},
      ${draft.elementName.trim()},
      ${draft.equipmentType},
      ${draft.location.trim()},
      ${emptyToNull(draft.inspectedAt)},
      ${draft.nextInspectionAt},
      ${draft.responsibleName.trim()},
      ${status},
      ${draft.findings.trim()},
      ${emptyToNull(draft.farmId ?? null)},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  });
  const created = await selectEquipmentById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el equipo.");
  await syncEquipmentCompliance(created, userId);
  return (await selectEquipmentById(created.id)) ?? created;
}

export async function updateEmergencyEquipment(
  id: string,
  draft: SstEmergencyEquipmentDraft,
  userId: string,
): Promise<SstEmergencyEquipment> {
  const current = await selectEquipmentById(id);
  if (!current) throw new Error("Equipo no encontrado.");
  const sql = getSql();
  const requested = draft.code?.trim() || current.code;
  if (requested.toLowerCase() !== current.code.toLowerCase()) {
    const clash = await findEquipmentByCode(requested);
    if (clash && clash.id !== id) {
      throw new Error(`Ya existe un equipo con el código ${requested}.`);
    }
  }
  const status = resolveEquipmentStatusToPersist(draft);
  await sql`
    UPDATE campus_sst.sst_emergency_equipment
    SET
      code = ${requested},
      element_name = ${draft.elementName.trim()},
      equipment_type = ${draft.equipmentType},
      location = ${draft.location.trim()},
      inspected_at = ${emptyToNull(draft.inspectedAt)},
      next_inspection_at = ${draft.nextInspectionAt},
      responsible_name = ${draft.responsibleName.trim()},
      status = ${status},
      findings = ${draft.findings.trim()},
      farm_id = ${emptyToNull(draft.farmId ?? null)},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectEquipmentById(id);
  if (!updated) throw new Error("Equipo no encontrado.");
  await syncEquipmentCompliance(updated, userId);
  return (await selectEquipmentById(id)) ?? updated;
}

export async function deleteEmergencyEquipment(id: string): Promise<void> {
  const current = await selectEquipmentById(id);
  if (!current) throw new Error("Equipo no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_emergency_equipment WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}

export async function listEmergencyDrills(filters?: {
  drillType?: DrillType | "all";
  status?: DrillStatus | "all";
  farmId?: string | null;
  query?: string;
  year?: number | null;
}): Promise<SstEmergencyDrill[]> {
  const sql = getSql();
  const drillType =
    filters?.drillType && filters.drillType !== "all" ? filters.drillType : null;
  const status =
    filters?.status && filters.status !== "all" ? filters.status : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;
  const year = filters?.year ?? null;

  const rows = await sql<DrillRow[]>`
    SELECT ${sql.unsafe(DRILL_SELECT)}
    FROM campus_sst.sst_emergency_drills d
    LEFT JOIN campus_sst.sst_farms f ON f.id = d.farm_id
    WHERE (${drillType}::text IS NULL OR d.drill_type = ${drillType})
      AND (${status}::text IS NULL OR d.status = ${status})
      AND (${farmId}::uuid IS NULL OR d.farm_id = ${farmId})
      AND (${year}::int IS NULL OR EXTRACT(YEAR FROM d.drill_date) = ${year})
      AND (
        ${q}::text IS NULL
        OR lower(d.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(d.place) LIKE ${q ? `%${q}%` : ""}
        OR lower(d.result_label) LIKE ${q ? `%${q}%` : ""}
        OR lower(d.findings) LIKE ${q ? `%${q}%` : ""}
        OR lower(COALESCE(f.name, '')) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY d.drill_date DESC, d.created_at DESC
  `;
  return rows.map(mapDrill);
}

export async function getEmergencyDrill(
  id: string,
): Promise<SstEmergencyDrill | null> {
  return selectDrillById(id);
}

export async function findDrillByFolio(
  folio: string,
): Promise<SstEmergencyDrill | null> {
  const sql = getSql();
  const rows = await sql<DrillRow[]>`
    SELECT ${sql.unsafe(DRILL_SELECT)}
    FROM campus_sst.sst_emergency_drills d
    LEFT JOIN campus_sst.sst_farms f ON f.id = d.farm_id
    WHERE lower(d.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapDrill(rows[0]) : null;
}

export async function createEmergencyDrill(
  draft: SstEmergencyDrillDraft,
  userId: string,
): Promise<SstEmergencyDrill> {
  const sql = getSql();
  const score =
    draft.resultScore === null ||
    draft.resultScore === undefined ||
    Number.isNaN(Number(draft.resultScore))
      ? null
      : Number(draft.resultScore);
  const rows = await withSequentialCodeRetry(async () => {
    const folio = await nextDrillFolio(sql);
    return sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_emergency_drills (
      folio, drill_date, place, drill_type, participants_count, result_score,
      result_label, findings, actions, status, farm_id,
      evidence_url, evidence_name, observations, created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.drillDate},
      ${draft.place.trim()},
      ${draft.drillType},
      ${Math.max(0, Math.trunc(draft.participantsCount))},
      ${score},
      ${draft.resultLabel.trim()},
      ${draft.findings.trim()},
      ${draft.actions.trim()},
      ${draft.status},
      ${emptyToNull(draft.farmId ?? null)},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  });
  const created = await selectDrillById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el simulacro.");
  return created;
}

export async function updateEmergencyDrill(
  id: string,
  draft: SstEmergencyDrillDraft,
  userId: string,
): Promise<SstEmergencyDrill> {
  const sql = getSql();
  const score =
    draft.resultScore === null ||
    draft.resultScore === undefined ||
    Number.isNaN(Number(draft.resultScore))
      ? null
      : Number(draft.resultScore);
  await sql`
    UPDATE campus_sst.sst_emergency_drills
    SET
      drill_date = ${draft.drillDate},
      place = ${draft.place.trim()},
      drill_type = ${draft.drillType},
      participants_count = ${Math.max(0, Math.trunc(draft.participantsCount))},
      result_score = ${score},
      result_label = ${draft.resultLabel.trim()},
      findings = ${draft.findings.trim()},
      actions = ${draft.actions.trim()},
      status = ${draft.status},
      farm_id = ${emptyToNull(draft.farmId ?? null)},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectDrillById(id);
  if (!updated) throw new Error("Simulacro no encontrado.");
  return updated;
}

export async function deleteEmergencyDrill(id: string): Promise<void> {
  const current = await selectDrillById(id);
  if (!current) throw new Error("Simulacro no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_emergency_drills WHERE id = ${id}`;
}

export async function getEmergenciasStats(): Promise<EmergenciasStats> {
  const [brigadeViews, equipmentViews, drills] = await Promise.all([
    listBrigadeViews(),
    listEquipmentViews(),
    listEmergencyDrills(),
  ]);
  const year = new Date().getFullYear();

  const byBrigadeType: Record<BrigadeType, number> = {
    primeros_auxilios: 0,
    evacuacion: 0,
    incendios: 0,
    rescate: 0,
  };
  let brigadistasVigentes = 0;
  let formacionesVencidas = 0;
  let formacionesProximas = 0;
  for (const item of brigadeViews) {
    byBrigadeType[item.brigadeType] += 1;
    if (item.effectiveStatus === "vigente") brigadistasVigentes += 1;
    if (item.effectiveStatus === "vencido") formacionesVencidas += 1;
    if (item.effectiveStatus === "proximo") formacionesProximas += 1;
  }

  const byEquipmentType: Record<EquipmentType, number> = {
    extintor: 0,
    botiquin: 0,
    camilla: 0,
    senalizacion: 0,
    linterna: 0,
    otro: 0,
  };
  let equiposPorInspeccionar = 0;
  let equiposVencidos = 0;
  for (const item of equipmentViews) {
    byEquipmentType[item.equipmentType] += 1;
    if (item.effectiveStatus === "vencido_inspeccion") equiposVencidos += 1;
    else if (item.dueSoon) equiposPorInspeccionar += 1;
  }

  const byDrillType: Record<DrillType, number> = {
    evacuacion: 0,
    incendio: 0,
    derrame: 0,
    sismo: 0,
    primeros_auxilios: 0,
    integral: 0,
    otro: 0,
  };
  let simulacrosDelAnio = 0;
  for (const item of drills) {
    byDrillType[item.drillType] += 1;
    if (item.drillDate.startsWith(String(year))) simulacrosDelAnio += 1;
  }

  return {
    brigadistasVigentes,
    formacionesVencidas,
    formacionesProximas,
    equiposPorInspeccionar,
    equiposVencidos,
    simulacrosDelAnio,
    brigadeTotal: brigadeViews.length,
    equipmentTotal: equipmentViews.length,
    drillsTotal: drills.length,
    byBrigadeType,
    byEquipmentType,
    byDrillType,
  };
}
