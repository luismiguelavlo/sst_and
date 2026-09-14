/**
 * Cuenta trabajadores actuales (diagnóstico).
 */
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Define DATABASE_URL.");

const sql = postgres(url, {
  max: 1,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
});

try {
  const count = await sql`SELECT COUNT(*)::int AS n FROM campus_sst.sst_workers`;
  const sample = await sql`
    SELECT worker_code, full_name, document_type, document_number
    FROM campus_sst.sst_workers
    ORDER BY updated_at DESC
    LIMIT 10
  `;
  console.log("workers:", count[0].n);
  console.log(sample);
} finally {
  await sql.end({ timeout: 5 });
}
