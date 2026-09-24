"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import {
  listSstNotificationCenter,
  markAllSstNotificationsRead,
  markSstNotificationRead,
} from "@/lib/sg-sst/notificaciones/repository";
import type { SstNotificationCenter } from "@/lib/sg-sst/notificaciones/types";

export async function loadSstNotificationsAction(): Promise<SstNotificationCenter> {
  const admin = await requireAdmin();
  return listSstNotificationCenter(admin.id);
}

export async function markSstNotificationReadAction(
  recordId: string,
): Promise<{ ok: true; center: SstNotificationCenter } | { ok: false; error: string }> {
  const admin = await requireAdmin();
  try {
    await markSstNotificationRead(admin.id, recordId);
    revalidatePath("/sg-sst");
    revalidatePath("/sg-sst/notificaciones");
    const center = await listSstNotificationCenter(admin.id);
    return { ok: true, center };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo marcar como leída. ¿Ejecutó la migración?",
    };
  }
}

export async function markAllSstNotificationsReadAction(): Promise<
  { ok: true; center: SstNotificationCenter } | { ok: false; error: string }
> {
  const admin = await requireAdmin();
  try {
    const current = await listSstNotificationCenter(admin.id);
    const unreadIds = current.items.filter((i) => !i.read).map((i) => i.id);
    await markAllSstNotificationsRead(admin.id, unreadIds);
    revalidatePath("/sg-sst");
    revalidatePath("/sg-sst/notificaciones");
    const center = await listSstNotificationCenter(admin.id);
    return { ok: true, center };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudieron marcar como leídas.",
    };
  }
}
