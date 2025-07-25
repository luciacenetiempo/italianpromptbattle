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
}

const FormAttendee: React.FC<FormAttendeeProps> = ({
  listId = '1622397',
  submit = 'Entra in wait list!',
  success = 'Perfetto! Sei stato aggiunto alla wait list. Ti contatteremo presto! 🚀',
  error = "Qualcosa è andato storto. Controlla l'indirizzo email."
}) => {
  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSfidante, setIsSfidante] = useState(false);
  const [isPubblico, setIsPubblico] = useState(false);

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
      const data = await response.json();
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
      }
    } catch {
      setSuccess(false);
      setError(true);
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

  return (
    <form onSubmit={onSubmit}>
      <div className={`${styles.header} ${isSuccess ? styles.success : ''}`}>
        <div className={styles.col75}>
          <h2>Hai coraggio.<br/>Sei ad un passo dalla rivoluzione<br/>Partecipa alla battle!</h2>
        </div>
        <div className={styles.col35}>
          <CanvasHeartCube size={250} />
        </div>  
      </div>
      
      {isSuccess && (
        <>
        <div 
          className={`${styles.successMessage} ${showSuccessMessage ? styles.visible : ''}`}
          dangerouslySetInnerHTML={{
            __html: isAlreadySubscribed ? getPersonalizedAlreadySubscribedMessage() : getPersonalizedSuccessMessage()
          }}
        />
        <CanvasHeartCube size={250} />
        </>
      )}
      
      <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Come vuoi partecipare all&apos;evento?</h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isSfidante}
              onChange={(e) => setIsSfidante(e.target.checked)}
              disabled={loading}
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ fontSize: '16px' }}>Come sfidante</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isPubblico}
              onChange={(e) => setIsPubblico(e.target.checked)}
              disabled={loading}
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ fontSize: '16px' }}>Come pubblico</span>
          </label>
        </div>
      </div>
      
      {/* Campi nascosti per le checkbox */}
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
      
      <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>
        <InputField
          name="fields[name]"
          type="text"
          placeholder='Inserisci il tuo nome'
          required
          disabled={loading}
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
        /> 
        <div className={styles.helperText}>Si ci serve per acreditarti.</div>
      </div>                
      <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>        
        <InputField
          name="fields[email]"
          type="email"
          placeholder='Dove possiamo contattarti?'
          required
          disabled={loading}
        />    
        <div className={styles.helperText}>Inserisci il tuo miglior indirizzo email.</div>
      </div>       
      
      <div className={`${styles.buttonWrapper} ${isSuccess ? styles.hidden : ''}`}>
        <FormButton type="submit" disabled={loading} className="revert" trackingLabel="form_registrazione_partecipanti">
          {submit}
        </FormButton>
      </div>
      {isError ? (
        <div style={{ color: '#c62828', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>{error}</div>
      ) : null}
    </form>
  );
};

export default FormAttendee; 