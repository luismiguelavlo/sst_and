import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/guards";
import { CertificatesGallery } from "@/components/certificates/CertificatesGallery";
import { listCertificatesForUser } from "@/lib/certificates/repository";
import type { CertificateListItem } from "@/lib/certificates";

export const metadata: Metadata = {
  title: "Mis certificados · Campus SST",
  description: "Consulta e imprime tus certificados de competencias SST.",
};

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const user = await requireAuth();
  let certificates: CertificateListItem[] = [];
  try {
    certificates = await listCertificatesForUser(user.id);
  } catch {
    certificates = [];
  }
  return <CertificatesGallery certificates={certificates} />;
}
