"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SgsstGlobalSearch } from "@/components/sg-sst/search/SgsstGlobalSearch";
import { SgsstNotificationBell } from "@/components/sg-sst/notificaciones/SgsstNotificationBell";
import type { SessionUser } from "@/lib/auth/types";
import type { SstNotificationCenter } from "@/lib/sg-sst/notificaciones/types";

type SgsstHeaderProps = {
  onOpenMenu: () => void;
  user: SessionUser;
  notificationCenter?: SstNotificationCenter | null;
};

export function SgsstHeader({
  onOpenMenu,
  user,
  notificationCenter = null,
}: Readonly<SgsstHeaderProps>) {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 h-16 bg-surface-container-lowest/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-72">
      <div className="flex h-16 w-full items-center justify-between gap-sm px-sm sm:px-md">
        <div className="flex min-w-0 items-center gap-sm">
          <button
            type="button"
            className="shrink-0 rounded-lg p-xs text-on-surface hover:bg-surface-container-low lg:hidden"
            aria-label="Abrir menú"
            onClick={onOpenMenu}
          >
            <MaterialIcon name="menu" />
          </button>
          <span className="hidden truncate font-label-md text-label-md font-bold text-primary xl:inline">
            Grupo Manzanares S.A.S. - SG-SST
          </span>
        </div>

        <SgsstGlobalSearch />

        <div className="flex shrink-0 items-center gap-sm sm:gap-md">
          <SgsstNotificationBell initialCenter={notificationCenter} />
          <div className="flex items-center gap-sm border-l border-surface-container pl-sm">
            <div className="hidden flex-col text-right sm:flex">
              <span className="font-label-md text-label-md leading-none font-semibold text-on-surface">
                {user.name}
              </span>
              <span className="text-[11px] leading-tight text-on-surface-variant">
                {user.jobTitle || "Responsable SST"}
              </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <MaterialIcon name="person" className="text-[18px] text-on-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
