import type { Metadata } from "next";
import { EmoFormScreen } from "@/components/sg-sst/emos/EmoFormScreen";
import { loadEmoFormData } from "@/lib/sg-sst/emos/actions";

export const metadata: Metadata = {
  title: "Nuevo EMO | SG-SST",
};

export default async function NuevoEmoPage() {
  const { workers, emo, history } = await loadEmoFormData();
  return <EmoFormScreen workers={workers} emo={emo} history={history} />;
}
