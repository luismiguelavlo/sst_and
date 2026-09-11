import "server-only";

import { getSql } from "@/lib/db";
import {
  isDocumentType,
  isRiskLevel,
  isWorkerStatus,
  type DocumentType,
  type RiskLevel,
  type SstWorker,
  type SstWorkerDraft,
  type WorkerStats,
  type WorkerStatus,
} from "@/lib/sg-sst/workers/types";

type WorkerRow = {
  id: string;
  worker_code: string;
  full_name: string;
  document_type: string;
  document_number: string;
  company: string;
  job_title: string;
  area: string;
  work_center: string;
  farm_id: string | null;
  farm_name: string | null;
  supervisor_name: string;
  hire_date: string | null;
  contract_type: string;
  status: string;
  risk_level: number;
  works_heights: boolean;
  drives: boolean;
  operates_tractor: boolean;
  handles_chemicals: boolean;
  in_brigade: boolean;
  in_copasst: boolean;
  in_ccl: boolean;
  phone: string;
  email: string;
  observations: string;
  retirement_date: string | null;
  retirement_reason: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

function mapWorker(row: WorkerRow): SstWorker {
  if (!isDocumentType(row.document_type)) {
    throw new Error(`Tipo de documento inválido: ${row.document_type}`);
  }
  if (!isWorkerStatus(row.status)) {
    throw new Error(`Estado inválido: ${row.status}`);
  }
  if (!isRiskLevel(row.risk_level)) {
    throw new Error(`Nivel de riesgo inválido: ${row.risk_level}`);
  }
  return {
    id: row.id,
    workerCode: row.worker_code,
    fullName: row.full_name,
    documentType: row.document_type,
    documentNumber: row.document_number,
    company: row.company,
    jobTitle: row.job_title,
    area: row.area,
    workCenter: row.work_center,
    farmId: row.farm_id,
    farmName: row.farm_name,
    supervisorName: row.supervisor_name,
    hireDate: row.hire_date,
    contractType: row.contract_type,
    status: row.status,
    riskLevel: row.risk_level,
    worksHeights: row.works_heights,
    drives: row.drives,
    operatesTractor: row.operates_tractor,
    handlesChemicals: row.handles_chemicals,
    inBrigade: row.in_brigade,
    inCopasst: row.in_copasst,
    inCcl: row.in_ccl,
    phone: row.phone,
    email: row.email,
    observations: row.observations,
    retirementDate: row.retirement_date,
    retirementReason: row.retirement_reason,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function nextWorkerCode(sql: ReturnType<typeof getSql>): Promise<string> {
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count FROM campus_sst.sst_workers
  `;
  const next = (rows[0]?.count ?? 0) + 1;
  return `MNZ-${String(next).padStart(4, "0")}`;
}

export async function listWorkers(filters?: {
  status?: WorkerStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<SstWorker[]> {
  const sql = getSql();
  const status = filters?.status && filters.status !== "all" ? filters.status : null;
  const farmId = filters?.farmId ?? null;
  const query = filters?.query?.trim() || null;

  const rows = await sql<WorkerRow[]>`
    SELECT
      w.id,
      w.worker_code,
      w.full_name,
      w.document_type,
      w.document_number,
      w.company,
      w.job_title,
      w.area,
      w.work_center,
      w.farm_id,
      f.name AS farm_name,
      w.supervisor_name,
      w.hire_date::text,
      w.contract_type,
      w.status,
      w.risk_level,
      w.works_heights,
      w.drives,
      w.operates_tractor,
      w.handles_chemicals,
      w.in_brigade,
      w.in_copasst,
      w.in_ccl,
      w.phone,
      w.email,
      w.observations,
      w.retirement_date::text,
      w.retirement_reason,
      w.user_id,
      w.created_at::text,
      w.updated_at::text
    FROM campus_sst.sst_workers w
    LEFT JOIN campus_sst.sst_farms f ON f.id = w.farm_id
    WHERE (${status}::text IS NULL OR w.status = ${status})
      AND (${farmId}::uuid IS NULL OR w.farm_id = ${farmId})
      AND (
        ${query}::text IS NULL
        OR w.full_name ILIKE ${"%" + (query ?? "") + "%"}
        OR w.document_number ILIKE ${"%" + (query ?? "") + "%"}
        OR w.worker_code ILIKE ${"%" + (query ?? "") + "%"}
        OR w.job_title ILIKE ${"%" + (query ?? "") + "%"}
        OR COALESCE(f.name, '') ILIKE ${"%" + (query ?? "") + "%"}
      )
    ORDER BY
      CASE WHEN w.status = 'activo' THEN 0 ELSE 1 END,
      w.full_name ASC
  `;
  return rows.map(mapWorker);
}

export async function listActiveWorkersForSelect(): Promise<SstWorker[]> {
  return listWorkers({ status: "activo" });
}

export async function getWorker(id: string): Promise<SstWorker | null> {
  const sql = getSql();
  const rows = await sql<WorkerRow[]>`
    SELECT
      w.id, w.worker_code, w.full_name, w.document_type, w.document_number,
      w.company, w.job_title, w.area, w.work_center, w.farm_id, f.name AS farm_name,
      w.supervisor_name, w.hire_date::text, w.contract_type, w.status, w.risk_level,
      w.works_heights, w.drives, w.operates_tractor, w.handles_chemicals,
      w.in_brigade, w.in_copasst, w.in_ccl, w.phone, w.email, w.observations,
      w.retirement_date::text, w.retirement_reason, w.user_id,
      w.created_at::text, w.updated_at::text
    FROM campus_sst.sst_workers w
    LEFT JOIN campus_sst.sst_farms f ON f.id = w.farm_id
    WHERE w.id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapWorker(rows[0]) : null;
}

export async function findWorkerByDocument(
  documentType: DocumentType,
  documentNumber: string,
): Promise<SstWorker | null> {
  const sql = getSql();
  const rows = await sql<WorkerRow[]>`
    SELECT
      w.id, w.worker_code, w.full_name, w.document_type, w.document_number,
      w.company, w.job_title, w.area, w.work_center, w.farm_id, f.name AS farm_name,
      w.supervisor_name, w.hire_date::text, w.contract_type, w.status, w.risk_level,
      w.works_heights, w.drives, w.operates_tractor, w.handles_chemicals,
      w.in_brigade, w.in_copasst, w.in_ccl, w.phone, w.email, w.observations,
      w.retirement_date::text, w.retirement_reason, w.user_id,
      w.created_at::text, w.updated_at::text
    FROM campus_sst.sst_workers w
    LEFT JOIN campus_sst.sst_farms f ON f.id = w.farm_id
    WHERE w.document_type = ${documentType}
      AND lower(w.document_number) = lower(${documentNumber.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapWorker(rows[0]) : null;
}

/** Match by document digits only (Excel / compliance import). */
export async function findWorkerByDocumentNumber(
  documentNumber: string,
): Promise<SstWorker | null> {
  const sql = getSql();
  const needle = documentNumber.replace(/\D/g, "");
  if (!needle) return null;
  const rows = await sql<WorkerRow[]>`
    SELECT
      w.id, w.worker_code, w.full_name, w.document_type, w.document_number,
      w.company, w.job_title, w.area, w.work_center, w.farm_id, f.name AS farm_name,
      w.supervisor_name, w.hire_date::text, w.contract_type, w.status, w.risk_level,
      w.works_heights, w.drives, w.operates_tractor, w.handles_chemicals,
      w.in_brigade, w.in_copasst, w.in_ccl, w.phone, w.email, w.observations,
      w.retirement_date::text, w.retirement_reason, w.user_id,
      w.created_at::text, w.updated_at::text
    FROM campus_sst.sst_workers w
    LEFT JOIN campus_sst.sst_farms f ON f.id = w.farm_id
    WHERE regexp_replace(w.document_number, '[^0-9]', '', 'g') = ${needle}
    ORDER BY CASE WHEN w.status = 'activo' THEN 0 ELSE 1 END
    LIMIT 1
  `;
  return rows[0] ? mapWorker(rows[0]) : null;
}

export async function findWorkerByCode(workerCode: string): Promise<SstWorker | null> {
  const sql = getSql();
  const rows = await sql<WorkerRow[]>`
    SELECT
      w.id, w.worker_code, w.full_name, w.document_type, w.document_number,
      w.company, w.job_title, w.area, w.work_center, w.farm_id, f.name AS farm_name,
      w.supervisor_name, w.hire_date::text, w.contract_type, w.status, w.risk_level,
      w.works_heights, w.drives, w.operates_tractor, w.handles_chemicals,
      w.in_brigade, w.in_copasst, w.in_ccl, w.phone, w.email, w.observations,
      w.retirement_date::text, w.retirement_reason, w.user_id,
      w.created_at::text, w.updated_at::text
    FROM campus_sst.sst_workers w
    LEFT JOIN campus_sst.sst_farms f ON f.id = w.farm_id
    WHERE lower(w.worker_code) = lower(${workerCode.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapWorker(rows[0]) : null;
}

export async function getWorkerStats(): Promise<WorkerStats> {
  const sql = getSql();
  const rows = await sql<
    {
      total: number;
      active: number;
      retired: number;
      heights: number;
      drivers_or_tractor: number;
      chemicals: number;
      brigade: number;
      copasst: number;
      ccl: number;
    }[]
  >`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'activo')::int AS active,
      COUNT(*) FILTER (WHERE status = 'retirado')::int AS retired,
      COUNT(*) FILTER (WHERE status = 'activo' AND works_heights)::int AS heights,
      COUNT(*) FILTER (WHERE status = 'activo' AND (drives OR operates_tractor))::int AS drivers_or_tractor,
      COUNT(*) FILTER (WHERE status = 'activo' AND handles_chemicals)::int AS chemicals,
      COUNT(*) FILTER (WHERE status = 'activo' AND in_brigade)::int AS brigade,
      COUNT(*) FILTER (WHERE status = 'activo' AND in_copasst)::int AS copasst,
      COUNT(*) FILTER (WHERE status = 'activo' AND in_ccl)::int AS ccl
    FROM campus_sst.sst_workers
  `;
  const row = rows[0];
  return {
    total: row?.total ?? 0,
    active: row?.active ?? 0,
    retired: row?.retired ?? 0,
    heights: row?.heights ?? 0,
    driversOrTractor: row?.drivers_or_tractor ?? 0,
    chemicals: row?.chemicals ?? 0,
    brigade: row?.brigade ?? 0,
    copasst: row?.copasst ?? 0,
    ccl: row?.ccl ?? 0,
  };
}

export async function createWorker(
  draft: SstWorkerDraft,
  userId: string,
): Promise<SstWorker> {
  const sql = getSql();
  const code = draft.workerCode?.trim() || (await nextWorkerCode(sql));
  const retired = draft.status === "retirado";
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_workers (
      worker_code, full_name, document_type, document_number, company, job_title,
      area, work_center, farm_id, supervisor_name, hire_date, contract_type, status,
      risk_level, works_heights, drives, operates_tractor, handles_chemicals,
      in_brigade, in_copasst, in_ccl, phone, email, observations,
      retirement_date, retirement_reason, created_by, updated_by
    ) VALUES (
      ${code},
      ${draft.fullName.trim()},
      ${draft.documentType},
      ${draft.documentNumber.trim()},
      ${draft.company.trim()},
      ${draft.jobTitle.trim()},
      ${draft.area.trim()},
      ${draft.workCenter.trim()},
      ${draft.farmId || null},
      ${draft.supervisorName.trim()},
      ${draft.hireDate || null},
      ${draft.contractType.trim()},
      ${draft.status},
      ${draft.riskLevel},
      ${draft.worksHeights},
      ${draft.drives},
      ${draft.operatesTractor},
      ${draft.handlesChemicals},
      ${draft.inBrigade},
      ${draft.inCopasst},
      ${draft.inCcl},
      ${draft.phone.trim()},
      ${draft.email.trim()},
      ${draft.observations.trim()},
      ${retired ? draft.retirementDate || null : null},
      ${retired ? draft.retirementReason?.trim() || null : null},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;
  const created = await getWorker(rows[0].id);
  if (!created) {
    throw new Error("No se pudo crear el trabajador.");
  }
  return created;
}

export async function updateWorker(
  id: string,
  draft: SstWorkerDraft,
  userId: string,
): Promise<SstWorker> {
  const sql = getSql();
  const retired = draft.status === "retirado";
  await sql`
    UPDATE campus_sst.sst_workers
    SET
      full_name = ${draft.fullName.trim()},
      document_type = ${draft.documentType},
      document_number = ${draft.documentNumber.trim()},
      company = ${draft.company.trim()},
      job_title = ${draft.jobTitle.trim()},
      area = ${draft.area.trim()},
      work_center = ${draft.workCenter.trim()},
      farm_id = ${draft.farmId || null},
      supervisor_name = ${draft.supervisorName.trim()},
      hire_date = ${draft.hireDate || null},
      contract_type = ${draft.contractType.trim()},
      status = ${draft.status},
      risk_level = ${draft.riskLevel},
      works_heights = ${draft.worksHeights},
      drives = ${draft.drives},
      operates_tractor = ${draft.operatesTractor},
      handles_chemicals = ${draft.handlesChemicals},
      in_brigade = ${draft.inBrigade},
      in_copasst = ${draft.inCopasst},
      in_ccl = ${draft.inCcl},
      phone = ${draft.phone.trim()},
      email = ${draft.email.trim()},
      observations = ${draft.observations.trim()},
      retirement_date = ${retired ? draft.retirementDate || null : null},
      retirement_reason = ${retired ? draft.retirementReason?.trim() || null : null},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;
  const updated = await getWorker(id);
  if (!updated) {
    throw new Error("Trabajador no encontrado.");
  }
  return updated;
}

export async function retireWorker(
  id: string,
  retirementDate: string,
  retirementReason: string,
  userId: string,
): Promise<SstWorker> {
  const current = await getWorker(id);
  if (!current) {
    throw new Error("Trabajador no encontrado.");
  }
  return updateWorker(
    id,
    {
      fullName: current.fullName,
      documentType: current.documentType,
      documentNumber: current.documentNumber,
      company: current.company,
      jobTitle: current.jobTitle,
      area: current.area,
      workCenter: current.workCenter,
      farmId: current.farmId,
      supervisorName: current.supervisorName,
      hireDate: current.hireDate,
      contractType: current.contractType,
      status: "retirado",
      riskLevel: current.riskLevel,
      worksHeights: current.worksHeights,
      drives: current.drives,
      operatesTractor: current.operatesTractor,
      handlesChemicals: current.handlesChemicals,
      inBrigade: current.inBrigade,
      inCopasst: current.inCopasst,
      inCcl: current.inCcl,
      phone: current.phone,
      email: current.email,
      observations: current.observations,
      retirementDate,
      retirementReason,
    },
    userId,
  );
}
