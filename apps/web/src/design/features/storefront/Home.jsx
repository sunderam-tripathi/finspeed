// Finspeed storefront — Home
import React from 'react';
import { Button, ProductCard } from '../../ui/index.js';
import { productImage, products } from '../../data/storefront.js';

function Home({ onNav, onAdd, onProduct }) {
  const featured = ['bull-shark', 'mako-shark', 'tiger-shark', 'sunset-marlin']
    .map((id) => products.find((product) => product.id === id));
  const terrains = [
    {
      label: 'Mountain',
      filter: 'mountain',
      darkImage: '/assets/campaign/trail-command-hero.webp',
      lightImage: '/assets/campaign/light-terrain-mountain.webp',
    },
    {
      label: 'City',
      filter: 'city',
      darkImage: '/assets/campaign/terrain-city.webp',
      lightImage: '/assets/campaign/light-terrain-city.webp',
    },
    {
      label: 'Hybrid',
      filter: 'hybrid',
      darkImage: '/assets/campaign/terrain-hybrid.webp',
      lightImage: '/assets/campaign/light-terrain-hybrid.webp',
    },
  ];

  return (
    <div className="store-home">
      <section className="store-trail-hero" aria-labelledby="trail-hero-title">
        <picture className="store-trail-background store-theme-dark-only">
          <source media="(max-width: 600px)" srcSet="/assets/campaign/quiet-summit-hero-mobile.webp" />
          <img src="/assets/campaign/quiet-summit-hero.webp" alt="" />
        </picture>
        <picture className="store-trail-background store-theme-light-only">
          <source media="(max-width: 600px)" srcSet="/assets/campaign/light-summit-hero-mobile.webp" />
          <img src="/assets/campaign/light-summit-hero.webp" alt="" />
        </picture>
        <div className="store-trail-shade" aria-hidden="true" />

        <div className="store-trail-layout">
          <div className="store-trail-copy">
            <p className="store-trail-eyebrow">Engineered for exploration</p>
            <h1 id="trail-hero-title" className="store-trail-title">
              Ride<br />Beyond<br />Boundaries
            </h1>
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
          <button
            type="button"
            className="store-terrain-link"
            key={terrain.filter}
            onClick={() => onNav('shop', terrain.filter)}
          >
            <img className="store-theme-dark-only" src={terrain.darkImage} alt="" aria-hidden="true" />
            <img className="store-theme-light-only" src={terrain.lightImage} alt="" aria-hidden="true" />
            <span className="store-terrain-overlay" aria-hidden="true" />
            <span className="store-terrain-label">{terrain.label}</span>
            <i data-lucide="arrow-right" aria-hidden="true" />
          </button>
        ))}
      </nav>

      <section className="store-home-lineup store-content-section">
        <div className="store-section-heading-row">
          <div>
            <span className="fin-eyebrow">The lineup</span>
            <h2>Built for every boundary</h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => onNav('shop')}
            iconRight={<i data-lucide="arrow-right" style={{ width: 16, height: 16 }} />}
          >
            View all
          </Button>
        </div>
        <div className="store-featured-grid">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              series={product.series}
              image={productImage(product.id)}
              price={product.price}
              mrp={product.mrp}
              rating={product.rating}
              ratingCount={product.reviews}
              badge={product.badge}
              badgeTone={product.badge === 'New' ? 'success' : 'brand'}
              soldOut={product.stock === 0}
              onAdd={() => onAdd(product.id)}
              onClick={() => onProduct(product.id)}
            />
          ))}
        </div>
      </section>

      <section className="store-home-engineering">
        <div className="store-feature-grid">
          {[
            ['shield-check', 'High-tensile frames', 'Aerospace-grade steel built to take the hit and keep rolling.'],
            ['disc', 'Disc-brake confidence', 'Stop hard and sure — in the wet, on the descent, every time.'],
            ['truck', 'Assembled & delivered', '85% pre-assembled and shipped across India. Ride within the hour.'],
          ].map(([icon, title, body]) => (
            <div className="store-engineering-item" key={title}>
              <span className="store-engineering-icon"><i data-lucide={icon} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
