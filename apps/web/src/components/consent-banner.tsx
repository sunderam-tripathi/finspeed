'use client';

import { useConsent } from '@/lib/consent';

export function ConsentBanner() {
  const { state, updateConsent } = useConsent();
  if (state !== 'unknown') return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-slate-950/95 text-white shadow-2xl shadow-black/50" role="region" aria-label="Analytics consent notice">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-4 text-sm md:flex-row md:items-center" aria-live="polite">
        <p id="consent-banner-description" className="flex-1">
          We use consent-aware analytics to improve dealer availability. Accept to send anonymized events or decline to skip tracking.
        </p>
        <div className="flex gap-3" role="group" aria-describedby="consent-banner-description">
          <button
            className="rounded-full border border-white/30 px-4 py-2 font-semibold"
            onClick={() => updateConsent('denied')}
          >
            Decline
          </button>
          <button
            className="rounded-full bg-white px-4 py-2 font-semibold text-slate-900"
            onClick={() => updateConsent('granted')}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
