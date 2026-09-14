/**
 * Borra todos los trabajadores SG-SST y registros que los referencian (FK RESTRICT).
 * NO toca cursos, usuarios ni centros de trabajo (sst_farms).
 */
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Define DATABASE_URL.");

const sql = postgres(url, {
  max: 1,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
});

/** Hijos → padres. Solo lo necesario para poder borrar sst_workers. */
const DEPENDENT_TABLES = [
  "sst_alert_actions",
  "sst_inspection_findings",
  "sst_accident_causes",
  "sst_investigations",
  "sst_copasst_commitments",
  "sst_copasst_trainings",
  "sst_copasst_meetings",
  "sst_copasst_members",
  "sst_ccl_commitments",
  "sst_ccl_cases",
  "sst_ccl_meetings",
  "sst_ccl_members",
  "sst_brigade_members",
  "sst_trainings",
  "sst_accident_events",
  "sst_epp_deliveries",
  "sst_pesv_preops",
  "sst_pesv_drivers",
  "sst_machine_operators",
  "sst_heights_authorizations",
  "sst_incapacidades",
  "sst_casos_salud",
  "sst_restricciones",
  "sst_emos",
  "sst_compliance_records",
];

try {
  const before = await sql`
    SELECT COUNT(*)::int AS n FROM campus_sst.sst_workers
  `;
  console.log("Workers antes:", before[0].n);

  await sql.begin(async (tx) => {
    for (const table of DEPENDENT_TABLES) {
      try {
        const result = await tx.unsafe(`DELETE FROM campus_sst.${table}`);
        console.log(`OK vacía: ${table} (${result.count} filas)`);
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : String(caught);
        console.log(`SKIP ${table}: ${message.slice(0, 120)}`);
      }
    }
    const deleted = await tx`DELETE FROM campus_sst.sst_workers`;
    console.log(`OK vacía: sst_workers (${deleted.count} filas)`);
  });

  const after = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM campus_sst.sst_workers) AS workers,
      (SELECT COUNT(*)::int FROM campus_sst.sst_farms) AS farms,
      (SELECT COUNT(*)::int FROM campus_sst.users) AS users,
      (SELECT COUNT(*)::int FROM campus_sst.courses) AS courses
  `;
  console.log("Conteos:", after[0]);
  console.log("Trabajadores eliminados. Usuarios/cursos/centros intactos.");
} finally {
  await sql.end({ timeout: 5 });
}
