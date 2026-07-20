/* eslint-disable @next/next/no-img-element -- native picture sources and blend modes preserve the art direction */
import React from 'react';
import { resolveProductImage } from '../../data/storefront.js';

const engineeringChapters = [
  {
    number: '01',
    kicker: 'Frame integrity',
    title: 'Steady on rough roads.',
    copy: 'A strong steel frame keeps the ride steady on broken roads, while balanced proportions make the bike easy to handle.',
    region: 'frame',
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
    copy: 'Disc brakes give you steady stopping power in dry, wet and dusty conditions.',
    region: 'brakes',
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
    copy: 'Front suspension helps the tyre stay connected when the route turns rough, while rigid forks keep familiar roads simple and direct.',
    region: 'suspension',
    alt: 'Close study of the Mako Shark front suspension fork and tyre',
    facts: [
      ['Control', 'Front suspension'],
      ['Alternative', 'Rigid fork'],
    ],
  },
  {
    number: '04',
    kicker: 'Gear range',
    title: 'Ready for every gradient.',
    copy: 'Choose 21 gears for climbs and changing pace, or single speed for simple, low-maintenance riding.',
    region: 'drivetrain',
    alt: 'Close study of the Mako Shark rear cassette, derailleur, and chain',
    facts: [
      ['Range', '21-speed'],
      ['Alternative', 'Single speed'],
    ],
  },
];

function Engineering({ onNav, theme }) {
  const makoVisual = React.useMemo(
    () => resolveProductImage('mako-shark', { theme, role: 'engineering', width: 1600 }),
    [theme],
  );

  return (
    <div className="engineering-page">
      <section className="engineering-hero" aria-labelledby="engineering-title">
        <div className="engineering-hero__media">
          <img
            src={makoVisual.src}
            srcSet={makoVisual.srcSet}
            sizes={makoVisual.sizes}
            style={makoVisual.style}
            data-product-scale={makoVisual.registration.scale}
            data-product-baseline={makoVisual.registration.baseline}
            alt="Finspeed Mako Shark bicycle in a clean side profile"
            fetchPriority="high"
          />
        </div>
        <span className="engineering-hero__shade" aria-hidden="true" />

        <div className="engineering-hero__content">
          <p className="engineering-hero__kicker">Our engineering</p>
          <h1 id="engineering-title">Steady on rough roads.<br />Confident in every turn.</h1>
          <span className="engineering-hero__rule" aria-hidden="true" />
          <p className="engineering-hero__body">
            Strong frames, steady brakes and practical parts help every Finspeed feel ready from the first ride.
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
        <p className="engineering-hero__product-note">Mako Shark shown. Equipment varies by model.</p>
      </section>

      <section className="engineering-intro" aria-labelledby="engineering-intro-title">
        <div>
          <p className="editorial-kicker">Built around your ride</p>
          <h2 id="engineering-intro-title">Comfort, control<br />and confidence.</h2>
        </div>
        <div className="engineering-intro__statement">
          <p>
            Frame, fork, brakes and gears are chosen around real riding: rough roads, traffic, climbs, errands and weekend trails.
          </p>
          <button type="button" className="editorial-text-link" onClick={() => onNav('build')}>
            Start your build <i data-lucide="arrow-right" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="engineering-chapters" aria-label="Finspeed engineering principles">
        {engineeringChapters.map(({ number, kicker, title, copy, region, alt, facts }, index) => (
          <article key={number} className={`engineering-chapter${index % 2 ? ' engineering-chapter--reverse' : ''}`}>
            <div className="engineering-chapter__media" data-region={region}>
              <span className="engineering-chapter__number" aria-hidden="true">{number}</span>
              <img
                className="engineering-chapter__product"
                src={makoVisual.src}
                srcSet={makoVisual.srcSet}
                sizes="(max-width: 900px) 100vw, 60vw"
                alt={alt}
                loading="lazy"
                decoding="async"
              />
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
          <p className="editorial-kicker">Make it yours</p>
          <h2 id="engineering-configure-title">Choose the setup<br />that suits your ride.</h2>
          <p>
            Shape the brakes, suspension, gears and finish around your route.
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
            src={makoVisual.src}
            srcSet={makoVisual.srcSet}
            sizes={makoVisual.sizes}
            style={makoVisual.style}
            data-product-scale={makoVisual.registration.scale}
            data-product-baseline={makoVisual.registration.baseline}
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
