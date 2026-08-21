export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
};

export type QuizData = {
  questions: QuizQuestion[];
};

/** Preguntas sin marcar la respuesta correcta (vista del empleado). */
export type PublicQuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export type PublicQuizData = {
  questions: PublicQuizQuestion[];
};

export type QuizAnswers = Record<string, string>;

export type QuizGradeResult = {
  scorePercent: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  correctByQuestion: Record<string, string>;
};

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;
const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 20;

export function createEmptyQuizQuestion(): QuizQuestion {
  const optionA = crypto.randomUUID();
  const optionB = crypto.randomUUID();
  return {
    id: crypto.randomUUID(),
    prompt: "",
    options: [
      { id: optionA, text: "" },
      { id: optionB, text: "" },
    ],
    correctOptionId: optionA,
  };
}

export function createEmptyQuizData(): QuizData {
  return { questions: [createEmptyQuizQuestion()] };
}

export function toPublicQuiz(quiz: QuizData): PublicQuizData {
  return {
    questions: quiz.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      options: question.options.map((option) => ({ id: option.id, text: option.text })),
    })),
  };
}

export function isQuizData(value: unknown): value is QuizData {
  if (!value || typeof value !== "object") {
    return false;
  }
  const questions = (value as { questions?: unknown }).questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    return false;
  }
  return questions.every((question) => {
    if (!question || typeof question !== "object") {
      return false;
    }
    const q = question as QuizQuestion;
    return (
      typeof q.id === "string" &&
      typeof q.prompt === "string" &&
      typeof q.correctOptionId === "string" &&
      Array.isArray(q.options) &&
      q.options.every(
        (option) =>
          option &&
          typeof option === "object" &&
          typeof option.id === "string" &&
          typeof option.text === "string",
      )
    );
  });
}

export function validateQuizData(quiz: QuizData): string | null {
  if (quiz.questions.length < MIN_QUESTIONS) {
    return "El quiz necesita al menos una pregunta.";
  }
  if (quiz.questions.length > MAX_QUESTIONS) {
    return `El quiz admite máximo ${MAX_QUESTIONS} preguntas.`;
  }

  for (const [index, question] of quiz.questions.entries()) {
    const label = `Pregunta ${index + 1}`;
    if (question.prompt.trim().length === 0) {
      return `${label}: escribe el enunciado.`;
    }
    if (question.options.length < MIN_OPTIONS || question.options.length > MAX_OPTIONS) {
      return `${label}: usa entre ${MIN_OPTIONS} y ${MAX_OPTIONS} opciones.`;
    }
    const optionIds = new Set<string>();
    for (const option of question.options) {
      if (option.text.trim().length === 0) {
        return `${label}: todas las opciones deben tener texto.`;
      }
      if (optionIds.has(option.id)) {
        return `${label}: hay opciones duplicadas.`;
      }
      optionIds.add(option.id);
    }
    if (!optionIds.has(question.correctOptionId)) {
      return `${label}: marca la respuesta correcta.`;
    }
  }

  return null;
}

export function gradeQuiz(quiz: QuizData, answers: QuizAnswers): QuizGradeResult {
  const totalCount = quiz.questions.length;
  let correctCount = 0;
  const correctByQuestion: Record<string, string> = {};

  for (const question of quiz.questions) {
    correctByQuestion[question.id] = question.correctOptionId;
    if (answers[question.id] === question.correctOptionId) {
      correctCount += 1;
    }
  }

  const scorePercent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
  return {
    scorePercent,
    correctCount,
    totalCount,
    passed: totalCount > 0 && correctCount === totalCount,
    correctByQuestion,
  };
}
