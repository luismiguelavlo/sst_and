import { redirect } from "next/navigation";

/** Compatibilidad con la ruta anterior /sg-sst/fincas */
export default function FincasRedirectPage() {
  redirect("/sg-sst/centros-de-trabajo");
}
