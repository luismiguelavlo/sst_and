"use server";

import { requireAdmin } from "@/lib/auth/guards";
import {
  loadWorkerSstFicha,
  searchSgsstGlobal,
} from "@/lib/sg-sst/search/repository";
import type { GlobalSearchHit, WorkerSstFicha } from "@/lib/sg-sst/search/types";

export async function searchSgsstGlobalAction(
  query: string,
): Promise<{ hits: GlobalSearchHit[] }> {
  await requireAdmin();
  const hits = await searchSgsstGlobal(query);
  return { hits };
}

export async function loadWorkerSstFichaAction(
  workerId: string,
): Promise<{ ficha: WorkerSstFicha | null }> {
  await requireAdmin();
  const ficha = await loadWorkerSstFicha(workerId);
  return { ficha };
}
