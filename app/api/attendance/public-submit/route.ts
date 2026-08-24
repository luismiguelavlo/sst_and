import { NextResponse } from "next/server";
import {
  validateAttendanceSubmission,
  type AttendanceSubmissionInput,
} from "@/lib/attendance";
import {
  getPublishedAttendanceFormForFill,
  submitAttendanceResponse,
} from "@/lib/attendance/repository";

export const dynamic = "force-dynamic";

const MAX_SIGNATURE_CHARS = 400_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const input = toSubmissionInput(raw);
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Faltan datos del formulario." },
      { status: 400 },
    );
  }

  try {
    const form = await getPublishedAttendanceFormForFill(input.formId);
    if (!form) {
      return NextResponse.json(
        { ok: false, error: "El formulario no está disponible o no está publicado." },
        { status: 404 },
      );
    }

    const normalized: AttendanceSubmissionInput = {
      ...input,
      formId: form.id,
      customAnswers: Object.fromEntries(
        form.customFields.map((field) => [
          field.id,
          (input.customAnswers[field.id] ?? "").trim(),
        ]),
      ),
      signatureData:
        input.signatureData && input.signatureData.length > MAX_SIGNATURE_CHARS
          ? input.signatureData.slice(0, MAX_SIGNATURE_CHARS)
          : input.signatureData,
    };

    const error = validateAttendanceSubmission(form, normalized);
    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    await submitAttendanceResponse(null, normalized);
    return NextResponse.json({ ok: true });
  } catch (caught) {
    return NextResponse.json(
      {
        ok: false,
        error: caught instanceof Error ? caught.message : "No se pudo enviar el formulario.",
      },
      { status: 500 },
    );
  }
}

function toSubmissionInput(raw: Record<string, unknown>): AttendanceSubmissionInput | null {
  if (typeof raw.formId !== "string") {
    return null;
  }
  return {
    formId: raw.formId,
    firstName: stringOrEmpty(raw.firstName),
    lastName: stringOrEmpty(raw.lastName),
    cedula: stringOrEmpty(raw.cedula),
    jobTitle: stringOrEmpty(raw.jobTitle),
    company: stringOrEmpty(raw.company),
    topicSelected: stringOrEmpty(raw.topicSelected),
    customAnswers:
      raw.customAnswers && typeof raw.customAnswers === "object" && !Array.isArray(raw.customAnswers)
        ? Object.fromEntries(
            Object.entries(raw.customAnswers).map(([key, value]) => [
              key,
              typeof value === "string" ? value : "",
            ]),
          )
        : {},
    qualityRating:
      typeof raw.qualityRating === "number"
        ? raw.qualityRating
        : raw.qualityRating === null
          ? null
          : null,
    qualityComment: stringOrEmpty(raw.qualityComment),
    signatureData:
      typeof raw.signatureData === "string"
        ? raw.signatureData
        : raw.signatureData === null
          ? null
          : null,
  };
}

function stringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value : "";
}
