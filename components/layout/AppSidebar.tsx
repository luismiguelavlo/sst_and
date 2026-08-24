"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { AppRole } from "@/lib/auth/types";

const NAV_ITEMS: readonly {
  href: string;
  label: string;
  icon: string;
  roles: readonly AppRole[];
}[] = [
  { href: "/dashboard", label: "Tablero", icon: "dashboard", roles: ["admin"] },
  { href: "/invitations", label: "Accesos", icon: "badge", roles: ["admin"] },
  { href: "/my-courses", label: "Mis cursos", icon: "school", roles: ["user"] },
  { href: "/course-catalog", label: "Cursos SST", icon: "library_books", roles: ["admin", "user"] },
  { href: "/assign-courses", label: "Asignar cursos", icon: "assignment_ind", roles: ["admin"] },
  { href: "/attendance-forms", label: "Asistencia", icon: "fact_check", roles: ["admin"] },
  { href: "/assign-attendance", label: "Asignar asistencia", icon: "group_add", roles: ["admin"] },
  { href: "/my-attendance", label: "Asistencia", icon: "fact_check", roles: ["user"] },
  { href: "/notifications", label: "Notificaciones", icon: "notifications", roles: ["admin", "user"] },
  { href: "/certificates", label: "Mis certificados", icon: "workspace_premium", roles: ["admin", "user"] },
];

const inactiveClass =
  "flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all";
const activeClass =
  "flex items-center gap-sm px-md py-sm rounded-lg transition-all bg-secondary-container text-on-secondary-container font-semibold";

type AppSidebarProps = {
  open: boolean;
  onClose: () => void;
  role: AppRole;
};

export function AppSidebar({ open, onClose, role }: Readonly<AppSidebarProps>) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

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
        className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-outline-variant/30 bg-surface-container-low transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-lg flex items-center justify-between gap-sm p-md">
          <div className="flex items-center gap-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <MaterialIcon name="health_and_safety" className="text-on-primary" />
            </div>
            <span className="font-headline-md tracking-tight text-primary">Campus SST</span>
          </div>
          <button
            type="button"
            className="rounded-lg p-xs text-on-surface-variant hover:bg-surface-container-high lg:hidden"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <MaterialIcon name="close" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-sm">
          {items.map((item) => {
            const isActive =
              item.href === "/course-catalog"
                ? pathname.startsWith("/course-catalog") ||
                  (pathname.startsWith("/courses/") && !pathname.startsWith("/my-courses"))
                : item.href === "/my-courses"
                  ? pathname === "/my-courses"
                  : item.href === "/dashboard"
                    ? pathname.startsWith("/dashboard") || pathname.startsWith("/employees")
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? activeClass : inactiveClass}
              >
                <MaterialIcon name={item.icon} />
                <span className="font-label-md">
                  {role === "user" && item.href === "/course-catalog" ? "Explorar cursos" : item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-outline-variant/20 p-md">
          <Link
            href="/settings"
            className={
              pathname === "/settings"
                ? activeClass
                : "flex items-center gap-sm rounded-lg px-md py-sm text-on-surface-variant hover:text-on-surface"
            }
          >
            <MaterialIcon name="settings" />
            <span className="font-label-md">{role === "user" ? "Mi perfil" : "Ajustes"}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
