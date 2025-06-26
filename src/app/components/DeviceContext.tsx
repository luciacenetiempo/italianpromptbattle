'use client';

import { createContext, useContext } from 'react';

// Context per la rilevazione mobile/desktop
interface DeviceContextType {
  isMobile: boolean;
  isMobileDetected: boolean;
  audioEnabled: boolean;
}

const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
  isMobileDetected: false,
  audioEnabled: false
});

export const useDevice = () => useContext(DeviceContext);

export { DeviceContext }; 