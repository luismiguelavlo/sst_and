-- Lecciones con video subido a Cloudinary (distinto de YouTube).
ALTER TABLE campus_sst.course_sections
  DROP CONSTRAINT IF EXISTS course_sections_kind_check;

ALTER TABLE campus_sst.course_sections
  ADD CONSTRAINT course_sections_kind_check
  CHECK (kind IN ('video', 'uploaded_video', 'image', 'document', 'quiz'));
