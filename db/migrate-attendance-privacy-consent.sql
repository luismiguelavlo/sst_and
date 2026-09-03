-- Registro de consentimiento de tratamiento de datos en respuestas de asistencia
ALTER TABLE campus_sst.attendance_responses
  ADD COLUMN IF NOT EXISTS data_processing_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS data_processing_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS data_processing_policy_version varchar(32);

COMMENT ON COLUMN campus_sst.attendance_responses.data_processing_consent IS
  'Indica si el titular aceptó el tratamiento de datos personales al enviar.';
COMMENT ON COLUMN campus_sst.attendance_responses.data_processing_consent_at IS
  'Fecha y hora en que se registró la aceptación.';
COMMENT ON COLUMN campus_sst.attendance_responses.data_processing_policy_version IS
  'Versión de la política de datos aceptada (ej. 1.0).';
