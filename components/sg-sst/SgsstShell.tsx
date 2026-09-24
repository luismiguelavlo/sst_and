"use client";

import { Suspense, useCallback, useState } from "react";
import { SgsstGlobalFilterBar } from "@/components/sg-sst/filters/SgsstGlobalFilterBar";
import { SgsstGlobalFiltersProvider } from "@/components/sg-sst/filters/SgsstGlobalFiltersContext";
import { SgsstHeader } from "@/components/sg-sst/SgsstHeader";
import { SgsstSidebar } from "@/components/sg-sst/SgsstSidebar";
import type { SessionUser } from "@/lib/auth/types";
import type { SstNotificationCenter } from "@/lib/sg-sst/notificaciones/types";

export function SgsstShell({
  children,
  user,
  criticalAlertCount = 0,
  notificationCenter = null,
}: Readonly<{
  children: React.ReactNode;
  user: SessionUser;
  criticalAlertCount?: number;
  notificationCenter?: SstNotificationCenter | null;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);

  return (
    <div className="min-h-full bg-background font-body-md text-body-md text-on-surface antialiased">
      <SgsstSidebar
        open={menuOpen}
        onClose={closeMenu}
        criticalAlertCount={criticalAlertCount}
      />
      <div className="lg:pl-72">
        <SgsstHeader
          onOpenMenu={openMenu}
          user={user}
          notificationCenter={notificationCenter}
        />
        <Suspense fallback={<div className="pt-16" />}>
          <SgsstGlobalFiltersProvider>
            <div className="pt-16">
              <div className="sticky top-16 z-30">
                <SgsstGlobalFilterBar />
              </div>
              <main className="min-h-screen w-full bg-background">{children}</main>
            </div>
          </SgsstGlobalFiltersProvider>
        </Suspense>
      </div>
    </div>
  );
}
