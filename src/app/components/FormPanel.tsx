import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import FormNewsletter from './FormNewsletter';
import FormSponsorship from './FormSponsorship';
import FormAttendee from './FormAttendee';
import styles from './FormPanel.module.css';

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

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0007; // Sensibilità
      let newProgress = progressRef.current + delta;
      newProgress = Math.max(0, Math.min(1, newProgress));
      progressRef.current = newProgress;
      animationRef.current?.progress(newProgress);
      if (newProgress === 0) onClose();
    };

    contentEl.addEventListener('wheel', handleWheel, { passive: false });

    // Pulizia
    return () => {
      contentEl.removeEventListener('wheel', handleWheel);
      animationRef.current?.kill();
      // Resetta il progresso per la prossima apertura
      gsap.set(contentEl, { clearProps: 'all' }); 
      progressRef.current = 0;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  } 

  return (
    <div className={`${styles.panel} ${isOpen ? styles.open : ''}`} aria-modal="true" role="dialog">
      <div className={styles.overlay} onClick={onClose}></div>
      <div ref={contentRef} className={styles.content}>
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