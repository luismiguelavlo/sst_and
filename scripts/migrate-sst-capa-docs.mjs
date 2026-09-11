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
  await sql.unsafe(readFileSync(join(root, "db/migrate-sst-capa-docs.sql"), "utf8"));

  const workers = await sql`
    SELECT id, company, job_title, farm_id FROM campus_sst.sst_workers ORDER BY worker_code
  `;
  const farms = await sql`SELECT id FROM campus_sst.sst_farms LIMIT 1`;
  const farmId = farms[0]?.id ?? null;
  const w = (i) => workers[Math.min(i, Math.max(workers.length - 1, 0))];

  const acCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_corrective_actions`;
  if ((acCount[0]?.c ?? 0) === 0) {
    await sql`
      INSERT INTO campus_sst.sst_corrective_actions (
        folio, source_type, source_ref, finding, action_plan, action_kind,
        responsible_name, commit_date, status, efficacy_status, observations, farm_id
      ) VALUES
        (${"AC-2026-001"}, ${"inspeccion"}, ${"INS-2026-003"}, ${"Señalización incompleta"},
         ${"Instalar señalética en bodega"}, ${"correctiva"}, ${"Capataz de finca"},
         ${iso(-3)}, ${"vencida"}, ${"pendiente"}, ${"Seed OTROS5"}, ${farmId}),
        (${"AC-2026-002"}, ${"accidente"}, ${"AT-2026-001"}, ${"Caída por EPP incompleto"},
         ${"Reforzar inspección EPP previa a alturas"}, ${"preventiva"}, ${"Ing. Andrés Valencia"},
         ${iso(12)}, ${"proxima_vencer"}, ${"en_seguimiento"}, ${"Seed OTROS5"}, ${farmId}),
        (${"AC-2026-003"}, ${"copasst"}, ${"ACTA-12"}, ${"Falta formación brigada"},
         ${"Programar capacitación brigada"}, ${"mejora"}, ${"Ing. Andrés Valencia"},
         ${iso(60)}, ${"en_ejecucion"}, ${"pendiente"}, ${"Seed OTROS5"}, ${farmId}),
        (${"AC-2026-004"}, ${"pesv"}, ${"PRE-2026-002"}, ${"Frenos deficientes"},
         ${"Cambio de pastillas y verificación"}, ${"correctiva"}, ${"Taller flota"},
         ${iso(-20)}, ${"cerrada"}, ${"eficaz"}, ${"Seed OTROS5"}, ${farmId})
      ON CONFLICT (folio) DO NOTHING
    `;
    // fix closed_at for closed one
    await sql`
      UPDATE campus_sst.sst_corrective_actions
      SET closed_at = ${iso(-5)}, status = 'cerrada'
      WHERE folio = 'AC-2026-004'
    `;
    console.log("Seed acciones OK.");
  }

  const trCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_trainings`;
  if ((trCount[0]?.c ?? 0) === 0 && workers.length > 0) {
    const seeds = [
      { folio: "CAP-2026-001", worker: w(0), topic: "alturas", date: iso(-100), next: iso(-10), hours: 8, status: "vencida" },
      { folio: "CAP-2026-002", worker: w(1), topic: "epp", date: iso(-20), next: iso(20), hours: 4, status: "proxima" },
      { folio: "CAP-2026-003", worker: w(2), topic: "induccion", date: iso(-5), next: iso(360), hours: 8, status: "realizada" },
      { folio: "CAP-2026-004", worker: w(3), topic: "pesv", date: iso(7), next: null, hours: 8, status: "programada" },
    ];
    for (const s of seeds) {
      await sql`
        INSERT INTO campus_sst.sst_trainings (
          folio, worker_id, topic, training_date, hours, instructor, modality,
          next_training_date, status, company_snapshot, job_title_snapshot, farm_id, observations
        ) VALUES (
          ${s.folio}, ${s.worker.id}, ${s.topic}, ${s.date}, ${s.hours},
          ${"Instructor SST"}, ${"presencial"}, ${s.next}, ${s.status},
          ${s.worker.company}, ${s.worker.job_title}, ${s.worker.farm_id ?? farmId},
          ${"Seed OTROS5 capacitaciones"}
        )
        ON CONFLICT (folio) DO NOTHING
      `;
    }
    console.log("Seed capacitaciones OK.");
  }

  const docCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_sg_documents`;
  if ((docCount[0]?.c ?? 0) === 0) {
    await sql`
      INSERT INTO campus_sst.sst_sg_documents (
        code, title, doc_type, company, responsible_name,
        elaborated_at, last_reviewed_at, next_review_at, has_review_cycle,
        version_label, status, observations
      ) VALUES
        (${"DOC-POL-001"}, ${"Política SST"}, ${"politica_sst"}, ${"Grupo Manzanares S.A.S."},
         ${"Gerencia"}, ${"2024-01-15"}, ${"2025-01-15"}, ${iso(40)}, ${true},
         ${"3.0"}, ${"vigente"}, ${"Seed OTROS5"}),
        (${"DOC-MAT-001"}, ${"Matriz de peligros"}, ${"matriz_peligros"}, ${"Grupo Manzanares S.A.S."},
         ${"Coord. SG-SST"}, ${"2024-06-01"}, ${"2025-06-01"}, ${iso(-5)}, ${true},
         ${"2.1"}, ${"en_revision"}, ${"Seed OTROS5"}),
        (${"DOC-REG-001"}, ${"Reglamento de higiene y seguridad"}, ${"reglamento_higiene"},
         ${"Grupo Manzanares S.A.S."}, ${"RRHH"}, ${"2023-03-01"}, ${"2024-03-01"}, ${null}, ${false},
         ${"1.0"}, ${"vigente"}, ${"Sin ciclo de vencimiento automático"})
      ON CONFLICT (code) DO NOTHING
    `;
    console.log("Seed documentos OK.");
  }

  console.log("Migración sst-capa-docs OK.");
} finally {
  await sql.end({ timeout: 5 });
}
