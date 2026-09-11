-- Base maestra de trabajadores SG-SST
CREATE TABLE IF NOT EXISTS campus_sst.sst_workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_code varchar(40) NOT NULL UNIQUE,
  full_name varchar(180) NOT NULL,
  document_type varchar(8) NOT NULL DEFAULT 'CC'
    CHECK (document_type IN ('CC', 'CE', 'PPT', 'TI', 'NIT', 'PAS')),
  document_number varchar(40) NOT NULL,
  company varchar(160) NOT NULL DEFAULT 'Grupo Manzanares S.A.S.',
  job_title varchar(160) NOT NULL,
  area varchar(120) NOT NULL DEFAULT '',
  work_center varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  supervisor_name varchar(160) NOT NULL DEFAULT '',
  hire_date date,
  contract_type varchar(80) NOT NULL DEFAULT '',
  status varchar(16) NOT NULL DEFAULT 'activo'
    CHECK (status IN ('activo', 'retirado')),
  risk_level smallint NOT NULL DEFAULT 4 CHECK (risk_level BETWEEN 1 AND 5),
  works_heights boolean NOT NULL DEFAULT false,
  drives boolean NOT NULL DEFAULT false,
  operates_tractor boolean NOT NULL DEFAULT false,
  handles_chemicals boolean NOT NULL DEFAULT false,
  in_brigade boolean NOT NULL DEFAULT false,
  in_copasst boolean NOT NULL DEFAULT false,
  in_ccl boolean NOT NULL DEFAULT false,
  phone varchar(40) NOT NULL DEFAULT '',
  email varchar(180) NOT NULL DEFAULT '',
  observations text NOT NULL DEFAULT '',
  retirement_date date,
  retirement_reason text,
  user_id uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (document_type, document_number)
);

CREATE UNIQUE INDEX IF NOT EXISTS sst_workers_user_id_uidx
  ON campus_sst.sst_workers (user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS sst_workers_status_idx
  ON campus_sst.sst_workers (status, full_name);

CREATE INDEX IF NOT EXISTS sst_workers_farm_idx
  ON campus_sst.sst_workers (farm_id);

CREATE INDEX IF NOT EXISTS sst_workers_name_idx
  ON campus_sst.sst_workers (full_name);

ALTER TABLE campus_sst.sst_compliance_records
  ADD COLUMN IF NOT EXISTS worker_id uuid REFERENCES campus_sst.sst_workers (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS sst_compliance_records_worker_idx
  ON campus_sst.sst_compliance_records (worker_id);
