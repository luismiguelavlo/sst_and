import type { Metadata } from "next";
import { EppMasterScreen } from "@/components/sg-sst/epp/EppMasterScreen";
import { loadEppMasterData } from "@/lib/sg-sst/epp/actions";

export const metadata: Metadata = {
  title: "EPP | SG-SST",
  description:
    "Dotación, catálogo y reposición de equipos de protección personal.",
};

export default async function EppPage() {
  const data = await loadEppMasterData();
  return (
    <EppMasterScreen
      deliveries={data.deliveries}
      catalog={data.catalog}
      stats={data.stats}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
