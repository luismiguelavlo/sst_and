/**
 * Relaciona trabajadores con centros según columna finca del Excel.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import postgres from "postgres";
import * as XLSX from "xlsx";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Define DATABASE_URL.");
const sql = postgres(url, {
  max: 1,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
});

function normalizeDoc(value) {
  const t = String(value ?? "").trim();
  if (!t) return "";
  if (/^\d+\.0+$/.test(t)) return t.replace(/\.0+$/, "");
  return t.replace(/\s+/g, "");
}

try {
  const farms = await sql`SELECT id, name, code FROM campus_sst.sst_farms`;
  const farmByName = new Map(
    farms.map((f) => [String(f.name).trim().toLowerCase(), f.id]),
  );

  const wb = XLSX.read(readFileSync(resolve("base-maestra-trabajadores-2026-09-11.xlsx")), {
    type: "buffer",
    cellDates: true,
  });
  const matrix = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: 1,
    defval: "",
    raw: false,
  });
  const headers = (matrix[0] ?? []).map((h) =>
    String(h ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/\s+/g, "_"),
  );
  const docIdx = headers.indexOf("numero_identificacion");
  const typeIdx = headers.indexOf("tipo_documento");
  const fincaIdx = headers.indexOf("finca");

  let linked = 0;
  let missingFarm = 0;
  let missingWorker = 0;
  let already = 0;

  for (let i = 1; i < matrix.length; i += 1) {
    const row = matrix[i] ?? [];
    const doc = normalizeDoc(row[docIdx]);
    const docType = String(row[typeIdx] ?? "CC").trim().toUpperCase() || "CC";
    const finca = String(row[fincaIdx] ?? "").trim();
    if (!doc || !finca) continue;
    const farmId = farmByName.get(finca.toLowerCase());
    if (!farmId) {
      missingFarm += 1;
      continue;
    }
    const workers = await sql`
      SELECT id, farm_id FROM campus_sst.sst_workers
      WHERE document_type = ${docType} AND document_number = ${doc}
      LIMIT 1
    `;
    if (!workers[0]) {
      missingWorker += 1;
      continue;
    }
    if (workers[0].farm_id === farmId) {
      already += 1;
      continue;
    }
    await sql`
      UPDATE campus_sst.sst_workers
      SET farm_id = ${farmId}, updated_at = now()
      WHERE id = ${workers[0].id}
    `;
    linked += 1;
  }

  const nullFarms = await sql`
    SELECT COUNT(*)::int AS n FROM campus_sst.sst_workers WHERE farm_id IS NULL
  `;
  console.log({
    linked,
    already,
    missingFarm,
    missingWorker,
    workersWithoutFarm: nullFarms[0].n,
    farms: farms.length,
  });
} finally {
  await sql.end({ timeout: 5 });
}
