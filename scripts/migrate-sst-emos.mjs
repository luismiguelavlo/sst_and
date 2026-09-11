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
  await sql.unsafe(readFileSync(join(root, "db/migrate-sst-emos.sql"), "utf8"));

  const workers = await sql`
    SELECT id, worker_code, full_name, document_number, company, job_title, farm_id
    FROM campus_sst.sst_workers
    ORDER BY worker_code
  `;

  const existing = await sql`SELECT COUNT(*)::int AS count FROM campus_sst.sst_emos`;
  if ((existing[0]?.count ?? 0) === 0 && workers.length > 0) {
    const byDoc = Object.fromEntries(
      workers.map((w) => [String(w.document_number).replace(/\D/g, ""), w]),
    );
    const byCode = Object.fromEntries(workers.map((w) => [w.worker_code, w]));

    const today = new Date();
    const iso = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().slice(0, 10);
    };

    const seeds = [
      {
        folio: "EMO-2026-001",
        worker: byDoc["1088294102"] ?? byCode["MNZ-0001"] ?? workers[0],
        exam_type: "periodico",
        exam_date: iso(-40),
        next_due_date: iso(-4),
        periodicity_months: 12,
        ips: "IPS Salud del Eje",
        concept: "apto",
        admin_observations: "Sin restricciones administrativas. Vigilar recertificación alturas.",
        evidence_name: "Certificado_Aptitud_Restrepo.pdf",
      },
      {
        folio: "EMO-2026-002",
        worker: byDoc["42883912"] ?? byCode["MNZ-0002"] ?? workers[1] ?? workers[0],
        exam_type: "periodico",
        exam_date: iso(-200),
        next_due_date: iso(-2),
        periodicity_months: 6,
        ips: "IPS Salud del Eje",
        concept: "apto_recomendaciones",
        admin_observations: "Seguimiento colinesterasa administrativo; EPP químico obligatorio.",
        evidence_name: "Certificado_Gomez.pdf",
        chemicals_cleared: true,
      },
      {
        folio: "EMO-2026-003",
        worker: byDoc["71234567"] ?? byCode["MNZ-0003"] ?? workers[2] ?? workers[0],
        exam_type: "ingreso",
        exam_date: iso(-90),
        next_due_date: iso(45),
        periodicity_months: 12,
        ips: "Clínica del Café Ocupacional",
        concept: "apto",
        admin_observations: "Apto para operación de maquinaria / PESV.",
        evidence_name: "",
        pesv_cleared: true,
      },
      {
        folio: "EMO-2026-004",
        worker: byDoc["43998877"] ?? byCode["MNZ-0004"] ?? workers[3] ?? workers[0],
        exam_type: "periodico",
        exam_date: iso(-10),
        next_due_date: iso(120),
        periodicity_months: 24,
        ips: "IPS Salud del Eje",
        concept: "apto",
        admin_observations: "Riesgo administrativo bajo.",
        evidence_name: "",
      },
      {
        folio: "EMO-2025-088",
        worker: byDoc["70554433"] ?? byCode["MNZ-0005"] ?? workers[workers.length - 1],
        exam_type: "egreso",
        exam_date: "2025-12-10",
        next_due_date: null,
        periodicity_months: null,
        ips: "IPS Salud del Eje",
        concept: "apto",
        admin_observations: "EMO de egreso — historial custodiado.",
        evidence_name: "Egreso_Quintero.pdf",
      },
    ];

    let seeded = 0;
    for (const seed of seeds) {
      if (!seed.worker) continue;

      const inserted = await sql`
        INSERT INTO campus_sst.sst_emos (
          folio, worker_id, exam_type, exam_date, next_due_date, periodicity_months,
          ips, concept, admin_observations, evidence_url, evidence_name,
          company_snapshot, job_title_snapshot, farm_id,
          heights_cleared, pesv_cleared, chemicals_cleared
        ) VALUES (
          ${seed.folio},
          ${seed.worker.id},
          ${seed.exam_type},
          ${seed.exam_date},
          ${seed.next_due_date},
          ${seed.periodicity_months},
          ${seed.ips},
          ${seed.concept},
          ${seed.admin_observations},
          ${""},
          ${seed.evidence_name},
          ${seed.worker.company},
          ${seed.worker.job_title},
          ${seed.worker.farm_id},
          ${seed.heights_cleared ?? null},
          ${seed.pesv_cleared ?? null},
          ${seed.chemicals_cleared ?? null}
        )
        ON CONFLICT (folio) DO NOTHING
        RETURNING id
      `;
      const emoId = inserted[0]?.id;
      if (!emoId) continue;

      const closed = seed.exam_type === "egreso" || seed.concept === "no_apto";
      const folioCompliance = `ALT-EMO-${seed.folio.replace(/\D/g, "").slice(-6)}`;

      const compliance = await sql`
        INSERT INTO campus_sst.sst_compliance_records (
          folio, record_type, title, code, module_path,
          worker_id, subject_name, subject_document, subject_job_title, farm_id,
          due_date, issued_at, workflow_status, external_entity, notes
        ) VALUES (
          ${folioCompliance},
          ${"examen_medico"},
          ${`EMO ${seed.exam_type} — ${seed.worker.full_name}`},
          ${seed.folio},
          ${"examenes-medicos-ocupacionales"},
          ${seed.worker.id},
          ${seed.worker.full_name},
          ${seed.worker.document_number},
          ${seed.worker.job_title},
          ${seed.worker.farm_id},
          ${seed.next_due_date},
          ${seed.exam_date},
          ${closed ? "closed" : "open"},
          ${seed.ips},
          ${seed.admin_observations}
        )
        ON CONFLICT (folio) DO NOTHING
        RETURNING id
      `;

      if (compliance[0]?.id) {
        await sql`
          UPDATE campus_sst.sst_emos
          SET compliance_record_id = ${compliance[0].id}
          WHERE id = ${emoId}
        `;
      }
      seeded += 1;
    }
    console.log(`Seeded ${seeded} EMOs demo.`);
  } else {
    console.log("sst_emos already has data; schema only.");
  }

  console.log("Migración sst_emos OK.");
} finally {
  await sql.end({ timeout: 5 });
}
