import React from 'react';

/**
 * Finspeed IconButton — square/round control wrapping a single icon node.
 * Variants: solid (cyan), ink, ghost, outline. Optional badge count (e.g. cart).
 */
export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  round = false,
  count = null,
  'aria-label': ariaLabel,
  style = {},
  ...rest
}) {
  const dims = { sm: 36, md: 44, lg: 52 }[size] || 44;
  const variants = {
    solid:   { background: 'var(--brand)', color: 'var(--on-brand)', border: 'transparent' },
    ink:     { background: 'var(--ink-900)', color: 'var(--white)', border: 'transparent' },
    outline: { background: 'transparent', color: 'var(--text-strong)', border: 'var(--border-strong)' },
    ghost:   { background: 'transparent', color: 'var(--text-strong)', border: 'transparent' },
  };
  const v = variants[variant] || variants.ghost;
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dims,
        height: dims,
        background: v.background,
        color: v.color,
        border: 'var(--border-width) solid ' + v.border,
        borderRadius: round ? '50%' : 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'var(--transition-base)',
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = variant === 'ghost' || variant === 'outline' ? 'var(--surface-sunken)' : (variant === 'solid' ? 'var(--brand-strong)' : 'var(--ink-700)'); }}
      onMouseLeave={(e) => { e.currentTarget.style.background = v.background; }}
      {...rest}
    >
      {icon}
      {count != null && (
        <span style={{
          position: 'absolute', top: -6, right: -6,
          minWidth: 18, height: 18, padding: '0 5px',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--brand)', color: 'var(--on-brand)',
          font: 'var(--fw-bold) var(--fs-3xs)/1 var(--font-mono)',
          borderRadius: 'var(--radius-pill)',
          border: '2px solid var(--surface-card)',
        }}>{count}</span>
      )}
    </button>
  );
}
