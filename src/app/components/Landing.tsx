'use client';

import React, { useRef, useEffect, useState } from 'react';
import Header from './Header';
import styles from './Landing.module.css';
import SplitFlapAnimation from './SplitFlapAnimation';
import Preloader from './Preloader';
import Intro from './Intro';
import Head from 'next/head';

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

const Landing: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const songAudioRef = useRef<HTMLAudioElement>(null);
  const [scrollFraction, setScrollFraction] = useState(0);
  const [preloader, setPreloader] = useState(true);
  const [audioChoice, setAudioChoice] = useState<null | boolean>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isSongPlaying, setIsSongPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(false);

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
          // Inizia l'animazione solo quando tutte le immagini sono caricate
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
      const isCube = Math.random() > 0.8; // 20% di probabilità di essere un cubo
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

    // Particelle
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
        p.x += Math.sin(p.y / 40) * 0.5; // leggero movimento orizzontale
        p.alpha -= 0.001 * p.speed;
        
        if (p.type === 'cube') {
          p.rotation += p.rotationSpeed;
        }

        if (p.y - p.r > height || p.alpha <= 0.1) {
          // resetta la particella
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
    // L'animazione parte dall'onload delle immagini

    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let targetTime = 0;
    let easedTime = 0;
    const easingFactor = 0.2;

    const handleScroll = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      
      const scrollableHeight = el.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrollTop = window.scrollY;
      const currentScrollFraction = Math.min(1, scrollTop / scrollableHeight);
      setScrollFraction(currentScrollFraction);
      setScrolled(scrollTop > 10);

      if (isFinite(video.duration)) {
        targetTime = video.duration * currentScrollFraction;
      }
    };

    let animationFrameId: number;
    const smoothAnimate = () => {
      easedTime += (targetTime - easedTime) * easingFactor;
      if (video.readyState > 1 && Math.abs(video.currentTime - easedTime) > 0.01) {
        video.currentTime = easedTime;
      }
      animationFrameId = requestAnimationFrame(smoothAnimate);
    };

    const onMetadataLoaded = () => {
      video.play().then(() => {
        video.pause();
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        smoothAnimate();
      }).catch(error => {
        console.error("Video play failed, fallback to direct scroll handling:", error);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        smoothAnimate();
      });
    };

    if (video.readyState > 1) {
      onMetadataLoaded();
    } else {
      video.addEventListener('loadedmetadata', onMetadataLoaded);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      video.removeEventListener('loadedmetadata', onMetadataLoaded);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Timeout per fallback dopo 10s
  useEffect(() => {
    if (audioChoice === null) {
      const t = setTimeout(() => setAudioChoice(false), 100000);
      return () => clearTimeout(t);
    }
  }, [audioChoice]);

  // useEffect che gestisce la musica di sottofondo
  useEffect(() => {
    const audio = songAudioRef.current;
    if (!audio) return;

    // L'audio parte solo se: consenso dato, preloader finito, E la musica non è in pausa
    if (audioChoice === true && !preloader && isSongPlaying) {
      audio.play().catch(error => {
        console.error("Background song play failed:", error);
      });
    } else {
      audio.pause();
    }
  }, [preloader, audioChoice, isSongPlaying]); // Aggiunta dipendenza

  const handleToggleSong = () => {
    setIsSongPlaying(!isSongPlaying);
  };

  const titleText = "Qualcosa di nuovo\nsta per succedere";
  const totalChars = titleText.replace(/\n/g, '').length;
  const visibleCount = Math.floor(scrollFraction * totalChars);
  const visibleFraction = totalChars > 0 ? visibleCount / totalChars : 0;

  const headerStart = 0.5;
  const headerEnd = 0.7;
  let headerProgress = (visibleFraction - headerStart) / (headerEnd - headerStart);
  headerProgress = Math.max(0, Math.min(1, headerProgress));

  return (
    <>
      <Head>
        <title>Italian Prompt Battle – La sfida creativa italiana</title>
        <meta name="description" content="Partecipa all'Italian Prompt Battle: la prima competizione italiana dedicata alla creatività con l'AI. Scopri, impara, sfida e vinci!" />
        <meta property="og:title" content="Italian Prompt Battle – La sfida creativa italiana" />
        <meta property="og:description" content="Partecipa all'Italian Prompt Battle: la prima competizione italiana dedicata alla creatività con l'AI. Scopri, impara, sfida e vinci!" />
        <meta property="og:image" content="/assets/images/og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Italian Prompt Battle – La sfida creativa italiana" />
        <meta name="twitter:description" content="Partecipa all'Italian Prompt Battle: la prima competizione italiana dedicata alla creatività con l'AI. Scopri, impara, sfida e vinci!" />
        <meta name="twitter:image" content="/assets/images/og-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" as="video" href="/video/ipb-background-2.mp4" />
        <link rel="preload" as="video" href="/video/ipb-intro.mp4" />
        <link rel="preload" as="video" href="/video/ipb-voice.mp4" />
      </Head>
      <div style={{ background: '#000', position: 'relative' }}>
        <audio ref={songAudioRef} src="/assets/audio/song.mp3" loop />

        {/* Pulsante Pausa/Play Musica */}
        {audioChoice === true && !preloader && (
          <button onClick={handleToggleSong} className={styles.musicControlButton} aria-label={isSongPlaying ? 'Pausa musica' : 'Riproduci musica'}>
            {isSongPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            )}
          </button>
        )}

        {audioChoice === null && (
          <div className={styles.audioChoiceOverlay}>
            <div className={styles.audioPanel}>
              <div className={styles.equalizer}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
              </div>
              <div className={styles.audioText}>Vuoi attivare l&apos;audio?</div>
              <div className={styles.audioButtons}>
                <button className={styles.audioBtn} onClick={() => setAudioChoice(true)}>Sì</button>
                <button className={styles.audioBtn} onClick={() => setAudioChoice(false)}>No</button>
              </div>
            </div>
          </div>
        )}
        {audioChoice !== null && preloader && (
          <Preloader onFinish={() => setPreloader(false)} playAudio={audioChoice} />
        )}
        <div ref={scrollContainerRef} className={styles.scrollContainer}>
          <div className={styles.stickyContainer}>
            <video
              ref={videoRef}
              className={styles.videoBackground}
              muted
              playsInline
              preload="auto"
            >
              <source src="/video/ipb-intro.mp4" type="video/mp4" />
              Il tuo browser non supporta il tag video.
            </video>
            {showIntro && (
              <div className={styles.introOverlayFade}>
                <Intro />
              </div>
            )}
            <canvas ref={canvasRef} className={styles.particleCanvas} />
            <div className={styles.contentContainer}>
              <SplitFlapAnimation
                text={titleText}
                className={`text-white text-left font-semibold drop-shadow-lg ${styles.mainTitle}`}
                visibleCount={visibleCount}
                onAnimationComplete={() => setShowIntro(true)}
              />
            </div>
            <Header
              className={styles.header}
              style={{
                opacity: headerProgress,
                transform: `translateY(${(1 - headerProgress) * 100}%)`,
                pointerEvents: headerProgress > 0.98 ? 'auto' : 'none',
                transition: 'opacity 0.2s linear, transform 0.2s linear',
              }}
            />
            {!preloader && (
              <div className={`${styles.scrollIcon} ${scrolled ? styles.hidden : ''}`}>
                <div className={styles.scrollText}>SCROLL</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing; 