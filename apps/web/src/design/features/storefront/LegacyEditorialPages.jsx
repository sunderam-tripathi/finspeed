import React from 'react';
import { DealerMap } from '../../../components/dealer-map';
import { TESTIMONIALS } from '../../../data/testimonials';
import { logAnalyticsEvent } from '../../../lib/analytics';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

const SUPPORT = {
  phone: '+91 96506 08982',
  whatsapp: 'https://wa.me/919650608982',
  email: 'support@finspeed.online',
  hours: '09:00–21:00 IST daily',
};

// The public locator intentionally exposes only the two addresses in the
// governed SCN-004 dealer handoff. API responses are reconciled against these
// records before they can reach the interface.
const VERIFIED_DEALERS = [
  {
    id: 'sarin-farm',
    name: 'Finspeed Dealer — Sarin Farm',
    address: 'Shop No. 20, Left Side, Sarin Farm Colony, UPSIDC Site A, Surajpur',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    postalCode: '201306',
    services: ['Sales', 'Test rides', 'Service'],
    coordinates: { lat: 28.528, lng: 77.477 },
  },
  {
    id: 'krystal-height',
    name: 'Finspeed Dealer — Krystal Height',
    address: 'Lower Ground Shop No. 8, Krystal Height Market, behind ACE CITY, Sector 1, Noida Extension, Bisrakh Jalalpur',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    postalCode: '201306',
    services: ['Sales', 'Service'],
    coordinates: { lat: 28.601, lng: 77.437 },
  },
].map((dealer) => ({ ...dealer, contact: { whatsapp: SUPPORT.whatsapp, email: SUPPORT.email } }));

const TESTIMONIAL_SOURCE = TESTIMONIALS.en.stories.map((story, index) => ({
  ...story,
  id: ['mtb-ananya', 'road-rahul', 'partner-kavita'][index] || `story-${index + 1}`,
  category: ['MTB', 'Road', 'Partner'][index] || 'Rider',
}));

const TESTIMONIAL_HI = [
  'ब्लू शार्क ने मेरी वीकेंड चढ़ाइयों को बदल दिया—स्थिर ज्यामिति और फैक्टरी सर्विस के कारण कीचड़ भरी ढलानों के बाद भी साइकिल शांत चलती है।',
  'लाइटनिंग मार्लिन की एयरो ट्यूबिंग और ईएमआई विकल्प से मैं अपनी रेस तैयारी रोके बिना अपग्रेड कर सका।',
  'Finspeed डीलर ऑनबोर्डिंग एक सप्ताह में पूरी हुई और नियमित कैटलॉग अपडेट से हमारी टीम सही कीमत और वारंटी बता पाती है।',
];

const COPY = {
  brand: {
    en: {
      eyebrow: 'Our story',
      title: 'Turning Pedals into Power',
      intro: 'Finspeed builds a deliberately focused range of bicycles for the roads, commutes and trails riders actually use.',
      sectionTitle: 'Fewer models. More attention.',
      sectionBody: 'Every bicycle starts with a clear use case. Frame, braking, suspension and gearing choices are then considered as one system—not a pile of options.',
      steps: [
        ['01', 'Listen', 'Begin with terrain, rider fit and the kind of control the bicycle must deliver.'],
        ['02', 'Prototype', 'Test the complete ride before a component choice becomes part of the range.'],
        ['03', 'Tune', 'Keep only the specifications that improve comfort, durability or confidence.'],
        ['04', 'Support', 'Back the bicycle with verified Greater Noida locations and direct owner support.'],
      ],
      catalog: 'Explore catalog',
      dealers: 'Find a dealer',
    },
    hi: {
      eyebrow: 'हमारी कहानी',
      title: 'पैडल को शक्ति में बदलें',
      intro: 'Finspeed उन सड़कों, रोज़मर्रा की यात्राओं और ट्रेल्स के लिए चुनिंदा साइकिल बनाता है जिन पर भारतीय राइडर वास्तव में चलते हैं।',
      sectionTitle: 'कम मॉडल। हर मॉडल पर अधिक ध्यान।',
      sectionBody: 'हर साइकिल एक स्पष्ट उपयोग से शुरू होती है। फ्रेम, ब्रेक, सस्पेंशन और गियर को एक ही प्रणाली की तरह चुना जाता है।',
      steps: [
        ['01', 'सुनना', 'रास्ते, राइडर फिट और आवश्यक नियंत्रण से शुरुआत होती है।'],
        ['02', 'प्रोटोटाइप', 'किसी पुर्जे को रेंज में रखने से पहले पूरी सवारी का परीक्षण किया जाता है।'],
        ['03', 'ट्यून करना', 'केवल वही स्पेसिफिकेशन रखे जाते हैं जो आराम, टिकाऊपन या भरोसा बढ़ाएँ।'],
        ['04', 'सहयोग', 'ग्रेटर नोएडा के सत्यापित स्थान और सीधे ओनर सपोर्ट के साथ साइकिल का साथ निभाते हैं।'],
      ],
      catalog: 'कैटलॉग देखें',
      dealers: 'डीलर खोजें',
    },
  },
  testimonials: {
    en: {
      eyebrow: 'Rider stories',
      intro: 'Consented notes from riders and partners, preserved from the approved testimonial dataset.',
      all: 'All stories',
      autoplayOn: 'Start autoplay',
      autoplayOff: 'Pause autoplay',
      previous: 'Previous story',
      next: 'Next story',
    },
    hi: {
      eyebrow: 'राइडर की कहानियाँ',
      intro: 'स्वीकृत टेस्टिमोनियल डेटा से राइडर और पार्टनर के सहमति-आधारित अनुभव।',
      all: 'सभी कहानियाँ',
      autoplayOn: 'ऑटोप्ले शुरू करें',
      autoplayOff: 'ऑटोप्ले रोकें',
      previous: 'पिछली कहानी',
      next: 'अगली कहानी',
    },
  },
  blog: {
    en: {
      eyebrow: 'Journal / Field note 01',
      intro: 'Simple safety rituals, smart gear choices and pre-ride checks for more predictable city journeys.',
      all: 'All',
      safety: 'Safety',
      readTime: '6 min read',
      articleLabel: 'Featured field note',
      sectionTitle: 'Confidence begins before the first pedal stroke.',
      sectionBody: 'Traffic changes quickly; your preparation should not. Use these four checks alongside local traffic rules and professional mechanical advice.',
      checks: [
        ['Air, brakes, chain', 'Check tyre pressure, lever feel and a clean-running chain before leaving.'],
        ['Be visible', 'Use front and rear lights in low light and wear a correctly fitted helmet.'],
        ['Read the route', 'Scan parked cars, junctions and surface changes before they become last-second decisions.'],
        ['Brake before the turn', 'Set speed while the bicycle is upright, then look through the corner and hold a steady line.'],
      ],
      share: 'Share article',
      shared: 'Article link copied.',
      subscribe: 'Get the next field note by email',
    },
    hi: {
      eyebrow: 'जर्नल / फील्ड नोट 01',
      intro: 'शहर की सवारी को अधिक सुरक्षित और अनुमानित बनाने के लिए सरल जाँच और सही गियर।',
      all: 'सभी',
      safety: 'सुरक्षा',
      readTime: '6 मिनट',
      articleLabel: 'चुना हुआ फील्ड नोट',
      sectionTitle: 'आत्मविश्वास पहली पैडल स्ट्रोक से पहले शुरू होता है।',
      sectionBody: 'ट्रैफिक जल्दी बदलता है, आपकी तैयारी नहीं। इन चार जाँचों के साथ स्थानीय यातायात नियम और पेशेवर मैकेनिकल सलाह भी मानें।',
      checks: [
        ['हवा, ब्रेक, चेन', 'निकलने से पहले टायर प्रेशर, ब्रेक लीवर और साफ चलती चेन जाँचें।'],
        ['दिखाई दें', 'कम रोशनी में आगे और पीछे लाइट लगाएँ और सही फिट वाला हेलमेट पहनें।'],
        ['रास्ता पहले पढ़ें', 'खड़ी गाड़ियों, जंक्शन और सड़क की सतह को समय रहते देखें।'],
        ['मोड़ से पहले ब्रेक', 'साइकिल सीधी रहते गति कम करें, फिर मोड़ की दिशा में देखकर स्थिर लाइन रखें।'],
      ],
      share: 'लेख साझा करें',
      shared: 'लेख का लिंक कॉपी हो गया।',
      subscribe: 'अगला फील्ड नोट ईमेल से पाएँ',
    },
  },
  support: {
    en: {
      eyebrow: 'Owners / Support',
      title: 'Support hub',
      intro: 'Direct help for product, fit, order, warranty and service questions—through the channel that suits you.',
      status: 'All published support channels are online.',
      formTitle: 'Give us the full picture.',
      formBody: 'When a support endpoint is configured, the request is sent directly. Otherwise we prepare the same details in your email app.',
      send: 'Send request',
      sending: 'Sending…',
      required: 'Enter your name and a short description so the team can route your request.',
      validEmail: 'Enter a valid email address so the team can reply.',
      prepared: 'Your email app is opening with the request prepared.',
      received: 'Request received. Finspeed will reply by email.',
    },
    hi: {
      eyebrow: 'ओनर / सपोर्ट',
      title: 'सपोर्ट हब',
      intro: 'प्रोडक्ट, फिट, ऑर्डर, वारंटी और सर्विस से जुड़े प्रश्नों के लिए सीधे सही चैनल पर सहायता पाएँ।',
      status: 'सभी प्रकाशित सपोर्ट चैनल उपलब्ध हैं।',
      formTitle: 'हमें पूरी जानकारी दें।',
      formBody: 'सपोर्ट एंडपॉइंट उपलब्ध होने पर अनुरोध सीधे भेजा जाता है। अन्यथा वही जानकारी आपके ईमेल ऐप में तैयार होती है।',
      send: 'अनुरोध भेजें',
      sending: 'भेजा जा रहा है…',
      required: 'अपना नाम और समस्या का संक्षिप्त विवरण दर्ज करें।',
      validEmail: 'उत्तर पाने के लिए सही ईमेल पता दर्ज करें।',
      prepared: 'आपका ईमेल ऐप तैयार अनुरोध के साथ खुल रहा है।',
      received: 'अनुरोध मिल गया। Finspeed ईमेल से उत्तर देगा।',
    },
  },
};

function useStoredLocale(key) {
  const [locale, setLocale] = React.useState('en');

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === 'hi' || stored === 'en') setLocale(stored);
    } catch {
      // The in-session choice still works when local storage is restricted.
    }
  }, [key]);

  const update = React.useCallback((next) => {
    setLocale(next);
    try {
      window.localStorage.setItem(key, next);
    } catch {
      // Storage is an enhancement, not a prerequisite for bilingual content.
    }
  }, [key]);

  return [locale, update];
}

function LocaleControl({ locale, onChange }) {
  return (
    <div className="legacy-locale" role="group" aria-label="Language">
      <button type="button" aria-pressed={locale === 'en'} onClick={() => onChange('en')}>English</button>
      <button type="button" aria-pressed={locale === 'hi'} onClick={() => onChange('hi')}>Hindi / हिन्दी</button>
    </div>
  );
}

function LegacyHero({ index, eyebrow, title, intro, image, imageAlt, locale, onLocale, children }) {
  return (
    <section className="legacy-hero">
      <div className="legacy-hero__copy">
        <div className="legacy-hero__tools">
          <span>{index}</span>
          <LocaleControl locale={locale} onChange={onLocale} />
        </div>
        <p className="editorial-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <span className="editorial-rule" aria-hidden="true" />
        <p className="legacy-hero__intro">{intro}</p>
        {children}
      </div>
      {image ? <div className="legacy-hero__media"><img src={image} alt={imageAlt} /></div> : null}
    </section>
  );
}

function PageLead({ eyebrow, title, body }) {
  return (
    <header className="legacy-lead">
      <p className="editorial-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </header>
  );
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
      properties: { name: dealer.name, postal: dealer.postalCode },
      geometry: { type: 'Point', coordinates: [dealer.coordinates.lng, dealer.coordinates.lat] },
    })),
  };
}

function Dealers() {
  const [locale, setLocale] = useStoredLocale('finspeed-dealer-locale');
  const [dealers, setDealers] = React.useState(VERIFIED_DEALERS);
  const [postal, setPostal] = React.useState('201306');
  const [submittedPostal, setSubmittedPostal] = React.useState('201306');
  const [radius, setRadius] = React.useState(20);
  const [filter, setFilter] = React.useState('All');
  const [error, setError] = React.useState('');
  const [outage, setOutage] = React.useState(false);
  const [activeDealer, setActiveDealer] = React.useState(null);
  useLucideIcons([locale, filter, outage, activeDealer]);

  React.useEffect(() => {
    let current = true;
    fetch('/api/dealers')
      .then((response) => {
        if (!response.ok) throw new Error('Dealer refresh unavailable');
        return response.json();
      })
      .then((payload) => { if (current) setDealers(reconcileDealers(payload.dealers)); })
      .catch(() => { if (current) setDealers(VERIFIED_DEALERS); });
    return () => { current = false; };
  }, []);

  const results = React.useMemo(() => dealers.filter((dealer) => (
    dealer.postalCode === submittedPostal
    && (filter === 'All' || dealer.services.includes(filter))
  )), [dealers, filter, submittedPostal]);

  function search(event) {
    event.preventDefault();
    if (!/^\d{6}$/.test(postal)) {
      setError('Enter a valid 6-digit postal code');
      return;
    }
    setError('');
    setSubmittedPostal(postal);
    setActiveDealer(null);
    logAnalyticsEvent('dealer_search_submitted', { postal, radius_km: radius, filter, filters: filter === 'All' ? [] : [filter], locale });
    if (!dealers.some((dealer) => dealer.postalCode === postal)) {
      logAnalyticsEvent('dealer_no_results', { postal, radius_km: radius, filter, filters: filter === 'All' ? [] : [filter], locale });
    }
  }

  function toggleFilter(next) {
    setFilter((current) => current === next ? 'All' : next);
  }

  function toggleOutage() {
    setOutage((current) => {
      const next = !current;
      if (next) logAnalyticsEvent('dealer_locator_outage', { postal: submittedPostal, locale });
      return next;
    });
  }

  function selectPin(pin) {
    const dealer = results.find((candidate) => candidate.name === pin.name) || results[0];
    if (!dealer) return;
    setActiveDealer(dealer.id);
    logAnalyticsEvent('dealer_map_pin_select', {
      dealer: dealer.id,
      postal: dealer.postalCode,
      latitude: dealer.coordinates.lat,
      longitude: dealer.coordinates.lng,
      locale,
    });
    document.querySelector(`[data-dealer-id="${dealer.id}"]`)?.focus();
  }

  function contact(dealer, channel) {
    logAnalyticsEvent('dealer_contact_action', { dealer: dealer.id, postal: dealer.postalCode, channel, locale });
    if (channel === 'whatsapp') window.open(SUPPORT.whatsapp, '_blank', 'noopener,noreferrer');
  }

  const copy = locale === 'hi' ? {
    eyebrow: 'ग्रेटर नोएडा / सत्यापित स्थान',
    title: 'अपनी Finspeed से मिलें।',
    intro: 'पिन कोड से खोजें, उपलब्ध सेवाएँ देखें और टेस्ट राइड या सर्विस के लिए सीधे संपर्क करें।',
    searchTitle: 'आपके पास',
    helper: 'फिलहाल केवल सत्यापित Finspeed स्थान दिखाए जाते हैं।',
  } : {
    eyebrow: 'Greater Noida / Verified locations',
    title: 'Meet your Finspeed.',
    intro: 'Search by postal code, compare available services and contact a verified location for a test ride or service.',
    searchTitle: 'Near you',
    helper: 'Only locations in the governed Finspeed dealer handoff are shown.',
  };

  return (
    <article className="legacy-editorial legacy-dealers">
      <LegacyHero index="04 / Visit Finspeed" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} locale={locale} onLocale={setLocale} image="/assets/campaign/light-terrain-city.webp" imageAlt="A quiet city route at first light" />
      <section className="legacy-dealer-workspace">
        <div className="legacy-dealer-search">
          <PageLead eyebrow={copy.searchTitle} title="Find a verified location." body={copy.helper} />
          <form onSubmit={search} noValidate>
            <div className="legacy-dealer-search__entry">
              <label htmlFor="dealer-postal">Postal code<input id="dealer-postal" value={postal} onChange={(event) => setPostal(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="postal-code" aria-describedby="dealer-postal-help dealer-postal-error" aria-invalid={Boolean(error)} /></label>
              <button type="submit" className="editorial-cta editorial-cta--primary">Search dealers <i data-lucide="search" aria-hidden="true" /></button>
            </div>
            <p id="dealer-postal-help">Try the verified Greater Noida postal code 201306.</p>
            {error ? <p id="dealer-postal-error" className="legacy-error" role="alert">{error}</p> : null}

            <label htmlFor="dealer-radius">Search radius</label>
            <select id="dealer-radius" value={radius} onChange={(event) => setRadius(Number(event.target.value))}>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
            </select>

            <fieldset>
              <legend>Services</legend>
              <div className="legacy-chip-row">
                {['Sales', 'Service', 'Test rides'].map((service) => (
                  <button key={service} type="button" aria-pressed={filter === service} onClick={() => toggleFilter(service)}>{service}</button>
                ))}
              </div>
            </fieldset>
          </form>
          <button type="button" className="legacy-outage-toggle" aria-pressed={outage} onClick={toggleOutage}>{outage ? 'Restore locator' : 'Simulate outage'}</button>
        </div>

        <div className="legacy-dealer-results">
          {outage ? (
            <section className="legacy-outage" role="status">
              <i data-lucide="alert-triangle" aria-hidden="true" />
              <p className="editorial-kicker">Locator temporarily unavailable</p>
              <h2>We can still help you find the right place.</h2>
              <p>Map unavailable during outage. Contact Finspeed directly and we will route your visit.</p>
              <a href={SUPPORT.whatsapp} target="_blank" rel="noreferrer">WhatsApp: {SUPPORT.phone}</a>
              <a href={`mailto:${SUPPORT.email}`}>Email: {SUPPORT.email}</a>
            </section>
          ) : (
            <>
              <div className="legacy-results-heading">
                <div><p className="editorial-kicker">{results.length.toString().padStart(2, '0')} verified locations</p><h2>Results near {submittedPostal}</h2></div>
                <span>Within {radius} km</span>
              </div>
              {results.length ? (
                <>
                  <DealerMap featureCollection={dealerFeatureCollection(results)} activePostal={results.find((dealer) => dealer.id === activeDealer)?.postalCode || null} onSelect={selectPin} />
                  <div className="legacy-dealer-list" role="list">
                    {results.map((dealer, index) => {
                      const fullAddress = `${dealer.address}, ${dealer.city}, ${dealer.state} ${dealer.postalCode}`;
                      const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
                      return (
                        <div key={dealer.id} role="listitem" tabIndex="-1" data-testid="dealer-card" data-dealer-id={dealer.id} className={activeDealer === dealer.id ? 'is-active' : ''}>
                          <span className="legacy-dealer-card__number">{String(index + 1).padStart(2, '0')}</span>
                          <div><h3>{dealer.name}</h3><address>{fullAddress}</address><div className="legacy-chip-row legacy-chip-row--static">{dealer.services.map((service) => <span key={service}>{service}</span>)}</div></div>
                          <div className="legacy-dealer-card__actions">
                            <button type="button" onClick={() => contact(dealer, 'whatsapp')}>WhatsApp</button>
                            <a href={directions} target="_blank" rel="noreferrer" onClick={() => logAnalyticsEvent('dealer_directions_click', { dealer: dealer.id, postal: dealer.postalCode, locale })}>Directions</a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <section className="legacy-empty" role="status"><i data-lucide="map-pin" aria-hidden="true" /><h2>No verified location at that postal code yet.</h2><p>Contact Finspeed and we will help plan the closest supported visit.</p><a href={SUPPORT.whatsapp}>WhatsApp {SUPPORT.phone}</a></section>
              )}
            </>
          )}
        </div>
      </section>
    </article>
  );
}

function BrandStory() {
  const [locale, setLocale] = useStoredLocale('finspeed-brand-locale');
  const copy = COPY.brand[locale];
  useLucideIcons([locale]);
  return (
    <article className="legacy-editorial legacy-brand-story" lang={locale === 'hi' ? 'hi' : 'en'}>
      <LegacyHero index="01 / The Finspeed story" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} locale={locale} onLocale={setLocale} image="/assets/campaign/light-summit-hero.webp" imageAlt="A rider and Finspeed bicycle overlooking a mountain valley">
        <div className="legacy-action-row"><a className="editorial-cta editorial-cta--primary" href="/shop" onClick={() => logAnalyticsEvent('brand_cta_click', { target: 'catalog', locale })}>{copy.catalog}</a><a className="legacy-text-link" href="/dealers" onClick={() => logAnalyticsEvent('brand_cta_click', { target: 'dealers', locale })}>{copy.dealers} <i data-lucide="arrow-right" aria-hidden="true" /></a></div>
      </LegacyHero>
      <section className="legacy-content-grid">
        <PageLead eyebrow="Finspeed method" title={copy.sectionTitle} body={copy.sectionBody} />
        <ol className="legacy-process-list">{copy.steps.map(([number, title, body]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
      </section>
      <section className="legacy-editorial-cta"><p className="editorial-kicker">Greater Noida</p><h2>{locale === 'hi' ? 'साइकिल को पास से देखें।' : 'See the bicycles up close.'}</h2><a className="editorial-cta editorial-cta--secondary" href="/dealers" onClick={() => logAnalyticsEvent('brand_cta_click', { target: 'dealers', locale })}>{copy.dealers} <i data-lucide="arrow-right" aria-hidden="true" /></a></section>
    </article>
  );
}

function TestimonialsPage() {
  const [locale, setLocale] = useStoredLocale('finspeed-testimonials-locale');
  const [category, setCategory] = React.useState('All');
  const [index, setIndex] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(false);
  const copy = COPY.testimonials[locale];
  const stories = category === 'All' ? TESTIMONIAL_SOURCE : TESTIMONIAL_SOURCE.filter((story) => story.category === category);
  const safeIndex = Math.min(index, Math.max(stories.length - 1, 0));
  const story = stories[safeIndex];
  useLucideIcons([locale, category, safeIndex, autoplay]);

  React.useEffect(() => {
    if (!autoplay || stories.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % stories.length), 6000);
    return () => window.clearInterval(timer);
  }, [autoplay, stories.length]);

  React.useEffect(() => {
    if (story) logAnalyticsEvent('testimonial_slide_view', { testimonial_id: story.id, position: safeIndex + 1, autoplay, category: story.category, locale });
  }, [autoplay, locale, safeIndex, story]);

  function selectCategory(next) {
    setCategory(next);
    setIndex(0);
    logAnalyticsEvent('testimonial_category_filter', { category: next, locale });
  }

  function move(direction) {
    setIndex((current) => (current + direction + stories.length) % stories.length);
  }

  function toggleAutoplay() {
    setAutoplay((current) => {
      logAnalyticsEvent('testimonial_autoplay_toggled', { enabled: !current, locale });
      return !current;
    });
  }

  return (
    <article className="legacy-editorial legacy-testimonials" lang={locale === 'hi' ? 'hi' : 'en'}>
      <LegacyHero index="Riders / Approved stories" eyebrow={copy.eyebrow} title="Testimonials" intro={copy.intro} locale={locale} onLocale={setLocale} image="/assets/campaign/light-summit-hero.webp" imageAlt="A rider and bicycle overlooking a mountain valley" />
      <section className="legacy-testimonial-stage">
        <div className="legacy-testimonial-toolbar">
          <div className="legacy-chip-row">{['All', 'MTB', 'Road', 'Partner'].map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => selectCategory(item)}>{item === 'All' ? copy.all : item}</button>)}</div>
          <button type="button" className="legacy-autoplay" aria-pressed={autoplay} onClick={toggleAutoplay}><i data-lucide="radio" aria-hidden="true" />{autoplay ? copy.autoplayOff : copy.autoplayOn}</button>
        </div>
        {story ? (
          <blockquote className="legacy-testimonial" aria-live={autoplay ? 'off' : 'polite'}>
            <span>{String(safeIndex + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}</span>
            <p>“{locale === 'hi' ? TESTIMONIAL_HI[TESTIMONIAL_SOURCE.indexOf(story)] : story.quote}”</p>
            <footer><strong>{story.rider}</strong><small>{story.role} · {story.category}</small></footer>
          </blockquote>
        ) : null}
        <div className="legacy-testimonial-controls"><button type="button" onClick={() => move(-1)} aria-label={copy.previous}><i data-lucide="arrow-left" aria-hidden="true" /></button><button type="button" onClick={() => move(1)} aria-label={copy.next}><i data-lucide="arrow-right" aria-hidden="true" /></button></div>
      </section>
    </article>
  );
}

function BlogPage() {
  const [locale, setLocale] = useStoredLocale('finspeed-blog-locale');
  const [filter, setFilter] = React.useState('All');
  const [feedback, setFeedback] = React.useState('');
  const copy = COPY.blog[locale];
  const readBuckets = React.useRef(new Set());
  useLucideIcons([locale, filter, feedback]);

  React.useEffect(() => {
    readBuckets.current.clear();
    logAnalyticsEvent('blog_subscription_banner', { action: 'impression', slug: 'daily-commute-cycling-safety', locale });
    function recordReadDepth() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100;
      [25, 50, 75, 100].forEach((bucket) => {
        if (percent >= bucket && !readBuckets.current.has(bucket)) {
          readBuckets.current.add(bucket);
          logAnalyticsEvent('blog_article_read', { slug: 'daily-commute-cycling-safety', read_percent: bucket, locale });
        }
      });
    }
    window.addEventListener('scroll', recordReadDepth, { passive: true });
    recordReadDepth();
    return () => window.removeEventListener('scroll', recordReadDepth);
  }, [locale]);

  async function share() {
    const shareData = { title: 'Daily Commute Cycling Safety: Turn Every Ride Into Power', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
      setFeedback(copy.shared);
    } catch {
      setFeedback('');
    }
  }

  return (
    <article className="legacy-editorial legacy-blog" lang={locale === 'hi' ? 'hi' : 'en'}>
      <LegacyHero index="Journal / 01" eyebrow={copy.eyebrow} title="Daily Commute Cycling Safety: Turn Every Ride Into Power" intro={copy.intro} locale={locale} onLocale={setLocale} image="/assets/campaign/light-terrain-city.webp" imageAlt="A quiet city route at first light">
        <div className="legacy-article-meta"><span>{copy.readTime}</span><span>Safety</span><span>Finspeed Engineering</span></div>
      </LegacyHero>
      <section className="legacy-blog-toolbar" aria-label="Article filters"><div className="legacy-chip-row"><button type="button" aria-pressed={filter === 'All'} onClick={() => { setFilter('All'); logAnalyticsEvent('blog_tag_filter', { tag: 'all', result_count: 1, locale }); }}>{copy.all}</button><button type="button" aria-pressed={filter === 'Safety'} onClick={() => { setFilter('Safety'); logAnalyticsEvent('blog_tag_filter', { tag: 'safety', result_count: 1, locale }); }}>{copy.safety}</button></div><span>{copy.articleLabel}</span></section>
      <section className="legacy-content-grid legacy-blog-content">
        <PageLead eyebrow={copy.articleLabel} title={copy.sectionTitle} body={copy.sectionBody} />
        <div className="legacy-blog-checks">{copy.checks.map(([title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
      </section>
      <section className="legacy-editorial-cta legacy-editorial-cta--split"><div><p className="editorial-kicker">Stay in the loop</p><h2>{copy.subscribe}</h2><a href={`mailto:${SUPPORT.email}?subject=${encodeURIComponent('Subscribe me to Finspeed field notes')}`} onClick={() => logAnalyticsEvent('blog_subscription_banner', { action: 'email_opt_in', slug: 'daily-commute-cycling-safety', locale })}>{SUPPORT.email}</a></div><div><button type="button" className="editorial-cta editorial-cta--secondary" onClick={share}>{copy.share} <i data-lucide="share-2" aria-hidden="true" /></button>{feedback ? <p role="status">{feedback}</p> : null}</div></section>
    </article>
  );
}

function SupportRequest({ locale }) {
  const copy = COPY.support[locale];
  const [form, setForm] = React.useState({ name: '', email: '', topic: 'Product and fit', message: '' });
  const [status, setStatus] = React.useState('idle');
  const [feedback, setFeedback] = React.useState('');
  const endpoint = process.env.NEXT_PUBLIC_SUPPORT_FORM_ENDPOINT;

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setStatus('error');
      setFeedback(copy.required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus('error');
      setFeedback(copy.validEmail);
      return;
    }
    if (!endpoint) {
      const subject = encodeURIComponent(`Finspeed support · ${form.topic}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\n${form.message}`);
      setStatus('fallback');
      setFeedback(copy.prepared);
      window.location.href = `mailto:${SUPPORT.email}?subject=${subject}&body=${body}`;
      return;
    }
    setStatus('submitting');
    setFeedback('');
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value.trim()));
      payload.append('source', 'support-hub');
      const response = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: payload });
      if (!response.ok) throw new Error('The request could not be sent. Use WhatsApp or email instead.');
      setStatus('success');
      setFeedback(copy.received);
      setForm({ name: '', email: '', topic: 'Product and fit', message: '' });
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'The request could not be sent.');
    }
  }

  return (
    <form className="legacy-support-form" onSubmit={submit} noValidate>
      <div className="legacy-field-pair"><label>Name<input value={form.name} onChange={update('name')} autoComplete="name" required /></label><label>Email<input type="email" value={form.email} onChange={update('email')} autoComplete="email" required /></label></div>
      <label>What can we help with?<select value={form.topic} onChange={update('topic')}><option>Product and fit</option><option>Order and delivery</option><option>Warranty and service</option><option>Dealer enquiry</option></select></label>
      <label>Tell us what happened<textarea rows="5" value={form.message} onChange={update('message')} required /></label>
      <button type="submit" className="editorial-cta editorial-cta--primary" disabled={status === 'submitting'}>{status === 'submitting' ? copy.sending : copy.send} <i data-lucide="send" aria-hidden="true" /></button>
      {feedback ? <p className={`legacy-form-feedback is-${status}`} role={status === 'error' ? 'alert' : 'status'}>{feedback}</p> : null}
    </form>
  );
}

function SupportHub() {
  const [locale, setLocale] = useStoredLocale('finspeed-support-locale');
  const copy = COPY.support[locale];
  useLucideIcons([locale]);
  return (
    <article className="legacy-editorial legacy-support" lang={locale === 'hi' ? 'hi' : 'en'}>
      <LegacyHero index="Owners / Support" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} locale={locale} onLocale={setLocale} image="/assets/campaign/light-terrain-hybrid.webp" imageAlt="A forest trail representing the road ahead" />
      <section className="legacy-support-channels" aria-label="Support channels">
        <a href={SUPPORT.whatsapp} target="_blank" rel="noreferrer" onClick={() => logAnalyticsEvent('support_channel_click', { channel: 'whatsapp', channel_id: 'whatsapp', locale })}><span>01</span><i data-lucide="message-square" aria-hidden="true" /><div><p className="editorial-kicker">WhatsApp</p><strong>WhatsApp {SUPPORT.phone}</strong><small>{SUPPORT.hours}</small></div><i data-lucide="arrow-right" aria-hidden="true" /></a>
        <a href={`mailto:${SUPPORT.email}`} onClick={() => logAnalyticsEvent('support_channel_click', { channel: 'email', channel_id: 'email', locale })}><span>02</span><i data-lucide="mail" aria-hidden="true" /><div><p className="editorial-kicker">Email</p><strong>{SUPPORT.email}</strong><small>Published response target: within 6 hours</small></div><i data-lucide="arrow-right" aria-hidden="true" /></a>
      </section>
      <section className="legacy-status-line"><i data-lucide="check-circle" aria-hidden="true" /><p>{copy.status}</p></section>
      <section className="legacy-content-grid legacy-support-grid"><PageLead eyebrow="Open a request" title={copy.formTitle} body={copy.formBody} /><SupportRequest locale={locale} /></section>
    </article>
  );
}

export { BlogPage, BrandStory, Dealers, SupportHub, TestimonialsPage };
