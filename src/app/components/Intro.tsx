import React, { useState, useRef, useEffect } from 'react';
import styles from './Intro.module.css';

interface IntroProps {
  onSpeakingEnd?: () => void;
  hasSpeakingVideoPlayed?: boolean;
}

const Intro: React.FC<IntroProps> = ({ onSpeakingEnd, hasSpeakingVideoPlayed }) => {
  const [videoMode, setVideoMode] = useState<'voice' | 'background'>(
    hasSpeakingVideoPlayed ? 'background' : 'voice'
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const introContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [detectionComplete, setDetectionComplete] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
      setIsMobile(window.innerWidth <= 768 || isMobileDevice);
      setDetectionComplete(true); // La verifica è completa
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleVoiceVideoEnd = () => {
    setVideoMode('background');
    onSpeakingEnd?.(); // Comunica la fine del video
  };

  // Effetto Parallasse per il video di background
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoMode !== 'background' || !videoEl) return;

    const handleParallax = () => {
      const container = introContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      
      // Quando il container inizia a uscire dalla parte superiore della viewport
      if (rect.top < 0) {
        const scrollDistance = -rect.top;
        const parallaxAmount = scrollDistance * 0.6; // Aumentato per più visibilità
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const logVideoSource = () => {
      if (video) {
        console.log(`[Intro] Video caricato: ${video.currentSrc}`);
      }
    };
    video.addEventListener('canplay', logVideoSource);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          video.play().catch(error => {
            console.error("Video play failed on intersection:", error);
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      if (video) {
        video.removeEventListener('canplay', logVideoSource);
      }
      observer.disconnect();
    };
  }, [videoMode]); // Ricarica l'observer quando il video cambia

  const videoSrcMp4 = videoMode === 'voice'
    ? (isMobile ? '/video/ipb-speaking-m.mp4' : '/video/ipb-speaking.mp4')
    : (isMobile ? '/video/ipb-background-2-m.mp4' : '/video/ipb-background-2.mp4');

  const videoSrcWebm = videoMode === 'voice'
    ? (isMobile ? '/video/ipb-speaking-m.webm' : '/video/ipb-speaking.webm')
    : (isMobile ? '/video/ipb-background-2-m.webm' : '/video/ipb-background-2.webm');

  return (
    <div className={styles.introContainer} ref={introContainerRef}>
      {detectionComplete && (
        <video
          key={`${videoMode}-${isMobile ? 'mobile' : 'desktop'}`} // Forza il re-mount anche al cambio di device
          ref={videoRef}
          className={styles.introVideo}
          onEnded={videoMode === 'voice' ? handleVoiceVideoEnd : undefined}
          loop={videoMode === 'background'}
          muted={videoMode === 'background'}
          autoPlay
          playsInline
        >
          <source src={videoSrcWebm} type="video/webm" />
          <source src={videoSrcMp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default Intro; 