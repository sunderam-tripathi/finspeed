import React from 'react';

/**
 * Finspeed Badge — compact status/label pill.
 * Tones: brand (cyan), ink, success, warning, danger, neutral. Optional dot.
 */
export function Badge({ children, tone = 'brand', solid = false, dot = false, style = {}, ...rest }) {
  const tones = {
    brand:   { fg: 'var(--brand-ink)', bg: 'var(--cyan-50)', solidBg: 'var(--brand)', solidFg: 'var(--on-brand)', dot: 'var(--brand)' },
    ink:     { fg: 'var(--white)', bg: 'var(--ink-900)', solidBg: 'var(--ink-900)', solidFg: 'var(--white)', dot: 'var(--cyan-electric)' },
    success: { fg: 'var(--success)', bg: 'var(--success-bg)', solidBg: 'var(--success)', solidFg: 'var(--white)', dot: 'var(--success)' },
    warning: { fg: '#9a5d10', bg: 'var(--warning-bg)', solidBg: 'var(--warning)', solidFg: 'var(--white)', dot: 'var(--warning)' },
    danger:  { fg: 'var(--danger)', bg: 'var(--danger-bg)', solidBg: 'var(--danger)', solidFg: 'var(--white)', dot: 'var(--danger)' },
    neutral: { fg: 'var(--text-muted)', bg: 'var(--surface-sunken)', solidBg: 'var(--steel-600)', solidFg: 'var(--white)', dot: 'var(--steel-500)' },
  };
  const t = tones[tone] || tones.brand;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: '4px 10px',
        font: 'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)',
        letterSpacing: 'var(--tracking-wider)',
        textTransform: 'uppercase',
        borderRadius: 'var(--radius-sm)',
        color: solid ? t.solidFg : t.fg,
        background: solid ? t.solidBg : t.bg,
        ...style,
      }}
      {...rest}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: solid ? 'currentColor' : t.dot }} />}
      {children}
    </span>
  );
}
