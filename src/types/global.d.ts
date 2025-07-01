declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      command: 'event' | 'consent' | 'js' | 'config',
      targetId: string,
      config?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        analytics_storage?: 'granted' | 'denied';
        ad_storage?: 'granted' | 'denied';
        ad_user_data?: 'granted' | 'denied';
        ad_personalization?: 'granted' | 'denied';
        [key: string]: unknown;
      }
    ) => void;
  }
}

export {}; 