# OTROS7 — Químicos (inventario)

## Objetivo
Inventario operativo de sustancias químicas alineado a la línea visual SG-SST (header + stats + tabla + diálogo + Excel I/O).

## Campos
| Campo | Uso |
|-------|-----|
| Producto | Nombre de la sustancia |
| Finca / área | Centro de trabajo + área/bodega |
| Responsable | Encargado del control |
| Ficha de seguridad | Nombre + URL + fecha de actualización |
| EPP requerido | Texto libre de elementos |
| Almacenamiento | Condiciones |
| Cantidad / Unidad | Stock (L, mL, kg, g, gal, und, caneca, saco, otro) |
| Inspección | Última / próxima + notas |
| Capacitación | Estado (vigente/pendiente/vencida/no aplica) + fecha/notas |
| Estado | activo, agotado, restringido, descontinuado, vencido |

## Ruta
`/sg-sst/quimicos`

## Capas
- `db/migrate-sst-quimicos.sql` → `sst_chemicals`
- `lib/sg-sst/quimicos/*` (types, repository, actions, excel)
- `components/sg-sst/quimicos/ChemicalsMasterScreen.tsx`

## Funciones
CRUD, filtros, stats, plantilla/export/import Excel (upsert por código o producto+centro), lotes chunked.
