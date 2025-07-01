'use client';

import { useState, useEffect } from 'react';
import styles from './ConsentBanner.module.css';

interface ConsentPreferences {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
}

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Controlla se l'utente ha già fatto una scelta
    const consentGiven = localStorage.getItem('consent-given');
    if (!consentGiven) {
      setShowBanner(true);
    } else {
      // Ripristina le preferenze salvate
      const savedPreferences = localStorage.getItem('consent-preferences');
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        updateConsent(parsed);
      }
    }
  }, []);

  const updateConsent = (newPreferences: ConsentPreferences) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', newPreferences as unknown as Record<string, unknown>);
    }
  };

  const handleAcceptAll = () => {
    // Tracking Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_iscriviti', {
        'event_category': 'interazione',
        'event_label': 'cookie_accept_all',
        'value': 1
      });
    }
    
    const acceptPreferences: ConsentPreferences = {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    };
    
    updateConsent(acceptPreferences);
    localStorage.setItem('consent-preferences', JSON.stringify(acceptPreferences));
    localStorage.setItem('consent-given', 'true');
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    // Tracking Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_iscriviti', {
        'event_category': 'interazione',
        'event_label': 'cookie_reject_all',
        'value': 1
      });
    }
    
    const rejectPreferences: ConsentPreferences = {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    };
    
    updateConsent(rejectPreferences);
    localStorage.setItem('consent-preferences', JSON.stringify(rejectPreferences));
    localStorage.setItem('consent-given', 'true');
    setShowBanner(false);
  };

  const handleCustomPreferences = () => {
    // Tracking Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_iscriviti', {
        'event_category': 'interazione',
        'event_label': 'cookie_custom_preferences',
        'value': 1
      });
    }
    
    // Per ora accetta solo analytics, rifiuta il resto
    const customPreferences: ConsentPreferences = {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    };
    
    updateConsent(customPreferences);
    localStorage.setItem('consent-preferences', JSON.stringify(customPreferences));
    localStorage.setItem('consent-given', 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.bannerBox}>
        <button className={styles.closeButton} onClick={handleRejectAll} aria-label="Chiudi banner">×</button>
        <div className={styles.header}><span role="img" aria-label="cookie">🍪</span> <strong>Gestione dei Cookie</strong></div>
        <div className={styles.description}>
          Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito web. I cookie ci aiutano a comprendere come utilizzi il sito e a migliorare i nostri servizi.
        </div>
        <div className={styles.actions}>
          <button className={styles.rejectButton} onClick={handleRejectAll}>Rifiuta Tutto</button>
          <button className={styles.customButton} onClick={handleCustomPreferences}>Solo Necessari</button>
          <button className={styles.acceptButton} onClick={handleAcceptAll}>Accetta Tutto</button>
        </div>
      </div>
    </div>
  );
} 