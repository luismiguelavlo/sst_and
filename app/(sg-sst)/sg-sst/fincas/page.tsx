import type { Metadata } from "next";
import { FarmsMasterScreen } from "@/components/sg-sst/fincas/FarmsMasterScreen";
import { loadFarmsMasterData } from "@/lib/sg-sst/fincas/actions";

export const metadata: Metadata = {
  title: "Fincas / Predios | SG-SST",
  description:
    "Catálogo de fincas, predios y lugares de trabajo del sistema operativo SG-SST.",
};

export default async function FincasPage() {
  const data = await loadFarmsMasterData();
  return <FarmsMasterScreen farms={data.farms} stats={data.stats} />;
}
