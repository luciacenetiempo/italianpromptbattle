'use client';

import React, { useRef, useEffect } from 'react';
import styles from './ParticleCanvas.module.css';

const NUM_PARTICLES = 80;
const COLORS = ['#fffbe6', '#ffe7a3', '#ffd700', '#fff', '#ffecb3'];
const CUBE_SVGS = [
  '/assets/SVG/cube-1.svg',
  '/assets/SVG/cube-2.svg',
  '/assets/SVG/cube-3.svg',
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Particle {
  type: 'circle' | 'cube';
  x: number;
  y: number;
  r: number;
  speed: number;
  alpha: number;
  color?: string;
  image?: HTMLImageElement;
  rotation: number;
  rotationSpeed: number;
}

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loadedImages: HTMLImageElement[] = [];
    let imagesLoaded = 0;
    CUBE_SVGS.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === CUBE_SVGS.length) {
          animate();
        }
      };
      loadedImages.push(img);
    });

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', handleResize);

    const createParticle = (): Particle => {
      const isCube = Math.random() > 0.8;
      if (isCube && loadedImages.length > 0) {
        return {
          type: 'cube',
          x: randomBetween(0, width),
          y: randomBetween(-height, 0),
          r: randomBetween(20, 40),
          speed: randomBetween(0.5, 1.5),
          alpha: randomBetween(0.7, 1),
          image: loadedImages[Math.floor(Math.random() * loadedImages.length)],
          rotation: randomBetween(0, Math.PI * 2),
          rotationSpeed: randomBetween(-0.01, 0.01),
        };
      } else {
        return {
          type: 'circle',
          x: randomBetween(0, width),
          y: randomBetween(-height, 0),
          r: randomBetween(1, 3),
          speed: randomBetween(0.5, 2.5),
          alpha: randomBetween(0.5, 1),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: 0,
          rotationSpeed: 0,
        };
      }
    };

    const particles: Particle[] = Array.from(
      { length: NUM_PARTICLES },
      createParticle
    );

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        
        if (p.type === 'cube' && p.image) {
          ctx.translate(p.x + p.r / 2, p.y + p.r / 2);
          ctx.rotate(p.rotation);
          ctx.drawImage(p.image, -p.r / 2, -p.r / 2, p.r, p.r);
        } else if (p.type === 'circle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
          ctx.fillStyle = p.color!;
          ctx.shadowColor = p.color!;
          ctx.shadowBlur = 8;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    function update() {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speed;
        p.x += Math.sin(p.y / 40) * 0.5;
        p.alpha -= 0.001 * p.speed;
        
        if (p.type === 'cube') {
          p.rotation += p.rotationSpeed;
        }

        if (p.y - p.r > height || p.alpha <= 0.1) {
          particles[i] = createParticle();
        }
      }
    }

    let running = true;
    let animationFrameId: number;
    function animate() {
      if (!running) return;
      update();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
};

export default ParticleCanvas; 