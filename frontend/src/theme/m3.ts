// Material 3 theme helpers using Material Color Utilities
// Docs: https://github.com/material-foundation/material-color-utilities
'use client'

export type ThemeMode = 'light' | 'dark'

export interface M3ThemeState {
  seed: string
  mode: ThemeMode
}

export const DEFAULT_SEED = '#6750A4' // fallback brand color; can be changed later
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
  try {
    const mod = (await import('@material/material-color-utilities')) as unknown as MaterialColorUtilities
    const theme = mod.themeFromSourceColor(mod.argbFromHex(seedHex))
    mod.applyTheme(theme, { target: root, dark: mode === 'dark' })
    const schemes = theme.schemes as Record<ThemeMode, Map<string, number>>
    const primaryArgb = schemes[mode].get('primary')
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
    const surface = mode === 'dark' ? '#121212' : '#ffffff'
    const onSurface = mode === 'dark' ? '#e5e5e5' : '#1f1f1f'
    root.style.setProperty('--md-sys-color-surface', surface)
    root.style.setProperty('--md-sys-color-on-surface', onSurface)
    root.style.setProperty('--md-sys-color-outline-variant', mode === 'dark' ? '#444' : '#dadada')
    root.style.setProperty('--brand-color', seedHex)
  }

  // Baseline refs for typography/shape (always set)
  root.style.setProperty('--md-ref-typeface-plain', 'var(--font-body), system-ui, -apple-system, Segoe UI, Roboto, sans-serif')
  root.style.setProperty('--md-sys-shape-corner-full', '999px')
  root.style.setProperty('--md-sys-shape-corner-large', '28px')
  root.style.setProperty('--md-sys-shape-corner-medium', '16px')
  root.style.setProperty('--md-sys-shape-corner-small', '12px')
}
