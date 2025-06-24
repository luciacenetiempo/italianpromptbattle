import React from 'react';
import styles from './Place.module.css';

const Place: React.FC = () => {
  return (
    <section className={styles.placeSection}>
      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        poster="/video/ipb-background-2.jpg"
      >
        <source src="/video/ipb-milano.webm" type="video/webm" />
        <source src="/video/ipb-milano.mp4" type="video/mp4" />
        Il tuo browser non supporta il tag video.
      </video>
      <div className={styles.overlay}>
        <div className={styles.contentBox}>
          <h2 className={styles.title}>
          MILANO<br/>NOVEMBRE<br/>2025
          </h2>
          <div className={styles.venueInfo}>
            <p className={styles.description}>
            Stiamo scegliendo il luogo perfetto dove visione e materia si incontrano.<br/>
            Vuoi esserci tra i primi a saperlo?
            </p>
          </div>
          <button className={styles.button}>
          ↗ SEGNALA UNO SPAZIO PERFETTO
          </button>
        </div>
      </div>
    </section>
  );
};

export default Place; 