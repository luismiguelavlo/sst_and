"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SemaphoreBadge } from "@/components/sg-sst/alerts/SemaphoreBadge";
import { useToast } from "@/components/ui/ToastProvider";
import {
  addAlertNoteAction,
  closeAlertAction,
  extendAlertAction,
  updateAlertStatusAction,
} from "@/lib/sg-sst/alerts/actions";
import {
  ALERT_KIND_META,
  RECORD_TYPE_META,
  type SstAlertView,
  type SstWorkflowStatus,
} from "@/lib/sg-sst/alerts/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type ActionItem = {
  id: string;
  actionKind: string;
  message: string;
  createdByName: string | null;
  createdAt: string;
};

type RecordDetailScreenProps = {
  record: SstAlertView;
  actions: ActionItem[];
};

export function RecordDetailScreen({ record, actions }: Readonly<RecordDetailScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [closeNotes, setCloseNotes] = useState("");
  const [extendDate, setExtendDate] = useState("");
  const [note, setNote] = useState("");

  function run(action: () => Promise<{ ok: true } | { ok: false; error: string }>, okMsg: string) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(okMsg);
      router.refresh();
    });
  }

  return (
    <div className="px-gutter py-md pb-xl">
      <div className="mb-md flex flex-wrap items-center gap-sm">
        <Link
          href={`${SGSST_BASE}/alertas-sst/matriz`}
          className="inline-flex items-center gap-xs rounded-lg bg-surface-container-low px-sm py-1.5 text-primary"
        >
          <MaterialIcon name="arrow_back" className="text-[18px]" />
          Matriz de alertas
        </Link>
        <Link
          href={`${SGSST_BASE}/${record.modulePath}`}
          className="inline-flex items-center gap-xs rounded-lg bg-surface-container px-sm py-1.5 text-on-surface"
        >
          Ir a módulo {RECORD_TYPE_META[record.recordType].label}
        </Link>
      </div>

      <div className="mb-md flex flex-col justify-between gap-md lg:flex-row lg:items-start">
        <div>
          <div className="mb-xs flex flex-wrap items-center gap-xs">
            <SemaphoreBadge level={record.semaphore} label={record.semaphoreLabel} />
            <span className="font-label-sm text-label-sm text-on-surface-variant">{record.folio}</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary">{record.title}</h1>
          <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
            {record.subjectName}
            {record.subjectDocument ? ` · C.C. ${record.subjectDocument}` : ""}
            {record.farmName ? ` · ${record.farmName}` : ""}
          </p>
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-sm shadow-sm">
          <div className="font-label-sm text-label-sm text-on-surface-variant">Código</div>
          <div className="font-label-md text-label-md font-bold text-on-surface">{record.code}</div>
          <div className="mt-sm font-label-sm text-label-sm text-on-surface-variant">Tipo</div>
          <div className="font-label-md text-label-md text-on-surface">
            {RECORD_TYPE_META[record.recordType].label}
          </div>
        </div>
      </div>

      <div className="mb-md grid grid-cols-1 gap-md lg:grid-cols-3">
        <InfoCard label="Vencimiento" value={record.dueDate ?? "Sin fecha"} />
        <InfoCard
          label="Responsable"
          value={`${record.responsibleName ?? "—"} ${record.responsibleRole ? `(${record.responsibleRole})` : ""}`}
        />
        <InfoCard label="Entidad" value={record.externalEntity ?? "—"} />
      </div>

      {record.alertKinds.length > 0 ? (
        <div className="mb-md flex flex-wrap gap-xs">
          {record.alertKinds.map((kind) => (
            <Link
              key={kind}
              href={`${SGSST_BASE}/alertas-sst/matriz?kind=${kind}`}
              className="rounded-full bg-surface-container px-base py-1 font-label-sm text-label-sm text-primary"
            >
              {ALERT_KIND_META[kind].label}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mb-md rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <h2 className="mb-xs font-headline-md text-headline-md text-on-surface">Notas del caso</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{record.notes || "Sin notas."}</p>
      </div>

      <div className="mb-md grid grid-cols-1 gap-md lg:grid-cols-3">
        <div className="space-y-xs rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <h3 className="font-label-md text-label-md font-bold">Cerrar alerta</h3>
          <textarea
            className="min-h-24 w-full rounded-lg bg-surface-container-low p-sm"
            value={closeNotes}
            onChange={(event) => setCloseNotes(event.target.value)}
            placeholder="Evidencia de cierre..."
          />
          <button
            type="button"
            disabled={pending}
            className="w-full rounded-lg bg-secondary py-sm font-semibold text-on-secondary"
            onClick={() => run(() => closeAlertAction(record.id, closeNotes), "Alerta cerrada.")}
          >
            Cerrar
          </button>
        </div>
        <div className="space-y-xs rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <h3 className="font-label-md text-label-md font-bold">Prorrogar</h3>
          <input
            type="date"
            className="w-full rounded-lg bg-surface-container-low p-sm"
            value={extendDate}
            onChange={(event) => setExtendDate(event.target.value)}
          />
          <button
            type="button"
            disabled={pending}
            className="w-full rounded-lg bg-primary py-sm font-semibold text-on-primary"
            onClick={() =>
              run(
                () => extendAlertAction(record.id, extendDate, "Prórroga desde detalle"),
                "Fecha actualizada.",
              )
            }
          >
            Guardar prórroga
          </button>
        </div>
        <div className="space-y-xs rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <h3 className="font-label-md text-label-md font-bold">Estado / Nota</h3>
          <select
            className="w-full rounded-lg bg-surface-container-low p-sm"
            defaultValue={record.workflowStatus}
            onChange={(event) => {
              const status = event.target.value as SstWorkflowStatus;
              run(
                () => updateAlertStatusAction(record.id, status),
                "Estado actualizado.",
              );
            }}
          >
            <option value="open">Abierto</option>
            <option value="in_progress">En proceso</option>
            <option value="pending_implementation">Pendiente implementación</option>
            <option value="pending_delivery">Pendiente entrega</option>
            <option value="pending_closure">Pendiente cierre</option>
            <option value="closed">Cerrado</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <textarea
            className="min-h-16 w-full rounded-lg bg-surface-container-low p-sm"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Agregar nota de seguimiento..."
          />
          <button
            type="button"
            disabled={pending}
            className="w-full rounded-lg bg-surface-container-high py-sm font-semibold"
            onClick={() => run(() => addAlertNoteAction(record.id, note), "Nota registrada.")}
          >
            Guardar nota
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <h2 className="mb-sm font-headline-md text-headline-md text-on-surface">Trazabilidad</h2>
        <div className="space-y-sm">
          {actions.map((action) => (
            <div key={action.id} className="rounded-lg bg-surface-container-low p-sm">
              <div className="flex items-center justify-between gap-sm">
                <span className="font-label-md text-label-md font-bold text-primary">
                  {action.actionKind}
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  {new Date(action.createdAt).toLocaleString("es-CO")}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">{action.message}</p>
              <p className="text-[11px] text-on-surface-variant">
                {action.createdByName ?? "Sistema"}
              </p>
            </div>
          ))}
          {actions.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Sin acciones registradas aún.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="font-label-sm text-label-sm text-on-surface-variant">{label}</div>
      <div className="mt-xs font-label-md text-label-md font-semibold text-on-surface">{value}</div>
    </div>
  );
}
