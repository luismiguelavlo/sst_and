import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/guards";
import { CourseCatalog } from "@/components/catalog/CourseCatalog";
import { listCatalogCourses } from "@/lib/courses/repository";
import type { Course } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Cursos SST · Campus SST",
  description: "Catálogo de formación en seguridad y salud en el trabajo para el personal.",
};

type CourseCatalogPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function CourseCatalogPage({
  searchParams,
}: Readonly<CourseCatalogPageProps>) {
  const [{ q }, user] = await Promise.all([searchParams, requireAuth()]);
  const isAdmin = user.role === "admin";
  let courses: Course[] = [];
  try {
    courses = await listCatalogCourses({
      includeDrafts: isAdmin,
      viewerUserId: isAdmin ? undefined : user.id,
    });
  } catch {
    courses = [];
  }

  return (
    <CourseCatalog
      canCreateCourse={isAdmin}
      courses={courses}
      initialQuery={typeof q === "string" ? q : ""}
    />
  );
}
