import type { Metadata } from "next";
import { CclMasterScreen } from "@/components/sg-sst/ccl/CclMasterScreen";
import { loadCclMasterData } from "@/lib/sg-sst/ccl/actions";

export const metadata: Metadata = {
  title: "CCL | SG-SST",
  description:
    "Comité de Convivencia Laboral: integrantes, actas, casos anónimos y compromisos.",
};

export default async function CclPage() {
  const data = await loadCclMasterData();
  return (
    <CclMasterScreen
      members={data.members}
      meetings={data.meetings}
      cases={data.cases}
      commitments={data.commitments}
      stats={data.stats}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
