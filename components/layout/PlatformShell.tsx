"use client";

import { useCallback, useState } from "react";
import { CampusAssistant } from "@/components/assistant/CampusAssistant";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import type { SessionUser } from "@/lib/auth/types";

export function PlatformShell({
  children,
  user,
  initialUnreadNotifications = 0,
}: Readonly<{
  children: React.ReactNode;
  user: SessionUser;
  initialUnreadNotifications?: number;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);

  return (
    <div className="min-h-full bg-background font-body-md text-on-background">
      <AppSidebar open={menuOpen} onClose={closeMenu} role={user.role} />
      <div className="lg:pl-72">
        <AppHeader
          onOpenMenu={openMenu}
          user={user}
          initialUnreadNotifications={initialUnreadNotifications}
        />
        <main className="relative min-h-screen min-w-0 bg-surface px-sm py-md pt-20 sm:px-md sm:pt-24">
          <div className="min-w-0 w-full">{children}</div>
        </main>
      </div>
      <CampusAssistant />
    </div>
  );
}
