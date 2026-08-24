"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import {
  createDefaultAttendanceDraft,
  responsesToCsv,
  validateAttendanceDraft,
  validateAttendanceSubmission,
  type AttendanceActiveAssignment,
  type AttendanceFormDraft,
  type AttendanceFormListItem,
  type AttendanceSubmissionInput,
} from "@/lib/attendance";
import {
  createAttendanceForm,
  createAttendanceFormAssignments,
  deleteAttendanceForm,
  deleteAttendanceFormAssignment,
  getAttendanceForm,
  getPublishedAttendanceFormForFill,
  hasUserSubmittedAttendanceForm,
  isUserAssignedToAttendanceForm,
  listActiveAttendanceAssignments,
  listAttendanceForms,
  listAttendanceResponsesForExport,
  submitAttendanceResponse,
  updateAttendanceForm,
} from "@/lib/attendance/repository";
import { notifyAttendanceFormPublished } from "@/lib/notifications/repository";

export type AttendanceActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type AttendanceDeleteResult = { ok: true } | { ok: false; error: string };

export type AttendanceSubmitResult = { ok: true } | { ok: false; error: string };

export type AttendanceExportResult =
  | { ok: true; csv: string; fileName: string }
  | { ok: false; error: string };

export type AssignAttendanceResult =
  | { ok: true; created: number; active: AttendanceActiveAssignment[] }
  | { ok: false; error: string };

export type UnassignAttendanceResult =
  | { ok: true; active: AttendanceActiveAssignment[] }
  | { ok: false; error: string };

export async function saveAttendanceFormAction(
  input: AttendanceFormDraft,
): Promise<AttendanceActionResult> {
  const admin = await requireAdmin();
  const error = validateAttendanceDraft(input);
  if (error) {
    return { ok: false, error };
  }

  try {
    const saved = input.id
      ? await updateAttendanceForm(input.id, input)
      : await createAttendanceForm(input, admin.id);

    revalidatePath("/attendance-forms");
    revalidatePath(`/attendance-forms/${saved.id}/edit`);
    revalidatePath("/assign-attendance");
    revalidatePath("/my-attendance");
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo guardar el formulario.",
    };
  }
}

export async function deleteAttendanceFormAction(id: string): Promise<AttendanceDeleteResult> {
  await requireAdmin();
  try {
    await deleteAttendanceForm(id);
    revalidatePath("/attendance-forms");
    revalidatePath("/assign-attendance");
    revalidatePath("/my-attendance");
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar el formulario.",
    };
  }
}

export async function loadAttendanceFormsAction(): Promise<AttendanceFormListItem[]> {
  await requireAdmin();
  return listAttendanceForms();
}

export async function loadAttendanceFormAction(id: string): Promise<AttendanceFormDraft | null> {
  await requireAdmin();
  if (id === "new") {
    return createDefaultAttendanceDraft();
  }
  return getAttendanceForm(id);
}

export async function assignAttendanceFormsAction(input: {
  formIds: readonly string[];
  userIds: readonly string[];
}): Promise<AssignAttendanceResult> {
  const admin = await requireAdmin();
  try {
    const result = await createAttendanceFormAssignments({
      formIds: input.formIds,
      userIds: input.userIds,
      assignedBy: admin.id,
    });

    for (const formId of result.notifiedFormIds) {
      const form = await getAttendanceForm(formId);
      if (!form) {
        continue;
      }
      try {
        await notifyAttendanceFormPublished({
          formId,
          formTitle: form.title,
          createdBy: admin.id,
          userIds: input.userIds,
        });
      } catch {
        // La asignación ya quedó; las alertas no deben revertirla.
      }
    }

    revalidatePath("/assign-attendance");
    revalidatePath("/attendance-forms");
    revalidatePath("/my-attendance");
    revalidatePath("/notifications");
    const active = await listActiveAttendanceAssignments();
    return { ok: true, created: result.created, active };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo asignar el formulario.",
    };
  }
}

export async function unassignAttendanceFormAction(
  assignmentId: string,
): Promise<UnassignAttendanceResult> {
  await requireAdmin();
  try {
    await deleteAttendanceFormAssignment(assignmentId);
    revalidatePath("/assign-attendance");
    revalidatePath("/attendance-forms");
    revalidatePath("/my-attendance");
    const active = await listActiveAttendanceAssignments();
    return { ok: true, active };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo quitar la asignación.",
    };
  }
}

export async function submitAttendanceFormAction(
  input: AttendanceSubmissionInput,
): Promise<AttendanceSubmitResult> {
  const user = await requireAuth();
  if (user.role !== "user") {
    return { ok: false, error: "Solo el personal puede diligenciar formularios de asistencia." };
  }

  const form = await getPublishedAttendanceFormForFill(input.formId);
  if (!form) {
    return { ok: false, error: "El formulario no está disponible." };
  }

  if (!(await isUserAssignedToAttendanceForm(form.id, user.id))) {
    return { ok: false, error: "Este formulario no te fue asignado." };
  }

  if (await hasUserSubmittedAttendanceForm(form.id, user.id)) {
    return { ok: false, error: "Ya diligenciaste este formulario." };
  }

  const error = validateAttendanceSubmission(form, input);
  if (error) {
    return { ok: false, error };
  }

  try {
    await submitAttendanceResponse(user.id, normalizeSubmission(form, input));
    revalidatePath("/my-attendance");
    revalidatePath(`/my-attendance/${form.id}`);
    revalidatePath("/attendance-forms");
    revalidatePath("/assign-attendance");
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo enviar el formulario.",
    };
  }
}

/** Envío público por enlace compartido (sin sesión). Preferir /api/attendance/public-submit. */
export async function submitPublicAttendanceFormAction(
  input: AttendanceSubmissionInput,
): Promise<AttendanceSubmitResult> {
  const form = await getPublishedAttendanceFormForFill(input.formId);
  if (!form) {
    return { ok: false, error: "El formulario no está disponible o no está publicado." };
  }

  const error = validateAttendanceSubmission(form, input);
  if (error) {
    return { ok: false, error };
  }

  try {
    await submitAttendanceResponse(null, normalizeSubmission(form, input));
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo enviar el formulario.",
    };
  }
}

function normalizeSubmission(
  form: NonNullable<Awaited<ReturnType<typeof getPublishedAttendanceFormForFill>>>,
  input: AttendanceSubmissionInput,
): AttendanceSubmissionInput {
  return {
    ...input,
    formId: form.id,
    customAnswers: Object.fromEntries(
      form.customFields.map((field) => [field.id, (input.customAnswers[field.id] ?? "").trim()]),
    ),
  };
}

export async function exportAttendanceResponsesAction(
  formIds: readonly string[],
): Promise<AttendanceExportResult> {
  await requireAdmin();
  if (formIds.length === 0) {
    return { ok: false, error: "Selecciona al menos un formulario." };
  }
  try {
    const rows = await listAttendanceResponsesForExport(formIds);
    if (rows.length === 0) {
      return { ok: false, error: "Los formularios seleccionados aún no tienen respuestas." };
    }
    const fieldLabels: Record<string, string> = {};
    for (const formId of formIds) {
      const draft = await getAttendanceForm(formId);
      if (!draft) {
        continue;
      }
      for (const field of draft.customFields) {
        fieldLabels[field.id] = field.label;
      }
    }
    return {
      ok: true,
      csv: responsesToCsv(rows, fieldLabels),
      fileName: `asistencia-respuestas-${new Date().toISOString().slice(0, 10)}.csv`,
    };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo exportar.",
    };
  }
}
