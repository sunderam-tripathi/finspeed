import React from 'react';
import { stores } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';
import { TESTIMONIALS } from '../../../data/testimonials';

const supportChannels = [
  {
    label: 'WhatsApp',
    detail: '+91 96506 08982',
    description: 'Sales, service and ride support · 09:00–21:00 IST',
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

function PageHero({ index, kicker, title, intro, image, imageAlt, children }) {
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
          <img src={image} alt={imageAlt} />
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

function About({ onNav }) {
  useLucideIcons();
  const principles = [
    ['01', 'Useful performance', 'Every specification must improve control, durability or comfort on a real ride.'],
    ['02', 'Built around terrain', 'Mountain, city and hybrid frames are tuned around where they will actually be ridden.'],
    ['03', 'Serviceable by design', 'Straightforward components and local support keep a Finspeed on the road for longer.'],
  ];

  return (
    <article className="editorial-page editorial-story-page">
      <PageHero
        index="01 / Our story"
        kicker="Engineered for exploration"
        title="Built for the long way round."
        intro="Finspeed makes focused bicycles for riders who expect the commute, the climb and the weekend trail to feel equally considered."
        image="/assets/campaign/light-summit-hero.webp"
        imageAlt="A rider and Finspeed bicycle overlooking a mountain valley"
      >
        <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('shop')}>
          Explore the bikes <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </PageHero>

      <section className="editorial-stat-rail" aria-label="Finspeed at a glance">
        <div><strong>11</strong><span>Focused bicycles</span></div>
        <div><strong>03</strong><span>Ride profiles</span></div>
        <div><strong>85%</strong><span>Pre-assembled</span></div>
        <div><strong>NCR</strong><span>Built in Greater Noida</span></div>
      </section>

      <section className="editorial-page-section editorial-story-grid">
        <SectionIntro
          kicker="Why Finspeed"
          title="Less catalogue. More conviction."
          body="A small range gives every frame a reason to exist. We begin with a riding need, then choose geometry, braking, suspension and gearing that answer it without unnecessary complexity."
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

function Stores({ onNav }) {
  useLucideIcons();

  return (
    <article className="editorial-page editorial-stores-page">
      <PageHero
        index="04 / Visit Finspeed"
        kicker="Greater Noida"
        title="Meet the bikes in person."
        intro="Compare frame sizes, speak with a ride specialist and arrange a test ride at a verified Finspeed location."
        image="/assets/campaign/light-terrain-city.webp"
        imageAlt="A quiet urban route at first light"
      />

      <section className="editorial-page-section">
        <SectionIntro
          kicker="Verified locations"
          title="Two places. One focused experience."
          body="Only locations confirmed in the current Finspeed dealer handoff are shown here."
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
    </article>
  );
}

function SupportRequest() {
  const [form, setForm] = React.useState({ name: '', email: '', topic: 'Product and fit', message: '' });
  const [status, setStatus] = React.useState('idle');
  const [feedback, setFeedback] = React.useState('');
  const endpoint = process.env.NEXT_PUBLIC_SUPPORT_FORM_ENDPOINT;
  useLucideIcons([status]);

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setStatus('error');
      setFeedback('Enter your name so the team knows who to help.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus('error');
      setFeedback('Enter a valid email address so the team can reply.');
      return;
    }
    if (form.message.trim().length < 10) {
      setStatus('error');
      setFeedback('Add a short description of what happened so the team can route your request.');
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
      setFeedback('Request received. The Finspeed team will reply through email.');
      setForm({ name: '', email: '', topic: 'Product and fit', message: '' });
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'The request could not be sent.');
    }
  }

  return (
    <form className="editorial-support-form" onSubmit={submit} noValidate>
      <div className="editorial-field-pair">
        <label>Name<input value={form.name} onChange={update('name')} autoComplete="name" required /></label>
        <label>Email<input type="email" value={form.email} onChange={update('email')} autoComplete="email" required /></label>
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
      <label>Tell us what happened<textarea rows="5" value={form.message} onChange={update('message')} required /></label>
      <button type="submit" className="editorial-cta editorial-cta--primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send request'} <i data-lucide="send" aria-hidden="true" />
      </button>
      {feedback ? <p className={`editorial-form-feedback is-${status}`} role={status === 'error' ? 'alert' : 'status'}>{feedback}</p> : null}
    </form>
  );
}

function Support({ onNav, contact = false }) {
  useLucideIcons();
  const faq = [
    ['How do I choose the right bicycle?', 'Start with where you ride most. The range and build studio organise frames around mountain, city and hybrid use; a ride specialist can confirm size and component compatibility.'],
    ['What warranty comes with a Finspeed?', 'Current governed catalogue terms specify a 2-year frame warranty and two complimentary services within the first six months.'],
    ['How much assembly is required?', 'Bicycles arrive 85% pre-assembled. Fit the front wheel, handlebar, pedals and saddle, then complete the brake, gear and tyre-pressure checks in the assembly guide.'],
    ['Can I change components before ordering?', 'Yes. Use Build Your Ride for supported combinations. A Finspeed specialist confirms compatibility before the configured order is finalised.'],
  ];

  return (
    <article className="editorial-page editorial-support-page">
      <PageHero
        index={contact ? 'Talk to Finspeed' : 'Owners / Support'}
        kicker="Human help, clearly routed"
        title={contact ? 'Start a conversation.' : 'Support for the whole ride.'}
        intro="Choose the fastest channel for a quick answer, or send the detail once and let the right person take it from there."
        image="/assets/campaign/light-terrain-hybrid.webp"
        imageAlt="A forest trail representing the road ahead"
      />

      <section className="editorial-support-channels" aria-label="Support channels">
        {supportChannels.map((channel, index) => (
          <a key={channel.label} href={channel.href} className="editorial-support-channel">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <i data-lucide={channel.icon} aria-hidden="true" />
            <div><p className="editorial-kicker">{channel.label}</p><strong>{channel.detail}</strong><small>{channel.description}</small></div>
            <i data-lucide="arrow-right" aria-hidden="true" />
          </a>
        ))}
      </section>

      <section className="editorial-page-section editorial-support-grid">
        <div>
          <SectionIntro kicker="Open a request" title="Give us the full picture." body="If a form endpoint is configured, the request is submitted directly. Otherwise the same information is prepared in your email app—never silently discarded." />
          <SupportRequest />
        </div>
        <aside className="editorial-support-faq">
          <p className="editorial-kicker">Common questions</p>
          {faq.map(([question, answer]) => (
            <details key={question}><summary>{question}</summary><p>{answer}</p></details>
          ))}
          <button type="button" className="editorial-text-link" onClick={() => onNav('warranty')}>
            Read warranty terms <i data-lucide="arrow-right" aria-hidden="true" />
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
    ['02 visits', 'Complimentary service', 'Two scheduled services within the first six months, as specified in the governed catalogue.'],
    ['Original spec', 'Components', 'Component support is assessed against the original specification and the nature of the issue.'],
  ];

  return (
    <article className="editorial-page editorial-warranty-page">
      <PageHero index="Owners / Warranty" kicker="The promise behind the product" title="Coverage without the fine-print fog." intro="The current catalogue promise is simple: a 2-year frame warranty and two complimentary services in the first six months." />
      <section className="editorial-warranty-coverage">
        {coverage.map(([metric, title, body]) => <article key={title}><strong>{metric}</strong><h2>{title}</h2><p>{body}</p></article>)}
      </section>
      <section className="editorial-page-section editorial-claim-flow">
        <SectionIntro kicker="Making a claim" title="Four steps to a clear answer." body="Keep your invoice and original specification close. Photographs help the service team assess the request before you travel." />
        <ol>
          <li><span>01</span><div><h3>Collect the details</h3><p>Invoice or order number, model, purchase date and the affected component.</p></div></li>
          <li><span>02</span><div><h3>Show the issue</h3><p>Add clear photographs and a short description of when the issue appeared.</p></div></li>
          <li><span>03</span><div><h3>Technical review</h3><p>The team checks warranty eligibility and the appropriate repair or replacement route.</p></div></li>
          <li><span>04</span><div><h3>Resolve and return</h3><p>Visit the confirmed service location or follow the dispatch instructions provided.</p></div></li>
        </ol>
        <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('support')}>
          Start a claim <i data-lucide="arrow-right" aria-hidden="true" />
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
  const details = [
    ['/assets/campaign/build-detail-brakes-ai.webp', 'Brake rotor and caliper detail'],
    ['/assets/campaign/build-detail-suspension-ai.webp', 'Front suspension detail'],
    ['/assets/campaign/build-detail-drivetrain-ai.webp', 'Rear drivetrain detail'],
    ['/assets/campaign/build-detail-frame-ai.webp', 'Finspeed frame detail'],
  ];

  return (
    <article className="editorial-page editorial-assembly-page">
      <PageHero index="Owners / Assembly" kicker="Ride within the hour" title="From the box to the road." intro="Your Finspeed arrives 85% pre-assembled. Work methodically through the final fit, then complete the safety checks before the first ride." />
      <section className="editorial-assembly-details" aria-label="Bicycle component details">
        {details.map(([src, alt]) => <img key={src} src={src} alt={alt} />)}
      </section>
      <section className="editorial-page-section editorial-assembly-grid">
        <SectionIntro kicker="Eight checks" title="Take the sequence seriously." body="Use the correct tools and the torque guidance supplied with the bicycle. If anything feels uncertain, stop and arrange support." />
        <ol>{steps.map(([number, title, body]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
        <div className="editorial-assembly-help">
          <p>Prefer a specialist setup?</p>
          <button type="button" className="editorial-text-link" onClick={() => onNav('stores')}>Find a verified location <i data-lucide="arrow-right" aria-hidden="true" /></button>
        </div>
      </section>
    </article>
  );
}

function Journal({ onNav }) {
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
        image="/assets/campaign/light-terrain-city.webp"
        imageAlt="A quiet city route at first light"
      />
      <section className="editorial-page-section editorial-journal-lead">
        <SectionIntro kicker="Six-minute field guide" title="Confidence begins before the first pedal stroke." body="Traffic changes quickly; your preparation should not. These are simple checks, not a substitute for local traffic rules or professional mechanical advice." />
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

function RiderStories({ onNav }) {
  useLucideIcons();
  const stories = TESTIMONIALS.en.stories;

  return (
    <article className="editorial-page editorial-stories-page">
      <PageHero
        index="Riders / Stories"
        kicker="From the road"
        title="The ride, in their words."
        intro="Real experiences from riders using Finspeed bicycles for the commute, the trail and everything in between."
        image="/assets/campaign/light-summit-hero.webp"
        imageAlt="A rider and bicycle overlooking a mountain valley"
      />
      <section className="editorial-page-section">
        <SectionIntro kicker="Rider notes" title="Different routes. The same expectation." body="Control, durability and an uncomplicated ownership experience matter long after the first ride." />
        <div className="editorial-stories-list">
          {stories.map((story, index) => (
            <blockquote key={`${story.rider}-${index}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>“{story.quote}”</p>
              <footer><strong>{story.rider}</strong><small>{story.role}</small></footer>
            </blockquote>
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

export { About, Assembly, Contact, Journal, RiderStories, Stores, Support, Warranty };
