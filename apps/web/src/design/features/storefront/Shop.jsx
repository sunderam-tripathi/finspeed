import React from 'react';
import { products, resolveProductImage } from '../../data/storefront.js';

const categories = [
  ['all', 'All bikes'],
  ['mountain', 'Mountain'],
  ['city', 'City'],
  ['hybrid', 'Hybrid'],
];

const categoryCopy = {
  all: ['Find your Finspeed', 'A bike for every kind of ride.', 'From rough trails to weekday streets, start with where you ride and find the Finspeed that fits.'],
  mountain: ['Mountain', 'Made for rough roads and open trails.', 'Strong frames, sure braking and steady grip for rides that leave smooth tarmac behind.'],
  city: ['City', 'Made for daily movement.', 'Simple, comfortable bicycles for commutes, errands and the roads you know best.'],
  hybrid: ['Hybrid', 'Fast when the road opens up.', 'Quick 700C bikes for longer city rides, rough patches and changing pace.'],
};

const featuredByCategory = {
  all: ['mako-shark', 'lightning-marlin', 'red-snapper'],
  mountain: ['mako-shark', 'bull-shark', 'tiger-shark'],
  city: ['red-snapper', 'great-white-shark', 'sea-breeze'],
  hybrid: ['lightning-marlin', 'sunset-marlin'],
};

const terrainLine = {
  mountain: 'Made for the mountains',
  city: 'Made for city life',
  hybrid: 'Ready for more roads',
};

function Shop({ filter, setFilter, onProduct, onNav, theme }) {
  const selectedCategory = categories.some(([key]) => key === filter) ? filter : 'all';
  const copy = categoryCopy[selectedCategory];
  const list = products.filter((product) => selectedCategory === 'all' || product.tag === selectedCategory);
  const featureIds = featuredByCategory[selectedCategory] || featuredByCategory.all;
  const featured = featureIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);

  return (
    <div className="range-page">
      <section className="range-intro" aria-labelledby="range-title">
        <div>
          <p className="editorial-kicker">The Bikes</p>
          <h1 id="range-title">{copy[0]}</h1>
        </div>
        <div className="range-intro__statement">
          <h2>{copy[1]}</h2>
          <p>{copy[2]}</p>
        </div>
      </section>

      <nav className="range-filter" aria-label="Bike collections">
        {categories.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={selectedCategory === key ? 'is-active' : ''}
            aria-current={selectedCategory === key ? 'page' : undefined}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="range-features">
        {featured.map((product, index) => {
          const visual = resolveProductImage(product.id, { theme, role: 'feature', width: 1600 });
          return (
            <article key={product.id} className={`range-feature${index % 2 ? ' range-feature--reverse' : ''}`}>
              <button type="button" className="range-feature__image" onClick={() => onProduct(product.id)} aria-label={`View ${product.name}`}>
                <span className="range-feature__sequence">{String(index + 1).padStart(2, '0')}</span>
                <img
                  src={visual.src}
                  srcSet={visual.srcSet}
                  sizes={visual.sizes}
                  style={{ ...visual.style, transform: visual.transform }}
                  data-product-scale={visual.registration.scale}
                  data-product-baseline={visual.registration.baseline}
                  alt={`${product.name} bicycle`}
                />
              </button>
              <div className="range-feature__copy">
                <p className="editorial-kicker">{terrainLine[product.tag]} · {product.series}</p>
                <h2>{product.name}</h2>
                <p className="range-feature__desc">{product.desc}</p>
                <dl>
                  <div><dt>Wheel</dt><dd>{product.wheels}</dd></div>
                  <div><dt>Gears</dt><dd>{product.speed}</dd></div>
                  <div><dt>Brakes</dt><dd>{product.brakes}</dd></div>
                </dl>
                <p className="range-feature__price">From ₹{product.price.toLocaleString('en-IN')}</p>
                <div className="range-feature__actions">
                  <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onProduct(product.id)}>
                    Explore {product.name} <i data-lucide="arrow-right" aria-hidden="true" />
                  </button>
                  <button type="button" className="editorial-text-link" onClick={() => onNav('build')}>
                    Build your ride <i data-lucide="arrow-right" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="range-index" aria-labelledby="range-index-title">
        <div className="range-index__heading">
          <p className="editorial-kicker">All bikes</p>
          <h2 id="range-index-title">{selectedCategory === 'all' ? 'Every Finspeed frame' : `${copy[0]} models`}</h2>
          <p>{list.length} models to compare by ride, fit and feel.</p>
        </div>
        <div className="range-index__list">
          {list.map((product, index) => (
            <button key={product.id} type="button" onClick={() => onProduct(product.id)}>
              <span className="range-index__number">{String(index + 1).padStart(2, '0')}</span>
              <span className="range-index__name">{product.name}</span>
              <span className="range-index__spec">{product.wheels} · {product.speed}</span>
              <span className="range-index__price">From ₹{product.price.toLocaleString('en-IN')}</span>
              <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="range-build-callout">
        <p className="editorial-kicker">Make it yours</p>
        <h2>Want fewer compromises?</h2>
        <p>Start with the Mako Shark, then choose the brakes, suspension, gears and finish that fit your ride.</p>
        <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('build')}>
          Build your ride <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

export default Shop;
