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

interface AndromedaQuoteAnimationProps {
  text: string;
  className?: string;
  onAnimationComplete?: () => void;
  autoStart?: boolean;
  animationDelay?: number;
  pauseOnComplete?: number;
}

const FLAP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*#@&'.split('');

const AndromedaQuoteAnimation: React.FC<AndromedaQuoteAnimationProps> = ({
  text,
  className,
  onAnimationComplete,
  autoStart = true,
  animationDelay = 0,
  pauseOnComplete = 0,
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const animatedIndicesRef = useRef<Set<number>>(new Set());
  const hasCompletedRef = useRef(false);
  const [glitchingIndices, setGlitchingIndices] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
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

  // Avvia l'animazione automatica
  useEffect(() => {
    if (!autoStart) return;

    const startAnimation = () => {
      setIsAnimating(true);
      animatedIndicesRef.current.clear();
      hasCompletedRef.current = false;
      
      const spans = containerRef.current?.querySelectorAll('span');
      if (!spans) return;

      // Anima tutte le lettere in sequenza
      spans.forEach((span, index) => {
        const originalChar = span.getAttribute('data-char');
        if (!originalChar || originalChar === '\u00A0') return;

        const delay = animationDelay + (index * 80); // 80ms tra ogni lettera
        
        setTimeout(() => {
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
              animatedIndicesRef.current.add(index);
              
              // Controlla se tutte le lettere sono state animate
              if (animatedIndicesRef.current.size === spans.length) {
                hasCompletedRef.current = true;
                
                // Aggiungi pausa se specificata
                if (pauseOnComplete > 0) {
                  setTimeout(() => {
                    if (onAnimationComplete) {
                      onAnimationComplete();
                    }
                  }, pauseOnComplete);
                } else {
                  if (onAnimationComplete) {
                    onAnimationComplete();
                  }
                }
              }
              return;
            }
            frame++;
            // Riduci l'intervallo tra i frame su mobile
            const frameInterval = isMobile ? 80 : 60;
            setTimeout(flap, frameInterval);
          };
          flap();
        }, delay);
      });
    };

    const timer = setTimeout(startAnimation, 500); // Piccolo delay iniziale
    return () => clearTimeout(timer);
  }, [text, autoStart, animationDelay, onAnimationComplete, isMobile, pauseOnComplete]);

  // Effetto Glitch durante l'animazione
  useEffect(() => {
    if (!isAnimating) return;

    const glitchInterval = setInterval(() => {
      // Riduci la frequenza del glitch su mobile per migliorare le performance
      const glitchProbability = isMobile ? 0.3 : 0.7; // 30% su mobile, 70% su desktop
      
      if (Math.random() > glitchProbability) {
        const newGlitching = new Set<number>();
        // Riduci il numero di lettere che glitchano su mobile
        const maxGlitchCount = isMobile ? 2 : 3;
        const glitchCount = Math.floor(Math.random() * maxGlitchCount) + 1;
        
        for (let i = 0; i < glitchCount; i++) {
          const randomIndex = Math.floor(Math.random() * text.length);
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
  }, [isAnimating, text.length, isMobile]);

  return (
    <p ref={containerRef} className={className}>
      {text.split('').map((char, index) => {
        let finalClassName = styles.flapChar;
        if (glitchingIndices.has(index)) {
          finalClassName = `${styles.flapChar} ${styles.glitch}`;
        }

        return (
          <span
            key={index}
            className={finalClassName}
            data-char={char === ' ' ? '\u00A0' : char}
            style={{
              // Applica un colore brand casuale al glitch
              color: glitchingIndices.has(index)
                ? BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)]
                : 'inherit',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </p>
  );
};

export default AndromedaQuoteAnimation; 