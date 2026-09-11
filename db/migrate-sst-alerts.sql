-- Sistema de Alertas SST / registros de cumplimiento operativo
CREATE TABLE IF NOT EXISTS campus_sst.sst_farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL UNIQUE,
  code varchar(32) NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campus_sst.sst_alert_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  critical_max_days integer NOT NULL DEFAULT 0,
  orange_max_days integer NOT NULL DEFAULT 30,
  yellow_max_days integer NOT NULL DEFAULT 60,
  use_business_days boolean NOT NULL DEFAULT false,
  type_overrides jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  CHECK (critical_max_days <= orange_max_days),
  CHECK (orange_max_days < yellow_max_days)
);

INSERT INTO campus_sst.sst_alert_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS campus_sst.sst_compliance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  record_type varchar(48) NOT NULL,
  title varchar(200) NOT NULL,
  code varchar(64) NOT NULL,
  module_path varchar(80) NOT NULL,
  subject_name varchar(160) NOT NULL,
  subject_document varchar(64),
  subject_job_title varchar(120),
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  due_date date,
  issued_at date,
  workflow_status varchar(40) NOT NULL DEFAULT 'open'
    CHECK (workflow_status IN (
      'open',
      'in_progress',
      'pending_implementation',
      'pending_delivery',
      'pending_closure',
      'closed',
      'cancelled'
    )),
  responsible_name varchar(160),
  responsible_role varchar(120),
  external_entity varchar(200),
  phone varchar(40),
  notes text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  closed_at timestamptz,
  close_notes text,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_compliance_records_type_idx
  ON campus_sst.sst_compliance_records (record_type, workflow_status);

CREATE INDEX IF NOT EXISTS sst_compliance_records_due_idx
  ON campus_sst.sst_compliance_records (due_date)
  WHERE closed_at IS NULL;

CREATE INDEX IF NOT EXISTS sst_compliance_records_farm_idx
  ON campus_sst.sst_compliance_records (farm_id);

CREATE TABLE IF NOT EXISTS campus_sst.sst_alert_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id uuid NOT NULL REFERENCES campus_sst.sst_compliance_records (id) ON DELETE CASCADE,
  action_kind varchar(32) NOT NULL CHECK (action_kind IN (
    'note',
    'notify',
    'extend',
    'close',
    'reopen',
    'status_change'
  )),
  message text NOT NULL DEFAULT '',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_alert_actions_record_idx
  ON campus_sst.sst_alert_actions (record_id, created_at DESC);
