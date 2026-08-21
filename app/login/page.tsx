import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export const metadata: Metadata = {
  title: "Iniciar sesión · Campus SST",
  description: "Entra a Campus SST con la cuenta que te asignó el área de SST.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface font-body-md text-on-surface">
      <main className="w-full max-w-lg px-md py-lg sm:p-xl">
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-[20%] -left-[10%] h-[50%] w-[50%] animate-pulse rounded-full bg-primary/5 blur-[100px]"
              style={{ animationDuration: "8s" }}
            />
            <div
              className="absolute top-[60%] -right-[10%] h-[40%] w-[40%] animate-pulse rounded-full bg-secondary/5 blur-[80px]"
              style={{ animationDuration: "10s" }}
            />
          </div>

          <LoginForm />

          <div className="fixed right-lg bottom-lg hidden items-center gap-xs rounded-full bg-surface-container-lowest px-sm py-xs font-label-sm text-label-sm text-on-surface-variant shadow-sm lg:flex">
            <MaterialIcon name="shield" className="text-[16px] text-tertiary" />
            <span>Acceso corporativo</span>
          </div>
        </div>
      </main>
    </div>
  );
}
