import type { Metadata } from "next";
import { PesvMasterScreen } from "@/components/sg-sst/pesv/PesvMasterScreen";
import { loadPesvMasterData } from "@/lib/sg-sst/pesv/actions";

export const metadata: Metadata = {
  title: "PESV | SG-SST",
  description:
    "Plan Estratégico de Seguridad Vial: conductores, flota y preoperacionales.",
};

export default async function PesvPage() {
  const data = await loadPesvMasterData();
  return (
    <PesvMasterScreen
      drivers={data.drivers}
      vehicles={data.vehicles}
      preops={data.preops}
      stats={data.stats}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
