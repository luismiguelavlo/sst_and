"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import { getAssistantPublicUrl } from "@/lib/assistant/paths";

export function ShareAssistantLinkButton({
  variant = "header",
}: Readonly<{
  variant?: "header" | "sidebar";
}>) {
  const { showToast } = useToast();

  async function copyLink() {
    const url = getAssistantPublicUrl();
    try {
      await navigator.clipboard.writeText(url);
      showToast("Enlace del asistente copiado. Ya puedes compartirlo.");
    } catch {
      showToast("No se pudo copiar. Copia manualmente: " + url, { variant: "error" });
    }
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={() => {
          void copyLink();
        }}
        className="flex w-full items-center gap-sm rounded-lg px-md py-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
      >
        <MaterialIcon name="share" />
        <span className="font-label-md">Compartir asistente</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        void copyLink();
      }}
      title="Copiar enlace del asistente público"
      aria-label="Copiar enlace del asistente público"
      className="inline-flex items-center gap-xs rounded-full bg-surface-container-high px-sm py-xs font-label-sm text-on-surface transition-colors hover:bg-primary/10 hover:text-primary"
    >
      <MaterialIcon name="share" className="text-[18px]" />
      <span className="hidden sm:inline">Compartir asistente</span>
    </button>
  );
}
