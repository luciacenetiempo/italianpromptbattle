'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './Vision.module.css';

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
  const [isVisible, setIsVisible] = useState(false);
  const visionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // L'animazione si esegue una sola volta
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.6, // Triggera quando il 60% è visibile per un timing migliore
      }
    );

    if (visionRef.current) {
      observer.observe(visionRef.current);
    }

    return () => {
      if (visionRef.current) {
        observer.unobserve(visionRef.current);
      }
    };
  }, []);

  return (
    <section className={styles.visionContainer} ref={visionRef}>
      <div className={styles.textContainer}>
        <div className={styles.leftColumn}>
          <h2 className={`${styles.title} ${isVisible ? styles.animateTitle : ''}`}>ITALIAN<br/>PROMPT<br/>BATTLE</h2>
        </div>
        <div className={styles.rightColumn}>
          <p className={`${styles.description} ${isVisible ? styles.animateDescription : ''}`}>
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