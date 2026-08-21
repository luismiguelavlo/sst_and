import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/guards";
import { MyCoursesScreen } from "@/components/learn/MyCoursesScreen";
import type { MyCourseItem } from "@/lib/my-courses";
import { listMyCoursesForUser } from "@/lib/progress/repository";

export const metadata: Metadata = {
  title: "Mis cursos · Campus SST",
  description: "Consulta tus cursos asignados, plazos y avance.",
};

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const user = await requireAuth();
  let courses: MyCourseItem[] = [];
  try {
    if (user.role === "user") {
      courses = await listMyCoursesForUser(user.id);
    }
  } catch {
    courses = [];
  }

  if (user.role === "admin") {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-lg shadow-sm">
        <h1 className="font-headline-lg text-on-surface">Mis cursos</h1>
        <p className="mt-sm font-body-md text-on-surface-variant">
          Esta vista es para empleados. Como administrador usa el catálogo y el tablero de avance.
        </p>
      </div>
    );
  }

  return <MyCoursesScreen courses={courses} />;
}
