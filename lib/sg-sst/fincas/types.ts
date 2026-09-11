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

export type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";
import type { DraftValidationMode } from "@/lib/sg-sst/draft-mode";

export function validateFarmDraft(
  draft: SstFarmDraft,
  mode: DraftValidationMode = "form",
): string | null {
  if (mode === "import") {
    if (!draft.name.trim() && !draft.code.trim()) {
      return "Fila sin nombre ni código.";
    }
    return null;
  }

  if (!draft.name.trim()) return "El nombre del centro de trabajo es obligatorio.";
  if (draft.name.trim().length > 120) return "El nombre no puede superar 120 caracteres.";
  if (!draft.code.trim()) return "El código es obligatorio.";
  if (draft.code.trim().length > 32) return "El código no puede superar 32 caracteres.";
  if (!/^[A-Za-z0-9_-]+$/.test(draft.code.trim())) {
    return "El código solo admite letras, números, guion y guion bajo (sin espacios ni símbolos).";
  }
  if (draft.company.trim().length > 160) {
    return "La empresa / razón social no puede superar 160 caracteres.";
  }
  if (draft.municipality.trim().length > 120) {
    return "El municipio no puede superar 120 caracteres.";
  }
  return null;
}

/** Completa nombre/código faltantes para importación Excel. */
export function normalizeFarmDraftForImport(draft: SstFarmDraft): SstFarmDraft {
  const name = draft.name.trim() || draft.code.trim() || "Centro sin nombre";
  let code = normalizeFarmCode(draft.code || name);
  if (!code) {
    code = `CTR_${Date.now().toString(36).toUpperCase()}`;
  }
  if (code.length > 32) code = code.slice(0, 32);
  return {
    ...draft,
    name: name.slice(0, 120),
    code,
    company: draft.company.trim() || "Grupo Manzanares S.A.S.",
    municipality: draft.municipality.trim(),
    address: draft.address.trim(),
    observations: draft.observations.trim(),
  };
}

export function normalizeFarmCode(code: string): string {
  return code
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_-]/g, "");
}
