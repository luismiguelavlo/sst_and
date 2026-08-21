"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/auth/session";
import { authenticateUser } from "@/lib/auth/users";
import { homePathForRole, type LoginState } from "@/lib/auth/types";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (email.trim().length === 0 || password.length === 0) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { error: "Correo o contraseña incorrectos." };
  }

  await createSession(user);
  redirect(homePathForRole(user.role));
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
