import type { Metadata } from "next";
import { ChemicalsMasterScreen } from "@/components/sg-sst/quimicos/ChemicalsMasterScreen";
import { loadChemicalsMasterData } from "@/lib/sg-sst/quimicos/actions";

export const metadata: Metadata = {
  title: "Químicos | SG-SST",
  description:
    "Inventario de sustancias químicas, fichas de seguridad, EPP e inspecciones.",
};

export default async function QuimicosPage() {
  const data = await loadChemicalsMasterData();
  return (
    <ChemicalsMasterScreen
      items={data.items}
      stats={data.stats}
      farms={data.farms}
    />
  );
}
