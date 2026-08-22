"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/ToastProvider";

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return <ToastProvider>{children}</ToastProvider>;
}
