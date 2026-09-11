import {
  PESV_AUTH_LABELS,
  PESV_FITNESS_LABELS,
  PESV_PREOP_STATUS_LABELS,
  PESV_VEHICLE_STATUS_LABELS,
  parseFitnessLabel,
  parseVehicleStatusLabel,
  parseYesNo,
  type SstPesvDriver,
  type SstPesvDriverDraft,
  type SstPesvPreop,
  type SstPesvVehicle,
  type SstPesvVehicleDraft,
} from "@/lib/sg-sst/pesv/types";

export const PESV_EXCEL_MAX_ROWS = 500;

export type PesvDriverExcelImportRow = {
  rowNumber: number;
  draft: SstPesvDriverDraft;
  workerDocumentOrCode: string;
  vehiclePlate?: string;
  folio?: string;
};

export type PesvVehicleExcelImportRow = {
  rowNumber: number;
  draft: SstPesvVehicleDraft;
  responsibleDocumentOrCode?: string;
  plateKey: string;
};

export type PesvExcelImportResultRow = {
  rowNumber: number;
  key: string;
  status: "created" | "updated" | "error";
  message: string;
  id?: string;
};

const DRIVER_HEADER_ALIASES: Record<string, readonly string[]> = {
  folio: ["folio", "codigo", "código", "id_pesv"],
  worker: [
    "trabajador",
    "documento",
    "cedula",
    "cédula",
    "id_trabajador",
    "worker_code",
    "identificacion",
  ],
  vehiclePlate: ["placa", "placa_vehiculo", "plate"],
  vehicleType: ["tipo_vehiculo", "tipo_vehículo", "tipo"],
  licenseCategory: ["categoria", "categoría", "cat_licencia", "license_category"],
  licenseDueDate: [
    "vencimiento_licencia",
    "licencia_vence",
    "license_due",
    "vencimiento",
  ],
  courseDate: ["curso_fecha", "curso_seguridad", "road_safety_course_date"],
  courseDue: ["curso_vence", "curso_vencimiento", "road_safety_course_due"],
  medicalExamDate: ["examen_medico", "examen_médico", "emo_fecha", "medical_exam"],
  fitness: ["aptitud", "concepto", "fitness", "fitness_concept"],
  observations: ["observaciones", "notas", "observations"],
};

const VEHICLE_HEADER_ALIASES: Record<string, readonly string[]> = {
  plate: ["placa", "plate"],
  vehicleType: ["tipo", "tipo_vehiculo", "tipo_vehículo", "vehicle_type"],
  brand: ["marca", "brand"],
  model: ["modelo", "model"],
  responsible: [
    "responsable",
    "documento_responsable",
    "responsible",
    "cedula_responsable",
  ],
  workCenter: ["centro_trabajo", "sede", "work_center"],
  status: ["estado", "status"],
  soatDueDate: ["soat", "soat_vence", "soat_due"],
  rtmDueDate: ["rtm", "tecnomecanica", "tecnomecánica", "rtm_due"],
  insuranceDueDate: ["poliza", "póliza", "seguro", "insurance_due"],
  odometerKm: ["km", "odometro", "odómetro", "odometer"],
  kitOk: ["kit", "kit_ok", "botiquin"],
  extinguisherOk: ["extintor", "extinguisher", "extinguisher_ok"],
  observations: ["observaciones", "notas"],
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
  aliases: Record<string, readonly string[]>,
): Partial<Record<string, number>> {
  const map: Partial<Record<string, number>> = {};
  headerRow.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    for (const [key, list] of Object.entries(aliases)) {
      if (list.some((alias) => normalizeHeader(alias) === normalized)) {
        map[key] = index;
      }
    }
  });
  return map;
}

export function driverRowsFromMatrix(
  matrix: string[][],
): PesvDriverExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], DRIVER_HEADER_ALIASES);
  if (headerMap.worker === undefined) {
    throw new Error("Falta la columna trabajador / documento.");
  }

  const rows: PesvDriverExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const workerRef = cellValue(raw, headerMap.worker);
    if (!workerRef) continue;

    const fitnessRaw = cellValue(raw, headerMap.fitness);
    const fitness = fitnessRaw
      ? parseFitnessLabel(fitnessRaw)
      : "pendiente";
    if (!fitness) {
      throw new Error(`Fila ${index + 1}: concepto de aptitud inválido.`);
    }

    const draft: SstPesvDriverDraft = {
      workerId: "",
      vehicleType: cellValue(raw, headerMap.vehicleType),
      plateSnapshot: cellValue(raw, headerMap.vehiclePlate).toUpperCase(),
      licenseCategory: cellValue(raw, headerMap.licenseCategory),
      licenseDueDate: excelDateToIso(cellValue(raw, headerMap.licenseDueDate)) || null,
      roadSafetyCourseDate:
        excelDateToIso(cellValue(raw, headerMap.courseDate)) || null,
      roadSafetyCourseDue:
        excelDateToIso(cellValue(raw, headerMap.courseDue)) || null,
      medicalExamDate:
        excelDateToIso(cellValue(raw, headerMap.medicalExamDate)) || null,
      fitnessConcept: fitness,
      observations: cellValue(raw, headerMap.observations),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      workerDocumentOrCode: workerRef,
      vehiclePlate: cellValue(raw, headerMap.vehiclePlate) || undefined,
      folio: cellValue(raw, headerMap.folio) || undefined,
    });
  }
  return rows;
}

export function vehicleRowsFromMatrix(
  matrix: string[][],
): PesvVehicleExcelImportRow[] {
  if (matrix.length < 2) {
    throw new Error("El archivo debe tener encabezados y al menos una fila.");
  }
  const headerMap = mapHeaders(matrix[0], VEHICLE_HEADER_ALIASES);
  if (headerMap.plate === undefined) {
    throw new Error("Falta la columna placa.");
  }

  const rows: PesvVehicleExcelImportRow[] = [];
  for (let index = 1; index < matrix.length; index += 1) {
    const raw = matrix[index];
    if (!raw || raw.every((cell) => !String(cell).trim())) continue;

    const plate = cellValue(raw, headerMap.plate).toUpperCase();
    if (!plate) continue;

    const statusRaw = cellValue(raw, headerMap.status);
    const status = statusRaw ? parseVehicleStatusLabel(statusRaw) : "apto";
    if (!status) {
      throw new Error(`Fila ${index + 1}: estado de vehículo inválido.`);
    }

    const kmRaw = cellValue(raw, headerMap.odometerKm);
    const odometerKm = kmRaw ? Number(kmRaw.replace(/[^\d.-]/g, "")) : 0;

    const draft: SstPesvVehicleDraft = {
      plate,
      vehicleType: cellValue(raw, headerMap.vehicleType) || "camioneta",
      brand: cellValue(raw, headerMap.brand),
      model: cellValue(raw, headerMap.model),
      responsibleWorkerId: null,
      workCenter: cellValue(raw, headerMap.workCenter),
      status,
      soatDueDate: excelDateToIso(cellValue(raw, headerMap.soatDueDate)) || null,
      rtmDueDate: excelDateToIso(cellValue(raw, headerMap.rtmDueDate)) || null,
      insuranceDueDate:
        excelDateToIso(cellValue(raw, headerMap.insuranceDueDate)) || null,
      odometerKm: Number.isFinite(odometerKm) ? Math.max(0, odometerKm) : 0,
      kitOk: parseYesNo(cellValue(raw, headerMap.kitOk), true),
      extinguisherOk: parseYesNo(cellValue(raw, headerMap.extinguisherOk), true),
      observations: cellValue(raw, headerMap.observations),
    };

    rows.push({
      rowNumber: index + 1,
      draft,
      responsibleDocumentOrCode:
        cellValue(raw, headerMap.responsible) || undefined,
      plateKey: plate,
    });
  }
  return rows;
}

export function buildDriverExportRows(
  items: readonly SstPesvDriver[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    trabajador: item.workerName,
    documento: item.workerDocument,
    id_trabajador: item.workerCode,
    cargo: item.jobTitleSnapshot,
    empresa: item.companySnapshot,
    finca: item.farmName ?? "",
    tipo_vehiculo: item.vehicleType,
    placa: item.plateSnapshot || item.vehiclePlate || "",
    categoria: item.licenseCategory,
    vencimiento_licencia: item.licenseDueDate ?? "",
    curso_fecha: item.roadSafetyCourseDate ?? "",
    curso_vence: item.roadSafetyCourseDue ?? "",
    examen_medico: item.medicalExamDate ?? "",
    aptitud: PESV_FITNESS_LABELS[item.fitnessConcept],
    autorizacion: PESV_AUTH_LABELS[item.authorizationStatus],
    observaciones: item.observations,
  }));
}

export function buildVehicleExportRows(
  items: readonly SstPesvVehicle[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    placa: item.plate,
    tipo: item.vehicleType,
    marca: item.brand,
    modelo: item.model,
    responsable: item.responsibleName ?? "",
    documento_responsable: item.responsibleDocument ?? "",
    centro_trabajo: item.workCenter,
    finca: item.farmName ?? "",
    estado: PESV_VEHICLE_STATUS_LABELS[item.status],
    soat: item.soatDueDate ?? "",
    rtm: item.rtmDueDate ?? "",
    poliza: item.insuranceDueDate ?? "",
    km: item.odometerKm,
    kit: item.kitOk ? "SI" : "NO",
    extintor: item.extinguisherOk ? "SI" : "NO",
    observaciones: item.observations,
  }));
}

export function buildPreopExportRows(
  items: readonly SstPesvPreop[],
): Record<string, string | number>[] {
  return items.map((item) => ({
    folio: item.folio,
    fecha: item.inspectionDate,
    placa: item.vehiclePlate,
    tipo_vehiculo: item.vehicleType,
    categoria: item.category,
    hallazgo: item.finding,
    estado: PESV_PREOP_STATUS_LABELS[item.status],
    km: item.odometerKm ?? "",
    evidencia: item.evidenceUrl,
  }));
}

export function buildDriverTemplateRows(): Record<string, string | number>[] {
  return [
    {
      folio: "",
      documento: "1088294102",
      placa: "WDF-452",
      tipo_vehiculo: "camioneta",
      categoria: "C1",
      vencimiento_licencia: "2027-08-12",
      curso_fecha: "2025-01-15",
      curso_vence: "2027-01-15",
      examen_medico: "2025-06-01",
      aptitud: "Apto",
      observaciones: "Conductor autorizado PESV",
    },
  ];
}

export function buildVehicleTemplateRows(): Record<string, string | number>[] {
  return [
    {
      placa: "WDF-452",
      tipo: "camioneta",
      marca: "Toyota",
      modelo: "Hilux 4x4",
      documento_responsable: "1088294102",
      centro_trabajo: "Sede Principal Manzanares",
      estado: "Apto",
      soat: "2026-12-01",
      rtm: "2026-11-15",
      poliza: "2027-01-30",
      km: 34850,
      kit: "SI",
      extintor: "SI",
      observaciones: "",
    },
  ];
}
