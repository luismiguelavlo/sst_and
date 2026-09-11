import type { Metadata } from "next";

type ModuleMeta = {
  title: string;
  description: string;
  icon: string;
};

export const SGSST_MODULES = {
  trabajadores: {
    title: "Trabajadores",
    description:
      "Censo laboral, hojas de vida SST y estado de aptitud por finca y centro de trabajo.",
    icon: "badge",
  },
  "examenes-medicos-ocupacionales": {
    title: "Exámenes médicos ocupacionales",
    description: "Programación, vigencia y seguimiento de EMOs periódicos e ingresos.",
    icon: "stethoscope",
  },
  "restricciones-y-recomendaciones": {
    title: "Restricciones y recomendaciones",
    description:
      "Base maestra de restricciones laborales y recomendaciones con seguimiento de implementación.",
    icon: "pan_tool",
  },
  "casos-de-salud": {
    title: "Casos de salud",
    description:
      "Seguimiento administrativo SST de casos abiertos sin historia clínica sensible.",
    icon: "clinical_notes",
  },
  "incapacidades-y-reintegros": {
    title: "Incapacidades y reintegros",
    description: "Control de ausentismo, incapacidades y procesos de reintegro laboral.",
    icon: "calendar_today",
  },
  "trabajo-en-alturas": {
    title: "Trabajo en alturas",
    description: "Certificaciones Res. 4272/2021, permisos y controles en altura.",
    icon: "stairs",
  },
  "tractoristas-operadores": {
    title: "Tractoristas / operadores",
    description: "Aptitud médica y competencias de operadores de maquinaria agrícola.",
    icon: "precision_manufacturing",
  },
  pesv: {
    title: "PESV",
    description: "Plan Estratégico de Seguridad Vial y controles de conducción.",
    icon: "directions_car",
  },
  epp: {
    title: "EPP",
    description: "Dotación, entrega y cumplimiento de elementos de protección personal.",
    icon: "safety_check",
  },
  quimicos: {
    title: "Químicos",
    description: "Inventario, fichas y controles de sustancias químicas en campo.",
    icon: "science",
  },
  inspecciones: {
    title: "Inspecciones",
    description: "Programación y hallazgos de inspecciones de seguridad en predios.",
    icon: "rule",
  },
  "accidentes-e-incidentes": {
    title: "Accidentes e incidentes",
    description: "Reporte, clasificación y seguimiento de AT e incidentes preventivos.",
    icon: "emergency",
  },
  investigaciones: {
    title: "Investigaciones",
    description: "Investigación de causas y lecciones aprendidas de eventos SST.",
    icon: "fact_check",
  },
  "acciones-correctivas": {
    title: "Acciones correctivas",
    description: "Planes ACPM, eficacia y cierre de acciones del ciclo PHVA.",
    icon: "build",
  },
  emergencias: {
    title: "Emergencias",
    description: "Brigadas, simulacros y respuesta ante emergencias operativas.",
    icon: "local_fire_department",
  },
  capacitaciones: {
    title: "Capacitaciones",
    description: "Plan de formación SST operativo (complementario a Campus SST).",
    icon: "school",
  },
  "documentos-sg-sst": {
    title: "Documentos SG-SST",
    description: "Repositorio documental del sistema de gestión en seguridad y salud.",
    icon: "folder",
  },
  copasst: {
    title: "COPASST",
    description: "Actas, compromisos y seguimiento del comité paritario.",
    icon: "groups",
  },
  ccl: {
    title: "CCL",
    description: "Comité de Convivencia Laboral y gestión de casos.",
    icon: "handshake",
  },
  "analisis-sst": {
    title: "Análisis SST",
    description: "Indicadores, tendencias y análisis gerencial del SG-SST.",
    icon: "analytics",
  },
  configuracion: {
    title: "Configuración",
    description: "Parámetros del sistema operativo, sedes, fincas y catálogos.",
    icon: "settings",
  },
} as const satisfies Record<string, ModuleMeta>;

export type SgsstModuleSlug = keyof typeof SGSST_MODULES;

export function buildModuleMetadata(slug: SgsstModuleSlug): Metadata {
  const module = SGSST_MODULES[slug];
  return { title: `${module.title} | SG-SST` };
}

export function isSgsstModuleSlug(value: string): value is SgsstModuleSlug {
  return Object.hasOwn(SGSST_MODULES, value);
}
