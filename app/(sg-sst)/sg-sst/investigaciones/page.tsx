import type { Metadata } from "next";
import { InvestigationsMasterScreen } from "@/components/sg-sst/investigaciones/InvestigationsMasterScreen";
import { loadInvestigationsMasterData } from "@/lib/sg-sst/investigaciones/actions";

export const metadata: Metadata = {
  title: "Investigaciones | SG-SST",
  description:
    "Control de investigaciones de accidentes e incidentes (Res. 1401) y alertas de plazo legal.",
};

export default async function InvestigacionesPage() {
  const data = await loadInvestigationsMasterData();
  return (
    <InvestigationsMasterScreen
      investigations={data.investigations}
      stats={data.stats}
      accidentOptions={data.accidentOptions}
    />
  );
}
