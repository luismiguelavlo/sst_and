"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import {
  DOCUMENT_EXCEL_MAX_ROWS,
  type DocumentExcelImportResultRow,
  type DocumentExcelImportRow,
} from "@/lib/sg-sst/documentos/excel";
import {
  createDocument,
  deleteDocument,
  findDocumentByCode,
  getDocumentStats,
  listDocumentViews,
  updateDocument,
} from "@/lib/sg-sst/documentos/repository";
import {
  emptyDocumentDraft,
  isSgDocStatus,
  isSgDocType,
  validateDocumentDraft,
  type DocumentStats,
  type SstSgDocumentDraft,
  type SstSgDocumentView,
} from "@/lib/sg-sst/documentos/types";

export type DocumentActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type DocumentSimpleResult = { ok: true } | { ok: false; error: string };

function revalidateDocumentPaths() {
  revalidatePath("/sg-sst/documentos-sg-sst");
  revalidatePath("/sg-sst/alertas-sst");
  revalidatePath("/sg-sst/alertas-sst/matriz");
  revalidatePath("/sg-sst");
}

export async function loadDocumentsMasterData(): Promise<{
  documents: SstSgDocumentView[];
  stats: DocumentStats;
}> {
  await requireAdmin();
  const [documents, stats] = await Promise.all([
    listDocumentViews(),
    getDocumentStats(),
  ]);
  return { documents, stats };
}

export async function saveDocumentAction(
  draft: SstSgDocumentDraft,
): Promise<DocumentActionResult> {
  const admin = await requireAdmin();
  const error = validateDocumentDraft(draft);
  if (error) return { ok: false, error };
  try {
    const saved = draft.id
      ? await updateDocument(draft.id, draft, admin.id)
      : await createDocument(draft, admin.id);
    revalidateDocumentPaths();
    return { ok: true, id: saved.id };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo guardar el documento.",
    };
  }
}

export async function deleteDocumentAction(
  id: string,
): Promise<DocumentSimpleResult> {
  await requireAdmin();
  try {
    await deleteDocument(id);
    revalidateDocumentPaths();
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "No se pudo eliminar.",
    };
  }
}

export type BulkImportDocumentsResult =
  | {
      ok: true;
      created: number;
      updated: number;
      failed: number;
      results: DocumentExcelImportResultRow[];
    }
  | { ok: false; error: string };

export async function bulkImportDocumentsAction(input: {
  rows: DocumentExcelImportRow[];
}): Promise<BulkImportDocumentsResult> {
  const admin = await requireAdmin();
  if (input.rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (input.rows.length > DOCUMENT_EXCEL_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${DOCUMENT_EXCEL_MAX_ROWS} filas por importación.`,
    };
  }

  try {
    const results: DocumentExcelImportResultRow[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const row of input.rows) {
      const defaults = emptyDocumentDraft();
      const draft: SstSgDocumentDraft = {
        ...row.draft,
        title: row.draft.title.trim() || "Sin título",
        code: row.draft.code.trim() || `DOC-IMP-${row.rowNumber}`,
        docType: isSgDocType(row.draft.docType) ? row.draft.docType : defaults.docType,
        status: isSgDocStatus(row.draft.status) ? row.draft.status : defaults.status,
        company: row.draft.company.trim() || defaults.company,
        responsibleName: row.draft.responsibleName.trim() || "Sin responsable",
        versionLabel: row.draft.versionLabel.trim() || defaults.versionLabel,
        elaboratedAt: row.draft.elaboratedAt.trim() || defaults.elaboratedAt,
        lastReviewedAt: row.draft.lastReviewedAt.trim() || defaults.lastReviewedAt,
      };
      const validationError = validateDocumentDraft(draft, "import");
      if (validationError) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          code: draft.code || row.code,
          title: draft.title,
          status: "error",
          message: validationError,
        });
        continue;
      }

      try {
        const existing = await findDocumentByCode(draft.code);
        if (existing) {
          const saved = await updateDocument(
            existing.id,
            { ...draft, id: existing.id },
            admin.id,
          );
          updated += 1;
          results.push({
            rowNumber: row.rowNumber,
            code: saved.code,
            title: saved.title,
            status: "updated",
            message: "Actualizado",
            id: saved.id,
          });
        } else {
          const saved = await createDocument(draft, admin.id);
          created += 1;
          results.push({
            rowNumber: row.rowNumber,
            code: saved.code,
            title: saved.title,
            status: "created",
            message: "Creado",
            id: saved.id,
          });
        }
      } catch (caught) {
        failed += 1;
        results.push({
          rowNumber: row.rowNumber,
          code: draft.code || row.code,
          title: draft.title,
          status: "error",
          message: caught instanceof Error ? caught.message : "Error al guardar",
        });
      }
    }

    revalidateDocumentPaths();
    return { ok: true, created, updated, failed, results };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudo importar el Excel.",
    };
  }
}
