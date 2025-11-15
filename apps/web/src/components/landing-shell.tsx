'use client';

import { ChangeEvent, FormEvent, startTransition, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/brand-mark';
import { LocaleSwitch } from '@/components/locale-switch';
import { HOME_COPY, type HomeCopy, LocaleKey, NAV_LINKS, SUPPORT_CHANNELS } from '@/data/content';

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
    <div className="relative min-h-screen overflow-hidden bg-[var(--fs-bg-dark)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="brand-texture" />
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-6 lg:px-10">
        <Header
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

function Header({ locale, onLocaleChange }: { locale: LocaleKey; onLocaleChange: (locale: LocaleKey) => void }) {
  const pathname = usePathname();
  const whatsapp = SUPPORT_CHANNELS.find((channel) => channel.label.toLowerCase().includes('whatsapp'));

  return (
    <header className="glass-panel sticky top-4 z-30 px-5 py-4 text-white">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark tone="light" priority className="rounded-full border border-white/15 bg-white/5 px-3 py-1" />
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Turning Pedals into Power</span>
        </div>
        <nav aria-label="Primary navigation" className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-white/70">
          {NAV_LINKS.map((link) => {
            const isActive = pathname ? pathname === link.href || pathname.startsWith(`${link.href}/`) : false;
            return (
              <a
                key={link.href}
                href={link.href}
                data-active={isActive}
                aria-current={isActive ? 'page' : undefined}
                className="focus-ring-target rounded-full px-4 py-2 text-white/70 transition hover:text-white data-[active=true]:bg-[var(--fs-nav-active)] data-[active=true]:text-white"
              >
                {link.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center justify-end gap-3">
          <LocaleSwitch value={locale} onChange={onLocaleChange} />
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="focus-ring-target inline-flex items-center gap-2 rounded-full bg-[var(--fs-primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[var(--fs-primary-dark)/40] transition hover:bg-[var(--fs-primary-dark)]"
            >
              <span>WhatsApp</span>
              <span aria-hidden>↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function Hero({ copy }: { copy: HomeCopy['hero'] }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[var(--fs-bg-dark)] via-[#051122] to-[#02030a] p-8 text-white shadow-[0_45px_120px_rgba(4,9,20,0.75)]" aria-labelledby="hero-title">
      <div className="hero-overlay" />
      <div className="relative grid gap-10 lg:grid-cols-[3fr,2fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#7DDB6A]">{copy.kicker}</p>
          <div className="space-y-3">
            <h1 id="hero-title" data-testid="hero-heading" className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {copy.headline}
            </h1>
            <p className="text-2xl text-[#8CE9FF] sm:text-3xl">{copy.subheadline}</p>
          </div>
          <p className="max-w-2xl text-base text-white/80">{copy.body}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/catalog"
              className="focus-ring-target inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fs-primary)] px-6 py-3 text-sm font-semibold text-[#05161c] shadow-[0_18px_45px_rgba(64,176,208,0.35)] transition hover:bg-[var(--fs-primary-dark)] hover:text-white"
              data-testid="hero-primary-cta"
            >
              {copy.primaryCta}
            </a>
            <a
              href="/dealers"
              data-testid="dealer-cta"
              className="focus-ring-target inline-flex items-center justify-center gap-2 rounded-full border border-[var(--fs-primary)] px-6 py-3 text-sm font-semibold text-[var(--fs-primary)] transition hover:bg-[rgba(64,176,208,0.08)] hover:text-white"
            >
              {copy.secondaryCta}
            </a>
          </div>
        </div>
        <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.25em] text-white/70"
            >
              <span>{stat.label}</span>
              <span className="text-3xl font-semibold tracking-tight text-white">{stat.value}</span>
              <p className="text-xs normal-case tracking-normal text-white/70">{stat.detail}</p>
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
        <h2 id="highlights" className="text-3xl font-semibold text-white">
          {copy.subtitle}
        </h2>
      </header>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {copy.cards.map((card) => (
          <article key={card.title} className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#071425] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)] transition hover:-translate-y-1">
            <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" />
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
              <span className="rounded-full border border-white/20 px-3 py-1">{card.badge}</span>
              {copy.title}
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-white">{card.title}</h3>
            <p className="mt-3 text-sm text-white/70">{card.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Engineering({ copy }: { copy: HomeCopy['engineering'] }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]" aria-label={copy.title}>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/20">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7DDB6A]">{copy.title}</p>
          <h2 className="text-3xl font-semibold text-white">{copy.subtitle}</h2>
        </header>
        <ul className="mt-5 space-y-4 text-sm text-white/80">
          {copy.items.map((item) => (
            <li key={item.title} className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-base font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm text-white/70">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#071728] to-[#02070f] p-6 text-white">
        <p className="text-sm uppercase tracking-[0.35em] text-[#7DDB6A]">Lab highlights</p>
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
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.3em] text-white/70">
      <p>{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="text-xs normal-case tracking-normal text-white/70">{detail}</p>
    </div>
  );
}

function Pricing({ copy }: { copy: HomeCopy['pricing'] }) {
  return (
    <section aria-labelledby="pricing">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{copy.title}</p>
        <h2 id="pricing" className="text-3xl font-semibold text-white">
          {copy.subtitle}
        </h2>
      </header>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {copy.tiers.map((tier) => (
          <article key={tier.name} className="flex flex-col rounded-3xl border border-white/10 bg-[#050d18] p-6 text-white shadow-[0_30px_65px_rgba(2,3,10,0.55)]">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">{tier.name}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{tier.price}</p>
            <p className="mt-1 text-sm text-white/70">{tier.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
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
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-r from-[#0a2c3e] via-[#06202f] to-[#03121d] p-8 text-white">
      <div className="absolute inset-0 opacity-30 blur-3xl">
        <div className="brand-texture" />
      </div>
      <div className="relative grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7DDB6A]">{copy.title}</p>
          <h2 className="mt-3 text-3xl font-semibold">{copy.body}</h2>
          <p className="mt-3 text-sm text-white/80">{copy.footnote}</p>
          <a
            href="/blog/sustainability"
            className="focus-ring-target mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--fs-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[rgba(64,176,208,0.12)]"
          >
            {copy.cta}
            <span aria-hidden>↗</span>
          </a>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-white/70">Impact</p>
          <p className="mt-2 text-3xl font-semibold text-white">{copy.stat}</p>
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
    <section className="rounded-[30px] border border-white/10 bg-white/5 p-6 text-white shadow-[0_30px_75px_rgba(0,0,0,0.4)]">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{copy.title}</p>
        <h2 className="text-3xl font-semibold">{copy.subtitle}</h2>
      </header>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 md:flex-row" noValidate>
        <label className="flex flex-1 flex-col text-sm font-semibold text-white">
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
            className="mt-2 w-full rounded-2xl border border-white/20 bg-black/20 px-4 py-3 text-base text-white placeholder:text-white/50 focus-visible:border-[var(--fs-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fs-primary)]"
          />
        </label>
        <button
          type="submit"
          className="focus-ring-target inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-surface-muted)]"
        >
          {copy.button}
        </button>
      </form>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[#F97316]" aria-live="assertive">
          {error}
        </p>
      ) : null}
      <p className="mt-3 text-sm text-white/70">{copy.helper}</p>
    </section>
  );
}

function BlogTeaser({ copy }: { copy: HomeCopy['blog'] }) {
  return (
    <section aria-labelledby="blog-teaser">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{copy.title}</p>
        <h2 id="blog-teaser" className="text-3xl font-semibold text-white">
          {copy.subtitle}
        </h2>
      </header>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {copy.posts.map((post) => (
          <article key={post.title} className="flex flex-col rounded-3xl border border-white/10 bg-[#050b16] p-5 text-white shadow-[0_25px_65px_rgba(0,0,0,0.5)]">
            <span className="text-xs font-semibold uppercase tracking-[0.45em] text-white/60">{post.tag}</span>
            <h3 className="mt-3 text-xl font-semibold">{post.title}</h3>
            <p className="mt-2 text-sm text-white/70">{post.summary}</p>
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
    <section className="grid gap-6 rounded-[30px] border border-white/10 bg-gradient-to-r from-[#071425] to-[#03070f] p-6 text-white md:grid-cols-[2fr,1fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{copy.title}</p>
        <p className="mt-4 text-lg text-white/80">{copy.body}</p>
        <a
          href="/brand-story"
          className="focus-ring-target mt-4 inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white transition hover:border-white"
        >
          {copy.cta}
          <span aria-hidden>↗</span>
        </a>
      </div>
      <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
        <p className="text-sm uppercase tracking-[0.45em] text-white/60">Traceability</p>
        <ul className="mt-3 space-y-2 text-sm text-white/80">
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
    <footer data-testid="support-footer" className="mt-auto rounded-[30px] border border-white/10 bg-[#050c16] p-6 text-white">
      <p className="text-lg font-semibold">{supportTitle}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {SUPPORT_CHANNELS.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            className="focus-ring-target inline-flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
          >
            <span>{channel.label}</span>
            <span className="text-white/70">{channel.detail}</span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-white/60">© {new Date().getFullYear()} Finspeed. All rights reserved.</p>
    </footer>
  );
}

function WhatsappFab() {
  const whatsapp = SUPPORT_CHANNELS.find((channel) => channel.label.toLowerCase().includes('whatsapp'));
  if (!whatsapp) return null;
  return (
    <a
      href={whatsapp.href}
      className="focus-ring-target fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[var(--fs-primary)] text-white shadow-[0_25px_50px_rgba(37,211,102,0.45)]"
      aria-label="Chat on WhatsApp"
      rel="noopener noreferrer"
      target="_blank"
    >
      ✉️
    </a>
  );
}
