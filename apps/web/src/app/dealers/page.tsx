'use client';

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useMemo, useState, startTransition } from 'react';
import { BrandMark } from '@/components/brand-mark';
import { LocaleSwitch } from '@/components/locale-switch';
import { DEALERS, Dealer, FILTERS } from '@/data/dealers';
import { DEALER_GEOJSON } from '@/data/dealer-geojson';
import { HOME_COPY, LocaleKey, SUPPORT_CHANNELS } from '@/data/content';
import { logAnalyticsEvent, setConsent } from '@/lib/analytics';
import { useConsent } from '@/lib/consent';
import { DealerMap } from '@/components/dealer-map';

const DEFAULT_RADIUS_KM = 20;
type DealerFeature = (typeof DEALER_GEOJSON)['features'][number];

export default function DealersPage() {
  const { state } = useConsent();
  const [locale, setLocale] = useState<LocaleKey>('en');
  const copy = HOME_COPY[locale];
  const [postal, setPostal] = useState('201306');
  const [submittedPostal, setSubmittedPostal] = useState('201306');
  const [filter, setFilter] = useState<string>('All');
  const [outage, setOutage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dealers, setDealers] = useState<Dealer[]>(DEALERS);
  const [activeDealer, setActiveDealer] = useState<Dealer | null>(DEALERS[0] ?? null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('finspeed-dealer-locale');
    if (stored === 'en' || stored === 'hi') {
      startTransition(() => {
        setLocale(stored);
        document.documentElement.lang = stored === 'hi' ? 'hi' : 'en';
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('finspeed-dealer-locale', locale);
    document.documentElement.lang = locale === 'hi' ? 'hi' : 'en';
  }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/dealers');
        if (!response.ok) throw new Error('Failed to load dealers');
        const json = (await response.json()) as { dealers: Dealer[] };
        if (!cancelled && Array.isArray(json.dealers) && json.dealers.length) {
          setDealers(json.dealers);
          setActiveDealer(json.dealers[0]);
        }
      } catch (error) {
        console.warn('[dealers] Using static dataset', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setConsent(state === 'granted');
  }, [state]);

  const pinCoordinates = useMemo(() => {
    const map = new Map<string, { latitude: number; longitude: number }>();
    DEALER_GEOJSON.features.forEach((feature: DealerFeature) => {
      if (feature.geometry?.type !== 'Point') return;
      const [lng, lat] = feature.geometry.coordinates;
      const postal = (feature.properties as Record<string, string>)?.postal;
      if (typeof lat === 'number' && typeof lng === 'number' && postal) {
        map.set(postal, { latitude: lat, longitude: lng });
      }
    });
    return map;
  }, []);

  const filteredDealers = useMemo(() => {
    if (outage) return [];
    const cleaned = submittedPostal.trim();
    return dealers.filter((dealer) => {
      const matchesPostal = dealer.postalCode.startsWith(cleaned.slice(0, 3));
      const matchesFilter = filter === 'All' || dealer.services.some((service) => service.toLowerCase().includes(filter.toLowerCase()));
      return matchesPostal && matchesFilter;
    });
  }, [dealers, filter, outage, submittedPostal]);

  useEffect(() => {
    if (!filteredDealers.length) {
      setActiveDealer(null);
      return;
    }
    if (!activeDealer || !filteredDealers.some((dealer) => dealer.name === activeDealer.name)) {
      setActiveDealer(filteredDealers[0]);
    }
  }, [filteredDealers, activeDealer]);

  const isValidPostal = (value: string) => /^\d{6}$/.test(value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidPostal(postal)) {
      setError(locale === 'hi' ? '6 अंकों का सही पिनकोड दर्ज करें।' : 'Enter a valid 6-digit postal code');
      return;
    }
    setError(null);
    setSubmittedPostal(postal);
    logAnalyticsEvent('dealer_search_submitted', {
      postal,
      radius_km: DEFAULT_RADIUS_KM,
      filter
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fs-bg-dark)] text-[var(--fs-text-primary)]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="brand-texture" />
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-5 py-8 sm:px-6 lg:px-10">
        <Header locale={locale} onLocaleChange={setLocale} copy={copy} />
        <main className="flex flex-1 flex-col gap-12 pb-12">
          <SearchPanel
            postal={postal}
            onPostalChange={(event: ChangeEvent<HTMLInputElement>) => setPostal(event.target.value)}
            filter={filter}
            onFilterChange={setFilter}
            onSubmit={handleSubmit}
            error={error}
            outage={outage}
            onToggleOutage={() => {
              setOutage((prev) => {
                const next = !prev;
                if (next) {
                  logAnalyticsEvent('dealer_locator_outage', { postal: submittedPostal });
                }
                return next;
              });
            }}
            locale={locale}
          />
          {outage && <OutageBanner />}
          <MapSection
            loading={loading}
            outage={outage}
            activeDealer={activeDealer}
            onPinSelect={(pin) => {
              setActiveDealer(dealers.find((dealer) => dealer.name === pin.name) ?? null);
              setSubmittedPostal(pin.postal);
              logAnalyticsEvent('dealer_map_pin_select', {
                dealer: pin.name,
                postal: pin.postal,
                latitude: pin.lat,
                longitude: pin.lng
              });
            }}
          />
          <ResultsGrid
            results={filteredDealers}
            submittedPostal={submittedPostal}
            activeDealer={activeDealer}
            onActivate={setActiveDealer}
            pinCoordinates={pinCoordinates}
            locale={locale}
            outage={outage}
          />
        </main>
      </div>
    </div>
  );
}

function Header({ locale, onLocaleChange, copy }: { locale: LocaleKey; onLocaleChange: (locale: LocaleKey) => void; copy: (typeof HOME_COPY)[LocaleKey] }) {
  return (
    <header className="glass-panel px-6 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BrandMark tone="light" className="rounded-full border border-white/15 bg-white/5 px-3 py-1" priority />
          <LocaleSwitch value={locale} onChange={onLocaleChange} ariaLabel={locale === 'hi' ? 'भाषा चुनें' : 'Select language'} />
        </div>
        <div className="space-y-3 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[var(--fs-primary)]">{copy.dealer.title}</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{copy.dealer.subtitle}</h1>
          <p className="text-base text-white/70">{copy.dealer.helper}</p>
        </div>
      </div>
    </header>
  );
}

function SearchPanel({
  postal,
  onPostalChange,
  filter,
  onFilterChange,
  onSubmit,
  error,
  outage,
  onToggleOutage,
  locale
}: {
  postal: string;
  onPostalChange: (event: ChangeEvent<HTMLInputElement>) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  error: string | null;
  outage: boolean;
  onToggleOutage: () => void;
  locale: LocaleKey;
}) {
  const errorId = 'dealer-search-error';
  return (
    <section className="rounded-[30px] border border-white/10 bg-white/5 p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.5)]" aria-labelledby="dealer-search">
      <h2 id="dealer-search" className="text-2xl font-semibold">
        {locale === 'hi' ? 'डीलर खोजें' : 'Find dealers'}
      </h2>
      <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-[1.2fr,0.6fr,0.5fr]" noValidate>
        <label className="flex flex-col text-sm font-semibold text-white">
          {locale === 'hi' ? 'पिनकोड' : 'Postal code'}
          <input
            value={postal}
            onChange={onPostalChange}
            inputMode="numeric"
            maxLength={6}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className="mt-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus-visible:border-[var(--fs-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fs-primary)]"
            placeholder={locale === 'hi' ? '6 अंकों का पिनकोड' : 'Enter 6-digit postal code'}
          />
        </label>
        <label className="flex flex-col text-sm font-semibold">
          Radius (km)
          <input
            value={DEFAULT_RADIUS_KM}
            readOnly
            className="mt-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white/60"
          />
        </label>
        <button
          type="submit"
          className="focus-ring-target self-end rounded-2xl bg-[var(--fs-primary)] px-6 py-3 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)] hover:text-white"
        >
          {locale === 'hi' ? 'डीलर खोजें' : 'Search dealers'}
        </button>
      </form>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[#F97316]" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-semibold text-white/70">{locale === 'hi' ? 'सेवा फ़िल्टर:' : 'Service filters:'}</span>
        {['All', ...FILTERS].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onFilterChange(chip)}
            aria-pressed={filter === chip}
            className={`focus-ring-target rounded-full border px-3 py-1 transition ${
              filter === chip ? 'border-[var(--fs-primary)] bg-[var(--fs-primary)]/10 text-[var(--fs-primary)]' : 'border-white/20 text-white/70 hover:border-white/40'
            }`}
          >
            {chip}
          </button>
        ))}
        <button type="button" onClick={onToggleOutage} className="focus-ring-target ml-auto text-xs text-white/60 underline">
          {outage ? (locale === 'hi' ? 'आउटेज बंद करें' : 'Disable outage') : locale === 'hi' ? 'आउटेज सिमुलेट करें' : 'Simulate outage'}
        </button>
      </div>
    </section>
  );
}

function MapSection({
  loading,
  outage,
  activeDealer,
  onPinSelect
}: {
  loading: boolean;
  outage: boolean;
  activeDealer: Dealer | null;
  onPinSelect: (pin: { name: string; postal: string; lat: number; lng: number }) => void;
}) {
  return (
    <section aria-labelledby="map-heading">
      <div className="flex items-center justify-between">
        <h2 id="map-heading" className="text-2xl font-semibold">
          Map view
        </h2>
        {loading ? <p className="text-xs text-white/70">Refreshing dealer data…</p> : null}
      </div>
      <div className="mt-4 rounded-[30px] border border-white/10 bg-black/20 p-4">
        {outage ? (
          <p className="text-center text-sm text-white/70">Map unavailable during outage.</p>
        ) : (
          <DealerMap
            featureCollection={DEALER_GEOJSON}
            activePostal={activeDealer?.postalCode ?? null}
            onSelect={onPinSelect}
          />
        )}
      </div>
    </section>
  );
}

function ResultsGrid({
  results,
  submittedPostal,
  activeDealer,
  onActivate,
  pinCoordinates,
  locale,
  outage
}: {
  results: Dealer[];
  submittedPostal: string;
  activeDealer: Dealer | null;
  onActivate: (dealer: Dealer | null) => void;
  pinCoordinates: Map<string, { latitude: number; longitude: number }>;
  locale: LocaleKey;
  outage: boolean;
}) {
  if (!results.length) {
    return <EmptyState outage={outage} locale={locale} />;
  }
  return (
    <section aria-labelledby="dealer-results">
      <div className="flex items-center justify-between">
        <h2 id="dealer-results" className="text-2xl font-semibold">
          {locale === 'hi' ? `परिणाम: ${submittedPostal}` : `Results near ${submittedPostal}`}
        </h2>
        <span className="text-sm text-white/70" aria-live="polite">
          {results.length} {locale === 'hi' ? 'डीलर' : 'dealer(s)'}
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {results.map((dealer) => (
          <DealerCard
            key={dealer.name}
            dealer={dealer}
            active={activeDealer?.name === dealer.name}
            onActivate={() => onActivate(dealer)}
            coords={pinCoordinates.get(dealer.postalCode)}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}

function DealerCard({
  dealer,
  active,
  onActivate,
  coords,
  locale
}: {
  dealer: Dealer;
  active: boolean;
  onActivate: () => void;
  coords?: { latitude: number; longitude: number };
  locale: LocaleKey;
}) {
  const handleKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  };

  return (
    <article
      id={dealer.name}
      data-testid="dealer-card"
      className={`focus-ring-target rounded-3xl border p-5 transition ${active ? 'border-[var(--fs-primary)] bg-[#061728]' : 'border-white/15 bg-[#050c16]'}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={handleKey}
      tabIndex={0}
      aria-current={active ? 'true' : undefined}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--fs-primary)]">{dealer.name}</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-white/60">{dealer.city}</span>
      </div>
      <p className="mt-2 text-sm text-white/80">{dealer.address}</p>
      <p className="text-sm text-white/60">
        {dealer.city}, {dealer.state} · {dealer.postalCode}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
        {dealer.services.map((service) => (
          <span key={service} className="rounded-full border border-white/15 px-3 py-1">
            {service}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
        <button
          type="button"
          className="focus-ring-target rounded-full border border-[var(--fs-primary)] px-4 py-2 text-[var(--fs-primary)] transition hover:bg-[rgba(64,176,208,0.08)]"
          onClick={() =>
            logAnalyticsEvent('dealer_directions_click', {
              dealer: dealer.name,
              postal: dealer.postalCode,
              latitude: coords?.latitude,
              longitude: coords?.longitude
            })
          }
        >
          {locale === 'hi' ? 'निर्देश' : 'Directions'}
        </button>
        <button
          type="button"
          onClick={() =>
            logAnalyticsEvent('dealer_contact_action', {
              dealer: dealer.name,
              channel: 'whatsapp',
              latitude: coords?.latitude,
              longitude: coords?.longitude
            })
          }
          className="focus-ring-target rounded-full bg-[var(--fs-primary)] px-4 py-2 text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)] hover:text-white"
        >
          WhatsApp
        </button>
      </div>
      <p className="mt-3 text-xs text-white/60">Email: {dealer.contact.email}</p>
    </article>
  );
}

function EmptyState({ outage, locale }: { outage: boolean; locale: LocaleKey }) {
  return (
    <div className="rounded-[30px] border border-dashed border-white/20 p-6 text-center text-white">
      <p className="text-base font-semibold">
        {outage
          ? locale === 'hi'
            ? 'आउटेज के दौरान सूची छिपी है'
            : 'Dealer list hidden during outage'
          : locale === 'hi'
            ? 'कोई डीलर नहीं मिला'
            : 'No partner studios yet'}
      </p>
      <p className="mt-2 text-sm text-white/70">
        {outage
          ? locale === 'hi'
            ? 'कुछ मिनट में पुनः प्रयास करें या WhatsApp/ईमेल का उपयोग करें।'
            : 'Please retry in a few minutes or use WhatsApp/email.'
          : locale === 'hi'
            ? 'कृपया दूसरा पिनकोड प्रयास करें या समर्थन से संपर्क करें।'
            : 'Try another postal code or reach support.'}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
        {SUPPORT_CHANNELS.map((channel) => (
          <a key={channel.label} href={channel.href} className="focus-ring-target rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:border-white/40">
            {channel.label}: {channel.detail}
          </a>
        ))}
      </div>
    </div>
  );
}

function OutageBanner() {
  return (
    <div className="rounded-[30px] border border-yellow-400/40 bg-yellow-400/10 p-4 text-sm text-yellow-200" role="status" aria-live="assertive">
      Locator temporarily unavailable — analytics will log fallback events and results are hidden.
    </div>
  );
}
