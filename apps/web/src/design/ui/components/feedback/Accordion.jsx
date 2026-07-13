import React from 'react';

/**
 * Finspeed Accordion — collapsible sections, ideal for PDP spec groups & FAQs.
 * Steel hairline dividers; mono-or-display headers; chevron rotates on open.
 * Self-managed open state (uncontrolled), single or multiple expansion.
 */
export function Accordion({
  items = [],
  multiple = false,
  defaultOpen = null,    // index | array of indices
  style = {},
  ...rest
}) {
  const init = () => {
    if (defaultOpen == null) return multiple ? [] : -1;
    if (multiple) return Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen];
    return Array.isArray(defaultOpen) ? (defaultOpen[0] ?? -1) : defaultOpen;
  };
  const [open, setOpen] = React.useState(init);

  const isOpen = (i) => (multiple ? open.includes(i) : open === i);
  const toggle = (i) => {
    if (multiple) setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
    else setOpen((o) => (o === i ? -1 : i));
  };

  return (
    <div
      style={{
        borderTop: 'var(--border-width) solid var(--border-subtle)',
        ...style,
      }}
      {...rest}
    >
      {items.map((item, i) => {
        const expanded = isOpen(i);
        return (
          <div key={i} style={{ borderBottom: 'var(--border-width) solid var(--border-subtle)' }}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => toggle(i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                padding: 'var(--space-4) var(--space-1)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--text-strong)',
                font: 'var(--fw-semibold) var(--fs-md)/1.2 var(--font-display)',
                letterSpacing: 'var(--tracking-tight)',
                transition: 'color var(--dur-fast) var(--ease-out)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-ink)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                {item.icon && <span style={{ display: 'inline-flex', color: 'var(--brand-ink)' }}>{item.icon}</span>}
                {item.title}
              </span>
              <i
                data-lucide="chevron-down"
                style={{
                  width: 18, height: 18, flex: 'none', color: 'var(--text-muted)',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform var(--dur-base) var(--ease-out)',
                }}
              ></i>
            </button>
            <div
              style={{
                display: 'grid',
                gridTemplateRows: expanded ? '1fr' : '0fr',
                transition: 'grid-template-rows var(--dur-base) var(--ease-out)',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  padding: expanded ? '0 var(--space-1) var(--space-5)' : '0 var(--space-1)',
                  font: 'var(--text-body-md)',
                  color: 'var(--text-body)',
                }}>
                  {item.content || item.children}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
