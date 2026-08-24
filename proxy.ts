import { NextResponse, type NextRequest } from "next/server";
import { decryptSession, SESSION_COOKIE } from "@/lib/auth/token";
import {
  homePathForRole,
  isAdminOnlyPath,
  isPublicPath,
  isWorkerAllowedPath,
} from "@/lib/auth/types";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decryptSession(token);
  const isLogin = pathname === "/login";
  const isPublic = isPublicPath(pathname);

  if (!session && !isLogin && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isLogin) {
    return NextResponse.redirect(new URL(homePathForRole(session.role), request.url));
  }

  if (session && pathname === "/") {
    return NextResponse.redirect(new URL(homePathForRole(session.role), request.url));
  }

  if (session && isAdminOnlyPath(pathname) && session.role !== "admin") {
    return NextResponse.redirect(new URL(homePathForRole(session.role), request.url));
  }

  if (
    session &&
    session.role === "user" &&
    pathname !== "/" &&
    !isLogin &&
    !isPublic &&
    !isWorkerAllowedPath(pathname)
  ) {
    return NextResponse.redirect(new URL(homePathForRole(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
