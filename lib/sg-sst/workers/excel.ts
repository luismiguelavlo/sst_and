import {
  isDocumentType,
  isRiskLevel,
  isWorkerStatus,
  type DocumentType,
  type SstWorker,
  type SstWorkerDraft,
  type WorkerStatus,
} from "@/lib/sg-sst/workers/types";

export const WORKER_EXCEL_MAX_ROWS = 1000;

export type WorkerExcelImportRow = {
  rowNumber: number;
  draft: SstWorkerDraft;
  farmNameOrCode: string;
};

export type WorkerExcelImportResultRow = {
  rowNumber: number;
  workerCode: string;
  fullName: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
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
  workCenter: ["centro_trabajo_texto", "work_center", "lugar_trabajo"],
  farm: [
    "finca",
    "predio",
    "farm",
    "centro_de_trabajo",
    "centro_trabajo",
    "centro",
    "sede",
  ],
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

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "_");
}

function mapHeaders(headers: readonly string[]): Partial<Record<string, number>> {
  const map: Partial<Record<string, number>> = {};
  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      if (map[field] !== undefined) continue; // primera columna gana
      if (aliases.map(normalizeHeader).includes(normalized)) {
        map[field] = index;
        break;
      }
    }
  });
  return map;
}

function cell(row: readonly string[], index: number | undefined): string {
  if (index === undefined) return "";
  return (row[index] ?? "").trim();
}

/** Excel a veces manda cédulas como 1088294102.0 o notación científica. */
function normalizeDocumentNumber(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^\d+\.0+$/.test(trimmed)) return trimmed.replace(/\.0+$/, "");
  if (/^\d+(\.\d+)?e\+?\d+$/i.test(trimmed)) {
    const n = Number(trimmed);
    if (Number.isFinite(n) && n > 0) return String(Math.round(n));
  }
  return trimmed.replace(/\s+/g, "");
}

function parseBool(value: string): boolean {
  const v = value.trim().toLowerCase();
  return ["si", "sí", "yes", "true", "1", "x"].includes(v);
}

function parseDate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
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
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return trimmed;
}

function parseStatus(value: string): WorkerStatus {
  const v = value.trim().toLowerCase();
  if (!v) return "activo";
  if (["retirado", "retired", "inactivo", "baja"].includes(v)) return "retirado";
  if (isWorkerStatus(v)) return v;
  return "activo";
}

function parseDocType(value: string): DocumentType {
  const v = value.trim().toUpperCase();
  if (isDocumentType(v)) return v;
  return "CC";
}

function parseRisk(value: string): 1 | 2 | 3 | 4 | 5 {
  const n = Number(value.replace(/\D/g, "")) || 4;
  return isRiskLevel(n) ? n : 4;
}

export function workerRowsFromMatrix(
  matrix: readonly (readonly string[])[],
): WorkerExcelImportRow[] {
  if (matrix.length === 0) return [];
  const headerMap = mapHeaders(matrix[0] ?? []);
  if (headerMap.fullName === undefined && headerMap.documentNumber === undefined) {
    throw new Error(
      "El Excel debe incluir al menos nombre_completo (o nombre) o numero_identificacion (o cedula).",
    );
  }

  const rows: WorkerExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index] ?? [];
    const fullName = cell(raw, headerMap.fullName);
    const documentNumber = normalizeDocumentNumber(
      cell(raw, headerMap.documentNumber),
    );
    if (!fullName && !documentNumber) continue;

    const status = parseStatus(cell(raw, headerMap.status));
    const draft: SstWorkerDraft = {
      workerCode: cell(raw, headerMap.workerCode) || undefined,
      fullName,
      documentType: parseDocType(cell(raw, headerMap.documentType)),
      documentNumber,
      company: cell(raw, headerMap.company) || "Grupo Manzanares S.A.S.",
      jobTitle: cell(raw, headerMap.jobTitle) || "Operario",
      area: cell(raw, headerMap.area) || "",
      workCenter: cell(raw, headerMap.workCenter) || "",
      supervisorName: cell(raw, headerMap.supervisorName) || "",
      hireDate: parseDate(cell(raw, headerMap.hireDate)) || null,
      contractType: cell(raw, headerMap.contractType) || "",
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
      retirementDate: parseDate(cell(raw, headerMap.retirementDate)) || null,
      retirementReason: cell(raw, headerMap.retirementReason) || null,
      farmId: null,
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      farmNameOrCode: cell(raw, headerMap.farm),
    });
  }
  return rows;
}

export function buildWorkerExportRows(workers: readonly SstWorker[]): Record<string, string | number>[] {
  return workers.map((worker) => ({
    id_trabajador: worker.workerCode,
    nombre_completo: worker.fullName,
    tipo_documento: worker.documentType,
    numero_identificacion: worker.documentNumber,
    empresa: worker.company,
    cargo: worker.jobTitle,
    area: worker.area,
    centro_trabajo: worker.workCenter,
    finca: worker.farmName ?? "",
    centro_de_trabajo: worker.farmName ?? "",
    jefe_inmediato: worker.supervisorName,
    fecha_ingreso: worker.hireDate ?? "",
    tipo_contrato: worker.contractType,
    estado: worker.status,
    nivel_riesgo: worker.riskLevel,
    trabajo_en_alturas: worker.worksHeights ? "Sí" : "No",
    conduce: worker.drives ? "Sí" : "No",
    opera_tractor: worker.operatesTractor ? "Sí" : "No",
    manipula_quimicos: worker.handlesChemicals ? "Sí" : "No",
    brigada: worker.inBrigade ? "Sí" : "No",
    copasst: worker.inCopasst ? "Sí" : "No",
    ccl: worker.inCcl ? "Sí" : "No",
    telefono: worker.phone,
    correo: worker.email,
    observaciones: worker.observations,
    fecha_retiro: worker.retirementDate ?? "",
    motivo_retiro: worker.retirementReason ?? "",
  }));
}

export function buildWorkerTemplateRows(): Record<string, string | number>[] {
  return [
    {
      id_trabajador: "MNZ-0001",
      nombre_completo: "Carlos Alberto Restrepo Gómez",
      tipo_documento: "CC",
      numero_identificacion: "1088294102",
      empresa: "Grupo Manzanares S.A.S.",
      cargo: "Operador de Cosecha y Poda de Altura",
      area: "Campo y Producción Agrícola",
      centro_trabajo: "Sede Rural Occidente (Valle Central)",
      finca: "Planta Principal",
      centro_de_trabajo: "Planta Principal",
      jefe_inmediato: "Sup. Ramón Vélez",
      fecha_ingreso: "2021-01-15",
      tipo_contrato: "Término Fijo (Renovable)",
      estado: "activo",
      nivel_riesgo: 4,
      trabajo_en_alturas: "Sí",
      conduce: "No",
      opera_tractor: "No",
      manipula_quimicos: "No",
      brigada: "Sí",
      copasst: "No",
      ccl: "No",
      telefono: "3127894561",
      correo: "carlos.restrepo@ejemplo.com",
      observaciones: "Fila de ejemplo — reemplazar",
      fecha_retiro: "",
      motivo_retiro: "",
    },
  ];
}
