import React from 'react';

/**
 * Finspeed Toggle — pill switch, brand-cyan track when on.
 * Controlled (`checked`) or uncontrolled (`defaultChecked`).
 */
export function Toggle({
  label,
  hint,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const [focused, setFocused] = React.useState(false);
  const on = isControlled ? checked : internal;
  const tId = id || (label ? 'tg-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const handle = (e) => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return (
    <label htmlFor={tId} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <input
        id={tId} type="checkbox" role="switch" checked={on} onChange={handle} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, margin: 0 }}
        {...rest}
      />
      <span aria-hidden="true" style={{
        flex: 'none', position: 'relative', width: 44, height: 26,
        borderRadius: 'var(--radius-pill)',
        background: on ? 'var(--brand)' : 'var(--steel-300)',
        boxShadow: focused ? '0 0 0 3px var(--cyan-100)' : 'none',
        transition: 'var(--transition-base)',
      }}>
        <span style={{
          position: 'absolute', top: 3, left: 3, width: 20, height: 20,
          borderRadius: 'var(--radius-pill)', background: 'var(--white)',
          boxShadow: 'var(--shadow-xs)',
          transform: on ? 'translateX(18px)' : 'translateX(0)',
          transition: 'var(--transition-base)',
        }} />
      </span>
      {(label || hint) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {label && <span style={{ font: 'var(--fw-medium) var(--fs-sm)/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{label}</span>}
          {hint && <span style={{ font: 'var(--fw-regular) var(--fs-2xs)/1.35 var(--font-body)', color: 'var(--text-muted)' }}>{hint}</span>}
        </span>
      )}
    </label>
  );
}
