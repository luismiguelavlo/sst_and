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
  chunkErrors?: string[];
};

export type ChunkImportFail = { ok: false; error: string };

export type ChunkImportResult = ChunkImportOk | ChunkImportFail;

type BulkOk = ChunkImportCounts & { ok: true };
type BulkFail = { ok: false; error: string };
type BulkResult = BulkOk | BulkFail;

export type RunChunkedBulkImportOptions = {
  chunkSize?: number;
  /**
   * Si true, un lote con error duro no aborta el resto (marca esas filas como failed).
   * Útil en importaciones largas de trabajadores.
   */
  continueOnChunkError?: boolean;
};

export async function runChunkedBulkImport<T>(
  rows: readonly T[],
  importChunk: (chunk: T[]) => Promise<BulkResult>,
  chunkSizeOrOptions: number | RunChunkedBulkImportOptions = SST_IMPORT_CHUNK_SIZE,
): Promise<ChunkImportResult> {
  if (rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }

  const options: RunChunkedBulkImportOptions =
    typeof chunkSizeOrOptions === "number"
      ? { chunkSize: chunkSizeOrOptions }
      : chunkSizeOrOptions;
  const chunkSize = options.chunkSize ?? SST_IMPORT_CHUNK_SIZE;
  const continueOnChunkError = options.continueOnChunkError ?? false;

  let created = 0;
  let updated = 0;
  let failed = 0;
  const chunkErrors: string[] = [];

  for (let offset = 0; offset < rows.length; offset += chunkSize) {
    const chunk = rows.slice(offset, offset + chunkSize) as T[];
    const batchNo = Math.floor(offset / chunkSize) + 1;
    try {
      const result = await importChunk(chunk);
      if (!result.ok) {
        const message = `Error en lote ${batchNo}: ${result.error}`;
        if (!continueOnChunkError) {
          return { ok: false, error: message };
        }
        failed += chunk.length;
        chunkErrors.push(message);
        continue;
      }
      created += result.created;
      updated += result.updated;
      failed += result.failed;
    } catch (caught) {
      const detail = caught instanceof Error ? caught.message : "Error de red / timeout";
      const message = `Error en lote ${batchNo}: ${detail}`;
      if (!continueOnChunkError) {
        return { ok: false, error: message };
      }
      failed += chunk.length;
      chunkErrors.push(message);
    }
  }

  return {
    ok: true,
    created,
    updated,
    failed,
    total: rows.length,
    chunkErrors: chunkErrors.length > 0 ? chunkErrors : undefined,
  };
}

export function formatChunkImportToast(result: ChunkImportOk): string {
  const base = `Importación: ${result.created} creados, ${result.updated} actualizados, ${result.failed} con error (${result.total} filas leídas).`;
  if (result.chunkErrors?.length) {
    return `${base} Algunos lotes fallaron y se continuó con el resto.`;
  }
  return base;
}
