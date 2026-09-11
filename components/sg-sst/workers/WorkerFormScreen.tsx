"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import { retireWorkerAction, saveWorkerAction } from "@/lib/sg-sst/workers/actions";
import {
  AREA_OPTIONS,
  COMPANY_OPTIONS,
  CONTRACT_TYPES,
  DOCUMENT_TYPES,
  RISK_LEVELS,
  WORK_CENTER_OPTIONS,
  emptyWorkerDraft,
  type DocumentType,
  type RiskLevel,
  type SstWorker,
  type SstWorkerDraft,
  type WorkerStatus,
} from "@/lib/sg-sst/workers/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type WorkerFormScreenProps = {
  farms: SstFarm[];
  worker: SstWorker | null;
};

function toDraft(worker: SstWorker | null): SstWorkerDraft {
  if (!worker) return emptyWorkerDraft();
  return {
    id: worker.id,
    workerCode: worker.workerCode,
    fullName: worker.fullName,
    documentType: worker.documentType,
    documentNumber: worker.documentNumber,
    company: worker.company,
    jobTitle: worker.jobTitle,
    area: worker.area,
    workCenter: worker.workCenter,
    farmId: worker.farmId,
    supervisorName: worker.supervisorName,
    hireDate: worker.hireDate ?? "",
    contractType: worker.contractType,
    status: worker.status,
    riskLevel: worker.riskLevel,
    worksHeights: worker.worksHeights,
    drives: worker.drives,
    operatesTractor: worker.operatesTractor,
    handlesChemicals: worker.handlesChemicals,
    inBrigade: worker.inBrigade,
    inCopasst: worker.inCopasst,
    inCcl: worker.inCcl,
    phone: worker.phone,
    email: worker.email,
    observations: worker.observations,
    retirementDate: worker.retirementDate,
    retirementReason: worker.retirementReason,
  };
}

export function WorkerFormScreen({ farms, worker }: Readonly<WorkerFormScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<SstWorkerDraft>(() => toDraft(worker));
  const [showRetire, setShowRetire] = useState(false);
  const [retireDate, setRetireDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [retireReason, setRetireReason] = useState("");

  function patch<K extends keyof SstWorkerDraft>(key: K, value: SstWorkerDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    startTransition(async () => {
      const result = await saveWorkerAction(draft);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(draft.id ? "Trabajador actualizado y sincronizado." : "Trabajador creado.");
      router.push(`${SGSST_BASE}/trabajadores/${result.id}`);
      router.refresh();
    });
  }

  function confirmRetire() {
    if (!draft.id) return;
    startTransition(async () => {
      const result = await retireWorkerAction({
        id: draft.id!,
        retirementDate: retireDate,
        retirementReason: retireReason,
      });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Trabajador marcado como Retirado. Historial conservado.");
      setShowRetire(false);
      setDraft((prev) => ({
        ...prev,
        status: "retirado",
        retirementDate: retireDate,
        retirementReason: retireReason,
      }));
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <Link
              href={`${SGSST_BASE}/trabajadores`}
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              <MaterialIcon name="group" className="text-[16px]" />
              Base Maestra de Trabajadores
            </Link>
            <MaterialIcon name="chevron_right" className="text-[14px]" />
            <span className="font-semibold text-primary">
              {draft.id ? "Ficha del colaborador" : "Alta de colaborador"}
            </span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
            Registro y Ficha Integral del Trabajador
          </h1>
          <p className="max-w-4xl font-body-sm text-body-sm text-on-surface-variant">
            Formulario maestro. Los datos alimentan Alturas, EPP, Exámenes, Comités e
            Investigaciones mediante listas desplegables (sin duplicar nombres).
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <Link
            href={`${SGSST_BASE}/trabajadores`}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-4 py-2 font-label-md text-label-md text-primary shadow-sm"
          >
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Volver al listado
          </Link>
          {draft.id && draft.status === "activo" ? (
            <button
              type="button"
              onClick={() => setShowRetire(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-error-container px-4 py-2 font-label-md text-label-md text-on-error-container"
            >
              <MaterialIcon name="person_off" className="text-[18px]" />
              Retirar
            </button>
          ) : null}
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-label-md text-label-md text-on-primary shadow-md disabled:opacity-60"
          >
            <MaterialIcon name="how_to_reg" className="text-[18px]" />
            {pending ? "Guardando..." : "Guardar y sincronizar"}
          </button>
        </div>
      </header>

      <div className="flex items-start gap-sm rounded-xl bg-surface-container-low p-sm shadow-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
          <MaterialIcon name="sync" className="text-[20px]" />
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          <span className="font-bold text-primary">Arquitectura centralizada:</span> modificar
          habilitaciones aquí actualiza las planillas de campo y las alertas tempranas. El retiro
          conserva el historial (custodia documental).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-12">
        <div className="space-y-md xl:col-span-7">
          <Section
            letter="A"
            title="Identificación y contratación"
            subtitle="Datos formales y estructura organizacional"
          >
            <div className="grid grid-cols-1 gap-base md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">
                  ID trabajador <span className="text-error">*</span>
                </span>
                <div className="relative">
                  <input
                    className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                    value={draft.workerCode ?? ""}
                    placeholder="Se asigna automáticamente"
                    onChange={(event) => patch("workerCode", event.target.value)}
                  />
                  <span className="absolute top-2.5 right-3 text-[11px] text-on-surface-variant/50">
                    AUTO
                  </span>
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">
                  Identificación <span className="text-error">*</span>
                </span>
                <div className="flex gap-2">
                  <select
                    className="w-24 rounded-lg bg-surface-container-low px-2 py-2 font-body-sm text-body-sm"
                    value={draft.documentType}
                    onChange={(event) =>
                      patch("documentType", event.target.value as DocumentType)
                    }
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    className="flex-1 rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                    value={draft.documentNumber}
                    onChange={(event) => patch("documentNumber", event.target.value)}
                  />
                </div>
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="font-label-md text-label-md">
                  Nombre completo <span className="text-error">*</span>
                </span>
                <input
                  className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.fullName}
                  onChange={(event) => patch("fullName", event.target.value)}
                />
              </label>
              <SelectField
                label="Empresa"
                value={draft.company}
                options={[...COMPANY_OPTIONS]}
                allowCustom
                onChange={(value) => patch("company", value)}
              />
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">
                  Cargo <span className="text-error">*</span>
                </span>
                <input
                  className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.jobTitle}
                  onChange={(event) => patch("jobTitle", event.target.value)}
                />
              </label>
              <SelectField
                label="Área"
                value={draft.area}
                options={[...AREA_OPTIONS]}
                allowCustom
                onChange={(value) => patch("area", value)}
              />
              <SelectField
                label="Centro de trabajo"
                value={draft.workCenter}
                options={[...WORK_CENTER_OPTIONS]}
                allowCustom
                onChange={(value) => patch("workCenter", value)}
              />
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">Finca</span>
                <select
                  className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.farmId ?? ""}
                  onChange={(event) => patch("farmId", event.target.value || null)}
                >
                  <option value="">Sin finca</option>
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">Jefe inmediato</span>
                <input
                  className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.supervisorName}
                  onChange={(event) => patch("supervisorName", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">Fecha de ingreso</span>
                <input
                  type="date"
                  className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.hireDate ?? ""}
                  onChange={(event) => patch("hireDate", event.target.value || null)}
                />
              </label>
              <SelectField
                label="Tipo de contrato"
                value={draft.contractType}
                options={[...CONTRACT_TYPES]}
                allowCustom
                onChange={(value) => patch("contractType", value)}
              />
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">Estado</span>
                <select
                  className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.status}
                  onChange={(event) => patch("status", event.target.value as WorkerStatus)}
                >
                  <option value="activo">Activo</option>
                  <option value="retirado">Retirado</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">Nivel de riesgo</span>
                <select
                  className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.riskLevel}
                  onChange={(event) =>
                    patch("riskLevel", Number(event.target.value) as RiskLevel)
                  }
                >
                  {RISK_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      Nivel {level}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </Section>

          <Section
            letter="B"
            title="Habilitaciones y pertenencias"
            subtitle="Alimentan filtros y alertas de módulos críticos"
          >
            <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
              <Toggle
                label="Trabajo en alturas"
                checked={draft.worksHeights}
                onChange={(value) => patch("worksHeights", value)}
              />
              <Toggle
                label="Conduce"
                checked={draft.drives}
                onChange={(value) => patch("drives", value)}
              />
              <Toggle
                label="Opera tractor"
                checked={draft.operatesTractor}
                onChange={(value) => patch("operatesTractor", value)}
              />
              <Toggle
                label="Manipula químicos"
                checked={draft.handlesChemicals}
                onChange={(value) => patch("handlesChemicals", value)}
              />
              <Toggle
                label="Pertenece a brigada"
                checked={draft.inBrigade}
                onChange={(value) => patch("inBrigade", value)}
              />
              <Toggle
                label="Pertenece a COPASST"
                checked={draft.inCopasst}
                onChange={(value) => patch("inCopasst", value)}
              />
              <Toggle
                label="Pertenece a CCL"
                checked={draft.inCcl}
                onChange={(value) => patch("inCcl", value)}
              />
            </div>
          </Section>

          <Section letter="C" title="Contacto y observaciones" subtitle="Canales y notas internas">
            <div className="grid grid-cols-1 gap-base md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">Teléfono</span>
                <input
                  className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.phone}
                  onChange={(event) => patch("phone", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">Correo</span>
                <input
                  type="email"
                  className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.email}
                  onChange={(event) => patch("email", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="font-label-md text-label-md">Observaciones</span>
                <textarea
                  className="min-h-28 w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.observations}
                  onChange={(event) => patch("observations", event.target.value)}
                />
              </label>
              {draft.status === "retirado" ? (
                <>
                  <label className="flex flex-col gap-1">
                    <span className="font-label-md text-label-md">Fecha de retiro</span>
                    <input
                      type="date"
                      className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                      value={draft.retirementDate ?? ""}
                      onChange={(event) =>
                        patch("retirementDate", event.target.value || null)
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-label-md text-label-md">Motivo de retiro</span>
                    <input
                      className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                      value={draft.retirementReason ?? ""}
                      onChange={(event) => patch("retirementReason", event.target.value)}
                    />
                  </label>
                </>
              ) : null}
            </div>
          </Section>
        </div>

        <aside className="space-y-md xl:col-span-5">
          <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
            <h2 className="mb-sm font-headline-md text-headline-md text-on-surface">
              Vista rápida
            </h2>
            <dl className="space-y-2 font-body-sm text-body-sm">
              <Row label="Estado" value={draft.status === "activo" ? "Activo" : "Retirado"} />
              <Row label="ID" value={draft.workerCode || "Automático al guardar"} />
              <Row label="Documento" value={`${draft.documentType} ${draft.documentNumber}`} />
              <Row label="Cargo" value={draft.jobTitle || "—"} />
              <Row
                label="Finca"
                value={farms.find((f) => f.id === draft.farmId)?.name ?? "—"}
              />
              <Row label="Riesgo" value={`Nivel ${draft.riskLevel}`} />
            </dl>
          </div>
          <div className="rounded-xl bg-primary/5 p-md">
            <div className="mb-xs flex items-center gap-2 font-label-md text-label-md font-bold text-primary">
              <MaterialIcon name="info" className="text-[18px]" />
              No duplicidad
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              En los demás módulos elige este trabajador desde el desplegable. No escribas el
              nombre a mano. Si se retira, el historial médico y de formación permanece
              vinculado.
            </p>
            <Link
              href={`${SGSST_BASE}/trabajadores`}
              className="mt-sm inline-flex items-center gap-1 font-label-md text-label-md text-primary underline"
            >
              Ir a la base maestra
              <MaterialIcon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
        </aside>
      </div>

      {showRetire ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
          <div className="w-full max-w-md rounded-xl bg-surface-container-lowest p-md shadow-lg">
            <h3 className="font-headline-md text-headline-md">Retirar trabajador</h3>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
              Se marcará como Retirado. El historial se conserva; no aparece en listas de nuevos
              registros.
            </p>
            <label className="mt-sm flex flex-col gap-1">
              <span className="font-label-sm text-label-sm">Fecha de retiro</span>
              <input
                type="date"
                className="rounded-lg bg-surface-container-low px-sm py-sm"
                value={retireDate}
                onChange={(event) => setRetireDate(event.target.value)}
              />
            </label>
            <label className="mt-sm flex flex-col gap-1">
              <span className="font-label-sm text-label-sm">Motivo</span>
              <textarea
                className="min-h-20 rounded-lg bg-surface-container-low px-sm py-sm"
                value={retireReason}
                onChange={(event) => setRetireReason(event.target.value)}
              />
            </label>
            <div className="mt-md flex justify-end gap-sm">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-base py-sm"
                onClick={() => setShowRetire(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                className="rounded-lg bg-error px-base py-sm font-semibold text-on-error disabled:opacity-60"
                onClick={confirmRetire}
              >
                Confirmar retiro
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Section({
  letter,
  title,
  subtitle,
  children,
}: Readonly<{
  letter: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="space-y-md rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="flex items-center gap-sm">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-label-sm font-bold text-primary">
          {letter}
        </span>
        <div>
          <h2 className="font-headline-md text-headline-md leading-tight text-on-surface">
            {title}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function SelectField({
  label,
  value,
  options,
  allowCustom,
  onChange,
}: Readonly<{
  label: string;
  value: string;
  options: string[];
  allowCustom?: boolean;
  onChange: (value: string) => void;
}>) {
  const known = options.includes(value);
  return (
    <label className="flex flex-col gap-1">
      <span className="font-label-md text-label-md">{label}</span>
      {allowCustom && !known && value ? (
        <input
          className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <select
          className="w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
          value={known ? value : options[0]}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: Readonly<{ label: string; checked: boolean; onChange: (value: boolean) => void }>) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-sm rounded-lg bg-surface-container-low px-sm py-sm">
      <span className="font-label-md text-label-md">{label}</span>
      <input
        type="checkbox"
        className="h-4 w-4 accent-primary"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function Row({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex justify-between gap-sm border-b border-surface-container py-1">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="text-right font-semibold text-on-surface">{value || "—"}</dd>
    </div>
  );
}
