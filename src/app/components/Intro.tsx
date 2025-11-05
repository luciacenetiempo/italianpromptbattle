import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Intro.module.css';
import { useDevice } from './DeviceContext';

interface IntroProps {
  onSpeakingEnd?: () => void;
  hasSpeakingVideoPlayed?: boolean;
}

const Intro: React.FC<IntroProps> = ({ onSpeakingEnd, hasSpeakingVideoPlayed }) => {
  // Utilizza il context per rilevare il dispositivo
  const { isMobile, isMobileDetected, audioEnabled } = useDevice();
  const isMobileDevice = isMobile || isMobileDetected;
  
  // L'audio è abilitato se è stato scelto inizialmente
  const isAudioEnabled = audioEnabled;
  
  const [videoMode, setVideoMode] = useState<'voice' | 'background'>(
    // Se l'audio è disattivato, vai direttamente al background
    // Altrimenti, se il video speaking è già stato riprodotto, vai al background
    // Altrimenti, inizia con il video speaking
    (hasSpeakingVideoPlayed || (!isAudioEnabled)) ? 'background' : 'voice'
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const introContainerRef = useRef<HTMLDivElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const playAttemptRef = useRef<number | null>(null);

  const handleVoiceVideoEnd = useCallback(() => {
    setVideoMode('background');
    onSpeakingEnd?.();
  }, [onSpeakingEnd]);

  // Gestione robusta del play del video
  const attemptPlay = useCallback(async () => {
    const video = videoRef.current;
    
    if (!video || !isVideoReady || hasStartedPlaying) {
      return;
    }

    try {
      // Cancella eventuali tentativi precedenti
      if (playAttemptRef.current) {
        clearTimeout(playAttemptRef.current);
      }

      
      // Aspetta un frame per assicurarsi che il video sia pronto
      await new Promise(resolve => {
        playAttemptRef.current = window.setTimeout(resolve, 16);
      });

      // Avvia il video direttamente
      await video.play();
      setHasStartedPlaying(true);
    } catch (error) {
      console.error('[Intro] Errore nel play del video:', error);
      
      // Riprova dopo un breve delay
      setTimeout(() => {
        if (!hasStartedPlaying) {
          attemptPlay();
        }
      }, 1000);
    }
  }, [isVideoReady, hasStartedPlaying]);

  // Gestione degli eventi del video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoReady(true);
    };

    const handlePlay = () => {
    };

    const handlePause = () => {
    };

    const handleEnded = () => {
      if (videoMode === 'voice') {
        handleVoiceVideoEnd();
      }
    };

    const handleError = (e: Event) => {
      console.error('[Intro] Errore nel video:', e);
    };

    const handleWaiting = () => {
    };

    const handleCanPlayThrough = () => {
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [videoMode, hasStartedPlaying, handleVoiceVideoEnd]);

  // Effetto separato per avviare il video speaking quando è pronto
  useEffect(() => {
    if (videoMode === 'voice' && isVideoReady && !hasStartedPlaying) {
      attemptPlay();
    }
  }, [videoMode, isVideoReady, hasStartedPlaying, attemptPlay]);

  // Intersection Observer migliorato
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoMode !== 'background') return;

    // Disconnetti observer precedente
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Solo per il video di background, non per il video speaking
          if (videoMode === 'background' && isVideoReady) {
            video.play().catch(error => {
              console.error("[Intro] Video background play failed:", error);
            });
          }
        } else {
          // Non pausare mai il video speaking una volta iniziato
          if (videoMode === 'background') {
            video.pause();
          }
        }
      },
      { 
        threshold: 0.3, // Ridotto da 0.5 a 0.3 per essere meno aggressivo
        rootMargin: '50px' // Aggiunge un margine per evitare pause premature
      }
    );

    observerRef.current = observer;
    observer.observe(video);

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [videoMode, isVideoReady]);

  // Reset quando cambia il video
  useEffect(() => {
    setIsVideoReady(false);
    setHasStartedPlaying(false);
    
    if (playAttemptRef.current) {
      clearTimeout(playAttemptRef.current);
      playAttemptRef.current = null;
    }
  }, [videoMode, hasSpeakingVideoPlayed]);

  // Effetto Parallasse per il video di background
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoMode !== 'background' || !videoEl) return;

    const handleParallax = () => {
      const container = introContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      
      if (rect.top < 0) {
        const scrollDistance = -rect.top;
        const parallaxAmount = scrollDistance * 0.6;
        const opacity = Math.max(0, 1 - (scrollDistance / rect.height));
        
        videoEl.style.transform = `translateY(${parallaxAmount}px)`;
        videoEl.style.opacity = `${opacity}`;
      } else {
        videoEl.style.transform = 'translateY(0px)';
        videoEl.style.opacity = '1';
      }
    };
    
    window.addEventListener('scroll', handleParallax, { passive: true });
    return () => window.removeEventListener('scroll', handleParallax);
  }, [videoMode]);

  // Sblocca lo scroll subito se si parte direttamente con il background (audio disattivato)
  useEffect(() => {
    if (videoMode === 'background' && !isAudioEnabled) {
      onSpeakingEnd?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback: se l'audio è attivo e siamo in modalità 'voice', sblocca lo scroll dopo 3 secondi
  useEffect(() => {
    if (videoMode === 'voice' && isAudioEnabled) {
      const timeout = setTimeout(() => {
        onSpeakingEnd?.();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [videoMode, isAudioEnabled, onSpeakingEnd]);

  const videoSrcMp4 = videoMode === 'voice'
    ? (isMobileDevice ? '/video/ipb-speaking-m.mp4' : '/video/ipb-speaking.mp4')
    : (isMobileDevice ? '/video/ipb-background-2-m.mp4' : '/video/ipb-background-2.mp4');

  const videoSrcWebm = videoMode === 'voice'
    ? (isMobileDevice ? '/video/ipb-speaking-m.webm' : '/video/ipb-speaking.webm')
    : (isMobileDevice ? '/video/ipb-background-2-m.webm' : '/video/ipb-background-2.webm');

  return (
    <div className={styles.introContainer} ref={introContainerRef}>
      <video
        key={`${videoMode}-${isMobileDevice ? 'mobile' : 'desktop'}`}
        ref={videoRef}
        className={styles.introVideo}
        onEnded={videoMode === 'voice' ? handleVoiceVideoEnd : undefined}
        loop={videoMode === 'background'}
        muted={videoMode === 'background' || !isAudioEnabled}
        preload="auto"
        playsInline
      >
        <source src={videoSrcWebm} type="video/webm" />
        <source src={videoSrcMp4} type="video/mp4" />
      </video>
    </div>
  );
};

export default Intro; 