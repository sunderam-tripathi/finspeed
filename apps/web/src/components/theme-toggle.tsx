'use client';

import { useTheme } from './theme-provider';

const ICONS = {
  light: '☀️',
  dark: '🌙'
} as const;

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="focus-ring-target inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white transition hover:border-white/40 data-[theme=light]:border-[color:rgba(15,23,42,0.15)] data-[theme=light]:text-[color:var(--fs-ink)]"
      data-theme={theme}
    >
      <span aria-hidden>{ICONS[theme === 'dark' ? 'dark' : 'light']}</span>
      <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
