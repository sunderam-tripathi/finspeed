'use client';

type LocaleCode = 'en' | 'hi';

const LABELS: Record<LocaleCode, { short: string; detail: string }> = {
  en: { short: 'EN', detail: 'English / अंग्रेज़ी' },
  hi: { short: 'हिं', detail: 'Hindi / हिंदी' }
};

type LocaleSwitchProps = {
  value: LocaleCode;
  onChange: (locale: LocaleCode) => void;
  ariaLabel?: string;
};

/**
 * Shared locale toggle aligned with the bilingual guidance in the UI/UX spec.
 */
export function LocaleSwitch({ value, onChange, ariaLabel = 'Select language' }: LocaleSwitchProps) {
  const options: LocaleCode[] = ['en', 'hi'];
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-full border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] p-1 text-xs font-semibold text-[var(--fs-text-primary)]"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          aria-label={option === 'en' ? 'English' : 'Hindi'}
          title={option === 'en' ? 'English' : 'Hindi / हिंदी'}
          className={`focus-ring-target inline-flex flex-col rounded-full px-3 py-1 text-left transition ${
            value === option
              ? 'bg-[var(--fs-primary)] text-[var(--fs-ink)]'
              : 'text-[var(--fs-text-primary)] hover:text-[var(--fs-primary)]'
          }`}
        >
          <span aria-hidden="true" className="text-[0.65rem] font-semibold uppercase tracking-[0.3em]">
            {LABELS[option].short}
          </span>
          <span
            aria-hidden="true"
            className={`text-[0.6rem] font-normal leading-tight ${
              value === option ? 'text-[var(--fs-ink)]' : 'text-[var(--fs-text-primary)]'
            }`}
          >
            {LABELS[option].detail}
          </span>
        </button>
      ))}
    </div>
  );
}
