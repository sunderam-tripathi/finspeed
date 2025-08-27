// Material 3 theme helpers using Material Color Utilities
// Docs: https://github.com/material-foundation/material-color-utilities
'use client'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface M3ThemeState {
  seed: string
  mode: ThemeMode
  // Optional custom colors (used by ThemeProvider state)
  primary?: string
  secondary?: string
  accent?: string
}

// Ocean-first color palette inspired by marine life with teal, navy, and coral accents
export const OCEAN_COLORS = {
  primary: {
    light: '#0D9488', // Ocean teal
    dark: '#5EEAD4',  // Seafoam
  },
  secondary: {
    light: '#1E3A8A', // Deep navy
    dark: '#60A5FA',  // Sky blue
  },
  accent: {
    coral: {
      light: '#FF6B6B',
      dark: '#FCA5A5',
    },
    ocean: {
      light: '#0369A1',
      dark: '#7DD3FC',
    },
    seafoam: {
      light: '#5EEAD4',
      dark: '#99F6E4',
    },
  },
} as const

export const DEFAULT_SEED = OCEAN_COLORS.primary.light // fallback brand color; can be changed later
export const STORAGE_KEYS = {
  seed: 'm3-seed',
  mode: 'm3-mode',
}

export function loadThemeState(): M3ThemeState {
  if (typeof window === 'undefined') return { seed: DEFAULT_SEED, mode: 'light' }
  const seed = window.localStorage.getItem(STORAGE_KEYS.seed) || DEFAULT_SEED
  const mode = (window.localStorage.getItem(STORAGE_KEYS.mode) as ThemeMode) || 'light'
  return { seed, mode }
}

export function saveThemeState(state: M3ThemeState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEYS.seed, state.seed)
  window.localStorage.setItem(STORAGE_KEYS.mode, state.mode)
}

// Minimal local typing to avoid using `any` while not depending on external types
interface MaterialColorUtilities {
  themeFromSourceColor: (src: number) => { schemes: Record<ThemeMode, Map<string, number>> }
  argbFromHex: (hex: string) => number
  applyTheme: (theme: unknown, options: { target: HTMLElement; dark: boolean }) => void
  hexFromArgb: (argb: number) => string
}

export async function applyM3Theme(seedHex: string, mode: ThemeMode) {
  const root = document.documentElement
  const isDark = mode === 'dark' || (mode === 'system' && typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
  try {
    const mod = (await import('@material/material-color-utilities')) as unknown as MaterialColorUtilities
    const theme = mod.themeFromSourceColor(mod.argbFromHex(seedHex))
    mod.applyTheme(theme, { target: root, dark: isDark })
    const schemes = theme.schemes as Record<'light' | 'dark', Map<string, number>>
    const primaryArgb = schemes[isDark ? 'dark' : 'light'].get('primary')
    if (typeof primaryArgb === 'number') {
      const primary = mod.hexFromArgb(primaryArgb)
      root.style.setProperty('--brand-color', primary)
    } else {
      root.style.setProperty('--brand-color', seedHex)
    }
  } catch {
    // Fallback: set a minimal token set so UI is still usable without the lib
    root.style.setProperty('--md-sys-color-primary', seedHex)
    root.style.setProperty('--md-sys-color-on-primary', '#ffffff')
    const surface = isDark ? '#121212' : '#ffffff'
    const onSurface = isDark ? '#e5e5e5' : '#1f1f1f'
    root.style.setProperty('--md-sys-color-surface', surface)
    root.style.setProperty('--md-sys-color-on-surface', onSurface)
    root.style.setProperty('--md-sys-color-outline-variant', isDark ? '#444' : '#dadada')
    root.style.setProperty('--brand-color', seedHex)
  }

  // Baseline refs for typography/shape (always set)
  root.style.setProperty('--md-ref-typeface-plain', 'var(--font-body), system-ui, -apple-system, Segoe UI, Roboto, sans-serif')
  root.style.setProperty('--md-sys-shape-corner-full', '999px')
  root.style.setProperty('--md-sys-shape-corner-large', '28px')
  root.style.setProperty('--md-sys-shape-corner-medium', '16px')
  root.style.setProperty('--md-sys-shape-corner-small', '12px')
}
