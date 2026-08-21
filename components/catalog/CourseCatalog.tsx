"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CourseCard } from "@/components/catalog/CourseCard";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  COURSE_CATEGORIES,
  COURSE_SORT_OPTIONS,
  sortCourses,
  type Course,
  type CourseCategory,
  type CourseLevel,
  type CourseSortOption,
} from "@/lib/courses";

const PAGE_SIZE = 8;
const LEVELS: readonly ("Todos los niveles" | CourseLevel)[] = [
  "Todos los niveles",
  "Básico",
  "Intermedio",
  "Avanzado",
];

type CategoryFilter = (typeof COURSE_CATEGORIES)[number];

export function CourseCatalog({
  canCreateCourse,
  courses,
  initialQuery = "",
}: Readonly<{
  canCreateCourse: boolean;
  courses: readonly Course[];
  initialQuery?: string;
}>) {
  const [category, setCategory] = useState<CategoryFilter>("Todos los cursos");
  const [sort, setSort] = useState<CourseSortOption>("Populares");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Todos los niveles");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [search, setSearch] = useState(initialQuery);

  useEffect(() => {
    setSearch(initialQuery);
    setVisibleCount(PAGE_SIZE);
  }, [initialQuery]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const bySearch =
      needle.length === 0
        ? courses
        : courses.filter(
            (course) =>
              course.title.toLowerCase().includes(needle) ||
              course.description.toLowerCase().includes(needle) ||
              course.category.toLowerCase().includes(needle) ||
              course.instructor.name.toLowerCase().includes(needle),
          );
    const byCategory =
      category === "Todos los cursos"
        ? bySearch
        : bySearch.filter((course) => course.category === (category as CourseCategory));
    const byLevel =
      level === "Todos los niveles" ? byCategory : byCategory.filter((course) => course.level === level);
    return sortCourses(byLevel, sort);
  }, [category, courses, level, search, sort]);

  const visibleCourses = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  function cycleSort() {
    const currentIndex = COURSE_SORT_OPTIONS.indexOf(sort);
    const next = COURSE_SORT_OPTIONS.at((currentIndex + 1) % COURSE_SORT_OPTIONS.length);
    setSort(next ?? "Populares");
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="flex w-full flex-col">
      <div className="mb-md">
        <div className="flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-xs font-headline-lg text-headline-lg text-on-surface">
              {canCreateCourse ? "Catálogo de cursos SST" : "Explorar cursos"}
            </h1>
            <p className="max-w-2xl font-body-md text-body-md text-on-surface-variant">
              Capacitación obligatoria y complementaria en seguridad y salud en el trabajo. Filtra
              por peligro, nivel o duración.
            </p>
            {search.trim().length > 0 ? (
              <p className="mt-xs font-label-md text-primary">
                Resultados para “{search.trim()}” · {filtered.length} curso
                {filtered.length === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-sm">
            {canCreateCourse ? (
              <Link
                href="/course-catalog/new"
                className="flex items-center gap-xs rounded-full bg-primary px-sm py-xs font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90"
              >
                <MaterialIcon name="add" className="text-[20px]" />
                Crear curso
              </Link>
            ) : null}
            <label className="flex items-center gap-xs rounded-full bg-surface-container-high px-sm py-xs">
              <MaterialIcon name="search" className="text-[18px] text-on-surface-variant" />
              <input
                className="w-36 border-none bg-transparent font-label-md text-on-surface outline-none sm:w-48"
                placeholder="Buscar aquí..."
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              />
            </label>
            <button
              className="flex items-center gap-xs rounded-full bg-surface-container-high px-sm py-xs transition-colors hover:bg-surface-container-highest"
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <MaterialIcon name="filter_list" className="text-[20px] text-on-surface" />
              <span className="font-label-md text-label-md text-on-surface">Filtros</span>
            </button>
            <button
              className="flex items-center gap-xs rounded-full bg-surface-container-high px-sm py-xs transition-colors hover:bg-surface-container-highest"
              type="button"
              onClick={cycleSort}
            >
              <MaterialIcon name="sort" className="text-[20px] text-on-surface" />
              <span className="font-label-md text-label-md text-on-surface">Orden: {sort}</span>
            </button>
          </div>
        </div>

        {filtersOpen ? (
          <div className="mt-sm flex flex-wrap gap-xs">
            {LEVELS.map((option) => {
              const isActive = level === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setLevel(option);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={
                    isActive
                      ? "rounded-full bg-secondary-container px-sm py-xs font-label-sm text-label-sm text-on-secondary-container"
                      : "rounded-full bg-surface-container-high px-sm py-xs font-label-sm text-label-sm text-on-surface hover:bg-surface-container-highest"
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-md flex snap-x gap-sm overflow-x-auto pb-xs">
          {COURSE_CATEGORIES.map((item) => {
            const isActive = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={
                  isActive
                    ? "snap-start rounded-full bg-primary px-md py-xs font-label-md text-label-md text-on-primary whitespace-nowrap shadow-sm transition-transform hover:scale-105"
                    : "snap-start rounded-full bg-surface-container-high px-md py-xs font-label-md text-label-md text-on-surface whitespace-nowrap transition-colors hover:bg-surface-container-highest"
                }
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {visibleCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-low/40 px-md py-xl text-center">
          <MaterialIcon name="menu_book" className="mb-sm text-[40px] text-outline" />
          <h2 className="font-headline-md text-on-surface">No hay cursos para mostrar</h2>
          <p className="mt-xs max-w-md font-body-md text-on-surface-variant">
            {canCreateCourse
              ? "Crea el primer módulo SST para el personal. Las imágenes y documentos se guardan en Cloudinary; los videos usan un enlace de YouTube."
              : "Cuando el equipo SST publique un curso, aparecerá aquí."}
          </p>
          {canCreateCourse ? (
            <Link
              href="/course-catalog/new"
              className="mt-md inline-flex items-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              Crear curso
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {canLoadMore ? (
        <div className="mt-xl flex justify-center">
          <button
            className="flex items-center gap-sm rounded-lg bg-surface-container px-md py-sm font-label-md text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container-high"
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Cargar más cursos
            <MaterialIcon name="expand_more" className="text-[20px]" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
