import type { getSql } from "@/lib/db";

/**
 * Siguiente código `${prefix}NNN` usando MAX del sufijo (no COUNT):
 * borrados o imports concurrentes dejan huecos y COUNT+1 repetía folios.
 */
export async function nextSequentialCode(
  sql: ReturnType<typeof getSql>,
  table: string,
  column: string,
  prefix: string,
): Promise<string> {
  const rows = await sql<{ max: number | null }[]>`
    SELECT MAX(SUBSTRING(${sql(column)} FROM ${String.raw`^${prefix}(\d+)$`})::int) AS max
    FROM ${sql(table)}
    WHERE ${sql(column)} ~ ${String.raw`^${prefix}\d+$`}
  `;
  const next = (rows[0]?.max ?? 0) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}
