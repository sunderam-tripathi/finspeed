import React from 'react';
import { Button } from '../../ui/index.js';
import { products, resolveProductImage } from '../../data/storefront.js';

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
  { id: 'mako-shark', line: 'Made for the mountains', sequence: '01' },
  { id: 'red-snapper', line: 'Made for city life', sequence: '02' },
  { id: 'lightning-marlin', line: 'Ready for more roads', sequence: '03' },
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
            <p className="store-trail-eyebrow">Made to go further</p>
            <h1 id="trail-hero-title" className="store-trail-title">Ride<br />Beyond<br />Boundaries</h1>
            <div className="store-trail-rule" aria-hidden="true" />
            <p className="store-trail-description">
              From everyday streets to weekend trails,<br />
              choose a ride that feels ready for more.
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
          <p className="editorial-kicker">Three ways to ride</p>
          <h2 id="home-edit-title">Where will yours take you?</h2>
          <p>Mountain trails, city streets, or a little of both. Find the Finspeed that feels right for you.</p>
        </header>

        <div className="home-edit__chapters">
          {chapters.map(({ product, line, sequence }, index) => {
            const visual = resolveProductImage(product.id, { theme, role: 'feature', width: 1600 });
            return (
              <article key={product.id} className={`home-bike-story${index % 2 ? ' home-bike-story--reverse' : ''}`}>
                <button type="button" className="home-bike-story__visual" onClick={() => onProduct(product.id)} aria-label={`Explore ${product.name}`}>
                  <span>{sequence}</span>
                  <img
                    src={visual.src}
                    srcSet={visual.srcSet}
                    sizes={visual.sizes}
                    style={visual.style}
                    data-product-scale={visual.registration.scale}
                    data-product-baseline={visual.registration.baseline}
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
                  <div><dt>Gears</dt><dd>{product.speed}</dd></div>
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
            );
          })}
        </div>
      </section>

      <section className="home-city-story" aria-labelledby="home-city-story-title">
        <img
          className="home-city-story__image"
          src={light
            ? '/assets/home/red-snapper-everyday-architecture-light-v1.webp'
            : '/assets/home/red-snapper-everyday-architecture-v1.webp'}
          alt="Red Snapper city bicycle parked outside a warm brick-and-stone residence"
          loading="lazy"
          decoding="async"
        />
        <span className="home-city-story__shade" aria-hidden="true" />
        <div className="home-city-story__inner">
          <div className="home-city-story__copy">
            <p className="editorial-kicker">Made for the everyday</p>
            <h2 id="home-city-story-title">Your city. Your pace.</h2>
            <p>Simple, considered bicycles for the roads you return to every day.</p>
            <div className="home-city-story__actions">
              <button type="button" className="editorial-text-link" onClick={() => onProduct('red-snapper')}>
                Find your Finspeed <i data-lucide="arrow-right" aria-hidden="true" />
              </button>
              <button type="button" className="editorial-text-link" onClick={() => onNav('shop', 'city')}>
                Explore city bikes <i data-lucide="arrow-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="home-engineering-story" aria-labelledby="home-engineering-title">
        <div>
          <p className="editorial-kicker">Our engineering</p>
          <h2 id="home-engineering-title">Built to feel right from the first ride.</h2>
          <p>Strong frames, steady braking and practical parts for real roads, rough patches and weekend trails.</p>
        </div>
        <button type="button" className="editorial-text-link" onClick={() => onNav('engineering')}>
          See how we build <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

export default Home;
