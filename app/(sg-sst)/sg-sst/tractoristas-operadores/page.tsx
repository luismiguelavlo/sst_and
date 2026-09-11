import type { Metadata } from "next";
import { OperatorsMasterScreen } from "@/components/sg-sst/operadores/OperatorsMasterScreen";
import { loadOperatorsMasterData } from "@/lib/sg-sst/operadores/actions";

export const metadata: Metadata = {
  title: "Tractoristas / operadores | SG-SST",
  description:
    "Matriz de habilitación de tractoristas y operadores de maquinaria agrícola.",
};

export default async function TractoristasOperadoresPage() {
  const data = await loadOperatorsMasterData();
  return (
    <OperatorsMasterScreen
      operators={data.operators}
      stats={data.stats}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
