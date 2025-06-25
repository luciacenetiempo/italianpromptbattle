import React, { useRef } from 'react';
import styles from './Target.module.css';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MARQUEE_TEXT = [
  'Visual Artist',
  'Prompt Designer',
  'Creative Director',
  'Copywriter',
  'Motion Designer',
  'VJ',
  'UX/UI Designer',
  'AI Enthusiast',
  'Photographer',
  'Performer',
  'Game Artist',
  'Curatorə',
  'Art Hacker',
  'Spectator',
  'Concept Artist',
  'Digital Dreamer'
]


const MarqueeRow = () => (
  <div className={styles.marqueeRow}>
    <div className={styles.marqueeContent}>
      {MARQUEE_TEXT.map((text, idx) => (
        <span key={idx} className={styles.marqueeItem}>
          {text} <span className={styles.separator}>•</span>
        </span>
      ))}
    </div>
  </div>
);

const Target: React.FC = () => {
  const targetRef = useRef<HTMLElement>(null);
  const silhouetteRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: targetRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      }
    });

    tl.from([silhouetteRef.current, contentRef.current], {
        scale: 0.8,
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'power3.out',
        stagger: 0.2
    })
    .to([silhouetteRef.current, contentRef.current], {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power3.inOut',
        stagger: 0.2
    });
  }, { scope: targetRef });

  return (
    <section className={styles.targetSection} ref={targetRef}>
      {/* Marquee in alto, assoluto */}
      <div className={styles.marqueeWrapper}>
        <MarqueeRow />
      </div>
      {/* Statua centrale assoluta */}
      <div className={styles.silhouetteWrapper} ref={silhouetteRef}>
        <Image src="/assets/img/ipb-sil.webp" alt="Silhouette" fill priority className={styles.silhouette} />
      </div>
      {/* Colonne contenuto */}
      <div className={styles.contentColumns} ref={contentRef}>
        <div className={styles.left}>
          <div className={styles.descriptionBox}>
            <h2>Raccogli la sfida!</h2>
            <p>Call aperta a chi ha visione, intuito, voglia di mettersi in gioco.</p>
            <p>Conta l&apos;audacia creativa, il desiderio di esplorare, la capacità di evocare mondi con le parole.<br/>Che tu lavori con le immagini, con il testo o con le idee...</p>
            <p><strong>Questo spazio ti appartiene!</strong></p>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightText}>
          La creatività<br/>non ha un ruolo...<br/>Ha coraggio!
          </div>
          <button className={styles.ctaButton}>
            ↗ Preiscriviti alla battle
          </button>
        </div>
      </div>
    </section>
  );
};

export default Target; 