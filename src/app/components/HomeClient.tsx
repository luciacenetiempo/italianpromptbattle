'use client';

import { useState, useRef, useEffect } from 'react';
import Landing from './Landing';
import Vision from './Vision';
import Gallery from './Gallery';
import Place from './Place';
import Target from './Target';
import Location from './Location';
import FormPanel from './FormPanel';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type FormType = 'registration' | 'sponsorship' | 'newsletter' | 'attendee';

export default function HomeClient() {
  const [isVisionVisible, setIsVisionVisible] = useState(false);
  const [hasSpeakingVideoPlayed, setHasSpeakingVideoPlayed] = useState(false);
  const galleryWrapperRef = useRef<HTMLDivElement>(null);
  const [galleryHeight, setGalleryHeight] = useState(0);

  const [isPanelOpen, setPanelOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const openPanel = (formType: FormType) => {
    setActiveForm(formType);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setActiveForm(null), 400);
  };

  useEffect(() => {
    if (isPanelOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [isPanelOpen]);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
        lenis.destroy();
        lenisRef.current = null;
    }
  }, []);

  const handleSpeakingEnd = () => {
    setIsVisionVisible(true);
    setHasSpeakingVideoPlayed(true);
  };

  useEffect(() => {
    if (!galleryWrapperRef.current) return;
    const gallery = galleryWrapperRef.current.querySelector('[data-gallery-container]');
    if (!gallery) return;
    const scrollWidth = (gallery as HTMLElement).scrollWidth;
    const clientWidth = (galleryWrapperRef.current as HTMLElement).clientWidth;
    setGalleryHeight(scrollWidth - clientWidth + window.innerHeight * 2);
  }, [isVisionVisible]);

  return (
    <main>
      <div className={isPanelOpen ? 'content-blurred' : ''}>
        <Landing
          onSpeakingEnd={handleSpeakingEnd}
          hasSpeakingVideoPlayed={hasSpeakingVideoPlayed}
          onOpenPanel={openPanel}
        />
        {isVisionVisible && <Vision />}
        {isVisionVisible && (
          <div
            ref={galleryWrapperRef}
            style={{
              position: 'relative',
              height: galleryHeight ? `${galleryHeight}px` : '100vh',
              width: '100vw',
            }}
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 2,
              }}
            >
              <Gallery style={{ width: '100vw', height: '100vh' }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '200px',
                background: 'linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
                pointerEvents: 'none',
                zIndex: 3,
              }}></div>
            </div>
          </div>
        )}
        {isVisionVisible && <Target onOpenPanel={openPanel} />}
        {isVisionVisible && <Place onOpenPanel={openPanel} />}
        {isVisionVisible && <Location onOpenPanel={openPanel} />}
      </div>

      <FormPanel 
        isOpen={isPanelOpen} 
        onClose={closePanel} 
        formType={activeForm} 
      />
    </main>
  );
} 