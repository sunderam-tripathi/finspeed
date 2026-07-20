import React from 'react';

/**
 * Finspeed QuantityStepper — − / value / + control for cart quantities.
 */
export function QuantityStepper({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  label = 'item',
  style = {},
  ...rest
}) {
  const set = (next) => {
    const v = Math.max(min, Math.min(max, next));
    onChange?.(v);
  };
  const btn = {
    width: 40, height: 44,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: 'none', cursor: 'pointer',
    font: 'var(--fw-bold) var(--fs-lg)/1 var(--font-display)',
    color: 'var(--text-strong)', transition: 'var(--transition-base)',
  };
  return (
    <div
      role="group"
      aria-label={`${label} quantity`}
      style={{
        display: 'inline-flex', alignItems: 'center',
        border: 'var(--border-width) solid var(--border-strong)',
        borderRadius: 'var(--radius-sm)', overflow: 'hidden',
        background: 'var(--surface-card)', ...style,
      }}
      {...rest}
    >
      <button type="button" aria-label={`Decrease ${label} quantity`} style={{ ...btn, opacity: value <= min ? 0.35 : 1 }}
        onClick={() => set(value - 1)} disabled={value <= min}
        onMouseEnter={(e) => { if (value > min) e.currentTarget.style.color = 'var(--brand-strong)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}>−</button>
      <span style={{
        minWidth: 40, textAlign: 'center',
        font: 'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)',
        color: 'var(--text-strong)',
        borderLeft: 'var(--border-width) solid var(--border-subtle)',
        borderRight: 'var(--border-width) solid var(--border-subtle)',
        padding: '0 8px', height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }} role="status" aria-live="polite" aria-atomic="true" aria-label={`${label} quantity ${value}`}>{value}</span>
      <button type="button" aria-label={`Increase ${label} quantity`} style={{ ...btn, opacity: value >= max ? 0.35 : 1 }}
        onClick={() => set(value + 1)} disabled={value >= max}
        onMouseEnter={(e) => { if (value < max) e.currentTarget.style.color = 'var(--brand-strong)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}>+</button>
    </div>
  );
}
