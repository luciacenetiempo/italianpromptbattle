'use client';

import React, { useEffect, useRef } from 'react';
import { useDevice } from './DeviceContext';

// Tracce audio di Andromeda
const audioQuotes = [
  '/assets/audio/prompt-to-poster/quote-1.mp3',
  '/assets/audio/prompt-to-poster/quote-2.mp3',
  '/assets/audio/prompt-to-poster/quote-3.mp3',
  '/assets/audio/prompt-to-poster/quote-4.mp3',
  '/assets/audio/prompt-to-poster/quote-5.mp3',
  '/assets/audio/prompt-to-poster/quote-6.mp3',
  '/assets/audio/prompt-to-poster/quote-7.mp3',
  '/assets/audio/prompt-to-poster/quote-8.mp3',
  '/assets/audio/prompt-to-poster/quote-9.mp3',
  '/assets/audio/prompt-to-poster/quote-10.mp3'
];

interface PromptToPosterAudioProps {
  onPlay?: () => void;
  onEnd?: () => void;
  autoPlay?: boolean;
}

const PromptToPosterAudio: React.FC<PromptToPosterAudioProps> = ({ 
  onPlay, 
  onEnd, 
  autoPlay = false 
}) => {
  const { audioEnabled } = useDevice();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Riproduce una citazione casuale
  const playRandomQuote = () => {
    if (!audioEnabled) return;
    
    const randomIndex = Math.floor(Math.random() * audioQuotes.length);
    
    if (audioRef.current) {
      audioRef.current.src = audioQuotes[randomIndex];
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(console.error);
      onPlay?.();
    }
  };

  // Gestisce gli eventi audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      onEnd?.();
    };

    const handleError = () => {
      console.error('Errore riproduzione audio quote');
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onEnd]);

  // Autoplay se richiesto
  useEffect(() => {
    if (autoPlay && audioEnabled) {
      playRandomQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, audioEnabled]);

  return (
    <audio 
      ref={audioRef} 
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};

export default PromptToPosterAudio; 