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

const iso = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

try {
  await sql.unsafe(readFileSync(join(root, "db/migrate-sst-operativos.sql"), "utf8"));

  const workers = await sql`
    SELECT id, worker_code, full_name, document_number, company, job_title, farm_id,
           works_heights, drives, operates_tractor
    FROM campus_sst.sst_workers
    ORDER BY worker_code
  `;
  const farms = await sql`SELECT id, code FROM campus_sst.sst_farms`;
  const farmId = farms[0]?.id ?? null;
  const w = (i) => workers[Math.min(i, Math.max(workers.length - 1, 0))];

  if (workers.length === 0) {
    console.log("Sin trabajadores: solo schema operativos.");
  } else {
    const heightsCount =
      await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_heights_authorizations`;
    if ((heightsCount[0]?.c ?? 0) === 0) {
      const seeds = [
        {
          folio: "ALT-2026-001",
          worker: w(0),
          level: "autorizado_32h",
          training: iso(-200),
          trainingDue: iso(-4),
          medical: iso(-100),
          medicalDue: iso(20),
          fitness: "apto",
          cert: "Certificado_4272.pdf",
          status: "no_autorizado",
        },
        {
          folio: "ALT-2026-002",
          worker: w(1),
          level: "reentrenamiento_8h",
          training: iso(-50),
          trainingDue: iso(25),
          medical: iso(-40),
          medicalDue: iso(40),
          fitness: "apto_recomendaciones",
          cert: "Cert_Reentreno.pdf",
          status: "por_vencer",
        },
        {
          folio: "ALT-2026-003",
          worker: w(2),
          level: "autorizado_32h",
          training: iso(-10),
          trainingDue: iso(300),
          medical: iso(-10),
          medicalDue: iso(300),
          fitness: "apto",
          cert: "Cert_OK.pdf",
          status: "autorizado",
        },
      ];
      for (const s of seeds) {
        await sql`
          INSERT INTO campus_sst.sst_heights_authorizations (
            folio, worker_id, training_level, training_date, training_due_date,
            retraining_done, certificate_url, certificate_name,
            medical_exam_date, medical_exam_due_date, fitness_concept,
            authorization_status, observations, company_snapshot, job_title_snapshot, farm_id
          ) VALUES (
            ${s.folio}, ${s.worker.id}, ${s.level}, ${s.training}, ${s.trainingDue},
            ${true}, ${""}, ${s.cert},
            ${s.medical}, ${s.medicalDue}, ${s.fitness},
            ${s.status}, ${"Seed OTROS2 alturas"}, ${s.worker.company}, ${s.worker.job_title},
            ${s.worker.farm_id ?? farmId}
          )
          ON CONFLICT (folio) DO NOTHING
        `;
      }
      console.log("Seed alturas OK.");
    }

    const opsCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_machine_operators`;
    if ((opsCount[0]?.c ?? 0) === 0) {
      const seeds = [
        {
          folio: "OPE-2026-001",
          worker: w(2),
          equipment: "John Deere 5075E",
          type: "tractor",
          trainingDue: iso(60),
          license: "C2",
          licenseDue: iso(120),
          fitness: "apto",
          induction: true,
          key: "autorizado",
          reasons: "",
        },
        {
          folio: "OPE-2026-002",
          worker: w(0),
          equipment: "Tractor Kubota",
          type: "tractor",
          trainingDue: iso(-5),
          license: "",
          licenseDue: null,
          fitness: "pendiente",
          induction: false,
          key: "bloqueado",
          reasons: "Formación vencida; Aptitud pendiente; Requisitos incompletos",
        },
      ];
      for (const s of seeds) {
        await sql`
          INSERT INTO campus_sst.sst_machine_operators (
            folio, worker_id, farm_id, equipment_name, equipment_type,
            training_name, training_date, training_due_date,
            license_category, license_due_date, occupational_exam_date, fitness_concept,
            induction_done, induction_date, key_status, block_reasons, observations,
            company_snapshot, job_title_snapshot
          ) VALUES (
            ${s.folio}, ${s.worker.id}, ${s.worker.farm_id ?? farmId}, ${s.equipment}, ${s.type},
            ${"Operación segura de maquinaria"}, ${iso(-90)}, ${s.trainingDue},
            ${s.license}, ${s.licenseDue}, ${iso(-30)}, ${s.fitness},
            ${s.induction}, ${s.induction ? iso(-80) : null}, ${s.key}, ${s.reasons},
            ${"Seed OTROS2 operadores"}, ${s.worker.company}, ${s.worker.job_title}
          )
          ON CONFLICT (folio) DO NOTHING
        `;
      }
      console.log("Seed operadores OK.");
    }

    const vehCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_pesv_vehicles`;
    if ((vehCount[0]?.c ?? 0) === 0) {
      await sql`
        INSERT INTO campus_sst.sst_pesv_vehicles (
          plate, vehicle_type, brand, model, responsible_worker_id, work_center, farm_id,
          status, soat_due_date, rtm_due_date, insurance_due_date, odometer_km, kit_ok, extinguisher_ok
        ) VALUES
          (${"ABC123"}, ${"camioneta"}, ${"Toyota"}, ${"Hilux"}, ${w(3).id}, ${"Sede Principal"}, ${farmId},
           ${"apto"}, ${iso(90)}, ${iso(120)}, ${iso(200)}, ${45200}, ${true}, ${true}),
          (${"XYZ987"}, ${"camion"}, ${"Chevrolet"}, ${"NPR"}, ${w(2).id}, ${"Centro Logístico Norte"}, ${farmId},
           ${"alerta"}, ${iso(15)}, ${iso(-5)}, ${iso(40)}, ${128000}, ${true}, ${false})
        ON CONFLICT (plate) DO NOTHING
      `;
      console.log("Seed vehículos PESV OK.");
    }

    const vehicles = await sql`SELECT id, plate FROM campus_sst.sst_pesv_vehicles ORDER BY plate`;
    const v1 = vehicles[0];
    const v2 = vehicles[1] ?? vehicles[0];

    const drvCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_pesv_drivers`;
    if ((drvCount[0]?.c ?? 0) === 0 && v1) {
      await sql`
        INSERT INTO campus_sst.sst_pesv_drivers (
          folio, worker_id, vehicle_id, vehicle_type, plate_snapshot,
          license_category, license_due_date, road_safety_course_date, road_safety_course_due,
          medical_exam_date, fitness_concept, authorization_status, observations,
          company_snapshot, job_title_snapshot, farm_id
        ) VALUES
          (
            ${"PESV-2026-001"}, ${w(3).id}, ${v1.id}, ${"camioneta"}, ${v1.plate},
            ${"B1"}, ${iso(180)}, ${iso(-30)}, ${iso(300)},
            ${iso(-20)}, ${"apto"}, ${"autorizado"}, ${"Seed PESV"},
            ${w(3).company}, ${w(3).job_title}, ${w(3).farm_id ?? farmId}
          ),
          (
            ${"PESV-2026-002"}, ${w(2).id}, ${v2?.id ?? null}, ${"camion"}, ${v2?.plate ?? ""},
            ${"C2"}, ${iso(10)}, ${iso(-400)}, ${iso(-10)},
            ${iso(-5)}, ${"apto"}, ${"por_vencer"}, ${"Licencia y curso por vencer/vencidos"},
            ${w(2).company}, ${w(2).job_title}, ${w(2).farm_id ?? farmId}
          )
        ON CONFLICT (folio) DO NOTHING
      `;
      console.log("Seed conductores PESV OK.");
    }

    const preCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_pesv_preops`;
    if ((preCount[0]?.c ?? 0) === 0 && v2) {
      await sql`
        INSERT INTO campus_sst.sst_pesv_preops (
          folio, vehicle_id, inspection_date, category, finding, status, odometer_km
        ) VALUES
          (${"PRE-2026-001"}, ${v1.id}, ${iso(0)}, ${"general"}, ${"OK preoperacional"}, ${"cerrado"}, ${45210}),
          (${"PRE-2026-002"}, ${v2.id}, ${iso(-1)}, ${"FRENOS"}, ${"Desgaste pastillas — detener"}, ${"detenido"}, ${128050}),
          (${"PRE-2026-003"}, ${v2.id}, ${iso(-2)}, ${"incidente"}, ${"Roce espejo en patio"}, ${"abierto"}, ${128040})
        ON CONFLICT (folio) DO NOTHING
      `;
      console.log("Seed preops PESV OK.");
    }
  }

  console.log("Migración sst-operativos OK.");
} finally {
  await sql.end({ timeout: 5 });
}
