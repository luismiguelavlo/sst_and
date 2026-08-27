"use client";

import { useId, useState } from "react";
import { AssistantChatPanel } from "@/components/assistant/AssistantChatPanel";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export function CampusAssistant() {
  const panelId = useId();
  const [open, setOpen] = useState(false);

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
          <AssistantChatPanel variant="compact" onNavigateAway={() => setOpen(false)} />
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
