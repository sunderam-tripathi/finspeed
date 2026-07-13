import React from 'react';

/**
 * Finspeed Table — technical data table for price lists & spec sheets.
 * Hairline rows, mono uppercase header, optional zebra striping.
 *
 * columns: { key, label, align?, width?, mono?, render? }[]
 * data:    Record<string, any>[]
 */
export function Table({
  columns = [],
  data = [],
  dense = false,
  striped = false,
  getRowKey,
  style = {},
  ...rest
}) {
  const padY = dense ? 'var(--space-2)' : 'var(--space-3)';
  const padX = 'var(--space-4)';
  const cell = (align) => ({
    padding: `${padY} ${padX}`,
    textAlign: align || 'left',
    verticalAlign: 'middle',
  });
  return (
    <div style={{
      border: 'var(--border-width) solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--surface-card)',
      ...style,
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', font: 'var(--fw-regular) var(--fs-sm)/1.4 var(--font-body)' }} {...rest}>
        <thead>
          <tr style={{ background: 'var(--surface-sunken)', borderBottom: 'var(--border-width-bold) solid var(--border-ink)' }}>
            {columns.map((c) => (
              <th key={c.key} style={{
                ...cell(c.align),
                width: c.width,
                font: 'var(--fw-semibold) var(--fs-2xs)/1 var(--font-mono)',
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={getRowKey ? getRowKey(row, i) : i} style={{
              borderBottom: i === data.length - 1 ? 'none' : 'var(--border-width) solid var(--border-subtle)',
              background: striped && i % 2 === 1 ? 'var(--surface-sunken)' : 'transparent',
            }}>
              {columns.map((c) => (
                <td key={c.key} style={{
                  ...cell(c.align),
                  color: 'var(--text-body)',
                  fontFamily: c.mono ? 'var(--font-mono)' : 'var(--font-body)',
                  fontVariantNumeric: c.mono ? 'tabular-nums' : 'normal',
                }}>
                  {c.render ? c.render(row[c.key], row, i) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
