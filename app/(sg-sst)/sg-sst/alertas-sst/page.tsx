import type { Metadata } from "next";
import { AlertsRadarScreen } from "@/components/sg-sst/alerts/AlertsRadarScreen";
import { loadAlertsDashboardData } from "@/lib/sg-sst/alerts/actions";

export const metadata: Metadata = {
  title: "Alertas SST | SG-SST",
};

export default async function AlertasSstPage() {
  const data = await loadAlertsDashboardData({ includeClosed: false });
  return (
    <AlertsRadarScreen
      alerts={data.alerts}
      counts={data.counts}
      kindSummaries={data.kindSummaries}
      farms={data.farms}
      criticalCount={data.criticalCount}
    />
  );
}
