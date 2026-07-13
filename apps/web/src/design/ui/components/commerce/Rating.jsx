import React from 'react';

/**
 * Finspeed Rating — 5-point star rating with optional count.
 */
export function Rating({ value = 0, count = null, size = 16, style = {}, ...rest }) {
  const full = Math.round(value);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', ...style }} {...rest}>
      <span style={{ display: 'inline-flex', gap: 2 }} aria-label={value + ' out of 5'}>
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < full ? 'var(--brand)' : 'none'} stroke={i < full ? 'var(--brand)' : 'var(--border-strong)'} strokeWidth="2" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </span>
      {count != null && (
        <span style={{ font: 'var(--fw-medium) var(--fs-xs)/1 var(--font-mono)', color: 'var(--text-muted)' }}>
          {value.toFixed(1)} ({count})
        </span>
      )}
    </span>
  );
}
