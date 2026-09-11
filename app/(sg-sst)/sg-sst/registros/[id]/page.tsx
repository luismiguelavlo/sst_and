import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordDetailScreen } from "@/components/sg-sst/alerts/RecordDetailScreen";
import { loadRecordDetail } from "@/lib/sg-sst/alerts/actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadRecordDetail(id);
  if (!data) {
    return { title: "Registro SST" };
  }
  return { title: `${data.record.folio} | SG-SST` };
}

export default async function RegistroSstPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadRecordDetail(id);
  if (!data) {
    notFound();
  }
  return <RecordDetailScreen record={data.record} actions={data.actions} />;
}
