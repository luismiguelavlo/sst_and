"use server";

import { revalidatePath } from "next/cache";
import { createSession } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/guards";
import { changeUserPassword, updateUserAccount } from "@/lib/auth/users";
import { uploadProfilePhotoFile } from "@/lib/cloudinary";
import { validateNewPassword } from "@/lib/auth/password";
import type { InterfaceLanguage } from "@/lib/account";

export type AccountActionResult = { ok: true } | { ok: false; error: string };

export type PhotoUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function uploadProfilePhoto(formData: FormData): Promise<PhotoUploadResult> {
  await requireAuth();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Selecciona una imagen." };
  }
  try {
    const uploaded = await uploadProfilePhotoFile(file);
    return { ok: true, url: uploaded.url };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo subir la foto.",
    };
  }
}

export async function updateProfile(input: {
  fullName: string;
  jobTitle: string;
  bio: string;
  photoUrl: string;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  language: InterfaceLanguage;
  twoFactorEnabled: boolean;
}): Promise<AccountActionResult> {
  const session = await requireAuth();
  try {
    const updated = await updateUserAccount(session.id, {
      name: input.fullName,
      jobTitle: input.jobTitle,
      bio: input.bio,
      photoUrl: input.photoUrl,
      emailNotifications: input.emailNotifications,
      weeklyDigest: input.weeklyDigest,
      language: input.language,
      twoFactorEnabled: input.twoFactorEnabled,
    });
    await createSession(updated);
    revalidatePath("/settings");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo guardar el perfil.",
    };
  }
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<AccountActionResult> {
  const session = await requireAuth();
  if (input.currentPassword.length === 0) {
    return { ok: false, error: "Ingresa tu contraseña actual." };
  }
  const passwordError = validateNewPassword(input.newPassword);
  if (passwordError) {
    return { ok: false, error: passwordError };
  }
  if (input.newPassword !== input.confirmPassword) {
    return { ok: false, error: "Las contraseñas nuevas no coinciden." };
  }

  try {
    const updated = await changeUserPassword(session.id, input.currentPassword, input.newPassword);
    await createSession(updated);
    revalidatePath("/settings");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo cambiar la contraseña.",
    };
  }
}
