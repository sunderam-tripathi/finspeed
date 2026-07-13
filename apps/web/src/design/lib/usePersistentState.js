import React from 'react';

export function usePersistentState(key, initialValue) {
  const [value, setValue] = React.useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored);
    } catch {
      // Fall back to the supplied initial value when storage is unavailable.
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The app remains usable in private or storage-restricted contexts.
    }
  }, [key, value]);

  return [value, setValue];
}
