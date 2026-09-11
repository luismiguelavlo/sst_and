import type { Metadata } from "next";
import { EmOsMasterScreen } from "@/components/sg-sst/emos/EmOsMasterScreen";
import { loadEmosMasterData } from "@/lib/sg-sst/emos/actions";

export const metadata: Metadata = {
  title: "Exámenes médicos ocupacionales | SG-SST",
  description: "Matriz de EMOs, semáforo de vencimientos e importación Excel.",
};

export default async function EmOsPage() {
  const data = await loadEmosMasterData();
  return (
    <EmOsMasterScreen
      emos={data.emos}
      stats={data.stats}
      farms={data.farms}
      workerCensus={data.workerCensus}
    />
  );
}
