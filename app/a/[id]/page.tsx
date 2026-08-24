import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AttendanceFillForm } from "@/components/attendance/AttendanceFillForm";
import { getPublishedAttendanceFormForFill } from "@/lib/attendance/repository";

export const dynamic = "force-dynamic";

type PageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const form = await getPublishedAttendanceFormForFill(id);
  return {
    title: form ? `${form.title} · Asistencia` : "Formulario de asistencia",
    description: "Registro de asistencia. No necesitas iniciar sesión.",
  };
}

export default async function PublicAttendancePage({ params }: PageProps) {
  const { id } = await params;
  const form = await getPublishedAttendanceFormForFill(id);
  if (!form) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface px-md py-lg">
      <div className="mx-auto mb-md flex max-w-2xl items-center gap-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <span className="material-symbols-outlined text-on-primary" aria-hidden>
            health_and_safety
          </span>
        </div>
        <div>
          <p className="font-headline-md tracking-tight text-primary">Campus SST</p>
          <p className="font-label-sm text-on-surface-variant">Formulario público de asistencia</p>
        </div>
      </div>
      <AttendanceFillForm
        form={form}
        mode="public"
        prefill={{
          firstName: "",
          lastName: "",
          cedula: "",
          jobTitle: "",
        }}
      />
    </main>
  );
}
