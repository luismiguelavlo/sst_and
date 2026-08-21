import type { Metadata } from "next";
import { NotificationsScreen } from "@/components/notifications/NotificationsScreen";
import { listAssignableLearners } from "@/lib/assignments/repository";
import { requireAuth } from "@/lib/auth/guards";
import {
  countUnreadNotifications,
  listNotificationsForUser,
} from "@/lib/notifications/repository";

export const metadata: Metadata = {
  title: "Notificaciones · Campus SST",
  description: "Alertas de cursos asignados y mensajes de SST.",
};

export default async function NotificationsPage() {
  const user = await requireAuth();
  const isAdmin = user.role === "admin";
  const [items, unreadCount, learners] = await Promise.all([
    listNotificationsForUser(user.id),
    countUnreadNotifications(user.id),
    isAdmin ? listAssignableLearners() : Promise.resolve([]),
  ]);

  return (
    <NotificationsScreen
      initialItems={items}
      initialUnread={unreadCount}
      isAdmin={isAdmin}
      learners={learners}
    />
  );
}
