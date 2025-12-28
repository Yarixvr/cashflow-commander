import { useEffect, useState, useCallback } from 'react';

export type DeviceType = 'mobile' | 'desktop';
export type DeviceMode = 'auto' | 'mobile' | 'desktop';

function detectDeviceType(): DeviceType {
  if (typeof navigator === 'undefined') {
    return typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop';
  }

  const userAgent = navigator.userAgent || navigator.vendor || '';
  const isMobileUA = /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini/i.test(userAgent);

  if (isMobileUA) {
    return 'mobile';
  }

  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  }

  return 'desktop';
}

function getStoredMode(): DeviceMode {
  if (typeof window === 'undefined') return 'auto';
  const stored = localStorage.getItem('deviceMode');
  if (stored === 'mobile' || stored === 'desktop') return stored;
  return 'auto';
}

export function useDeviceType() {
  const [mode, setMode] = useState<DeviceMode>(() => getStoredMode());
  const [autoDetected, setAutoDetected] = useState<DeviceType>(() => detectDeviceType());

  // The effective device type based on mode
  const deviceType: DeviceType = mode === 'auto' ? autoDetected : mode;
  const isMobile = deviceType === 'mobile';
  const isDesktop = deviceType === 'desktop';

  // Handle resize for auto-detection
  useEffect(() => {
    const handleResize = () => {
      setAutoDetected(detectDeviceType());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Apply class to root element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('is-mobile', 'is-desktop');
    root.classList.add(deviceType === 'mobile' ? 'is-mobile' : 'is-desktop');
  }, [deviceType]);

  // Set device mode (auto, mobile, or desktop)
  const setDeviceMode = useCallback((newMode: DeviceMode) => {
    setMode(newMode);
    if (typeof window !== 'undefined') {
      if (newMode === 'auto') {
        localStorage.removeItem('deviceMode');
      } else {
        localStorage.setItem('deviceMode', newMode);
      }
    }
  }, []);

  return {
    deviceType,
    isMobile,
    isDesktop,
    mode,
    setDeviceMode,
    autoDetected,
  };
}
