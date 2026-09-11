-- Esquema y tabla de usuarios de Campus SST
CREATE SCHEMA IF NOT EXISTS campus_sst;

CREATE TABLE IF NOT EXISTS campus_sst.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL UNIQUE,
  password_hash varchar(128) NOT NULL,
  password_salt varchar(64) NOT NULL,
  name varchar(120) NOT NULL,
  job_title varchar(120) NOT NULL,
  role varchar(16) NOT NULL CHECK (role IN ('admin', 'user')),
  bio text,
  photo_url text,
  email_notifications boolean NOT NULL DEFAULT true,
  weekly_digest boolean NOT NULL DEFAULT false,
  language varchar(8) NOT NULL DEFAULT 'es',
  two_factor_enabled boolean NOT NULL DEFAULT false,
  cedula varchar(32),
  status varchar(16) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'pending')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_role_idx ON campus_sst.users (role);
CREATE INDEX IF NOT EXISTS users_status_idx ON campus_sst.users (status);

CREATE TABLE IF NOT EXISTS campus_sst.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(180) NOT NULL UNIQUE,
  title varchar(200) NOT NULL,
  description text NOT NULL DEFAULT '',
  category varchar(40) NOT NULL,
  level varchar(20) NOT NULL DEFAULT 'basico',
  cover_url text,
  cover_public_id text,
  is_public boolean NOT NULL DEFAULT true,
  issue_certificate boolean NOT NULL DEFAULT true,
  enable_discussions boolean NOT NULL DEFAULT true,
  status varchar(16) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS courses_status_idx ON campus_sst.courses (status);
CREATE INDEX IF NOT EXISTS courses_category_idx ON campus_sst.courses (category);

CREATE TABLE IF NOT EXISTS campus_sst.course_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES campus_sst.courses (id) ON DELETE CASCADE,
  position integer NOT NULL,
  title varchar(200) NOT NULL,
  kind varchar(16) NOT NULL CHECK (kind IN ('video', 'uploaded_video', 'image', 'document', 'quiz')),
  body text,
  youtube_url text,
  media_url text,
  media_public_id text,
  media_filename varchar(255),
  quiz_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS course_sections_course_pos_idx
  ON campus_sst.course_sections (course_id, position);

CREATE TABLE IF NOT EXISTS campus_sst.lesson_progress (
  user_id uuid NOT NULL REFERENCES campus_sst.users (id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES campus_sst.courses (id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES campus_sst.course_sections (id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, section_id)
);

CREATE INDEX IF NOT EXISTS lesson_progress_user_course_idx
  ON campus_sst.lesson_progress (user_id, course_id);

CREATE TABLE IF NOT EXISTS campus_sst.course_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES campus_sst.users (id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES campus_sst.courses (id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  deadline date,
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS course_assignments_user_idx
  ON campus_sst.course_assignments (user_id);

CREATE INDEX IF NOT EXISTS course_assignments_course_idx
  ON campus_sst.course_assignments (course_id);

CREATE INDEX IF NOT EXISTS course_assignments_batch_idx
  ON campus_sst.course_assignments (batch_id, created_at DESC);

CREATE TABLE IF NOT EXISTS campus_sst.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES campus_sst.users (id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES campus_sst.courses (id) ON DELETE CASCADE,
  code varchar(48) NOT NULL UNIQUE,
  hours integer NOT NULL DEFAULT 1 CHECK (hours > 0),
  issued_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS certificates_user_idx
  ON campus_sst.certificates (user_id, issued_at DESC);

CREATE INDEX IF NOT EXISTS certificates_course_idx
  ON campus_sst.certificates (course_id);

CREATE TABLE IF NOT EXISTS campus_sst.course_discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES campus_sst.courses (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES campus_sst.users (id) ON DELETE CASCADE,
  parent_id uuid REFERENCES campus_sst.course_discussions (id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (char_length(trim(body)) > 0)
);

CREATE INDEX IF NOT EXISTS course_discussions_course_idx
  ON campus_sst.course_discussions (course_id, created_at DESC);

CREATE INDEX IF NOT EXISTS course_discussions_parent_idx
  ON campus_sst.course_discussions (parent_id);

CREATE TABLE IF NOT EXISTS campus_sst.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES campus_sst.users (id) ON DELETE CASCADE,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  kind varchar(32) NOT NULL CHECK (kind IN ('course_assigned', 'custom', 'attendance_form')),
  title varchar(200) NOT NULL,
  body text NOT NULL DEFAULT '',
  href text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON campus_sst.notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS notifications_user_unread_idx
  ON campus_sst.notifications (user_id)
  WHERE read_at IS NULL;

CREATE TABLE IF NOT EXISTS campus_sst.attendance_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(220) NOT NULL,
  event_date date,
  responsible_name varchar(160) NOT NULL DEFAULT '',
  topic varchar(400) NOT NULL DEFAULT '',
  topic_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  enable_quality_rating boolean NOT NULL DEFAULT true,
  enable_signature boolean NOT NULL DEFAULT true,
  custom_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  status varchar(16) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS attendance_forms_status_idx
  ON campus_sst.attendance_forms (status, updated_at DESC);

CREATE INDEX IF NOT EXISTS attendance_forms_created_by_idx
  ON campus_sst.attendance_forms (created_by);

CREATE TABLE IF NOT EXISTS campus_sst.attendance_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES campus_sst.attendance_forms (id) ON DELETE CASCADE,
  user_id uuid REFERENCES campus_sst.users (id) ON DELETE CASCADE,
  first_name varchar(120) NOT NULL,
  last_name varchar(120) NOT NULL,
  cedula varchar(40) NOT NULL,
  job_title varchar(160) NOT NULL DEFAULT '',
  company varchar(200) NOT NULL,
  topic_selected varchar(400) NOT NULL,
  custom_answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  quality_rating smallint CHECK (quality_rating IS NULL OR (quality_rating BETWEEN 1 AND 5)),
  quality_comment text NOT NULL DEFAULT '',
  signature_data text,
  data_processing_consent boolean NOT NULL DEFAULT false,
  data_processing_consent_at timestamptz,
  data_processing_policy_version varchar(32),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (form_id, user_id)
);

CREATE INDEX IF NOT EXISTS attendance_responses_form_idx
  ON campus_sst.attendance_responses (form_id, submitted_at DESC);

CREATE INDEX IF NOT EXISTS attendance_responses_user_idx
  ON campus_sst.attendance_responses (user_id, submitted_at DESC);

CREATE TABLE IF NOT EXISTS campus_sst.attendance_form_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES campus_sst.attendance_forms (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES campus_sst.users (id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (form_id, user_id)
);

CREATE INDEX IF NOT EXISTS attendance_form_assignments_user_idx
  ON campus_sst.attendance_form_assignments (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS attendance_form_assignments_form_idx
  ON campus_sst.attendance_form_assignments (form_id, created_at DESC);
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

-- Exámenes médicos ocupacionales (EMO) — solo aptitud administrativa, sin clínica
CREATE TABLE IF NOT EXISTS campus_sst.sst_emos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  exam_type varchar(32) NOT NULL
    CHECK (exam_type IN (
      'ingreso',
      'periodico',
      'egreso',
      'post_incapacidad',
      'otro'
    )),
  exam_date date NOT NULL,
  next_due_date date,
  periodicity_months smallint CHECK (
    periodicity_months IS NULL OR periodicity_months IN (6, 12, 24)
  ),
  ips varchar(200) NOT NULL DEFAULT '',
  concept varchar(40) NOT NULL
    CHECK (concept IN (
      'apto',
      'apto_recomendaciones',
      'apto_restricciones',
      'no_apto'
    )),
  admin_observations text NOT NULL DEFAULT '',
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  heights_cleared boolean,
  pesv_cleared boolean,
  chemicals_cleared boolean,
  notify_supervisor boolean NOT NULL DEFAULT false,
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_emos_worker_idx
  ON campus_sst.sst_emos (worker_id, exam_date DESC);

CREATE INDEX IF NOT EXISTS sst_emos_next_due_idx
  ON campus_sst.sst_emos (next_due_date)
  WHERE next_due_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS sst_emos_concept_idx
  ON campus_sst.sst_emos (concept);

CREATE INDEX IF NOT EXISTS sst_emos_type_idx
  ON campus_sst.sst_emos (exam_type);

CREATE INDEX IF NOT EXISTS sst_emos_farm_idx
  ON campus_sst.sst_emos (farm_id);

CREATE UNIQUE INDEX IF NOT EXISTS sst_emos_compliance_uidx
  ON campus_sst.sst_emos (compliance_record_id)
  WHERE compliance_record_id IS NOT NULL;

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

-- OTROS5: Acciones correctivas, Capacitaciones, Documentos SG-SST

CREATE TABLE IF NOT EXISTS campus_sst.sst_corrective_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  source_type varchar(40) NOT NULL
    CHECK (source_type IN (
      'accidente',
      'incidente',
      'inspeccion',
      'auditoria',
      'hallazgo',
      'copasst',
      'ccl',
      'pesv',
      'sg_sst'
    )),
  source_ref varchar(80) NOT NULL DEFAULT '',
  finding text NOT NULL DEFAULT '',
  action_plan text NOT NULL DEFAULT '',
  action_kind varchar(32) NOT NULL DEFAULT 'correctiva'
    CHECK (action_kind IN ('correctiva', 'preventiva', 'mejora')),
  responsible_name varchar(160) NOT NULL DEFAULT '',
  commit_date date NOT NULL,
  closed_at date,
  status varchar(32) NOT NULL DEFAULT 'en_ejecucion'
    CHECK (status IN (
      'en_ejecucion',
      'proxima_vencer',
      'vencida',
      'cerrada'
    )),
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  efficacy_status varchar(32) NOT NULL DEFAULT 'pendiente'
    CHECK (efficacy_status IN (
      'pendiente',
      'en_seguimiento',
      'eficaz',
      'no_eficaz'
    )),
  observations text NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_corrective_actions_status_idx
  ON campus_sst.sst_corrective_actions (status, commit_date);
CREATE INDEX IF NOT EXISTS sst_corrective_actions_source_idx
  ON campus_sst.sst_corrective_actions (source_type);

CREATE TABLE IF NOT EXISTS campus_sst.sst_trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio varchar(40) NOT NULL UNIQUE,
  worker_id uuid NOT NULL REFERENCES campus_sst.sst_workers (id) ON DELETE RESTRICT,
  topic varchar(40) NOT NULL
    CHECK (topic IN (
      'induccion',
      'reinduccion',
      'alturas',
      'tractor',
      'pesv',
      'emergencias',
      'primeros_auxilios',
      'epp',
      'quimicos',
      'biomecanico',
      'psicosocial',
      'salud_mental',
      'sst',
      'brigada',
      'copasst',
      'ccl'
    )),
  training_date date NOT NULL,
  hours numeric(6, 2) NOT NULL DEFAULT 0,
  instructor varchar(160) NOT NULL DEFAULT '',
  modality varchar(32) NOT NULL DEFAULT 'presencial'
    CHECK (modality IN ('presencial', 'virtual', 'mixta')),
  evidence_url text NOT NULL DEFAULT '',
  evidence_name varchar(200) NOT NULL DEFAULT '',
  certificate_url text NOT NULL DEFAULT '',
  certificate_name varchar(200) NOT NULL DEFAULT '',
  next_training_date date,
  status varchar(32) NOT NULL DEFAULT 'realizada'
    CHECK (status IN (
      'programada',
      'realizada',
      'proxima',
      'vencida',
      'pendiente'
    )),
  company_snapshot varchar(160) NOT NULL DEFAULT '',
  job_title_snapshot varchar(160) NOT NULL DEFAULT '',
  farm_id uuid REFERENCES campus_sst.sst_farms (id) ON DELETE SET NULL,
  observations text NOT NULL DEFAULT '',
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_trainings_worker_idx
  ON campus_sst.sst_trainings (worker_id, training_date DESC);
CREATE INDEX IF NOT EXISTS sst_trainings_topic_idx
  ON campus_sst.sst_trainings (topic, status);
CREATE INDEX IF NOT EXISTS sst_trainings_next_idx
  ON campus_sst.sst_trainings (next_training_date);

CREATE TABLE IF NOT EXISTS campus_sst.sst_sg_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) NOT NULL UNIQUE,
  title varchar(200) NOT NULL,
  doc_type varchar(40) NOT NULL
    CHECK (doc_type IN (
      'politica_sst',
      'objetivos',
      'plan_anual',
      'matriz_peligros',
      'profesiograma',
      'plan_emergencias',
      'pesv',
      'procedimientos',
      'protocolos',
      'programas',
      'cronogramas',
      'reglamento_higiene',
      'copasst',
      'ccl',
      'brigada'
    )),
  company varchar(160) NOT NULL DEFAULT 'Grupo Manzanares S.A.S.',
  responsible_name varchar(160) NOT NULL DEFAULT '',
  elaborated_at date,
  last_reviewed_at date,
  next_review_at date,
  has_review_cycle boolean NOT NULL DEFAULT true,
  version_label varchar(40) NOT NULL DEFAULT '1.0',
  status varchar(32) NOT NULL DEFAULT 'vigente'
    CHECK (status IN (
      'vigente',
      'en_revision',
      'observado',
      'obsoleto'
    )),
  file_url text NOT NULL DEFAULT '',
  file_name varchar(200) NOT NULL DEFAULT '',
  observations text NOT NULL DEFAULT '',
  compliance_record_id uuid REFERENCES campus_sst.sst_compliance_records (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sst_sg_documents_type_idx
  ON campus_sst.sst_sg_documents (doc_type, status);
CREATE INDEX IF NOT EXISTS sst_sg_documents_review_idx
  ON campus_sst.sst_sg_documents (next_review_at)
  WHERE has_review_cycle AND next_review_at IS NOT NULL;

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
