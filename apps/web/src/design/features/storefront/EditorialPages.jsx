import React from 'react';
import { stores } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

const campaignMedia = {
  summit: {
    light: '/assets/campaign/light-summit-hero.webp',
    dark: '/assets/campaign/quiet-summit-hero.webp',
    lightSrcSet: '/assets/campaign/light-summit-hero-1440.webp 1440w, /assets/campaign/light-summit-hero.webp 1920w',
    darkSrcSet: '/assets/campaign/quiet-summit-hero-1440.webp 1440w, /assets/campaign/quiet-summit-hero.webp 1920w',
  },
  city: {
    light: '/assets/campaign/light-terrain-city.webp',
    dark: '/assets/campaign/terrain-city.webp',
    lightSrcSet: '/assets/campaign/light-terrain-city-960.webp 960w, /assets/campaign/light-terrain-city.webp 1440w',
    darkSrcSet: '/assets/campaign/terrain-city-960.webp 960w, /assets/campaign/terrain-city.webp 1440w',
  },
  hybrid: {
    light: '/assets/campaign/light-terrain-hybrid.webp',
    dark: '/assets/campaign/terrain-hybrid.webp',
    lightSrcSet: '/assets/campaign/light-terrain-hybrid-960.webp 960w, /assets/campaign/light-terrain-hybrid.webp 1440w',
    darkSrcSet: '/assets/campaign/terrain-hybrid-960.webp 960w, /assets/campaign/terrain-hybrid.webp 1440w',
  },
};

const supportChannels = [
  {
    label: 'WhatsApp',
    detail: '+91 96506 08982',
    description: 'Sales, service and visit enquiries',
    href: 'https://wa.me/919650608982',
    icon: 'message-square',
  },
  {
    label: 'Email',
    detail: 'support@finspeed.online',
    description: 'For detailed product, order and warranty requests',
    href: 'mailto:support@finspeed.online',
    icon: 'mail',
  },
];

function PageHero({ index, kicker, title, intro, image, imageAlt, theme = 'light', children }) {
  const imageSource = typeof image === 'string' ? image : image?.[theme] || image?.light;
  const imageSrcSet = typeof image === 'string' ? undefined : image?.[`${theme}SrcSet`];

  return (
    <section className="editorial-page-hero">
      <div className="editorial-page-hero__copy">
        <p className="editorial-page-index">{index}</p>
        <p className="editorial-kicker">{kicker}</p>
        <h1>{title}</h1>
        <span className="editorial-rule" aria-hidden="true" />
        <p className="editorial-page-hero__intro">{intro}</p>
        {children}
      </div>
      {image ? (
        <div className="editorial-page-hero__media">
          <img src={imageSource} srcSet={imageSrcSet} sizes="(max-width: 900px) 100vw, 54vw" alt={imageAlt} />
        </div>
      ) : null}
    </section>
  );
}

function SectionIntro({ kicker, title, body }) {
  return (
    <header className="editorial-page-section__intro">
      <p className="editorial-kicker">{kicker}</p>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </header>
  );
}

function About({ onNav, theme = 'light' }) {
  useLucideIcons();
  const principles = [
    ['01', 'Useful performance', 'Every specification must improve control, durability or comfort on a real ride.'],
    ['02', 'Built around the ride', 'Mountain, city and hybrid bikes are shaped around where they will actually be ridden.'],
    ['03', 'Serviceable by design', 'Straightforward components and local support keep a Finspeed on the road for longer.'],
  ];

  return (
    <article className="editorial-page editorial-story-page">
      <PageHero
        index="01 / Our story"
        kicker="Engineered for exploration"
        title="Built for the long way round."
        intro="Finspeed makes focused bicycles for riders who expect the commute, the climb and the weekend trail to feel equally considered."
        image={campaignMedia.summit}
        imageAlt="A rider and Finspeed bicycle overlooking a mountain valley"
        theme={theme}
      >
        <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('shop')}>
          Explore the bikes <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </PageHero>

      <section className="editorial-stat-rail" aria-label="Finspeed at a glance">
        <div><strong>11</strong><span>Focused bicycles</span></div>
        <div><strong>03</strong><span>Ways to ride</span></div>
        <div><strong>02</strong><span>Published locations</span></div>
        <div><strong>NCR</strong><span>Based in Greater Noida</span></div>
      </section>

      <section className="editorial-page-section editorial-story-grid">
        <SectionIntro
          kicker="Why Finspeed"
          title="Fewer bikes. Better choices."
          body="A focused range makes it easier to find the right ride. Start with where you ride, then choose the frame, brakes, suspension and gears that match it."
        />
        <div className="editorial-principle-list">
          {principles.map(([number, title, body]) => (
            <article key={number} className="editorial-principle">
              <span>{number}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-page-cta">
        <div>
          <p className="editorial-kicker">The decisions beneath the paint</p>
          <h2>See how a Finspeed is engineered.</h2>
        </div>
        <button type="button" className="editorial-cta editorial-cta--secondary" onClick={() => onNav('engineering')}>
          Our engineering <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </section>
    </article>
  );
}

function Stores({ onNav, theme = 'light' }) {
  useLucideIcons();

  return (
    <article className="editorial-page editorial-stores-page">
      <PageHero
        index="04 / Visit Finspeed"
        kicker="Greater Noida"
        title="Meet the bikes in person."
        intro="See the bikes, find your size and get help choosing the right ride."
        image={campaignMedia.city}
        imageAlt="A quiet urban route at first light"
        theme={theme}
      />

      <section className="editorial-page-section">
        <SectionIntro
          kicker="Visit us in Greater Noida"
          title="Two places to meet Finspeed."
          body="Our two Greater Noida locations are listed below. Contact us before travelling so we can confirm opening hours and bicycle availability."
        />
        <div className="editorial-location-list">
          {stores.map((store, index) => {
            const address = `${store.addr}, ${store.city}, ${store.state} ${store.pin}`;
            const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            return (
              <article key={store.id} className="editorial-location">
                <p className="editorial-location__number">{String(index + 1).padStart(2, '0')}</p>
                <div>
                  <p className="editorial-kicker">{store.type}</p>
                  <h2>{store.name}</h2>
                  <address>{address}</address>
                  <p className="editorial-location__pin">PIN {store.pin}</p>
                </div>
                <div className="editorial-location__actions">
                  <a className="editorial-cta editorial-cta--primary" href={directions} target="_blank" rel="noreferrer">
                    Directions <i data-lucide="navigation" aria-hidden="true" />
                  </a>
                  <button type="button" className="editorial-text-link" onClick={() => onNav('support')}>
                    Arrange a visit <i data-lucide="arrow-right" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="editorial-page-cta">
        <div>
          <p className="editorial-kicker">Plan your visit</p>
          <h2>Search locations, services and test rides.</h2>
        </div>
        <button type="button" className="editorial-cta editorial-cta--secondary" onClick={() => onNav('dealers')}>
          Open the dealer locator <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </section>
    </article>
  );
}

function SupportRequest() {
  const [form, setForm] = React.useState({ name: '', email: '', topic: 'Product and fit', message: '' });
  const [status, setStatus] = React.useState('idle');
  const [feedback, setFeedback] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const endpoint = process.env.NEXT_PUBLIC_SUPPORT_FORM_ENDPOINT;
  useLucideIcons([status]);

  function update(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (form.message.trim().length < 10) nextErrors.message = 'Add at least 10 characters so we can understand the request.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus('error');
      setFeedback('Check the highlighted fields and try again.');
      return;
    }

    if (!endpoint) {
      const subject = encodeURIComponent(`Finspeed support · ${form.topic}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\n${form.message}`);
      window.location.href = `mailto:support@finspeed.online?subject=${subject}&body=${body}`;
      setStatus('fallback');
      setFeedback('Your email app is opening with the request prepared.');
      return;
    }

    setStatus('submitting');
    setFeedback('');
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value.trim()));
      payload.append('source', 'editorial-support');
      const response = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: payload });
      if (!response.ok) throw new Error('The request could not be sent. Use WhatsApp or email instead.');
      setStatus('success');
      setFeedback('Request received. A reply will be sent to the email address you provided.');
      setForm({ name: '', email: '', topic: 'Product and fit', message: '' });
      setErrors({});
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'The request could not be sent.');
    }
  }

  return (
    <form className="editorial-support-form" onSubmit={submit} noValidate>
      <div className="editorial-field-pair">
        <label>
          Name
          <input value={form.name} onChange={update('name')} autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'support-name-error' : undefined} />
          {errors.name ? <span id="support-name-error" className="editorial-field-error">{errors.name}</span> : null}
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={update('email')} autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'support-email-error' : undefined} />
          {errors.email ? <span id="support-email-error" className="editorial-field-error">{errors.email}</span> : null}
        </label>
      </div>
      <label>
        What can we help with?
        <select value={form.topic} onChange={update('topic')}>
          <option>Product and fit</option>
          <option>Order and delivery</option>
          <option>Warranty and service</option>
          <option>Dealer enquiry</option>
        </select>
      </label>
      <label>
        Tell us what happened
        <textarea rows="5" value={form.message} onChange={update('message')} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'support-message-error' : undefined} />
        {errors.message ? <span id="support-message-error" className="editorial-field-error">{errors.message}</span> : null}
      </label>
      <button type="submit" className="editorial-cta editorial-cta--primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send request'} <i data-lucide="send" aria-hidden="true" />
      </button>
      {feedback ? <p className={`editorial-form-feedback is-${status}`} role={status === 'error' ? 'alert' : 'status'}>{feedback}</p> : null}
    </form>
  );
}

function Support({ onNav, theme = 'light', contact = false }) {
  useLucideIcons();
  const faq = [
    ['How do I choose the right bicycle?', 'Start with where you ride most: mountain trails, city streets or a mix of both. A ride specialist can help confirm your size and setup.'],
    ['What warranty comes with a Finspeed?', 'Your exact cover depends on the bicycle, setup and current terms. Ask support to confirm eligibility, exclusions and service support before handover.'],
    ['How much assembly is required?', 'The bicycle arrives partially assembled. The exact final setup varies by model, so use the model-specific manual and complete every safety check before riding.'],
    ['Can I change components before ordering?', 'Build Your Ride shows only the setups currently available for the selected model. Confirm the final specification and availability before placing an order.'],
  ];

  return (
    <article className="editorial-page editorial-support-page">
      <PageHero
        index={contact ? 'Talk to Finspeed' : 'Owners / Support'}
        kicker="Here when you need us"
        title={contact ? 'Start a conversation.' : 'Support for the whole ride.'}
        intro="A quick question, a service concern or help choosing a bicycle—tell us what you need and we will make sure it reaches the right person."
        image={campaignMedia.hybrid}
        imageAlt="A forest trail representing the road ahead"
        theme={theme}
      />

      <section className="editorial-support-channels" aria-label="Support channels">
        {supportChannels.map((channel, index) => (
          <a key={channel.label} href={channel.href} className="editorial-support-channel" target={channel.href.startsWith('http') ? '_blank' : undefined} rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <i data-lucide={channel.icon} aria-hidden="true" />
            <div><p className="editorial-kicker">{channel.label}</p><strong>{channel.detail}</strong><small>{channel.description}</small></div>
            <i data-lucide="arrow-right" aria-hidden="true" />
          </a>
        ))}
      </section>

      <section className="editorial-page-section editorial-support-grid">
        <div>
          <SectionIntro kicker="Open a request" title="Tell us what you need." body="Share the details once and the Finspeed team will take it from there." />
          <SupportRequest />
        </div>
        <aside className="editorial-support-faq">
          <p className="editorial-kicker">Common questions</p>
          {faq.map(([question, answer]) => (
            <details key={question}><summary>{question}</summary><p>{answer}</p></details>
          ))}
          <button type="button" className="editorial-text-link" onClick={() => onNav('warranty')}>
            Read warranty summary <i data-lucide="arrow-right" aria-hidden="true" />
          </button>
        </aside>
      </section>
    </article>
  );
}

function Contact(props) {
  return <Support {...props} contact />;
}

function Warranty({ onNav }) {
  useLucideIcons();
  const coverage = [
    ['02 years', 'Frame warranty', 'Manufacturing and material defects in the original frame, subject to the current warranty terms.'],
    ['02 visits', 'Complimentary service', 'Two scheduled services within the first six months.'],
    ['Original setup', 'Components', 'Support depends on the original bicycle setup, the affected part and the nature of the issue.'],
  ];

  return (
    <article className="editorial-page editorial-warranty-page">
      <PageHero index="Owners / Warranty" kicker="Warranty and service" title="Understand your cover before the ride." intro="Warranty and service support depend on the bicycle, setup and current terms. Ask Finspeed to confirm eligibility, exclusions and next steps for your bicycle." />
      <section className="editorial-warranty-coverage">
        {coverage.map(([metric, title, body]) => <article key={title}><strong>{metric}</strong><h2>{title}</h2><p>{body}</p></article>)}
      </section>
      <section className="editorial-page-section editorial-claim-flow">
        <SectionIntro kicker="Making a claim" title="Four steps to a clear answer." body="Keep your invoice and bike details close. Photographs help the service team assess the request before you travel." />
        <ol>
          <li><span>01</span><div><h3>Collect the details</h3><p>Invoice or order number, model, purchase date and the affected component.</p></div></li>
          <li><span>02</span><div><h3>Show the issue</h3><p>Add clear photographs and a short description of when the issue appeared.</p></div></li>
          <li><span>03</span><div><h3>Technical review</h3><p>The team checks warranty eligibility and the appropriate repair or replacement route.</p></div></li>
          <li><span>04</span><div><h3>Resolve and return</h3><p>Visit the confirmed service location or follow the dispatch instructions provided.</p></div></li>
        </ol>
        <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('support')}>
          Ask about a claim <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </section>
    </article>
  );
}

function Assembly({ onNav }) {
  useLucideIcons();
  const steps = [
    ['01', 'Unbox and inspect', 'Lift by the frame, confirm every part and photograph any transit damage before assembly.'],
    ['02', 'Fit the front wheel', 'Seat the axle fully, secure it and spin the wheel to confirm it runs centred.'],
    ['03', 'Align the cockpit', 'Set the stem square to the front wheel and tighten the faceplate evenly.'],
    ['04', 'Thread the pedals', 'Right threads clockwise; left threads anti-clockwise. Begin both by hand.'],
    ['05', 'Set saddle height', 'Keep the post above its insertion mark and aim for a slight knee bend at the bottom of the stroke.'],
    ['06', 'Check brakes and gears', 'Confirm firm lever feel, centred rotors or pads and clean shifts through every available gear.'],
    ['07', 'Set tyre pressure', 'Use the pressure range printed on the tyre sidewall.'],
    ['08', 'Run the ABC check', 'Air, brakes and chain—then re-check every fastener after the first short ride.'],
  ];

  return (
    <article className="editorial-page editorial-assembly-page">
      <PageHero index="Owners / Assembly" kicker="Final setup and safety checks" title="From the box to a bicycle that is ready to ride." intro="Your Finspeed arrives partially assembled. The exact work varies by model: follow the supplied manual, use its torque values and complete every safety check before the first ride." />
      <section className="editorial-assembly-notice" aria-labelledby="assembly-before-you-start">
        <p className="editorial-kicker">Before you start</p>
        <h2 id="assembly-before-you-start">Use the manual for your exact model.</h2>
        <p>This page is a general sequence, not a substitute for the bicycle’s supplied instructions. If a part, fastener or adjustment is unclear, stop and arrange a specialist setup.</p>
      </section>
      <section className="editorial-page-section editorial-assembly-grid">
        <SectionIntro kicker="Eight checks" title="Take the sequence seriously." body="Use the correct tools and the torque guidance supplied with the bicycle. These steps do not replace model-specific instructions." />
        <ol>{steps.map(([number, title, body]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
        <div className="editorial-assembly-help">
          <p>Prefer a specialist setup?</p>
          <button type="button" className="editorial-text-link" onClick={() => onNav('stores')}>Find a Finspeed store <i data-lucide="arrow-right" aria-hidden="true" /></button>
        </div>
      </section>
    </article>
  );
}

function Journal({ onNav, theme = 'light' }) {
  useLucideIcons();
  const checks = [
    ['01', 'Make yourself visible', 'Use front and rear lights in low light, wear a helmet, and choose clothing that keeps you easy to see.'],
    ['02', 'Read the route early', 'Scan parked cars, junctions and surface changes before they become last-second decisions.'],
    ['03', 'Brake before the turn', 'Set your speed while the bicycle is upright, then look through the corner and hold a steady line.'],
    ['04', 'Run the ABC check', 'Air, brakes and chain take less than a minute to inspect before the commute begins.'],
  ];

  return (
    <article className="editorial-page editorial-journal-page">
      <PageHero
        index="Journal / 01"
        kicker="Ride notes"
        title="Daily commute cycling safety."
        intro="A few deliberate habits turn crowded streets into a calmer, more predictable ride. Start with visibility, anticipation and a bicycle that is ready before you leave."
        image={campaignMedia.city}
        imageAlt="A quiet city route at first light"
        theme={theme}
      />
      <section className="editorial-page-section editorial-journal-lead">
        <SectionIntro kicker="Before-you-ride guide" title="Confidence begins before the first pedal stroke." body="Traffic changes quickly; your preparation should not. These are simple checks, not a substitute for local traffic rules or professional mechanical advice." />
        <div className="editorial-journal-checks">
          {checks.map(([number, title, body]) => (
            <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></article>
          ))}
        </div>
      </section>
      <section className="editorial-page-cta">
        <div><p className="editorial-kicker">Prepare the bicycle</p><h2>Need a setup check before the ride?</h2></div>
        <button type="button" className="editorial-cta editorial-cta--secondary" onClick={() => onNav('assembly')}>Open the assembly guide <i data-lucide="arrow-right" aria-hidden="true" /></button>
      </section>
    </article>
  );
}

function RiderStories({ onNav, theme = 'light' }) {
  useLucideIcons();
  const rideProfiles = [
    ['01', 'Mountain', 'Choose this path for broken surfaces, climbs and trails where tyre grip, braking control and front-end comfort matter most.', 'See mountain bikes', 'mountain'],
    ['02', 'City', 'Choose this path for everyday streets, shorter journeys and simple ownership where visibility, comfort and easy service take priority.', 'See city bikes', 'city'],
    ['03', 'Hybrid', 'Choose this path when the week moves between paved roads and rougher shortcuts, and one adaptable bicycle needs to do both.', 'See hybrid bikes', 'hybrid'],
  ];

  return (
    <article className="editorial-page editorial-stories-page">
      <PageHero
        index="Choose your ride"
        kicker="Three ways to begin"
        title="Start with the roads you know."
        intro="Trail, street or a little of both—start with the places you already ride, then meet the Finspeed bicycles made for them."
        image={campaignMedia.summit}
        imageAlt="A rider and bicycle overlooking a mountain valley"
        theme={theme}
      />
      <section className="editorial-page-section">
        <SectionIntro kicker="Ride profiles" title="Different routes ask for different things." body="Use these profiles as a starting point, then compare the published specification of each bicycle before choosing." />
        <div className="editorial-stories-list">
          {rideProfiles.map(([number, title, body, action, category]) => (
            <article key={category}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
              <button type="button" className="editorial-text-link" onClick={() => onNav('shop', category)}>{action} <i data-lucide="arrow-right" aria-hidden="true" /></button>
            </article>
          ))}
        </div>
      </section>
      <section className="editorial-page-cta">
        <div><p className="editorial-kicker">Find your Finspeed</p><h2>Choose by the ride you want to make.</h2></div>
        <button type="button" className="editorial-cta editorial-cta--secondary" onClick={() => onNav('shop')}>Explore the bikes <i data-lucide="arrow-right" aria-hidden="true" /></button>
      </section>
    </article>
  );
}

export { About, Assembly, campaignMedia, Contact, Journal, PageHero, RiderStories, SectionIntro, Stores, Support, Warranty };
