import "server-only";

import { randomBytes } from "node:crypto";
import {
  CERTIFICATE_FALLBACK_COVER,
  type CertificateDocument,
  type CertificateListItem,
} from "@/lib/certificates";
import { getSql } from "@/lib/db";
import {
  isSstCategory,
  isSstLevel,
  sstCategoryLabel,
  sstLevelLabel,
  type SstCategory,
  type SstLevel,
} from "@/lib/sst";

type CertificateListRow = {
  id: string;
  code: string;
  hours: number;
  issued_at: Date;
  course_title: string;
  course_slug: string;
  category: string;
  cover_url: string | null;
};

type CertificateDetailRow = {
  id: string;
  code: string;
  hours: number;
  issued_at: Date;
  user_id: string;
  recipient_name: string;
  recipient_job_title: string;
  course_title: string;
  course_slug: string;
  category: string;
  level: string;
};

type CompletionRow = {
  course_id: string;
  issue_certificate: boolean;
  section_count: number;
  viewed_count: number;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function maybeIssueCertificate(
  userId: string,
  sectionId: string,
): Promise<string | null> {
  if (!UUID_PATTERN.test(userId) || !UUID_PATTERN.test(sectionId)) {
    return null;
  }

  const sql = getSql();
  const progress = await sql<CompletionRow[]>`
    SELECT
      c.id::text AS course_id,
      c.issue_certificate,
      (SELECT count(*)::int FROM campus_sst.course_sections s WHERE s.course_id = c.id) AS section_count,
      (
        SELECT count(DISTINCT p.section_id)::int
        FROM campus_sst.lesson_progress p
        WHERE p.user_id = ${userId}::uuid AND p.course_id = c.id
      ) AS viewed_count
    FROM campus_sst.course_sections sec
    JOIN campus_sst.courses c ON c.id = sec.course_id
    WHERE sec.id = ${sectionId}::uuid
    LIMIT 1
  `;

  const row = progress[0];
  if (!row || !row.issue_certificate || row.section_count === 0) {
    return null;
  }
  if (row.viewed_count < row.section_count) {
    return null;
  }

  const hours = Math.max(1, row.section_count);
  const code = await uniqueCertificateCode();

  const inserted = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.certificates (user_id, course_id, code, hours)
    VALUES (${userId}::uuid, ${row.course_id}::uuid, ${code}, ${hours})
    ON CONFLICT (user_id, course_id) DO NOTHING
    RETURNING id::text
  `;

  return inserted[0]?.id ?? null;
}

export async function listCertificatesForUser(userId: string): Promise<CertificateListItem[]> {
  if (!UUID_PATTERN.test(userId)) {
    return [];
  }

  const sql = getSql();
  const rows = await sql<CertificateListRow[]>`
    SELECT
      cert.id::text,
      cert.code,
      cert.hours,
      cert.issued_at,
      c.title AS course_title,
      c.slug AS course_slug,
      c.category,
      c.cover_url
    FROM campus_sst.certificates cert
    JOIN campus_sst.courses c ON c.id = cert.course_id
    WHERE cert.user_id = ${userId}::uuid
    ORDER BY cert.issued_at DESC
  `;

  return rows
    .filter((row) => isSstCategory(row.category))
    .map((row) => toListItem(row));
}

export async function getCertificateForUser(
  certificateId: string,
  userId: string,
  options?: { allowAdmin?: boolean },
): Promise<CertificateDocument | null> {
  if (!UUID_PATTERN.test(certificateId) || !UUID_PATTERN.test(userId)) {
    return null;
  }

  const sql = getSql();
  const rows = options?.allowAdmin
    ? await sql<CertificateDetailRow[]>`
        SELECT
          cert.id::text,
          cert.code,
          cert.hours,
          cert.issued_at,
          cert.user_id::text,
          u.name AS recipient_name,
          u.job_title AS recipient_job_title,
          c.title AS course_title,
          c.slug AS course_slug,
          c.category,
          c.level
        FROM campus_sst.certificates cert
        JOIN campus_sst.users u ON u.id = cert.user_id
        JOIN campus_sst.courses c ON c.id = cert.course_id
        WHERE cert.id = ${certificateId}::uuid
        LIMIT 1
      `
    : await sql<CertificateDetailRow[]>`
        SELECT
          cert.id::text,
          cert.code,
          cert.hours,
          cert.issued_at,
          cert.user_id::text,
          u.name AS recipient_name,
          u.job_title AS recipient_job_title,
          c.title AS course_title,
          c.slug AS course_slug,
          c.category,
          c.level
        FROM campus_sst.certificates cert
        JOIN campus_sst.users u ON u.id = cert.user_id
        JOIN campus_sst.courses c ON c.id = cert.course_id
        WHERE cert.id = ${certificateId}::uuid AND cert.user_id = ${userId}::uuid
        LIMIT 1
      `;

  const row = rows[0];
  if (!row || !isSstCategory(row.category) || !isSstLevel(row.level)) {
    return null;
  }

  return {
    id: row.id,
    code: row.code,
    hours: row.hours,
    issuedAt: row.issued_at,
    issuedOnLabel: formatIssuedOn(row.issued_at),
    recipientUserId: row.user_id,
    recipientName: row.recipient_name,
    recipientJobTitle: row.recipient_job_title,
    courseTitle: row.course_title,
    courseSlug: row.course_slug,
    categoryLabel: sstCategoryLabel(row.category as SstCategory),
    levelLabel: sstLevelLabel(row.level as SstLevel),
  };
}

async function uniqueCertificateCode(): Promise<string> {
  const sql = getSql();
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const suffix = randomBytes(3).toString("hex").toUpperCase();
    const code = `SST-${year}-${suffix}`;
    const existing = await sql<[{ exists: boolean }]>`
      SELECT EXISTS (
        SELECT 1 FROM campus_sst.certificates WHERE code = ${code}
      ) AS exists
    `;
    if (!existing[0]?.exists) {
      return code;
    }
  }
  return `SST-${year}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function toListItem(row: CertificateListRow): CertificateListItem {
  const category = row.category as SstCategory;
  return {
    id: row.id,
    code: row.code,
    hours: row.hours,
    title: row.course_title,
    completedOn: `Completado el ${formatIssuedOn(row.issued_at)}`,
    year: String(row.issued_at.getFullYear()),
    category,
    categoryLabel: sstCategoryLabel(category),
    courseSlug: row.course_slug,
    imageUrl: row.cover_url ?? CERTIFICATE_FALLBACK_COVER,
    imageAlt: `Portada del curso ${row.course_title}`,
  };
}

function formatIssuedOn(date: Date): string {
  return new Intl.DateTimeFormat("es-CR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
