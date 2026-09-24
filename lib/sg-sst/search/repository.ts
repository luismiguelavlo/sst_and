import "server-only";

import { getSql } from "@/lib/db";
import { getWorker } from "@/lib/sg-sst/workers/repository";
import type {
  FichaRow,
  GlobalSearchHit,
  WorkerSstFicha,
} from "@/lib/sg-sst/search/types";

const LIMIT_PER_KIND = 6;

export async function searchSgsstGlobal(query: string): Promise<GlobalSearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const sql = getSql();
  const like = `%${q}%`;

  const [
    workers,
    accidents,
    trainings,
    inspections,
    epp,
    actions,
    documents,
    restrictions,
    leaves,
  ] = await Promise.all([
    sql<{ id: string; full_name: string; document_number: string; job_title: string }[]>`
      SELECT id::text, full_name, document_number, job_title
      FROM campus_sst.sst_workers
      WHERE full_name ILIKE ${like}
         OR document_number ILIKE ${like}
         OR worker_code ILIKE ${like}
      ORDER BY full_name ASC
      LIMIT ${LIMIT_PER_KIND}
    `,
    sql<
      {
        id: string;
        event_number: string;
        event_type: string;
        event_date: string;
        worker_id: string;
        worker_name: string;
      }[]
    >`
      SELECT e.id::text, e.event_number, e.event_type, e.event_date::text,
             e.worker_id::text, w.full_name AS worker_name
      FROM campus_sst.sst_accident_events e
      INNER JOIN campus_sst.sst_workers w ON w.id = e.worker_id
      WHERE e.event_number ILIKE ${like}
         OR e.description ILIKE ${like}
         OR w.full_name ILIKE ${like}
         OR w.document_number ILIKE ${like}
      ORDER BY e.event_date DESC
      LIMIT ${LIMIT_PER_KIND}
    `,
    sql<
      {
        id: string;
        folio: string;
        topic: string;
        training_date: string;
        worker_id: string;
        worker_name: string;
      }[]
    >`
      SELECT t.id::text, t.folio, t.topic::text, t.training_date::text,
             t.worker_id::text, w.full_name AS worker_name
      FROM campus_sst.sst_trainings t
      INNER JOIN campus_sst.sst_workers w ON w.id = t.worker_id
      WHERE t.folio ILIKE ${like}
         OR w.full_name ILIKE ${like}
         OR w.document_number ILIKE ${like}
      ORDER BY t.training_date DESC
      LIMIT ${LIMIT_PER_KIND}
    `,
    sql<{ id: string; folio: string; inspection_type: string; scheduled_date: string }[]>`
      SELECT id::text, folio, inspection_type::text, scheduled_date::text
      FROM campus_sst.sst_inspections
      WHERE folio ILIKE ${like}
         OR responsible_name ILIKE ${like}
         OR findings_summary ILIKE ${like}
      ORDER BY scheduled_date DESC
      LIMIT ${LIMIT_PER_KIND}
    `,
    sql<
      {
        id: string;
        delivery_date: string;
        worker_id: string;
        worker_name: string;
        item_name: string;
      }[]
    >`
      SELECT d.id::text, d.delivery_date::text, d.worker_id::text,
             w.full_name AS worker_name, c.name AS item_name
      FROM campus_sst.sst_epp_deliveries d
      INNER JOIN campus_sst.sst_workers w ON w.id = d.worker_id
      INNER JOIN campus_sst.sst_epp_catalog c ON c.id = d.catalog_item_id
      WHERE w.full_name ILIKE ${like}
         OR w.document_number ILIKE ${like}
         OR c.name ILIKE ${like}
      ORDER BY d.delivery_date DESC
      LIMIT ${LIMIT_PER_KIND}
    `,
    sql<{ id: string; folio: string; finding: string; commit_date: string }[]>`
      SELECT id::text, folio, finding, commit_date::text
      FROM campus_sst.sst_corrective_actions
      WHERE folio ILIKE ${like}
         OR finding ILIKE ${like}
         OR action_plan ILIKE ${like}
         OR responsible_name ILIKE ${like}
      ORDER BY commit_date DESC
      LIMIT ${LIMIT_PER_KIND}
    `,
    sql<{ id: string; code: string; title: string; doc_type: string }[]>`
      SELECT id::text, code, title, doc_type::text
      FROM campus_sst.sst_sg_documents
      WHERE code ILIKE ${like} OR title ILIKE ${like}
      ORDER BY updated_at DESC
      LIMIT ${LIMIT_PER_KIND}
    `,
    sql<
      {
        id: string;
        folio: string;
        restriction_kind: string;
        worker_id: string;
        worker_name: string;
        start_date: string;
      }[]
    >`
      SELECT r.id::text, r.folio, r.restriction_kind::text, r.worker_id::text,
             w.full_name AS worker_name, r.start_date::text
      FROM campus_sst.sst_restrictions r
      INNER JOIN campus_sst.sst_workers w ON w.id = r.worker_id
      WHERE r.folio ILIKE ${like}
         OR w.full_name ILIKE ${like}
         OR r.detail ILIKE ${like}
      ORDER BY r.start_date DESC
      LIMIT ${LIMIT_PER_KIND}
    `,
    sql<
      {
        id: string;
        folio: string;
        worker_id: string;
        worker_name: string;
        start_date: string;
      }[]
    >`
      SELECT i.id::text, i.folio, i.worker_id::text, w.full_name AS worker_name,
             i.start_date::text
      FROM campus_sst.sst_incapacidades i
      INNER JOIN campus_sst.sst_workers w ON w.id = i.worker_id
      WHERE i.folio ILIKE ${like}
         OR w.full_name ILIKE ${like}
         OR w.document_number ILIKE ${like}
      ORDER BY i.start_date DESC
      LIMIT ${LIMIT_PER_KIND}
    `,
  ]);

  const hits: GlobalSearchHit[] = [];

  for (const w of workers) {
    hits.push({
      id: w.id,
      kind: "trabajador",
      title: w.full_name,
      subtitle: `${w.document_number} · ${w.job_title}`,
      href: `/sg-sst/trabajadores/${w.id}/ficha`,
      workerId: w.id,
    });
  }

  for (const e of accidents) {
    const isIncident = e.event_type === "incidente";
    hits.push({
      id: e.id,
      kind: isIncident ? "incidente" : "accidente",
      title: e.event_number,
      subtitle: `${e.worker_name} · ${e.event_date}`,
      href: `/sg-sst/accidentes-e-incidentes`,
      workerId: e.worker_id,
    });
  }

  for (const t of trainings) {
    hits.push({
      id: t.id,
      kind: "capacitacion",
      title: t.folio,
      subtitle: `${t.worker_name} · ${t.topic} · ${t.training_date}`,
      href: `/sg-sst/capacitaciones`,
      workerId: t.worker_id,
    });
  }

  for (const i of inspections) {
    hits.push({
      id: i.id,
      kind: "inspeccion",
      title: i.folio,
      subtitle: `${i.inspection_type} · ${i.scheduled_date}`,
      href: `/sg-sst/inspecciones`,
    });
  }

  for (const d of epp) {
    hits.push({
      id: d.id,
      kind: "epp",
      title: d.item_name,
      subtitle: `${d.worker_name} · ${d.delivery_date}`,
      href: `/sg-sst/epp`,
      workerId: d.worker_id,
    });
  }

  for (const a of actions) {
    hits.push({
      id: a.id,
      kind: "accion",
      title: a.folio,
      subtitle: `${a.finding.slice(0, 80) || "Acción correctiva"} · ${a.commit_date}`,
      href: `/sg-sst/acciones-correctivas`,
    });
  }

  for (const d of documents) {
    hits.push({
      id: d.id,
      kind: "documento",
      title: d.code,
      subtitle: `${d.title} · ${d.doc_type}`,
      href: `/sg-sst/documentos-sg-sst`,
    });
  }

  for (const r of restrictions) {
    hits.push({
      id: r.id,
      kind: "restriccion",
      title: r.folio,
      subtitle: `${r.worker_name} · ${r.restriction_kind} · ${r.start_date}`,
      href: `/sg-sst/restricciones-y-recomendaciones`,
      workerId: r.worker_id,
    });
  }

  for (const i of leaves) {
    hits.push({
      id: i.id,
      kind: "incapacidad",
      title: i.folio,
      subtitle: `${i.worker_name} · ${i.start_date}`,
      href: `/sg-sst/incapacidades-y-reintegros`,
      workerId: i.worker_id,
    });
  }

  return hits;
}

export async function loadWorkerSstFicha(
  workerId: string,
): Promise<WorkerSstFicha | null> {
  const worker = await getWorker(workerId);
  if (!worker) return null;
  const sql = getSql();

  const [
    exams,
    restrictions,
    leaves,
    accidents,
    trainings,
    epp,
    heights,
    pesv,
    tractor,
    healthCases,
    inspections,
  ] = await Promise.all([
    sql<{ id: string; exam_type: string; exam_date: string; concept: string; next_due_date: string | null }[]>`
      SELECT id::text, exam_type::text, exam_date::text, concept::text, next_due_date::text
      FROM campus_sst.sst_emos WHERE worker_id = ${workerId}::uuid
      ORDER BY exam_date DESC LIMIT 20
    `,
    sql<{ id: string; folio: string; restriction_kind: string; status: string; start_date: string; detail: string }[]>`
      SELECT id::text, folio, restriction_kind::text, status::text, start_date::text, detail
      FROM campus_sst.sst_restrictions WHERE worker_id = ${workerId}::uuid
      ORDER BY start_date DESC LIMIT 20
    `,
    sql<{ id: string; folio: string; start_date: string; end_date: string; status: string; days_ordered: number }[]>`
      SELECT id::text, folio, start_date::text, end_date::text, status::text, days_ordered
      FROM campus_sst.sst_incapacidades WHERE worker_id = ${workerId}::uuid
      ORDER BY start_date DESC LIMIT 20
    `,
    sql<{ id: string; event_number: string; event_type: string; event_date: string; status: string; lost_days: number }[]>`
      SELECT id::text, event_number, event_type::text, event_date::text, status::text, lost_days
      FROM campus_sst.sst_accident_events WHERE worker_id = ${workerId}::uuid
      ORDER BY event_date DESC LIMIT 20
    `,
    sql<{ id: string; folio: string; topic: string; training_date: string; status: string }[]>`
      SELECT id::text, folio, topic::text, training_date::text, status::text
      FROM campus_sst.sst_trainings WHERE worker_id = ${workerId}::uuid
      ORDER BY training_date DESC LIMIT 20
    `,
    sql<{ id: string; delivery_date: string; quantity: number; item_name: string }[]>`
      SELECT d.id::text, d.delivery_date::text, d.quantity, c.name AS item_name
      FROM campus_sst.sst_epp_deliveries d
      INNER JOIN campus_sst.sst_epp_catalog c ON c.id = d.catalog_item_id
      WHERE d.worker_id = ${workerId}::uuid
      ORDER BY d.delivery_date DESC LIMIT 20
    `,
    sql<{ id: string; folio: string; status: string; cert_due_date: string | null }[]>`
      SELECT id::text, folio, authorization_status::text AS status,
             training_due_date::text AS cert_due_date
      FROM campus_sst.sst_heights_authorizations
      WHERE worker_id = ${workerId}::uuid
      ORDER BY updated_at DESC LIMIT 10
    `,
    sql<{ id: string; folio: string; status: string; license_due: string | null }[]>`
      SELECT id::text, folio, authorization_status::text AS status,
             license_due_date::text AS license_due
      FROM campus_sst.sst_pesv_drivers
      WHERE worker_id = ${workerId}::uuid
      ORDER BY updated_at DESC LIMIT 10
    `,
    sql<{ id: string; folio: string; status: string; next_due: string | null }[]>`
      SELECT id::text, folio, key_status::text AS status,
             training_due_date::text AS next_due
      FROM campus_sst.sst_machine_operators
      WHERE worker_id = ${workerId}::uuid
      ORDER BY updated_at DESC LIMIT 10
    `,
    sql<{ id: string; folio: string; status: string; opened_at: string; case_type: string }[]>`
      SELECT id::text, folio, status::text, opened_at::text, case_type::text
      FROM campus_sst.sst_casos_salud
      WHERE worker_id = ${workerId}::uuid AND status IN ('abierto', 'en_seguimiento')
      ORDER BY opened_at DESC LIMIT 20
    `,
    worker.farmId
      ? sql<{ id: string; folio: string; inspection_type: string; scheduled_date: string; status: string }[]>`
          SELECT i.id::text, i.folio, i.inspection_type::text, i.scheduled_date::text, i.status::text
          FROM campus_sst.sst_inspections i
          WHERE i.farm_id = ${worker.farmId}::uuid
          ORDER BY i.scheduled_date DESC
          LIMIT 15
        `
      : Promise.resolve(
          [] as {
            id: string;
            folio: string;
            inspection_type: string;
            scheduled_date: string;
            status: string;
          }[],
        ),
  ]);

  const mapRows = (
    rows: FichaRow[],
  ): FichaRow[] => rows;

  return {
    worker: {
      id: worker.id,
      fullName: worker.fullName,
      documentType: worker.documentType,
      documentNumber: worker.documentNumber,
      workerCode: worker.workerCode,
      company: worker.company,
      jobTitle: worker.jobTitle,
      area: worker.area,
      workCenter: worker.workCenter,
      farmName: worker.farmName,
      status: worker.status,
      hireDate: worker.hireDate,
      riskLevel: worker.riskLevel,
      worksHeights: worker.worksHeights,
      drives: worker.drives,
      operatesTractor: worker.operatesTractor,
    },
    exams: mapRows(
      exams.map((e) => ({
        id: e.id,
        title: e.exam_type,
        detail: `Concepto: ${e.concept}${e.next_due_date ? ` · Próximo: ${e.next_due_date}` : ""}`,
        date: e.exam_date,
        status: e.concept,
        href: `/sg-sst/examenes-medicos-ocupacionales`,
      })),
    ),
    restrictions: mapRows(
      restrictions.map((r) => ({
        id: r.id,
        title: r.folio,
        detail: `${r.restriction_kind} · ${r.detail.slice(0, 100)}`,
        date: r.start_date,
        status: r.status,
        href: `/sg-sst/restricciones-y-recomendaciones`,
      })),
    ),
    leaves: mapRows(
      leaves.map((l) => ({
        id: l.id,
        title: l.folio,
        detail: `${l.days_ordered} días · hasta ${l.end_date}`,
        date: l.start_date,
        status: l.status,
        href: `/sg-sst/incapacidades-y-reintegros`,
      })),
    ),
    accidents: mapRows(
      accidents.map((a) => ({
        id: a.id,
        title: a.event_number,
        detail: `${a.event_type} · ${a.lost_days} días perdidos`,
        date: a.event_date,
        status: a.status,
        href: `/sg-sst/accidentes-e-incidentes`,
      })),
    ),
    trainings: mapRows(
      trainings.map((t) => ({
        id: t.id,
        title: t.folio,
        detail: t.topic,
        date: t.training_date,
        status: t.status,
        href: `/sg-sst/capacitaciones`,
      })),
    ),
    epp: mapRows(
      epp.map((d) => ({
        id: d.id,
        title: d.item_name,
        detail: `Cantidad: ${d.quantity}`,
        date: d.delivery_date,
        status: "entregado",
        href: `/sg-sst/epp`,
      })),
    ),
    heights: mapRows(
      heights.map((h) => ({
        id: h.id,
        title: h.folio,
        detail: h.cert_due_date ? `Vence: ${h.cert_due_date}` : "Sin fecha de vencimiento",
        date: h.cert_due_date,
        status: h.status,
        href: `/sg-sst/trabajo-en-alturas`,
      })),
    ),
    pesv: mapRows(
      pesv.map((p) => ({
        id: p.id,
        title: p.folio,
        detail: p.license_due ? `Licencia: ${p.license_due}` : "Conductor PESV",
        date: p.license_due,
        status: p.status,
        href: `/sg-sst/pesv`,
      })),
    ),
    tractor: mapRows(
      tractor.map((t) => ({
        id: t.id,
        title: t.folio,
        detail: t.next_due ? `Próxima eval: ${t.next_due}` : "Operador",
        date: t.next_due,
        status: t.status,
        href: `/sg-sst/tractoristas-operadores`,
      })),
    ),
    healthCases: mapRows(
      healthCases.map((c) => ({
        id: c.id,
        title: c.folio,
        detail: c.case_type,
        date: c.opened_at,
        status: c.status,
        href: `/sg-sst/casos-de-salud`,
      })),
    ),
    inspections: mapRows(
      inspections.map((i) => ({
        id: i.id,
        title: i.folio,
        detail: i.inspection_type,
        date: i.scheduled_date,
        status: i.status,
        href: `/sg-sst/inspecciones`,
      })),
    ),
  };
}
