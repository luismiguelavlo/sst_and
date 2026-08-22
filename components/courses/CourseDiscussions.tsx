"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import {
  postCourseDiscussion,
  removeCourseDiscussion,
} from "@/lib/discussions/actions";
import type { DiscussionAuthor, DiscussionThread } from "@/lib/discussions";

type CourseDiscussionsProps = Readonly<{
  courseId: string;
  courseSlug: string;
  initialThreads: readonly DiscussionThread[];
}>;

export function CourseDiscussions({
  courseId,
  courseSlug,
  initialThreads,
}: CourseDiscussionsProps) {
  const [threads, setThreads] = useState(initialThreads);
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function submit() {
    if (body.trim().length < 2 || pending) {
      return;
    }
    startTransition(async () => {
      const result = await postCourseDiscussion({
        courseId,
        courseSlug,
        body,
        parentId: replyTo ?? undefined,
      });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      setThreads(result.threads);
      setBody("");
      setReplyTo(null);
      showToast(replyTo ? "Respuesta publicada." : "Consulta publicada.");
    });
  }

  function remove(postId: string) {
    if (pending) {
      return;
    }
    startTransition(async () => {
      const result = await removeCourseDiscussion({
        postId,
        courseId,
        courseSlug,
      });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      setThreads(result.threads);
      if (replyTo === postId) {
        setReplyTo(null);
      }
      showToast("Consulta eliminada.");
    });
  }

  return (
    <section className="rounded-xl bg-surface-container-lowest p-md shadow-sm sm:p-lg">
      <div className="mb-md flex items-start justify-between gap-md">
        <div>
          <h2 className="font-headline-md text-on-surface">Consultas</h2>
          <p className="mt-xs font-body-sm text-on-surface-variant">
            Preguntas y respuestas sobre este curso SST.
          </p>
        </div>
        <span className="rounded-full bg-surface-container-high px-sm py-xs font-label-sm text-on-surface-variant">
          {threads.length} {threads.length === 1 ? "tema" : "temas"}
        </span>
      </div>

      <div className="mb-md flex flex-col gap-sm rounded-lg border border-outline-variant/30 bg-surface p-md">
        {replyTo ? (
          <div className="flex items-center justify-between gap-sm rounded-lg bg-surface-container-low px-sm py-xs">
            <span className="font-label-sm text-on-surface-variant">Respondiendo a una consulta</span>
            <button
              type="button"
              className="font-label-sm text-primary"
              onClick={() => setReplyTo(null)}
            >
              Cancelar
            </button>
          </div>
        ) : null}
        <textarea
          className="min-h-24 w-full resize-y rounded-lg border border-outline-variant/40 bg-surface-bright p-sm font-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder={
            replyTo
              ? "Escribe tu respuesta..."
              : "¿Tienes una duda sobre el contenido o los procedimientos?"
          }
          value={body}
          maxLength={2000}
          disabled={pending}
          onChange={(event) => setBody(event.target.value)}
        />
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <span className="font-body-sm text-on-surface-variant">{body.length}/2000</span>
          <button
            type="button"
            disabled={pending || body.trim().length < 2}
            className="inline-flex items-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary disabled:opacity-50"
            onClick={submit}
          >
            <MaterialIcon name="send" className="text-[18px]" />
            {pending ? "Publicando..." : replyTo ? "Responder" : "Publicar consulta"}
          </button>
        </div>
      </div>

      {threads.length === 0 ? (
        <p className="font-body-md text-on-surface-variant">
          Aún no hay consultas. Sé el primero en preguntar.
        </p>
      ) : (
        <ul className="flex flex-col gap-md">
          {threads.map((thread) => (
            <li
              key={thread.id}
              className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-md"
            >
              <ThreadHeader author={thread.author} createdAt={thread.createdAt} />
              <p className="mt-sm whitespace-pre-wrap font-body-md text-on-surface">{thread.body}</p>
              <div className="mt-sm flex flex-wrap gap-sm">
                <button
                  type="button"
                  className="font-label-sm text-primary hover:underline"
                  disabled={pending}
                  onClick={() => setReplyTo(thread.id)}
                >
                  Responder
                </button>
                {thread.canDelete ? (
                  <button
                    type="button"
                    className="font-label-sm text-error hover:underline"
                    disabled={pending}
                    onClick={() => remove(thread.id)}
                  >
                    Eliminar
                  </button>
                ) : null}
              </div>
              {thread.replies.length > 0 ? (
                <ul className="mt-md flex flex-col gap-sm border-l-2 border-primary/20 pl-md">
                  {thread.replies.map((reply) => (
                    <li key={reply.id} className="rounded-lg bg-surface-container-lowest p-sm">
                      <ThreadHeader author={reply.author} createdAt={reply.createdAt} compact />
                      <p className="mt-xs whitespace-pre-wrap font-body-sm text-on-surface">
                        {reply.body}
                      </p>
                      {reply.canDelete ? (
                        <button
                          type="button"
                          className="mt-xs font-label-sm text-error hover:underline"
                          disabled={pending}
                          onClick={() => remove(reply.id)}
                        >
                          Eliminar
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ThreadHeader({
  author,
  createdAt,
  compact = false,
}: Readonly<{ author: DiscussionAuthor; createdAt: string; compact?: boolean }>) {
  return (
    <div className="flex items-center gap-sm">
      <AuthorAvatar author={author} compact={compact} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-xs">
          <span className={`truncate font-label-md text-on-surface ${compact ? "text-[13px]" : ""}`}>
            {author.name}
          </span>
          {author.role === "admin" ? (
            <span className="rounded bg-primary/10 px-xs py-[1px] font-label-sm text-primary">
              SST
            </span>
          ) : null}
        </div>
        <p className="truncate font-body-sm text-on-surface-variant">
          {author.jobTitle} · {createdAt}
        </p>
      </div>
    </div>
  );
}

function AuthorAvatar({
  author,
  compact,
}: Readonly<{ author: DiscussionAuthor; compact?: boolean }>) {
  const size = compact ? 28 : 36;
  if (author.photoUrl) {
    return (
      <Image
        src={author.photoUrl}
        alt={`Foto de ${author.name}`}
        width={size}
        height={size}
        unoptimized
        className="rounded-full object-cover"
      />
    );
  }
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary-container font-label-sm text-on-primary-container ${compact ? "h-7 w-7 text-[11px]" : "h-9 w-9"}`}
    >
      {author.initials}
    </span>
  );
}
