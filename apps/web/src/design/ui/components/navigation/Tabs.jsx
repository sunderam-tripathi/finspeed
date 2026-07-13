import React from 'react';

/**
 * Finspeed Tabs — underlined tab strip with sliding cyan indicator.
 * tabs: { value, label, icon? }[]  (string[] also accepted)
 */
export function Tabs({ tabs = [], value, defaultValue, onChange, style = {} }) {
  const norm = tabs.map((t) => (typeof t === 'string' ? { value: t, label: t } : t));
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? (norm[0] && norm[0].value));
  const active = isControlled ? value : internal;
  const choose = (val) => {
    if (!isControlled) setInternal(val);
    onChange && onChange(val);
  };
  return (
    <div role="tablist" style={{
      display: 'flex', gap: 'var(--space-6)',
      borderBottom: 'var(--border-width) solid var(--border-subtle)',
      ...style,
    }}>
      {norm.map((t) => {
        const on = t.value === active;
        return (
          <button key={t.value} type="button" role="tab" aria-selected={on}
            onClick={() => choose(t.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: '0 0 12px', marginBottom: -1, background: 'transparent',
              border: 'none', cursor: 'pointer',
              font: 'var(--fw-semibold) var(--fs-sm)/1 var(--font-body)',
              color: on ? 'var(--text-strong)' : 'var(--text-muted)',
              borderBottom: 'var(--border-width-bold) solid ' + (on ? 'var(--brand)' : 'transparent'),
              transition: 'color var(--dur-fast) var(--ease-out)',
            }}
            onMouseEnter={(e) => { if (!on) e.currentTarget.style.color = 'var(--text-strong)'; }}
            onMouseLeave={(e) => { if (!on) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
