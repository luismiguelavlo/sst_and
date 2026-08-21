import "server-only";

import { cookies } from "next/headers";
import { decryptSession, encryptSession, SESSION_COOKIE, sessionExpiryDate } from "@/lib/auth/token";
import type { SessionUser } from "@/lib/auth/types";

export async function createSession(user: SessionUser): Promise<void> {
  const expiresAt = sessionExpiryDate();
  const token = await encryptSession(user, expiresAt);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return decryptSession(token);
}
