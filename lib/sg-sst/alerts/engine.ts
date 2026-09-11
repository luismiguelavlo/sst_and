import {
  ALERT_KIND_META,
  type SstAlertKind,
  type SstAlertThresholds,
  type SstAlertView,
  type SstComplianceRecord,
  type SstSemaphoreLevel,
  type SstWorkflowStatus,
} from "@/lib/sg-sst/alerts/types";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function daysBetween(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.round(ms / 86_400_000);
}

export function computeDaysRemaining(dueDate: string | null, today = new Date()): number | null {
  if (!dueDate) {
    return null;
  }
  return daysBetween(today, parseDateOnly(dueDate));
}

export function resolveThresholdsForType(
  settings: SstAlertThresholds,
  recordType: SstComplianceRecord["recordType"],
): Pick<SstAlertThresholds, "criticalMaxDays" | "orangeMaxDays" | "yellowMaxDays"> {
  const override = settings.typeOverrides[recordType];
  return {
    criticalMaxDays: settings.criticalMaxDays,
    orangeMaxDays: override?.orangeMaxDays ?? settings.orangeMaxDays,
    yellowMaxDays: override?.yellowMaxDays ?? settings.yellowMaxDays,
  };
}

export function computeSemaphore(
  daysRemaining: number | null,
  settings: SstAlertThresholds,
  recordType: SstComplianceRecord["recordType"],
  workflowStatus: SstWorkflowStatus,
): SstSemaphoreLevel {
  if (workflowStatus === "closed" || workflowStatus === "cancelled") {
    return "vigente";
  }

  if (
    workflowStatus === "pending_implementation" ||
    workflowStatus === "pending_delivery" ||
    workflowStatus === "pending_closure"
  ) {
    if (daysRemaining !== null && daysRemaining <= 0) {
      return "critico";
    }
    return daysRemaining !== null && daysRemaining <= resolveThresholdsForType(settings, recordType).orangeMaxDays
      ? "proximo"
      : "seguimiento";
  }

  if (daysRemaining === null) {
    return workflowStatus === "open" || workflowStatus === "in_progress" ? "seguimiento" : "vigente";
  }

  const thresholds = resolveThresholdsForType(settings, recordType);
  if (daysRemaining <= thresholds.criticalMaxDays) {
    return "critico";
  }
  if (daysRemaining <= thresholds.orangeMaxDays) {
    return "proximo";
  }
  if (daysRemaining <= thresholds.yellowMaxDays) {
    return "seguimiento";
  }
  return "vigente";
}

export function semaphoreLabel(level: SstSemaphoreLevel, daysRemaining: number | null): string {
  if (level === "critico") {
    if (daysRemaining === null) {
      return "Crítico";
    }
    if (daysRemaining < 0) {
      return `Vencido hace ${Math.abs(daysRemaining)}d`;
    }
    return daysRemaining === 0 ? "Vence hoy" : "Crítico";
  }
  if (level === "proximo") {
    return daysRemaining === null ? "Próximo a vencer" : `Vence en ${daysRemaining}d`;
  }
  if (level === "seguimiento") {
    return daysRemaining === null ? "Requiere seguimiento" : `Vence en ${daysRemaining}d`;
  }
  return daysRemaining === null ? "Vigente" : `Vigente (${daysRemaining}d)`;
}

function isOpenLike(status: SstWorkflowStatus): boolean {
  return status !== "closed" && status !== "cancelled";
}

function matchesProximity(
  semaphore: SstSemaphoreLevel,
  target: "critico" | "proximo" | "seguimiento",
): boolean {
  return semaphore === target;
}

export function resolveAlertKinds(
  record: SstComplianceRecord,
  semaphore: SstSemaphoreLevel,
): SstAlertKind[] {
  if (!isOpenLike(record.workflowStatus)) {
    return [];
  }

  const kinds: SstAlertKind[] = [];
  const { recordType, workflowStatus } = record;

  if (recordType === "curso") {
    if (matchesProximity(semaphore, "critico")) kinds.push("cursos_vencidos");
    if (matchesProximity(semaphore, "proximo")) kinds.push("cursos_proximos");
  }

  if (recordType === "examen_medico") {
    if (matchesProximity(semaphore, "critico")) kinds.push("examenes_medicos_vencidos");
    if (matchesProximity(semaphore, "proximo")) kinds.push("examenes_medicos_proximos");
  }

  if (recordType === "incapacidad") {
    if (matchesProximity(semaphore, "proximo") || matchesProximity(semaphore, "seguimiento")) {
      kinds.push("incapacidades_proximas");
    }
    if (
      matchesProximity(semaphore, "critico") ||
      workflowStatus === "pending_closure"
    ) {
      kinds.push("incapacidades_vencidas_sin_cierre");
    }
  }

  if (recordType === "restriccion") {
    if (matchesProximity(semaphore, "proximo") || matchesProximity(semaphore, "seguimiento")) {
      kinds.push("restricciones_proximas");
    }
    if (workflowStatus === "pending_implementation") {
      kinds.push("restricciones_pendientes_implementacion");
    }
  }

  if (recordType === "reintegro" && isOpenLike(workflowStatus)) {
    kinds.push("reintegros_pendientes");
  }

  if (recordType === "inspeccion" && isOpenLike(workflowStatus)) {
    if (
      matchesProximity(semaphore, "critico") ||
      matchesProximity(semaphore, "proximo") ||
      matchesProximity(semaphore, "seguimiento") ||
      workflowStatus === "open" ||
      workflowStatus === "in_progress"
    ) {
      kinds.push("inspecciones_pendientes");
    }
  }

  if (recordType === "epp") {
    if (workflowStatus === "pending_delivery") {
      kinds.push("epp_pendientes_entrega");
    }
    if (matchesProximity(semaphore, "proximo") || matchesProximity(semaphore, "seguimiento")) {
      kinds.push("epp_proximos_reposicion");
    }
    if (matchesProximity(semaphore, "critico")) {
      kinds.push("epp_proximos_reposicion");
    }
  }

  if (recordType === "investigacion" && isOpenLike(workflowStatus)) {
    kinds.push("investigaciones_pendientes");
  }

  if (recordType === "accion_correctiva" && matchesProximity(semaphore, "critico")) {
    kinds.push("acciones_correctivas_vencidas");
  }

  if (recordType === "documento") {
    if (matchesProximity(semaphore, "proximo") || matchesProximity(semaphore, "seguimiento")) {
      kinds.push("documentos_proximos_revision");
    }
    if (matchesProximity(semaphore, "critico")) {
      kinds.push("documentos_vencidos");
    }
  }

  if (recordType === "licencia" && (matchesProximity(semaphore, "proximo") || matchesProximity(semaphore, "critico") || matchesProximity(semaphore, "seguimiento"))) {
    kinds.push("licencias_proximas");
  }

  if (
    recordType === "certificacion" &&
    (matchesProximity(semaphore, "proximo") ||
      matchesProximity(semaphore, "critico") ||
      matchesProximity(semaphore, "seguimiento"))
  ) {
    kinds.push("certificaciones_proximas");
  }

  return [...new Set(kinds)];
}

export function enrichRecordAsAlert(
  record: SstComplianceRecord,
  settings: SstAlertThresholds,
  today = new Date(),
): SstAlertView {
  const daysRemaining = computeDaysRemaining(record.dueDate, today);
  const semaphore = computeSemaphore(
    daysRemaining,
    settings,
    record.recordType,
    record.workflowStatus,
  );
  const alertKinds = resolveAlertKinds(record, semaphore);
  return {
    ...record,
    daysRemaining,
    semaphore,
    alertKinds,
    semaphoreLabel: semaphoreLabel(semaphore, daysRemaining),
  };
}

export type AlertKindSummary = {
  kind: SstAlertKind;
  label: string;
  description: string;
  category: "talento" | "salud" | "operacion" | "sistema";
  icon: string;
  modulePath: string;
  total: number;
  byFarm: { farmName: string; count: number }[];
  dominantSemaphore: SstSemaphoreLevel;
};

export function summarizeByAlertKind(alerts: SstAlertView[]): AlertKindSummary[] {
  return Object.values(ALERT_KIND_META).map((meta) => {
    const matching = alerts.filter((alert) => alert.alertKinds.includes(meta.kind));
    const farmMap = new Map<string, number>();
    for (const alert of matching) {
      const key = alert.farmName ?? "Sin centro";
      farmMap.set(key, (farmMap.get(key) ?? 0) + 1);
    }
    const byFarm = [...farmMap.entries()]
      .map(([farmName, count]) => ({ farmName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const counts: Record<SstSemaphoreLevel, number> = {
      critico: 0,
      proximo: 0,
      seguimiento: 0,
      vigente: 0,
    };
    for (const alert of matching) {
      counts[alert.semaphore] += 1;
    }
    const dominantSemaphore: SstSemaphoreLevel =
      counts.critico > 0
        ? "critico"
        : counts.proximo > 0
          ? "proximo"
          : counts.seguimiento > 0
            ? "seguimiento"
            : "vigente";

    return {
      kind: meta.kind,
      label: meta.label,
      description: meta.description,
      category: meta.category,
      icon: meta.icon,
      modulePath: meta.modulePath,
      total: matching.length,
      byFarm,
      dominantSemaphore,
    };
  });
}

export function countBySemaphore(alerts: SstAlertView[]): Record<SstSemaphoreLevel, number> {
  const counts: Record<SstSemaphoreLevel, number> = {
    critico: 0,
    proximo: 0,
    seguimiento: 0,
    vigente: 0,
  };
  for (const alert of alerts) {
    if (alert.workflowStatus === "closed" || alert.workflowStatus === "cancelled") {
      counts.vigente += 1;
      continue;
    }
    counts[alert.semaphore] += 1;
  }
  return counts;
}
