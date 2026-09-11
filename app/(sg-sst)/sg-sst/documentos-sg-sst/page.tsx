import type { Metadata } from "next";
import { DocumentsMasterScreen } from "@/components/sg-sst/documentos/DocumentsMasterScreen";
import { loadDocumentsMasterData } from "@/lib/sg-sst/documentos/actions";

export const metadata: Metadata = {
  title: "Documentos SG-SST | SG-SST",
  description:
    "Control documental y archivo maestro del sistema de gestión en seguridad y salud en el trabajo.",
};

export default async function DocumentosSgSstPage() {
  const data = await loadDocumentsMasterData();
  return (
    <DocumentsMasterScreen documents={data.documents} stats={data.stats} />
  );
}
