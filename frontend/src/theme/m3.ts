// Material 3 theme helpers using Material Color Utilities
// Docs: https://github.com/material-foundation/material-color-utilities
'use client'

// Dynamic import to avoid SSR issues
let materialColorUtils: any = null;

async function getMaterialColorUtils() {
  if (!materialColorUtils) {
    materialColorUtils = await import('@material/material-color-utilities');
  }
  return materialColorUtils;
}

export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Ocean-first color palette tokens
 * Inspired by marine life with a focus on teal, navy, and coral accents
 */
export const OCEAN_COLORS = {
  // Primary colors (teal)
  primary: {
    light: '#0D9488', // Ocean teal
    dark: '#5EEAD4',  // Seafoam
  },
  // Secondary colors (navy)
  secondary: {
    light: '#1E3A8A', // Deep navy
    dark: '#60A5FA',  // Sky blue
  },
  // Accent colors
  accent: {
    coral: {
      light: '#FF6B6B', // Vibrant coral
      dark: '#FCA5A5',  // Soft coral
    },
    ocean: {
      light: '#0369A1', // Deep ocean
      dark: '#7DD3FC',  // Light ocean
    },
    seafoam: {
      light: '#5EEAD4', // Seafoam
      dark: '#99F6E4',  // Light seafoam
    },
  },
  // Extended color palette
  extended: {
    midnight: '#0F172A', // Deep midnight blue
    abyss: '#020617',    // Near black
    foam: '#F0FDFA',     // Off-white with teal tint
    sand: '#F5F5F4',     // Neutral light
    stone: '#44403C',    // Neutral dark
  },
  // Semantic colors
  success: {
    light: '#10B981', // Emerald
    dark: '#34D399',  // Light emerald
  },
  warning: {
    light: '#F59E0B', // Amber
    dark: '#FBBF24',  // Light amber
  },
  error: {
    light: '#EF4444', // Red
    dark: '#F87171',  // Light red
  },
  info: {
    light: '#3B82F6', // Blue
    dark: '#60A5FA',  // Light blue
  },
  // Neutrals with ocean influence
  neutral: {
    light: {
      surface: '#FFFFFF',
      onSurface: '#0F172A',
      surfaceVariant: '#ECFDF5', // Subtle teal tint
      onSurfaceVariant: '#334155',
      outline: '#94A3B8',
      outlineVariant: '#E2E8F0',
      surfaceContainer: '#F8FAFC',
      surfaceContainerHigh: '#F1F5F9',
      surfaceContainerHighest: '#E2E8F0',
    },
    dark: {
      surface: '#020617',
      onSurface: '#E2E8F0',
      surfaceVariant: '#1E293B',
      onSurfaceVariant: '#CBD5E1',
      outline: '#64748B',
      outlineVariant: '#334155',
      surfaceContainer: '#0F172A',
      surfaceContainerHigh: '#1E293B',
      surfaceContainerHighest: '#334155',
    },
  },
  // Feedback colors
  feedback: {
    error: {
      light: '#B00020',
      dark: '#CF6679',
    },
    success: {
      light: '#2E7D32',
      dark: '#69F0AE',
    },
    warning: {
      light: '#FF8F00',
      dark: '#FFD95E',
    },
    info: {
      light: '#2962FF',
      dark: '#82B1FF',
    },
  },
}

export interface M3ThemeState {
  seed: string
  mode: ThemeMode
  primary?: string
  secondary?: string
  accent?: string
}

export const DEFAULT_SEED = OCEAN_COLORS.primary.light
export const STORAGE_KEYS = {
  seed: 'm3-seed',
  mode: 'm3-mode',
  primary: 'm3-primary',
  secondary: 'm3-secondary',
  accent: 'm3-accent',
}

/**
 * Load theme state from localStorage
 */
export function loadThemeState(): M3ThemeState {
  if (typeof window === 'undefined') {
    return { 
      seed: DEFAULT_SEED, 
      mode: 'light',
      primary: OCEAN_COLORS.primary.light,
      secondary: OCEAN_COLORS.secondary.light,
      accent: OCEAN_COLORS.accent.coral.light,
    }
  }
  
  const seed = window.localStorage.getItem(STORAGE_KEYS.seed) || DEFAULT_SEED
  const mode = (window.localStorage.getItem(STORAGE_KEYS.mode) as ThemeMode) || 'light'
  const primary = window.localStorage.getItem(STORAGE_KEYS.primary) || OCEAN_COLORS.primary.light
  const secondary = window.localStorage.getItem(STORAGE_KEYS.secondary) || OCEAN_COLORS.secondary.light
  const accent = window.localStorage.getItem(STORAGE_KEYS.accent) || OCEAN_COLORS.accent.coral.light
  
  return { seed, mode, primary, secondary, accent }
}

/**
 * Save theme state to localStorage
 */
export function saveThemeState(state: M3ThemeState) {
  if (typeof window === 'undefined') return
  
  const { seed, mode, primary, secondary, accent } = state
  
  if (seed) window.localStorage.setItem(STORAGE_KEYS.seed, seed)
  if (mode) window.localStorage.setItem(STORAGE_KEYS.mode, mode)
  if (primary) window.localStorage.setItem(STORAGE_KEYS.primary, primary)
  if (secondary) window.localStorage.setItem(STORAGE_KEYS.secondary, secondary)
  if (accent) window.localStorage.setItem(STORAGE_KEYS.accent, accent)
}

/**
 * Apply Material You theming with ocean-first design tokens
 */
export async function applyM3Theme(seedHex: string, mode: ThemeMode) {
  const root = document.documentElement
  const isDark = mode === 'dark' || (mode === 'system' && 
    window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  // Apply base theme first
  applyBaseTheme(root, isDark)
  
  try {
    // Get Material Color Utilities dynamically
    const mcu = await getMaterialColorUtils();
    
    // Generate theme from seed color
    const seed = mcu.argbFromHex(seedHex)
    const theme = mcu.themeFromSourceColor(seed, [
      {
        name: 'ocean',
        value: mcu.argbFromHex(OCEAN_COLORS.accent.ocean[isDark ? 'dark' : 'light']),
        blend: true,
      },
    ])

    // Get the scheme for the current theme mode
    const scheme = theme.schemes[isDark ? 'dark' : 'light']
    
    // Extract and set custom colors
    const getColor = (color: number) => mcu.hexFromArgb(color)
    const primary = getColor(scheme.primary)
    const onPrimary = getColor(scheme.onPrimary)
    const primaryContainer = getColor(scheme.primaryContainer)
    const onPrimaryContainer = getColor(scheme.onPrimaryContainer)
    const secondary = getColor(scheme.secondary)
    const onSecondary = getColor(scheme.onSecondary)
    const secondaryContainer = getColor(scheme.secondaryContainer)
    const onSecondaryContainer = getColor(scheme.onSecondaryContainer)
    const tertiary = getColor(scheme.tertiary)
    const onTertiary = getColor(scheme.onTertiary)
    const tertiaryContainer = getColor(scheme.tertiaryContainer)
    const onTertiaryContainer = getColor(scheme.onTertiaryContainer)
    const error = getColor(scheme.error)
    const onError = getColor(scheme.onError)
    const errorContainer = getColor(scheme.errorContainer)
    const onErrorContainer = getColor(scheme.onErrorContainer)
    const background = getColor(scheme.background)
    const onBackground = getColor(scheme.onBackground)
    const surface = getColor(scheme.surface)
    const onSurface = getColor(scheme.onSurface)
    const surfaceVariant = getColor(scheme.surfaceVariant)
    // Set CSS custom properties with fallbacks for missing values
    const onSurfaceVariant = getColor(scheme.onSurfaceVariant) || (isDark ? '#BEC8C8' : '#3F4849')
    const outline = getColor(scheme.outline) || (isDark ? '#899392' : '#6F7979')
    const shadow = getColor(scheme.shadow) || (isDark ? '#000000' : '#000000')
    
    // Set CSS custom properties
    root.style.setProperty('--md-sys-color-primary', primary)
    root.style.setProperty('--md-sys-color-on-primary', onPrimary)
    root.style.setProperty('--md-sys-color-primary-container', primaryContainer)
    root.style.setProperty('--md-sys-color-on-primary-container', onPrimaryContainer)
    
    root.style.setProperty('--md-sys-color-secondary', secondary)
    root.style.setProperty('--md-sys-color-on-secondary', onSecondary)
    root.style.setProperty('--md-sys-color-secondary-container', secondaryContainer)
    root.style.setProperty('--md-sys-color-on-secondary-container', onSecondaryContainer)
    
    root.style.setProperty('--md-sys-color-error', error)
    root.style.setProperty('--md-sys-color-on-error', onError)
    root.style.setProperty('--md-sys-color-error-container', errorContainer)
    root.style.setProperty('--md-sys-color-on-error-container', onErrorContainer)
    
    root.style.setProperty('--md-sys-color-background', background)
    root.style.setProperty('--md-sys-color-on-background', onBackground)
    root.style.setProperty('--md-sys-color-surface', surface)
    root.style.setProperty('--md-sys-color-on-surface', onSurface)
    root.style.setProperty('--md-sys-color-surface-variant', surfaceVariant)
    root.style.setProperty('--md-sys-color-on-surface-variant', onSurfaceVariant)
    
    root.style.setProperty('--md-sys-color-outline', outline)
    root.style.setProperty('--md-sys-color-shadow', shadow)
    
    // Set brand color for reference
    root.style.setProperty('--brand-color', primary)
    
    // Set ocean accent colors
    root.style.setProperty('--ocean-accent-coral', OCEAN_COLORS.accent.coral[isDark ? 'dark' : 'light'])
    root.style.setProperty('--ocean-accent-ocean', OCEAN_COLORS.accent.ocean[isDark ? 'dark' : 'light'])
    
    // Set success, warning, info colors
    root.style.setProperty('--md-sys-color-success', OCEAN_COLORS.success[isDark ? 'dark' : 'light'])
    root.style.setProperty('--md-sys-color-warning', OCEAN_COLORS.warning[isDark ? 'dark' : 'light'])
    root.style.setProperty('--md-sys-color-info', OCEAN_COLORS.info[isDark ? 'dark' : 'light'])
    
  } catch (error) {
    console.error('Failed to apply M3 theme:', error)
    // Fallback to basic theming if Material Color Utilities fails
    applyFallbackTheme(seedHex, isDark)
  }
  
  // Always set these properties
  applyBaseTheme(root, isDark)
}

/**
 * Apply fallback theme when Material Color Utilities is not available
 */
function applyFallbackTheme(seedHex: string, isDark: boolean) {
  const root = document.documentElement
  
  // Get colors from our ocean-first palette
  const primary = seedHex
  const secondary = OCEAN_COLORS.secondary[isDark ? 'dark' : 'light']
  const accent = OCEAN_COLORS.accent.coral[isDark ? 'dark' : 'light']
  const error = OCEAN_COLORS.feedback.error[isDark ? 'dark' : 'light']
  const success = OCEAN_COLORS.feedback.success[isDark ? 'dark' : 'light']
  const warning = OCEAN_COLORS.feedback.warning[isDark ? 'dark' : 'light']
  const info = OCEAN_COLORS.feedback.info[isDark ? 'dark' : 'light']
  
  // Get neutral colors
  const neutral = OCEAN_COLORS.neutral[isDark ? 'dark' : 'light']
  
  // Set primary color palette
  root.style.setProperty('--md-sys-color-primary', primary)
  root.style.setProperty('--md-sys-color-on-primary', isDark ? OCEAN_COLORS.neutral.dark.surface : '#FFFFFF')
  root.style.setProperty('--md-sys-color-primary-container', isDark ? 
    OCEAN_COLORS.primary.dark : 
    OCEAN_COLORS.primary.light + '1A' // 10% opacity
  )
  
  // Set secondary color palette
  root.style.setProperty('--md-sys-color-secondary', secondary)
  root.style.setProperty('--md-sys-color-on-secondary', '#FFFFFF')
  root.style.setProperty('--md-sys-color-secondary-container', isDark ? 
    OCEAN_COLORS.secondary.dark + '33' : // 20% opacity
    OCEAN_COLORS.secondary.light + '1A'  // 10% opacity
  )
  
  // Set surface colors
  root.style.setProperty('--md-sys-color-background', neutral.surface)
  root.style.setProperty('--md-sys-color-on-background', neutral.onSurface)
  root.style.setProperty('--md-sys-color-surface', neutral.surface)
  root.style.setProperty('--md-sys-color-on-surface', neutral.onSurface)
  root.style.setProperty('--md-sys-color-surface-variant', neutral.surfaceVariant)
  root.style.setProperty('--md-sys-color-on-surface-variant', neutral.onSurfaceVariant)
  
  // Set outline colors
  root.style.setProperty('--md-sys-color-outline', neutral.outline)
  root.style.setProperty('--md-sys-color-outline-variant', neutral.outlineVariant)
  
  // Set feedback colors
  root.style.setProperty('--md-sys-color-error', error)
  root.style.setProperty('--md-sys-color-on-error', '#FFFFFF')
  root.style.setProperty('--md-sys-color-error-container', isDark ? '#93000A' : '#FFDAD6')
  
  root.style.setProperty('--md-sys-color-success', success)
  root.style.setProperty('--md-sys-color-warning', warning)
  root.style.setProperty('--md-sys-color-info', info)
  
  // Set brand and accent colors
  root.style.setProperty('--brand-color', primary)
  root.style.setProperty('--ocean-accent-coral', OCEAN_COLORS.accent.coral[isDark ? 'dark' : 'light'])
  root.style.setProperty('--ocean-accent-ocean', OCEAN_COLORS.accent.ocean[isDark ? 'dark' : 'light'])
}

/**
 * Apply base theme properties that are always needed
 */
function applyBaseTheme(root: HTMLElement, isDark: boolean) {
  // Typography - Using system-ui for better performance and consistency
  root.style.setProperty('--md-ref-typeface-plain', 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif')
  root.style.setProperty('--md-ref-typeface-brand', 'var(--font-display, system-ui), var(--font-body, system-ui), -apple-system, sans-serif')
  
  // Elevation - Enhanced with ocean-inspired shadows
  const elevationColor = isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 20, 40, 0.15)'
  root.style.setProperty('--md-sys-elevation-level0', 'none')
  root.style.setProperty('--md-sys-elevation-level1', `0 2px 3px ${elevationColor}`)
  root.style.setProperty('--md-sys-elevation-level2', `0 4px 6px ${elevationColor}`)
  root.style.setProperty('--md-sys-elevation-level3', `0 8px 10px ${elevationColor}`)
  root.style.setProperty('--md-sys-elevation-level4', `0 12px 16px ${elevationColor}`)
  root.style.setProperty('--md-sys-elevation-level5', `0 16px 24px ${elevationColor}`)
  
  // Typography - Ocean-inspired font sizes and weights (normalized)
  root.style.setProperty('--md-sys-typescale-display-large-font-size', '3.5rem')
  root.style.setProperty('--md-sys-typescale-display-medium-font-size', '2.8rem')
  root.style.setProperty('--md-sys-typescale-display-small-font-size', '2.25rem')
  root.style.setProperty('--md-sys-typescale-headline-large-font-size', '2rem')
  root.style.setProperty('--md-sys-typescale-headline-medium-font-size', '1.75rem')
  root.style.setProperty('--md-sys-typescale-headline-small-font-size', '1.5rem')
  root.style.setProperty('--md-sys-typescale-title-large-font-size', '1.375rem')
  root.style.setProperty('--md-sys-typescale-title-medium-font-size', '1rem')
  root.style.setProperty('--md-sys-typescale-title-small-font-size', '0.875rem')
  root.style.setProperty('--md-sys-typescale-body-large-font-size', '1rem')
  root.style.setProperty('--md-sys-typescale-body-medium-font-size', '0.875rem')
  root.style.setProperty('--md-sys-typescale-body-small-font-size', '0.75rem')
  root.style.setProperty('--md-sys-typescale-label-large-font-size', '0.875rem')
  root.style.setProperty('--md-sys-typescale-label-medium-font-size', '0.75rem')
  root.style.setProperty('--md-sys-typescale-label-small-font-size', '0.6875rem')
  
  // Shape - Ocean-inspired rounded corners
  root.style.setProperty('--md-sys-shape-corner-none', '0')
  root.style.setProperty('--md-sys-shape-corner-extra-small', '2px') // Small waves
  root.style.setProperty('--md-sys-shape-corner-small', '4px') // Gentle curves
  root.style.setProperty('--md-sys-shape-corner-medium', '8px') // Smooth ripples
  root.style.setProperty('--md-sys-shape-corner-large', '12px') // Ocean bubbles
  root.style.setProperty('--md-sys-shape-corner-extra-large', '24px') // Large waves
  root.style.setProperty('--md-sys-shape-corner-full', '9999px')
  
  // State layer opacity - Subtle ocean transparency
  root.style.setProperty('--md-sys-state-hover-state-layer-opacity', '0.08')
  root.style.setProperty('--md-sys-state-focus-state-layer-opacity', '0.12')
  root.style.setProperty('--md-sys-state-pressed-state-layer-opacity', '0.12')
  root.style.setProperty('--md-sys-state-dragged-state-layer-opacity', '0.16')
  
  // Motion - Ocean-inspired timing and easing
  root.style.setProperty('--md-sys-motion-duration-short1', '100ms') // Quick splash
  root.style.setProperty('--md-sys-motion-duration-short2', '150ms') // Gentle wave
  root.style.setProperty('--md-sys-motion-duration-medium1', '200ms') // Smooth current
  root.style.setProperty('--md-sys-motion-duration-medium2', '300ms') // Ocean swell
  root.style.setProperty('--md-sys-motion-duration-long1', '400ms') // Deep current
  root.style.setProperty('--md-sys-motion-duration-long2', '500ms') // Slow tide
  
  // Easing curves inspired by ocean motion
  root.style.setProperty('--md-sys-motion-easing-linear', 'cubic-bezier(0, 0, 1, 1)')
  root.style.setProperty('--md-sys-motion-easing-standard', 'cubic-bezier(0.2, 0, 0, 1)') // Gentle wave
  root.style.setProperty('--md-sys-motion-easing-emphasized', 'cubic-bezier(0.2, 0, 0, 1)') // Smooth swell
  root.style.setProperty('--md-sys-motion-easing-emphasized-decelerate', 'cubic-bezier(0.1, 0.5, 0.1, 1)') // Wave pulling back
  root.style.setProperty('--md-sys-motion-easing-emphasized-accelerate', 'cubic-bezier(0.3, 0, 0.8, 0.15)') // Wave crashing
  
  // Apply dark/light mode classes
  if (isDark) {
    document.documentElement.classList.add('dark')
    document.documentElement.style.colorScheme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
  }
  
  // Set color-scheme for form controls
  root.style.setProperty('color-scheme', isDark ? 'dark' : 'light')
  
  // Set scrollbar styling
  root.style.setProperty('--scrollbar-thumb', isDark ? '#4B5563' : '#9CA3AF')
  root.style.setProperty('--scrollbar-track', isDark ? '#1F2937' : '#E5E7EB')
}
