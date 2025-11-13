'use client';

import { useState } from 'react';
import { setConsent } from '@/lib/analytics';

const STORAGE_KEY = 'finspeed-consent';

type ConsentState = 'unknown' | 'granted' | 'denied';

function readStored(): ConsentState {
  if (typeof window === 'undefined') return 'unknown';
  return (window.localStorage.getItem(STORAGE_KEY) as ConsentState | null) || 'unknown';
}

export function useConsent() {
  const [state, setState] = useState<ConsentState>(readStored);

  const updateConsent = (next: ConsentState) => {
    setState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setConsent(next === 'granted');
  };

  return { state, updateConsent };
}
