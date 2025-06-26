import type { Metadata } from "next";
import "./globals.css";
import "../../public/fonts/gellix.css";
import ParticleCanvas from "@/app/components/ParticleCanvas";
import GlitchCanvas from "@/app/components/GlitchCanvas";
import AppPreloader from "@/app/components/AppPreloader";

export const metadata: Metadata = {
  title: "Italian Prompt Battle – La sfida creativa italiana",
  description: "Partecipa all'Italian Prompt Battle: la prima competizione italiana dedicata alla creatività con l'AI. Scopri, impara, sfida e vinci!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        <AppPreloader>
          <ParticleCanvas />
          <GlitchCanvas />
          {children}
        </AppPreloader>
      </body>
    </html>
  );
}
