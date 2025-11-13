'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEALERS, Dealer, FILTERS } from '@/data/dealers';
import { SUPPORT_CHANNELS } from '@/data/content';
import { logAnalyticsEvent, setConsent } from '@/lib/analytics';
import { useConsent } from '@/lib/consent';
import { DealerMap } from '@/components/dealer-map';
import { DEALER_GEOJSON } from '@/data/dealer-geojson';

type DealerFeature = (typeof DEALER_GEOJSON)['features'][number];

const DEFAULT_RADIUS_KM = 20;

export default function DealersPage() {
  const { state } = useConsent();
  const [dealerData, setDealerData] = useState<Dealer[]>(DEALERS);
  const [loading, setLoading] = useState(false);
  const [postal, setPostal] = useState('201306');
  const [submittedPostal, setSubmittedPostal] = useState('201306');
  const [filter, setFilter] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);
  const [outage, setOutage] = useState(false);
  const [activeDealerName, setActiveDealerName] = useState<string | null>(DEALERS[0]?.name ?? null);
  const [lastOutageEvent, setLastOutageEvent] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    async function loadDealers() {
      setLoading(true);
      try {
        const response = await fetch('/api/dealers');
        if (!response.ok) throw new Error('Failed to load dealers');
        const json = (await response.json()) as { dealers: Dealer[] };
        if (!cancelled && Array.isArray(json.dealers) && json.dealers.length) {
          setDealerData(json.dealers);
        }
      } catch (err) {
        console.warn('[dealers] falling back to static dataset', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadDealers();
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    const cleaned = submittedPostal.trim();
    return dealerData.filter((dealer) => {
      const matchesPostal = dealer.postalCode.startsWith(cleaned.slice(0, 3));
      const matchesFilter = filter === 'All' || dealer.services.some((s) => s.toLowerCase().includes(filter.toLowerCase()));
      return matchesPostal && matchesFilter;
    });
  }, [submittedPostal, filter, dealerData]);

  const activeDealer = useMemo(() => {
    if (!results.length) return null;
    if (activeDealerName) {
      const match = results.find((dealer) => dealer.name === activeDealerName);
      if (match) return match;
    }
    return results[0];
  }, [results, activeDealerName]);

  const isValidPostal = (value: string) => /^\d{6}$/.test(value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidPostal(postal)) {
      setError('Enter a valid 6-digit postal code');
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

  const visibleResults = outage ? [] : results;

  useEffect(() => {
    setConsent(state === 'granted');
  }, [state]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="mx-auto w-full max-w-5xl px-6 py-10" role="main">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Dealer locator</p>
          <h1 className="text-4xl font-semibold tracking-tight">Ride-ready support across India</h1>
          <p className="text-[var(--foreground-muted)]">
            Search by postal code to find partner studios within {DEFAULT_RADIUS_KM} km. Data derived from the SCN-004 handoff bundle.
          </p>
        </header>
        <section
          className="mt-8 rounded-2xl border border-white/10 bg-[var(--surface)]/70 p-6 shadow-sm"
          aria-labelledby="dealer-search"
        >
          <h2 id="dealer-search" className="sr-only">
            Dealer search form
          </h2>
          <form className="flex flex-col gap-4 md:flex-row md:items-end" onSubmit={handleSubmit} noValidate>
            <label className="flex flex-1 flex-col text-sm font-semibold">
              Postal code
              <input
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
                pattern="\d{6}"
                maxLength={6}
                className="mt-1 rounded-xl border border-white/20 bg-transparent px-3 py-2 text-base font-normal text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
                aria-invalid={Boolean(error)}
              />
            </label>
            <label className="flex flex-col text-sm font-semibold">
              Radius (km)
              <input
                type="number"
                value={DEFAULT_RADIUS_KM}
                readOnly
                className="mt-1 w-32 rounded-xl border border-white/20 bg-transparent px-3 py-2 text-base font-normal text-[var(--foreground-muted)]"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg"
            >
              Search dealers
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-[var(--foreground-muted)]">Filter services:</span>
            {['All', ...FILTERS].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setFilter(chip)}
                className={`rounded-full border px-3 py-1 ${
                  filter === chip
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'border-white/20 text-[var(--foreground-muted)] hover:border-[var(--primary)]/40'
                }`}
              >
                {chip}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setOutage((prev) => {
                  const next = !prev;
                  if (next) {
                    const now = Date.now();
                    if (now - lastOutageEvent > 3000) {
                      logAnalyticsEvent('dealer_locator_outage', {
                        postal: submittedPostal
                      });
                      setLastOutageEvent(now);
                    }
                  }
                  return next;
                });
              }}
              className="ml-auto text-xs text-[var(--foreground-muted)] underline"
            >
              {outage ? 'Disable outage simulation' : 'Simulate outage'}
            </button>
          </div>
        </section>

        {outage && <OutageBanner />}

        <section className="mt-8 space-y-4" aria-labelledby="map-view">
          <h2 id="map-view" className="text-2xl font-semibold">
            Map view
          </h2>
          {loading && <p className="text-sm text-[var(--foreground-muted)]">Refreshing dealer data...</p>}
          {outage ? (
            <div className="rounded-2xl border border-dashed border-white/20 p-6 text-sm text-[var(--foreground-muted)]">
              Map unavailable during outage.
            </div>
          ) : (
            <DealerMap
              featureCollection={DEALER_GEOJSON}
              activePostal={activeDealer?.postalCode ?? null}
              onSelect={(pin) => {
                setActiveDealerName(pin.name);
                setSubmittedPostal(pin.postal);
                logAnalyticsEvent('dealer_map_pin_select', {
                  dealer: pin.name,
                  postal: pin.postal,
                  latitude: pin.lat,
                  longitude: pin.lng
                });
                document.getElementById(pin.name)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            />
          )}
        </section>

        <section className="mt-8 space-y-4" aria-labelledby="results-heading">
          <div className="flex items-center justify-between">
            <h2 id="results-heading" className="text-2xl font-semibold">
              Results near {submittedPostal}
            </h2>
            <span className="text-sm text-[var(--foreground-muted)]">{visibleResults.length} dealer(s)</span>
          </div>
          {visibleResults.length === 0 ? (
            <EmptyState outage={outage} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {visibleResults.map((dealer) => (
                <DealerCard
                  key={dealer.name}
                  dealer={dealer}
                  active={activeDealer?.name === dealer.name}
                  onFocus={() => setActiveDealerName(dealer.name)}
                  coords={pinCoordinates.get(dealer.postalCode)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function DealerCard({
  dealer,
  active,
  onFocus,
  coords
}: {
  dealer: Dealer;
  active: boolean;
  onFocus: () => void;
  coords?: { latitude: number; longitude: number };
}) {
  return (
    <article
      id={dealer.name}
      data-testid="dealer-card"
      className={`rounded-2xl border p-5 shadow transition ${
        active
          ? 'border-[var(--primary)] bg-[var(--surface)]'
          : 'border-white/10 bg-[var(--surface)]/80'
      }`}
      onMouseEnter={onFocus}
      onFocus={onFocus}
    >
      <h3 className="text-lg font-semibold text-[var(--primary)]">{dealer.name}</h3>
      <p className="mt-2 text-sm text-[var(--foreground)]">{dealer.address}</p>
      <p className="text-sm text-[var(--foreground-muted)]">{dealer.city}, {dealer.state} • {dealer.postalCode}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--foreground-muted)]">
        {dealer.services.map((service) => (
          <span key={service} className="rounded-full border border-white/15 px-3 py-1">
            {service}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() =>
            logAnalyticsEvent('dealer_directions_click', {
              dealer: dealer.name,
              postal: dealer.postalCode,
              latitude: coords?.latitude,
              longitude: coords?.longitude
            })
          }
          className="rounded-full border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary)]"
        >
          Get directions
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
          className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          WhatsApp
        </button>
      </div>
      <p className="mt-3 text-xs text-[var(--foreground-muted)]">Email: {dealer.contact.email}</p>
    </article>
  );
}

function EmptyState({ outage }: { outage: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center">
      <p className="text-base font-semibold">
        {outage ? 'Locator temporarily unavailable' : 'No partner studios match that search yet'}
      </p>
      <p className="mt-2 text-sm text-[var(--foreground-muted)]">
        {outage
          ? 'Please retry in a few minutes or reach our support team using the channels below.'
          : 'Try another postal code or adjust service filters. Our team can also help connect you to the right partner.'}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
        {SUPPORT_CHANNELS.map((channel) => (
          <a key={channel.label} href={channel.href} className="rounded-full border border-white/20 px-4 py-2">
            {channel.label}: {channel.detail}
          </a>
        ))}
      </div>
    </div>
  );
}

function OutageBanner() {
  return (
    <div className="mt-6 rounded-2xl border border-yellow-400/40 bg-yellow-400/10 p-4 text-sm text-yellow-200">
      Locator outage simulated — analytics will log fallback events and the dealer list is hidden. Toggle off to restore normal behaviour.
    </div>
  );
}
