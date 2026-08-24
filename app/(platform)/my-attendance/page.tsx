import type { AttendancePendingItem } from "@/lib/attendance";
import { MyAttendanceScreen } from "@/components/attendance/MyAttendanceScreen";
import { requireAuth } from "@/lib/auth/guards";
import { homePathForRole } from "@/lib/auth/types";
import { listPendingAttendanceFormsForUser } from "@/lib/attendance/repository";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mis formularios de asistencia · Campus SST",
  description: "Diligencia los formularios de asistencia pendientes.",
};

export default async function MyAttendancePage() {
  const user = await requireAuth();
  if (user.role !== "user") {
    redirect(homePathForRole(user.role));
  }

  let forms: AttendancePendingItem[] = [];
  try {
    forms = await listPendingAttendanceFormsForUser(user.id);
  } catch {
    forms = [];
  }

  return <MyAttendanceScreen forms={forms} />;
}
