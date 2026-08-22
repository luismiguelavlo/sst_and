"use client";

import { useId, useState, type ReactElement } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import { createWorkerAccount } from "@/lib/auth/credential-actions";
import {
  copyCredentialsToClipboard,
  generatePassword,
  getLoginUrl,
  type UserCredential,
} from "@/lib/credentials";

type NewCredentialFormProps = {
  onCreated: (credential: UserCredential) => void;
};

type FormStatus = "idle" | "saving" | "success";

type CredentialClipboardPayload = Pick<UserCredential, "name" | "email" | "passwordHint">;

export function NewCredentialForm({ onCreated }: Readonly<NewCredentialFormProps>) {
  const formId = useId();
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [createdCredential, setCreatedCredential] = useState<UserCredential | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  function buildDraftPayload(): CredentialClipboardPayload | null {
    const email = correo.trim();
    const passwordHint = password.trim();
    if (email.length === 0 || passwordHint.length === 0) {
      return null;
    }
    const name = nombre.trim();
    return {
      name: name.length > 0 ? name : email,
      email,
      passwordHint,
    };
  }

  function activeCredentialPayload(): CredentialClipboardPayload | null {
    return createdCredential ?? buildDraftPayload();
  }

  async function handleCopyCredentials() {
    const payload = activeCredentialPayload();
    if (!payload) {
      return;
    }
    const ok = await copyCredentialsToClipboard(payload);
    if (!ok) {
      showToast("No se pudo copiar. Intenta seleccionar el texto manualmente.", { variant: "error" });
      return;
    }
    setCopied(true);
    showToast(
      createdCredential
        ? "Credenciales copiadas al portapapeles"
        : "Credenciales copiadas. Recuerda crear el acceso para guardarlas.",
    );
    window.setTimeout(() => setCopied(false), 2000);
  }

  function startAnother() {
    setCreatedCredential(null);
    setCopied(false);
    setStatus("idle");
    setCedula("");
    setNombre("");
    setCorreo("");
    setPassword("");
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setStatus("saving");
    setCopied(false);

    const result = await createWorkerAccount({
      name: nombre.trim(),
      email: correo.trim(),
      cedula: cedula.trim(),
      password,
    });

    if (!result.ok || !result.credential) {
      showToast(result.ok ? "No se pudo crear el acceso." : result.error, { variant: "error" });
      setStatus("idle");
      return;
    }

    onCreated(result.credential);

    setCedula("");
    setNombre("");
    setCorreo("");
    setPassword("");
    setCreatedCredential(result.credential);
    setStatus("success");
  }

  const isBusy = status === "saving";
  const draftPayload = buildDraftPayload();
  const canCopyDraft = draftPayload !== null && status !== "success";

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
              className="flex items-center justify-center rounded-lg bg-surface-container-high px-sm text-on-surface transition-colors hover:bg-surface-container-highest disabled:opacity-60"
              onClick={() => setPassword(generatePassword())}
              title="Generar aleatoria"
              type="button"
              disabled={isBusy || status === "success"}
            >
              <MaterialIcon name="shuffle" className="text-[18px]" />
            </button>
            {password.trim().length > 0 && correo.trim().length > 0 ? (
              <button
                className={
                  copied
                    ? "flex items-center justify-center rounded-lg bg-secondary-container px-sm text-on-secondary-container transition-colors"
                    : "flex items-center justify-center rounded-lg bg-surface-container-high px-sm text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
                }
                onClick={() => {
                  void handleCopyCredentials();
                }}
                title="Copiar credenciales"
                type="button"
                disabled={isBusy}
              >
                <MaterialIcon name={copied ? "check" : "content_copy"} className="text-[18px]" />
              </button>
            ) : null}
          </div>
        </div>

        {canCopyDraft ? (
          <CredentialPreview
            payload={draftPayload}
            copied={copied}
            onCopy={() => {
              void handleCopyCredentials();
            }}
          />
        ) : null}

        <div className="mt-xs flex flex-col gap-sm border-t border-outline-variant/10 pt-sm">
          {canCopyDraft ? (
            <button
              type="button"
              className={
                copied
                  ? "inline-flex w-full items-center justify-center gap-xs rounded-lg bg-secondary-container px-md py-sm font-label-md text-on-secondary-container shadow-sm"
                  : "inline-flex w-full items-center justify-center gap-xs rounded-lg border border-primary/30 bg-surface px-md py-sm font-label-md text-primary transition-colors hover:bg-primary/5 disabled:opacity-60"
              }
              disabled={isBusy}
              onClick={() => {
                void handleCopyCredentials();
              }}
            >
              <MaterialIcon name={copied ? "check" : "content_copy"} className="text-[18px]" />
              {copied ? "Credenciales copiadas" : "Copiar credenciales"}
            </button>
          ) : null}
          <button
            className={
              status === "success"
                ? "group relative flex w-full items-center justify-center gap-xs overflow-hidden rounded-lg bg-secondary-container px-md py-sm font-label-md text-label-md text-on-secondary-container shadow-sm transition-all"
                : "group relative flex w-full items-center justify-center gap-xs overflow-hidden rounded-lg bg-primary px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-on-primary-fixed hover:shadow-md disabled:opacity-80"
            }
            type="submit"
            disabled={isBusy || status === "success"}
          >
            <SubmitButtonContent status={status} />
          </button>
        </div>
      </form>

      {createdCredential ? (
        <CreatedCredentialCard
          credential={createdCredential}
          copied={copied}
          onCopy={() => {
            void handleCopyCredentials();
          }}
          onCreateAnother={startAnother}
        />
      ) : null}
    </div>
  );
}

function CredentialPreview({
  payload,
  copied,
  onCopy,
}: Readonly<{
  payload: CredentialClipboardPayload;
  copied: boolean;
  onCopy: () => void;
}>) {
  const loginUrl = getLoginUrl();

  return (
    <section className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-sm py-sm">
      <div className="mb-xs flex items-center justify-between gap-sm">
        <p className="font-label-sm text-on-surface-variant">Listo para compartir</p>
        <button
          type="button"
          className="inline-flex items-center gap-xs font-label-sm text-primary hover:underline"
          onClick={onCopy}
        >
          <MaterialIcon name={copied ? "check" : "content_copy"} className="text-[16px]" />
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <dl className="space-y-0.5 font-body-sm text-on-surface">
        {loginUrl ? (
          <div className="flex gap-xs">
            <dt className="text-on-surface-variant">URL:</dt>
            <dd className="min-w-0 break-all">{loginUrl}</dd>
          </div>
        ) : null}
        <div className="flex gap-xs">
          <dt className="text-on-surface-variant">Correo:</dt>
          <dd className="min-w-0 break-all">{payload.email}</dd>
        </div>
        <div className="flex gap-xs">
          <dt className="text-on-surface-variant">Contraseña:</dt>
          <dd className="min-w-0 break-all font-mono">{payload.passwordHint}</dd>
        </div>
      </dl>
    </section>
  );
}

function CreatedCredentialCard({
  credential,
  copied,
  onCopy,
  onCreateAnother,
}: Readonly<{
  credential: UserCredential;
  copied: boolean;
  onCopy: () => void;
  onCreateAnother: () => void;
}>) {
  const loginUrl = getLoginUrl();

  return (
    <section
      className="mt-sm rounded-xl border border-secondary/30 bg-secondary-container/40 p-md"
      aria-live="polite"
    >
      <div className="mb-sm flex items-start gap-sm">
        <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[22px] text-secondary" />
        <div className="min-w-0 flex-1">
          <h3 className="font-label-md text-on-surface">Acceso creado</h3>
          <p className="mt-xs font-body-sm text-on-surface-variant">
            Comparte estas credenciales con {credential.name}. Solo se muestran una vez aquí.
          </p>
        </div>
      </div>

      <dl className="space-y-xs rounded-lg bg-surface-container-lowest/80 px-sm py-sm font-body-sm text-on-surface">
        {loginUrl ? (
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-sm">
            <dt className="shrink-0 font-label-sm text-on-surface-variant">URL</dt>
            <dd className="min-w-0 break-all">
              <a
                href={loginUrl}
                className="text-primary underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {loginUrl}
              </a>
            </dd>
          </div>
        ) : null}
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-sm">
          <dt className="shrink-0 font-label-sm text-on-surface-variant">Nombre</dt>
          <dd className="min-w-0 break-words">{credential.name}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-sm">
          <dt className="shrink-0 font-label-sm text-on-surface-variant">Correo</dt>
          <dd className="min-w-0 break-all">{credential.email}</dd>
        </div>
        {credential.passwordHint ? (
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-sm">
            <dt className="shrink-0 font-label-sm text-on-surface-variant">Contraseña</dt>
            <dd className="min-w-0 break-all font-mono">{credential.passwordHint}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-sm flex flex-col gap-xs sm:flex-row">
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90"
          onClick={onCopy}
        >
          <MaterialIcon name={copied ? "check" : "content_copy"} className="text-[18px]" />
          {copied ? "Copiado" : "Copiar credenciales"}
        </button>
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-xs rounded-lg border border-outline-variant/40 bg-surface px-md py-sm font-label-md text-on-surface transition-colors hover:bg-surface-container-high"
          onClick={onCreateAnother}
        >
          <MaterialIcon name="person_add" className="text-[18px]" />
          Crear otro
        </button>
      </div>
    </section>
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
