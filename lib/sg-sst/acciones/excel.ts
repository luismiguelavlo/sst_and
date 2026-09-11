import {
  ACTION_EFFICACY_LABELS,
  ACTION_KIND_LABELS,
  ACTION_SOURCE_LABELS,
  ACTION_STATUS_LABELS,
  parseActionKindLabel,
  parseActionStatusLabel,
  parseEfficacyLabel,
  parseSourceTypeLabel,
  toManualStatus,
  type ActionManualStatus,
  type SstCorrectiveActionDraft,
  type SstCorrectiveActionView,
} from "@/lib/sg-sst/acciones/types";

export const ACTION_EXCEL_MAX_ROWS = 500;

export type ActionExcelImportRow = {
  rowNumber: number;
  draft: SstCorrectiveActionDraft;
  farmName?: string;
  folio?: string;
};

export type ActionExcelImportResultRow = {
  rowNumber: number;
  folio: string;
  farmRef: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_accion", "id_acción", "id"],
  sourceType: ["fuente", "origen", "source_type", "source"],
  sourceRef: [
    "referencia",
    "ref_fuente",
    "source_ref",
    "referencia_fuente",
    "folio_origen",
  ],
  finding: ["hallazgo", "finding", "no_conformidad", "causa"],
  actionPlan: [
    "accion",
    "acción",
    "plan_accion",
    "plan_acción",
    "action_plan",
    "plan",
  ],
  actionKind: ["tipo", "tipo_accion", "tipo_acción", "action_kind", "clase"],
  responsibleName: ["responsable", "lider", "líder", "responsible_name"],
  commitDate: [
    "fecha_compromiso",
    "compromiso",
    "commit_date",
    "plazo",
    "fecha_limite",
  ],
  closedAt: ["fecha_cierre", "cierre", "closed_at"],
  status: ["estado", "status"],
  evidenceUrl: ["documento", "evidencia", "url_evidencia", "evidence_url", "pdf"],
  evidenceName: ["nombre_evidencia", "archivo", "evidence_name"],
  efficacyStatus: [
    "eficacia",
    "verificacion_eficacia",
    "verificación_eficacia",
    "efficacy_status",
  ],
  observations: ["observaciones", "notas", "observations"],
  farm: ["finca", "sede", "farm", "centro_trabajo"],
};

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function cellValue(row: string[], index: number | undefined): string {
  if (index === undefined) return "";
  return (row[index] ?? "").toString().trim();
}

function excelDateToIso(raw: string): string {
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }
  return raw;
}

function mapHeaders(
  headerRow: string[],
): Partial<Record<keyof typeof HEADER_ALIASES, number>> {
  const map: Partial<Record<keyof typeof HEADER_ALIASES, number>> = {};
  headerRow.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    for (const [key, aliases] of Object.entries(HEADER_ALIASES) as [
      keyof typeof HEADER_ALIASES,
      readonly string[],
    ][]) {
      if (aliases.some((alias) => normalizeHeader(alias) === normalized)) {
        map[key] = index;
      }
    }
  });
  return map;
}

function toManualStatusFromParsed(raw: string): ActionManualStatus {
  const parsed = parseActionStatusLabel(raw);
  if (parsed) return toManualStatus(parsed);
  return "en_ejecucion";
}

export function actionRowsFromMatrix(matrix: string[][]): ActionExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0]);
  if (headerMap.sourceType === undefined) {
    throw new Error("Falta la columna fuente / origen.");
  }
  if (headerMap.finding === undefined) {
    throw new Error("Falta la columna hallazgo.");
  }
  if (headerMap.actionPlan === undefined) {
    throw new Error("Falta la columna plan de acción.");
  }
  if (headerMap.responsibleName === undefined) {
    throw new Error("Falta la columna responsable.");
  }
  if (headerMap.commitDate === undefined) {
    throw new Error("Falta la columna fecha_compromiso.");
  }

  const rows: ActionExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const sourceType = parseSourceTypeLabel(cellValue(raw, headerMap.sourceType));
    const finding = cellValue(raw, headerMap.finding);
    const actionPlan = cellValue(raw, headerMap.actionPlan);
    const responsibleName = cellValue(raw, headerMap.responsibleName);
    const commitDate = excelDateToIso(cellValue(raw, headerMap.commitDate));

    if (!finding && !actionPlan && !responsibleName) continue;
    if (!sourceType) {
      throw new Error(`Fila ${index + 1}: fuente / origen inválido.`);
    }

    const kindRaw = cellValue(raw, headerMap.actionKind);
    const actionKind = kindRaw
      ? parseActionKindLabel(kindRaw)
      : ("correctiva" as const);
    if (!actionKind) {
      throw new Error(`Fila ${index + 1}: tipo de acción inválido.`);
    }

    const efficacyRaw = cellValue(raw, headerMap.efficacyStatus);
    const efficacyStatus = efficacyRaw
      ? parseEfficacyLabel(efficacyRaw)
      : ("pendiente" as const);
    if (!efficacyStatus) {
      throw new Error(`Fila ${index + 1}: estado de eficacia inválido.`);
    }

    const draft: SstCorrectiveActionDraft = {
      sourceType,
      sourceRef: cellValue(raw, headerMap.sourceRef),
      finding,
      actionPlan,
      actionKind,
      responsibleName,
      commitDate,
      closedAt: excelDateToIso(cellValue(raw, headerMap.closedAt)) || null,
      status: toManualStatusFromParsed(cellValue(raw, headerMap.status)),
      evidenceUrl: cellValue(raw, headerMap.evidenceUrl),
      evidenceName: cellValue(raw, headerMap.evidenceName),
      efficacyStatus,
      observations: cellValue(raw, headerMap.observations),
      farmId: null,
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      farmName: cellValue(raw, headerMap.farm) || undefined,
      folio: cellValue(raw, headerMap.folio) || undefined,
    });
  }
  return rows;
}

export function buildActionExportRows(
  items: readonly SstCorrectiveActionView[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    fuente: ACTION_SOURCE_LABELS[item.sourceType],
    referencia: item.sourceRef,
    hallazgo: item.finding,
    plan_accion: item.actionPlan,
    tipo: ACTION_KIND_LABELS[item.actionKind],
    responsable: item.responsibleName,
    fecha_compromiso: item.commitDate,
    fecha_cierre: item.closedAt ?? "",
    estado: ACTION_STATUS_LABELS[item.effectiveStatus],
    eficacia: ACTION_EFFICACY_LABELS[item.efficacyStatus],
    finca: item.farmName ?? "",
    observaciones: item.observations,
    evidencia_url: item.evidenceUrl,
    evidencia_nombre: item.evidenceName,
    dias_restantes: item.daysRemaining ?? "",
  }));
}

export function buildActionTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      fuente: "Inspección",
      referencia: "INS-2026-001",
      hallazgo: "Extintor sin señalización en taller central.",
      plan_accion: "Instalar señalización y verificar carga del extintor.",
      tipo: "Correctiva",
      responsable: "Coord. SG-SST",
      fecha_compromiso: "2026-04-15",
      fecha_cierre: "",
      estado: "En ejecución",
      eficacia: "Pendiente",
      finca: "",
      observaciones: "Derivado de inspección locativa semanal.",
      evidencia_url: "",
      evidencia_nombre: "",
    },
  ];
}
