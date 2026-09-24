import type { Metadata } from "next";
import { AgendaScreen } from "@/components/agenda/AgendaScreen";
import { requireAdmin } from "@/lib/auth/guards";
import { listActivities, listAdminUsers } from "@/lib/agenda/repository";
import type { AdminUserOption, WorkActivity } from "@/lib/agenda/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agenda de trabajo · Campus SST",
  description: "Organiza y registra las actividades de trabajo del equipo SST.",
};

export default async function AgendaPage() {
  const session = await requireAdmin();

  let activities: WorkActivity[] = [];
  let adminUsers: AdminUserOption[] = [];
  try {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
    const [acts, admins] = await Promise.all([
      listActivities({ from, to }),
      listAdminUsers(),
    ]);
    activities = acts;
    adminUsers = admins;
  } catch {
    activities = [];
    adminUsers = [];
  }

  return (
    <AgendaScreen
      initialActivities={activities}
      currentUserId={session.id}
      adminUsers={adminUsers}
    />
  );
}
