import type { Metadata } from "next";
import { AssistantPublicChat } from "@/components/assistant/AssistantPublicChat";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Asistente · Campus SST",
  description: "Consulta cursos, certificados y asistencia desde el asistente de Campus SST.",
};

export default async function AssistantPublicPage() {
  const session = await getSession();
  return <AssistantPublicChat initialUserName={session?.name ?? null} />;
}
