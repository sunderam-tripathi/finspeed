import React from 'react';
import { products, resolveProductImage } from '../../data/storefront.js';

function normalizeSearch(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/["″”]/g, ' inch ')
    .replace(/[^a-z0-9.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function Search({ query, setQuery, onProduct, onNav, theme }) {
  const inputRef = React.useRef(null);
  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const q = normalizeSearch(query);
  const results = q
    ? products.filter((product) => normalizeSearch([
      product.name,
      product.series,
      product.sub,
      product.tag,
      product.desc,
      product.category,
      product.wheels,
      product.speed,
      product.brakes,
    ].join(' ')).includes(q))
    : [];
  const suggestions = ['Mako Shark', 'Mountain', 'Hybrid', '29 inch', 'City'];

  return (
    <article className="editorial-search-page">
      <header className="editorial-search-hero">
        <p className="editorial-kicker">Find your Finspeed</p>
        <h1>Search the bikes.</h1>
        <p>Search by bike, terrain, wheel size or where you plan to ride.</p>
      </header>

      <section className="editorial-search-workspace" aria-label="Search Finspeed bicycles">
        <div className="editorial-search-input">
          <i data-lucide="search" aria-hidden="true" />
          <label className="sr-only" htmlFor="editorial-bike-search">Search bicycles</label>
          <input
            id="editorial-bike-search"
            ref={inputRef}
            type="search"
            value={query || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Model, terrain, wheel size..."
            autoComplete="off"
            aria-controls="editorial-search-results"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><i data-lucide="x" aria-hidden="true" /></button>
          ) : null}
        </div>

        {!q ? (
          <div className="editorial-search-suggestions">
            <p>Suggested</p>
            <div>{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setQuery(suggestion)}>{suggestion}</button>)}</div>
          </div>
        ) : (
          <div className="editorial-search-results" id="editorial-search-results">
            <header role="status" aria-live="polite" aria-atomic="true">
              <p><strong>{results.length}</strong> {results.length === 1 ? 'result' : 'results'}</p>
              <span>“{query}”</span>
            </header>

            {results.length ? (
              <div className="editorial-search-list">
                {results.map((product, index) => {
                  const visual = resolveProductImage(product.id, { theme, role: 'search', width: 480 });
                  return (
                    <button type="button" key={product.id} onClick={() => onProduct(product.id)}>
                      <span className="editorial-search-list__number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="editorial-search-list__image">
                        <img
                          src={visual.src}
                          srcSet={visual.srcSet}
                          sizes={visual.sizes}
                          style={visual.style}
                          data-product-scale={visual.registration.scale}
                          data-product-baseline={visual.registration.baseline}
                          alt=""
                        />
                      </span>
                      <span className="editorial-search-list__name"><small>{product.series}</small><strong>{product.name}</strong></span>
                      <span className="editorial-search-list__spec">{product.wheels} · {product.speed} · {product.brakes}</span>
                      <span className="editorial-search-list__price">From ₹{product.price.toLocaleString('en-IN')}</span>
                      <i data-lucide="arrow-right" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="editorial-search-empty" role="status">
                <p className="editorial-kicker">No exact match</p>
                <h2>Try the ride, not the product name.</h2>
                <p>Try words like mountain, city, hybrid, 29 inch or geared.</p>
                <button type="button" className="editorial-cta editorial-cta--primary" onClick={() => onNav('shop')}>See all bikes <i data-lucide="arrow-right" aria-hidden="true" /></button>
              </div>
            )}
          </div>
        )}
      </section>
    </article>
  );
}

export default Search;
