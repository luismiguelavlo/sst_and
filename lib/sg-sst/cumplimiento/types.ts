export const COMPLIANCE_DIMENSION_IDS = [
  "plan_anual",
  "capacitaciones",
  "inspecciones",
  "acciones_correctivas",
  "vigilancia_salud",
  "emergencias",
  "copasst",
  "ccl",
  "pesv",
  "gestion_documental",
] as const;

export type ComplianceDimensionId = (typeof COMPLIANCE_DIMENSION_IDS)[number];

export type ComplianceSemaphore = "green" | "yellow" | "red";

export type ComplianceThresholds = {
  greenMinPct: number;
  yellowMinPct: number;
};

export const DEFAULT_COMPLIANCE_THRESHOLDS: ComplianceThresholds = {
  greenMinPct: 90,
  yellowMinPct: 75,
};

export const COMPLIANCE_DIMENSION_META: Record<
  ComplianceDimensionId,
  { label: string; href: string; icon: string; description: string }
> = {
  plan_anual: {
    label: "Plan anual",
    href: "/sg-sst/documentos-sg-sst",
    icon: "calendar_month",
    description: "Documentos de plan anual con ciclo de revisión al día.",
  },
  capacitaciones: {
    label: "Capacitaciones",
    href: "/sg-sst/capacitaciones",
    icon: "school",
    description: "Capacitaciones realizadas frente a pendientes y vencidas.",
  },
  inspecciones: {
    label: "Inspecciones",
    href: "/sg-sst/inspecciones",
    icon: "rule",
    description: "Inspecciones realizadas frente a vencidas y pendientes.",
  },
  acciones_correctivas: {
    label: "Acciones correctivas",
    href: "/sg-sst/acciones-correctivas",
    icon: "build",
    description: "Acciones cerradas sobre el total registrado.",
  },
  vigilancia_salud: {
    label: "Vigilancia de la salud",
    href: "/sg-sst/examenes-medicos-ocupacionales",
    icon: "stethoscope",
    description: "EMOs vigentes sobre el total con seguimiento.",
  },
  emergencias: {
    label: "Emergencias",
    href: "/sg-sst/emergencias",
    icon: "local_fire_department",
    description: "Brigada, equipos e inspecciones de emergencia al día.",
  },
  copasst: {
    label: "COPASST",
    href: "/sg-sst/copasst",
    icon: "groups",
    description: "Compromisos cerrados y actividad del comité.",
  },
  ccl: {
    label: "CCL",
    href: "/sg-sst/ccl",
    icon: "handshake",
    description: "Casos y compromisos del comité de convivencia.",
  },
  pesv: {
    label: "PESV",
    href: "/sg-sst/pesv",
    icon: "directions_car",
    description: "Conductores autorizados, flota apta y preoperacionales.",
  },
  gestion_documental: {
    label: "Gestión documental",
    href: "/sg-sst/documentos-sg-sst",
    icon: "folder",
    description: "Documentos con ciclo de revisión sin vencimiento.",
  },
};

export type ComplianceDimensionScore =
  | {
      id: ComplianceDimensionId;
      label: string;
      href: string;
      icon: string;
      description: string;
      status: "ok";
      pct: number;
      compliant: number;
      total: number;
      semaphore: ComplianceSemaphore;
      detail: string;
    }
  | {
      id: ComplianceDimensionId;
      label: string;
      href: string;
      icon: string;
      description: string;
      status: "insufficient";
      message: string;
    };

export type SgsstComplianceReport = {
  thresholds: ComplianceThresholds;
  dimensions: ComplianceDimensionScore[];
  generatedAt: string;
  overall:
    | { status: "ok"; pct: number; semaphore: ComplianceSemaphore }
    | { status: "insufficient"; message: string };
};

export function resolveComplianceSemaphore(
  pct: number,
  thresholds: ComplianceThresholds,
): ComplianceSemaphore {
  if (pct >= thresholds.greenMinPct) return "green";
  if (pct >= thresholds.yellowMinPct) return "yellow";
  return "red";
}

export function averagePct(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

export function ratioPct(compliant: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.round((compliant / total) * 1000) / 10;
}

export function validateComplianceThresholds(input: {
  greenMinPct: number;
  yellowMinPct: number;
}): { ok: true; value: ComplianceThresholds } | { ok: false; error: string } {
  const green = Number(input.greenMinPct);
  const yellow = Number(input.yellowMinPct);
  if (!Number.isFinite(green) || !Number.isFinite(yellow)) {
    return { ok: false, error: "Los umbrales deben ser números válidos." };
  }
  if (green <= 0 || green > 100) {
    return { ok: false, error: "El umbral verde debe estar entre 0 y 100." };
  }
  if (yellow < 0 || yellow >= green) {
    return {
      ok: false,
      error: "El umbral amarillo debe ser ≥ 0 y menor que el umbral verde.",
    };
  }
  return {
    ok: true,
    value: {
      greenMinPct: Math.round(green * 100) / 100,
      yellowMinPct: Math.round(yellow * 100) / 100,
    },
  };
}
