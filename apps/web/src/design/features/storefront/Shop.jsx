import React from 'react';
import { productImage, productImageSrcSet, products } from '../../data/storefront.js';

const categories = [
  ['all', 'All bikes'],
  ['mountain', 'Mountain'],
  ['city', 'City'],
  ['hybrid', 'Hybrid'],
];

const categoryCopy = {
  all: ['The Signature Range', 'Eleven purposeful bikes. No filler.', 'Choose by the way you ride, then make the details your own.'],
  mountain: ['Mountain', 'Built for the long way round.', 'Confident geometry, durable frames, and the control to leave the road behind.'],
  city: ['City', 'For movement that feels effortless.', 'Simple, assured bicycles designed for everyday streets and familiar routes.'],
  hybrid: ['Hybrid', 'Road pace. All-day freedom.', 'Fast-rolling 700C platforms that stay composed when the surface changes.'],
};

const featuredByCategory = {
  all: ['mako-shark', 'lightning-marlin', 'red-snapper'],
  mountain: ['mako-shark', 'bull-shark', 'tiger-shark'],
  city: ['red-snapper', 'great-white-shark', 'sea-breeze'],
  hybrid: ['lightning-marlin', 'sunset-marlin'],
};

const terrainLine = {
  mountain: 'Trail authority',
  city: 'Everyday clarity',
  hybrid: 'Versatile speed',
};

function Shop({ filter, setFilter, onProduct, onNav }) {
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
        {featured.map((product, index) => (
          <article key={product.id} className={`range-feature${index % 2 ? ' range-feature--reverse' : ''}`}>
            <button type="button" className="range-feature__image" onClick={() => onProduct(product.id)} aria-label={`View ${product.name}`}>
              <span className="range-feature__sequence">{String(index + 1).padStart(2, '0')}</span>
              <img
                src={productImage(product.id, 1600)}
                srcSet={productImageSrcSet(product.id)}
                sizes="(max-width: 900px) 100vw, 65vw"
                alt={`${product.name} bicycle`}
              />
            </button>
            <div className="range-feature__copy">
              <p className="editorial-kicker">{terrainLine[product.tag]} · {product.series}</p>
              <h2>{product.name}</h2>
              <p className="range-feature__desc">{product.desc}</p>
              <dl>
                <div><dt>Wheel</dt><dd>{product.wheels}</dd></div>
                <div><dt>Drive</dt><dd>{product.speed}</dd></div>
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
        ))}
      </div>

      <section className="range-index" aria-labelledby="range-index-title">
        <div className="range-index__heading">
          <p className="editorial-kicker">The complete edit</p>
          <h2 id="range-index-title">{selectedCategory === 'all' ? 'Every Finspeed frame' : `${copy[0]} models`}</h2>
          <p>{list.length} models, each with a clear purpose.</p>
        </div>
        <div className="range-index__list">
          {list.map((product, index) => (
            <button key={product.id} type="button" onClick={() => onProduct(product.id)}>
              <span className="range-index__number">{String(index + 1).padStart(2, '0')}</span>
              <span className="range-index__name">{product.name}</span>
              <span className="range-index__spec">{product.wheels} · {product.speed}</span>
              <span className="range-index__price">₹{product.price.toLocaleString('en-IN')}</span>
              <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="range-build-callout">
        <p className="editorial-kicker">One frame. Your spec.</p>
        <h2>Want fewer compromises?</h2>
        <p>Start with the Mako Shark, then choose the braking, suspension, gearing, and finish that fit your ride.</p>
        <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('build')}>
          Build your ride <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

export default Shop;
