import type { Metadata } from "next";
import { AssignAttendanceScreen } from "@/components/attendance/AssignAttendanceScreen";
import { requireAdmin } from "@/lib/auth/guards";
import { listAssignableLearners } from "@/lib/assignments/repository";
import {
  listActiveAttendanceAssignments,
  listAssignableAttendanceForms,
} from "@/lib/attendance/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Asignar asistencia · Campus SST",
  description: "Asigna formularios de asistencia a empleados específicos.",
};

type PageProps = Readonly<{
  searchParams: Promise<{ formId?: string }>;
}>;

export default async function AssignAttendancePage({ searchParams }: PageProps) {
  await requireAdmin();
  const { formId } = await searchParams;
  const [learners, forms, active] = await Promise.all([
    listAssignableLearners(),
    listAssignableAttendanceForms(),
    listActiveAttendanceAssignments(),
  ]);

  return (
    <AssignAttendanceScreen
      learners={learners}
      forms={forms}
      initialActive={active}
      initialFormId={formId}
    />
  );
}
