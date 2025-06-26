import React, { useState } from 'react';
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
    const url = `https://assets.mailerlite.com/jsonp/${listId}/forms/158275940898571283/subscribe`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
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
          <h2>Hai coraggio.<br/>Sei ad un passo dalla rivoluzione<br/>Partecipa alla battle!</h2>
        </div>
        <div className={styles.col35}>
          <CanvasHeartCube size={250} />
        </div>  
      </div>
      <div className={styles.inputGroup}>
        <InputField
          name="fields[name]"
          type="text"
          placeholder='Inserisci il tuo nome'
          required
          disabled={loading}
        /> 
        <div className={styles.helperText}>O come preferisci che ti chiamiamo...</div>
      </div>      
      <div className={styles.inputGroup}>
        <InputField
          name="fields[last_name]"
          type="text"
          placeholder='Inserisci il tuo cognome'
          required
          disabled={loading}
        /> 
        <div className={styles.helperText}>Si ci serve per acreditarti.</div>
      </div>                
      <div className={styles.inputGroup}>        
        <InputField
          name="fields[email]"
          type="email"
          placeholder='Dove possiamo contattarti?'
          required
          disabled={loading}
        />    
        <div className={styles.helperText}>Inserisci il tuo miglior indirizzo email.</div>
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

export default FormAttendee; 