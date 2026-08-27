"use client";

import { useActionState, useEffect, useState } from "react";
import { loginForAssistant } from "@/lib/auth/actions";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";

export function AssistantLoginGate() {
  const [state, formAction, isSubmitting] = useActionState(loginForAssistant, {});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (state.error) {
      showToast(state.error, { variant: "error" });
    }
  }, [state.error, showToast]);

  return (
    <div className="mx-auto flex w-full max-w-[440px] flex-col rounded-xl bg-surface-container-lowest p-lg shadow-lg">
      <div className="mb-lg flex flex-col items-center text-center">
        <div className="mb-md flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-on-primary">
          <MaterialIcon name="chat" filled className="text-[28px]" />
        </div>
        <h1 className="font-headline-lg text-on-surface">Asistente Campus SST</h1>
        <p className="mt-xs font-body-md text-on-surface-variant">
          Inicia sesión para consultar tus cursos, certificados y asistencia.
        </p>
      </div>

      <form className="flex flex-col gap-md" action={formAction}>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-on-surface" htmlFor="assistant-email">
            Correo
          </label>
          <input
            id="assistant-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={isSubmitting}
            placeholder="nombre@empresa.com"
            className="h-12 rounded-lg border border-outline-variant/40 bg-surface px-sm font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-on-surface" htmlFor="assistant-password">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="assistant-password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
              placeholder="••••••••"
              className="h-12 w-full rounded-lg border border-outline-variant/40 bg-surface px-sm pr-12 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              className="absolute top-1/2 right-sm -translate-y-1/2 text-outline"
              aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setPasswordVisible((value) => !value)}
            >
              <MaterialIcon name={passwordVisible ? "visibility" : "visibility_off"} />
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-xs flex h-12 items-center justify-center gap-xs rounded-lg bg-primary font-label-md text-on-primary disabled:opacity-70"
        >
          {isSubmitting ? "Ingresando…" : "Entrar al asistente"}
        </button>
      </form>

      <p className="mt-md text-center font-body-sm text-on-surface-variant">
        Usa la misma cuenta de Campus SST que te asignó el área de SST.
      </p>
    </div>
  );
}
