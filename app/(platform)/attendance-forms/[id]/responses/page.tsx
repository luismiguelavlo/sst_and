import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AttendanceResponsesScreen } from "@/components/attendance/AttendanceResponsesScreen";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getAttendanceForm,
  listAttendanceResponsesForForm,
} from "@/lib/attendance/repository";

export const dynamic = "force-dynamic";

type PageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const form = await getAttendanceForm(id);
  return {
    title: form ? `Respuestas · ${form.title}` : "Respuestas · Campus SST",
  };
}

export default async function AttendanceResponsesPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const form = await getAttendanceForm(id);
  if (!form) {
    notFound();
  }
  const responses = await listAttendanceResponsesForForm(id);
  return <AttendanceResponsesScreen form={form} responses={responses} />;
}
