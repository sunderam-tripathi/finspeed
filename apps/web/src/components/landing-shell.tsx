'use client';

import { ChangeEvent, FormEvent, startTransition, useEffect, useState } from 'react';
import { HOME_COPY, type HomeCopy, LocaleKey, SUPPORT_CHANNELS } from '@/data/content';
import { SiteHeader } from '@/components/site-header';

const HERO_STATS = [
  { label: 'Studios', value: '120+', detail: 'Certified partner hubs' },
  { label: 'Telemetry', value: '18M', detail: 'Data points / month' },
  { label: 'Response SLA', value: '6h', detail: 'Metro support window' }
];

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
          <Highlights copy={copy.highlights} />
          <Engineering copy={copy.engineering} />
          <Pricing copy={copy.pricing} />
          <Sustainability copy={copy.sustainability} />
          <DealerFinder copy={copy.dealer} locale={locale} />
          <BlogTeaser copy={copy.blog} />
          <BrandStoryTeaser copy={copy.brand} />
        </main>
        <SupportFooter supportTitle={copy.supportTitle} />
      </div>
      <WhatsappFab />
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

function Highlights({ copy }: { copy: HomeCopy['highlights'] }) {
  return (
    <section aria-labelledby="highlights">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{copy.title}</p>
        <h2 id="highlights" className="text-3xl font-semibold text-[var(--fs-text-primary)]">
          {copy.subtitle}
        </h2>
      </header>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {copy.cards.map((card) => (
          <article key={card.title} className="relative overflow-hidden rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] transition hover:-translate-y-1">
            <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" />
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-text-muted)]">
              <span className="rounded-full border border-[var(--fs-border)] px-3 py-1">{card.badge}</span>
              {copy.title}
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-[var(--fs-text-primary)]">{card.title}</h3>
            <p className="mt-3 text-sm text-[var(--fs-text-muted)]">{card.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Engineering({ copy }: { copy: HomeCopy['engineering'] }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]" aria-label={copy.title}>
      <div className="rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-eco)]">{copy.title}</p>
          <h2 className="text-3xl font-semibold text-[var(--fs-text-primary)]">{copy.subtitle}</h2>
        </header>
        <ul className="mt-5 space-y-4 text-sm text-[var(--fs-text-muted)]">
          {copy.items.map((item) => (
            <li key={item.title} className="rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] p-4">
              <p className="text-base font-semibold text-[var(--fs-text-primary)]">{item.title}</p>
              <p className="mt-2 text-sm text-[var(--fs-text-muted)]">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--fs-eco)]">Lab highlights</p>
        <div className="mt-6 space-y-5">
          <StatItem label="Frame fatigue cycles" value="150k+" detail="Validated per quarter" />
          <StatItem label="Dealer service playbooks" value="48" detail="Localized SOPs" />
          <StatItem label="RideLink installs" value="8,200" detail="urban electric fleet" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] px-4 py-3 text-sm uppercase tracking-[0.3em] text-[var(--fs-text-muted)]">
      <p>{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[var(--fs-text-primary)]">{value}</p>
      <p className="text-xs normal-case tracking-normal text-[var(--fs-text-muted)]">{detail}</p>
    </div>
  );
}

function Pricing({ copy }: { copy: HomeCopy['pricing'] }) {
  return (
    <section aria-labelledby="pricing">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{copy.title}</p>
        <h2 id="pricing" className="text-3xl font-semibold text-[var(--fs-text-primary)]">
          {copy.subtitle}
        </h2>
      </header>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {copy.tiers.map((tier) => (
          <article key={tier.name} className="flex flex-col rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)]">
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--fs-text-muted)]">{tier.name}</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--fs-text-primary)]">{tier.price}</p>
            <p className="mt-1 text-sm text-[var(--fs-text-muted)]">{tier.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--fs-text-muted)]">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--fs-eco)]" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Sustainability({ copy }: { copy: HomeCopy['sustainability'] }) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-8 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]">
      <div className="relative grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-eco)]">{copy.title}</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--fs-text-primary)]">{copy.body}</h2>
          <p className="mt-3 text-sm text-[var(--fs-text-muted)]">{copy.footnote}</p>
          <a
            href="/blog/sustainability"
            className="focus-ring-target mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--fs-primary)] px-5 py-2 text-sm font-semibold text-[var(--fs-text-primary)] transition hover:bg-[rgba(64,176,208,0.12)]"
          >
            {copy.cta}
            <span aria-hidden>↗</span>
          </a>
        </div>
        <div className="rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] p-5 text-center shadow-[var(--fs-card-shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--fs-text-soft)]">Impact</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--fs-text-primary)]">{copy.stat}</p>
        </div>
      </div>
    </section>
  );
}

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
  if (!whatsapp) return null;
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
