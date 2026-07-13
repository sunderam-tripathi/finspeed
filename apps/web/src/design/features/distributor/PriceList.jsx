// Finspeed Distributor Portal — Price list (consolidated pricing matrix)
import React from 'react';
import { Tag, QuantityStepper, Button, Badge } from '../../ui/index.js';
import { distributorProductImage, distributorProducts, formatInr } from '../../data/distributor.js';

function StockTag({ s }) {
  if (s==='in') return <Badge tone="success" dot>In stock</Badge>;
  if (s==='low') return <Badge tone="warning" dot>Low</Badge>;
  return <Badge tone="danger" dot>Out</Badge>;
}

function PriceList({ query, order, onAdd, onNav }) {
  const D = distributorProducts, INR = formatInr;
  const [series, setSeries] = React.useState('All');
  const allSeries = ['All', ...Array.from(new Set(D.map(r=>r.series)))];
  const rows = D.filter(r =>
    (series==='All' || r.series===series) &&
    (!query || (r.model+' '+r.variant).toLowerCase().includes(query.toLowerCase()))
  );
  const orderUnits = Object.values(order).reduce((a,b)=>a+b,0);

  return (
    <div className="dist-page dist-price-list" style={{ padding:'24px 32px', display:'flex', flexDirection:'column', gap:18 }}>
      <div className="dist-price-toolbar" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {allSeries.map(s=>(<Tag key={s} selected={series===s} onClick={()=>setSeries(s)}>{s}</Tag>))}
        </div>
        {orderUnits>0 && (
          <Button className="dist-review-order" variant="primary" onClick={()=>onNav('orders')} iconRight={<i data-lucide="arrow-right" style={{width:16,height:16}}></i>}>
            Review order · {orderUnits} units
          </Button>
        )}
      </div>

      <div className="dist-scroll-frame" style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', overflowX:'auto' }}>
        <table style={{ width:'100%', minWidth:880, borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ font:'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-faint)', background:'var(--surface-sunken)' }}>
              <th style={{ textAlign:'left', padding:'14px 22px' }}>Model</th>
              <th style={{ textAlign:'left', padding:'14px 8px' }}>Variant</th>
              <th style={{ textAlign:'left', padding:'14px 8px' }}>Stock</th>
              <th style={{ textAlign:'right', padding:'14px 8px' }}>Retail (MRP)</th>
              <th style={{ textAlign:'right', padding:'14px 8px' }}>Distributor price</th>
              <th style={{ textAlign:'right', padding:'14px 8px' }}>Margin</th>
              <th style={{ textAlign:'right', padding:'14px 22px', width:160 }}>Order qty</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>{
              const key = r.id+'-'+r.variant;
              const qty = order[key]||0;
              return (
                <tr key={i} style={{ borderTop:'1px solid var(--border-subtle)', background: qty>0?'var(--cyan-50)':'transparent', transition:'var(--transition-base)' }}>
                  <td style={{ padding:'12px 22px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:54, height:42, flex:'none', background:'linear-gradient(180deg,#fff,var(--steel-50))', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', padding:4, border:'1px solid var(--border-subtle)' }}>
                        <img src={distributorProductImage(r.id)} alt={r.model} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
                      </div>
                      <div>
                        <div style={{ font:'var(--fw-bold) var(--fs-sm)/1.1 var(--font-display)', color:'var(--ink-900)' }}>{r.model}</div>
                        <div style={{ font:'var(--fw-regular) var(--fs-3xs)/1 var(--font-mono)', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--brand-ink)', marginTop:3 }}>{r.series}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 8px', font:'var(--fw-medium) var(--fs-sm)/1 var(--font-body)', color:'var(--text-body)' }}>{r.variant}</td>
                  <td style={{ padding:'12px 8px' }}><StockTag s={r.stock} /></td>
                  <td style={{ padding:'12px 8px', textAlign:'right', font:'var(--fw-regular) var(--fs-sm)/1 var(--font-mono)', color:'var(--text-muted)' }}>{INR(r.retail)}</td>
                  <td style={{ padding:'12px 8px', textAlign:'right', font:'var(--fw-bold) var(--fs-md)/1 var(--font-mono)', color:'var(--ink-900)' }}>{INR(r.dp)}</td>
                  <td style={{ padding:'12px 8px', textAlign:'right' }}>
                    <span style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--price-accent)' }}>{r.margin}%</span>
                  </td>
                  <td style={{ padding:'12px 22px' }}>
                    <div style={{ display:'flex', justifyContent:'flex-end' }}>
                      {qty>0
                        ? <QuantityStepper value={qty} min={0} max={500} onChange={(v)=>onAdd(key, v)} style={{ transform:'scale(0.9)', transformOrigin:'right' }} />
                        : <Button variant="outline" size="sm" disabled={r.stock==='out'} onClick={()=>onAdd(key, 10)}>{r.stock==='out'?'Notify me':'+ Add'}</Button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ font:'var(--fw-regular) var(--fs-2xs)/1.4 var(--font-mono)', color:'var(--text-faint)', margin:0 }}>
        Avg distributor margin ~31.8% · Prices ex-works Greater Noida · IBC variants include frame-mounted carrier
      </p>
    </div>
  );
}
export default PriceList;
