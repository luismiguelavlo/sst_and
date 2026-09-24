"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import { createFarm } from "@/lib/sg-sst/fincas/repository";
import { normalizeFarmDraftForImport } from "@/lib/sg-sst/fincas/types";
import {
  WORKER_EXCEL_MAX_ROWS,
  type WorkerExcelImportResultRow,
  type WorkerExcelImportRow,
} from "@/lib/sg-sst/workers/excel";
import {
  createWorker,
  findWorkerByCode,
  findWorkerByDocument,
  getWorker,
  getWorkerStats,
  listActiveWorkersForSelect,
  listWorkers,
  retireWorker,
  updateWorker,
} from "@/lib/sg-sst/workers/repository";
import {
  validateWorkerDraft,
  type SstWorker,
  type SstWorkerDraft,
  type WorkerStats,
  type WorkerStatus,
} from "@/lib/sg-sst/workers/types";
import { recordSstAudit } from "@/lib/sg-sst/trazabilidad/repository";
import {
  buildAuditSummary,
  buildImportAuditSummary,
  diffLabeledFields,
  summarizeFieldChanges,
} from "@/lib/sg-sst/trazabilidad/types";

export type WorkerActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type WorkerSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateWorkerPaths(id?: string) {
  revalidatePath("/sg-sst/trabajadores");
  revalidatePath("/sg-sst/trabajadores/nuevo");
  if (id) {
    revalidatePath(`/sg-sst/trabajadores/${id}`);
  }
  revalidatePath("/sg-sst");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/centros-de-trabajo");
}

async function resolveFarmIdForImport(
  farmNameOrCode: string,
  farms: SstFarm[],
): Promise<string | null> {
  const needle = farmNameOrCode.trim();
  if (!needle) return null;
  const lower = needle.toLowerCase();
  const existing =
    farms.find(
      (item) => item.name.toLowerCase() === lower || item.code.toLowerCase() === lower,
    ) ??
    farms.find(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        lower.includes(item.name.toLowerCase()) ||
        lower.includes(item.code.toLowerCase()),
    );
  if (existing) return existing.id;

  try {
    const created = await createFarm(
      normalizeFarmDraftForImport({
        name: needle,
        code: "",
        company: "Grupo Manzanares S.A.S.",
        municipality: "",
        address: "",
        observations: "Creado automáticamente al importar trabajadores",
        active: true,
      }),
    );
    farms.push({
      id: created.id,
      name: created.name,
      code: created.code,
      active: created.active,
    });
    return created.id;
  } catch {
    // Centro no crítico: el trabajador se importa igual.
    return null;
  }
}

export async function loadWorkersMasterData(filters?: {
  status?: WorkerStatus | "all";
  farmId?: string | null;
  query?: string;
}): Promise<{
  workers: SstWorker[];
  stats: WorkerStats;
  farms: Awaited<ReturnType<typeof listSstFarms>>;
}> {
  await requireAdmin();
  const [workers, stats, farms] = await Promise.all([
    listWorkers(filters),
    getWorkerStats(),
    listSstFarms(),
  ]);
  return { workers, stats, farms };
}

export async function loadWorkerFormData(id?: string) {
  await requireAdmin();
  const [farms, worker] = await Promise.all([
    listSstFarms(),
    id ? getWorker(id) : Promise.resolve(null),
  ]);
  return { farms, worker };
}

export async function loadWorkersForSelectAction(options?: {
  activeOnly?: boolean;
}): Promise<SstWorker[]> {
  await requireAdmin();
  if (options?.activeOnly) {
    return listActiveWorkersForSelect();
  }
  return listWorkers({ status: "all" });
}

export async function saveWorkerAction(draft: SstWorkerDraft): Promise<WorkerActionResult> {
  const admin = await requireAdmin();
  const error = validateWorkerDraft(draft);
  if (error) {
    return { ok: false, error };
  }
  try {
    if (draft.id) {
      const previous = await getWorker(draft.id);
      const saved = await updateWorker(draft.id, draft, admin.id);
      const changes = previous
        ? diffLabeledFields(
            {
              fullName: previous.fullName,
              jobTitle: previous.jobTitle,
              company: previous.company,
              area: previous.area,
              workCenter: previous.workCenter,
              farmId: previous.farmId,
              status: previous.status,
              hireDate: previous.hireDate,
              worksHeights: previous.worksHeights,
              drives: previous.drives,
              operatesTractor: previous.operatesTractor,
            },
            {
              fullName: draft.fullName,
              jobTitle: draft.jobTitle,
              company: draft.company,
              area: draft.area,
              workCenter: draft.workCenter,
              farmId: draft.farmId,
              status: draft.status,
              hireDate: draft.hireDate,
              worksHeights: draft.worksHeights,
              drives: draft.drives,
              operatesTractor: draft.operatesTractor,
            },
            {
              fullName: "el nombre",
              jobTitle: "el cargo",
              company: "la empresa",
              area: "el área",
              workCenter: "el centro de trabajo",
              farmId: "la finca / centro",
              status: "el estado laboral",
              hireDate: "la fecha de ingreso",
              worksHeights: "el perfil de alturas",
              drives: "el perfil PESV",
              operatesTractor: "el perfil de operador",
            },
          )
        : [];
      await recordSstAudit({
        actor: admin,
        action: "update",
        module: "trabajadores",
        entityType: "worker",
        entityId: saved.id,
        workerId: saved.id,
        summary: buildAuditSummary({
          actorName: admin.name,
          verb: "actualizó",
          subject: "la ficha laboral",
          ofWhom: saved.fullName,
          focus: summarizeFieldChanges(changes),
        }),
        details: { changes },
      });
      revalidateWorkerPaths(saved.id);
      return { ok: true, id: saved.id };
    }

    const saved = await createWorker(draft, admin.id);
    await recordSstAudit({
      actor: admin,
      action: "create",
      module: "trabajadores",
      entityType: "worker",
      entityId: saved.id,
      workerId: saved.id,
      summary: buildAuditSummary({
        actorName: admin.name,
        verb: "creó",
        subject: "al trabajador",
        ofWhom: saved.fullName,
      }),
    });
    revalidateWorkerPaths(saved.id);
    return { ok: true, id: saved.id };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "No se pudo guardar.";
    if (message.includes("unique") || message.includes("duplicate")) {
      return { ok: false, error: "Ya existe un trabajador con ese documento o ID." };
    }
    return { ok: false, error: message };
  }
}

export async function retireWorkerAction(input: {
  id: string;
  retirementDate: string;
  retirementReason: string;
}): Promise<WorkerSimpleResult> {
  const admin = await requireAdmin();
  if (!input.retirementDate) {
    return { ok: false, error: "La fecha de retiro es obligatoria." };
  }
  try {
    const previous = await getWorker(input.id);
    await retireWorker(
      input.id,
      input.retirementDate,
      input.retirementReason,
      admin.id,
    );
    await recordSstAudit({
      actor: admin,
      action: "retire",
      module: "trabajadores",
      entityType: "worker",
      entityId: input.id,
      workerId: input.id,
      summary: buildAuditSummary({
        actorName: admin.name,
        verb: "retiró",
        subject: "al trabajador",
        ofWhom: previous?.fullName ?? input.id,
      }),
      details: {
        extra: {
          retirementDate: input.retirementDate,
          retirementReason: input.retirementReason,
        },
      },
    });
    revalidateWorkerPaths(input.id);
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo retirar al trabajador.",
    };
  }
}

export type BulkImportWorkersResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: WorkerExcelImportResultRow[];
    }
  | { ok: false; error: string };

export async function bulkImportWorkersAction(input: {
  rows: WorkerExcelImportRow[];
}): Promise<BulkImportWorkersResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > WORKER_EXCEL_MAX_ROWS) {
    return { ok: false, error: `Máximo ${WORKER_EXCEL_MAX_ROWS} filas por importación.` };
  }

  try {
    const farms = await listSstFarms();
    const results: WorkerExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const farmId = await resolveFarmIdForImport(row.farmNameOrCode, farms);

      const draft: SstWorkerDraft = {
        ...row.draft,
        farmId,
        fullName: row.draft.fullName.trim() || "Sin nombre",
        documentNumber: row.draft.documentNumber.trim() || `SIN-DOC-${row.rowNumber}`,
        jobTitle: row.draft.jobTitle.trim() || "Operario",
        company: row.draft.company.trim() || "Grupo Manzanares S.A.S.",
        hireDate: row.draft.hireDate || null,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.draft.email.trim())
          ? row.draft.email.trim()
          : "",
        retirementDate:
          row.draft.status === "retirado"
            ? row.draft.retirementDate ?? new Date().toISOString().slice(0, 10)
            : row.draft.retirementDate,
      };
      const validationError = validateWorkerDraft(draft, "import");
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          workerCode: draft.workerCode ?? "",
          fullName: draft.fullName,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        // Anti-duplicado: SOLO por tipo+número de documento.
        // No usar id_trabajador/código: en la base maestra son números cortos
        // que colisionan entre personas distintas.
        const existing = await findWorkerByDocument(
          draft.documentType,
          draft.documentNumber,
        );

        if (existing) {
          const saved = await updateWorker(
            existing.id,
            {
              ...draft,
              id: existing.id,
              workerCode: existing.workerCode,
            },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            workerCode: saved.workerCode,
            fullName: saved.fullName,
            status: "updated",
            message: "Actualizado (mismo documento)",
            id: saved.id,
          });
        } else {
          // Si el código del Excel ya lo tiene otra persona, crear con código nuevo.
          let createDraft = draft;
          if (draft.workerCode) {
            const codeOwner = await findWorkerByCode(draft.workerCode);
            if (codeOwner) {
              createDraft = { ...draft, workerCode: undefined };
            }
          }
          const saved = await createWorker(createDraft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            workerCode: saved.workerCode,
            fullName: saved.fullName,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          workerCode: draft.workerCode ?? "",
          fullName: draft.fullName,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateWorkerPaths();
    await recordSstAudit({
      actor: admin,
      action: "import",
      module: "trabajadores",
      entityType: "worker",
      summary: buildImportAuditSummary({
        actorName: admin.name,
        subjectPlural: "trabajadores",
        created,
        updated,
        failed,
      }),
      details: {
        extra: { created, updated, failed, rows: input.rows.length },
      },
    });
    // Respuesta liviana: solo errores (evita payloads enormes en Server Actions).
    return {
      ok: true,
      created,
      updated,
      failed,
      results: results.filter((row) => row.status === "error").slice(0, 40),
    };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo importar el Excel.",
    };
  }
}
