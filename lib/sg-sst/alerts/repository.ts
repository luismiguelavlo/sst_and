import "server-only";

import { getSql } from "@/lib/db";
import {
  DEFAULT_ALERT_THRESHOLDS,
  isSstRecordType,
  isSstWorkflowStatus,
  RECORD_TYPE_META,
  type SstAlertThresholds,
  type SstComplianceRecord,
  type SstFarm,
  type SstRecordDraft,
  type SstRecordType,
  type SstThresholdDraft,
  type SstWorkflowStatus,
} from "@/lib/sg-sst/alerts/types";

type FarmRow = {
  id: string;
  name: string;
  code: string;
  active: boolean;
};

type SettingsRow = {
  critical_max_days: number;
  orange_max_days: number;
  yellow_max_days: number;
  use_business_days: boolean;
  type_overrides: unknown;
};

type RecordRow = {
  id: string;
  folio: string;
  record_type: string;
  title: string;
  code: string;
  module_path: string;
  worker_id: string | null;
  subject_name: string;
  subject_document: string | null;
  subject_job_title: string | null;
  farm_id: string | null;
  farm_name: string | null;
  due_date: string | null;
  issued_at: string | null;
  workflow_status: string;
  responsible_name: string | null;
  responsible_role: string | null;
  external_entity: string | null;
  phone: string | null;
  notes: string;
  metadata: unknown;
  closed_at: string | null;
  close_notes: string | null;
  created_at: string;
  updated_at: string;
};

type ActionRow = {
  id: string;
  record_id: string;
  action_kind: string;
  message: string;
  payload: unknown;
  created_by: string | null;
  created_by_name: string | null;
  created_at: string;
};

function asObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function mapSettings(row: SettingsRow | undefined): SstAlertThresholds {
  if (!row) {
    return DEFAULT_ALERT_THRESHOLDS;
  }
  const overridesRaw = asObject(row.type_overrides);
  const typeOverrides: SstAlertThresholds["typeOverrides"] = {};
  for (const [key, value] of Object.entries(overridesRaw)) {
    if (!isSstRecordType(key) || !value || typeof value !== "object") {
      continue;
    }
    const entry = value as { orangeMaxDays?: unknown; yellowMaxDays?: unknown };
    typeOverrides[key] = {
      orangeMaxDays:
        typeof entry.orangeMaxDays === "number" ? entry.orangeMaxDays : undefined,
      yellowMaxDays:
        typeof entry.yellowMaxDays === "number" ? entry.yellowMaxDays : undefined,
    };
  }
  return {
    criticalMaxDays: row.critical_max_days,
    orangeMaxDays: row.orange_max_days,
    yellowMaxDays: row.yellow_max_days,
    useBusinessDays: row.use_business_days,
    typeOverrides,
  };
}

function mapRecord(row: RecordRow): SstComplianceRecord {
  if (!isSstRecordType(row.record_type)) {
    throw new Error(`Tipo de registro desconocido: ${row.record_type}`);
  }
  if (!isSstWorkflowStatus(row.workflow_status)) {
    throw new Error(`Estado desconocido: ${row.workflow_status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    recordType: row.record_type,
    title: row.title,
    code: row.code,
    modulePath: row.module_path,
    workerId: row.worker_id,
    subjectName: row.subject_name,
    subjectDocument: row.subject_document,
    subjectJobTitle: row.subject_job_title,
    farmId: row.farm_id,
    farmName: row.farm_name,
    dueDate: row.due_date,
    issuedAt: row.issued_at,
    workflowStatus: row.workflow_status,
    responsibleName: row.responsible_name,
    responsibleRole: row.responsible_role,
    externalEntity: row.external_entity,
    phone: row.phone,
    notes: row.notes,
    metadata: asObject(row.metadata),
    closedAt: row.closed_at,
    closeNotes: row.close_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function nextFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM campus_sst.sst_compliance_records
    WHERE folio LIKE ${`ALT-${year}-%`}
  `;
  const next = (rows[0]?.count ?? 0) + 1;
  return `ALT-${year}-${String(next).padStart(3, "0")}`;
}

export async function listSstFarms(): Promise<SstFarm[]> {
  const sql = getSql();
  const rows = await sql<FarmRow[]>`
    SELECT id, name, code, active
    FROM campus_sst.sst_farms
    WHERE active = true
    ORDER BY name ASC
  `;
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    code: row.code,
    active: row.active,
  }));
}

export async function getAlertSettings(): Promise<SstAlertThresholds> {
  const sql = getSql();
  const rows = await sql<SettingsRow[]>`
    SELECT critical_max_days, orange_max_days, yellow_max_days, use_business_days, type_overrides
    FROM campus_sst.sst_alert_settings
    WHERE id = 1
  `;
  return mapSettings(rows[0]);
}

export async function saveAlertSettings(
  draft: SstThresholdDraft,
  userId: string,
): Promise<SstAlertThresholds> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_alert_settings
    SET
      critical_max_days = ${draft.criticalMaxDays},
      orange_max_days = ${draft.orangeMaxDays},
      yellow_max_days = ${draft.yellowMaxDays},
      use_business_days = ${draft.useBusinessDays},
      type_overrides = ${sql.json(draft.typeOverrides ?? {})},
      updated_at = now(),
      updated_by = ${userId}
    WHERE id = 1
  `;
  return getAlertSettings();
}

export async function resetAlertSettings(userId: string): Promise<SstAlertThresholds> {
  return saveAlertSettings(
    {
      criticalMaxDays: DEFAULT_ALERT_THRESHOLDS.criticalMaxDays,
      orangeMaxDays: DEFAULT_ALERT_THRESHOLDS.orangeMaxDays,
      yellowMaxDays: DEFAULT_ALERT_THRESHOLDS.yellowMaxDays,
      useBusinessDays: DEFAULT_ALERT_THRESHOLDS.useBusinessDays,
      typeOverrides: {},
    },
    userId,
  );
}

export async function listComplianceRecords(filters?: {
  recordTypes?: readonly SstRecordType[];
  farmId?: string | null;
  includeClosed?: boolean;
}): Promise<SstComplianceRecord[]> {
  const sql = getSql();
  const includeClosed = filters?.includeClosed ?? false;
  const recordTypes = filters?.recordTypes ?? null;
  const farmId = filters?.farmId ?? null;

  const rows = await sql<RecordRow[]>`
    SELECT
      r.id,
      r.folio,
      r.record_type,
      r.title,
      r.code,
      r.module_path,
      r.worker_id,
      r.subject_name,
      r.subject_document,
      r.subject_job_title,
      r.farm_id,
      f.name AS farm_name,
      r.due_date::text,
      r.issued_at::text,
      r.workflow_status,
      r.responsible_name,
      r.responsible_role,
      r.external_entity,
      r.phone,
      r.notes,
      r.metadata,
      r.closed_at::text,
      r.close_notes,
      r.created_at::text,
      r.updated_at::text
    FROM campus_sst.sst_compliance_records r
    LEFT JOIN campus_sst.sst_farms f ON f.id = r.farm_id
    WHERE (${includeClosed} OR r.workflow_status NOT IN ('closed', 'cancelled'))
      AND (${recordTypes}::text[] IS NULL OR r.record_type = ANY(${recordTypes}))
      AND (${farmId}::uuid IS NULL OR r.farm_id = ${farmId})
    ORDER BY
      CASE WHEN r.due_date IS NULL THEN 1 ELSE 0 END,
      r.due_date ASC NULLS LAST,
      r.updated_at DESC
  `;
  return rows.map(mapRecord);
}

export async function getComplianceRecord(id: string): Promise<SstComplianceRecord | null> {
  const sql = getSql();
  const rows = await sql<RecordRow[]>`
    SELECT
      r.id,
      r.folio,
      r.record_type,
      r.title,
      r.code,
      r.module_path,
      r.worker_id,
      r.subject_name,
      r.subject_document,
      r.subject_job_title,
      r.farm_id,
      f.name AS farm_name,
      r.due_date::text,
      r.issued_at::text,
      r.workflow_status,
      r.responsible_name,
      r.responsible_role,
      r.external_entity,
      r.phone,
      r.notes,
      r.metadata,
      r.closed_at::text,
      r.close_notes,
      r.created_at::text,
      r.updated_at::text
    FROM campus_sst.sst_compliance_records r
    LEFT JOIN campus_sst.sst_farms f ON f.id = r.farm_id
    WHERE r.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapRecord(rows[0]) : null;
}

export async function createComplianceRecord(
  draft: SstRecordDraft,
  userId: string,
): Promise<SstComplianceRecord> {
  const sql = getSql();
  const folio = await nextFolio(sql);
  const modulePath = RECORD_TYPE_META[draft.recordType].modulePath;
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_compliance_records (
      folio, record_type, title, code, module_path,
      worker_id, subject_name, subject_document, subject_job_title, farm_id,
      due_date, issued_at, workflow_status,
      responsible_name, responsible_role, external_entity, phone, notes,
      created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.recordType},
      ${draft.title.trim()},
      ${draft.code.trim()},
      ${modulePath},
      ${draft.workerId || null},
      ${draft.subjectName.trim()},
      ${draft.subjectDocument?.trim() || null},
      ${draft.subjectJobTitle?.trim() || null},
      ${draft.farmId || null},
      ${draft.dueDate || null},
      ${draft.issuedAt || null},
      ${draft.workflowStatus},
      ${draft.responsibleName?.trim() || null},
      ${draft.responsibleRole?.trim() || null},
      ${draft.externalEntity?.trim() || null},
      ${draft.phone?.trim() || null},
      ${draft.notes?.trim() || ""},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await getComplianceRecord(rows[0].id);
  if (!created) {
    throw new Error("No se pudo crear el registro.");
  }
  return created;
}

export async function updateComplianceRecord(
  id: string,
  draft: SstRecordDraft,
  userId: string,
): Promise<SstComplianceRecord> {
  const sql = getSql();
  const modulePath = RECORD_TYPE_META[draft.recordType].modulePath;
  const closed =
    draft.workflowStatus === "closed" || draft.workflowStatus === "cancelled";
  await sql`
    UPDATE campus_sst.sst_compliance_records
    SET
      record_type = ${draft.recordType},
      title = ${draft.title.trim()},
      code = ${draft.code.trim()},
      module_path = ${modulePath},
      worker_id = ${draft.workerId || null},
      subject_name = ${draft.subjectName.trim()},
      subject_document = ${draft.subjectDocument?.trim() || null},
      subject_job_title = ${draft.subjectJobTitle?.trim() || null},
      farm_id = ${draft.farmId || null},
      due_date = ${draft.dueDate || null},
      issued_at = ${draft.issuedAt || null},
      workflow_status = ${draft.workflowStatus},
      responsible_name = ${draft.responsibleName?.trim() || null},
      responsible_role = ${draft.responsibleRole?.trim() || null},
      external_entity = ${draft.externalEntity?.trim() || null},
      phone = ${draft.phone?.trim() || null},
      notes = ${draft.notes?.trim() || ""},
      closed_at = CASE WHEN ${closed} THEN COALESCE(closed_at, now()) ELSE NULL END,
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await getComplianceRecord(id);
  if (!updated) {
    throw new Error("Registro no encontrado.");
  }
  return updated;
}

export async function findComplianceRecordByCode(
  recordType: SstRecordType,
  code: string,
): Promise<SstComplianceRecord | null> {
  const sql = getSql();
  const rows = await sql<RecordRow[]>`
    SELECT
      r.id,
      r.folio,
      r.record_type,
      r.title,
      r.code,
      r.module_path,
      r.worker_id,
      r.subject_name,
      r.subject_document,
      r.subject_job_title,
      r.farm_id,
      f.name AS farm_name,
      r.due_date::text,
      r.issued_at::text,
      r.workflow_status,
      r.responsible_name,
      r.responsible_role,
      r.external_entity,
      r.phone,
      r.notes,
      r.metadata,
      r.closed_at::text,
      r.close_notes,
      r.created_at::text,
      r.updated_at::text
    FROM campus_sst.sst_compliance_records r
    LEFT JOIN campus_sst.sst_farms f ON f.id = r.farm_id
    WHERE r.record_type = ${recordType}
      AND lower(r.code) = lower(${code.trim()})
    ORDER BY r.updated_at DESC
    LIMIT 1
  `;
  return rows[0] ? mapRecord(rows[0]) : null;
}

export async function deleteComplianceRecord(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_compliance_records WHERE id = ${id}`;
}

export async function closeComplianceRecord(
  id: string,
  closeNotes: string,
  userId: string,
): Promise<SstComplianceRecord> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_compliance_records
    SET
      workflow_status = 'closed',
      closed_at = now(),
      close_notes = ${closeNotes.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  await sql`
    INSERT INTO campus_sst.sst_alert_actions (record_id, action_kind, message, created_by)
    VALUES (${id}, 'close', ${closeNotes.trim()}, ${userId})
  `;
  const updated = await getComplianceRecord(id);
  if (!updated) {
    throw new Error("Registro no encontrado.");
  }
  return updated;
}

export async function extendComplianceRecord(
  id: string,
  newDueDate: string,
  message: string,
  userId: string,
): Promise<SstComplianceRecord> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_compliance_records
    SET
      due_date = ${newDueDate},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  await sql`
    INSERT INTO campus_sst.sst_alert_actions (record_id, action_kind, message, payload, created_by)
    VALUES (
      ${id},
      'extend',
      ${message.trim() || "Prórroga de vigencia"},
      ${sql.json({ newDueDate })},
      ${userId}
    )
  `;
  const updated = await getComplianceRecord(id);
  if (!updated) {
    throw new Error("Registro no encontrado.");
  }
  return updated;
}

export async function addAlertActionNote(
  id: string,
  message: string,
  userId: string,
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO campus_sst.sst_alert_actions (record_id, action_kind, message, created_by)
    VALUES (${id}, 'note', ${message.trim()}, ${userId})
  `;
}

export async function listAlertActions(recordId: string) {
  const sql = getSql();
  const rows = await sql<ActionRow[]>`
    SELECT
      a.id,
      a.record_id,
      a.action_kind,
      a.message,
      a.payload,
      a.created_by,
      u.name AS created_by_name,
      a.created_at::text
    FROM campus_sst.sst_alert_actions a
    LEFT JOIN campus_sst.users u ON u.id = a.created_by
    WHERE a.record_id = ${recordId}
    ORDER BY a.created_at DESC
  `;
  return rows.map((row) => ({
    id: row.id,
    recordId: row.record_id,
    actionKind: row.action_kind,
    message: row.message,
    payload: asObject(row.payload),
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    createdAt: row.created_at,
  }));
}

export async function updateWorkflowStatus(
  id: string,
  status: SstWorkflowStatus,
  message: string,
  userId: string,
): Promise<SstComplianceRecord> {
  const sql = getSql();
  const closed = status === "closed" || status === "cancelled";
  await sql`
    UPDATE campus_sst.sst_compliance_records
    SET
      workflow_status = ${status},
      closed_at = CASE WHEN ${closed} THEN COALESCE(closed_at, now()) ELSE NULL END,
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  await sql`
    INSERT INTO campus_sst.sst_alert_actions (record_id, action_kind, message, payload, created_by)
    VALUES (
      ${id},
      'status_change',
      ${message.trim() || `Cambio de estado a ${status}`},
      ${sql.json({ status })},
      ${userId}
    )
  `;
  const updated = await getComplianceRecord(id);
  if (!updated) {
    throw new Error("Registro no encontrado.");
  }
  return updated;
}
