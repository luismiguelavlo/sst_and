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

const migrations = [
  "db/migrate-attendance-forms.sql",
  "db/migrate-attendance-assignments.sql",
  "db/migrate-attendance-public.sql",
];

try {
  for (const file of migrations) {
    await sql.unsafe(readFileSync(join(root, file), "utf8"));
  }
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'campus_sst'
      AND table_name IN (
        'attendance_forms',
        'attendance_responses',
        'attendance_form_assignments'
      )
    ORDER BY table_name
  `;
  const nullable = await sql`
    SELECT is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'campus_sst'
      AND table_name = 'attendance_responses'
      AND column_name = 'user_id'
  `;
  console.log("Migración de asistencia aplicada.");
  console.log(
    "Tablas:",
    tables.map((row) => row.table_name).join(", ") || "(ninguna)",
  );
  console.log("user_id nullable:", nullable[0]?.is_nullable ?? "?");
} finally {
  await sql.end({ timeout: 5 });
}
