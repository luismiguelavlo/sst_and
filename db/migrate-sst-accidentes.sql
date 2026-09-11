-- OTROS4: Accidentes e incidentes, causas, investigaciones

CREATE TABLE IF NOT EXISTS campus_sst.sst_accident_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_number varchar(40) NOT NULL UNIQUE,
  event_date date NOT NULL,
  event_time time,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  area_snapshot varchar(120) NOT NULL DEFAULT '',
  work_center_snapshot varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  event_type varchar(32) NOT NULL
    CHECK (event_type IN (
      'accidente_trabajo',
      'incidente',
      'accidente_vial',
      'evento_peligroso',
      'otros'
    )),
  description text NOT NULL DEFAULT '',
  accident_kind varchar(80) NOT NULL DEFAULT '',
  mechanism varchar(120) NOT NULL DEFAULT '',
  agent varchar(120) NOT NULL DEFAULT '',
  body_part varchar(120) NOT NULL DEFAULT '',
  injury_type varchar(120) NOT NULL DEFAULT '',
  lost_days integer NOT NULL DEFAULT 0 CHECK (lost_days >= 0),
  origin varchar(80) NOT NULL DEFAULT '',
  status varchar(32) NOT NULL DEFAULT 'en_investigacion'
    CHECK (status IN (
      'en_investigacion',
      'en_seguimiento',
      'cerrado'
    )),
  investigation_notes text NOT NULL DEFAULT '',
  corrective_action_notes text NOT NULL DEFAULT '',
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_accident_events_worker_idx
  ON campus_sst.sst_accident_events (worker_id, event_date DESC);
CREATE INDEX IF NOT EXISTS sst_accident_events_type_idx
  ON campus_sst.sst_accident_events (event_type, status);
CREATE INDEX IF NOT EXISTS sst_accident_events_farm_idx
  ON campus_sst.sst_accident_events (farm_id);

CREATE TABLE IF NOT EXISTS campus_sst.sst_accident_causes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accident_id uuid NOT NULL UNIQUE REFERENCES campus_sst.sst_accident_events (id) ON DELETE CASCADE,
  immediate_act text NOT NULL DEFAULT '',
  immediate_condition text NOT NULL DEFAULT '',
  basic_personal text NOT NULL DEFAULT '',
  basic_work text NOT NULL DEFAULT '',
  root_cause text NOT NULL DEFAULT '',
  agent varchar(120) NOT NULL DEFAULT '',
  mechanism varchar(120) NOT NULL DEFAULT '',
  corrective_action text NOT NULL DEFAULT '',
  preventive_action text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campus_sst.sst_investigations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  accident_id uuid NOT NULL REFERENCES campus_sst.sst_accident_events (id) ON DELETE RESTRICT,
  accident_date date NOT NULL,
  legal_due_date date NOT NULL,
  responsible_name varchar(160) NOT NULL DEFAULT '',
  status varchar(40) NOT NULL DEFAULT 'pendiente_inicio'
    CHECK (status IN (
      'pendiente_inicio',
      'en_campo',
      'revision_copasst',
      'radicada_arl',
      'cerrada'
    )),
  investigation_date date,
  investigation_team text NOT NULL DEFAULT '',
  methodology varchar(40) NOT NULL DEFAULT 'ishikawa'
    CHECK (methodology IN (
      'ishikawa',
      'arbol',
      '5_porques',
      'scra'
    )),
  causes_summary text NOT NULL DEFAULT '',
  action_plan text NOT NULL DEFAULT '',
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  closed_at date,
  observations text NOT NULL DEFAULT '',
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_investigations_accident_idx
  ON campus_sst.sst_investigations (accident_id);
CREATE INDEX IF NOT EXISTS sst_investigations_status_idx
  ON campus_sst.sst_investigations (status, legal_due_date);
CREATE INDEX IF NOT EXISTS sst_investigations_due_idx
  ON campus_sst.sst_investigations (legal_due_date)
  WHERE status NOT IN ('cerrada', 'radicada_arl');
