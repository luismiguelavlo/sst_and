import { SST_CATEGORY_OPTIONS, type SstCategory } from "@/lib/sst";

export type CertificateListItem = {
  id: string;
  code: string;
  hours: number;
  title: string;
  completedOn: string;
  year: string;
  category: SstCategory;
  categoryLabel: string;
  courseSlug: string;
  imageUrl: string;
  imageAlt: string;
};

export type CertificateDocument = {
  id: string;
  code: string;
  hours: number;
  issuedAt: Date;
  issuedOnLabel: string;
  recipientName: string;
  recipientJobTitle: string;
  courseTitle: string;
  courseSlug: string;
  categoryLabel: string;
  levelLabel: string;
};

export const CERTIFICATE_FALLBACK_COVER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAv-fQJ7vcfgqu3LwFkbBlAZv0tXuQCIilb8DYMIfnuLjcwSLLeP4eQv3BHrPuPXzJqb1wI6J1C7sVwx-6AisNOJ0JLVsAWdPi6QjYjF1eUbFafspt7ZFxHCtf-8sZHI1JAwt_mEb2_RfB8mleWOzcye282ObZYkSU-Cgiw_KsSq2hL_c7eT1YR9A1o0IGy3UyxhKM9icu_L_C9_5cLyMgNUG5oO5nmMqWXTmRUq2BxeOBPQVjGEoWE";

export function certificateCategoryOptions(
  certificates: readonly CertificateListItem[],
): readonly { value: SstCategory; label: string }[] {
  const present = new Set(certificates.map((item) => item.category));
  return SST_CATEGORY_OPTIONS.filter((option) => present.has(option.value));
}

export function certificateYearOptions(
  certificates: readonly CertificateListItem[],
): readonly string[] {
  return [...new Set(certificates.map((item) => item.year))].sort((a, b) => b.localeCompare(a));
}
