import React, { useRef } from 'react';
import styles from './Place.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ctaStyles from './Cta.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FormType = 'registration' | 'sponsorship' | 'newsletter' | 'attendee';

interface PlaceProps {
  onOpenPanel?: (formType: FormType) => void;
}

const Place: React.FC<PlaceProps> = ({ onOpenPanel }) => {
  const placeRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
        poster="/video/ipb-background-2.jpg"
      >
        <source src="/video/ipb-milano.webm" type="video/webm" />
        <source src="/video/ipb-milano.mp4" type="video/mp4" />
        Il tuo browser non supporta il tag video.
      </video>
      <div className={styles.overlay}>
        <div className={styles.contentBox} ref={contentRef}>
          <h2 className={styles.title}>
          MILANO<br/>NOVEMBRE<br/>2025
          </h2>
          <div className={styles.venueInfo}>
            <p className={styles.description}>
            Stiamo scegliendo il luogo perfetto dove visione e materia si incontrano.<br/>
            Vuoi esserci tra i primi a saperlo?
            </p>
          </div>
          <button 
            className={ctaStyles.ctaEmail}
            onClick={() => onOpenPanel?.('sponsorship')}
          >
            <span>↗ SEGNALA UNO SPAZIO PERFETTO</span>
            <span className={ctaStyles.ctaArrow}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 9L16 12L13 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Place; 