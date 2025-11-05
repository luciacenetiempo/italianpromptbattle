'use client';

import React, { useState, useEffect, useRef } from 'react';
import CanvasHeartCube from '../components/CanvasHeartCube';
import PromptToPosterAudio from '../components/PromptToPosterAudio';
import styles from './PromptToPoster.module.css';
import Image from 'next/image';



type Screen = 'welcome' | 'input' | 'generating' | 'builder' | 'final';

export default function PromptToPosterPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [selectedLayout] = useState('vertical');
  const [userSignature, setUserSignature] = useState('');
  const [showGlitch, setShowGlitch] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [finalPosterUrl, setFinalPosterUrl] = useState('');
  const [isBuildingPoster, setIsBuildingPoster] = useState(false);
  const [isInitializingPoster, setIsInitializingPoster] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lastSignatureRef = useRef<string>('');



  // Effetto glitch durante la digitazione
  useEffect(() => {
    if (prompt.length > 0) {
      setShowGlitch(true);
      const timer = setTimeout(() => setShowGlitch(false), 200);
      return () => clearTimeout(timer);
    }
  }, [prompt]);

  // Genera automaticamente il poster finale quando si arriva alla schermata builder
  useEffect(() => {
    if (currentScreen === 'builder' && generatedImage && !finalPosterUrl && !isInitializingPoster) {
      const initializePoster = async () => {
        setIsInitializingPoster(true);
        try {
          const response = await fetch('/api/build-poster', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl: generatedImage,
              firmaAutore: userSignature || undefined
            }),
          });

          const data = await response.json();

          if (data.success && data.posterData) {
            setFinalPosterUrl(data.posterData);
          } else {
            console.error('Errore nell\'inizializzazione del poster:', data.error);
          }
        } catch (error) {
          console.error('Errore nell\'inizializzazione del poster:', error);
        } finally {
          setIsInitializingPoster(false);
        }
      };

      initializePoster();
    }
  }, [currentScreen, generatedImage, finalPosterUrl, isInitializingPoster, userSignature]);

  // Aggiorna il poster quando cambiano le impostazioni
  useEffect(() => {
    // Evita il loop se la firma non è cambiata
    if (lastSignatureRef.current === userSignature) {
      return;
    }
    
    if (currentScreen === 'builder' && finalPosterUrl && !isBuildingPoster) {
      const updatePoster = async () => {
        setIsBuildingPoster(true);
        try {
          const response = await fetch('/api/build-poster', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl: generatedImage,
              firmaAutore: userSignature || undefined
            }),
          });

          const data = await response.json();

          if (data.success && data.posterData) {
            setFinalPosterUrl(data.posterData);
            // Aggiorna il ref con la firma corrente
            lastSignatureRef.current = userSignature;
          } else {
            console.error('Errore nell\'aggiornamento del poster:', data.error);
          }
        } catch (error) {
          console.error('Errore nell\'aggiornamento del poster:', error);
        } finally {
          setIsBuildingPoster(false);
        }
      };

      // Debounce per evitare troppe chiamate API
      const timeoutId = setTimeout(updatePoster, 1000);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSignature, selectedLayout, currentScreen, generatedImage, isBuildingPoster]);

  // Simulazione sintesi vocale durante la digitazione
  useEffect(() => {
    if (prompt.length > 0 && !isTyping) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 100);
      return () => clearTimeout(timer);
    }
  }, [prompt, isTyping]);

  // Funzione per tradurre il prompt
  const translatePrompt = async (text: string): Promise<string> => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (data.success && data.translatedText) {
        return data.translatedText;
      } else {
        // Fallback: usa il prompt originale se la traduzione fallisce
        return text.trim();
      }
    } catch (error) {
      console.error('Errore nella traduzione:', error);
      // Fallback: usa il prompt originale
      return text.trim();
    }
  };



  // Gestione long press per easter egg
  const handleLogoLongPress = () => {
    console.log('Long press started');
    const timer = setTimeout(() => {
      console.log('Easter egg triggered!');
      
      // Tracking easter egg
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'easter_egg_unlocked', {
          'event_category': 'prompt_to_poster',
          'event_label': 'andromeda_prompt',
          'value': 1
        });
      }
      
      // Feedback visivo
      if (logoRef.current) {
        logoRef.current.style.transform = 'scale(1.2) rotate(360deg)';
        setTimeout(() => {
          if (logoRef.current) {
            logoRef.current.style.transform = 'scale(1) rotate(0deg)';
          }
        }, 500);
      }
    }, 1500); // Ridotto a 1.5 secondi per essere più reattivo
    setLongPressTimer(timer);
  };

  const handleLogoPressEnd = () => {
    console.log('Long press ended');
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };



  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Tracking analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'generate_poster', {
        'event_category': 'prompt_to_poster',
        'event_label': 'generate_button_click',
        'value': 1
      });
    }
    
    setIsInitializingPoster(true);
    setCurrentScreen('generating');
    
    try {
      setError('');
      
      // Traduci il prompt prima di inviarlo
      const translatedText = await translatePrompt(prompt);
      
      const response = await fetch('/api/generate-poster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: translatedText,
          originalPrompt: prompt.trim(),
          translatedPrompt: translatedText 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate poster');
      }

      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setCurrentScreen('builder');
        
        // Tracking successo generazione
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'poster_generated', {
            'event_category': 'prompt_to_poster',
            'event_label': 'generation_success',
            'value': 1
          });
        }
        
        // Reset poster finale
        setFinalPosterUrl('');
      } else {
        throw new Error('No image URL received from API');
      }
    } catch (error) {
      console.error('Error generating poster:', error);
      setError(error instanceof Error ? error.message : 'Errore durante la generazione del poster');
      setCurrentScreen('input');
      
      // Tracking errore
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'poster_generation_error', {
          'event_category': 'prompt_to_poster',
          'event_label': 'generation_error',
          'value': 1
        });
      }
    } finally {
      setIsInitializingPoster(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    // Tracking download
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'download_poster', {
        'event_category': 'prompt_to_poster',
        'event_label': finalPosterUrl ? 'download_final_poster' : 'download_raw',
        'value': 1
      });
    }
    
    try {
      const imageUrl = finalPosterUrl || generatedImage;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = finalPosterUrl ? `poster-final-${Date.now()}.webp` : `poster-${Date.now()}.webp`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Transizione alla schermata finale dopo il download
      setTimeout(() => {
        setCurrentScreen('final');
      }, 1000);
    } catch (error) {
      console.error('Error downloading poster:', error);
      setError('Errore durante il download del poster');
    }
  };

  // Schermata Welcome
  if (currentScreen === 'welcome') {
    return (
      <main  className={`${styles.promptToPoster} min-h-screen relative overflow-hidden`}>
        <GlitchCanvas />
        <PromptToPosterAudio autoPlay={false} />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Logo IPB con avatar glitchato */}
          <div 
            ref={logoRef}
            className="mb-8 transition-all duration-500 ease-out relative"
            onMouseDown={handleLogoLongPress}
            onMouseUp={handleLogoPressEnd}
            onTouchStart={handleLogoLongPress}
            onTouchEnd={handleLogoPressEnd}
          >
            <CanvasHeartCube size={130} />
          </div>

          {/* Testo principale */}
          <div className="text-center mb-12 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Benvenut<span className="text-[#dc6f5a]">*</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-[#dcaf6c] mb-4">
              Pront<span className="text-[#dc6f5a]">*</span> a generare?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Scrivi un prompt. Ottieni un&apos;opera. Stampala.
            </p>
          </div>

          {/* CTA principale */}
          <button 
            onClick={() => setCurrentScreen('input')}
            className="bg-[#dc6f5a] hover:bg-gradient-to-r hover:from-[#dc6f5a] hover:to-[#dcaf6c] text-white font-bold text-xl py-6 px-12 rounded-none transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-[#dc6f5a]/25 animate-pulse outline-2 outline outline-offset-[-2px] outline-[#18171c]"
          >
            INIZIA
          </button>


        </div>
      </main>
    );
  }

  // Schermata Input Prompt
  if (currentScreen === 'input') {
    return (
      <main  className={`${styles.promptToPoster} min-h-screen relative overflow-hidden`}>
        <GlitchCanvas />
        <PromptToPosterAudio autoPlay={true} />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                    {/* Player audio di Andromeda */}
          <div className="text-center mb-8">
            <div className="">
              <h2>E adesso dimmi, cosa vuoi creare?</h2>
            </div>
          </div>



          {/* Campo input principale */}
          <div className="w-full max-w-4xl mb-8">
            <div className={`bg-white/5 backdrop-blur-sm rounded-none p-8 border border-[#18171c] transition-all duration-300 ${showGlitch ? 'border-[#dc6f5a]/50 shadow-[#dc6f5a]/25' : ''}`}>
              <textarea 
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={`w-full h-32 p-6 bg-white/10 border border-[#18171c] rounded-none text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#dc6f5a] focus:border-[#dc6f5a] transition-all duration-300 font-mono text-lg ${showGlitch ? styles.textGlitch : ''}`}
                placeholder="Il mio mostro interiore trasformato in luce liquida..."
                style={{
                  fontFamily: 'monospace',
                  lineHeight: '1.6'
                }}
              />
              
              
            </div>
          </div>

          {/* CTA Genera */}
          <button 
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="bg-[#dc6f5a] hover:bg-gradient-to-r hover:from-[#dc6f5a] hover:to-[#dcaf6c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl py-6 px-12 rounded-none transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-[#dc6f5a]/25 outline-2 outline outline-offset-[-2px] outline-[#18171c]"
          >
            GENERA
          </button>

          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-w-md">
              <p className="text-red-300 text-sm">{error.replace("'", "&apos;")}</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  // Schermata Generazione
  if (currentScreen === 'generating') {
    return (
      <main  className={`${styles.promptToPoster} min-h-screen relative overflow-hidden`}>
        <GlitchCanvas />
        <PromptToPosterAudio autoPlay={false} />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Animazione generazione */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              {/* Oscilloscopio animato */}
              <div className="absolute inset-0 border-2 border-[#dc6f5a] rounded-full">
                <div className="absolute inset-2 border border-[#dcaf6c]/50 rounded-full animate-ping"></div>
              </div>
              <div className="absolute inset-4 bg-gradient-to-br from-[#dc6f5a] to-[#dcaf6c] rounded-full flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              {/* Linea oscilloscopio */}
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="w-20 h-1 bg-[#dc6f5a] rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="w-16 h-0.5 bg-[#dcaf6c] rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Sto traducendo il tuo coraggio in immagine...
            </h2>
          </div>

          {/* Prompt in trasformazione */}
          <div className="max-w-2xl mx-auto">
            <div className={`bg-white/5 backdrop-blur-sm rounded-none p-6 border border-[#18171c] ${styles.glitchContainer}`}>
              <p className={`text-[#dcaf6c] font-mono text-lg ${styles.glitchText}`}>
                &quot;{prompt}&quot;
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mt-8">
            <div className="bg-white/10 rounded-none h-3 overflow-hidden border border-[#dc6f5a]/30">
              <div className={`bg-gradient-to-r from-[#dc6f5a] to-[#dcaf6c] h-full rounded-none ${styles.progressBar}`}></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-[#dcaf6c] text-sm">Sintesi in corso...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Schermata Poster Builder
  if (currentScreen === 'builder') {
    return (
      <main className={`${styles.promptToPoster} min-h-screen relative overflow-hidden`}>
        <GlitchCanvas />
        <PromptToPosterAudio autoPlay={false} />
        
        <div className="relative z-10 min-h-screen px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              
              {/* Colonna sinistra - Preview */}
              <div className="lg:order-1 order-2">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Anteprima</h2>
                  
                  {/* Indicatore di caricamento iniziale */}
                  {isInitializingPoster && (
                    <div className="mb-6 p-4 bg-[#dc6f5a]/10 border border-[#dc6f5a]/30 rounded-none">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#dc6f5a] mr-3"></div>
                        <span className="text-[#dcaf6c] text-sm">Componendo il poster finale...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Indicatore di aggiornamento */}
                  {isBuildingPoster && !isInitializingPoster && (
                    <div>
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#dc6f5a] mr-3"></div>
                        <span className="text-[#dcaf6c] text-sm">Aggiornando il poster...</span>
                      </div>
                    </div>
                  )}
                  
                  <div className={`w-full aspect-[1240/1754] bg-gradient-to-br from-white/5 to-white/10 border-2 border-[#18171c] rounded-none overflow-hidden relative group ${styles.previewContainer}`}>
                    <Image 
                      src={finalPosterUrl || generatedImage} 
                      alt="Poster generato" 
                      className={`w-full h-full object-contain transition-all duration-500 ${styles.previewImage}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{objectFit: 'contain'}}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br from-[#dc6f5a]/20 to-[#dcaf6c]/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center ${styles.previewOverlay}`}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">✨</div>
                        <p className="text-white text-sm font-medium">
                          Poster finale con logo, testo e firma
                        </p>
                        <p className="text-[#dcaf6c] text-xs mt-1">
                          Tap &amp; hold per zoom
                        </p>
                      </div>
                    </div>
                    <div className={`absolute inset-0 border-2 border-[#dc6f5a]/50 rounded-none opacity-0 group-hover:opacity-100 transition-all duration-500 ${styles.previewBorder}`}></div>
                  </div>
                </div>
              </div>
              
              {/* Colonna destra - Controlli */}
              <div className="lg:order-2 order-1 space-y-6 lg:pl-8">
                
                {/* Riga 1: Opzioni di poster (3 colonne) */}
                {/* <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Layout Poster</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {posterLayouts.map((layout) => (
                      <label key={layout.id} className="flex flex-col items-center p-4 bg-white/5 rounded-none cursor-pointer hover:bg-white/10 transition-all duration-300 border border-[#18171c]">
                        <input
                          type="radio"
                          name="layout"
                          value={layout.id}
                          checked={selectedLayout === layout.id}
                          onChange={(e) => setSelectedLayout(e.target.value)}
                          className="mb-2"
                        />
                        <div className="text-2xl mb-2">{layout.preview}</div>
                        <div className="text-center">
                          <div className="text-white font-medium text-sm">{layout.name}</div>
                          <div className="text-gray-400 text-xs">{layout.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div> */}
                
                {/* Riga 2: Firma */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Firma l&apos;opera</h2>
                  <input
                    type="text"
                    value={userSignature}
                    onChange={(e) => setUserSignature(e.target.value)}
                    placeholder="@nomeutente"
                    className="w-full p-3 bg-white/10 border border-[#18171c] rounded-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc6f5a] focus:border-[#dc6f5a]"
                  />
                </div>
                
                {/* Riga 3: Download */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Scarica</h2>
                  <div className="space-y-3">
                    <button 
                      onClick={handleDownload}
                      className="w-full bg-[#dc6f5a] hover:bg-gradient-to-r hover:from-[#dc6f5a] hover:to-[#dcaf6c] text-white font-bold py-4 px-6 rounded-none transition-all duration-300 transform hover:scale-105 outline-2 outline outline-offset-[-2px] outline-[#18171c]"
                    >
                      SCARICA {finalPosterUrl ? 'POSTER FINALE' : 'POSTER'}
                    </button>
                    
                    {/* <button 
                      onClick={handlePrint}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-4 px-6 rounded-none transition-all duration-300 border border-[#18171c]"
                    >
                      STAMPA {finalPosterUrl ? 'POSTER FINALE' : 'POSTER'} (se sei all'evento)
                    </button>
                    
                    <button 
                      onClick={handleShare}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-4 px-6 rounded-none transition-all duration-300 border border-[#18171c]"
                    >
                      Condividi il tuo capolavoro
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Schermata Finale
  if (currentScreen === 'final') {
    return (
      <main  className={`${styles.promptToPoster} min-h-screen relative overflow-hidden`}>
        <GlitchCanvas />
        <PromptToPosterAudio autoPlay={false} />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Messaggio finale */}
          <div className="text-center mb-12 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Hai varcato la soglia.
            </h1>
            <h2 className="text-2xl md:text-3xl text-[#dcaf6c] mb-8">
              Adesso esisti anche tu in forma visiva.
            </h2>
          </div>
        </div>
      </main>
    );
  }

  return null;
}

// Componente GlitchCanvas semplificato per questa pagina
const GlitchCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Background rimosso per pulizia */}
    </div>
  );
}; 