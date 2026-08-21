"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/guards";
import { getSectionQuizData } from "@/lib/courses/repository";
import { gradeQuiz, type QuizAnswers, type QuizGradeResult } from "@/lib/quiz";
import { recordLessonView } from "@/lib/progress/repository";

export type SubmitQuizResult =
  | { ok: true; result: QuizGradeResult; certificateId: string | null }
  | { ok: false; error: string };

export async function submitQuizAttempt(input: {
  sectionId: string;
  courseSlug: string;
  answers: QuizAnswers;
}): Promise<SubmitQuizResult> {
  const user = await requireAuth();
  if (user.role !== "user") {
    return { ok: false, error: "Solo los empleados pueden enviar el quiz." };
  }

  const section = await getSectionQuizData(input.sectionId);
  if (!section) {
    return { ok: false, error: "No se encontró el quiz." };
  }

  const answeredIds = Object.keys(input.answers);
  if (answeredIds.length !== section.quiz.questions.length) {
    return { ok: false, error: "Responde todas las preguntas antes de enviar." };
  }
  for (const question of section.quiz.questions) {
    const selected = input.answers[question.id];
    if (!selected || !question.options.some((option) => option.id === selected)) {
      return { ok: false, error: "Hay respuestas inválidas. Vuelve a intentarlo." };
    }
  }

  const result = gradeQuiz(section.quiz, input.answers);
  let certificateId: string | null = null;

  if (result.passed) {
    try {
      const progress = await recordLessonView(user.id, input.sectionId);
      certificateId = progress.certificateId;
    } catch {
      // La calificación ya quedó; el avance se puede reintentar.
    }
  }

  revalidatePath(`/courses/${input.courseSlug}`);
  revalidatePath(`/courses/${input.courseSlug}/lessons/${input.sectionId}`);
  revalidatePath("/my-courses");
  revalidatePath("/certificates");

  return { ok: true, result, certificateId };
}
