import React from 'react';

/**
 * Finspeed PriceTag — currency figure in the technical mono face.
 * Shows ₹ price, optional struck MRP and a discount badge.
 */
export function PriceTag({ price, mrp = null, size = 'md', currency = '₹', style = {}, ...rest }) {
  const sizes = { sm: 'var(--fs-md)', md: 'var(--fs-xl)', lg: 'var(--fs-3xl)' };
  const fs = sizes[size] || sizes.md;
  const off = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const fmt = (n) => n.toLocaleString('en-IN');
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap', ...style }} {...rest}>
      <span style={{
        font: 'var(--fw-bold) ' + fs + '/1 var(--font-mono)',
        color: 'var(--price-accent)',
        letterSpacing: '-0.01em',
      }}>{currency}{fmt(price)}</span>
      {mrp && mrp > price && (
        <span style={{ font: 'var(--fw-regular) var(--fs-sm)/1 var(--font-mono)', color: 'var(--text-faint)', textDecoration: 'line-through' }}>
          {currency}{fmt(mrp)}
        </span>
      )}
      {off > 0 && (
        <span style={{
          font: 'var(--fw-bold) var(--fs-3xs)/1 var(--font-mono)',
          color: 'var(--success)', background: 'var(--success-bg)',
          padding: '3px 7px', borderRadius: 'var(--radius-xs)', letterSpacing: 'var(--tracking-wide)',
        }}>−{off}%</span>
      )}
    </div>
  );
}
