import type { EmployeeAvatar } from "@/lib/employee-progress";
import type { MyCourseStatus } from "@/lib/my-courses";
import type { CredentialStatus } from "@/lib/credentials";
import type { CertificateListItem } from "@/lib/certificates";

export type EmployeeProfileSummary = {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  cedula: string | null;
  status: CredentialStatus;
  bio: string;
  photoUrl: string | null;
  createdAtLabel: string;
  avatar: EmployeeAvatar;
};

export type EmployeeLessonProgress = {
  id: string;
  title: string;
  kindLabel: string;
  kindIcon: string;
  completed: boolean;
  completedAtLabel: string | null;
};

export type EmployeeCourseProgress = {
  id: string;
  slug: string;
  title: string;
  categoryLabel: string;
  levelLabel: string;
  coverUrl: string;
  coverAlt: string;
  status: MyCourseStatus;
  progressPercent: number;
  lessonsLabel: string;
  deadlineLabel: string;
  assignedLabel: string | null;
  message: string | null;
  certificateId: string | null;
  lessons: readonly EmployeeLessonProgress[];
};

export type EmployeeDossier = {
  profile: EmployeeProfileSummary;
  courses: readonly EmployeeCourseProgress[];
  certificates: readonly CertificateListItem[];
};
