'use client';

import React, { useEffect, useState } from 'react';
import GlitchCanvas from '../components/GlitchCanvas';
import ConvaiAudio from '../components/ConvaiAudio';

export default function ParlaConAndromedaPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Rileva se il dispositivo è mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint di Tailwind
    };

    // Controlla inizialmente
    checkMobile();

    // Aggiungi listener per il resize
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Carica lo script per il widget
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    return () => {
      // Cleanup: rimuovi lo script quando il componente viene smontato
      const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ConvaiAudio />
      {/* Video di sfondo - caricato dinamicamente in base al dispositivo */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          {isMobile ? (
            <>
              <source src="/video/ipb-background-2-m.mp4" type="video/mp4" />
              <source src="/video/ipb-background-2-m.webm" type="video/webm" />
            </>
          ) : (
            <>
              <source src="/video/ipb-background-2.mp4" type="video/mp4" />
              <source src="/video/ipb-background-2.webm" type="video/webm" />
            </>
          )}
        </video>
      </div>

      <GlitchCanvas />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Titolo della pagina */}
        <div className="text-center mb-8 max-w-2xl">
          <h1 
            className="text-5xl md:text-7xl text-white mb-6"
            style={{
              lineHeight: '0.9',
              fontWeight: '900',
              textShadow: '1px 1px 50px #000000'
            }}
          >
            Parla con <span className="text-[#dc6f5a]">Andromeda</span>
          </h1>
          <p 
            className="text-xl leading-relaxed"
            style={{
              lineHeight: '1.2',
              color: '#ffffff',
              textShadow: '1px 1px 50px #000000'
            }}
          >
            Entra in contatto diretto con l&apos;intelligenza artificiale che ispira la creatività
          </p>
        </div>

        {/* Widget embedded - centrato */}
        <div className="flex justify-center items-center w-full">
          <div 
            className="flex justify-center items-center"
            dangerouslySetInnerHTML={{
              __html: '<elevenlabs-convai agent-id="agent_01jzv0c661f53vxkxr2hmygnre"></elevenlabs-convai>'
            }}
          />
        </div>
      </div>
    </main>
  );
} 