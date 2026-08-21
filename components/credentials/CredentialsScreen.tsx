"use client";

import { useState } from "react";
import { CredentialsTable } from "@/components/credentials/CredentialsTable";
import { NewCredentialForm } from "@/components/credentials/NewCredentialForm";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  resetWorkerAccountPassword,
  revokeWorkerAccount,
  unlockWorkerAccount,
} from "@/lib/auth/credential-actions";
import type { UserCredential } from "@/lib/credentials";
import type { WorkerStats } from "@/lib/auth/types";

export function CredentialsScreen({
  initialCredentials,
  stats,
}: Readonly<{ initialCredentials: UserCredential[]; stats: WorkerStats }>) {
  const [credentials, setCredentials] = useState<UserCredential[]>(initialCredentials);
  const [createdToday, setCreatedToday] = useState(stats.createdToday);
  const [activeUsers, setActiveUsers] = useState(stats.activeUsers);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Credenciales copiadas al portapapeles");

  function showToast(message: string) {
    setToastMessage(message);
    setToastVisible(true);
    window.setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  }

  function handleCreated(credential: UserCredential) {
    setCredentials((current) => [credential, ...current]);
    setCreatedToday((count) => count + 1);
    if (credential.status === "active") {
      setActiveUsers((count) => count + 1);
    }
    showToast("Empleado guardado en PostgreSQL");
  }

  return (
    <div className="relative flex w-full flex-col">
      <div className="mt-lg grid grid-cols-1 items-start gap-md lg:grid-cols-12">
        <div className="flex flex-col gap-md lg:col-span-4">
          <NewCredentialForm onCreated={handleCreated} />
          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col items-center justify-center gap-xs rounded-xl bg-surface-container-low p-sm text-center">
              <div className="leading-none font-display-lg text-[28px] text-primary sm:text-display-lg">
                {activeUsers.toLocaleString("es-CO")}
              </div>
              <div className="font-label-sm tracking-wider text-on-surface-variant uppercase">
                Empleados activos
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-xs rounded-xl bg-secondary-container/30 p-sm text-center">
              <div className="leading-none font-display-lg text-[28px] text-secondary sm:text-display-lg">
                {createdToday}
              </div>
              <div className="font-label-sm tracking-wider text-on-surface-variant uppercase">
                Creados hoy
              </div>
            </div>
          </div>
        </div>

        <CredentialsTable
          credentials={credentials}
          totalUsers={activeUsers}
          onCopy={() => showToast("Correo copiado al portapapeles")}
          onUnlock={(id) => {
            void (async () => {
              const result = await unlockWorkerAccount(id);
              if (!result.ok) {
                showToast(result.error);
                return;
              }
              setCredentials((current) =>
                current.map((item) => (item.id === id ? { ...item, status: "active" } : item)),
              );
              setActiveUsers((count) => count + 1);
              showToast("Empleado desbloqueado");
            })();
          }}
          onResetPassword={(id) => {
            void (async () => {
              const result = await resetWorkerAccountPassword(id);
              if (!result.ok || !result.password) {
                showToast(result.ok ? "No se pudo restablecer." : result.error);
                return;
              }
              setCredentials((current) =>
                current.map((item) =>
                  item.id === id ? { ...item, passwordHint: result.password ?? "" } : item,
                ),
              );
              showToast(`Nueva contraseña: ${result.password}`);
            })();
          }}
          onRevoke={(id) => {
            void (async () => {
              const result = await revokeWorkerAccount(id);
              if (!result.ok) {
                showToast(result.error);
                return;
              }
              const removed = credentials.find((item) => item.id === id);
              setCredentials((current) => current.filter((item) => item.id !== id));
              if (removed?.status === "active") {
                setActiveUsers((count) => Math.max(0, count - 1));
              }
              showToast("Acceso revocado");
            })();
          }}
        />
      </div>

      <div
        id="toast-notification"
        className={[
          "pointer-events-none fixed right-lg bottom-lg z-50 flex items-center gap-sm rounded-lg bg-inverse-surface px-md py-sm text-inverse-on-surface shadow-xl transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
          toastVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0",
        ].join(" ")}
        role="status"
        aria-live="polite"
      >
        <MaterialIcon name="check_circle" className="text-inverse-primary" />
        <span className="font-label-md text-label-md">{toastMessage}</span>
      </div>
    </div>
  );
}
