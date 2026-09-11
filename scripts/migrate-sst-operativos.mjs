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
  await sql.unsafe(readFileSync(join(root, "db/migrate-sst-operativos.sql"), "utf8"));
  console.log("Migración sst-operativos OK.");
} finally {
  await sql.end({ timeout: 5 });
}
