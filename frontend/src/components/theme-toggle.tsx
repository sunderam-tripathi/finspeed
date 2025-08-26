'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useThemeContext } from '@/theme/ThemeProvider'

export function ThemeToggle() {
  const { mode, toggleMode } = useThemeContext()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="opacity-0 p-2">
        <Sun className="h-5 w-5" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleMode}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">
        {mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </button>
  )
}
