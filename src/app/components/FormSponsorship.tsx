import React, { useState } from 'react';
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
  success = '',
  error = "Qualcosa è andato storto. Controlla l'indirizzo email."
}) => {
  const [isSuccess, setSuccess] = useState(false);
  const [isError, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);
    
    const formData = new FormData(event.target as HTMLFormElement);
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

        setSuccess(true);
        setError(false);
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

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.header}>
        <div className={styles.col75}>
          <h2>Diventa partner della prima<br/>Italian Prompt Battle!</h2>
        </div>
        <div className={styles.col35}>
          <CanvasHeartCube size={250} />
        </div>  
      </div>
      <div className={styles.inputGroupRow}>
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
      <div className={styles.inputGroup}>
          <InputField
            name="fields[email]"
            type="text"
            placeholder='Dove possiamo scriverti?'
            required
            disabled={loading}
          /> 
          <div className={styles.helperText}>Inserisci il tuo indirizzo email.</div>
      </div>      
      <div className={styles.inputGroup}>
          <textarea
            name="message"
            placeholder='Come vorresti supportarci?'
            disabled={loading}
            className={styles.formInput}
          /> 
      </div>        
      
      <div className={styles.inputGroup}>        
        <InputField
          name="fields[sponsor]"
          type="text"
          placeholder=''
          required
          disabled={loading}
          value='true'
          hidden
        />      
      </div> 
      <div className={styles.buttonWrapper}>
        <FormButton type="submit" disabled={loading} className="revert">
          {submit}
        </FormButton>
      </div>
      {isSuccess ? (
        <div style={{ color: '#2e7d32', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>{success}</div>
      ) : null}
      {isError ? (
        <div style={{ color: '#c62828', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>{error}</div>
      ) : null}
    </form>
  );
};

export default FormSponsorship; 