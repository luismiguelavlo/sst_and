"use server";

import { requireAdmin } from "@/lib/auth/guards";
import {
  createActivity,
  deleteActivity,
  getActivity,
  listActivities,
  listAdminUsers,
  updateActivity,
} from "./repository";
import {
  datetimeLocalToIso,
  validateActivityDraft,
  type ActivityDraft,
  type ActivityListFilters,
  type AdminUserOption,
  type WorkActivity,
} from "./types";

export type SaveActivityResult =
  | { ok: true; activity: WorkActivity }
  | { ok: false; error: string };

function normalizeDraftForPersist(draft: ActivityDraft): ActivityDraft {
  return {
    ...draft,
    startsAt: datetimeLocalToIso(draft.startsAt),
    endsAt: datetimeLocalToIso(draft.endsAt),
  };
}

export async function loadActivitiesAction(
  filters: ActivityListFilters = {},
): Promise<WorkActivity[]> {
  await requireAdmin();
  try {
    return await listActivities(filters);
  } catch {
    return [];
  }
}

export async function loadAdminUsersAction(): Promise<AdminUserOption[]> {
  await requireAdmin();
  try {
    return await listAdminUsers();
  } catch {
    return [];
  }
}

export async function saveActivityAction(
  draft: ActivityDraft,
): Promise<SaveActivityResult> {
  const actor = await requireAdmin();
  const error = validateActivityDraft(draft);
  if (error) return { ok: false, error };

  const normalized = normalizeDraftForPersist(draft);

  try {
    if (draft.id) {
      const activity = await updateActivity(draft.id, normalized, actor.id);
      return { ok: true, activity };
    }
    const activity = await createActivity(normalized, actor.id);
    return { ok: true, activity };
  } catch (err) {
    console.error("[saveActivityAction]", err);
    return { ok: false, error: "Error al guardar la actividad." };
  }
}

export async function deleteActivityAction(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  try {
    await deleteActivity(id);
    return { ok: true };
  } catch (err) {
    console.error("[deleteActivityAction]", err);
    return { ok: false, error: "Error al eliminar la actividad." };
  }
}

export async function changeActivityStatusAction(
  id: string,
  status: ActivityDraft["status"],
): Promise<SaveActivityResult> {
  const actor = await requireAdmin();
  try {
    const current = await getActivity(id);
    if (!current) return { ok: false, error: "Actividad no encontrada." };
    const draft: ActivityDraft = {
      id: current.id,
      title: current.title,
      description: current.description,
      startsAt: current.startsAt,
      endsAt: current.endsAt,
      status,
      priority: current.priority,
      category: current.category,
      assigneeId: current.assigneeId ?? "",
    };
    const activity = await updateActivity(id, draft, actor.id);
    return { ok: true, activity };
  } catch (err) {
    console.error("[changeActivityStatusAction]", err);
    return { ok: false, error: "Error al actualizar estado." };
  }
}
