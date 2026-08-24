export type NotificationKind = "course_assigned" | "custom" | "attendance_form";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
  createdAtLabel: string;
};

export function isNotificationKind(value: string): value is NotificationKind {
  return value === "course_assigned" || value === "custom" || value === "attendance_form";
}
