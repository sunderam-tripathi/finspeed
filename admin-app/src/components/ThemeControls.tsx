'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/theme/theme-context';
import { SwatchIcon } from '@heroicons/react/24/outline';

export default function ThemeControls() {
  const { mode, toggleMode, seed, setSeed } = useTheme();
  const [open, setOpen] = useState(false);
  const [localSeed, setLocalSeed] = useState(seed);

  useEffect(() => setLocalSeed(seed), [seed]);

  return (
    <div className="relative">
      <button
        className="inline-flex items-center gap-2 px-3 py-2 md-outline rounded-full hover:bg-[color:var(--md-sys-color-surface-container)]"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <SwatchIcon className="h-5 w-5 text-[color:var(--md-sys-color-primary)]" aria-hidden />
        <span className="hidden sm:inline text-sm">Theme</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 p-4 rounded-2xl md-elevation-1 md-surface border border-[color:var(--md-sys-color-outline-variant)] z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Appearance</span>
            <button className="btn-outlined text-sm" onClick={() => toggleMode()}>
              {mode === 'light' ? 'Dark' : 'Light'} mode
            </button>
          </div>
          <div className="space-y-2">
            <label htmlFor="seed" className="text-sm">Seed color</label>
            <div className="flex items-center gap-3">
              <input
                id="seed"
                type="color"
                value={localSeed}
                onChange={(e) => setLocalSeed(e.target.value)}
                className="h-10 w-10 rounded overflow-hidden cursor-pointer border-0 p-0 bg-transparent"
                aria-label="Select seed color"
              />
              <input
                type="text"
                className="flex-1 md-textfield"
                value={localSeed}
                onChange={(e) => setLocalSeed(e.target.value)}
              />
              <button className="btn-filled" onClick={() => setSeed(localSeed)}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
