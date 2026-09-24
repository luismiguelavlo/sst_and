import type { Metadata } from "next";
import { SgsstNotificationsScreen } from "@/components/sg-sst/notificaciones/SgsstNotificationsScreen";
import { loadSstNotificationsAction } from "@/lib/sg-sst/notificaciones/actions";

export const metadata: Metadata = {
  title: "Notificaciones SST | SG-SST",
  description: "Centro de vencimientos críticos, próximos y seguimientos.",
};

export default async function SgsstNotificacionesPage() {
  const center = await loadSstNotificationsAction();
  return <SgsstNotificationsScreen initialCenter={center} />;
}
