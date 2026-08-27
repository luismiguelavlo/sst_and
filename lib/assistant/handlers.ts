import "server-only";

import { listPendingAttendanceFormsForUser } from "@/lib/attendance/repository";
import {
  ASSISTANT_SUGGESTIONS,
  type AssistantIntentId,
  type AssistantReply,
} from "@/lib/assistant/intents";
import { listCertificatesForUser } from "@/lib/certificates/repository";
import { courseDetailPath, courseLessonPath } from "@/lib/courses";
import { myCourseStatusLabel, type MyCourseItem } from "@/lib/my-courses";
import { listMyCoursesForUser } from "@/lib/progress/repository";

export async function handleAssistantIntent(
  intentId: AssistantIntentId,
  userId: string,
): Promise<AssistantReply> {
  switch (intentId) {
    case "pending_courses":
      return pendingCoursesReply(userId);
    case "in_progress_courses":
      return inProgressCoursesReply(userId);
    case "list_certificates":
      return certificatesReply(userId);
    case "pending_attendance":
      return attendanceReply(userId);
    case "howto_complete_course":
      return howtoCompleteCourseReply();
    case "menu":
    default:
      return menuReply();
  }
}

async function pendingCoursesReply(userId: string): Promise<AssistantReply> {
  const courses = await listMyCoursesForUser(userId);
  const pending = courses.filter((course) => course.status !== "completed");
  if (pending.length === 0) {
    return {
      intentId: "pending_courses",
      text: "No te faltan cursos por completar. ¡Buen trabajo! Puedes revisar tus certificados.",
      actions: [
        { label: "Ver certificados", href: "/certificates" },
        { label: "Mis cursos", href: "/my-courses" },
      ],
    };
  }

  const lines = pending.slice(0, 8).map((course, index) => {
    const status = myCourseStatusLabel(course.status);
    const progress =
      course.status === "in-progress" ? ` · ${course.progressPercent}%` : "";
    const deadline = course.deadlineLabel ? ` · Plazo: ${course.deadlineLabel}` : "";
    return `${index + 1}. ${course.title} — ${status}${progress}${deadline}`;
  });
  const extra =
    pending.length > 8 ? `\n…y ${pending.length - 8} más en Mis cursos.` : "";

  return {
    intentId: "pending_courses",
    text: `Te faltan ${pending.length} curso${pending.length === 1 ? "" : "s"} por completar:\n\n${lines.join("\n")}${extra}`,
    actions: [
      ...pending.slice(0, 3).map((course) =>
        courseAction(course, course.status === "in-progress" ? "Continuar" : "Empezar"),
      ),
      { label: "Ver todos", href: "/my-courses" },
    ],
  };
}

async function inProgressCoursesReply(userId: string): Promise<AssistantReply> {
  const courses = await listMyCoursesForUser(userId);
  const inProgress = courses.filter((course) => course.status === "in-progress");
  if (inProgress.length === 0) {
    return {
      intentId: "in_progress_courses",
      text: "No tienes cursos en progreso ahora mismo. Puedes ver si te falta iniciar alguno.",
      actions: [
        { label: "Cursos pendientes", href: "#intent:pending_courses" },
        { label: "Mis cursos", href: "/my-courses" },
      ],
    };
  }

  const lines = inProgress.slice(0, 8).map((course, index) => {
    return `${index + 1}. ${course.title} — ${course.progressPercent}% · ${course.lessonsLabel}`;
  });

  return {
    intentId: "in_progress_courses",
    text: `Tienes ${inProgress.length} curso${inProgress.length === 1 ? "" : "s"} en progreso:\n\n${lines.join("\n")}`,
    actions: [
      ...inProgress.slice(0, 3).map((course) => courseAction(course, "Continuar")),
      { label: "Ver todos", href: "/my-courses" },
    ],
  };
}

async function certificatesReply(userId: string): Promise<AssistantReply> {
  const certificates = await listCertificatesForUser(userId);
  if (certificates.length === 0) {
    return {
      intentId: "list_certificates",
      text: "Aún no tienes certificados. Cuando completes un curso que emita certificado, aparecerá aquí.",
      actions: [
        { label: "Ir a mis cursos", href: "/my-courses" },
        { label: "Ver certificados", href: "/certificates" },
      ],
    };
  }

  const lines = certificates.slice(0, 8).map((item, index) => {
    return `${index + 1}. ${item.title} — ${item.completedOn} · Código ${item.code}`;
  });
  const extra =
    certificates.length > 8
      ? `\n…y ${certificates.length - 8} más en Mis certificados.`
      : "";

  return {
    intentId: "list_certificates",
    text: `Tienes ${certificates.length} certificado${certificates.length === 1 ? "" : "s"}:\n\n${lines.join("\n")}${extra}`,
    actions: [
      ...certificates.slice(0, 3).map((item) => ({
        label: `Ver: ${truncate(item.title, 28)}`,
        href: `/certificates/${item.id}`,
      })),
      { label: "Todos los certificados", href: "/certificates" },
    ],
  };
}

async function attendanceReply(userId: string): Promise<AssistantReply> {
  const forms = await listPendingAttendanceFormsForUser(userId);
  if (forms.length === 0) {
    return {
      intentId: "pending_attendance",
      text: "No tienes formularios de asistencia pendientes por diligenciar.",
      actions: [{ label: "Ir a mi asistencia", href: "/my-attendance" }],
    };
  }

  const lines = forms.slice(0, 8).map((form, index) => {
    return `${index + 1}. ${form.title} — ${form.eventDateLabel}`;
  });

  return {
    intentId: "pending_attendance",
    text: `Tienes ${forms.length} formulario${forms.length === 1 ? "" : "s"} de asistencia pendiente${forms.length === 1 ? "" : "s"}:\n\n${lines.join("\n")}`,
    actions: [
      ...forms.slice(0, 3).map((form) => ({
        label: `Diligenciar: ${truncate(form.title, 24)}`,
        href: `/my-attendance/${form.id}`,
      })),
      { label: "Ver todos", href: "/my-attendance" },
    ],
  };
}

function howtoCompleteCourseReply(): AssistantReply {
  return {
    intentId: "howto_complete_course",
    text: [
      "Para completar un curso:",
      "1. Entra a Mis cursos.",
      "2. Abre el curso y avanza por cada lección.",
      "3. Si hay evaluación, debes aprobarla (todas las respuestas correctas).",
      "4. Al terminar, si el curso emite certificado, lo verás en Mis certificados.",
    ].join("\n"),
    actions: [
      { label: "Ir a mis cursos", href: "/my-courses" },
      { label: "Mis certificados", href: "/certificates" },
    ],
  };
}

function menuReply(): AssistantReply {
  const options = ASSISTANT_SUGGESTIONS.map((item, index) => `${index + 1}. ${item.label}`).join(
    "\n",
  );
  return {
    intentId: "menu",
    text: `Puedo ayudarte con estas consultas:\n\n${options}\n\nElige una opción abajo.`,
    actions: [],
  };
}

function courseAction(course: MyCourseItem, verb: string): { label: string; href: string } {
  const href = course.firstLessonId
    ? courseLessonPath(course.slug, course.firstLessonId)
    : courseDetailPath(course.slug);
  return {
    label: `${verb}: ${truncate(course.title, 26)}`,
    href,
  };
}

function truncate(value: string, max: number): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 1)}…`;
}
