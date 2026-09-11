"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import {
  CCL_EXCEL_MAX_ROWS,
  type CclCaseExcelImportRow,
  type CclCommitmentExcelImportRow,
  type CclExcelImportResultRow,
  type CclMeetingExcelImportRow,
  type CclMemberExcelImportRow,
} from "@/lib/sg-sst/ccl/excel";
import {
  createCase,
  createCommitment,
  createMeeting,
  createMember,
  deleteCase,
  deleteCommitment,
  deleteMeeting,
  deleteMember,
  findCaseByCode,
  findCommitmentByFolio,
  findMeetingByFolio,
  getCclStats,
  listCaseViews,
  listCommitmentViews,
  listMeetings,
  listMembers,
  updateCase,
  updateCommitment,
  updateMeeting,
  updateMember,
} from "@/lib/sg-sst/ccl/repository";
import {
  validateCaseDraft,
  validateCommitmentDraft,
  validateMeetingDraft,
  validateMemberDraft,
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
import {
  findWorkerByCode,
  findWorkerByDocumentNumber,
  listWorkers,
} from "@/lib/sg-sst/workers/repository";
import type { SstWorker } from "@/lib/sg-sst/workers/types";

export type CclActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type CclSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateCclPaths() {
  revalidatePath("/sg-sst/ccl");
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

export async function loadCclMasterData(): Promise<{
  members: SstCclMember[];
  meetings: SstCclMeeting[];
  cases: SstCclCaseView[];
  commitments: SstCclCommitmentView[];
  stats: CclStats;
  farms: SstFarm[];
  workers: SstWorker[];
}> {
  await requireAdmin();
  const [members, meetings, cases, commitments, stats, farms, workers] =
    await Promise.all([
      listMembers(),
      listMeetings(),
      listCaseViews(),
      listCommitmentViews(),
      getCclStats(),
      listSstFarms(),
      listWorkers({ status: "all" }),
    ]);
  return { members, meetings, cases, commitments, stats, farms, workers };
}

/* ─── CRUD actions ─────────────────────────────────────────────────────── */

export async function saveMemberAction(
  draft: SstCclMemberDraft,
): Promise<CclActionResult> {
  const admin = await requireAdmin();
  const error = validateMemberDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateMember(draft.id, draft, admin.id)
      : await createMember(draft, admin.id);
    revalidateCclPaths();
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

export async function deleteMemberAction(id: string): Promise<CclSimpleResult> {
  await requireAdmin();
  try {
    await deleteMember(id);
    revalidateCclPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function saveMeetingAction(
  draft: SstCclMeetingDraft,
): Promise<CclActionResult> {
  const admin = await requireAdmin();
  const error = validateMeetingDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateMeeting(draft.id, draft, admin.id)
      : await createMeeting(draft, admin.id);
    revalidateCclPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo guardar el acta.",
    };
  }
}

export async function deleteMeetingAction(
  id: string,
): Promise<CclSimpleResult> {
  await requireAdmin();
  try {
    await deleteMeeting(id);
    revalidateCclPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function saveCaseAction(
  draft: SstCclCaseDraft,
): Promise<CclActionResult> {
  const admin = await requireAdmin();
  const error = validateCaseDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateCase(draft.id, draft, admin.id)
      : await createCase(draft, admin.id);
    revalidateCclPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo guardar el caso.",
    };
  }
}

export async function deleteCaseAction(id: string): Promise<CclSimpleResult> {
  await requireAdmin();
  try {
    await deleteCase(id);
    revalidateCclPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export async function saveCommitmentAction(
  draft: SstCclCommitmentDraft,
): Promise<CclActionResult> {
  const admin = await requireAdmin();
  const error = validateCommitmentDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateCommitment(draft.id, draft, admin.id)
      : await createCommitment(draft, admin.id);
    revalidateCclPaths();
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
): Promise<CclSimpleResult> {
  await requireAdmin();
  try {
    await deleteCommitment(id);
    revalidateCclPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

/* ─── Bulk import ──────────────────────────────────────────────────────── */

export type BulkImportCclResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: CclExcelImportResultRow[];
    }
  | { ok: false; error: string };

export async function bulkImportCclMembersAction(input: {
  rows: CclMemberExcelImportRow[];
}): Promise<BulkImportCclResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > CCL_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${CCL_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const members = await listMembers();
    const results: CclExcelImportResultRow[] = [];
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

      const draft: SstCclMemberDraft = { ...row.draft, workerId, farmId };
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
        const existing = members.find(
          (m) =>
            m.workerId === workerId &&
            m.role === draft.role &&
            m.periodLabel === draft.periodLabel,
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
            key: saved.workerDocument,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createMember(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.workerDocument,
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

    revalidateCclPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

export async function bulkImportCclMeetingsAction(input: {
  rows: CclMeetingExcelImportRow[];
}): Promise<BulkImportCclResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > CCL_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${CCL_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const farms = await listSstFarms();
    const results: CclExcelImportResultRow[] = [];
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

      const draft: SstCclMeetingDraft = { ...row.draft, farmId };
      const validationError = validateMeetingDraft(draft);
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
          key: row.folio ?? draft.title,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateCclPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

export async function bulkImportCclCasesAction(input: {
  rows: CclCaseExcelImportRow[];
}): Promise<BulkImportCclResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > CCL_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${CCL_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: CclExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      let meetingId: string | null = row.draft.meetingId ?? null;
      if (row.meetingFolio?.trim()) {
        const meeting = await findMeetingByFolio(row.meetingFolio);
        if (!meeting) {
          failed += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: row.code ?? "caso",
            status: "error",
            message: `Acta no encontrada: "${row.meetingFolio}"`,
          });
          continue;
        }
        meetingId = meeting.id;
      }

      const draft: SstCclCaseDraft = { ...row.draft, meetingId };
      const validationError = validateCaseDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.code ?? "caso",
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = row.code ? await findCaseByCode(row.code) : null;
        if (existing) {
          const saved = await updateCase(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.code,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createCase(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: saved.code,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.code ?? "caso",
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateCclPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}

export async function bulkImportCclCommitmentsAction(input: {
  rows: CclCommitmentExcelImportRow[];
}): Promise<BulkImportCclResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > CCL_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${CCL_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: CclExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      let meetingId: string | null = row.draft.meetingId ?? null;
      let caseId: string | null = row.draft.caseId ?? null;

      if (row.meetingFolio?.trim()) {
        const meeting = await findMeetingByFolio(row.meetingFolio);
        if (!meeting) {
          failed += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: row.folio ?? "compromiso",
            status: "error",
            message: `Acta no encontrada: "${row.meetingFolio}"`,
          });
          continue;
        }
        meetingId = meeting.id;
      }

      if (row.caseCode?.trim()) {
        const cclCase = await findCaseByCode(row.caseCode);
        if (!cclCase) {
          failed += 1;
          results.push({
            rowNumber: row.rowNumber,
            key: row.folio ?? "compromiso",
            status: "error",
            message: `Caso no encontrado: "${row.caseCode}"`,
          });
          continue;
        }
        caseId = cclCase.id;
      }

      const draft: SstCclCommitmentDraft = {
        ...row.draft,
        meetingId,
        caseId,
      };
      const validationError = validateCommitmentDraft(draft);
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          key: row.folio ?? draft.description.slice(0, 40),
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
          key: row.folio ?? "compromiso",
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateCclPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
