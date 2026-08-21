import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/guards";
import { homePathForRole } from "@/lib/auth/types";

export default async function Home() {
  const user = await requireAuth();
  redirect(homePathForRole(user.role));
}
