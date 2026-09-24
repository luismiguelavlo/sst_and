# SG-SST — Errores de importación Excel y cómo evitarlos

Documento de lecciones aprendidas (trabajadores, centros de trabajo, químicos).  
Aplicar en **todo módulo nuevo** con plantilla / import / export Excel.

Referencia de código:

- Helper de lotes: `lib/sg-sst/import-chunks.ts`
- Modo validación: `lib/sg-sst/draft-mode.ts` (`"form" | "import"`)
- Ejemplos corregidos: `lib/sg-sst/workers/*`, `lib/sg-sst/fincas/*`, `lib/sg-sst/quimicos/*`

---

## 1. Emparejar por código corto del Excel

### Qué pasó
En trabajadores el Excel trae `id_trabajador` = `1`, `3`, `5`…  
La importación hacía upsert por ese código. En BD esos códigos ya pertenecían a **otras personas** → se **sobrescribían** registros y no se creaban los faltantes (ej. 184 en vez de 210).

### Cómo debe hacerse
| Entidad | Clave de upsert |
|----------|-----------------|
| Trabajador | `document_type` + `document_number` |
| Centro de trabajo | `name` (normalizado); conservar `code` existente |
| Químico | `product_name` + `farm_id` |
| Genérico | Clave de negocio estable, **no** el id visual del Excel |

Reglas:

1. Buscar primero por clave de negocio.
2. El código del Excel solo actualiza si apunta a **la misma** entidad.
3. Si el código está ocupado por otra entidad → crear con código nuevo generado.
4. Al actualizar, **conservar** el `code` ya asignado en BD.

```ts
// ❌ MAL
const existing = (await findByCode(draft.code)) ?? (await findByDocument(...));

// ✅ BIEN
const existing = await findByDocument(...);
// código solo si confirma misma identidad
```

---

## 2. Un lote fallido abortaba toda la importación

### Qué pasó
Server Actions con muchas filas a veces fallan (timeout, body, red). Si el helper de chunks hacía `return` al primer lote malo, el resto no se importaba aunque los lotes previos ya estaban guardados.

### Cómo debe hacerse
Usar `runChunkedBulkImport` con:

```ts
await runChunkedBulkImport(preview, (chunk) => bulkImportXAction({ rows: chunk }), {
  chunkSize: 25, // o 40
  continueOnChunkError: true,
});
```

- Tamaño de lote: **25–40** filas.
- Siempre pasar `{ rows: chunk }`, **nunca** el array suelto (Next solo serializa bien el último elemento en algunos casos).
- Toast con creados / actualizados / fallidos / total leídas.

---

## 3. Códigos auto generados con `COUNT(*)` y unique

### Qué pasó
`nextCode = COUNT(*) + 1` colisiona si hay huecos, códigos manuales o carreras entre filas del mismo lote (`UNIQUE` / `23505`).

### Cómo debe hacerse
1. Secuencia con `MAX` del patrón (`MNZ-[0-9]+`, `QUI-2026-[0-9]+`, etc.).
2. En `create*`, reintentar 5–6 veces si `error.code === "23505"` regenerando código.
3. Si el unique es por documento/nombre (identidad), no reintentar: devolver error claro.

---

## 4. Fechas ISO / texto que rompen columnas `date`

### Qué pasó
Excel / `xlsx` a veces entrega `1997-11-01T00:00:00-05:00` o texto basura. Postgres rechaza el `INSERT` y la fila falla (o peor, se devolvía el string crudo).

### Cómo debe hacerse
```ts
function parseDate(value: string): string {
  // ISO date o datetime → solo YYYY-MM-DD
  // serial Excel → fecha
  // dd/mm/yyyy → fecha
  // si no parsea → ""  (NUNCA devolver el texto original)
}
```

En el client (`excel-client`): normalizar `Date`, enteros grandes (cédulas) y ISO al leer celdas.

---

## 5. Mapeo de columnas ambiguas

### Qué pasó
En centros, al subir la base maestra de trabajadores:

- `centro_trabajo` (texto libre) se tomaba como nombre del centro.
- Debía usarse `finca`.
- Además no se deduplicaba → ~210 filas en vez de ~71 centros únicos.

### Cómo debe hacerse
1. Mapeo **exclusivo**: cada columna del Excel alimenta como máximo un campo.
2. Aliases **estrictos** y orden consciente (`finca` antes que genéricos).
3. Si el archivo “parece” trabajadores (`nombre_completo`, `id_trabajador`…), forzar la columna correcta (`finca`) y no tomar ids de persona como código de centro.
4. Deduplicar en el parser por clave de negocio (última fila gana).

```ts
// ❌ MAL — aliases demasiado amplios
name: ["nombre", "centro_trabajo", "finca"]

// ✅ BIEN
name: ["finca", "centro_de_trabajo", "predio", "sede"]
// + detección de archivo de trabajadores si aplica
```

---

## 6. Validación demasiado estricta en import

### Qué pasó
Filas fallaban por campos vacíos opcionales (cargo, responsable, fechas, enums inválidos).

### Cómo debe hacerse
- `validateXDraft(draft, "form")` — estricto (UI).
- `validateXDraft(draft, "import")` — solo identidad mínima.
- `normalizeXDraftForImport` — defaults (`"Sin responsable"`, hoy, primer enum, etc.).
- Relación opcional no encontrada (finca, etc.) → `null`, no error de fila (salvo FK obligatoria).

---

## 7. Respuesta enorme del Server Action

### Qué pasó
Devolver el detalle de **todas** las filas OK infla el payload y puede truncar / timeout.

### Cómo debe hacerse
```ts
return {
  ok: true,
  created,
  updated,
  failed,
  results: results.filter((r) => r.status === "error").slice(0, 40),
};
```

---

## Checklist para un módulo nuevo

- [ ] `types.ts` con `DraftValidationMode` + `normalize*ForImport`
- [ ] `excel.ts` con mapeo exclusivo, aliases estrictos, `parseDate` seguro, dedupe
- [ ] `excel-client.ts` con `dense`, normalización de celdas numéricas/fechas
- [ ] `actions.ts` bulk: upsert por clave de negocio; código sin mezclar entidades
- [ ] `create*`: secuencia `MAX` + retry unique
- [ ] UI: `runChunkedBulkImport` + `continueOnChunkError: true` + `{ rows: chunk }`
- [ ] Toast con totales; preview aclara la clave de upsert
- [ ] Script `clear-sst-seed` incluye la tabla nueva si aplica

---

## Resumen en una frase

**Importar = identidad de negocio + defaults + lotes resilientes; nunca confiar en el “id” visual del Excel ni abortar el archivo entero por un lote.**
