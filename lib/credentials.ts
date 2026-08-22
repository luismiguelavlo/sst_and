export type CredentialStatus = "active" | "locked" | "pending";

export type UserCredential = {
  id: string;
  name: string;
  email: string;
  cedula: string;
  initials: string;
  status: CredentialStatus;
  passwordHint: string;
};

export type CredentialFilter = "all" | "pending" | "locked";

export const INITIAL_CREDENTIALS: readonly UserCredential[] = [
  {
    id: "1",
    name: "Javier Soto Vargas",
    email: "j.soto@empresa.com",
    cedula: "4-0231-0948",
    initials: "JS",
    status: "active",
    passwordHint: "pass-123",
  },
  {
    id: "2",
    name: "Lucía Morales",
    email: "l.morales@empresa.com",
    cedula: "1-1845-3392",
    initials: "LM",
    status: "locked",
    passwordHint: "pass-456",
  },
  {
    id: "3",
    name: "Carlos Torres",
    email: "c.torres@empresa.com",
    cedula: "3-0492-1104",
    initials: "CT",
    status: "pending",
    passwordHint: "pass-789",
  },
];

export const CREDENTIAL_STATS: { activeUsers: number; createdToday: number } = {
  activeUsers: 1242,
  createdToday: 14,
};

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  const first = parts.at(0)?.at(0) ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.at(0) ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

const PASSWORD_ALPHABET =
  "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generatePassword(length = 8): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => {
    const character = PASSWORD_ALPHABET.at(byte % PASSWORD_ALPHABET.length);
    return character ?? "x";
  }).join("");
}

export function getLoginUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return `${fromEnv}/login`;
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}/login`;
  }
  return "";
}

export function formatCredentialsForClipboard(
  credential: Pick<UserCredential, "name" | "email" | "passwordHint">,
  loginUrl = getLoginUrl(),
): string {
  const lines = ["Campus SST — Acceso"];
  if (loginUrl.length > 0) {
    lines.push(`URL: ${loginUrl}`);
  }
  lines.push(`Nombre: ${credential.name}`, `Correo: ${credential.email}`);
  if (credential.passwordHint.length > 0) {
    lines.push(`Contraseña: ${credential.passwordHint}`);
  }
  return lines.join("\n");
}

export async function copyCredentialsToClipboard(
  credential: Pick<UserCredential, "name" | "email" | "passwordHint">,
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(formatCredentialsForClipboard(credential));
    return true;
  } catch {
    return false;
  }
}
