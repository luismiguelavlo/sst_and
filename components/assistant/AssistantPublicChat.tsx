"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AssistantChatPanel } from "@/components/assistant/AssistantChatPanel";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  loginInAssistantChatAction,
  logoutAssistantSessionAction,
} from "@/lib/auth/actions";

type GuestStep = "welcome" | "ask_email" | "ask_password";

type GuestMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  showPasswordForm?: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function looksLikeEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function AssistantPublicChat({
  initialUserName,
}: Readonly<{
  initialUserName: string | null;
}>) {
  const [userName, setUserName] = useState<string | null>(initialUserName);
  const [guestStep, setGuestStep] = useState<GuestStep>(
    initialUserName ? "welcome" : "welcome",
  );
  const [pendingEmail, setPendingEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<GuestMessage[]>(() =>
    initialUserName
      ? []
      : [
          {
            id: "welcome",
            role: "assistant",
            text: "Hola. Soy el asistente de Campus SST.\n\nPara ver tus cursos, certificados o asistencia, primero inicia sesión con tu cuenta.",
          },
          {
            id: "ask-start",
            role: "assistant",
            text: "Escribe tu correo corporativo para continuar, o toca «Iniciar sesión».",
          },
        ],
  );
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) {
      return;
    }
    node.scrollTop = node.scrollHeight;
  }, [messages, busy, userName]);

  const push = useCallback((message: Omit<GuestMessage, "id">) => {
    setMessages((current) => [
      ...current,
      { ...message, id: `${Date.now()}-${current.length}` },
    ]);
  }, []);

  async function completeLogin(email: string, pwd: string) {
    setBusy(true);
    const result = await loginInAssistantChatAction({ email, password: pwd });
    setBusy(false);
    if (!result.ok) {
      push({ role: "assistant", text: result.error });
      push({
        role: "assistant",
        text: "Intenta de nuevo con tu contraseña:",
        showPasswordForm: true,
      });
      setGuestStep("ask_password");
      return;
    }
    setPassword("");
    setPendingEmail("");
    setGuestStep("welcome");
    setUserName(result.userName);
  }

  function startLoginFlow() {
    if (busy) {
      return;
    }
    push({ role: "user", text: "Iniciar sesión" });
    push({
      role: "assistant",
      text: "Perfecto. ¿Cuál es tu correo corporativo?",
    });
    setGuestStep("ask_email");
  }

  async function onGuestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (text.length === 0 || busy) {
      return;
    }
    setDraft("");

    if (guestStep === "welcome") {
      push({ role: "user", text });
      if (looksLikeEmail(text)) {
        setPendingEmail(text);
        setGuestStep("ask_password");
        push({
          role: "assistant",
          text: `Correo recibido: ${text}\n\nAhora ingresa tu contraseña (no se muestra en el chat):`,
          showPasswordForm: true,
        });
        return;
      }
      if (/iniciar|sesi[oó]n|entrar|login|hola|ayuda/.test(text.toLowerCase())) {
        push({
          role: "assistant",
          text: "Claro. Escribe tu correo corporativo para continuar.",
        });
        setGuestStep("ask_email");
        return;
      }
      push({
        role: "assistant",
        text: "Primero necesito autenticarte. Escribe tu correo o toca «Iniciar sesión».",
      });
      return;
    }

    if (guestStep === "ask_email") {
      push({ role: "user", text });
      if (!looksLikeEmail(text)) {
        push({
          role: "assistant",
          text: "Eso no parece un correo válido. Ejemplo: nombre@empresa.com",
        });
        return;
      }
      setPendingEmail(text);
      setGuestStep("ask_password");
      push({
        role: "assistant",
        text: `Correo recibido: ${text}\n\nAhora ingresa tu contraseña (no se muestra en el chat):`,
        showPasswordForm: true,
      });
      return;
    }

    // ask_password: if they type in the main box, treat as password attempt without echoing it
    push({ role: "user", text: "••••••••" });
    await completeLogin(pendingEmail, text);
  }

  async function onPasswordFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.trim().length === 0 || busy || pendingEmail.length === 0) {
      return;
    }
    push({ role: "user", text: "••••••••" });
    const pwd = password;
    setPassword("");
    await completeLogin(pendingEmail, pwd);
  }

  async function onLogout() {
    setBusy(true);
    await logoutAssistantSessionAction();
    setBusy(false);
    setUserName(null);
    setPendingEmail("");
    setPassword("");
    setGuestStep("welcome");
    setMessages([
      {
        id: "bye",
        role: "assistant",
        text: "Sesión cerrada. Cuando quieras, inicia sesión otra vez para consultar tu información.",
      },
      {
        id: "ask-again",
        role: "assistant",
        text: "Escribe tu correo corporativo o toca «Iniciar sesión».",
      },
    ]);
  }

  return (
    <div className="flex h-[100dvh] min-h-screen flex-col bg-surface">
      <header className="flex shrink-0 items-center justify-between gap-sm border-b border-outline-variant/20 bg-primary px-md py-sm text-on-primary sm:px-lg">
        <div className="min-w-0">
          <p className="font-label-md">Asistente Campus SST</p>
          <p className="truncate font-body-sm text-on-primary/80">
            {userName
              ? `Hola, ${userName}`
              : "Inicia sesión en el chat para continuar"}
          </p>
        </div>
        {userName ? (
          <button
            type="button"
            disabled={busy}
            className="inline-flex items-center gap-xs rounded-lg bg-on-primary/10 px-sm py-xs font-label-sm hover:bg-on-primary/20 disabled:opacity-50"
            onClick={() => {
              void onLogout();
            }}
          >
            <MaterialIcon name="logout" className="text-[18px]" />
            Salir
          </button>
        ) : null}
      </header>

      {userName ? (
        <AssistantChatPanel variant="page" userName={userName} />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            ref={listRef}
            className="flex-1 space-y-sm overflow-y-auto bg-surface px-md py-md sm:px-lg"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[90%] rounded-2xl rounded-br-md bg-primary px-sm py-xs font-body-sm whitespace-pre-wrap text-on-primary"
                      : "max-w-[min(100%,640px)] rounded-2xl rounded-bl-md bg-surface-container-high px-md py-sm font-body-md whitespace-pre-wrap text-on-surface"
                  }
                >
                  {message.text}
                  {message.showPasswordForm ? (
                    <form
                      className="mt-sm space-y-xs rounded-xl bg-surface-container-lowest p-sm"
                      onSubmit={onPasswordFormSubmit}
                    >
                      <label className="font-label-sm text-on-surface-variant" htmlFor="chat-password">
                        Contraseña
                      </label>
                      <div className="relative">
                        <input
                          id="chat-password"
                          type={passwordVisible ? "text" : "password"}
                          value={password}
                          autoComplete="current-password"
                          disabled={busy}
                          onChange={(event) => setPassword(event.target.value)}
                          className="h-11 w-full rounded-lg border border-outline-variant/40 bg-surface px-sm pr-11 font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Tu contraseña"
                        />
                        <button
                          type="button"
                          className="absolute top-1/2 right-2 -translate-y-1/2 text-outline"
                          aria-label={passwordVisible ? "Ocultar" : "Mostrar"}
                          onClick={() => setPasswordVisible((value) => !value)}
                        >
                          <MaterialIcon
                            name={passwordVisible ? "visibility" : "visibility_off"}
                            className="text-[18px]"
                          />
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={busy || password.length === 0}
                        className="w-full rounded-lg bg-primary px-sm py-xs font-label-md text-on-primary disabled:opacity-50"
                      >
                        {busy ? "Validando…" : "Entrar"}
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            ))}
            {busy ? <p className="font-body-sm text-on-surface-variant">Validando…</p> : null}
          </div>

          <div className="border-t border-outline-variant/20 bg-surface-container-low px-md py-md sm:px-lg">
            {guestStep !== "ask_password" ? (
              <div className="mb-sm flex flex-wrap gap-xs">
                <button
                  type="button"
                  disabled={busy}
                  className="rounded-full bg-surface-container-highest px-md py-xs font-label-md text-on-surface hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                  onClick={startLoginFlow}
                >
                  Iniciar sesión
                </button>
              </div>
            ) : null}
            <form className="flex items-center gap-xs" onSubmit={onGuestSubmit}>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={
                  guestStep === "ask_password"
                    ? "O escribe la contraseña aquí…"
                    : guestStep === "ask_email"
                      ? "Tu correo corporativo…"
                      : "Escribe tu correo o un mensaje…"
                }
                type={guestStep === "ask_password" ? "password" : "text"}
                autoComplete={guestStep === "ask_password" ? "current-password" : "email"}
                className="min-w-0 flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-sm py-xs font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
                disabled={busy}
                maxLength={200}
                aria-label="Mensaje al asistente"
              />
              <button
                type="submit"
                disabled={busy || draft.trim().length === 0}
                className="rounded-lg bg-primary p-2 text-on-primary disabled:opacity-50"
                aria-label="Enviar"
              >
                <MaterialIcon name="send" className="text-[20px]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
