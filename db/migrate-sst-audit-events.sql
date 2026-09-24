-- Historial de trazabilidad SG-SST (quién / cuándo / qué)
CREATE TABLE IF NOT EXISTS campus_sst.sst_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_user_id uuid REFERENCES campus_sst.users (id) ON DELETE SET NULL,
  actor_name varchar(180) NOT NULL,
  action varchar(32) NOT NULL
    CHECK (action IN (
      'create',
      'update',
      'delete',
      'import',
      'retire',
      'close',
      'config'
    )),
  module varchar(48) NOT NULL,
  entity_type varchar(64) NOT NULL DEFAULT '',
  entity_id uuid,
  worker_id uuid REFERENCES campus_sst.sst_workers (id) ON DELETE SET NULL,
  summary text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS sst_audit_events_occurred_idx
  ON campus_sst.sst_audit_events (occurred_at DESC);

CREATE INDEX IF NOT EXISTS sst_audit_events_module_idx
  ON campus_sst.sst_audit_events (module, occurred_at DESC);

CREATE INDEX IF NOT EXISTS sst_audit_events_worker_idx
  ON campus_sst.sst_audit_events (worker_id, occurred_at DESC)
  WHERE worker_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS sst_audit_events_actor_idx
  ON campus_sst.sst_audit_events (actor_user_id, occurred_at DESC)
  WHERE actor_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS sst_audit_events_entity_idx
  ON campus_sst.sst_audit_events (entity_type, entity_id)
  WHERE entity_id IS NOT NULL;
