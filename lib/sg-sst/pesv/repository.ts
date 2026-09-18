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
  isAccidentCategory,
  isDocDueSoon,
  isIncidentCategory,
  isPesvAuthStatus,
  isPesvFitnessConcept,
  isPesvPreopStatus,
  isPesvVehicleStatus,
  nullishDate,
  resolveDriverAuthorization,
  type PesvStats,
  type SstPesvDriver,
  type SstPesvDriverDraft,
  type SstPesvPreop,
  type SstPesvPreopDraft,
  type SstPesvVehicle,
  type SstPesvVehicleDraft,
} from "@/lib/sg-sst/pesv/types";
import { getWorker } from "@/lib/sg-sst/workers/repository";

type VehicleRow = {
  id: string;
  plate: string;
  vehicle_type: string;
  brand: string;
  model: string;
  responsible_worker_id: string | null;
  responsible_name: string | null;
  responsible_document: string | null;
  work_center: string;
  farm_id: string | null;
  farm_name: string | null;
  status: string;
  soat_due_date: string | null;
  rtm_due_date: string | null;
  insurance_due_date: string | null;
  odometer_km: number;
  kit_ok: boolean;
  extinguisher_ok: boolean;
  observations: string;
  created_at: string;
  updated_at: string;
};

type DriverRow = {
  id: string;
  folio: string;
  worker_id: string;
  worker_code: string;
  worker_name: string;
  worker_document: string;
  worker_status: string;
  vehicle_id: string | null;
  vehicle_plate: string | null;
  vehicle_type: string;
  plate_snapshot: string;
  license_category: string;
  license_due_date: string | null;
  road_safety_course_date: string | null;
  road_safety_course_due: string | null;
  medical_exam_date: string | null;
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

type PreopRow = {
  id: string;
  folio: string;
  vehicle_id: string;
  vehicle_plate: string;
  vehicle_type: string;
  inspection_date: string;
  category: string;
  finding: string;
  status: string;
  odometer_km: number | null;
  evidence_url: string;
  created_at: string;
  updated_at: string;
};

function mapVehicle(row: VehicleRow): SstPesvVehicle {
  if (!isPesvVehicleStatus(row.status)) {
    throw new Error(`Estado de vehículo inválido: ${row.status}`);
  }
  return {
    id: row.id,
    plate: row.plate,
    vehicleType: row.vehicle_type,
    brand: row.brand,
    model: row.model,
    responsibleWorkerId: row.responsible_worker_id,
    responsibleName: row.responsible_name,
    responsibleDocument: row.responsible_document,
    workCenter: row.work_center,
    farmId: row.farm_id,
    farmName: row.farm_name,
    status: row.status,
    soatDueDate: row.soat_due_date,
    rtmDueDate: row.rtm_due_date,
    insuranceDueDate: row.insurance_due_date,
    odometerKm: row.odometer_km,
    kitOk: row.kit_ok,
    extinguisherOk: row.extinguisher_ok,
    observations: row.observations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDriver(row: DriverRow): SstPesvDriver {
  if (!isPesvFitnessConcept(row.fitness_concept)) {
    throw new Error(`Concepto de aptitud inválido: ${row.fitness_concept}`);
  }
  if (!isPesvAuthStatus(row.authorization_status)) {
    throw new Error(`Estado de autorización inválido: ${row.authorization_status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    workerId: row.worker_id,
    workerCode: row.worker_code,
    workerName: row.worker_name,
    workerDocument: row.worker_document,
    workerStatus: row.worker_status,
    vehicleId: row.vehicle_id,
    vehiclePlate: row.vehicle_plate,
    vehicleType: row.vehicle_type,
    plateSnapshot: row.plate_snapshot,
    licenseCategory: row.license_category,
    licenseDueDate: row.license_due_date,
    roadSafetyCourseDate: row.road_safety_course_date,
    roadSafetyCourseDue: row.road_safety_course_due,
    medicalExamDate: row.medical_exam_date,
    fitnessConcept: row.fitness_concept,
    authorizationStatus: row.authorization_status,
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

function mapPreop(row: PreopRow): SstPesvPreop {
  if (!isPesvPreopStatus(row.status)) {
    throw new Error(`Estado de preoperacional inválido: ${row.status}`);
  }
  return {
    id: row.id,
    folio: row.folio,
    vehicleId: row.vehicle_id,
    vehiclePlate: row.vehicle_plate,
    vehicleType: row.vehicle_type,
    inspectionDate: row.inspection_date,
    category: row.category,
    finding: row.finding,
    status: row.status,
    odometerKm: row.odometer_km,
    evidenceUrl: row.evidence_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const VEHICLE_SELECT = `
  v.id, v.plate, v.vehicle_type, v.brand, v.model,
  v.responsible_worker_id,
  rw.full_name AS responsible_name,
  rw.document_number AS responsible_document,
  v.work_center, v.farm_id, f.name AS farm_name,
  v.status, v.soat_due_date::text, v.rtm_due_date::text, v.insurance_due_date::text,
  v.odometer_km, v.kit_ok, v.extinguisher_ok, v.observations,
  v.created_at::text, v.updated_at::text
`;

const DRIVER_SELECT = `
  d.id, d.folio, d.worker_id,
  w.worker_code, w.full_name AS worker_name, w.document_number AS worker_document,
  w.status AS worker_status,
  d.vehicle_id, veh.plate AS vehicle_plate,
  d.vehicle_type, d.plate_snapshot, d.license_category,
  d.license_due_date::text, d.road_safety_course_date::text, d.road_safety_course_due::text,
  d.medical_exam_date::text, d.fitness_concept, d.authorization_status, d.observations,
  d.company_snapshot, d.job_title_snapshot, d.farm_id, f.name AS farm_name,
  d.compliance_record_id, d.created_at::text, d.updated_at::text
`;

const PREOP_SELECT = `
  p.id, p.folio, p.vehicle_id, v.plate AS vehicle_plate, v.vehicle_type,
  p.inspection_date::text, p.category, p.finding, p.status,
  p.odometer_km, p.evidence_url, p.created_at::text, p.updated_at::text
`;

async function selectVehicleById(id: string): Promise<SstPesvVehicle | null> {
  const sql = getSql();
  const rows = await sql<VehicleRow[]>`
    SELECT ${sql.unsafe(VEHICLE_SELECT)}
    FROM campus_sst.sst_pesv_vehicles v
    LEFT JOIN campus_sst.sst_workers rw ON rw.id = v.responsible_worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = v.farm_id
    WHERE v.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapVehicle(rows[0]) : null;
}

async function selectDriverById(id: string): Promise<SstPesvDriver | null> {
  const sql = getSql();
  const rows = await sql<DriverRow[]>`
    SELECT ${sql.unsafe(DRIVER_SELECT)}
    FROM campus_sst.sst_pesv_drivers d
    INNER JOIN campus_sst.sst_workers w ON w.id = d.worker_id
    LEFT JOIN campus_sst.sst_pesv_vehicles veh ON veh.id = d.vehicle_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = d.farm_id
    WHERE d.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapDriver(rows[0]) : null;
}

async function selectPreopById(id: string): Promise<SstPesvPreop | null> {
  const sql = getSql();
  const rows = await sql<PreopRow[]>`
    SELECT ${sql.unsafe(PREOP_SELECT)}
    FROM campus_sst.sst_pesv_preops p
    INNER JOIN campus_sst.sst_pesv_vehicles v ON v.id = p.vehicle_id
    WHERE p.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapPreop(rows[0]) : null;
}

async function nextDriverFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_pesv_drivers", "folio", `PESV-${year}-`);
}

async function nextPreopFolio(sql: ReturnType<typeof getSql>): Promise<string> {
  const year = new Date().getFullYear();
  return nextSequentialCode(sql, "campus_sst.sst_pesv_preops", "folio", `PRE-${year}-`);
}

function complianceDraftFromDriver(driver: SstPesvDriver): SstRecordDraft {
  const closed =
    driver.authorizationStatus === "no_autorizado" ||
    driver.authorizationStatus === "suspendido";
  return {
    recordType: "licencia",
    title: `Licencia PESV — ${driver.workerName}`,
    code: driver.folio,
    workerId: driver.workerId,
    subjectName: driver.workerName,
    subjectDocument: driver.workerDocument,
    subjectJobTitle: driver.jobTitleSnapshot,
    farmId: driver.farmId,
    dueDate: driver.licenseDueDate,
    issuedAt: driver.medicalExamDate ?? driver.roadSafetyCourseDate,
    workflowStatus: closed ? "closed" : "open",
    externalEntity: driver.licenseCategory
      ? `Cat. ${driver.licenseCategory}`
      : "PESV",
    notes: driver.observations.slice(0, 500),
  };
}

async function syncDriverCompliance(
  driver: SstPesvDriver,
  userId: string,
): Promise<void> {
  const draft = complianceDraftFromDriver(driver);
  const sql = getSql();
  if (driver.complianceRecordId) {
    await updateComplianceRecord(driver.complianceRecordId, draft, userId);
    return;
  }
  const existing = await findComplianceRecordByCode("licencia", driver.folio);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_pesv_drivers
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${driver.id}
    `;
    return;
  }
  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_pesv_drivers
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${driver.id}
  `;
}

async function resolvePlateSnapshot(
  draft: SstPesvDriverDraft,
): Promise<{ plateSnapshot: string; vehicleType: string }> {
  let plateSnapshot = draft.plateSnapshot.trim().toUpperCase();
  let vehicleType = draft.vehicleType.trim();
  if (draft.vehicleId) {
    const vehicle = await selectVehicleById(draft.vehicleId);
    if (vehicle) {
      plateSnapshot = plateSnapshot || vehicle.plate;
      vehicleType = vehicleType || vehicle.vehicleType;
    }
  }
  return { plateSnapshot, vehicleType };
}

/* ─── Vehicles ─────────────────────────────────────────────────────────── */

export async function listVehicles(filters?: {
  status?: string | "all";
  query?: string;
}): Promise<SstPesvVehicle[]> {
  const sql = getSql();
  const status =
    filters?.status && filters.status !== "all" ? filters.status : null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<VehicleRow[]>`
    SELECT ${sql.unsafe(VEHICLE_SELECT)}
    FROM campus_sst.sst_pesv_vehicles v
    LEFT JOIN campus_sst.sst_workers rw ON rw.id = v.responsible_worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = v.farm_id
    WHERE (${status}::text IS NULL OR v.status = ${status})
      AND (
        ${q}::text IS NULL
        OR lower(v.plate) LIKE ${q ? `%${q}%` : ""}
        OR lower(v.brand) LIKE ${q ? `%${q}%` : ""}
        OR lower(v.model) LIKE ${q ? `%${q}%` : ""}
        OR lower(v.vehicle_type) LIKE ${q ? `%${q}%` : ""}
        OR lower(v.work_center) LIKE ${q ? `%${q}%` : ""}
        OR lower(coalesce(rw.full_name, '')) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY v.plate ASC
  `;
  return rows.map(mapVehicle);
}

export async function getVehicle(id: string): Promise<SstPesvVehicle | null> {
  return selectVehicleById(id);
}

export async function findVehicleByPlate(
  plate: string,
): Promise<SstPesvVehicle | null> {
  const sql = getSql();
  const rows = await sql<VehicleRow[]>`
    SELECT ${sql.unsafe(VEHICLE_SELECT)}
    FROM campus_sst.sst_pesv_vehicles v
    LEFT JOIN campus_sst.sst_workers rw ON rw.id = v.responsible_worker_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = v.farm_id
    WHERE lower(v.plate) = lower(${plate.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapVehicle(rows[0]) : null;
}

export async function createVehicle(
  draft: SstPesvVehicleDraft,
  userId: string,
): Promise<SstPesvVehicle> {
  const sql = getSql();
  const plate = draft.plate.trim().toUpperCase();
  const existing = await findVehicleByPlate(plate);
  if (existing) {
    throw new Error(`Ya existe un vehículo con placa ${plate}.`);
  }
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_pesv_vehicles (
      plate, vehicle_type, brand, model, responsible_worker_id, work_center,
      farm_id, status, soat_due_date, rtm_due_date, insurance_due_date,
      odometer_km, kit_ok, extinguisher_ok, observations, created_by, updated_by
    ) VALUES (
      ${plate},
      ${draft.vehicleType.trim()},
      ${draft.brand.trim()},
      ${draft.model.trim()},
      ${draft.responsibleWorkerId || null},
      ${draft.workCenter.trim()},
      ${draft.farmId || null},
      ${draft.status},
      ${nullishDate(draft.soatDueDate)},
      ${nullishDate(draft.rtmDueDate)},
      ${nullishDate(draft.insuranceDueDate)},
      ${Math.max(0, Math.floor(draft.odometerKm))},
      ${draft.kitOk},
      ${draft.extinguisherOk},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectVehicleById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el vehículo.");
  return created;
}

export async function updateVehicle(
  id: string,
  draft: SstPesvVehicleDraft,
  userId: string,
): Promise<SstPesvVehicle> {
  const sql = getSql();
  const plate = draft.plate.trim().toUpperCase();
  const other = await findVehicleByPlate(plate);
  if (other && other.id !== id) {
    throw new Error(`Ya existe un vehículo con placa ${plate}.`);
  }
  await sql`
    UPDATE campus_sst.sst_pesv_vehicles
    SET
      plate = ${plate},
      vehicle_type = ${draft.vehicleType.trim()},
      brand = ${draft.brand.trim()},
      model = ${draft.model.trim()},
      responsible_worker_id = ${draft.responsibleWorkerId || null},
      work_center = ${draft.workCenter.trim()},
      farm_id = ${draft.farmId || null},
      status = ${draft.status},
      soat_due_date = ${nullishDate(draft.soatDueDate)},
      rtm_due_date = ${nullishDate(draft.rtmDueDate)},
      insurance_due_date = ${nullishDate(draft.insuranceDueDate)},
      odometer_km = ${Math.max(0, Math.floor(draft.odometerKm))},
      kit_ok = ${draft.kitOk},
      extinguisher_ok = ${draft.extinguisherOk},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectVehicleById(id);
  if (!updated) throw new Error("Vehículo no encontrado.");
  return updated;
}

export async function deleteVehicle(id: string): Promise<void> {
  const current = await selectVehicleById(id);
  if (!current) throw new Error("Vehículo no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_pesv_vehicles WHERE id = ${id}`;
}

/* ─── Drivers ──────────────────────────────────────────────────────────── */

export async function listDrivers(filters?: {
  authorizationStatus?: string | "all";
  query?: string;
}): Promise<SstPesvDriver[]> {
  const sql = getSql();
  const auth =
    filters?.authorizationStatus && filters.authorizationStatus !== "all"
      ? filters.authorizationStatus
      : null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<DriverRow[]>`
    SELECT ${sql.unsafe(DRIVER_SELECT)}
    FROM campus_sst.sst_pesv_drivers d
    INNER JOIN campus_sst.sst_workers w ON w.id = d.worker_id
    LEFT JOIN campus_sst.sst_pesv_vehicles veh ON veh.id = d.vehicle_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = d.farm_id
    WHERE (${auth}::text IS NULL OR d.authorization_status = ${auth})
      AND (
        ${q}::text IS NULL
        OR lower(w.full_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.document_number) LIKE ${q ? `%${q}%` : ""}
        OR lower(w.worker_code) LIKE ${q ? `%${q}%` : ""}
        OR lower(d.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(d.plate_snapshot) LIKE ${q ? `%${q}%` : ""}
        OR lower(coalesce(veh.plate, '')) LIKE ${q ? `%${q}%` : ""}
        OR lower(d.license_category) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY w.full_name ASC
  `;
  return rows.map(mapDriver);
}

export async function getDriver(id: string): Promise<SstPesvDriver | null> {
  return selectDriverById(id);
}

export async function findDriverByFolio(
  folio: string,
): Promise<SstPesvDriver | null> {
  const sql = getSql();
  const rows = await sql<DriverRow[]>`
    SELECT ${sql.unsafe(DRIVER_SELECT)}
    FROM campus_sst.sst_pesv_drivers d
    INNER JOIN campus_sst.sst_workers w ON w.id = d.worker_id
    LEFT JOIN campus_sst.sst_pesv_vehicles veh ON veh.id = d.vehicle_id
    LEFT JOIN campus_sst.sst_farms f ON f.id = d.farm_id
    WHERE lower(d.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapDriver(rows[0]) : null;
}

export async function createDriver(
  draft: SstPesvDriverDraft,
  userId: string,
): Promise<SstPesvDriver> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const folio = await nextDriverFolio(sql);
  const auth = resolveDriverAuthorization(draft);
  const { plateSnapshot, vehicleType } = await resolvePlateSnapshot(draft);

  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_pesv_drivers (
      folio, worker_id, vehicle_id, vehicle_type, plate_snapshot,
      license_category, license_due_date, road_safety_course_date,
      road_safety_course_due, medical_exam_date, fitness_concept,
      authorization_status, observations, company_snapshot, job_title_snapshot,
      farm_id, created_by, updated_by
    ) VALUES (
      ${folio},
      ${draft.workerId},
      ${draft.vehicleId || null},
      ${vehicleType},
      ${plateSnapshot},
      ${draft.licenseCategory.trim()},
      ${nullishDate(draft.licenseDueDate)},
      ${nullishDate(draft.roadSafetyCourseDate)},
      ${nullishDate(draft.roadSafetyCourseDue)},
      ${nullishDate(draft.medicalExamDate)},
      ${draft.fitnessConcept},
      ${auth},
      ${draft.observations.trim()},
      ${worker.company},
      ${worker.jobTitle},
      ${worker.farmId},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await selectDriverById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el conductor.");
  await syncDriverCompliance(created, userId);
  return (await selectDriverById(created.id)) ?? created;
}

export async function updateDriver(
  id: string,
  draft: SstPesvDriverDraft,
  userId: string,
): Promise<SstPesvDriver> {
  const worker = await getWorker(draft.workerId);
  if (!worker) {
    throw new Error("Trabajador no encontrado en la base maestra.");
  }
  const sql = getSql();
  const auth = resolveDriverAuthorization(draft);
  const { plateSnapshot, vehicleType } = await resolvePlateSnapshot(draft);

  await sql`
    UPDATE campus_sst.sst_pesv_drivers
    SET
      worker_id = ${draft.workerId},
      vehicle_id = ${draft.vehicleId || null},
      vehicle_type = ${vehicleType},
      plate_snapshot = ${plateSnapshot},
      license_category = ${draft.licenseCategory.trim()},
      license_due_date = ${nullishDate(draft.licenseDueDate)},
      road_safety_course_date = ${nullishDate(draft.roadSafetyCourseDate)},
      road_safety_course_due = ${nullishDate(draft.roadSafetyCourseDue)},
      medical_exam_date = ${nullishDate(draft.medicalExamDate)},
      fitness_concept = ${draft.fitnessConcept},
      authorization_status = ${auth},
      observations = ${draft.observations.trim()},
      company_snapshot = ${worker.company},
      job_title_snapshot = ${worker.jobTitle},
      farm_id = ${worker.farmId},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await selectDriverById(id);
  if (!updated) throw new Error("Conductor no encontrado.");
  await syncDriverCompliance(updated, userId);
  return (await selectDriverById(id)) ?? updated;
}

export async function deleteDriver(id: string): Promise<void> {
  const current = await selectDriverById(id);
  if (!current) throw new Error("Conductor no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_pesv_drivers WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}

/* ─── Preops ───────────────────────────────────────────────────────────── */

export async function listPreops(filters?: {
  status?: string | "all";
  query?: string;
}): Promise<SstPesvPreop[]> {
  const sql = getSql();
  const status =
    filters?.status && filters.status !== "all" ? filters.status : null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<PreopRow[]>`
    SELECT ${sql.unsafe(PREOP_SELECT)}
    FROM campus_sst.sst_pesv_preops p
    INNER JOIN campus_sst.sst_pesv_vehicles v ON v.id = p.vehicle_id
    WHERE (${status}::text IS NULL OR p.status = ${status})
      AND (
        ${q}::text IS NULL
        OR lower(p.folio) LIKE ${q ? `%${q}%` : ""}
        OR lower(v.plate) LIKE ${q ? `%${q}%` : ""}
        OR lower(p.category) LIKE ${q ? `%${q}%` : ""}
        OR lower(p.finding) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY p.inspection_date DESC, p.created_at DESC
  `;
  return rows.map(mapPreop);
}

export async function getPreop(id: string): Promise<SstPesvPreop | null> {
  return selectPreopById(id);
}

export async function findPreopByFolio(
  folio: string,
): Promise<SstPesvPreop | null> {
  const sql = getSql();
  const rows = await sql<PreopRow[]>`
    SELECT ${sql.unsafe(PREOP_SELECT)}
    FROM campus_sst.sst_pesv_preops p
    INNER JOIN campus_sst.sst_pesv_vehicles v ON v.id = p.vehicle_id
    WHERE lower(p.folio) = lower(${folio.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapPreop(rows[0]) : null;
}

export async function createPreop(
  draft: SstPesvPreopDraft,
  userId: string,
): Promise<SstPesvPreop> {
  const vehicle = await selectVehicleById(draft.vehicleId);
  if (!vehicle) {
    throw new Error("Vehículo no encontrado.");
  }
  const sql = getSql();
  const folio = await nextPreopFolio(sql);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_pesv_preops (
      folio, vehicle_id, inspection_date, category, finding, status,
      odometer_km, evidence_url, created_by
    ) VALUES (
      ${folio},
      ${draft.vehicleId},
      ${draft.inspectionDate},
      ${draft.category.trim()},
      ${draft.finding.trim()},
      ${draft.status},
      ${draft.odometerKm ?? null},
      ${draft.evidenceUrl.trim()},
      ${userId}
    )
    RETURNING id
  `;
  if (
    draft.odometerKm != null &&
    draft.odometerKm > vehicle.odometerKm
  ) {
    await sql`
      UPDATE campus_sst.sst_pesv_vehicles
      SET odometer_km = ${draft.odometerKm}, updated_at = now(), updated_by = ${userId}
      WHERE id = ${vehicle.id}
    `;
  }
  const created = await selectPreopById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el preoperacional.");
  return created;
}

export async function updatePreop(
  id: string,
  draft: SstPesvPreopDraft,
  userId: string,
): Promise<SstPesvPreop> {
  const vehicle = await selectVehicleById(draft.vehicleId);
  if (!vehicle) {
    throw new Error("Vehículo no encontrado.");
  }
  const sql = getSql();
  await sql`
    UPDATE campus_sst.sst_pesv_preops
    SET
      vehicle_id = ${draft.vehicleId},
      inspection_date = ${draft.inspectionDate},
      category = ${draft.category.trim()},
      finding = ${draft.finding.trim()},
      status = ${draft.status},
      odometer_km = ${draft.odometerKm ?? null},
      evidence_url = ${draft.evidenceUrl.trim()},
      updated_at = now()
    WHERE id = ${id}
  `;
  if (
    draft.odometerKm != null &&
    draft.odometerKm > vehicle.odometerKm
  ) {
    await sql`
      UPDATE campus_sst.sst_pesv_vehicles
      SET odometer_km = ${draft.odometerKm}, updated_at = now(), updated_by = ${userId}
      WHERE id = ${vehicle.id}
    `;
  }
  const updated = await selectPreopById(id);
  if (!updated) throw new Error("Preoperacional no encontrado.");
  return updated;
}

export async function deletePreop(id: string): Promise<void> {
  const current = await selectPreopById(id);
  if (!current) throw new Error("Preoperacional no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_pesv_preops WHERE id = ${id}`;
}

/* ─── Stats ────────────────────────────────────────────────────────────── */

export async function getPesvStats(): Promise<PesvStats> {
  const [drivers, vehicles, preops] = await Promise.all([
    listDrivers(),
    listVehicles(),
    listPreops(),
  ]);

  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffIso = cutoff.toISOString().slice(0, 10);

  const preopsLast30d = preops.filter(
    (p) => p.inspectionDate >= cutoffIso,
  ).length;
  const vehicleCount = vehicles.length;
  const preopsPct =
    vehicleCount > 0
      ? Math.round((preopsLast30d / vehicleCount) * 1000) / 10
      : 0;

  const driversAuthorized = drivers.filter(
    (d) =>
      d.authorizationStatus === "autorizado" ||
      d.authorizationStatus === "por_vencer",
  ).length;

  const vehiclesAptos = vehicles.filter((v) => v.status === "apto").length;

  let docsDueSoon = 0;
  for (const v of vehicles) {
    if (isDocDueSoon(v.soatDueDate, today)) docsDueSoon += 1;
    if (isDocDueSoon(v.rtmDueDate, today)) docsDueSoon += 1;
    if (isDocDueSoon(v.insuranceDueDate, today)) docsDueSoon += 1;
  }
  for (const d of drivers) {
    if (isDocDueSoon(d.licenseDueDate, today)) docsDueSoon += 1;
  }

  const openFindings = preops.filter(
    (p) => p.status === "abierto" || p.status === "programado",
  ).length;

  const totalKm = vehicles.reduce((sum, v) => sum + v.odometerKm, 0);

  const accidents = preops.filter((p) => isAccidentCategory(p.category)).length;
  const incidents = preops.filter(
    (p) => p.status === "detenido" || isIncidentCategory(p.category),
  ).length;

  return {
    preopsPct,
    preopsLast30d,
    vehicleCount,
    driversAuthorized,
    driversTotal: drivers.length,
    vehiclesAptos,
    docsDueSoon,
    openFindings,
    totalKm,
    incidents,
    accidents,
  };
}
