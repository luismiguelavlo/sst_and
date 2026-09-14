/**
 * Importa base-maestra-trabajadores con UPSERT (sin duplicar).
 * Clave: document_type + document_number; si no, worker_code.
 * Crea centros de trabajo faltantes desde la columna finca.
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

const HEADER_ALIASES = {
  workerCode: ["id_trabajador", "id", "codigo", "código", "worker_code", "workerid"],
  fullName: ["nombre_completo", "nombre", "full_name", "trabajador"],
  documentType: ["tipo_documento", "tipo_doc", "document_type"],
  documentNumber: [
    "numero_identificacion",
    "número_identificacion",
    "documento",
    "cedula",
    "cédula",
    "identificacion",
  ],
  company: ["empresa", "company", "razon_social"],
  jobTitle: ["cargo", "puesto", "job_title"],
  area: ["area", "área"],
  workCenter: [
    "centro_trabajo",
    "centro_trabajo_texto",
    "work_center",
    "lugar_trabajo",
  ],
  farm: ["finca", "predio", "farm", "centro_de_trabajo", "sede"],
  supervisorName: ["jefe_inmediato", "supervisor", "jefe"],
  hireDate: ["fecha_ingreso", "ingreso", "hire_date"],
  contractType: ["tipo_contrato", "contrato", "contract_type"],
  status: ["estado", "status"],
  riskLevel: ["nivel_riesgo", "riesgo", "risk_level", "clase_arl"],
  worksHeights: ["trabajo_en_alturas", "alturas", "works_heights"],
  drives: ["conduce", "drives"],
  operatesTractor: ["opera_tractor", "tractor", "operates_tractor"],
  handlesChemicals: ["manipula_quimicos", "manipula_químicos", "quimicos", "químicos"],
  inBrigade: ["brigada", "pertenece_brigada", "in_brigade"],
  inCopasst: ["copasst", "pertenece_copasst", "in_copasst"],
  inCcl: ["ccl", "pertenece_ccl", "in_ccl"],
  phone: ["telefono", "teléfono", "celular", "phone"],
  email: ["correo", "email", "e-mail"],
  observations: ["observaciones", "notas", "observations"],
  retirementDate: ["fecha_retiro", "retiro", "retirement_date"],
  retirementReason: ["motivo_retiro", "motivo", "retirement_reason"],
};

function normalizeHeader(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "_");
}

function mapHeaders(headers) {
  const map = {};
  const used = new Set();
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    const normalizedAliases = aliases.map(normalizeHeader);
    const index = headers.findIndex(
      (h, i) => !used.has(i) && normalizedAliases.includes(normalizeHeader(h)),
    );
    if (index >= 0) {
      map[field] = index;
      used.add(index);
    }
  }
  return map;
}

function cell(row, index) {
  if (index === undefined) return "";
  return String(row[index] ?? "").trim();
}

function normalizeDocumentNumber(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^\d+\.0+$/.test(trimmed)) return trimmed.replace(/\.0+$/, "");
  if (/^\d+(\.\d+)?e\+?\d+$/i.test(trimmed)) {
    const n = Number(trimmed);
    if (Number.isFinite(n) && n > 0) return String(Math.round(n));
  }
  return trimmed.replace(/\s+/g, "");
}

function parseBool(value) {
  const v = value.trim().toLowerCase();
  return ["si", "sí", "yes", "true", "1", "x"].includes(v);
}

function parseDate(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const iso = trimmed.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (iso) return iso[1];
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const serial = Number(trimmed);
    if (Number.isFinite(serial) && serial > 20000) {
      const epoch = new Date(Date.UTC(1899, 11, 30));
      epoch.setUTCDate(epoch.getUTCDate() + Math.floor(serial));
      return epoch.toISOString().slice(0, 10);
    }
  }
  const match = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) {
    const [, d, m, y] = match;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return null;
}

function parseStatus(value) {
  const v = value.trim().toLowerCase();
  if (["retirado", "retired", "inactivo", "baja"].includes(v)) return "retirado";
  return "activo";
}

function parseRisk(value) {
  const n = Number(String(value).replace(/\D/g, "")) || 4;
  return n >= 1 && n <= 5 ? n : 4;
}

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

async function ensureFarm(nameOrCode) {
  const needle = nameOrCode.trim();
  if (!needle) return null;
  const existing = await sql`
    SELECT id FROM campus_sst.sst_farms
    WHERE lower(name) = ${needle.toLowerCase()}
       OR lower(code) = ${needle.toLowerCase()}
    LIMIT 1
  `;
  if (existing[0]) return existing[0].id;

  let code = normalizeFarmCode(needle);
  if (!code) code = `CTR_${Date.now().toString(36).toUpperCase()}`;

  try {
    const created = await sql`
      INSERT INTO campus_sst.sst_farms (
        name, code, company, municipality, address, observations, active
      ) VALUES (
        ${needle.slice(0, 120)},
        ${code},
        ${"Grupo Manzanares S.A.S."},
        ${""},
        ${""},
        ${"Creado al importar trabajadores"},
        ${true}
      )
      RETURNING id
    `;
    return created[0]?.id ?? null;
  } catch {
    const again = await sql`
      SELECT id FROM campus_sst.sst_farms
      WHERE lower(name) = ${needle.toLowerCase()} OR lower(code) = ${code.toLowerCase()}
      LIMIT 1
    `;
    return again[0]?.id ?? null;
  }
}

async function nextWorkerCode() {
  const rows = await sql`
    SELECT worker_code FROM campus_sst.sst_workers
    WHERE worker_code ~ '^MNZ-[0-9]+$'
    ORDER BY length(worker_code) DESC, worker_code DESC
    LIMIT 1
  `;
  const last = rows[0]?.worker_code ?? "MNZ-0000";
  const n = Number(String(last).replace(/\D/g, "")) + 1;
  return `MNZ-${String(n).padStart(4, "0")}`;
}

try {
  const before = await sql`SELECT COUNT(*)::int AS n FROM campus_sst.sst_workers`;
  console.log("Workers en DB antes:", before[0].n);

  const filePath = resolve("base-maestra-trabajadores-2026-09-11.xlsx");
  const buf = readFileSync(filePath);
  const wb = XLSX.read(buf, { type: "buffer", cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const matrix = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  const headers = (matrix[0] ?? []).map((h) => String(h ?? ""));
  const headerMap = mapHeaders(headers);
  console.log("Header map:", headerMap);
  console.log("Filas Excel (sin encabezado):", matrix.length - 1);

  const farmCache = new Map();
  let created = 0;
  let updated = 0;
  let failed = 0;
  let skippedEmpty = 0;
  const errors = [];
  const seenDocs = new Set();

  for (let i = 1; i < matrix.length; i += 1) {
    const raw = matrix[i] ?? [];
    const fullName = cell(raw, headerMap.fullName);
    const documentNumber = normalizeDocumentNumber(cell(raw, headerMap.documentNumber));
    if (!fullName && !documentNumber) {
      skippedEmpty += 1;
      continue;
    }

    const documentTypeRaw = (cell(raw, headerMap.documentType) || "CC")
      .toUpperCase()
      .slice(0, 10);
    const documentType = ["CC", "CE", "TI", "PA", "NIT", "OTRO"].includes(documentTypeRaw)
      ? documentTypeRaw
      : "CC";
    const status = parseStatus(cell(raw, headerMap.status));
    const farmNeedle = cell(raw, headerMap.farm);
    let farmId = null;
    if (farmNeedle) {
      if (!farmCache.has(farmNeedle)) {
        farmCache.set(farmNeedle, await ensureFarm(farmNeedle));
      }
      farmId = farmCache.get(farmNeedle);
    }

    const workerCodeRaw = cell(raw, headerMap.workerCode);
    const docKey = `${documentType}::${documentNumber || `SIN-DOC-${i}`}`;
    // Misma cédula repetida en el Excel → última fila gana (sigue siendo 1 registro).
    seenDocs.add(docKey);

    const draft = {
      workerCode: workerCodeRaw || null,
      fullName: fullName || "Sin nombre",
      documentType,
      documentNumber: documentNumber || `SIN-DOC-${i}`,
      company: cell(raw, headerMap.company) || "Grupo Manzanares S.A.S.",
      jobTitle: cell(raw, headerMap.jobTitle) || "Operario",
      area: cell(raw, headerMap.area),
      workCenter: cell(raw, headerMap.workCenter),
      supervisorName: cell(raw, headerMap.supervisorName),
      hireDate: parseDate(cell(raw, headerMap.hireDate)),
      contractType: cell(raw, headerMap.contractType),
      status,
      riskLevel: parseRisk(cell(raw, headerMap.riskLevel)),
      worksHeights: parseBool(cell(raw, headerMap.worksHeights)),
      drives: parseBool(cell(raw, headerMap.drives)),
      operatesTractor: parseBool(cell(raw, headerMap.operatesTractor)),
      handlesChemicals: parseBool(cell(raw, headerMap.handlesChemicals)),
      inBrigade: parseBool(cell(raw, headerMap.inBrigade)),
      inCopasst: parseBool(cell(raw, headerMap.inCopasst)),
      inCcl: parseBool(cell(raw, headerMap.inCcl)),
      phone: cell(raw, headerMap.phone),
      email: cell(raw, headerMap.email),
      observations: cell(raw, headerMap.observations),
      retirementDate:
        status === "retirado"
          ? parseDate(cell(raw, headerMap.retirementDate)) ||
            new Date().toISOString().slice(0, 10)
          : parseDate(cell(raw, headerMap.retirementDate)),
      retirementReason: cell(raw, headerMap.retirementReason) || null,
      farmId,
    };

    try {
      // Anti-duplicado: SOLO documento (nunca id_trabajador numérico).
      const byDoc = await sql`
        SELECT id, worker_code FROM campus_sst.sst_workers
        WHERE document_type = ${draft.documentType}
          AND document_number = ${draft.documentNumber}
        LIMIT 1
      `;
      const existing = byDoc[0] ?? null;

      if (existing) {
        await sql`
          UPDATE campus_sst.sst_workers SET
            full_name = ${draft.fullName},
            document_type = ${draft.documentType},
            document_number = ${draft.documentNumber},
            company = ${draft.company},
            job_title = ${draft.jobTitle},
            area = ${draft.area},
            work_center = ${draft.workCenter},
            supervisor_name = ${draft.supervisorName},
            hire_date = ${draft.hireDate},
            contract_type = ${draft.contractType},
            status = ${draft.status},
            risk_level = ${draft.riskLevel},
            works_heights = ${draft.worksHeights},
            drives = ${draft.drives},
            operates_tractor = ${draft.operatesTractor},
            handles_chemicals = ${draft.handlesChemicals},
            in_brigade = ${draft.inBrigade},
            in_copasst = ${draft.inCopasst},
            in_ccl = ${draft.inCcl},
            phone = ${draft.phone},
            email = ${draft.email},
            observations = ${draft.observations},
            retirement_date = ${draft.retirementDate},
            retirement_reason = ${draft.retirementReason},
            farm_id = ${draft.farmId},
            updated_at = now()
          WHERE id = ${existing.id}
        `;
        updated += 1;
      } else {
        let code = draft.workerCode;
        if (code) {
          const codeTaken = await sql`
            SELECT id FROM campus_sst.sst_workers WHERE worker_code = ${code} LIMIT 1
          `;
          if (codeTaken[0]) code = await nextWorkerCode();
        } else {
          code = await nextWorkerCode();
        }

        await sql`
          INSERT INTO campus_sst.sst_workers (
            worker_code, full_name, document_type, document_number, company,
            job_title, area, work_center, supervisor_name, hire_date, contract_type,
            status, risk_level, works_heights, drives, operates_tractor,
            handles_chemicals, in_brigade, in_copasst, in_ccl, phone, email,
            observations, retirement_date, retirement_reason, farm_id
          ) VALUES (
            ${code}, ${draft.fullName}, ${draft.documentType}, ${draft.documentNumber},
            ${draft.company}, ${draft.jobTitle}, ${draft.area}, ${draft.workCenter},
            ${draft.supervisorName}, ${draft.hireDate}, ${draft.contractType},
            ${draft.status}, ${draft.riskLevel}, ${draft.worksHeights}, ${draft.drives},
            ${draft.operatesTractor}, ${draft.handlesChemicals}, ${draft.inBrigade},
            ${draft.inCopasst}, ${draft.inCcl}, ${draft.phone}, ${draft.email},
            ${draft.observations}, ${draft.retirementDate}, ${draft.retirementReason},
            ${draft.farmId}
          )
        `;
        created += 1;
      }
    } catch (caught) {
      failed += 1;
      const message = caught instanceof Error ? caught.message : String(caught);
      if (errors.length < 20) {
        errors.push({
          row: i + 1,
          name: draft.fullName,
          doc: draft.documentNumber,
          message: message.slice(0, 200),
        });
      }
    }
  }

  const after = await sql`SELECT COUNT(*)::int AS n FROM campus_sst.sst_workers`;
  const farms = await sql`SELECT COUNT(*)::int AS n FROM campus_sst.sst_farms`;
  console.log({
    created,
    updated,
    failed,
    skippedEmpty,
    uniqueDocsInFile: seenDocs.size,
    workersBefore: before[0].n,
    workersAfter: after[0].n,
    farms: farms[0].n,
  });
  if (errors.length) console.log("Sample errors:", errors);
} finally {
  await sql.end({ timeout: 5 });
}
