export type SstFarmRecord = {
  id: string;
  name: string;
  code: string;
  company: string;
  municipality: string;
  address: string;
  observations: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workersCount: number;
  recordsCount: number;
};

export type SstFarmDraft = {
  id?: string;
  name: string;
  code: string;
  company: string;
  municipality: string;
  address: string;
  observations: string;
  active: boolean;
};

export type FarmStats = {
  total: number;
  active: number;
  inactive: number;
  withWorkers: number;
};

export function emptyFarmDraft(): SstFarmDraft {
  return {
    name: "",
    code: "",
    company: "Grupo Manzanares S.A.S.",
    municipality: "",
    address: "",
    observations: "",
    active: true,
  };
}

export function draftFromFarm(farm: SstFarmRecord): SstFarmDraft {
  return {
    id: farm.id,
    name: farm.name,
    code: farm.code,
    company: farm.company,
    municipality: farm.municipality,
    address: farm.address,
    observations: farm.observations,
    active: farm.active,
  };
}

export function validateFarmDraft(draft: SstFarmDraft): string | null {
  if (!draft.name.trim()) return "El nombre de la finca / predio es obligatorio.";
  if (draft.name.trim().length > 120) return "El nombre no puede superar 120 caracteres.";
  if (!draft.code.trim()) return "El código es obligatorio.";
  if (draft.code.trim().length > 32) return "El código no puede superar 32 caracteres.";
  if (!/^[A-Za-z0-9_-]+$/.test(draft.code.trim())) {
    return "El código solo admite letras, números, guion y guion bajo.";
  }
  if (draft.company.trim().length > 160) {
    return "La empresa / razón social no puede superar 160 caracteres.";
  }
  if (draft.municipality.trim().length > 120) {
    return "El municipio no puede superar 120 caracteres.";
  }
  return null;
}

export function normalizeFarmCode(code: string): string {
  return code.trim().toUpperCase();
}
