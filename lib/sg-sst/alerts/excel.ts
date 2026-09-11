import {
  isSstRecordType,
  isSstWorkflowStatus,
  RECORD_TYPE_META,
  SST_RECORD_TYPES,
  type SstAlertView,
  type SstRecordDraft,
  type SstRecordType,
  type SstWorkflowStatus,
} from "@/lib/sg-sst/alerts/types";

export const SST_EXCEL_MAX_ROWS = 500;

export type SstExcelImportRow = {
  rowNumber: number;
  draft: SstRecordDraft;
  farmNameOrCode: string;
};

export type SstExcelImportResultRow = {
  rowNumber: number;
  code: string;
  title: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  recordType: ["tipo", "tipo_registro", "record_type", "recordtype", "modulo"],
  title: ["titulo", "título", "title", "nombre_registro", "alerta"],
  code: ["codigo", "código", "code", "cod"],
  subjectName: ["sujeto", "trabajador", "nombre", "subject_name", "empleado"],
  subjectDocument: ["documento", "cedula", "cédula", "identificacion", "identificación", "cc"],
  subjectJobTitle: ["cargo", "puesto", "job_title", "oficio"],
  farm: ["finca", "predio", "farm", "sede", "centro"],
  dueDate: [
    "fecha_vencimiento",
    "vencimiento",
    "due_date",
    "vence",
    "fecha_limite",
    "fecha_límite",
  ],
  issuedAt: ["fecha_emision", "fecha_emisión", "emision", "issued_at", "fecha_inicio"],
  workflowStatus: ["estado", "status", "workflow_status", "estado_flujo"],
  responsibleName: ["responsable", "responsible", "responsable_nombre"],
  responsibleRole: ["rol_responsable", "cargo_responsable", "responsible_role"],
  externalEntity: ["entidad", "entidad_externa", "ips", "arl", "external_entity"],
  phone: ["telefono", "teléfono", "celular", "phone", "whatsapp"],
  notes: ["notas", "observaciones", "notes", "detalle"],
};

const WORKFLOW_ALIASES: Record<string, SstWorkflowStatus> = {
  abierto: "open",
  open: "open",
  "en proceso": "in_progress",
  "en_proceso": "in_progress",
  in_progress: "in_progress",
  "pendiente implementacion": "pending_implementation",
  "pendiente_implementacion": "pending_implementation",
  pending_implementation: "pending_implementation",
  "pendiente entrega": "pending_delivery",
  "pendiente_entrega": "pending_delivery",
  pending_delivery: "pending_delivery",
  "pendiente cierre": "pending_closure",
  "pendiente_cierre": "pending_closure",
  pending_closure: "pending_closure",
  cerrado: "closed",
  closed: "closed",
  cancelado: "cancelled",
  cancelled: "cancelled",
};

const TYPE_ALIASES: Record<string, SstRecordType> = Object.fromEntries(
  SST_RECORD_TYPES.flatMap((type) => {
    const label = RECORD_TYPE_META[type].label
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "");
    return [
      [type, type],
      [label, type],
      [label.replaceAll(" ", "_"), type],
    ];
  }),
) as Record<string, SstRecordType>;

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "_");
}

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function mapHeaders(headers: readonly string[]): Partial<Record<string, number>> {
  const map: Partial<Record<string, number>> = {};
  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      if (aliases.map(normalizeHeader).includes(normalized)) {
        map[field] = index;
      }
    }
  });
  return map;
}

function cellValue(row: readonly string[], index: number | undefined): string {
  if (index === undefined) {
    return "";
  }
  return (row[index] ?? "").trim();
}

function excelDateToIso(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  // Excel serial date
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const serial = Number(trimmed);
    if (Number.isFinite(serial) && serial > 20000) {
      const epoch = new Date(Date.UTC(1899, 11, 30));
      epoch.setUTCDate(epoch.getUTCDate() + Math.floor(serial));
      return epoch.toISOString().slice(0, 10);
    }
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  // dd/mm/yyyy
  const match = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) {
    const [, d, m, y] = match;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return trimmed;
}

function parseRecordType(raw: string, fallback: SstRecordType): SstRecordType {
  if (!raw.trim()) {
    return fallback;
  }
  const key = normalizeKey(raw).replaceAll(" ", "_");
  if (TYPE_ALIASES[key]) {
    return TYPE_ALIASES[key];
  }
  if (isSstRecordType(key)) {
    return key;
  }
  throw new Error(`Tipo de registro no reconocido: "${raw}"`);
}

function parseWorkflowStatus(raw: string): SstWorkflowStatus {
  if (!raw.trim()) {
    return "open";
  }
  const key = normalizeKey(raw);
  const mapped = WORKFLOW_ALIASES[key] ?? WORKFLOW_ALIASES[key.replaceAll(" ", "_")];
  if (mapped) {
    return mapped;
  }
  if (isSstWorkflowStatus(raw.trim())) {
    return raw.trim() as SstWorkflowStatus;
  }
  throw new Error(`Estado no reconocido: "${raw}"`);
}

export function complianceRowsFromMatrix(
  matrix: readonly (readonly string[])[],
  options: {
    allowedTypes: readonly SstRecordType[];
    defaultType: SstRecordType;
  },
): SstExcelImportRow[] {
  if (matrix.length === 0) {
    return [];
  }
  const headerMap = mapHeaders(matrix[0] ?? []);
  if (headerMap.title === undefined || headerMap.code === undefined || headerMap.subjectName === undefined) {
    throw new Error(
      "El Excel debe incluir columnas: titulo, codigo y sujeto (o trabajador).",
    );
  }

  const rows: SstExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index] ?? [];
    const title = cellValue(raw, headerMap.title);
    const code = cellValue(raw, headerMap.code);
    const subjectName = cellValue(raw, headerMap.subjectName);
    if (!title && !code && !subjectName) {
      continue;
    }

    const recordType = parseRecordType(
      cellValue(raw, headerMap.recordType),
      options.defaultType,
    );
    if (!options.allowedTypes.includes(recordType)) {
      throw new Error(
        `Fila ${index + 1}: el tipo "${recordType}" no pertenece a este módulo.`,
      );
    }

    const draft: SstRecordDraft = {
      recordType,
      title,
      code,
      subjectName,
      subjectDocument: cellValue(raw, headerMap.subjectDocument) || undefined,
      subjectJobTitle: cellValue(raw, headerMap.subjectJobTitle) || undefined,
      dueDate: excelDateToIso(cellValue(raw, headerMap.dueDate)) || null,
      issuedAt: excelDateToIso(cellValue(raw, headerMap.issuedAt)) || null,
      workflowStatus: parseWorkflowStatus(cellValue(raw, headerMap.workflowStatus)),
      responsibleName: cellValue(raw, headerMap.responsibleName) || undefined,
      responsibleRole: cellValue(raw, headerMap.responsibleRole) || undefined,
      externalEntity: cellValue(raw, headerMap.externalEntity) || undefined,
      phone: cellValue(raw, headerMap.phone) || undefined,
      notes: cellValue(raw, headerMap.notes) || undefined,
      farmId: null,
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      farmNameOrCode: cellValue(raw, headerMap.farm),
    });
  }
  return rows;
}

export function buildComplianceExportRows(
  records: readonly SstAlertView[],
): Record<string, string | number>[] {
  return records.map((record) => ({
    folio: record.folio,
    tipo: record.recordType,
    titulo: record.title,
    codigo: record.code,
    sujeto: record.subjectName,
    documento: record.subjectDocument ?? "",
    cargo: record.subjectJobTitle ?? "",
    finca: record.farmName ?? "",
    fecha_vencimiento: record.dueDate ?? "",
    fecha_emision: record.issuedAt ?? "",
    estado: record.workflowStatus,
    semaforo: record.semaphore,
    dias_restantes: record.daysRemaining ?? "",
    responsable: record.responsibleName ?? "",
    rol_responsable: record.responsibleRole ?? "",
    entidad: record.externalEntity ?? "",
    telefono: record.phone ?? "",
    notas: record.notes,
    alertas: record.alertKinds.join("; "),
  }));
}

export function buildComplianceTemplateRows(
  defaultType: SstRecordType,
): Record<string, string>[] {
  return [
    {
      tipo: defaultType,
      titulo: "Ejemplo de registro SST",
      codigo: "EJEMPLO-001",
      sujeto: "Nombre del trabajador",
      documento: "1234567890",
      cargo: "Operario",
      finca: "Finca La Esperanza",
      fecha_vencimiento: "2026-12-31",
      fecha_emision: "2026-01-15",
      estado: "open",
      responsable: "Coord. SG-SST",
      rol_responsable: "Responsable SST",
      entidad: "IPS / ARL",
      telefono: "3001234567",
      notas: "Fila de ejemplo — reemplazar con datos reales",
    },
  ];
}

export const SST_EXCEL_TEMPLATE_HEADERS = [
  "tipo",
  "titulo",
  "codigo",
  "sujeto",
  "documento",
  "cargo",
  "finca",
  "fecha_vencimiento",
  "fecha_emision",
  "estado",
  "responsable",
  "rol_responsable",
  "entidad",
  "telefono",
  "notas",
] as const;
