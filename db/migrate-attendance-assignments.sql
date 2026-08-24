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
