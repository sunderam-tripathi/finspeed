'use client';

import { useState } from 'react';
import { BRAND_STORY } from '@/data/brand';
import { BrandMark } from '@/components/brand-mark';

const locales: Array<{ key: 'en' | 'hi'; label: string }> = [
  { key: 'en', label: 'English' },
  { key: 'hi', label: 'हिन्दी' }
];

export default function BrandStoryPage() {
  const [locale, setLocale] = useState<'en' | 'hi'>('en');
  const story = BRAND_STORY[locale];
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-12 space-y-12">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <BrandMark className="rounded-full border border-white/15 bg-[var(--surface)]/80 px-3 py-1" />
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
          <h1 className="text-4xl font-semibold tracking-tight">{story.hero.title}</h1>
          <p className="text-lg text-[var(--foreground-muted)]">{story.hero.subtitle}</p>
        </header>

        <section className="grid gap-4 rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 shadow">
          <h2 className="text-2xl font-semibold">Mission pillars</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {story.mission.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 p-4 text-sm">
                <h3 className="text-lg font-semibold text-[var(--primary)]">{item.title}</h3>
                <p className="mt-2 text-[var(--foreground-muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-white">
          <h2 className="text-2xl font-semibold">Timeline</h2>
          <ol className="mt-4 space-y-3">
            {story.timeline.map((entry) => (
              <li key={entry.year} className="flex gap-3 text-sm">
                <span className="font-semibold text-[var(--primary)]">{entry.year}</span>
                <p>{entry.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/80 p-6">
          <blockquote className="text-xl italic text-[var(--foreground)]">{story.quote.text}</blockquote>
          <p className="mt-3 text-sm text-[var(--foreground-muted)]">{story.quote.author}</p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[var(--primary)]/10 p-6 text-center">
          <h2 className="text-2xl font-semibold text-[var(--primary)]">{story.cta.title}</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {story.cta.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
