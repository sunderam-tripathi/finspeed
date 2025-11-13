'use client';

import { useState } from 'react';
import { SUPPORT_COPY } from '@/data/support';

const locales = [
  { key: 'en' as const, label: 'English' },
  { key: 'hi' as const, label: 'हिन्दी' }
];

export default function SupportPage() {
  const [locale, setLocale] = useState<'en' | 'hi'>('en');
  const copy = SUPPORT_COPY[locale];
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto w-full max-w-4xl space-y-10 px-6 py-12">
        <header className="space-y-4">
          <div className="flex justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Support</span>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[var(--surface)]/80 p-1 text-xs font-semibold">
              {locales.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLocale(key)}
                  className={`rounded-full px-3 py-1 ${
                    locale === key ? 'bg-[var(--primary)] text-white shadow' : 'text-[var(--foreground-muted)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">{copy.hero.title}</h1>
          <p className="text-base text-[var(--foreground-muted)]">{copy.hero.subtitle}</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {copy.contacts.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              className="rounded-3xl border border-white/15 bg-[var(--surface)]/70 p-4 text-center"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">{channel.label}</p>
              <p className="mt-2 text-lg font-semibold">{channel.detail}</p>
            </a>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-[var(--primary)]/10 p-6">
          <h2 className="text-2xl font-semibold text-[var(--primary)]">FAQs</h2>
          <div className="mt-4 space-y-4">
            {copy.faq.map((item) => (
              <details key={item.question} className="rounded-2xl border border-white/15 p-4">
                <summary className="cursor-pointer text-sm font-semibold">{item.question}</summary>
                <p className="mt-2 text-sm text-[var(--foreground-muted)]">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
