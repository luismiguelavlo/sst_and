"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { isSgsstNavActive, SGSST_BASE, SGSST_NAV } from "@/lib/sg-sst/nav";

type SgsstSidebarProps = {
  open: boolean;
  onClose: () => void;
  criticalAlertCount?: number;
};

export function SgsstSidebar({
  open,
  onClose,
  criticalAlertCount = 0,
}: Readonly<SgsstSidebarProps>) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menú"
        className={`fixed inset-0 z-40 bg-on-surface/40 lg:hidden ${open ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center gap-sm bg-surface-container-low px-md">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm">
            <MaterialIcon name="agriculture" className="text-[20px]" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-label-md text-label-md tracking-tight text-primary">
              Grupo Manzanares S.A.S.
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              SG-SST Operativo
            </span>
          </div>
          <button
            type="button"
            className="rounded-lg p-xs text-on-surface-variant hover:bg-surface-container lg:hidden"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="p-sm">
          <Link
            href={`${SGSST_BASE}/alertas-sst`}
            className="flex items-center justify-between rounded-lg bg-error-container px-sm py-base text-on-error-container shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-colors hover:bg-error hover:text-on-error"
          >
            <div className="flex items-center gap-xs">
              <MaterialIcon name="warning" className="text-[20px]" />
              <span className="font-label-md text-label-md font-semibold">Alertas Críticas SST</span>
            </div>
            <span className="rounded-full bg-error px-xs py-0.5 font-label-sm text-label-sm font-bold text-on-error">
              {criticalAlertCount}
            </span>
          </Link>
        </div>

        <div className="flex-1 space-y-md overflow-y-auto px-sm py-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="space-y-base">
            {SGSST_NAV.map((section) => (
              <div key={section.title}>
                <div
                  className={`px-base font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant ${section.title === "Principal" ? "" : "pt-sm"}`}
                >
                  {section.title}
                </div>
                <div className="mt-xs space-y-xs">
                  {section.items.map((item) => {
                    const isActive = isSgsstNavActive(pathname, item.href);
                    const isAlerts = item.path === "alertas-sst";
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={
                          isActive
                            ? "flex items-center gap-sm rounded-lg bg-primary px-base py-sm font-medium text-on-primary shadow-sm transition-colors"
                            : isAlerts
                              ? "flex items-center justify-between gap-sm rounded-lg bg-error-container/40 px-base py-sm font-label-md text-label-md text-on-error-container transition-colors hover:bg-error-container"
                              : "flex items-center gap-sm rounded-lg px-base py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                        }
                      >
                        <span className="flex items-center gap-sm">
                          <MaterialIcon name={item.icon} className="text-[20px]" />
                          <span>{item.label}</span>
                        </span>
                        {isAlerts && criticalAlertCount > 0 ? (
                          <span className="rounded-full bg-error px-xs py-0.5 text-[10px] font-bold text-on-error">
                            {criticalAlertCount}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="space-y-sm bg-surface-container-low p-sm">
          <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-sm">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant">Sede Principal</span>
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                Fincas Operativas
              </span>
            </div>
            <span className="h-2 w-2 rounded-full bg-secondary" />
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-sm rounded-lg px-base py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-lowest hover:text-primary"
          >
            <MaterialIcon name="school" className="text-[20px]" />
            <span>Volver a Campus SST</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
