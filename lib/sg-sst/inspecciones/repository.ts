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
  deriveEffectiveStatus,
  enrichInspectionAsView,
  getCurrentWeekRange,
  isFindingSeverity,
  isFindingStatus,
  isInspectionStatus,
  isInspectionType,
  resolveComplianceDueDate,
  toComplianceWorkflowStatus,
  type InspectionStats,
  type InspectionStatus,
  type InspectionType,
  type SstInspection,
  type SstInspectionDraft,
  type SstInspectionFinding,
  type SstInspectionFindingDraft,
  type SstInspectionView,
  type WeekRange,
  INSPECTION_TYPE_LABELS,
} from "@/lib/sg-sst/inspecciones/types";

type InspectionRow = {
  id: string;
  folio: string;
  inspection_type: string;
  responsible_name: string;
  farm_id: string | null;
  farm_name: string | null;
  work_center: string;
  scheduled_date: string;
  performed_date: string | null;
  status: string;
  findings_summary: string;
  findings_count: number;
  evidence_url: string;
  evidence_name: string;
  generated_action: string;
  next_inspection_date: string | null;
  observations: string;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

type FindingRow = {
  id: string;
  inspection_id: string;
  severity: string;
  title: string;
  description: string;
  action_plan: string;
  assignee_name: string;
  due_date: string | null;
  status: string;
  evidence_url: string;
  created_at: string;
  updated_at: string;
};

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapFinding(row: FindingRow): SstInspectionFinding {
  if (!isFindingSeverity(row.severity)) {
    throw new Error(`Severidad de hallazgo inválida: ${row.severity}`);
  }
  if (!isFindingStatus(row.status)) {
    throw new Error(`Estado de hallazgo inválido: ${row.status}`);
  }
  return {
    id: row.id,
    inspectionId: row.inspection_id,
    severity: row.severity,
    title: row.title,
    description: row.description,
    actionPlan: row.action_plan,
    assigneeName: row.assignee_name,
    dueDate: row.due_date,
    status: row.status,
    evidenceUrl: row.evidence_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInspection(
  row: InspectionRow,
  findings: SstInspectionFinding[] = [],
): SstInspection {
  if (!isInspectionType(row.inspection_type)) {
    throw new Error(`Tipo de inspección inválido: ${row.inspection_type}`);
  }
  if (!isInspectionStatus(row.status)) {
    throw new Error(`Estado de inspección inválido: ${row.status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    inspectionType: row.inspection_type,
    responsibleName: row.responsible_name,
    farmId: row.farm_id,
    farmName: row.farm_name,
    workCenter: row.work_center,
    scheduledDate: row.scheduled_date,
    performedDate: row.performed_date,
    status: row.status,
    findingsSummary: row.findings_summary,
    findingsCount: row.findings_count,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    generatedAction: row.generated_action,
    nextInspectionDate: row.next_inspection_date,
    observations: row.observations,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    findings,
  };
}

const INSPECTION_SELECT = `
  i.id, i.folio, i.inspection_type, i.responsible_name, i.farm_id,
  f.name AS farm_name, i.work_center, i.scheduled_date::text, i.performed_date::text,
  i.status, i.findings_summary, i.findings_count, i.evidence_url, i.evidence_name,
  i.generated_action, i.next_inspection_date::text, i.observations,
  i.compliance_record_id, i.created_at::text, i.updated_at::text
`;

async function nextInspectionFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_inspections", "folio", `INS-${year}-`);
}

export async function listFindingsByInspectionIds(
  inspectionIds: readonly string[],
): Promise<Map<string, SstInspectionFinding[]>> {
  const map = new Map<string, SstInspectionFinding[]>();
  if (inspectionIds.length === 0) return map;
  const sql = getSql();
  const rows = await sql<FindingRow[]>`
    SELECT
      id, inspection_id, severity, title, description, action_plan,
      assignee_name, due_date::text, status, evidence_url,
      created_at::text, updated_at::text
    FROM campus_sst.sst_inspection_findings
    WHERE inspection_id = ANY(${inspectionIds as string[]})
    ORDER BY
      CASE severity
        WHEN 'critica' THEN 0
        WHEN 'alta' THEN 1
        WHEN 'media' THEN 2
        ELSE 3
      END,
      created_at ASC
  `;
  for (const row of rows) {
    const finding = mapFinding(row);
    const list = map.get(finding.inspectionId) ?? [];
    list.push(finding);
    map.set(finding.inspectionId, list);
  }
  return map;
}

export async function listFindingsByInspection(
  inspectionId: string,
): Promise<SstInspectionFinding[]> {
  const map = await listFindingsByInspectionIds([inspectionId]);
  return map.get(inspectionId) ?? [];
}

async function selectInspectionById(id: string): Promise<SstInspection | null> {
  const sql = getSql();
  const rows = await sql<InspectionRow[]>`
    SELECT ${sql.unsafe(INSPECTION_SELECT)}
    FROM campus_sst.sst_inspections i
    LEFT JOIN campus_sst.sst_farms f ON f.id = i.farm_id
    WHERE i.id = ${id}
    LIMIT 1
  `;
  if (!rows[0]) return null;
  const findings = await listFindingsByInspection(id);
  return mapInspection(rows[0], findings);
}

function complianceDraftFromInspection(item: SstInspection): SstRecordDraft {
  const effectiveStatus = deriveEffectiveStatus(item.status, item.scheduledDate);
  const dueDate = resolveComplianceDueDate(item, effectiveStatus);
  const typeLabel = INSPECTION_TYPE_LABELS[item.inspectionType];
  return {
    recordType: "inspeccion",
    title: `Inspección ${typeLabel} — ${item.workCenter || item.farmName || item.responsibleName}`,
    code: item.folio,
    workerId: null,
    subjectName: item.responsibleName || item.workCenter || typeLabel,
    subjectDocument: undefined,
    subjectJobTitle: item.workCenter || undefined,
    farmId: item.farmId,
    dueDate,
    issuedAt: item.performedDate ?? item.scheduledDate,
    workflowStatus: toComplianceWorkflowStatus(effectiveStatus),
    responsibleName: item.responsibleName,
    notes: (item.findingsSummary || item.generatedAction || item.observations).slice(
      0,
      500,
    ),
  };
}

async function syncComplianceRecord(
  item: SstInspection,
  userId: string,
): Promise<void> {
  const draft = complianceDraftFromInspection(item);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("inspeccion", item.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_inspections
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_inspections
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

async function syncFindingsCount(inspectionId: string): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_inspections
    SET
      findings_count = (
        SELECT COUNT(*)::int
        FROM campus_sst.sst_inspection_findings
        WHERE inspection_id = ${inspectionId}
      ),
      updated_at = now()
    WHERE id = ${inspectionId}
  `;
}

export async function replaceInspectionFindings(
  inspectionId: string,
  findings: readonly SstInspectionFindingDraft[],
): Promise<void> {
  const sql = getSql();
  await sql`
    DELETE FROM campus_sst.sst_inspection_findings
    WHERE inspection_id = ${inspectionId}
  `;
  for (const finding of findings) {
    if (!finding.title.trim()) continue;
    await sql`
      INSERT INTO campus_sst.sst_inspection_findings (
        inspection_id, severity, title, description, action_plan,
        assignee_name, due_date, status, evidence_url
      ) VALUES (
        ${inspectionId},
        ${finding.severity},
        ${finding.title.trim()},
        ${finding.description.trim()},
        ${finding.actionPlan.trim()},
        ${finding.assigneeName.trim()},
        ${emptyToNull(finding.dueDate)},
        ${finding.status},
        ${finding.evidenceUrl.trim()}
      )
    `;
  }
  await syncFindingsCount(inspectionId);
}

export async function createFinding(
  inspectionId: string,
  draft: SstInspectionFindingDraft,
): Promise<SstInspectionFinding> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_inspection_findings (
      inspection_id, severity, title, description, action_plan,
      assignee_name, due_date, status, evidence_url
    ) VALUES (
      ${inspectionId},
      ${draft.severity},
      ${draft.title.trim()},
      ${draft.description.trim()},
      ${draft.actionPlan.trim()},
      ${draft.assigneeName.trim()},
      ${emptyToNull(draft.dueDate)},
      ${draft.status},
      ${draft.evidenceUrl.trim()}
    )
    RETURNING id
  `;
  await syncFindingsCount(inspectionId);
  const list = await listFindingsByInspection(inspectionId);
  const created = list.find((item) => item.id === rows[0].id);
  if (!created) throw new Error("No se pudo crear el hallazgo.");
  return created;
}

export async function updateFinding(
  id: string,
  draft: SstInspectionFindingDraft,
): Promise<SstInspectionFinding> {
  const sql = getSql();
  const existing = await sql<{ inspection_id: string }[]>`
    SELECT inspection_id FROM campus_sst.sst_inspection_findings WHERE id = ${id} LIMIT 1
  `;
  if (!existing[0]) throw new Error("Hallazgo no encontrado.");
  await sql`
    UPDATE campus_sst.sst_inspection_findings
    SET
      severity = ${draft.severity},
      title = ${draft.title.trim()},
      description = ${draft.description.trim()},
      action_plan = ${draft.actionPlan.trim()},
      assignee_name = ${draft.assigneeName.trim()},
      due_date = ${emptyToNull(draft.dueDate)},
      status = ${draft.status},
      evidence_url = ${draft.evidenceUrl.trim()},
      updated_at = now()
    WHERE id = ${id}
  `;
  await syncFindingsCount(existing[0].inspection_id);
  const list = await listFindingsByInspection(existing[0].inspection_id);
  const updated = list.find((item) => item.id === id);
  if (!updated) throw new Error("Hallazgo no encontrado tras actualizar.");
  return updated;
}

export async function deleteFinding(id: string): Promise<void> {
  const sql = getSql();
  const existing = await sql<{ inspection_id: string }[]>`
    SELECT inspection_id FROM campus_sst.sst_inspection_findings WHERE id = ${id} LIMIT 1
  `;
  if (!existing[0]) throw new Error("Hallazgo no encontrado.");
  await sql`DELETE FROM campus_sst.sst_inspection_findings WHERE id = ${id}`;
  await syncFindingsCount(existing[0].inspection_id);
}

export async function listInspections(filters?: {
  type?: InspectionType | "all";
  status?: InspectionStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstInspection[]> {
  const sql = getSql();
  const type = filters?.type && filters.type !== "all" ? filters.type : null;
  const status = filters?.status && filters.status !== "all" ? filters.status : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<InspectionRow[]>`
    SELECT ${sql.unsafe(INSPECTION_SELECT)}
    FROM campus_sst.sst_inspections i
    LEFT JOIN campus_sst.sst_farms f ON f.id = i.farm_id
    WHERE (${type}::text IS NULL OR i.inspection_type = ${type})
      AND (${status}::text IS NULL OR i.status = ${status})
      AND (${farmId}::uuid IS NULL OR i.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(i.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(i.responsible_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(i.work_center) LIKE ${q ? `%${q}%` : ""}
        OR lower(COALESCE(f.name, '')) LIKE ${q ? `%${q}%` : ""}
        OR lower(i.findings_summary) LIKE ${q ? `%${q}%` : ""}
        OR lower(i.generated_action) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY i.scheduled_date ASC, i.created_at DESC
  `;

  const findingsMap = await listFindingsByInspectionIds(rows.map((row) => row.id));
  return rows.map((row) => mapInspection(row, findingsMap.get(row.id) ?? []));
}

export async function listInspectionViews(
  filters?: Parameters<typeof listInspections>[0],
): Promise<SstInspectionView[]> {
  const today = new Date();
  const week = getCurrentWeekRange(today);
  return (await listInspections(filters)).map((item) =>
    enrichInspectionAsView(item, today, week),
  );
}

export async function listThisWeekInspections(
  today = new Date(),
): Promise<{ week: WeekRange; items: SstInspectionView[] }> {
  const week = getCurrentWeekRange(today);
  const items = (await listInspectionViews()).filter((item) => item.isThisWeek);
  return { week, items };
}

export async function getInspection(id: string): Promise<SstInspection | null> {
  return selectInspectionById(id);
}

export async function findInspectionByFolio(
  folio: string,
): Promise<SstInspection | null> {
  const sql = getSql();
  const rows = await sql<InspectionRow[]>`
    SELECT ${sql.unsafe(INSPECTION_SELECT)}
    FROM campus_sst.sst_inspections i
    LEFT JOIN campus_sst.sst_farms f ON f.id = i.farm_id
    WHERE lower(i.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  if (!rows[0]) return null;
  const findings = await listFindingsByInspection(rows[0].id);
  return mapInspection(rows[0], findings);
}

export async function getInspectionStats(): Promise<InspectionStats> {
  const views = await listInspectionViews();
  const today = new Date();
  const monthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const byStatus: Record<InspectionStatus, number> = {
    programada: 0,
    en_proceso: 0,
    realizada: 0,
    pendiente: 0,
    vencida: 0,
  };
  const byType = Object.fromEntries(
    (
      [
        "locativas",
        "epp",
        "botiquines",
        "extintores",
        "equipos",
        "herramientas",
        "vehiculos",
        "tractor",
        "trabajo_alturas",
        "emergencias",
        "orden_aseo",
        "quimicos",
        "puestos_trabajo",
      ] as const
    ).map((type) => [type, 0]),
  ) as Record<InspectionType, number>;

  let scheduledThisMonth = 0;
  let performed = 0;
  let pending = 0;
  let overdue = 0;
  let openFindings = 0;

  for (const view of views) {
    byStatus[view.effectiveStatus] += 1;
    byType[view.inspectionType] += 1;
    if (view.scheduledDate.startsWith(monthPrefix)) scheduledThisMonth += 1;
    if (view.effectiveStatus === "realizada") performed += 1;
    if (
      view.effectiveStatus === "pendiente" ||
      view.effectiveStatus === "programada" ||
      view.effectiveStatus === "en_proceso"
    ) {
      pending += 1;
    }
    if (view.effectiveStatus === "vencida") overdue += 1;
    openFindings += view.findings.filter((f) => f.status !== "cerrado").length;
  }

  return {
    total: views.length,
    scheduledThisMonth,
    performed,
    pending,
    overdue,
    openFindings,
    byStatus,
    byType,
  };
}

export async function createInspection(
  draft: SstInspectionDraft,
  userId: string,
): Promise<SstInspection> {
  const sql = getSql();
  const findingsCount = draft.findings?.filter((f) => f.title.trim()).length ?? 0;
  const rows = await withSequentialCodeRetry(async () => {
    const folio = await nextInspectionFolio(sql);
    return sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_inspections (
      folio, inspection_type, responsible_name, farm_id, work_center,
      scheduled_date, performed_date, status, findings_summary, findings_count,
      evidence_url, evidence_name, generated_action, next_inspection_date,
      observations, created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.inspectionType},
      ${draft.responsibleName.trim()},
      ${emptyToNull(draft.farmId)},
      ${draft.workCenter.trim()},
      ${draft.scheduledDate},
      ${emptyToNull(draft.performedDate)},
      ${draft.status},
      ${draft.findingsSummary.trim()},
      ${findingsCount},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${draft.generatedAction.trim()},
      ${emptyToNull(draft.nextInspectionDate)},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  });
  if (draft.findings && draft.findings.length > 0) {
    await replaceInspectionFindings(rows[0].id, draft.findings);
  }
  const created = await selectInspectionById(rows[0].id);
  if (!created) throw new Error("No se pudo crear la inspección.");
  await syncComplianceRecord(created, userId);
  return (await selectInspectionById(created.id)) ?? created;
}

export async function updateInspection(
  id: string,
  draft: SstInspectionDraft,
  userId: string,
): Promise<SstInspection> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_inspections
    SET
      inspection_type = ${draft.inspectionType},
      responsible_name = ${draft.responsibleName.trim()},
      farm_id = ${emptyToNull(draft.farmId)},
      work_center = ${draft.workCenter.trim()},
      scheduled_date = ${draft.scheduledDate},
      performed_date = ${emptyToNull(draft.performedDate)},
      status = ${draft.status},
      findings_summary = ${draft.findingsSummary.trim()},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      generated_action = ${draft.generatedAction.trim()},
      next_inspection_date = ${emptyToNull(draft.nextInspectionDate)},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  if (draft.findings !== undefined) {
    await replaceInspectionFindings(id, draft.findings);
  }
  const updated = await selectInspectionById(id);
  if (!updated) throw new Error("Inspección no encontrada.");
  await syncComplianceRecord(updated, userId);
  return (await selectInspectionById(id)) ?? updated;
}

export async function deleteInspection(id: string): Promise<void> {
  const current = await selectInspectionById(id);
  if (!current) throw new Error("Inspección no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_inspections WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
