import "server-only";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { homePathForRole, type SessionUser } from "@/lib/auth/types";

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role !== "admin") {
    redirect(homePathForRole(session.role));
  }
  return session;
}
