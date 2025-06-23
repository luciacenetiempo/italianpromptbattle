'use client';

import React, { useEffect, useRef } from 'react';
import styles from './SplitFlap.module.css';

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
        if (frame > 5 + Math.random() * 5) {
          span.textContent = originalChar;
          span.classList.add(styles.final);
          return;
        }
        frame++;
        setTimeout(flap, 60);
      };
      setTimeout(flap, Math.random() * 200);
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
  }, [visibleCount, text, onAnimationComplete]);

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
                return (
                  <span
                    key={`${i}-${j}`}
                    className={styles.flapChar}
                    data-char={char === ' ' ? '\u00A0' : char}
                    style={{ visibility: isVisible ? 'visible' : 'hidden' }}
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