# Google Analytics Tracking - Italian Prompt Battle

## Eventi di Tracking Implementati

Tutti gli eventi utilizzano la seguente struttura:
```javascript
gtag('event', 'click_iscriviti', {
  'event_category': 'interazione',
  'event_label': 'label_specifica',
  'value': 1
});
```

### CTA Principali (Call-to-Action)

| Label | Descrizione | Posizione |
|-------|-------------|-----------|
| `cta_header_waitlist` | Bottone "ENTRA IN WAIT LIST" nell'header | Header.tsx |
| `cta_target_waitlist` | Bottone "waiting list" nella sezione Target | Target.tsx |
| `cta_place_sponsorship` | Bottone "SEGNALA UNO SPAZIO PERFETTO" nella sezione Place | Place.tsx |
| `cta_location_sponsorship` | Bottone "Scrivici!" nella sezione Location | Location.tsx |

### Form di Registrazione

| Label | Descrizione | Posizione |
|-------|-------------|-----------|
| `form_registrazione_partecipanti` | Submit del form di registrazione partecipanti | FormAttendee.tsx |
| `form_sponsorship` | Submit del form di sponsorship | FormSponsorship.tsx |
| `form_newsletter` | Submit del form newsletter | FormNewsletter.tsx |

### Controlli Audio

| Label | Descrizione | Posizione |
|-------|-------------|-----------|
| `audio_choice_yes` | Scelta "Sì" per attivare l'audio | AppPreloader.tsx |
| `audio_choice_no` | Scelta "No" per disattivare l'audio | AppPreloader.tsx |
| `music_control_play` | Click su play musica | Landing.tsx |
| `music_control_pause` | Click su pausa musica | Landing.tsx |

### Banner Cookie

| Label | Descrizione | Posizione |
|-------|-------------|-----------|
| `cookie_accept_all` | Click su "Accetta Tutto" | ConsentBanner.tsx |
| `cookie_reject_all` | Click su "Rifiuta Tutto" | ConsentBanner.tsx |
| `cookie_custom_preferences` | Click su "Solo Necessari" | ConsentBanner.tsx |

### Controlli UI

| Label | Descrizione | Posizione |
|-------|-------------|-----------|
| `form_panel_close` | Chiusura del pannello form | FormPanel.tsx |

## Implementazione Tecnica

### Componente FormButton
Il componente `FormButton` è stato modificato per accettare una prop `trackingLabel` che viene utilizzata per tracciare automaticamente i click sui bottoni dei form.

### Funzione Helper
Tutti gli eventi utilizzano la stessa struttura per garantire consistenza nei dati di tracking.

### Controllo di Sicurezza
Ogni chiamata a `gtag` è protetta da un controllo `typeof window !== 'undefined' && window.gtag` per evitare errori durante il server-side rendering.

## Monitoraggio

Gli eventi possono essere monitorati in Google Analytics 4 nella sezione "Eventi" con il nome `click_iscriviti`. I dati possono essere filtrati per:
- `event_category`: 'interazione'
- `event_label`: le label specifiche elencate sopra
- `value`: sempre 1 per contare le interazioni 