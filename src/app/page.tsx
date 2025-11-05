'use client';

import React, { useRef, useEffect } from 'react';
import styles from './HomePage.module.css';
import Vision from './components/Vision';
import AttendeeSection from './components/AttendeeSection';
import Place from './components/Place';
import Location from './components/Location';
import ChiSiamo from './components/ChiSiamo';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const formSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    };

    if (video.readyState > 0) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const scrollToForm = () => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <div className={styles.heroSection}>
        <video
          ref={videoRef}
          className={styles.heroVideo}
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/video/ipb-background-2.webm" type="video/webm" />
          <source src="/video/ipb-background-2.mp4" type="video/mp4" />
          Il tuo browser non supporta il tag video.
        </video>
        <div className={styles.logoContainer}>
          <img 
            src="/assets/SVG/logo-w.svg" 
            alt="Italian Prompt Battle" 
            className={styles.logo}
          />
        </div>
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            <div className={styles.cityText}>MILANO</div>
            <div className={styles.dateText}>04 DICEMBRE 2025</div>
            <div className={styles.locationText}>TALENT GARDEN CALABIANA</div>
            <button 
              className={styles.ctaButton}
              onClick={scrollToForm}
            >
              Partecipa all&apos;evento
            </button>
          </div>
        </div>
      </div>
      <Vision noSticky={true} />
      <Place onScrollToForm={scrollToForm} />
      <Location onScrollToForm={scrollToForm} />
      <ChiSiamo />
      <AttendeeSection ref={formSectionRef} />
    </>
  );
}
