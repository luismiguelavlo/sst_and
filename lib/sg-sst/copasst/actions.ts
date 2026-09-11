"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  COPASST_EXCEL_MAX_ROWS,
  type CopasstCommitmentExcelImportRow,
  type CopasstExcelImportResultRow,
  type CopasstMeetingExcelImportRow,
  type CopasstMemberExcelImportRow,
  type CopasstTrainingExcelImportRow,
} from "@/lib/sg-sst/copasst/excel";
import {
  createCommitment,
  createMeeting,
  createMember,
  createTraining,
  deleteCommitment,
  deleteMeeting,
  deleteMember,
  deleteTraining,
  findCommitmentByFolio,
  findMeetingByFolio,
  findMemberByWorkerAndStart,
  findTrainingByFolio,
  getCopasstStats,
  listCommitmentViews,
  listMeetings,
  listMemberViews,
  listTrainings,
  updateCommitment,
  updateMeeting,
  updateMember,
  updateTraining,
} from "@/lib/sg-sst/copasst/repository";
import {
  validateCommitmentDraft,
  validateMeetingDraft,
  validateMemberDraft,
  validateTrainingDraft,
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
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listActiveWorkersForSelect,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

export type CopasstActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type CopasstSimpleResult = { ok: true } | { ok: false; error: string };

export type BulkImportCopasstResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: CopasstExcelImportResultRow[];
    }
  | { ok: false; error: string };

function revalidateCopasstPaths() {
  revalidatePath("/sg-sst/copasst");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

function resolveFarmId(
  farms: readonly SstFarm[],
  farmName: string | undefined,
): string | null {
  if (!farmName?.trim()) return null;
  const normalized = farmName.trim().toLowerCase();
  const match = farms.find(
    (farm) =>
      farm.name.toLowerCase() === normalized ||
      farm.code.toLowerCase() === normalized,
  );
  return match?.id ?? null;
}

async function resolveWorkerId(ref: string): Promise<string | null> {
  const byCode = await findWorkerByCode(ref);
  if (byCode) return byCode.id;
  const byDoc = await findWorkerByDocumentNumber(ref);
  return byDoc?.id ?? null;
}

export async function loadCopasstMasterData(): Promise<{
  members: SstCopasstMemberView[];
  meetings: SstCopasstMeeting[];
  commitments: SstCopasstCommitmentView[];
  trainings: SstCopasstTraining[];
  stats: CopasstStats;
  farms: SstFarm[];
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [members, meetings, commitments, trainings, stats, farms, workers] =
    await Promise.all([
      listMemberViews(),
      listMeetings(),
      listCommitmentViews(),
      listTrainings(),
      getCopasstStats(),
      listSstFarms(),
      listActiveWorkersForSelect(),
    ]);
  return { members, meetings, commitments, trainings, stats, farms, workers };
}

export async function saveMemberAction(
  draft: SstCopasstMemberDraft,
): Promise<CopasstActionResult> {
  const admin = await requireAdmin();
  const error = validateMemberDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateMember(draft.id, draft, admin.id)
      : await createMember(draft, admin.id);
    revalidateCopasstPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el integrante.",
    };
  }
}

export async function deleteMemberAction(
  id: string,
): Promise<CopasstSimpleResult> {
  await requireAdmin();
  try {
    await deleteMember(id);
    revalidateCopasstPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function saveMeetingAction(
  draft: SstCopasstMeetingDraft,
): Promise<CopasstActionResult> {
  const admin = await requireAdmin();
  const error = validateMeetingDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateMeeting(draft.id, draft, admin.id)
      : await createMeeting(draft, admin.id);
    revalidateCopasstPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el acta / reunión.",
    };
  }
}

export async function deleteMeetingAction(
  id: string,
): Promise<CopasstSimpleResult> {
  await requireAdmin();
  try {
    await deleteMeeting(id);
    revalidateCopasstPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function saveCommitmentAction(
  draft: SstCopasstCommitmentDraft,
): Promise<CopasstActionResult> {
  const admin = await requireAdmin();
  const error = validateCommitmentDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateCommitment(draft.id, draft, admin.id)
      : await createCommitment(draft, admin.id);
    revalidateCopasstPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el compromiso.",
    };
  }
}

export async function deleteCommitmentAction(
  id: string,
): Promise<CopasstSimpleResult> {
  await requireAdmin();
  try {
    await deleteCommitment(id);
    revalidateCopasstPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function saveTrainingAction(
  draft: SstCopasstTrainingDraft,
): Promise<CopasstActionResult> {
  const admin = await requireAdmin();
  const error = validateTrainingDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateTraining(draft.id, draft, admin.id)
      : await createTraining(draft, admin.id);
    revalidateCopasstPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar la capacitación.",
    };
  }
}

export async function deleteTrainingAction(
  id: string,
): Promise<CopasstSimpleResult> {
  await requireAdmin();
  try {
    await deleteTraining(id);
    revalidateCopasstPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function bulkImportCopasstMembersAction(input: {
  rows: CopasstMemberExcelImportRow[];
}): Promise<BulkImportCopasstResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > COPASST_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${COPASST_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: CopasstExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const workerId = await resolveWorkerId(row.workerDocumentOrCode);
      if (!workerId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.workerDocumentOrCode,
          status: "error",
          message: `Trabajador no encontrado: "${row.workerDocumentOrCode}"`,
        });
        continue;
      }

      const farmId = resolveFarmId(farms, row.farmName);
      if (row.farmName?.trim() && !farmId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.workerDocumentOrCode,
          status: "error",
          message: `Centro de trabajo no encontrado: "${row.farmName}"`,
        });
        continue;
      }

      const draft: SstCopasstMemberDraft = {
        ...row.draft,
        workerId,
        farmId,
      };
      const validationError = validateMemberDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.workerDocumentOrCode,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = await findMemberByWorkerAndStart(
          workerId,
          draft.startDate,
        );
        if (existing) {
          const saved = await updateMember(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.workerName,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createMember(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.workerName,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.workerDocumentOrCode,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateCopasstPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

export async function bulkImportCopasstMeetingsAction(input: {
  rows: CopasstMeetingExcelImportRow[];
}): Promise<BulkImportCopasstResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > COPASST_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${COPASST_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: CopasstExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const farmId = resolveFarmId(farms, row.farmName);
      if (row.farmName?.trim() && !farmId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.draft.title,
          status: "error",
          message: `Centro de trabajo no encontrado: "${row.farmName}"`,
        });
        continue;
      }

      const draft: SstCopasstMeetingDraft = { ...row.draft, farmId };
      const validationError = validateMeetingDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.draft.title,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.folio ? await findMeetingByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateMeeting(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createMeeting(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.draft.title,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateCopasstPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

export async function bulkImportCopasstCommitmentsAction(input: {
  rows: CopasstCommitmentExcelImportRow[];
}): Promise<BulkImportCopasstResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > COPASST_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${COPASST_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: CopasstExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const farmId = resolveFarmId(farms, row.farmName);
      if (row.farmName?.trim() && !farmId) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.draft.description.slice(0, 40),
          status: "error",
          message: `Centro de trabajo no encontrado: "${row.farmName}"`,
        });
        continue;
      }

      let meetingId: string | null = null;
      if (row.meetingFolio?.trim()) {
        const meeting = await findMeetingByFolio(row.meetingFolio);
        if (!meeting) {
          failed += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: row.folio ?? row.draft.description.slice(0, 40),
            status: "error",
            message: `Acta no encontrada: "${row.meetingFolio}"`,
          });
          continue;
        }
        meetingId = meeting.id;
      }

      const draft: SstCopasstCommitmentDraft = {
        ...row.draft,
        farmId,
        meetingId,
      };
      const validationError = validateCommitmentDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.draft.description.slice(0, 40),
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.folio
          ? await findCommitmentByFolio(row.folio)
          : null;
        if (existing) {
          const saved = await updateCommitment(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createCommitment(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? row.draft.description.slice(0, 40),
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateCopasstPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

export async function bulkImportCopasstTrainingsAction(input: {
  rows: CopasstTrainingExcelImportRow[];
}): Promise<BulkImportCopasstResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > COPASST_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${COPASST_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: CopasstExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const draft = row.draft;
      const validationError = validateTrainingDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? draft.title,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.folio ? await findTrainingByFolio(row.folio) : null;
        if (existing) {
          const saved = await updateTraining(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createTraining(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.folio,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? draft.title,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateCopasstPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
