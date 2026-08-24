-- Permitir respuestas públicas (sin usuario registrado) junto a las asignadas.
ALTER TABLE campus_sst.attendance_responses
  ALTER COLUMN user_id DROP NOT NULL;

-- UNIQUE (form_id, user_id) sigue aplicando solo cuando user_id no es NULL
-- (PostgreSQL permite múltiples filas con user_id NULL).
