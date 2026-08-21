"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import type { AppNotification } from "@/lib/notifications";
import {
  countUnreadNotifications,
  createNotifications,
  listNotificationsForUser,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications/repository";

export type NotificationsResult =
  | { ok: true; items: AppNotification[]; unreadCount: number }
  | { ok: false; error: string };

export type NotificationMutationResult =
  | { ok: true; unreadCount: number }
  | { ok: false; error: string };

export type SendNotificationResult =
  | { ok: true; sent: number }
  | { ok: false; error: string };

export async function getMyNotifications(): Promise<NotificationsResult> {
  const user = await requireAuth();
  try {
    const [items, unreadCount] = await Promise.all([
      listNotificationsForUser(user.id),
      countUnreadNotifications(user.id),
    ]);
    return { ok: true, items, unreadCount };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudieron cargar las notificaciones.",
    };
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<NotificationMutationResult> {
  const user = await requireAuth();
  try {
    await markNotificationRead(user.id, notificationId);
    const unreadCount = await countUnreadNotifications(user.id);
    revalidatePath("/notifications");
    return { ok: true, unreadCount };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo marcar como leída.",
    };
  }
}

export async function markAllMyNotificationsRead(): Promise<NotificationMutationResult> {
  const user = await requireAuth();
  try {
    await markAllNotificationsRead(user.id);
    revalidatePath("/notifications");
    return { ok: true, unreadCount: 0 };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudieron marcar como leídas.",
    };
  }
}

export async function sendCustomNotification(input: {
  userIds: readonly string[];
  title: string;
  body: string;
  href: string;
}): Promise<SendNotificationResult> {
  const admin = await requireAdmin();
  const title = input.title.trim();
  const body = input.body.trim();
  if (title.length < 3) {
    return { ok: false, error: "El título debe tener al menos 3 caracteres." };
  }
  if (body.length === 0) {
    return { ok: false, error: "Escribe el mensaje de la alerta." };
  }
  if (input.userIds.length === 0) {
    return { ok: false, error: "Selecciona al menos un empleado." };
  }

  const href = input.href.trim();
  if (href.length > 0 && !href.startsWith("/")) {
    return { ok: false, error: "El enlace debe ser una ruta interna (por ejemplo /my-courses)." };
  }

  try {
    const sent = await createNotifications({
      userIds: input.userIds,
      createdBy: admin.id,
      kind: "custom",
      title,
      body,
      href: href.length > 0 ? href : null,
    });
    revalidatePath("/notifications");
    return { ok: true, sent };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo enviar la notificación.",
    };
  }
}
