"use server";

import { handleAssistantIntent } from "@/lib/assistant/handlers";
import {
  isAssistantIntentId,
  matchIntentFromText,
  type AssistantIntentId,
  type AssistantReply,
} from "@/lib/assistant/intents";
import { requireAuth } from "@/lib/auth/guards";

export type AssistantActionResult =
  | { ok: true; reply: AssistantReply }
  | { ok: false; error: string };

export async function askAssistantIntentAction(
  intentId: string,
): Promise<AssistantActionResult> {
  const user = await requireAuth();
  if (!isAssistantIntentId(intentId)) {
    return { ok: false, error: "No reconozco esa consulta. Elige una opción sugerida." };
  }
  try {
    const reply = await handleAssistantIntent(intentId, user.id);
    return { ok: true, reply };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo obtener la respuesta.",
    };
  }
}

export async function askAssistantTextAction(text: string): Promise<AssistantActionResult> {
  const user = await requireAuth();
  const intentId: AssistantIntentId | null = matchIntentFromText(text);
  if (!intentId) {
    return {
      ok: true,
      reply: {
        intentId: "menu",
        text: "No entendí la consulta. Elige una de las opciones sugeridas para continuar.",
        actions: [],
      },
    };
  }
  try {
    const reply = await handleAssistantIntent(intentId, user.id);
    return { ok: true, reply };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo obtener la respuesta.",
    };
  }
}
