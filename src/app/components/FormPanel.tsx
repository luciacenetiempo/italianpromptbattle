import React, { useRef, useEffect, useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Utilizza il context per rilevare il dispositivo
  const { isMobile: contextIsMobile, isMobileDetected } = useDevice();
  const isMobileDevice = contextIsMobile || isMobileDetected;

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!isOpen || !contentEl) {
      return;
    }

    // Reset iniziale per assicurarsi che il pannello sia nella posizione corretta
    if (isMobileDevice) {
      gsap.set(contentEl, { 
        clearProps: 'all',
        transform: 'translateY(0)'
      });
      progressRef.current = 1;
    } else {
      gsap.set(contentEl, { 
        clearProps: 'all',
        transform: 'translateX(-50%) translateY(0)'
      });
      progressRef.current = 0; // Desktop inizia da 0 per permettere l'espansione
    }
    setIsExpanded(false);

    // Crea un'animazione GSAP e la mette in pausa
    if (isMobileDevice) {
      // Animazione per mobile
      animationRef.current = gsap.to(contentEl, {
        paused: true,
        maxWidth: '100vw',
        height: '100vh',
        borderRadius: 0,
        ease: 'power1.out',
        duration: 0.6,
      });
    } else {
      // Animazione per desktop - ripristina il comportamento originale completo
      animationRef.current = gsap.to(contentEl, {
        paused: true,
        maxWidth: '100vw',
        height: '100vh',
        borderRadius: 0,
        ease: 'power1.out',
        duration: 0.6,
      });
      // Imposta il progresso iniziale per desktop
      animationRef.current.progress(0);
    }

    // Gestione scroll per desktop
    const handleWheel = (e: WheelEvent) => {
      if (isMobileDevice) return; // Solo per desktop
      
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
      // Se il pannello è espanso, non gestire il drag
      if (isExpanded) return;
      
      // Controlla se il touch è su un elemento del form o su contenuto interattivo
      const target = e.target as HTMLElement;
      if (target.closest('input') || target.closest('textarea') || target.closest('button') || target.closest('form') || target.closest('label') || target.closest('div[class*="helperText"]')) {
        return; // Non gestire il touch se è su un elemento del form
      }
      
      touchStartY.current = e.touches[0].clientY;
      touchStartProgress.current = progressRef.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Se il pannello è espanso, non gestire il drag
      if (isExpanded) return;
      
      // Controlla se il touch è su un elemento del form o su contenuto interattivo
      const target = e.target as HTMLElement;
      if (target.closest('input') || target.closest('textarea') || target.closest('button') || target.closest('form') || target.closest('label') || target.closest('div[class*="helperText"]')) {
        return; // Non gestire il touch se è su un elemento del form
      }
      
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      const deltaProgress = deltaY / window.innerHeight * 2; // Sensibilità touch
      
      let newProgress = touchStartProgress.current + deltaProgress;
      newProgress = Math.max(0, Math.min(1, newProgress));
      progressRef.current = newProgress;
      animationRef.current?.progress(newProgress);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Se il pannello è espanso, non gestire il drag
      if (isExpanded) return;
      
      // Controlla se il touch è su un elemento del form o su contenuto interattivo
      const target = e.target as HTMLElement;
      if (target.closest('input') || target.closest('textarea') || target.closest('button') || target.closest('form') || target.closest('label') || target.closest('div[class*="helperText"]')) {
        return; // Non gestire il touch se è su un elemento del form
      }
      
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
      // Desktop: aggiungi event listener per scroll
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
      progressRef.current = 0;
    };
  }, [isOpen, isMobileDevice, onClose]);

  // Reset quando il pannello si chiude
  useEffect(() => {
    if (!isOpen && contentRef.current) {
      // Reset completo quando il pannello si chiude
      gsap.set(contentRef.current, { 
        clearProps: 'all',
        transform: isMobileDevice ? 'translateY(100%)' : 'translateX(-50%) translateY(100%)'
      });
      progressRef.current = 0;
      setIsExpanded(false);
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
    }
  }, [isOpen, isMobileDevice]);

  // Gestisce l'espansione del pannello su mobile
  const handleInputFocus = () => {
    if (isMobileDevice && !isExpanded) {
      setIsExpanded(true);
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          maxWidth: '100vw',
          height: '100vh',
          borderRadius: 0,
          transform: 'none',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  };

  // Gestisce il ritorno alla dimensione normale
  const handleInputBlur = () => {
    if (isMobileDevice && isExpanded) {
      // Piccolo delay per permettere al focus di spostarsi su altri elementi
      setTimeout(() => {
        const activeElement = document.activeElement;
        if (!activeElement || !contentRef.current?.contains(activeElement)) {
          setIsExpanded(false);
          gsap.to(contentRef.current, {
            position: 'absolute',
            top: 'auto',
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: '100vw',
            height: '80vh',
            borderRadius: '15px 15px 0 0',
            transform: 'translateY(0)',
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      }, 100);
    }
  };

  // Aggiungi event listeners per i form
  useEffect(() => {
    if (!isOpen || !isMobileDevice) return;

    const contentEl = contentRef.current;
    if (!contentEl) return;

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('input, textarea')) {
        handleInputFocus();
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('input, textarea')) {
        handleInputBlur();
      }
    };

    contentEl.addEventListener('focusin', handleFocus);
    contentEl.addEventListener('focusout', handleBlur);

    return () => {
      contentEl.removeEventListener('focusin', handleFocus);
      contentEl.removeEventListener('focusout', handleBlur);
    };
  }, [isOpen, isMobileDevice, isExpanded]);

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
        <button 
          className={styles.closeButton} 
          onClick={() => {
            // Tracking Google Analytics
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'click_iscriviti', {
                'event_category': 'interazione',
                'event_label': 'form_panel_close',
                'value': 1
              });
            }
            onClose();
          }} 
          aria-label="Chiudi"
        >
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