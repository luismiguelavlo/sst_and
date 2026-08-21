import { PlatformShell } from "@/components/layout/PlatformShell";
import { requireAuth } from "@/lib/auth/guards";
import { countUnreadNotifications } from "@/lib/notifications/repository";

export default async function PlatformLayout({ children }: LayoutProps<"/">) {
  const user = await requireAuth();
  let unread = 0;
  try {
    unread = await countUnreadNotifications(user.id);
  } catch {
    unread = 0;
  }
  return (
    <PlatformShell user={user} initialUnreadNotifications={unread}>
      {children}
    </PlatformShell>
  );
}
