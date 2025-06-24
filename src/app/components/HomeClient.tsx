'use client';

import { useState, useRef, useEffect } from 'react';
import Landing from './Landing';
import Vision from './Vision';
import Gallery from './Gallery';
import Place from './Place';
import Target from './Target';


export default function HomeClient() {
  const [isVisionVisible, setIsVisionVisible] = useState(false);
  const [hasSpeakingVideoPlayed, setHasSpeakingVideoPlayed] = useState(false);
  const galleryWrapperRef = useRef<HTMLDivElement>(null);
  const [galleryHeight, setGalleryHeight] = useState(0);

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
    setGalleryHeight(scrollWidth - clientWidth + window.innerHeight);
  }, [isVisionVisible]);

  return (
    <main>
      <Landing
        onSpeakingEnd={handleSpeakingEnd}
        hasSpeakingVideoPlayed={hasSpeakingVideoPlayed}
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
          </div>
        </div>
      )}
      {isVisionVisible && <Place />}
      {isVisionVisible && <Target />}
    </main>
  );
} 