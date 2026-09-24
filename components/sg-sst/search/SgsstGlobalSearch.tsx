"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { searchSgsstGlobalAction } from "@/lib/sg-sst/search/actions";
import {
  GLOBAL_SEARCH_KIND_LABELS,
  type GlobalSearchHit,
} from "@/lib/sg-sst/search/types";

export function SgsstGlobalSearch() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<GlobalSearchHit[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      return undefined;
    }
    const handle = window.setTimeout(() => {
      startTransition(async () => {
        try {
          const result = await searchSgsstGlobalAction(q);
          setHits(result.hits);
          setOpen(true);
        } catch {
          setHits([]);
        }
      });
    }, 280);
    return () => window.clearTimeout(handle);
  }, [query]);

  function go(hit: GlobalSearchHit) {
    setOpen(false);
    setQuery("");
    router.push(hit.href);
  }

  return (
    <div className="relative hidden min-w-0 flex-1 md:block" ref={rootRef}>
      <div className="flex items-center gap-xs rounded-lg bg-surface-container-low px-sm py-1.5">
        <MaterialIcon name="search" className="text-[18px] text-on-surface-variant" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (hits.length > 0) setOpen(true);
          }}
          placeholder="Buscar trabajador, accidente, EPP, documento…"
          className="w-full min-w-0 bg-transparent font-body-sm text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant"
          aria-label="Buscador global SG-SST"
        />
        {pending ? (
          <MaterialIcon name="progress_activity" className="animate-spin text-[16px] text-outline" />
        ) : null}
      </div>

      {open && query.trim().length >= 2 ? (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-lg">
          {hits.length === 0 && !pending ? (
            <p className="px-md py-md font-body-sm text-body-sm text-on-surface-variant">
              Sin resultados para &quot;{query.trim()}&quot;
            </p>
          ) : (
            <ul>
              {hits.map((hit) => (
                <li key={`${hit.kind}-${hit.id}`}>
                  <button
                    type="button"
                    className="flex w-full flex-col gap-0.5 px-md py-sm text-left hover:bg-surface-container"
                    onClick={() => go(hit)}
                  >
                    <div className="flex items-center gap-xs">
                      <span className="rounded bg-surface-container px-1.5 py-0.5 font-label-sm text-[10px] uppercase tracking-wider text-primary">
                        {GLOBAL_SEARCH_KIND_LABELS[hit.kind]}
                      </span>
                      <span className="truncate font-label-md text-label-md font-semibold text-on-surface">
                        {hit.title}
                      </span>
                    </div>
                    <span className="truncate font-body-sm text-body-sm text-on-surface-variant">
                      {hit.subtitle}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {hits.some((h) => h.kind === "trabajador") ? null : query.trim().length >= 2 &&
            hits.length > 0 ? (
            <div className="border-t border-outline-variant/20 px-md py-sm">
              <Link
                href={`/sg-sst/trabajadores`}
                className="font-label-sm text-label-sm text-primary"
                onClick={() => setOpen(false)}
              >
                Ver base de trabajadores →
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
