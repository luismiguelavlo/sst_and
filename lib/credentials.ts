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
