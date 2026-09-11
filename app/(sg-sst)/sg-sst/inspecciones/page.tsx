import type { Metadata } from "next";
import { InspectionsMasterScreen } from "@/components/sg-sst/inspecciones/InspectionsMasterScreen";
import { loadInspectionsMasterData } from "@/lib/sg-sst/inspecciones/actions";

export const metadata: Metadata = {
  title: "Inspecciones | SG-SST",
  description:
    "Inspecciones planeadas de seguridad, hallazgos y calendario semanal SG-SST.",
};

export default async function InspeccionesPage() {
  const data = await loadInspectionsMasterData();
  return (
    <InspectionsMasterScreen
      inspections={data.inspections}
      stats={data.stats}
      farms={data.farms}
      week={data.week}
      weekItems={data.weekItems}
    />
  );
}
