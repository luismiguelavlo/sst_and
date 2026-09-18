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

function isSequentialCodeConflict(error: unknown): boolean {
  const e = error as { code?: string; constraint_name?: string } | null;
  return (
    e?.code === "23505" &&
    /(folio|code|event_number)_key$/.test(e.constraint_name ?? "")
  );
}

/** Reintenta `run` (que genera el código y hace el INSERT) si dos peticiones toman el mismo código. */
export async function withSequentialCodeRetry<T>(run: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await run();
    } catch (error) {
      if (attempt >= 5 || !isSequentialCodeConflict(error)) throw error;
    }
  }
}
