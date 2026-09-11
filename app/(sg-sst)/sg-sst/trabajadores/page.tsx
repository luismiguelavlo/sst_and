import type { Metadata } from "next";
import { WorkersMasterScreen } from "@/components/sg-sst/workers/WorkersMasterScreen";
import { loadWorkersMasterData } from "@/lib/sg-sst/workers/actions";

export const metadata: Metadata = {
  title: "Base Maestra de Trabajadores | SG-SST",
  description: "Registro unificado de trabajadores para todos los módulos SG-SST.",
};

export default async function TrabajadoresPage() {
  const data = await loadWorkersMasterData({ status: "all" });
  return (
    <WorkersMasterScreen workers={data.workers} stats={data.stats} farms={data.farms} />
  );
}
