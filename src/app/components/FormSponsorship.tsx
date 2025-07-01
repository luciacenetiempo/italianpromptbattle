import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import FormButton from './FormButton';
import CanvasHeartCube from './CanvasHeartCube';
import styles from './FormPanel.module.css';

interface FormSponsorshipProps {
  listId?: string;
  label?: string;
  submit?: string;
  success?: string;
  error?: string;
}

const FormSponsorship: React.FC<FormSponsorshipProps> = ({
  listId = '1622397',
  submit = 'Entra a far parte della storia!',
  success = 'Perfetto! La tua richiesta di partnership è stata inviata. Ti contatteremo presto! 🚀',
  error = "Qualcosa è andato storto. Controlla l'indirizzo email."
}) => {
  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
  const [userName, setUserName] = useState('');

  // Controlla se l'utente è già iscritto al caricamento del componente
  useEffect(() => {
    const savedStatus = localStorage.getItem('formSponsorshipSuccess');
    const savedName = localStorage.getItem('formSponsorshipName');
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
    
    const url = `https://assets.mailerlite.com/jsonp/${listId}/forms/158278653864576953/subscribe`;
    
    try {
      // Prima invia a MailerLite
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        // Se MailerLite ha successo, invia l'email di notifica
        const formValues = {
          name: formData.get('fields[name]') as string,
          company: formData.get('fields[company]') as string,
          email: formData.get('fields[email]') as string,
          message: formData.get('message') as string || ''
        };

        try {
          const emailResponse = await fetch('/api/send-sponsorship-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
          });

          if (!emailResponse.ok) {
            console.error('Errore nell\'invio dell\'email di notifica');
          }
        } catch (emailError) {
          console.error('Errore nell\'invio dell\'email di notifica:', emailError);
        }

        // Tracking Google Analytics - Successo form
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'form_submit_success', {
            'event_category': 'form',
            'event_label': 'form_sponsorship_success'
          });
        }
        
        setSuccess(true);
        setError(false);
        // Salva lo stato di success e il nome nel localStorage
        localStorage.setItem('formSponsorshipSuccess', 'true');
        localStorage.setItem('formSponsorshipName', name);
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
    return `Perfetto ${userName}!<br/>La tua richiesta di partnership è stata inviata.<br/>Ti contatteremo presto!`;
  };

  const getPersonalizedAlreadySubscribedMessage = () => {
    if (!userName) return "La tua richiesta di partnership è già stata inviata!<br/>Ti contatteremo presto per aggiornamenti.";
    return `Ciao ${userName}!<br/>La tua richiesta di partnership è già stata inviata!<br/>Ti contatteremo presto per aggiornamenti.`;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={`${styles.header} ${isSuccess ? styles.success : ''}`}>
        <div className={styles.col75}>
          <h2>Diventa partner della prima<br/>Italian Prompt Battle!</h2>
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
      
      <div className={`${styles.inputGroupRow} ${isSuccess ? styles.hidden : ''}`}>
        <div className={styles.inputGroupCol}>
          <InputField
            name="fields[name]"
            type="text"
            placeholder='Inserisci il tuo nome'
            required
            disabled={loading}
          /> 
          <div className={styles.helperText}>O il nome di un riferente...</div>
        </div>      
        <div className={styles.inputGroupCol}>
          <InputField
            name="fields[company]"
            type="text"
            placeholder='A nome di chi sarà la partnership?'
            required
            disabled={loading}
          /> 
          <div className={styles.helperText}>Inserisci il nome della tua azienda.</div>
        </div>
      </div>      
      <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>
          <InputField
            name="fields[email]"
            type="text"
            placeholder='Dove possiamo scriverti?'
            required
            disabled={loading}
          /> 
          <div className={styles.helperText}>Inserisci il tuo indirizzo email.</div>
      </div>      
      <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>
          <textarea
            name="message"
            placeholder='Come vorresti supportarci?'
            disabled={loading}
            className={styles.formInput}
          /> 
      </div>        
      
      <div className={`${styles.inputGroup} ${isSuccess ? styles.hidden : ''}`}>        
        <InputField
          name="fields[sponsor]"
          type="text"
          placeholder=''
          required
          disabled={loading}
          value='true'
          hidden
          readOnly
        />      
      </div> 
      <div className={`${styles.buttonWrapper} ${isSuccess ? styles.hidden : ''}`}>
        <FormButton type="submit" disabled={loading} className="revert" trackingLabel="form_sponsorship">
          {submit}
        </FormButton>
      </div>
      {isError ? (
        <div style={{ color: '#c62828', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>{error}</div>
      ) : null}
    </form>
  );
};

export default FormSponsorship; 