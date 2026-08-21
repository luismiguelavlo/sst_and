"use client";

import { useActionState, useState } from "react";
import { login } from "@/lib/auth/actions";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export function LoginForm() {
  const [state, formAction, isSubmitting] = useActionState(login, {});
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative z-10 flex w-full max-w-[440px] flex-col rounded-xl bg-surface-container-lowest p-lg shadow-lg">
      <div className="mb-lg flex flex-col items-center">
        <div className="mb-md flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-primary-container text-on-primary-container shadow-sm">
          <MaterialIcon name="health_and_safety" filled className="text-[28px]" />
        </div>
        <h1 className="mb-xs text-center font-headline-lg text-headline-lg text-on-surface">
          Bienvenido a Campus SST
        </h1>
        <p className="text-center font-body-md text-body-md text-on-surface-variant">
          Inicia sesión con la cuenta que te asignó SST.
        </p>
      </div>

      <form className="flex flex-col gap-md" action={formAction}>
        <div className="relative flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="email">
            Correo corporativo
          </label>
          <div className="group relative">
            <MaterialIcon
              name="mail"
              className="absolute top-1/2 left-sm -translate-y-1/2 text-outline-variant transition-colors group-focus-within:text-primary"
            />
            <input
              className="h-[48px] w-full rounded-lg border-none bg-surface-container-lowest pr-sm pl-[44px] font-body-md text-body-md text-on-surface shadow-[0_0_0_1px] shadow-outline-variant outline-none transition-shadow placeholder:text-outline-variant focus:shadow-[0_0_0_2px] focus:shadow-primary"
              id="email"
              name="email"
              placeholder="nombre@empresa.com"
              required
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="relative flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="password">
            Contraseña
          </label>
          <div className="group relative">
            <MaterialIcon
              name="lock"
              className="absolute top-1/2 left-sm -translate-y-1/2 text-outline-variant transition-colors group-focus-within:text-primary"
            />
            <input
              className="h-[48px] w-full rounded-lg border-none bg-surface-container-lowest pr-[44px] pl-[44px] font-body-md text-body-md text-on-surface shadow-[0_0_0_1px] shadow-outline-variant outline-none transition-shadow placeholder:text-outline-variant focus:shadow-[0_0_0_2px] focus:shadow-primary"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type={passwordVisible ? "text" : "password"}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            <button
              className="absolute top-1/2 right-sm -translate-y-1/2 text-outline-variant outline-none transition-colors hover:text-on-surface focus-visible:text-primary"
              onClick={() => setPasswordVisible((visible) => !visible)}
              type="button"
              aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
              disabled={isSubmitting}
            >
              <MaterialIcon name={passwordVisible ? "visibility" : "visibility_off"} />
            </button>
          </div>
        </div>

        {state.error ? (
          <p className="rounded-lg bg-error-container/40 px-sm py-xs font-body-sm text-on-error-container" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          className={
            isSubmitting
              ? "group mt-sm flex h-[48px] w-full cursor-not-allowed items-center justify-center gap-sm rounded-lg bg-primary font-label-md text-label-md text-on-primary opacity-80 shadow-sm outline-none"
              : "group mt-sm flex h-[48px] w-full items-center justify-center gap-sm rounded-lg bg-primary font-label-md text-label-md text-on-primary shadow-sm outline-none transition-all hover:-translate-y-[2px] hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest active:translate-y-[0px] active:shadow-sm"
          }
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoginSpinner />
          ) : (
            <>
              <span>Ingresar</span>
              <MaterialIcon
                name="arrow_forward"
                className="text-[18px] transition-transform group-hover:translate-x-[4px]"
              />
            </>
          )}
        </button>
      </form>

      <p className="mt-lg text-center font-body-sm text-on-surface-variant">
        Si aún no tienes acceso, solicita tu cuenta al área de SST.
      </p>
    </div>
  );
}

function LoginSpinner() {
  return (
    <svg
      className="h-[20px] w-[20px] animate-spin text-on-primary"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
      />
    </svg>
  );
}
