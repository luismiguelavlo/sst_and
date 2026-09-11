"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SemaphoreBadge } from "@/components/sg-sst/alerts/SemaphoreBadge";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm, SstSemaphoreLevel } from "@/lib/sg-sst/alerts/types";
import { bulkImportEmosAction } from "@/lib/sg-sst/emos/actions";
import {
  downloadEmosExcel,
  downloadEmosTemplate,
  parseEmosExcelFile,
} from "@/lib/sg-sst/emos/excel-client";
import { EMO_EXCEL_MAX_ROWS, type EmoExcelImportRow } from "@/lib/sg-sst/emos/excel";
import {
  EMO_CONCEPT_LABELS,
  EMO_EXAM_TYPE_LABELS,
  EMO_CONCEPTS,
  EMO_EXAM_TYPES,
  type EmoConcept,
  type EmoExamType,
  type EmoStats,
  type SstEmoView,
} from "@/lib/sg-sst/emos/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type EmOsMasterScreenProps = {
  emos: SstEmoView[];
  stats: EmoStats;
  farms: SstFarm[];
  workerCensus: number;
};

const SEM_FILTERS: { id: SstSemaphoreLevel | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "critico", label: "Vencidos" },
  { id: "proximo", label: "1–30 d" },
  { id: "seguimiento", label: "31–60 d" },
  { id: "vigente", label: ">60 d" },
];

export function EmOsMasterScreen({
  emos,
  stats,
  farms,
  workerCensus,
}: Readonly<EmOsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [semaphore, setSemaphore] = useState<SstSemaphoreLevel | "all">("all");
  const [examType, setExamType] = useState<EmoExamType | "all">("all");
  const [concept, setConcept] = useState<EmoConcept | "all">("all");
  const [farmId, setFarmId] = useState("all");
  const [preview, setPreview] = useState<EmoExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return emos.filter((emo) => {
      if (semaphore !== "all" && emo.semaphore !== semaphore) return false;
      if (examType !== "all" && emo.examType !== examType) return false;
      if (concept !== "all" && emo.concept !== concept) return false;
      if (farmId !== "all" && emo.farmId !== farmId) return false;
      if (!q) return true;
      return (
        emo.workerName.toLowerCase().includes(q) ||
        emo.workerDocument.toLowerCase().includes(q) ||
        emo.workerCode.toLowerCase().includes(q) ||
        emo.folio.toLowerCase().includes(q) ||
        emo.ips.toLowerCase().includes(q)
      );
    });
  }, [emos, semaphore, examType, concept, farmId, query]);

  const coverage =
    workerCensus > 0 ? Math.round((stats.workersCovered / workerCensus) * 100) : 0;

  function handleExport() {
    downloadEmosExcel(
      filtered,
      `emos-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} EMOs.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseEmosExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > EMO_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${EMO_EXCEL_MAX_ROWS} filas.`, { variant: "error" });
        return;
      }
      setFileName(file.name);
      setPreview(rows);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "No se pudo leer el Excel.", {
        variant: "error",
      });
    } finally {
      event.target.value = "";
    }
  }

  function confirmImport() {
    startTransition(async () => {
      const result = await bulkImportEmosAction({ rows: preview });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        `Importación: ${result.created} creados, ${result.updated} actualizados, ${result.failed} con error.`,
        { variant: result.failed > 0 ? "info" : "success" },
      );
      setPreview([]);
      setFileName("");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="stethoscope" className="text-[16px] text-primary" />
            <span>Exámenes médicos ocupacionales</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Matriz de EMOs y Semáforo de Vencimientos
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Solo certificado de aptitud y recomendaciones administrativas. Sin datos clínicos
            sensibles en el dashboard (Res. 2346 / custodia IPS).
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadEmosTemplate()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="table_view" className="text-[18px]" />
            Plantilla
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="upload_file" className="text-[18px]" />
            Importar Excel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-primary"
          >
            <MaterialIcon name="download" className="text-[18px]" />
            Exportar Excel
          </button>
          <Link
            href={`${SGSST_BASE}/examenes-medicos-ocupacionales/nuevo`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm"
          >
            <MaterialIcon name="add" className="text-[20px]" />
            Registrar EMO
          </Link>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </header>

      <div className="flex items-start gap-sm rounded-xl bg-surface-container-low p-md shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
          <MaterialIcon name="privacy_tip" className="text-[22px]" />
        </div>
        <div>
          <div className="font-label-md text-label-md font-bold text-primary">
            Privacidad clínica
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Este módulo muestra aptitud laboral administrativa (concepto, vencimiento, IPS,
            evidencias de certificado). Diagnósticos, CIE-10 e historia clínica permanecen en la
            IPS.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-sm sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Censo / Cobertura"
          value={`${stats.workersCovered}/${workerCensus}`}
          detail={`${coverage}% trabajadores con EMO registrado`}
          icon="groups"
        />
        <Kpi
          label="Semáforo — Vencidos"
          value={stats.bySemaphore.critico}
          detail="Próxima fecha ≤ hoy"
          icon="error"
          accent="text-error"
        />
        <Kpi
          label="1–30 / 31–60 días"
          value={`${stats.bySemaphore.proximo} / ${stats.bySemaphore.seguimiento}`}
          detail={`${stats.bySemaphore.vigente} vigentes (>60 d)`}
          icon="timelapse"
        />
        <Kpi
          label="Conceptos"
          value={stats.total}
          detail={
            <>
              Apto {stats.byConcept.apto} · Rec. {stats.byConcept.apto_recomendaciones} · Rest.{" "}
              {stats.byConcept.apto_restricciones} · No apto {stats.byConcept.no_apto}
            </>
          }
          icon="fact_check"
        />
      </section>

      {preview.length > 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <div className="font-label-md text-label-md font-bold">Vista previa: {fileName}</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {preview.length} filas. Folio existente → actualización. Documento debe existir en
                base maestra.
              </div>
            </div>
            <div className="flex gap-xs">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-sm py-1.5"
                onClick={() => {
                  setPreview([]);
                  setFileName("");
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                className="rounded-lg bg-primary px-sm py-1.5 font-semibold text-on-primary disabled:opacity-60"
                onClick={confirmImport}
              >
                {pending ? "Importando..." : "Confirmar importación"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-sm shadow-sm lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <MaterialIcon
            name="search"
            className="absolute top-2.5 left-3 text-[20px] text-outline"
          />
          <input
            className="w-full rounded-lg bg-surface-container-low py-2.5 pr-4 pl-10 font-body-sm text-body-sm focus:outline-none"
            placeholder="Buscar por nombre, cédula, folio o IPS..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {SEM_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSemaphore(item.id)}
              className={`rounded-lg px-2.5 py-1.5 font-label-sm text-label-sm ${
                semaphore === item.id
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
          value={examType}
          onChange={(event) => setExamType(event.target.value as EmoExamType | "all")}
        >
          <option value="all">Todos los tipos</option>
          {EMO_EXAM_TYPES.map((type) => (
            <option key={type} value={type}>
              {EMO_EXAM_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
          value={concept}
          onChange={(event) => setConcept(event.target.value as EmoConcept | "all")}
        >
          <option value="all">Todos los conceptos</option>
          {EMO_CONCEPTS.map((item) => (
            <option key={item} value={item}>
              {EMO_CONCEPT_LABELS[item]}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
          value={farmId}
          onChange={(event) => setFarmId(event.target.value)}
        >
          <option value="all">Todas las fincas</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
                <th className="px-md py-sm">Semáforo</th>
                <th className="px-sm py-sm">Colaborador</th>
                <th className="px-sm py-sm">Tipo</th>
                <th className="px-sm py-sm">Fecha / Próx.</th>
                <th className="px-sm py-sm">Concepto</th>
                <th className="px-sm py-sm">IPS / Evidencia</th>
                <th className="px-md py-sm text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((emo) => (
                <tr key={emo.id} className="hover:bg-surface-container-low/50">
                  <td className="px-md py-sm">
                    <SemaphoreBadge level={emo.semaphore} label={emo.semaphoreLabel} compact />
                  </td>
                  <td className="px-sm py-sm">
                    <div className="font-semibold text-on-surface">{emo.workerName}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      {emo.jobTitleSnapshot} · {emo.farmName ?? "Sin finca"}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      {emo.workerCode} · CC {emo.workerDocument}
                    </div>
                  </td>
                  <td className="px-sm py-sm whitespace-nowrap">
                    {EMO_EXAM_TYPE_LABELS[emo.examType]}
                    <div className="text-[11px] text-on-surface-variant">{emo.folio}</div>
                  </td>
                  <td className="px-sm py-sm whitespace-nowrap">
                    <div>{emo.examDate}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      Próx. {emo.nextDueDate ?? "N/A"}
                      {emo.daysRemaining != null ? ` (${emo.daysRemaining}d)` : ""}
                    </div>
                  </td>
                  <td className="px-sm py-sm">
                    <ConceptChip concept={emo.concept} />
                    {emo.adminObservations ? (
                      <div className="mt-1 max-w-[220px] truncate text-[11px] text-on-surface-variant">
                        {emo.adminObservations}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-sm py-sm">
                    <div>{emo.ips}</div>
                    {emo.evidenceUrl ? (
                      <a
                        href={emo.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-primary underline"
                      >
                        <MaterialIcon name="attach_file" className="text-[14px]" />
                        {emo.evidenceName || "Ver evidencia"}
                      </a>
                    ) : (
                      <div className="text-[11px] text-outline">Sin documento</div>
                    )}
                  </td>
                  <td className="px-md py-sm text-right">
                    <Link
                      href={`${SGSST_BASE}/examenes-medicos-ocupacionales/${emo.id}`}
                      className="inline-flex rounded-lg bg-primary p-1.5 text-on-primary"
                      title="Abrir ficha"
                    >
                      <MaterialIcon name="open_in_new" className="text-[18px]" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-md py-lg text-center text-on-surface-variant">
                    No hay EMOs con los filtros actuales. Registra el primero o importa Excel.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  detail,
  icon,
  accent,
}: Readonly<{
  label: string;
  value: string | number;
  detail: React.ReactNode;
  icon: string;
  accent?: string;
}>) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
          {label}
        </span>
        <MaterialIcon name={icon} className="text-[20px] text-primary" />
      </div>
      <div className={`font-headline-lg text-headline-lg font-bold tracking-tight ${accent ?? "text-primary"}`}>
        {value}
      </div>
      <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant">{detail}</div>
    </div>
  );
}

function ConceptChip({ concept }: Readonly<{ concept: EmoConcept }>) {
  const styles: Record<EmoConcept, string> = {
    apto: "bg-secondary-fixed text-on-secondary-fixed",
    apto_recomendaciones: "bg-surface-container-high text-primary",
    apto_restricciones: "bg-amber-100 text-amber-900",
    no_apto: "bg-error-container text-on-error-container",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${styles[concept]}`}>
      {EMO_CONCEPT_LABELS[concept]}
    </span>
  );
}
