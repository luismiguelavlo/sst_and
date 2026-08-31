import "server-only";

import { getSql } from "@/lib/db";
import { hashPassword, validateNewPassword, verifyPassword } from "@/lib/auth/password";
import { isAppRole, type AppRole, type SessionUser, type WorkerStats } from "@/lib/auth/types";
import { DEFAULT_PROFILE_PHOTO, type AccountProfile, type InterfaceLanguage } from "@/lib/account";
import { initialsFromName, type CredentialStatus, type UserCredential } from "@/lib/credentials";

export type UserStatus = CredentialStatus;

export type DbUser = {
  id: string;
  email: string;
  password_hash: string;
  password_salt: string;
  name: string;
  job_title: string;
  role: AppRole;
  bio: string | null;
  photo_url: string | null;
  email_notifications: boolean;
  weekly_digest: boolean;
  language: string;
  two_factor_enabled: boolean;
  cedula: string | null;
  status: UserStatus;
  created_at: Date;
};

const WORKER_BIO =
  "Participo en la formación SST de la planta: EPP, procedimientos seguros y reporte de condiciones inseguras.";

export async function authenticateUser(email: string, password: string): Promise<SessionUser | null> {
  const row = await findUserByEmail(email);
  if (!row || row.status === "locked") {
    return null;
  }
  if (!verifyPassword(password, row.password_salt, row.password_hash)) {
    return null;
  }
  return toSessionUser(row);
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const sql = getSql();
  const rows = await sql<DbUser[]>`
    SELECT
      id::text,
      email,
      password_hash,
      password_salt,
      name,
      job_title,
      role,
      bio,
      photo_url,
      email_notifications,
      weekly_digest,
      language,
      two_factor_enabled,
      cedula,
      status,
      created_at
    FROM campus_sst.users
    WHERE lower(email) = ${email.trim().toLowerCase()}
    LIMIT 1
  `;
  const row = rows[0];
  return row && isAppRole(row.role) ? row : null;
}

export async function findUserById(id: string): Promise<DbUser | null> {
  const sql = getSql();
  const rows = await sql<DbUser[]>`
    SELECT
      id::text,
      email,
      password_hash,
      password_salt,
      name,
      job_title,
      role,
      bio,
      photo_url,
      email_notifications,
      weekly_digest,
      language,
      two_factor_enabled,
      cedula,
      status,
      created_at
    FROM campus_sst.users
    WHERE id = ${id}::uuid
    LIMIT 1
  `;
  const row = rows[0];
  return row && isAppRole(row.role) ? row : null;
}

export async function listWorkerCredentials(): Promise<UserCredential[]> {
  const sql = getSql();
  const rows = await sql<DbUser[]>`
    SELECT
      id::text,
      email,
      password_hash,
      password_salt,
      name,
      job_title,
      role,
      bio,
      photo_url,
      email_notifications,
      weekly_digest,
      language,
      two_factor_enabled,
      cedula,
      status,
      created_at
    FROM campus_sst.users
    WHERE role = 'user'
    ORDER BY created_at DESC
  `;
  return rows.map(toCredential);
}

export async function getWorkerStats(): Promise<WorkerStats> {
  const sql = getSql();
  const rows = await sql<[{ active_users: number; created_today: number }]>`
    SELECT
      count(*) FILTER (WHERE role = 'user' AND status = 'active')::int AS active_users,
      count(*) FILTER (WHERE role = 'user' AND created_at::date = CURRENT_DATE)::int AS created_today
    FROM campus_sst.users
  `;
  return {
    activeUsers: rows[0]?.active_users ?? 0,
    createdToday: rows[0]?.created_today ?? 0,
  };
}

export async function createWorkerUser(input: {
  name: string;
  email: string;
  cedula: string;
  password: string;
  status: UserStatus;
  jobTitle?: string;
}): Promise<UserCredential> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("Ya existe un usuario con ese correo.");
  }
  const { hash, salt } = hashPassword(input.password);
  const sql = getSql();
  const rows = await sql<DbUser[]>`
    INSERT INTO campus_sst.users (
      email, password_hash, password_salt, name, job_title, role, bio, photo_url,
      cedula, status
    )
    VALUES (
      ${input.email.trim().toLowerCase()},
      ${hash},
      ${salt},
      ${input.name.trim()},
      ${input.jobTitle?.trim() || "Empleado"},
      ${"user"},
      ${WORKER_BIO},
      ${DEFAULT_PROFILE_PHOTO},
      ${input.cedula.trim()},
      ${input.status}
    )
    RETURNING
      id::text,
      email,
      password_hash,
      password_salt,
      name,
      job_title,
      role,
      bio,
      photo_url,
      email_notifications,
      weekly_digest,
      language,
      two_factor_enabled,
      cedula,
      status,
      created_at
  `;
  const row = rows[0];
  if (!row) {
    throw new Error("No se pudo crear el usuario.");
  }
  return { ...toCredential(row), passwordHint: input.password };
}

export async function setWorkerStatus(id: string, status: UserStatus): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE campus_sst.users
    SET status = ${status}, updated_at = now()
    WHERE id = ${id}::uuid AND role = 'user'
  `;
}

export async function resetWorkerPassword(id: string, password: string): Promise<void> {
  const { hash, salt } = hashPassword(password);
  const sql = getSql();
  await sql`
    UPDATE campus_sst.users
    SET password_hash = ${hash}, password_salt = ${salt}, updated_at = now()
    WHERE id = ${id}::uuid AND role = 'user'
  `;
}

export async function deleteWorkerUser(id: string): Promise<void> {
  const sql = getSql();
  await sql`
    DELETE FROM campus_sst.users
    WHERE id = ${id}::uuid AND role = 'user'
  `;
}

export async function updateUserAccount(
  id: string,
  input: {
    name: string;
    jobTitle: string;
    bio: string;
    photoUrl: string;
    emailNotifications: boolean;
    weeklyDigest: boolean;
    language: InterfaceLanguage;
    twoFactorEnabled: boolean;
  },
): Promise<SessionUser> {
  const current = await findUserById(id);
  if (!current) {
    throw new Error("No se encontró el usuario.");
  }

  const name = input.name.trim();
  if (name.length < 3) {
    throw new Error("El nombre debe tener al menos 3 caracteres.");
  }
  const jobTitle = input.jobTitle.trim();
  if (jobTitle.length === 0) {
    throw new Error("El cargo es obligatorio.");
  }
  if (!isInterfaceLanguage(input.language)) {
    throw new Error("Selecciona un idioma válido.");
  }
  const photoUrl =
    input.photoUrl.startsWith("blob:") || input.photoUrl.startsWith("data:")
      ? (current.photo_url ?? DEFAULT_PROFILE_PHOTO)
      : input.photoUrl;

  const sql = getSql();
  await sql`
    UPDATE campus_sst.users
    SET
      name = ${name},
      job_title = ${jobTitle},
      bio = ${input.bio.trim()},
      photo_url = ${photoUrl},
      email_notifications = ${input.emailNotifications},
      weekly_digest = ${input.weeklyDigest},
      language = ${input.language},
      two_factor_enabled = ${input.twoFactorEnabled},
      updated_at = now()
    WHERE id = ${id}::uuid
  `;

  return requireSessionUser(id);
}

export async function changeUserPassword(
  id: string,
  currentPassword: string,
  newPassword: string,
): Promise<SessionUser> {
  const current = await findUserById(id);
  if (!current) {
    throw new Error("No se encontró el usuario.");
  }
  const passwordError = validateNewPassword(newPassword);
  if (passwordError) {
    throw new Error(passwordError);
  }
  if (!verifyPassword(currentPassword, current.password_salt, current.password_hash)) {
    throw new Error("La contraseña actual no es correcta.");
  }
  if (verifyPassword(newPassword, current.password_salt, current.password_hash)) {
    throw new Error("La nueva contraseña debe ser distinta a la actual.");
  }

  const { hash, salt } = hashPassword(newPassword);
  const sql = getSql();
  await sql`
    UPDATE campus_sst.users
    SET password_hash = ${hash}, password_salt = ${salt}, updated_at = now()
    WHERE id = ${id}::uuid
  `;

  return requireSessionUser(id);
}

async function requireSessionUser(id: string): Promise<SessionUser> {
  const updated = await findUserById(id);
  if (!updated) {
    throw new Error("No se pudo actualizar el usuario.");
  }
  return toSessionUser(updated);
}

export function profileFromDbUser(user: DbUser): AccountProfile {
  return {
    fullName: user.name,
    email: user.email,
    role: user.job_title,
    bio: user.bio ?? "",
    photoUrl: user.photo_url ?? DEFAULT_PROFILE_PHOTO,
    emailNotifications: user.email_notifications,
    weeklyDigest: user.weekly_digest,
    language: isInterfaceLanguage(user.language) ? user.language : "es",
    twoFactorEnabled: user.two_factor_enabled,
    memberSinceLabel: formatMemberSince(user.created_at),
    accountStatusLabel: statusLabel(user.status),
  };
}

function formatMemberSince(date: Date): string {
  return new Intl.DateTimeFormat("es", { month: "short", year: "numeric" }).format(date);
}

function statusLabel(status: UserStatus): string {
  if (status === "locked") {
    return "Bloqueada";
  }
  if (status === "pending") {
    return "Pendiente";
  }
  return "Activa";
}

function isInterfaceLanguage(value: string): value is InterfaceLanguage {
  return value === "es" || value === "en-US" || value === "en-GB" || value === "fr";
}

function toSessionUser(user: DbUser): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    jobTitle: user.job_title,
    role: user.role,
  };
}

function toCredential(user: DbUser): UserCredential {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    cedula: user.cedula ?? "",
    initials: initialsFromName(user.name),
    status: user.status,
    passwordHint: "",
  };
}
