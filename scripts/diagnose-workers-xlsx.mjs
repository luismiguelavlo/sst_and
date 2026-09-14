/**
 * Diagnóstico: solapamiento Excel vs BD por documento/código.
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
  const db = await sql`
    SELECT id, worker_code, document_type, document_number, full_name
    FROM campus_sst.sst_workers
  `;
  const dbByDoc = new Map(
    db.map((w) => [`${w.document_type}::${normalizeDoc(w.document_number)}`, w]),
  );
  const dbByCode = new Map(db.map((w) => [String(w.worker_code), w]));

  const wb = XLSX.read(readFileSync(resolve("base-maestra-trabajadores-2026-09-11.xlsx")), {
    type: "buffer",
    cellDates: true,
  });
  const matrix = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    header: 1,
    defval: "",
    raw: false,
  });

  let matchDoc = 0;
  let matchCodeOnly = 0;
  let missing = 0;
  const missingRows = [];
  const codeOnlyRows = [];

  for (let i = 1; i < matrix.length; i += 1) {
    const row = matrix[i] ?? [];
    const code = String(row[0] ?? "").trim();
    const name = String(row[1] ?? "").trim();
    const docType = String(row[2] ?? "CC").trim().toUpperCase() || "CC";
    const doc = normalizeDoc(row[3]);
    if (!name && !doc) continue;
    const key = `${docType}::${doc}`;
    if (dbByDoc.has(key)) {
      matchDoc += 1;
      continue;
    }
    if (code && dbByCode.has(code)) {
      matchCodeOnly += 1;
      const w = dbByCode.get(code);
      if (codeOnlyRows.length < 15) {
        codeOnlyRows.push({
          excel: { code, name, doc },
          db: {
            code: w.worker_code,
            name: w.full_name,
            doc: w.document_number,
          },
        });
      }
      continue;
    }
    missing += 1;
    if (missingRows.length < 15) missingRows.push({ code, name, doc });
  }

  console.log({
    dbWorkers: db.length,
    excelRows: matrix.length - 1,
    matchDoc,
    matchCodeOnly,
    missing,
  });
  console.log("codeOnly sample", codeOnlyRows);
  console.log("missing sample", missingRows);
} finally {
  await sql.end({ timeout: 5 });
}
