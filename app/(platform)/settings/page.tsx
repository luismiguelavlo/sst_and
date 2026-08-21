import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/guards";
import { findUserById, profileFromDbUser } from "@/lib/auth/users";
import { profileFromSession } from "@/lib/account";
import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";

export const metadata: Metadata = {
  title: "Ajustes de cuenta · Campus SST",
  description: "Administra tu perfil SST y la seguridad de tu cuenta en Campus SST.",
};

export default async function SettingsPage() {
  const session = await requireAuth();
  const dbUser = await findUserById(session.id);
  const initialProfile = dbUser ? profileFromDbUser(dbUser) : profileFromSession(session);
  return <AccountSettingsForm initialProfile={initialProfile} />;
}
