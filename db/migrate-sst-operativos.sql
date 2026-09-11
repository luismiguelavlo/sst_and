-- OTROS2: Trabajo en alturas, Tractoristas/Operadores, PESV
-- Autorizaciones operativas vinculadas a sst_workers + proyección a compliance/alertas

CREATE TABLE IF NOT EXISTS campus_sst.sst_heights_authorizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  training_level varchar(40) NOT NULL
    CHECK (training_level IN (
      'autorizado_32h',
      'reentrenamiento_8h',
      'coordinador_80h',
      'jefe_area'
    )),
  training_date date,
  training_due_date date,
  retraining_done boolean NOT NULL DEFAULT false,
  certificate_url text NOT NULL DEFAULT '',
  certificate_name varchar(200) NOT NULL DEFAULT '',
  medical_exam_date date,
  medical_exam_due_date date,
  fitness_concept varchar(40) NOT NULL DEFAULT 'pendiente'
    CHECK (fitness_concept IN (
      'apto',
      'apto_recomendaciones',
      'no_apto',
      'pendiente'
    )),
  authorization_status varchar(32) NOT NULL DEFAULT 'no_autorizado'
    CHECK (authorization_status IN ('autorizado', 'no_autorizado', 'por_vencer')),
  observations text NOT NULL DEFAULT '',
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_heights_worker_idx
  ON campus_sst.sst_heights_authorizations (worker_id);
CREATE INDEX IF NOT EXISTS sst_heights_status_idx
  ON campus_sst.sst_heights_authorizations (authorization_status);
CREATE INDEX IF NOT EXISTS sst_heights_training_due_idx
  ON campus_sst.sst_heights_authorizations (training_due_date);

CREATE TABLE IF NOT EXISTS campus_sst.sst_machine_operators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  equipment_name varchar(160) NOT NULL DEFAULT '',
  equipment_type varchar(80) NOT NULL DEFAULT 'tractor'
    CHECK (equipment_type IN (
      'tractor',
      'cosechadora',
      'fumigadora',
      'camion',
      'otro'
    )),
  training_name varchar(200) NOT NULL DEFAULT '',
  training_date date,
  training_due_date date,
  license_category varchar(40) NOT NULL DEFAULT '',
  license_due_date date,
  occupational_exam_date date,
  fitness_concept varchar(40) NOT NULL DEFAULT 'pendiente'
    CHECK (fitness_concept IN (
      'apto',
      'apto_recomendaciones',
      'no_apto',
      'pendiente'
    )),
  induction_done boolean NOT NULL DEFAULT false,
  induction_date date,
  key_status varchar(32) NOT NULL DEFAULT 'bloqueado'
    CHECK (key_status IN ('autorizado', 'bloqueado')),
  block_reasons text NOT NULL DEFAULT '',
  observations text NOT NULL DEFAULT '',
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_operators_worker_idx
  ON campus_sst.sst_machine_operators (worker_id);
CREATE INDEX IF NOT EXISTS sst_operators_farm_idx
  ON campus_sst.sst_machine_operators (farm_id);
CREATE INDEX IF NOT EXISTS sst_operators_key_idx
  ON campus_sst.sst_machine_operators (key_status);

CREATE TABLE IF NOT EXISTS campus_sst.sst_pesv_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate varchar(20) NOT NULL UNIQUE,
  vehicle_type varchar(80) NOT NULL DEFAULT 'camioneta',
  brand varchar(80) NOT NULL DEFAULT '',
  model varchar(80) NOT NULL DEFAULT '',
  responsible_worker_id uuid REFERENCES campus_sst.sst_workers (id) ON DELETE SET NULL,
  work_center varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  status varchar(32) NOT NULL DEFAULT 'apto'
    CHECK (status IN ('apto', 'alerta', 'detenido')),
  soat_due_date date,
  rtm_due_date date,
  insurance_due_date date,
  odometer_km integer NOT NULL DEFAULT 0,
  kit_ok boolean NOT NULL DEFAULT true,
  extinguisher_ok boolean NOT NULL DEFAULT true,
  observations text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_pesv_vehicles_status_idx
  ON campus_sst.sst_pesv_vehicles (status);

CREATE TABLE IF NOT EXISTS campus_sst.sst_pesv_drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  vehicle_id uuid REFERENCES campus_sst.sst_pesv_vehicles (id) ON DELETE SET NULL,
  vehicle_type varchar(80) NOT NULL DEFAULT '',
  plate_snapshot varchar(20) NOT NULL DEFAULT '',
  license_category varchar(40) NOT NULL DEFAULT '',
  license_due_date date,
  road_safety_course_date date,
  road_safety_course_due date,
  medical_exam_date date,
  fitness_concept varchar(40) NOT NULL DEFAULT 'pendiente'
    CHECK (fitness_concept IN (
      'apto',
      'apto_recomendaciones',
      'no_apto',
      'pendiente'
    )),
  authorization_status varchar(32) NOT NULL DEFAULT 'no_autorizado'
    CHECK (authorization_status IN ('autorizado', 'no_autorizado', 'suspendido', 'por_vencer')),
  observations text NOT NULL DEFAULT '',
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_pesv_drivers_worker_idx
  ON campus_sst.sst_pesv_drivers (worker_id);
CREATE INDEX IF NOT EXISTS sst_pesv_drivers_status_idx
  ON campus_sst.sst_pesv_drivers (authorization_status);

CREATE TABLE IF NOT EXISTS campus_sst.sst_pesv_preops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  vehicle_id uuid NOT NULL REFERENCES campus_sst.sst_pesv_vehicles (id) ON DELETE CASCADE,
  inspection_date date NOT NULL DEFAULT CURRENT_DATE,
  category varchar(80) NOT NULL DEFAULT 'general',
  finding text NOT NULL DEFAULT '',
  status varchar(32) NOT NULL DEFAULT 'abierto'
    CHECK (status IN ('abierto', 'programado', 'cerrado', 'detenido')),
  odometer_km integer,
  evidence_url text NOT NULL DEFAULT '',
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_pesv_preops_vehicle_idx
  ON campus_sst.sst_pesv_preops (vehicle_id, inspection_date DESC);
CREATE INDEX IF NOT EXISTS sst_pesv_preops_status_idx
  ON campus_sst.sst_pesv_preops (status);
