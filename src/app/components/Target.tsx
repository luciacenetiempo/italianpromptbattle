import React from 'react';
import styles from './Target.module.css';
import Image from 'next/image';

const MARQUEE_TEXT = [
  'Visual Artist',
  'Prompt Designer',
  'Creative Director',
  'Copywriter',
  'Motion Designer',
  'VJ',
  'UX/UI Designer',
  'AI Enthusiast',
  'Photographer',
  'Performer',
  'Game Artist',
  'Curatorə',
  'Art Hacker',
  'Spectator',
  'Concept Artist',
  'Digital Dreamer'
]


const MarqueeRow = () => (
  <div className={styles.marqueeRow}>
    <div className={styles.marqueeContent}>
      {MARQUEE_TEXT.map((text, idx) => (
        <span key={idx} className={styles.marqueeItem}>
          {text} <span className={styles.separator}>•</span>
        </span>
      ))}
    </div>
  </div>
);

const Target: React.FC = () => {
  return (
    <section className={styles.targetSection}>
      {/* Marquee in alto, assoluto */}
      <div className={styles.marqueeWrapper}>
        <MarqueeRow />
      </div>
      {/* Statua centrale assoluta */}
      <div className={styles.silhouetteWrapper}>
        <Image src="/assets/img/ipb-sil.webp" alt="Silhouette" fill priority className={styles.silhouette} />
      </div>
      {/* Colonne contenuto */}
      <div className={styles.contentColumns}>
        <div className={styles.left}>
          <div className={styles.descriptionBox}>
            <h2>Raccogli la sfida!</h2>
            <p>Call aperta a chi ha visione, intuito, voglia di mettersi in gioco.</p>
            <p>Conta l’audacia creativa, il desiderio di esplorare, la capacità di evocare mondi con le parole.<br/>Che tu lavori con le immagini, con il testo o con le idee...</p>
            <p><strong>Questo spazio ti appartiene!</strong></p>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightText}>
          La creatività<br/>non ha un ruolo...<br/>Ha coraggio!
          </div>
          <button className={styles.ctaButton}>
            ↗ Preiscriviti alla battle
          </button>
        </div>
      </div>
    </section>
  );
};

export default Target; 