import type { SstSemaphoreLevel } from "@/lib/sg-sst/alerts/types";

export type SstNotificationItem = {
  id: string;
  title: string;
  body: string;
  href: string;
  semaphore: SstSemaphoreLevel;
  dueDate: string | null;
  daysRemaining: number | null;
  read: boolean;
  modulePath: string;
  recordType: string;
};

export type SstNotificationCenter = {
  items: SstNotificationItem[];
  counts: {
    critico: number;
    proximo: number;
    seguimiento: number;
    unread: number;
  };
};

export function notificationBucketLabel(level: SstSemaphoreLevel): string {
  switch (level) {
    case "critico":
      return "Vencimientos críticos";
    case "proximo":
      return "Vencimientos próximos";
    case "seguimiento":
      return "Seguimientos pendientes";
    default:
      return "Vigentes";
  }
}
