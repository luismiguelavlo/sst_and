"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportCopasstCommitmentsAction,
  bulkImportCopasstMeetingsAction,
  bulkImportCopasstMembersAction,
  bulkImportCopasstTrainingsAction,
  deleteCommitmentAction,
  deleteMeetingAction,
  deleteMemberAction,
  deleteTrainingAction,
  saveCommitmentAction,
  saveMeetingAction,
  saveMemberAction,
  saveTrainingAction,
} from "@/lib/sg-sst/copasst/actions";
import { COPASST_EXCEL_MAX_ROWS } from "@/lib/sg-sst/copasst/excel";
import {
  downloadCopasstTemplate,
  downloadCopasstWorkbook,
  parseCopasstExcelFile,
  type CopasstImportBundle,
} from "@/lib/sg-sst/copasst/excel-client";
import {
  COPASST_COMMITMENT_MANUAL_STATUSES,
  COPASST_COMMITMENT_STATUS_LABELS,
  COPASST_MEETING_STATUS_LABELS,
  COPASST_MEETING_STATUSES,
  COPASST_MEETING_TYPE_LABELS,
  COPASST_MEETING_TYPES,
  COPASST_MEMBER_MANUAL_STATUSES,
  COPASST_MEMBER_STATUS_LABELS,
  COPASST_ROLE_LABELS,
  COPASST_ROLES,
  COPASST_TRAINING_STATUS_LABELS,
  COPASST_TRAINING_STATUSES,
  draftFromCommitment,
  draftFromMeeting,
  draftFromMember,
  draftFromTraining,
  emptyCommitmentDraft,
  emptyMeetingDraft,
  emptyMemberDraft,
  emptyTrainingDraft,
  type CopasstStats,
  type SstCopasstCommitmentDraft,
  type SstCopasstCommitmentView,
  type SstCopasstMeeting,
  type SstCopasstMeetingDraft,
  type SstCopasstMemberDraft,
  type SstCopasstMemberView,
  type SstCopasstTraining,
  type SstCopasstTrainingDraft,
} from "@/lib/sg-sst/copasst/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type TabId = "integrantes" | "actas" | "compromisos" | "capacitaciones";

type CopasstMasterScreenProps = {
  members: SstCopasstMemberView[];
  meetings: SstCopasstMeeting[];
  commitments: SstCopasstCommitmentView[];
  trainings: SstCopasstTraining[];
  stats: CopasstStats;
  farms: SstFarm[];
  workers: SstWorker[];
};

export function CopasstMasterScreen({
  members,
  meetings,
  commitments,
  trainings,
  stats,
  farms,
  workers,
}: Readonly<CopasstMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<TabId>("integrantes");
  const [query, setQuery] = useState("");

  const [editingMember, setEditingMember] = useState<SstCopasstMemberDraft | null>(
    null,
  );
  const [editingMeeting, setEditingMeeting] =
    useState<SstCopasstMeetingDraft | null>(null);
  const [editingCommitment, setEditingCommitment] =
    useState<SstCopasstCommitmentDraft | null>(null);
  const [editingTraining, setEditingTraining] =
    useState<SstCopasstTrainingDraft | null>(null);

  const [importBundle, setImportBundle] = useState<CopasstImportBundle | null>(
    null,
  );
  const [fileName, setFileName] = useState("");

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (item) =>
        item.workerName.toLowerCase().includes(q) ||
        item.workerDocument.toLowerCase().includes(q) ||
        item.workerCode.toLowerCase().includes(q) ||
        COPASST_ROLE_LABELS[item.role].toLowerCase().includes(q) ||
        item.periodLabel.toLowerCase().includes(q),
    );
  }, [members, query]);

  const filteredMeetings = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return meetings;
    return meetings.filter(
      (item) =>
        item.folio.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q),
    );
  }, [meetings, query]);

  const filteredCommitments = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commitments;
    return commitments.filter(
      (item) =>
        item.folio.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.responsibleName.toLowerCase().includes(q) ||
        (item.meetingFolio ?? "").toLowerCase().includes(q),
    );
  }, [commitments, query]);

  const filteredTrainings = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trainings;
    return trainings.filter(
      (item) =>
        item.folio.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.instructor.toLowerCase().includes(q),
    );
  }, [trainings, query]);

  const preferredImportKind = (): CopasstImportBundle["activeKind"] => {
    if (tab === "integrantes") return "members";
    if (tab === "actas") return "meetings";
    if (tab === "compromisos") return "commitments";
    return "trainings";
  };

  function handleExport() {
    downloadCopasstWorkbook({
      members: filteredMembers,
      meetings: filteredMeetings,
      commitments: filteredCommitments,
      trainings: filteredTrainings,
      fileName: `copasst-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    });
    showToast("Libro COPASST exportado (4 hojas).");
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const bundle = await parseCopasstExcelFile(file, preferredImportKind());
      const total =
        bundle.members.length +
        bundle.meetings.length +
        bundle.commitments.length +
        bundle.trainings.length;
      if (total === 0) {
        showToast("El archivo no tiene filas.", { variant: "error" });
        return;
      }
      if (total > COPASST_EXCEL_MAX_ROWS * 4) {
        showToast("Demasiadas filas en el archivo.", { variant: "error" });
        return;
      }
      setFileName(file.name);
      setImportBundle(bundle);
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
    if (!importBundle) return;
    startTransition(async () => {
      let created = 0;
      let updated = 0;
      let failed = 0;

      if (importBundle.members.length > 0) {
        const result = await bulkImportCopasstMembersAction({
          rows: importBundle.members,
        });
        if (!result.ok) {
          showToast(result.error, { variant: "error" });
          return;
        }
        created += result.created;
        updated += result.updated;
        failed += result.failed;
      }
      if (importBundle.meetings.length > 0) {
        const result = await bulkImportCopasstMeetingsAction({
          rows: importBundle.meetings,
        });
        if (!result.ok) {
          showToast(result.error, { variant: "error" });
          return;
        }
        created += result.created;
        updated += result.updated;
        failed += result.failed;
      }
      if (importBundle.commitments.length > 0) {
        const result = await bulkImportCopasstCommitmentsAction({
          rows: importBundle.commitments,
        });
        if (!result.ok) {
          showToast(result.error, { variant: "error" });
          return;
        }
        created += result.created;
        updated += result.updated;
        failed += result.failed;
      }
      if (importBundle.trainings.length > 0) {
        const result = await bulkImportCopasstTrainingsAction({
          rows: importBundle.trainings,
        });
        if (!result.ok) {
          showToast(result.error, { variant: "error" });
          return;
        }
        created += result.created;
        updated += result.updated;
        failed += result.failed;
      }

      showToast(
        `Importación: ${created} creados, ${updated} actualizados, ${failed} con error.`,
        { variant: failed > 0 ? "info" : "success" },
      );
      setImportBundle(null);
      setFileName("");
      router.refresh();
    });
  }

  function openCreate() {
    if (tab === "integrantes") setEditingMember(emptyMemberDraft());
    if (tab === "actas") setEditingMeeting(emptyMeetingDraft());
    if (tab === "compromisos") setEditingCommitment(emptyCommitmentDraft());
    if (tab === "capacitaciones") setEditingTraining(emptyTrainingDraft());
  }

  function saveMember() {
    if (!editingMember) return;
    startTransition(async () => {
      const result = await saveMemberAction(editingMember);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editingMember.id ? "Integrante actualizado." : "Integrante creado.");
      setEditingMember(null);
      router.refresh();
    });
  }

  function saveMeeting() {
    if (!editingMeeting) return;
    startTransition(async () => {
      const result = await saveMeetingAction(editingMeeting);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editingMeeting.id ? "Acta actualizada." : "Acta creada.");
      setEditingMeeting(null);
      router.refresh();
    });
  }

  function saveCommitment() {
    if (!editingCommitment) return;
    startTransition(async () => {
      const result = await saveCommitmentAction(editingCommitment);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        editingCommitment.id ? "Compromiso actualizado." : "Compromiso creado.",
      );
      setEditingCommitment(null);
      router.refresh();
    });
  }

  function saveTraining() {
    if (!editingTraining) return;
    startTransition(async () => {
      const result = await saveTrainingAction(editingTraining);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(
        editingTraining.id ? "Capacitación actualizada." : "Capacitación creada.",
      );
      setEditingTraining(null);
      router.refresh();
    });
  }

  function removeCurrent(id: string) {
    const labels: Record<TabId, string> = {
      integrantes: "este integrante",
      actas: "esta acta / reunión",
      compromisos: "este compromiso",
      capacitaciones: "esta capacitación",
    };
    if (!window.confirm(`¿Eliminar ${labels[tab]}?`)) return;
    startTransition(async () => {
      const result =
        tab === "integrantes"
          ? await deleteMemberAction(id)
          : tab === "actas"
            ? await deleteMeetingAction(id)
            : tab === "compromisos"
              ? await deleteCommitmentAction(id)
              : await deleteTrainingAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Registro eliminado.");
      router.refresh();
    });
  }

  const importCount = importBundle
    ? importBundle.members.length +
      importBundle.meetings.length +
      importBundle.commitments.length +
      importBundle.trainings.length
    : 0;

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            <span className="rounded bg-surface-container-high px-xs py-0.5 font-medium text-primary">
              Capítulo 20
            </span>
            <span>·</span>
            <span>Dec. 1072 · Comité paritario</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            COPASST — Comité Paritario de SST
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Integrantes, actas, compromisos con alerta de vencimiento y plan de
            capacitación del comité.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadCopasstTemplate()}
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
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm"
          >
            <MaterialIcon name="add_circle" className="text-[20px]" />
            Nuevo
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

      <section
        aria-label="Indicadores COPASST"
        className="grid grid-cols-2 gap-sm md:grid-cols-3 xl:grid-cols-5"
      >
        <Kpi
          label="Vigencia del periodo"
          value={stats.periodEndDate ?? "—"}
          detail={`${stats.membersActive} integrantes activos`}
          icon="event_available"
        />
        <Kpi
          label="Próxima reunión"
          value={stats.nextMeetingDate ?? "—"}
          detail={`${stats.meetingsTotal} actas registradas`}
          icon="event"
        />
        <Kpi
          label="Reuniones realizadas"
          value={stats.meetingsDone}
          detail="Estado realizada"
          icon="groups"
          accent="text-primary"
        />
        <Kpi
          label="Compromisos abiertos"
          value={stats.commitmentsOpen}
          detail="Sin cierre"
          icon="pending_actions"
        />
        <Kpi
          label="Compromisos vencidos"
          value={stats.commitmentsOverdue}
          detail="Plazo superado"
          icon="error"
          accent="text-error"
        />
      </section>

      {importBundle && importCount > 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <div className="font-label-md text-label-md font-bold">
                Vista previa: {fileName}
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {importBundle.members.length} integrantes ·{" "}
                {importBundle.meetings.length} actas ·{" "}
                {importBundle.commitments.length} compromisos ·{" "}
                {importBundle.trainings.length} capacitaciones
              </div>
            </div>
            <div className="flex gap-xs">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-sm py-1.5"
                onClick={() => {
                  setImportBundle(null);
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

      <div className="flex items-center gap-xs overflow-x-auto rounded-xl bg-surface-container-low p-xs">
        <TabButton
          active={tab === "integrantes"}
          onClick={() => setTab("integrantes")}
          icon="badge"
          label="Integrantes"
          count={members.length}
        />
        <TabButton
          active={tab === "actas"}
          onClick={() => setTab("actas")}
          icon="description"
          label="Actas/Reuniones"
          count={meetings.length}
        />
        <TabButton
          active={tab === "compromisos"}
          onClick={() => setTab("compromisos")}
          icon="task_alt"
          label="Compromisos"
          count={commitments.length}
        />
        <TabButton
          active={tab === "capacitaciones"}
          onClick={() => setTab("capacitaciones")}
          icon="school"
          label="Capacitaciones"
          count={trainings.length}
        />
      </div>

      <div className="relative max-w-md">
        <MaterialIcon
          name="search"
          className="absolute top-2.5 left-3 text-[20px] text-outline"
        />
        <input
          className="w-full rounded-lg bg-surface-container-lowest py-2.5 pr-4 pl-10 font-body-sm text-body-sm shadow-sm focus:outline-none"
          placeholder="Buscar en la pestaña activa…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {tab === "integrantes" ? (
        <MembersTable
          items={filteredMembers}
          pending={pending}
          onEdit={(item) => setEditingMember(draftFromMember(item))}
          onDelete={removeCurrent}
        />
      ) : null}
      {tab === "actas" ? (
        <MeetingsTable
          items={filteredMeetings}
          pending={pending}
          onEdit={(item) => setEditingMeeting(draftFromMeeting(item))}
          onDelete={removeCurrent}
        />
      ) : null}
      {tab === "compromisos" ? (
        <CommitmentsTable
          items={filteredCommitments}
          pending={pending}
          onEdit={(item) => setEditingCommitment(draftFromCommitment(item))}
          onDelete={removeCurrent}
        />
      ) : null}
      {tab === "capacitaciones" ? (
        <TrainingsTable
          items={filteredTrainings}
          pending={pending}
          onEdit={(item) => setEditingTraining(draftFromTraining(item))}
          onDelete={removeCurrent}
        />
      ) : null}

      {editingMember ? (
        <MemberFormModal
          draft={editingMember}
          farms={farms}
          workers={workers}
          pending={pending}
          onChange={setEditingMember}
          onClose={() => setEditingMember(null)}
          onSave={saveMember}
        />
      ) : null}
      {editingMeeting ? (
        <MeetingFormModal
          draft={editingMeeting}
          farms={farms}
          pending={pending}
          onChange={setEditingMeeting}
          onClose={() => setEditingMeeting(null)}
          onSave={saveMeeting}
        />
      ) : null}
      {editingCommitment ? (
        <CommitmentFormModal
          draft={editingCommitment}
          farms={farms}
          meetings={meetings}
          pending={pending}
          onChange={setEditingCommitment}
          onClose={() => setEditingCommitment(null)}
          onSave={saveCommitment}
        />
      ) : null}
      {editingTraining ? (
        <TrainingFormModal
          draft={editingTraining}
          pending={pending}
          onChange={setEditingTraining}
          onClose={() => setEditingTraining(null)}
          onSave={saveTraining}
        />
      ) : null}
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
  detail: string;
  icon: string;
  accent?: string;
}>) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <div className="mb-xs flex items-center justify-between gap-2">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {label}
        </span>
        <MaterialIcon name={icon} className={`text-[20px] ${accent ?? "text-primary"}`} />
      </div>
      <div className={`font-headline-md text-headline-md ${accent ?? "text-on-surface"}`}>
        {value}
      </div>
      <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
        {detail}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: Readonly<{
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count: number;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-label-md text-label-md ${
        active
          ? "bg-primary text-on-primary shadow-sm"
          : "bg-transparent text-on-surface-variant hover:bg-surface-container"
      }`}
    >
      <MaterialIcon name={icon} className="text-[18px]" />
      {label}
      <span
        className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${
          active ? "bg-on-primary/20" : "bg-surface-container-high"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function MembersTable({
  items,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  items: SstCopasstMemberView[];
  pending: boolean;
  onEdit: (item: SstCopasstMemberView) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
              <th className="px-md py-sm">Trabajador</th>
              <th className="px-sm py-sm">Rol</th>
              <th className="px-sm py-sm">Periodo</th>
              <th className="px-sm py-sm">Vigencia</th>
              <th className="px-sm py-sm">Estado</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low/50">
                <td className="px-md py-sm align-top">
                  <div className="font-semibold">{item.workerName}</div>
                  <div className="text-[11px] text-on-surface-variant">
                    {item.workerDocument} · {item.jobTitleSnapshot || "—"}
                  </div>
                </td>
                <td className="px-sm py-sm align-top">
                  {COPASST_ROLE_LABELS[item.role]}
                </td>
                <td className="px-sm py-sm align-top text-[12px]">
                  {item.periodLabel || "—"}
                </td>
                <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                  {item.startDate} → {item.endDate}
                  <div className="font-semibold">
                    {item.daysRemaining != null
                      ? `${item.daysRemaining}d`
                      : "—"}
                  </div>
                </td>
                <td className="px-sm py-sm align-top">
                  <StatusPill
                    label={COPASST_MEMBER_STATUS_LABELS[item.effectiveStatus]}
                    tone={
                      item.effectiveStatus === "activo"
                        ? "ok"
                        : item.effectiveStatus === "periodo_vencido"
                          ? "warn"
                          : "muted"
                    }
                  />
                </td>
                <td className="px-md py-sm text-right align-top">
                  <RowActions
                    pending={pending}
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-md py-lg text-center text-on-surface-variant">
                  Sin integrantes. Agrega el comité o importa Excel.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MeetingsTable({
  items,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  items: SstCopasstMeeting[];
  pending: boolean;
  onEdit: (item: SstCopasstMeeting) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
              <th className="px-md py-sm">Folio</th>
              <th className="px-sm py-sm">Fecha / tipo</th>
              <th className="px-sm py-sm">Tema</th>
              <th className="px-sm py-sm">Próxima</th>
              <th className="px-sm py-sm">Estado</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low/50">
                <td className="px-md py-sm align-top font-mono text-[12px] font-semibold text-primary">
                  {item.folio}
                </td>
                <td className="px-sm py-sm align-top text-[12px]">
                  <div>{item.meetingDate}</div>
                  <div className="text-on-surface-variant">
                    {COPASST_MEETING_TYPE_LABELS[item.meetingType]}
                  </div>
                </td>
                <td className="px-sm py-sm align-top">
                  <div className="font-semibold">{item.title}</div>
                  <p className="line-clamp-2 max-w-[280px] text-[12px] text-on-surface-variant">
                    {item.summary || "—"}
                  </p>
                </td>
                <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                  {item.nextMeetingDate ?? "—"}
                </td>
                <td className="px-sm py-sm align-top">
                  <StatusPill
                    label={COPASST_MEETING_STATUS_LABELS[item.status]}
                    tone={
                      item.status === "realizada"
                        ? "ok"
                        : item.status === "cancelada"
                          ? "muted"
                          : "warn"
                    }
                  />
                </td>
                <td className="px-md py-sm text-right align-top">
                  <RowActions
                    pending={pending}
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-md py-lg text-center text-on-surface-variant">
                  Sin actas. Programa la próxima reunión ordinaria.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CommitmentsTable({
  items,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  items: SstCopasstCommitmentView[];
  pending: boolean;
  onEdit: (item: SstCopasstCommitmentView) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
              <th className="px-md py-sm">Folio</th>
              <th className="px-sm py-sm">Compromiso</th>
              <th className="px-sm py-sm">Responsable</th>
              <th className="px-sm py-sm">Plazo</th>
              <th className="px-sm py-sm">Estado</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low/50">
                <td className="px-md py-sm align-top">
                  <div className="font-mono text-[12px] font-semibold text-primary">
                    {item.folio}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    {item.meetingFolio ?? "Sin acta"}
                  </div>
                </td>
                <td className="px-sm py-sm align-top">
                  <p className="line-clamp-3 max-w-[280px] font-body-sm text-body-sm">
                    {item.description}
                  </p>
                </td>
                <td className="px-sm py-sm align-top font-semibold">
                  {item.responsibleName}
                </td>
                <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                  <div>{item.dueDate}</div>
                  <div className="font-semibold">
                    {item.daysRemaining != null
                      ? `${item.daysRemaining}d`
                      : "—"}
                  </div>
                </td>
                <td className="px-sm py-sm align-top">
                  <StatusPill
                    label={
                      COPASST_COMMITMENT_STATUS_LABELS[item.effectiveStatus]
                    }
                    tone={
                      item.effectiveStatus === "cerrado"
                        ? "ok"
                        : item.effectiveStatus === "vencido"
                          ? "error"
                          : "warn"
                    }
                  />
                </td>
                <td className="px-md py-sm text-right align-top">
                  <RowActions
                    pending={pending}
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-md py-lg text-center text-on-surface-variant">
                  Sin compromisos. Derívalos desde las actas del comité.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrainingsTable({
  items,
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  items: SstCopasstTraining[];
  pending: boolean;
  onEdit: (item: SstCopasstTraining) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low font-label-sm text-label-sm tracking-wider text-on-surface-variant uppercase">
              <th className="px-md py-sm">Folio</th>
              <th className="px-sm py-sm">Capacitación</th>
              <th className="px-sm py-sm">Fecha / horas</th>
              <th className="px-sm py-sm">Instructor</th>
              <th className="px-sm py-sm">Estado</th>
              <th className="px-md py-sm text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low/50">
                <td className="px-md py-sm align-top font-mono text-[12px] font-semibold text-primary">
                  {item.folio}
                </td>
                <td className="px-sm py-sm align-top">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-[11px] text-on-surface-variant">
                    {item.attendeesCount} asistentes
                  </div>
                </td>
                <td className="px-sm py-sm align-top whitespace-nowrap text-[12px]">
                  {item.trainingDate}
                  <div>{item.hours} h</div>
                </td>
                <td className="px-sm py-sm align-top">{item.instructor || "—"}</td>
                <td className="px-sm py-sm align-top">
                  <StatusPill
                    label={COPASST_TRAINING_STATUS_LABELS[item.status]}
                    tone={
                      item.status === "realizada"
                        ? "ok"
                        : item.status === "cancelada"
                          ? "muted"
                          : "warn"
                    }
                  />
                </td>
                <td className="px-md py-sm text-right align-top">
                  <RowActions
                    pending={pending}
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-md py-lg text-center text-on-surface-variant">
                  Sin capacitaciones del comité.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RowActions({
  pending,
  onEdit,
  onDelete,
}: Readonly<{
  pending: boolean;
  onEdit: () => void;
  onDelete: () => void;
}>) {
  return (
    <div className="inline-flex gap-1">
      <button
        type="button"
        className="rounded-lg bg-surface-container p-1.5"
        onClick={onEdit}
        title="Editar"
      >
        <MaterialIcon name="edit" className="text-[18px]" />
      </button>
      <button
        type="button"
        className="rounded-lg bg-error-container p-1.5 text-on-error-container"
        disabled={pending}
        onClick={onDelete}
        title="Eliminar"
      >
        <MaterialIcon name="delete" className="text-[18px]" />
      </button>
    </div>
  );
}

function StatusPill({
  label,
  tone,
}: Readonly<{
  label: string;
  tone: "ok" | "warn" | "error" | "muted";
}>) {
  const classes =
    tone === "ok"
      ? "bg-primary-container text-on-primary-container"
      : tone === "warn"
        ? "bg-secondary-container text-on-secondary-container"
        : tone === "error"
          ? "bg-error-container text-on-error-container"
          : "bg-surface-container-high text-on-surface-variant";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${classes}`}>
      {label}
    </span>
  );
}

function ModalShell({
  title,
  pending,
  onClose,
  onSave,
  children,
}: Readonly<{
  title: string;
  pending: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-md sm:items-center">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between gap-sm">
          <h2 className="font-headline-sm text-headline-sm text-primary">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5">
            <MaterialIcon name="close" className="text-[22px]" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">{children}</div>
        <div className="mt-md flex justify-end gap-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-surface-container px-sm py-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onSave}
            className="rounded-lg bg-primary px-sm py-2 font-semibold text-on-primary disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: Readonly<{
  label: string;
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm";

function MemberFormModal({
  draft,
  farms,
  workers,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstCopasstMemberDraft;
  farms: SstFarm[];
  workers: SstWorker[];
  pending: boolean;
  onChange: (draft: SstCopasstMemberDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <ModalShell
      title={draft.id ? "Editar integrante" : "Nuevo integrante"}
      pending={pending}
      onClose={onClose}
      onSave={onSave}
    >
      <Field label="Trabajador" className="sm:col-span-2">
        <WorkerSelect
          workers={workers}
          value={draft.workerId}
          required
          onChange={(worker) =>
            onChange({
              ...draft,
              workerId: worker?.id ?? "",
              companySnapshot: worker?.company ?? draft.companySnapshot,
              jobTitleSnapshot: worker?.jobTitle ?? draft.jobTitleSnapshot,
              farmId: worker?.farmId ?? draft.farmId,
            })
          }
        />
      </Field>
      <Field label="Rol">
        <select
          className={inputClass}
          value={draft.role}
          onChange={(event) =>
            onChange({
              ...draft,
              role: event.target.value as SstCopasstMemberDraft["role"],
            })
          }
        >
          {COPASST_ROLES.map((role) => (
            <option key={role} value={role}>
              {COPASST_ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Estado">
        <select
          className={inputClass}
          value={draft.status}
          onChange={(event) =>
            onChange({
              ...draft,
              status: event.target
                .value as SstCopasstMemberDraft["status"],
            })
          }
        >
          {COPASST_MEMBER_MANUAL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {COPASST_MEMBER_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Periodo (etiqueta)">
        <input
          className={inputClass}
          value={draft.periodLabel}
          onChange={(event) =>
            onChange({ ...draft, periodLabel: event.target.value })
          }
        />
      </Field>
      <Field label="Centro de trabajo">
        <select
          className={inputClass}
          value={draft.farmId ?? ""}
          onChange={(event) =>
            onChange({
              ...draft,
              farmId: event.target.value || null,
            })
          }
        >
          <option value="">Sin centro</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Inicio">
        <input
          type="date"
          className={inputClass}
          value={draft.startDate}
          onChange={(event) =>
            onChange({ ...draft, startDate: event.target.value })
          }
        />
      </Field>
      <Field label="Fin">
        <input
          type="date"
          className={inputClass}
          value={draft.endDate}
          onChange={(event) =>
            onChange({ ...draft, endDate: event.target.value })
          }
        />
      </Field>
      <Field label="Empresa (snapshot)">
        <input
          className={inputClass}
          value={draft.companySnapshot}
          onChange={(event) =>
            onChange({ ...draft, companySnapshot: event.target.value })
          }
        />
      </Field>
      <Field label="Cargo (snapshot)">
        <input
          className={inputClass}
          value={draft.jobTitleSnapshot}
          onChange={(event) =>
            onChange({ ...draft, jobTitleSnapshot: event.target.value })
          }
        />
      </Field>
      <Field label="Observaciones" className="sm:col-span-2">
        <textarea
          className={inputClass}
          rows={2}
          value={draft.observations}
          onChange={(event) =>
            onChange({ ...draft, observations: event.target.value })
          }
        />
      </Field>
    </ModalShell>
  );
}

function MeetingFormModal({
  draft,
  farms,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstCopasstMeetingDraft;
  farms: SstFarm[];
  pending: boolean;
  onChange: (draft: SstCopasstMeetingDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <ModalShell
      title={draft.id ? "Editar acta / reunión" : "Nueva acta / reunión"}
      pending={pending}
      onClose={onClose}
      onSave={onSave}
    >
      <Field label="Fecha">
        <input
          type="date"
          className={inputClass}
          value={draft.meetingDate}
          onChange={(event) =>
            onChange({ ...draft, meetingDate: event.target.value })
          }
        />
      </Field>
      <Field label="Tipo">
        <select
          className={inputClass}
          value={draft.meetingType}
          onChange={(event) =>
            onChange({
              ...draft,
              meetingType: event.target
                .value as SstCopasstMeetingDraft["meetingType"],
            })
          }
        >
          {COPASST_MEETING_TYPES.map((type) => (
            <option key={type} value={type}>
              {COPASST_MEETING_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Estado">
        <select
          className={inputClass}
          value={draft.status}
          onChange={(event) =>
            onChange({
              ...draft,
              status: event.target.value as SstCopasstMeetingDraft["status"],
            })
          }
        >
          {COPASST_MEETING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {COPASST_MEETING_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Próxima reunión">
        <input
          type="date"
          className={inputClass}
          value={draft.nextMeetingDate ?? ""}
          onChange={(event) =>
            onChange({ ...draft, nextMeetingDate: event.target.value })
          }
        />
      </Field>
      <Field label="Título / tema" className="sm:col-span-2">
        <input
          className={inputClass}
          value={draft.title}
          onChange={(event) =>
            onChange({ ...draft, title: event.target.value })
          }
        />
      </Field>
      <Field label="Resumen" className="sm:col-span-2">
        <textarea
          className={inputClass}
          rows={3}
          value={draft.summary}
          onChange={(event) =>
            onChange({ ...draft, summary: event.target.value })
          }
        />
      </Field>
      <Field label="URL acta">
        <input
          className={inputClass}
          value={draft.actUrl}
          onChange={(event) =>
            onChange({ ...draft, actUrl: event.target.value })
          }
        />
      </Field>
      <Field label="Nombre archivo">
        <input
          className={inputClass}
          value={draft.actName}
          onChange={(event) =>
            onChange({ ...draft, actName: event.target.value })
          }
        />
      </Field>
      <Field label="Centro de trabajo">
        <select
          className={inputClass}
          value={draft.farmId ?? ""}
          onChange={(event) =>
            onChange({ ...draft, farmId: event.target.value || null })
          }
        >
          <option value="">Sin centro</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Observaciones">
        <input
          className={inputClass}
          value={draft.observations}
          onChange={(event) =>
            onChange({ ...draft, observations: event.target.value })
          }
        />
      </Field>
    </ModalShell>
  );
}

function CommitmentFormModal({
  draft,
  farms,
  meetings,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstCopasstCommitmentDraft;
  farms: SstFarm[];
  meetings: SstCopasstMeeting[];
  pending: boolean;
  onChange: (draft: SstCopasstCommitmentDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <ModalShell
      title={draft.id ? "Editar compromiso" : "Nuevo compromiso"}
      pending={pending}
      onClose={onClose}
      onSave={onSave}
    >
      <Field label="Acta vinculada" className="sm:col-span-2">
        <select
          className={inputClass}
          value={draft.meetingId ?? ""}
          onChange={(event) =>
            onChange({ ...draft, meetingId: event.target.value || null })
          }
        >
          <option value="">Sin acta</option>
          {meetings.map((meeting) => (
            <option key={meeting.id} value={meeting.id}>
              {meeting.folio} — {meeting.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Descripción" className="sm:col-span-2">
        <textarea
          className={inputClass}
          rows={3}
          value={draft.description}
          onChange={(event) =>
            onChange({ ...draft, description: event.target.value })
          }
        />
      </Field>
      <Field label="Responsable">
        <input
          className={inputClass}
          value={draft.responsibleName}
          onChange={(event) =>
            onChange({ ...draft, responsibleName: event.target.value })
          }
        />
      </Field>
      <Field label="Estado">
        <select
          className={inputClass}
          value={draft.status}
          onChange={(event) =>
            onChange({
              ...draft,
              status: event.target
                .value as SstCopasstCommitmentDraft["status"],
            })
          }
        >
          {COPASST_COMMITMENT_MANUAL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {COPASST_COMMITMENT_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Vencimiento">
        <input
          type="date"
          className={inputClass}
          value={draft.dueDate}
          onChange={(event) =>
            onChange({ ...draft, dueDate: event.target.value })
          }
        />
      </Field>
      <Field label="Fecha cierre">
        <input
          type="date"
          className={inputClass}
          value={draft.closedAt ?? ""}
          onChange={(event) =>
            onChange({ ...draft, closedAt: event.target.value })
          }
        />
      </Field>
      <Field label="Seguimiento" className="sm:col-span-2">
        <textarea
          className={inputClass}
          rows={2}
          value={draft.followUp}
          onChange={(event) =>
            onChange({ ...draft, followUp: event.target.value })
          }
        />
      </Field>
      <Field label="Evidencia URL">
        <input
          className={inputClass}
          value={draft.evidenceUrl}
          onChange={(event) =>
            onChange({ ...draft, evidenceUrl: event.target.value })
          }
        />
      </Field>
      <Field label="Nombre evidencia">
        <input
          className={inputClass}
          value={draft.evidenceName}
          onChange={(event) =>
            onChange({ ...draft, evidenceName: event.target.value })
          }
        />
      </Field>
      <Field label="Centro de trabajo">
        <select
          className={inputClass}
          value={draft.farmId ?? ""}
          onChange={(event) =>
            onChange({ ...draft, farmId: event.target.value || null })
          }
        >
          <option value="">Sin centro</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Observaciones">
        <input
          className={inputClass}
          value={draft.observations}
          onChange={(event) =>
            onChange({ ...draft, observations: event.target.value })
          }
        />
      </Field>
    </ModalShell>
  );
}

function TrainingFormModal({
  draft,
  pending,
  onChange,
  onClose,
  onSave,
}: Readonly<{
  draft: SstCopasstTrainingDraft;
  pending: boolean;
  onChange: (draft: SstCopasstTrainingDraft) => void;
  onClose: () => void;
  onSave: () => void;
}>) {
  return (
    <ModalShell
      title={draft.id ? "Editar capacitación" : "Nueva capacitación"}
      pending={pending}
      onClose={onClose}
      onSave={onSave}
    >
      <Field label="Título" className="sm:col-span-2">
        <input
          className={inputClass}
          value={draft.title}
          onChange={(event) =>
            onChange({ ...draft, title: event.target.value })
          }
        />
      </Field>
      <Field label="Fecha">
        <input
          type="date"
          className={inputClass}
          value={draft.trainingDate}
          onChange={(event) =>
            onChange({ ...draft, trainingDate: event.target.value })
          }
        />
      </Field>
      <Field label="Estado">
        <select
          className={inputClass}
          value={draft.status}
          onChange={(event) =>
            onChange({
              ...draft,
              status: event.target.value as SstCopasstTrainingDraft["status"],
            })
          }
        >
          {COPASST_TRAINING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {COPASST_TRAINING_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Horas">
        <input
          type="number"
          min={0}
          step={0.5}
          className={inputClass}
          value={draft.hours}
          onChange={(event) =>
            onChange({ ...draft, hours: Number(event.target.value) })
          }
        />
      </Field>
      <Field label="Asistentes">
        <input
          type="number"
          min={0}
          step={1}
          className={inputClass}
          value={draft.attendeesCount}
          onChange={(event) =>
            onChange({
              ...draft,
              attendeesCount: Number(event.target.value),
            })
          }
        />
      </Field>
      <Field label="Instructor" className="sm:col-span-2">
        <input
          className={inputClass}
          value={draft.instructor}
          onChange={(event) =>
            onChange({ ...draft, instructor: event.target.value })
          }
        />
      </Field>
      <Field label="Evidencia URL">
        <input
          className={inputClass}
          value={draft.evidenceUrl}
          onChange={(event) =>
            onChange({ ...draft, evidenceUrl: event.target.value })
          }
        />
      </Field>
      <Field label="Nombre evidencia">
        <input
          className={inputClass}
          value={draft.evidenceName}
          onChange={(event) =>
            onChange({ ...draft, evidenceName: event.target.value })
          }
        />
      </Field>
      <Field label="Observaciones" className="sm:col-span-2">
        <textarea
          className={inputClass}
          rows={2}
          value={draft.observations}
          onChange={(event) =>
            onChange({ ...draft, observations: event.target.value })
          }
        />
      </Field>
    </ModalShell>
  );
}
