import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("Define DATABASE_URL antes de correr este script.");
}

const sql = postgres(url, {
  max: 1,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
});

try {
  await sql.unsafe(readFileSync(join(root, "db/migrate-sst-workers.sql"), "utf8"));

  const farms = await sql`SELECT id, code FROM campus_sst.sst_farms`;
  const farmId = Object.fromEntries(farms.map((row) => [row.code, row.id]));

  const existing = await sql`SELECT COUNT(*)::int AS count FROM campus_sst.sst_workers`;
  if ((existing[0]?.count ?? 0) === 0) {
    const seeds = [
      {
        worker_code: "MNZ-0001",
        full_name: "Carlos Alberto Restrepo Gómez",
        document_type: "CC",
        document_number: "1088294102",
        company: "Grupo Manzanares S.A.S.",
        job_title: "Operador de Cosecha y Poda de Altura",
        area: "Campo y Producción Agrícola",
        work_center: "Sede Rural Occidente (Valle Central)",
        farm_id: farmId.esperanza ?? null,
        supervisor_name: "Luis Fernando Mejía",
        hire_date: "2019-03-12",
        contract_type: "Término Indefinido",
        status: "activo",
        risk_level: 5,
        works_heights: true,
        drives: false,
        operates_tractor: false,
        handles_chemicals: false,
        in_brigade: true,
        in_copasst: false,
        in_ccl: false,
        phone: "3127894561",
        email: "carlos.restrepo@manzanares.co",
        observations: "Recertificación alturas prioritaria.",
      },
      {
        worker_code: "MNZ-0002",
        full_name: "Marta Liliana Gómez",
        document_type: "CC",
        document_number: "42883912",
        company: "Grupo Manzanares S.A.S.",
        job_title: "Manipuladora de Agroquímicos",
        area: "Campo y Producción Agrícola",
        work_center: "Sede Rural Occidente (Valle Central)",
        farm_id: farmId.sanjose ?? null,
        supervisor_name: "Luis Fernando Mejía",
        hire_date: "2021-07-01",
        contract_type: "Obra o Labor Agrícola",
        status: "activo",
        risk_level: 4,
        works_heights: false,
        drives: false,
        operates_tractor: false,
        handles_chemicals: true,
        in_brigade: false,
        in_copasst: true,
        in_ccl: false,
        phone: "3001122334",
        email: "marta.gomez@manzanares.co",
        observations: "Seguimiento colinesterasa.",
      },
      {
        worker_code: "MNZ-0003",
        full_name: "José Manuel Aristizábal",
        document_type: "CC",
        document_number: "71234567",
        company: "Agro-Logística del Valle S.A.S.",
        job_title: "Tractorista / Operador",
        area: "Mantenimiento y Maquinaria Pesada",
        work_center: "Sede Planta San Jerónimo",
        farm_id: farmId.paraiso ?? null,
        supervisor_name: "Diana Patricia Ríos",
        hire_date: "2018-01-20",
        contract_type: "Término Indefinido",
        status: "activo",
        risk_level: 4,
        works_heights: false,
        drives: true,
        operates_tractor: true,
        handles_chemicals: false,
        in_brigade: true,
        in_copasst: false,
        in_ccl: true,
        phone: "3159988776",
        email: "jose.aristizabal@manzanares.co",
        observations: "Licencia C2 vigente.",
      },
      {
        worker_code: "MNZ-0004",
        full_name: "Ana Sofía Cardona",
        document_type: "CC",
        document_number: "43998877",
        company: "Grupo Manzanares S.A.S.",
        job_title: "Auxiliar Administrativa SST",
        area: "Administrativa y Financiera",
        work_center: "Sede Principal Manzanares",
        farm_id: farmId.bellavista ?? null,
        supervisor_name: "Ing. Andrés Valencia",
        hire_date: "2020-11-05",
        contract_type: "Término Fijo (Renovable)",
        status: "activo",
        risk_level: 2,
        works_heights: false,
        drives: true,
        operates_tractor: false,
        handles_chemicals: false,
        in_brigade: false,
        in_copasst: true,
        in_ccl: false,
        phone: "3104455667",
        email: "ana.cardona@manzanares.co",
        observations: "",
      },
      {
        worker_code: "MNZ-0005",
        full_name: "Pedro Nel Quintero",
        document_type: "CC",
        document_number: "70554433",
        company: "Servicios Especializados de Campo",
        job_title: "Cuadrillero",
        area: "Campo y Producción Agrícola",
        work_center: "Sede Rural Occidente (Valle Central)",
        farm_id: farmId.esperanza ?? null,
        supervisor_name: "Luis Fernando Mejía",
        hire_date: "2016-05-10",
        contract_type: "Término Indefinido",
        status: "retirado",
        risk_level: 4,
        works_heights: true,
        drives: false,
        operates_tractor: false,
        handles_chemicals: false,
        in_brigade: false,
        in_copasst: false,
        in_ccl: false,
        phone: "3120001112",
        email: "",
        observations: "Historial custodiado — retiro por pensión.",
        retirement_date: "2025-12-15",
        retirement_reason: "Pensión vejez",
      },
    ];

    for (const seed of seeds) {
      await sql`
        INSERT INTO campus_sst.sst_workers (
          worker_code, full_name, document_type, document_number, company, job_title,
          area, work_center, farm_id, supervisor_name, hire_date, contract_type, status,
          risk_level, works_heights, drives, operates_tractor, handles_chemicals,
          in_brigade, in_copasst, in_ccl, phone, email, observations,
          retirement_date, retirement_reason
        ) VALUES (
          ${seed.worker_code},
          ${seed.full_name},
          ${seed.document_type},
          ${seed.document_number},
          ${seed.company},
          ${seed.job_title},
          ${seed.area},
          ${seed.work_center},
          ${seed.farm_id},
          ${seed.supervisor_name},
          ${seed.hire_date},
          ${seed.contract_type},
          ${seed.status},
          ${seed.risk_level},
          ${seed.works_heights},
          ${seed.drives},
          ${seed.operates_tractor},
          ${seed.handles_chemicals},
          ${seed.in_brigade},
          ${seed.in_copasst},
          ${seed.in_ccl},
          ${seed.phone},
          ${seed.email},
          ${seed.observations},
          ${seed.retirement_date ?? null},
          ${seed.retirement_reason ?? null}
        )
        ON CONFLICT (document_type, document_number) DO NOTHING
      `;
    }

    // Link demo compliance rows to master workers by document when possible
    await sql`
      UPDATE campus_sst.sst_compliance_records r
      SET worker_id = w.id
      FROM campus_sst.sst_workers w
      WHERE r.worker_id IS NULL
        AND r.subject_document IS NOT NULL
        AND regexp_replace(r.subject_document, '[^0-9]', '', 'g') =
            regexp_replace(w.document_number, '[^0-9]', '', 'g')
    `;
  }

  console.log("Migración sst_workers OK.");
} finally {
  await sql.end({ timeout: 5 });
}
