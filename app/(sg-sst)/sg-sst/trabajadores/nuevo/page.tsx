import type { Metadata } from "next";
import { WorkerFormScreen } from "@/components/sg-sst/workers/WorkerFormScreen";
import { loadWorkerFormData } from "@/lib/sg-sst/workers/actions";

export const metadata: Metadata = {
  title: "Nuevo trabajador | SG-SST",
};

export default async function NuevoTrabajadorPage() {
  const { farms } = await loadWorkerFormData();
  return <WorkerFormScreen farms={farms} worker={null} />;
}
