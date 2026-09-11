import type { Metadata } from "next";
import { TrainingsMasterScreen } from "@/components/sg-sst/capacitaciones/TrainingsMasterScreen";
import { loadTrainingsMasterData } from "@/lib/sg-sst/capacitaciones/actions";

export const metadata: Metadata = {
  title: "Capacitaciones | SG-SST",
  description:
    "Base maestra de capacitaciones SST: temas, evidencias, certificados, próximas fechas y cumplimiento del plan anual.",
};

export default async function CapacitacionesPage() {
  const data = await loadTrainingsMasterData();
  return (
    <TrainingsMasterScreen
      items={data.items}
      stats={data.stats}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
