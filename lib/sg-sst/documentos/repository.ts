import "server-only";

import { getSql } from "@/lib/db";
import {
  closeComplianceRecord,
  createComplianceRecord,
  deleteComplianceRecord,
  findComplianceRecordByCode,
  updateComplianceRecord,
} from "@/lib/sg-sst/alerts/repository";
import type { SstRecordDraft, SstSemaphoreLevel } from "@/lib/sg-sst/alerts/types";
import {
  DEFAULT_SG_DOC_COMPANY,
  documentTracksReview,
  enrichDocumentAsView,
  isSgDocStatus,
  isSgDocType,
  SG_DOC_TYPES,
  toDocumentComplianceWorkflow,
  type DocumentStats,
  type SgDocStatus,
  type SgDocType,
  type SstSgDocument,
  type SstSgDocumentDraft,
  type SstSgDocumentView,
} from "@/lib/sg-sst/documentos/types";

type DocumentRow = {
  id: string;
  code: string;
  title: string;
  doc_type: string;
  company: string;
  responsible_name: string;
  elaborated_at: string | null;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  has_review_cycle: boolean;
  version_label: string;
  status: string;
  file_url: string;
  file_name: string;
  observations: string;
  compliance_record_id: string | null;
  created_at: string;
  updated_at: string;
};

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function mapDocument(row: DocumentRow): SstSgDocument {
  if (!isSgDocType(row.doc_type)) {
    throw new Error(`Tipo de documento inválido: ${row.doc_type}`);
  }
  if (!isSgDocStatus(row.status)) {
    throw new Error(`Estado de documento inválido: ${row.status}`);
  }
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    docType: row.doc_type,
    company: row.company,
    responsibleName: row.responsible_name,
    elaboratedAt: row.elaborated_at,
    lastReviewedAt: row.last_reviewed_at,
    nextReviewAt: row.next_review_at,
    hasReviewCycle: row.has_review_cycle,
    versionLabel: row.version_label,
    status: row.status,
    fileUrl: row.file_url,
    fileName: row.file_name,
    observations: row.observations,
    complianceRecordId: row.compliance_record_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function selectDocumentById(id: string): Promise<SstSgDocument | null> {
  const sql = getSql();
  const rows = await sql<DocumentRow[]>`
    SELECT
      id, code, title, doc_type, company, responsible_name,
      elaborated_at::text, last_reviewed_at::text, next_review_at::text,
      has_review_cycle, version_label, status, file_url, file_name, observations,
      compliance_record_id, created_at::text, updated_at::text
    FROM campus_sst.sst_sg_documents
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapDocument(rows[0]) : null;
}

function complianceDraftFromDocument(doc: SstSgDocument): SstRecordDraft {
  return {
    recordType: "documento",
    title: doc.title,
    code: doc.code,
    subjectName: doc.company,
    subjectJobTitle: doc.docType,
    dueDate: doc.nextReviewAt,
    issuedAt: doc.lastReviewedAt ?? doc.elaboratedAt,
    workflowStatus: toDocumentComplianceWorkflow(doc.status),
    responsibleName: doc.responsibleName,
    notes: doc.observations.slice(0, 500),
  };
}

/**
 * Solo sincroniza alertas cuando hay ciclo de revisión y next_review_at.
 * Si no aplica, no crea compliance o cierra el existente.
 */
async function syncComplianceRecord(
  doc: SstSgDocument,
  userId: string,
): Promise<void> {
  const sql = getSql();
  const shouldTrack = documentTracksReview(doc);

  if (!shouldTrack) {
    if (doc.complianceRecordId) {
      try {
        await closeComplianceRecord(
          doc.complianceRecordId,
          "Documento sin ciclo de revisión automática / sin próxima revisión.",
          userId,
        );
      } catch {
        // ignore missing compliance
      }
    }
    return;
  }

  const draft = complianceDraftFromDocument(doc);

  if (doc.complianceRecordId) {
    await updateComplianceRecord(doc.complianceRecordId, draft, userId);
    return;
  }

  const existing = await findComplianceRecordByCode("documento", doc.code);
  if (existing) {
    await updateComplianceRecord(existing.id, draft, userId);
    await sql`
      UPDATE campus_sst.sst_sg_documents
      SET compliance_record_id = ${existing.id}, updated_at = now()
      WHERE id = ${doc.id}
    `;
    return;
  }

  const created = await createComplianceRecord(draft, userId);
  await sql`
    UPDATE campus_sst.sst_sg_documents
    SET compliance_record_id = ${created.id}, updated_at = now()
    WHERE id = ${doc.id}
  `;
}

export async function listDocuments(filters?: {
  docType?: SgDocType | "all";
  status?: SgDocStatus | "all";
  query?: string;
}): Promise<SstSgDocument[]> {
  const sql = getSql();
  const docType =
    filters?.docType && filters.docType !== "all" ? filters.docType : null;
  const status =
    filters?.status && filters.status !== "all" ? filters.status : null;
  const q = filters?.query?.trim().toLowerCase() || null;

  const rows = await sql<DocumentRow[]>`
    SELECT
      id, code, title, doc_type, company, responsible_name,
      elaborated_at::text, last_reviewed_at::text, next_review_at::text,
      has_review_cycle, version_label, status, file_url, file_name, observations,
      compliance_record_id, created_at::text, updated_at::text
    FROM campus_sst.sst_sg_documents
    WHERE (${docType}::text IS NULL OR doc_type = ${docType})
      AND (${status}::text IS NULL OR status = ${status})
      AND (
        ${q}::text IS NULL
        OR lower(code) LIKE ${q ? `%${q}%` : ""}
        OR lower(title) LIKE ${q ? `%${q}%` : ""}
        OR lower(responsible_name) LIKE ${q ? `%${q}%` : ""}
        OR lower(company) LIKE ${q ? `%${q}%` : ""}
      )
    ORDER BY
      CASE status
        WHEN 'observado' THEN 0
        WHEN 'en_revision' THEN 1
        WHEN 'vigente' THEN 2
        ELSE 3
      END,
      CASE WHEN has_review_cycle AND next_review_at IS NOT NULL THEN 0 ELSE 1 END,
      next_review_at ASC NULLS LAST,
      code ASC
  `;
  return rows.map(mapDocument);
}

export async function listDocumentViews(
  filters?: Parameters<typeof listDocuments>[0],
): Promise<SstSgDocumentView[]> {
  return (await listDocuments(filters)).map((doc) => enrichDocumentAsView(doc));
}

export async function getDocument(id: string): Promise<SstSgDocument | null> {
  return selectDocumentById(id);
}

export async function findDocumentByCode(
  code: string,
): Promise<SstSgDocument | null> {
  const sql = getSql();
  const rows = await sql<DocumentRow[]>`
    SELECT
      id, code, title, doc_type, company, responsible_name,
      elaborated_at::text, last_reviewed_at::text, next_review_at::text,
      has_review_cycle, version_label, status, file_url, file_name, observations,
      compliance_record_id, created_at::text, updated_at::text
    FROM campus_sst.sst_sg_documents
    WHERE lower(code) = lower(${code.trim()})
    LIMIT 1
  `;
  return rows[0] ? mapDocument(rows[0]) : null;
}

export async function getDocumentStats(): Promise<DocumentStats> {
  const views = await listDocumentViews();
  const byStatus: Record<SgDocStatus, number> = {
    vigente: 0,
    en_revision: 0,
    observado: 0,
    obsoleto: 0,
  };
  const byDocType = Object.fromEntries(
    SG_DOC_TYPES.map((type) => [type, 0]),
  ) as Record<SgDocType, number>;
  const bySemaphore: Record<SstSemaphoreLevel, number> = {
    critico: 0,
    proximo: 0,
    seguimiento: 0,
    vigente: 0,
  };
  let withFile = 0;
  let trackingReview = 0;
  let overdueReview = 0;

  for (const view of views) {
    byStatus[view.status] += 1;
    byDocType[view.docType] += 1;
    if (view.fileUrl.trim() || view.fileName.trim()) withFile += 1;
    if (view.tracksReview) {
      trackingReview += 1;
      bySemaphore[view.semaphore] += 1;
      if (view.isOverdue) overdueReview += 1;
    }
  }

  return {
    total: views.length,
    byStatus,
    byDocType,
    withFile,
    trackingReview,
    overdueReview,
    bySemaphore,
  };
}

export async function createDocument(
  draft: SstSgDocumentDraft,
  userId: string,
): Promise<SstSgDocument> {
  const sql = getSql();
  const code = draft.code.trim().toUpperCase();
  const existing = await findDocumentByCode(code);
  if (existing) {
    throw new Error(`Ya existe un documento con código ${code}.`);
  }

  const hasReviewCycle = draft.hasReviewCycle;
  const nextReviewAt = hasReviewCycle ? emptyToNull(draft.nextReviewAt) : null;

  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.sst_sg_documents (
      code, title, doc_type, company, responsible_name,
      elaborated_at, last_reviewed_at, next_review_at, has_review_cycle,
      version_label, status, file_url, file_name, observations,
      created_by, updated_by
    ) VALUES (
      ${code},
      ${draft.title.trim()},
      ${draft.docType},
      ${draft.company.trim() || DEFAULT_SG_DOC_COMPANY},
      ${draft.responsibleName.trim()},
      ${emptyToNull(draft.elaboratedAt)},
      ${emptyToNull(draft.lastReviewedAt)},
      ${nextReviewAt},
      ${hasReviewCycle},
      ${draft.versionLabel.trim() || "1.0"},
      ${draft.status},
      ${draft.fileUrl.trim()},
      ${draft.fileName.trim()},
      ${draft.observations.trim()},
      ${userId},
      ${userId}
    )
    RETURNING id
  `;

  const created = await selectDocumentById(rows[0].id);
  if (!created) throw new Error("No se pudo crear el documento.");
  await syncComplianceRecord(created, userId);
  return (await selectDocumentById(created.id)) ?? created;
}

export async function updateDocument(
  id: string,
  draft: SstSgDocumentDraft,
  userId: string,
): Promise<SstSgDocument> {
  const sql = getSql();
  const code = draft.code.trim().toUpperCase();
  const byCode = await findDocumentByCode(code);
  if (byCode && byCode.id !== id) {
    throw new Error(`Ya existe un documento con código ${code}.`);
  }

  const hasReviewCycle = draft.hasReviewCycle;
  const nextReviewAt = hasReviewCycle ? emptyToNull(draft.nextReviewAt) : null;

  await sql`
    UPDATE campus_sst.sst_sg_documents
    SET
      code = ${code},
      title = ${draft.title.trim()},
      doc_type = ${draft.docType},
      company = ${draft.company.trim() || DEFAULT_SG_DOC_COMPANY},
      responsible_name = ${draft.responsibleName.trim()},
      elaborated_at = ${emptyToNull(draft.elaboratedAt)},
      last_reviewed_at = ${emptyToNull(draft.lastReviewedAt)},
      next_review_at = ${nextReviewAt},
      has_review_cycle = ${hasReviewCycle},
      version_label = ${draft.versionLabel.trim() || "1.0"},
      status = ${draft.status},
      file_url = ${draft.fileUrl.trim()},
      file_name = ${draft.fileName.trim()},
      observations = ${draft.observations.trim()},
      updated_by = ${userId},
      updated_at = now()
    WHERE id = ${id}
  `;

  const updated = await selectDocumentById(id);
  if (!updated) throw new Error("Documento no encontrado.");
  await syncComplianceRecord(updated, userId);
  return (await selectDocumentById(id)) ?? updated;
}

export async function deleteDocument(id: string): Promise<void> {
  const current = await selectDocumentById(id);
  if (!current) throw new Error("Documento no encontrado.");
  const sql = getSql();
  await sql`DELETE FROM campus_sst.sst_sg_documents WHERE id = ${id}`;
  if (current.complianceRecordId) {
    try {
      await deleteComplianceRecord(current.complianceRecordId);
    } catch {
      // ignore missing compliance
    }
  }
}
