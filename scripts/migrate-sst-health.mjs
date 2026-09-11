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
  await sql.unsafe(readFileSync(join(root, "db/migrate-sst-health.sql"), "utf8"));

  const workers = await sql`
    SELECT id, worker_code, full_name, document_number, company, job_title, farm_id
    FROM campus_sst.sst_workers
    ORDER BY worker_code
  `;

  if (workers.length === 0) {
    console.log("Sin trabajadores: solo schema health.");
  } else {
    const w = (i) => workers[Math.min(i, workers.length - 1)];

    const rstCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_restricciones`;
    if ((rstCount[0]?.c ?? 0) === 0) {
      const seeds = [
        {
          folio: "RST-2026-001",
          worker: w(0),
          kind: "restriccion",
          issued: iso(-20),
          start: iso(-20),
          due: iso(12),
          detail: "No labores en altura >1.5m hasta nuevo concepto.",
          status: "vigente",
          responsible: "Luis Fernando Mejía",
        },
        {
          folio: "RST-2026-002",
          worker: w(1),
          kind: "recomendacion",
          issued: iso(-5),
          start: iso(-5),
          due: iso(40),
          detail: "Rotación de puesto cada 2h; EPP químico completo.",
          status: "pendiente_implementacion",
          responsible: "Ing. Andrés Valencia",
        },
        {
          folio: "RST-2025-044",
          worker: w(2),
          kind: "post_incapacidad",
          issued: iso(-90),
          start: iso(-90),
          due: iso(-10),
          detail: "Restricción temporal de maquinaria pesada.",
          status: "vencida",
          responsible: "Diana Patricia Ríos",
        },
      ];
      for (const s of seeds) {
        await sql`
          INSERT INTO campus_sst.sst_restricciones (
            folio, worker_id, restriction_kind, issued_at, start_date, due_date, detail,
            issuer, responsible_name, status, next_follow_up, observations,
            company_snapshot, job_title_snapshot, farm_id
          ) VALUES (
            ${s.folio}, ${s.worker.id}, ${s.kind}, ${s.issued}, ${s.start}, ${s.due},
            ${s.detail}, ${"IPS Salud del Eje"}, ${s.responsible}, ${s.status},
            ${s.due}, ${""}, ${s.worker.company}, ${s.worker.job_title}, ${s.worker.farm_id}
          )
          ON CONFLICT (folio) DO NOTHING
        `;
      }
      console.log("Seed restricciones OK.");
    }

    const csCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_casos_salud`;
    if ((csCount[0]?.c ?? 0) === 0) {
      const seeds = [
        {
          folio: "CS-2026-001",
          worker: w(0),
          type: "reubicacion",
          opened: iso(-30),
          status: "en_seguimiento",
          follow: iso(2),
          obs: "Plan de reubicación temporal en empaque.",
        },
        {
          folio: "CS-2026-002",
          worker: w(2),
          type: "accidente_laboral",
          opened: iso(-15),
          status: "abierto",
          follow: iso(5),
          obs: "Acompañamiento ARL en curso (administrativo).",
        },
        {
          folio: "CS-2026-003",
          worker: w(1),
          type: "seguimiento_eps",
          opened: iso(-60),
          status: "pendiente",
          follow: iso(-1),
          obs: "Pendiente dictamen administrativo EPS.",
        },
        {
          folio: "CS-2025-090",
          worker: w(3),
          type: "recomendacion_medica",
          opened: iso(-120),
          status: "cerrado",
          follow: null,
          closed: iso(-30),
          obs: "Cerrado con aptitud administrativa.",
        },
      ];
      for (const s of seeds) {
        await sql`
          INSERT INTO campus_sst.sst_casos_salud (
            folio, worker_id, case_type, opened_at, status, responsible_name, issuer,
            next_follow_up, closed_at, admin_observations,
            company_snapshot, job_title_snapshot, farm_id
          ) VALUES (
            ${s.folio}, ${s.worker.id}, ${s.type}, ${s.opened}, ${s.status},
            ${"Ing. Andrés Valencia"}, ${"ARL Sura / IPS"}, ${s.follow},
            ${s.closed ?? null}, ${s.obs},
            ${s.worker.company}, ${s.worker.job_title}, ${s.worker.farm_id}
          )
          ON CONFLICT (folio) DO NOTHING
        `;
      }
      console.log("Seed casos de salud OK.");
    }

    const incCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_incapacidades`;
    if ((incCount[0]?.c ?? 0) === 0) {
      const seeds = [
        {
          folio: "INC-2026-001",
          worker: w(0),
          start: iso(-10),
          end: iso(2),
          origin: "comun",
          days: 12,
          acc: 12,
          status: "por_vencer",
          ext: false,
          rei: true,
          reiStatus: "pendiente",
        },
        {
          folio: "INC-2026-002",
          worker: w(1),
          start: iso(-40),
          end: iso(-3),
          origin: "laboral_at",
          days: 37,
          acc: 37,
          status: "vencida_sin_cierre",
          ext: true,
          rei: true,
          reiStatus: "pendiente",
        },
        {
          folio: "INC-2026-003",
          worker: w(2),
          start: iso(-5),
          end: iso(8),
          origin: "comun",
          days: 13,
          acc: 13,
          status: "activa",
          ext: false,
          rei: false,
          reiStatus: "no_aplica",
        },
        {
          folio: "INC-2025-120",
          worker: w(4),
          start: "2025-11-01",
          end: "2025-12-10",
          origin: "comun",
          days: 40,
          acc: 40,
          status: "cerrada",
          ext: true,
          rei: true,
          reiStatus: "completado",
          reiDate: "2025-12-12",
        },
      ];
      for (const s of seeds) {
        await sql`
          INSERT INTO campus_sst.sst_incapacidades (
            folio, worker_id, company_snapshot, job_title_snapshot, farm_id,
            start_date, end_date, days_ordered, origin, is_extension, accumulated_days,
            status, sst_follow_up, reintegration_required, reintegration_date,
            reintegration_status, cie10, diagnosis_label, issuer, admin_observations
          ) VALUES (
            ${s.folio}, ${s.worker.id}, ${s.worker.company}, ${s.worker.job_title}, ${s.worker.farm_id},
            ${s.start}, ${s.end}, ${s.days}, ${s.origin}, ${s.ext}, ${s.acc},
            ${s.status}, ${"Seguimiento SST programado"}, ${s.rei}, ${s.reiDate ?? null},
            ${s.reiStatus}, ${s.origin === "laboral_at" ? "S60.0" : "M54.5"},
            ${s.origin === "laboral_at" ? "Contusión mano" : "Lumbalgia"},
            ${"EPS / ARL"}, ${"Registro administrativo demo OTROS.md"}
          )
          ON CONFLICT (folio) DO NOTHING
        `;
      }
      console.log("Seed incapacidades OK.");
    }
  }

  console.log("Migración sst-health OK.");
} finally {
  await sql.end({ timeout: 5 });
}
