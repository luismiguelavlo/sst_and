"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { SessionUser } from "@/lib/auth/types";

type SgsstHeaderProps = {
  onOpenMenu: () => void;
  user: SessionUser;
};

export function SgsstHeader({ onOpenMenu, user }: Readonly<SgsstHeaderProps>) {
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
          <span className="truncate font-label-md text-label-md font-bold text-primary">
            Grupo Manzanares S.A.S. - Sistema Integrado SG-SST
          </span>
          <span className="hidden items-center gap-xs rounded-full bg-surface-container px-base py-0.5 font-label-sm text-label-sm font-semibold text-primary sm:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
            Sistema Activo
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-sm sm:gap-md">
          <button
            type="button"
            className="hidden items-center gap-xs rounded-lg bg-surface-container-low px-base py-sm font-label-md text-label-md text-primary transition-colors hover:bg-surface-container md:inline-flex"
          >
            <MaterialIcon name="download" className="text-[18px]" />
            <span>Exportar Reportes</span>
          </button>
          <button
            type="button"
            aria-label="Notificaciones críticas"
            className="relative rounded-lg p-xs text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
          >
            <MaterialIcon name="notifications" className="text-[22px]" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error" />
          </button>
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
