'use client';

import { useState } from 'react';
import { TESTIMONIALS } from '@/data/testimonials';
import { BrandMark } from '@/components/brand-mark';
import { SiteHeader } from '@/components/site-header';

export default function TestimonialsPage() {
  const [locale, setLocale] = useState<'en' | 'hi'>('en');
  const copy = TESTIMONIALS[locale];
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fs-bg-dark)] text-[var(--fs-text-primary)]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="brand-texture" />
      </div>
      <div className="relative mx-auto w-full max-w-4xl space-y-10 px-6 py-12">
        <SiteHeader locale={locale} onLocaleChange={setLocale} />
        <section
          className="space-y-4 rounded-[2rem] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]"
          aria-labelledby="testimonials-hero"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <BrandMark className="rounded-full border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] px-3 py-1" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-text-soft)]">
              {locale === 'hi' ? 'प्रशंसापत्र' : 'Testimonials'}
            </span>
          </div>
          <h1 id="testimonials-hero" className="text-4xl font-semibold tracking-tight">
            {copy.title}
          </h1>
          <p className="text-base text-[var(--fs-text-muted)]">{copy.intro}</p>
        </section>

        <section className="space-y-4">
          {copy.stories.map((story) => (
            <article key={story.rider} className="rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)]">
              <p className="text-xl italic text-[var(--fs-text-primary)]">“{story.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-[var(--fs-primary)]">{story.rider}</p>
              <p className="text-xs text-[var(--fs-text-muted)]">{story.role}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-dashed border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-center text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)]">
          <h2 className="text-2xl font-semibold text-[var(--fs-primary)]">{copy.cta.heading}</h2>
          <p className="mt-3 text-sm text-[var(--fs-text-muted)]">{copy.cta.subheading}</p>
          <div className="mt-4 flex justify-center gap-3">
            <a
              href="https://instagram.com/finspeed"
              className="focus-ring-target rounded-full border border-[var(--fs-primary)] px-5 py-2 text-sm font-semibold text-[var(--fs-primary)] transition hover:bg-[var(--fs-primary)] hover:text-[var(--fs-ink)]"
            >
              Instagram
            </a>
            <a
              href="mailto:community@finspeed.example"
              className="focus-ring-target rounded-full bg-[var(--fs-primary)] px-5 py-2 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)]"
            >
              Email community team
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
