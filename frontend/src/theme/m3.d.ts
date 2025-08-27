// Type definitions for Material You (M3) theme

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeState {
  mode: ThemeMode
  seed: string
  primary?: string
  secondary?: string
  accent?: string
}

export function applyM3Theme(seed: string, mode: ThemeMode): Promise<void>
export function loadThemeState(): ThemeState
export function saveThemeState(state: ThemeState): void
