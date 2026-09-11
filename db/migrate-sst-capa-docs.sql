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
