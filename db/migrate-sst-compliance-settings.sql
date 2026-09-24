-- Umbrales del semáforo de cumplimiento SG-SST (dashboard)
CREATE TABLE IF NOT EXISTS campus_sst.sst_compliance_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  green_min_pct numeric(5, 2) NOT NULL DEFAULT 90
    CHECK (green_min_pct > 0 AND green_min_pct <= 100),
  yellow_min_pct numeric(5, 2) NOT NULL DEFAULT 75
    CHECK (yellow_min_pct >= 0 AND yellow_min_pct < green_min_pct),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL
);

INSERT INTO campus_sst.sst_compliance_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
