'use client';

import { useState } from 'react';
import { BRAND_STORY } from '@/data/brand';
import { BrandMark } from '@/components/brand-mark';
import { SiteHeader } from '@/components/site-header';

export default function BrandStoryPage() {
  const [locale, setLocale] = useState<'en' | 'hi'>('en');
  const story = BRAND_STORY[locale];
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fs-bg-dark)] text-[var(--fs-text-primary)]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="brand-texture" />
      </div>
      <div className="relative mx-auto w-full max-w-5xl px-6 py-12 space-y-12">
        <SiteHeader locale={locale} onLocaleChange={setLocale} />
        <section
          className="space-y-4 rounded-[2rem] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]"
          aria-labelledby="brand-hero"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <BrandMark className="rounded-full border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] px-3 py-1" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-text-soft)]">
              {locale === 'hi' ? 'हमारी कहानी' : 'Our story'}
            </span>
          </div>
          <h1 id="brand-hero" className="text-4xl font-semibold tracking-tight">
            {story.hero.title}
          </h1>
          <p className="text-lg text-[var(--fs-text-muted)]">{story.hero.subtitle}</p>
        </section>

        <section className="grid gap-4 rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 shadow-[var(--fs-card-shadow-soft)]">
          <h2 className="text-2xl font-semibold text-[var(--fs-text-primary)]">Mission pillars</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {story.mission.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] p-4 text-sm shadow-[var(--fs-card-shadow-soft)]">
                <h3 className="text-lg font-semibold text-[var(--fs-primary)]">{item.title}</h3>
                <p className="mt-2 text-[var(--fs-text-muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)]">
          <h2 className="text-2xl font-semibold text-[var(--fs-text-primary)]">Timeline</h2>
          <ol className="mt-4 space-y-3">
            {story.timeline.map((entry) => (
              <li key={entry.year} className="flex gap-3 text-sm text-[var(--fs-text-muted)]">
                <span className="font-semibold text-[var(--fs-primary)]">{entry.year}</span>
                <p>{entry.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)]">
          <blockquote className="text-xl italic text-[var(--fs-text-primary)]">{story.quote.text}</blockquote>
          <p className="mt-3 text-sm text-[var(--fs-text-muted)]">{story.quote.author}</p>
        </section>

        <section className="rounded-3xl border border-[var(--fs-card-border)] bg-[color:rgba(64,176,208,0.1)] p-6 text-center shadow-[var(--fs-card-shadow-soft)]">
          <h2 className="text-2xl font-semibold text-[var(--fs-primary)]">{story.cta.title}</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {story.cta.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-[var(--fs-primary)] px-5 py-2 text-sm font-semibold text-[var(--fs-primary)] transition hover:bg-[var(--fs-primary)] hover:text-[var(--fs-ink)]"
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
