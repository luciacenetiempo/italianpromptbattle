'use client';

import React, { useEffect } from 'react';
import { useDevice } from './DeviceContext';

type ConvaiAudioProps = Record<string, never>;

const ConvaiAudio: React.FC<ConvaiAudioProps> = () => {
  const { audioEnabled } = useDevice();

  // Gestisce l'audio del widget Convai
  useEffect(() => {
    // Il widget Convai gestisce automaticamente l'audio
    // Questo componente serve solo per tracciare l'uso dell'audio
    if (audioEnabled) {
      // Tracking per l'uso dell'audio nella pagina Convai
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'convai_audio_enabled', {
          'event_category': 'parla_con_andromeda',
          'event_label': 'audio_enabled',
          'value': 1
        });
      }
    }
  }, [audioEnabled]);

  return null; // Questo componente non renderizza nulla visivamente
};

export default ConvaiAudio; 