"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { getSql } from "@/lib/db";
import { listSstFarms } from "@/lib/sg-sst/alerts/repository";
import type { SstFarm } from "@/lib/sg-sst/alerts/types";
import type { SgsstGlobalFilterOptions } from "@/lib/sg-sst/filters/global";

export async function loadGlobalFilterMetaAction(): Promise<{
  options: SgsstGlobalFilterOptions;
  farms: SstFarm[];
  workers: { id: string; fullName: string; documentNumber: string }[];
}> {
  await requireAdmin();
  const sql = getSql();
  const year = new Date().getFullYear();

  const [companies, areas, workCenters, accidentYears, farms, workers] =
    await Promise.all([
      sql<{ label: string }[]>`
        SELECT DISTINCT company AS label FROM campus_sst.sst_workers
        WHERE trim(company) <> ''
        ORDER BY 1
      `,
      sql<{ label: string }[]>`
        SELECT DISTINCT area AS label FROM campus_sst.sst_workers
        WHERE trim(area) <> ''
        ORDER BY 1
      `,
      sql<{ label: string }[]>`
        SELECT DISTINCT work_center AS label FROM campus_sst.sst_workers
        WHERE trim(work_center) <> ''
        ORDER BY 1
      `,
      sql<{ y: number }[]>`
        SELECT DISTINCT EXTRACT(YEAR FROM event_date)::int AS y
        FROM campus_sst.sst_accident_events
        ORDER BY 1 DESC
      `,
      listSstFarms(),
      sql<{ id: string; full_name: string; document_number: string }[]>`
        SELECT id::text, full_name, document_number
        FROM campus_sst.sst_workers
        WHERE status = 'activo'
        ORDER BY full_name ASC
        LIMIT 500
      `,
    ]);

  const years = new Set<number>([year, year - 1, year - 2]);
  for (const row of accidentYears) years.add(row.y);

  return {
    options: {
      years: [...years].sort((a, b) => b - a),
      companies: companies.map((c) => c.label),
      areas: areas.map((a) => a.label),
      workCenters: workCenters.map((w) => w.label),
      // Solo estado laboral: el estado de cada módulo se filtra en su propia UI.
      statuses: ["activo", "retirado"],
    },
    farms,
    workers: workers.map((w) => ({
      id: w.id,
      fullName: w.full_name,
      documentNumber: w.document_number,
    })),
  };
}
