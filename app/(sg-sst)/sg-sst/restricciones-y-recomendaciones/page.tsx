import type { Metadata } from "next";
import { RestrictionsMasterScreen } from "@/components/sg-sst/restricciones/RestrictionsMasterScreen";
import { loadRestrictionsMasterData } from "@/lib/sg-sst/restricciones/actions";

export const metadata: Metadata = {
  title: "Restricciones y recomendaciones | SG-SST",
  description:
    "Base maestra de restricciones laborales, recomendaciones y seguimiento de implementación.",
};

export default async function RestriccionesPage() {
  const data = await loadRestrictionsMasterData();
  return (
    <RestrictionsMasterScreen
      restrictions={data.restrictions}
      stats={data.stats}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
