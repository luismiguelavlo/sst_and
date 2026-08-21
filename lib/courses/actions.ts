"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { uploadCourseAsset } from "@/lib/cloudinary";
import {
  createCourseRecord,
  deleteCourseRecord,
  setCourseStatus,
  updateCourseRecord,
  type CourseDraftInput,
} from "@/lib/courses/repository";
import {
  createEmptyQuizData,
  isQuizData,
  validateQuizData,
  type QuizData,
} from "@/lib/quiz";
import {
  CourseSectionKind,
  isCourseSectionKind,
  isSstCategory,
  isSstLevel,
} from "@/lib/sst";
import { isYouTubeUrl } from "@/lib/youtube";

export type CourseActionResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export type UploadActionResult =
  | { ok: true; url: string; publicId: string; filename: string }
  | { ok: false; error: string };

type SectionPayload = {
  id?: string;
  title: string;
  kind: string;
  body: string;
  youtubeUrl: string;
  mediaUrl: string;
  mediaPublicId: string;
  mediaFilename: string;
  quiz?: QuizData;
};

export async function uploadCourseMedia(
  formData: FormData,
): Promise<UploadActionResult> {
  await requireAdmin();
  const kindValue = formData.get("kind");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Selecciona un archivo." };
  }
  const kind = kindValue === "document" ? "document" : "image";
  try {
    const uploaded = await uploadCourseAsset(file, kind);
    return {
      ok: true,
      url: uploaded.url,
      publicId: uploaded.publicId,
      filename: uploaded.originalFilename,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo subir el archivo.",
    };
  }
}

export async function saveCourse(input: {
  courseId?: string;
  title: string;
  description: string;
  category: string;
  level: string;
  coverUrl: string;
  coverPublicId: string;
  isPublic: boolean;
  issueCertificate: boolean;
  enableDiscussions: boolean;
  publish: boolean;
  sections: SectionPayload[];
}): Promise<CourseActionResult> {
  const admin = await requireAdmin();
  const title = input.title.trim();
  if (title.length < 3) {
    return { ok: false, error: "El título del curso es obligatorio." };
  }
  if (!isSstCategory(input.category)) {
    return { ok: false, error: "Selecciona una categoría SST." };
  }
  if (!isSstLevel(input.level)) {
    return { ok: false, error: "Selecciona un nivel." };
  }
  if (input.sections.length === 0) {
    return { ok: false, error: "Agrega al menos una sección." };
  }

  const parsedSections = parseCourseSections(input.sections);
  if (!parsedSections.ok) {
    return parsedSections;
  }

  const draft: Omit<CourseDraftInput, "createdBy"> & { createdBy?: string } = {
    title,
    description: input.description,
    category: input.category,
    level: input.level,
    coverUrl: input.coverUrl || undefined,
    coverPublicId: input.coverPublicId || undefined,
    isPublic: input.isPublic,
    issueCertificate: input.issueCertificate,
    enableDiscussions: input.enableDiscussions,
    status: input.publish ? "published" : "draft",
    sections: parsedSections.sections,
  };

  try {
    const saved = input.courseId
      ? await updateCourseRecord(input.courseId, draft)
      : await createCourseRecord({ ...draft, createdBy: admin.id });

    revalidatePath("/course-catalog");
    revalidatePath(`/courses/${saved.slug}`);
    revalidatePath(`/courses/${saved.slug}`, "layout");
    revalidatePath(`/course-catalog/${saved.slug}/edit`);
    return { ok: true, slug: saved.slug };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo guardar el curso.",
    };
  }
}

export async function publishCourse(slug: string): Promise<CourseActionResult> {
  await requireAdmin();
  try {
    const result = await setCourseStatus(slug, "published");
    revalidateCoursePaths(result.slug);
    return { ok: true, slug: result.slug };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo publicar el curso.",
    };
  }
}

export async function unpublishCourse(slug: string): Promise<CourseActionResult> {
  await requireAdmin();
  try {
    const result = await setCourseStatus(slug, "draft");
    revalidateCoursePaths(result.slug);
    return { ok: true, slug: result.slug };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo pasar a borrador.",
    };
  }
}

export async function deleteCourse(slug: string): Promise<CourseActionResult> {
  await requireAdmin();
  try {
    await deleteCourseRecord(slug);
    revalidatePath("/course-catalog");
    revalidatePath("/assign-courses");
    revalidatePath("/dashboard");
    revalidatePath("/certificates");
    return { ok: true, slug };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo eliminar el curso.",
    };
  }
}

function revalidateCoursePaths(slug: string) {
  revalidatePath("/course-catalog");
  revalidatePath(`/courses/${slug}`);
  revalidatePath(`/courses/${slug}`, "layout");
  revalidatePath(`/course-catalog/${slug}/edit`);
  revalidatePath("/assign-courses");
}

function parseCourseSections(
  input: readonly SectionPayload[],
): { ok: true; sections: CourseDraftInput["sections"][number][] } | { ok: false; error: string } {
  const sections: CourseDraftInput["sections"][number][] = [];
  for (const [index, section] of input.entries()) {
    const title = section.title.trim();
    if (title.length === 0) {
      return { ok: false, error: `La sección ${index + 1} necesita un título.` };
    }
    if (!isCourseSectionKind(section.kind)) {
      return { ok: false, error: `La sección ${index + 1} tiene un tipo inválido.` };
    }
    if (section.kind === CourseSectionKind.Video && !isYouTubeUrl(section.youtubeUrl)) {
      return { ok: false, error: `La sección "${title}" necesita un enlace válido de YouTube.` };
    }
    if (section.kind === CourseSectionKind.Image && section.mediaUrl.trim().length === 0) {
      return { ok: false, error: `La sección "${title}" necesita una imagen.` };
    }
    if (section.kind === CourseSectionKind.Document && section.mediaUrl.trim().length === 0) {
      return { ok: false, error: `La sección "${title}" necesita un documento.` };
    }

    let quiz = createEmptyQuizData();
    if (section.kind === CourseSectionKind.Quiz) {
      if (!isQuizData(section.quiz)) {
        return { ok: false, error: `La sección "${title}" necesita un quiz válido.` };
      }
      const quizError = validateQuizData(section.quiz);
      if (quizError) {
        return { ok: false, error: `La sección "${title}": ${quizError}` };
      }
      quiz = section.quiz;
    }

    sections.push({
      id: section.id,
      title,
      kind: section.kind,
      body: section.body,
      youtubeUrl: section.youtubeUrl,
      mediaUrl: section.mediaUrl,
      mediaPublicId: section.mediaPublicId,
      mediaFilename: section.mediaFilename,
      quiz,
    });
  }
  return { ok: true, sections };
}
