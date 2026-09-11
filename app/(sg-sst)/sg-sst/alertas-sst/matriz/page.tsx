import type { Metadata } from "next";
import { AlertsMatrixScreen } from "@/components/sg-sst/alerts/AlertsMatrixScreen";
import { loadAlertsDashboardData } from "@/lib/sg-sst/alerts/actions";
import { isSstAlertKind } from "@/lib/sg-sst/alerts/types";

export const metadata: Metadata = {
  title: "Matriz de Alertas SST | SG-SST",
};

type PageProps = {
  searchParams: Promise<{ kind?: string }>;
};

export default async function AlertasMatrizPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await loadAlertsDashboardData({ includeClosed: false });
  const initialKind =
    params.kind && isSstAlertKind(params.kind) ? params.kind : null;
  return (
    <AlertsMatrixScreen
      alerts={data.alerts}
      farms={data.farms}
      counts={data.counts}
      initialKind={initialKind}
      criticalCount={data.criticalCount}
    />
  );
}
