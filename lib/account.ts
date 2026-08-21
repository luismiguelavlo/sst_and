import type { SessionUser } from "@/lib/auth/types";

export const DEFAULT_PROFILE_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDxfbHJWFDefEFBAGSVz5N8JJ7QenI8U1Mb0gCalFGohLfzRyZvV9-BcstW2WDfs0z2EDDUdQsLwMXpFPWS-gPpweIcuvOByR0v1nRsqqb-Noe6Dlex2E4RNcdtmnXEGn2As7pAAXEd0-cip6-NwzFJBvEjPhGk0EVyY5NkAY1BDcFqjtKaGDwhGZaTg8QayNp5FjqAtA5s0YbzM5kUtivb3jvNlnlRdjyhjifwlplMdAkftiWoHviY";

export type InterfaceLanguage = "es" | "en-US" | "en-GB" | "fr";

export type AccountProfile = {
  fullName: string;
  email: string;
  role: string;
  bio: string;
  photoUrl: string;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  language: InterfaceLanguage;
  twoFactorEnabled: boolean;
  memberSinceLabel: string;
  accountStatusLabel: string;
};

export const INITIAL_ACCOUNT_PROFILE: AccountProfile = {
  fullName: "Elena Vargas",
  email: "e.vargas@empresa.com",
  role: "Coordinadora SST",
  bio: "Lidero la formación en seguridad y salud en el trabajo: inducción, trabajo en alturas, riesgo eléctrico y cultura preventiva para todo el personal operativo.",
  photoUrl: DEFAULT_PROFILE_PHOTO,
  emailNotifications: true,
  weeklyDigest: false,
  language: "es",
  twoFactorEnabled: false,
  memberSinceLabel: "—",
  accountStatusLabel: "Activa",
};

export const INTERFACE_LANGUAGES: readonly { value: InterfaceLanguage; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en-US", label: "Inglés (Estados Unidos)" },
  { value: "en-GB", label: "Inglés (Reino Unido)" },
  { value: "fr", label: "Francés" },
];

export function profileFromSession(user: SessionUser): AccountProfile {
  const workerBio =
    "Participo en la formación SST de la planta: EPP, procedimientos seguros y reporte de condiciones inseguras.";
  return {
    ...INITIAL_ACCOUNT_PROFILE,
    fullName: user.name,
    email: user.email,
    role: user.jobTitle,
    bio: user.role === "admin" ? INITIAL_ACCOUNT_PROFILE.bio : workerBio,
    memberSinceLabel: INITIAL_ACCOUNT_PROFILE.memberSinceLabel,
    accountStatusLabel: INITIAL_ACCOUNT_PROFILE.accountStatusLabel,
  };
}
