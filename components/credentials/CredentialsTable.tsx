"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { CredentialFilter, UserCredential } from "@/lib/credentials";
import { copyCredentialsToClipboard } from "@/lib/credentials";

type CredentialsTableProps = {
  credentials: UserCredential[];
  totalUsers: number;
  onCopy: (hint: string) => void;
  onUnlock: (id: string) => void;
  onResetPassword: (id: string) => void;
  onRevoke: (id: string) => void;
};

const FILTERS: { id: CredentialFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "pending", label: "Sin ingreso" },
  { id: "locked", label: "Bloqueados" },
];

export function CredentialsTable({
  credentials,
  totalUsers,
  onCopy,
  onUnlock,
  onResetPassword,
  onRevoke,
}: Readonly<CredentialsTableProps>) {
  const [filter, setFilter] = useState<CredentialFilter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (filter === "all") {
      return credentials;
    }
    return credentials.filter((item) => item.status === filter);
  }, [credentials, filter]);

  async function handleCopy(item: UserCredential) {
    const ok = await copyCredentialsToClipboard(item);
    if (ok) {
      setCopiedId(item.id);
      onCopy(item.passwordHint);
      window.setTimeout(() => {
        setCopiedId((current) => (current === item.id ? null : current));
      }, 1000);
    }
  }

  return (
    <div className="flex flex-col gap-md lg:col-span-8">
      <div className="flex flex-col gap-md px-xs sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="m-0 font-headline-md text-headline-md text-on-background">
            Accesos del personal
          </h3>
          <p className="mt-xs m-0 font-body-sm text-body-sm text-on-surface-variant">
            Administra cuentas y credenciales de los empleados.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-xs rounded-lg bg-surface-container-low p-xs">
          {FILTERS.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={
                  isActive
                    ? "rounded-md bg-surface-container-lowest px-sm py-xs font-label-sm text-label-sm text-on-surface shadow-sm"
                    : "rounded-md px-sm py-xs font-label-sm text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-lowest/50"
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
        <div className="grid grid-cols-12 gap-sm bg-surface-container-low/50 px-md py-sm">
          <div className="col-span-4 font-label-sm tracking-wider text-on-surface-variant uppercase">
            Empleado
          </div>
          <div className="col-span-3 font-label-sm tracking-wider text-on-surface-variant uppercase">
            Cédula
          </div>
          <div className="col-span-2 font-label-sm tracking-wider text-on-surface-variant uppercase">
            Estado
          </div>
          <div className="col-span-3 text-right font-label-sm tracking-wider text-on-surface-variant uppercase">
            Acciones
          </div>
        </div>

        <div className="relative flex flex-col">
          {visible.length === 0 ? (
            <p className="px-md py-lg text-center font-body-sm text-on-surface-variant">
              No hay empleados en este filtro.
            </p>
          ) : (
            visible.map((item, index) => (
              <CredentialRow
                key={item.id}
                item={item}
                copied={copiedId === item.id}
                showSeparator={index < visible.length - 1}
                onCopy={() => {
                  void handleCopy(item);
                }}
                onUnlock={() => onUnlock(item.id)}
                onResetPassword={() => onResetPassword(item.id)}
                onRevoke={() => onRevoke(item.id)}
              />
            ))
          )}
        </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-start justify-between gap-sm bg-surface-container-low/30 px-md py-sm sm:flex-row sm:items-center">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Mostrando {visible.length} de {totalUsers.toLocaleString("es-CO")} empleados
          </span>
          <div className="flex items-center gap-xs">
            <button
              className="flex h-8 w-8 items-center justify-center rounded text-outline transition-colors hover:bg-surface-container-high disabled:opacity-50"
              disabled
              type="button"
              aria-label="Página anterior"
            >
              <MaterialIcon name="chevron_left" className="text-[20px]" />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded text-on-surface transition-colors hover:bg-surface-container-high"
              type="button"
              aria-label="Página siguiente"
            >
              <MaterialIcon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type CredentialRowProps = {
  item: UserCredential;
  copied: boolean;
  showSeparator: boolean;
  onCopy: () => void;
  onUnlock: () => void;
  onResetPassword: () => void;
  onRevoke: () => void;
};

function CredentialRow({
  item,
  copied,
  showSeparator,
  onCopy,
  onUnlock,
  onResetPassword,
  onRevoke,
}: Readonly<CredentialRowProps>) {
  const isLocked = item.status === "locked";

  return (
    <div
      className={[
        "group relative grid grid-cols-12 items-center gap-sm px-md py-sm transition-colors hover:bg-surface-container-low",
        isLocked ? "opacity-70" : "",
      ].join(" ")}
    >
      <div className="col-span-4 flex min-w-0 items-center gap-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed">
          <span className="font-label-md text-label-md text-on-tertiary-fixed">{item.initials}</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <Link
            href={`/employees/${item.id}`}
            className="truncate font-label-md text-label-md text-primary hover:underline"
          >
            {item.name}
          </Link>
          <span className="truncate font-body-sm text-body-sm text-on-surface-variant">
            {item.email}
          </span>
        </div>
      </div>
      <div className="col-span-3 flex items-center font-mono text-[13px] font-body-md text-on-surface-variant">
        {item.cedula}
      </div>
      <div className="col-span-2 flex items-center">
        <StatusBadge status={item.status} />
      </div>
      <div className="col-span-3 flex items-center justify-end gap-xs">
        <Link
          href={`/employees/${item.id}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
          title="Ver expediente"
        >
          <MaterialIcon name="folder_shared" className="text-[20px]" />
        </Link>
        <button
          className={
            copied
              ? "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary transition-colors"
              : "flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10"
          }
          title="Copiar credenciales"
          type="button"
          onClick={onCopy}
        >
          <MaterialIcon name={copied ? "check" : "content_copy"} className="text-[20px]" />
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors hover:bg-secondary-container/40"
          title="Restablecer contraseña"
          type="button"
          aria-label={`Restablecer contraseña de ${item.name}`}
          onClick={onResetPassword}
        >
          <MaterialIcon name="lock_reset" className="text-[20px]" />
        </button>
        {item.status === "locked" ? (
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant"
            title="Desbloquear"
            type="button"
            onClick={onUnlock}
          >
            <MaterialIcon name="lock_open" className="text-[20px]" />
          </button>
        ) : null}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full text-error transition-colors hover:bg-error-container"
          title="Revocar acceso"
          type="button"
          aria-label={`Revocar acceso de ${item.name}`}
          onClick={onRevoke}
        >
          <MaterialIcon name="person_remove" className="text-[20px]" />
        </button>
      </div>
      {showSeparator ? (
        <div className="absolute right-md bottom-0 left-md h-px bg-outline-variant/20" />
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: Readonly<{ status: UserCredential["status"] }>) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-xs rounded-full bg-surface-container-high px-2 py-1 font-label-sm text-label-sm text-on-surface">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span>Activo</span>
      </span>
    );
  }

  if (status === "locked") {
    return (
      <span className="inline-flex items-center gap-xs rounded-full bg-error-container/50 px-2 py-1 font-label-sm text-label-sm text-on-error-container">
        <span className="h-1.5 w-1.5 rounded-full bg-error" />
        <span>Bloqueado</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-xs rounded-full bg-surface-variant px-2 py-1 font-label-sm text-label-sm text-on-surface-variant">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60" />
      <span>Pendiente de ingreso</span>
    </span>
  );
}
