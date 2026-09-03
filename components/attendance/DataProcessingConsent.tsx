"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  ATTENDANCE_DATA_POLICY,
  ATTENDANCE_DATA_POLICY_CONSENT_LABEL,
  ATTENDANCE_DATA_POLICY_SECTIONS,
} from "@/lib/privacy/attendance-data-policy";

type DataProcessingConsentProps = Readonly<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string | null;
}>;

export function DataProcessingConsent({
  checked,
  onChange,
  disabled = false,
  error = null,
}: DataProcessingConsentProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="space-y-sm rounded-lg border border-outline-variant/30 bg-surface-container-low/60 p-sm"
      aria-labelledby="data-policy-heading"
    >
      <div className="flex items-start justify-between gap-sm">
        <div>
          <h2 id="data-policy-heading" className="font-label-md text-on-surface">
            {ATTENDANCE_DATA_POLICY.title}
          </h2>
          <p className="mt-0.5 font-body-sm text-on-surface-variant">
            Versión {ATTENDANCE_DATA_POLICY.version} · Actualizada{" "}
            {ATTENDANCE_DATA_POLICY.updatedAtLabel}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-xs rounded-lg px-sm py-xs font-label-sm text-primary transition-colors hover:bg-primary/5 disabled:opacity-60"
          onClick={() => setExpanded((current) => !current)}
          disabled={disabled}
          aria-expanded={expanded}
        >
          <MaterialIcon name={expanded ? "expand_less" : "expand_more"} className="text-[18px]" />
          {expanded ? "Ocultar" : "Ver política"}
        </button>
      </div>

      {expanded ? (
        <div className="max-h-56 space-y-sm overflow-y-auto rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-sm py-sm">
          {ATTENDANCE_DATA_POLICY_SECTIONS.map((section) => (
            <article key={section.heading} className="space-y-xs">
              <h3 className="font-label-sm text-on-surface">{section.heading}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="font-body-sm text-on-surface-variant">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      ) : null}

      <label className="flex cursor-pointer items-start gap-sm">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-outline-variant text-primary focus:ring-primary"
          checked={checked}
          disabled={disabled}
          required
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="font-body-sm text-on-surface">
          {ATTENDANCE_DATA_POLICY_CONSENT_LABEL}
          <span className="text-error"> *</span>
        </span>
      </label>

      {error ? (
        <p className="font-body-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
