import "server-only";

import { getSql } from "@/lib/db";
import { getActionStats } from "@/lib/sg-sst/acciones/repository";
import { getTrainingStats } from "@/lib/sg-sst/capacitaciones/repository";
import { getCclStats, listCases as listCclCases, listCommitmentViews as listCclCommitments } from "@/lib/sg-sst/ccl/repository";
import {
  getCopasstStats,
  listCommitmentViews as listCopasstCommitments,
} from "@/lib/sg-sst/copasst/repository";
import {
  averagePct,
  COMPLIANCE_DIMENSION_META,
  DEFAULT_COMPLIANCE_THRESHOLDS,
  ratioPct,
  resolveComplianceSemaphore,
  type ComplianceDimensionId,
  type ComplianceDimensionScore,
  type ComplianceThresholds,
  type SgsstComplianceReport,
} from "@/lib/sg-sst/cumplimiento/types";
import { getDocumentStats } from "@/lib/sg-sst/documentos/repository";
import { getEmergenciasStats } from "@/lib/sg-sst/emergencias/repository";
import { getEmoStats } from "@/lib/sg-sst/emos/repository";
import { getInspectionStats } from "@/lib/sg-sst/inspecciones/repository";
import { getPesvStats } from "@/lib/sg-sst/pesv/repository";

type SettingsRow = {
  green_min_pct: number | string;
  yellow_min_pct: number | string;
};

function mapSettings(row?: SettingsRow): ComplianceThresholds {
  if (!row) return { ...DEFAULT_COMPLIANCE_THRESHOLDS };
  const greenMinPct = Number(row.green_min_pct);
  const yellowMinPct = Number(row.yellow_min_pct);
  if (
    !Number.isFinite(greenMinPct) ||
    !Number.isFinite(yellowMinPct) ||
    yellowMinPct < 0 ||
    greenMinPct <= yellowMinPct ||
    greenMinPct > 100
  ) {
    return { ...DEFAULT_COMPLIANCE_THRESHOLDS };
  }
  return { greenMinPct, yellowMinPct };
}

export async function getComplianceThresholds(): Promise<ComplianceThresholds> {
  const sql = getSql();
  try {
    const rows = await sql<SettingsRow[]>`
      SELECT green_min_pct, yellow_min_pct
      FROM campus_sst.sst_compliance_settings
      WHERE id = 1
    `;
    return mapSettings(rows[0]);
  } catch {
    // Tabla aún no migrada: usar defaults sin romper el dashboard.
    return { ...DEFAULT_COMPLIANCE_THRESHOLDS };
  }
}

export async function saveComplianceThresholds(
  draft: ComplianceThresholds,
  userId: string,
): Promise<ComplianceThresholds> {
  const sql = getSql();
  await sql`
    INSERT INTO campus_sst.sst_compliance_settings (
      id, green_min_pct, yellow_min_pct, updated_at, updated_by
    ) VALUES (
      1, ${draft.greenMinPct}, ${draft.yellowMinPct}, now(), ${userId}
    )
    ON CONFLICT (id) DO UPDATE SET
      green_min_pct = EXCLUDED.green_min_pct,
      yellow_min_pct = EXCLUDED.yellow_min_pct,
      updated_at = now(),
      updated_by = EXCLUDED.updated_by
  `;
  return getComplianceThresholds();
}

export async function resetComplianceThresholds(
  userId: string,
): Promise<ComplianceThresholds> {
  return saveComplianceThresholds({ ...DEFAULT_COMPLIANCE_THRESHOLDS }, userId);
}

async function loadPlanAnualRatio(): Promise<{ compliant: number; total: number }> {
  const sql = getSql();
  const rows = await sql<{ total: number; compliant: number }[]>`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (
        WHERE d.status = 'vigente'
          AND (d.next_review_at IS NULL OR d.next_review_at >= CURRENT_DATE)
      )::int AS compliant
    FROM campus_sst.sst_sg_documents d
    WHERE d.doc_type = 'plan_anual'
      AND d.has_review_cycle = true
  `;
  return {
    total: rows[0]?.total ?? 0,
    compliant: rows[0]?.compliant ?? 0,
  };
}

function okScore(
  id: ComplianceDimensionId,
  pct: number,
  compliant: number,
  total: number,
  thresholds: ComplianceThresholds,
  detail: string,
): ComplianceDimensionScore {
  const meta = COMPLIANCE_DIMENSION_META[id];
  return {
    id,
    label: meta.label,
    href: meta.href,
    icon: meta.icon,
    description: meta.description,
    status: "ok",
    pct,
    compliant,
    total,
    semaphore: resolveComplianceSemaphore(pct, thresholds),
    detail,
  };
}

function emptyScore(
  id: ComplianceDimensionId,
  message = "Sin datos suficientes",
): ComplianceDimensionScore {
  const meta = COMPLIANCE_DIMENSION_META[id];
  return {
    id,
    label: meta.label,
    href: meta.href,
    icon: meta.icon,
    description: meta.description,
    status: "insufficient",
    message,
  };
}

export async function buildComplianceReport(): Promise<SgsstComplianceReport> {
  const [
    thresholds,
    planAnual,
    trainings,
    inspections,
    actions,
    emos,
    emergencias,
    copasst,
    copasstCommitments,
    ccl,
    cclCases,
    cclCommitments,
    pesv,
    documents,
  ] = await Promise.all([
    getComplianceThresholds(),
    loadPlanAnualRatio(),
    getTrainingStats(),
    getInspectionStats(),
    getActionStats(),
    getEmoStats(),
    getEmergenciasStats(),
    getCopasstStats(),
    listCopasstCommitments(),
    getCclStats(),
    listCclCases(),
    listCclCommitments(),
    getPesvStats(),
    getDocumentStats(),
  ]);

  const dimensions: ComplianceDimensionScore[] = [];

  // Plan anual
  {
    const pct = ratioPct(planAnual.compliant, planAnual.total);
    dimensions.push(
      pct === null
        ? emptyScore("plan_anual", "Sin documentos de plan anual con ciclo de revisión.")
        : okScore(
            "plan_anual",
            pct,
            planAnual.compliant,
            planAnual.total,
            thresholds,
            `${planAnual.compliant}/${planAnual.total} al día`,
          ),
    );
  }

  // Capacitaciones
  {
    const denom = trainings.realizadas + trainings.pendientes + trainings.vencidas;
    const pct = ratioPct(trainings.realizadas, denom);
    dimensions.push(
      pct === null
        ? emptyScore("capacitaciones", "Sin capacitaciones evaluables.")
        : okScore(
            "capacitaciones",
            pct,
            trainings.realizadas,
            denom,
            thresholds,
            `${trainings.realizadas} realizadas · ${trainings.vencidas} vencidas`,
          ),
    );
  }

  // Inspecciones
  {
    const performed = inspections.byStatus.realizada;
    const denom =
      performed +
      inspections.byStatus.vencida +
      inspections.byStatus.pendiente +
      inspections.byStatus.en_proceso;
    const pct = ratioPct(performed, denom);
    dimensions.push(
      pct === null
        ? emptyScore("inspecciones", "Sin inspecciones evaluables.")
        : okScore(
            "inspecciones",
            pct,
            performed,
            denom,
            thresholds,
            `${performed} realizadas · ${inspections.overdue} vencidas`,
          ),
    );
  }

  // Acciones correctivas
  {
    const pct = ratioPct(actions.cerradas, actions.total);
    dimensions.push(
      pct === null
        ? emptyScore("acciones_correctivas", "Sin acciones correctivas registradas.")
        : okScore(
            "acciones_correctivas",
            pct,
            actions.cerradas,
            actions.total,
            thresholds,
            `${actions.cerradas} cerradas · ${actions.vencidas} vencidas`,
          ),
    );
  }

  // Vigilancia de la salud (EMOs)
  {
    const tracked =
      emos.bySemaphore.vigente +
      emos.bySemaphore.proximo +
      emos.bySemaphore.seguimiento +
      emos.bySemaphore.critico;
    const pct = ratioPct(emos.bySemaphore.vigente, tracked);
    dimensions.push(
      pct === null
        ? emptyScore("vigilancia_salud", "Sin EMOs con seguimiento.")
        : okScore(
            "vigilancia_salud",
            pct,
            emos.bySemaphore.vigente,
            tracked,
            thresholds,
            `${emos.bySemaphore.vigente} vigentes · ${emos.bySemaphore.critico} críticos`,
          ),
    );
  }

  // Emergencias
  {
    const parts: number[] = [];
    let compliantParts = 0;
    let totalParts = 0;
    if (emergencias.brigadeTotal > 0) {
      const p = ratioPct(emergencias.brigadistasVigentes, emergencias.brigadeTotal);
      if (p !== null) {
        parts.push(p);
        compliantParts += emergencias.brigadistasVigentes;
        totalParts += emergencias.brigadeTotal;
      }
    }
    if (emergencias.equipmentTotal > 0) {
      const okEquip =
        emergencias.equipmentTotal - emergencias.equiposVencidos;
      const p = ratioPct(okEquip, emergencias.equipmentTotal);
      if (p !== null) {
        parts.push(p);
        compliantParts += okEquip;
        totalParts += emergencias.equipmentTotal;
      }
    }
    if (emergencias.drillsTotal > 0) {
      const drillOk = emergencias.simulacrosDelAnio > 0 ? 1 : 0;
      parts.push(drillOk * 100);
      compliantParts += drillOk;
      totalParts += 1;
    }
    const pct = averagePct(parts);
    dimensions.push(
      pct === null
        ? emptyScore("emergencias", "Sin registros de emergencias.")
        : okScore(
            "emergencias",
            pct,
            compliantParts,
            totalParts,
            thresholds,
            `${emergencias.brigadistasVigentes} brigadistas · ${emergencias.equiposVencidos} equipos vencidos · ${emergencias.simulacrosDelAnio} simulacros del año`,
          ),
    );
  }

  // COPASST
  {
    const closed = copasstCommitments.filter(
      (c) => c.effectiveStatus === "cerrado",
    ).length;
    const total = copasstCommitments.length;
    const parts: number[] = [];
    let compliantSum = 0;
    let totalSum = 0;
    if (total > 0) {
      const p = ratioPct(closed, total);
      if (p !== null) {
        parts.push(p);
        compliantSum += closed;
        totalSum += total;
      }
    }
    if (copasst.meetingsTotal > 0) {
      const p = ratioPct(copasst.meetingsDone, copasst.meetingsTotal);
      if (p !== null) {
        parts.push(p);
        compliantSum += copasst.meetingsDone;
        totalSum += copasst.meetingsTotal;
      }
    }
    const pct = averagePct(parts);
    dimensions.push(
      pct === null
        ? emptyScore(
            "copasst",
            "Sin compromisos ni actas COPASST para evaluar cumplimiento.",
          )
        : okScore(
            "copasst",
            pct,
            compliantSum,
            totalSum,
            thresholds,
            `${copasst.membersActive} miembros · ${copasst.commitmentsOverdue} compromisos vencidos · ${copasst.meetingsDone} actas`,
          ),
    );
  }

  // CCL
  {
    const casesClosed = cclCases.filter(
      (c) => c.status === "cerrado" || c.status === "archivado",
    ).length;
    const casesTotal = cclCases.length;
    const commitsClosed = cclCommitments.filter(
      (c) => c.effectiveStatus === "cerrado",
    ).length;
    const commitsTotal = cclCommitments.length;
    const parts: number[] = [];
    if (casesTotal > 0) {
      const p = ratioPct(casesClosed, casesTotal);
      if (p !== null) parts.push(p);
    }
    if (commitsTotal > 0) {
      const p = ratioPct(commitsClosed, commitsTotal);
      if (p !== null) parts.push(p);
    }
    const pct = averagePct(parts);
    dimensions.push(
      pct === null
        ? emptyScore(
            "ccl",
            "Sin casos ni compromisos CCL para evaluar cumplimiento.",
          )
        : okScore(
            "ccl",
            pct,
            casesClosed + commitsClosed,
            Math.max(casesTotal + commitsTotal, 1),
            thresholds,
            `${ccl.casosAbiertos + ccl.casosEnTramite} casos activos · ${ccl.compromisosAbiertos} compromisos abiertos`,
          ),
    );
  }

  // PESV
  {
    const parts: number[] = [];
    if (pesv.driversTotal > 0) {
      const p = ratioPct(pesv.driversAuthorized, pesv.driversTotal);
      if (p !== null) parts.push(p);
    }
    if (pesv.vehicleCount > 0) {
      const p = ratioPct(pesv.vehiclesAptos, pesv.vehicleCount);
      if (p !== null) parts.push(p);
      parts.push(Math.min(100, pesv.preopsPct));
    }
    const pct = averagePct(parts);
    dimensions.push(
      pct === null
        ? emptyScore("pesv", "Sin conductores ni vehículos PESV.")
        : okScore(
            "pesv",
            pct,
            pesv.driversAuthorized + pesv.vehiclesAptos,
            Math.max(pesv.driversTotal + pesv.vehicleCount, 1),
            thresholds,
            `${pesv.driversAuthorized}/${pesv.driversTotal} conductores · preops ${pesv.preopsPct}%`,
          ),
    );
  }

  // Gestión documental
  {
    const okDocs = documents.trackingReview - documents.overdueReview;
    const pct = ratioPct(Math.max(0, okDocs), documents.trackingReview);
    dimensions.push(
      pct === null
        ? emptyScore(
            "gestion_documental",
            "Sin documentos con ciclo de revisión.",
          )
        : okScore(
            "gestion_documental",
            pct,
            Math.max(0, okDocs),
            documents.trackingReview,
            thresholds,
            `${documents.overdueReview} con revisión vencida`,
          ),
    );
  }

  const scored = dimensions.filter(
    (d): d is Extract<ComplianceDimensionScore, { status: "ok" }> =>
      d.status === "ok",
  );
  const overallPct = averagePct(scored.map((d) => d.pct));

  return {
    thresholds,
    dimensions,
    generatedAt: new Date().toISOString(),
    overall:
      overallPct === null
        ? { status: "insufficient", message: "Sin datos suficientes" }
        : {
            status: "ok",
            pct: overallPct,
            semaphore: resolveComplianceSemaphore(overallPct, thresholds),
          },
  };
}
