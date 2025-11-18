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
      aria-pressed={theme === 'light'}
      className="focus-ring-target inline-flex items-center gap-2 rounded-full border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--fs-text-primary)] transition hover:border-[var(--fs-primary)]"
      data-theme={theme}
    >
      <span aria-hidden>{ICONS[theme === 'dark' ? 'dark' : 'light']}</span>
      <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
