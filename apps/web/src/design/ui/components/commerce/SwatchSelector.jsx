import React from 'react';

/**
 * Finspeed SwatchSelector — product variant picker.
 * Color swatches (round chips) or labelled swatches (size / spec), with a
 * selected ring, optional label header, and per-option disabled state.
 *
 * options: { value, color?, label?, disabled? }[]  (string[] also accepted)
 */
export function SwatchSelector({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  type = 'color',
  style = {},
}) {
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? (norm[0] && norm[0].value));
  const selected = isControlled ? value : internal;
  const choose = (val) => {
    if (!isControlled) setInternal(val);
    onChange && onChange(val);
  };
  const selObj = norm.find((o) => o.value === selected);
  return (
    <div style={{ ...style }}>
      {label && (
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 10,
        }}>
          <span style={{ font: 'var(--fw-semibold) var(--fs-xs)/1 var(--font-body)', color: 'var(--text-strong)' }}>{label}</span>
          {type === 'color' && selObj && selObj.label && (
            <span style={{ font: 'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color: 'var(--text-muted)' }}>{selObj.label}</span>
          )}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: type === 'color' ? 10 : 8 }}>
        {norm.map((o) => {
          const on = o.value === selected;
          if (type === 'color') {
            return (
              <button key={o.value} type="button" onClick={() => !o.disabled && choose(o.value)}
                disabled={o.disabled} aria-label={o.label || o.value} aria-pressed={on}
                style={{
                  width: 38, height: 38, borderRadius: 'var(--radius-pill)',
                  background: o.color || o.value, cursor: o.disabled ? 'not-allowed' : 'pointer',
                  border: '2px solid ' + (on ? 'var(--ink-900)' : 'transparent'),
                  outline: '1px solid var(--border-subtle)', outlineOffset: 2,
                  opacity: o.disabled ? 0.35 : 1,
                  transition: 'var(--transition-base)',
                }} />
            );
          }
          return (
            <button key={o.value} type="button" onClick={() => !o.disabled && choose(o.value)}
              disabled={o.disabled} aria-pressed={on}
              style={{
                minWidth: 48, height: 42, padding: '0 14px',
                font: 'var(--fw-semibold) var(--fs-sm)/1 var(--font-mono)',
                color: o.disabled ? 'var(--text-faint)' : on ? 'var(--on-brand)' : 'var(--text-strong)',
                background: on ? 'var(--brand)' : 'var(--surface-card)',
                border: 'var(--border-width-bold) solid ' + (on ? 'var(--brand)' : 'var(--border-strong)'),
                borderRadius: 'var(--radius-sm)',
                cursor: o.disabled ? 'not-allowed' : 'pointer',
                position: 'relative', overflow: 'hidden',
                opacity: o.disabled ? 0.5 : 1,
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={(e) => { if (!on && !o.disabled) e.currentTarget.style.borderColor = 'var(--ink-900)'; }}
              onMouseLeave={(e) => { if (!on && !o.disabled) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            >
              {o.label || o.value}
              {o.disabled && (
                <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, transparent calc(50% - 1px), var(--border-strong), transparent calc(50% + 1px))' }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
