-- Agenda de trabajo para admins de Campus SST
CREATE TABLE IF NOT EXISTS campus_sst.work_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(200) NOT NULL,
  description text NOT NULL DEFAULT '',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'pendiente'
    CHECK (status IN ('pendiente', 'en_curso', 'hecha', 'cancelada')),
  priority varchar(10) NOT NULL DEFAULT 'media'
    CHECK (priority IN ('baja', 'media', 'alta')),
  category varchar(80) NOT NULL DEFAULT '',
  assignee_id uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at >= starts_at)
);

CREATE INDEX IF NOT EXISTS work_activities_starts_idx
  ON campus_sst.work_activities (starts_at DESC);

CREATE INDEX IF NOT EXISTS work_activities_status_idx
  ON campus_sst.work_activities (status, starts_at DESC);

CREATE INDEX IF NOT EXISTS work_activities_assignee_idx
  ON campus_sst.work_activities (assignee_id, starts_at DESC)
  WHERE assignee_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS work_activities_created_by_idx
  ON campus_sst.work_activities (created_by, starts_at DESC)
  WHERE created_by IS NOT NULL;
