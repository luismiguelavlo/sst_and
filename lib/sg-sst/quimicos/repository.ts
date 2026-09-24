import "server-only";

import { getSql } from "@/lib/db";
import {
  hasSafetySheet,
  isChemicalStatus,
  isChemicalTrainingStatus,
  isChemicalUnit,
  type ChemicalStats,
  type ChemicalStatus,
  type ChemicalTrainingStatus,
  type ChemicalUnit,
  type SstChemical,
  type SstChemicalDraft,
} from "@/lib/sg-sst/quimicos/types";

type ChemicalRow = {
  id: string;
  code: string;
  product_name: string;
  farm_id: string | null;
  farm_name: string | null;
  area: string;
  responsible_name: string;
  safety_sheet_url: string;
  safety_sheet_name: string;
  safety_sheet_updated_at: string | null;
  required_epp: string;
  storage_conditions: string;
  quantity: string | number;
  unit: string;
  last_inspection_at: string | null;
  next_inspection_at: string | null;
  inspection_notes: string;
  training_status: string;
  last_training_at: string | null;
  training_notes: string;
  status: string;
  observations: string;
  created_at: string;
  updated_at: string;
};

const SELECT_COLS = `
  c.id, c.code, c.product_name, c.farm_id, f.name AS farm_name,
  COALESCE(c.area, '') AS area,
  COALESCE(c.responsible_name, '') AS responsible_name,
  COALESCE(c.safety_sheet_url, '') AS safety_sheet_url,
  COALESCE(c.safety_sheet_name, '') AS safety_sheet_name,
  c.safety_sheet_updated_at::text,
  COALESCE(c.required_epp, '') AS required_epp,
  COALESCE(c.storage_conditions, '') AS storage_conditions,
  c.quantity, c.unit,
  c.last_inspection_at::text, c.next_inspection_at::text,
  COALESCE(c.inspection_notes, '') AS inspection_notes,
  c.training_status, c.last_training_at::text,
  COALESCE(c.training_notes, '') AS training_notes,
  c.status, COALESCE(c.observations, '') AS observations,
  c.created_at::text, c.updated_at::text
`;

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapChemical(row: ChemicalRow): SstChemical {
  if (!isChemicalUnit(row.unit)) throw new Error(`Unidad inválida: ${row.unit}`);
  if (!isChemicalStatus(row.status)) throw new Error(`Estado inválido: ${row.status}`);
  if (!isChemicalTrainingStatus(row.training_status)) {
    throw new Error(`Capacitación inválida: ${row.training_status}`);
  }
  return {
    id: row.id,
    code: row.code,
    productName: row.product_name,
    farmId: row.farm_id,
    farmName: row.farm_name,
    area: row.area,
    responsibleName: row.responsible_name,
    safetySheetUrl: row.safety_sheet_url,
    safetySheetName: row.safety_sheet_name,
    safetySheetUpdatedAt: row.safety_sheet_updated_at,
    requiredEpp: row.required_epp,
    storageConditions: row.storage_conditions,
    quantity: Number(row.quantity) || 0,
    unit: row.unit,
    lastInspectionAt: row.last_inspection_at,
    nextInspectionAt: row.next_inspection_at,
    inspectionNotes: row.inspection_notes,
    trainingStatus: row.training_status,
    lastTrainingAt: row.last_training_at,
    trainingNotes: row.training_notes,
    status: row.status,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function nextChemicalCode(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `QUI-${year}-`;
  const pattern = `^QUI-${year}-[0-9]+$`;
  const rows = await sql<{ n: number | null }[]>`
    SELECT COALESCE(
      MAX(NULLIF(substring(code from ${prefix + "([0-9]+)$"}), '')::int),
      0
    )::int AS n
    FROM campus_sst.sst_chemicals
    WHERE code ~ ${pattern}
  `;
  const next = (rows[0]?.n ?? 0) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String((error as { code?: unknown }).code) : "";
  return code === "23505";
}

export async function listChemicals(filters?: {
  status?: ChemicalStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstChemical[]> {
  const sql = getSql();
  const status = filters?.status && filters.status !== "all" ? filters.status : null;
  const farmId = filters?.farmId ?? null;
  const query = filters?.query?.trim() || null;

  const rows = await sql<ChemicalRow[]>`
    SELECT ${sql.unsafe(SELECT_COLS)}
    FROM campus_sst.sst_chemicals c
    LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
    WHERE (${status}::text IS NULL OR c.status = ${status})
      AND (${farmId}::uuid IS NULL OR c.farm_id = ${farmId}::uuid)
      AND (
        ${query}::text IS NULL
        OR c.product_name ILIKE ${"%" + (query ?? "") + "%"}
        OR c.code ILIKE ${"%" + (query ?? "") + "%"}
        OR c.responsible_name ILIKE ${"%" + (query ?? "") + "%"}
        OR c.area ILIKE ${"%" + (query ?? "") + "%"}
        OR COALESCE(f.name, '') ILIKE ${"%" + (query ?? "") + "%"}
      )
    ORDER BY c.product_name ASC, c.code ASC
  `;
  return rows.map(mapChemical);
}

export async function getChemical(id: string): Promise<SstChemical | null> {
  const sql = getSql();
  const rows = await sql<ChemicalRow[]>`
    SELECT ${sql.unsafe(SELECT_COLS)}
    FROM campus_sst.sst_chemicals c
    LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
    WHERE c.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapChemical(rows[0]) : null;
}

export async function findChemicalByCode(code: string): Promise<SstChemical | null> {
  const sql = getSql();
  const rows = await sql<ChemicalRow[]>`
    SELECT ${sql.unsafe(SELECT_COLS)}
    FROM campus_sst.sst_chemicals c
    LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
    WHERE lower(c.code) = lower(${code.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapChemical(rows[0]) : null;
}

export async function findChemicalByProductAndFarm(
  productName: string,
  farmId: string | null,
): Promise<SstChemical | null> {
  const sql = getSql();
  const name = productName.trim().toLowerCase();
  const rows = farmId
    ? await sql<ChemicalRow[]>`
        SELECT ${sql.unsafe(SELECT_COLS)}
        FROM campus_sst.sst_chemicals c
        LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
        WHERE lower(c.product_name) = ${name} AND c.farm_id = ${farmId}
        LIMIT 1
      `
    : await sql<ChemicalRow[]>`
        SELECT ${sql.unsafe(SELECT_COLS)}
        FROM campus_sst.sst_chemicals c
        LEFT JOIN campus_sst.sst_farms f ON f.id = c.farm_id
        WHERE lower(c.product_name) = ${name} AND c.farm_id IS NULL
        LIMIT 1
      `;
  return rows[0] ? mapChemical(rows[0]) : null;
}

export async function getChemicalStats(): Promise<ChemicalStats> {
  const items = await listChemicals();
  const today = new Date().toISOString().slice(0, 10);
  return {
    total: items.length,
    active: items.filter((item) => item.status === "activo").length,
    withoutSafetySheet: items.filter((item) => !hasSafetySheet(item)).length,
    inspectionDue: items.filter(
      (item) => item.nextInspectionAt && item.nextInspectionAt <= today,
    ).length,
    trainingPending: items.filter(
      (item) =>
        item.trainingStatus === "pendiente" || item.trainingStatus === "vencida",
    ).length,
  };
}

export async function createChemical(
  draft: SstChemicalDraft,
  userId: string,
): Promise<SstChemical> {
  const sql = getSql();
  let code = draft.code?.trim() || (await nextChemicalCode(sql));

  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const inserted = await sql<{ id: string }[]>`
        INSERT INTO campus_sst.sst_chemicals (
          code, product_name, farm_id, area, responsible_name,
          safety_sheet_url, safety_sheet_name, safety_sheet_updated_at,
          required_epp, storage_conditions, quantity, unit,
          last_inspection_at, next_inspection_at, inspection_notes,
          training_status, last_training_at, training_notes,
          status, observations, created_by, updated_by, updated_at
        ) VALUES (
          ${code},
          ${draft.productName.trim()},
          ${draft.farmId || null},
          ${draft.area.trim()},
          ${draft.responsibleName.trim()},
          ${draft.safetySheetUrl.trim()},
          ${draft.safetySheetName.trim()},
          ${emptyToNull(draft.safetySheetUpdatedAt)},
          ${draft.requiredEpp.trim()},
          ${draft.storageConditions.trim()},
          ${draft.quantity},
          ${draft.unit},
          ${emptyToNull(draft.lastInspectionAt)},
          ${emptyToNull(draft.nextInspectionAt)},
          ${draft.inspectionNotes.trim()},
          ${draft.trainingStatus},
          ${emptyToNull(draft.lastTrainingAt)},
          ${draft.trainingNotes.trim()},
          ${draft.status},
          ${draft.observations.trim()},
          ${userId},
          ${userId},
          now()
        )
        RETURNING id
      `;
      const created = await getChemical(inserted[0]!.id);
      if (!created) throw new Error("No se pudo crear el producto químico.");
      return created;
    } catch (caught) {
      if (isUniqueViolation(caught) && attempt < 5) {
        const message = caught instanceof Error ? caught.message.toLowerCase() : "";
        if (message.includes("product_name")) {
          throw new Error("Ya existe un producto con ese nombre en el centro.");
        }
        code = await nextChemicalCode(sql);
        continue;
      }
      throw caught;
    }
  }

  throw new Error("No se pudo asignar un código único al producto químico.");
}

export async function updateChemical(
  id: string,
  draft: SstChemicalDraft,
  userId: string,
): Promise<SstChemical> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_chemicals SET
      product_name = ${draft.productName.trim()},
      farm_id = ${draft.farmId || null},
      area = ${draft.area.trim()},
      responsible_name = ${draft.responsibleName.trim()},
      safety_sheet_url = ${draft.safetySheetUrl.trim()},
      safety_sheet_name = ${draft.safetySheetName.trim()},
      safety_sheet_updated_at = ${emptyToNull(draft.safetySheetUpdatedAt)},
      required_epp = ${draft.requiredEpp.trim()},
      storage_conditions = ${draft.storageConditions.trim()},
      quantity = ${draft.quantity},
      unit = ${draft.unit},
      last_inspection_at = ${emptyToNull(draft.lastInspectionAt)},
      next_inspection_at = ${emptyToNull(draft.nextInspectionAt)},
      inspection_notes = ${draft.inspectionNotes.trim()},
      training_status = ${draft.trainingStatus},
      last_training_at = ${emptyToNull(draft.lastTrainingAt)},
      training_notes = ${draft.trainingNotes.trim()},
      status = ${draft.status},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await getChemical(id);
  if (!updated) throw new Error("Producto químico no encontrado.");
  return updated;
}

export async function deleteChemical(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_chemicals WHERE id = ${id}`;
}

export type {
  ChemicalStatus,
  ChemicalTrainingStatus,
  ChemicalUnit,
};
