import "server-only";

import { getSql } from "@/lib/db";
import {
  normalizeFarmCode,
  type FarmStats,
  type SstFarmDraft,
  type SstFarmRecord,
} from "@/lib/sg-sst/fincas/types";

type FarmAdminRow = {
  id: string;
  name: string;
  code: string;
  company: string;
  municipality: string;
  address: string;
  observations: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  workers_count: number;
  records_count: number;
};

function mapFarm(row: FarmAdminRow): SstFarmRecord {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    company: row.company,
    municipality: row.municipality,
    address: row.address,
    observations: row.observations,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    workersCount: Number(row.workers_count) || 0,
    recordsCount: Number(row.records_count) || 0,
  };
}

const FARM_SELECT = `
  f.id, f.name, f.code,
  COALESCE(f.company, '') AS company,
  COALESCE(f.municipality, '') AS municipality,
  COALESCE(f.address, '') AS address,
  COALESCE(f.observations, '') AS observations,
  f.active, f.created_at::text,
  COALESCE(f.updated_at, f.created_at)::text AS updated_at,
  (
    SELECT COUNT(*)::int FROM campus_sst.sst_workers w WHERE w.farm_id = f.id
  ) AS workers_count,
  (
    SELECT COUNT(*)::int FROM campus_sst.sst_compliance_records r WHERE r.farm_id = f.id
  ) AS records_count
`;

async function selectFarmById(id: string): Promise<SstFarmRecord | null> {
  const sql = getSql();
  const rows = await sql<FarmAdminRow[]>`
    SELECT ${sql.unsafe(FARM_SELECT)}
    FROM campus_sst.sst_farms f
    WHERE f.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapFarm(rows[0]) : null;
}

export async function listFarmRecords(options?: {
  includeInactive?: boolean;
}): Promise<SstFarmRecord[]> {
  const sql = getSql();
  const includeInactive = options?.includeInactive ?? true;
  const rows = includeInactive
    ? await sql<FarmAdminRow[]>`
        SELECT ${sql.unsafe(FARM_SELECT)}
        FROM campus_sst.sst_farms f
        ORDER BY f.active DESC, f.name ASC
      `
    : await sql<FarmAdminRow[]>`
        SELECT ${sql.unsafe(FARM_SELECT)}
        FROM campus_sst.sst_farms f
        WHERE f.active = true
        ORDER BY f.name ASC
      `;
  return rows.map(mapFarm);
}

export async function getFarmStats(): Promise<FarmStats> {
  const farms = await listFarmRecords({ includeInactive: true });
  return {
    total: farms.length,
    active: farms.filter((f) => f.active).length,
    inactive: farms.filter((f) => !f.active).length,
    withWorkers: farms.filter((f) => f.workersCount > 0).length,
  };
}

export async function findFarmByCode(code: string): Promise<SstFarmRecord | null> {
  const sql = getSql();
  const normalized = normalizeFarmCode(code);
  if (!normalized) return null;
  const rows = await sql<FarmAdminRow[]>`
    SELECT ${sql.unsafe(FARM_SELECT)}
    FROM campus_sst.sst_farms f
    WHERE UPPER(f.code) = ${normalized}
    LIMIT 1
  `;
  return rows[0] ? mapFarm(rows[0]) : null;
}

export async function findFarmByName(name: string): Promise<SstFarmRecord | null> {
  const sql = getSql();
  const normalized = name.trim().toLowerCase();
  if (!normalized) return null;
  const rows = await sql<FarmAdminRow[]>`
    SELECT ${sql.unsafe(FARM_SELECT)}
    FROM campus_sst.sst_farms f
    WHERE LOWER(f.name) = ${normalized}
    LIMIT 1
  `;
  return rows[0] ? mapFarm(rows[0]) : null;
}

export async function createFarm(draft: SstFarmDraft): Promise<SstFarmRecord> {
  const sql = getSql();
  const code = normalizeFarmCode(draft.code);
  const name = draft.name.trim();

  const dup = await sql<{ id: string }[]>`
    SELECT id FROM campus_sst.sst_farms
    WHERE UPPER(code) = ${code} OR LOWER(name) = ${name.toLowerCase()}
    LIMIT 1
  `;
  if (dup[0]) {
    throw new Error("Ya existe un centro con ese código o nombre.");
  }

  const inserted = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_farms (
      name, code, company, municipality, address, observations, active, updated_at
    ) VALUES (
      ${name},
      ${code},
      ${draft.company.trim()},
      ${draft.municipality.trim()},
      ${draft.address.trim()},
      ${draft.observations.trim()},
      ${draft.active},
      now()
    )
    RETURNING id
  `;
  const created = await selectFarmById(inserted[0]!.id);
  if (!created) throw new Error("No se pudo crear el centro de trabajo.");
  return created;
}

export async function updateFarm(
  id: string,
  draft: SstFarmDraft,
): Promise<SstFarmRecord> {
  const sql = getSql();
  const code = normalizeFarmCode(draft.code);
  const name = draft.name.trim();

  const dup = await sql<{ id: string }[]>`
    SELECT id FROM campus_sst.sst_farms
    WHERE id <> ${id}
      AND (UPPER(code) = ${code} OR LOWER(name) = ${name.toLowerCase()})
    LIMIT 1
  `;
  if (dup[0]) {
    throw new Error("Ya existe otro centro con ese código o nombre.");
  }

  await sql`
    UPDATE campus_sst.sst_farms
    SET
      name = ${name},
      code = ${code},
      company = ${draft.company.trim()},
      municipality = ${draft.municipality.trim()},
      address = ${draft.address.trim()},
      observations = ${draft.observations.trim()},
      active = ${draft.active},
      updated_at = now()
    WHERE id = ${id}
  `;

  const updated = await selectFarmById(id);
  if (!updated) throw new Error("Centro de trabajo no encontrado.");
  return updated;
}

export async function setFarmActive(
  id: string,
  active: boolean,
): Promise<SstFarmRecord> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_farms
    SET active = ${active}, updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectFarmById(id);
  if (!updated) throw new Error("Centro de trabajo no encontrado.");
  return updated;
}

/**
 * Elimina solo si no hay trabajadores ni registros de cumplimiento.
 * Si hay vínculos, desactiva (soft-delete) para no romper historial.
 */
export async function deleteFarm(id: string): Promise<"deleted" | "deactivated"> {
  const farm = await selectFarmById(id);
  if (!farm) throw new Error("Centro de trabajo no encontrado.");

  if (farm.workersCount > 0 || farm.recordsCount > 0) {
    await setFarmActive(id, false);
    return "deactivated";
  }

  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_farms WHERE id = ${id}`;
  return "deleted";
}
