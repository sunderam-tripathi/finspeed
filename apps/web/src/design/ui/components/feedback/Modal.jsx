import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

/**
 * Finspeed Modal — overlay shell for dialogs and side drawers.
 * `side="right"` turns it into a slide-in drawer (used for cart);
 * default is a centered dialog. Ink scrim + slight blur over content.
 * Presentational: the host owns the `open` flag.
 *
 * Visibility is NOT gated on opacity — the overlay mounts only while open,
 * so it is visible by construction. Only a harmless `transform` animates the
 * entrance; its resting state is already on-screen, so the panel can never
 * get pinned hidden even if the transition does not run.
 */
export function Modal({
  open = false,
  onClose = null,
  title = null,
  eyebrow = null,
  children,
  footer = null,
  side = false,          // false = centered dialog, 'right'/'left' = drawer
  width = 460,
  closeOnScrim = true,
  style = {},
  ...rest
}) {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    if (!open) { setEntered(false); return; }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const drawer = side === 'right' || side === 'left';
  const widthCss = typeof width === 'number' ? width + 'px' : width;

  const panelBase = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    boxShadow: 'var(--shadow-lg)',
    transition: 'transform var(--dur-base) var(--ease-out)',
    willChange: 'transform',
    ...style,
  };

  const panel = drawer
    ? {
        ...panelBase,
        width: 'min(' + widthCss + ', 100%)',
        height: '100%',
        marginLeft: side === 'right' ? 'auto' : 0,
        borderLeft: side === 'right' ? 'var(--border-width) solid var(--border-subtle)' : 'none',
        borderRight: side === 'left' ? 'var(--border-width) solid var(--border-subtle)' : 'none',
        transform: entered ? 'translateX(0)' : 'translateX(' + (side === 'right' ? '101%' : '-101%') + ')',
      }
    : {
        ...panelBase,
        width: 'min(' + widthCss + ', calc(100% - 32px))',
        maxHeight: 'calc(100% - 64px)',
        margin: 'auto',
        borderRadius: 'var(--radius-lg)',
        border: 'var(--border-width) solid var(--border-subtle)',
        transform: entered ? 'translateY(0)' : 'translateY(10px)',
      };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal)',
        display: 'flex',
        alignItems: drawer ? 'stretch' : 'center',
        justifyContent: drawer ? 'flex-start' : 'center',
        background: 'rgba(10,14,18,0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (closeOnScrim && e.target === e.currentTarget && onClose) onClose(); }}
      {...rest}
    >
      <div role="dialog" aria-modal="true" style={panel}>
        {(title || eyebrow || onClose) && (
          <header style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: 'var(--space-4)', padding: 'var(--space-5)',
            borderBottom: 'var(--border-width) solid var(--border-subtle)', flex: 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {eyebrow && (
                <span style={{ font: 'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--brand-ink)' }}>{eyebrow}</span>
              )}
              {title && (
                <h2 style={{ font: 'var(--fw-bold) var(--fs-xl)/1.1 var(--font-display)', letterSpacing: 'var(--tracking-tight)', color: 'var(--text-strong)', margin: 0 }}>{title}</h2>
              )}
            </div>
            {onClose && (
              <IconButton
                variant="ghost"
                aria-label="Close"
                onClick={onClose}
                icon={<i data-lucide="x" style={{ width: 18, height: 18 }}></i>}
                style={{ flex: 'none', marginTop: -4, marginRight: -8 }}
              />
            )}
          </header>
        )}
        <div style={{ padding: 'var(--space-5)', overflowY: 'auto', flex: '1 1 auto' }}>
          {children}
        </div>
        {footer && (
          <footer style={{
            padding: 'var(--space-5)', borderTop: 'var(--border-width) solid var(--border-subtle)',
            display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', flex: 'none',
          }}>{footer}</footer>
        )}
      </div>
    </div>
  );
}
