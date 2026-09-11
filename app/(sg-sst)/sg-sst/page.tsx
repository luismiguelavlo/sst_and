import Link from "next/link";
import type { Metadata } from "next";
import { SgsstDashboard } from "@/components/sg-sst/SgsstDashboard";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { loadSgsstHomeMetrics } from "@/lib/sg-sst/dashboard/actions";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

export const metadata: Metadata = {
  title: "Panel SG-SST | Grupo Manzanares",
};

export default async function SgsstDashboardPage() {
  const metrics = await loadSgsstHomeMetrics();

  return (
    <>
      <div className="px-gutter pt-md">
        <Link
          href={`${SGSST_BASE}/alertas-sst`}
          className="flex items-center justify-between rounded-xl bg-error-container px-md py-sm text-on-error-container shadow-sm transition-colors hover:bg-error hover:text-on-error"
        >
          <div className="flex items-center gap-sm">
            <MaterialIcon name="notification_important" className="text-[24px]" />
            <div>
              <div className="font-label-md text-label-md font-bold">Alertas SST</div>
              <div className="font-body-sm text-body-sm opacity-90">
                {metrics.alertsCritical} críticas · {metrics.alertsProximos} próximas ·{" "}
                {metrics.alertsSeguimiento} en seguimiento
              </div>
            </div>
          </div>
          <MaterialIcon name="arrow_forward" />
        </Link>
      </div>
      <SgsstDashboard metrics={metrics} />
    </>
  );
}
