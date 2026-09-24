import type { Metadata } from "next";
import { AnalisisSstScreen } from "@/components/sg-sst/analisis/AnalisisSstScreen";
import { loadAnalisisSstAction } from "@/lib/sg-sst/analisis/actions";

export const metadata: Metadata = {
  title: "Análisis SST | SG-SST",
  description:
    "Rankings ejecutivos de accidentalidad, ausentismo, EPP, capacitaciones e inspecciones.",
};

export default async function AnalisisSstPage() {
  const { report, farms } = await loadAnalisisSstAction();
  return <AnalisisSstScreen initialReport={report} farms={farms} />;
}
