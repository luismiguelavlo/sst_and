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

ALTER TABLE campus_sst.attendance_forms
  ADD COLUMN IF NOT EXISTS topic_options jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE campus_sst.attendance_forms
SET topic_options = jsonb_build_array(topic)
WHERE (topic_options IS NULL OR topic_options = '[]'::jsonb)
  AND length(trim(topic)) > 0;

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
  submitted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (form_id, user_id)
);

CREATE INDEX IF NOT EXISTS attendance_responses_form_idx
  ON campus_sst.attendance_responses (form_id, submitted_at DESC);

CREATE INDEX IF NOT EXISTS attendance_responses_user_idx
  ON campus_sst.attendance_responses (user_id, submitted_at DESC);

ALTER TABLE campus_sst.notifications DROP CONSTRAINT IF EXISTS notifications_kind_check;
ALTER TABLE campus_sst.notifications
  ADD CONSTRAINT notifications_kind_check
  CHECK (kind IN ('course_assigned', 'custom', 'attendance_form'));
