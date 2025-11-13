'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import wordmarkLight from '@/assets/brand/finspeed-wordmark-light.svg';
import wordmarkDark from '@/assets/brand/finspeed-wordmark-dark.svg';
import { HOME_COPY, LocaleKey, NAV_LINKS, PRODUCT_FAMILIES, SUPPORT_CHANNELS } from '@/data/content';

type Theme = 'light' | 'dark';

export function LandingShell() {
  const [locale, setLocale] = useState<LocaleKey>('en');
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const copy = HOME_COPY[locale];

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <div className="pointer-events-none fixed inset-0 opacity-70 blur-3xl">
        <div className="aurora-gradient" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <Header
          locale={locale}
          theme={theme}
          onLocaleChange={(next) => setLocale(next)}
          onThemeToggle={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        />
        <main className="flex flex-1 flex-col gap-12 py-16">
          <Hero locale={locale} />
          <ProductFamilies />
          <DealerCTA ctaLabel={copy.hero.cta} />
        </main>
        <SupportFooter locale={locale} />
      </div>
      <div className="sr-only" aria-live="polite">
        Language changed to {copy.languageLabel}
      </div>
    </div>
  );
}

function Header({
  locale,
  theme,
  onLocaleChange,
  onThemeToggle
}: {
  locale: LocaleKey;
  theme: Theme;
  onLocaleChange: (locale: LocaleKey) => void;
  onThemeToggle: () => void;
}) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--surface)]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">
            <Image
              src={theme === 'dark' ? wordmarkDark : wordmarkLight}
              alt="Finspeed"
              className="h-6 w-auto"
              priority
            />
          </span>
          <span className="text-sm text-[var(--foreground-muted)]">Turning pedals into power</span>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitch value={locale} onChange={onLocaleChange} />
          <ThemeSwitch theme={theme} onToggle={onThemeToggle} />
          <a
            href="/dealers"
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[var(--primary)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          >
            Find a Dealer
          </a>
        </div>
      </div>
      <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-4 text-sm font-medium">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="text-[var(--foreground-muted)] transition hover:text-[var(--primary)]">
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero({ locale }: { locale: LocaleKey }) {
  const copy = HOME_COPY[locale].hero;
  const stats = [
    { label: 'Studios', value: '120+', detail: 'Certified partners' },
    { label: 'Service SLA', value: '6 hr', detail: 'Metro response' },
    { label: 'Warranty', value: '2 yrs', detail: 'Frame coverage' }
  ];
  return (
    <section
      className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[var(--hero-surface)] p-10 text-white shadow-[0_30px_120px_-50px_rgba(79,70,229,0.9)]"
      aria-labelledby="hero-title"
    >
      <div className="hero-glow" />
      <div className="relative grid gap-12 md:grid-cols-[3fr_2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-indigo-200">Finspeed</p>
          <h1
            id="hero-title"
            data-testid="hero-heading"
            className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl"
          >
            {copy.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-indigo-100">{copy.subheadline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/dealers"
              data-testid="dealer-cta"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition group-hover:scale-125" />
              {copy.cta}
            </a>
            <a
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5"
            >
              Explore Catalog
            </a>
          </div>
        </div>
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-indigo-100">Insights</p>
          <div className="grid gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">{stat.label}</p>
                  <p className="text-sm text-indigo-100">{stat.detail}</p>
                </div>
                <span className="text-3xl font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductFamilies() {
  return (
    <section aria-labelledby="families" className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Product Families</p>
        <h2 id="families" className="mt-2 text-3xl font-semibold tracking-tight">Crafted for every ride</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {PRODUCT_FAMILIES.map((family, index) => (
          <article
            key={family.title}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/80 p-6 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-[var(--primary)]/50"
          >
            <div className="card-gradient" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground-muted)]">
                <span className="rounded-full border border-white/10 px-3 py-1">0{index + 1}</span>
                Performance
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{family.title}</h3>
              <p className="mt-3 text-sm text-[var(--foreground-muted)]">{family.blurb}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DealerCTA({ ctaLabel }: { ctaLabel: string }) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-[var(--primary)] to-fuchsia-600 p-8 text-center text-white shadow-xl shadow-fuchsia-500/30">
      <div className="cta-rays" />
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Dealer access</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">Ride-ready within one click</h2>
      <p className="mt-3 text-base text-white/80">Certified partner studios across India offer demo rides, fittings, and service.</p>
      <a
        href="/dealers"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
        {ctaLabel}
      </a>
    </section>
  );
}

function SupportFooter({ locale }: { locale: LocaleKey }) {
  const copy = HOME_COPY[locale];
  return (
    <footer
      data-testid="support-footer"
      className="mt-auto rounded-[2.5rem] border border-white/10 bg-[var(--surface)]/80 p-6 shadow-inner shadow-black/10"
    >
      <p className="text-base font-semibold text-[var(--primary)]">{copy.supportTitle}</p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {SUPPORT_CHANNELS.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[var(--foreground)] transition hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/5"
          >
            <span className="font-semibold">{channel.label}</span>
            <span className="text-[var(--foreground-muted)]">{channel.detail}</span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--foreground-muted)]">© {new Date().getFullYear()} Finspeed. All rights reserved.</p>
    </footer>
  );
}

function LocaleSwitch({ value, onChange }: { value: LocaleKey; onChange: (locale: LocaleKey) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-[var(--surface)]/80 p-1 text-xs font-semibold text-[var(--foreground)]">
      {(['en', 'hi'] as LocaleKey[]).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={`rounded-full px-3 py-1 transition ${
            value === option ? 'bg-[var(--primary)] text-white shadow' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
          }`}
        >
          {option === 'en' ? 'English' : 'हिन्दी'}
        </button>
      ))}
    </div>
  );
}

function ThemeSwitch({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-white/20 p-2 text-[var(--foreground)] transition hover:border-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      aria-label="Toggle color theme"
      aria-pressed={theme === 'dark'}
    >
      {theme === 'light' ? '🌞' : '🌙'}
    </button>
  );
}
