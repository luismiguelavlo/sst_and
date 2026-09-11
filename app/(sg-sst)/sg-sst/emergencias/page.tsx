import type { Metadata } from "next";
import { EmergenciasMasterScreen } from "@/components/sg-sst/emergencias/EmergenciasMasterScreen";
import { loadEmergenciasMasterData } from "@/lib/sg-sst/emergencias/actions";

export const metadata: Metadata = {
  title: "Emergencias | SG-SST",
  description:
    "Brigada de emergencia, equipos e inspecciones, y control de simulacros PPRE.",
};

export default async function EmergenciasPage() {
  const data = await loadEmergenciasMasterData();
  return (
    <EmergenciasMasterScreen
      brigade={data.brigade}
      equipment={data.equipment}
      drills={data.drills}
      stats={data.stats}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
