import type { Metadata } from "next";
import { WorkerSstFichaScreen } from "@/components/sg-sst/workers/WorkerSstFichaScreen";
import { loadWorkerSstFichaAction } from "@/lib/sg-sst/search/actions";
import { loadSstAuditTrailAction } from "@/lib/sg-sst/trazabilidad/actions";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { ficha } = await loadWorkerSstFichaAction(id);
  return {
    title: ficha
      ? `Ficha SST · ${ficha.worker.fullName}`
      : "Ficha SST | SG-SST",
  };
}

export default async function WorkerSstFichaPage({ params }: PageProps) {
  const { id } = await params;
  const [{ ficha }, audit] = await Promise.all([
    loadWorkerSstFichaAction(id),
    loadSstAuditTrailAction({ workerId: id, limit: 30 }),
  ]);
  if (!ficha) notFound();
  return (
    <WorkerSstFichaScreen
      ficha={ficha}
      auditEvents={audit.events}
      auditTotal={audit.total}
    />
  );
}
