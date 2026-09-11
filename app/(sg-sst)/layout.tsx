import { SgsstShell } from "@/components/sg-sst/SgsstShell";
import { requireAdmin } from "@/lib/auth/guards";
import { enrichRecordAsAlert } from "@/lib/sg-sst/alerts/engine";
import { getAlertSettings, listComplianceRecords } from "@/lib/sg-sst/alerts/repository";

export default async function SgsstLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();
  let criticalAlertCount = 0;
  try {
    const [settings, records] = await Promise.all([
      getAlertSettings(),
      listComplianceRecords({ includeClosed: false }),
    ]);
    criticalAlertCount = records
      .map((record) => enrichRecordAsAlert(record, settings))
      .filter((alert) => alert.semaphore === "critico").length;
  } catch {
    criticalAlertCount = 0;
  }
  return (
    <SgsstShell user={user} criticalAlertCount={criticalAlertCount}>
      {children}
    </SgsstShell>
  );
}
