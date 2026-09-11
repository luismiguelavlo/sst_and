-- OTROS3: EPP + Inspecciones

CREATE TABLE IF NOT EXISTS campus_sst.sst_epp_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) NOT NULL UNIQUE,
  category varchar(40) NOT NULL
    CHECK (category IN (
      'botas',
      'guantes',
      'gafas',
      'casco',
      'proteccion_auditiva',
      'proteccion_respiratoria',
      'arnes',
      'eslinga',
      'impermeable',
      'vaqueta',
      'otros'
    )),
  name varchar(160) NOT NULL,
  useful_life_days integer NOT NULL DEFAULT 180 CHECK (useful_life_days > 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_epp_catalog_category_idx
  ON campus_sst.sst_epp_catalog (category, active);

CREATE TABLE IF NOT EXISTS campus_sst.sst_epp_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  catalog_item_id uuid NOT NULL REFERENCES campus_sst.sst_epp_catalog (id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size_label varchar(40) NOT NULL DEFAULT '',
  delivery_date date NOT NULL,
  useful_life_days integer NOT NULL DEFAULT 180,
  next_replenishment_date date,
  reason varchar(40) NOT NULL DEFAULT 'dotacion'
    CHECK (reason IN ('dotacion', 'reposicion', 'ingreso')),
  responsible_name varchar(160) NOT NULL DEFAULT '',
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  observations text NOT NULL DEFAULT '',
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  work_center_snapshot varchar(160) NOT NULL DEFAULT '',
  unit_cost_cop numeric(12, 2) NOT NULL DEFAULT 0,
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_epp_deliveries_worker_idx
  ON campus_sst.sst_epp_deliveries (worker_id, delivery_date DESC);
CREATE INDEX IF NOT EXISTS sst_epp_deliveries_next_idx
  ON campus_sst.sst_epp_deliveries (next_replenishment_date);
CREATE INDEX IF NOT EXISTS sst_epp_deliveries_catalog_idx
  ON campus_sst.sst_epp_deliveries (catalog_item_id);

CREATE TABLE IF NOT EXISTS campus_sst.sst_inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  inspection_type varchar(40) NOT NULL
    CHECK (inspection_type IN (
      'locativas',
      'epp',
      'botiquines',
      'extintores',
      'equipos',
      'herramientas',
      'vehiculos',
      'tractor',
      'trabajo_alturas',
      'emergencias',
      'orden_aseo',
      'quimicos',
      'puestos_trabajo'
    )),
  responsible_name varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  work_center varchar(160) NOT NULL DEFAULT '',
  scheduled_date date NOT NULL,
  performed_date date,
  status varchar(32) NOT NULL DEFAULT 'programada'
    CHECK (status IN (
      'programada',
      'en_proceso',
      'realizada',
      'pendiente',
      'vencida'
    )),
  findings_summary text NOT NULL DEFAULT '',
  findings_count integer NOT NULL DEFAULT 0,
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  generated_action text NOT NULL DEFAULT '',
  next_inspection_date date,
  observations text NOT NULL DEFAULT '',
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_inspections_type_idx
  ON campus_sst.sst_inspections (inspection_type, status);
CREATE INDEX IF NOT EXISTS sst_inspections_scheduled_idx
  ON campus_sst.sst_inspections (scheduled_date);
CREATE INDEX IF NOT EXISTS sst_inspections_farm_idx
  ON campus_sst.sst_inspections (farm_id);

CREATE TABLE IF NOT EXISTS campus_sst.sst_inspection_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES campus_sst.sst_inspections (id) ON DELETE CASCADE,
  severity varchar(16) NOT NULL DEFAULT 'media'
    CHECK (severity IN ('baja', 'media', 'alta', 'critica')),
  title varchar(200) NOT NULL,
  description text NOT NULL DEFAULT '',
  action_plan text NOT NULL DEFAULT '',
  assignee_name varchar(160) NOT NULL DEFAULT '',
  due_date date,
  status varchar(32) NOT NULL DEFAULT 'abierto'
    CHECK (status IN ('abierto', 'en_proceso', 'cerrado')),
  evidence_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_inspection_findings_insp_idx
  ON campus_sst.sst_inspection_findings (inspection_id, status);
