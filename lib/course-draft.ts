import { CourseSectionKind, type SstCategory, type SstLevel } from "@/lib/sst";
import { createEmptyQuizData, type QuizData } from "@/lib/quiz";

export type DraftSection = {
  id: string;
  title: string;
  kind: CourseSectionKind;
  body: string;
  youtubeUrl: string;
  mediaUrl: string;
  mediaPublicId: string;
  mediaFilename: string;
  quiz: QuizData;
};

export type CourseEditorData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: SstCategory;
  level: SstLevel;
  coverUrl: string;
  coverPublicId: string;
  isPublic: boolean;
  issueCertificate: boolean;
  enableDiscussions: boolean;
  status: "draft" | "published";
  sections: readonly DraftSection[];
};

export function createDraftSection(existingCount: number): DraftSection {
  return {
    id: crypto.randomUUID(),
    title: nextLessonTitle(existingCount),
    kind: CourseSectionKind.Video,
    body: "",
    youtubeUrl: "",
    mediaUrl: "",
    mediaPublicId: "",
    mediaFilename: "",
    quiz: createEmptyQuizData(),
  };
}

export const INITIAL_DRAFT_SECTIONS: readonly DraftSection[] = [
  {
    id: "section-1",
    title: "Inducción y peligros",
    kind: CourseSectionKind.Video,
    body: "",
    youtubeUrl: "",
    mediaUrl: "",
    mediaPublicId: "",
    mediaFilename: "",
    quiz: createEmptyQuizData(),
  },
];

export function nextLessonTitle(existingCount: number): string {
  const number = String(existingCount + 1).padStart(2, "0");
  return `Sección ${number}`;
}

export function formatLessonIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function wrapSelection(
  value: string,
  start: number,
  end: number,
  prefix: string,
  suffix: string,
): { next: string; selectionStart: number; selectionEnd: number } {
  const selected = value.slice(start, end);
  const next = `${value.slice(0, start)}${prefix}${selected}${suffix}${value.slice(end)}`;
  return {
    next,
    selectionStart: start + prefix.length,
    selectionEnd: end + prefix.length,
  };
}
