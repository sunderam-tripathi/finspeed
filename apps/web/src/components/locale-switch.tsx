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
    <div role="group" aria-label={ariaLabel} className="inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1 text-xs font-semibold text-white">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          aria-label={option === 'en' ? 'English' : 'हिन्दी'}
          title={option === 'en' ? 'English' : 'हिन्दी'}
          className={`focus-ring-target inline-flex flex-col rounded-full px-3 py-1 text-left transition ${
            value === option ? 'bg-white text-[var(--fs-ink)] shadow-[0_12px_28px_rgba(0,0,0,0.25)]' : 'text-white/80 hover:text-white'
          }`}
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em]">{LABELS[option].short}</span>
          <span className={`text-[0.6rem] font-normal leading-tight ${value === option ? 'text-[color:rgba(17,24,39,0.7)]' : 'text-white/70'}`}>
            {LABELS[option].detail}
          </span>
        </button>
      ))}
    </div>
  );
}
