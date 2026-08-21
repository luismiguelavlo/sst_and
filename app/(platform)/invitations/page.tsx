import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { getWorkerStats, listWorkerCredentials } from "@/lib/auth/users";
import { CredentialsScreen } from "@/components/credentials/CredentialsScreen";

export const metadata: Metadata = {
  title: "Accesos · Campus SST",
  description: "Crea y administra credenciales de acceso para el personal.",
};

export default async function InvitationsPage() {
  await requireAdmin();
  const [credentials, stats] = await Promise.all([listWorkerCredentials(), getWorkerStats()]);
  return <CredentialsScreen initialCredentials={credentials} stats={stats} />;
}
