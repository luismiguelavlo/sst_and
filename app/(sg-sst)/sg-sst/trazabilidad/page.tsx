import type { Metadata } from "next";
import { TraceabilityScreen } from "@/components/sg-sst/trazabilidad/TraceabilityScreen";
import { loadSstAuditTrailAction } from "@/lib/sg-sst/trazabilidad/actions";

export const metadata: Metadata = {
  title: "Trazabilidad | SG-SST",
  description: "Historial de cambios importantes del sistema SG-SST.",
};

export default async function TrazabilidadPage() {
  const { events, total } = await loadSstAuditTrailAction({ limit: 150 });
  return <TraceabilityScreen initialEvents={events} initialTotal={total} />;
}
