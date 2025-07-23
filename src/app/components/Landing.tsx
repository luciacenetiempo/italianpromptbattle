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

  const [scrollFraction, setScrollFraction] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [maxHeaderProgress, setMaxHeaderProgress] = useState(0);
  const [textAnimationComplete, setTextAnimationComplete] = useState(false);
  const animationStartTimeRef = useRef<number | null>(null);
  
  // Utilizza il context per rilevare il dispositivo
  const { isMobile, isMobileDetected } = useDevice();
  const isMobileDevice = isMobile || isMobileDetected;

  // Ref per l'animazione fluida
  const targetTimeRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Logica diversa per mobile e desktop
    if (isMobileDevice) {
      // MOBILE: Video in autoplay, scroll automatico alla fine
      const onMetadataLoaded = () => {
        video.play().catch(error => {
          console.error("Video autoplay failed:", error);
        });
      };

      const onVideoEnded = () => {
        // Scroll automatico fino alla fine per mostrare l'intro
        const el = scrollContainerRef.current;
        if (el) {
          const scrollableHeight = el.scrollHeight - window.innerHeight;
          window.scrollTo({
            top: scrollableHeight,
            behavior: 'smooth'
          });
        }
        setShowIntro(true);
        setScrollFraction(1); // Imposta scrollFraction a 1 quando il video finisce
      };

      const onTimeUpdate = () => {
        // Aggiorna scrollFraction basandolo sul progresso del video
        if (video.duration) {
          const videoProgress = video.currentTime / video.duration;
          setScrollFraction(videoProgress);
        }
      };

      if (video.readyState > 0) {
        onMetadataLoaded();
      } else {
        video.addEventListener('loadedmetadata', onMetadataLoaded);
      }

      video.addEventListener('ended', onVideoEnded);
      video.addEventListener('timeupdate', onTimeUpdate);

      return () => {
        video.removeEventListener('loadedmetadata', onMetadataLoaded);
        video.removeEventListener('ended', onVideoEnded);
        video.removeEventListener('timeupdate', onTimeUpdate);
      };
    } else {
      // DESKTOP: Logica originale con scroll controllato
      let lastScrollTime = 0;
      const scrollThrottle = 16; // ~60fps

      const handleScroll = () => {
        const now = Date.now();
        if (now - lastScrollTime < scrollThrottle) return;
        lastScrollTime = now;

        const el = scrollContainerRef.current;
        if (!el) return;
        
        const scrollableHeight = el.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) return;

        const scrollTop = window.scrollY;
        const currentScrollFraction = Math.min(1, scrollTop / scrollableHeight);
        
        // Aggiorna immediatamente durante lo scroll per fluidità
        setScrollFraction(currentScrollFraction);

        // Debug log ridotto
        if (currentScrollFraction % 0.1 < 0.01) {
        }

        // Ottimizzazione: aggiorna lo stato solo se il valore cambia
        const newScrolled = scrollTop > 10;
        setScrolled(prev => (prev !== newScrolled ? newScrolled : prev));

        // Riduci il threshold per mostrare l'intro più facilmente
        const introThreshold = 0.95;
        const newShowIntro = currentScrollFraction >= introThreshold;
        setShowIntro(prev => (prev !== newShowIntro ? newShowIntro : prev));

        if (isFinite(video.duration)) {
          targetTimeRef.current = video.duration * currentScrollFraction;
        }
      };

      const smoothAnimate = () => {
        if (video.readyState > 1 && Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
          video.currentTime = targetTimeRef.current;
        }
        animationFrameRef.current = requestAnimationFrame(smoothAnimate);
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
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
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

  // Fallback per mostrare l'intro se l'utente non scrolla completamente (solo desktop)
  useEffect(() => {
    if (!isMobileDevice && !showIntro && scrollFraction > 0.5) {
      // Se l'utente ha scrollato più del 50% ma non ha ancora raggiunto il threshold,
      // mostra l'intro dopo 5 secondi (solo su desktop)
      const timeout = setTimeout(() => {
        if (!showIntro) {
          setShowIntro(true);
        }
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [showIntro, scrollFraction, isMobileDevice]);



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


        <div ref={scrollContainerRef} className={styles.scrollContainer}>
          <div className={styles.stickyContainer}>
            <video
              ref={videoRef}
              key={isMobileDevice ? 'mobile' : 'desktop'}
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