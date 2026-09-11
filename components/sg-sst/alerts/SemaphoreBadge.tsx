import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { SstSemaphoreLevel } from "@/lib/sg-sst/alerts/types";

const STYLES: Record<
  SstSemaphoreLevel,
  { chip: string; dot: string; icon: string; emoji: string }
> = {
  critico: {
    chip: "bg-error-container text-on-error-container",
    dot: "bg-error",
    icon: "error",
    emoji: "🔴",
  },
  proximo: {
    chip: "bg-amber-100 text-amber-900",
    dot: "bg-amber-500",
    icon: "timelapse",
    emoji: "🟠",
  },
  seguimiento: {
    chip: "bg-yellow-100 text-yellow-900",
    dot: "bg-yellow-500",
    icon: "schedule",
    emoji: "🟡",
  },
  vigente: {
    chip: "bg-secondary-fixed text-on-secondary-fixed",
    dot: "bg-secondary",
    icon: "check_circle",
    emoji: "🟢",
  },
};

export function SemaphoreBadge({
  level,
  label,
  compact = false,
}: Readonly<{ level: SstSemaphoreLevel; label: string; compact?: boolean }>) {
  const style = STYLES[level];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-label-sm text-label-sm font-bold ${style.chip}`}
    >
      {compact ? (
        <span>{style.emoji}</span>
      ) : (
        <MaterialIcon name={style.icon} className="text-[14px]" />
      )}
      <span>{label}</span>
    </span>
  );
}

export function SemaphoreDot({ level }: Readonly<{ level: SstSemaphoreLevel }>) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${STYLES[level].dot}`} />;
}

export function semaphoreEmoji(level: SstSemaphoreLevel): string {
  return STYLES[level].emoji;
}
