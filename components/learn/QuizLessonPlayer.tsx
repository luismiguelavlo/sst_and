"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import { submitQuizAttempt } from "@/lib/quiz/actions";
import type { PublicQuizData, QuizAnswers, QuizGradeResult } from "@/lib/quiz";

export function QuizLessonPlayer({
  sectionId,
  courseSlug,
  quiz,
  alreadyPassed,
}: Readonly<{
  sectionId: string;
  courseSlug: string;
  quiz: PublicQuizData;
  alreadyPassed: boolean;
}>) {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [grade, setGrade] = useState<QuizGradeResult | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const { showToast } = useToast();

  const allAnswered = useMemo(
    () => quiz.questions.every((question) => Boolean(answers[question.id])),
    [answers, quiz.questions],
  );

  async function handleSubmit() {
    if (!allAnswered || status === "submitting") {
      return;
    }
    setStatus("submitting");
    const result = await submitQuizAttempt({
      courseSlug,
      sectionId,
      answers,
    });
    setStatus("idle");
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      return;
    }
    setGrade(result.result);
    setCertificateId(result.certificateId);
    showToast(result.result.passed ? "¡Quiz aprobado!" : "Revisa tus respuestas e intenta de nuevo.", {
      variant: result.result.passed ? "success" : "info",
    });
    router.refresh();
  }

  function handleRetry() {
    setAnswers({});
    setGrade(null);
    setCertificateId(null);
  }

  if (alreadyPassed && !grade) {
    return (
      <div className="rounded-xl bg-secondary-container p-md text-on-secondary-container shadow-sm sm:p-lg">
        <div className="mb-sm flex items-center gap-sm">
          <MaterialIcon name="check_circle" className="text-[28px]" />
          <h2 className="font-headline-md">Quiz aprobado</h2>
        </div>
        <p className="font-body-md">
          Ya completaste esta evaluación. Puedes continuar con el resto del curso.
        </p>
      </div>
    );
  }

  if (grade) {
    return (
      <div className="flex flex-col gap-md rounded-xl bg-surface-container-lowest p-md shadow-sm sm:p-lg">
        <div
          className={
            grade.passed
              ? "rounded-lg bg-secondary-container p-md text-on-secondary-container"
              : "rounded-lg bg-error-container p-md text-on-error-container"
          }
        >
          <h2 className="font-headline-md">
            {grade.passed ? "¡Aprobado!" : "Aún no apruebas"}
          </h2>
          <p className="mt-xs font-body-md">
            {grade.correctCount} de {grade.totalCount} correctas ({grade.scorePercent}%).
            {grade.passed
              ? " Esta lección ya cuenta en tu progreso."
              : " Debes acertar todas las preguntas para completar la lección."}
          </p>
        </div>

        <ol className="flex flex-col gap-md">
          {quiz.questions.map((question, index) => {
            const selected = answers[question.id];
            const correctId = grade.correctByQuestion[question.id];
            const isCorrect = selected === correctId;
            return (
              <li key={question.id} className="rounded-lg bg-surface-container-low p-md">
                <p className="mb-sm font-label-md text-on-surface">
                  {index + 1}. {question.prompt}
                </p>
                <ul className="flex flex-col gap-xs">
                  {question.options.map((option) => {
                    const chosen = selected === option.id;
                    const isAnswer = option.id === correctId;
                    let className =
                      "rounded-lg border border-outline-variant/40 px-sm py-sm font-body-sm text-on-surface";
                    if (isAnswer) {
                      className =
                        "rounded-lg border border-secondary bg-secondary-container/40 px-sm py-sm font-body-sm text-on-surface";
                    } else if (chosen && !isCorrect) {
                      className =
                        "rounded-lg border border-error bg-error-container/30 px-sm py-sm font-body-sm text-on-surface";
                    }
                    return (
                      <li key={option.id} className={className}>
                        {option.text}
                        {isAnswer ? " · correcta" : null}
                        {chosen && !isAnswer ? " · tu respuesta" : null}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-sm">
          {!grade.passed ? (
            <button
              type="button"
              className="rounded-lg bg-primary px-md py-sm font-label-md text-on-primary"
              onClick={handleRetry}
            >
              Reintentar
            </button>
          ) : null}
          {certificateId ? (
            <Link
              href={`/certificates/${certificateId}`}
              className="rounded-lg bg-primary px-md py-sm font-label-md text-on-primary"
            >
              Ver certificado
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md rounded-xl bg-surface-container-lowest p-md shadow-sm sm:p-lg">
      <p className="font-body-sm text-on-surface-variant">
        Selección múltiple. Debes responder correctamente todas las preguntas para completar esta
        lección.
      </p>

      <ol className="flex flex-col gap-lg">
        {quiz.questions.map((question, index) => (
          <li key={question.id}>
            <fieldset>
              <legend className="mb-sm font-label-md text-on-surface">
                {index + 1}. {question.prompt}
              </legend>
              <div className="flex flex-col gap-xs">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.id;
                  return (
                    <label
                      key={option.id}
                      className={
                        selected
                          ? "flex cursor-pointer items-start gap-sm rounded-lg border border-primary bg-primary/5 px-sm py-sm"
                          : "flex cursor-pointer items-start gap-sm rounded-lg border border-outline-variant/40 bg-surface px-sm py-sm hover:border-primary/40"
                      }
                    >
                      <input
                        className="mt-1"
                        type="radio"
                        name={`q-${question.id}`}
                        checked={selected}
                        onChange={() =>
                          setAnswers((current) => ({ ...current, [question.id]: option.id }))
                        }
                      />
                      <span className="font-body-md text-on-surface">{option.text}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="self-start rounded-lg bg-primary px-md py-sm font-label-md text-on-primary disabled:opacity-60"
        disabled={!allAnswered || status === "submitting"}
        onClick={() => {
          void handleSubmit();
        }}
      >
        {status === "submitting" ? "Calificando..." : "Enviar respuestas"}
      </button>
    </div>
  );
}
