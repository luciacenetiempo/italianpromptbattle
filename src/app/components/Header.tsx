import React from 'react';
import styles from './Header.module.css';
import CanvasHeartCube from './CanvasHeartCube';

type FormType = 'registration' | 'sponsorship' | 'newsletter' | 'attendee';

interface HeaderProps {
  className?: string;
  style?: React.CSSProperties;
  onOpenPanel?: (formType: FormType) => void;
}

const Header: React.FC<HeaderProps> = ({ className, style, onOpenPanel }) => {
  return (
    <div className={`${styles.header} ${className || ''}`} style={style}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        {/* <svg
          id="uuid-7d67fecf-5ba1-4594-a2fc-e35cbaf6ae28"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 183.76 176.04"
          width="56"
          height="56"
          className={styles.rotatingCube}
        >
          <defs>
            <linearGradient
              id="uuid-bce14452-1e3b-4cea-bed9-f1241da6039e"
              x1="5615.52"
              y1="4742.35"
              x2="5759.06"
              y2="4742.35"
              gradientTransform="translate(-5835.14 4600.13) rotate(-77.26)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#dcaf6c" />
              <stop offset=".1" stopColor="#c5a289" />
              <stop offset=".3" stopColor="#8d81d5" />
              <stop offset=".34" stopColor="#847ce2" />
              <stop offset=".64" stopColor="#cba582" />
              <stop offset=".7" stopColor="#ce9878" />
              <stop offset=".81" stopColor="#d87760" />
              <stop offset=".84" stopColor="#dc6c58" />
              <stop offset=".99" stopColor="#dc9280" />
            </linearGradient>
            <linearGradient
              id="uuid-8357ff23-9966-4d48-a497-8d7e9c7c8000"
              x1="1738.36"
              y1="9622.03"
              x2="1825"
              y2="9622.03"
              gradientTransform="translate(-108.51 9883.27) rotate(-168.61)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#dcaf6c" />
              <stop offset=".05" stopColor="#dcaf6c" />
              <stop offset=".16" stopColor="#847ce2" />
              <stop offset=".29" stopColor="#dc6c58" />
              <stop offset=".39" stopColor="#dc6c58" />
              <stop offset=".53" stopColor="#dcaf6c" />
              <stop offset=".71" stopColor="#dc6c58" />
              <stop offset=".84" stopColor="#dc9280" />
              <stop offset=".9" stopColor="#6e5bdc" />
              <stop offset=".99" stopColor="#dc9280" />
            </linearGradient>
            <clipPath id="uuid-7cf100f3-2c8c-4141-a685-052c8c133627">
              <polygon
                points="0 99.1 32.88 22.55 88.95 98.41 56.07 174.96 0 99.1"
                style={{ fill: 'none', strokeWidth: '0px' }}
              />
            </clipPath>
            <linearGradient
              id="uuid-44e8ecc0-48df-40b5-a104-48a3b68925a9"
              x1="4774.87"
              y1="1712.47"
              x2="4689.13"
              y2="1768.63"
              gradientTransform="translate(-4455.12 2195.55) rotate(-45.38)"
              xlinkHref="#uuid-bce14452-1e3b-4cea-bed9-f1241da6039e"
            />
            <linearGradient
              id="uuid-d5ec4909-15a4-4706-a204-a89225884fb3"
              x1="1650.72"
              y1="9682.35"
              x2="1809.87"
              y2="9682.35"
              xlinkHref="#uuid-8357ff23-9966-4d48-a497-8d7e9c7c8000"
            />
            <linearGradient
              id="uuid-f44e7461-3ac2-4808-a564-c01edb591229"
              x1="4372.21"
              y1="1761.34"
              x2="4288.49"
              y2="1759.89"
              gradientTransform="translate(-4024.7 2276.32) rotate(-49.6)"
              xlinkHref="#uuid-bce14452-1e3b-4cea-bed9-f1241da6039e"
            />
            <linearGradient
              id="uuid-5c584e8d-1f27-4053-887c-a6b06c6cc33c"
              x1="1650.92"
              y1="9611.44"
              x2="1756.82"
              y2="9611.44"
              xlinkHref="#uuid-8357ff23-9966-4d48-a497-8d7e9c7c8000"
            />
          </defs>
          <g
            id="uuid-92a9c98a-fc32-4be4-bad8-5c7bd7c7f4bc"
            className={styles.cube}
          >
            <g style={{ isolation: 'isolate' }}>
              <path
                className={styles.cubeFace}
                d="M3.66,90.58L32.88,22.55l56.07,75.86-32.88,76.55L5.51,106.56c-3.41-4.62-4.12-10.7-1.85-15.98Z"
                style={{
                  fill: 'url(#uuid-bce14452-1e3b-4cea-bed9-f1241da6039e)',
                  stroke: 'url(#uuid-8357ff23-9966-4d48-a497-8d7e9c7c8000)',
                  strokeMiterlimit: 10,
                  strokeWidth: '1.09px',
                }}
              />
              <path
                className={styles.cubeFace}
                d="M32.88,22.55L116.91,1.02c5.95-1.52,12.23.71,15.88,5.65l50.03,67.69-93.88,24.05L32.88,22.55Z"
                style={{
                  fill: 'url(#uuid-44e8ecc0-48df-40b5-a104-48a3b68925a9)',
                  stroke: 'url(#uuid-d5ec4909-15a4-4706-a204-a89225884fb3)',
                  strokeMiterlimit: 10,
                  strokeWidth: '1.09px',
                }}
              />
              <path
                className={styles.cubeFace}
                d="M88.95,98.41l93.88-24.05-29.48,68.64c-2.14,4.99-6.48,8.7-11.73,10.05l-85.54,21.92,32.88-76.55Z"
                style={{
                  fill: 'url(#uuid-f44e7461-3ac2-4808-a564-c01edb591229)',
                  stroke: 'url(#uuid-5c584e8d-1f27-4053-887c-a6b06c6cc33c)',
                  strokeMiterlimit: 10,
                  strokeWidth: '1.09px',
                }}
              />
            </g>
          </g>
        </svg> */}

      <CanvasHeartCube size={70} />
      </div>
      {/* Titolo */}
      <div className={styles.titleContainer}>
        <span
          className={`block text-black font-semibold ${styles.title}`}
        >
          ITALIAN
        </span>
        <span
          className={`block text-black font-semibold ${styles.title}`}
        >
          PROMPT
        </span>        
        <span
          className={`block text-black font-semibold ${styles.title}`}
        >
          BATTLE
        </span>
      </div>
      {/* Paragrafo breve */}
      <div className={styles.description}>
        <span className={styles.descriptionText}>Unisciti alla community italiana dei prompt creator e porta la tua
        creatività al prossimo livello.</span>
      </div>
      {/* CTA */}
      <div className={styles.ctaContainer}>
        <button 
          className={`font-semibold text-black px-7 py-3 ${styles.ctaButton}`}
          onClick={() => onOpenPanel?.('attendee')}
        >
          ENTRA IN<br/>WAIT LIST
        </button>
      </div>
    </div>
  );
};

export default Header; 