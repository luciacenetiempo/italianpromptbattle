import React from 'react';
import styles from './FormPanel.module.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  placeholder: string;
  type?: string;
  label?: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, placeholder, type = 'text', label, ...rest }) => (
  <>
    <input
      name={name}
      placeholder={placeholder}
      type={type}
      className={styles.formInput}
      {...rest}
    />
    {label && <label className={styles.helperText}>{label}</label>}
  </>  
);

export default InputField; 