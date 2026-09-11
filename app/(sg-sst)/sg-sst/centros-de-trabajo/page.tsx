import type { Metadata } from "next";
import { FarmsMasterScreen } from "@/components/sg-sst/fincas/FarmsMasterScreen";
import { loadFarmsMasterData } from "@/lib/sg-sst/fincas/actions";

export const metadata: Metadata = {
  title: "Centros de trabajo | SG-SST",
  description:
    "Catálogo de centros de trabajo, sedes y lugares del sistema operativo SG-SST.",
};

export default async function CentrosDeTrabajoPage() {
  const data = await loadFarmsMasterData();
  return <FarmsMasterScreen farms={data.farms} stats={data.stats} />;
}
