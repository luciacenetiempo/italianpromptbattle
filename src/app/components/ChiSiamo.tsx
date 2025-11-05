'use client';

import React, { useRef } from 'react';
import styles from './ChiSiamo.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ChiSiamo: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      }
    });

    tl.from(contentRef.current, {
      scale: 0.8,
      opacity: 0,
      filter: 'blur(10px)',
      ease: 'power3.out'
    })
    .to(contentRef.current, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      ease: 'power3.inOut'
    });
  }, { scope: sectionRef });

  return (
    <section className={styles.chiSiamoSection} ref={sectionRef}>
      <div className={styles.content} ref={contentRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>ITALIAN PROMPT BATTLE</h2>
          <p className={styles.subtitle}>NON &Egrave; SOLO ANDROMEDA</p>
        </div>
        <div className={styles.profiles}>
          <div className={styles.profile}>
            <div className={styles.imageWrapper}>
              <img 
                src="/assets/img/massimiliano-di-blasi.png" 
                alt="Massimiliano Di Blasi" 
                className={styles.profileImage}
              />
            </div>
            <div className={styles.profileInfo}>
              <h3 className={styles.profileName}>MASSIMILIANO DI BLASI</h3>
              <p className={styles.profileRole}>AI Advisor & Innovation Trainer</p>
              <div className={styles.socialLinks}>
                <a href="https://www.linkedin.com/in/maxdiblasi/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  LinkedIn
                </a>
                <span className={styles.socialSeparator}>/</span>
                <a href="https://www.instagram.com/maxbonanza" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className={styles.profile}>
            <div className={styles.imageWrapper}>
              <img 
                src="/assets/img/lucia-cenetiempo.png" 
                alt="Lucia Cenetiempo" 
                className={styles.profileImage}
              />
            </div>
            <div className={styles.profileInfo}>
              <h3 className={styles.profileName}>LUCIA CENETIEMPO</h3>
              <p className={styles.profileRole}>Creative Technologist & AI Advisor</p>
              <div className={styles.socialLinks}>
                <a href="https://www.linkedin.com/in/luciacenetiempo" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  LinkedIn
                </a>
                <span className={styles.socialSeparator}>/</span>
                <a href="https://www.instagram.com/the_prompt_master/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChiSiamo;

