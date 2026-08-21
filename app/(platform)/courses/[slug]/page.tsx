import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetail } from "@/components/courses/CourseDetail";
import { requireAuth } from "@/lib/auth/guards";
import { getCourseOverview } from "@/lib/courses/load-module";
import type { DiscussionThread } from "@/lib/discussions";
import { listCourseDiscussions } from "@/lib/discussions/repository";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseOverview(slug, { includeDrafts: true });
  if (!course) {
    return { title: "Curso · Campus SST" };
  }
  return {
    title: `${course.title} · Campus SST`,
    description: course.description || `Formación SST: ${course.title}.`,
  };
}

export default async function CourseDetailPage({ params }: Readonly<CourseDetailPageProps>) {
  const [{ slug }, user] = await Promise.all([params, requireAuth()]);
  const isAdmin = user.role === "admin";
  const course = await getCourseOverview(slug, {
    includeDrafts: isAdmin,
    viewerUserId: isAdmin ? undefined : user.id,
  });
  if (!course) {
    notFound();
  }

  let discussions: DiscussionThread[] = [];
  if (course.enableDiscussions && course.courseId) {
    try {
      discussions = await listCourseDiscussions(course.courseId, {
        id: user.id,
        role: user.role,
      });
    } catch {
      discussions = [];
    }
  }

  return (
    <CourseDetail course={course} canManage={isAdmin} discussions={discussions} />
  );
}
