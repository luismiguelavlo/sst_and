"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  askAssistantIntentAction,
  askAssistantTextAction,
} from "@/lib/assistant/actions";
import {
  ASSISTANT_SUGGESTIONS,
  type AssistantAction,
  type AssistantIntentId,
} from "@/lib/assistant/intents";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  actions?: readonly AssistantAction[];
};

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hola. Soy el asistente de Campus SST. Puedo decirte qué cursos te faltan, cuáles tienes en progreso, tus certificados o si hay asistencia pendiente. Elige una pregunta:",
  actions: [],
};

function intentFromHref(href: string): AssistantIntentId | null {
  if (!href.startsWith("#intent:")) {
    return null;
  }
  const id = href.slice("#intent:".length);
  if (
    id === "pending_courses" ||
    id === "in_progress_courses" ||
    id === "list_certificates" ||
    id === "pending_attendance" ||
    id === "howto_complete_course" ||
    id === "menu"
  ) {
    return id;
  }
  return null;
}

export function CampusAssistant() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const node = listRef.current;
    if (!node) {
      return;
    }
    node.scrollTop = node.scrollHeight;
  }, [messages, open, busy]);

  const pushAssistant = useCallback((text: string, actions: readonly AssistantAction[] = []) => {
    setMessages((current) => [
      ...current,
      {
        id: `a-${Date.now()}-${current.length}`,
        role: "assistant",
        text,
        actions,
      },
    ]);
  }, []);

  const runIntent = useCallback(
    async (intentId: AssistantIntentId, userLabel?: string) => {
      if (busy) {
        return;
      }
      setBusy(true);
      if (userLabel) {
        setMessages((current) => [
          ...current,
          { id: `u-${Date.now()}-${current.length}`, role: "user", text: userLabel },
        ]);
      }
      const result = await askAssistantIntentAction(intentId);
      setBusy(false);
      if (!result.ok) {
        pushAssistant(result.error);
        return;
      }
      pushAssistant(result.reply.text, result.reply.actions);
    },
    [busy, pushAssistant],
  );

  async function onSubmitText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (text.length === 0 || busy) {
      return;
    }
    setDraft("");
    setBusy(true);
    setMessages((current) => [
      ...current,
      { id: `u-${Date.now()}-${current.length}`, role: "user", text },
    ]);
    const result = await askAssistantTextAction(text);
    setBusy(false);
    if (!result.ok) {
      pushAssistant(result.error);
      return;
    }
    pushAssistant(result.reply.text, result.reply.actions);
  }

  function onActionClick(action: AssistantAction) {
    const intent = intentFromHref(action.href);
    if (intent) {
      void runIntent(intent, action.label);
      return;
    }
    setOpen(false);
  }

  return (
    <div className="pointer-events-none fixed right-sm bottom-sm z-50 flex flex-col items-end gap-sm sm:right-md sm:bottom-md">
      {open ? (
        <section
          id={panelId}
          className="pointer-events-auto flex h-[min(560px,72vh)] w-[min(100vw-1.5rem,380px)] flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-2xl"
          aria-label="Asistente Campus SST"
        >
          <header className="flex items-center justify-between gap-sm bg-primary px-md py-sm text-on-primary">
            <div className="min-w-0">
              <p className="font-label-md">Asistente Campus SST</p>
              <p className="truncate font-body-sm text-on-primary/80">
                Cursos, certificados y asistencia
              </p>
            </div>
            <button
              type="button"
              className="rounded-full p-2 hover:bg-on-primary/10"
              aria-label="Cerrar asistente"
              onClick={() => setOpen(false)}
            >
              <MaterialIcon name="close" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-sm overflow-y-auto bg-surface px-sm py-sm">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[90%] rounded-2xl rounded-br-md bg-primary px-sm py-xs font-body-sm whitespace-pre-wrap text-on-primary"
                      : "max-w-[95%] rounded-2xl rounded-bl-md bg-surface-container-high px-sm py-xs font-body-sm whitespace-pre-wrap text-on-surface"
                  }
                >
                  {message.text}
                  {message.actions && message.actions.length > 0 ? (
                    <div className="mt-xs flex flex-col gap-xs">
                      {message.actions.map((action) => {
                        const intent = intentFromHref(action.href);
                        if (intent) {
                          return (
                            <button
                              key={`${message.id}-${action.label}-${action.href}`}
                              type="button"
                              disabled={busy}
                              className="rounded-lg bg-surface-container-lowest px-sm py-xs text-left font-label-sm text-primary hover:bg-primary/10 disabled:opacity-50"
                              onClick={() => onActionClick(action)}
                            >
                              {action.label}
                            </button>
                          );
                        }
                        return (
                          <Link
                            key={`${message.id}-${action.label}-${action.href}`}
                            href={action.href}
                            className="rounded-lg bg-surface-container-lowest px-sm py-xs font-label-sm text-primary hover:bg-primary/10"
                            onClick={() => onActionClick(action)}
                          >
                            {action.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {busy ? (
              <p className="font-body-sm text-on-surface-variant">Consultando…</p>
            ) : null}
          </div>

          <div className="border-t border-outline-variant/20 bg-surface-container-low px-sm py-sm">
            <div className="mb-xs flex flex-wrap gap-xs">
              {ASSISTANT_SUGGESTIONS.map((item) => (
                <button
                  key={item.intentId}
                  type="button"
                  disabled={busy}
                  className="rounded-full bg-surface-container-highest px-sm py-1 font-label-sm text-on-surface transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                  onClick={() => {
                    void runIntent(item.intentId, item.label);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <form className="flex items-center gap-xs" onSubmit={onSubmitText}>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Escribe o elige una opción…"
                className="min-w-0 flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-sm py-xs font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
                disabled={busy}
                maxLength={200}
                aria-label="Escribir consulta al asistente"
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
        </section>
      ) : null}

      <button
        type="button"
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl transition-transform hover:scale-105 hover:bg-primary-container"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente Campus SST"}
        onClick={() => setOpen((value) => !value)}
      >
        <MaterialIcon name={open ? "close" : "chat"} filled />
      </button>
    </div>
  );
}
