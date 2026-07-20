import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { DealerMap } from '../../../components/dealer-map';
import { logAnalyticsEvent } from '../../../lib/analytics';
import { useLucideIcons } from '../../lib/useLucideIcons.js';
import {
  About,
  campaignMedia,
  Journal,
  PageHero,
  RiderStories,
  SectionIntro,
  Support,
} from './EditorialPages.jsx';

const SUPPORT = {
  phone: '+91 96506 08982',
  whatsapp: 'https://wa.me/919650608982',
  email: 'support@finspeed.online',
};

// Public results are deliberately limited to the two locations in the current
// Finspeed store handoff. API data may refresh services, but it cannot add an
// unverified address to the customer-facing list.
const VERIFIED_DEALERS = [
  {
    id: 'sarin-farm',
    name: 'Finspeed — Sarin Farm',
    address: 'Shop No. 20, Left Side, Sarin Farm Colony, UPSIDC Site A, Surajpur',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    postalCode: '201306',
    services: ['Sales', 'Test rides', 'Service'],
    coordinates: { lat: 28.528, lng: 77.477 },
  },
  {
    id: 'krystal-height',
    name: 'Finspeed — Krystal Height',
    address: 'Lower Ground Shop No. 8, Krystal Height Market, behind ACE CITY, Sector 1, Noida Extension, Bisrakh Jalalpur',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    postalCode: '201306',
    services: ['Sales', 'Service'],
    coordinates: { lat: 28.601, lng: 77.437 },
  },
].map((dealer) => ({ ...dealer, contact: { whatsapp: SUPPORT.whatsapp, email: SUPPORT.email } }));

function navigate(route, category) {
  const base = route === 'home' ? '/' : `/${route}`;
  const href = category && category !== 'all' ? `${base}?category=${encodeURIComponent(category)}` : base;
  window.location.assign(href);
}

function BrandStory() {
  const { theme } = useTheme();
  return <About onNav={navigate} theme={theme} />;
}

function BlogPage() {
  const { theme } = useTheme();
  return <Journal onNav={navigate} theme={theme} />;
}

function TestimonialsPage() {
  const { theme } = useTheme();
  return <RiderStories onNav={navigate} theme={theme} />;
}

function SupportHub() {
  const { theme } = useTheme();
  return <Support onNav={navigate} theme={theme} />;
}

function reconcileDealers(apiDealers) {
  if (!Array.isArray(apiDealers)) return VERIFIED_DEALERS;
  return VERIFIED_DEALERS.map((verified) => {
    const apiMatch = apiDealers.find((candidate) => (
      candidate?.postalCode === verified.postalCode
      && String(candidate?.name || '').toLowerCase().includes(verified.id === 'sarin-farm' ? 'sarin' : 'krystal')
    ));
    return apiMatch ? { ...verified, services: apiMatch.services || verified.services } : verified;
  });
}

function dealerFeatureCollection(dealers) {
  return {
    type: 'FeatureCollection',
    features: dealers.map((dealer) => ({
      type: 'Feature',
      id: dealer.id,
      properties: { name: dealer.name, postal: dealer.id },
      geometry: { type: 'Point', coordinates: [dealer.coordinates.lng, dealer.coordinates.lat] },
    })),
  };
}

function dealerMatches(dealer, query) {
  if (!query) return true;
  const searchText = [dealer.name, dealer.address, dealer.city, dealer.state, dealer.postalCode]
    .join(' ')
    .toLowerCase();
  return searchText.includes(query.toLowerCase());
}

function Dealers() {
  const { theme } = useTheme();
  const [dealers, setDealers] = React.useState(VERIFIED_DEALERS);
  const [query, setQuery] = React.useState('');
  const [submittedQuery, setSubmittedQuery] = React.useState('');
  const [filter, setFilter] = React.useState('All');
  const [activeDealer, setActiveDealer] = React.useState(null);
  useLucideIcons([filter, activeDealer]);

  React.useEffect(() => {
    let current = true;
    fetch('/api/dealers')
      .then((response) => {
        if (!response.ok) throw new Error('Store refresh unavailable');
        return response.json();
      })
      .then((payload) => { if (current) setDealers(reconcileDealers(payload.dealers)); })
      .catch(() => { if (current) setDealers(VERIFIED_DEALERS); });
    return () => { current = false; };
  }, []);

  const results = React.useMemo(() => dealers.filter((dealer) => (
    dealerMatches(dealer, submittedQuery)
    && (filter === 'All' || dealer.services.includes(filter))
  )), [dealers, filter, submittedQuery]);

  function search(event) {
    event.preventDefault();
    const nextQuery = query.trim();
    setSubmittedQuery(nextQuery);
    setActiveDealer(null);
    logAnalyticsEvent('dealer_search_submitted', {
      query: nextQuery || 'all-published-locations',
      postal: /^\d+$/.test(nextQuery) ? nextQuery : undefined,
      filter,
      result_count: dealers.filter((dealer) => dealerMatches(dealer, nextQuery)).length,
    });
  }

  function toggleFilter(next) {
    setFilter((current) => current === next ? 'All' : next);
    setActiveDealer(null);
  }

  function selectPin(pin) {
    const dealer = results.find((candidate) => candidate.id === pin.postal);
    if (!dealer) return;
    setActiveDealer(dealer.id);
    logAnalyticsEvent('dealer_map_pin_select', {
      dealer: dealer.id,
      postal: dealer.postalCode,
      latitude: dealer.coordinates.lat,
      longitude: dealer.coordinates.lng,
    });
    document.querySelector(`[data-dealer-id="${dealer.id}"]`)?.focus();
  }

  return (
    <article className="editorial-page editorial-dealers-page">
      <PageHero
        index="04 / Visit Finspeed"
        kicker="Visit Finspeed"
        title="Meet the bikes in Greater Noida."
        intro="Choose between our two current Greater Noida locations, then contact us so the bicycle you want to see is ready for your visit."
        image={campaignMedia.city}
        imageAlt="A quiet city route at first light"
        theme={theme}
      />

      <section className="editorial-page-section editorial-dealer-layout">
        <div className="editorial-dealer-search">
          <SectionIntro
            kicker="Plan your visit"
            title="Choose the right stop."
            body="Search by location name, area or PIN code. Results match the words you enter; they do not calculate travel distance."
          />
          <form onSubmit={search} role="search">
            <label htmlFor="dealer-query">
              Location, area or PIN code
              <input
                id="dealer-query"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="For example, 201306 or Sarin Farm"
                autoComplete="postal-code"
              />
            </label>
            <button type="submit" className="editorial-cta editorial-cta--primary">
              Search locations <i data-lucide="search" aria-hidden="true" />
            </button>
          </form>
          <fieldset>
            <legend>Available services</legend>
            <div className="editorial-dealer-filters">
              {['Sales', 'Service', 'Test rides'].map((service) => (
                <button key={service} type="button" aria-pressed={filter === service} onClick={() => toggleFilter(service)}>{service}</button>
              ))}
            </div>
          </fieldset>
          <p className="editorial-dealer-note">Opening hours and bicycle availability are not shown. Contact the location before visiting.</p>
        </div>

        <div className="editorial-dealer-results">
          <div className="editorial-dealer-results__heading">
            <div>
              <p className="editorial-kicker">{String(results.length).padStart(2, '0')} {results.length === 1 ? 'location' : 'locations'}</p>
              <h2>{submittedQuery ? `Matches for “${submittedQuery}”` : 'Greater Noida'}</h2>
            </div>
            {filter !== 'All' ? <span>Service: {filter}</span> : null}
          </div>

          {results.length ? (
            <>
              <DealerMap featureCollection={dealerFeatureCollection(results)} activePostal={activeDealer} onSelect={selectPin} />
              <div className="editorial-dealer-list" role="list">
                {results.map((dealer, index) => {
                  const fullAddress = `${dealer.address}, ${dealer.city}, ${dealer.state} ${dealer.postalCode}`;
                  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
                  return (
                    <div
                      key={dealer.id}
                      role="listitem"
                      tabIndex="-1"
                      data-testid="dealer-card"
                      data-dealer-id={dealer.id}
                      className={activeDealer === dealer.id ? 'is-active' : ''}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <h3>{dealer.name}</h3>
                        <address>{fullAddress}</address>
                        <div className="editorial-dealer-services" aria-label={`Services at ${dealer.name}`}>{dealer.services.map((service) => <span key={service}>{service}</span>)}</div>
                      </div>
                      <div className="editorial-dealer-actions">
                        <a href={SUPPORT.whatsapp} target="_blank" rel="noreferrer" onClick={() => logAnalyticsEvent('dealer_contact_action', { dealer: dealer.id, postal: dealer.postalCode, channel: 'whatsapp' })}>WhatsApp</a>
                        <a href={directions} target="_blank" rel="noreferrer" onClick={() => logAnalyticsEvent('dealer_directions_click', { dealer: dealer.id, postal: dealer.postalCode })}>Directions</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <section className="editorial-dealer-empty" role="status">
              <i data-lucide="map-pin" aria-hidden="true" />
              <h2>No location matches that search.</h2>
              <p>Try Greater Noida, 201306 or clear the service filter. You can also ask Finspeed for help planning a visit.</p>
              <a href={SUPPORT.whatsapp} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
            </section>
          )}
        </div>
      </section>
    </article>
  );
}

export { BlogPage, BrandStory, Dealers, SupportHub, TestimonialsPage };
