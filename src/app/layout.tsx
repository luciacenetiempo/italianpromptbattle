import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "../../public/fonts/gellix.css";
import ParticleCanvas from "@/app/components/ParticleCanvas";
import GlitchCanvas from "@/app/components/GlitchCanvas";
import AppPreloader from "@/app/components/AppPreloader";
import ConsentBanner from "@/app/components/ConsentBanner";

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
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6Y0CVPFPTQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Imposta il consenso predefinito su 'denied'
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
            
            gtag('js', new Date());
            gtag('config', 'G-6Y0CVPFPTQ');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <AppPreloader>
          <ParticleCanvas />
          <GlitchCanvas />
          {children}
        </AppPreloader>
        <ConsentBanner />
      </body>
    </html>
  );
}
