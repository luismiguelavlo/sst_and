export enum SstCategory {
  Alturas = "alturas",
  Electrico = "electrico",
  Emergencias = "emergencias",
  Quimicos = "quimicos",
  Epp = "epp",
  CulturaPreventiva = "cultura_preventiva",
  Ergonomia = "ergonomia",
}

export enum SstLevel {
  Basico = "basico",
  Intermedio = "intermedio",
  Avanzado = "avanzado",
}

export enum CourseSectionKind {
  Video = "video",
  UploadedVideo = "uploaded_video",
  Image = "image",
  Document = "document",
  Quiz = "quiz",
}

export const SST_CATEGORY_OPTIONS: readonly { value: SstCategory; label: string }[] = [
  { value: SstCategory.Alturas, label: "Trabajo en alturas" },
  { value: SstCategory.Electrico, label: "Riesgo eléctrico" },
  { value: SstCategory.Emergencias, label: "Emergencias y brigadas" },
  { value: SstCategory.Quimicos, label: "Sustancias químicas (SGA)" },
  { value: SstCategory.Epp, label: "EPP" },
  { value: SstCategory.CulturaPreventiva, label: "Cultura preventiva" },
  { value: SstCategory.Ergonomia, label: "Ergonomía" },
];

export const SST_LEVEL_OPTIONS: readonly { value: SstLevel; label: string }[] = [
  { value: SstLevel.Basico, label: "Básico" },
  { value: SstLevel.Intermedio, label: "Intermedio" },
  { value: SstLevel.Avanzado, label: "Avanzado" },
];

export function isSstCategory(value: string): value is SstCategory {
  return Object.values(SstCategory).includes(value as SstCategory);
}

export function isSstLevel(value: string): value is SstLevel {
  return Object.values(SstLevel).includes(value as SstLevel);
}

export function isCourseSectionKind(value: string): value is CourseSectionKind {
  return Object.values(CourseSectionKind).includes(value as CourseSectionKind);
}

export function sstCategoryLabel(value: SstCategory): string {
  return SST_CATEGORY_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

export function sstLevelLabel(value: SstLevel): string {
  return SST_LEVEL_OPTIONS.find((item) => item.value === value)?.label ?? value;
}
