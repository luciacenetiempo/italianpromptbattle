import React, { useRef } from 'react';
import Image from 'next/image';
import styles from './Place.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDevice } from './DeviceContext';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface PlaceProps {
  onScrollToForm?: () => void;
}

const Place: React.FC<PlaceProps> = ({ onScrollToForm }) => {
  const placeRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Utilizza il context per rilevare il dispositivo
  const { isMobile, isMobileDetected } = useDevice();
  const isMobileDevice = isMobile || isMobileDetected;

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: placeRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      }
    });

    tl.from(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'power3.out'
    })
    .to(contentRef.current, {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power3.inOut'
    });
  }, { scope: placeRef });

  return (
    <section className={styles.placeSection} ref={placeRef}>
      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        key={isMobileDevice ? 'mobile' : 'desktop'}
      >
        <source src="/video/ipb-milano.mp4" type="video/mp4" />
        Il tuo browser non supporta il tag video.
      </video>
      <div className={styles.overlay}>
        <div className={styles.contentBox} ref={contentRef}>
          <h2 className={styles.title}>
          MILANO<br/>04 DICEMBRE<br/>2025
          </h2>
          <div className={styles.venueInfo}>
            <Image 
              src="/assets/img/logo_tag.png" 
              alt="Talent Garden Calabiana" 
              className={styles.logo}
              width={220}
              height={100}
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            />
            <p className={styles.description}>
            Il luogo è stato scelto.<br/>Dove la luce incontra la creatività,<br/>lì nascerà la prima Italian Prompt Battle.
            </p>
          </div>
          <button 
            className={styles.ctaButton}
            onClick={() => {
              // Tracking Google Analytics
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'click_iscriviti', {
                  'event_category': 'interazione',
                  'event_label': 'cta_place_form',
                  'value': 1
                });
              }
              onScrollToForm?.();
            }}
          >
            Partecipa all&apos;evento
          </button>
        </div>
      </div>
    </section>
  );
};

export default Place; 