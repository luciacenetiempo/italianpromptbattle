'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './SplitFlap.module.css';

const BRAND_COLORS = [
  '#dcaf6c', // Oro
  '#c5a289', // Marrone chiaro
  '#8d81d5', // Viola
  '#847ce2', // Viola chiaro
  '#dc6f5a', // Arancione/Rosso
];

interface SplitFlapAnimationProps {
  text: string;
  className?: string;
  visibleCount?: number;
  onAnimationComplete?: () => void;
}

const FLAP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*#@&'.split('');

const SplitFlapAnimation: React.FC<SplitFlapAnimationProps> = ({
  text,
  className,
  visibleCount,
  onAnimationComplete,
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const animatedIndicesRef = useRef<Set<number>>(new Set());
  const hasCompletedRef = useRef(false);
  const [glitchingIndices, setGlitchingIndices] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Rileva se siamo su mobile per ottimizzare le performance
  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
      setIsMobile(window.innerWidth <= 768 || isMobileDevice);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Effetto Glitch
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (typeof visibleCount !== 'number' || visibleCount === 0) return;

      // Riduci la frequenza del glitch su mobile per migliorare le performance
      const glitchProbability = isMobile ? 0.3 : 0.7; // 30% su mobile, 70% su desktop
      
      if (Math.random() > glitchProbability) {
        const newGlitching = new Set<number>();
        // Riduci il numero di lettere che glitchano su mobile
        const maxGlitchCount = isMobile ? 2 : 3;
        const glitchCount = Math.floor(Math.random() * maxGlitchCount) + 1;
        
        for (let i = 0; i < glitchCount; i++) {
          const randomIndex = Math.floor(Math.random() * visibleCount);
          newGlitching.add(randomIndex);
        }
        
        setGlitchingIndices(newGlitching);

        // Riduci la durata del glitch su mobile
        const glitchDuration = isMobile ? Math.random() * 100 + 50 : Math.random() * 200 + 100;
        setTimeout(() => {
          setGlitchingIndices(new Set());
        }, glitchDuration);
      }
    }, isMobile ? 1200 : 800); // Intervallo più lungo su mobile

    return () => clearInterval(glitchInterval);
  }, [visibleCount, isMobile]);

  useEffect(() => {
    if (typeof visibleCount !== 'number' || visibleCount < 0) return;

    const spans = containerRef.current?.querySelectorAll('span');
    if (!spans) return;

    // Anima solo le lettere nuove
    for (let i = 0; i < visibleCount; i++) {
      if (animatedIndicesRef.current.has(i)) continue;

      animatedIndicesRef.current.add(i);
      const span = spans[i];
      if (!span) continue;

      const originalChar = span.getAttribute('data-char');
      if (!originalChar || originalChar === '\u00A0') continue;

      let frame = 0;
      const flap = () => {
        const randomChar = FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
        span.textContent = randomChar;
        
        // Riduci il numero di frame su mobile per migliorare le performance
        const maxFrames = isMobile ? 3 : 5;
        const additionalFrames = isMobile ? Math.random() * 3 : Math.random() * 5;
        
        if (frame > maxFrames + additionalFrames) {
          span.textContent = originalChar;
          span.classList.add(styles.final);
          return;
        }
        frame++;
        // Riduci l'intervallo tra i frame su mobile
        const frameInterval = isMobile ? 80 : 60;
        setTimeout(flap, frameInterval);
      };
      // Riduci il delay iniziale su mobile
      const initialDelay = isMobile ? Math.random() * 100 : Math.random() * 200;
      setTimeout(flap, initialDelay);
    }

    // Nascondi le lettere che non sono più visibili (scroll indietro)
    for (let i = visibleCount; i < spans.length; i++) {
      if (animatedIndicesRef.current.has(i)) {
        animatedIndicesRef.current.delete(i);
        const span = spans[i];
        if (span) {
          span.textContent = span.getAttribute('data-char');
          span.classList.remove(styles.final);
        }
      }
    }

    // Callback quando tutte le lettere sono animate
    if (
      typeof visibleCount === 'number' &&
      spans.length > 0 &&
      visibleCount >= spans.length &&
      onAnimationComplete &&
      !hasCompletedRef.current
    ) {
      hasCompletedRef.current = true;
      onAnimationComplete();
    } else if (typeof visibleCount === 'number' && visibleCount < spans.length) {
      hasCompletedRef.current = false;
    }
  }, [visibleCount, text, onAnimationComplete, isMobile]);

  return (
    <h1 ref={containerRef} className={className}>
      {(() => {
        let charIndex = 0;
        return text.split(/(\n)/g).map((part, i) => {
          if (part === '\n') {
            return <br key={`br-${i}`} />;
          }
          if (part === '') return null;
          return (
            <React.Fragment key={`line-${i}`}>
              {part.split('').map((char, j) => {
                charIndex++;
                const isVisible =
                  typeof visibleCount === 'number' && charIndex <= visibleCount;
                const isFlap =
                  typeof visibleCount === 'number' && charIndex === visibleCount;
                
                let finalClassName = styles.flapChar;
                if (glitchingIndices.has(charIndex - 1)) {
                  finalClassName = `${styles.flapChar} ${styles.glitch}`;
                }

                return (
                  <span
                    key={`${i}-${j}`}
                    className={finalClassName}
                    data-char={char === ' ' ? '\u00A0' : char}
                    style={{
                      visibility: isVisible ? 'visible' : 'hidden',
                      // Applica un colore brand casuale al glitch
                      color: glitchingIndices.has(charIndex - 1)
                        ? BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)]
                        : 'inherit',
                    }}
                  >
                    {isFlap ? '' : char === ' ' ? '\u00A0' : char}
                  </span>
                );
              })}
            </React.Fragment>
          );
        });
      })()}
    </h1>
  );
};

export default SplitFlapAnimation; 