"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { getSql } from "@/lib/db";
import { enrichRecordAsAlert } from "@/lib/sg-sst/alerts/engine";
import {
  getAlertSettings,
  listComplianceRecords,
  listSstFarms,
} from "@/lib/sg-sst/alerts/repository";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import { getAccidentStats } from "@/lib/sg-sst/accidentes/repository";
import { getActionStats } from "@/lib/sg-sst/acciones/repository";
import { getHealthCaseStats } from "@/lib/sg-sst/casos-salud/repository";
import { getEmoStats } from "@/lib/sg-sst/emos/repository";
import { getLeaveStats } from "@/lib/sg-sst/incapacidades/repository";
import { getRestrictionStats } from "@/lib/sg-sst/restricciones/repository";
import { getWorkerStats } from "@/lib/sg-sst/workers/repository";

export type SgsstHomeMetrics = {
  workersActive: number;
  workersTotal: number;
  accidentsAt: number;
  incidents: number;
  lostDays: number;
  daysWithoutAt: number | null;
  healthCasesOpen: number;
  restrictionsActive: number;
  emosCritical: number;
  emosProximos: number;
  leaveDays: number;
  actionsOpen: number;
  actionsOverdue: number;
  alertsCritical: number;
  alertsProximos: number;
  alertsSeguimiento: number;
  farms: SstFarm[];
};

async function daysSinceLastAt(): Promise<number | null> {
  const sql = getSql();
  const rows = await sql<{ last_at: string | null }[]>`
    SELECT MAX(event_date)::text AS last_at
    FROM campus_sst.sst_accident_events
    WHERE event_type = 'accidente_trabajo'
  `;
  const last = rows[0]?.last_at;
  if (!last) return null;
  const ms = Date.now() - new Date(`${last}T12:00:00`).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

export async function loadSgsstHomeMetrics(): Promise<SgsstHomeMetrics> {
  await requireAdmin();

  const [
    workers,
    accidents,
    health,
    restrictions,
    emos,
    leaves,
    actions,
    farms,
    settings,
    records,
    daysWithoutAt,
  ] = await Promise.all([
    getWorkerStats(),
    getAccidentStats(),
    getHealthCaseStats(),
    getRestrictionStats(),
    getEmoStats(),
    getLeaveStats(),
    getActionStats(),
    listSstFarms(),
    getAlertSettings(),
    listComplianceRecords({ includeClosed: false }),
    daysSinceLastAt(),
  ]);

  const alerts = records.map((record) => enrichRecordAsAlert(record, settings));
  const open = alerts.filter(
    (a) => a.workflowStatus !== "closed" && a.workflowStatus !== "cancelled",
  );

  return {
    workersActive: workers.active,
    workersTotal: workers.total,
    accidentsAt: accidents.accidentesTrabajo,
    incidents: accidents.incidentes,
    lostDays: accidents.lostDaysSum,
    daysWithoutAt,
    healthCasesOpen: health.abiertos + health.enSeguimiento,
    restrictionsActive: restrictions.active,
    emosCritical: emos.bySemaphore.critico,
    emosProximos: emos.bySemaphore.proximo,
    leaveDays: leaves.totalDays,
    actionsOpen: actions.abiertas,
    actionsOverdue: actions.vencidas,
    alertsCritical: open.filter((a) => a.semaphore === "critico").length,
    alertsProximos: open.filter((a) => a.semaphore === "proximo").length,
    alertsSeguimiento: open.filter((a) => a.semaphore === "seguimiento").length,
    farms,
  };
}
