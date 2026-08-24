import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/ui/AppProviders";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Campus SST",
  description: "Formación en seguridad y salud en el trabajo para el personal de la organización.",
  icons: {
    icon: [{ url: "/grupomanzanares.svg", type: "image/svg+xml" }],
    shortcut: "/grupomanzanares.svg",
    apple: "/grupomanzanares.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="min-h-full bg-background font-body-md text-on-background">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
