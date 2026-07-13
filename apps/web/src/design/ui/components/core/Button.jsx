import React from 'react';

/**
 * Finspeed Button — the primary action control.
 * Variants: primary (cyan), dark (ink), outline, ghost. Optional beveled corner.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  bevel = false,
  iconLeft = null,
  iconRight = null,
  full = false,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '0 14px', height: 36, font: 'var(--fs-xs)' },
    md: { padding: '0 22px', height: 46, font: 'var(--fs-sm)' },
    lg: { padding: '0 30px', height: 56, font: 'var(--fs-md)' },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    height: s.height,
    padding: s.padding,
    width: full ? '100%' : 'auto',
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--fw-semibold)',
    fontSize: s.font,
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase',
    border: 'var(--border-width-bold) solid transparent',
    borderRadius: bevel ? 0 : 'var(--radius-sm)',
    clipPath: bevel ? 'var(--clip-bevel)' : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'var(--transition-base)',
    whiteSpace: 'nowrap',
  };

  const variants = {
    primary: { background: 'var(--brand)', color: 'var(--on-brand)', borderColor: 'var(--brand)' },
    dark:    { background: 'var(--ink-900)', color: 'var(--white)', borderColor: 'var(--ink-900)' },
    outline: { background: 'transparent', color: 'var(--text-strong)', borderColor: 'var(--border-strong)' },
    ghost:   { background: 'transparent', color: 'var(--text-strong)', borderColor: 'transparent' },
  };

  return (
    <button
      type="button"
      disabled={disabled}
      style={{ ...base, ...(variants[variant] || variants.primary), ...style }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.background = 'var(--brand-strong)';
        else if (variant === 'dark') e.currentTarget.style.background = 'var(--ink-700)';
        else if (variant === 'outline') { e.currentTarget.style.borderColor = 'var(--ink-900)'; e.currentTarget.style.background = 'var(--surface-sunken)'; }
        else e.currentTarget.style.background = 'var(--surface-sunken)';
      }}
      onMouseLeave={(e) => {
        const v = variants[variant] || variants.primary;
        e.currentTarget.style.background = v.background;
        e.currentTarget.style.borderColor = v.borderColor;
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
