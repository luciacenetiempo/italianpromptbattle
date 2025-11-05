'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDevice } from './DeviceContext';
import styles from './AudioController.module.css';

interface AudioControllerProps {
  className?: string;
}

const AudioController: React.FC<AudioControllerProps> = ({ className }) => {
  const { audioEnabled } = useDevice();
  const [isPlaying, setIsPlaying] = useState(false);
  const [userActivatedAudio, setUserActivatedAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Avvia automaticamente la musica quando l'audio è abilitato
  useEffect(() => {
    if (audioEnabled && !isPlaying) {
      setIsPlaying(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioEnabled]);

  // Gestisce la riproduzione audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // L'audio parte se l'utente ha scelto di attivarlo inizialmente O se l'ha attivato tramite pulsante
    const shouldPlayAudio = (audioEnabled || userActivatedAudio) && isPlaying;

    if (shouldPlayAudio) {
      audio.play().catch(error => {
        console.error('Errore riproduzione audio:', error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [audioEnabled, userActivatedAudio, isPlaying]);

  // Gestisce il toggle dell'audio
  const handleToggleAudio = () => {
    // Se l'audio non è abilitato e l'utente clicca il pulsante, attivalo
    if (!audioEnabled && !userActivatedAudio) {
      setUserActivatedAudio(true);
      setIsPlaying(true);
      return;
    }
    
    // Se l'audio è già attivo, gestisci play/pause normalmente
    setIsPlaying(!isPlaying);
  };

  // Tracking analytics per il toggle audio
  const handleAudioToggle = () => {
    // Tracking Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'audio_toggle', {
        'event_category': 'interazione',
        'event_label': isPlaying ? 'audio_pause' : 'audio_play',
        'value': 1
      });
    }
    handleToggleAudio();
  };

  return (
    <>
      <audio ref={audioRef} src="/assets/audio/song.mp3" loop />
      
      <button 
        onClick={handleAudioToggle}
        className={`${styles.audioControlButton} ${className || ''}`}
        aria-label={
          isPlaying && (audioEnabled || userActivatedAudio) 
            ? 'Pausa musica' 
            : (audioEnabled || userActivatedAudio) 
              ? 'Riproduci musica' 
              : 'Attiva audio'
        }
      >
        {isPlaying && (audioEnabled || userActivatedAudio) ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>
    </>
  );
};

export default AudioController; 