import React from 'react';
import { Button } from '../../ui/index.js';
import { productImage, productImageSrcSet, products } from '../../data/storefront.js';

const terrains = [
  {
    label: 'Mountain',
    filter: 'mountain',
    darkImage: '/assets/campaign/terrain-mountain.webp',
    darkImageSmall: '/assets/campaign/terrain-mountain-960.webp',
    lightImage: '/assets/campaign/light-terrain-mountain.webp',
    lightImageSmall: '/assets/campaign/light-terrain-mountain-960.webp',
  },
  {
    label: 'City',
    filter: 'city',
    darkImage: '/assets/campaign/terrain-city.webp',
    darkImageSmall: '/assets/campaign/terrain-city-960.webp',
    lightImage: '/assets/campaign/light-terrain-city.webp',
    lightImageSmall: '/assets/campaign/light-terrain-city-960.webp',
  },
  {
    label: 'Hybrid',
    filter: 'hybrid',
    darkImage: '/assets/campaign/terrain-hybrid.webp',
    darkImageSmall: '/assets/campaign/terrain-hybrid-960.webp',
    lightImage: '/assets/campaign/light-terrain-hybrid.webp',
    lightImageSmall: '/assets/campaign/light-terrain-hybrid-960.webp',
  },
];

const signatureEdit = [
  { id: 'mako-shark', line: 'Trail authority', sequence: '01' },
  { id: 'red-snapper', line: 'Everyday clarity', sequence: '02' },
  { id: 'lightning-marlin', line: 'Versatile speed', sequence: '03' },
];

function Home({ theme, onNav, onProduct }) {
  const light = theme !== 'dark';
  const chapters = signatureEdit
    .map((entry) => ({ ...entry, product: products.find((product) => product.id === entry.id) }))
    .filter((entry) => entry.product);

  return (
    <div className="store-home">
      <section className="store-trail-hero" aria-labelledby="trail-hero-title">
        <picture className="store-trail-background">
          <source
            media="(max-width: 600px)"
            srcSet={light
              ? '/assets/campaign/light-summit-hero-mobile-720.webp 720w, /assets/campaign/light-summit-hero-mobile.webp 1440w'
              : '/assets/campaign/quiet-summit-hero-mobile-720.webp 720w, /assets/campaign/quiet-summit-hero-mobile.webp 1440w'}
            sizes="100vw"
          />
          <img
            src={light ? '/assets/campaign/light-summit-hero.webp' : '/assets/campaign/quiet-summit-hero.webp'}
            srcSet={light
              ? '/assets/campaign/light-summit-hero-1440.webp 1440w, /assets/campaign/light-summit-hero.webp 2880w'
              : '/assets/campaign/quiet-summit-hero-1440.webp 1440w, /assets/campaign/quiet-summit-hero.webp 2880w'}
            sizes="100vw"
            alt=""
            decoding="async"
          />
        </picture>
        <div className="store-trail-shade" aria-hidden="true" />

        <div className="store-trail-layout">
          <div className="store-trail-copy">
            <p className="store-trail-eyebrow">Engineered for exploration</p>
            <h1 id="trail-hero-title" className="store-trail-title">Ride<br />Beyond<br />Boundaries</h1>
            <div className="store-trail-rule" aria-hidden="true" />
            <p className="store-trail-description">
              Engineered for exploration. Built for performance.<br />
              For every trail, every turn, every you.
            </p>
            <div className="store-trail-commerce">
              <Button
                variant="primary"
                size="lg"
                bevel
                onClick={() => onNav('shop')}
                iconRight={<i data-lucide="arrow-right" style={{ width: 20, height: 20 }} />}
                style={{ minWidth: 258, height: 64, fontSize: 'var(--fs-md)' }}
              >
                Find your ride
              </Button>
            </div>
          </div>
        </div>
      </section>

      <nav className="store-terrain-strip" aria-label="Shop by terrain">
        {terrains.map((terrain) => (
          <button type="button" className="store-terrain-link" key={terrain.filter} onClick={() => onNav('shop', terrain.filter)}>
            <img
              src={light ? terrain.lightImage : terrain.darkImage}
              srcSet={`${light ? terrain.lightImageSmall : terrain.darkImageSmall} 960w, ${light ? terrain.lightImage : terrain.darkImage} 1920w`}
              sizes="(max-width: 760px) 85vw, 34vw"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            <span className="store-terrain-overlay" aria-hidden="true" />
            <span className="store-terrain-label">{terrain.label}</span>
            <i data-lucide="arrow-right" aria-hidden="true" />
          </button>
        ))}
      </nav>

      <section className="home-edit" aria-labelledby="home-edit-title">
        <header className="home-edit__intro">
          <p className="editorial-kicker">The signature edit</p>
          <h2 id="home-edit-title">Less range. More reason.</h2>
          <p>Three distinct ways to ride, each developed around a clear purpose. Start with intent—not a wall of product cards.</p>
        </header>

        <div className="home-edit__chapters">
          {chapters.map(({ product, line, sequence }, index) => (
            <article key={product.id} className={`home-bike-story${index % 2 ? ' home-bike-story--reverse' : ''}`}>
              <button type="button" className="home-bike-story__visual" onClick={() => onProduct(product.id)} aria-label={`Explore ${product.name}`}>
                <span>{sequence}</span>
                <img
                  src={productImage(product.id, 1600)}
                  srcSet={productImageSrcSet(product.id)}
                  sizes="(max-width: 900px) 100vw, 62vw"
                  alt={`${product.name} bicycle in profile`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
              <div className="home-bike-story__copy">
                <p className="editorial-kicker">{line} · {product.series}</p>
                <h3>{product.name}</h3>
                <p className="home-bike-story__description">{product.desc}</p>
                <dl>
                  <div><dt>Wheel</dt><dd>{product.wheels}</dd></div>
                  <div><dt>Drive</dt><dd>{product.speed}</dd></div>
                  <div><dt>Brakes</dt><dd>{product.brakes}</dd></div>
                </dl>
                <p className="home-bike-story__price">From ₹{product.price.toLocaleString('en-IN')}</p>
                <div className="home-bike-story__actions">
                  <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onProduct(product.id)}>
                    Explore {product.name} <i data-lucide="arrow-right" aria-hidden="true" />
                  </button>
                  <button type="button" className="editorial-text-link" onClick={() => onNav('shop', product.tag)}>
                    See {product.tag} range <i data-lucide="arrow-right" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-bespoke" aria-labelledby="home-bespoke-title">
        <div className="home-bespoke__copy">
          <p className="editorial-kicker">Bespoke ride studio</p>
          <h2 id="home-bespoke-title">One frame. Your spec.</h2>
          <p>Choose the braking, suspension, gearing, and finish around the way you actually ride. Every combination is reviewed before the order is finalised.</p>
          <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('build')}>
            Build your ride <i data-lucide="arrow-right" aria-hidden="true" />
          </button>
        </div>
        <div className="home-bespoke__details" aria-label="Bicycle engineering details">
          <figure>
            <img src="/assets/campaign/build-detail-brakes-ai.webp" alt="Close view of a Finspeed bicycle disc brake" loading="lazy" />
            <figcaption>Stop stronger</figcaption>
          </figure>
          <figure>
            <img src="/assets/campaign/build-detail-suspension-ai.webp" alt="Close view of a Finspeed bicycle front suspension" loading="lazy" />
            <figcaption>Smooth control</figcaption>
          </figure>
          <figure>
            <img src="/assets/campaign/build-detail-drivetrain-ai.webp" alt="Close view of a Finspeed bicycle drivetrain" loading="lazy" />
            <figcaption>Shift precise</figcaption>
          </figure>
        </div>
      </section>

      <section className="home-engineering-story" aria-labelledby="home-engineering-title">
        <div>
          <p className="editorial-kicker">Our engineering</p>
          <h2 id="home-engineering-title">Confidence is designed in.</h2>
          <p>High-tensile frames, controlled braking, and component choices built around real roads and trails.</p>
        </div>
        <button type="button" className="editorial-text-link" onClick={() => onNav('engineering')}>
          See how we build <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

export default Home;
