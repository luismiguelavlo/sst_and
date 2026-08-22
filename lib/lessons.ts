import { COURSES, type Course } from "@/lib/courses";
import type { PublicQuizData } from "@/lib/quiz";

export type LessonKind = "reading" | "video" | "uploaded_video" | "quiz" | "image" | "document";

export type Lesson = {
  id: string;
  kind: LessonKind;
  title: string;
  durationLabel: string;
  about: readonly string[];
  totalSeconds: number;
  startSeconds: number;
  youtubeUrl?: string;
  mediaUrl?: string;
  mediaFilename?: string;
  quiz?: PublicQuizData;
};

export type CourseResource = {
  name: string;
  icon: string;
  href?: string;
};

export type CourseModule = {
  slug: string;
  courseTitle: string;
  moduleLabel: string;
  progressPercent: number;
  posterUrl: string;
  posterAlt: string;
  lessons: readonly Lesson[];
  resources: readonly CourseResource[];
};

const ALTURAS_MODULE: CourseModule = {
  slug: "trabajo-en-alturas",
  courseTitle: "Trabajo en alturas",
  moduleLabel: "Módulo 1",
  progressPercent: 35,
  posterUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBuWLrHYvZ96wnA0DLZ-CY2LY6nv-QvUuuO07c8-GAEDrAQYJ1cd5oyHxDeEJv3THU_Sf0kPPk6glguC_2bZ-3F-T1J2HX95KGD_21TLz5PjqNNi1wP-Gof_O3pgdL1EtSfS_QuSXSKQ-bKZ7Pt_MdxCnTG0N70_JztGSZFYlrhovV7CKicTpM8u2nYryX3ZmHbWKznvuBD6R3-07xKnRqIqBiTRLkwL0SrZ7ebj2kLvLeiT2lKw4UW",
  posterAlt: "Nodos y conexiones que representan un sistema de prevención de caídas.",
  lessons: [
    {
      id: "normativa",
      kind: "reading",
      title: "Marco legal y responsabilidades",
      durationLabel: "10 min",
      totalSeconds: 600,
      startSeconds: 600,
      about: [
        "Revisa las obligaciones del empleador y del trabajador en trabajo en alturas, y cuándo se exige un permiso de trabajo.",
        "Al terminar sabrás qué documentos debes firmar antes de iniciar la tarea.",
      ],
    },
    {
      id: "neural-networks",
      kind: "video",
      title: "Inspección y uso del arnés",
      durationLabel: "12 min",
      totalSeconds: 750,
      startSeconds: 255,
      about: [
        "En este módulo descomponemos el sistema personal de detención de caídas: anclaje, conector y arnés de cuerpo completo.",
        "Aprenderás a inspeccionar costuras, hebillas y mosquetones, y a rechazar un EPP dañado antes de subir.",
      ],
    },
    {
      id: "backprop",
      kind: "video",
      title: "Líneas de vida y puntos de anclaje",
      durationLabel: "18 min",
      totalSeconds: 1080,
      startSeconds: 0,
      about: [
        "Verás cómo elegir un anclaje certificado, instalar una línea de vida temporal y mantener el factor de caída bajo control.",
        "Incluye un ejemplo en andamio y otro en techo industrial.",
      ],
    },
    {
      id: "assessment",
      kind: "quiz",
      title: "Evaluación del módulo 1",
      durationLabel: "5 preguntas",
      totalSeconds: 300,
      startSeconds: 0,
      about: [
        "Comprueba que identificas EPP, anclajes y condiciones que impiden iniciar el trabajo.",
        "Puedes repetir la evaluación; el resultado queda en esta sesión de demostración.",
      ],
    },
  ],
  resources: [
    { name: "Lista_chequeo_arnes.pdf", icon: "picture_as_pdf" },
    { name: "permiso_trabajo_alturas.csv", icon: "dataset" },
  ],
};

const SLUG_ALIASES: Record<string, string> = {
  "ml-intro": "trabajo-en-alturas",
  "applied-machine-learning": "trabajo-en-alturas",
  "ai-501": "trabajo-en-alturas",
  "trabajo-en-alturas": "trabajo-en-alturas",
};

const REVIEW_COURSE_TITLES: Record<string, string> = {
  "cs-401": "Riesgo eléctrico en planta",
  "phy-305": "Primeros auxilios y brigadas",
  "eng-210": "Manejo de sustancias químicas (SGA)",
};

function reviewCourseStub(id: string, title: string): Course {
  const template = COURSES[0];
  return {
    id,
    title,
    description: `Revisa las lecciones y evidencias de ${title}.`,
    category: "Cultura preventiva",
    level: "Intermedio",
    weeks: 2,
    rating: 4.8,
    popularity: 400,
    instructor: {
      name: "Equipo SST",
      initials: "SST",
      avatarClassName: "bg-primary-container text-on-primary-container",
    },
    imageUrl: template?.imageUrl ?? "",
    imageAlt: title,
  };
}

function moduleFromCourse(course: Course): CourseModule {
  return {
    slug: course.id,
    courseTitle: course.title,
    moduleLabel: "Módulo 1",
    progressPercent: 20,
    posterUrl: course.imageUrl,
    posterAlt: course.imageAlt,
    lessons: [
      {
        id: `${course.id}-overview`,
        kind: "reading",
        title: `Panorama: ${course.title}`,
        durationLabel: "8 min",
        totalSeconds: 480,
        startSeconds: 480,
        about: [course.description, `Facilitador: ${course.instructor.name}.`],
      },
      {
        id: `${course.id}-lecture`,
        kind: "video",
        title: `Sesión principal: ${course.title}`,
        durationLabel: "14 min",
        totalSeconds: 840,
        startSeconds: 210,
        about: [
          course.description,
          "Usa el reproductor y el temario para repasar los puntos críticos de seguridad.",
        ],
      },
      {
        id: `${course.id}-practice`,
        kind: "video",
        title: "Práctica guiada en campo",
        durationLabel: "11 min",
        totalSeconds: 660,
        startSeconds: 0,
        about: ["Aplica el procedimiento con puntos de control antes de la tarea real."],
      },
      {
        id: `${course.id}-quiz`,
        kind: "quiz",
        title: "Verificación del módulo",
        durationLabel: "5 preguntas",
        totalSeconds: 300,
        startSeconds: 0,
        about: ["Confirma que puedes ejecutar la tarea de forma segura."],
      },
    ],
    resources: [
      { name: `${course.id}_procedimiento.pdf`, icon: "picture_as_pdf" },
      { name: `${course.id}_asistencia.csv`, icon: "dataset" },
    ],
  };
}

export function getStaticCourseModule(slug: string): CourseModule | undefined {
  const canonical = SLUG_ALIASES[slug];
  if (canonical === ALTURAS_MODULE.slug) {
    return ALTURAS_MODULE;
  }
  const course = COURSES.find((item) => item.id === slug);
  if (course) {
    return moduleFromCourse(course);
  }
  const fallbackTitle = REVIEW_COURSE_TITLES[slug];
  if (!fallbackTitle) {
    return undefined;
  }
  return moduleFromCourse(reviewCourseStub(slug, fallbackTitle));
}

export function getCourseModuleSlugs(): string[] {
  return [
    "trabajo-en-alturas",
    "applied-machine-learning",
    "ml-intro",
    ...COURSES.map((course) => course.id),
    ...Object.keys(REVIEW_COURSE_TITLES),
  ];
}

export function lessonKindLabel(kind: LessonKind): string {
  if (kind === "reading") {
    return "Lectura";
  }
  if (kind === "quiz") {
    return "Evaluación";
  }
  if (kind === "image") {
    return "Imagen";
  }
  if (kind === "document") {
    return "Documento";
  }
  if (kind === "uploaded_video") {
    return "Video";
  }
  return "Vídeo";
}

export function lessonKindIcon(kind: LessonKind): string {
  if (kind === "reading") {
    return "menu_book";
  }
  if (kind === "quiz") {
    return "quiz";
  }
  if (kind === "image") {
    return "image";
  }
  if (kind === "document") {
    return "picture_as_pdf";
  }
  if (kind === "uploaded_video") {
    return "smart_display";
  }
  return "play_arrow";
}

export function formatPlayerTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
