'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { setConsent } from '@/lib/analytics';

const STORAGE_KEY = 'finspeed-consent';

type ConsentState = 'unknown' | 'granted' | 'denied';

let memoryConsent: ConsentState = 'unknown';
const listeners = new Set<() => void>();

function isConsentState(value: string | null): value is ConsentState {
  return value === 'granted' || value === 'denied';
}

function readStored(): ConsentState {
  if (typeof window === 'undefined') return memoryConsent;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isConsentState(stored)) memoryConsent = stored;
  } catch {
    // Restricted storage must not block an in-session consent choice.
  }
  return memoryConsent;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const syncStoredConsent = () => {
    readStored();
    listener();
  };
  window.addEventListener('storage', syncStoredConsent);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', syncStoredConsent);
  };
}

function getServerSnapshot(): ConsentState {
  return 'unknown';
}

export function useConsent() {
  const state = useSyncExternalStore(subscribe, readStored, getServerSnapshot);

  const updateConsent = useCallback((next: ConsentState) => {
    memoryConsent = next;
    setConsent(next === 'granted');
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The visible decision still takes effect when persistence is blocked.
    }
    listeners.forEach((listener) => listener());
  }, []);

  return { state, updateConsent };
}
