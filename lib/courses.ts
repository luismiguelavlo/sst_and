import { SST_CATEGORY_OPTIONS } from "@/lib/sst";

export type CourseLevel = "Básico" | "Intermedio" | "Avanzado";

export type CourseCategory = (typeof SST_CATEGORY_OPTIONS)[number]["label"];

export type CourseInstructor = {
  name: string;
  initials: string;
  avatarClassName: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  weeks: number;
  rating: number;
  popularity: number;
  instructor: CourseInstructor;
  imageUrl: string;
  imageAlt: string;
  durationLabel?: string;
  status?: "draft" | "published";
};

export const COURSE_CATEGORIES: readonly ("Todos los cursos" | CourseCategory)[] = [
  "Todos los cursos",
  ...SST_CATEGORY_OPTIONS.map((item) => item.label),
];

export const COURSE_SORT_OPTIONS = ["Populares", "Calificación", "Duración"] as const;

export type CourseSortOption = (typeof COURSE_SORT_OPTIONS)[number];

export const COURSES: readonly Course[] = [
  {
    id: "trabajo-en-alturas",
    title: "Trabajo en alturas — Nivel básico",
    description:
      "Identifica peligros en alturas, usa el arnés y las líneas de vida, y aplica el permiso de trabajo antes de subir.",
    category: "Trabajo en alturas",
    level: "Básico",
    weeks: 2,
    rating: 4.9,
    popularity: 980,
    instructor: {
      name: "Ing. Soto",
      initials: "JS",
      avatarClassName: "bg-primary-container text-on-primary-container",
    },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxjE2mo2o4R0v27oD2f6vZRKZJasdXVgNyo27kjmHNwFkqWUR2Q3F-9Yct5IS-wujHESSbnnibp3IAk5VeRS1kiOsook515rlgaZ2PtMBrncIoGkTqpigMmVkDXUhZtcwl45QmkHc1YwCtoGxpZKw3sZiK_xQIQ-hL2taAij4d1KccmkP6nOk3IB4OWXz74ZPkxacfy-rccNcIDPi1S4-LejRQSRpucuy5rhLd6Y5BVSF7SGdR3EA_",
    imageAlt: "Visualización de sistemas de prevención de caídas.",
  },
  {
    id: "riesgo-electrico",
    title: "Riesgo eléctrico en planta",
    description:
      "Aplica LOTO, identifica arco eléctrico y usa EPP dieléctrico antes de intervenir tableros o equipos energizados.",
    category: "Riesgo eléctrico",
    level: "Intermedio",
    weeks: 3,
    rating: 4.8,
    popularity: 860,
    instructor: {
      name: "Ing. Vargas",
      initials: "EV",
      avatarClassName: "bg-secondary-container text-on-secondary-container",
    },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAk6WV1lJJ2w-nH9KxrMkTDAAFVGFte7g804L1iO5AamBUMXwiko-lOHFFqJx7tihdR3L4qNSERTuDZU7R0OmyWVO12Ih6PylgsJMNogW0pSKPfX2nGa-upmyu2o-9IyIwVjIyfYr2byVptEkv3oC1cSa97HcOdKVSHbf7GdQXWJ3cZSl0QPoRFB5Cf1HF6f1MBVT2wyBzd47bFRlBdlCV5I2japtCczGZovkIxIlG-VmWo37-hY2XD",
    imageAlt: "Visualización de sistemas y conexiones de riesgo.",
  },
  {
    id: "primeros-auxilios",
    title: "Primeros auxilios y brigadas",
    description:
      "Actúa en incidentes: RCP, heridas, quemaduras y evacuación hasta la llegada de atención médica.",
    category: "Emergencias y brigadas",
    level: "Básico",
    weeks: 2,
    rating: 4.9,
    popularity: 910,
    instructor: {
      name: "Enf. Chen",
      initials: "MC",
      avatarClassName: "bg-primary-container text-on-primary-container",
    },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9gZmsrGWx3rJcwJMl1CIfR75_knpx_xHs90_qoaTRNvRW1qjdlbvsEhkaFyhhLAW7J5nbtxsolloxsE5lyE3FqugOfX42n69aVZ0ksmYiYUSVpmXu0Jiws7z6ffVM_FVxarz63vmGjIwPmTY59czimwBBF1sO81sscvc8-Ib3t1KZlyODwpOg-cYhKJTgzKOPEgZ4aN7rwV2QEiL4wnRkIKUJ0fNqnqOLQPjlnB0kO9rFiQuKmtTt",
    imageAlt: "Material de capacitación y atención de emergencias.",
  },
  {
    id: "quimicos-sga",
    title: "Manejo de sustancias químicas (SGA)",
    description:
      "Lee etiquetas y hojas de seguridad, almacena reactivos y usa EPP según el pictograma de peligro.",
    category: "Sustancias químicas (SGA)",
    level: "Avanzado",
    weeks: 4,
    rating: 4.6,
    popularity: 740,
    instructor: {
      name: "Ing. Rojas",
      initials: "RJ",
      avatarClassName: "bg-surface-variant text-on-surface-variant",
    },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg2u375g6uHeYcuFnuzwbPJdfUZ9xtXAArVMzCNzGYQrLnj3eoAVuHIYGM452pZ_xrzt3782qGPEaz3Ia0Nf_NGdCPCnj28oF937lXNyuf6Ax-HzWMDOLrfnmD5BMFpnPHmvUXydCCVJ-ohgFl5TbRDRVRplAvu7lG56wMyzpkuG-f5G5kF88tl9ma8TVODSLI3CCsHsAlzc9TrGoOiPxworPzVFb9gi1SH6qdjOEOiU2OpJuv5bQv",
    imageAlt: "Etiquetas y controles para sustancias químicas.",
  },
  {
    id: "epp-basico",
    title: "Uso y cuidado de EPP",
    description:
      "Selecciona, inspecciona y reemplaza el equipo de protección personal según la tarea y el peligro.",
    category: "EPP",
    level: "Básico",
    weeks: 1,
    rating: 4.7,
    popularity: 820,
    instructor: {
      name: "Téc. Peña",
      initials: "NP",
      avatarClassName: "bg-primary-container text-on-primary-container",
    },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAv-fQJ7vcfgqu3LwFkbBlAZv0tXuQCIilb8DYMIfnuLjcwSLLeP4eQv3BHrPuPXzJqb1wI6J1C7sVwx-6AisNOJ0JLVsAWdPi6QjYjF1eUbFafspt7ZFxHCtf-8sZHI1JAwt_mEb2_RfB8mleWOzcye282ObZYkSU-Cgiw_KsSq2hL_c7eT1YR9A1o0IGy3UyxhKM9icu_L_C9_5cLyMgNUG5oO5nmMqWXTmRUq2BxeOBPQVjGEoWE",
    imageAlt: "Análisis de un procedimiento de trabajo seguro.",
  },
  {
    id: "ergonomia-puestos",
    title: "Ergonomía en puestos de trabajo",
    description:
      "Ajusta posturas, manipulación de cargas y pausas activas para reducir trastornos musculoesqueléticos.",
    category: "Ergonomía",
    level: "Intermedio",
    weeks: 2,
    rating: 4.5,
    popularity: 610,
    instructor: {
      name: "Ft. Morales",
      initials: "LM",
      avatarClassName: "bg-tertiary-container text-on-tertiary-container",
    },
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCUif3GO-anjopYktZrGvzGtOo7eOOaq-_yiUmU590JrW0ytNNJucFCIf7QUiX63GoIXk8mDgow3kWgVMm6b69a9UlpAAf5RDM9rXlUawc_it_QR67HP4Md--bcANugCp77JYfhSjOgnVWdMs1-tQ6sAwJpWHTNGamhRBXIA4WiyvZH4Ua82YW5okPYeYca0dwiLHDf3Q4WsuptTYSmltfm9E048sqvDU_4YhxXQMAADkhsPLXikX76",
    imageAlt: "Estructura y procedimientos de trabajo seguro.",
  },
];

export function courseDetailPath(slug: string): string {
  return `/courses/${slug}`;
}

export function courseLessonPath(slug: string, lessonId: string): string {
  return `/courses/${slug}/lessons/${lessonId}`;
}

export function mergeCatalogCourses(
  databaseCourses: readonly Course[],
  staticCourses: readonly Course[],
): Course[] {
  const taken = new Set(databaseCourses.map((course) => course.id));
  return [...databaseCourses, ...staticCourses.filter((course) => !taken.has(course.id))];
}

export function levelBadgeClassName(level: CourseLevel): string {
  if (level === "Básico") {
    return "bg-primary/90 text-on-primary";
  }
  if (level === "Intermedio") {
    return "bg-secondary-container/90 text-on-secondary-container";
  }
  return "bg-tertiary-container/90 text-on-tertiary-container";
}

export function sortCourses(courses: readonly Course[], sort: CourseSortOption): Course[] {
  const copy = [...courses];
  if (sort === "Calificación") {
    return copy.toSorted((a, b) => b.rating - a.rating);
  }
  if (sort === "Duración") {
    return copy.toSorted((a, b) => a.weeks - b.weeks);
  }
  return copy.toSorted((a, b) => b.popularity - a.popularity);
}
