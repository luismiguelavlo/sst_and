import type { Metadata } from "next";
import { AttendanceFormsScreen } from "@/components/attendance/AttendanceFormsScreen";
import { requireAdmin } from "@/lib/auth/guards";
import { listAttendanceForms } from "@/lib/attendance/repository";
import type { AttendanceFormListItem } from "@/lib/attendance";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gestión de formularios de asistencia · Campus SST",
  description: "Administre, analice y comparta los registros de asistencia SST.",
};

export default async function AttendanceFormsPage() {
  await requireAdmin();
  let forms: AttendanceFormListItem[] = [];
  try {
    forms = await listAttendanceForms();
  } catch {
    forms = [];
  }
  return <AttendanceFormsScreen forms={forms} />;
}
