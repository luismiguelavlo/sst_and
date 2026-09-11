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

function addDays(base, days) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

try {
  await sql.unsafe(readFileSync(join(root, "db/migrate-sst-alerts.sql"), "utf8"));

  const farmSeeds = [
    { name: "Finca La Esperanza", code: "esperanza" },
    { name: "Finca El Paraíso", code: "paraiso" },
    { name: "Finca San José", code: "sanjose" },
    { name: "Finca Bella Vista", code: "bellavista" },
  ];

  for (const farm of farmSeeds) {
    await sql`
      INSERT INTO campus_sst.sst_farms (name, code)
      VALUES (${farm.name}, ${farm.code})
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, active = true
    `;
  }

  const farms = await sql`
    SELECT id, code FROM campus_sst.sst_farms
  `;
  const farmId = Object.fromEntries(farms.map((row) => [row.code, row.id]));

  const today = new Date();
  const existing = await sql`SELECT COUNT(*)::int AS count FROM campus_sst.sst_compliance_records`;
  if ((existing[0]?.count ?? 0) === 0) {
    const seeds = [
      {
        folio: "ALT-2026-001",
        record_type: "certificacion",
        title: "Curso Alturas Res. 4272",
        code: "ALT-4272-ESP",
        module_path: "trabajo-en-alturas",
        subject_name: "Carlos Alberto Restrepo",
        subject_document: "1088294102",
        subject_job_title: "Operador de Poda y Cosecha Alta",
        farm_id: farmId.esperanza,
        due_date: addDays(today, -4),
        workflow_status: "open",
        responsible_name: "Ing. Andrés Valencia",
        responsible_role: "Coord. SG-SST",
        external_entity: "IPS Salud del Eje",
        phone: "3127894561",
        notes: "Recertificación vencida — bloqueo operativo sugerido.",
      },
      {
        folio: "ALT-2026-002",
        record_type: "examen_medico",
        title: "EMO Periódico Colinesterasa",
        code: "SAL-EMO-202",
        module_path: "examenes-medicos-ocupacionales",
        subject_name: "Marta Liliana Gómez",
        subject_document: "42883912",
        subject_job_title: "Manipuladora de Agroquímicos",
        farm_id: farmId.sanjose,
        due_date: addDays(today, -2),
        workflow_status: "open",
        responsible_name: "Dra. Carolina Hoyos",
        responsible_role: "Médico Laboral",
        external_entity: "Laboratorio Clínico Sanitas",
        phone: "3104561234",
        notes: "Riesgo químico III.",
      },
      {
        folio: "ALT-2026-003",
        record_type: "incapacidad",
        title: "Incapacidad EPS sin Cierre",
        code: "INC-EPS-081",
        module_path: "incapacidades-y-reintegros",
        subject_name: "Javier Darío Bedoya",
        subject_document: "71399421",
        subject_job_title: "Tractorista Operador 4x4",
        farm_id: farmId.paraiso,
        due_date: addDays(today, 0),
        workflow_status: "pending_closure",
        responsible_name: "Dra. Carolina Hoyos",
        responsible_role: "Gestión Médica",
        external_entity: "EPS Sura / AFP Porvenir",
        phone: "3159988771",
        notes: "Sin concepto de rehabilitación.",
      },
      {
        folio: "ALT-2026-004",
        record_type: "restriccion",
        title: "Restricción Ergonómica",
        code: "CST-SVE-014",
        module_path: "casos-de-salud",
        subject_name: "Hernando Zuluaga",
        subject_document: "15982001",
        subject_job_title: "Recolector Manual",
        farm_id: farmId.bellavista,
        due_date: addDays(today, 6),
        workflow_status: "pending_implementation",
        responsible_name: "Sup. Ramón Vélez",
        responsible_role: "Jefe Cuadrilla",
        external_entity: "ARL Positiva",
        phone: "3116549870",
        notes: "Carga máxima 12 kg.",
      },
      {
        folio: "ALT-2026-005",
        record_type: "epp",
        title: "Entrega EPP Calzado Dieléctrico",
        code: "EPP-CAL-41",
        module_path: "epp",
        subject_name: "Yeison Faber Murillo",
        subject_document: "1115890212",
        subject_job_title: "Técnico de Riego y Motores",
        farm_id: farmId.esperanza,
        due_date: addDays(today, 9),
        workflow_status: "pending_delivery",
        responsible_name: "Almacén General",
        responsible_role: "Bodega Ppal",
        external_entity: "Proveedor Seguridad Industrial SAS",
        phone: "3142201948",
        notes: "Ciclo cuatrimestral ASTM F2413.",
      },
      {
        folio: "ALT-2026-006",
        record_type: "inspeccion",
        title: "Inspección Frenos & Vuelco",
        code: "INS-MQ-04",
        module_path: "inspecciones",
        subject_name: "Tractor JD-5075E (EQ-04)",
        subject_document: "EQ-04",
        subject_job_title: "Tractor Agrícola 75HP",
        farm_id: farmId.paraiso,
        due_date: addDays(today, 15),
        workflow_status: "open",
        responsible_name: "Sup. Campo",
        responsible_role: "Mantenimiento",
        external_entity: "Taller Mecánico Central Agro",
        phone: "3187765412",
        notes: "Check ROPS / fugas.",
      },
      {
        folio: "ALT-2026-007",
        record_type: "accion_correctiva",
        title: "Acción Correctiva COPASST",
        code: "CAPA-2024-18",
        module_path: "acciones-correctivas",
        subject_name: "Bodega de Químicos Ppal",
        subject_document: "Acta 09-2024",
        subject_job_title: "Bodega Agroquímicos",
        farm_id: farmId.sanjose,
        due_date: addDays(today, -3),
        workflow_status: "in_progress",
        responsible_name: "Ing. Andrés Valencia",
        responsible_role: "Infraestructura",
        external_entity: "COPASST Grupo Manzanares",
        phone: "3001234567",
        notes: "Instalación ducha lavaojos.",
      },
      {
        folio: "ALT-2026-008",
        record_type: "curso",
        title: "Inducción SST Anual",
        code: "CUR-IND-11",
        module_path: "capacitaciones",
        subject_name: "Pedro Gómez",
        subject_document: "1020304050",
        subject_job_title: "Operador Tractor",
        farm_id: farmId.paraiso,
        due_date: addDays(today, -10),
        workflow_status: "open",
        responsible_name: "Coord. Formación",
        responsible_role: "Campus SST",
        external_entity: null,
        phone: "3001112233",
        notes: "Curso vencido.",
      },
      {
        folio: "ALT-2026-009",
        record_type: "curso",
        title: "Primeros Auxilios Básico",
        code: "CUR-PAX-02",
        module_path: "capacitaciones",
        subject_name: "Ana Lucía Ríos",
        subject_document: "52100300",
        subject_job_title: "Auxiliar Empaque",
        farm_id: farmId.esperanza,
        due_date: addDays(today, 18),
        workflow_status: "open",
        responsible_name: "Coord. Formación",
        responsible_role: "Campus SST",
        external_entity: null,
        phone: "3002223344",
        notes: "Próximo a vencer.",
      },
      {
        folio: "ALT-2026-010",
        record_type: "examen_medico",
        title: "EMO Ingreso",
        code: "SAL-EMO-310",
        module_path: "examenes-medicos-ocupacionales",
        subject_name: "Luis Fernando Quintero",
        subject_document: "1098765432",
        subject_job_title: "Ayudante de Campo",
        farm_id: farmId.bellavista,
        due_date: addDays(today, 22),
        workflow_status: "open",
        responsible_name: "Dra. Carolina Hoyos",
        responsible_role: "Médico Laboral",
        external_entity: "IPS Salud del Eje",
        phone: "3003334455",
        notes: "Programar cita.",
      },
      {
        folio: "ALT-2026-011",
        record_type: "reintegro",
        title: "Reintegro Laboral Post-Incapacidad",
        code: "REI-2026-03",
        module_path: "incapacidades-y-reintegros",
        subject_name: "Gloria Patricia Mejía",
        subject_document: "43567890",
        subject_job_title: "Clasificadora",
        farm_id: farmId.esperanza,
        due_date: addDays(today, 12),
        workflow_status: "open",
        responsible_name: "Talento Humano",
        responsible_role: "Reintegros",
        external_entity: "ARL Sura",
        phone: "3004445566",
        notes: "Pendiente evaluación de puesto.",
      },
      {
        folio: "ALT-2026-012",
        record_type: "investigacion",
        title: "Investigación Incidente Casi-AT",
        code: "INV-1401-07",
        module_path: "investigaciones",
        subject_name: "Cuadrilla Cosecha Norte",
        subject_document: "INC-2026-12",
        subject_job_title: "Evento de campo",
        farm_id: farmId.sanjose,
        due_date: addDays(today, 5),
        workflow_status: "in_progress",
        responsible_name: "Ing. Andrés Valencia",
        responsible_role: "Investigador SST",
        external_entity: "ARL Sura",
        phone: "3005556677",
        notes: "Plazo Res. 1401.",
      },
      {
        folio: "ALT-2026-013",
        record_type: "documento",
        title: "Matriz de Peligros v3",
        code: "DOC-MP-03",
        module_path: "documentos-sg-sst",
        subject_name: "Sistema Documental SG-SST",
        subject_document: "DOC-MP-03",
        subject_job_title: "Documento maestro",
        farm_id: farmId.esperanza,
        due_date: addDays(today, 40),
        workflow_status: "open",
        responsible_name: "Coord. SG-SST",
        responsible_role: "Documental",
        external_entity: null,
        phone: null,
        notes: "Revisión anual.",
      },
      {
        folio: "ALT-2026-014",
        record_type: "documento",
        title: "Plan de Emergencias",
        code: "DOC-PE-01",
        module_path: "documentos-sg-sst",
        subject_name: "Sistema Documental SG-SST",
        subject_document: "DOC-PE-01",
        subject_job_title: "Documento maestro",
        farm_id: null,
        due_date: addDays(today, -15),
        workflow_status: "open",
        responsible_name: "Coord. SG-SST",
        responsible_role: "Documental",
        external_entity: null,
        phone: null,
        notes: "Revisión vencida.",
      },
      {
        folio: "ALT-2026-015",
        record_type: "licencia",
        title: "Licencia Conducción C2 / PESV",
        code: "PESV-LIC-19",
        module_path: "pesv",
        subject_name: "Héctor Fabio Ramírez",
        subject_document: "71234567",
        subject_job_title: "Conductor de Campo",
        farm_id: farmId.paraiso,
        due_date: addDays(today, 25),
        workflow_status: "open",
        responsible_name: "Coord. PESV",
        responsible_role: "Seguridad Vial",
        external_entity: "Ministerio de Transporte",
        phone: "3006667788",
        notes: "Renovación próxima.",
      },
      {
        folio: "ALT-2026-016",
        record_type: "certificacion",
        title: "Aptitud Operador Tractor",
        code: "CERT-TRAC-08",
        module_path: "trabajo-en-alturas",
        subject_name: "José Gildardo Morales",
        subject_document: "98456123",
        subject_job_title: "Operador Tractor C-65",
        farm_id: farmId.sanjose,
        due_date: addDays(today, 45),
        workflow_status: "open",
        responsible_name: "Médico Laboral",
        responsible_role: "Aptitud",
        external_entity: "IPS Salud del Eje",
        phone: "3007778899",
        notes: "Seguimiento preventivo.",
      },
      {
        folio: "ALT-2026-017",
        record_type: "epp",
        title: "Reposición Guantes Químicos",
        code: "EPP-GUA-12",
        module_path: "epp",
        subject_name: "Cuadrilla Fitosanitarios",
        subject_document: "EPP-LOT-12",
        subject_job_title: "Aplicadores",
        farm_id: farmId.esperanza,
        due_date: addDays(today, 55),
        workflow_status: "open",
        responsible_name: "Almacén General",
        responsible_role: "Dotación",
        external_entity: null,
        phone: null,
        notes: "Vida útil en seguimiento.",
      },
      {
        folio: "ALT-2026-018",
        record_type: "incapacidad",
        title: "Incapacidad AT leve",
        code: "INC-AT-015",
        module_path: "incapacidades-y-reintegros",
        subject_name: "Sebastián Cano",
        subject_document: "1012345678",
        subject_job_title: "Ayudante Empaque",
        farm_id: farmId.bellavista,
        due_date: addDays(today, 28),
        workflow_status: "open",
        responsible_name: "Dra. Carolina Hoyos",
        responsible_role: "Gestión Médica",
        external_entity: "ARL Sura",
        phone: "3008889900",
        notes: "Próxima a vencer.",
      },
    ];

    for (const seed of seeds) {
      await sql`
        INSERT INTO campus_sst.sst_compliance_records (
          folio, record_type, title, code, module_path,
          subject_name, subject_document, subject_job_title, farm_id,
          due_date, workflow_status, responsible_name, responsible_role,
          external_entity, phone, notes
        ) VALUES (
          ${seed.folio},
          ${seed.record_type},
          ${seed.title},
          ${seed.code},
          ${seed.module_path},
          ${seed.subject_name},
          ${seed.subject_document},
          ${seed.subject_job_title},
          ${seed.farm_id},
          ${seed.due_date},
          ${seed.workflow_status},
          ${seed.responsible_name},
          ${seed.responsible_role},
          ${seed.external_entity},
          ${seed.phone},
          ${seed.notes}
        )
        ON CONFLICT (folio) DO NOTHING
      `;
    }
  }

  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'campus_sst'
      AND table_name IN (
        'sst_farms',
        'sst_alert_settings',
        'sst_compliance_records',
        'sst_alert_actions'
      )
    ORDER BY table_name
  `;
  const count = await sql`SELECT COUNT(*)::int AS count FROM campus_sst.sst_compliance_records`;
  console.log("Migración Alertas SST aplicada.");
  console.log("Tablas:", tables.map((row) => row.table_name).join(", "));
  console.log("Registros de cumplimiento:", count[0]?.count ?? 0);
} finally {
  await sql.end({ timeout: 5 });
}
