import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkerFormScreen } from "@/components/sg-sst/workers/WorkerFormScreen";
import { loadWorkerFormData } from "@/lib/sg-sst/workers/actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { worker } = await loadWorkerFormData(id);
  return {
    title: worker ? `${worker.fullName} | Trabajadores` : "Trabajador | SG-SST",
  };
}

export default async function TrabajadorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { farms, worker } = await loadWorkerFormData(id);
  if (!worker) {
    notFound();
  }
  return <WorkerFormScreen farms={farms} worker={worker} />;
}
