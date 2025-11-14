import { useEffect, useState } from 'react';

export type DeviceType = 'mobile' | 'desktop';

function detectDeviceType() {
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

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => detectDeviceType());

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(detectDeviceType());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.classList.remove('is-mobile', 'is-desktop');
    root.classList.add(deviceType === 'mobile' ? 'is-mobile' : 'is-desktop');

    const body = document.body;
    if (!body) {
      return;
    }

    if (deviceType === 'mobile') {
      body.classList.add('mobile-scroll-body');
    } else {
      body.classList.remove('mobile-scroll-body');
    }
  }, [deviceType]);

  return deviceType;
}
