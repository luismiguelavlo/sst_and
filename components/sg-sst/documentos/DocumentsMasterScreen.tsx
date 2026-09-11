"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SemaphoreBadge } from "@/components/sg-sst/alerts/SemaphoreBadge";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstSemaphoreLevel } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportDocumentsAction,
  deleteDocumentAction,
  saveDocumentAction,
} from "@/lib/sg-sst/documentos/actions";
import {
  DOCUMENT_EXCEL_MAX_ROWS,
  type DocumentExcelImportRow,
} from "@/lib/sg-sst/documentos/excel";
import {
  downloadDocumentsExcel,
  downloadDocumentsTemplate,
  parseDocumentsExcelFile,
} from "@/lib/sg-sst/documentos/excel-client";
import {
  DEFAULT_SG_DOC_COMPANY,
  draftFromDocument,
  emptyDocumentDraft,
  SG_DOC_STATUS_LABELS,
  SG_DOC_STATUSES,
  SG_DOC_TYPE_LABELS,
  SG_DOC_TYPES,
  type DocumentStats,
  type SgDocStatus,
  type SgDocType,
  type SstSgDocumentDraft,
  type SstSgDocumentView,
} from "@/lib/sg-sst/documentos/types";

type DocumentsMasterScreenProps = {
  documents: SstSgDocumentView[];
  stats: DocumentStats;
};

const SEM_FILTERS: { id: SstSemaphoreLevel | "all" | "sin_ciclo"; label: string }[] =
  [
    { id: "all", label: "Todos" },
    { id: "critico", label: "Revisión vencida" },
    { id: "proximo", label: "1–30 d" },
    { id: "seguimiento", label: "31–60 d" },
    { id: "vigente", label: ">60 d" },
    { id: "sin_ciclo", label: "Sin vencimiento" },
  ];

export function DocumentsMasterScreen({
  documents,
  stats,
}: Readonly<DocumentsMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [docType, setDocType] = useState<SgDocType | "all">("all");
  const [status, setStatus] = useState<SgDocStatus | "all">("all");
  const [semaphore, setSemaphore] = useState<
    SstSemaphoreLevel | "all" | "sin_ciclo"
  >("all");
  const [preview, setPreview] = useState<DocumentExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [editing, setEditing] = useState<SstSgDocumentDraft | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((doc) => {
      if (docType !== "all" && doc.docType !== docType) return false;
      if (status !== "all" && doc.status !== status) return false;
      if (semaphore === "sin_ciclo") {
        if (doc.tracksReview) return false;
      } else if (semaphore !== "all") {
        if (!doc.tracksReview || doc.semaphore !== semaphore) return false;
      }
      if (!q) return true;
      return (
        doc.code.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        doc.responsibleName.toLowerCase().includes(q) ||
        doc.company.toLowerCase().includes(q) ||
        SG_DOC_TYPE_LABELS[doc.docType].toLowerCase().includes(q)
      );
    });
  }, [documents, docType, status, semaphore, query]);

  const custodyPct =
    stats.total > 0 ? Math.round((stats.withFile / stats.total) * 100) : 0;

  function handleExport() {
    downloadDocumentsExcel(
      filtered,
      `documentos-sg-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showToast(`Exportados ${filtered.length} documentos.`);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseDocumentsExcelFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (rows.length > DOCUMENT_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${DOCUMENT_EXCEL_MAX_ROWS} filas.`, {
          variant: "error",
        });
        return;
      }
      setFileName(file.name);
      setPreview(rows);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "No se pudo leer el Excel.",
        { variant: "error" },
      );
    } finally {
      event.target.value = "";
    }
  }

  function confirmImport() {
    startTransition(async () => {
      const result = await bulkImportDocumentsAction({ rows: preview });
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

  function saveDoc() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveDocumentAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editing.id ? "Documento actualizado." : "Documento registrado.");
      setEditing(null);
      router.refresh();
    });
  }

  function removeDoc(id: string) {
    if (!window.confirm("¿Eliminar este documento del archivo maestro?")) return;
    startTransition(async () => {
      const result = await deleteDocumentAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Documento eliminado.");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <MaterialIcon name="folder" className="text-[16px] text-primary" />
            <span>Control documental SG-SST</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            19. Control Documental y Archivo Maestro del SG-SST
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Elaboración → revisión → versión → responsable → estado. Conservación
            mínima 20 años (Dec. 1072 Art. 2.2.4.6.12–13 / Res. 0312).
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadDocumentsTemplate()}
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
          <button
            type="button"
            onClick={() => setEditing(emptyDocumentDraft())}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm"
          >
            <MaterialIcon name="add" className="text-[20px]" />
            Subir / actualizar
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </header>

      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-secondary-container" />
        <div className="flex flex-col justify-between gap-base pl-xs md:flex-row md:items-center">
          <div className="flex items-start gap-base">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
              <MaterialIcon name="verified" className="text-[24px]" />
            </div>
            <div>
              <div className="font-label-sm text-label-sm font-semibold tracking-wider text-secondary uppercase">
                Principio de gestión — sin vencimiento automático universal
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">
                No todos los documentos caducan. Solo generan alerta de revisión
                cuando tienen <span className="font-semibold text-primary">ciclo de revisión</span>{" "}
                y <span className="font-semibold text-primary">próxima revisión</span>{" "}
                definida. Sin esos datos no se sincronizan alertas de
                vencimiento.
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-md rounded-lg bg-surface-container-low px-md py-xs lg:flex">
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Retención mínima legal
              </span>
              <span className="font-label-md text-label-md font-bold text-primary">
                20 años certificados
              </span>
            </div>
            <MaterialIcon name="lock_clock" className="text-[28px] text-primary" />
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-sm sm:grid-cols-2 xl:grid-cols-5">
        <Kpi
          label="Total documentos"
          value={stats.total}
          detail="Inventario controlado"
          icon="folder_copy"
        />
        <Kpi
          label="Versiones vigentes"
          value={stats.byStatus.vigente}
          detail={`${stats.byStatus.en_revision} en revisión`}
          icon="check_circle"
        />
        <Kpi
          label="Requieren ajuste"
          value={stats.byStatus.observado}
          detail={`${stats.byStatus.obsoleto} obsoletos`}
          icon="warning"
          accent="text-error"
        />
        <Kpi
          label="Revisión vencida"
          value={stats.overdueReview}
          detail={`${stats.trackingReview} con ciclo activo`}
          icon="event_busy"
          accent={stats.overdueReview > 0 ? "text-error" : undefined}
        />
        <Kpi
          label="Custodia digital"
          value={`${custodyPct}%`}
          detail={`${stats.withFile}/${stats.total} con archivo`}
          icon="cloud_done"
        />
      </section>

      {preview.length > 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <div className="font-label-md text-label-md font-bold">
                Vista previa: {fileName}
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {preview.length} filas. Código existente → actualización.
              </div>
            </div>
            <div className="flex gap-xs">
              <button
                type="button"
                className="rounded-lg bg-surface-container-low px-sm py-1.5 font-label-sm text-label-sm"
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
          <div className="max-h-48 overflow-auto text-[12px]">
            <table className="w-full">
              <thead>
                <tr className="text-left text-on-surface-variant">
                  <th className="py-1 pr-2">#</th>
                  <th className="py-1 pr-2">Código</th>
                  <th className="py-1 pr-2">Título</th>
                  <th className="py-1">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 20).map((row) => (
                  <tr key={row.rowNumber} className="border-t border-surface-container-low">
                    <td className="py-1 pr-2">{row.rowNumber}</td>
                    <td className="py-1 pr-2 font-mono">{row.code}</td>
                    <td className="py-1 pr-2">{row.draft.title}</td>
                    <td className="py-1">
                      {SG_DOC_TYPE_LABELS[row.draft.docType]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 20 ? (
              <div className="pt-1 text-on-surface-variant">
                … y {preview.length - 20} más
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-sm shadow-sm">
        <div className="flex flex-col gap-sm lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <MaterialIcon
              name="search"
              className="absolute top-2.5 left-3 text-[20px] text-outline"
            />
            <input
              className="w-full rounded-lg bg-surface-container-low py-2.5 pr-4 pl-10 font-body-sm text-body-sm focus:outline-none"
              placeholder="Código (POL-SST), título o responsable…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            className="rounded-lg bg-surface-container-low px-sm py-2.5 font-body-sm text-body-sm"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as SgDocStatus | "all")
            }
          >
            <option value="all">Todos los estados</option>
            {SG_DOC_STATUSES.map((item) => (
              <option key={item} value={item}>
                {SG_DOC_STATUS_LABELS[item]}
              </option>
            ))}
          </select>
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
        </div>

        <div className="flex flex-wrap gap-1">
          <TypePill
            active={docType === "all"}
            label={`Todos (${stats.total})`}
            onClick={() => setDocType("all")}
          />
          {SG_DOC_TYPES.map((type) => (
            <TypePill
              key={type}
              active={docType === type}
              label={`${SG_DOC_TYPE_LABELS[type]} (${stats.byDocType[type]})`}
              onClick={() => setDocType(type)}
            />
          ))}
        </div>
      </div>

      <DocumentsTable
        rows={filtered}
        pending={pending}
        onEdit={(doc) => setEditing(draftFromDocument(doc))}
        onDelete={removeDoc}
      />

      {editing ? (
        <DocumentFormModal
          draft={editing}
          pending={pending}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={saveDoc}
        />
      ) : null}
    </div>
  );
}

function TypePill({
  active,
  label,
  onClick,
}: Readonly<{ active: boolean; label: string; onClick: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-sm py-xs font-label-sm text-label-sm whitespace-nowrap transition-all ${
        active
          ? "bg-primary text-on-primary shadow-sm"
          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
      }`}
    >
      {label}
    </button>
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
  value: ReactNode;
  detail: ReactNode;
  icon: string;
  accent?: string;
}>) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-base flex items-center justify-between">
        <span className="font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
          {label}
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container text-primary">
          <MaterialIcon name={icon} className="text-[18px]" />
        </div>
      </div>
      <div className={`font-display-lg text-display-lg leading-none tracking-tight ${accent ?? "text-on-surface"}`}>
        {value}
      </div>
      <div className="mt-xs font-label-sm text-label-sm text-on-surface-variant">
        {detail}
      </div>
    </div>
  );
}

function DocumentsTable({
  rows,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  rows: SstSgDocumentView[];
  pending: boolean;
  onEdit: (doc: SstSgDocumentView) => void;
  onDelete: (id: string) => void;
}>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-xl text-center shadow-sm">
        <MaterialIcon
          name="folder_off"
          className="mb-sm text-[40px] text-on-surface-variant"
        />
        <div className="font-label-md text-label-md text-on-surface">
          No hay documentos con estos filtros
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Registra el archivo maestro o importa desde Excel.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
              <th className="px-md py-sm">Código / documento</th>
              <th className="px-sm py-sm">Tipo</th>
              <th className="px-sm py-sm">Responsable</th>
              <th className="px-sm py-sm">Ciclo de revisión</th>
              <th className="px-sm py-sm">Versión / estado</th>
              <th className="px-sm py-sm">Evidencia</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {rows.map((doc) => (
              <tr key={doc.id} className="hover:bg-surface-container-low/50">
                <td className="px-md py-sm align-top">
                  <div className="font-mono text-[11px] font-semibold text-secondary">
                    {doc.code}
                  </div>
                  <div className="font-semibold text-on-surface">{doc.title}</div>
                  <div className="text-[11px] text-on-surface-variant">
                    {doc.company}
                  </div>
                </td>
                <td className="px-sm py-sm align-top">
                  <span className="rounded bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold">
                    {SG_DOC_TYPE_LABELS[doc.docType]}
                  </span>
                </td>
                <td className="px-sm py-sm align-top text-[13px]">
                  {doc.responsibleName || "—"}
                </td>
                <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                  {doc.tracksReview ? (
                    <>
                      <SemaphoreBadge
                        level={doc.semaphore}
                        label={doc.semaphoreLabel}
                        compact
                      />
                      <div className="mt-1">
                        <span className="text-outline">Próxima:</span>{" "}
                        {doc.nextReviewAt}
                        {doc.daysRemaining != null
                          ? ` (${doc.daysRemaining}d)`
                          : ""}
                      </div>
                      <div>
                        <span className="text-outline">Última:</span>{" "}
                        {doc.lastReviewedAt ?? "—"}
                      </div>
                    </>
                  ) : (
                    <span className="rounded bg-surface-container-low px-2 py-0.5 text-[11px] text-on-surface-variant">
                      Sin vencimiento automático
                    </span>
                  )}
                </td>
                <td className="px-sm py-sm align-top">
                  <div className="font-mono text-[12px]">v{doc.versionLabel}</div>
                  <StatusChip status={doc.status} />
                </td>
                <td className="px-sm py-sm align-top">
                  {doc.fileUrl ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] text-primary underline"
                    >
                      <MaterialIcon name="attach_file" className="text-[14px]" />
                      {doc.fileName || "Archivo"}
                    </a>
                  ) : doc.fileName ? (
                    <span className="text-[11px] text-on-surface-variant">
                      {doc.fileName}
                    </span>
                  ) : (
                    <span className="text-[11px] text-outline">Sin archivo</span>
                  )}
                </td>
                <td className="px-md py-sm align-top text-right">
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => onEdit(doc)}
                      className="rounded-lg bg-surface-container-low p-1.5 text-primary disabled:opacity-50"
                      aria-label="Editar"
                    >
                      <MaterialIcon name="edit" className="text-[18px]" />
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => onDelete(doc.id)}
                      className="rounded-lg bg-surface-container-low p-1.5 text-error disabled:opacity-50"
                      aria-label="Eliminar"
                    >
                      <MaterialIcon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-surface-container-low px-md py-sm font-label-sm text-label-sm text-on-surface-variant">
        Mostrando {rows.length} documento{rows.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}

function StatusChip({ status }: Readonly<{ status: SgDocStatus }>) {
  const styles: Record<SgDocStatus, string> = {
    vigente: "bg-secondary-container/20 text-secondary",
    en_revision: "bg-surface-container-high text-on-surface",
    observado: "bg-error-container text-error",
    obsoleto: "bg-surface-container text-on-surface-variant",
  };
  return (
    <span
      className={`mt-1 inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${styles[status]}`}
    >
      {SG_DOC_STATUS_LABELS[status]}
    </span>
  );
}

function DocumentFormModal({
  draft,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstSgDocumentDraft;
  pending: boolean;
  onChange: (draft: SstSgDocumentDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {draft.id ? "Actualizar documento" : "Registrar documento SG-SST"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Código</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm font-mono"
              value={draft.code}
              onChange={(event) =>
                onChange({ ...draft, code: event.target.value })
              }
              placeholder="POL-SST-001"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Tipo</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.docType}
              onChange={(event) =>
                onChange({
                  ...draft,
                  docType: event.target.value as SgDocType,
                })
              }
            >
              {SG_DOC_TYPES.map((type) => (
                <option key={type} value={type}>
                  {SG_DOC_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Título / documento</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.title}
              onChange={(event) =>
                onChange({ ...draft, title: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Empresa</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.company}
              onChange={(event) =>
                onChange({ ...draft, company: event.target.value })
              }
              placeholder={DEFAULT_SG_DOC_COMPANY}
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Responsable</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.responsibleName}
              onChange={(event) =>
                onChange({ ...draft, responsibleName: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Fecha elaboración</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.elaboratedAt}
              onChange={(event) =>
                onChange({ ...draft, elaboratedAt: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Última revisión</span>
            <input
              type="date"
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.lastReviewedAt}
              onChange={(event) =>
                onChange({ ...draft, lastReviewedAt: event.target.value })
              }
            />
          </label>

          <label className="flex items-center gap-sm md:col-span-2">
            <input
              type="checkbox"
              checked={draft.hasReviewCycle}
              onChange={(event) =>
                onChange({
                  ...draft,
                  hasReviewCycle: event.target.checked,
                  nextReviewAt: event.target.checked ? draft.nextReviewAt : "",
                })
              }
            />
            <span className="font-label-sm text-label-sm">
              Tiene ciclo de revisión (genera alerta solo si hay próxima fecha)
            </span>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Próxima revisión</span>
            <input
              type="date"
              disabled={!draft.hasReviewCycle}
              className="rounded-lg bg-surface-container-low px-sm py-sm disabled:opacity-50"
              value={draft.nextReviewAt}
              onChange={(event) =>
                onChange({ ...draft, nextReviewAt: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Versión</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.versionLabel}
              onChange={(event) =>
                onChange({ ...draft, versionLabel: event.target.value })
              }
              placeholder="1.0"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Estado</span>
            <select
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.status}
              onChange={(event) =>
                onChange({
                  ...draft,
                  status: event.target.value as SgDocStatus,
                })
              }
            >
              {SG_DOC_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {SG_DOC_STATUS_LABELS[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm">Nombre archivo</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.fileName}
              onChange={(event) =>
                onChange({ ...draft, fileName: event.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">URL evidencia</span>
            <input
              className="rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.fileUrl}
              onChange={(event) =>
                onChange({ ...draft, fileUrl: event.target.value })
              }
              placeholder="https://…"
            />
          </label>

          <label className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-sm text-label-sm">Observaciones</span>
            <textarea
              className="min-h-20 rounded-lg bg-surface-container-low px-sm py-sm"
              value={draft.observations}
              onChange={(event) =>
                onChange({ ...draft, observations: event.target.value })
              }
            />
          </label>
        </div>

        <div className="mt-md flex justify-end gap-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-surface-container-low px-md py-2 font-label-md text-label-md"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onSave}
            className="rounded-lg bg-primary px-md py-2 font-label-md text-label-md text-on-primary disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar documento"}
          </button>
        </div>
      </div>
    </div>
  );
}
