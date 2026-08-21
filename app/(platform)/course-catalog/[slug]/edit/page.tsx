import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreateCourseForm } from "@/components/catalog/CreateCourseForm";
import { requireAdmin } from "@/lib/auth/guards";
import { getCourseForEditor } from "@/lib/courses/repository";

type EditCoursePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: EditCoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseForEditor(slug);
  if (!course) {
    return { title: "Editar curso · Campus SST" };
  }
  return {
    title: `Editar · ${course.title} · Campus SST`,
    description: `Edita el módulo SST ${course.title}.`,
  };
}

export default async function EditCoursePage({ params }: Readonly<EditCoursePageProps>) {
  await requireAdmin();
  const { slug } = await params;
  const course = await getCourseForEditor(slug);
  if (!course) {
    notFound();
  }
  return <CreateCourseForm initialCourse={course} />;
}
