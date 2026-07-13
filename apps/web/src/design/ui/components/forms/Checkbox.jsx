import React from 'react';

/**
 * Finspeed Checkbox — custom-styled box with brand-cyan fill + check.
 * Controlled (`checked`) or uncontrolled (`defaultChecked`).
 */
export function Checkbox({
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
  const cbId = id || (label ? 'cb-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const handle = (e) => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return (
    <label htmlFor={cbId} style={{
      display: 'inline-flex', alignItems: 'flex-start', gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <input
        id={cbId} type="checkbox" checked={on} onChange={handle} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, margin: 0 }}
        {...rest}
      />
      <span aria-hidden="true" style={{
        flex: 'none', width: 20, height: 20, marginTop: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: on ? 'var(--brand)' : 'var(--surface-card)',
        border: 'var(--border-width-bold) solid ' + (on ? 'var(--brand)' : 'var(--border-strong)'),
        borderRadius: 'var(--radius-xs)',
        color: 'var(--on-brand)',
        boxShadow: focused ? '0 0 0 3px var(--cyan-100)' : 'none',
        transition: 'var(--transition-base)',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transition: 'var(--transition-base)' }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
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
