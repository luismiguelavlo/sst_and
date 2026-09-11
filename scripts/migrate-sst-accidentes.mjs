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
  await sql.unsafe(readFileSync(join(root, "db/migrate-sst-accidentes.sql"), "utf8"));

  const workers = await sql`
    SELECT id, company, job_title, area, work_center, farm_id, full_name
    FROM campus_sst.sst_workers
    ORDER BY worker_code
  `;
  const farms = await sql`SELECT id FROM campus_sst.sst_farms LIMIT 1`;
  const farmId = farms[0]?.id ?? null;
  const w = (i) => workers[Math.min(i, Math.max(workers.length - 1, 0))];

  const accCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_accident_events`;
  if ((accCount[0]?.c ?? 0) === 0 && workers.length > 0) {
    const seeds = [
      {
        num: "AT-2026-001",
        worker: w(0),
        date: iso(-12),
        type: "accidente_trabajo",
        mech: "Caída a distinto nivel",
        agent: "Escalera",
        body: "Tobillo",
        injury: "Esguince",
        days: 8,
        status: "en_investigacion",
      },
      {
        num: "INC-2026-002",
        worker: w(1),
        date: iso(-5),
        type: "incidente",
        mech: "Contacto con químico",
        agent: "Agroquímico",
        body: "Manos",
        injury: "Irritación",
        days: 0,
        status: "en_seguimiento",
      },
      {
        num: "AT-2026-003",
        worker: w(2),
        date: iso(-40),
        type: "accidente_trabajo",
        mech: "Golpe por objeto",
        agent: "Herramienta",
        body: "Cabeza",
        injury: "Contusión",
        days: 3,
        status: "cerrado",
      },
    ];

    for (const s of seeds) {
      const inserted = await sql`
        INSERT INTO campus_sst.sst_accident_events (
          event_number, event_date, event_time, worker_id,
          company_snapshot, job_title_snapshot, area_snapshot, work_center_snapshot, farm_id,
          event_type, description, accident_kind, mechanism, agent, body_part, injury_type,
          lost_days, origin, status, investigation_notes, corrective_action_notes
        ) VALUES (
          ${s.num}, ${s.date}, ${"08:30"}, ${s.worker.id},
          ${s.worker.company}, ${s.worker.job_title}, ${s.worker.area ?? ""},
          ${s.worker.work_center ?? ""}, ${s.worker.farm_id ?? farmId},
          ${s.type}, ${`Evento seed ${s.num}`}, ${"Típico"}, ${s.mech}, ${s.agent},
          ${s.body}, ${s.injury}, ${s.days}, ${"Laboral"}, ${s.status},
          ${"Investigación seed"}, ${"AC pendiente"}
        )
        ON CONFLICT (event_number) DO NOTHING
        RETURNING id, event_date, event_type
      `;
      const acc = inserted[0];
      if (!acc) continue;

      await sql`
        INSERT INTO campus_sst.sst_accident_causes (
          accident_id, immediate_act, immediate_condition, basic_personal, basic_work,
          root_cause, agent, mechanism, corrective_action, preventive_action
        ) VALUES (
          ${acc.id},
          ${"No usar EPP completo"},
          ${"Superficie inestable"},
          ${"Falta de entrenamiento"},
          ${"Supervisión insuficiente"},
          ${s.mech},
          ${s.agent},
          ${s.mech},
          ${"Entregar EPP y reforzar procedimiento"},
          ${"Capacitación trimestral"}
        )
        ON CONFLICT (accident_id) DO NOTHING
      `;

      if (acc.event_type === "accidente_trabajo") {
        const due = iso(
          Math.round((new Date(acc.event_date) - new Date()) / 86400000) + 15,
        );
        // legal due relative to event_date
        const eventDate = new Date(acc.event_date);
        eventDate.setDate(eventDate.getDate() + 15);
        const legalDue = eventDate.toISOString().slice(0, 10);
        const folio = s.num.replace("AT-", "INV-");
        await sql`
          INSERT INTO campus_sst.sst_investigations (
            folio, accident_id, accident_date, legal_due_date, responsible_name,
            status, methodology, causes_summary, action_plan, observations
          ) VALUES (
            ${folio}, ${acc.id}, ${acc.event_date}, ${legalDue},
            ${"Ing. Andrés Valencia"},
            ${s.status === "cerrado" ? "cerrada" : "pendiente_inicio"},
            ${"ishikawa"},
            ${s.mech},
            ${"Plan de acción seed"},
            ${"Seed otros4"}
          )
          ON CONFLICT (folio) DO NOTHING
        `;
        void due;
      }
    }
    console.log("Seed accidentes + causas + investigaciones OK.");
  }

  console.log("Migración sst-accidentes OK.");
} finally {
  await sql.end({ timeout: 5 });
}
