export const ASSISTANT_PUBLIC_PATH = "/assistant";

export function getAssistantPublicUrl(origin?: string): string {
  if (origin && origin.length > 0) {
    return `${origin.replace(/\/$/, "")}${ASSISTANT_PUBLIC_PATH}`;
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}${ASSISTANT_PUBLIC_PATH}`;
  }
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return `${fromEnv}${ASSISTANT_PUBLIC_PATH}`;
  }
  return ASSISTANT_PUBLIC_PATH;
}
