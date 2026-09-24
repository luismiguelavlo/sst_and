import type { Metadata } from "next";
import { ComplianceConfigScreen } from "@/components/sg-sst/configuracion/ComplianceConfigScreen";
import { loadComplianceThresholdsAction } from "@/lib/sg-sst/cumplimiento/actions";

export const metadata: Metadata = {
  title: "Configuración | SG-SST",
  description: "Umbrales del semáforo de cumplimiento del SG-SST.",
};

export default async function SgsstConfiguracionPage() {
  const thresholds = await loadComplianceThresholdsAction();
  return <ComplianceConfigScreen thresholds={thresholds} />;
}
