'use client';

import React, { useRef, useEffect, useState } from 'react';
import Header from './Header';
import styles from './Landing.module.css';
import SplitFlapAnimation from './SplitFlapAnimation';
import Intro from './Intro';
import Head from 'next/head';
import { useDevice } from './DeviceContext';

interface LandingProps {
  onSpeakingEnd: () => void;
  hasSpeakingVideoPlayed: boolean;
  onOpenPanel?: (formType: 'registration' | 'sponsorship' | 'newsletter' | 'attendee') => void;
}

const Landing: React.FC<LandingProps> = ({ onSpeakingEnd, hasSpeakingVideoPlayed, onOpenPanel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const songAudioRef = useRef<HTMLAudioElement>(null);
  const [scrollFraction, setScrollFraction] = useState(0);
  const [isSongPlaying, setIsSongPlaying] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [maxHeaderProgress, setMaxHeaderProgress] = useState(0);
  const [textAnimationComplete, setTextAnimationComplete] = useState(false);
  const animationStartTimeRef = useRef<number | null>(null);
  const [userActivatedAudio, setUserActivatedAudio] = useState(false);
  
  // Utilizza il context per rilevare il dispositivo
  const { isMobile, isMobileDetected, audioEnabled } = useDevice();
  const isMobileDevice = isMobile || isMobileDetected;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const logVideoSource = () => {
      if (video) {
        console.log(`[Landing] Video caricato: ${video.currentSrc}`);
      }
    };
    video.addEventListener('canplay', logVideoSource);

    let targetTime = 0;
    let easedTime = 0;
    const easingFactor = 0.1; // Ridotto per un'animazione più morbida e fluida

    const handleScroll = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      
      const scrollableHeight = el.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrollTop = window.scrollY;
      const currentScrollFraction = Math.min(1, scrollTop / scrollableHeight);
      
      setScrollFraction(currentScrollFraction);

      // Debug log
      console.log('[Landing] Scroll:', {
        scrollTop,
        scrollableHeight,
        currentScrollFraction,
        showIntro: currentScrollFraction >= 0.95
      });

      // Ottimizzazione: aggiorna lo stato solo se il valore cambia
      const newScrolled = scrollTop > 10;
      setScrolled(prev => (prev !== newScrolled ? newScrolled : prev));

      // Riduci il threshold per mostrare l'intro più facilmente
      const introThreshold = 0.95; // Ridotto da 1 a 0.95
      const newShowIntro = currentScrollFraction >= introThreshold;
      setShowIntro(prev => (prev !== newShowIntro ? newShowIntro : prev));

      if (isFinite(video.duration)) {
        targetTime = video.duration * currentScrollFraction;
      }
    };

    let animationFrameId: number;
    const smoothAnimate = () => {
      easedTime += (targetTime - easedTime) * easingFactor;
      if (video.readyState > 1 && Math.abs(video.currentTime - easedTime) > 0.01) {
        video.currentTime = easedTime;
      }
      animationFrameId = requestAnimationFrame(smoothAnimate);
    };

    const onMetadataLoaded = () => {
      video.play().then(() => {
        video.pause();
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        smoothAnimate();
      }).catch(error => {
        console.error("Video play failed, fallback to direct scroll handling:", error);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        smoothAnimate();
      });
    };

    if (video.readyState > 0) {
      onMetadataLoaded();
    } else {
      video.addEventListener('loadedmetadata', onMetadataLoaded);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      video.removeEventListener('loadedmetadata', onMetadataLoaded);
      if (video) {
        video.removeEventListener('canplay', logVideoSource);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMobileDevice]);

  // Fallback temporale per l'animazione del testo
  useEffect(() => {
    if (scrollFraction > 0 && !textAnimationComplete) {
      if (!animationStartTimeRef.current) {
        animationStartTimeRef.current = Date.now();
      }
      
      // Se sono passati più di 3 secondi dall'inizio dell'animazione e non è ancora completa,
      // forziamo il completamento (soprattutto per dispositivi mobile con problemi di performance)
      const timeElapsed = Date.now() - animationStartTimeRef.current;
      if (timeElapsed > 3000 && scrollFraction >= 0.8) {
        setTextAnimationComplete(true);
      }
    } else if (scrollFraction === 0) {
      // Reset quando torniamo all'inizio
      animationStartTimeRef.current = null;
      setTextAnimationComplete(false);
    }
  }, [scrollFraction, textAnimationComplete]);

  // Fallback per mostrare l'intro se l'utente non scrolla completamente
  useEffect(() => {
    if (!showIntro && scrollFraction > 0.5) {
      // Se l'utente ha scrollato più del 50% ma non ha ancora raggiunto il threshold,
      // mostra l'intro dopo 5 secondi
      const timeout = setTimeout(() => {
        if (!showIntro) {
          console.log('[Landing] Fallback: mostrando intro automaticamente');
          setShowIntro(true);
        }
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [showIntro, scrollFraction]);

  // useEffect che gestisce la musica di sottofondo - rispetta la scelta dell'utente
  useEffect(() => {
    const audio = songAudioRef.current;
    if (!audio) return;

    // L'audio parte se l'utente ha scelto di attivarlo inizialmente O se l'ha attivato tramite pulsante
    const shouldPlayAudio = (audioEnabled || userActivatedAudio) && isSongPlaying;
    
    if (shouldPlayAudio) {
      audio.play().catch(error => {
        console.error("Background song play failed:", error);
      });
    } else {
      audio.pause();
    }
  }, [audioEnabled, userActivatedAudio, isSongPlaying]);

  const handleToggleSong = () => {
    // Se l'audio non è abilitato e l'utente clicca il pulsante, attivalo
    if (!audioEnabled && !userActivatedAudio) {
      console.log('[Landing] Utente attiva audio tramite pulsante di controllo');
      setUserActivatedAudio(true);
      setIsSongPlaying(true); // Attiva anche la riproduzione
      return;
    }
    
    // Se l'audio è già attivo, gestisci play/pause normalmente
    setIsSongPlaying(!isSongPlaying);
  };

  const titleText = "Qualcosa di nuovo\nsta per succedere";
  const totalChars = titleText.replace(/\n/g, '').length;
  
  // Calcolo migliorato per garantire il completamento dell'animazione
  let visibleCount = Math.floor(scrollFraction * totalChars);
  
  // Margine di sicurezza per dispositivi mobile: se siamo oltre il 95% dello scroll, 
  // mostriamo tutte le lettere per garantire il completamento
  if (isMobileDevice && scrollFraction >= 0.95) {
    visibleCount = totalChars;
  } else if (scrollFraction >= 0.98) {
    // Su desktop, garantiamo il completamento al 98% dello scroll
    visibleCount = totalChars;
  }
  
  // Fallback temporale: se l'animazione è stata forzata al completamento, mostriamo tutte le lettere
  if (textAnimationComplete) {
    visibleCount = totalChars;
  }
  
  // Assicuriamoci che visibleCount non superi mai totalChars
  visibleCount = Math.min(visibleCount, totalChars);
  
  const visibleFraction = totalChars > 0 ? visibleCount / totalChars : 0;

  const headerStart = 0.5;
  const headerEnd = 0.7;
  let currentHeaderProgress = (visibleFraction - headerStart) / (headerEnd - headerStart);
  currentHeaderProgress = Math.max(0, Math.min(1, currentHeaderProgress));

  if (currentHeaderProgress > maxHeaderProgress) {
    setMaxHeaderProgress(currentHeaderProgress);
  }

  return (
    <>
      <Head>
        <title>Italian Prompt Battle – La sfida creativa italiana</title>
        <meta name="description" content="Partecipa all'Italian Prompt Battle: la prima competizione italiana dedicata alla creatività con l'AI. Scopri, impara, sfida e vinci!" />
        <meta property="og:title" content="Italian Prompt Battle – La sfida creativa italiana" />
        <meta property="og:description" content="Partecipa all'Italian Prompt Battle: la prima competizione italiana dedicata alla creatività con l'AI. Scopri, impara, sfida e vinci!" />
        <meta property="og:image" content="/assets/images/og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Italian Prompt Battle – La sfida creativa italiana" />
        <meta name="twitter:description" content="Partecipa all'Italian Prompt Battle: la prima competizione italiana dedicata alla creatività con l'AI. Scopri, impara, sfida e vinci!" />
        <meta name="twitter:image" content="/assets/images/og-image.jpg" />
        <link rel="icon" href="/favicon.ico" />

        {/* Preload dei video in entrambi i formati */}
      </Head>
      <div style={{ background: '#000', position: 'relative' }}>
        <audio ref={songAudioRef} src="/assets/audio/song.mp3" loop />

        {/* Pulsante Pausa/Play Musica - sempre visibile per permettere l'attivazione */}
        <button 
          onClick={handleToggleSong} 
          className={styles.musicControlButton} 
          aria-label={
            isSongPlaying && (audioEnabled || userActivatedAudio) 
              ? 'Pausa musica' 
              : (audioEnabled || userActivatedAudio) 
                ? 'Riproduci musica' 
                : 'Attiva audio'
          }
        >
          {isSongPlaying && (audioEnabled || userActivatedAudio) ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </button>

        <div ref={scrollContainerRef} className={styles.scrollContainer}>
          <div className={styles.stickyContainer}>
            <video
              key={isMobileDevice ? 'mobile' : 'desktop'}
              ref={videoRef}
              className={styles.videoBackground}
              muted
              playsInline
              preload="auto"
            >
              <source src={isMobileDevice ? "/video/ipb-intro-m.webm" : "/video/ipb-intro.webm"} type="video/webm" />
              <source src={isMobileDevice ? "/video/ipb-intro-m.mp4" : "/video/ipb-intro.mp4"} type="video/mp4" />
              Il tuo browser non supporta il tag video.
            </video>
            {showIntro && (
              <div className={styles.introOverlayFade}>
                <Intro 
                  onSpeakingEnd={onSpeakingEnd} 
                  hasSpeakingVideoPlayed={hasSpeakingVideoPlayed}
                  userActivatedAudio={userActivatedAudio}
                />
              </div>
            )}
            <div className={styles.contentContainer}>
              <SplitFlapAnimation
                text={titleText}
                className={`text-white text-left font-semibold drop-shadow-lg ${styles.mainTitle}`}
                visibleCount={visibleCount}
                onAnimationComplete={() => {
                  // Callback quando l'animazione del testo è completata
                  if (!textAnimationComplete) {
                    setTextAnimationComplete(true);
                  }
                }}
              />
            </div>
            <Header
              className={styles.header}
              style={{
                opacity: maxHeaderProgress,
                transform: `translateY(${(1 - maxHeaderProgress) * 100}%)`,
                pointerEvents: maxHeaderProgress > 0.98 ? 'auto' : 'none',
                transition: 'opacity 0.2s linear, transform 0.2s linear',
              }}
              onOpenPanel={onOpenPanel}
            />
            {!scrolled && (
              <div className={styles.scrollIcon}>
                <div className={styles.scrollText}>SCROLL</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing; 