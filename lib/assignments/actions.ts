"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import type { ActiveAssignment, AssignmentRecord } from "@/lib/assignments";
import {
  createCourseAssignments,
  deleteCourseAssignment,
  listActiveAssignments,
  listAssignmentHistory,
} from "@/lib/assignments/repository";
import { notifyCourseAssignments } from "@/lib/notifications/repository";

export type AssignCoursesResult =
  | { ok: true; history: AssignmentRecord[]; active: ActiveAssignment[]; created: number }
  | { ok: false; error: string };

export type UnassignResult =
  | { ok: true; active: ActiveAssignment[]; history: AssignmentRecord[] }
  | { ok: false; error: string };

export async function assignCoursesAction(input: {
  userIds: readonly string[];
  courseIds: readonly string[];
  deadline: string;
  message: string;
}): Promise<AssignCoursesResult> {
  const admin = await requireAdmin();
  try {
    const result = await createCourseAssignments({
      userIds: input.userIds,
      courseIds: input.courseIds,
      assignedBy: admin.id,
      deadline: input.deadline.trim() || null,
      message: input.message,
    });
    try {
      await notifyCourseAssignments({
        userIds: input.userIds,
        courseIds: input.courseIds,
        assignedBy: admin.id,
        deadline: input.deadline.trim() || null,
        message: input.message,
      });
    } catch {
      // La asignación ya quedó; las alertas no deben revertirla.
    }
    revalidatePath("/assign-courses");
    revalidatePath("/course-catalog");
    revalidatePath("/dashboard");
    revalidatePath("/notifications");
    revalidatePath("/my-courses");
    const [history, active] = await Promise.all([
      listAssignmentHistory(),
      listActiveAssignments(),
    ]);
    return { ok: true, history, active, created: result.created };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo asignar los cursos.",
    };
  }
}

export async function unassignCourseAction(assignmentId: string): Promise<UnassignResult> {
  await requireAdmin();
  try {
    await deleteCourseAssignment(assignmentId);
    revalidatePath("/assign-courses");
    revalidatePath("/course-catalog");
    revalidatePath("/dashboard");
    const [history, active] = await Promise.all([
      listAssignmentHistory(),
      listActiveAssignments(),
    ]);
    return { ok: true, active, history };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo desasignar el curso.",
    };
  }
}
