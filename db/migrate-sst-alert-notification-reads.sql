-- Lecturas de notificaciones SST generadas desde alertas de cumplimiento
CREATE TABLE IF NOT EXISTS campus_sst.sst_alert_notification_reads (
  user_id uuid NOT NULL REFERENCES campus_sst.users (id) ON DELETE CASCADE,
  record_id uuid NOT NULL REFERENCES campus_sst.sst_compliance_records (id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, record_id)
);

CREATE INDEX IF NOT EXISTS sst_alert_notification_reads_user_idx
  ON campus_sst.sst_alert_notification_reads (user_id, read_at DESC);
