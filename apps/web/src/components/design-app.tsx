'use client';

import dynamic from 'next/dynamic';
import { useTheme } from '@/components/theme-provider';

const DesignRuntime = dynamic(() => import('@/design/design-runtime.jsx'), {
  ssr: false,
  loading: () => (
    <main
      aria-busy="true"
      aria-label="Loading Finspeed"
      style={{ minHeight: '100vh', background: '#f6f8f9' }}
    />
  )
});

export function DesignApp() {
  const { theme, toggleTheme } = useTheme();

  return <DesignRuntime theme={theme} onThemeToggle={toggleTheme} />;
}
