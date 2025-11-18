'use client';

import { useConsent } from '@/lib/consent';

export function ConsentBanner() {
  const { state, updateConsent } = useConsent();
  if (state !== 'unknown') return null;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--fs-card-border)] bg-[var(--fs-surface)] text-[var(--fs-text-primary)]"
      role="region"
      aria-label="Analytics consent notice"
    >
      <div
        className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-4 text-sm md:flex-row md:items-center"
        aria-live="polite"
      >
        <p id="consent-banner-description" className="flex-1">
          We use consent-aware analytics to improve dealer availability. Accept to send anonymized events or decline to skip tracking.
        </p>
        <div className="flex gap-3" role="group" aria-describedby="consent-banner-description">
          <button
            className="focus-ring-target rounded-full border border-[var(--fs-border)] px-4 py-2 text-sm font-semibold text-[var(--fs-text-primary)] hover:bg-[rgba(15,23,42,0.04)]"
            onClick={() => updateConsent('denied')}
          >
            Decline
          </button>
          <button
            className="focus-ring-target rounded-full bg-[var(--fs-primary)] px-4 py-2 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)]"
            onClick={() => updateConsent('granted')}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
