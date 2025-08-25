'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeMode, applyM3Theme, loadThemeState, saveThemeState, DEFAULT_SEED, OCEAN_COLORS } from './m3'

type ThemeColorPreset = {
  primary: string
  secondary: string
  accent: string
}

type ThemeContextType = {
  // Theme mode
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  isDark: boolean
  
  // Color controls
  seed: string
  setSeed: (seed: string) => void
  primary: string
  setPrimary: (color: string) => void
  secondary: string
  setSecondary: (color: string) => void
  accent: string
  setAccent: (color: string) => void
  
  // Color presets
  presets: {
    ocean: ThemeColorPreset
    coral: ThemeColorPreset
    seafoam: ThemeColorPreset
  }
  applyPreset: (preset: 'ocean' | 'coral' | 'seafoam') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [themeState, setThemeState] = useState(loadThemeState)
  
  // Determine if the current theme is dark
  const isDark = themeState.mode === 'dark' || 
    (themeState.mode === 'system' && 
     typeof window !== 'undefined' && 
     window.matchMedia('(prefers-color-scheme: dark)').matches)

  // Apply theme when any theme state changes
  useEffect(() => {
    // Only apply theme in browser environment
    if (typeof window === 'undefined') return
    
    // Apply the M3 theme with current settings
    applyM3Theme(themeState.seed, themeState.mode)
    
    // Save theme state to localStorage
    saveThemeState(themeState)
    
    // Update document class for dark mode
    const isDark = themeState.mode === 'dark' || 
      (themeState.mode === 'system' && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
    }
  }, [themeState])

  // Set up system theme change listener for 'system' mode
  useEffect(() => {
    if (themeState.mode !== 'system') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      // Re-apply theme when system color scheme changes
      applyM3Theme(themeState.seed, 'system')
      
      // Update document class
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark')
        document.documentElement.style.colorScheme = 'dark'
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.style.colorScheme = 'light'
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeState.mode, themeState.seed])

  // Set mounted flag to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const value = useMemo(
    () => ({
      // Theme mode controls
      mode: themeState.mode,
      setMode: (mode: ThemeMode) => setThemeState(prev => ({ ...prev, mode })),
      toggleMode: () => {
        setThemeState(prev => ({
          ...prev,
          mode: prev.mode === 'light' ? 'dark' : 'light',
        }))
      },
      
      // Seed color
      seed: themeState.seed,
      setSeed: (seed: string) => setThemeState(prev => ({ 
        ...prev, 
        seed,
        // Reset derived colors when seed changes
        primary: seed,
        secondary: OCEAN_COLORS.secondary[isDark ? 'dark' : 'light'],
        accent: OCEAN_COLORS.accent.coral[isDark ? 'dark' : 'light']
      })),
      
      // Theme colors
      primary: themeState.primary || DEFAULT_SEED,
      setPrimary: (primary: string) => setThemeState(prev => ({ ...prev, primary })),
      
      secondary: themeState.secondary || OCEAN_COLORS.secondary[isDark ? 'dark' : 'light'],
      setSecondary: (secondary: string) => setThemeState(prev => ({ ...prev, secondary })),
      
      accent: themeState.accent || OCEAN_COLORS.accent.coral[isDark ? 'dark' : 'light'],
      setAccent: (accent: string) => setThemeState(prev => ({ ...prev, accent })),
      
      // Computed values
      isDark,
      
      // Color presets
      presets: {
        ocean: {
          primary: OCEAN_COLORS.primary[isDark ? 'dark' : 'light'],
          secondary: OCEAN_COLORS.secondary[isDark ? 'dark' : 'light'],
          accent: OCEAN_COLORS.accent.ocean[isDark ? 'dark' : 'light']
        },
        coral: {
          primary: OCEAN_COLORS.primary[isDark ? 'dark' : 'light'],
          secondary: OCEAN_COLORS.secondary[isDark ? 'dark' : 'light'],
          accent: OCEAN_COLORS.accent.coral[isDark ? 'dark' : 'light']
        },
        seafoam: {
          primary: OCEAN_COLORS.primary[isDark ? 'dark' : 'light'],
          secondary: OCEAN_COLORS.secondary[isDark ? 'dark' : 'light'],
          accent: OCEAN_COLORS.accent.seafoam[isDark ? 'dark' : 'light']
        }
      },
      
      // Apply a preset
      applyPreset: (preset: 'ocean' | 'coral' | 'seafoam') => {
        const colors = {
          ocean: {
            primary: OCEAN_COLORS.primary[isDark ? 'dark' : 'light'],
            secondary: OCEAN_COLORS.secondary[isDark ? 'dark' : 'light'],
            accent: OCEAN_COLORS.accent.ocean[isDark ? 'dark' : 'light']
          },
          coral: {
            primary: OCEAN_COLORS.primary[isDark ? 'dark' : 'light'],
            secondary: OCEAN_COLORS.secondary[isDark ? 'dark' : 'light'],
            accent: OCEAN_COLORS.accent.coral[isDark ? 'dark' : 'light']
          },
          seafoam: {
            primary: OCEAN_COLORS.primary[isDark ? 'dark' : 'light'],
            secondary: OCEAN_COLORS.secondary[isDark ? 'dark' : 'light'],
            accent: OCEAN_COLORS.accent.seafoam[isDark ? 'dark' : 'light']
          }
        }[preset]
        
        setThemeState(prev => ({
          ...prev,
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent
        }))
      }
    }),
    [themeState, isDark]
  )

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
