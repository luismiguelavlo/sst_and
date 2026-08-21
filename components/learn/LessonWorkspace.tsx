"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CurriculumItem, NeuralNetworkDiagram } from "@/components/learn/LessonChrome";
import { QuizLessonPlayer } from "@/components/learn/QuizLessonPlayer";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { courseDetailPath, courseLessonPath } from "@/lib/courses";
import {
  formatPlayerTime,
  lessonKindIcon,
  lessonKindLabel,
  type CourseModule,
  type Lesson,
} from "@/lib/lessons";
import type { LessonProgressState } from "@/lib/my-courses";
import { youtubeEmbedUrl } from "@/lib/youtube";

export function LessonWorkspace({
  module,
  lessonId,
  progress,
}: Readonly<{
  module: CourseModule;
  lessonId: string;
  progress?: LessonProgressState;
}>) {
  const activeIndex = Math.max(
    0,
    module.lessons.findIndex((item) => item.id === lessonId),
  );
  const lesson = module.lessons.at(activeIndex);
  const previous = activeIndex > 0 ? module.lessons[activeIndex - 1] : undefined;
  const next = module.lessons[activeIndex + 1];
  const viewedSet = useMemo(
    () => new Set(progress?.viewedSectionIds ?? []),
    [progress?.viewedSectionIds],
  );
  const progressPercent = progress?.progressPercent ?? 0;
  const viewedCount = progress?.viewedCount ?? 0;
  const totalCount = progress?.totalCount ?? module.lessons.length;

  if (!lesson) {
    return null;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-gutter pb-xl lg:grid-cols-12">
      <section className="col-span-1 flex flex-col gap-lg lg:col-span-8">
        <div className="flex flex-col gap-sm">
          <nav
            aria-label="Ruta de navegación"
            className="flex flex-wrap items-center gap-xs font-label-md text-on-surface-variant"
          >
            <Link className="transition-colors hover:text-primary" href="/my-courses">
              Mis cursos
            </Link>
            <MaterialIcon name="chevron_right" className="text-[16px]" />
            <Link className="transition-colors hover:text-primary" href={courseDetailPath(module.slug)}>
              {module.courseTitle}
            </Link>
            <MaterialIcon name="chevron_right" className="text-[16px]" />
            <span className="text-on-surface">{lesson.title}</span>
          </nav>
          <h1 className="text-[28px] leading-9 font-display-lg text-on-surface sm:text-display-lg">
            {lesson.title}
          </h1>
        </div>

        <LessonMedia
          lesson={lesson}
          posterUrl={module.posterUrl}
          posterAlt={module.posterAlt}
          courseSlug={module.slug}
          alreadyPassed={viewedSet.has(lesson.id)}
        />

        <div className="flex flex-col gap-sm py-md sm:flex-row sm:items-center sm:justify-between">
          {previous ? (
            <Link
              className="flex items-center justify-center gap-sm rounded-lg px-md py-sm font-label-md text-primary transition-colors hover:bg-surface-container"
              href={courseLessonPath(module.slug, previous.id)}
            >
              <MaterialIcon name="arrow_back" />
              Lección anterior
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              className="flex items-center justify-center gap-sm rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-md"
              href={courseLessonPath(module.slug, next.id)}
            >
              Siguiente lección
              <MaterialIcon name="arrow_forward" />
            </Link>
          ) : (
            <Link
              className="flex items-center justify-center gap-sm rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm"
              href={courseDetailPath(module.slug)}
            >
              Volver al curso
              <MaterialIcon name="check" />
            </Link>
          )}
        </div>

        <article className="flex flex-col gap-md rounded-xl bg-surface-container-lowest p-md shadow-sm sm:p-lg">
          <h2 className="font-headline-md text-on-surface">Sobre esta lección</h2>
          <div className="flex flex-col gap-sm font-body-md text-on-surface-variant">
            {lesson.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {lesson.id === "neural-networks" ? <NeuralNetworkDiagram /> : null}
        </article>
      </section>

      <aside className="col-span-1 flex flex-col gap-lg lg:col-span-4">
        <div className="relative overflow-hidden rounded-xl bg-primary-container p-md text-on-primary-container shadow-sm">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative z-10 mb-sm flex items-center justify-between">
            <span className="font-headline-md">{module.moduleLabel}</span>
            <span className="font-label-md opacity-80">
              {viewedCount} de {totalCount} vistas
            </span>
          </div>
          <div className="relative z-10 h-2 w-full overflow-hidden rounded-full bg-primary/20">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="relative z-10 mt-sm font-label-sm opacity-80">{progressPercent}% completado</p>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
          <div className="bg-surface-container-low p-md">
            <h3 className="font-headline-lg-mobile text-on-surface">Temario</h3>
          </div>
          <div className="flex flex-col">
            {module.lessons.map((item) => (
              <CurriculumItem
                key={item.id}
                kindLabel={lessonKindLabel(item.kind)}
                title={item.title}
                meta={item.durationLabel}
                state={curriculumState(item.id, lessonId, viewedSet)}
                kindIcon={lessonKindIcon(item.kind)}
                href={courseLessonPath(module.slug, item.id)}
              />
            ))}
          </div>
        </div>

        {module.resources.length > 0 ? (
          <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
            <h3 className="font-label-md tracking-widest text-on-surface-variant uppercase">Recursos</h3>
            <ul className="flex flex-col gap-xs">
              {module.resources.map((resource) => (
                <li key={resource.name}>
                  <a
                    className="group flex items-center gap-sm rounded p-sm font-body-sm text-primary transition-colors hover:bg-surface-container"
                    href={resource.href ?? "#"}
                    target={resource.href ? "_blank" : undefined}
                    rel={resource.href ? "noreferrer" : undefined}
                  >
                    <MaterialIcon
                      name={resource.icon}
                      className="text-outline transition-colors group-hover:text-primary"
                    />
                    <span className="flex-1 truncate">{resource.name}</span>
                    <MaterialIcon
                      name="download"
                      className="text-[18px] opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function curriculumState(
  lessonId: string,
  activeLessonId: string,
  viewedSet: ReadonlySet<string>,
): "completed" | "active" | "upcoming" {
  if (lessonId === activeLessonId) {
    return "active";
  }
  if (viewedSet.has(lessonId)) {
    return "completed";
  }
  return "upcoming";
}

function LessonMedia({
  lesson,
  posterUrl,
  posterAlt,
  courseSlug,
  alreadyPassed,
}: Readonly<{
  lesson: Lesson;
  posterUrl: string;
  posterAlt: string;
  courseSlug: string;
  alreadyPassed: boolean;
}>) {
  if (lesson.kind === "quiz" && lesson.quiz) {
    return (
      <QuizLessonPlayer
        sectionId={lesson.id}
        courseSlug={courseSlug}
        quiz={lesson.quiz}
        alreadyPassed={alreadyPassed}
      />
    );
  }

  if (lesson.kind === "video" && lesson.youtubeUrl) {
    const embed = youtubeEmbedUrl(lesson.youtubeUrl);
    if (embed) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-inverse-surface shadow-md">
          <iframe
            title={lesson.title}
            src={embed}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
    }
  }

  if (lesson.kind === "image" && lesson.mediaUrl) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-inverse-surface shadow-md">
        <Image
          src={lesson.mediaUrl}
          alt={lesson.title}
          fill
          unoptimized
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>
    );
  }

  if (lesson.kind === "document" && lesson.mediaUrl) {
    const isPdf = /\.pdf($|\?)/i.test(lesson.mediaFilename ?? lesson.mediaUrl);
    return (
      <div className="flex aspect-video w-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-md">
        {isPdf ? (
          <iframe title={lesson.title} src={lesson.mediaUrl} className="h-full w-full flex-1" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-sm p-md text-center">
            <MaterialIcon name="description" className="text-[48px] text-primary" />
            <p className="font-headline-md text-on-surface">{lesson.mediaFilename ?? "Documento del curso"}</p>
            <a
              className="rounded-lg bg-primary px-md py-sm font-label-md text-on-primary"
              href={lesson.mediaUrl}
              target="_blank"
              rel="noreferrer"
            >
              Descargar documento
            </a>
          </div>
        )}
      </div>
    );
  }

  return <VideoPlayer lesson={lesson} posterUrl={posterUrl} posterAlt={posterAlt} />;
}

function VideoPlayer({
  lesson,
  posterUrl,
  posterAlt,
}: Readonly<{ lesson: Lesson; posterUrl: string; posterAlt: string }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(lesson.startSeconds);

  useEffect(() => {
    setPlaying(false);
    setCurrentSeconds(lesson.startSeconds);
  }, [lesson.id, lesson.startSeconds]);

  useEffect(() => {
    if (!playing) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setCurrentSeconds((value) => {
        if (value >= lesson.totalSeconds) {
          return lesson.totalSeconds;
        }
        return value + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, lesson.totalSeconds]);

  const progress = useMemo(() => {
    if (lesson.totalSeconds <= 0) {
      return 0;
    }
    return Math.min(100, (currentSeconds / lesson.totalSeconds) * 100);
  }, [currentSeconds, lesson.totalSeconds]);

  function seek(event: { currentTarget: HTMLDivElement; clientX: number }) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    setCurrentSeconds(Math.round(ratio * lesson.totalSeconds));
  }

  async function toggleFullscreen() {
    const node = containerRef.current;
    if (!node) {
      return;
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await node.requestFullscreen();
  }

  return (
    <div
      ref={containerRef}
      className="relative flex aspect-video w-full flex-col overflow-hidden rounded-xl bg-inverse-surface shadow-md"
    >
      <Image
        src={posterUrl}
        alt={posterAlt}
        fill
        unoptimized
        className="object-cover opacity-80 mix-blend-luminosity"
        sizes="(max-width: 1024px) 100vw, 66vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/20 to-transparent" />

      {playing ? null : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <button
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-on-primary shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-primary"
            type="button"
            aria-label="Reproducir lección"
            onClick={() => setPlaying(true)}
          >
            <MaterialIcon name="play_arrow" filled className="ml-1 text-[32px]" />
          </button>
        </div>
      )}

      <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-sm bg-gradient-to-t from-inverse-surface/90 to-transparent p-md">
        <div
          className="group relative h-2 w-full cursor-pointer overflow-hidden rounded-full bg-surface-variant/30"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={lesson.totalSeconds}
          aria-valuenow={currentSeconds}
          tabIndex={0}
          onClick={seek}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-primary transition-colors group-hover:bg-primary-fixed"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 scale-0 rounded-full bg-on-primary shadow-sm transition-transform group-hover:scale-100"
            style={{ left: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between font-label-md text-on-primary">
          <div className="flex items-center gap-md">
            <button
              className="transition-colors hover:text-primary-fixed"
              type="button"
              aria-label={playing ? "Pausar" : "Reproducir"}
              onClick={() => setPlaying((value) => !value)}
            >
              <MaterialIcon name={playing ? "pause" : "play_arrow"} />
            </button>
            <button
              className="transition-colors hover:text-primary-fixed"
              type="button"
              aria-label={muted ? "Activar sonido" : "Silenciar"}
              onClick={() => setMuted((value) => !value)}
            >
              <MaterialIcon name={muted ? "volume_off" : "volume_up"} />
            </button>
            <span className="font-mono text-sm opacity-80">
              {formatPlayerTime(currentSeconds)} / {formatPlayerTime(lesson.totalSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-md">
            <button className="transition-colors hover:text-primary-fixed" type="button" aria-label="Subtítulos">
              <MaterialIcon name="closed_caption" />
            </button>
            <button className="transition-colors hover:text-primary-fixed" type="button" aria-label="Ajustes del reproductor">
              <MaterialIcon name="settings" />
            </button>
            <button
              className="transition-colors hover:text-primary-fixed"
              type="button"
              aria-label="Pantalla completa"
              onClick={() => {
                void toggleFullscreen();
              }}
            >
              <MaterialIcon name="fullscreen" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
