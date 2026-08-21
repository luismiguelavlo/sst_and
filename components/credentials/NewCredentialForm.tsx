"use client";

import { useId, useState, type ReactElement } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { createWorkerAccount } from "@/lib/auth/credential-actions";
import { generatePassword, type UserCredential } from "@/lib/credentials";

type NewCredentialFormProps = {
  onCreated: (credential: UserCredential) => void;
};

type FormStatus = "idle" | "saving" | "success";

export function NewCredentialForm({ onCreated }: Readonly<NewCredentialFormProps>) {
  const formId = useId();
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setStatus("saving");
    setError(null);

    const result = await createWorkerAccount({
      name: nombre.trim(),
      email: correo.trim(),
      cedula: cedula.trim(),
      password,
    });

    if (!result.ok || !result.credential) {
      setError(result.ok ? "No se pudo crear el acceso." : result.error);
      setStatus("idle");
      return;
    }

    onCreated(result.credential);

    setCedula("");
    setNombre("");
    setCorreo("");
    setPassword("");
    setStatus("success");

    window.setTimeout(() => {
      setStatus("idle");
    }, 2000);
  }

  const isBusy = status !== "idle";

  return (
    <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-xs flex items-center gap-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <MaterialIcon name="person_add" filled className="text-[20px] text-primary" />
        </div>
        <div>
          <h2 className="m-0 text-[20px] leading-none font-headline-md tracking-tight text-on-surface">
            Nuevo acceso
          </h2>
          <p className="m-0 font-body-sm text-body-sm text-on-surface-variant">
            Crea cuentas de empleados. Ellos solo inician sesión con ese acceso.
          </p>
        </div>
      </div>

      <form className="mt-sm flex flex-col gap-sm" onSubmit={handleSubmit}>
        <IconField
          id={`${formId}-cedula`}
          label="Cédula"
          icon="badge"
          placeholder="Ej. 1-2345-6789"
          value={cedula}
          onChange={setCedula}
          disabled={isBusy}
        />
        <IconField
          id={`${formId}-nombre`}
          label="Nombre completo"
          icon="person"
          placeholder="Ej. María Rodríguez"
          value={nombre}
          onChange={setNombre}
          disabled={isBusy}
        />
        <IconField
          id={`${formId}-correo`}
          label="Correo corporativo"
          icon="alternate_email"
          type="email"
          placeholder="m.rodriguez@empresa.com"
          value={correo}
          onChange={setCorreo}
          disabled={isBusy}
        />

        <div className="group flex flex-col gap-xs">
          <label
            className="text-[10px] font-label-md tracking-wider text-on-surface uppercase"
            htmlFor={`${formId}-password`}
          >
            Contraseña
          </label>
          <div className="flex gap-xs">
            <div className="relative flex flex-1 items-center">
              <MaterialIcon
                name="key"
                className="absolute left-sm text-[18px] text-outline-variant transition-colors group-focus-within:text-primary"
              />
              <input
                id={`${formId}-password`}
                className="w-full rounded-lg border-none bg-surface-container-low py-1.5 pr-sm pl-[36px] text-[14px] font-body-md text-on-surface transition-all placeholder:text-outline-variant focus:ring-0 focus:outline-none"
                placeholder="Define o genera"
                required
                type="text"
                autoComplete="new-password"
                value={password}
                disabled={isBusy}
                onChange={(event) => setPassword(event.target.value)}
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 rounded-b-lg bg-primary transition-all duration-300 ease-out group-focus-within:w-full" />
            </div>
            <button
              className="flex items-center justify-center rounded-lg bg-surface-container-high px-sm text-on-surface transition-colors hover:bg-surface-container-highest"
              onClick={() => setPassword(generatePassword())}
              title="Generar aleatoria"
              type="button"
              disabled={isBusy}
            >
              <MaterialIcon name="shuffle" className="text-[18px]" />
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-lg bg-error-container/40 px-sm py-xs font-body-sm text-on-error-container" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-xs flex items-center justify-between border-t border-outline-variant/10 pt-sm">
          <button
            className={
              status === "success"
                ? "group relative flex w-full items-center justify-center gap-xs overflow-hidden rounded-lg bg-secondary-container px-md py-sm font-label-md text-label-md text-on-secondary-container shadow-sm transition-all"
                : "group relative flex w-full items-center justify-center gap-xs overflow-hidden rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-on-primary-fixed hover:shadow-md disabled:opacity-80"
            }
            type="submit"
            disabled={isBusy}
          >
            <SubmitButtonContent status={status} />
          </button>
        </div>
      </form>
    </div>
  );
}

type IconFieldProps = {
  id: string;
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  disabled?: boolean;
};

function SubmitButtonContent({ status }: Readonly<{ status: FormStatus }>): ReactElement {
  if (status === "saving") {
    return (
      <>
        <MaterialIcon name="progress_activity" className="animate-spin" />
        <span className="relative z-10">Guardando...</span>
      </>
    );
  }

  if (status === "success") {
    return (
      <>
        <MaterialIcon name="check" className="text-[18px]" />
        <span className="relative z-10">¡Empleado creado!</span>
      </>
    );
  }

  return (
    <>
      <span className="relative z-10">Crear acceso</span>
      <MaterialIcon
        name="person_add"
        className="relative z-10 text-[18px] transition-transform group-hover:translate-x-1"
      />
      <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
    </>
  );
}

function IconField({
  id,
  label,
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled,
}: Readonly<IconFieldProps>) {
  return (
    <div className="group flex flex-col gap-xs">
      <label
        className="text-[10px] font-label-md tracking-wider text-on-surface uppercase"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <MaterialIcon
          name={icon}
          className="absolute left-sm text-[18px] text-outline-variant transition-colors group-focus-within:text-primary"
        />
        <input
          id={id}
          className="w-full rounded-lg border-none bg-surface-container-low py-1.5 pr-sm pl-[36px] text-[14px] font-body-md text-on-surface transition-all placeholder:text-outline-variant focus:ring-0 focus:outline-none"
          placeholder={placeholder}
          required
          type={type}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        <div className="absolute bottom-0 left-0 h-0.5 w-0 rounded-b-lg bg-primary transition-all duration-300 ease-out group-focus-within:w-full" />
      </div>
    </div>
  );
}
