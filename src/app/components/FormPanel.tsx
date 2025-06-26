import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import FormNewsletter from './FormNewsletter';
import FormSponsorship from './FormSponsorship';
import FormAttendee from './FormAttendee';
import styles from './FormPanel.module.css';
import { useDevice } from './DeviceContext';

type FormType = 'registration' | 'sponsorship' | 'newsletter' | 'attendee';

interface FormPanelProps {
  isOpen: boolean;
  onClose: () => void;
  formType: FormType | null;
}

const FormPanel: React.FC<FormPanelProps> = ({ isOpen, onClose, formType }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const progressRef = useRef(0);
  const touchStartY = useRef(0);
  const touchStartProgress = useRef(0);
  
  // Utilizza il context per rilevare il dispositivo
  const { isMobile: contextIsMobile, isMobileDetected } = useDevice();
  const isMobileDevice = contextIsMobile || isMobileDetected;

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!isOpen || !contentEl) {
      return;
    }

    // Crea un'animazione GSAP e la mette in pausa
    animationRef.current = gsap.to(contentEl, {
      paused: true,
      maxWidth: '100vw',
      height: '100vh',
      borderRadius: 0,
      ease: 'power1.out',
      duration: 0.6,
    });

    // Gestione scroll per desktop
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0007; // Sensibilità
      let newProgress = progressRef.current + delta;
      newProgress = Math.max(0, Math.min(1, newProgress));
      progressRef.current = newProgress;
      animationRef.current?.progress(newProgress);
      if (newProgress === 0) onClose();
    };

    // Gestione touch per mobile
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartProgress.current = progressRef.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      const deltaProgress = deltaY / window.innerHeight * 2; // Sensibilità touch
      
      let newProgress = touchStartProgress.current + deltaProgress;
      newProgress = Math.max(0, Math.min(1, newProgress));
      progressRef.current = newProgress;
      animationRef.current?.progress(newProgress);
    };

    const handleTouchEnd = () => {
      // Se il progresso è molto basso, chiudi il pannello
      if (progressRef.current < 0.1) {
        onClose();
      } else {
        // Altrimenti, torna alla posizione aperta
        progressRef.current = 1;
        animationRef.current?.progress(1);
      }
    };

    // Aggiungi event listeners
    if (isMobileDevice) {
      contentEl.addEventListener('touchstart', handleTouchStart, { passive: true });
      contentEl.addEventListener('touchmove', handleTouchMove, { passive: false });
      contentEl.addEventListener('touchend', handleTouchEnd, { passive: true });
    } else {
      contentEl.addEventListener('wheel', handleWheel, { passive: false });
    }

    // Pulizia
    return () => {
      if (isMobileDevice) {
        contentEl.removeEventListener('touchstart', handleTouchStart);
        contentEl.removeEventListener('touchmove', handleTouchMove);
        contentEl.removeEventListener('touchend', handleTouchEnd);
      } else {
        contentEl.removeEventListener('wheel', handleWheel);
      }
      
      animationRef.current?.kill();
      // Resetta il progresso per la prossima apertura
      gsap.set(contentEl, { clearProps: 'all' }); 
      progressRef.current = 0;
    };
  }, [isOpen, isMobileDevice, onClose]);

  if (!isOpen) {
    return null;
  } 

  return (
    <div className={`${styles.panel} ${isOpen ? styles.open : ''}`} aria-modal="true" role="dialog">
      <div className={styles.overlay} onClick={onClose}></div>
      <div 
        ref={contentRef} 
        className={`${styles.content} ${isMobileDevice ? styles.mobile : ''}`}
      >
        <button className={styles.closeButton} onClick={onClose} aria-label="Chiudi">
          &times;
        </button>
        {formType === 'registration' && <FormAttendee />}
        {formType === 'sponsorship' && <FormSponsorship />}
        {formType === 'newsletter' && <FormNewsletter />}
        {formType === 'attendee' && <FormAttendee />}
      </div>
    </div>
  );
};

export default FormPanel; 