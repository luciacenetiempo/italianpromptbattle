# Sistema di Rilevamento Dispositivo e Gestione Audio

Questo sistema permette di rilevare se l'utente sta utilizzando un dispositivo mobile o desktop e di gestire la scelta audio dell'utente, caricando automaticamente i video appropriati.

## Come Funziona

Il sistema utilizza React Context per condividere lo stato del dispositivo e la scelta audio tra tutti i componenti dell'applicazione. La rilevazione avviene nell'`AppPreloader` e viene resa disponibile a tutti i componenti figli.

## Rilevamento

Il sistema utilizza due metodi per rilevare i dispositivi mobile:

1. **Larghezza dello schermo**: Dispositivi con larghezza ≤ 768px sono considerati mobile
2. **User Agent**: Controlla se l'user agent contiene "Mobi"

## Gestione Audio

Il sistema rispetta la scelta dell'utente riguardo all'audio:

- **"Sì"**: L'audio è abilitato, i video possono riprodurre audio e la musica di sottofondo è attiva
- **"No"**: L'audio è disabilitato, tutti i video sono mutati e la musica di sottofondo non parte
- **Attivazione Successiva**: Se l'utente sceglie "No" inizialmente, può comunque attivare l'audio in seguito tramite il pulsante di controllo musica

### Attivazione Audio Tramite Pulsante

Se l'utente sceglie "No" durante il preload, il sistema:

1. **Mostra sempre** il pulsante di controllo musica per permettere l'attivazione
2. **Permette l'attivazione** quando l'utente clicca il pulsante
3. **Attiva automaticamente** la riproduzione quando l'utente attiva l'audio
4. **Riproduce l'audio** per tutti i componenti (musica + video speaking)

Questa funzionalità offre flessibilità all'utente senza compromettere l'esperienza iniziale.

## Utilizzo nei Componenti

### Importare il Hook

```typescript
import { useDevice } from './DeviceContext';
```

### Utilizzare il Hook

```typescript
const { isMobile, isMobileDetected, audioEnabled } = useDevice();
const isMobileDevice = isMobile || isMobileDetected;
```

### Esempio di Utilizzo

```typescript
const MyComponent = () => {
  const { isMobile, isMobileDetected, audioEnabled } = useDevice();
  const isMobileDevice = isMobile || isMobileDetected;

  const videoSrc = isMobileDevice 
    ? '/video/my-video-mobile.mp4' 
    : '/video/my-video-desktop.mp4';

  return (
    <video 
      src={videoSrc}
      muted={!audioEnabled} // Rispetta la scelta dell'utente
    >
      {/* contenuto video */}
    </video>
  );
};
```

## Componenti che Utilizzano il Sistema

- **AppPreloader**: Rileva il dispositivo, gestisce la scelta audio e precarica i video appropriati
- **Landing**: Carica video intro mobile/desktop e gestisce la musica di sottofondo
- **Intro**: Carica video speaking e background mobile/desktop con gestione audio
- **Place**: Carica video milano mobile/desktop

## Struttura dei File Video

I video devono seguire questa convenzione di naming:

- **Desktop**: `video-name.mp4` / `video-name.webm`
- **Mobile**: `video-name-m.mp4` / `video-name-m.webm`

## Gestione Audio nei Video

- **Video Speaking**: L'audio è controllato dalla scelta dell'utente (`muted={!audioEnabled}`)
- **Video Background**: Sempre mutati per non interferire con l'esperienza
- **Musica di Sottofondo**: Attiva solo se l'utente ha scelto "Sì"

## Vantaggi

1. **Performance**: Carica solo i video necessari per il dispositivo
2. **Consistenza**: Tutti i componenti utilizzano la stessa logica di rilevamento
3. **Manutenibilità**: Logica centralizzata nell'AppPreloader
4. **Responsive**: Si adatta automaticamente ai cambiamenti di dimensione dello schermo
5. **Rispetto della Privacy**: Rispetta la scelta dell'utente riguardo all'audio
6. **UX Migliorata**: L'utente ha il controllo completo sull'esperienza audio
7. **Flessibilità**: Permette di attivare l'audio anche dopo aver scelto "No" inizialmente 