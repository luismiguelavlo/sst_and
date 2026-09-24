import "server-only";

import { getSql } from "@/lib/db";
import { RECORD_TYPE_META, isSstRecordType } from "@/lib/sg-sst/alerts/types";
import {
  INSPECTION_TYPE_LABELS,
  isInspectionType,
} from "@/lib/sg-sst/inspecciones/types";
import {
  TRAINING_TOPIC_LABELS,
  isTrainingTopic,
} from "@/lib/sg-sst/capacitaciones/types";
import {
  formatPeriodLabel,
  periodBounds,
  type AnalyticsPeriodFilter,
  type AnalisisSstReport,
  type RankingBlock,
  type RankingItem,
} from "@/lib/sg-sst/analytics/filters";

type AggRow = { label: string; value: number };

function emptyBlock(id: string, question: string, unit: string): RankingBlock {
  return {
    id,
    question,
    items: [],
    unit,
    hasData: false,
    emptyMessage: "Sin datos suficientes",
  };
}

function toBlock(
  id: string,
  question: string,
  unit: string,
  rows: AggRow[],
): RankingBlock {
  const items: RankingItem[] = rows
    .filter((r) => r.label.trim() && Number(r.value) > 0)
    .map((r) => ({ label: r.label.trim(), value: Number(r.value) }));
  if (items.length === 0) return emptyBlock(id, question, unit);
  return {
    id,
    question,
    items,
    unit,
    hasData: true,
    emptyMessage: "Sin datos suficientes",
  };
}

export async function listAnalyticsFilterOptions(): Promise<{
  years: number[];
  companies: string[];
  areas: string[];
}> {
  const sql = getSql();
  const year = new Date().getFullYear();
  const [companies, areas, accidentYears] = await Promise.all([
    sql<{ label: string }[]>`
      SELECT DISTINCT company AS label FROM campus_sst.sst_workers
      WHERE trim(company) <> ''
      UNION
      SELECT DISTINCT company_snapshot AS label FROM campus_sst.sst_accident_events
      WHERE trim(company_snapshot) <> ''
      ORDER BY 1
    `,
    sql<{ label: string }[]>`
      SELECT DISTINCT area AS label FROM campus_sst.sst_workers
      WHERE trim(area) <> ''
      UNION
      SELECT DISTINCT area_snapshot AS label FROM campus_sst.sst_accident_events
      WHERE trim(area_snapshot) <> ''
      ORDER BY 1
    `,
    sql<{ y: number }[]>`
      SELECT DISTINCT EXTRACT(YEAR FROM event_date)::int AS y
      FROM campus_sst.sst_accident_events
      ORDER BY 1 DESC
    `,
  ]);

  const years = new Set<number>([year, year - 1, year - 2]);
  for (const row of accidentYears) years.add(row.y);
  return {
    years: [...years].sort((a, b) => b - a),
    companies: companies.map((c) => c.label).filter(Boolean),
    areas: areas.map((a) => a.label).filter(Boolean),
  };
}

export async function buildAnalisisReport(
  filters: AnalyticsPeriodFilter,
): Promise<AnalisisSstReport> {
  const sql = getSql();
  const { from, toExclusive } = periodBounds(filters);
  const company = filters.company === "all" ? null : filters.company;
  const farmId = filters.farmId === "all" ? null : filters.farmId;
  const area = filters.area === "all" ? null : filters.area;
  const options = await listAnalyticsFilterOptions();

  const [
    byWorker,
    byArea,
    byCompany,
    byFarm,
    byJob,
    byMechanism,
    byBodyPart,
    byCause,
    lostByFarm,
    leaveByWorker,
    eppByItem,
    trainingGaps,
    inspectionGaps,
    overdueActions,
    riskCompliance,
  ] = await Promise.all([
    sql<AggRow[]>`
      SELECT COALESCE(w.full_name, 'Sin trabajador') AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_accident_events e
      INNER JOIN campus_sst.sst_workers w ON w.id = e.worker_id
      WHERE e.event_type = 'accidente_trabajo'
        AND e.event_date >= ${from}::date AND e.event_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR e.company_snapshot = ${company})
        AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR e.area_snapshot = ${area})
      GROUP BY w.id, w.full_name
      ORDER BY value DESC, label ASC
      LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT COALESCE(NULLIF(trim(e.area_snapshot), ''), 'Sin área') AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_accident_events e
      WHERE e.event_type = 'accidente_trabajo'
        AND e.event_date >= ${from}::date AND e.event_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR e.company_snapshot = ${company})
        AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR e.area_snapshot = ${area})
      GROUP BY 1 ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT COALESCE(NULLIF(trim(e.company_snapshot), ''), 'Sin empresa') AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_accident_events e
      WHERE e.event_type = 'accidente_trabajo'
        AND e.event_date >= ${from}::date AND e.event_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR e.company_snapshot = ${company})
        AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR e.area_snapshot = ${area})
      GROUP BY 1 ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT COALESCE(f.name, 'Sin centro') AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_accident_events e
      LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
      WHERE e.event_type = 'accidente_trabajo'
        AND e.event_date >= ${from}::date AND e.event_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR e.company_snapshot = ${company})
        AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR e.area_snapshot = ${area})
      GROUP BY f.id, f.name ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT COALESCE(NULLIF(trim(e.job_title_snapshot), ''), 'Sin cargo') AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_accident_events e
      WHERE e.event_type = 'accidente_trabajo'
        AND e.event_date >= ${from}::date AND e.event_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR e.company_snapshot = ${company})
        AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR e.area_snapshot = ${area})
      GROUP BY 1 ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT COALESCE(NULLIF(trim(e.mechanism), ''), 'Sin mecanismo') AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_accident_events e
      WHERE e.event_type = 'accidente_trabajo'
        AND e.event_date >= ${from}::date AND e.event_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR e.company_snapshot = ${company})
        AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR e.area_snapshot = ${area})
      GROUP BY 1 ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT COALESCE(NULLIF(trim(e.body_part), ''), 'Sin parte') AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_accident_events e
      WHERE e.event_type = 'accidente_trabajo'
        AND e.event_date >= ${from}::date AND e.event_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR e.company_snapshot = ${company})
        AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR e.area_snapshot = ${area})
      GROUP BY 1 ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT COALESCE(NULLIF(trim(c.root_cause), ''), 'Sin causa registrada') AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_accident_events e
      INNER JOIN campus_sst.sst_accident_causes c ON c.accident_id = e.id
      WHERE e.event_type = 'accidente_trabajo'
        AND e.event_date >= ${from}::date AND e.event_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR e.company_snapshot = ${company})
        AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR e.area_snapshot = ${area})
        AND trim(c.root_cause) <> ''
      GROUP BY 1 ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT COALESCE(f.name, 'Sin centro') AS label, COALESCE(SUM(e.lost_days), 0)::int AS value
      FROM campus_sst.sst_accident_events e
      LEFT JOIN campus_sst.sst_farms f ON f.id = e.farm_id
      WHERE e.event_type = 'accidente_trabajo'
        AND e.event_date >= ${from}::date AND e.event_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR e.company_snapshot = ${company})
        AND (${farmId}::uuid IS NULL OR e.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR e.area_snapshot = ${area})
      GROUP BY f.id, f.name
      HAVING COALESCE(SUM(e.lost_days), 0) > 0
      ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT COALESCE(w.full_name, 'Sin trabajador') AS label,
             COALESCE(SUM(
               GREATEST(
                 0,
                 (
                   LEAST(i.end_date, (${toExclusive}::date - INTERVAL '1 day')::date)
                   - GREATEST(i.start_date, ${from}::date)
                   + 1
                 )
               )
             ), 0)::int AS value
      FROM campus_sst.sst_incapacidades i
      INNER JOIN campus_sst.sst_workers w ON w.id = i.worker_id
      WHERE i.start_date < ${toExclusive}::date AND i.end_date >= ${from}::date
        AND (${company}::text IS NULL OR i.company_snapshot = ${company} OR w.company = ${company})
        AND (${farmId}::uuid IS NULL OR i.farm_id = ${farmId}::uuid OR w.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR w.area = ${area})
      GROUP BY w.id, w.full_name
      HAVING COALESCE(SUM(
        GREATEST(
          0,
          (
            LEAST(i.end_date, (${toExclusive}::date - INTERVAL '1 day')::date)
            - GREATEST(i.start_date, ${from}::date)
            + 1
          )
        )
      ), 0) > 0
      ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT COALESCE(cat.name, 'Sin EPP') AS label, COALESCE(SUM(d.quantity), 0)::int AS value
      FROM campus_sst.sst_epp_deliveries d
      INNER JOIN campus_sst.sst_epp_catalog cat ON cat.id = d.catalog_item_id
      INNER JOIN campus_sst.sst_workers w ON w.id = d.worker_id
      WHERE d.delivery_date >= ${from}::date AND d.delivery_date < ${toExclusive}::date
        AND (${company}::text IS NULL OR d.company_snapshot = ${company} OR w.company = ${company})
        AND (${farmId}::uuid IS NULL OR d.farm_id = ${farmId}::uuid OR w.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR w.area = ${area})
      GROUP BY cat.id, cat.name
      ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT t.topic::text AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_trainings t
      INNER JOIN campus_sst.sst_workers w ON w.id = t.worker_id
      WHERE (
          t.status IN ('vencida', 'pendiente')
          OR (
            t.next_training_date IS NOT NULL
            AND t.next_training_date < CURRENT_DATE
            AND t.status NOT IN ('realizada')
          )
        )
        AND (
          (t.next_training_date IS NOT NULL
            AND t.next_training_date >= ${from}::date
            AND t.next_training_date < ${toExclusive}::date)
          OR (
            t.status IN ('vencida', 'pendiente')
            AND t.training_date >= ${from}::date
            AND t.training_date < ${toExclusive}::date
          )
        )
        AND (${company}::text IS NULL OR t.company_snapshot = ${company} OR w.company = ${company})
        AND (${farmId}::uuid IS NULL OR t.farm_id = ${farmId}::uuid OR w.farm_id = ${farmId}::uuid)
        AND (${area}::text IS NULL OR w.area = ${area})
      GROUP BY t.topic ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT i.inspection_type::text AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_inspections i
      WHERE i.scheduled_date >= ${from}::date AND i.scheduled_date < ${toExclusive}::date
        AND i.status <> 'realizada'
        AND (
          i.status = 'vencida'
          OR i.status = 'pendiente'
          OR (i.status = 'programada' AND i.scheduled_date < CURRENT_DATE)
        )
        AND (${farmId}::uuid IS NULL OR i.farm_id = ${farmId}::uuid)
      GROUP BY i.inspection_type ORDER BY value DESC, label ASC LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT
        a.folio || CASE
          WHEN trim(a.finding) <> '' THEN ' — ' || left(trim(a.finding), 80)
          WHEN trim(a.action_plan) <> '' THEN ' — ' || left(trim(a.action_plan), 80)
          ELSE ''
        END AS label,
        GREATEST(CURRENT_DATE - a.commit_date, 1)::int AS value
      FROM campus_sst.sst_corrective_actions a
      WHERE a.status = 'vencida'
        AND a.commit_date < ${toExclusive}::date
        AND (${farmId}::uuid IS NULL OR a.farm_id = ${farmId}::uuid)
      ORDER BY a.commit_date ASC, a.folio ASC
      LIMIT 12
    `,
    sql<AggRow[]>`
      SELECT r.record_type::text AS label, COUNT(*)::int AS value
      FROM campus_sst.sst_compliance_records r
      WHERE r.workflow_status NOT IN ('closed', 'cancelled')
        AND r.due_date IS NOT NULL AND r.due_date < CURRENT_DATE
        AND (${farmId}::uuid IS NULL OR r.farm_id = ${farmId}::uuid)
      GROUP BY r.record_type ORDER BY value DESC, label ASC LIMIT 12
    `,
  ]);

  const labeledRisk = riskCompliance.map((row) => ({
    ...row,
    label: complianceTypeLabel(row.label),
  }));
  const labeledTrainings = trainingGaps.map((row) => ({
    ...row,
    label: trainingTopicLabel(row.label),
  }));
  const labeledInspections = inspectionGaps.map((row) => ({
    ...row,
    label: inspectionTypeLabel(row.label),
  }));

  return {
    filters,
    periodLabel: formatPeriodLabel(filters),
    generatedAt: new Date().toISOString(),
    blocks: [
      toBlock("accidents_worker", "¿Quién tiene más accidentes?", "eventos", byWorker),
      toBlock("accidents_area", "¿Qué área tiene más accidentes?", "eventos", byArea),
      toBlock("accidents_company", "¿Qué empresa tiene más accidentes?", "eventos", byCompany),
      toBlock("accidents_farm", "¿Qué finca / centro tiene más accidentes?", "eventos", byFarm),
      toBlock("accidents_job", "¿Qué cargo presenta mayor accidentalidad?", "eventos", byJob),
      toBlock("accidents_mechanism", "¿Cuál es el mecanismo más frecuente?", "eventos", byMechanism),
      toBlock("accidents_body", "¿Qué parte del cuerpo se lesiona más?", "eventos", byBodyPart),
      toBlock("accidents_cause", "¿Cuál es la principal causa?", "eventos", byCause),
      toBlock("lost_days_farm", "¿Dónde se concentran los días perdidos?", "días", lostByFarm),
      toBlock("leave_worker", "¿Qué trabajadores tienen mayor ausentismo?", "días incapacidad", leaveByWorker),
      toBlock("epp_consumption", "¿Qué EPP se consume más?", "unidades", eppByItem),
      toBlock("training_gaps", "¿Qué capacitaciones tienen mayor incumplimiento?", "registros", labeledTrainings),
      toBlock(
        "inspection_gaps",
        "¿Qué inspecciones presentan mayor incumplimiento?",
        "registros",
        labeledInspections,
      ),
      toBlock("actions_overdue", "¿Qué acciones correctivas están vencidas?", "días de atraso", overdueActions),
      toBlock(
        "compliance_risk",
        "¿Qué requisitos SST presentan mayor riesgo de incumplimiento?",
        "registros vencidos",
        labeledRisk,
      ),
    ],
    filterOptions: options,
  };
}

function inspectionTypeLabel(raw: string): string {
  if (isInspectionType(raw)) return INSPECTION_TYPE_LABELS[raw];
  return raw.replaceAll("_", " ");
}

function trainingTopicLabel(raw: string): string {
  if (isTrainingTopic(raw)) return TRAINING_TOPIC_LABELS[raw];
  return raw.replaceAll("_", " ");
}

function complianceTypeLabel(raw: string): string {
  if (isSstRecordType(raw)) return RECORD_TYPE_META[raw].label;
  return raw.replaceAll("_", " ");
}
