"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/guards";
import type { DiscussionThread } from "@/lib/discussions";
import {
  createDiscussionPost,
  deleteDiscussionPost,
  listCourseDiscussions,
} from "@/lib/discussions/repository";

export type DiscussionActionResult =
  | { ok: true; threads: DiscussionThread[] }
  | { ok: false; error: string };

export async function postCourseDiscussion(input: {
  courseId: string;
  courseSlug: string;
  body: string;
  parentId?: string;
}): Promise<DiscussionActionResult> {
  const user = await requireAuth();
  try {
    await createDiscussionPost({
      courseId: input.courseId,
      userId: user.id,
      body: input.body,
      parentId: input.parentId ?? null,
    });
    revalidatePath(`/courses/${input.courseSlug}`);
    const threads = await listCourseDiscussions(input.courseId, {
      id: user.id,
      role: user.role,
    });
    return { ok: true, threads };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo publicar la consulta.",
    };
  }
}

export async function removeCourseDiscussion(input: {
  postId: string;
  courseId: string;
  courseSlug: string;
}): Promise<DiscussionActionResult> {
  const user = await requireAuth();
  try {
    await deleteDiscussionPost({
      postId: input.postId,
      userId: user.id,
      role: user.role,
    });
    revalidatePath(`/courses/${input.courseSlug}`);
    const threads = await listCourseDiscussions(input.courseId, {
      id: user.id,
      role: user.role,
    });
    return { ok: true, threads };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo eliminar la consulta.",
    };
  }
}
