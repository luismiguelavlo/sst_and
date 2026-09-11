-- OTROS6: COPASST, CCL, Emergencias (brigada / equipos / simulacros)

-- ─── COPASST ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS campus_sst.sst_copasst_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  role varchar(40) NOT NULL
    CHECK (role IN (
      'presidente',
      'vicepresidente',
      'secretario',
      'representante_empleador',
      'representante_trabajadores',
      'suplente'
    )),
  period_label varchar(80) NOT NULL DEFAULT '',
  start_date date NOT NULL,
  end_date date NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'activo'
    CHECK (status IN ('activo', 'retirado', 'periodo_vencido')),
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_copasst_members_status_idx
  ON campus_sst.sst_copasst_members (status, end_date);
CREATE INDEX IF NOT EXISTS sst_copasst_members_worker_idx
  ON campus_sst.sst_copasst_members (worker_id);

CREATE TABLE IF NOT EXISTS campus_sst.sst_copasst_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  meeting_date date NOT NULL,
  meeting_type varchar(32) NOT NULL DEFAULT 'ordinaria'
    CHECK (meeting_type IN ('ordinaria', 'extraordinaria')),
  title varchar(200) NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  act_url text NOT NULL DEFAULT '',
  act_name varchar(200) NOT NULL DEFAULT '',
  next_meeting_date date,
  status varchar(32) NOT NULL DEFAULT 'realizada'
    CHECK (status IN ('programada', 'realizada', 'cancelada')),
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_copasst_meetings_date_idx
  ON campus_sst.sst_copasst_meetings (meeting_date DESC);

CREATE TABLE IF NOT EXISTS campus_sst.sst_copasst_commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  meeting_id uuid REFERENCES campus_sst.sst_copasst_meetings (id) ON DELETE SET NULL,
  description text NOT NULL DEFAULT '',
  responsible_name varchar(160) NOT NULL DEFAULT '',
  due_date date NOT NULL,
  closed_at date,
  status varchar(32) NOT NULL DEFAULT 'abierto'
    CHECK (status IN ('abierto', 'vencido', 'cerrado')),
  follow_up text NOT NULL DEFAULT '',
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_copasst_commitments_status_idx
  ON campus_sst.sst_copasst_commitments (status, due_date);

CREATE TABLE IF NOT EXISTS campus_sst.sst_copasst_trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  title varchar(200) NOT NULL DEFAULT '',
  training_date date NOT NULL,
  hours numeric(6, 2) NOT NULL DEFAULT 0,
  instructor varchar(160) NOT NULL DEFAULT '',
  attendees_count integer NOT NULL DEFAULT 0,
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  status varchar(32) NOT NULL DEFAULT 'realizada'
    CHECK (status IN ('programada', 'realizada', 'cancelada')),
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── CCL (casos sin datos sensibles en UI general) ─────────────────────────

CREATE TABLE IF NOT EXISTS campus_sst.sst_ccl_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  role varchar(40) NOT NULL
    CHECK (role IN (
      'presidente',
      'secretario',
      'representante_empleador',
      'representante_trabajadores',
      'suplente'
    )),
  period_label varchar(80) NOT NULL DEFAULT '',
  start_date date NOT NULL,
  end_date date NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'activo'
    CHECK (status IN ('activo', 'retirado', 'periodo_vencido')),
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_ccl_members_status_idx
  ON campus_sst.sst_ccl_members (status, end_date);

CREATE TABLE IF NOT EXISTS campus_sst.sst_ccl_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  meeting_date date NOT NULL,
  meeting_type varchar(32) NOT NULL DEFAULT 'ordinaria'
    CHECK (meeting_type IN ('ordinaria', 'extraordinaria')),
  title varchar(200) NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  act_url text NOT NULL DEFAULT '',
  act_name varchar(200) NOT NULL DEFAULT '',
  status varchar(32) NOT NULL DEFAULT 'realizada'
    CHECK (status IN ('programada', 'realizada', 'cancelada')),
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campus_sst.sst_ccl_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) NOT NULL UNIQUE,
  -- Solo trazabilidad administrativa; NO identidades ni hechos sensibles en dashboard
  opened_at date NOT NULL,
  due_date date,
  closed_at date,
  status varchar(32) NOT NULL DEFAULT 'abierto'
    CHECK (status IN (
      'abierto',
      'en_tramite',
      'seguimiento',
      'cerrado',
      'archivado'
    )),
  activity_summary varchar(200) NOT NULL DEFAULT '',
  follow_up text NOT NULL DEFAULT '',
  meeting_id uuid REFERENCES campus_sst.sst_ccl_meetings (id) ON DELETE SET NULL,
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_ccl_cases_status_idx
  ON campus_sst.sst_ccl_cases (status, due_date);

CREATE TABLE IF NOT EXISTS campus_sst.sst_ccl_commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  meeting_id uuid REFERENCES campus_sst.sst_ccl_meetings (id) ON DELETE SET NULL,
  case_id uuid REFERENCES campus_sst.sst_ccl_cases (id) ON DELETE SET NULL,
  description text NOT NULL DEFAULT '',
  responsible_name varchar(160) NOT NULL DEFAULT '',
  due_date date NOT NULL,
  closed_at date,
  status varchar(32) NOT NULL DEFAULT 'abierto'
    CHECK (status IN ('abierto', 'vencido', 'cerrado')),
  follow_up text NOT NULL DEFAULT '',
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_ccl_commitments_status_idx
  ON campus_sst.sst_ccl_commitments (status, due_date);

-- ─── Emergencias ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS campus_sst.sst_brigade_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  brigade_type varchar(40) NOT NULL
    CHECK (brigade_type IN (
      'primeros_auxilios',
      'evacuacion',
      'incendios',
      'rescate'
    )),
  training_title varchar(200) NOT NULL DEFAULT '',
  trained_at date NOT NULL,
  due_date date NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'vigente'
    CHECK (status IN ('vigente', 'proximo', 'vencido', 'inactivo')),
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_brigade_members_status_idx
  ON campus_sst.sst_brigade_members (status, due_date);
CREATE INDEX IF NOT EXISTS sst_brigade_members_worker_idx
  ON campus_sst.sst_brigade_members (worker_id);

CREATE TABLE IF NOT EXISTS campus_sst.sst_emergency_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) NOT NULL UNIQUE,
  element_name varchar(160) NOT NULL DEFAULT '',
  equipment_type varchar(40) NOT NULL
    CHECK (equipment_type IN (
      'extintor',
      'botiquin',
      'camilla',
      'senalizacion',
      'linterna',
      'otro'
    )),
  location varchar(200) NOT NULL DEFAULT '',
  inspected_at date,
  next_inspection_at date NOT NULL,
  responsible_name varchar(160) NOT NULL DEFAULT '',
  status varchar(32) NOT NULL DEFAULT 'operativo'
    CHECK (status IN (
      'operativo',
      'requiere_mantenimiento',
      'fuera_servicio',
      'vencido_inspeccion'
    )),
  findings text NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_emergency_equipment_status_idx
  ON campus_sst.sst_emergency_equipment (status, next_inspection_at);

CREATE TABLE IF NOT EXISTS campus_sst.sst_emergency_drills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  drill_date date NOT NULL,
  place varchar(200) NOT NULL DEFAULT '',
  drill_type varchar(40) NOT NULL
    CHECK (drill_type IN (
      'evacuacion',
      'incendio',
      'derrame',
      'sismo',
      'primeros_auxilios',
      'integral',
      'otro'
    )),
  participants_count integer NOT NULL DEFAULT 0,
  result_score numeric(5, 2),
  result_label varchar(80) NOT NULL DEFAULT '',
  findings text NOT NULL DEFAULT '',
  actions text NOT NULL DEFAULT '',
  status varchar(32) NOT NULL DEFAULT 'programado'
    CHECK (status IN ('programado', 'realizado', 'cancelado')),
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_emergency_drills_date_idx
  ON campus_sst.sst_emergency_drills (drill_date DESC);
