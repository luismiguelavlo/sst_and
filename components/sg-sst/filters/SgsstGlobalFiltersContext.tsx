"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import { loadGlobalFilterMetaAction } from "@/lib/sg-sst/filters/actions";
import {
  countActiveGlobalFilters,
  defaultGlobalFilters,
  globalFiltersToSearchParams,
  parseGlobalFiltersFromSearchParams,
  type SgsstGlobalFilterOptions,
  type SgsstGlobalFilters,
} from "@/lib/sg-sst/filters/global";

type WorkerOption = { id: string; fullName: string; documentNumber: string };

type GlobalFiltersContextValue = {
  filters: SgsstGlobalFilters;
  setFilters: (next: SgsstGlobalFilters | ((prev: SgsstGlobalFilters) => SgsstGlobalFilters)) => void;
  patchFilters: (patch: Partial<SgsstGlobalFilters>) => void;
  resetFilters: () => void;
  activeCount: number;
  options: SgsstGlobalFilterOptions;
  farms: SstFarm[];
  workers: WorkerOption[];
  ready: boolean;
};

const GlobalFiltersContext = createContext<GlobalFiltersContextValue | null>(null);

const EMPTY_OPTIONS: SgsstGlobalFilterOptions = {
  years: [new Date().getFullYear()],
  companies: [],
  areas: [],
  workCenters: [],
  statuses: [],
};

export function SgsstGlobalFiltersProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFiltersState] = useState<SgsstGlobalFilters>(() =>
    parseGlobalFiltersFromSearchParams(new URLSearchParams(searchParams.toString())),
  );
  const [options, setOptions] = useState<SgsstGlobalFilterOptions>(EMPTY_OPTIONS);
  const [farms, setFarms] = useState<SstFarm[]>([]);
  const [workers, setWorkers] = useState<WorkerOption[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const parsed = parseGlobalFiltersFromSearchParams(
      new URLSearchParams(searchParams.toString()),
    );
    setFiltersState(parsed);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    void loadGlobalFilterMetaAction()
      .then((meta) => {
        if (cancelled) return;
        setOptions(meta.options);
        setFarms(meta.farms);
        setWorkers(meta.workers);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const syncUrl = useCallback(
    (next: SgsstGlobalFilters) => {
      const params = globalFiltersToSearchParams(
        next,
        new URLSearchParams(searchParams.toString()),
      );
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setFilters = useCallback(
    (next: SgsstGlobalFilters | ((prev: SgsstGlobalFilters) => SgsstGlobalFilters)) => {
      setFiltersState((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        syncUrl(resolved);
        return resolved;
      });
    },
    [syncUrl],
  );

  const patchFilters = useCallback(
    (patch: Partial<SgsstGlobalFilters>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
    },
    [setFilters],
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultGlobalFilters());
  }, [setFilters]);

  const value = useMemo<GlobalFiltersContextValue>(
    () => ({
      filters,
      setFilters,
      patchFilters,
      resetFilters,
      activeCount: countActiveGlobalFilters(filters),
      options,
      farms,
      workers,
      ready,
    }),
    [filters, setFilters, patchFilters, resetFilters, options, farms, workers, ready],
  );

  return (
    <GlobalFiltersContext.Provider value={value}>
      {children}
    </GlobalFiltersContext.Provider>
  );
}

export function useSgsstGlobalFilters(): GlobalFiltersContextValue {
  const ctx = useContext(GlobalFiltersContext);
  if (!ctx) {
    throw new Error("useSgsstGlobalFilters debe usarse dentro de SgsstGlobalFiltersProvider");
  }
  return ctx;
}

/** Variante segura para pantallas que pueden montarse fuera del provider. */
export function useOptionalSgsstGlobalFilters(): GlobalFiltersContextValue | null {
  return useContext(GlobalFiltersContext);
}
