"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import { saveAttendanceFormAction } from "@/lib/attendance/actions";
import {
  ATTENDANCE_COMPANIES,
  countAttendanceFields,
  createEmptyCustomField,
  customFieldTypeLabel,
  CUSTOM_FIELD_TYPE_OPTIONS,
  normalizeTopicOptions,
  type AttendanceCustomField,
  type AttendanceFormDraft,
  type CustomFieldType,
} from "@/lib/attendance";

type AttendanceFormBuilderProps = Readonly<{
  initialDraft: AttendanceFormDraft;
}>;

export function AttendanceFormBuilder({ initialDraft }: AttendanceFormBuilderProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [draft, setDraft] = useState<AttendanceFormDraft>(initialDraft);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const counts = useMemo(() => countAttendanceFields(draft), [draft]);
  const shareUrl = draft.id ? `${origin || ""}/a/${draft.id}` : null;

  function patchDraft(patch: Partial<AttendanceFormDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function patchField(fieldId: string, patch: Partial<AttendanceCustomField>) {
    setDraft((current) => ({
      ...current,
      customFields: current.customFields.map((field) =>
        field.id === fieldId ? { ...field, ...patch } : field,
      ),
    }));
  }

  function addField() {
    const field = createEmptyCustomField();
    setDraft((current) => ({
      ...current,
      customFields: [...current.customFields, field],
    }));
    setEditingFieldId(field.id);
  }

  function removeField(fieldId: string) {
    setDraft((current) => ({
      ...current,
      customFields: current.customFields.filter((field) => field.id !== fieldId),
    }));
    if (editingFieldId === fieldId) {
      setEditingFieldId(null);
    }
  }

  async function persist(publish: boolean) {
    setBusy(true);
    const payload: AttendanceFormDraft = {
      ...draft,
      status: publish ? "published" : "draft",
    };
    const result = await saveAttendanceFormAction(payload);
    setBusy(false);
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      return;
    }
    setDraft((current) => ({ ...current, id: result.id, status: payload.status }));
    if (publish) {
      const url = `${window.location.origin}/a/${result.id}`;
      try {
        await navigator.clipboard.writeText(url);
        showToast("Formulario publicado. Enlace público copiado al portapapeles.");
      } catch {
        showToast("Formulario publicado. Copia el enlace desde el panel de abajo.");
      }
    } else {
      showToast("Borrador guardado.");
    }
    router.push(`/attendance-forms/${result.id}/edit`);
    router.refresh();
  }

  async function copyPublicLink() {
    if (!draft.id) {
      showToast("Guarda o publica el formulario primero.", { variant: "error" });
      return;
    }
    if (draft.status !== "published") {
      showToast("Publica el formulario para obtener el enlace público.", { variant: "error" });
      return;
    }
    const url = `${window.location.origin}/a/${draft.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Enlace público copiado.");
    } catch {
      showToast("No se pudo copiar. Selecciona y copia el texto del enlace.", { variant: "error" });
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-md px-xs py-md lg:px-md">
      <div className="flex flex-col justify-between gap-md border-b border-outline-variant/30 pb-md md:flex-row md:items-center">
        <div>
          <h1 className="font-display-lg text-on-surface">
            {draft.id ? "Editar formulario de asistencia" : "Crear Formulario de Asistencia"}
          </h1>
          <p className="mt-2 font-body-lg text-on-surface-variant">
            Diseña y configura el registro de asistencia para eventos y capacitaciones.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-sm">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-outline-variant/50 bg-surface-container px-md py-sm font-label-md text-on-surface transition-colors hover:bg-surface-container-high"
            onClick={() => setPreviewOpen(true)}
          >
            <MaterialIcon name="visibility" className="text-[20px]" />
            Previsualizar
          </button>
          <button
            type="button"
            disabled={busy}
            className="flex items-center gap-2 rounded-lg bg-primary px-md py-sm font-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
            onClick={() => {
              void persist(false);
            }}
          >
            <MaterialIcon name="save" className="text-[20px]" />
            {busy ? "Guardando..." : "Guardar Formulario"}
          </button>
          <button
            type="button"
            disabled={busy}
            className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-md py-sm font-label-md text-primary transition-colors hover:bg-primary/15 disabled:opacity-60"
            onClick={() => {
              void persist(true);
            }}
          >
            <MaterialIcon name="publish" className="text-[20px]" />
            Publicar
          </button>
        </div>
      </div>

      {shareUrl ? (
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-md shadow-sm">
          <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
            <div>
              <h2 className="font-label-md text-on-surface">Enlace público del formulario</h2>
              <p className="mt-xs font-body-sm text-on-surface-variant">
                {draft.status === "published"
                  ? "Cualquiera con este enlace puede llenarlo sin registrarse."
                  : "Publica el formulario para activar el enlace público."}
              </p>
            </div>
            <button
              type="button"
              disabled={draft.status !== "published"}
              className="flex items-center gap-xs rounded-lg bg-primary px-md py-sm font-label-md text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                void copyPublicLink();
              }}
            >
              <MaterialIcon name="content_copy" className="text-[18px]" />
              Copiar enlace
            </button>
          </div>
          <div className="flex flex-col gap-sm sm:flex-row sm:items-center">
            <input
              className="w-full flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-sm py-sm font-body-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              readOnly
              value={shareUrl}
              onFocus={(event) => event.currentTarget.select()}
            />
            {draft.status === "published" ? (
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-xs rounded-lg border border-outline-variant/40 bg-surface-container px-md py-sm font-label-md text-on-surface transition-colors hover:bg-surface-container-high"
              >
                <MaterialIcon name="open_in_new" className="text-[18px]" />
                Abrir
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      <p className="rounded-lg bg-surface-container-high px-md py-sm font-body-sm text-on-surface-variant">
        Publicar deja el formulario listo. Puedes{" "}
        <a href="/assign-attendance" className="font-label-md text-primary hover:underline">
          asignarlo a empleados
        </a>{" "}
        (con notificación) y/o compartir el enlace público de arriba.
      </p>

      <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
        <div className="space-y-md lg:col-span-2">
          <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <div className="mb-md flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">Información Básica</h2>
              <span className="rounded-full bg-primary-container px-sm py-xs font-label-sm text-on-primary-container">
                Campos Fijos
              </span>
            </div>
            <div className="space-y-md">
              <label className="block space-y-xs">
                <span className="block font-label-md text-on-surface">
                  Título del Formulario <span className="text-error">*</span>
                </span>
                <input
                  className="w-full rounded-lg border border-outline-variant bg-surface px-sm py-sm font-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  type="text"
                  value={draft.title}
                  onChange={(event) => patchDraft({ title: event.target.value })}
                />
              </label>

              <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                <label className="block space-y-xs">
                  <span className="flex items-center justify-between font-label-md text-on-surface">
                    <span>
                      Fecha <span className="text-error">*</span>
                    </span>
                    <MaterialIcon name="lock" className="text-[16px] text-outline" />
                  </span>
                  <div className="relative">
                    <MaterialIcon
                      name="calendar_today"
                      className="absolute top-1/2 left-sm -translate-y-1/2 text-outline"
                    />
                    <input
                      className="w-full rounded-lg border border-outline-variant bg-surface py-sm pr-sm pl-10 font-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      type="date"
                      value={draft.eventDate}
                      onChange={(event) => patchDraft({ eventDate: event.target.value })}
                    />
                  </div>
                </label>
                <label className="block space-y-xs">
                  <span className="flex items-center justify-between font-label-md text-on-surface">
                    Nombre del Responsable
                    <MaterialIcon name="lock" className="text-[16px] text-outline" />
                  </span>
                  <input
                    className="w-full rounded-lg border border-outline-variant bg-surface px-sm py-sm font-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    type="text"
                    value={draft.responsibleName}
                    onChange={(event) => patchDraft({ responsibleName: event.target.value })}
                  />
                </label>
              </div>

              <label className="block space-y-xs">
                <span className="flex items-center justify-between font-label-md text-on-surface">
                  <span>
                    Tema Visto <span className="text-error">*</span>
                  </span>
                  <MaterialIcon name="lock" className="text-[16px] text-outline" />
                </span>
                <p className="font-body-sm text-on-surface-variant">
                  Define las opciones (una o varias) que el participante podrá elegir al diligenciar.
                </p>
                <textarea
                  className="min-h-[96px] w-full rounded-lg border border-outline-variant bg-surface px-sm py-sm font-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  value={draft.topicOptions.join("\n")}
                  placeholder={"Qué hacer en caso de un accidente de tránsito\nUso correcto de EPP"}
                  onChange={(event) =>
                    patchDraft({ topicOptions: event.target.value.split("\n") })
                  }
                />
                <span className="font-label-sm text-outline">Una opción por línea</span>
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <div className="mb-md flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">Datos del Participante</h2>
              <span className="rounded-full bg-primary-container px-sm py-xs font-label-sm text-on-primary-container">
                Campos Dinámicos
              </span>
            </div>

            <div className="space-y-md">
              <div className="space-y-xs opacity-75">
                <span className="block font-label-md text-on-surface">
                  Datos personales <span className="text-error">*</span>
                </span>
                <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
                  <LockedInput icon="person" placeholder="Nombres" />
                  <LockedInput placeholder="Apellidos" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                <LockedLabeledInput label="Cédula" icon="badge" required />
                <LockedLabeledInput label="Cargo" icon="work" required />
              </div>

              <div className="space-y-xs opacity-75">
                <span className="block font-label-md text-on-surface">
                  Empresa <span className="text-error">*</span>
                </span>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-outline-variant/50 bg-surface-container-low px-sm py-sm font-body-md text-on-surface-variant"
                    disabled
                    defaultValue=""
                  >
                    <option value="">Seleccionar...</option>
                    {ATTENDANCE_COMPANIES.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                  <MaterialIcon
                    name="expand_more"
                    className="pointer-events-none absolute top-1/2 right-sm -translate-y-1/2 text-outline"
                  />
                </div>
              </div>

              <div className="space-y-sm border-t border-outline-variant/30 pt-md">
                <h3 className="font-label-md tracking-wider text-on-surface-variant uppercase">
                  Campos Adicionales
                </h3>

                {draft.customFields.map((field) => (
                  <CustomFieldCard
                    key={field.id}
                    field={field}
                    editing={editingFieldId === field.id}
                    onEdit={() => setEditingFieldId(field.id)}
                    onCloseEdit={() => setEditingFieldId(null)}
                    onChange={(patch) => patchField(field.id, patch)}
                    onRemove={() => removeField(field.id)}
                  />
                ))}

                <button
                  type="button"
                  className="group flex w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-outline-variant/50 py-md font-label-md text-primary transition-all hover:border-primary hover:bg-primary-container/20"
                  onClick={addField}
                >
                  <MaterialIcon
                    name="add_circle"
                    className="transition-transform group-hover:scale-110"
                  />
                  Agregar campo adicional
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-md">
          <section className="space-y-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm">
            <h3 className="font-headline-md text-on-surface">Configuración Extra</h3>
            <div className="space-y-sm">
              <SettingToggle
                title="Calificar Calidad"
                description="Habilita un campo de 5 estrellas y comentarios al final del formulario."
                checked={draft.enableQualityRating}
                onChange={(value) => patchDraft({ enableQualityRating: value })}
              >
                <div className="mt-2 flex gap-1 rounded border border-outline-variant/30 bg-surface p-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <MaterialIcon
                      key={index}
                      name="star"
                      className="text-[16px] text-tertiary-fixed-dim"
                    />
                  ))}
                </div>
              </SettingToggle>

              <div className="my-sm h-px w-full bg-outline-variant/30" />

              <SettingToggle
                title="Firma Digital"
                description="Requiere que el participante dibuje su firma para enviar."
                checked={draft.enableSignature}
                onChange={(value) => patchDraft({ enableSignature: value })}
              >
                <div className="mt-2 flex h-12 items-center justify-center rounded border border-outline-variant/30 bg-surface p-2">
                  <MaterialIcon name="draw" className="text-[24px] text-outline-variant" />
                </div>
              </SettingToggle>
            </div>
          </section>

          <section className="rounded-xl bg-surface-container-high p-md">
            <div className="mb-2 flex items-center gap-sm text-primary">
              <MaterialIcon name="info" />
              <h4 className="font-label-md">Resumen del Formulario</h4>
            </div>
            <ul className="space-y-2 font-body-sm text-on-surface-variant">
              <li className="flex justify-between">
                <span>Campos Totales:</span>
                <span className="font-bold text-on-surface">{counts.total}</span>
              </li>
              <li className="flex justify-between">
                <span>Campos Obligatorios:</span>
                <span className="font-bold text-on-surface">{counts.required}</span>
              </li>
              <li className="flex justify-between">
                <span>Estado:</span>
                <span className="font-medium text-secondary">
                  {draft.status === "published" ? "Publicado" : "Borrador"}
                </span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      {previewOpen ? (
        <AttendanceFormPreview draft={draft} onClose={() => setPreviewOpen(false)} />
      ) : null}
    </div>
  );
}

function LockedInput({
  icon,
  placeholder,
}: Readonly<{ icon?: string; placeholder: string }>) {
  return (
    <div className="relative pointer-events-none opacity-75">
      {icon ? (
        <MaterialIcon
          name={icon}
          className="absolute top-1/2 left-sm -translate-y-1/2 text-outline"
        />
      ) : null}
      <input
        className={`w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-sm font-body-md text-on-surface-variant ${icon ? "pr-sm pl-10" : "px-sm"}`}
        disabled
        placeholder={placeholder}
        type="text"
      />
    </div>
  );
}

function LockedLabeledInput({
  label,
  icon,
  required,
}: Readonly<{ label: string; icon: string; required?: boolean }>) {
  return (
    <div className="space-y-xs opacity-75 pointer-events-none">
      <span className="block font-label-md text-on-surface">
        {label} {required ? <span className="text-error">*</span> : null}
      </span>
      <div className="relative">
        <MaterialIcon
          name={icon}
          className="absolute top-1/2 left-sm -translate-y-1/2 text-outline"
        />
        <input
          className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-sm pr-sm pl-10 font-body-md text-on-surface-variant"
          disabled
          type="text"
        />
      </div>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
  children,
}: Readonly<{
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  children?: React.ReactNode;
}>) {
  return (
    <label className="flex cursor-pointer items-start gap-sm rounded-lg p-sm transition-colors hover:bg-surface-container">
      <div className="relative flex items-center pt-1">
        <input
          className="peer sr-only"
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <div className="h-5 w-10 rounded-full bg-surface-variant after:absolute after:top-[6px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-outline after:bg-outline after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-on-primary" />
      </div>
      <div className="flex-1">
        <div className="font-label-md text-on-surface">{title}</div>
        <div className="mt-1 font-body-sm text-on-surface-variant">{description}</div>
        {children}
      </div>
    </label>
  );
}

function CustomFieldCard({
  field,
  editing,
  onEdit,
  onCloseEdit,
  onChange,
  onRemove,
}: Readonly<{
  field: AttendanceCustomField;
  editing: boolean;
  onEdit: () => void;
  onCloseEdit: () => void;
  onChange: (patch: Partial<AttendanceCustomField>) => void;
  onRemove: () => void;
}>) {
  return (
    <div className="group relative flex items-start gap-sm rounded-lg border border-outline-variant/50 bg-surface-container p-sm">
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <MaterialIcon name="drag_indicator" className="text-[18px] text-primary" />
          {editing ? (
            <input
              className="min-w-0 flex-1 rounded border border-outline-variant bg-surface px-xs py-xs font-label-md text-on-surface outline-none focus:border-primary"
              value={field.label}
              onChange={(event) => onChange({ label: event.target.value })}
            />
          ) : (
            <span className="font-label-md text-on-surface">{field.label}</span>
          )}
          <span className="rounded border border-outline-variant/30 bg-surface px-2 py-0.5 text-[10px] font-bold text-on-surface-variant uppercase">
            {customFieldTypeLabel(field.type)}
          </span>
        </div>
        {editing ? (
          <div className="space-y-sm pl-6">
            <label className="block space-y-xs">
              <span className="font-label-sm text-on-surface-variant">Tipo</span>
              <select
                className="w-full rounded-lg border border-outline-variant bg-surface px-sm py-xs font-body-sm text-on-surface"
                value={field.type}
                onChange={(event) =>
                  onChange({ type: event.target.value as CustomFieldType })
                }
              >
                {CUSTOM_FIELD_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-sm font-label-sm text-on-surface">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(event) => onChange({ required: event.target.checked })}
              />
              Obligatorio
            </label>
            {field.type === "select" ? (
              <label className="block space-y-xs">
                <span className="font-label-sm text-on-surface-variant">
                  Opciones (una por línea)
                </span>
                <textarea
                  className="min-h-[80px] w-full rounded-lg border border-outline-variant bg-surface p-sm font-body-sm text-on-surface"
                  value={field.options.join("\n")}
                  onChange={(event) =>
                    onChange({
                      options: event.target.value.split("\n"),
                    })
                  }
                />
              </label>
            ) : null}
            <button
              type="button"
              className="font-label-sm text-primary hover:underline"
              onClick={onCloseEdit}
            >
              Listo
            </button>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-xs opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          className="rounded p-1 text-on-surface-variant hover:bg-surface-container-highest"
          onClick={onEdit}
          aria-label="Editar campo"
        >
          <MaterialIcon name="edit" className="text-[18px]" />
        </button>
        <button
          type="button"
          className="rounded p-1 text-on-surface-variant hover:bg-error-container hover:text-error"
          onClick={onRemove}
          aria-label="Eliminar campo"
        >
          <MaterialIcon name="delete" className="text-[18px]" />
        </button>
      </div>
    </div>
  );
}

function AttendanceFormPreview({
  draft,
  onClose,
}: Readonly<{ draft: AttendanceFormDraft; onClose: () => void }>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-md">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-container-lowest p-md shadow-lg">
        <div className="mb-md flex items-start justify-between gap-sm">
          <div>
            <h2 className="font-headline-md text-on-surface">Previsualización</h2>
            <p className="mt-xs font-body-sm text-on-surface-variant">{draft.title}</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-xs text-on-surface-variant hover:bg-surface-container"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="space-y-md">
          <PreviewField label="Fecha" value={draft.eventDate || "dd-MMM-yyyy"} />
          <PreviewField label="Responsable" value={draft.responsibleName || "—"} />
          <label className="block space-y-xs">
            <span className="font-label-md text-on-surface">Tema visto</span>
            <select
              className="w-full rounded-lg border border-outline-variant bg-surface px-sm py-sm font-body-md text-on-surface-variant"
              disabled
              defaultValue=""
            >
              <option value="">Seleccionar...</option>
              {normalizeTopicOptions(draft.topicOptions).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
            <PreviewField label="Nombres" value="" />
            <PreviewField label="Apellidos" value="" />
            <PreviewField label="Cédula" value="" />
            <PreviewField label="Cargo" value="" />
          </div>
          <label className="block space-y-xs">
            <span className="font-label-md text-on-surface">Empresa</span>
            <select
              className="w-full rounded-lg border border-outline-variant bg-surface px-sm py-sm font-body-md text-on-surface-variant"
              disabled
              defaultValue=""
            >
              <option value="">Seleccionar...</option>
              {ATTENDANCE_COMPANIES.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </label>
          {draft.customFields.map((field) => (
            <PreviewField
              key={field.id}
              label={`${field.label}${field.required ? " *" : ""}`}
              value={
                field.type === "select"
                  ? field.options[0] ?? "Seleccionar..."
                  : ""
              }
            />
          ))}
          {draft.enableQualityRating ? (
            <div className="rounded-lg border border-outline-variant/30 p-sm">
              <p className="font-label-md text-on-surface">Calificar calidad</p>
              <div className="mt-sm flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <MaterialIcon key={index} name="star" className="text-outline" />
                ))}
              </div>
              <textarea
                className="mt-sm min-h-[72px] w-full rounded-lg border border-outline-variant bg-surface p-sm font-body-sm"
                disabled
                placeholder="Comentarios"
              />
            </div>
          ) : null}
          {draft.enableSignature ? (
            <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-outline-variant/50 bg-surface">
              <span className="font-body-sm text-on-surface-variant">Área de firma</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PreviewField({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <label className="block space-y-xs">
      <span className="font-label-md text-on-surface">{label}</span>
      <input
        className="w-full rounded-lg border border-outline-variant bg-surface px-sm py-sm font-body-md text-on-surface-variant"
        disabled
        value={value}
        readOnly
      />
    </label>
  );
}
