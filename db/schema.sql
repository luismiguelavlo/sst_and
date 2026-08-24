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
