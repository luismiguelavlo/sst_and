-- OTROS: restricciones, casos de salud, incapacidades (dominio administrativo SST)
-- Sin historia clínica en casos/restricciones; CIE-10 solo en incapacidades cuando aplique.

CREATE TABLE IF NOT EXISTS campus_sst.sst_restricciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  restriction_kind varchar(32) NOT NULL
    CHECK (restriction_kind IN (
      'restriccion',
      'recomendacion',
      'post_incapacidad',
      'definitiva_reubicacion'
    )),
  issued_at date NOT NULL,
  start_date date NOT NULL,
  due_date date,
  detail text NOT NULL DEFAULT '',
  issuer varchar(200) NOT NULL DEFAULT '',
  responsible_name varchar(160) NOT NULL DEFAULT '',
  measure_implemented text NOT NULL DEFAULT '',
  implemented_at date,
  status varchar(32) NOT NULL DEFAULT 'vigente'
    CHECK (status IN (
      'vigente',
      'proxima_vencer',
      'vencida',
      'pendiente_implementacion',
      'cerrada'
    )),
  next_follow_up date,
  observations text NOT NULL DEFAULT '',
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_restricciones_worker_idx
  ON campus_sst.sst_restricciones (worker_id, issued_at DESC);
CREATE INDEX IF NOT EXISTS sst_restricciones_due_idx
  ON campus_sst.sst_restricciones (due_date)
  WHERE status NOT IN ('cerrada');
CREATE INDEX IF NOT EXISTS sst_restricciones_status_idx
  ON campus_sst.sst_restricciones (status);

CREATE TABLE IF NOT EXISTS campus_sst.sst_casos_salud (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  case_type varchar(40) NOT NULL
    CHECK (case_type IN (
      'accidente_laboral',
      'enfermedad_laboral',
      'enfermedad_comun',
      'restriccion',
      'recomendacion_medica',
      'reintegro',
      'reubicacion',
      'seguimiento_eps',
      'seguimiento_arl'
    )),
  opened_at date NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'abierto'
    CHECK (status IN (
      'abierto',
      'en_seguimiento',
      'pendiente',
      'cerrado'
    )),
  responsible_name varchar(160) NOT NULL DEFAULT '',
  issuer varchar(200) NOT NULL DEFAULT '',
  next_follow_up date,
  closed_at date,
  admin_observations text NOT NULL DEFAULT '',
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_casos_salud_worker_idx
  ON campus_sst.sst_casos_salud (worker_id, opened_at DESC);
CREATE INDEX IF NOT EXISTS sst_casos_salud_status_idx
  ON campus_sst.sst_casos_salud (status);
CREATE INDEX IF NOT EXISTS sst_casos_salud_follow_idx
  ON campus_sst.sst_casos_salud (next_follow_up)
  WHERE status NOT IN ('cerrado');

CREATE TABLE IF NOT EXISTS campus_sst.sst_incapacidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  days_ordered integer NOT NULL DEFAULT 0,
  origin varchar(32) NOT NULL
    CHECK (origin IN ('comun', 'laboral_at', 'laboral_el', 'maternidad', 'transito')),
  is_extension boolean NOT NULL DEFAULT false,
  accumulated_days integer NOT NULL DEFAULT 0,
  status varchar(32) NOT NULL DEFAULT 'activa'
    CHECK (status IN (
      'activa',
      'por_vencer',
      'vencida_sin_cierre',
      'cerrada',
      'en_reintegro'
    )),
  sst_follow_up text NOT NULL DEFAULT '',
  reintegration_required boolean NOT NULL DEFAULT false,
  reintegration_date date,
  reintegration_status varchar(32) NOT NULL DEFAULT 'no_aplica'
    CHECK (reintegration_status IN (
      'no_aplica',
      'pendiente',
      'programado',
      'completado'
    )),
  cie10 varchar(16) NOT NULL DEFAULT '',
  diagnosis_label varchar(200) NOT NULL DEFAULT '',
  issuer varchar(200) NOT NULL DEFAULT '',
  admin_observations text NOT NULL DEFAULT '',
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  reintegration_compliance_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS sst_incapacidades_worker_idx
  ON campus_sst.sst_incapacidades (worker_id, start_date DESC);
CREATE INDEX IF NOT EXISTS sst_incapacidades_end_idx
  ON campus_sst.sst_incapacidades (end_date)
  WHERE status NOT IN ('cerrada');
CREATE INDEX IF NOT EXISTS sst_incapacidades_status_idx
  ON campus_sst.sst_incapacidades (status);
