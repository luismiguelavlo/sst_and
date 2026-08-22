"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import { deleteCourse, publishCourse, unpublishCourse } from "@/lib/courses/actions";

type CourseManageActionsProps = Readonly<{
  slug: string;
  status: "draft" | "published";
  title: string;
}>;

export function CourseManageActions({ slug, status, title }: CourseManageActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function run(
    action: () => Promise<{ ok: true; slug: string } | { ok: false; error: string }>,
    onSuccess?: (slug: string) => void,
    successMessage?: string,
  ) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      if (successMessage) {
        showToast(successMessage);
      }
      onSuccess?.(result.slug);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-sm rounded-xl border border-outline-variant/30 bg-surface-container-low p-md">
      <div className="flex flex-wrap items-center justify-between gap-sm">
        <div>
          <p className="font-label-md text-on-surface">Gestión del curso</p>
          <p className="font-body-sm text-on-surface-variant">
            {status === "published" ? "Publicado · visible según reglas de acceso" : "Borrador · solo administradores"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <Link
            href={`/course-catalog/${slug}/edit`}
            className="inline-flex items-center gap-xs rounded-lg border border-outline-variant/40 bg-surface px-md py-sm font-label-md text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <MaterialIcon name="edit" className="text-[18px]" />
            Editar
          </Link>
          {status === "draft" ? (
            <button
              type="button"
              disabled={pending}
              className="inline-flex items-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary disabled:opacity-60"
              onClick={() => {
                run(() => publishCourse(slug), undefined, "Curso publicado.");
              }}
            >
              <MaterialIcon name="publish" className="text-[18px]" />
              {pending ? "Publicando..." : "Publicar"}
            </button>
          ) : (
            <button
              type="button"
              disabled={pending}
              className="inline-flex items-center gap-xs rounded-lg border border-outline-variant/40 bg-surface px-md py-sm font-label-md text-on-surface disabled:opacity-60"
              onClick={() => {
                run(() => unpublishCourse(slug), undefined, "Curso pasado a borrador.");
              }}
            >
              <MaterialIcon name="unpublished" className="text-[18px]" />
              {pending ? "Guardando..." : "Pasar a borrador"}
            </button>
          )}
          <button
            type="button"
            disabled={pending}
            className="inline-flex items-center gap-xs rounded-lg bg-error-container px-md py-sm font-label-md text-on-error-container disabled:opacity-60"
            onClick={() => {
              const confirmed = window.confirm(
                `¿Eliminar el curso "${title}"? Se borrarán secciones, avance y asignaciones relacionadas.`,
              );
              if (!confirmed) {
                return;
              }
              run(
                () => deleteCourse(slug),
                () => {
                  router.push("/course-catalog");
                },
                "Curso eliminado.",
              );
            }}
          >
            <MaterialIcon name="delete" className="text-[18px]" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
