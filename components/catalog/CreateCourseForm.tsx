"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import { saveCourse, uploadCourseMedia } from "@/lib/courses/actions";
import {
  createDraftSection,
  formatLessonIndex,
  INITIAL_DRAFT_SECTIONS,
  wrapSelection,
  type CourseEditorData,
  type DraftSection,
} from "@/lib/course-draft";
import {
  createEmptyQuizData,
  createEmptyQuizQuestion,
  type QuizData,
  type QuizQuestion,
} from "@/lib/quiz";
import {
  CourseSectionKind,
  SST_CATEGORY_OPTIONS,
  SST_LEVEL_OPTIONS,
  SstCategory,
  SstLevel,
} from "@/lib/sst";
import { isYouTubeUrl } from "@/lib/youtube";

type FormStatus = "idle" | "saving" | "publishing" | "saved" | "published";

const SECTION_KIND_OPTIONS: readonly { value: CourseSectionKind; label: string; icon: string }[] = [
  { value: CourseSectionKind.Video, label: "Video (YouTube)", icon: "play_circle" },
  { value: CourseSectionKind.Image, label: "Imagen", icon: "image" },
  { value: CourseSectionKind.Document, label: "Documento", icon: "description" },
  { value: CourseSectionKind.Quiz, label: "Quiz", icon: "quiz" },
];

async function uploadAsset(file: File, kind: "image" | "document") {
  const formData = new FormData();
  formData.set("kind", kind);
  formData.set("file", file);
  return uploadCourseMedia(formData);
}

export function CreateCourseForm({
  initialCourse,
}: Readonly<{ initialCourse?: CourseEditorData }>) {
  const router = useRouter();
  const isEditing = Boolean(initialCourse);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(initialCourse?.title ?? "");
  const [category, setCategory] = useState<SstCategory | "">(initialCourse?.category ?? "");
  const [level, setLevel] = useState<SstLevel>(initialCourse?.level ?? SstLevel.Basico);
  const [description, setDescription] = useState(initialCourse?.description ?? "");
  const [coverUrl, setCoverUrl] = useState(initialCourse?.coverUrl ?? "");
  const [coverPublicId, setCoverPublicId] = useState(initialCourse?.coverPublicId ?? "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [sections, setSections] = useState<DraftSection[]>(() =>
    initialCourse
      ? initialCourse.sections.map((section) => ({ ...section }))
      : INITIAL_DRAFT_SECTIONS.map((section) => ({ ...section })),
  );
  const [uploadingSectionId, setUploadingSectionId] = useState<string | null>(null);
  const [publicVisibility, setPublicVisibility] = useState(initialCourse?.isPublic ?? true);
  const [issueCertificate, setIssueCertificate] = useState(initialCourse?.issueCertificate ?? true);
  const [enableDiscussions, setEnableDiscussions] = useState(
    initialCourse?.enableDiscussions ?? true,
  );
  const [status, setStatus] = useState<FormStatus>("idle");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const isBusy = status === "saving" || status === "publishing" || uploadingCover || uploadingSectionId !== null;

  function applyFormat(prefix: string, suffix: string) {
    const field = descriptionRef.current;
    if (!field) {
      return;
    }
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const wrapped = wrapSelection(description, start, end, prefix, suffix);
    setDescription(wrapped.next);
    window.requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(wrapped.selectionStart, wrapped.selectionEnd);
    });
  }

  function patchSection(id: string, patch: Partial<DraftSection>) {
    setSections((current) => current.map((section) => (section.id === id ? { ...section, ...patch } : section)));
  }

  function addSection() {
    setSections((current) => [...current, createDraftSection(current.length)]);
  }

  function removeSection(id: string) {
    setSections((current) => current.filter((section) => section.id !== id));
  }

  function reorderSections(sourceId: string, targetId: string) {
    if (sourceId === targetId) {
      return;
    }
    setSections((current) => {
      const sourceIndex = current.findIndex((section) => section.id === sourceId);
      const targetIndex = current.findIndex((section) => section.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) {
        return current;
      }
      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      if (!moved) {
        return current;
      }
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }

  async function onCoverSelected(file: File | undefined) {
    if (!file) {
      return;
    }
    setUploadingCover(true);
    const result = await uploadAsset(file, "image");
    setUploadingCover(false);
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      return;
    }
    setCoverUrl(result.url);
    setCoverPublicId(result.publicId);
  }

  async function onSectionFileSelected(section: DraftSection, file: File | undefined) {
    if (!file) {
      return;
    }
    const kind = section.kind === CourseSectionKind.Document ? "document" : "image";
    setUploadingSectionId(section.id);
    const result = await uploadAsset(file, kind);
    setUploadingSectionId(null);
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      return;
    }
    patchSection(section.id, {
      mediaUrl: result.url,
      mediaPublicId: result.publicId,
      mediaFilename: result.filename,
    });
  }

  async function persist(publish: boolean) {
    if (title.trim().length < 3) {
      showToast("El título del curso es obligatorio.", { variant: "error" });
      return;
    }
    if (!category) {
      showToast("Selecciona una categoría SST.", { variant: "error" });
      return;
    }
    if (sections.length === 0) {
      showToast("Agrega al menos una sección.", { variant: "error" });
      return;
    }
    const invalidYoutube = sections.find(
      (section) => section.kind === CourseSectionKind.Video && !isYouTubeUrl(section.youtubeUrl),
    );
    if (invalidYoutube) {
      showToast(
        `La sección "${invalidYoutube.title || "sin título"}" necesita un enlace válido de YouTube.`,
        { variant: "error" },
      );
      return;
    }
    const missingMedia = sections.find(
      (section) =>
        (section.kind === CourseSectionKind.Image || section.kind === CourseSectionKind.Document) &&
        section.mediaUrl.trim().length === 0,
    );
    if (missingMedia) {
      showToast(`La sección "${missingMedia.title || "sin título"}" necesita un archivo.`, {
        variant: "error",
      });
      return;
    }
    const incompleteQuiz = sections.find((section) => {
      if (section.kind !== CourseSectionKind.Quiz) {
        return false;
      }
      return section.quiz.questions.some(
        (question) =>
          question.prompt.trim().length === 0 ||
          question.options.some((option) => option.text.trim().length === 0) ||
          !question.options.some((option) => option.id === question.correctOptionId),
      );
    });
    if (incompleteQuiz) {
      showToast(
        `El quiz "${incompleteQuiz.title || "sin título"}" necesita enunciados, opciones y una respuesta correcta en cada pregunta.`,
        { variant: "error" },
      );
      return;
    }

    setStatus(publish ? "publishing" : "saving");
    const result = await saveCourse({
      courseId: initialCourse?.id,
      title,
      description,
      category,
      level,
      coverUrl,
      coverPublicId,
      isPublic: publicVisibility,
      issueCertificate,
      enableDiscussions,
      publish,
      sections: sections.map((section) => ({
        id: section.id,
        title: section.title,
        kind: section.kind,
        body: section.body,
        youtubeUrl: section.youtubeUrl,
        mediaUrl: section.mediaUrl,
        mediaPublicId: section.mediaPublicId,
        mediaFilename: section.mediaFilename,
        quiz: section.quiz,
      })),
    });
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      setStatus("idle");
      return;
    }
    setStatus(publish ? "published" : "saved");
    showToast(publish ? "Curso publicado correctamente." : "Borrador guardado correctamente.");
    router.push(`/courses/${result.slug}`);
    router.refresh();
  }

  return (
    <div className="flex w-full flex-col gap-gutter">
      <div className="flex flex-col gap-md border-b border-outline-variant/20 pb-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline-lg tracking-tight text-on-background">
            {isEditing ? "Editar curso SST" : "Crear curso SST"}
          </h1>
          <p className="mt-xs font-body-md text-on-surface-variant">
            {isEditing
              ? "Actualiza la identidad, secciones y visibilidad. Puedes guardar borrador o publicar."
              : "Define la identidad, sube evidencias a Cloudinary o pega un video de YouTube, y publica el módulo."}
          </p>
          {isEditing && initialCourse ? (
            <p className="mt-xs font-label-sm text-on-surface-variant">
              Estado actual:{" "}
              <span className="font-semibold text-on-surface">
                {initialCourse.status === "published" ? "Publicado" : "Borrador"}
              </span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <button
            className="rounded-lg border border-outline-variant/30 bg-surface px-md py-sm font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-60"
            type="button"
            disabled={isBusy}
            onClick={() => {
              void persist(false);
            }}
          >
            {draftLabel(status)}
          </button>
          <button
            className="rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
            type="button"
            disabled={isBusy || title.trim().length === 0}
            onClick={() => {
              void persist(true);
            }}
          >
            {publishLabel(status)}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-gutter lg:col-span-8">
          <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm">
            <h2 className="mb-md flex items-center gap-sm font-headline-md text-on-surface">
              <MaterialIcon name="info" className="text-primary" />
              Identidad del curso
            </h2>
            <div className="space-y-md">
              <div>
                <label className="mb-xs block font-label-md text-on-surface" htmlFor="course-title">
                  Título del curso
                </label>
                <input
                  id="course-title"
                  className="w-full rounded-lg border border-outline-variant bg-surface-bright px-sm py-sm font-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Ej.: Trabajo en alturas — Nivel básico"
                  type="text"
                  value={title}
                  disabled={isBusy}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="grid gap-md sm:grid-cols-2">
                <div>
                  <label className="mb-xs block font-label-md text-on-surface" htmlFor="course-category">
                    Categoría SST
                  </label>
                  <div className="relative">
                    <select
                      id="course-category"
                      className="w-full appearance-none rounded-lg border border-outline-variant bg-surface-bright px-sm py-sm font-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                      value={category}
                      disabled={isBusy}
                      onChange={(event) => setCategory(event.target.value as SstCategory | "")}
                    >
                      <option disabled value="">
                        Selecciona el tipo de peligro o tema SST
                      </option>
                      {SST_CATEGORY_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <MaterialIcon
                      name="expand_more"
                      className="pointer-events-none absolute top-1/2 right-sm -translate-y-1/2 text-outline"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-xs block font-label-md text-on-surface" htmlFor="course-level">
                    Nivel
                  </label>
                  <div className="relative">
                    <select
                      id="course-level"
                      className="w-full appearance-none rounded-lg border border-outline-variant bg-surface-bright px-sm py-sm font-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                      value={level}
                      disabled={isBusy}
                      onChange={(event) => setLevel(event.target.value as SstLevel)}
                    >
                      {SST_LEVEL_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <MaterialIcon
                      name="expand_more"
                      className="pointer-events-none absolute top-1/2 right-sm -translate-y-1/2 text-outline"
                    />
                  </div>
                </div>
              </div>
              <div>
                <span className="mb-xs block font-label-md text-on-surface">Portada</span>
                <label className="flex cursor-pointer flex-col overflow-hidden rounded-lg border border-dashed border-outline-variant/50 bg-surface-bright transition-colors hover:border-primary">
                  {coverUrl ? (
                    <span className="relative block h-40 w-full">
                      <Image src={coverUrl} alt="Portada del curso" fill unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
                    </span>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center gap-xs text-on-surface-variant">
                      <MaterialIcon name="add_photo_alternate" className="text-[32px]" />
                      <span className="font-body-sm">
                        {uploadingCover ? "Subiendo a Cloudinary..." : "JPG, PNG, WEBP o GIF · máx. 8 MB"}
                      </span>
                    </div>
                  )}
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={isBusy}
                    onChange={(event) => {
                      void onCoverSelected(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>
              <div>
                <label className="mb-xs block font-label-md text-on-surface" htmlFor="course-description">
                  Descripción del curso
                </label>
                <div className="flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-bright transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <div className="flex gap-sm border-b border-outline-variant bg-surface-container-low px-sm py-xs">
                    <FormatButton icon="format_bold" label="Negrita" onClick={() => applyFormat("**", "**")} />
                    <FormatButton icon="format_italic" label="Cursiva" onClick={() => applyFormat("_", "_")} />
                    <FormatButton icon="format_list_bulleted" label="Lista" onClick={() => applyFormat("- ", "")} />
                    <FormatButton icon="link" label="Enlace" onClick={() => applyFormat("[", "](url)")} />
                  </div>
                  <textarea
                    id="course-description"
                    ref={descriptionRef}
                    className="min-h-[120px] w-full resize-y bg-transparent p-sm font-body-md text-on-surface outline-none"
                    placeholder="Describe peligros, controles, EPP y resultados de aprendizaje..."
                    value={description}
                    disabled={isBusy}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm">
            <h2 className="mb-md flex items-center gap-sm font-headline-md text-on-surface">
              <MaterialIcon name="view_agenda" className="text-primary" />
              Secciones
            </h2>
            <div className="flex flex-col gap-md">
              {sections.map((section, index) => (
                <SectionEditor
                  key={section.id}
                  index={index}
                  section={section}
                  disabled={isBusy}
                  uploading={uploadingSectionId === section.id}
                  onChange={(patch) => patchSection(section.id, patch)}
                  onRemove={() => removeSection(section.id)}
                  onFile={(file) => {
                    void onSectionFileSelected(section, file);
                  }}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-gutter lg:col-span-4">
          <section className="flex-1 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm">
            <h2 className="mb-md flex items-center gap-sm font-headline-md text-on-surface">
              <MaterialIcon name="view_list" className="text-primary" />
              Orden del temario
            </h2>
            <div className="mb-md space-y-sm">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className="group flex cursor-move items-center justify-between rounded-lg border border-outline-variant/30 bg-surface p-sm"
                  draggable={!isBusy}
                  onDragStart={() => setDraggingId(section.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggingId) {
                      reorderSections(draggingId, section.id);
                    }
                    setDraggingId(null);
                  }}
                >
                  <div className="flex min-w-0 items-center gap-sm">
                    <MaterialIcon name="drag_indicator" className="cursor-grab text-outline active:cursor-grabbing" />
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-surface-container-high text-label-sm font-bold text-on-surface-variant">
                      {formatLessonIndex(index)}
                    </div>
                    <span className="truncate font-body-md text-on-surface">{section.title}</span>
                  </div>
                  <button
                    className="p-xs text-outline opacity-0 transition-opacity group-hover:opacity-100 hover:text-error"
                    type="button"
                    aria-label={`Eliminar ${section.title}`}
                    disabled={isBusy || sections.length === 1}
                    onClick={() => removeSection(section.id)}
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button
              className="flex w-full items-center justify-center gap-xs rounded-lg border border-dashed border-primary py-sm font-label-md text-primary transition-colors hover:bg-primary/5"
              type="button"
              disabled={isBusy}
              onClick={addSection}
            >
              <MaterialIcon name="add" className="text-[18px]" /> Agregar sección
            </button>
          </section>

          <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm">
            <h2 className="mb-md flex items-center gap-sm font-headline-md text-on-surface">
              <MaterialIcon name="settings" className="text-primary" />
              Ajustes del curso
            </h2>
            <div className="space-y-md">
              <SettingToggle
                title="Visible para todo el personal"
                description="Aparece en el catálogo de todos los empleados (sin necesidad de asignación)"
                checked={publicVisibility}
                disabled={isBusy}
                onChange={setPublicVisibility}
              />
              <SettingToggle
                title="Emitir certificado"
                description="Al completar el curso, el empleado puede ver e imprimir su certificado"
                checked={issueCertificate}
                disabled={isBusy}
                onChange={setIssueCertificate}
              />
              <SettingToggle
                title="Habilitar consultas"
                description="Permite preguntas y respuestas en la página del curso"
                checked={enableDiscussions}
                disabled={isBusy}
                onChange={setEnableDiscussions}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionEditor({
  index,
  section,
  disabled,
  uploading,
  onChange,
  onRemove,
  onFile,
}: Readonly<{
  index: number;
  section: DraftSection;
  disabled: boolean;
  uploading: boolean;
  onChange: (patch: Partial<DraftSection>) => void;
  onRemove: () => void;
  onFile: (file: File | undefined) => void;
}>) {
  return (
    <article className="rounded-lg border border-outline-variant/30 bg-surface p-md">
      <div className="mb-sm flex items-start justify-between gap-sm">
        <div className="flex min-w-0 flex-1 items-center gap-sm">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-container-high font-label-sm text-on-surface-variant">
            {formatLessonIndex(index)}
          </span>
          <input
            className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs font-body-md text-on-surface outline-none focus:border-primary"
            value={section.title}
            disabled={disabled}
            aria-label={`Título de la sección ${formatLessonIndex(index)}`}
            onChange={(event) => onChange({ title: event.target.value })}
          />
        </div>
        <button
          className="p-xs text-outline hover:text-error"
          type="button"
          aria-label={`Eliminar ${section.title}`}
          disabled={disabled}
          onClick={onRemove}
        >
          <MaterialIcon name="delete" className="text-[18px]" />
        </button>
      </div>

      <div className="mb-sm flex flex-wrap gap-xs">
        {SECTION_KIND_OPTIONS.map((option) => {
          const active = section.kind === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              className={
                active
                  ? "flex items-center gap-xs rounded-full bg-primary px-sm py-xs font-label-sm text-on-primary"
                  : "flex items-center gap-xs rounded-full bg-surface-container-high px-sm py-xs font-label-sm text-on-surface hover:bg-surface-container-highest"
              }
              onClick={() =>
                onChange({
                  kind: option.value,
                  youtubeUrl: "",
                  mediaUrl: "",
                  mediaPublicId: "",
                  mediaFilename: "",
                  quiz:
                    option.value === CourseSectionKind.Quiz
                      ? section.quiz.questions.length > 0
                        ? section.quiz
                        : createEmptyQuizData()
                      : section.quiz,
                })
              }
            >
              <MaterialIcon name={option.icon} className="text-[16px]" />
              {option.label}
            </button>
          );
        })}
      </div>

      {section.kind === CourseSectionKind.Video ? (
        <label className="mb-sm block">
          <span className="mb-xs block font-label-sm text-on-surface-variant">Enlace de YouTube</span>
          <input
            className="w-full rounded-lg border border-outline-variant bg-surface-bright px-sm py-sm font-body-md text-on-surface outline-none focus:border-primary"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={section.youtubeUrl}
            disabled={disabled}
            onChange={(event) => onChange({ youtubeUrl: event.target.value })}
          />
        </label>
      ) : null}

      {section.kind === CourseSectionKind.Image || section.kind === CourseSectionKind.Document ? (
        <label className="mb-sm flex cursor-pointer flex-col rounded-lg border border-dashed border-outline-variant/50 bg-surface-bright px-sm py-md text-center">
          <MaterialIcon
            name={section.kind === CourseSectionKind.Document ? "upload_file" : "add_photo_alternate"}
            className="mx-auto text-[28px] text-outline"
          />
          <span className="mt-xs font-body-sm text-on-surface-variant">
            {sectionUploadHint(section, uploading)}
          </span>
          <input
            className="sr-only"
            type="file"
            accept={
              section.kind === CourseSectionKind.Document
                ? "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.doc,.docx"
                : "image/jpeg,image/png,image/webp,image/gif"
            }
            disabled={disabled}
            onChange={(event) => {
              onFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
      ) : null}

      {section.kind === CourseSectionKind.Image && section.mediaUrl ? (
        <div className="relative mb-sm h-40 w-full overflow-hidden rounded-lg">
          <Image src={section.mediaUrl} alt={section.title} fill unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
        </div>
      ) : null}

      {section.kind === CourseSectionKind.Quiz ? (
        <QuizSectionEditor
          quiz={section.quiz}
          disabled={disabled}
          onChange={(quiz) => onChange({ quiz })}
        />
      ) : null}

      <label className="mt-sm block">
        <span className="mb-xs block font-label-sm text-on-surface-variant">Notas para el empleado (opcional)</span>
        <textarea
          className="min-h-[72px] w-full resize-y rounded-lg border border-outline-variant bg-surface-bright p-sm font-body-md text-on-surface outline-none focus:border-primary"
          value={section.body}
          disabled={disabled}
          placeholder="Controles, EPP o puntos de verificación de esta sección."
          onChange={(event) => onChange({ body: event.target.value })}
        />
      </label>
    </article>
  );
}

function QuizSectionEditor({
  quiz,
  disabled,
  onChange,
}: Readonly<{
  quiz: QuizData;
  disabled: boolean;
  onChange: (quiz: QuizData) => void;
}>) {
  function patchQuestion(questionId: string, patch: Partial<QuizQuestion>) {
    onChange({
      questions: quiz.questions.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question,
      ),
    });
  }

  function addQuestion() {
    onChange({ questions: [...quiz.questions, createEmptyQuizQuestion()] });
  }

  function removeQuestion(questionId: string) {
    if (quiz.questions.length <= 1) {
      return;
    }
    onChange({ questions: quiz.questions.filter((question) => question.id !== questionId) });
  }

  function addOption(questionId: string) {
    const question = quiz.questions.find((item) => item.id === questionId);
    if (!question || question.options.length >= 6) {
      return;
    }
    patchQuestion(questionId, {
      options: [...question.options, { id: crypto.randomUUID(), text: "" }],
    });
  }

  function removeOption(questionId: string, optionId: string) {
    const question = quiz.questions.find((item) => item.id === questionId);
    if (!question || question.options.length <= 2) {
      return;
    }
    const options = question.options.filter((option) => option.id !== optionId);
    patchQuestion(questionId, {
      options,
      correctOptionId:
        question.correctOptionId === optionId ? (options[0]?.id ?? "") : question.correctOptionId,
    });
  }

  return (
    <div className="mb-sm flex flex-col gap-md rounded-lg border border-outline-variant/40 bg-surface-bright p-md">
      <p className="font-body-sm text-on-surface-variant">
        Solo selección múltiple. Marca la respuesta correcta de cada pregunta; el sistema califica
        automáticamente (se requiere 100% para completar la lección).
      </p>
      {quiz.questions.map((question, questionIndex) => (
        <div key={question.id} className="rounded-lg border border-outline-variant/30 bg-surface p-md">
          <div className="mb-sm flex items-start justify-between gap-sm">
            <label className="min-w-0 flex-1">
              <span className="mb-xs block font-label-sm text-on-surface-variant">
                Pregunta {questionIndex + 1}
              </span>
              <input
                className="w-full rounded-lg border border-outline-variant bg-surface-bright px-sm py-sm font-body-md text-on-surface outline-none focus:border-primary"
                value={question.prompt}
                disabled={disabled}
                placeholder="Enunciado de la pregunta"
                onChange={(event) => patchQuestion(question.id, { prompt: event.target.value })}
              />
            </label>
            <button
              type="button"
              className="mt-md p-xs text-outline hover:text-error"
              disabled={disabled || quiz.questions.length <= 1}
              aria-label={`Eliminar pregunta ${questionIndex + 1}`}
              onClick={() => removeQuestion(question.id)}
            >
              <MaterialIcon name="delete" className="text-[18px]" />
            </button>
          </div>

          <div className="flex flex-col gap-xs">
            {question.options.map((option, optionIndex) => (
              <div key={option.id} className="flex items-center gap-sm">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctOptionId === option.id}
                  disabled={disabled}
                  aria-label={`Marcar opción ${optionIndex + 1} como correcta`}
                  onChange={() => patchQuestion(question.id, { correctOptionId: option.id })}
                />
                <input
                  className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs font-body-md text-on-surface outline-none focus:border-primary"
                  value={option.text}
                  disabled={disabled}
                  placeholder={`Opción ${optionIndex + 1}`}
                  onChange={(event) =>
                    patchQuestion(question.id, {
                      options: question.options.map((item) =>
                        item.id === option.id ? { ...item, text: event.target.value } : item,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  className="p-xs text-outline hover:text-error"
                  disabled={disabled || question.options.length <= 2}
                  aria-label={`Eliminar opción ${optionIndex + 1}`}
                  onClick={() => removeOption(question.id, option.id)}
                >
                  <MaterialIcon name="close" className="text-[16px]" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-sm flex flex-wrap gap-sm">
            <button
              type="button"
              className="font-label-sm text-primary hover:underline disabled:opacity-50"
              disabled={disabled || question.options.length >= 6}
              onClick={() => addOption(question.id)}
            >
              + Opción
            </button>
            <span className="font-label-sm text-on-surface-variant">
              La opción marcada con el círculo es la correcta.
            </span>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="self-start rounded-lg border border-outline-variant px-sm py-xs font-label-sm text-on-surface hover:bg-surface-container-high disabled:opacity-50"
        disabled={disabled || quiz.questions.length >= 20}
        onClick={addQuestion}
      >
        + Agregar pregunta
      </button>
    </div>
  );
}

function sectionUploadHint(section: DraftSection, uploading: boolean): string {
  if (uploading) {
    return "Subiendo a Cloudinary...";
  }
  if (section.mediaFilename) {
    return section.mediaFilename;
  }
  if (section.kind === CourseSectionKind.Document) {
    return "PDF o Word · máx. 8 MB";
  }
  return "JPG, PNG, WEBP o GIF · máx. 8 MB";
}

function draftLabel(status: FormStatus): string {
  if (status === "saving") {
    return "Guardando...";
  }
  if (status === "saved") {
    return "Borrador guardado";
  }
  return "Guardar borrador";
}

function publishLabel(status: FormStatus): string {
  if (status === "publishing") {
    return "Publicando...";
  }
  if (status === "published") {
    return "Publicado";
  }
  return "Publicar curso";
}

function FormatButton({
  icon,
  label,
  onClick,
}: Readonly<{ icon: string; label: string; onClick: () => void }>) {
  return (
    <button
      className="rounded p-xs text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      <MaterialIcon name={icon} className="text-[18px]" />
    </button>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  disabled,
  onChange,
}: Readonly<{
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
}>) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-sm">
      <span>
        <span className="block font-label-md text-on-surface transition-colors group-hover:text-primary">
          {title}
        </span>
        <span className="block font-body-sm text-on-surface-variant">{description}</span>
      </span>
      <div className="relative inline-flex h-6 w-11 items-center">
        <input
          className="peer sr-only"
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <div className="h-6 w-11 rounded-full bg-surface-container-high shadow-inner transition-colors after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-outline-variant after:bg-surface-container-lowest after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" />
      </div>
    </label>
  );
}
