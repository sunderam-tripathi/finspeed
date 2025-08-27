'use client'

import { useEffect } from 'react'

export default function ClientBootstrap() {
  useEffect(() => {
    // Force enable Material You
    try {
      localStorage.setItem('m3-enabled', 'true')
    } catch {}

    // Store original fetch
    const originalFetch = window.fetch

    // Override fetch to intercept and block cart API calls
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : (input as Request)?.url || ''

      // Block cart API calls with stack trace for debugging
      if (url && (url.includes('/api/v1/cart') || url.endsWith('/cart'))) {
        const stack = new Error().stack
        console.warn('Blocked cart API call to:', url)
        console.debug('Stack trace:', stack)
        return Promise.reject(new Error('Cart functionality is disabled in admin interface'))
      }

      // For other requests, use the original fetch
      return originalFetch(input as any, init)
    }

    // Clean up the fetch override when component unmounts
    return () => {
      window.fetch = originalFetch
    }
  }, [])

  return null
}
