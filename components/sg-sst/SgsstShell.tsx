"use client";

import { useCallback, useState } from "react";
import { SgsstHeader } from "@/components/sg-sst/SgsstHeader";
import { SgsstSidebar } from "@/components/sg-sst/SgsstSidebar";
import type { SessionUser } from "@/lib/auth/types";

export function SgsstShell({
  children,
  user,
  criticalAlertCount = 0,
}: Readonly<{
  children: React.ReactNode;
  user: SessionUser;
  criticalAlertCount?: number;
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
        <SgsstHeader onOpenMenu={openMenu} user={user} />
        <main className="min-h-screen w-full bg-background pt-16">{children}</main>
      </div>
    </div>
  );
}
