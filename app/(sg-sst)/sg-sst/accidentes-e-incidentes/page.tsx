import type { Metadata } from "next";
import { AccidentsMasterScreen } from "@/components/sg-sst/accidentes/AccidentsMasterScreen";
import { loadAccidentsMasterData } from "@/lib/sg-sst/accidentes/actions";

export const metadata: Metadata = {
  title: "Accidentes e incidentes | SG-SST",
  description:
    "Registro de accidentes e incidentes, análisis de causas e investigación automática Res. 1401.",
};

export default async function AccidentesEIncidentesPage() {
  const data = await loadAccidentsMasterData();
  return (
    <AccidentsMasterScreen
      events={data.events}
      stats={data.stats}
      causesRanking={data.causesRanking}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
