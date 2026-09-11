"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { WorkerSelect } from "@/components/sg-sst/workers/WorkerSelect";
import { useToast } from "@/components/ui/ToastProvider";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  bulkImportCclCasesAction,
  bulkImportCclCommitmentsAction,
  bulkImportCclMeetingsAction,
  bulkImportCclMembersAction,
  deleteCaseAction,
  deleteCommitmentAction,
  deleteMeetingAction,
  deleteMemberAction,
  saveCaseAction,
  saveCommitmentAction,
  saveMeetingAction,
  saveMemberAction,
} from "@/lib/sg-sst/ccl/actions";
import { CCL_EXCEL_MAX_ROWS } from "@/lib/sg-sst/ccl/excel";
import {
  downloadCclTemplate,
  downloadCclWorkbook,
  parseCclWorkbookFile,
  type CclWorkbookImport,
} from "@/lib/sg-sst/ccl/excel-client";
import {
  formatChunkImportToast,
  runChunkedBulkImport,
} from "@/lib/sg-sst/import-chunks";
import {
  CCL_CASE_STATUS_LABELS,
  CCL_CASE_STATUSES,
  CCL_COMMITMENT_MANUAL_STATUSES,
  CCL_COMMITMENT_STATUS_LABELS,
  CCL_MEETING_STATUS_LABELS,
  CCL_MEETING_STATUSES,
  CCL_MEETING_TYPE_LABELS,
  CCL_MEETING_TYPES,
  CCL_MEMBER_ROLE_LABELS,
  CCL_MEMBER_ROLES,
  CCL_MEMBER_STATUS_LABELS,
  draftFromCase,
  draftFromCommitment,
  draftFromMeeting,
  draftFromMember,
  emptyCaseDraft,
  emptyCommitmentDraft,
  emptyMeetingDraft,
  emptyMemberDraft,
  type CclCaseStatus,
  type CclCommitmentManualStatus,
  type CclCommitmentStatus,
  type CclMeetingStatus,
  type CclMeetingType,
  type CclMemberRole,
  type CclMemberStatus,
  type CclStats,
  type SstCclCaseDraft,
  type SstCclCaseView,
  type SstCclCommitmentDraft,
  type SstCclCommitmentView,
  type SstCclMeeting,
  type SstCclMeetingDraft,
  type SstCclMember,
  type SstCclMemberDraft,
} from "@/lib/sg-sst/ccl/types";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

type TabId = "integrantes" | "actas" | "casos" | "compromisos";

type CclMasterScreenProps = {
  members: SstCclMember[];
  meetings: SstCclMeeting[];
  cases: SstCclCaseView[];
  commitments: SstCclCommitmentView[];
  stats: CclStats;
  farms: SstFarm[];
  workers: SstWorker[];
};

const PRIVACY_BANNER =
  "Protocolo de privacidad: el tablero solo muestra estadísticas y códigos; no expone identidades ni hechos sensibles.";

export function CclMasterScreen({
  members,
  meetings,
  cases,
  commitments,
  stats,
  farms,
  workers,
}: Readonly<CclMasterScreenProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<TabId>("integrantes");
  const [query, setQuery] = useState("");

  const [editingMember, setEditingMember] = useState<SstCclMemberDraft | null>(
    null,
  );
  const [editingMeeting, setEditingMeeting] =
    useState<SstCclMeetingDraft | null>(null);
  const [editingCase, setEditingCase] = useState<SstCclCaseDraft | null>(null);
  const [editingCommitment, setEditingCommitment] =
    useState<SstCclCommitmentDraft | null>(null);

  const [importPreview, setImportPreview] = useState<CclWorkbookImport | null>(
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
        CCL_MEMBER_ROLE_LABELS[item.role].toLowerCase().includes(q) ||
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
        item.summary.toLowerCase().includes(q) ||
        CCL_MEETING_TYPE_LABELS[item.meetingType].toLowerCase().includes(q),
    );
  }, [meetings, query]);

  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.activitySummary.toLowerCase().includes(q) ||
        CCL_CASE_STATUS_LABELS[item.status].toLowerCase().includes(q) ||
        (item.meetingFolio?.toLowerCase().includes(q) ?? false),
    );
  }, [cases, query]);

  const filteredCommitments = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commitments;
    return commitments.filter(
      (item) =>
        item.folio.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.responsibleName.toLowerCase().includes(q) ||
        (item.caseCode?.toLowerCase().includes(q) ?? false) ||
        (item.meetingFolio?.toLowerCase().includes(q) ?? false),
    );
  }, [commitments, query]);

  function handleExport() {
    downloadCclWorkbook({
      members: filteredMembers,
      meetings: filteredMeetings,
      cases: filteredCases,
      commitments: filteredCommitments,
      fileName: `ccl-sst-${new Date().toISOString().slice(0, 10)}.xlsx`,
    });
    showToast("Exportado libro CCL (Integrantes / Actas / Casos / Compromisos).");
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const workbook = await parseCclWorkbookFile(file);
      const total =
        workbook.members.length +
        workbook.meetings.length +
        workbook.cases.length +
        workbook.commitments.length;
      if (total === 0) {
        showToast("El archivo no tiene filas reconocidas.", { variant: "error" });
        return;
      }
      if (total > CCL_EXCEL_MAX_ROWS * 4) {
        showToast("Demasiadas filas en el archivo.", { variant: "error" });
        return;
      }
      setFileName(file.name);
      setImportPreview(workbook);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "No se pudo leer el Excel.", {
        variant: "error",
      });
    } finally {
      event.target.value = "";
    }
  }

  function confirmImport() {
    if (!importPreview) return;
    startTransition(async () => {
      let created = 0;
      let updated = 0;
      let failed = 0;
      let total = 0;

      if (importPreview.members.length > 0) {
        const result = await runChunkedBulkImport(importPreview.members, (chunk) =>
          bulkImportCclMembersAction({ rows: chunk }),
        );
        if (!result.ok) {
          showToast(result.error, { variant: "error" });
          return;
        }
        created += result.created;
        updated += result.updated;
        failed += result.failed;
        total += result.total;
      }
      if (importPreview.meetings.length > 0) {
        const result = await runChunkedBulkImport(importPreview.meetings, (chunk) =>
          bulkImportCclMeetingsAction({ rows: chunk }),
        );
        if (!result.ok) {
          showToast(result.error, { variant: "error" });
          return;
        }
        created += result.created;
        updated += result.updated;
        failed += result.failed;
        total += result.total;
      }
      if (importPreview.cases.length > 0) {
        const result = await runChunkedBulkImport(importPreview.cases, (chunk) =>
          bulkImportCclCasesAction({ rows: chunk }),
        );
        if (!result.ok) {
          showToast(result.error, { variant: "error" });
          return;
        }
        created += result.created;
        updated += result.updated;
        failed += result.failed;
        total += result.total;
      }
      if (importPreview.commitments.length > 0) {
        const result = await runChunkedBulkImport(
          importPreview.commitments,
          (chunk) => bulkImportCclCommitmentsAction({ rows: chunk }),
        );
        if (!result.ok) {
          showToast(result.error, { variant: "error" });
          return;
        }
        created += result.created;
        updated += result.updated;
        failed += result.failed;
        total += result.total;
      }

      showToast(
        formatChunkImportToast({ ok: true, created, updated, failed, total }),
        { variant: failed > 0 ? "info" : "success" },
      );
      setImportPreview(null);
      setFileName("");
      router.refresh();
    });
  }

  function saveMember() {
    if (!editingMember) return;
    startTransition(async () => {
      const result = await saveMemberAction(editingMember);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editingMember.id ? "Integrante actualizado." : "Integrante registrado.");
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
      showToast(editingMeeting.id ? "Acta actualizada." : "Acta registrada.");
      setEditingMeeting(null);
      router.refresh();
    });
  }

  function saveCase() {
    if (!editingCase) return;
    startTransition(async () => {
      const result = await saveCaseAction(editingCase);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast(editingCase.id ? "Caso actualizado." : "Caso registrado (código generado).");
      setEditingCase(null);
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
        editingCommitment.id ? "Compromiso actualizado." : "Compromiso registrado.",
      );
      setEditingCommitment(null);
      router.refresh();
    });
  }

  function removeMember(id: string) {
    if (!window.confirm("¿Eliminar este integrante del CCL?")) return;
    startTransition(async () => {
      const result = await deleteMemberAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Integrante eliminado.");
      router.refresh();
    });
  }

  function removeMeeting(id: string) {
    if (!window.confirm("¿Eliminar esta acta?")) return;
    startTransition(async () => {
      const result = await deleteMeetingAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Acta eliminada.");
      router.refresh();
    });
  }

  function removeCase(id: string) {
    if (!window.confirm("¿Eliminar este caso (solo código administrativo)?")) return;
    startTransition(async () => {
      const result = await deleteCaseAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Caso eliminado.");
      router.refresh();
    });
  }

  function removeCommitment(id: string) {
    if (!window.confirm("¿Eliminar este compromiso?")) return;
    startTransition(async () => {
      const result = await deleteCommitmentAction(id);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      showToast("Compromiso eliminado.");
      router.refresh();
    });
  }

  const previewCount = importPreview
    ? importPreview.members.length +
      importPreview.meetings.length +
      importPreview.cases.length +
      importPreview.commitments.length
    : 0;

  function openCreateForTab() {
    if (tab === "integrantes") setEditingMember(emptyMemberDraft());
    else if (tab === "actas") setEditingMeeting(emptyMeetingDraft());
    else if (tab === "casos") setEditingCase(emptyCaseDraft());
    else setEditingCommitment(emptyCommitmentDraft());
  }

  return (
    <div className="flex w-full flex-col gap-md px-gutter py-md pb-xl">
      <header className="flex flex-col justify-between gap-md rounded-xl bg-surface-container-low p-gutter shadow-sm lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-base py-xs font-label-sm text-label-sm uppercase tracking-wide text-on-primary">
              Capítulo 21 · CCL
            </span>
            <span className="rounded-full bg-surface-container-highest px-base py-xs font-label-sm text-label-sm text-on-surface-variant">
              Ley 1010 · Res. 652/1356
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Comité de Convivencia Laboral (CCL)
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Prevención del acoso laboral, actas trimestrales y trazabilidad paramétrica de
            términos — sin exponer identidades ni hechos sensibles.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => downloadCclTemplate()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-3.5 py-2.5 font-label-md text-label-md text-primary shadow-sm"
          >
            <MaterialIcon name="table_view" className="text-[18px]" />
            Plantilla
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-highest px-3.5 py-2.5 font-label-md text-label-md text-on-surface"
          >
            <MaterialIcon name="upload_file" className="text-[18px]" />
            Importar
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-3.5 py-2.5 font-label-md text-label-md text-primary shadow-sm"
          >
            <MaterialIcon name="download" className="text-[18px]" />
            Exportar .XLSX
          </button>
          <button
            type="button"
            onClick={openCreateForTab}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 font-label-md text-label-md text-on-primary shadow-sm"
          >
            <MaterialIcon name="add" className="text-[18px]" />
            {tab === "integrantes"
              ? "+ Integrante"
              : tab === "actas"
                ? "+ Acta"
                : tab === "casos"
                  ? "+ Caso (anon)"
                  : "+ Compromiso"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </header>

      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-secondary-container p-md text-on-primary shadow-md">
        <div className="relative z-10 flex flex-col items-start gap-md md:flex-row md:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest/10">
            <MaterialIcon name="security" className="text-[30px] text-primary-fixed" />
          </div>
          <div className="flex flex-1 flex-col gap-xs">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-primary-container">
              Reserva legal Art. 6 Res. 652/2012
            </span>
            <p className="font-body-sm text-body-sm leading-relaxed text-inverse-on-surface">
              {PRIVACY_BANNER}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-sm sm:grid-cols-2 xl:grid-cols-5">
        <Kpi
          label="Vigencia CCL"
          value={stats.vigenciaLabel}
          detail={stats.vigenciaDetail}
          icon="event_available"
        />
        <Kpi
          label="Casos abiertos"
          value={stats.casosAbiertos}
          detail="Solo conteo · sin identidades"
          icon="folder_open"
        />
        <Kpi
          label="Casos en trámite"
          value={stats.casosEnTramite}
          detail="En trámite + seguimiento"
          icon="pending_actions"
        />
        <Kpi
          label="Compromisos abiertos"
          value={stats.compromisosAbiertos}
          detail="Abiertos + vencidos"
          icon="handshake"
        />
        <Kpi
          label="Actas del periodo"
          value={stats.actasPeriodo}
          detail={`${new Date().getFullYear()} · no canceladas`}
          icon="description"
        />
      </section>

      {previewCount > 0 && importPreview ? (
        <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <div className="font-label-md text-label-md font-bold">
                Vista previa: {fileName}
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {importPreview.members.length} integrantes ·{" "}
                {importPreview.meetings.length} actas · {importPreview.cases.length}{" "}
                casos · {importPreview.commitments.length} compromisos
              </div>
            </div>
            <div className="flex gap-xs">
              <button
                type="button"
                className="rounded-lg bg-surface-container px-base py-sm"
                onClick={() => {
                  setImportPreview(null);
                  setFileName("");
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                className="rounded-lg bg-primary px-base py-sm text-on-primary disabled:opacity-60"
                onClick={confirmImport}
              >
                Confirmar importación
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-xs">
        <TabButton
          active={tab === "integrantes"}
          onClick={() => setTab("integrantes")}
          icon="groups"
          label={`Integrantes (${members.length})`}
        />
        <TabButton
          active={tab === "actas"}
          onClick={() => setTab("actas")}
          icon="description"
          label={`Actas (${meetings.length})`}
        />
        <TabButton
          active={tab === "casos"}
          onClick={() => setTab("casos")}
          icon="lock"
          label={`Casos anon (${cases.length})`}
        />
        <TabButton
          active={tab === "compromisos"}
          onClick={() => setTab("compromisos")}
          icon="task_alt"
          label={`Compromisos (${commitments.length})`}
        />
      </div>

      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
        <div className="flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              tab === "casos"
                ? "Buscar por código, etiqueta o estado…"
                : "Buscar…"
            }
            className="w-full max-w-md rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm"
          />
          {tab === "casos" ? (
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Listado anónimo: código, fechas, estado y etiqueta paramétrica únicamente.
            </p>
          ) : null}
        </div>

        {tab === "integrantes" ? (
          <MembersTable
            items={filteredMembers}
            onEdit={(item) => setEditingMember(draftFromMember(item))}
            onDelete={removeMember}
            pending={pending}
          />
        ) : null}
        {tab === "actas" ? (
          <MeetingsTable
            items={filteredMeetings}
            onEdit={(item) => setEditingMeeting(draftFromMeeting(item))}
            onDelete={removeMeeting}
            pending={pending}
          />
        ) : null}
        {tab === "casos" ? (
          <CasesTable
            items={filteredCases}
            onEdit={(item) => setEditingCase(draftFromCase(item))}
            onDelete={removeCase}
            pending={pending}
          />
        ) : null}
        {tab === "compromisos" ? (
          <CommitmentsTable
            items={filteredCommitments}
            onEdit={(item) => setEditingCommitment(draftFromCommitment(item))}
            onDelete={removeCommitment}
            pending={pending}
          />
        ) : null}
      </div>

      {editingMember ? (
        <Modal
          title={editingMember.id ? "Editar integrante" : "Nuevo integrante"}
          onClose={() => setEditingMember(null)}
        >
          <MemberForm
            draft={editingMember}
            setDraft={setEditingMember}
            workers={workers}
            farms={farms}
            pending={pending}
            onSave={saveMember}
          />
        </Modal>
      ) : null}

      {editingMeeting ? (
        <Modal
          title={editingMeeting.id ? "Editar acta" : "Nueva acta"}
          onClose={() => setEditingMeeting(null)}
        >
          <MeetingForm
            draft={editingMeeting}
            setDraft={setEditingMeeting}
            farms={farms}
            pending={pending}
            onSave={saveMeeting}
          />
        </Modal>
      ) : null}

      {editingCase ? (
        <Modal
          title={editingCase.id ? "Editar caso (anon)" : "Nuevo caso (anon)"}
          onClose={() => setEditingCase(null)}
        >
          <CaseForm
            draft={editingCase}
            setDraft={setEditingCase}
            meetings={meetings}
            pending={pending}
            onSave={saveCase}
          />
        </Modal>
      ) : null}

      {editingCommitment ? (
        <Modal
          title={
            editingCommitment.id ? "Editar compromiso" : "Nuevo compromiso"
          }
          onClose={() => setEditingCommitment(null)}
        >
          <CommitmentForm
            draft={editingCommitment}
            setDraft={setEditingCommitment}
            meetings={meetings}
            cases={cases}
            pending={pending}
            onSave={saveCommitment}
          />
        </Modal>
      ) : null}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: Readonly<{
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-base py-sm font-label-md text-label-md ${
        active
          ? "bg-primary text-on-primary shadow-sm"
          : "bg-surface-container-lowest text-on-surface shadow-sm"
      }`}
    >
      <MaterialIcon name={icon} className="text-[18px]" />
      {label}
    </button>
  );
}

function Kpi({
  label,
  value,
  detail,
  icon,
}: Readonly<{
  label: string;
  value: string | number;
  detail: React.ReactNode;
  icon: string;
}>) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-sm shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">
          {label}
        </span>
        <MaterialIcon name={icon} className="text-[20px] text-primary" />
      </div>
      <div className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
        {value}
      </div>
      <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
        {detail}
      </div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: Readonly<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-md sm:items-center">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-center justify-between gap-sm">
          <h2 className="font-headline-md text-headline-md text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-xs text-on-surface-variant hover:bg-surface-container"
          >
            <MaterialIcon name="close" className="text-[22px]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm";

function MembersTable({
  items,
  onEdit,
  onDelete,
  pending,
}: Readonly<{
  items: SstCclMember[];
  onEdit: (item: SstCclMember) => void;
  onDelete: (id: string) => void;
  pending: boolean;
}>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left font-body-sm text-body-sm">
        <thead>
          <tr className="bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            <th className="p-sm">Miembro</th>
            <th className="p-sm">Rol</th>
            <th className="p-sm">Periodo</th>
            <th className="p-sm">Vigencia</th>
            <th className="p-sm">Estado</th>
            <th className="p-sm text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-md text-on-surface-variant">
                Sin integrantes registrados.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low">
                <td className="p-sm">
                  <div className="font-semibold text-primary">{item.workerName}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">
                    {item.jobTitleSnapshot || item.workerDocument}
                  </div>
                </td>
                <td className="p-sm">
                  <RoleBadge role={item.role} />
                </td>
                <td className="p-sm">{item.periodLabel || "—"}</td>
                <td className="p-sm">
                  {item.startDate} → {item.endDate}
                </td>
                <td className="p-sm">
                  <MemberStatusBadge status={item.status} />
                </td>
                <td className="p-sm text-right">
                  <button
                    type="button"
                    disabled={pending}
                    className="mr-1 rounded p-xs text-primary hover:bg-surface-container"
                    onClick={() => onEdit(item)}
                  >
                    <MaterialIcon name="edit" className="text-[18px]" />
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    className="rounded p-xs text-error hover:bg-surface-container"
                    onClick={() => onDelete(item.id)}
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function MeetingsTable({
  items,
  onEdit,
  onDelete,
  pending,
}: Readonly<{
  items: SstCclMeeting[];
  onEdit: (item: SstCclMeeting) => void;
  onDelete: (id: string) => void;
  pending: boolean;
}>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left font-body-sm text-body-sm">
        <thead>
          <tr className="bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            <th className="p-sm">Folio</th>
            <th className="p-sm">Fecha</th>
            <th className="p-sm">Tipo</th>
            <th className="p-sm">Título</th>
            <th className="p-sm">Estado</th>
            <th className="p-sm text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-md text-on-surface-variant">
                Sin actas registradas.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low">
                <td className="p-sm font-mono font-semibold text-primary">
                  {item.folio}
                </td>
                <td className="p-sm">{item.meetingDate}</td>
                <td className="p-sm">
                  {CCL_MEETING_TYPE_LABELS[item.meetingType]}
                </td>
                <td className="p-sm">
                  <div>{item.title}</div>
                  {item.summary ? (
                    <div className="line-clamp-1 font-label-sm text-label-sm text-on-surface-variant">
                      {item.summary}
                    </div>
                  ) : null}
                </td>
                <td className="p-sm">
                  <MeetingStatusBadge status={item.status} />
                </td>
                <td className="p-sm text-right">
                  <button
                    type="button"
                    disabled={pending}
                    className="mr-1 rounded p-xs text-primary hover:bg-surface-container"
                    onClick={() => onEdit(item)}
                  >
                    <MaterialIcon name="edit" className="text-[18px]" />
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    className="rounded p-xs text-error hover:bg-surface-container"
                    onClick={() => onDelete(item.id)}
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function CasesTable({
  items,
  onEdit,
  onDelete,
  pending,
}: Readonly<{
  items: SstCclCaseView[];
  onEdit: (item: SstCclCaseView) => void;
  onDelete: (id: string) => void;
  pending: boolean;
}>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left font-body-sm text-body-sm">
        <thead>
          <tr className="bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            <th className="p-sm">Código</th>
            <th className="p-sm">Apertura</th>
            <th className="p-sm">Vencimiento</th>
            <th className="p-sm">Estado</th>
            <th className="p-sm">Actividad</th>
            <th className="p-sm">Nota admin</th>
            <th className="p-sm text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-md text-on-surface-variant">
                Sin casos registrados.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low">
                <td className="p-sm">
                  <span className="rounded bg-primary px-xs py-0.5 font-mono font-label-sm text-label-sm text-on-primary">
                    {item.code}
                  </span>
                </td>
                <td className="p-sm">{item.openedAt}</td>
                <td className="p-sm">
                  {item.dueDate ?? "—"}
                  {item.daysRemaining !== null ? (
                    <div className="font-label-sm text-label-sm text-on-surface-variant">
                      {item.daysRemaining < 0
                        ? `${Math.abs(item.daysRemaining)} d vencido`
                        : `${item.daysRemaining} d`}
                    </div>
                  ) : null}
                </td>
                <td className="p-sm">
                  <CaseStatusBadge status={item.status} />
                </td>
                <td className="p-sm">{item.activitySummary}</td>
                <td className="p-sm max-w-[12rem] truncate text-on-surface-variant">
                  {item.followUp || "—"}
                </td>
                <td className="p-sm text-right">
                  <button
                    type="button"
                    disabled={pending}
                    className="mr-1 rounded p-xs text-primary hover:bg-surface-container"
                    onClick={() => onEdit(item)}
                  >
                    <MaterialIcon name="edit" className="text-[18px]" />
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    className="rounded p-xs text-error hover:bg-surface-container"
                    onClick={() => onDelete(item.id)}
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function CommitmentsTable({
  items,
  onEdit,
  onDelete,
  pending,
}: Readonly<{
  items: SstCclCommitmentView[];
  onEdit: (item: SstCclCommitmentView) => void;
  onDelete: (id: string) => void;
  pending: boolean;
}>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left font-body-sm text-body-sm">
        <thead>
          <tr className="bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            <th className="p-sm">Folio</th>
            <th className="p-sm">Descripción</th>
            <th className="p-sm">Responsable</th>
            <th className="p-sm">Vence</th>
            <th className="p-sm">Estado</th>
            <th className="p-sm">Caso / Acta</th>
            <th className="p-sm text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-md text-on-surface-variant">
                Sin compromisos registrados.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low">
                <td className="p-sm font-mono font-semibold text-primary">
                  {item.folio}
                </td>
                <td className="p-sm max-w-xs">
                  <div className="line-clamp-2">{item.description}</div>
                </td>
                <td className="p-sm">{item.responsibleName}</td>
                <td className="p-sm">
                  {item.dueDate}
                  {item.daysRemaining !== null ? (
                    <div className="font-label-sm text-label-sm text-on-surface-variant">
                      {item.daysRemaining < 0
                        ? `${Math.abs(item.daysRemaining)} d vencido`
                        : `${item.daysRemaining} d`}
                    </div>
                  ) : null}
                </td>
                <td className="p-sm">
                  <CommitmentStatusBadge status={item.effectiveStatus} />
                </td>
                <td className="p-sm font-label-sm text-label-sm text-on-surface-variant">
                  {[item.caseCode, item.meetingFolio].filter(Boolean).join(" · ") ||
                    "—"}
                </td>
                <td className="p-sm text-right">
                  <button
                    type="button"
                    disabled={pending}
                    className="mr-1 rounded p-xs text-primary hover:bg-surface-container"
                    onClick={() => onEdit(item)}
                  >
                    <MaterialIcon name="edit" className="text-[18px]" />
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    className="rounded p-xs text-error hover:bg-surface-container"
                    onClick={() => onDelete(item.id)}
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function MemberForm({
  draft,
  setDraft,
  workers,
  farms,
  pending,
  onSave,
}: Readonly<{
  draft: SstCclMemberDraft;
  setDraft: (d: SstCclMemberDraft) => void;
  workers: SstWorker[];
  farms: SstFarm[];
  pending: boolean;
  onSave: () => void;
}>) {
  return (
    <div className="flex flex-col gap-sm">
      <Field label="Trabajador *">
        <WorkerSelect
          workers={workers}
          value={draft.workerId}
          onChange={(worker) =>
            setDraft({
              ...draft,
              workerId: worker?.id ?? "",
              farmId: worker?.farmId ?? draft.farmId,
            })
          }
          required
        />
      </Field>
      <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
        <Field label="Rol *">
          <select
            className={inputClass}
            value={draft.role}
            onChange={(e) =>
              setDraft({ ...draft, role: e.target.value as CclMemberRole })
            }
          >
            {CCL_MEMBER_ROLES.map((role) => (
              <option key={role} value={role}>
                {CCL_MEMBER_ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estado">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(e) =>
              setDraft({
                ...draft,
                status: e.target.value as CclMemberStatus,
              })
            }
          >
            <option value="activo">{CCL_MEMBER_STATUS_LABELS.activo}</option>
            <option value="retirado">{CCL_MEMBER_STATUS_LABELS.retirado}</option>
          </select>
        </Field>
        <Field label="Periodo">
          <input
            className={inputClass}
            value={draft.periodLabel}
            onChange={(e) => setDraft({ ...draft, periodLabel: e.target.value })}
            placeholder="2026 - 2028"
          />
        </Field>
        <Field label="Centro de trabajo">
          <select
            className={inputClass}
            value={draft.farmId ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, farmId: e.target.value || null })
            }
          >
            <option value="">—</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Inicio *">
          <input
            type="date"
            className={inputClass}
            value={draft.startDate}
            onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
          />
        </Field>
        <Field label="Fin *">
          <input
            type="date"
            className={inputClass}
            value={draft.endDate}
            onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Observaciones">
        <textarea
          className={inputClass}
          rows={2}
          value={draft.observations}
          onChange={(e) => setDraft({ ...draft, observations: e.target.value })}
        />
      </Field>
      <div className="mt-sm flex justify-end gap-xs">
        <button
          type="button"
          disabled={pending}
          className="rounded-lg bg-primary px-base py-sm font-label-md text-label-md text-on-primary disabled:opacity-60"
          onClick={onSave}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

function MeetingForm({
  draft,
  setDraft,
  farms,
  pending,
  onSave,
}: Readonly<{
  draft: SstCclMeetingDraft;
  setDraft: (d: SstCclMeetingDraft) => void;
  farms: SstFarm[];
  pending: boolean;
  onSave: () => void;
}>) {
  return (
    <div className="flex flex-col gap-sm">
      <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
        <Field label="Fecha *">
          <input
            type="date"
            className={inputClass}
            value={draft.meetingDate}
            onChange={(e) =>
              setDraft({ ...draft, meetingDate: e.target.value })
            }
          />
        </Field>
        <Field label="Tipo *">
          <select
            className={inputClass}
            value={draft.meetingType}
            onChange={(e) =>
              setDraft({
                ...draft,
                meetingType: e.target.value as CclMeetingType,
              })
            }
          >
            {CCL_MEETING_TYPES.map((type) => (
              <option key={type} value={type}>
                {CCL_MEETING_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estado">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(e) =>
              setDraft({
                ...draft,
                status: e.target.value as CclMeetingStatus,
              })
            }
          >
            {CCL_MEETING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {CCL_MEETING_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Centro de trabajo">
          <select
            className={inputClass}
            value={draft.farmId ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, farmId: e.target.value || null })
            }
          >
            <option value="">—</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Título *">
        <input
          className={inputClass}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </Field>
      <Field label="Resumen">
        <textarea
          className={inputClass}
          rows={3}
          value={draft.summary}
          onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
        />
      </Field>
      <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
        <Field label="URL del acta">
          <input
            className={inputClass}
            value={draft.actUrl}
            onChange={(e) => setDraft({ ...draft, actUrl: e.target.value })}
          />
        </Field>
        <Field label="Nombre archivo">
          <input
            className={inputClass}
            value={draft.actName}
            onChange={(e) => setDraft({ ...draft, actName: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Observaciones">
        <textarea
          className={inputClass}
          rows={2}
          value={draft.observations}
          onChange={(e) => setDraft({ ...draft, observations: e.target.value })}
        />
      </Field>
      <div className="mt-sm flex justify-end gap-xs">
        <button
          type="button"
          disabled={pending}
          className="rounded-lg bg-primary px-base py-sm font-label-md text-label-md text-on-primary disabled:opacity-60"
          onClick={onSave}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

function CaseForm({
  draft,
  setDraft,
  meetings,
  pending,
  onSave,
}: Readonly<{
  draft: SstCclCaseDraft;
  setDraft: (d: SstCclCaseDraft) => void;
  meetings: SstCclMeeting[];
  pending: boolean;
  onSave: () => void;
}>) {
  return (
    <div className="flex flex-col gap-sm">
      <div className="rounded-lg bg-surface-container-low p-sm font-label-sm text-label-sm text-on-surface-variant">
        No registre nombres, testimonios ni hechos sensibles. Solo códigos, fechas,
        estado y etiquetas paramétricas (p. ej. «En trámite · Término legal»).
      </div>
      <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
        <Field label="Apertura *">
          <input
            type="date"
            className={inputClass}
            value={draft.openedAt}
            onChange={(e) => setDraft({ ...draft, openedAt: e.target.value })}
          />
        </Field>
        <Field label="Vencimiento (término)">
          <input
            type="date"
            className={inputClass}
            value={draft.dueDate ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, dueDate: e.target.value || null })
            }
          />
        </Field>
        <Field label="Estado *">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(e) =>
              setDraft({ ...draft, status: e.target.value as CclCaseStatus })
            }
          >
            {CCL_CASE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {CCL_CASE_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fecha cierre">
          <input
            type="date"
            className={inputClass}
            value={draft.closedAt ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, closedAt: e.target.value || null })
            }
          />
        </Field>
      </div>
      <Field label="Resumen actividad (etiqueta paramétrica) *">
        <input
          className={inputClass}
          maxLength={200}
          value={draft.activitySummary}
          onChange={(e) =>
            setDraft({ ...draft, activitySummary: e.target.value })
          }
          placeholder="En trámite · Término legal"
        />
      </Field>
      <Field label="Nota administrativa (seguimiento)">
        <textarea
          className={inputClass}
          rows={2}
          value={draft.followUp}
          onChange={(e) => setDraft({ ...draft, followUp: e.target.value })}
          placeholder="Bitácora paramétrica — sin datos sensibles"
        />
      </Field>
      <Field label="Acta relacionada">
        <select
          className={inputClass}
          value={draft.meetingId ?? ""}
          onChange={(e) =>
            setDraft({ ...draft, meetingId: e.target.value || null })
          }
        >
          <option value="">—</option>
          {meetings.map((m) => (
            <option key={m.id} value={m.id}>
              {m.folio} · {m.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Observaciones admin">
        <textarea
          className={inputClass}
          rows={2}
          value={draft.observations}
          onChange={(e) => setDraft({ ...draft, observations: e.target.value })}
        />
      </Field>
      <div className="mt-sm flex justify-end gap-xs">
        <button
          type="button"
          disabled={pending}
          className="rounded-lg bg-primary px-base py-sm font-label-md text-label-md text-on-primary disabled:opacity-60"
          onClick={onSave}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

function CommitmentForm({
  draft,
  setDraft,
  meetings,
  cases,
  pending,
  onSave,
}: Readonly<{
  draft: SstCclCommitmentDraft;
  setDraft: (d: SstCclCommitmentDraft) => void;
  meetings: SstCclMeeting[];
  cases: SstCclCaseView[];
  pending: boolean;
  onSave: () => void;
}>) {
  return (
    <div className="flex flex-col gap-sm">
      <Field label="Descripción *">
        <textarea
          className={inputClass}
          rows={3}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </Field>
      <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
        <Field label="Responsable *">
          <input
            className={inputClass}
            value={draft.responsibleName}
            onChange={(e) =>
              setDraft({ ...draft, responsibleName: e.target.value })
            }
          />
        </Field>
        <Field label="Vencimiento *">
          <input
            type="date"
            className={inputClass}
            value={draft.dueDate}
            onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
          />
        </Field>
        <Field label="Estado">
          <select
            className={inputClass}
            value={draft.status}
            onChange={(e) =>
              setDraft({
                ...draft,
                status: e.target.value as CclCommitmentManualStatus,
              })
            }
          >
            {CCL_COMMITMENT_MANUAL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {CCL_COMMITMENT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fecha cierre">
          <input
            type="date"
            className={inputClass}
            value={draft.closedAt ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, closedAt: e.target.value || null })
            }
          />
        </Field>
        <Field label="Acta">
          <select
            className={inputClass}
            value={draft.meetingId ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, meetingId: e.target.value || null })
            }
          >
            <option value="">—</option>
            {meetings.map((m) => (
              <option key={m.id} value={m.id}>
                {m.folio}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Caso (código)">
          <select
            className={inputClass}
            value={draft.caseId ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, caseId: e.target.value || null })
            }
          >
            <option value="">—</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Seguimiento">
        <textarea
          className={inputClass}
          rows={2}
          value={draft.followUp}
          onChange={(e) => setDraft({ ...draft, followUp: e.target.value })}
        />
      </Field>
      <Field label="Observaciones">
        <textarea
          className={inputClass}
          rows={2}
          value={draft.observations}
          onChange={(e) => setDraft({ ...draft, observations: e.target.value })}
        />
      </Field>
      <div className="mt-sm flex justify-end gap-xs">
        <button
          type="button"
          disabled={pending}
          className="rounded-lg bg-primary px-base py-sm font-label-md text-label-md text-on-primary disabled:opacity-60"
          onClick={onSave}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

function RoleBadge({ role }: Readonly<{ role: CclMemberRole }>) {
  const highlight =
    role === "presidente" || role === "secretario"
      ? "bg-primary text-on-primary"
      : "bg-surface-container-high text-on-surface";
  return (
    <span
      className={`inline-flex rounded px-xs py-0.5 font-label-sm text-label-sm ${highlight}`}
    >
      {CCL_MEMBER_ROLE_LABELS[role]}
    </span>
  );
}

function MemberStatusBadge({
  status,
}: Readonly<{ status: CclMemberStatus }>) {
  const styles: Record<CclMemberStatus, string> = {
    activo: "bg-surface-container-high text-primary",
    retirado: "bg-surface-container text-on-surface-variant",
    periodo_vencido: "bg-error-container text-on-error-container",
  };
  return (
    <span
      className={`inline-flex rounded-full px-base py-xs text-[11px] font-bold ${styles[status]}`}
    >
      {CCL_MEMBER_STATUS_LABELS[status]}
    </span>
  );
}

function MeetingStatusBadge({
  status,
}: Readonly<{ status: CclMeetingStatus }>) {
  const styles: Record<CclMeetingStatus, string> = {
    programada: "bg-secondary-fixed text-on-secondary-fixed",
    realizada: "bg-surface-container-high text-primary",
    cancelada: "bg-surface-container text-on-surface-variant",
  };
  return (
    <span
      className={`inline-flex rounded-full px-base py-xs text-[11px] font-bold ${styles[status]}`}
    >
      {CCL_MEETING_STATUS_LABELS[status]}
    </span>
  );
}

function CaseStatusBadge({ status }: Readonly<{ status: CclCaseStatus }>) {
  const styles: Record<CclCaseStatus, string> = {
    abierto: "bg-secondary-fixed text-on-secondary-fixed",
    en_tramite: "bg-primary text-on-primary",
    seguimiento: "bg-surface-container-highest text-primary",
    cerrado: "bg-surface-container-high text-on-surface",
    archivado: "bg-surface-container text-on-surface-variant",
  };
  return (
    <span
      className={`inline-flex rounded-full px-base py-xs text-[11px] font-bold ${styles[status]}`}
    >
      {CCL_CASE_STATUS_LABELS[status]}
    </span>
  );
}

function CommitmentStatusBadge({
  status,
}: Readonly<{ status: CclCommitmentStatus }>) {
  const styles: Record<CclCommitmentStatus, string> = {
    abierto: "bg-surface-container-high text-primary",
    vencido: "bg-error-container text-on-error-container",
    cerrado: "bg-surface-container text-on-surface-variant",
  };
  return (
    <span
      className={`inline-flex rounded-full px-base py-xs text-[11px] font-bold ${styles[status]}`}
    >
      {CCL_COMMITMENT_STATUS_LABELS[status]}
    </span>
  );
}
