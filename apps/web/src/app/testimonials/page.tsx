'use client';

import { useState } from 'react';
import { TESTIMONIALS } from '@/data/testimonials';

const locales = [
  { key: 'en' as const, label: 'English' },
  { key: 'hi' as const, label: 'हिन्दी' }
];

export default function TestimonialsPage() {
  const [locale, setLocale] = useState<'en' | 'hi'>('en');
  const copy = TESTIMONIALS[locale];
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto w-full max-w-4xl space-y-10 px-6 py-12">
        <header className="space-y-4">
          <div className="flex justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Testimonials</span>
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
          <h1 className="text-4xl font-semibold tracking-tight">{copy.title}</h1>
          <p className="text-base text-[var(--foreground-muted)]">{copy.intro}</p>
        </header>

        <section className="space-y-4">
          {copy.stories.map((story) => (
            <article key={story.rider} className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 shadow">
              <p className="text-xl italic text-[var(--foreground)]">“{story.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-[var(--primary)]">{story.rider}</p>
              <p className="text-xs text-[var(--foreground-muted)]">{story.role}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-dashed border-white/15 p-6 text-center">
          <h2 className="text-2xl font-semibold text-[var(--primary)]">{copy.cta.heading}</h2>
          <p className="mt-3 text-sm text-[var(--foreground-muted)]">{copy.cta.subheading}</p>
          <div className="mt-4 flex justify-center gap-3">
            <a
              href="https://instagram.com/finspeed"
              className="rounded-full border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary)]"
            >
              Instagram
            </a>
            <a href="mailto:community@finspeed.example" className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
              Email community team
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
