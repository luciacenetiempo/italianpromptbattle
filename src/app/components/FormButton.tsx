import React from 'react';
import ctaStyles from './Cta.module.css';

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const FormButton: React.FC<FormButtonProps> = ({ children, style, className = '', ...rest }) => (
  <button
    className={`${ctaStyles.ctaEmail} ${ctaStyles[className]}`}
    style={style}
    {...rest}
  >
    <span>↗ {children}</span>
    <span className={ctaStyles.ctaArrow}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 12H16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 9L16 12L13 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  </button>
);

export default FormButton; 