import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export function NeuralNetworkDiagram() {
  return (
    <div className="group relative mt-md flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-surface-container">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-container/20 to-transparent mix-blend-multiply" />
      <svg
        className="h-full w-full text-primary opacity-60 transition-opacity group-hover:opacity-100"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 100 50"
        aria-hidden
      >
        <circle cx="20" cy="15" fill="currentColor" r="3" />
        <circle cx="20" cy="35" fill="currentColor" r="3" />
        <circle cx="50" cy="10" fill="currentColor" r="3" />
        <circle cx="50" cy="25" fill="currentColor" r="3" />
        <circle cx="50" cy="40" fill="currentColor" r="3" />
        <circle cx="80" cy="25" fill="currentColor" r="3" />
        <path
          d="M 23 15 L 47 10 M 23 15 L 47 25 M 23 15 L 47 40"
          fill="none"
          opacity="0.5"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <path
          d="M 23 35 L 47 10 M 23 35 L 47 25 M 23 35 L 47 40"
          fill="none"
          opacity="0.5"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <path
          d="M 53 10 L 77 25 M 53 25 L 77 25 M 53 40 L 77 25"
          fill="none"
          opacity="0.5"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>
      <div className="absolute right-sm bottom-sm rounded bg-surface/90 px-sm py-xs font-label-sm text-on-surface backdrop-blur">
        Interactivo: explorar el sistema
      </div>
    </div>
  );
}

type CurriculumItemProps = {
  kindLabel: string;
  title: string;
  meta: string;
  state: "completed" | "active" | "upcoming";
  kindIcon: string;
  href: string;
};

export function CurriculumItem({
  kindLabel,
  title,
  meta,
  state,
  kindIcon,
  href,
}: Readonly<CurriculumItemProps>) {
  if (state === "completed") {
    return (
      <Link
        href={href}
        className="group flex w-full items-start gap-md p-md text-left transition-colors hover:bg-surface-container-low"
      >
        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
          <MaterialIcon name="check" filled className="text-[16px] text-on-primary" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="mb-xs font-label-md tracking-wider text-on-surface-variant uppercase">
            {kindLabel}
          </span>
          <span className="line-clamp-2 font-body-md text-on-surface">{title}</span>
          <span className="mt-xs font-label-sm text-outline">{meta}</span>
        </div>
      </Link>
    );
  }

  if (state === "active") {
    return (
      <Link
        href={href}
        aria-current="page"
        className="relative flex w-full items-start gap-md overflow-hidden bg-surface-container p-md text-left transition-colors"
      >
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />
        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="mb-xs font-label-md tracking-wider text-primary uppercase">{kindLabel}</span>
          <span className="line-clamp-2 font-body-md font-medium text-on-surface">{title}</span>
          <span className="mt-xs font-label-sm text-outline">{meta}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex w-full items-start gap-md p-md text-left opacity-70 transition-colors hover:bg-surface-container-low"
    >
      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-outline">
        <MaterialIcon name={kindIcon} className="text-[16px] text-outline" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="mb-xs font-label-md tracking-wider text-on-surface-variant uppercase">
          {kindLabel}
        </span>
        <span className="line-clamp-2 font-body-md text-on-surface">{title}</span>
        <span className="mt-xs font-label-sm text-outline">{meta}</span>
      </div>
    </Link>
  );
}
