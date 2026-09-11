import type { Metadata } from "next";
import { HeightsMasterScreen } from "@/components/sg-sst/alturas/HeightsMasterScreen";
import { loadHeightsMasterData } from "@/lib/sg-sst/alturas/actions";

export const metadata: Metadata = {
  title: "Trabajo en alturas | SG-SST",
  description:
    "Autorizaciones operativas de trabajo en alturas: formación, certificado, EMO y bloqueo NO AUTORIZADO.",
};

export default async function TrabajoEnAlturasPage() {
  const data = await loadHeightsMasterData();
  return (
    <HeightsMasterScreen
      items={data.items}
      stats={data.stats}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
