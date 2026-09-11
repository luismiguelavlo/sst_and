export const WORKER_STATUSES = ["activo", "retirado"] as const;
export type WorkerStatus = (typeof WORKER_STATUSES)[number];

export const DOCUMENT_TYPES = ["CC", "CE", "PPT", "TI", "NIT", "PAS"] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const RISK_LEVELS = [1, 2, 3, 4, 5] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const CONTRACT_TYPES = [
  "Término Fijo (Renovable)",
  "Término Indefinido",
  "Obra o Labor Agrícola",
  "Aprendiz SENA Lectiva/Práctica",
  "Prestación de Servicios",
] as const;

export const COMPANY_OPTIONS = [
  "Grupo Manzanares S.A.S.",
  "Agro-Logística del Valle S.A.S.",
  "Servicios Especializados de Campo",
] as const;

export const AREA_OPTIONS = [
  "Campo y Producción Agrícola",
  "Mantenimiento y Maquinaria Pesada",
  "Planta de Beneficio y Empaque",
  "Logística y Despachos",
  "Administrativa y Financiera",
] as const;

export const WORK_CENTER_OPTIONS = [
  "Sede Rural Occidente (Valle Central)",
  "Sede Planta San Jerónimo",
  "Centro Logístico Norte",
  "Sede Principal Manzanares",
] as const;

export type SstWorker = {
  id: string;
  workerCode: string;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  company: string;
  jobTitle: string;
  area: string;
  workCenter: string;
  farmId: string | null;
  farmName: string | null;
  supervisorName: string;
  hireDate: string | null;
  contractType: string;
  status: WorkerStatus;
  riskLevel: RiskLevel;
  worksHeights: boolean;
  drives: boolean;
  operatesTractor: boolean;
  handlesChemicals: boolean;
  inBrigade: boolean;
  inCopasst: boolean;
  inCcl: boolean;
  phone: string;
  email: string;
  observations: string;
  retirementDate: string | null;
  retirementReason: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SstWorkerDraft = {
  id?: string;
  workerCode?: string;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  company: string;
  jobTitle: string;
  area: string;
  workCenter: string;
  farmId?: string | null;
  supervisorName: string;
  hireDate?: string | null;
  contractType: string;
  status: WorkerStatus;
  riskLevel: RiskLevel;
  worksHeights: boolean;
  drives: boolean;
  operatesTractor: boolean;
  handlesChemicals: boolean;
  inBrigade: boolean;
  inCopasst: boolean;
  inCcl: boolean;
  phone: string;
  email: string;
  observations: string;
  retirementDate?: string | null;
  retirementReason?: string | null;
};

export type WorkerStats = {
  total: number;
  active: number;
  retired: number;
  heights: number;
  driversOrTractor: number;
  chemicals: number;
  brigade: number;
  copasst: number;
  ccl: number;
};

export function isWorkerStatus(value: string): value is WorkerStatus {
  return (WORKER_STATUSES as readonly string[]).includes(value);
}

export function isDocumentType(value: string): value is DocumentType {
  return (DOCUMENT_TYPES as readonly string[]).includes(value);
}

export function isRiskLevel(value: number): value is RiskLevel {
  return (RISK_LEVELS as readonly number[]).includes(value);
}

export function emptyWorkerDraft(): SstWorkerDraft {
  return {
    fullName: "",
    documentType: "CC",
    documentNumber: "",
    company: COMPANY_OPTIONS[0],
    jobTitle: "",
    area: AREA_OPTIONS[0],
    workCenter: WORK_CENTER_OPTIONS[0],
    farmId: null,
    supervisorName: "",
    hireDate: "",
    contractType: CONTRACT_TYPES[0],
    status: "activo",
    riskLevel: 4,
    worksHeights: false,
    drives: false,
    operatesTractor: false,
    handlesChemicals: false,
    inBrigade: false,
    inCopasst: false,
    inCcl: false,
    phone: "",
    email: "",
    observations: "",
    retirementDate: null,
    retirementReason: null,
  };
}

export function validateWorkerDraft(input: SstWorkerDraft): string | null {
  if (input.fullName.trim().length < 3) {
    return "El nombre completo debe tener al menos 3 caracteres.";
  }
  if (!isDocumentType(input.documentType)) {
    return "Tipo de documento inválido.";
  }
  if (!input.documentNumber.trim()) {
    return "El número de identificación es obligatorio.";
  }
  if (!input.jobTitle.trim()) {
    return "El cargo es obligatorio.";
  }
  if (!isWorkerStatus(input.status)) {
    return "Estado inválido.";
  }
  if (!isRiskLevel(input.riskLevel)) {
    return "Nivel de riesgo inválido (1 a 5).";
  }
  if (input.status === "retirado" && !input.retirementDate) {
    return "La fecha de retiro es obligatoria cuando el estado es Retirado.";
  }
  if (input.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    return "Correo inválido.";
  }
  return null;
}

export function workerLabel(worker: Pick<SstWorker, "fullName" | "documentNumber" | "workerCode" | "status">): string {
  const retired = worker.status === "retirado" ? " (Retirado)" : "";
  return `${worker.fullName} · ${worker.documentNumber} · ${worker.workerCode}${retired}`;
}
