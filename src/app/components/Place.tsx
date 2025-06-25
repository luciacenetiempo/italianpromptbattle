import React, { useRef } from 'react';
import styles from './Place.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Place: React.FC = () => {
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
          <button className={styles.button}>
          ↗ SEGNALA UNO SPAZIO PERFETTO
          </button>
        </div>
      </div>
    </section>
  );
};

export default Place; 