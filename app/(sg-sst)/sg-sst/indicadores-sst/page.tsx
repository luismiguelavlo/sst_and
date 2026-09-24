import type { Metadata } from "next";
import { IndicadoresSstScreen } from "@/components/sg-sst/indicadores/IndicadoresSstScreen";
import { loadIndicadoresSstAction } from "@/lib/sg-sst/indicadores/actions";

export const metadata: Metadata = {
  title: "Indicadores SST | SG-SST",
  description:
    "Índices de frecuencia, severidad, ausentismo, HHT y cumplimientos del SG-SST.",
};

export default async function IndicadoresSstPage() {
  const { report, farms } = await loadIndicadoresSstAction();
  return <IndicadoresSstScreen initialReport={report} farms={farms} />;
}
