import type { Metadata } from "next";
import { HealthCasesMasterScreen } from "@/components/sg-sst/casos-salud/HealthCasesMasterScreen";
import { loadHealthCasesMasterData } from "@/lib/sg-sst/casos-salud/actions";

export const metadata: Metadata = {
  title: "Casos de Salud Abiertos | SG-SST",
  description:
    "Seguimiento administrativo de casos de salud ocupacional sin historia clínica ni CIE-10.",
};

export default async function CasosDeSaludPage() {
  const data = await loadHealthCasesMasterData();
  return (
    <HealthCasesMasterScreen
      cases={data.cases}
      stats={data.stats}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
