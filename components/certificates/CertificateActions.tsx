"use client";

import { useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

type CertificateActionsProps = Readonly<{
  autoPrint?: boolean;
  code: string;
}>;

export function CertificateActions({ autoPrint = false, code }: CertificateActionsProps) {
  useEffect(() => {
    if (!autoPrint) {
      return;
    }
    const timer = window.setTimeout(() => {
      window.print();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [autoPrint]);

  return (
    <div className="certificate-actions print:hidden">
      <button
        type="button"
        className="inline-flex items-center justify-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90"
        onClick={() => window.print()}
      >
        <MaterialIcon name="print" className="text-[20px]" />
        Imprimir certificado
      </button>
      <p className="font-body-sm text-on-surface-variant">
        Usa el diálogo de impresión del navegador. Código: {code}
      </p>
    </div>
  );
}
