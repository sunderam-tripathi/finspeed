'use client';

import { useConsent } from '@/lib/consent';

export function ConsentBanner() {
  const { state, updateConsent } = useConsent();
  if (state !== 'unknown') return null;
  return (
    <div
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(4,10,14,0.96)] text-white shadow-[0_18px_55px_rgba(0,0,0,0.52)] backdrop-blur-md"
      role="region"
      aria-label="Analytics consent notice"
    >
      <div
        className="mx-auto flex w-full flex-col gap-4 px-5 py-4 text-sm md:flex-row md:items-center md:px-6"
        aria-live="polite"
      >
        <p id="consent-banner-description" className="flex-1 leading-6 text-slate-200">
          We use consent-aware analytics to improve dealer availability. Accept to send anonymized events or decline to skip tracking.
        </p>
        <div className="flex gap-3" role="group" aria-describedby="consent-banner-description">
          <button
            type="button"
            className="focus-ring-target min-h-11 rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/45 hover:bg-white/10"
            onClick={() => updateConsent('denied')}
          >
            Decline
          </button>
          <button
            type="button"
            className="focus-ring-target min-h-11 rounded-full bg-[var(--fs-primary)] px-5 py-2 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)]"
            onClick={() => updateConsent('granted')}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
