/**
 * Vacía datos demo del SG-SST operativo.
 * NO toca cursos, usuarios, asistencia ni el resto de Campus SST.
 * Conserva sst_alert_settings (umbrales de configuración).
 */
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Define DATABASE_URL.");

const sql = postgres(url, {
  max: 1,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
});

/** Orden: hijos → padres. Solo tablas sst_* del operativo. */
const TABLES = [
  "sst_alert_actions",
  "sst_inspection_findings",
  "sst_accident_causes",
  "sst_copasst_commitments",
  "sst_copasst_trainings",
  "sst_copasst_meetings",
  "sst_copasst_members",
  "sst_ccl_commitments",
  "sst_ccl_cases",
  "sst_ccl_meetings",
  "sst_ccl_members",
  "sst_brigade_members",
  "sst_emergency_equipment",
  "sst_emergency_drills",
  "sst_corrective_actions",
  "sst_trainings",
  "sst_sg_documents",
  "sst_investigations",
  "sst_accident_events",
  "sst_inspections",
  "sst_epp_deliveries",
  "sst_epp_catalog",
  "sst_pesv_preops",
  "sst_pesv_drivers",
  "sst_pesv_vehicles",
  "sst_machine_operators",
  "sst_heights_authorizations",
  "sst_incapacidades",
  "sst_casos_salud",
  "sst_restricciones",
  "sst_emos",
  "sst_compliance_records",
  "sst_workers",
  "sst_farms",
];

try {
  await sql.begin(async (tx) => {
    for (const table of TABLES) {
      const result = await tx.unsafe(`DELETE FROM campus_sst.${table}`);
      console.log(`OK vacía: ${table} (${result.count} filas)`);
    }
  });

  const remaining = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM campus_sst.sst_workers) AS workers,
      (SELECT COUNT(*)::int FROM campus_sst.sst_farms) AS farms,
      (SELECT COUNT(*)::int FROM campus_sst.sst_compliance_records) AS compliance,
      (SELECT COUNT(*)::int FROM campus_sst.sst_emos) AS emos,
      (SELECT COUNT(*)::int FROM campus_sst.sst_accident_events) AS accidentes,
      (SELECT COUNT(*)::int FROM campus_sst.users) AS users,
      (SELECT COUNT(*)::int FROM campus_sst.courses) AS courses
  `;
  console.log("Conteos:", remaining[0]);
  console.log("SG-SST operativo vacío. Usuarios/cursos intactos.");
} finally {
  await sql.end({ timeout: 5 });
}
