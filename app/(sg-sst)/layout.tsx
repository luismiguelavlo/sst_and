import { SgsstShell } from "@/components/sg-sst/SgsstShell";
import { requireAdmin } from "@/lib/auth/guards";
import { enrichRecordAsAlert } from "@/lib/sg-sst/alerts/engine";
import { getAlertSettings, listComplianceRecords } from "@/lib/sg-sst/alerts/repository";
import { listSstNotificationCenter } from "@/lib/sg-sst/notificaciones/repository";

export default async function SgsstLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();
  let criticalAlertCount = 0;
  let notificationCenter = null;
  try {
    const [settings, records, center] = await Promise.all([
      getAlertSettings(),
      listComplianceRecords({ includeClosed: false }),
      listSstNotificationCenter(user.id),
    ]);
    criticalAlertCount = records
      .map((record) => enrichRecordAsAlert(record, settings))
      .filter((alert) => alert.semaphore === "critico").length;
    notificationCenter = center;
  } catch {
    criticalAlertCount = 0;
    notificationCenter = null;
  }
  return (
    <SgsstShell
      user={user}
      criticalAlertCount={criticalAlertCount}
      notificationCenter={notificationCenter}
    >
      {children}
    </SgsstShell>
  );
}
