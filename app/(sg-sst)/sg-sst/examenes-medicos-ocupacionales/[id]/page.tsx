import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmoFormScreen } from "@/components/sg-sst/emos/EmoFormScreen";
import { loadEmoFormData } from "@/lib/sg-sst/emos/actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { emo } = await loadEmoFormData(id);
  return {
    title: emo ? `${emo.folio} | EMO` : "EMO | SG-SST",
  };
}

export default async function EmoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { workers, emo, history } = await loadEmoFormData(id);
  if (!emo) {
    notFound();
  }
  return <EmoFormScreen workers={workers} emo={emo} history={history} />;
}
