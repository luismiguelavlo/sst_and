import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { AssignCoursesScreen } from "@/components/assignments/AssignCoursesScreen";
import {
  listActiveAssignments,
  listAssignableCourses,
  listAssignableLearners,
  listAssignmentHistory,
} from "@/lib/assignments/repository";

export const metadata: Metadata = {
  title: "Asignar cursos · Campus SST",
  description: "Asigna o desasigna módulos SST a empleados, con fecha límite e indicaciones.",
};

export const dynamic = "force-dynamic";

export default async function AssignCoursesPage() {
  await requireAdmin();

  let learners: Awaited<ReturnType<typeof listAssignableLearners>> = [];
  let courses: Awaited<ReturnType<typeof listAssignableCourses>> = [];
  let history: Awaited<ReturnType<typeof listAssignmentHistory>> = [];
  let active: Awaited<ReturnType<typeof listActiveAssignments>> = [];

  try {
    [learners, courses, history, active] = await Promise.all([
      listAssignableLearners(),
      listAssignableCourses(),
      listAssignmentHistory(),
      listActiveAssignments(),
    ]);
  } catch {
    // La pantalla se muestra vacía si Postgres no responde.
  }

  return (
    <AssignCoursesScreen
      learners={learners}
      courses={courses}
      initialHistory={history}
      initialActive={active}
    />
  );
}
