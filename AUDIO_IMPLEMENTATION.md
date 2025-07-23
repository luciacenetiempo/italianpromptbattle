# Implementazione Funzionalità Audio - Italian Prompt Battle

## Panoramica

È stata implementata una funzionalità audio completa e coerente su tutte le pagine del sito Italian Prompt Battle. Il sistema è progettato per rispettare le preferenze dell'utente e fornire un'esperienza audio ottimale.

## Componenti Audio Implementati

### 1. AudioController (Globale)
- **File**: `src/app/components/AudioController.tsx`
- **CSS**: `src/app/components/AudioController.module.css`
- **Funzionalità**: Controllo audio globale per tutto il sito
- **Posizione**: Pulsante fisso in alto a destra su tutte le pagine
- **Caratteristiche**:
  - Pulsante circolare con animazione pulse quando attivo
  - Design responsive
  - Tracking Google Analytics per le interazioni
  - Gestione automatica del play/pause
  - **Avvio automatico**: La musica parte automaticamente quando l'utente sceglie "Sì" nella scelta iniziale

### 2. PromptToPosterAudio (Specifico)
- **File**: `src/app/components/PromptToPosterAudio.tsx`
- **Funzionalità**: Gestione audio specifica per la pagina prompt-to-poster
- **Caratteristiche**:
  - Riproduzione automatica delle citazioni di Andromeda
  - 10 tracce audio diverse
  - Autoplay configurabile
  - Gestione errori robusta

### 3. ConvaiAudio (Specifico)
- **File**: `src/app/components/ConvaiAudio.tsx`
- **Funzionalità**: Tracking audio per la pagina parla-con-andromeda
- **Caratteristiche**:
  - Tracking Google Analytics per l'uso dell'audio
  - Integrazione con widget Convai

## Sistema di Gestione Audio

### DeviceContext
- **File**: `src/app/components/DeviceContext.tsx`
- **Funzionalità**: Context globale per lo stato audio
- **Stato**: `audioEnabled` - indica se l'audio è abilitato dall'utente

### AppPreloader
- **File**: `src/app/components/AppPreloader.tsx`
- **Funzionalità**: Scelta iniziale dell'audio da parte dell'utente
- **Caratteristiche**:
  - Schermata di scelta audio dopo il caricamento
  - Preload di tutti i file audio
  - Tracking delle scelte dell'utente

## Pagine con Audio Implementato

### 1. Homepage (/)
- **Audio**: Musica di sottofondo tramite AudioController
- **Caratteristiche**: Controllo globale, rispetta le preferenze utente

### 2. Prompt-to-Poster (/prompt-to-poster)
- **Audio**: 
  - Musica di sottofondo (AudioController)
  - Citazioni di Andromeda (PromptToPosterAudio)
- **Caratteristiche**:
  - Autoplay delle citazioni nella schermata input
  - Easter egg con audio casuale
  - Tracking analytics per tutte le interazioni audio

### 3. Parla con Andromeda (/parla-con-andromeda)
- **Audio**: 
  - Musica di sottofondo (AudioController)
  - Widget Convai con audio integrato
- **Caratteristiche**:
  - Tracking per l'uso dell'audio
  - Integrazione con il widget di conversazione

## File Audio Utilizzati

### Musica di Sottofondo
- **File**: `/assets/audio/song.mp3`
- **Uso**: Tutte le pagine
- **Controllo**: AudioController globale

### Citazioni di Andromeda
- **Directory**: `/assets/audio/prompt-to-poster/`
- **File**: `quote-1.mp3` a `quote-10.mp3`
- **Uso**: Pagina prompt-to-poster
- **Controllo**: PromptToPosterAudio

## Caratteristiche Tecniche

### Gestione Errori
- Fallback automatico in caso di errori di riproduzione
- Logging degli errori per debugging
- Gestione robusta dei browser che non supportano audio
- Prevenzione loop infiniti nel controllo audio

### Performance
- Preload intelligente dei file audio
- Lazy loading per ottimizzare i tempi di caricamento
- Gestione efficiente della memoria

### Accessibilità
- Aria-label appropriati per screen reader
- Controlli keyboard-friendly
- Feedback visivo per le interazioni audio

### Analytics
- Tracking completo delle interazioni audio
- Eventi Google Analytics per:
  - Scelte audio iniziali
  - Toggle play/pause
  - Easter egg
  - Errori di riproduzione

## Implementazione nel Layout

Il componente `AudioController` è integrato nel layout principale (`src/app/layout.tsx`) per essere disponibile su tutte le pagine:

```tsx
<AppPreloader>
  <ParticleCanvas />
  <GlitchCanvas />
  {children}
  <AudioController />
</AppPreloader>
```

## Compatibilità Browser

- **Chrome/Edge**: Supporto completo
- **Firefox**: Supporto completo
- **Safari**: Supporto completo (con autoplay restrictions)
- **Mobile**: Supporto ottimizzato per iOS e Android

## Note per lo Sviluppo

1. **Autoplay Policy**: I browser moderni richiedono interazione utente per l'autoplay
2. **Volume**: Tutti gli audio sono impostati a volume 0.7 per comfort
3. **Loop**: La musica di sottofondo è in loop infinito
4. **Preload**: Tutti i file audio sono preloadati per performance ottimali

## Manutenzione

- I file audio sono nella directory `/public/assets/audio/`
- Per aggiungere nuove tracce, aggiornare gli array nei componenti
- Per modificare il volume, aggiornare le proprietà `volume` nei componenti
- Per aggiungere nuove pagine, importare `AudioController` nel layout 