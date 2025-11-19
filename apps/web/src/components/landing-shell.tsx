'use client';

import { ChangeEvent, FormEvent, startTransition, useEffect, useState } from 'react';
import { HOME_COPY, type HomeCopy, LocaleKey } from '@/data/content';
import { SiteHeader } from '@/components/site-header';

const HERO_STATS: Array<{ label: string; value: string; detail: string }> = [];

export function LandingShell() {
  const [locale, setLocale] = useState<LocaleKey>('en');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const copy = HOME_COPY[locale];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('finspeed-locale');
    if (stored === 'en' || stored === 'hi') {
      startTransition(() => {
        setLocale(stored);
        document.documentElement.lang = stored === 'hi' ? 'hi' : 'en';
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.lang = locale === 'hi' ? 'hi' : 'en';
    window.localStorage.setItem('finspeed-locale', locale);
  }, [locale]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fs-bg-dark)] text-[var(--fs-text-primary)]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
      <div className="brand-texture" />
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-6 lg:px-10">
        <SiteHeader
          locale={locale}
          onLocaleChange={(next) => {
            if (next === locale) return;
            setIsTransitioning(true);
            setLocale(next);
            setTimeout(() => setIsTransitioning(false), 220);
          }}
        />
        <main className={`mt-10 flex flex-1 flex-col gap-16 pb-16 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <Hero copy={copy.hero} />
        </main>
      </div>
      <div className="sr-only" aria-live="polite">
        Language changed to {copy.languageLabel}
      </div>
    </div>
  );
}

function Hero({ copy }: { copy: HomeCopy['hero'] }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-8 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]" aria-labelledby="hero-title">
      <div className="relative grid gap-10 lg:grid-cols-[3fr,2fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[var(--fs-eco)]">{copy.kicker}</p>
          <div className="space-y-3">
            <h1 id="hero-title" data-testid="hero-heading" className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {copy.headline}
            </h1>
            <p className="text-2xl text-[var(--fs-primary)] sm:text-3xl">{copy.subheadline}</p>
          </div>
          <p className="max-w-2xl text-base text-[var(--fs-text-muted)]">{copy.body}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/catalog"
              className="focus-ring-target inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fs-primary)] px-6 py-3 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)] hover:text-white"
              data-testid="hero-primary-cta"
            >
              {copy.primaryCta}
            </a>
            <a
              href="/dealers"
              data-testid="dealer-cta"
              className="focus-ring-target inline-flex items-center justify-center gap-2 rounded-full border border-[var(--fs-primary)] px-6 py-3 text-sm font-semibold text-[var(--fs-primary)] transition hover:bg-[rgba(64,176,208,0.08)] hover:text-[var(--fs-text-primary)]"
            >
              {copy.secondaryCta}
            </a>
          </div>
        </div>
            <div className="space-y-5 rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] p-6 backdrop-blur">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-2 rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] px-4 py-3 text-sm uppercase tracking-[0.25em] text-[var(--fs-text-muted)]"
                >
                  <span>{stat.label}</span>
                  <span className="text-3xl font-semibold tracking-tight text-[var(--fs-text-primary)]">{stat.value}</span>
                  <p className="text-xs normal-case tracking-normal text-[var(--fs-text-muted)]">{stat.detail}</p>
                </div>
              ))}
            </div>
      </div>
    </section>
  );
}

// DealerFinder, BlogTeaser, BrandStoryTeaser, SupportFooter, and WhatsappFab
// are retained for future SCN-backed content but are currently unused.
function DealerFinder({ copy, locale }: { copy: HomeCopy['dealer']; locale: LocaleKey }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const errorId = 'dealer-search-error';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(value.trim())) {
      setError(locale === 'hi' ? 'कृपया सही 6 अंकों का पिनकोड दर्ज करें।' : 'Enter a valid 6-digit postal code');
      return;
    }
    setError('');
    window.location.href = `/dealers?pincode=${value.trim()}`;
  };

  return (
    <section className="rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{copy.title}</p>
        <h2 className="text-3xl font-semibold text-[var(--fs-text-primary)]">{copy.subtitle}</h2>
      </header>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 md:flex-row" noValidate>
        <label className="flex flex-1 flex-col text-sm font-semibold text-[var(--fs-text-primary)]">
          <span>{locale === 'hi' ? 'पिनकोड' : 'Postal code'}</span>
          <input
            type="text"
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
            placeholder={locale === 'hi' ? copy.placeholder : 'Enter 6-digit postal code'}
            inputMode="numeric"
            maxLength={6}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className="mt-2 w-full rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-surface)] px-4 py-3 text-base text-[var(--fs-text-primary)] placeholder:text-[var(--fs-text-soft)] focus-visible:border-[var(--fs-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fs-primary)]"
          />
        </label>
        <button
          type="submit"
          className="focus-ring-target inline-flex items-center justify-center rounded-2xl bg-[var(--fs-primary)] px-6 py-3 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)]"
        >
          {copy.button}
        </button>
      </form>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[var(--fs-warning)]" aria-live="assertive">
          {error}
        </p>
      ) : null}
      <p className="mt-3 text-sm text-[var(--fs-text-muted)]">{copy.helper}</p>
    </section>
  );
}

function BlogTeaser({ copy }: { copy: HomeCopy['blog'] }) {
  return (
    <section aria-labelledby="blog-teaser">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{copy.title}</p>
        <h2 id="blog-teaser" className="text-3xl font-semibold text-[var(--fs-text-primary)]">
          {copy.subtitle}
        </h2>
      </header>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {copy.posts.map((post) => (
          <article key={post.title} className="flex flex-col rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-5 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)]">
            <span className="text-xs font-semibold uppercase tracking-[0.45em] text-[var(--fs-text-soft)]">{post.tag}</span>
            <h3 className="mt-3 text-xl font-semibold text-[var(--fs-text-primary)]">{post.title}</h3>
            <p className="mt-2 text-sm text-[var(--fs-text-muted)]">{post.summary}</p>
            <a
              href={post.href}
              className="focus-ring-target mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--fs-primary)] transition hover:text-[var(--fs-primary-dark)]"
            >
              Read article
              <span aria-hidden>↗</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function BrandStoryTeaser({ copy }: { copy: HomeCopy['brand'] }) {
  return (
    <section className="grid gap-6 rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)] md:grid-cols-[2fr,1fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{copy.title}</p>
        <p className="mt-4 text-lg text-[var(--fs-text-muted)]">{copy.body}</p>
        <a
          href="/brand-story"
          className="focus-ring-target mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--fs-border)] px-5 py-2 text-sm font-semibold text-[var(--fs-text-primary)] transition hover:border-[var(--fs-primary)]"
        >
          {copy.cta}
          <span aria-hidden>↗</span>
        </a>
      </div>
      <div className="rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] p-5 shadow-[var(--fs-card-shadow-soft)]">
        <p className="text-sm uppercase tracking-[0.45em] text-[var(--fs-text-soft)]">Traceability</p>
        <ul className="mt-3 space-y-2 text-sm text-[var(--fs-text-muted)]">
          <li>RFC-001 · Site architecture</li>
          <li>REQ-005 · Brand story</li>
          <li>TAG · design-0.1-REQ-005</li>
        </ul>
      </div>
    </section>
  );
}

function SupportFooter({ supportTitle }: { supportTitle: string }) {
  return (
    <footer
      data-testid="support-footer"
      className="mt-auto rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)]"
    >
      <p className="text-lg font-semibold text-[var(--fs-text-primary)]">{supportTitle}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {SUPPORT_CHANNELS.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            className="focus-ring-target inline-flex items-center justify-between rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--fs-text-primary)] transition hover:border-[var(--fs-primary)]"
          >
            <span>{channel.label}</span>
            <span className="text-[var(--fs-text-muted)]">{channel.detail}</span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--fs-text-soft)]">© {new Date().getFullYear()} Finspeed. All rights reserved.</p>
    </footer>
  );
}

function WhatsappFab() {
  const whatsapp = SUPPORT_CHANNELS.find((channel) => channel.label.toLowerCase().includes('whatsapp'));
  if (!whatsapp || !whatsapp.href) return null;
  return (
    <a
      href={whatsapp.href}
      className="focus-ring-target fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--fs-primary)] text-[var(--fs-ink)]"
      aria-label="Chat on WhatsApp"
      rel="noopener noreferrer"
      target="_blank"
    >
      ✉️
    </a>
  );
}
