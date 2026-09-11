"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import { deleteEmoAction, saveEmoAction } from "@/lib/sg-sst/emos/actions";
import {
  EMO_CONCEPT_LABELS,
  EMO_CONCEPTS,
  EMO_EXAM_TYPE_LABELS,
  EMO_EXAM_TYPES,
  EMO_PERIODICITY_MONTHS,
  addMonthsIso,
  emptyEmoDraft,
  type EmoConcept,
  type EmoExamType,
  type EmoPeriodicity,
  type SstEmo,
  type SstEmoDraft,
} from "@/lib/sg-sst/emos/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type EmoFormScreenProps = {
  workers: SstWorker[];
  emo: SstEmo | null;
  history: SstEmo[];
};

function toDraft(emo: SstEmo | null): SstEmoDraft {
  if (!emo) return emptyEmoDraft();
  return {
    id: emo.id,
    workerId: emo.workerId,
    examType: emo.examType,
    examDate: emo.examDate,
    nextDueDate: emo.nextDueDate ?? "",
    periodicityMonths: emo.periodicityMonths,
    ips: emo.ips,
    concept: emo.concept,
    adminObservations: emo.adminObservations,
    evidenceUrl: emo.evidenceUrl,
    evidenceName: emo.evidenceName,
    heightsCleared: emo.heightsCleared,
    pesvCleared: emo.pesvCleared,
    chemicalsCleared: emo.chemicalsCleared,
    notifySupervisor: emo.notifySupervisor,
  };
}

export function EmoFormScreen({ workers, emo, history }: Readonly<EmoFormScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<SstEmoDraft>(() => toDraft(emo));

  const worker = useMemo(
    () => workers.find((item) => item.id === draft.workerId) ?? null,
    [workers, draft.workerId],
  );

  const computedNext =
    draft.examType !== "egreso" && draft.periodicityMonths && draft.examDate
      ? addMonthsIso(draft.examDate, draft.periodicityMonths)
      : "";

  function patch<K extends keyof SstEmoDraft>(key: K, value: SstEmoDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    startTransition(async () => {
      const payload: SstEmoDraft = {
        ...draft,
        nextDueDate:
          draft.nextDueDate?.trim() ||
          (draft.examType === "egreso" ? null : computedNext || null),
      };
      const result = await saveEmoAction(payload);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(draft.id ? "EMO actualizado." : "EMO registrado.");
      router.push(`${SGSST_BASE}/examenes-medicos-ocupacionales/${result.id}`);
      router.refresh();
    });
  }

  function remove() {
    if (!draft.id) return;
    if (!window.confirm("¿Eliminar este EMO? También se quitará del radar de alertas.")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteEmoAction(draft.id!);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("EMO eliminado.");
      router.push(`${SGSST_BASE}/examenes-medicos-ocupacionales`);
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <Link
              href={`${SGSST_BASE}/examenes-medicos-ocupacionales`}
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              <MaterialIcon name="stethoscope" className="text-[16px]" />
              EMOs
            </Link>
            <MaterialIcon name="chevron_right" className="text-[14px]" />
            <span className="font-semibold text-primary">
              {draft.id ? emo?.folio ?? "Ficha" : "Nuevo registro"}
            </span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
            Registro de Examen Médico Ocupacional
          </h1>
          <p className="max-w-3xl font-body-sm text-body-sm text-on-surface-variant">
            Captura administrativa de aptitud. No ingreses diagnósticos clínicos aquí.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <Link
            href={`${SGSST_BASE}/examenes-medicos-ocupacionales`}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-4 py-2 font-label-md text-label-md text-primary shadow-sm"
          >
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Volver
          </Link>
          {draft.id ? (
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-lg bg-error-container px-4 py-2 font-label-md text-label-md text-on-error-container disabled:opacity-60"
            >
              <MaterialIcon name="delete" className="text-[18px]" />
              Eliminar
            </button>
          ) : null}
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-label-md text-label-md text-on-primary shadow-md disabled:opacity-60"
          >
            <MaterialIcon name="save" className="text-[18px]" />
            {pending ? "Guardando..." : "Guardar EMO"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-12">
        <div className="space-y-md xl:col-span-8">
          <Section letter="A" title="Trabajador" subtitle="Desde la base maestra (sin duplicar)">
            <label className="flex flex-col gap-1">
              <span className="font-label-md text-label-md">
                Trabajador <span className="text-error">*</span>
              </span>
              <WorkerSelect
                workers={workers}
                value={draft.workerId}
                includeRetired
                onChange={(selected) => patch("workerId", selected?.id ?? "")}
              />
            </label>
            {worker ? (
              <dl className="mt-sm grid grid-cols-1 gap-2 rounded-lg bg-surface-container-low p-sm font-body-sm text-body-sm sm:grid-cols-2">
                <Row label="Empresa" value={worker.company} />
                <Row label="Cargo" value={worker.jobTitle} />
                <Row label="Finca" value={worker.farmName ?? "—"} />
                <Row label="Riesgo ARL" value={`Nivel ${worker.riskLevel}`} />
                <Row
                  label="Habilitaciones"
                  value={[
                    worker.worksHeights ? "Alturas" : null,
                    worker.drives || worker.operatesTractor ? "PESV/Maq." : null,
                    worker.handlesChemicals ? "Químicos" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Ninguna marcada"}
                />
              </dl>
            ) : null}
          </Section>

          <Section letter="B" title="Evaluación" subtitle="Tipo, fechas e IPS">
            <div className="grid grid-cols-1 gap-base md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">
                  Tipo de examen <span className="text-error">*</span>
                </span>
                <select
                  className="rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.examType}
                  onChange={(event) =>
                    patch("examType", event.target.value as EmoExamType)
                  }
                >
                  {EMO_EXAM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {EMO_EXAM_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">
                  Fecha del examen <span className="text-error">*</span>
                </span>
                <input
                  type="date"
                  className="rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.examDate}
                  onChange={(event) => patch("examDate", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">Periodicidad (meses)</span>
                <select
                  className="rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.periodicityMonths ?? ""}
                  disabled={draft.examType === "egreso"}
                  onChange={(event) =>
                    patch(
                      "periodicityMonths",
                      event.target.value
                        ? (Number(event.target.value) as EmoPeriodicity)
                        : null,
                    )
                  }
                >
                  <option value="">Sin periodicidad</option>
                  {EMO_PERIODICITY_MONTHS.map((months) => (
                    <option key={months} value={months}>
                      {months} meses
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-label-md text-label-md">Próxima fecha</span>
                <input
                  type="date"
                  className="rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.nextDueDate ?? ""}
                  disabled={draft.examType === "egreso"}
                  placeholder={computedNext}
                  onChange={(event) => patch("nextDueDate", event.target.value || null)}
                />
                {draft.examType !== "egreso" && !draft.nextDueDate && computedNext ? (
                  <span className="text-[11px] text-on-surface-variant">
                    Se calculará: {computedNext}
                  </span>
                ) : null}
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="font-label-md text-label-md">
                  IPS <span className="text-error">*</span>
                </span>
                <input
                  className="rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.ips}
                  onChange={(event) => patch("ips", event.target.value)}
                  placeholder="Ej. IPS Salud del Eje"
                />
              </label>
            </div>
          </Section>

          <Section letter="C" title="Concepto de aptitud" subtitle="Resultado administrativo">
            <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
              {EMO_CONCEPTS.map((item) => (
                <label
                  key={item}
                  className={`flex cursor-pointer items-center gap-sm rounded-lg border px-sm py-sm ${
                    draft.concept === item
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-surface-container-low"
                  }`}
                >
                  <input
                    type="radio"
                    name="concept"
                    checked={draft.concept === item}
                    onChange={() => patch("concept", item as EmoConcept)}
                  />
                  <span className="font-label-md text-label-md">{EMO_CONCEPT_LABELS[item]}</span>
                </label>
              ))}
            </div>
            <div className="mt-sm grid grid-cols-1 gap-sm sm:grid-cols-3">
              <TriState
                label="Aptitud alturas"
                value={draft.heightsCleared ?? null}
                onChange={(value) => patch("heightsCleared", value)}
              />
              <TriState
                label="Aptitud PESV / maquinaria"
                value={draft.pesvCleared ?? null}
                onChange={(value) => patch("pesvCleared", value)}
              />
              <TriState
                label="Aptitud químicos"
                value={draft.chemicalsCleared ?? null}
                onChange={(value) => patch("chemicalsCleared", value)}
              />
            </div>
          </Section>

          <Section
            letter="D"
            title="Observaciones administrativas"
            subtitle="Recomendaciones laborales (sin clínica)"
          >
            <textarea
              className="min-h-28 w-full rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
              value={draft.adminObservations}
              onChange={(event) => patch("adminObservations", event.target.value)}
              placeholder="Ej. Usar EPP auditivo en planta; reubicar temporalmente de alturas..."
            />
            <label className="mt-sm flex items-center gap-2 font-label-md text-label-md">
              <input
                type="checkbox"
                checked={draft.notifySupervisor ?? false}
                onChange={(event) => patch("notifySupervisor", event.target.checked)}
              />
              Notificar a jefatura / supervisor
            </label>
          </Section>

          <Section letter="E" title="Documento / evidencia" subtitle="Certificado de aptitud (URL)">
            <div className="grid grid-cols-1 gap-base md:grid-cols-2">
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="font-label-md text-label-md">URL del documento</span>
                <input
                  className="rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.evidenceUrl}
                  onChange={(event) => patch("evidenceUrl", event.target.value)}
                  placeholder="https://..."
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="font-label-md text-label-md">Nombre del archivo</span>
                <input
                  className="rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-body-sm"
                  value={draft.evidenceName}
                  onChange={(event) => patch("evidenceName", event.target.value)}
                  placeholder="Certificado_Aptitud_CC.pdf"
                />
              </label>
            </div>
          </Section>
        </div>

        <aside className="space-y-md xl:col-span-4">
          <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
            <h2 className="mb-sm font-headline-md text-headline-md">Historial del trabajador</h2>
            {history.length === 0 ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Sin EMOs previos en el sistema.
              </p>
            ) : (
              <ul className="space-y-2">
                {history.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`${SGSST_BASE}/examenes-medicos-ocupacionales/${item.id}`}
                      className={`block rounded-lg px-sm py-sm ${
                        item.id === draft.id
                          ? "bg-primary/10"
                          : "bg-surface-container-low hover:bg-surface-container"
                      }`}
                    >
                      <div className="font-label-md text-label-md font-semibold">
                        {EMO_EXAM_TYPE_LABELS[item.examType]} · {item.examDate}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        {EMO_CONCEPT_LABELS[item.concept]} · {item.ips}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl bg-primary/5 p-md">
            <div className="mb-xs flex items-center gap-2 font-label-md text-label-md font-bold text-primary">
              <MaterialIcon name="info" className="text-[18px]" />
              Semáforo
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              La próxima fecha alimenta el radar de Alertas SST (vencido / 1–30 / 31–60 / &gt;60).
              Egresos y no aptos se cierran en el flujo de alertas.
            </p>
          </div>
        </aside>
      </div>
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
          <h2 className="font-headline-md text-headline-md leading-tight">{title}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="text-[11px] text-on-surface-variant">{label}</dt>
      <dd className="font-semibold">{value || "—"}</dd>
    </div>
  );
}

function TriState({
  label,
  value,
  onChange,
}: Readonly<{
  label: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}>) {
  return (
    <label className="flex flex-col gap-1 rounded-lg bg-surface-container-low px-sm py-sm">
      <span className="font-label-sm text-label-sm">{label}</span>
      <select
        className="rounded-lg bg-surface-container-lowest px-2 py-1.5 font-body-sm text-body-sm"
        value={value === null ? "" : value ? "si" : "no"}
        onChange={(event) => {
          const v = event.target.value;
          onChange(v === "" ? null : v === "si");
        }}
      >
        <option value="">N/A</option>
        <option value="si">Apto / Sí</option>
        <option value="no">No</option>
      </select>
    </label>
  );
}
