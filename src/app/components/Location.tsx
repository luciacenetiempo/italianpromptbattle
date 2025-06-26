'use client'

import React, { useRef } from 'react';
import styles from './Location.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ctaStyles from './Cta.module.css';
import CanvasHeartCube from './CanvasHeartCube';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FormType = 'registration' | 'sponsorship' | 'newsletter' | 'attendee';

interface LocationProps {
  onOpenPanel?: (formType: FormType) => void;
}

const Location: React.FC<LocationProps> = ({ onOpenPanel }) => {
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
        <CanvasHeartCube size={250} />
      </div>
      <div className={styles.right}>
        <div className={styles.textBlock} ref={contentRef}>
          <span className={styles.firstLine}>hai una location?</span>
          <div className={styles.secondLineWrapper}>
            <button 
              className={ctaStyles.ctaEmail}
              onClick={() => onOpenPanel?.('sponsorship')}
            >
              <span>Scrivici!</span>
              <span className={ctaStyles.ctaArrow}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12H16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 9L16 12L13 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <span className={styles.secondLineText}>ospita la prima</span>
          </div>
          <div className={styles.thirdLineWrapper}>
            <span className={styles.thirdLineText}>prompt battle</span>
            <span className={styles.detailsText}>entrerai a<br/>far parte<br/>della storia</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location; 