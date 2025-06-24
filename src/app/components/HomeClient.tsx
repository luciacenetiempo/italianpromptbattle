'use client';

import { useState } from 'react';
import Landing from './Landing';
import Vision from './Vision';

export default function HomeClient() {
  const [isVisionVisible, setIsVisionVisible] = useState(false);
  const [hasSpeakingVideoPlayed, setHasSpeakingVideoPlayed] = useState(false);

  const handleSpeakingEnd = () => {
    setIsVisionVisible(true);
    setHasSpeakingVideoPlayed(true);
  };

  return (
    <main>
      <Landing
        onSpeakingEnd={handleSpeakingEnd}
        hasSpeakingVideoPlayed={hasSpeakingVideoPlayed}
      />
      {isVisionVisible && <Vision />}
    </main>
  );
} 