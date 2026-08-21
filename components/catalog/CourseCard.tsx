import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { courseDetailPath, levelBadgeClassName, type Course } from "@/lib/courses";

export function CourseCard({ course }: Readonly<{ course: Course }>) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={course.imageUrl}
          alt={course.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        {course.status === "draft" ? (
          <div className="absolute top-sm right-sm rounded bg-secondary-container/90 px-xs py-[2px] font-label-sm text-label-sm text-on-secondary-container backdrop-blur-sm">
            Borrador
          </div>
        ) : course.rating > 0 ? (
          <div className="absolute top-sm right-sm flex items-center gap-xs rounded bg-surface-container-lowest/90 px-xs py-[2px] font-label-sm text-label-sm text-on-surface backdrop-blur-sm">
            <MaterialIcon name="star" className="text-[14px] text-secondary" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
        ) : (
          <div className="absolute top-sm right-sm rounded bg-surface-container-lowest/90 px-xs py-[2px] font-label-sm text-label-sm text-primary backdrop-blur-sm">
            Nuevo
          </div>
        )}
        <div
          className={`absolute bottom-sm left-sm rounded-full px-sm py-xs font-label-sm text-label-sm backdrop-blur-sm ${levelBadgeClassName(course.level)}`}
        >
          {course.level}
        </div>
      </div>
      <div className="flex flex-grow flex-col p-md">
        <div className="mb-xs flex items-center gap-xs text-on-surface-variant">
          <MaterialIcon name="schedule" className="text-[16px]" />
          <span className="font-body-sm text-body-sm">
            {course.durationLabel ?? `${course.weeks} semanas`}
          </span>
        </div>
        <h3 className="mb-xs line-clamp-2 font-headline-md text-headline-md text-on-surface">
          {course.title}
        </h3>
        <p className="mb-xs font-label-sm text-primary">{course.category}</p>
        <p className="mb-md line-clamp-3 flex-grow font-body-sm text-body-sm text-on-surface-variant">
          {course.description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-outline-variant/20 pt-sm">
          <div className="flex items-center gap-xs">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full font-label-sm text-label-sm ${course.instructor.avatarClassName}`}
            >
              {course.instructor.initials}
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {course.instructor.name}
            </span>
          </div>
          <Link
            href={courseDetailPath(course.id)}
            className="rounded-lg bg-primary px-sm py-xs font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90"
          >
            Ver curso
          </Link>
        </div>
      </div>
    </article>
  );
}
