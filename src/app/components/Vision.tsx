'use client';

import React, { useRef } from 'react';
import styles from './Vision.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const KEYWORDS_ROW1 = [
  'Prompt Craft', 'Immaginazione', 'AI Vision', 'Realtime Creation'
];
const KEYWORDS_ROW2 = [
  'Augmented Creativity', 'Creatività', 'Prompt vs Prompt', 'Duello'
];
const KEYWORDS_ROW3 = [
  'Battle', 'Prompting', 'Visual Syntax', 'Prompt'
];

const MarqueeRow = ({ keywords, direction }: { keywords: string[], direction: 'left' | 'right' }) => (
  <div className={`${styles.marqueeRow} ${direction === 'left' ? styles.left : styles.right}`}>
    <div className={styles.marqueeContent}>
      {[...keywords, ...keywords].map((keyword, index) => (
        <span key={index} className={styles.keywordItem}>
          {keyword} <span className={styles.separator}>/</span>
        </span>
      ))}
    </div>
  </div>
);

const Vision: React.FC = () => {
  const visionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: visionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      }
    });

    tl.from(visionRef.current, {
        scale: 0.8,
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'power3.out'
    })
    .to(visionRef.current, {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power3.inOut'
    });

  }, { scope: visionRef });

  return (
    <section className={styles.visionContainer} ref={visionRef}>
      <div className={styles.textContainer}>
        <div className={styles.leftColumn}>
          <h2 className={styles.title}>ITALIAN<br/>PROMPT<br/>BATTLE</h2>
        </div>
        <div className={styles.rightColumn}>
          <p className={styles.description}>
          Non è una gara di immagini.<br/>È un linguaggio in codice.<br/>
          Dove il tempo conta e la visione si trasforma in impatto.<br/>
          <strong>Artisti, creativə e AI si sfidano generando immagini uniche</strong>, davanti a un pubblico vivo.
          </p>
        </div>
      </div>

      <div className={styles.marqueeContainer}>
        <MarqueeRow keywords={KEYWORDS_ROW1} direction="left" />
        <MarqueeRow keywords={KEYWORDS_ROW2} direction="right" />
        <MarqueeRow keywords={KEYWORDS_ROW3} direction="left" />
      </div>
    </section>
  );
};

export default Vision; 