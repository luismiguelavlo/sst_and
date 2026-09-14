/**
 * Importa centros únicos desde la columna `finca` del Excel de trabajadores.
 * Upsert por nombre (sin duplicar).
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

function normalizeFarmCode(code) {
  return code
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 32);
}

function uniqueCode(base, used) {
  let code = normalizeFarmCode(base) || `CTR_${Date.now().toString(36).toUpperCase()}`;
  if (code.length > 32) code = code.slice(0, 32);
  if (!used.has(code)) {
    used.add(code);
    return code;
  }
  for (let i = 2; i < 1000; i += 1) {
    const suffix = `_${i}`;
    const next = `${code.slice(0, Math.max(1, 32 - suffix.length))}${suffix}`;
    if (!used.has(next)) {
      used.add(next);
      return next;
    }
  }
  const fallback = `CTR_${Date.now().toString(36).toUpperCase()}`;
  used.add(fallback);
  return fallback;
}

try {
  const before = await sql`SELECT COUNT(*)::int AS n FROM campus_sst.sst_farms`;
  const existing = await sql`SELECT id, name, code FROM campus_sst.sst_farms`;
  const byName = new Map(
    existing.map((f) => [String(f.name).trim().toLowerCase(), f]),
  );
  const usedCodes = new Set(existing.map((f) => String(f.code).toUpperCase()));

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
  const fincaIdx = headers.indexOf("finca");
  const empresaIdx = headers.indexOf("empresa");
  if (fincaIdx < 0) throw new Error("No se encontró la columna finca.");

  const uniqueNames = new Map();
  for (let i = 1; i < matrix.length; i += 1) {
    const name = String(matrix[i]?.[fincaIdx] ?? "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (!uniqueNames.has(key)) {
      uniqueNames.set(key, {
        name,
        company:
          empresaIdx >= 0
            ? String(matrix[i]?.[empresaIdx] ?? "").trim() || "Grupo Manzanares S.A.S."
            : "Grupo Manzanares S.A.S.",
      });
    }
  }

  console.log("Farms DB antes:", before[0].n);
  console.log("Fincas únicas en Excel:", uniqueNames.size);

  let created = 0;
  let updated = 0;
  let failed = 0;
  const errors = [];

  for (const item of uniqueNames.values()) {
    try {
      const found = byName.get(item.name.toLowerCase());
      if (found) {
        await sql`
          UPDATE campus_sst.sst_farms
          SET
            company = ${item.company},
            active = true,
            updated_at = now()
          WHERE id = ${found.id}
        `;
        updated += 1;
      } else {
        const code = uniqueCode(item.name, usedCodes);
        const inserted = await sql`
          INSERT INTO campus_sst.sst_farms (
            name, code, company, municipality, address, observations, active, updated_at
          ) VALUES (
            ${item.name.slice(0, 120)},
            ${code},
            ${item.company},
            ${""},
            ${""},
            ${"Importado desde base maestra trabajadores"},
            ${true},
            now()
          )
          RETURNING id, name, code
        `;
        byName.set(item.name.toLowerCase(), inserted[0]);
        created += 1;
      }
    } catch (caught) {
      failed += 1;
      if (errors.length < 15) {
        errors.push({
          name: item.name,
          message: caught instanceof Error ? caught.message : String(caught),
        });
      }
    }
  }

  const after = await sql`SELECT COUNT(*)::int AS n FROM campus_sst.sst_farms`;
  console.log({ created, updated, failed, farmsAfter: after[0].n });
  if (errors.length) console.log("errors", errors);
} finally {
  await sql.end({ timeout: 5 });
}
