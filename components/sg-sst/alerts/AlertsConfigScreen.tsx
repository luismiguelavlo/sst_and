"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import {
  resetAlertThresholdsAction,
  saveAlertThresholdsAction,
} from "@/lib/sg-sst/alerts/actions";
import {
  DEFAULT_ALERT_THRESHOLDS,
  RECORD_TYPE_META,
  SST_RECORD_TYPES,
  type SstAlertThresholds,
  type SstRecordType,
} from "@/lib/sg-sst/alerts/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type AlertsConfigScreenProps = {
  settings: SstAlertThresholds;
};

export function AlertsConfigScreen({ settings }: Readonly<AlertsConfigScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [criticalMaxDays, setCriticalMaxDays] = useState(settings.criticalMaxDays);
  const [orangeMaxDays, setOrangeMaxDays] = useState(settings.orangeMaxDays);
  const [yellowMaxDays, setYellowMaxDays] = useState(settings.yellowMaxDays);
  const [useBusinessDays, setUseBusinessDays] = useState(settings.useBusinessDays);
  const [customMode, setCustomMode] = useState(
    Object.keys(settings.typeOverrides).length > 0,
  );
  const [overrides, setOverrides] = useState<SstAlertThresholds["typeOverrides"]>(
    settings.typeOverrides,
  );

  function save() {
    startTransition(async () => {
      const result = await saveAlertThresholdsAction({
        criticalMaxDays,
        orangeMaxDays,
        yellowMaxDays,
        useBusinessDays,
        typeOverrides: customMode ? overrides : {},
      });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Umbrales guardados. El radar recalculará las alertas.");
      router.refresh();
    });
  }

  function reset() {
    startTransition(async () => {
      const result = await resetAlertThresholdsAction();
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      setCriticalMaxDays(DEFAULT_ALERT_THRESHOLDS.criticalMaxDays);
      setOrangeMaxDays(DEFAULT_ALERT_THRESHOLDS.orangeMaxDays);
      setYellowMaxDays(DEFAULT_ALERT_THRESHOLDS.yellowMaxDays);
      setUseBusinessDays(false);
      setOverrides({});
      setCustomMode(false);
      showToast("Valores por defecto restablecidos.");
      router.refresh();
    });
  }

  function updateOverride(
    type: SstRecordType,
    field: "orangeMaxDays" | "yellowMaxDays",
    value: number,
  ) {
    setOverrides((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  }

  return (
    <div className="relative w-full overflow-hidden px-gutter pb-xl">
      <div className="pointer-events-none absolute -top-24 -right-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="flex flex-col justify-between gap-md pt-base xl:flex-row xl:items-end">
        <div className="max-w-3xl">
          <div className="mb-xs flex items-center gap-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-error-container px-2.5 py-0.5 font-label-sm text-label-sm tracking-wider text-on-error-container uppercase">
              <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
              Motor de Alertas v2.4
            </span>
            <Link
              href={`${SGSST_BASE}/alertas-sst`}
              className="font-label-sm text-label-sm text-outline hover:text-primary"
            >
              / Volver al radar
            </Link>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
            Configuración Paramétrica de Alertas y Semáforos SST
          </h1>
          <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
            Define los rangos temporales en días para la activación automática de alertas rojas,
            naranjas y amarillas por tipo de requerimiento.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-sm">
          <button
            type="button"
            disabled={pending}
            onClick={reset}
            className="flex items-center gap-xs rounded-lg bg-surface-container px-sm py-2 font-label-md text-label-md text-on-surface shadow-sm"
          >
            <MaterialIcon name="restart_alt" className="text-[18px]" />
            Restablecer Valores por Defecto
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="flex items-center gap-xs rounded-lg bg-primary px-md py-2 font-label-md text-label-md font-semibold text-on-primary shadow-md"
          >
            <MaterialIcon name="save" className="text-[18px]" />
            Guardar Cambios
          </button>
        </div>
      </div>

      <section className="mt-lg mb-lg rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <div className="flex flex-col justify-between gap-md pb-md lg:flex-row lg:items-center">
          <div className="flex items-center gap-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
              <MaterialIcon name="traffic" className="text-[24px]" />
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Arquitectura del Semáforo Preventivo
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Ejemplo: ≤{criticalMaxDays}d rojo · 1–{orangeMaxDays}d naranja ·{" "}
                {orangeMaxDays + 1}–{yellowMaxDays}d amarillo · &gt;{yellowMaxDays}d verde
              </p>
            </div>
          </div>
          <div className="flex items-center gap-sm rounded-lg bg-surface-container-low p-1.5">
            <button
              type="button"
              onClick={() => setCustomMode(false)}
              className={
                !customMode
                  ? "rounded bg-surface-container-lowest px-sm py-1 font-label-sm text-label-sm font-semibold text-primary shadow-sm"
                  : "rounded px-sm py-1 font-label-sm text-label-sm text-on-surface-variant"
              }
            >
              Regla global
            </button>
            <button
              type="button"
              onClick={() => setCustomMode(true)}
              className={
                customMode
                  ? "rounded bg-surface-container-lowest px-sm py-1 font-label-sm text-label-sm font-semibold text-primary shadow-sm"
                  : "rounded px-sm py-1 font-label-sm text-label-sm text-on-surface-variant"
              }
            >
              Personalizado por módulo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-md pt-base md:grid-cols-2 xl:grid-cols-4">
          <ThresholdPreview
            color="bg-error"
            title="Nivel Crítico"
            range={`≤ ${criticalMaxDays}d`}
            subtitle="Vencido / Expirado"
          />
          <ThresholdPreview
            color="bg-amber-500"
            title="Alerta Alta"
            range={`1 - ${orangeMaxDays}d`}
            subtitle="Próximo a Vencer"
          />
          <ThresholdPreview
            color="bg-yellow-500"
            title="Preventivo"
            range={`${orangeMaxDays + 1} - ${yellowMaxDays}d`}
            subtitle="Seguimiento Activo"
          />
          <ThresholdPreview
            color="bg-secondary"
            title="Conforme"
            range={`> ${yellowMaxDays}d`}
            subtitle="Vigente y Seguro"
          />
        </div>

        <div className="mt-md grid grid-cols-1 gap-sm md:grid-cols-4">
          <NumberField
            label="Crítico (máx días)"
            value={criticalMaxDays}
            onChange={setCriticalMaxDays}
          />
          <NumberField
            label="Naranja (máx días)"
            value={orangeMaxDays}
            onChange={setOrangeMaxDays}
          />
          <NumberField
            label="Amarillo (máx días)"
            value={yellowMaxDays}
            onChange={setYellowMaxDays}
          />
          <label className="flex items-end gap-sm rounded-lg bg-surface-container-low px-sm py-sm">
            <input
              type="checkbox"
              checked={useBusinessDays}
              onChange={(event) => setUseBusinessDays(event.target.checked)}
            />
            <span className="font-label-md text-label-md text-on-surface">
              Usar días hábiles (reserva)
            </span>
          </label>
        </div>
      </section>

      {customMode ? (
        <section className="mb-lg space-y-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Matriz Paramétrica por Tipología SST
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Sobrescribe naranja/amarillo por tipo de registro. El crítico global se mantiene.
          </p>
          <div className="flex flex-col gap-sm">
            {SST_RECORD_TYPES.map((type) => (
              <div
                key={type}
                className="rounded-xl bg-surface-container-lowest p-md shadow-sm"
              >
                <div className="mb-sm flex items-center gap-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
                    <MaterialIcon name={RECORD_TYPE_META[type].icon} className="text-[20px]" />
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface">
                      {RECORD_TYPE_META[type].label}
                    </h3>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      /sg-sst/{RECORD_TYPE_META[type].modulePath}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
                  <NumberField
                    label="Naranja (días)"
                    value={overrides[type]?.orangeMaxDays ?? orangeMaxDays}
                    onChange={(value) => updateOverride(type, "orangeMaxDays", value)}
                  />
                  <NumberField
                    label="Amarillo (días)"
                    value={overrides[type]?.yellowMaxDays ?? yellowMaxDays}
                    onChange={(value) => updateOverride(type, "yellowMaxDays", value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ThresholdPreview({
  color,
  title,
  range,
  subtitle,
}: Readonly<{ color: string; title: string; range: string; subtitle: string }>) {
  return (
    <div className="rounded-xl bg-surface-container-low p-md">
      <div className="mb-sm flex items-center gap-xs">
        <span className={`h-3.5 w-3.5 rounded-full ${color}`} />
        <span className="font-label-sm text-label-sm font-bold tracking-wide text-on-surface uppercase">
          {title}
        </span>
      </div>
      <div className="font-display-lg text-display-lg leading-none text-on-surface">{range}</div>
      <div className="mt-1 font-label-md text-label-md font-semibold text-on-surface">{subtitle}</div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: Readonly<{ label: string; value: number; onChange: (value: number) => void }>) {
  return (
    <label className="flex flex-col gap-xs">
      <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
      <input
        type="number"
        min={0}
        className="rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
