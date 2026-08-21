import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { isAppRole, type SessionPayload, type SessionUser } from "@/lib/auth/types";

export const SESSION_COOKIE = "campus_sst_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function encodedSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET debe estar definido (mínimo 16 caracteres).");
  }
  return new TextEncoder().encode(secret);
}

export function sessionExpiryDate(): Date {
  return new Date(Date.now() + SESSION_DURATION_MS);
}

export async function encryptSession(user: SessionUser, expiresAt: Date): Promise<string> {
  const payload: SessionPayload = {
    ...user,
    expiresAt: expiresAt.toISOString(),
  };
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .setSubject(user.id)
    .sign(encodedSecret());
}

export async function decryptSession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, encodedSecret(), {
      algorithms: ["HS256"],
    });
    return sessionUserFromPayload(payload);
  } catch {
    return null;
  }
}

function sessionUserFromPayload(payload: JWTPayload): SessionUser | null {
  const { id, email, name, jobTitle, role } = payload;
  if (
    typeof id !== "string" ||
    typeof email !== "string" ||
    typeof name !== "string" ||
    typeof jobTitle !== "string" ||
    !isAppRole(role)
  ) {
    return null;
  }
  return { id, email, name, jobTitle, role };
}
