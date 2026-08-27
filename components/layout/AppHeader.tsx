"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { logout } from "@/lib/auth/actions";
import { ShareAssistantLinkButton } from "@/components/assistant/ShareAssistantLinkButton";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import type { SessionUser } from "@/lib/auth/types";

export function AppHeader({
  onOpenMenu,
  user,
  initialUnreadNotifications = 0,
}: Readonly<{
  onOpenMenu: () => void;
  user: SessionUser;
  initialUnreadNotifications?: number;
}>) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const needle = query.trim();
    const href =
      needle.length > 0
        ? `/course-catalog?q=${encodeURIComponent(needle)}`
        : "/course-catalog";
    router.push(href);
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between gap-sm bg-surface/80 px-sm shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:h-20 sm:px-md lg:left-72">
      <div className="flex min-w-0 flex-1 items-center gap-sm">
        <button
          type="button"
          className="shrink-0 rounded-lg p-xs text-on-surface hover:bg-surface-container lg:hidden"
          aria-label="Abrir menú"
          onClick={onOpenMenu}
        >
          <MaterialIcon name="menu" />
        </button>
        <form
          onSubmit={onSearch}
          className="flex min-w-0 flex-1 items-center gap-sm rounded-full bg-surface-container-high/50 px-sm py-xs sm:max-w-96 sm:gap-md sm:px-md"
        >
          <MaterialIcon name="search" className="shrink-0 text-outline" />
          <input
            className="w-full min-w-0 border-none bg-transparent text-body-sm outline-none focus:ring-0"
            placeholder="Buscar cursos SST..."
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Buscar cursos"
          />
          <button
            type="submit"
            className="hidden shrink-0 rounded-full px-sm py-xs font-label-sm text-primary hover:bg-primary/10 sm:inline"
          >
            Buscar
          </button>
        </form>
      </div>
      <div className="flex shrink-0 items-center gap-sm sm:gap-md">
        {user.role === "admin" ? <ShareAssistantLinkButton /> : null}
        <NotificationBell initialUnread={initialUnreadNotifications} />
        <Link
          href="/settings"
          className="flex items-center gap-sm rounded-full px-xs py-xs transition-colors hover:bg-surface-container sm:px-sm"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <MaterialIcon name="person" className="text-[18px] text-on-primary" />
          </div>
          <div className="hidden text-left leading-tight md:block">
            <div className="text-label-md text-on-surface">{user.name}</div>
            <div className="text-label-sm text-on-surface-variant">{user.jobTitle}</div>
          </div>
        </Link>
        <div className="hidden h-8 w-px bg-outline-variant/30 sm:block" />
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-xs px-xs py-xs text-on-surface-variant transition-colors hover:text-error sm:px-sm"
          >
            <MaterialIcon name="logout" className="text-[20px]" />
            <span className="hidden text-label-sm sm:inline">Salir</span>
          </button>
        </form>
      </div>
    </header>
  );
}
