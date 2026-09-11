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

const CATALOG = [
  { code: "EPP-BOT-001", category: "botas", name: "Botas de seguridad dieléctricas", days: 180 },
  { code: "EPP-GUA-001", category: "guantes", name: "Guantes de vaqueta reforzada", days: 45 },
  { code: "EPP-GAF-001", category: "gafas", name: "Gafas de seguridad UV", days: 365 },
  { code: "EPP-CAS-001", category: "casco", name: "Casco dieléctrico clase E", days: 730 },
  { code: "EPP-AUD-001", category: "proteccion_auditiva", name: "Protectores auditivos tipo copa", days: 365 },
  { code: "EPP-RES-001", category: "proteccion_respiratoria", name: "Respirador media cara + filtros", days: 30 },
  { code: "EPP-ARN-001", category: "arnes", name: "Arnés de cuerpo completo", days: 1095 },
  { code: "EPP-ESL-001", category: "eslinga", name: "Eslinga de posicionamiento", days: 365 },
  { code: "EPP-IMP-001", category: "impermeable", name: "Impermeable PVC industrial", days: 180 },
  { code: "EPP-VAQ-001", category: "vaqueta", name: "Delantal de vaqueta", days: 45 },
  { code: "EPP-OTR-001", category: "otros", name: "Kit EPP genérico", days: 180 },
];

try {
  await sql.unsafe(readFileSync(join(root, "db/migrate-sst-epp-inspecciones.sql"), "utf8"));

  for (const item of CATALOG) {
    await sql`
      INSERT INTO campus_sst.sst_epp_catalog (code, category, name, useful_life_days, active)
      VALUES (${item.code}, ${item.category}, ${item.name}, ${item.days}, ${true})
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        useful_life_days = EXCLUDED.useful_life_days,
        active = true,
        updated_at = now()
    `;
  }
  console.log("Catálogo EPP OK.");

  const workers = await sql`
    SELECT id, company, job_title, farm_id, work_center
    FROM campus_sst.sst_workers
    ORDER BY worker_code
  `;
  const catalog = await sql`SELECT id, code, useful_life_days FROM campus_sst.sst_epp_catalog ORDER BY code`;
  const farms = await sql`SELECT id FROM campus_sst.sst_farms LIMIT 1`;
  const farmId = farms[0]?.id ?? null;

  const delCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_epp_deliveries`;
  if ((delCount[0]?.c ?? 0) === 0 && workers.length > 0 && catalog.length > 0) {
    const w = (i) => workers[Math.min(i, workers.length - 1)];
    const c = (i) => catalog[Math.min(i, catalog.length - 1)];
    const seeds = [
      { folio: "EPP-2026-001", worker: w(0), item: c(0), qty: 1, size: "42", daysAgo: 20, reason: "dotacion", cost: 85000 },
      { folio: "EPP-2026-002", worker: w(1), item: c(1), qty: 2, size: "M", daysAgo: 40, reason: "reposicion", cost: 22000 },
      { folio: "EPP-2026-003", worker: w(2), item: c(6), qty: 1, size: "L", daysAgo: 200, reason: "dotacion", cost: 180000 },
      { folio: "EPP-2026-004", worker: w(0), item: c(5), qty: 1, size: "Única", daysAgo: 25, reason: "reposicion", cost: 45000 },
    ];
    for (const s of seeds) {
      const delivery = iso(-s.daysAgo);
      const life = s.item.useful_life_days;
      const next = iso(-s.daysAgo + life);
      await sql`
        INSERT INTO campus_sst.sst_epp_deliveries (
          folio, worker_id, catalog_item_id, quantity, size_label, delivery_date,
          useful_life_days, next_replenishment_date, reason, responsible_name,
          observations, company_snapshot, job_title_snapshot, farm_id,
          work_center_snapshot, unit_cost_cop
        ) VALUES (
          ${s.folio}, ${s.worker.id}, ${s.item.id}, ${s.qty}, ${s.size}, ${delivery},
          ${life}, ${next}, ${s.reason}, ${"Ing. Andrés Valencia"},
          ${"Seed OTROS3 EPP"}, ${s.worker.company}, ${s.worker.job_title},
          ${s.worker.farm_id ?? farmId}, ${s.worker.work_center ?? ""}, ${s.cost}
        )
        ON CONFLICT (folio) DO NOTHING
      `;
    }
    console.log("Seed entregas EPP OK.");
  }

  const inspCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_inspections`;
  if ((inspCount[0]?.c ?? 0) === 0) {
    const seeds = [
      {
        folio: "INS-2026-001",
        type: "extintores",
        scheduled: iso(1),
        status: "programada",
        findings: 0,
        summary: "",
        action: "",
      },
      {
        folio: "INS-2026-002",
        type: "epp",
        scheduled: iso(3),
        status: "programada",
        findings: 0,
        summary: "",
        action: "",
      },
      {
        folio: "INS-2026-003",
        type: "locativas",
        scheduled: iso(-2),
        status: "vencida",
        findings: 2,
        summary: "Pisos húmedos en bodega; señalización incompleta.",
        action: "Orden de aseo + señalética",
      },
      {
        folio: "INS-2026-004",
        type: "quimicos",
        scheduled: iso(-10),
        performed: iso(-9),
        status: "realizada",
        findings: 1,
        summary: "Ficha de seguridad desactualizada.",
        action: "Actualizar MSDS",
        next: iso(80),
      },
    ];
    for (const s of seeds) {
      const inserted = await sql`
        INSERT INTO campus_sst.sst_inspections (
          folio, inspection_type, responsible_name, farm_id, work_center,
          scheduled_date, performed_date, status, findings_summary, findings_count,
          generated_action, next_inspection_date, observations
        ) VALUES (
          ${s.folio}, ${s.type}, ${"Ing. Andrés Valencia"}, ${farmId}, ${"Sede Rural Occidente"},
          ${s.scheduled}, ${s.performed ?? null}, ${s.status}, ${s.summary}, ${s.findings},
          ${s.action}, ${s.next ?? null}, ${"Seed OTROS3 inspecciones"}
        )
        ON CONFLICT (folio) DO NOTHING
        RETURNING id
      `;
      if (inserted[0]?.id && s.findings > 0) {
        await sql`
          INSERT INTO campus_sst.sst_inspection_findings (
            inspection_id, severity, title, description, action_plan, assignee_name, due_date, status
          ) VALUES (
            ${inserted[0].id},
            ${s.status === "vencida" ? "alta" : "media"},
            ${"Hallazgo seed"},
            ${s.summary},
            ${s.action},
            ${"Capataz de finca"},
            ${iso(5)},
            ${s.status === "realizada" ? "en_proceso" : "abierto"}
          )
        `;
      }
    }
    console.log("Seed inspecciones OK.");
  }

  console.log("Migración sst-epp-inspecciones OK.");
} finally {
  await sql.end({ timeout: 5 });
}
