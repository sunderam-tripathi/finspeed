"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { applyM3Theme, loadThemeState, saveThemeState, ThemeMode } from "./m3";

export interface ThemeContextValue {
  mode: ThemeMode;
  seed: string;
  setSeed: (hex: string) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}

export const useTheme = useThemeContext;

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initial = loadThemeState();
  const [seed, setSeedState] = useState(initial.seed);
  const [mode, setMode] = useState<ThemeMode>(initial.mode);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', mode === 'dark');
      applyM3Theme(seed, mode);
    }
    saveThemeState({ seed, mode });
  }, [seed, mode]);

  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    seed,
    setSeed: (hex: string) => setSeedState(hex),
    toggleMode: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
  }), [mode, seed]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
