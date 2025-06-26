'use client';

import React, { useRef, useEffect, useState } from 'react';
import Header from './Header';
import styles from './Landing.module.css';
import SplitFlapAnimation from './SplitFlapAnimation';
import Preloader from './Preloader';
import Intro from './Intro';
import Head from 'next/head';

interface LandingProps {
  onSpeakingEnd: () => void;
  hasSpeakingVideoPlayed: boolean;
  onOpenPanel?: (formType: 'registration' | 'sponsorship' | 'newsletter' | 'attendee') => void;
}

const Landing: React.FC<LandingProps> = ({ onSpeakingEnd, hasSpeakingVideoPlayed, onOpenPanel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const songAudioRef = useRef<HTMLAudioElement>(null);
  const [scrollFraction, setScrollFraction] = useState(0);
  const [preloader, setPreloader] = useState(true);
  const [audioChoice, setAudioChoice] = useState<null | boolean>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isSongPlaying, setIsSongPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [maxHeaderProgress, setMaxHeaderProgress] = useState(0);

  useEffect(() => {
    const checkIsMobile = () => {
      // Considera anche l'user agent per una detección più affidabile
      const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
      setIsMobile(window.innerWidth <= 768 || isMobileDevice);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

      // Ottimizzazione: aggiorna lo stato solo se il valore cambia
      const newScrolled = scrollTop > 10;
      setScrolled(prev => (prev !== newScrolled ? newScrolled : prev));

      const introThreshold = 1;
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
  }, [isMobile]);

  // Timeout per fallback dopo 10s
  useEffect(() => {
    if (audioChoice === null) {
      const t = setTimeout(() => setAudioChoice(false), 100000);
      return () => clearTimeout(t);
    }
  }, [audioChoice]);

  // useEffect che gestisce la musica di sottofondo
  useEffect(() => {
    const audio = songAudioRef.current;
    if (!audio) return;

    // L'audio parte solo se: consenso dato, preloader finito, E la musica non è in pausa
    if (audioChoice === true && !preloader && isSongPlaying) {
      audio.play().catch(error => {
        console.error("Background song play failed:", error);
      });
    } else {
      audio.pause();
    }
  }, [preloader, audioChoice, isSongPlaying]); // Aggiunta dipendenza

  const handleToggleSong = () => {
    setIsSongPlaying(!isSongPlaying);
  };

  const titleText = "Qualcosa di nuovo\nsta per succedere";
  const totalChars = titleText.replace(/\n/g, '').length;
  const visibleCount = Math.floor(scrollFraction * totalChars);
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
        <link rel="preload" as="video" href={isMobile ? "/video/ipb-background-2-m.webm" : "/video/ipb-background-2.webm"} type="video/webm" />
        <link rel="preload" as="video" href={isMobile ? "/video/ipb-background-2-m.mp4" : "/video/ipb-background-2.mp4"} type="video/mp4" />
        <link rel="preload" as="video" href={isMobile ? "/video/ipb-intro-m.webm" : "/video/ipb-intro.webm"} type="video/webm" />
        <link rel="preload" as="video" href={isMobile ? "/video/ipb-intro-m.mp4" : "/video/ipb-intro.mp4"} type="video/mp4" />
        <link rel="preload" as="video" href={isMobile ? "/video/ipb-speaking-m.webm" : "/video/ipb-speaking.webm"} type="video/webm" />
        <link rel="preload" as="video" href={isMobile ? "/video/ipb-speaking-m.mp4" : "/video/ipb-speaking.mp4"} type="video/mp4" />
      </Head>
      <div style={{ background: '#000', position: 'relative' }}>
        <audio ref={songAudioRef} src="/assets/audio/song.mp3" loop />

        {/* Pulsante Pausa/Play Musica */}
        {audioChoice === true && !preloader && (
          <button onClick={handleToggleSong} className={styles.musicControlButton} aria-label={isSongPlaying ? 'Pausa musica' : 'Riproduci musica'}>
            {isSongPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            )}
          </button>
        )}

        {audioChoice === null && (
          <div className={styles.audioChoiceOverlay}>
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
                <button className={styles.audioBtn} onClick={() => setAudioChoice(true)}>Sì</button>
                <button className={styles.audioBtn} onClick={() => setAudioChoice(false)}>No</button>
              </div>
            </div>
          </div>
        )}
        {audioChoice !== null && preloader && (
          <Preloader onFinish={() => setPreloader(false)} playAudio={audioChoice} />
        )}
        <div ref={scrollContainerRef} className={styles.scrollContainer}>
          <div className={styles.stickyContainer}>
            <video
              key={isMobile ? 'mobile' : 'desktop'}
              ref={videoRef}
              className={styles.videoBackground}
              muted
              playsInline
              preload="auto"
            >
              <source src={isMobile ? "/video/ipb-intro-m.webm" : "/video/ipb-intro.webm"} type="video/webm" />
              <source src={isMobile ? "/video/ipb-intro-m.mp4" : "/video/ipb-intro.mp4"} type="video/mp4" />
              Il tuo browser non supporta il tag video.
            </video>
            {showIntro && (
              <div className={styles.introOverlayFade}>
                <Intro onSpeakingEnd={onSpeakingEnd} hasSpeakingVideoPlayed={hasSpeakingVideoPlayed} />
              </div>
            )}
            <div className={styles.contentContainer}>
              <SplitFlapAnimation
                text={titleText}
                className={`text-white text-left font-semibold drop-shadow-lg ${styles.mainTitle}`}
                visibleCount={visibleCount}
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
            {!preloader && (
              <div className={`${styles.scrollIcon} ${scrolled ? styles.hidden : ''}`}>
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