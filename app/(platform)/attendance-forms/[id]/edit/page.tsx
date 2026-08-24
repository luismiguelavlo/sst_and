import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AttendanceFormBuilder } from "@/components/attendance/AttendanceFormBuilder";
import { requireAdmin } from "@/lib/auth/guards";
import { getAttendanceForm } from "@/lib/attendance/repository";

export const dynamic = "force-dynamic";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const form = await getAttendanceForm(id);
    if (!form) {
      return { title: "Formulario · Campus SST" };
    }
    return {
      title: `Editar · ${form.title}`,
      description: "Edita el formulario de asistencia SST.",
    };
  } catch {
    return { title: "Formulario · Campus SST" };
  }
}

export default async function EditAttendanceFormPage({ params }: Readonly<EditPageProps>) {
  await requireAdmin();
  const { id } = await params;
  let form = null;
  try {
    form = await getAttendanceForm(id);
  } catch {
    form = null;
  }
  if (!form) {
    notFound();
  }
  return <AttendanceFormBuilder initialDraft={form} />;
}
