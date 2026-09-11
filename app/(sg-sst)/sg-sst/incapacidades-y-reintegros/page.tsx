import type { Metadata } from "next";
import { LeaveMasterScreen } from "@/components/sg-sst/incapacidades/LeaveMasterScreen";
import { loadLeavesMasterData } from "@/lib/sg-sst/incapacidades/actions";

export const metadata: Metadata = {
  title: "Incapacidades y reintegros | SG-SST",
  description:
    "Registro de incapacidades, prórrogas, alertas de vencimiento y reintegros laborales.",
};

export default async function IncapacidadesPage() {
  const data = await loadLeavesMasterData();
  return (
    <LeaveMasterScreen
      leaves={data.leaves}
      stats={data.stats}
      ranking={data.ranking}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
