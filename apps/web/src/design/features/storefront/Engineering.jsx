/* eslint-disable @next/next/no-img-element -- native picture sources and blend modes preserve the art direction */
import React from 'react';

const engineeringChapters = [
  {
    number: '01',
    kicker: 'Frame integrity',
    title: 'Strength without excess.',
    copy: 'The frame sets the character of the ride. High-tensile construction, deliberate tube placement, and balanced geometry create a platform that feels composed on broken roads and changing trails.',
    image: '/assets/campaign/build-detail-frame-ai.webp',
    alt: 'Close study of the Mako Shark head tube and frame junctions',
    facts: [
      ['Material', 'High-tensile steel'],
      ['Intent', 'Balanced trail geometry'],
    ],
  },
  {
    number: '02',
    kicker: 'Braking control',
    title: 'Confidence at your fingertips.',
    copy: 'Disc-brake architecture delivers predictable control when the surface changes. Choose the stopping response and maintenance profile that suits the way you ride.',
    image: '/assets/campaign/build-detail-brakes-ai.webp',
    alt: 'Close study of the Mako Shark front disc brake and caliper',
    facts: [
      ['Platform', 'Disc brake'],
      ['Choice', 'Power or mechanical'],
    ],
  },
  {
    number: '03',
    kicker: 'Suspension response',
    title: 'Control the rough.',
    copy: 'The front end is tuned to keep the tyre connected and the steering calm. Select suspension for rougher routes or a rigid setup for direct feedback and familiar roads.',
    image: '/assets/campaign/build-detail-suspension-ai.webp',
    alt: 'Close study of the Mako Shark front suspension fork and tyre',
    facts: [
      ['Control', 'Front suspension'],
      ['Alternative', 'Rigid fork'],
    ],
  },
  {
    number: '04',
    kicker: 'Drivetrain range',
    title: 'Ready for every gradient.',
    copy: 'A broad gear range makes climbs, commutes, and quick changes of pace feel natural. The drivetrain can be specified for versatility or stripped back for low-maintenance simplicity.',
    image: '/assets/campaign/build-detail-drivetrain-ai.webp',
    alt: 'Close study of the Mako Shark rear cassette, derailleur, and chain',
    facts: [
      ['Range', '21-speed'],
      ['Alternative', 'Single speed'],
    ],
  },
];

function Engineering({ onNav }) {
  return (
    <div className="engineering-page">
      <section className="engineering-hero" aria-labelledby="engineering-title">
        <picture className="engineering-hero__media">
          <source media="(max-width: 720px)" srcSet="/assets/campaign/mako-shark-hero-v4-mobile.webp" />
          <img
            src="/assets/campaign/mako-shark-hero-v4.webp"
            alt="Finspeed Mako Shark bicycle poised on a dark mountain trail"
            fetchPriority="high"
          />
        </picture>
        <span className="engineering-hero__shade" aria-hidden="true" />

        <div className="engineering-hero__content">
          <p className="engineering-hero__kicker">Precision engineering</p>
          <h1 id="engineering-title">Built like<br />a predator.</h1>
          <span className="engineering-hero__rule" aria-hidden="true" />
          <p className="engineering-hero__body">
            High-tensile frames. Disc-brake control. Fin-tuned geometry&mdash;every Finspeed is engineered to go beyond.
          </p>
          <div className="engineering-hero__actions">
            <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('build')}>
              Build your ride <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
            <button type="button" className="engineering-hero__text-link" onClick={() => onNav('shop')}>
              Explore the bikes <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ul className="engineering-hero__specs" aria-label="Engineering highlights">
          <li><span>01</span>High-tensile frame</li>
          <li><span>02</span>Front suspension</li>
          <li><span>03</span>Disc brakes</li>
          <li><span>04</span>21-speed range</li>
        </ul>
      </section>

      <section className="engineering-intro" aria-labelledby="engineering-intro-title">
        <div>
          <p className="editorial-kicker">Built around the rider</p>
          <h2 id="engineering-intro-title">Every detail<br />earns its place.</h2>
        </div>
        <div className="engineering-intro__statement">
          <p>
            A Finspeed is not assembled from a feature checklist. Frame, fork, brakes, and drivetrain are considered together, then tuned around how and where you ride.
          </p>
          <button type="button" className="editorial-text-link" onClick={() => onNav('build')}>
            Start your specification <i data-lucide="arrow-right" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="engineering-chapters" aria-label="Finspeed engineering principles">
        {engineeringChapters.map(({ number, kicker, title, copy, image, alt, facts }, index) => (
          <article key={number} className={`engineering-chapter${index % 2 ? ' engineering-chapter--reverse' : ''}`}>
            <div className="engineering-chapter__media">
              <span className="engineering-chapter__number" aria-hidden="true">{number}</span>
              <img src={image} alt={alt} loading="lazy" decoding="async" />
            </div>
            <div className="engineering-chapter__copy">
              <p className="editorial-kicker">{kicker}</p>
              <h2>{title}</h2>
              <p className="engineering-chapter__body">{copy}</p>
              <dl>
                {facts.map(([term, detail]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </section>

      <section className="engineering-configure" aria-labelledby="engineering-configure-title">
        <div className="engineering-configure__copy">
          <p className="editorial-kicker">Engineering you can choose</p>
          <h2 id="engineering-configure-title">One frame.<br />Your specification.</h2>
          <p>
            Shape the brake feel, suspension response, gearing, and finish around your route. Every choice stays grounded in a compatible Finspeed build.
          </p>
          <div className="engineering-configure__actions">
            <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('build')}>
              Build your ride <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
            <button type="button" className="editorial-text-link" onClick={() => onNav('stores')}>
              Visit Finspeed <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="engineering-configure__bike">
          <img
            src="/assets/products/upscaled/mako-shark-1600.webp"
            srcSet="/assets/products/upscaled/mako-shark-480.webp 480w, /assets/products/upscaled/mako-shark-960.webp 960w, /assets/products/upscaled/mako-shark-1600.webp 1600w"
            sizes="(max-width: 900px) 100vw, 58vw"
            alt="Finspeed Mako Shark bicycle shown in clean side profile"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>
    </div>
  );
}

export default Engineering;
