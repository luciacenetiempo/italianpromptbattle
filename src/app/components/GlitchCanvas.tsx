'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from './GlitchCanvas.module.css';

const BRAND_COLORS = [
  '#dcaf6c', // Oro
  '#c5a289', // Marrone chiaro
  '#8d81d5', // Viola
  '#847ce2', // Viola chiaro
  '#dc6f5a', // Arancione/Rosso
  '#fffbe6', // Giallo chiarissimo
];

interface GlitchBlock {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  life: number;
  color: string;
}

const GlitchCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<GlitchBlock[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
      setIsMobile(window.innerWidth <= 768 || isMobileDevice);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Interval per creare nuovi blocchi di glitch
  useEffect(() => {
    const interval = setInterval(() => {
      const triggerProbability = isMobile ? 0.9 : 0.7;
      if (Math.random() > triggerProbability) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Su mobile, crea solo 1 blocco
        const blockCount = isMobile ? 1 : Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < blockCount; i++) {
          const blockWidth = Math.random() * (canvas.width / (isMobile ? 10 : 6)) + (isMobile ? 30 : 50);
          const blockHeight = Math.random() * (isMobile ? 40 : 60) + 20;
          
          const newBlock: GlitchBlock = {
            id: Date.now() + Math.random(),
            x: Math.random() * (canvas.width - blockWidth),
            y: Math.random() * (canvas.height - blockHeight),
            width: blockWidth,
            height: blockHeight,
            life: Math.random() * 50 + 20, // Durata in frames
            color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
          };
          blocksRef.current.push(newBlock);
        }
      }
    }, 1000); // Controlla ogni secondo

    return () => clearInterval(interval);
  }, [isMobile]);

  // Loop di animazione per il rendering dei blocchi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Aggiorna e disegna i blocchi
      blocksRef.current = blocksRef.current
        .map(block => ({
          ...block,
          life: block.life - 1, // Decrementa la vita
          x: block.x + (Math.random() - 0.5) * 2, // Leggero tremolio
        }))
        .filter(block => block.life > 0); // Rimuovi i blocchi "morti"

      blocksRef.current.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.globalAlpha = Math.random() * 0.5 + 0.2; // Opacità casuale per un effetto più morbido
        ctx.fillRect(block.x, block.y, block.width, block.height);
        
        // Aggiungi qualche linea interna per più dettaglio
        if (Math.random() > 0.8) {
          ctx.fillStyle = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
          ctx.globalAlpha = Math.random() * 0.7;
          ctx.fillRect(block.x, block.y + Math.random() * block.height, block.width, 1);
        }
      });
      
      ctx.globalAlpha = 1; // Resetta l'opacità globale
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.glitchCanvas} />;
};

export default GlitchCanvas; 