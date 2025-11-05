import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import FormButton from './FormButton';
import CanvasHeartCube from './CanvasHeartCube';
import styles from './FormPanel.module.css';

interface FormAttendeeProps {
  listId?: string;
  label?: string;
  submit?: string;
  success?: string;
  error?: string;
  inlineFields?: boolean;
}

const FormAttendee: React.FC<FormAttendeeProps> = ({
  listId = '1622397',
  success = 'Perfetto! Sei stato aggiunto alla wait list. Ti contatteremo presto! 🚀',
  error = "Qualcosa è andato storto. Controlla l'indirizzo email.",
  inlineFields = false
}) => {
  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSfidante, setIsSfidante] = useState(false);
  const [isPubblico, setIsPubblico] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    lastName: '',
    email: '',
    aiWorksLink: ''
  });

  // Controlla se l'utente è già iscritto al caricamento del componente
  useEffect(() => {
    const savedStatus = localStorage.getItem('formAttendeeSuccess');
    const savedName = localStorage.getItem('formAttendeeName');
    if (savedStatus === 'true') {
      setIsAlreadySubscribed(true);
      setSuccess(true);
      setShowSuccessMessage(true);
      if (savedName) {
        setUserName(savedName);
      }
    }
  }, []);

  // Gestisce l'animazione del messaggio di success
  useEffect(() => {
    if (isSuccess && !isAlreadySubscribed) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(true);
      }, 500); // Aspetta che gli elementi scompaiano prima di mostrare il messaggio
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isAlreadySubscribed]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);
    setShowSuccessMessage(false);
    
    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get('fields[name]') as string;
    const lastName = formData.get('fields[last_name]') as string;
    const email = formData.get('fields[email]') as string;
    
    // Validazione completa di tutti i campi
    const errors: string[] = [];
    
    // Validazione checkbox
    if (!isSfidante && !isPubblico) {
      errors.push('Seleziona almeno un modo di partecipazione (Come sfidante o Come pubblico)');
    }
    
    // Validazione nome
    if (!name || name.trim() === '') {
      errors.push('Il nome è obbligatorio');
    }
    
    // Validazione cognome
    if (!lastName || lastName.trim() === '') {
      errors.push('Il cognome è obbligatorio');
    }
    
    // Validazione email
    if (!email || email.trim() === '') {
      errors.push('L\'email è obbligatoria');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Inserisci un indirizzo email valido');
    }
    
    // Validazione privacy consent
    if (!privacyConsent) {
      errors.push('Devi accettare il trattamento dei dati personali');
    }
    
    // Se ci sono errori, mostrali e interrompi l'invio
    if (errors.length > 0) {
      setError(true);
      setErrorMessage(errors.join('. '));
      setLoading(false);
      setTimeout(() => {
        const errorElement = document.querySelector('[data-error-message]');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }
    
    // Reset del messaggio di errore se non ci sono errori
    setErrorMessage('');
    
    setUserName(name);
    
    // Aggiungi i valori delle checkbox al formData
    if (isSfidante) {
      formData.set('fields[partecipante]', 'true');
    }
    if (isPubblico) {
      formData.set('fields[pubblico]', 'true');
    }
    
    const url = `https://assets.mailerlite.com/jsonp/${listId}/forms/158275940898571283/subscribe`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Log per debugging
      console.log('MailerLite response:', data);
      
      if (data.success) {
        // Tracking Google Analytics - Successo form
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'form_submit_success', {
            'event_category': 'form',
            'event_label': 'form_registrazione_partecipanti_success'
          });
        }
        
        setSuccess(true);
        setError(false);
        // Salva lo stato di success e il nome nel localStorage
        localStorage.setItem('formAttendeeSuccess', 'true');
        localStorage.setItem('formAttendeeName', name);
      } else {
        setSuccess(false);
        setError(true);
        setErrorMessage(error);
        // Log dell'errore per debugging
        console.error('MailerLite error:', data);
        // Scroll al messaggio di errore
        setTimeout(() => {
          const errorElement = document.querySelector('[data-error-message]');
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } catch (err) {
      setSuccess(false);
      setError(true);
      setErrorMessage(error);
      // Log dell'errore per debugging
      console.error('Form submission error:', err);
      // Scroll al messaggio di errore
      setTimeout(() => {
        const errorElement = document.querySelector('[data-error-message]');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } finally {
      setLoading(false);
    }
  }

  // Messaggi personalizzati con il nome
  const getPersonalizedSuccessMessage = () => {
    if (!userName) return success;
    return `Perfetto ${userName}!<br/>Sei nella nostra wait list.<br/>Ti contatteremo presto!`;
  };

  const getPersonalizedAlreadySubscribedMessage = () => {
    if (!userName) return "Sei già nella wait list!<br/>Ti contatteremo presto per aggiornamenti sulla battle.";
    return `Ciao ${userName}!<br/>Sei già nella wait list!<br/>Ti contatteremo presto per aggiornamenti sulla battle.`;
  };

  // Determina il testo del bottone in base alla selezione
  const getButtonText = () => {
    if (isSfidante) {
      return 'candidati ora!';
    } else {
      return 'vieni all\'evento!';
    }
  };

  // Verifica se almeno un campo è stato compilato
  const isFormPartiallyFilled = () => {
    return !!(
      (formValues.name && formValues.name.trim() !== '') ||
      (formValues.lastName && formValues.lastName.trim() !== '') ||
      (formValues.email && formValues.email.trim() !== '') ||
      (formValues.aiWorksLink && formValues.aiWorksLink.trim() !== '') ||
      isSfidante ||
      isPubblico ||
      privacyConsent
    );
  };

  // Calcola se il bottone deve essere disabilitato
  const isButtonDisabled = loading || !privacyConsent || !isFormPartiallyFilled();

  return (
    <form onSubmit={onSubmit} style={{ position: 'relative', minHeight: isSuccess ? '100vh' : 'auto' }}>
      <div className={`${styles.header} ${isSuccess ? styles.hidden : ''}`}>
        <div className={styles.col75}>
          <h2>Partecipa<br/>all&apos;Italian Prompt Battle</h2>
        </div>
        <div className={styles.col35}>
          <CanvasHeartCube size={250} />
        </div>  
      </div>
      
      {isSuccess && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '90%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          zIndex: 10
        }}>
          <div 
            className={`${styles.successMessage} ${showSuccessMessage ? styles.visible : ''}`}
            style={{ position: 'relative', top: 'auto', left: 'auto', transform: showSuccessMessage ? 'translateY(0)' : 'translateY(20px)' }}
            dangerouslySetInnerHTML={{
              __html: isAlreadySubscribed ? getPersonalizedAlreadySubscribedMessage() : getPersonalizedSuccessMessage()
            }}
          />
          <CanvasHeartCube size={250} />
        </div>
      )}
      
      <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`} style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: 0, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer', padding: '8px 0' }}>
            <input
              type="checkbox"
              checked={isSfidante}
              onChange={(e) => setIsSfidante(e.target.checked)}
              disabled={loading}
              style={{ 
                width: '48px', 
                height: '48px', 
                cursor: 'pointer',
                accentColor: '#dc6f5a'
              }}
            />
            <span style={{ fontSize: '21.6px', fontWeight: '600' }}>Come sfidante</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer', padding: '8px 0' }}>
            <input
              type="checkbox"
              checked={isPubblico}
              onChange={(e) => setIsPubblico(e.target.checked)}
              disabled={loading}
              style={{ 
                width: '48px', 
                height: '48px', 
                cursor: 'pointer',
                accentColor: '#dc6f5a'
              }}
            />
            <span style={{ fontSize: '21.6px', fontWeight: '600' }}>Come pubblico</span>
          </label>
        </div>
      </div>
      
      {/* Campi nascosti per le checkbox */}
      {!isSuccess && (
        <>
          <InputField
            name="fields[partecipante]"
            type="text"
            placeholder=''
            required={false}
            disabled={loading}
            value={isSfidante ? 'true' : ''}
            style={{ display: 'none' }}
          />
          <InputField
            name="fields[pubblico]"
            type="text"
            placeholder=''
            required={false}
            disabled={loading}
            value={isPubblico ? 'true' : ''}
            style={{ display: 'none' }}
          />
        </>
      )}
      
      {inlineFields ? (
        <div className={`${styles.inputGroupRow} ${isSuccess ? styles.hidden : ''}`}>
          <div className={styles.inputGroupCol}>
            <InputField
              name="fields[name]"
              type="text"
              placeholder='Inserisci il tuo nome'
              required
              disabled={loading}
              onChange={(e) => setFormValues(prev => ({ ...prev, name: e.target.value }))}
            /> 
            <div className={styles.helperText}>O come preferisci che ti chiamiamo...</div>
          </div>
          <div className={styles.inputGroupCol}>
            <InputField
              name="fields[last_name]"
              type="text"
              placeholder='Inserisci il tuo cognome'
              required
              disabled={loading}
              onChange={(e) => setFormValues(prev => ({ ...prev, lastName: e.target.value }))}
            /> 
            <div className={styles.helperText}>Si ci serve per accreditarti.</div>
          </div>
        </div>
      ) : (
        <>
          <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>
            <InputField
              name="fields[name]"
              type="text"
              placeholder='Inserisci il tuo nome'
              required
              disabled={loading}
              onChange={(e) => setFormValues(prev => ({ ...prev, name: e.target.value }))}
            /> 
            <div className={styles.helperText}>O come preferisci che ti chiamiamo...</div>
          </div>      
          <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>
            <InputField
              name="fields[last_name]"
              type="text"
              placeholder='Inserisci il tuo cognome'
              required
              disabled={loading}
              onChange={(e) => setFormValues(prev => ({ ...prev, lastName: e.target.value }))}
            /> 
            <div className={styles.helperText}>Si ci serve per acreditarti.</div>
          </div>
        </>
      )}
      {isSfidante && (
        <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>
          <InputField
            name="fields[ai_works_link]"
            type="url"
            placeholder='Link ai tuoi lavori AI'
            required={false}
            disabled={loading}
            onChange={(e) => setFormValues(prev => ({ ...prev, aiWorksLink: e.target.value }))}
            style={{
              borderBottom: '3px solid #b6ff6c',
              borderLeft: '3px solid #b6ff6c',
              borderRight: '3px solid #b6ff6c',
              borderTop: '3px solid #b6ff6c',
              borderRadius: '4px',
              padding: '22px 30px'
            }}
          />    
          <div className={styles.helperText}>Condividi il link ai tuoi migliori lavori con l&apos;AI.</div>
        </div>
      )}
      <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>        
        <InputField
          name="fields[email]"
          type="email"
          placeholder='Dove possiamo contattarti?'
          required
          disabled={loading}
          onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
        />    
        <div className={styles.helperText}>Inserisci il tuo miglior indirizzo email.</div>
      </div>
      
      <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px 0' }}>
          <input
            type="checkbox"
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
            disabled={loading}
            required
            style={{ 
              width: '24px', 
              height: '24px', 
              cursor: 'pointer',
              accentColor: '#dc6f5a',
              marginTop: '2px',
              flexShrink: 0,
              transform: 'scale(1.2)'
            }}
          />
          <span style={{ fontSize: '12px', lineHeight: '1.3', color: '#1a1a1a' }}>
            Acconsento al trattamento dei miei dati personali da parte di Lucia Cenetiempo e Massimiliano Di Blasi, in qualità di contitolari del trattamento per Italian Prompt Battle, e da parte di Talent Garden S.p.A., in qualità di titolare autonomo, per finalità di gestione della mia partecipazione all&apos;evento, nonché per l&apos;invio di comunicazioni promozionali e commerciali, tramite email o altri mezzi di comunicazione elettronica.
            <br /><br />
            Dichiaro di aver letto e compreso le rispettive informative privacy, disponibili ai seguenti link:
            <br />
            {'– '}
            <a href="/informativa-ipb" target="_blank" rel="noopener noreferrer" style={{ color: '#dc6f5a', textDecoration: 'underline' }}>Informativa Italian Prompt Battle</a>
            <br />
            {'– '}
            <a href="https://knowledge.talentgarden.com/it/kb/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#dc6f5a', textDecoration: 'underline' }}>Informativa Talent Garden S.p.A.</a>
          </span>
        </label>
      </div>
      
      <div className={`${styles.buttonWrapper} ${isSuccess ? styles.hidden : ''}`} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <FormButton 
          type="submit" 
          disabled={isButtonDisabled} 
          className="revert" 
          trackingLabel="form_registrazione_partecipanti"
          hideArrow={true}
          style={{
            fontSize: '24px',
            fontWeight: '700',
            padding: '32px 64px',
            width: '50%',
            maxWidth: '50%',
            letterSpacing: '0.03em',
            lineHeight: '1.1',
            justifyContent: 'center',
            display: 'flex',
            opacity: isButtonDisabled ? 0.5 : 1,
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            pointerEvents: isButtonDisabled ? 'none' : 'auto'
          }}
        >
          {getButtonText()}
        </FormButton>
      </div>
      {isError && !isSuccess && (
        <div 
          data-error-message
          style={{ 
            color: '#c62828', 
            marginTop: '20px', 
            textAlign: 'center', 
            fontWeight: 600,
            fontSize: '1rem',
            padding: '15px',
            backgroundColor: '#ffebee',
            borderRadius: '8px',
            border: '1px solid #c62828'
          }}
        >
          {errorMessage || error}
        </div>
      )}
    </form>
  );
};

export default FormAttendee; 