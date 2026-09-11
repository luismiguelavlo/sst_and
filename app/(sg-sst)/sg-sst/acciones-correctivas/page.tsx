import type { Metadata } from "next";
import { ActionsMasterScreen } from "@/components/sg-sst/acciones/ActionsMasterScreen";
import { loadActionsMasterData } from "@/lib/sg-sst/acciones/actions";

export const metadata: Metadata = {
  title: "Acciones correctivas | SG-SST",
  description:
    "Gestión CAPA de acciones correctivas, preventivas y de mejora con semáforo de compromiso.",
};

export default async function AccionesCorrectivasPage() {
  const data = await loadActionsMasterData();
  return (
    <ActionsMasterScreen
      actions={data.actions}
      stats={data.stats}
      farms={data.farms}
    />
  );
}
