-- Inventario de sustancias químicas (SG-SST)
CREATE TABLE IF NOT EXISTS campus_sst.sst_chemicals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) NOT NULL UNIQUE,
  product_name varchar(200) NOT NULL,
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  area varchar(160) NOT NULL DEFAULT '',
  responsible_name varchar(160) NOT NULL DEFAULT '',
  safety_sheet_url text NOT NULL DEFAULT '',
  safety_sheet_name varchar(200) NOT NULL DEFAULT '',
  safety_sheet_updated_at date,
  required_epp text NOT NULL DEFAULT '',
  storage_conditions text NOT NULL DEFAULT '',
  quantity numeric(14, 3) NOT NULL DEFAULT 0,
  unit varchar(24) NOT NULL DEFAULT 'L',
  last_inspection_at date,
  next_inspection_at date,
  inspection_notes text NOT NULL DEFAULT '',
  training_status varchar(32) NOT NULL DEFAULT 'pendiente',
  last_training_at date,
  training_notes text NOT NULL DEFAULT '',
  status varchar(32) NOT NULL DEFAULT 'activo',
  observations text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  CONSTRAINT sst_chemicals_unit_chk CHECK (
    unit IN ('L', 'mL', 'kg', 'g', 'gal', 'und', 'caneca', 'saco', 'otro')
  ),
  CONSTRAINT sst_chemicals_status_chk CHECK (
    status IN ('activo', 'agotado', 'restringido', 'descontinuado', 'vencido')
  ),
  CONSTRAINT sst_chemicals_training_chk CHECK (
    training_status IN ('vigente', 'pendiente', 'vencida', 'no_aplica')
  )
);

CREATE INDEX IF NOT EXISTS sst_chemicals_farm_idx
  ON campus_sst.sst_chemicals (farm_id, status);

CREATE INDEX IF NOT EXISTS sst_chemicals_product_idx
  ON campus_sst.sst_chemicals (lower(product_name));

CREATE INDEX IF NOT EXISTS sst_chemicals_next_inspection_idx
  ON campus_sst.sst_chemicals (next_inspection_at)
  WHERE next_inspection_at IS NOT NULL;
