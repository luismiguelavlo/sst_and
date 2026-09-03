import "server-only";

import { getSql } from "@/lib/db";
import {
  isAttendanceFormStatus,
  isCustomFieldType,
  normalizeTopicOptions,
  topicSummary,
  type AttendanceActiveAssignment,
  type AttendanceAssignableForm,
  type AttendanceCustomField,
  type AttendanceFormDraft,
  type AttendanceFormForFill,
  type AttendanceFormListItem,
  type AttendanceFormStatus,
  type AttendancePendingItem,
  type AttendanceResponseExportRow,
  type AttendanceResponseListItem,
  type AttendanceSubmissionInput,
} from "@/lib/attendance";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type FormRow = {
  id: string;
  title: string;
  event_date: Date | null;
  responsible_name: string;
  topic: string;
  topic_options: unknown;
  enable_quality_rating: boolean;
  enable_signature: boolean;
  custom_fields: unknown;
  status: string;
  created_at: Date;
  updated_at: Date;
  response_count?: number;
  assignee_count?: number;
};

type ResponseExportRow = {
  form_id: string;
  form_title: string;
  submitted_at: Date;
  user_email: string | null;
  user_name: string | null;
  first_name: string;
  last_name: string;
  cedula: string;
  job_title: string;
  company: string;
  topic_selected: string;
  quality_rating: number | null;
  quality_comment: string;
  signature_data?: string | null;
  custom_answers: unknown;
  data_processing_consent?: boolean;
  data_processing_consent_at?: Date | null;
  data_processing_policy_version?: string | null;
};

export async function listAttendanceForms(): Promise<AttendanceFormListItem[]> {
  const sql = getSql();
  const rows = await sql<FormRow[]>`
    SELECT
      f.id::text,
      f.title,
      f.event_date,
      f.responsible_name,
      f.topic,
      f.topic_options,
      f.enable_quality_rating,
      f.enable_signature,
      f.custom_fields,
      f.status,
      f.created_at,
      f.updated_at,
      coalesce(r.response_count, 0)::int AS response_count,
      coalesce(a.assignee_count, 0)::int AS assignee_count
    FROM campus_sst.attendance_forms f
    LEFT JOIN (
      SELECT form_id, count(*)::int AS response_count
      FROM campus_sst.attendance_responses
      GROUP BY form_id
    ) r ON r.form_id = f.id
    LEFT JOIN (
      SELECT form_id, count(*)::int AS assignee_count
      FROM campus_sst.attendance_form_assignments
      GROUP BY form_id
    ) a ON a.form_id = f.id
    ORDER BY f.updated_at DESC
  `;
  return rows.filter((row) => isAttendanceFormStatus(row.status)).map(toListItem);
}

export async function getAttendanceForm(id: string): Promise<AttendanceFormDraft | null> {
  if (!UUID_PATTERN.test(id)) {
    return null;
  }
  const sql = getSql();
  const rows = await sql<FormRow[]>`
    SELECT
      id::text,
      title,
      event_date,
      responsible_name,
      topic,
      topic_options,
      enable_quality_rating,
      enable_signature,
      custom_fields,
      status,
      created_at,
      updated_at
    FROM campus_sst.attendance_forms
    WHERE id = ${id}::uuid
    LIMIT 1
  `;
  const row = rows[0];
  if (!row || !isAttendanceFormStatus(row.status)) {
    return null;
  }
  return toDraft(row);
}

export async function getPublishedAttendanceFormForFill(
  id: string,
): Promise<AttendanceFormForFill | null> {
  if (!UUID_PATTERN.test(id)) {
    return null;
  }
  const sql = getSql();
  const rows = await sql<FormRow[]>`
    SELECT
      id::text,
      title,
      event_date,
      responsible_name,
      topic,
      topic_options,
      enable_quality_rating,
      enable_signature,
      custom_fields,
      status,
      created_at,
      updated_at
    FROM campus_sst.attendance_forms
    WHERE id = ${id}::uuid AND status = 'published'
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) {
    return null;
  }
  return toFillForm(row);
}

export async function listPendingAttendanceFormsForUser(
  userId: string,
): Promise<AttendancePendingItem[]> {
  if (!UUID_PATTERN.test(userId)) {
    return [];
  }
  const sql = getSql();
  const pending = await sql<FormRow[]>`
    SELECT
      f.id::text,
      f.title,
      f.event_date,
      f.responsible_name,
      f.topic,
      f.topic_options,
      f.enable_quality_rating,
      f.enable_signature,
      f.custom_fields,
      f.status,
      f.created_at,
      f.updated_at
    FROM campus_sst.attendance_forms f
    INNER JOIN campus_sst.attendance_form_assignments a
      ON a.form_id = f.id AND a.user_id = ${userId}::uuid
    WHERE f.status = 'published'
      AND NOT EXISTS (
        SELECT 1
        FROM campus_sst.attendance_responses r
        WHERE r.form_id = f.id AND r.user_id = ${userId}::uuid
      )
    ORDER BY a.created_at DESC
  `;
  return pending.map((row) => ({
    id: row.id,
    title: row.title,
    topicSummary: topicSummary(parseTopicOptions(row.topic_options, row.topic)),
    responsibleName: row.responsible_name,
    eventDateLabel: row.event_date ? formatDate(row.event_date) : "Sin fecha",
    createdAtLabel: formatDate(row.created_at),
  }));
}

export async function isUserAssignedToAttendanceForm(
  formId: string,
  userId: string,
): Promise<boolean> {
  if (!UUID_PATTERN.test(formId) || !UUID_PATTERN.test(userId)) {
    return false;
  }
  const sql = getSql();
  const rows = await sql<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1
      FROM campus_sst.attendance_form_assignments
      WHERE form_id = ${formId}::uuid AND user_id = ${userId}::uuid
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

export async function hasUserSubmittedAttendanceForm(
  formId: string,
  userId: string,
): Promise<boolean> {
  if (!UUID_PATTERN.test(formId) || !UUID_PATTERN.test(userId)) {
    return false;
  }
  const sql = getSql();
  const rows = await sql<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1
      FROM campus_sst.attendance_responses
      WHERE form_id = ${formId}::uuid AND user_id = ${userId}::uuid
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

export async function createAttendanceForm(
  input: AttendanceFormDraft,
  createdBy: string,
): Promise<{ id: string }> {
  const sql = getSql();
  const topics = normalizeTopicOptions(input.topicOptions);
  const rows = await sql<{ id: string }[]>`
    INSERT INTO campus_sst.attendance_forms (
      title, event_date, responsible_name, topic, topic_options,
      enable_quality_rating, enable_signature, custom_fields, status, created_by
    )
    VALUES (
      ${input.title.trim()},
      ${toDateOrNull(input.eventDate)},
      ${input.responsibleName.trim()},
      ${topics[0] ?? ""},
      ${sql.json(topics)},
      ${input.enableQualityRating},
      ${input.enableSignature},
      ${sql.json(normalizeCustomFields(input.customFields))},
      ${input.status},
      ${UUID_PATTERN.test(createdBy) ? createdBy : null}::uuid
    )
    RETURNING id::text
  `;
  const row = rows[0];
  if (!row) {
    throw new Error("No se pudo crear el formulario.");
  }
  return row;
}

export async function updateAttendanceForm(
  id: string,
  input: AttendanceFormDraft,
): Promise<{ id: string }> {
  if (!UUID_PATTERN.test(id)) {
    throw new Error("Formulario inválido.");
  }
  const sql = getSql();
  const topics = normalizeTopicOptions(input.topicOptions);
  const rows = await sql<{ id: string }[]>`
    UPDATE campus_sst.attendance_forms SET
      title = ${input.title.trim()},
      event_date = ${toDateOrNull(input.eventDate)},
      responsible_name = ${input.responsibleName.trim()},
      topic = ${topics[0] ?? ""},
      topic_options = ${sql.json(topics)},
      enable_quality_rating = ${input.enableQualityRating},
      enable_signature = ${input.enableSignature},
      custom_fields = ${sql.json(normalizeCustomFields(input.customFields))},
      status = ${input.status},
      updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING id::text
  `;
  const row = rows[0];
  if (!row) {
    throw new Error("El formulario no existe.");
  }
  return row;
}

export async function deleteAttendanceForm(id: string): Promise<void> {
  if (!UUID_PATTERN.test(id)) {
    throw new Error("Formulario inválido.");
  }
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    DELETE FROM campus_sst.attendance_forms
    WHERE id = ${id}::uuid
    RETURNING id::text
  `;
  if (!rows[0]) {
    throw new Error("El formulario no existe.");
  }
}

export async function submitAttendanceResponse(
  userId: string | null,
  input: AttendanceSubmissionInput,
): Promise<void> {
  if (!UUID_PATTERN.test(input.formId)) {
    throw new Error("Formulario inválido.");
  }
  if (userId !== null && !UUID_PATTERN.test(userId)) {
    throw new Error("Usuario inválido.");
  }
  if (!input.dataProcessingConsentAccepted) {
    throw new Error("Debes aceptar el tratamiento de datos personales.");
  }
  const sql = getSql();
  try {
    await sql`
      INSERT INTO campus_sst.attendance_responses (
        form_id, user_id, first_name, last_name, cedula, job_title, company,
        topic_selected, custom_answers, quality_rating, quality_comment, signature_data,
        data_processing_consent, data_processing_consent_at, data_processing_policy_version
      )
      VALUES (
        ${input.formId}::uuid,
        ${userId}::uuid,
        ${input.firstName.trim()},
        ${input.lastName.trim()},
        ${input.cedula.trim()},
        ${input.jobTitle.trim()},
        ${input.company.trim()},
        ${input.topicSelected.trim()},
        ${sql.json(input.customAnswers)},
        ${input.qualityRating},
        ${input.qualityComment.trim()},
        ${input.signatureData?.trim() || null},
        ${true},
        now(),
        ${input.dataProcessingPolicyVersion.trim()}
      )
    `;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error("Ya diligenciaste este formulario.");
    }
    throw error;
  }
}

export async function listAttendanceResponsesForExport(
  formIds: readonly string[],
): Promise<AttendanceResponseExportRow[]> {
  const ids = formIds.filter((id) => UUID_PATTERN.test(id));
  if (ids.length === 0) {
    return [];
  }
  const sql = getSql();
  const rows = await sql<ResponseExportRow[]>`
    SELECT
      r.form_id::text,
      f.title AS form_title,
      r.submitted_at,
      u.email AS user_email,
      u.name AS user_name,
      r.first_name,
      r.last_name,
      r.cedula,
      r.job_title,
      r.company,
      r.topic_selected,
      r.quality_rating,
      r.quality_comment,
      r.signature_data,
      r.custom_answers,
      r.data_processing_consent,
      r.data_processing_consent_at,
      r.data_processing_policy_version
    FROM campus_sst.attendance_responses r
    INNER JOIN campus_sst.attendance_forms f ON f.id = r.form_id
    LEFT JOIN campus_sst.users u ON u.id = r.user_id
    WHERE r.form_id IN ${sql(ids)}
    ORDER BY f.title ASC, r.submitted_at DESC
  `;
  return rows.map((row) => ({
    formId: row.form_id,
    formTitle: row.form_title,
    submittedAtLabel: formatDateTime(row.submitted_at),
    userEmail: row.user_email ?? "(enlace público)",
    userName: row.user_name ?? "Externo",
    firstName: row.first_name,
    lastName: row.last_name,
    cedula: row.cedula,
    jobTitle: row.job_title,
    company: row.company,
    topicSelected: row.topic_selected,
    qualityRating: row.quality_rating,
    qualityComment: row.quality_comment,
    signatureData: row.signature_data?.trim() || null,
    customAnswers: parseCustomAnswers(row.custom_answers),
    dataProcessingConsent: Boolean(row.data_processing_consent),
    dataProcessingConsentAtLabel: row.data_processing_consent_at
      ? formatDateTime(row.data_processing_consent_at)
      : null,
    dataProcessingPolicyVersion: row.data_processing_policy_version ?? null,
  }));
}

export async function listAttendanceResponsesForForm(
  formId: string,
): Promise<AttendanceResponseListItem[]> {
  if (!UUID_PATTERN.test(formId)) {
    return [];
  }
  const sql = getSql();
  const rows = await sql<
    (ResponseExportRow & { id: string; user_id: string | null })[]
  >`
    SELECT
      r.id::text,
      r.form_id::text,
      f.title AS form_title,
      r.submitted_at,
      r.user_id::text AS user_id,
      u.email AS user_email,
      u.name AS user_name,
      r.first_name,
      r.last_name,
      r.cedula,
      r.job_title,
      r.company,
      r.topic_selected,
      r.quality_rating,
      r.quality_comment,
      r.custom_answers,
      r.data_processing_consent,
      r.data_processing_consent_at,
      r.data_processing_policy_version
    FROM campus_sst.attendance_responses r
    INNER JOIN campus_sst.attendance_forms f ON f.id = r.form_id
    LEFT JOIN campus_sst.users u ON u.id = r.user_id
    WHERE r.form_id = ${formId}::uuid
    ORDER BY r.submitted_at DESC
  `;
  return rows.map((row) => ({
    id: row.id,
    source: row.user_id ? "assigned" : "public",
    firstName: row.first_name,
    lastName: row.last_name,
    cedula: row.cedula,
    jobTitle: row.job_title,
    company: row.company,
    topicSelected: row.topic_selected,
    qualityRating: row.quality_rating,
    qualityComment: row.quality_comment,
    submittedAtLabel: formatDateTime(row.submitted_at),
    userEmail: row.user_email,
    userName: row.user_name,
    customAnswers: parseCustomAnswers(row.custom_answers),
    dataProcessingConsent: Boolean(row.data_processing_consent),
    dataProcessingConsentAtLabel: row.data_processing_consent_at
      ? formatDateTime(row.data_processing_consent_at)
      : null,
    dataProcessingPolicyVersion: row.data_processing_policy_version ?? null,
  }));
}

export async function listActiveWorkerUserIds(): Promise<string[]> {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    SELECT id::text
    FROM campus_sst.users
    WHERE role = 'user' AND status = 'active'
  `;
  return rows.map((row) => row.id);
}

export async function listAssignableAttendanceForms(): Promise<AttendanceAssignableForm[]> {
  const sql = getSql();
  const rows = await sql<
    { id: string; title: string; topic: string; topic_options: unknown; event_date: Date | null }[]
  >`
    SELECT
      id::text,
      title,
      topic,
      topic_options,
      event_date
    FROM campus_sst.attendance_forms
    WHERE status = 'published'
    ORDER BY updated_at DESC
  `;
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    meta: [
      topicSummary(parseTopicOptions(row.topic_options, row.topic)),
      row.event_date ? formatDate(row.event_date) : "Sin fecha",
    ].join(" · "),
  }));
}

export async function createAttendanceFormAssignments(input: {
  formIds: readonly string[];
  userIds: readonly string[];
  assignedBy: string;
}): Promise<{ created: number; notifiedFormIds: string[] }> {
  const formIds = [...new Set(input.formIds.filter((id) => UUID_PATTERN.test(id)))];
  const userIds = [...new Set(input.userIds.filter((id) => UUID_PATTERN.test(id)))];
  if (formIds.length === 0) {
    throw new Error("Selecciona al menos un formulario publicado.");
  }
  if (userIds.length === 0) {
    throw new Error("Selecciona al menos un empleado.");
  }
  if (!UUID_PATTERN.test(input.assignedBy)) {
    throw new Error("Administrador inválido.");
  }

  const sql = getSql();
  const published = await sql<{ id: string }[]>`
    SELECT id::text
    FROM campus_sst.attendance_forms
    WHERE status = 'published' AND id IN ${sql(formIds)}
  `;
  const validFormIds = published.map((row) => row.id);
  if (validFormIds.length === 0) {
    throw new Error("Solo se pueden asignar formularios publicados.");
  }

  let created = 0;
  const notifiedFormIds = new Set<string>();
  await sql.begin(async (tx) => {
    for (const formId of validFormIds) {
      for (const userId of userIds) {
        const rows = await tx<{ id: string }[]>`
          INSERT INTO campus_sst.attendance_form_assignments (
            form_id, user_id, assigned_by
          )
          VALUES (
            ${formId}::uuid,
            ${userId}::uuid,
            ${input.assignedBy}::uuid
          )
          ON CONFLICT (form_id, user_id) DO NOTHING
          RETURNING id::text
        `;
        if (rows[0]) {
          created += 1;
          notifiedFormIds.add(formId);
        }
      }
    }
  });

  return { created, notifiedFormIds: [...notifiedFormIds] };
}

export async function listActiveAttendanceAssignments(): Promise<AttendanceActiveAssignment[]> {
  const sql = getSql();
  const rows = await sql<
    {
      id: string;
      form_id: string;
      form_title: string;
      employee_name: string;
      employee_email: string;
      created_at: Date;
      submitted: boolean;
    }[]
  >`
    SELECT
      a.id::text,
      a.form_id::text,
      f.title AS form_title,
      u.name AS employee_name,
      u.email AS employee_email,
      a.created_at,
      EXISTS (
        SELECT 1
        FROM campus_sst.attendance_responses r
        WHERE r.form_id = a.form_id AND r.user_id = a.user_id
      ) AS submitted
    FROM campus_sst.attendance_form_assignments a
    INNER JOIN campus_sst.attendance_forms f ON f.id = a.form_id
    INNER JOIN campus_sst.users u ON u.id = a.user_id
    ORDER BY a.created_at DESC
    LIMIT 80
  `;
  return rows.map((row) => ({
    id: row.id,
    formId: row.form_id,
    formTitle: row.form_title,
    employeeName: row.employee_name,
    employeeEmail: row.employee_email,
    assignedAt: formatDateTime(row.created_at),
    submitted: row.submitted,
  }));
}

export async function deleteAttendanceFormAssignment(assignmentId: string): Promise<void> {
  if (!UUID_PATTERN.test(assignmentId)) {
    throw new Error("Asignación inválida.");
  }
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    DELETE FROM campus_sst.attendance_form_assignments
    WHERE id = ${assignmentId}::uuid
    RETURNING id::text
  `;
  if (!rows[0]) {
    throw new Error("La asignación no existe.");
  }
}

function toListItem(row: FormRow): AttendanceFormListItem {
  const fields = parseCustomFields(row.custom_fields);
  const topics = parseTopicOptions(row.topic_options, row.topic);
  const extras = (row.enable_quality_rating ? 2 : 0) + (row.enable_signature ? 1 : 0);
  return {
    id: row.id,
    title: row.title,
    topic: topicSummary(topics),
    responsibleName: row.responsible_name,
    eventDateLabel: row.event_date ? formatDate(row.event_date) : "Sin fecha",
    createdAtLabel: formatDate(row.created_at),
    createdAtTimeLabel: formatTime(row.created_at),
    createdAtIso: row.created_at.toISOString(),
    status: row.status as AttendanceFormStatus,
    fieldCount: 8 + fields.length + extras,
    responseCount: row.response_count ?? 0,
    assigneeCount: row.assignee_count ?? 0,
    updatedAtLabel: formatDateTime(row.updated_at),
  };
}

function toDraft(row: FormRow): AttendanceFormDraft {
  return {
    id: row.id,
    title: row.title,
    eventDate: row.event_date ? row.event_date.toISOString().slice(0, 10) : "",
    responsibleName: row.responsible_name,
    topicOptions: parseTopicOptions(row.topic_options, row.topic),
    enableQualityRating: row.enable_quality_rating,
    enableSignature: row.enable_signature,
    customFields: parseCustomFields(row.custom_fields),
    status: row.status as AttendanceFormStatus,
  };
}

function toFillForm(row: FormRow): AttendanceFormForFill {
  return {
    id: row.id,
    title: row.title,
    eventDate: row.event_date ? row.event_date.toISOString().slice(0, 10) : "",
    eventDateLabel: row.event_date ? formatDate(row.event_date) : "Sin fecha",
    responsibleName: row.responsible_name,
    topicOptions: parseTopicOptions(row.topic_options, row.topic),
    enableQualityRating: row.enable_quality_rating,
    enableSignature: row.enable_signature,
    customFields: parseCustomFields(row.custom_fields),
  };
}

function parseTopicOptions(value: unknown, fallbackTopic: string): string[] {
  if (Array.isArray(value)) {
    const fromJson = normalizeTopicOptions(
      value.filter((item): item is string => typeof item === "string"),
    );
    if (fromJson.length > 0) {
      return fromJson;
    }
  }
  const fallback = fallbackTopic.trim();
  return fallback.length > 0 ? [fallback] : [];
}

function parseCustomFields(value: unknown): AttendanceCustomField[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const fields: AttendanceCustomField[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const raw = item as Record<string, unknown>;
    const type = typeof raw.type === "string" && isCustomFieldType(raw.type) ? raw.type : null;
    if (!type || typeof raw.id !== "string" || typeof raw.label !== "string") {
      continue;
    }
    fields.push({
      id: raw.id,
      label: raw.label,
      type,
      required: Boolean(raw.required),
      options: Array.isArray(raw.options)
        ? raw.options.filter((option): option is string => typeof option === "string")
        : [],
    });
  }
  return fields;
}

function parseCustomAnswers(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const result: Record<string, string> = {};
  for (const [key, answer] of Object.entries(value)) {
    if (typeof answer === "string") {
      result[key] = answer;
    }
  }
  return result;
}

function normalizeCustomFields(fields: readonly AttendanceCustomField[]): AttendanceCustomField[] {
  return fields.map((field) => ({
    id: field.id,
    label: field.label.trim(),
    type: field.type,
    required: field.required,
    options:
      field.type === "select"
        ? field.options.map((option) => option.trim()).filter((option) => option.length > 0)
        : [],
  }));
}

function toDateOrNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

function formatDate(value: Date): string {
  return value.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(value: Date): string {
  return value.toLocaleTimeString("es-CR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(value: Date): string {
  return value.toLocaleString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
