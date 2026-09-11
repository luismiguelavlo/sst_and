-- Catálogo de fincas / predios (extiende sst_farms)

ALTER TABLE campus_sst.sst_farms
  ADD COLUMN IF NOT EXISTS company varchar(160) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS municipality varchar(120) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS address text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS observations text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS sst_farms_active_idx
  ON campus_sst.sst_farms (active, name);
