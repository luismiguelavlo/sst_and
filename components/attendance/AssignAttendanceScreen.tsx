"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import {
  assignAttendanceFormsAction,
  unassignAttendanceFormAction,
} from "@/lib/attendance/actions";
import type { AttendanceActiveAssignment, AttendanceAssignableForm } from "@/lib/attendance";
import {
  learnerFiltersFrom,
  selectionLabel,
  type AssignableLearner,
  type LearnerAvatar,
} from "@/lib/assignments";

type AssignAttendanceScreenProps = Readonly<{
  learners: readonly AssignableLearner[];
  forms: readonly AttendanceAssignableForm[];
  initialActive: readonly AttendanceActiveAssignment[];
  initialFormId?: string;
}>;

export function AssignAttendanceScreen({
  learners,
  forms,
  initialActive,
  initialFormId,
}: AssignAttendanceScreenProps) {
  const [learnerQuery, setLearnerQuery] = useState("");
  const [formQuery, setFormQuery] = useState("");
  const [learnerFilter, setLearnerFilter] = useState("Todos");
  const [selectedLearnerIds, setSelectedLearnerIds] = useState<readonly string[]>([]);
  const [selectedFormIds, setSelectedFormIds] = useState<readonly string[]>(
    initialFormId && forms.some((form) => form.id === initialFormId) ? [initialFormId] : [],
  );
  const [active, setActive] = useState<readonly AttendanceActiveAssignment[]>(initialActive);
  const [activeOpen, setActiveOpen] = useState(true);
  const [pending, startTransition] = useTransition();
  const [unassigningId, setUnassigningId] = useState<string | null>(null);
  const { showToast } = useToast();

  const filters = useMemo(() => learnerFiltersFrom(learners), [learners]);

  const visibleLearners = useMemo(() => {
    const needle = learnerQuery.trim().toLowerCase();
    return learners.filter((learner) => {
      const matchesCohort = learnerFilter === "Todos" || learner.cohort === learnerFilter;
      if (!matchesCohort) {
        return false;
      }
      if (needle.length === 0) {
        return true;
      }
      return (
        learner.name.toLowerCase().includes(needle) ||
        learner.email.toLowerCase().includes(needle) ||
        learner.cohort.toLowerCase().includes(needle)
      );
    });
  }, [learnerFilter, learnerQuery, learners]);

  const visibleForms = useMemo(() => {
    const needle = formQuery.trim().toLowerCase();
    if (needle.length === 0) {
      return forms;
    }
    return forms.filter(
      (form) =>
        form.title.toLowerCase().includes(needle) || form.meta.toLowerCase().includes(needle),
    );
  }, [formQuery, forms]);

  const canAssign = selectedLearnerIds.length > 0 && selectedFormIds.length > 0 && !pending;

  function toggleId(current: readonly string[], id: string): readonly string[] {
    return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  }

  function selectAllVisibleLearners() {
    const visibleIds = visibleLearners.map((learner) => learner.id);
    const allSelected = visibleIds.every((id) => selectedLearnerIds.includes(id));
    if (allSelected) {
      setSelectedLearnerIds((current) => current.filter((id) => !visibleIds.includes(id)));
      return;
    }
    setSelectedLearnerIds((current) => [...new Set([...current, ...visibleIds])]);
  }

  function cycleLearnerFilter() {
    const index = filters.indexOf(learnerFilter);
    setLearnerFilter(filters.at((index + 1) % filters.length) ?? "Todos");
  }

  function assign() {
    if (!canAssign) {
      return;
    }
    startTransition(async () => {
      const result = await assignAttendanceFormsAction({
        formIds: selectedFormIds,
        userIds: selectedLearnerIds,
      });
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      setActive(result.active);
      setSelectedLearnerIds([]);
      showToast(
        result.created === 0
          ? "Esas asignaciones ya existían."
          : `Se crearon ${result.created} asignación${result.created === 1 ? "" : "es"}.`,
      );
    });
  }

  function unassign(assignmentId: string, label: string) {
    if (!window.confirm(`¿Quitar la asignación de ${label}?`)) {
      return;
    }
    setUnassigningId(assignmentId);
    startTransition(async () => {
      const result = await unassignAttendanceFormAction(assignmentId);
      setUnassigningId(null);
      if (!result.ok) {
        showToast(result.error, { variant: "error" });
        return;
      }
      setActive(result.active);
      showToast("Asignación eliminada.");
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-md">
      <header className="space-y-xs">
        <h1 className="font-display-lg tracking-tight text-on-surface">
          Asignar formularios de asistencia
        </h1>
        <p className="max-w-2xl font-body-lg text-on-surface-variant">
          Elige empleados y formularios publicados. Solo esas personas verán el formulario y
          recibirán la notificación.
        </p>
      </header>

      {activeOpen ? (
        <section className="rounded-xl bg-surface-container-lowest p-md shadow-sm">
          <div className="mb-sm flex items-center justify-between gap-sm">
            <h2 className="font-headline-md text-on-surface">Asignaciones activas</h2>
            <button
              type="button"
              className="font-label-sm text-primary hover:underline"
              onClick={() => setActiveOpen(false)}
            >
              Ocultar
            </button>
          </div>
          {active.length === 0 ? (
            <p className="font-body-sm text-on-surface-variant">Aún no hay asignaciones.</p>
          ) : (
            <ul className="flex max-h-64 flex-col gap-xs overflow-y-auto">
              {active.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-sm rounded-lg bg-surface-container-low px-md py-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-label-md text-on-surface">
                      {item.formTitle} → {item.employeeName}
                    </p>
                    <p className="truncate font-body-sm text-on-surface-variant">
                      {item.employeeEmail} · {item.assignedAt}
                      {item.submitted ? " · Respondido" : " · Pendiente"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg px-sm py-xs font-label-sm text-error hover:bg-error-container disabled:opacity-50"
                    disabled={unassigningId === item.id || pending}
                    onClick={() =>
                      unassign(item.id, `«${item.formTitle}» de ${item.employeeName}`)
                    }
                  >
                    {unassigningId === item.id ? "Quitando..." : "Desasignar"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <button
          type="button"
          className="self-start font-label-sm text-primary hover:underline"
          onClick={() => setActiveOpen(true)}
        >
          Ver asignaciones activas
        </button>
      )}

      <div className="grid flex-1 grid-cols-1 gap-md lg:grid-cols-2">
        <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
          <div className="flex flex-col gap-md bg-surface-container-low p-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">Empleados</h2>
              <span className="rounded-full bg-primary px-sm py-xs font-label-sm text-on-primary">
                {selectionLabel(selectedLearnerIds.length)}
              </span>
            </div>
            <div className="relative">
              <MaterialIcon
                name="search"
                className="absolute top-1/2 left-sm -translate-y-1/2 text-outline"
              />
              <input
                className="w-full rounded-lg bg-surface py-sm pr-md pl-12 font-body-md text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-primary/20"
                placeholder="Buscar empleado..."
                type="search"
                value={learnerQuery}
                onChange={(event) => setLearnerQuery(event.target.value)}
              />
              <button
                className="absolute top-1/2 right-sm -translate-y-1/2 rounded px-sm py-xs font-label-sm text-primary hover:bg-primary/5"
                type="button"
                onClick={cycleLearnerFilter}
              >
                {learnerFilter === "Todos" ? "Filtro" : learnerFilter}
              </button>
            </div>
            <button
              type="button"
              className="self-start font-label-sm text-primary hover:underline"
              onClick={selectAllVisibleLearners}
            >
              Seleccionar visibles
            </button>
          </div>
          <ul className="max-h-[420px] overflow-y-auto p-xs">
            {visibleLearners.map((learner) => (
              <li key={learner.id}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-sm rounded-lg px-sm py-sm text-left transition-colors ${
                    selectedLearnerIds.includes(learner.id)
                      ? "bg-primary/10"
                      : "hover:bg-surface-container"
                  }`}
                  onClick={() =>
                    setSelectedLearnerIds((current) => toggleId(current, learner.id))
                  }
                >
                  <LearnerAvatarView avatar={learner.avatar} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-label-md text-on-surface">
                      {learner.name}
                    </span>
                    <span className="block truncate font-body-sm text-on-surface-variant">
                      {learner.email} · {learner.cohort}
                    </span>
                  </span>
                  <MaterialIcon
                    name={
                      selectedLearnerIds.includes(learner.id)
                        ? "check_box"
                        : "check_box_outline_blank"
                    }
                    className="text-primary"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
          <div className="flex flex-col gap-md bg-surface-container-low p-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">Formularios publicados</h2>
              <span className="rounded-full bg-secondary-container px-sm py-xs font-label-sm text-on-secondary-container">
                {selectionLabel(selectedFormIds.length)}
              </span>
            </div>
            <div className="relative">
              <MaterialIcon
                name="search"
                className="absolute top-1/2 left-sm -translate-y-1/2 text-outline"
              />
              <input
                className="w-full rounded-lg bg-surface py-sm pr-md pl-12 font-body-md text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-primary/20"
                placeholder="Buscar formulario..."
                type="search"
                value={formQuery}
                onChange={(event) => setFormQuery(event.target.value)}
              />
            </div>
          </div>
          {forms.length === 0 ? (
            <p className="p-md font-body-sm text-on-surface-variant">
              No hay formularios publicados. Publícalos en Asistencia primero.
            </p>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto p-xs">
              {visibleForms.map((form) => (
                <li key={form.id}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-sm rounded-lg px-sm py-sm text-left transition-colors ${
                      selectedFormIds.includes(form.id)
                        ? "bg-secondary-container/30"
                        : "hover:bg-surface-container"
                    }`}
                    onClick={() => setSelectedFormIds((current) => toggleId(current, form.id))}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container/20 text-primary">
                      <MaterialIcon name="description" />
                    </div>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-label-md text-on-surface">
                        {form.title}
                      </span>
                      <span className="block truncate font-body-sm text-on-surface-variant">
                        {form.meta}
                      </span>
                    </span>
                    <MaterialIcon
                      name={
                        selectedFormIds.includes(form.id)
                          ? "check_box"
                          : "check_box_outline_blank"
                      }
                      className="text-secondary"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="sticky bottom-md flex justify-end">
        <button
          type="button"
          disabled={!canAssign}
          className="rounded-lg bg-primary px-lg py-sm font-label-md text-on-primary shadow-md transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
          onClick={assign}
        >
          {pending ? "Asignando..." : "Asignar y notificar"}
        </button>
      </div>
    </div>
  );
}

function LearnerAvatarView({ avatar }: Readonly<{ avatar: LearnerAvatar }>) {
  if (avatar.kind === "photo") {
    return (
      <Image
        src={avatar.src}
        alt={avatar.alt}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full font-label-sm ${avatar.className}`}
    >
      {avatar.initials}
    </div>
  );
}
