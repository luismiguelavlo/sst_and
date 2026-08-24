export const APP_ROLES = ["admin", "user"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  jobTitle: string;
  role: AppRole;
};

export type SessionPayload = SessionUser & {
  expiresAt: string;
};

export type LoginState = {
  error?: string;
};

export type WorkerStats = {
  activeUsers: number;
  createdToday: number;
};

export function isAppRole(value: unknown): value is AppRole {
  return value === "admin" || value === "user";
}

export function homePathForRole(role: AppRole): string {
  return role === "admin" ? "/dashboard" : "/my-courses";
}

export function isAdminOnlyPath(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/invitations") ||
    pathname.startsWith("/assign-courses") ||
    pathname.startsWith("/assign-attendance") ||
    pathname.startsWith("/attendance-forms") ||
    pathname.startsWith("/employees") ||
    pathname.startsWith("/course-catalog/new") ||
    /^\/course-catalog\/[^/]+\/edit\/?$/.test(pathname)
  );
}

export function isWorkerAllowedPath(pathname: string): boolean {
  if (pathname === "/course-catalog" || pathname === "/my-courses") {
    return true;
  }
  if (pathname.startsWith("/course-catalog/")) {
    return (
      !pathname.startsWith("/course-catalog/new") &&
      !/^\/course-catalog\/[^/]+\/edit\/?$/.test(pathname)
    );
  }
  return (
    pathname.startsWith("/courses/") ||
    pathname === "/settings" ||
    pathname.startsWith("/certificates") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/my-attendance")
  );
}
