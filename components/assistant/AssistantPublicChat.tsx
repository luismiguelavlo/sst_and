"use client";

import { logoutFromAssistant } from "@/lib/auth/actions";
import { AssistantChatPanel } from "@/components/assistant/AssistantChatPanel";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export function AssistantPublicChat({
  userName,
}: Readonly<{
  userName: string;
}>) {
  return (
    <div className="flex h-[100dvh] min-h-screen flex-col bg-surface">
      <header className="flex shrink-0 items-center justify-between gap-sm border-b border-outline-variant/20 bg-primary px-md py-sm text-on-primary sm:px-lg">
        <div className="min-w-0">
          <p className="font-label-md">Asistente Campus SST</p>
          <p className="truncate font-body-sm text-on-primary/80">
            Cursos, certificados y asistencia
          </p>
        </div>
        <form action={logoutFromAssistant}>
          <button
            type="submit"
            className="inline-flex items-center gap-xs rounded-lg bg-on-primary/10 px-sm py-xs font-label-sm hover:bg-on-primary/20"
          >
            <MaterialIcon name="logout" className="text-[18px]" />
            Salir
          </button>
        </form>
      </header>
      <AssistantChatPanel variant="page" userName={userName} />
    </div>
  );
}
