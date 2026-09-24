export const GLOBAL_SEARCH_KINDS = [
  "trabajador",
  "accidente",
  "incidente",
  "capacitacion",
  "inspeccion",
  "epp",
  "accion",
  "documento",
  "restriccion",
  "incapacidad",
] as const;

export type GlobalSearchKind = (typeof GLOBAL_SEARCH_KINDS)[number];

export const GLOBAL_SEARCH_KIND_LABELS: Record<GlobalSearchKind, string> = {
  trabajador: "Trabajador",
  accidente: "Accidente",
  incidente: "Incidente",
  capacitacion: "Capacitación",
  inspeccion: "Inspección",
  epp: "EPP",
  accion: "Acción",
  documento: "Documento",
  restriccion: "Restricción",
  incapacidad: "Incapacidad",
};

export type GlobalSearchHit = {
  id: string;
  kind: GlobalSearchKind;
  title: string;
  subtitle: string;
  href: string;
  workerId?: string | null;
};

export type WorkerSstFicha = {
  worker: {
    id: string;
    fullName: string;
    documentType: string;
    documentNumber: string;
    workerCode: string;
    company: string;
    jobTitle: string;
    area: string;
    workCenter: string;
    farmName: string | null;
    status: string;
    hireDate: string | null;
    riskLevel: number;
    worksHeights: boolean;
    drives: boolean;
    operatesTractor: boolean;
  };
  exams: FichaRow[];
  restrictions: FichaRow[];
  leaves: FichaRow[];
  accidents: FichaRow[];
  trainings: FichaRow[];
  epp: FichaRow[];
  heights: FichaRow[];
  pesv: FichaRow[];
  tractor: FichaRow[];
  healthCases: FichaRow[];
  inspections: FichaRow[];
};

export type FichaRow = {
  id: string;
  title: string;
  detail: string;
  date: string | null;
  status: string;
  href: string;
};
