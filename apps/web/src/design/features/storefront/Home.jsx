// Finspeed storefront — Home
import React from 'react';
import { Button, ProductCard } from '../../ui/index.js';
import { productImage, products } from '../../data/storefront.js';

function Home({ onNav, onAdd, onProduct }) {
  const featured = ['bull-shark', 'mako-shark', 'tiger-shark', 'sunset-marlin']
    .map((id) => products.find((product) => product.id === id));
  const mako = products.find((product) => product.id === 'mako-shark');
  const specifications = [
    { value: '27.5”', label: 'Wheels', icon: 'circle-dot' },
    { value: '21', label: 'Speed', icon: 'gauge' },
    { value: 'Disc', label: 'Brakes', icon: 'disc' },
    { value: 'All-terrain', label: 'Rubber', icon: 'compass' },
  ];
  const terrains = [
    { label: 'Mountain', filter: 'mountain', image: '/assets/campaign/trail-command-hero.webp' },
    { label: 'City', filter: 'city', image: '/assets/campaign/terrain-city.webp' },
    { label: 'Hybrid', filter: 'hybrid', image: '/assets/campaign/terrain-hybrid.webp' },
  ];

  return (
    <div className="store-home fin-dark">
      <section className="store-trail-hero" aria-labelledby="trail-hero-title">
        <img
          className="store-trail-background"
          src="/assets/campaign/trail-command-hero.webp"
          alt=""
          aria-hidden="true"
        />
        <div className="store-trail-shade" aria-hidden="true" />

        <div className="store-trail-layout">
          <div className="store-trail-copy">
            <p className="store-trail-eyebrow">Engineered for exploration</p>
            <h1 id="trail-hero-title" className="store-trail-title">
              Ride<br />Beyond<br />Boundaries
            </h1>
            <div className="store-trail-rule" aria-hidden="true" />
            <p className="store-trail-description">
              High-tensile frames, disc-brake confidence and broad all-terrain rubber.
              The fleet that turns the commute into an expedition.
            </p>

            <div className="store-trail-commerce">
              <Button
                variant="primary"
                size="lg"
                bevel
                onClick={() => onNav('shop')}
                iconRight={<i data-lucide="arrow-right" style={{ width: 20, height: 20 }} />}
                style={{ minWidth: 312, height: 82, fontSize: 'var(--fs-lg)' }}
              >
                Shop the fleet
              </Button>

              <button
                type="button"
                className="store-trail-product-summary"
                onClick={() => onProduct('mako-shark')}
                aria-label="View Mako Shark details"
              >
                <span className="store-trail-product-name">{mako.name}</span>
                <span className="store-trail-product-price">₹{mako.price.toLocaleString('en-IN')}</span>
                <span className="store-trail-product-spec">{mako.wheels} {mako.speed} MTB</span>
              </button>
            </div>
          </div>

          <div className="store-trail-product" aria-label="Featured bicycle">
            <img
              className="store-trail-bike"
              src="/assets/products/cutouts/mako-shark.png"
              alt="Mint-green Mako Shark mountain bicycle"
            />
          </div>

          <aside className="store-trail-specs" aria-label="Mako Shark key specifications">
            {specifications.map((spec) => (
              <div className="store-trail-spec" key={spec.label}>
                <strong>{spec.value}</strong>
                <span>{spec.label}</span>
                <i data-lucide={spec.icon} aria-hidden="true" />
              </div>
            ))}
          </aside>
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
            <img src={terrain.image} alt="" aria-hidden="true" />
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
