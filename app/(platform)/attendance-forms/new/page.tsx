import type { Metadata } from "next";
import { AttendanceFormBuilder } from "@/components/attendance/AttendanceFormBuilder";
import { requireAdmin } from "@/lib/auth/guards";
import { createDefaultAttendanceDraft } from "@/lib/attendance";

export const metadata: Metadata = {
  title: "Crear formulario de asistencia · Campus SST",
  description: "Diseña el registro de asistencia para eventos y capacitaciones.",
};

export default async function NewAttendanceFormPage() {
  await requireAdmin();
  return <AttendanceFormBuilder initialDraft={createDefaultAttendanceDraft()} />;
}
