import "server-only";

import { getSql } from "@/lib/db";
import { nextSequentialCode } from "@/lib/sg-sst/next-sequential-code";
import {
  createComplianceRecord,
  deleteComplianceRecord,
  findComplianceRecordByCode,
  updateComplianceRecord,
} from "@/lib/sg-sst/alerts/repository";
import type { SstRecordDraft, SstSemaphoreLevel } from "@/lib/sg-sst/alerts/types";
import {
  EPP_CATALOG_DEFAULTS,
  enrichDeliveryAsView,
  isEppCategory,
  isEppReason,
  resolveNextReplenishmentDate,
  toEppComplianceWorkflow,
  type EppCategory,
  type EppConsumptionBucket,
  type EppNameCount,
  type EppReason,
  type EppStats,
  type SstEppCatalogDraft,
  type SstEppCatalogItem,
  type SstEppDelivery,
  type SstEppDeliveryDraft,
  type SstEppDeliveryView,
} from "@/lib/sg-sst/epp/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type CatalogRow = {
  id: string;
  code: string;
  category: string;
  name: string;
  useful_life_days: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type DeliveryRow = {
  id: string;
  folio: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  worker_status: string;
  catalog_item_id: string;
  catalog_code: string;
  catalog_name: string;
  catalog_category: string;
  quantity: number;
  size_label: string;
  delivery_date: string;
  useful_life_days: number;
  next_replenishment_date: string | null;
  reason: string;
  responsible_name: string;
  evidence_url: string;
  evidence_name: string;
  observations: string;
  company_snapshot: string;
  job_title_snapshot: string;
  farm_id: string | null;
  farm_name: string | null;
  work_center_snapshot: string;
  unit_cost_cop: string | number;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

function mapCatalog(row: CatalogRow): SstEppCatalogItem {
  if (!isEppCategory(row.category)) {
    throw new Error(`Categoría EPP inválida: ${row.category}`);
  }
  return {
    id: row.id,
    code: row.code,
    category: row.category,
    name: row.name,
    usefulLifeDays: row.useful_life_days,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDelivery(row: DeliveryRow): SstEppDelivery {
  if (!isEppCategory(row.catalog_category)) {
    throw new Error(`Categoría EPP inválida: ${row.catalog_category}`);
  }
  if (!isEppReason(row.reason)) {
    throw new Error(`Motivo EPP inválido: ${row.reason}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    workerStatus: row.worker_status,
    catalogItemId: row.catalog_item_id,
    catalogCode: row.catalog_code,
    catalogName: row.catalog_name,
    catalogCategory: row.catalog_category,
    quantity: row.quantity,
    sizeLabel: row.size_label,
    deliveryDate: row.delivery_date,
    usefulLifeDays: row.useful_life_days,
    nextReplenishmentDate: row.next_replenishment_date,
    reason: row.reason,
    responsibleName: row.responsible_name,
    evidenceUrl: row.evidence_url,
    evidenceName: row.evidence_name,
    observations: row.observations,
    companySnapshot: row.company_snapshot,
    jobTitleSnapshot: row.job_title_snapshot,
    farmId: row.farm_id,
    farmName: row.farm_name,
    workCenterSnapshot: row.work_center_snapshot,
    unitCostCop: Number(row.unit_cost_cop) || 0,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function selectCatalogById(id: string): Promise<SstEppCatalogItem | null> {
  const sql = getSql();
  const rows = await sql<CatalogRow[]>`
    SELECT
      id, code, category, name, useful_life_days, active,
      created_at::text, updated_at::text
    FROM campus_sst.sst_epp_catalog
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapCatalog(rows[0]) : null;
}

async function selectDeliveryById(id: string): Promise<SstEppDelivery | null> {
  const sql = getSql();
  const rows = await sql<DeliveryRow[]>`
    SELECT
      d.id, d.folio, d.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      d.catalog_item_id, c.code AS catalog_code, c.name AS catalog_name,
      c.category AS catalog_category,
      d.quantity, d.size_label, d.delivery_date::text, d.useful_life_days,
      d.next_replenishment_date::text, d.reason, d.responsible_name,
      d.evidence_url, d.evidence_name, d.observations,
      d.company_snapshot, d.job_title_snapshot, d.farm_id, f.name AS farm_name,
      d.work_center_snapshot, d.unit_cost_cop, d.compliance_record_id,
      d.created_at::text, d.updated_at::text
    FROM campus_sst.sst_epp_deliveries d
    INNER JOIN campus_sst.sst_workers w ON w.id = d.worker_id
    INNER JOIN campus_sst.sst_epp_catalog c ON c.id = d.catalog_item_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = d.farm_id
    WHERE d.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapDelivery(rows[0]) : null;
}

async function nextDeliveryFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_epp_deliveries", "folio", `EPP-${year}-`);
}

function complianceDraftFromDelivery(item: SstEppDelivery): SstRecordDraft {
  return {
    recordType: "epp",
    title: `EPP ${item.catalogName} — ${item.workerName}`,
    code: item.folio,
    workerId: item.workerId,
    subjectName: item.workerName,
    subjectDocument: item.workerDocument,
    subjectJobTitle: item.jobTitleSnapshot,
    farmId: item.farmId,
    dueDate: item.nextReplenishmentDate,
    issuedAt: item.deliveryDate,
    workflowStatus: toEppComplianceWorkflow(item.nextReplenishmentDate),
    responsibleName: item.responsibleName,
    notes: item.observations.slice(0, 500),
  };
}

async function syncComplianceRecord(
  item: SstEppDelivery,
  userId: string,
): Promise<void> {
  const draft = complianceDraftFromDelivery(item);
  const sql = getSql();
  if (item.complianceRecordId) {
    await updateComplianceRecord(item.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("epp", item.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_epp_deliveries
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${item.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_epp_deliveries
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${item.id}
  `;
}

export async function ensureCatalogDefaults(): Promise<void> {
  const sql = getSql();
  const countRows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count FROM campus_sst.sst_epp_catalog
  `;
  if ((countRows[0]?.count ?? 0) > 0) return;

  for (const item of EPP_CATALOG_DEFAULTS) {
    await sql`
      INSERT INTO campus_sst.sst_epp_catalog (
        code, category, name, useful_life_days, active
      ) VALUES (
        ${item.code},
        ${item.category},
        ${item.name},
        ${item.usefulLifeDays},
        true
      )
      ON CONFLICT (code) DO NOTHING
    `;
  }
}

export async function listCatalog(filters?: {
  category?: EppCategory | "all";
  activeOnly?: boolean;
  query?: string;
}): Promise<SstEppCatalogItem[]> {
  const sql = getSql();
  const category =
    filters?.category && filters.category !== "all" ? filters.category : null;
  const activeOnly = filters?.activeOnly ?? false;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<CatalogRow[]>`
    SELECT
      id, code, category, name, useful_life_days, active,
      created_at::text, updated_at::text
    FROM campus_sst.sst_epp_catalog
    WHERE (${category}::text IS NULL OR category = ${category})
      AND (${activeOnly}::boolean = false OR active = true)
      AND (
        ${q}::text IS NULL
        OR lower(code) LIKE ${q ? `%${q}%` : ""}
        OR lower(name) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY category ASC, name ASC
  `;
  return rows.map(mapCatalog);
}

export async function getCatalogItem(id: string): Promise<SstEppCatalogItem | null> {
  return selectCatalogById(id);
}

export async function findCatalogByCode(
  code: string,
): Promise<SstEppCatalogItem | null> {
  const sql = getSql();
  const rows = await sql<CatalogRow[]>`
    SELECT
      id, code, category, name, useful_life_days, active,
      created_at::text, updated_at::text
    FROM campus_sst.sst_epp_catalog
    WHERE lower(code) = lower(${code.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapCatalog(rows[0]) : null;
}

export async function findCatalogByName(
  name: string,
): Promise<SstEppCatalogItem | null> {
  const sql = getSql();
  const rows = await sql<CatalogRow[]>`
    SELECT
      id, code, category, name, useful_life_days, active,
      created_at::text, updated_at::text
    FROM campus_sst.sst_epp_catalog
    WHERE lower(name) = lower(${name.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapCatalog(rows[0]) : null;
}

export async function createCatalogItem(
  draft: SstEppCatalogDraft,
): Promise<SstEppCatalogItem> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_epp_catalog (
      code, category, name, useful_life_days, active
    ) VALUES (
      ${draft.code.trim().toUpperCase()},
      ${draft.category},
      ${draft.name.trim()},
      ${Math.trunc(draft.usefulLifeDays)},
      ${draft.active}
    )
    RETURNING id
  `;
  const created = await selectCatalogById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el ítem del catálogo.");
  return created;
}

export async function updateCatalogItem(
  id: string,
  draft: SstEppCatalogDraft,
): Promise<SstEppCatalogItem> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_epp_catalog
    SET
      code = ${draft.code.trim().toUpperCase()},
      category = ${draft.category},
      name = ${draft.name.trim()},
      useful_life_days = ${Math.trunc(draft.usefulLifeDays)},
      active = ${draft.active},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectCatalogById(id);
  if (!updated) throw new Error("Ítem de catálogo no encontrado.");
  return updated;
}

export async function deleteCatalogItem(id: string): Promise<void> {
  const sql = getSql();
  const usage = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM campus_sst.sst_epp_deliveries
    WHERE catalog_item_id = ${id}
  `;
  if ((usage[0]?.count ?? 0) > 0) {
    await sql`
      UPDATE campus_sst.sst_epp_catalog
      SET active = false, updated_at = now()
      WHERE id = ${id}
    `;
    return;
  }
  await sql`DELETE FROM campus_sst.sst_epp_catalog WHERE id = ${id}`;
}

export async function listDeliveries(filters?: {
  category?: EppCategory | "all";
  reason?: EppReason | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstEppDelivery[]> {
  const sql = getSql();
  const category =
    filters?.category && filters.category !== "all" ? filters.category : null;
  const reason = filters?.reason && filters.reason !== "all" ? filters.reason : null;
  const farmId = filters?.farmId || null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<DeliveryRow[]>`
    SELECT
      d.id, d.folio, d.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      d.catalog_item_id, c.code AS catalog_code, c.name AS catalog_name,
      c.category AS catalog_category,
      d.quantity, d.size_label, d.delivery_date::text, d.useful_life_days,
      d.next_replenishment_date::text, d.reason, d.responsible_name,
      d.evidence_url, d.evidence_name, d.observations,
      d.company_snapshot, d.job_title_snapshot, d.farm_id, f.name AS farm_name,
      d.work_center_snapshot, d.unit_cost_cop, d.compliance_record_id,
      d.created_at::text, d.updated_at::text
    FROM campus_sst.sst_epp_deliveries d
    INNER JOIN campus_sst.sst_workers w ON w.id = d.worker_id
    INNER JOIN campus_sst.sst_epp_catalog c ON c.id = d.catalog_item_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = d.farm_id
    WHERE (${category}::text IS NULL OR c.category = ${category})
      AND (${reason}::text IS NULL OR d.reason = ${reason})
      AND (${farmId}::uuid IS NULL OR d.farm_id = ${farmId})
      AND (
        ${q}::text IS NULL
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(d.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(c.name) LIKE ${q ? `%${q}%` : ""}
        OR lower(c.code) LIKE ${q ? `%${q}%` : ""}
        OR lower(d.responsible_name) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE WHEN d.next_replenishment_date IS NULL THEN 1 ELSE 0 END,
      d.next_replenishment_date ASC NULLS LAST,
      d.delivery_date DESC
  `;
  return rows.map(mapDelivery);
}

export async function listDeliveryViews(
  filters?: Parameters<typeof listDeliveries>[0],
): Promise<SstEppDeliveryView[]> {
  return (await listDeliveries(filters)).map((item) => enrichDeliveryAsView(item));
}

export async function getDelivery(id: string): Promise<SstEppDelivery | null> {
  return selectDeliveryById(id);
}

export async function findDeliveryByFolio(
  folio: string,
): Promise<SstEppDelivery | null> {
  const sql = getSql();
  const rows = await sql<DeliveryRow[]>`
    SELECT
      d.id, d.folio, d.worker_id,
      w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
      w.status AS worker_status,
      d.catalog_item_id, c.code AS catalog_code, c.name AS catalog_name,
      c.category AS catalog_category,
      d.quantity, d.size_label, d.delivery_date::text, d.useful_life_days,
      d.next_replenishment_date::text, d.reason, d.responsible_name,
      d.evidence_url, d.evidence_name, d.observations,
      d.company_snapshot, d.job_title_snapshot, d.farm_id, f.name AS farm_name,
      d.work_center_snapshot, d.unit_cost_cop, d.compliance_record_id,
      d.created_at::text, d.updated_at::text
    FROM campus_sst.sst_epp_deliveries d
    INNER JOIN campus_sst.sst_workers w ON w.id = d.worker_id
    INNER JOIN campus_sst.sst_epp_catalog c ON c.id = d.catalog_item_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = d.farm_id
    WHERE lower(d.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapDelivery(rows[0]) : null;
}

function topByName(
  items: readonly SstEppDeliveryView[],
  predicate?: (item: SstEppDeliveryView) => boolean,
  limit = 5,
): EppNameCount[] {
  const map = new Map<string, EppNameCount>();
  for (const item of items) {
    if (predicate && !predicate(item)) continue;
    const key = item.catalogItemId;
    const current = map.get(key);
    if (current) {
      current.count += item.quantity;
    } else {
      map.set(key, {
        name: item.catalogName,
        category: item.catalogCategory,
        count: item.quantity,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}

function groupConsumption(
  items: readonly SstEppDeliveryView[],
  keyOf: (item: SstEppDeliveryView) => string,
): EppConsumptionBucket[] {
  const map = new Map<string, EppConsumptionBucket>();
  for (const item of items) {
    const label = keyOf(item).trim() || "Sin dato";
    const current = map.get(label);
    const lineCost = item.unitCostCop * item.quantity;
    if (current) {
      current.quantity += item.quantity;
      current.costCop += lineCost;
    } else {
      map.set(label, { label, quantity: item.quantity, costCop: lineCost });
    }
  }
  return [...map.values()].sort((a, b) => b.quantity - a.quantity);
}

export async function getEppStats(): Promise<EppStats> {
  const views = await listDeliveryViews();
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const bySemaphore: Record<SstSemaphoreLevel, number> = {
    critico: 0,
    proximo: 0,
    seguimiento: 0,
    vigente: 0,
  };

  let deliveriesThisMonth = 0;
  let pendingReplenishment = 0;
  let upcomingReplenishment = 0;

  for (const view of views) {
    bySemaphore[view.semaphore] += 1;
    const [y, m] = view.deliveryDate.split("-").map(Number);
    if (y === year && m - 1 === month) {
      deliveriesThisMonth += 1;
    }
    if (view.isOverdue) {
      pendingReplenishment += 1;
    } else if (
      view.daysRemaining != null &&
      view.daysRemaining > 0 &&
      view.daysRemaining <= 30
    ) {
      upcomingReplenishment += 1;
    }
  }

  return {
    deliveriesThisMonth,
    pendingReplenishment,
    upcomingReplenishment,
    topDelivered: topByName(views),
    topReplaced: topByName(views, (item) => item.reason === "reposicion"),
    byCompany: groupConsumption(views, (item) => item.companySnapshot),
    byWorkCenter: groupConsumption(
      views,
      (item) => item.workCenterSnapshot || item.farmName || "",
    ),
    bySemaphore,
    total: views.length,
  };
}

export async function createDelivery(
  draft: SstEppDeliveryDraft,
  userId: string,
): Promise<SstEppDelivery> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const catalog = await selectCatalogById(draft.catalogItemId);
  if (!catalog) {
    throw new Error("Ítem de catálogo EPP no encontrado.");
  }
  if (!catalog.active) {
    throw new Error("El EPP seleccionado está inactivo en el catálogo.");
  }

  const usefulLifeDays =
    draft.usefulLifeDays > 0 ? Math.trunc(draft.usefulLifeDays) : catalog.usefulLifeDays;
  const nextDate = resolveNextReplenishmentDate({
    ...draft,
    usefulLifeDays,
  });

  const sql = getSql();
  const folio = await nextDeliveryFolio(sql);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_epp_deliveries (
      folio, worker_id, catalog_item_id, quantity, size_label,
      delivery_date, useful_life_days, next_replenishment_date, reason,
      responsible_name, evidence_url, evidence_name, observations,
      company_snapshot, job_title_snapshot, farm_id, work_center_snapshot,
      unit_cost_cop, created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.workerId},
      ${draft.catalogItemId},
      ${Math.trunc(draft.quantity)},
      ${draft.sizeLabel.trim()},
      ${draft.deliveryDate},
      ${usefulLifeDays},
      ${nextDate},
      ${draft.reason},
      ${draft.responsibleName.trim()},
      ${draft.evidenceUrl.trim()},
      ${draft.evidenceName.trim()},
      ${draft.observations.trim()},
      ${worker.company},
      ${worker.jobTitle},
      ${worker.farmId},
      ${worker.workCenter},
      ${draft.unitCostCop ?? 0},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectDeliveryById(rows[0].id);
  if (!created) throw new Error("No se pudo registrar la entrega de EPP.");
  await syncComplianceRecord(created, userId);
  return (await selectDeliveryById(created.id)) ?? created;
}

export async function updateDelivery(
  id: string,
  draft: SstEppDeliveryDraft,
  userId: string,
): Promise<SstEppDelivery> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const catalog = await selectCatalogById(draft.catalogItemId);
  if (!catalog) {
    throw new Error("Ítem de catálogo EPP no encontrado.");
  }

  const usefulLifeDays =
    draft.usefulLifeDays > 0 ? Math.trunc(draft.usefulLifeDays) : catalog.usefulLifeDays;
  const nextDate = resolveNextReplenishmentDate({
    ...draft,
    usefulLifeDays,
  });

  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_epp_deliveries
    SET
      worker_id = ${draft.workerId},
      catalog_item_id = ${draft.catalogItemId},
      quantity = ${Math.trunc(draft.quantity)},
      size_label = ${draft.sizeLabel.trim()},
      delivery_date = ${draft.deliveryDate},
      useful_life_days = ${usefulLifeDays},
      next_replenishment_date = ${nextDate},
      reason = ${draft.reason},
      responsible_name = ${draft.responsibleName.trim()},
      evidence_url = ${draft.evidenceUrl.trim()},
      evidence_name = ${draft.evidenceName.trim()},
      observations = ${draft.observations.trim()},
      company_snapshot = ${worker.company},
      job_title_snapshot = ${worker.jobTitle},
      farm_id = ${worker.farmId},
      work_center_snapshot = ${worker.workCenter},
      unit_cost_cop = ${draft.unitCostCop ?? 0},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectDeliveryById(id);
  if (!updated) throw new Error("Entrega de EPP no encontrada.");
  await syncComplianceRecord(updated, userId);
  return (await selectDeliveryById(id)) ?? updated;
}

export async function deleteDelivery(id: string): Promise<void> {
  const current = await selectDeliveryById(id);
  if (!current) throw new Error("Entrega de EPP no encontrada.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_epp_deliveries WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
