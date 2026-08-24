import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmployeeDossierScreen } from "@/components/employees/EmployeeDossierScreen";
import { requireAdmin } from "@/lib/auth/guards";
import { getEmployeeDossier } from "@/lib/progress/repository";

export const dynamic = "force-dynamic";

type EmployeePageProps = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: EmployeePageProps): Promise<Metadata> {
  const { userId } = await params;
  try {
    const dossier = await getEmployeeDossier(userId);
    if (!dossier) {
      return { title: "Empleado · Campus SST" };
    }
    return {
      title: `${dossier.profile.name} · Expediente SST`,
      description: `Progreso, lecciones y certificados de ${dossier.profile.name}.`,
    };
  } catch {
    return { title: "Empleado · Campus SST" };
  }
}

export default async function EmployeeDossierPage({ params }: Readonly<EmployeePageProps>) {
  await requireAdmin();
  const { userId } = await params;
  let dossier = null;
  try {
    dossier = await getEmployeeDossier(userId);
  } catch {
    dossier = null;
  }
  if (!dossier) {
    notFound();
  }
  return <EmployeeDossierScreen dossier={dossier} />;
}
