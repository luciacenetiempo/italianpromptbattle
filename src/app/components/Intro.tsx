import React, { useState, useRef, useEffect } from 'react';
import styles from './Intro.module.css';

const Intro: React.FC = () => {
  const [videoMode, setVideoMode] = useState<'voice' | 'background'>('voice');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVoiceVideoEnd = () => {
    setVideoMode('background');
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          video.play().catch(error => {
            console.error("Video play failed on intersection:", error);
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [videoMode]); // Ricarica l'observer quando il video cambia

  return (
    <div className={styles.introContainer}>
      <video
        key={videoMode} // Forza il re-mount del componente video al cambio di stato
        ref={videoRef}
        className={styles.introVideo}
        src={videoMode === 'voice' ? '/video/ipb-speaking.mp4' : '/video/ipb-background-2.mp4'}
        onEnded={videoMode === 'voice' ? handleVoiceVideoEnd : undefined}
        loop={videoMode === 'background'}
        muted={videoMode === 'background'}
        autoPlay
        playsInline
      />
    </div>
  );
};

export default Intro; 