import type { Metadata } from "next";
import { CopasstMasterScreen } from "@/components/sg-sst/copasst/CopasstMasterScreen";
import { loadCopasstMasterData } from "@/lib/sg-sst/copasst/actions";

export const metadata: Metadata = {
  title: "COPASST | SG-SST",
  description:
    "Comité Paritario de SST: integrantes, actas, compromisos y capacitaciones.",
};

export default async function CopasstPage() {
  const data = await loadCopasstMasterData();
  return (
    <CopasstMasterScreen
      members={data.members}
      meetings={data.meetings}
      commitments={data.commitments}
      trainings={data.trainings}
      stats={data.stats}
      farms={data.farms}
      workers={data.workers}
    />
  );
}
