"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SemaphoreBadge } from "@/components/sg-sst/alerts/SemaphoreBadge";
import { ComplianceExcelIoBar } from "@/components/sg-sst/alerts/ComplianceExcelIoBar";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import {
  deleteComplianceRecordAction,
  saveComplianceRecordAction,
} from "@/lib/sg-sst/alerts/actions";
import {
  RECORD_TYPE_META,
  SST_WORKFLOW_STATUSES,
  type SstAlertView,
  type SstFarm,
  type SstRecordDraft,
  type SstRecordType,
  type SstWorkflowStatus,
} from "@/lib/sg-sst/alerts/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

const STATUS_LABELS: Record<SstWorkflowStatus, string> = {
  open: "Abierto",
  in_progress: "En proceso",
  pending_implementation: "Pendiente implementación",
  pending_delivery: "Pendiente entrega",
  pending_closure: "Pendiente cierre",
  closed: "Cerrado",
  cancelled: "Cancelado",
};

type ModuleRecordsScreenProps = {
  title: string;
  description: string;
  icon: string;
  recordTypes: readonly SstRecordType[];
  records: SstAlertView[];
  farms: SstFarm[];
  workers: SstWorker[];
};

const emptyDraft = (defaultType: SstRecordType): SstRecordDraft => ({
  recordType: defaultType,
  title: "",
  code: "",
  workerId: null,
  subjectName: "",
  subjectDocument: "",
  subjectJobTitle: "",
  farmId: null,
  dueDate: "",
  issuedAt: "",
  workflowStatus: "open",
  responsibleName: "",
  responsibleRole: "",
  externalEntity: "",
  phone: "",
  notes: "",
});

export function ModuleRecordsScreen({
  title,
  description,
  icon,
  recordTypes,
  records,
  farms,
  workers,
}: Readonly<ModuleRecordsScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<SstRecordDraft | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (record) =>
        record.title.toLowerCase().includes(q) ||
        record.subjectName.toLowerCase().includes(q) ||
        record.code.toLowerCase().includes(q) ||
        record.folio.toLowerCase().includes(q),
    );
  }, [query, records]);

  function openCreate() {
    setEditing(emptyDraft(recordTypes[0]));
  }

  function openEdit(record: SstAlertView) {
    setEditing({
      id: record.id,
      recordType: record.recordType,
      title: record.title,
      code: record.code,
      workerId: record.workerId,
      subjectName: record.subjectName,
      subjectDocument: record.subjectDocument ?? "",
      subjectJobTitle: record.subjectJobTitle ?? "",
      farmId: record.farmId,
      dueDate: record.dueDate ?? "",
      issuedAt: record.issuedAt ?? "",
      workflowStatus: record.workflowStatus,
      responsibleName: record.responsibleName ?? "",
      responsibleRole: record.responsibleRole ?? "",
      externalEntity: record.externalEntity ?? "",
      phone: record.phone ?? "",
      notes: record.notes,
    });
  }

  function applyWorker(worker: SstWorker | null) {
    if (!editing) return;
    if (!worker) {
      setEditing({
        ...editing,
        workerId: null,
        subjectName: "",
        subjectDocument: "",
        subjectJobTitle: "",
      });
      return;
    }
    setEditing({
      ...editing,
      workerId: worker.id,
      subjectName: worker.fullName,
      subjectDocument: worker.documentNumber,
      subjectJobTitle: worker.jobTitle,
      farmId: worker.farmId ?? editing.farmId,
      phone: worker.phone || editing.phone,
    });
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveComplianceRecordAction(editing);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editing.id ? "Registro actualizado." : "Registro creado.");
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteComplianceRecordAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Registro eliminado.");
      router.refresh();
    });
  }

  return (
    <div className="px-gutter py-md pb-xl">
      <div className="mb-md flex flex-col justify-between gap-md md:flex-row md:items-end">
        <div>
          <div className="mb-xs flex items-center gap-xs font-label-sm text-label-sm tracking-wider text-primary uppercase">
            <MaterialIcon name={icon} className="text-[16px]" />
            <span>Gestión operativa</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">{title}</h1>
          <p className="mt-xs max-w-3xl font-body-md text-body-md text-on-surface-variant">
            {description} Los registros alimentan automáticamente el radar de{" "}
            <Link href={`${SGSST_BASE}/alertas-sst`} className="font-semibold text-primary underline">
              Alertas SST
            </Link>
            . El sujeto se elige desde la{" "}
            <Link
              href={`${SGSST_BASE}/trabajadores`}
              className="font-semibold text-primary underline"
            >
              base maestra
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-sm sm:items-end">
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-xs rounded-lg bg-primary px-base py-sm font-label-md text-label-md font-semibold text-on-primary"
          >
            <MaterialIcon name="add" className="text-[18px]" />
            Nuevo registro
          </button>
          <ComplianceExcelIoBar
            records={filtered}
            recordTypes={recordTypes}
            exportFileName={`sg-sst-${recordTypes.join("-")}-${new Date().toISOString().slice(0, 10)}.xlsx`}
            templateFileName={`plantilla-${recordTypes[0]}.xlsx`}
            sheetName={title.slice(0, 31)}
          />
        </div>
      </div>

      <div className="mb-sm flex items-center gap-xs rounded-xl bg-surface-container-lowest px-sm py-1.5 shadow-sm">
        <MaterialIcon name="search" className="text-outline" />
        <input
          className="w-full bg-transparent font-body-sm text-body-sm focus:outline-none"
          placeholder="Buscar por folio, código, sujeto..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <table className="w-full text-left font-body-sm text-body-sm">
          <thead>
            <tr className="bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant uppercase">
              <th className="px-md py-sm">Semáforo</th>
              <th className="px-sm py-sm">Registro</th>
              <th className="px-sm py-sm">Sujeto</th>
              <th className="px-sm py-sm">Vence</th>
              <th className="px-sm py-sm">Estado</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {filtered.map((record) => (
              <tr key={record.id} className="hover:bg-surface-container-low/60">
                <td className="px-md py-sm">
                  <SemaphoreBadge level={record.semaphore} label={record.semaphoreLabel} />
                </td>
                <td className="px-sm py-sm">
                  <Link
                    href={`${SGSST_BASE}/registros/${record.id}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {record.title}
                  </Link>
                  <div className="text-[11px] text-on-surface-variant">
                    {record.folio} · {record.code} · {RECORD_TYPE_META[record.recordType].label}
                  </div>
                </td>
                <td className="px-sm py-sm">
                  <div>{record.subjectName}</div>
                  <div className="text-[11px] text-on-surface-variant">
                    {record.farmName ?? "Sin finca"}
                  </div>
                </td>
                <td className="px-sm py-sm whitespace-nowrap">{record.dueDate ?? "—"}</td>
                <td className="px-sm py-sm">{STATUS_LABELS[record.workflowStatus]}</td>
                <td className="px-md py-sm text-right">
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg bg-surface-container p-1.5"
                      onClick={() => openEdit(record)}
                    >
                      <MaterialIcon name="edit" className="text-[18px]" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-error-container p-1.5 text-on-error-container"
                      disabled={pending}
                      onClick={() => remove(record.id)}
                    >
                      <MaterialIcon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-md py-lg text-center text-on-surface-variant">
                  No hay registros. Crea el primero para alimentar las alertas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
            <div className="mb-md flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {editing.id ? "Editar registro" : "Nuevo registro"}
              </h2>
              <button type="button" onClick={() => setEditing(null)}>
                <MaterialIcon name="close" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
              {recordTypes.length > 1 ? (
                <label className="flex flex-col gap-xs md:col-span-2">
                  <span className="font-label-sm text-label-sm">Tipo</span>
                  <select
                    className="rounded-lg bg-surface-container-low px-sm py-sm"
                    value={editing.recordType}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        recordType: event.target.value as SstRecordType,
                      })
                    }
                  >
                    {recordTypes.map((type) => (
                      <option key={type} value={type}>
                        {RECORD_TYPE_META[type].label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <Field
                label="Título"
                value={editing.title}
                onChange={(value) => setEditing({ ...editing, title: value })}
              />
              <Field
                label="Código"
                value={editing.code}
                onChange={(value) => setEditing({ ...editing, code: value })}
              />
              <label className="flex flex-col gap-xs md:col-span-2">
                <span className="font-label-sm text-label-sm">Trabajador (base maestra)</span>
                <WorkerSelect
                  workers={workers}
                  value={editing.workerId}
                  onChange={applyWorker}
                />
              </label>
              <Field
                label="Nombre (autollenado)"
                value={editing.subjectName}
                onChange={(value) => setEditing({ ...editing, subjectName: value })}
              />
              <Field
                label="Documento"
                value={editing.subjectDocument ?? ""}
                onChange={(value) => setEditing({ ...editing, subjectDocument: value })}
              />
              <Field
                label="Cargo"
                value={editing.subjectJobTitle ?? ""}
                onChange={(value) => setEditing({ ...editing, subjectJobTitle: value })}
              />
              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Finca</span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.farmId ?? ""}
                  onChange={(event) =>
                    setEditing({ ...editing, farmId: event.target.value || null })
                  }
                >
                  <option value="">Sin finca</option>
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Fecha de vencimiento</span>
                <input
                  type="date"
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.dueDate ?? ""}
                  onChange={(event) => setEditing({ ...editing, dueDate: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-xs">
                <span className="font-label-sm text-label-sm">Estado de flujo</span>
                <select
                  className="rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.workflowStatus}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      workflowStatus: event.target.value as SstWorkflowStatus,
                    })
                  }
                >
                  {SST_WORKFLOW_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Responsable"
                value={editing.responsibleName ?? ""}
                onChange={(value) => setEditing({ ...editing, responsibleName: value })}
              />
              <Field
                label="Rol responsable"
                value={editing.responsibleRole ?? ""}
                onChange={(value) => setEditing({ ...editing, responsibleRole: value })}
              />
              <Field
                label="Entidad externa"
                value={editing.externalEntity ?? ""}
                onChange={(value) => setEditing({ ...editing, externalEntity: value })}
              />
              <Field
                label="Teléfono"
                value={editing.phone ?? ""}
                onChange={(value) => setEditing({ ...editing, phone: value })}
              />
              <label className="flex flex-col gap-xs md:col-span-2">
                <span className="font-label-sm text-label-sm">Notas</span>
                <textarea
                  className="min-h-24 rounded-lg bg-surface-container-low px-sm py-sm"
                  value={editing.notes ?? ""}
                  onChange={(event) => setEditing({ ...editing, notes: event.target.value })}
                />
              </label>
            </div>
            <div className="mt-md flex justify-end gap-sm">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-base py-sm"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                className="rounded-lg bg-primary px-base py-sm font-semibold text-on-primary disabled:opacity-60"
                onClick={save}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: Readonly<{ label: string; value: string; onChange: (value: string) => void }>) {
  return (
    <label className="flex flex-col gap-xs">
      <span className="font-label-sm text-label-sm">{label}</span>
      <input
        className="rounded-lg bg-surface-container-low px-sm py-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
