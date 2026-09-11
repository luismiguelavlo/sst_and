export type SgsstNavItem = {
  readonly href: string;
  readonly label: string;
  readonly icon: string;
  readonly path: string;
};

export type SgsstNavSection = {
  readonly title: string;
  readonly items: readonly SgsstNavItem[];
};

export const SGSST_BASE = "/sg-sst";

/** Solo módulos con pantalla funcional. Los pendientes se reincorporan al implementarlos. */
export const SGSST_NAV: readonly SgsstNavSection[] = [
  {
    title: "Principal",
    items: [
      {
        href: `${SGSST_BASE}`,
        label: "Inicio / Dashboard",
        icon: "home",
        path: "dashboard",
      },
      {
        href: `${SGSST_BASE}/alertas-sst`,
        label: "Alertas SST",
        icon: "warning",
        path: "alertas-sst",
      },
    ],
  },
  {
    title: "Gestión de Personal & Salud",
    items: [
      {
        href: `${SGSST_BASE}/trabajadores`,
        label: "Trabajadores",
        icon: "badge",
        path: "trabajadores",
      },
      {
        href: `${SGSST_BASE}/examenes-medicos-ocupacionales`,
        label: "Exámenes médicos ocupacionales",
        icon: "stethoscope",
        path: "examenes-medicos-ocupacionales",
      },
      {
        href: `${SGSST_BASE}/restricciones-y-recomendaciones`,
        label: "Restricciones y recomendaciones",
        icon: "pan_tool",
        path: "restricciones-y-recomendaciones",
      },
      {
        href: `${SGSST_BASE}/casos-de-salud`,
        label: "Casos de salud",
        icon: "clinical_notes",
        path: "casos-de-salud",
      },
      {
        href: `${SGSST_BASE}/incapacidades-y-reintegros`,
        label: "Incapacidades y reintegros",
        icon: "calendar_today",
        path: "incapacidades-y-reintegros",
      },
    ],
  },
  {
    title: "Riesgos Operativos & Campo",
    items: [
      {
        href: `${SGSST_BASE}/trabajo-en-alturas`,
        label: "Trabajo en alturas",
        icon: "stairs",
        path: "trabajo-en-alturas",
      },
      {
        href: `${SGSST_BASE}/tractoristas-operadores`,
        label: "Tractoristas / operadores",
        icon: "precision_manufacturing",
        path: "tractoristas-operadores",
      },
      {
        href: `${SGSST_BASE}/pesv`,
        label: "PESV",
        icon: "directions_car",
        path: "pesv",
      },
      {
        href: `${SGSST_BASE}/epp`,
        label: "EPP",
        icon: "safety_check",
        path: "epp",
      },
    ],
  },
  {
    title: "Control, Inspección & Siniestros",
    items: [
      {
        href: `${SGSST_BASE}/inspecciones`,
        label: "Inspecciones",
        icon: "rule",
        path: "inspecciones",
      },
      {
        href: `${SGSST_BASE}/accidentes-e-incidentes`,
        label: "Accidentes e incidentes",
        icon: "emergency",
        path: "accidentes-e-incidentes",
      },
      {
        href: `${SGSST_BASE}/investigaciones`,
        label: "Investigaciones",
        icon: "fact_check",
        path: "investigaciones",
      },
      {
        href: `${SGSST_BASE}/acciones-correctivas`,
        label: "Acciones correctivas",
        icon: "build",
        path: "acciones-correctivas",
      },
      {
        href: `${SGSST_BASE}/emergencias`,
        label: "Emergencias",
        icon: "local_fire_department",
        path: "emergencias",
      },
    ],
  },
  {
    title: "Cultura, Comités & Sistema",
    items: [
      {
        href: `${SGSST_BASE}/capacitaciones`,
        label: "Capacitaciones",
        icon: "school",
        path: "capacitaciones",
      },
      {
        href: `${SGSST_BASE}/documentos-sg-sst`,
        label: "Documentos SG-SST",
        icon: "folder",
        path: "documentos-sg-sst",
      },
      {
        href: `${SGSST_BASE}/copasst`,
        label: "COPASST",
        icon: "groups",
        path: "copasst",
      },
      {
        href: `${SGSST_BASE}/ccl`,
        label: "CCL",
        icon: "handshake",
        path: "ccl",
      },
    ],
  },
] as const;

export function isSgsstPath(pathname: string): boolean {
  return pathname === SGSST_BASE || pathname.startsWith(`${SGSST_BASE}/`);
}

export function isSgsstNavActive(pathname: string, href: string): boolean {
  if (href === SGSST_BASE) {
    return pathname === SGSST_BASE || pathname === `${SGSST_BASE}/`;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
