"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import {
  resetComplianceThresholdsAction,
  saveComplianceThresholdsAction,
} from "@/lib/sg-sst/cumplimiento/actions";
import {
  DEFAULT_COMPLIANCE_THRESHOLDS,
  type ComplianceThresholds,
} from "@/lib/sg-sst/cumplimiento/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type ComplianceConfigScreenProps = {
  thresholds: ComplianceThresholds;
};

export function ComplianceConfigScreen({
  thresholds,
}: Readonly<ComplianceConfigScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [greenMinPct, setGreenMinPct] = useState(thresholds.greenMinPct);
  const [yellowMinPct, setYellowMinPct] = useState(thresholds.yellowMinPct);

  function save() {
    startTransition(async () => {
      const result = await saveComplianceThresholdsAction({
        greenMinPct,
        yellowMinPct,
      });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Umbrales de cumplimiento guardados.");
      router.refresh();
    });
  }

  function reset() {
    startTransition(async () => {
      const result = await resetComplianceThresholdsAction();
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      setGreenMinPct(DEFAULT_COMPLIANCE_THRESHOLDS.greenMinPct);
      setYellowMinPct(DEFAULT_COMPLIANCE_THRESHOLDS.yellowMinPct);
      showToast("Valores por defecto restablecidos.");
      router.refresh();
    });
  }

  return (
    <div className="w-full px-gutter pb-xl pt-base">
      <div className="mb-md flex flex-col justify-between gap-md md:flex-row md:items-end">
        <div className="max-w-3xl">
          <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
            <MaterialIcon name="tune" className="text-[16px]" />
            Configuración SG-SST
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Umbrales de cumplimiento
          </h1>
          <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
            Define los porcentajes del semáforo en el dashboard principal. También
            puedes ajustar los umbrales temporales de alertas en Alertas SST.
          </p>
          <div className="mt-sm flex flex-wrap gap-sm">
            <Link
              href={SGSST_BASE}
              className="font-label-sm text-label-sm text-primary hover:underline"
            >
              ← Volver al dashboard
            </Link>
            <Link
              href={`${SGSST_BASE}/alertas-sst/configuracion`}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary"
            >
              Configuración de alertas →
            </Link>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-sm">
          <button
            type="button"
            disabled={pending}
            onClick={reset}
            className="flex items-center gap-xs rounded-lg bg-surface-container px-sm py-2 font-label-md text-label-md text-on-surface shadow-sm"
          >
            <MaterialIcon name="restart_alt" className="text-[18px]" />
            Restablecer
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="flex items-center gap-xs rounded-lg bg-primary px-md py-2 font-label-md text-label-md font-semibold text-on-primary shadow-md"
          >
            <MaterialIcon name="save" className="text-[18px]" />
            Guardar
          </button>
        </div>
      </div>

      <section className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Semáforo de cumplimiento
        </h2>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
          🟢 ≥ umbral verde · 🟡 entre amarillo y verde · 🔴 &lt; umbral amarillo
        </p>

        <div className="mt-md grid grid-cols-1 gap-md sm:grid-cols-3">
          <Preview
            color="bg-secondary"
            title="Verde"
            range={`≥ ${greenMinPct}%`}
          />
          <Preview
            color="bg-amber-500"
            title="Amarillo"
            range={`≥ ${yellowMinPct}% y < ${greenMinPct}%`}
          />
          <Preview
            color="bg-error"
            title="Rojo"
            range={`< ${yellowMinPct}%`}
          />
        </div>

        <div className="mt-md grid grid-cols-1 gap-sm md:grid-cols-2">
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Umbral verde (mínimo %)
            </span>
            <input
              type="number"
              min={1}
              max={100}
              step={0.1}
              value={greenMinPct}
              onChange={(e) => setGreenMinPct(Number(e.target.value))}
              className="rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm"
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Umbral amarillo (mínimo %)
            </span>
            <input
              type="number"
              min={0}
              max={99}
              step={0.1}
              value={yellowMinPct}
              onChange={(e) => setYellowMinPct(Number(e.target.value))}
              className="rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm"
            />
          </label>
        </div>
      </section>
    </div>
  );
}

function Preview({
  color,
  title,
  range,
}: Readonly<{ color: string; title: string; range: string }>) {
  return (
    <div className="rounded-xl bg-surface-container-low p-md">
      <div className="mb-sm flex items-center gap-xs">
        <span className={`h-3.5 w-3.5 rounded-full ${color}`} />
        <span className="font-label-sm text-label-sm font-bold uppercase tracking-wide text-on-surface">
          {title}
        </span>
      </div>
      <div className="font-headline-sm text-headline-sm font-semibold text-on-surface">
        {range}
      </div>
    </div>
  );
}
