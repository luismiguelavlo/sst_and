import type { Metadata } from "next";
import { AssistantLoginGate } from "@/components/assistant/AssistantLoginGate";
import { AssistantPublicChat } from "@/components/assistant/AssistantPublicChat";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Asistente · Campus SST",
  description: "Consulta cursos, certificados y asistencia desde el asistente de Campus SST.",
};

export default async function AssistantPublicPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-md py-lg">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute top-[60%] -right-[10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[80px]" />
        </div>
        <div className="relative z-10 w-full">
          <AssistantLoginGate />
        </div>
      </div>
    );
  }

  return <AssistantPublicChat userName={session.name} />;
}
