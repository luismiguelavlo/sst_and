"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import { submitAttendanceFormAction, submitPublicAttendanceFormAction } from "@/lib/attendance/actions";
import {
  ATTENDANCE_COMPANIES,
  type AttendanceFormForFill,
} from "@/lib/attendance";

type Prefill = Readonly<{
  firstName: string;
  lastName: string;
  cedula: string;
  jobTitle: string;
}>;

const FIELD_CLASS =
  "w-full rounded-lg border border-outline-variant bg-surface px-sm py-sm font-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary";

export function AttendanceFillForm({
  form,
  prefill,
  mode = "assigned",
}: Readonly<{
  form: AttendanceFormForFill;
  prefill: Prefill;
  mode?: "assigned" | "public";
}>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState(prefill.firstName);
  const [lastName, setLastName] = useState(prefill.lastName);
  const [cedula, setCedula] = useState(prefill.cedula);
  const [jobTitle, setJobTitle] = useState(prefill.jobTitle);
  const [company, setCompany] = useState("");
  const [topicSelected, setTopicSelected] = useState(
    form.topicOptions.length === 1 ? (form.topicOptions[0] ?? "") : "",
  );
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [qualityRating, setQualityRating] = useState<number | null>(null);
  const [qualityComment, setQualityComment] = useState("");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const payload = {
      formId: form.id,
      firstName,
      lastName,
      cedula,
      jobTitle,
      company,
      topicSelected,
      customAnswers,
      qualityRating: form.enableQualityRating ? qualityRating : null,
      qualityComment: form.enableQualityRating ? qualityComment : "",
      signatureData: form.enableSignature ? signatureData : null,
    };
    const result =
      mode === "public"
        ? await submitPublicAttendanceFormAction(payload)
        : await submitAttendanceFormAction(payload);
    setBusy(false);
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      return;
    }
    if (mode === "public") {
      setDone(true);
      showToast("Asistencia registrada. Gracias.");
      return;
    }
    showToast("Asistencia registrada. Gracias.");
    router.push("/my-attendance");
    router.refresh();
  }

  if (done) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg text-center shadow-sm">
        <MaterialIcon name="task_alt" className="text-[48px] text-secondary" />
        <h1 className="font-headline-md text-on-surface">Asistencia registrada</h1>
        <p className="font-body-md text-on-surface-variant">
          Gracias por completar «{form.title}». Ya puedes cerrar esta ventana.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        void onSubmit(event);
      }}
      className="mx-auto flex w-full max-w-2xl flex-col gap-md"
    >
      <header className="space-y-xs">
        <p className="font-label-sm tracking-wider text-primary uppercase">Asistencia</p>
        <h1 className="font-display-lg tracking-tight text-on-surface">{form.title}</h1>
        <p className="font-body-md text-on-surface-variant">
          Completa tus datos. Los campos de fecha y responsable ya están definidos por SST.
        </p>
      </header>

      <section className="space-y-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
        <Field label="Fecha">
          <input className={`${FIELD_CLASS} bg-surface-container-low`} value={form.eventDateLabel} readOnly />
        </Field>
        <Field label="Responsable">
          <input className={`${FIELD_CLASS} bg-surface-container-low`} value={form.responsibleName} readOnly />
        </Field>
        <Field label="Tema visto" required>
          <select
            className={FIELD_CLASS}
            required
            value={topicSelected}
            onChange={(event) => setTopicSelected(event.target.value)}
          >
            <option value="">Seleccionar...</option>
            {form.topicOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-1 gap-md md:grid-cols-2">
          <Field label="Nombres" required>
            <input
              className={FIELD_CLASS}
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Field>
          <Field label="Apellidos" required>
            <input
              className={FIELD_CLASS}
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </Field>
          <Field label="Cédula" required>
            <input
              className={FIELD_CLASS}
              required
              value={cedula}
              onChange={(event) => setCedula(event.target.value)}
            />
          </Field>
          <Field label="Cargo" required>
            <input
              className={FIELD_CLASS}
              required
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
            />
          </Field>
        </div>

        <Field label="Empresa" required>
          <select
            className={FIELD_CLASS}
            required
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          >
            <option value="">Seleccionar...</option>
            {ATTENDANCE_COMPANIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        {form.customFields.map((field) => (
          <Field key={field.id} label={field.label} required={field.required}>
            {field.type === "textarea" ? (
              <textarea
                className={`${FIELD_CLASS} min-h-[88px]`}
                required={field.required}
                value={customAnswers[field.id] ?? ""}
                onChange={(event) =>
                  setCustomAnswers((current) => ({ ...current, [field.id]: event.target.value }))
                }
              />
            ) : field.type === "select" ? (
              <select
                className={FIELD_CLASS}
                required={field.required}
                value={customAnswers[field.id] ?? ""}
                onChange={(event) =>
                  setCustomAnswers((current) => ({ ...current, [field.id]: event.target.value }))
                }
              >
                <option value="">Seleccionar...</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className={FIELD_CLASS}
                type={field.type === "number" ? "number" : "text"}
                required={field.required}
                value={customAnswers[field.id] ?? ""}
                onChange={(event) =>
                  setCustomAnswers((current) => ({ ...current, [field.id]: event.target.value }))
                }
              />
            )}
          </Field>
        ))}

        {form.enableQualityRating ? (
          <div className="space-y-sm rounded-lg border border-outline-variant/30 p-sm">
            <p className="font-label-md text-on-surface">
              Calificar calidad <span className="text-error">*</span>
            </p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;
                const active = qualityRating !== null && qualityRating >= value;
                return (
                  <button
                    key={value}
                    type="button"
                    className="rounded p-1 transition-colors hover:bg-surface-container"
                    aria-label={`${value} estrellas`}
                    onClick={() => setQualityRating(value)}
                  >
                    <MaterialIcon
                      name="star"
                      className={active ? "text-secondary" : "text-outline"}
                      filled={active}
                    />
                  </button>
                );
              })}
            </div>
            <textarea
              className={`${FIELD_CLASS} min-h-[72px]`}
              placeholder="Comentarios (opcional)"
              value={qualityComment}
              onChange={(event) => setQualityComment(event.target.value)}
            />
          </div>
        ) : null}

        {form.enableSignature ? (
          <div className="space-y-xs">
            <p className="font-label-md text-on-surface">
              Firma <span className="text-error">*</span>
            </p>
            <SignaturePad onChange={setSignatureData} />
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap items-center justify-end gap-sm">
        {mode === "assigned" ? (
          <button
            type="button"
            className="rounded-lg px-md py-sm font-label-md text-on-surface-variant hover:bg-surface-container"
            onClick={() => router.push("/my-attendance")}
          >
            Cancelar
          </button>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-lg py-sm font-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container disabled:opacity-60"
        >
          {busy ? "Enviando..." : "Enviar asistencia"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: Readonly<{ label: string; required?: boolean; children: React.ReactNode }>) {
  return (
    <label className="block space-y-xs">
      <span className="font-label-md text-on-surface">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function SignaturePad({ onChange }: Readonly<{ onChange: (value: string | null) => void }>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const ready = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || ready.current) {
      return;
    }
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 560;
    const height = 140;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#142175";
    ready.current = true;
  }, []);

  function pointerPos(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function startDraw(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }
    drawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    const { x, y } = pointerPos(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function moveDraw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }
    const { x, y } = pointerPos(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw() {
    if (!drawing.current) {
      return;
    }
    drawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    onChange(canvas.toDataURL("image/png"));
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    onChange(null);
  }

  return (
    <div className="space-y-xs">
      <canvas
        ref={canvasRef}
        className="h-[140px] w-full touch-none rounded-lg border border-dashed border-outline-variant/50 bg-surface"
        onPointerDown={startDraw}
        onPointerMove={moveDraw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
      />
      <button
        type="button"
        className="font-label-sm text-on-surface-variant hover:text-primary"
        onClick={clear}
      >
        Limpiar firma
      </button>
    </div>
  );
}
