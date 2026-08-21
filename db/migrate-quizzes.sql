-- Amplía course_sections para lecciones tipo quiz (selección múltiple).
ALTER TABLE campus_sst.course_sections
  DROP CONSTRAINT IF EXISTS course_sections_kind_check;

ALTER TABLE campus_sst.course_sections
  ADD CONSTRAINT course_sections_kind_check
  CHECK (kind IN ('video', 'image', 'document', 'quiz'));

ALTER TABLE campus_sst.course_sections
  ADD COLUMN IF NOT EXISTS quiz_data jsonb;
