'use client'

import React, { useRef } from 'react';
import styles from './Location.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FormType = 'registration' | 'sponsorship' | 'newsletter' | 'attendee';

interface LocationProps {
  onOpenPanel?: (formType: FormType) => void;
  onScrollToForm?: () => void;
}

const Location: React.FC<LocationProps> = ({ onOpenPanel, onScrollToForm }) => {
    const locationRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: locationRef.current,
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
    }, { scope: locationRef });

  return (
    <section className={styles.locationSection} ref={locationRef}>
      <div className={styles.left}>
        <img 
          src="/assets/img/venue.png" 
          alt="Talent Garden Calabiana" 
          className={styles.venueImage}
        />
      </div>
      <div className={styles.right}>
        <div className={styles.contentBlock} ref={contentRef}>
          <div className={styles.logoContainer}>
            <img 
              src="/assets/img/logo_tag.png" 
              alt="Talent Garden" 
              className={styles.logo}
            />
          </div>
          <h2 className={styles.title}>TALENT GARDEN CALABIANA</h2>
          <p className={styles.address}>Via Arcivescovo Calabiana, 6, 20139 Milano MI</p>
          <div className={styles.message}>
            <p className={styles.messageLine}>ABBIAMO VARCATO LA SOGLIA.</p>
            <p className={styles.messageLine}>LA GREEN HOUSE DEL TALENT GARDEN</p>
            <p className={styles.messageLine}>È DIVENTATA LA NOSTRA CASA.</p>
          </div>
          <button 
            className={styles.ctaButton}
            onClick={() => {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'click_iscriviti', {
                  'event_category': 'interazione',
                  'event_label': 'cta_location_form',
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

export default Location; 