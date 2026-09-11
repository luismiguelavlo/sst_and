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
