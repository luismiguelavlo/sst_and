"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import { bulkImportComplianceRecordsAction } from "@/lib/sg-sst/alerts/actions";
import {
  downloadComplianceExcel,
  downloadComplianceTemplate,
  parseComplianceExcelFile,
} from "@/lib/sg-sst/alerts/excel-client";
import { SST_EXCEL_MAX_ROWS, type SstExcelImportRow } from "@/lib/sg-sst/alerts/excel";
import type { SstAlertView, SstRecordType } from "@/lib/sg-sst/alerts/types";

type ComplianceExcelIoBarProps = {
  records: readonly SstAlertView[];
  recordTypes: readonly SstRecordType[];
  exportFileName: string;
  templateFileName?: string;
  sheetName?: string;
};

export function ComplianceExcelIoBar({
  records,
  recordTypes,
  exportFileName,
  templateFileName = "plantilla-registros-sst.xlsx",
  sheetName = "Registros SST",
}: Readonly<ComplianceExcelIoBarProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<SstExcelImportRow[]>([]);
  const [fileName, setFileName] = useState("");

  const defaultType = recordTypes[0];

  function handleExport() {
    downloadComplianceExcel(records, exportFileName, sheetName);
    showToast(`Exportados ${records.length} registros a Excel.`);
  }

  function handleTemplate() {
    downloadComplianceTemplate(defaultType, templateFileName);
    showToast("Plantilla Excel descargada.");
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const rows = await parseComplianceExcelFile(file, {
        allowedTypes: recordTypes,
        defaultType,
      });
      if (rows.length === 0) {
        showToast("El archivo no tiene filas para importar.", { variant: "error" });
        return;
      }
      if (rows.length > SST_EXCEL_MAX_ROWS) {
        showToast(`Máximo ${SST_EXCEL_MAX_ROWS} filas por importación.`, { variant: "error" });
        return;
      }
      setFileName(file.name);
      setPreview(rows);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "No se pudo leer el Excel.", {
        variant: "error",
      });
      setPreview([]);
      setFileName("");
    } finally {
      event.target.value = "";
    }
  }

  function confirmImport() {
    if (preview.length === 0) {
      return;
    }
    startTransition(async () => {
      const result = await bulkImportComplianceRecordsAction({
        rows: preview,
        allowedTypes: recordTypes,
      });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        `Importación lista: ${result.created} creados, ${result.updated} actualizados, ${result.failed} con error.`,
        { variant: result.failed > 0 ? "info" : "success" },
      );
      setPreview([]);
      setFileName("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-sm">
      <div className="flex flex-wrap items-center gap-xs">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-xs rounded-lg bg-surface-container-lowest px-sm py-sm font-label-md text-label-md font-semibold text-primary shadow-sm hover:bg-surface-container"
        >
          <MaterialIcon name="file_download" className="text-[18px]" />
          Exportar Excel
        </button>
        <button
          type="button"
          onClick={handleTemplate}
          className="inline-flex items-center gap-xs rounded-lg bg-surface-container px-sm py-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-high"
        >
          <MaterialIcon name="table_view" className="text-[18px]" />
          Descargar plantilla
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-xs rounded-lg bg-secondary px-sm py-sm font-label-md text-label-md font-semibold text-on-secondary disabled:opacity-60"
        >
          <MaterialIcon name="upload_file" className="text-[18px]" />
          Importar Excel
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {preview.length > 0 ? (
        <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-sm shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <div className="font-label-md text-label-md font-bold text-on-surface">
                Vista previa: {fileName}
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {preview.length} filas listas. Si el código ya existe, se actualizará.
              </div>
            </div>
            <div className="flex gap-xs">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-sm py-1.5 font-label-sm text-label-sm"
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
                className="rounded-lg bg-primary px-sm py-1.5 font-label-sm text-label-sm font-semibold text-on-primary disabled:opacity-60"
                onClick={confirmImport}
              >
                {pending ? "Importando..." : "Confirmar importación"}
              </button>
            </div>
          </div>
          <div className="max-h-48 overflow-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead>
                <tr className="text-on-surface-variant">
                  <th className="px-xs py-1">Fila</th>
                  <th className="px-xs py-1">Tipo</th>
                  <th className="px-xs py-1">Código</th>
                  <th className="px-xs py-1">Título</th>
                  <th className="px-xs py-1">Sujeto</th>
                  <th className="px-xs py-1">Vence</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 8).map((row) => (
                  <tr key={`${row.rowNumber}-${row.draft.code}`} className="border-t border-surface-container">
                    <td className="px-xs py-1">{row.rowNumber}</td>
                    <td className="px-xs py-1">{row.draft.recordType}</td>
                    <td className="px-xs py-1">{row.draft.code}</td>
                    <td className="px-xs py-1">{row.draft.title}</td>
                    <td className="px-xs py-1">{row.draft.subjectName}</td>
                    <td className="px-xs py-1">{row.draft.dueDate ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 8 ? (
              <p className="mt-xs text-[11px] text-on-surface-variant">
                … y {preview.length - 8} filas más
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
