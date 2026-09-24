"use client";

import type { RankingBlock } from "@/lib/sg-sst/analytics/filters";

type RankingCardProps = {
  block: RankingBlock;
};

export function RankingCard({ block }: Readonly<RankingCardProps>) {
  const max = Math.max(...block.items.map((i) => i.value), 1);

  return (
    <article className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <header>
        <h3 className="font-label-md text-label-md font-semibold text-on-surface">
          {block.question}
        </h3>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Unidad: {block.unit}
        </p>
      </header>

      {!block.hasData ? (
        <div className="rounded-lg bg-surface-container-low px-base py-md text-center font-body-sm text-body-sm text-on-surface-variant">
          {block.emptyMessage}
        </div>
      ) : (
        <ul className="flex flex-col gap-sm">
          {block.items.map((item, index) => {
            const width = Math.max(8, Math.round((item.value / max) * 100));
            return (
              <li key={`${block.id}-${item.label}-${index}`}>
                <div className="mb-0.5 flex items-baseline justify-between gap-sm">
                  <span className="truncate font-body-sm text-body-sm text-on-surface">
                    <span className="mr-1 font-mono text-[11px] text-on-surface-variant">
                      #{index + 1}
                    </span>
                    {item.label}
                    {item.secondaryLabel ? (
                      <span className="ml-1 text-on-surface-variant">
                        ({item.secondaryLabel})
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 font-label-sm text-label-sm font-semibold text-primary">
                    {item.value}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-primary/80"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
