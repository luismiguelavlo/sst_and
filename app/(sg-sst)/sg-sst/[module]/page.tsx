import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  buildModuleMetadata,
  isSgsstModuleSlug,
  SGSST_MODULES,
} from "@/lib/sg-sst/modules";

type PageProps = {
  params: Promise<{ module: string }>;
};

const IMPLEMENTED_REDIRECTS: Record<string, string> = {
  trabajadores: "/sg-sst/trabajadores",
  "examenes-medicos-ocupacionales": "/sg-sst/examenes-medicos-ocupacionales",
  "restricciones-y-recomendaciones": "/sg-sst/restricciones-y-recomendaciones",
  "casos-de-salud": "/sg-sst/casos-de-salud",
  "incapacidades-y-reintegros": "/sg-sst/incapacidades-y-reintegros",
  "trabajo-en-alturas": "/sg-sst/trabajo-en-alturas",
  "tractoristas-operadores": "/sg-sst/tractoristas-operadores",
  pesv: "/sg-sst/pesv",
  epp: "/sg-sst/epp",
  inspecciones: "/sg-sst/inspecciones",
  "accidentes-e-incidentes": "/sg-sst/accidentes-e-incidentes",
  investigaciones: "/sg-sst/investigaciones",
  "acciones-correctivas": "/sg-sst/acciones-correctivas",
  capacitaciones: "/sg-sst/capacitaciones",
  "documentos-sg-sst": "/sg-sst/documentos-sg-sst",
  copasst: "/sg-sst/copasst",
  ccl: "/sg-sst/ccl",
  emergencias: "/sg-sst/emergencias",
};

export async function generateStaticParams() {
  return Object.keys(IMPLEMENTED_REDIRECTS).map((module) => ({ module }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { module } = await params;
  if (!isSgsstModuleSlug(module)) {
    return { title: "Módulo SG-SST" };
  }
  return buildModuleMetadata(module);
}

export default async function SgsstDynamicModulePage({ params }: PageProps) {
  const { module } = await params;
  if (!isSgsstModuleSlug(module)) {
    notFound();
  }

  const target = IMPLEMENTED_REDIRECTS[module];
  if (target) {
    redirect(target);
  }

  // Químicos, Análisis SST, Configuración genérica, etc. — se habilitan al implementarlos.
  notFound();
}
