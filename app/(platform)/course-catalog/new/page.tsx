import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { CreateCourseForm } from "@/components/catalog/CreateCourseForm";

export const metadata: Metadata = {
  title: "Crear curso SST · Campus SST",
  description: "Diseña y publica un módulo de formación SST para el personal.",
};

export default async function CreateCoursePage() {
  await requireAdmin();
  return <CreateCourseForm />;
}
