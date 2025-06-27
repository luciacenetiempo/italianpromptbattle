'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './AppPreloader.module.css';
import { DeviceContext } from './DeviceContext';

interface AppPreloaderProps {
  children: React.ReactNode;
}

interface PreloadStatus {
  fonts: boolean;
  speakingVideo: boolean;
  backgroundVideo: boolean;
  introVideo: boolean;
  audio: boolean;
  userInteraction: boolean;
}

const AppPreloader: React.FC<AppPreloaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAudioChoice, setShowAudioChoice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileDetected, setIsMobileDetected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [preloadStatus, setPreloadStatus] = useState<PreloadStatus>({
    fonts: false,
    speakingVideo: false,
    backgroundVideo: false,
    introVideo: false,
    audio: false,
    userInteraction: false
  });
  
  const speakingVideoRef = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Rileva dispositivo mobile
  useEffect(() => {
    const checkIsMobile = () => {
      const mobileByWidth = window.innerWidth <= 768;
      const mobileByUserAgent = /Mobi/i.test(window.navigator.userAgent);
      
      setIsMobile(mobileByWidth);
      setIsMobileDetected(mobileByUserAgent);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Caricamento font
  useEffect(() => {
    document.fonts.ready.then(() => {
      setPreloadStatus(prev => ({ ...prev, fonts: true }));
    });
  }, []);

  // Preload video speaking
  useEffect(() => {
    const video = speakingVideoRef.current;
    if (!video) return;

    const isMobileDevice = isMobile || isMobileDetected;
    
    // Carica sia WebM che MP4 per assicurarsi che sia disponibile
    const webmSrc = isMobileDevice ? '/video/ipb-speaking-m.webm' : '/video/ipb-speaking.webm';
    const mp4Src = isMobileDevice ? '/video/ipb-speaking-m.mp4' : '/video/ipb-speaking.mp4';
    
    
    // Aggiungi entrambe le sorgenti
    video.innerHTML = `
      <source src="${webmSrc}" type="video/webm" />
      <source src="${mp4Src}" type="video/mp4" />
    `;
    
    const timeout = setTimeout(() => {
      setPreloadStatus(prev => ({ ...prev, speakingVideo: true }));
    }, 5000); // Timeout di 5 secondi

    video.oncanplaythrough = () => {
      clearTimeout(timeout);
      setPreloadStatus(prev => ({ ...prev, speakingVideo: true }));
    };

    video.onerror = (e) => {
      console.error('[AppPreloader] Errore preload video speaking:', e);
      clearTimeout(timeout);
      setPreloadStatus(prev => ({ ...prev, speakingVideo: true })); // Fallback
    };

    return () => clearTimeout(timeout);
  }, [isMobile, isMobileDetected]);

  // Preload video background
  useEffect(() => {
    const video = backgroundVideoRef.current;
    if (!video) return;

    const isMobileDevice = isMobile || isMobileDetected;
    
    // Carica sia WebM che MP4 per assicurarsi che sia disponibile
    const webmSrc = isMobileDevice ? '/video/ipb-background-2-m.webm' : '/video/ipb-background-2.webm';
    const mp4Src = isMobileDevice ? '/video/ipb-background-2-m.mp4' : '/video/ipb-background-2.mp4';
    
    // Aggiungi entrambe le sorgenti
    video.innerHTML = `
      <source src="${webmSrc}" type="video/webm" />
      <source src="${mp4Src}" type="video/mp4" />
    `;
    
    const timeout = setTimeout(() => {
      setPreloadStatus(prev => ({ ...prev, backgroundVideo: true }));
    }, 3000);

    video.oncanplaythrough = () => {
      clearTimeout(timeout);
      setPreloadStatus(prev => ({ ...prev, backgroundVideo: true }));
    };

    video.onerror = () => {
      clearTimeout(timeout);
      setPreloadStatus(prev => ({ ...prev, backgroundVideo: true }));
    };

    return () => clearTimeout(timeout);
  }, [isMobile, isMobileDetected]);

  // Preload video intro
  useEffect(() => {
    const video = introVideoRef.current;
    if (!video) return;

    const isMobileDevice = isMobile || isMobileDetected;
    
    // Carica sia WebM che MP4 per assicurarsi che sia disponibile
    const webmSrc = isMobileDevice ? '/video/ipb-intro-m.webm' : '/video/ipb-intro.webm';
    const mp4Src = isMobileDevice ? '/video/ipb-intro-m.mp4' : '/video/ipb-intro.mp4';
    
    // Aggiungi entrambe le sorgenti
    video.innerHTML = `
      <source src="${webmSrc}" type="video/webm" />
      <source src="${mp4Src}" type="video/mp4" />
    `;
    
    const timeout = setTimeout(() => {
      setPreloadStatus(prev => ({ ...prev, introVideo: true }));
    }, 3000);

    video.oncanplaythrough = () => {
      clearTimeout(timeout);
      setPreloadStatus(prev => ({ ...prev, introVideo: true }));
    };

    video.onerror = () => {
      clearTimeout(timeout);
      setPreloadStatus(prev => ({ ...prev, introVideo: true }));
    };

    return () => clearTimeout(timeout);
  }, [isMobile, isMobileDetected]);

  // Preload audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = '/assets/audio/song.mp3';
    
    const timeout = setTimeout(() => {
      setPreloadStatus(prev => ({ ...prev, audio: true }));
    }, 2000);

    audio.oncanplaythrough = () => {
      clearTimeout(timeout);
      setPreloadStatus(prev => ({ ...prev, audio: true }));
    };

    audio.onerror = () => {
      clearTimeout(timeout);
      setPreloadStatus(prev => ({ ...prev, audio: true }));
    };

    return () => clearTimeout(timeout);
  }, []);

  // Controlla quando mostrare la scelta audio
  useEffect(() => {
    const { fonts, speakingVideo, backgroundVideo, introVideo, audio } = preloadStatus;
    if (fonts && speakingVideo && backgroundVideo && introVideo && audio) {
      setShowAudioChoice(true);
    }
  }, [preloadStatus]);

  // Gestisce la scelta audio e completa il preload
  const handleAudioChoice = (enableAudio: boolean) => {
    setAudioEnabled(enableAudio);
    setPreloadStatus(prev => ({ ...prev, userInteraction: true }));
    setIsLoading(false);
  };

  // Calcola il progresso del preload
  const progress = Object.values(preloadStatus).filter(Boolean).length / Object.keys(preloadStatus).length * 100;

  if (!isLoading) {
    return (
      <DeviceContext.Provider value={{ isMobile, isMobileDetected, audioEnabled }}>
        {children}
      </DeviceContext.Provider>
    );
  }

  return (
    <DeviceContext.Provider value={{ isMobile, isMobileDetected, audioEnabled }}>
      <div className={styles.preloaderContainer}>
        {/* Video nascosti per preload */}
        <video ref={speakingVideoRef} style={{ display: 'none' }} preload="auto" muted playsInline />
        <video ref={backgroundVideoRef} style={{ display: 'none' }} preload="auto" muted playsInline />
        <video ref={introVideoRef} style={{ display: 'none' }} preload="auto" muted playsInline />
        <audio ref={audioRef} style={{ display: 'none' }} preload="auto" />

        {!showAudioChoice ? (
          // Schermata di caricamento
          <div className={styles.loadingScreen}>
            <div className={styles.loadingContent}>
              <div className={styles.logo}>
                <Image src="/assets/img/ipb-sil.webp" alt="Italian Prompt Battle" width={100} height={100} />
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
              <div className={styles.loadingText}>
                Caricamento in corso... {Math.round(progress)}%
              </div>
            </div>
          </div>
        ) : (
          // Scelta audio
          <div className={styles.audioChoiceScreen}>
            <div className={styles.audioPanel}>
              <div className={styles.equalizer}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
              </div>
              <div className={styles.audioText}>Vuoi attivare l&apos;audio?</div>
              <div className={styles.audioButtons}>
                <button 
                  className={styles.audioBtn} 
                  onClick={() => handleAudioChoice(true)}
                >
                  Sì
                </button>
                <button 
                  className={styles.audioBtn} 
                  onClick={() => handleAudioChoice(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DeviceContext.Provider>
  );
};

export default AppPreloader; 