import React from 'react';
import { Badge } from '../core/Badge.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { PriceTag } from './PriceTag.jsx';
import { Rating } from './Rating.jsx';

/**
 * Finspeed ProductCard — storefront tile for a single cycle.
 * Composes Badge, Rating, PriceTag. Hover lifts the card and reveals the cart action.
 */
export function ProductCard({
  name,
  series,
  image,
  price,
  mrp = null,
  rating = null,
  ratingCount = null,
  badge = null,
  badgeTone = 'brand',
  soldOut = false,
  onAdd,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-card)',
        border: 'var(--border-width) solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--transition-base)',
        transform: hover ? 'translateY(-4px)' : 'none',
        boxShadow: hover ? 'var(--shadow-product)' : 'var(--shadow-sm)',
        ...style,
      }}
      {...rest}
    >
      {/* Image well */}
      <div style={{
        position: 'relative',
        aspectRatio: '4 / 3',
        background: 'linear-gradient(180deg, var(--white), var(--steel-50))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-4)',
      }}>
        {badge && (
          <span style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
            <Badge tone={badgeTone} solid>{badge}</Badge>
          </span>
        )}
        <span style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, opacity: hover ? 1 : 0, transform: hover ? 'none' : 'translateY(-4px)', transition: 'var(--transition-base)' }}>
          <IconButton variant="outline" size="sm" aria-label="Add to wishlist" icon={<i data-lucide="heart" style={{ width: 16, height: 16 }}></i>} style={{ background: 'var(--surface-card)' }} />
        </span>
        <img src={image} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply', opacity: soldOut ? 0.5 : 1, filter: soldOut ? 'grayscale(0.45)' : 'none', transition: 'var(--transition-base)', transform: hover && !soldOut ? 'scale(1.04)' : 'none' }} />
        {soldOut && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <span style={{ font: 'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--text-strong)', background: 'var(--surface-card)', border: 'var(--border-width) solid var(--border-strong)', padding: '7px 14px', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-sm)' }}>Sold out</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {series && <span className="fin-eyebrow" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-3xs)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--brand-ink)' }}>{series}</span>}
          <h3 style={{ font: 'var(--fw-bold) var(--fs-xl)/1.05 var(--font-display)', color: 'var(--text-strong)', letterSpacing: 'var(--tracking-tight)', margin: 0 }}>{name}</h3>
        </div>
        {rating != null && <Rating value={rating} count={ratingCount} size={14} />}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
          <PriceTag price={price} mrp={mrp} size="md" />
          {soldOut ? (
            <span style={{ font: 'var(--fw-semibold) var(--fs-2xs)/1 var(--font-mono)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Sold out</span>
          ) : (
            <IconButton
              variant="primary"
              aria-label={'Add ' + name + ' to cart'}
              onClick={(e) => { e.stopPropagation(); onAdd && onAdd(); }}
              icon={<i data-lucide="shopping-cart" style={{ width: 18, height: 18 }}></i>}
              style={{ background: 'var(--brand)', color: 'var(--on-brand)', flex: 'none' }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
