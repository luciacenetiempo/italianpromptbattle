import React, { useEffect, useRef } from 'react';
import styles from './Preloader.module.css';

interface PreloaderProps {
  onFinish: () => void;
  playAudio?: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ onFinish, playAudio }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let finished = false;
    const audio = audioRef.current;
    if (audio && playAudio) {
      audio.currentTime = 0;
      audio.play();
    }
    const timeout = setTimeout(() => {
      finished = true;
      onFinish();
    }, 1700);
    return () => {
      clearTimeout(timeout);
      if (!finished && audio) audio.pause();
    };
  }, [onFinish, playAudio]);

  return (
    <div className={styles.preloader}>
      <div className={styles.diagonalLeft} />
      <div className={styles.diagonalRight} />
      <audio ref={audioRef} src="/assets/audio/raiser.mp3" preload="auto" />
    </div>
  );
};

export default Preloader; 