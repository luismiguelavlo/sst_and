"use server";

import { requireAdmin } from "@/lib/auth/guards";
import {
  buildComplianceReport,
  getComplianceThresholds,
  resetComplianceThresholds,
  saveComplianceThresholds,
} from "@/lib/sg-sst/cumplimiento/repository";
import {
  validateComplianceThresholds,
  type ComplianceThresholds,
  type SgsstComplianceReport,
} from "@/lib/sg-sst/cumplimiento/types";
import { auditCustom } from "@/lib/sg-sst/trazabilidad/helpers";
import { buildAuditSummary } from "@/lib/sg-sst/trazabilidad/types";
import { revalidatePath } from "next/cache";

export async function loadComplianceReportAction(): Promise<SgsstComplianceReport> {
  await requireAdmin();
  return buildComplianceReport();
}

export async function loadComplianceThresholdsAction(): Promise<ComplianceThresholds> {
  await requireAdmin();
  return getComplianceThresholds();
}

export async function saveComplianceThresholdsAction(input: {
  greenMinPct: number;
  yellowMinPct: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await requireAdmin();
  const parsed = validateComplianceThresholds(input);
  if (!parsed.ok) return parsed;
  try {
    await saveComplianceThresholds(parsed.value, admin.id);
    await auditCustom({
      actor: admin,
      action: "config",
      module: "cumplimiento",
      entityType: "compliance_settings",
      summary: buildAuditSummary({
        actorName: admin.name,
        verb: "actualizó",
        subject: "los umbrales del semáforo de cumplimiento SG-SST",
      }),
      details: {
        extra: {
          greenMinPct: parsed.value.greenMinPct,
          yellowMinPct: parsed.value.yellowMinPct,
        },
      },
    });
    revalidatePath("/sg-sst");
    revalidatePath("/sg-sst/configuracion");
    revalidatePath("/sg-sst/alertas-sst/configuracion");
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudieron guardar los umbrales. ¿Ejecutó la migración?",
    };
  }
}

export async function resetComplianceThresholdsAction(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const admin = await requireAdmin();
  try {
    await resetComplianceThresholds(admin.id);
    revalidatePath("/sg-sst");
    revalidatePath("/sg-sst/configuracion");
    revalidatePath("/sg-sst/alertas-sst/configuracion");
    return { ok: true };
  } catch (caught) {
    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : "No se pudieron restablecer los umbrales.",
    };
  }
}
