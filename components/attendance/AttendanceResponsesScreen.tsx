"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import {
  exportAttendanceResponsesAction,
  type AttendanceExportFormat,
} from "@/lib/attendance/actions";
import { downloadBase64File, downloadTextFile } from "@/lib/attendance/download-export";
import type {
  AttendanceCustomField,
  AttendanceFormDraft,
  AttendanceResponseListItem,
} from "@/lib/attendance";

export function AttendanceResponsesScreen({
  form,
  responses,
}: Readonly<{
  form: AttendanceFormDraft;
  responses: readonly AttendanceResponseListItem[];
}>) {
  const { showToast } = useToast();
  const fieldLabels = Object.fromEntries(
    form.customFields.map((field: AttendanceCustomField) => [field.id, field.label]),
  );

  async function downloadExport(format: AttendanceExportFormat) {
    if (!form.id) {
      return;
    }
    const result = await exportAttendanceResponsesAction([form.id], format);
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      return;
    }
    if (result.format === "pdf") {
      downloadBase64File(result.pdfBase64, result.fileName, "application/pdf");
      showToast("PDF descargado.");
      return;
    }
    downloadTextFile(result.csv, result.fileName, "text/csv;charset=utf-8");
    showToast("Resultados descargados (Excel/CSV).");
  }

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-md">
      <div className="flex flex-col justify-between gap-md md:flex-row md:items-end">
        <div className="space-y-xs">
          <Link
            href="/attendance-forms"
            className="inline-flex items-center gap-xs font-label-sm text-primary hover:underline"
          >
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Volver a formularios
          </Link>
          <h1 className="font-display-lg tracking-tight text-on-surface">Respuestas</h1>
          <p className="max-w-2xl font-body-lg text-on-surface-variant">
            {form.title} · {responses.length}{" "}
            {responses.length === 1 ? "persona diligenció" : "personas diligenciaron"} este
            formulario (empleados asignados y enlace público).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <button
            type="button"
            disabled={responses.length === 0}
            className="flex items-center gap-xs rounded-lg bg-surface-container-high px-md py-sm font-label-md text-on-surface shadow-sm transition-all hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              void downloadExport("pdf");
            }}
          >
            <MaterialIcon name="picture_as_pdf" className="text-[20px]" />
            Descargar PDF
          </button>
          <button
            type="button"
            disabled={responses.length === 0}
            className="flex items-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              void downloadExport("csv");
            }}
          >
            <MaterialIcon name="download" className="text-[20px]" />
            Descargar Excel
          </button>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center shadow-sm">
          <MaterialIcon name="inbox" className="mx-auto text-[40px] text-outline" />
          <p className="mt-sm font-headline-md text-on-surface">Sin respuestas todavía</p>
          <p className="mt-xs font-body-sm text-on-surface-variant">
            Cuando alguien diligencie el formulario (asignado o por enlace), aparecerá aquí.
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-outline-variant/15 rounded-xl bg-surface-container-lowest shadow-md md:hidden">
            {responses.map((row) => (
              <li key={row.id} className="space-y-xs p-md">
                <div className="flex items-start justify-between gap-sm">
                  <div className="min-w-0">
                    <p className="font-label-md text-on-surface">
                      {row.firstName} {row.lastName}
                    </p>
                    <p className="font-body-sm text-on-surface-variant">
                      Cédula {row.cedula} · {row.jobTitle || "Sin cargo"}
                    </p>
                  </div>
                  {row.source === "assigned" ? (
                    <span className="shrink-0 rounded-full bg-secondary-container/20 px-2 py-1 font-label-sm">
                      Asignado
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-surface-container-highest px-2 py-1 font-label-sm text-on-surface-variant">
                      Público
                    </span>
                  )}
                </div>
                <p className="font-body-sm text-on-surface">{row.company}</p>
                <p className="font-body-sm text-on-surface-variant">Tema: {row.topicSelected}</p>
                <p className="font-label-sm text-outline">
                  {row.submittedAtLabel}
                  {row.qualityRating !== null ? ` · Calidad ${row.qualityRating}/5` : ""}
                </p>
              </li>
            ))}
          </ul>

          <div className="hidden rounded-xl bg-surface-container-lowest shadow-md md:block">
            <div className="overflow-x-auto overscroll-x-contain">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                    <th className="p-sm font-label-sm tracking-wider text-outline uppercase">
                      Persona
                    </th>
                    <th className="p-sm font-label-sm tracking-wider text-outline uppercase">
                      Empresa
                    </th>
                    <th className="p-sm font-label-sm tracking-wider text-outline uppercase">
                      Tema
                    </th>
                    <th className="p-sm font-label-sm tracking-wider text-outline uppercase">
                      Origen
                    </th>
                    <th className="whitespace-nowrap p-sm font-label-sm tracking-wider text-outline uppercase">
                      Enviado
                    </th>
                    <th className="p-sm font-label-sm tracking-wider text-outline uppercase">
                      Calidad
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {responses.map((row) => (
                    <tr key={row.id} className="align-top hover:bg-surface-container-low/60">
                      <td className="max-w-[260px] p-sm">
                        <p className="font-label-md text-on-surface">
                          {row.firstName} {row.lastName}
                        </p>
                        <p className="font-body-sm text-on-surface-variant">
                          Cédula {row.cedula} · {row.jobTitle || "Sin cargo"}
                        </p>
                        {row.userEmail ? (
                          <p className="truncate font-body-sm text-outline">{row.userEmail}</p>
                        ) : null}
                        {Object.keys(row.customAnswers).length > 0 ? (
                          <ul className="mt-xs space-y-0.5 font-body-sm text-on-surface-variant">
                            {Object.entries(row.customAnswers).map(([fieldId, value]) =>
                              value.trim().length > 0 ? (
                                <li key={fieldId} className="break-words">
                                  <span className="text-outline">
                                    {fieldLabels[fieldId] ?? fieldId}:
                                  </span>{" "}
                                  {value}
                                </li>
                              ) : null,
                            )}
                          </ul>
                        ) : null}
                        {row.qualityComment.trim().length > 0 ? (
                          <p className="mt-xs break-words font-body-sm text-on-surface-variant">
                            Comentario: {row.qualityComment}
                          </p>
                        ) : null}
                      </td>
                      <td className="max-w-[160px] p-sm font-body-sm break-words text-on-surface">
                        {row.company}
                      </td>
                      <td className="max-w-[180px] p-sm font-body-sm break-words text-on-surface-variant">
                        {row.topicSelected}
                      </td>
                      <td className="p-sm">
                        {row.source === "assigned" ? (
                          <span className="inline-flex items-center gap-xs rounded-full bg-secondary-container/20 px-2 py-1 font-label-sm text-on-surface">
                            Asignado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-xs rounded-full bg-surface-container-highest px-2 py-1 font-label-sm text-on-surface-variant">
                            Enlace público
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap p-sm font-body-sm text-on-surface-variant">
                        {row.submittedAtLabel}
                      </td>
                      <td className="p-sm font-body-sm text-on-surface">
                        {row.qualityRating === null ? "—" : `${row.qualityRating}/5`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
