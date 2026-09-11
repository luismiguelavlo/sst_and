import type { Metadata } from "next";
import { AlertsConfigScreen } from "@/components/sg-sst/alerts/AlertsConfigScreen";
import { requireAdmin } from "@/lib/auth/guards";
import { getAlertSettings } from "@/lib/sg-sst/alerts/repository";

export const metadata: Metadata = {
  title: "Configuración de Alertas SST | SG-SST",
};

export default async function AlertasConfigPage() {
  await requireAdmin();
  const settings = await getAlertSettings();
  return <AlertsConfigScreen settings={settings} />;
}
