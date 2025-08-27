"use client"

import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useTheme } from '../../../theme/theme-context'
import { Sun, Moon, Monitor, Waves, Fish, Droplets } from 'lucide-react'

type ThemeMode = 'light' | 'dark' | 'system'

// Ocean-first color presets
const OCEAN_PRESETS = {
  ocean: {
    primary: '#0369A1',
    secondary: '#0D9488',
    accent: '#5EEAD4',
    name: 'Ocean',
    icon: <Waves className="w-4 h-4" />
  },
  coral: {
    primary: '#FF6B6B',
    secondary: '#F97316',
    accent: '#FEF3C7',
    name: 'Coral',
    icon: <Fish className="w-4 h-4" />
  },
  seafoam: {
    primary: '#0D9488',
    secondary: '#14B8A6',
    accent: '#CCFBF1',
    name: 'Seafoam',
    icon: <Droplets className="w-4 h-4" />
  }
}

// Color swatch component for theme presets
const ColorSwatch = ({ 
  color, 
  name, 
  active = false, 
  onClick 
}: { 
  color: string
  name: string 
  active?: boolean
  onClick?: () => void 
}) => (
  <div className="flex flex-col items-center gap-2">
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-full border-2 transition-colors ${
        active 
          ? 'border-primary ring-2 ring-offset-2 ring-primary/50' 
          : 'border-muted-foreground/20 hover:border-primary'
      }`}
      style={{ backgroundColor: color }}
      aria-label={`Select ${name} color`}
    />
    <span className="text-xs text-muted-foreground">{name}</span>
  </div>
)

// Demo page component
export default function ThemeDemo() {
  const {
    mode,
    setMode,
    toggleMode,
    isDark,
    seed,
    setSeed,
    primary,
    setPrimary,
    secondary,
    setSecondary,
    accent,
    setAccent,
    applyPreset
  } = useTheme()

  const [elevation, setElevation] = useState(1)
  const [rounded, setRounded] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [customColor, setCustomColor] = useState(seed)

  // Apply elevation and rounded corners
  useEffect(() => {
    document.documentElement.style.setProperty('--elevation', `${elevation}`)
    document.documentElement.style.setProperty('--rounded', rounded ? 'var(--radius)' : '0')
  }, [elevation, rounded])

  // Update custom color when seed changes
  useEffect(() => {
    setCustomColor(seed)
  }, [seed])

  // Apply custom color when input changes
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setCustomColor(newColor)
    setSeed(newColor)
  }

  // Apply preset - renamed to avoid conflict with useTheme's applyPreset
  const applyColorPreset = (preset: keyof typeof OCEAN_PRESETS) => {
    const { primary, secondary, accent } = OCEAN_PRESETS[preset]
    setPrimary(primary)
    setSecondary(secondary)
    setAccent(accent)
  }

  // Format color for display
  const formatColor = (color: string) => color.replace('#', '').toUpperCase()

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Material You Theme Demo</h1>
        <ThemeToggle />
      </div>

      {/* Theme Presets */}
      <div className="bg-surface rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Ocean Theme Presets</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Choose from ocean-inspired color schemes</p>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(OCEAN_PRESETS).map(([name, colors]) => (
            <button
              key={name}
              onClick={() => applyColorPreset(name as keyof typeof OCEAN_PRESETS)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              {name === 'ocean' && <Waves className="w-4 h-4" />}
              {name === 'reef' && <Fish className="w-4 h-4" />}
              {name === 'deep' && <Droplets className="w-4 h-4" />}
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Color Customization */}
      <div className="bg-surface rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Custom Colors</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Fine-tune your Material You theme</p>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                className="w-12 h-12 rounded-full border-2 border-muted-foreground/20"
                style={{ backgroundColor: primary }}
              />
              <div 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background"
                style={{ backgroundColor: accent }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="seed-color" className="block text-sm font-medium">Seed Color</label>
              <div className="flex gap-2">
                <input
                  id="seed-color"
                  type="color"
                  value={customColor}
                  onChange={handleColorChange}
                  className="w-20 h-10 rounded border"
                />
                <input
                  type="text"
                  value={formatColor(customColor)}
                  onChange={(e) => {
                    const hex = '#' + e.target.value.replace('#', '')
                    if (/^#[0-9A-F]{6}$/i.test(hex)) {
                      setCustomColor(hex)
                      setSeed(hex)
                    }
                  }}
                  placeholder="HEX color"
                  className="flex-1 px-3 py-2 rounded border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Mode */}
      <div className="bg-surface rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Theme Mode</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Choose between light, dark, or system preference</p>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setMode('light')}
            className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
              mode === 'light' ? 'bg-accent/20' : 'hover:bg-accent/10'
            }`}
          >
            <div className="p-3 rounded-lg bg-white border mb-2">
              <Sun className="w-6 h-6 text-foreground" />
            </div>
            <span>Light</span>
          </button>
          <button
            onClick={() => setMode('dark')}
            className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
              mode === 'dark' ? 'bg-accent/20' : 'hover:bg-accent/10'
            }`}
          >
            <div className="p-3 rounded-lg bg-foreground border border-border mb-2">
              <Moon className="w-6 h-6 text-background" />
            </div>
            <span>Dark</span>
          </button>
          <button
            onClick={() => setMode('system')}
            className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
              mode === 'system' ? 'bg-accent/20' : 'hover:bg-accent/10'
            }`}
          >
            <div className="p-3 rounded-lg bg-background border border-border mb-2">
              <Monitor className="w-6 h-6 text-foreground" />
            </div>
            <span>System</span>
          </button>
        </div>
      </div>

      {/* UI Components */}
      <div className="bg-surface rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">UI Components</h2>
          <button 
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>
        <div className="space-y-6">
          {/* Buttons */}
          <div>
            <h3 className="text-sm font-medium mb-3">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors">Primary</button>
              <button className="px-4 py-2 rounded-md bg-secondary text-white hover:bg-secondary-dark transition-colors">Secondary</button>
              <button className="px-4 py-2 rounded-md border border-primary text-primary hover:text-primary-dark transition-colors">Outline</button>
              <button className="px-4 py-2 rounded-md text-primary hover:text-primary-dark transition-colors">Ghost</button>
              <button className="px-4 py-2 rounded-md text-primary hover:text-primary-dark transition-colors">Link</button>
            </div>
          </div>

          {/* Form Elements */}
          <div>
            <h3 className="text-sm font-medium mb-3">Form Elements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="primary" className="block text-sm font-medium">Primary Color</label>
                <input
                  id="primary"
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="w-full h-10 rounded border"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="secondary" className="block text-sm font-medium">Secondary Color</label>
                <input
                  id="secondary"
                  type="color"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                  className="w-full h-10 rounded border"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="accent" className="block text-sm font-medium">Accent Color</label>
                <input
                  id="accent"
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="w-full h-10 rounded border"
                />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-sm font-medium mb-3">Cards</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-surface rounded-lg p-6 shadow-md">
                <h4 className="text-lg font-medium mb-2">Card Title</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Card description goes here</p>
                <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors">Learn More</button>
              </div>
              <div className="bg-surface rounded-lg p-6 shadow-md">
                <h4 className="text-lg font-medium mb-2">Card Title</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Card description goes here</p>
                <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors">Learn More</button>
              </div>
              <div className="bg-surface rounded-lg p-6 shadow-md">
                <h4 className="text-lg font-medium mb-2">Card Title</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Card description goes here</p>
                <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors">Learn More</button>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Advanced Options</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="elevation" className="text-sm font-medium">Elevation Level</label>
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">{elevation}</span>
                </div>
                <input
                  id="elevation"
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={elevation}
                  onChange={(e) => setElevation(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="rounded" className="text-sm font-medium">Rounded Corners</label>
                <input
                  id="rounded"
                  type="checkbox"
                  checked={rounded}
                  onChange={(e) => setRounded(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs text-muted-foreground">Primary</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: primary }}
                    />
                    <code className="text-xs">#{formatColor(primary)}</code>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Secondary</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: secondary }}
                    />
                    <code className="text-xs">#{formatColor(secondary)}</code>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Accent</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: accent }}
                    />
                    <code className="text-xs">#{formatColor(accent)}</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
