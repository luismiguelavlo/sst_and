import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AttendanceFillForm } from "@/components/attendance/AttendanceFillForm";
import { requireAuth } from "@/lib/auth/guards";
import { findUserById } from "@/lib/auth/users";
import { homePathForRole } from "@/lib/auth/types";
import {
  getPublishedAttendanceFormForFill,
  hasUserSubmittedAttendanceForm,
} from "@/lib/attendance/repository";

export const dynamic = "force-dynamic";

type PageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const form = await getPublishedAttendanceFormForFill(id);
  return {
    title: form ? `${form.title} · Asistencia` : "Formulario de asistencia · Campus SST",
  };
}

export default async function FillAttendancePage({ params }: PageProps) {
  const user = await requireAuth();
  if (user.role !== "user") {
    redirect(homePathForRole(user.role));
  }

  const { id } = await params;
  const form = await getPublishedAttendanceFormForFill(id);
  if (!form) {
    notFound();
  }

  if (await hasUserSubmittedAttendanceForm(form.id, user.id)) {
    redirect("/my-attendance");
  }

  const profile = await findUserById(user.id);
  const nameParts = user.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, Math.max(1, nameParts.length - 1)).join(" ") || user.name;
  const lastName = nameParts.length > 1 ? (nameParts[nameParts.length - 1] ?? "") : "";

  return (
    <AttendanceFillForm
      form={form}
      prefill={{
        firstName,
        lastName,
        cedula: profile?.cedula ?? "",
        jobTitle: user.jobTitle,
      }}
    />
  );
}
