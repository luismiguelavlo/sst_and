"use client";

import { useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  downloadBinaryFile,
  downloadTextFile,
} from "@/lib/attendance/download-export";
import { useToast } from "@/components/ui/ToastProvider";
import { bulkCreateWorkerAccounts } from "@/lib/auth/credential-actions";
import {
  BULK_IMPORT_TEMPLATE_CSV,
  parseCsvText,
  resultsToCsv,
  rowsFromMatrix,
  type BulkImportInputRow,
  type BulkImportResultRow,
} from "@/lib/credentials/bulk-import";
import type { UserCredential } from "@/lib/credentials";

type BulkCredentialImportProps = {
  onImported: (credentials: UserCredential[]) => void;
};

type ImportPhase = "idle" | "preview" | "importing" | "done";

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls"];
const PREVIEW_LIMIT = 5;

export function BulkCredentialImport({ onImported }: Readonly<BulkCredentialImportProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<ImportPhase>("idle");
  const [fileName, setFileName] = useState("");
  const [previewRows, setPreviewRows] = useState<BulkImportInputRow[]>([]);
  const [pendingRows, setPendingRows] = useState<BulkImportInputRow[]>([]);
  const [results, setResults] = useState<BulkImportResultRow[]>([]);
  const { showToast } = useToast();

  function resetState() {
    setPhase("idle");
    setFileName("");
    setPreviewRows([]);
    setPendingRows([]);
    setResults([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDownloadTemplate() {
    downloadTextFile(BULK_IMPORT_TEMPLATE_CSV, "plantilla-accesos.csv", "text/csv;charset=utf-8");
  }

  async function parseUploadedFile(file: File): Promise<BulkImportInputRow[]> {
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith(".csv")) {
      const text = await file.text();
      return parseCsvText(text);
    }
    if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new Error("El archivo Excel no contiene hojas.");
      }
      const sheet = workbook.Sheets[sheetName];
      const matrix = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
        header: 1,
        defval: "",
      });
      const normalized = matrix.map((row) =>
        row.map((cell) => (cell === null || cell === undefined ? "" : String(cell).trim())),
      );
      return rowsFromMatrix(normalized);
    }
    throw new Error("Formato no soportado. Usa CSV o Excel (.xlsx, .xls).");
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      showToast("Usa un archivo CSV o Excel (.xlsx, .xls).", { variant: "error" });
      event.target.value = "";
      return;
    }

    try {
      const rows = await parseUploadedFile(file);
      if (rows.length === 0) {
        showToast("El archivo no tiene filas de empleados para importar.", { variant: "error" });
        resetState();
        return;
      }
      setFileName(file.name);
      setPendingRows(rows);
      setPreviewRows(rows.slice(0, PREVIEW_LIMIT));
      setResults([]);
      setPhase("preview");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "No se pudo leer el archivo.", {
        variant: "error",
      });
      resetState();
    }
  }

  async function handleImport() {
    if (pendingRows.length === 0) {
      return;
    }
    setPhase("importing");
    const result = await bulkCreateWorkerAccounts(pendingRows);
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      setPhase("preview");
      return;
    }
    setResults(result.results);
    setPhase("done");
    if (result.createdCount > 0) {
      onImported(result.credentials);
    }
    showToast(
      result.createdCount > 0
        ? `${result.createdCount} acceso${result.createdCount === 1 ? "" : "s"} creado${result.createdCount === 1 ? "" : "s"}. Descarga el archivo con credenciales.`
        : "No se creó ningún acceso. Revisa los errores en la descarga.",
      { variant: result.createdCount > 0 ? "success" : "error", duration: 10000 },
    );
  }

  function handleDownloadCsv() {
    if (results.length === 0) {
      return;
    }
    const baseName = fileName.replace(/\.[^.]+$/, "") || "importacion-accesos";
    downloadTextFile(resultsToCsv(results), `${baseName}-resultados.csv`, "text/csv;charset=utf-8");
  }

  async function handleDownloadExcel() {
    if (results.length === 0) {
      return;
    }
    const XLSX = await import("xlsx");
    const data = results.map((row) => ({
      fila: row.rowNumber,
      nombre: row.name,
      correo: row.email,
      cedula: row.cedula,
      cargo: row.jobTitle,
      contraseña: row.password,
      enlace_invitacion: row.invitationLink,
      estado: row.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
    const baseName = fileName.replace(/\.[^.]+$/, "") || "importacion-accesos";
    downloadBinaryFile(
      buffer,
      `${baseName}-resultados.xlsx`,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  }

  const createdCount = results.filter((row) => row.status === "Creado").length;
  const failedCount = results.length - createdCount;
  const isBusy = phase === "importing";

  return (
    <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-xs flex items-center gap-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
          <MaterialIcon name="upload_file" filled className="text-[20px] text-secondary" />
        </div>
        <div>
          <h2 className="m-0 text-[20px] leading-none font-headline-md tracking-tight text-on-surface">
            Importación masiva
          </h2>
          <p className="m-0 font-body-sm text-body-sm text-on-surface-variant">
            Sube CSV o Excel, crea accesos en lote y descarga credenciales con enlace de invitación.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-xs sm:flex-row">
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-xs rounded-lg border border-outline-variant/40 bg-surface px-sm py-sm font-label-md text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-60"
          onClick={handleDownloadTemplate}
          disabled={isBusy}
        >
          <MaterialIcon name="download" className="text-[18px]" />
          Plantilla CSV
        </button>
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-xs rounded-lg bg-secondary-container px-sm py-sm font-label-md text-on-secondary-container transition-colors hover:bg-secondary-container/80 disabled:opacity-60"
          onClick={() => inputRef.current?.click()}
          disabled={isBusy}
        >
          <MaterialIcon name="folder_open" className="text-[18px]" />
          {phase === "idle" ? "Seleccionar archivo" : "Cambiar archivo"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        className="sr-only"
        onChange={(event) => {
          void handleFileChange(event);
        }}
      />

      {phase === "preview" || phase === "importing" ? (
        <section className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-sm py-sm">
          <div className="mb-sm flex items-center justify-between gap-sm">
            <p className="m-0 font-label-sm text-on-surface-variant">
              {fileName} · {pendingRows.length} fila{pendingRows.length === 1 ? "" : "s"}
            </p>
            {pendingRows.length > PREVIEW_LIMIT ? (
              <span className="font-body-sm text-on-surface-variant">
                Vista previa ({PREVIEW_LIMIT} de {pendingRows.length})
              </span>
            ) : null}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse font-body-sm text-on-surface">
              <thead>
                <tr className="border-b border-outline-variant/20 text-left font-label-sm text-on-surface-variant">
                  <th className="px-xs py-xs">Nombre</th>
                  <th className="px-xs py-xs">Correo</th>
                  <th className="px-xs py-xs">Cédula</th>
                  <th className="px-xs py-xs">Cargo</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={row.rowNumber} className="border-b border-outline-variant/10">
                    <td className="px-xs py-xs">{row.name}</td>
                    <td className="px-xs py-xs">{row.email}</td>
                    <td className="px-xs py-xs">{row.cedula}</td>
                    <td className="px-xs py-xs">{row.jobTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="mt-sm inline-flex w-full items-center justify-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-70"
            onClick={() => {
              void handleImport();
            }}
            disabled={isBusy}
          >
            <MaterialIcon
              name={isBusy ? "progress_activity" : "group_add"}
              className={isBusy ? "animate-spin text-[18px]" : "text-[18px]"}
            />
            {isBusy ? "Creando accesos..." : `Importar ${pendingRows.length} empleado${pendingRows.length === 1 ? "" : "s"}`}
          </button>
        </section>
      ) : null}

      {phase === "done" ? (
        <section
          className="rounded-lg border border-secondary/30 bg-secondary-container/30 px-sm py-sm"
          aria-live="polite"
        >
          <div className="mb-sm flex items-start gap-sm">
            <MaterialIcon name="task_alt" className="mt-0.5 shrink-0 text-[22px] text-secondary" />
            <div>
              <p className="m-0 font-label-md text-on-surface">Importación finalizada</p>
              <p className="mt-xs m-0 font-body-sm text-on-surface-variant">
                {createdCount} creado{createdCount === 1 ? "" : "s"}
                {failedCount > 0 ? ` · ${failedCount} con error` : ""}. Descarga el archivo con
                contraseñas y enlaces de invitación.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-xs sm:flex-row">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90"
              onClick={handleDownloadCsv}
            >
              <MaterialIcon name="table" className="text-[18px]" />
              Descargar CSV
            </button>
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-xs rounded-lg border border-primary/30 bg-surface px-md py-sm font-label-md text-primary transition-colors hover:bg-primary/5"
              onClick={() => {
                void handleDownloadExcel();
              }}
            >
              <MaterialIcon name="grid_on" className="text-[18px]" />
              Descargar Excel
            </button>
          </div>
          <button
            type="button"
            className="mt-xs inline-flex w-full items-center justify-center gap-xs rounded-lg px-md py-sm font-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
            onClick={resetState}
          >
            <MaterialIcon name="refresh" className="text-[18px]" />
            Nueva importación
          </button>
        </section>
      ) : null}
    </div>
  );
}
