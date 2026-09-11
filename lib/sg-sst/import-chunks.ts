/**
 * Importaciones Excel en lotes para evitar truncado silencioso
 * del body de Server Actions con muchas filas.
 */
export const SST_IMPORT_CHUNK_SIZE = 40;

export type ChunkImportCounts = {
  created: number;
  updated: number;
  failed: number;
};

export type ChunkImportOk = ChunkImportCounts & {
  ok: true;
  total: number;
};

export type ChunkImportFail = { ok: false; error: string };

export type ChunkImportResult = ChunkImportOk | ChunkImportFail;

type BulkOk = ChunkImportCounts & { ok: true };
type BulkFail = { ok: false; error: string };
type BulkResult = BulkOk | BulkFail;

export async function runChunkedBulkImport<T>(
  rows: readonly T[],
  importChunk: (chunk: T[]) => Promise<BulkResult>,
  chunkSize: number = SST_IMPORT_CHUNK_SIZE,
): Promise<ChunkImportResult> {
  if (rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (let offset = 0; offset < rows.length; offset += chunkSize) {
    const chunk = rows.slice(offset, offset + chunkSize) as T[];
    const result = await importChunk(chunk);
    if (!result.ok) {
      return {
        ok: false,
        error: `Error en lote ${Math.floor(offset / chunkSize) + 1}: ${result.error}`,
      };
    }
    created += result.created;
    updated += result.updated;
    failed += result.failed;
  }

  return { ok: true, created, updated, failed, total: rows.length };
}

export function formatChunkImportToast(result: ChunkImportOk): string {
  return `Importación: ${result.created} creados, ${result.updated} actualizados, ${result.failed} con error (${result.total} filas leídas).`;
}
