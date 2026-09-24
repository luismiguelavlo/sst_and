"use server";

import { requireAdmin } from "@/lib/auth/guards";
import {
  countSstAuditEvents,
  listSstAuditEvents,
} from "@/lib/sg-sst/trazabilidad/repository";
import type {
  SstAuditEvent,
  SstAuditListFilters,
} from "@/lib/sg-sst/trazabilidad/types";

export async function loadSstAuditTrailAction(
  filters: SstAuditListFilters = {},
): Promise<{ events: SstAuditEvent[]; total: number }> {
  await requireAdmin();
  const [events, total] = await Promise.all([
    listSstAuditEvents(filters),
    countSstAuditEvents(filters),
  ]);
  return { events, total };
}
