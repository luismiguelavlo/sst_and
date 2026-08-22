"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useToast } from "@/components/ui/ToastProvider";
import {
  changePassword,
  updateProfile,
  uploadProfilePhoto,
} from "@/lib/auth/account-actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password";
import type { AccountProfile } from "@/lib/account";

type SaveStatus = "idle" | "saving" | "saved";

export function AccountSettingsForm({
  initialProfile,
}: Readonly<{ initialProfile: AccountProfile }>) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<AccountProfile>(initialProfile);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileStatus, setProfileStatus] = useState<SaveStatus>("idle");
  const [passwordStatus, setPasswordStatus] = useState<SaveStatus>("idle");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { showToast } = useToast();

  const isBusy = profileStatus === "saving" || passwordStatus === "saving" || uploadingPhoto;

  function patchProfile<K extends keyof AccountProfile>(key: K, value: AccountProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  async function handlePhotoChange(file: File | undefined) {
    if (!file) {
      return;
    }
    setUploadingPhoto(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadProfilePhoto(formData);
    setUploadingPhoto(false);
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      return;
    }
    patchProfile("photoUrl", result.url);
    const persist = await updateProfile({
      fullName: profile.fullName,
      jobTitle: profile.role,
      bio: profile.bio,
      photoUrl: result.url,
      emailNotifications: profile.emailNotifications,
      weeklyDigest: profile.weeklyDigest,
      language: profile.language,
      twoFactorEnabled: profile.twoFactorEnabled,
    });
    if (!persist.ok) {
      showToast(persist.error, { variant: "error" });
      return;
    }
    showToast("Foto de perfil actualizada.");
    router.refresh();
  }

  function resetForm() {
    setProfile(initialProfile);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setProfileStatus("idle");
    setPasswordStatus("idle");
  }

  async function saveProfile() {
    setProfileStatus("saving");
    const result = await updateProfile({
      fullName: profile.fullName,
      jobTitle: profile.role,
      bio: profile.bio,
      photoUrl: profile.photoUrl,
      emailNotifications: profile.emailNotifications,
      weeklyDigest: profile.weeklyDigest,
      language: profile.language,
      twoFactorEnabled: profile.twoFactorEnabled,
    });
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      setProfileStatus("idle");
      return;
    }
    setProfileStatus("saved");
    showToast("Perfil actualizado correctamente.");
    router.refresh();
    window.setTimeout(() => setProfileStatus("idle"), 1800);
  }

  async function savePassword() {
    setPasswordStatus("saving");
    const result = await changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!result.ok) {
      showToast(result.error, { variant: "error" });
      setPasswordStatus("idle");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStatus("saved");
    showToast("Contraseña actualizada correctamente.");
    window.setTimeout(() => setPasswordStatus("idle"), 1800);
  }

  return (
    <div className="mx-auto flex w-full max-w-container-max flex-col">
      <div className="mb-lg pt-md">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Ajustes de la cuenta</h1>
        <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
          Actualiza tu perfil SST y cambia tu contraseña de acceso.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-md lg:grid-cols-12">
        <div className="flex flex-col gap-md lg:col-span-4">
          <div className="flex flex-col items-center rounded-xl bg-surface-container-lowest p-md text-center shadow-sm">
            <button
              className="group relative mb-md cursor-pointer"
              type="button"
              disabled={isBusy}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Cambiar foto de perfil"
            >
              <div className="h-32 w-32 overflow-hidden rounded-full bg-surface-container-low shadow-sm">
                <Image
                  src={profile.photoUrl}
                  alt={`Foto de ${profile.fullName}`}
                  width={128}
                  height={128}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-on-surface/50 opacity-0 transition-opacity group-hover:opacity-100">
                <MaterialIcon name="photo_camera" className="font-headline-md text-on-primary" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={isBusy}
              onChange={(event) => {
                void handlePhotoChange(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            <h2 className="font-headline-md text-headline-md text-on-surface">{profile.fullName}</h2>
            <p className="mb-md font-body-sm text-body-sm text-on-surface-variant">{profile.role}</p>
            <button
              className="flex w-full items-center justify-center gap-xs rounded-lg bg-secondary-container px-md py-sm font-label-md text-label-md text-on-secondary-container transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-70"
              type="button"
              disabled={isBusy}
              onClick={() => fileInputRef.current?.click()}
            >
              <MaterialIcon name="upload" className="text-[18px]" />
              {uploadingPhoto ? "Subiendo..." : "Subir foto"}
            </button>
            <p className="mt-sm font-body-sm text-on-surface-variant">JPG, PNG, WEBP o GIF · máx. 8 MB</p>
          </div>
          <div className="flex flex-col gap-sm rounded-xl bg-surface-container-lowest p-md shadow-sm">
            <div className="flex items-center gap-sm text-on-surface-variant">
              <MaterialIcon name="verified_user" className="text-[20px]" />
              <span className="font-label-md text-label-md">
                Estado de la cuenta: {profile.accountStatusLabel}
              </span>
            </div>
            <div className="flex items-center gap-sm text-on-surface-variant">
              <MaterialIcon name="calendar_today" className="text-[20px]" />
              <span className="font-label-md text-label-md">Miembro desde: {profile.memberSinceLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-md lg:col-span-8">
          <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm lg:p-lg">
            <h3 className="mb-md font-headline-md text-headline-md text-on-surface">Datos personales</h3>
            <div className="grid grid-cols-1 gap-md md:grid-cols-2">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="full-name">
                  Nombre completo <span className="text-error">*</span>
                </label>
                <input
                  id="full-name"
                  className="rounded-lg bg-surface px-sm py-sm font-body-md text-body-md text-on-surface ring-1 ring-outline-variant outline-none transition-shadow focus:ring-2 focus:ring-primary"
                  type="text"
                  disabled={isBusy}
                  value={profile.fullName}
                  onChange={(event) => patchProfile("fullName", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="email">
                  Correo corporativo
                </label>
                <input
                  id="email"
                  className="cursor-not-allowed rounded-lg bg-surface-container-low px-sm py-sm font-body-md text-body-md text-on-surface-variant outline-none"
                  readOnly
                  type="email"
                  value={profile.email}
                />
                <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
                  Contacta a SST o TI para cambiar el correo corporativo.
                </p>
              </div>
              <div className="flex flex-col gap-xs md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="role">
                  Cargo / rol SST
                </label>
                <input
                  id="role"
                  className="rounded-lg bg-surface px-sm py-sm font-body-md text-body-md text-on-surface ring-1 ring-outline-variant outline-none transition-shadow focus:ring-2 focus:ring-primary"
                  type="text"
                  disabled={isBusy}
                  value={profile.role}
                  onChange={(event) => patchProfile("role", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-xs md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="bio">
                  Biografía profesional
                </label>
                <textarea
                  id="bio"
                  className="resize-none rounded-lg bg-surface px-sm py-sm font-body-md text-body-md text-on-surface ring-1 ring-outline-variant outline-none transition-shadow focus:ring-2 focus:ring-primary"
                  rows={4}
                  disabled={isBusy}
                  value={profile.bio}
                  onChange={(event) => patchProfile("bio", event.target.value)}
                />
              </div>
            </div>
            <div className="mt-md flex items-center justify-end gap-md">
              <button
                className="px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
                type="button"
                disabled={isBusy}
                onClick={resetForm}
              >
                Cancelar
              </button>
              <button
                className="rounded-lg bg-primary px-lg py-sm font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-primary/90 disabled:opacity-70"
                type="button"
                disabled={isBusy}
                onClick={() => {
                  void saveProfile();
                }}
              >
                {profileSaveLabel(profileStatus)}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-md shadow-sm lg:p-lg">
            <h3 className="mb-xs font-headline-md text-headline-md text-on-surface">Cambiar contraseña</h3>
            <p className="mb-md font-body-sm text-on-surface-variant">
              Mínimo {MIN_PASSWORD_LENGTH} caracteres. Debes confirmar la contraseña actual.
            </p>
            <div className="grid grid-cols-1 gap-md md:grid-cols-2">
              <div className="flex flex-col gap-xs md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="current-password">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    className="w-full rounded-lg bg-surface px-sm py-sm pr-12 font-body-md text-body-md text-on-surface ring-1 ring-outline-variant outline-none transition-shadow focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                    type={showCurrent ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isBusy}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                  />
                  <button
                    className="absolute top-1/2 right-sm -translate-y-1/2 text-outline"
                    type="button"
                    aria-label={showCurrent ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setShowCurrent((value) => !value)}
                  >
                    <MaterialIcon name={showCurrent ? "visibility_off" : "visibility"} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="new-password">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    className="w-full rounded-lg bg-surface px-sm py-sm pr-12 font-body-md text-body-md text-on-surface ring-1 ring-outline-variant outline-none transition-shadow focus:ring-2 focus:ring-primary"
                    type={showNew ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isBusy}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                  <button
                    className="absolute top-1/2 right-sm -translate-y-1/2 text-outline"
                    type="button"
                    aria-label={showNew ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setShowNew((value) => !value)}
                  >
                    <MaterialIcon name={showNew ? "visibility_off" : "visibility"} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="confirm-password">
                  Confirmar nueva contraseña
                </label>
                <input
                  id="confirm-password"
                  className="rounded-lg bg-surface px-sm py-sm font-body-md text-body-md text-on-surface ring-1 ring-outline-variant outline-none transition-shadow focus:ring-2 focus:ring-primary"
                  type="password"
                  autoComplete="new-password"
                  disabled={isBusy}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
            </div>
            <div className="mt-md flex justify-end">
              <button
                className="rounded-lg bg-primary px-lg py-sm font-label-md text-label-md text-on-primary shadow-sm transition-all hover:bg-primary/90 disabled:opacity-70"
                type="button"
                disabled={isBusy}
                onClick={() => {
                  void savePassword();
                }}
              >
                {passwordSaveLabel(passwordStatus)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function profileSaveLabel(status: SaveStatus): string {
  if (status === "saving") {
    return "Guardando...";
  }
  if (status === "saved") {
    return "Perfil actualizado";
  }
  return "Guardar perfil";
}

function passwordSaveLabel(status: SaveStatus): string {
  if (status === "saving") {
    return "Actualizando...";
  }
  if (status === "saved") {
    return "Contraseña actualizada";
  }
  return "Cambiar contraseña";
}
