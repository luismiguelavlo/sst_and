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
  await sql.unsafe(
    readFileSync(join(root, "db/migrate-sst-comites-emergencias.sql"), "utf8"),
  );

  const workers = await sql`
    SELECT id, company, job_title, farm_id FROM campus_sst.sst_workers ORDER BY worker_code
  `;
  const farms = await sql`SELECT id FROM campus_sst.sst_farms LIMIT 1`;
  const farmId = farms[0]?.id ?? null;
  const w = (i) => workers[Math.min(i, Math.max(workers.length - 1, 0))];

  // ── COPASST ──
  const memCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_copasst_members`;
  if ((memCount[0]?.c ?? 0) === 0 && workers.length > 0) {
    const roles = [
      "presidente",
      "secretario",
      "representante_empleador",
      "representante_trabajadores",
    ];
    for (let i = 0; i < roles.length; i += 1) {
      const worker = w(i);
      await sql`
        INSERT INTO campus_sst.sst_copasst_members (
          worker_id, company_snapshot, job_title_snapshot, role, period_label,
          start_date, end_date, status, farm_id, observations
        ) VALUES (
          ${worker.id}, ${worker.company}, ${worker.job_title}, ${roles[i]},
          ${"2024-2026"}, ${"2024-01-15"}, ${"2026-01-14"}, ${"activo"},
          ${worker.farm_id ?? farmId}, ${"Seed OTROS6 COPASST"}
        )
      `;
    }
    console.log("Seed COPASST integrantes OK.");
  }

  const meetCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_copasst_meetings`;
  if ((meetCount[0]?.c ?? 0) === 0) {
    await sql`
      INSERT INTO campus_sst.sst_copasst_meetings (
        folio, meeting_date, meeting_type, title, summary, next_meeting_date, status, farm_id, observations
      ) VALUES
        (${"COP-ACTA-2026-001"}, ${iso(-45)}, ${"ordinaria"}, ${"Acta ordinaria #01"},
         ${"Revisión de hallazgos de inspección y plan de señalización."}, ${iso(15)},
         ${"realizada"}, ${farmId}, ${"Seed OTROS6"}),
        (${"COP-ACTA-2026-002"}, ${iso(15)}, ${"ordinaria"}, ${"Acta ordinaria #02"},
         ${"Sesión programada de seguimiento."}, ${iso(45)},
         ${"programada"}, ${farmId}, ${"Seed OTROS6"})
      ON CONFLICT (folio) DO NOTHING
    `;
    const meetings = await sql`SELECT id, folio FROM campus_sst.sst_copasst_meetings ORDER BY folio`;
    const m1 = meetings.find((m) => m.folio === "COP-ACTA-2026-001")?.id ?? null;
    await sql`
      INSERT INTO campus_sst.sst_copasst_commitments (
        folio, meeting_id, description, responsible_name, due_date, status, follow_up, farm_id, observations
      ) VALUES
        (${"COP-COM-2026-001"}, ${m1}, ${"Completar señalización en bodega"}, ${"Capataz de finca"},
         ${iso(-5)}, ${"vencido"}, ${"Pendiente de cierre"}, ${farmId}, ${"Seed OTROS6"}),
        (${"COP-COM-2026-002"}, ${m1}, ${"Programar capacitación de brigada"}, ${"Ing. Andrés Valencia"},
         ${iso(20)}, ${"abierto"}, ${"En seguimiento"}, ${farmId}, ${"Seed OTROS6"}),
        (${"COP-COM-2026-003"}, ${m1}, ${"Validar matriz de peligros actualizada"}, ${"Coord. SG-SST"},
         ${iso(-30)}, ${"cerrado"}, ${"Cerrado en acta"}, ${farmId}, ${"Seed OTROS6"})
      ON CONFLICT (folio) DO NOTHING
    `;
    await sql`
      UPDATE campus_sst.sst_copasst_commitments
      SET closed_at = ${iso(-10)}
      WHERE folio = 'COP-COM-2026-003'
    `;
    await sql`
      INSERT INTO campus_sst.sst_copasst_trainings (
        folio, title, training_date, hours, instructor, attendees_count, status, observations
      ) VALUES
        (${"COP-CAP-2026-001"}, ${"Funciones legales del COPASST"}, ${iso(-60)}, ${8},
         ${"ABLG / ARL"}, ${4}, ${"realizada"}, ${"Seed OTROS6"}),
        (${"COP-CAP-2026-002"}, ${"Investigación de accidentes"}, ${iso(30)}, ${4},
         ${"ABLG / ARL"}, ${4}, ${"programada"}, ${"Seed OTROS6"})
      ON CONFLICT (folio) DO NOTHING
    `;
    console.log("Seed COPASST actas/compromisos/cap OK.");
  }

  // ── CCL ──
  const cclMem = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_ccl_members`;
  if ((cclMem[0]?.c ?? 0) === 0 && workers.length > 0) {
    const roles = ["presidente", "secretario", "representante_empleador", "representante_trabajadores"];
    for (let i = 0; i < roles.length; i += 1) {
      const worker = w(i + 2);
      await sql`
        INSERT INTO campus_sst.sst_ccl_members (
          worker_id, company_snapshot, job_title_snapshot, role, period_label,
          start_date, end_date, status, farm_id, observations
        ) VALUES (
          ${worker.id}, ${worker.company}, ${worker.job_title}, ${roles[i]},
          ${"2024-2026"}, ${"2024-03-01"}, ${"2026-02-28"}, ${"activo"},
          ${worker.farm_id ?? farmId}, ${"Seed OTROS6 CCL"}
        )
      `;
    }
    console.log("Seed CCL integrantes OK.");
  }

  const cclMeet = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_ccl_meetings`;
  if ((cclMeet[0]?.c ?? 0) === 0) {
    await sql`
      INSERT INTO campus_sst.sst_ccl_meetings (
        folio, meeting_date, meeting_type, title, summary, status, farm_id, observations
      ) VALUES
        (${"CCL-ACTA-2026-001"}, ${iso(-90)}, ${"ordinaria"}, ${"Acta ordinaria Q1"},
         ${"Sesión ordinaria — solo resumen administrativo."}, ${"realizada"}, ${farmId}, ${"Seed OTROS6"}),
        (${"CCL-ACTA-2026-002"}, ${iso(-10)}, ${"extraordinaria"}, ${"Acta extraordinaria #1"},
         ${"Seguimiento de términos legales."}, ${"realizada"}, ${farmId}, ${"Seed OTROS6"})
      ON CONFLICT (folio) DO NOTHING
    `;
    await sql`
      INSERT INTO campus_sst.sst_ccl_cases (
        code, opened_at, due_date, status, activity_summary, follow_up, observations
      ) VALUES
        (${"CCL-2026-EXP-001"}, ${iso(-40)}, ${iso(10)}, ${"en_tramite"},
         ${"En trámite · Término legal"}, ${"Seguimiento paramétrico"}, ${"Seed OTROS6 — sin datos sensibles"}),
        (${"CCL-2026-EXP-002"}, ${iso(-80)}, ${iso(-5)}, ${"seguimiento"},
         ${"Monitoreo de compromisos de trato"}, ${"Activo"}, ${"Seed OTROS6 — sin datos sensibles"}),
        (${"CCL-2026-EXP-003"}, ${iso(-120)}, ${iso(-60)}, ${"cerrado"},
         ${"Cerrado · Archivo custodiado"}, ${"Cierre administrativo"}, ${"Seed OTROS6 — sin datos sensibles"})
      ON CONFLICT (code) DO NOTHING
    `;
    await sql`
      UPDATE campus_sst.sst_ccl_cases SET closed_at = ${iso(-55)} WHERE code = 'CCL-2026-EXP-003'
    `;
    await sql`
      INSERT INTO campus_sst.sst_ccl_commitments (
        folio, description, responsible_name, due_date, status, follow_up, observations
      ) VALUES
        (${"CCL-COM-2026-001"}, ${"Entregar informe de avance al comité"}, ${"Secretaría CCL"},
         ${iso(12)}, ${"abierto"}, ${"Pendiente"}, ${"Seed OTROS6"}),
        (${"CCL-COM-2026-002"}, ${"Actualizar protocolo de atención"}, ${"Presidencia CCL"},
         ${iso(-2)}, ${"vencido"}, ${"Vencido"}, ${"Seed OTROS6"})
      ON CONFLICT (folio) DO NOTHING
    `;
    console.log("Seed CCL actas/casos/compromisos OK.");
  }

  // ── Emergencias ──
  const brigCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_brigade_members`;
  if ((brigCount[0]?.c ?? 0) === 0 && workers.length > 0) {
    const seeds = [
      { folio: "BRIG-2026-001", worker: w(0), type: "primeros_auxilios", due: iso(-10), status: "vencido" },
      { folio: "BRIG-2026-002", worker: w(1), type: "incendios", due: iso(20), status: "proximo" },
      { folio: "BRIG-2026-003", worker: w(2), type: "evacuacion", due: iso(200), status: "vigente" },
      { folio: "BRIG-2026-004", worker: w(3), type: "rescate", due: iso(180), status: "vigente" },
    ];
    for (const s of seeds) {
      await sql`
        INSERT INTO campus_sst.sst_brigade_members (
          folio, worker_id, company_snapshot, job_title_snapshot, brigade_type,
          training_title, trained_at, due_date, status, farm_id, observations
        ) VALUES (
          ${s.folio}, ${s.worker.id}, ${s.worker.company}, ${s.worker.job_title}, ${s.type},
          ${"Formación brigada integral"}, ${iso(-200)}, ${s.due}, ${s.status},
          ${s.worker.farm_id ?? farmId}, ${"Seed OTROS6 emergencias"}
        )
        ON CONFLICT (folio) DO NOTHING
      `;
    }
    console.log("Seed brigada OK.");
  }

  const eqCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_emergency_equipment`;
  if ((eqCount[0]?.c ?? 0) === 0) {
    await sql`
      INSERT INTO campus_sst.sst_emergency_equipment (
        code, element_name, equipment_type, location, inspected_at, next_inspection_at,
        responsible_name, status, findings, farm_id, observations
      ) VALUES
        (${"EQ-EM-2026-001"}, ${"Extintor PQS 10 lb"}, ${"extintor"}, ${"Bodega agroquímicos"},
         ${iso(-90)}, ${iso(-5)}, ${"Jefe de planta"}, ${"vencido_inspeccion"},
         ${"Manómetro en zona roja"}, ${farmId}, ${"Seed OTROS6"}),
        (${"EQ-EM-2026-002"}, ${"Botiquín tipo A"}, ${"botiquin"}, ${"Empaque"},
         ${iso(-30)}, ${iso(25)}, ${"Enfermería"}, ${"operativo"},
         ${""}, ${farmId}, ${"Seed OTROS6"}),
        (${"EQ-EM-2026-003"}, ${"Camilla rígida"}, ${"camilla"}, ${"Puesto de mando"},
         ${iso(-10)}, ${iso(170)}, ${"Brigada"}, ${"operativo"},
         ${""}, ${farmId}, ${"Seed OTROS6"}),
        (${"EQ-EM-2026-004"}, ${"Lámpara LED emergencia"}, ${"linterna"}, ${"Ruta evacuación N"},
         ${iso(-5)}, ${iso(85)}, ${"Mantenimiento"}, ${"operativo"},
         ${""}, ${farmId}, ${"Seed OTROS6"})
      ON CONFLICT (code) DO NOTHING
    `;
    console.log("Seed equipos emergencia OK.");
  }

  const drillCount = await sql`SELECT COUNT(*)::int AS c FROM campus_sst.sst_emergency_drills`;
  if ((drillCount[0]?.c ?? 0) === 0) {
    await sql`
      INSERT INTO campus_sst.sst_emergency_drills (
        folio, drill_date, place, drill_type, participants_count, result_score,
        result_label, findings, actions, status, farm_id, observations
      ) VALUES
        (${"SIM-2026-001"}, ${iso(-120)}, ${"Planta principal"}, ${"evacuacion"}, ${86},
         ${92}, ${"Excelente"}, ${"Tiempo de evacuación 3:40"}, ${"Reforzar puntos de encuentro"},
         ${"realizado"}, ${farmId}, ${"Seed OTROS6"}),
        (${"SIM-2026-002"}, ${iso(40)}, ${"Bodega combustibles"}, ${"incendio"}, ${0},
         ${null}, ${""}, ${""}, ${""}, ${"programado"}, ${farmId}, ${"Seed OTROS6"})
      ON CONFLICT (folio) DO NOTHING
    `;
    console.log("Seed simulacros OK.");
  }

  console.log("Migración sst-comites-emergencias OK.");
} finally {
  await sql.end({ timeout: 5 });
}
