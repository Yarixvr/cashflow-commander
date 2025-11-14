import { useEffect, useState } from 'react';

export type DeviceType = 'mobile' | 'desktop';

function detectDeviceType() {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (coarsePointer) {
    return 'mobile';
  }

  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent || navigator.vendor || '';
    const isMobileUA = /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini/i.test(userAgent);

    if (isMobileUA) {
      return 'mobile';
    }
  }

  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => detectDeviceType());

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(detectDeviceType());
    };

    window.addEventListener('resize', handleResize);
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const handlePointerChange = () => {
      setDeviceType(detectDeviceType());
    };

    coarseQuery.addEventListener?.('change', handlePointerChange);
    coarseQuery.addListener?.(handlePointerChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      coarseQuery.removeEventListener?.('change', handlePointerChange);
      coarseQuery.removeListener?.(handlePointerChange);
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
      body.classList.add('mobile-scroll-body', 'mobile-smooth-scroll');
    } else {
      body.classList.remove('mobile-scroll-body', 'mobile-smooth-scroll');
    }

    return () => {
      root.classList.remove('is-mobile', 'is-desktop');
      body.classList.remove('mobile-scroll-body', 'mobile-smooth-scroll');
    };
  }, [deviceType]);

  return deviceType;
}
