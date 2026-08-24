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
