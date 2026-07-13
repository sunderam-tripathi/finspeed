// Finspeed Distributor Portal — Order builder
import React from 'react';
import { Button, QuantityStepper, Input, IconButton } from '../../ui/index.js';
import { distributorProductImage, distributorProducts, formatInr } from '../../data/distributor.js';

function OrderBuilder({ order, onAdd, onRemove, onNav, onPlace }) {
  const D = distributorProducts, INR = formatInr;
  const wrapRef = React.useRef(null);
  const [narrow, setNarrow] = React.useState(false);
  const measure = React.useCallback(() => {
    const el = wrapRef.current;
    if (el) setNarrow(el.getBoundingClientRect().width < 920);
  }, []);
  React.useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    let ro;
    if (typeof ResizeObserver !== 'undefined' && wrapRef.current) {
      ro = new ResizeObserver(measure); ro.observe(wrapRef.current);
    }
    return () => { window.removeEventListener('resize', measure); if (ro) ro.disconnect(); };
  }, [measure]);
  const lines = Object.entries(order).map(([key,qty]) => {
    const r = D.find(x => (x.id+'-'+x.variant)===key);
    return r ? { key, r, qty } : null;
  }).filter(Boolean);

  const units = lines.reduce((s,l)=>s+l.qty,0);
  const cost = lines.reduce((s,l)=>s + l.r.dp*l.qty, 0);
  const retailVal = lines.reduce((s,l)=>s + l.r.retail*l.qty, 0);
  const margin = retailVal - cost;

  if (lines.length===0) {
    return (
      <div className="dist-page dist-order-empty" style={{ padding:'80px 32px', textAlign:'center', color:'var(--text-muted)' }}>
        <i data-lucide="clipboard-list" style={{width:44,height:44}}></i>
        <h3 style={{ font:'var(--fw-bold) var(--fs-xl)/1 var(--font-display)', color:'var(--ink-900)', margin:'16px 0 6px' }}>No items in your order yet</h3>
        <p style={{ font:'var(--fw-regular) var(--fs-sm)/1.5 var(--font-body)', margin:'0 0 20px' }}>Build a purchase order from the price list.</p>
        <div style={{ display:'flex', justifyContent:'center' }}><Button variant="primary" onClick={()=>onNav('pricelist')} iconLeft={<i data-lucide="list" style={{width:16,height:16}}></i>}>Open price list</Button></div>
      </div>
    );
  }

  return (
    <div className="dist-page dist-order-builder" ref={wrapRef} style={{ padding:'24px 32px', display:'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 340px', gap:24, alignItems:'start' }}>
      {/* lines */}
      <div className="dist-order-lines" style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
        <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border-subtle)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:0 }}>Purchase order · {lines.length} lines</h3>
          <span style={{ font:'var(--fw-medium) var(--fs-xs)/1 var(--font-mono)', color:'var(--text-muted)' }}>{units} units</span>
        </div>
        {lines.map(({key,r,qty})=>(
          <div className="dist-order-line" key={key} style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 22px', borderTop:'1px solid var(--border-subtle)', flexWrap: narrow ? 'wrap' : 'nowrap' }}>
            <div style={{ width:64, height:50, flex:'none', background:'linear-gradient(180deg,#fff,var(--steel-50))', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', padding:5, border:'1px solid var(--border-subtle)' }}>
              <img src={distributorProductImage(r.id)} alt={r.model} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
            </div>
            <div style={{ flex:'1 1 200px', minWidth:0 }}>
              <div style={{ font:'var(--fw-bold) var(--fs-md)/1.1 var(--font-display)', color:'var(--ink-900)' }}>{r.model}</div>
              <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1.3 var(--font-mono)', color:'var(--text-muted)', marginTop:3 }}>{r.variant} · DP {INR(r.dp)} · {r.margin}% margin</div>
            </div>
            <div className="dist-order-line-controls" style={{ display:'flex', alignItems:'center', gap:14, marginLeft: narrow ? 78 : 0, flex: narrow ? '1 1 100%' : 'none', justifyContent: narrow ? 'flex-end' : 'flex-start' }}>
              <QuantityStepper value={qty} min={1} max={500} onChange={(v)=>onAdd(key,v)} style={{ transform:'scale(0.92)' }} />
              <div style={{ width:96, textAlign:'right', font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--ink-900)' }}>{INR(r.dp*qty)}</div>
              <IconButton variant="ghost" size="sm" aria-label="Remove line" onClick={()=>onRemove(key)} icon={<i data-lucide="trash-2" style={{width:16,height:16}}></i>} />
            </div>
          </div>
        ))}
      </div>

      {/* summary */}
      <div className="dist-order-summary" style={{ position:'sticky', top:110, display:'flex', flexDirection:'column', gap:16 }}>
        <div style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:22 }}>
          <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:'0 0 16px' }}>Order summary</h3>
          {[['Units', units],['Retail value', INR(retailVal)],['Your cost (DP)', INR(cost)]].map((row,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-body)' }}>
              <span>{row[0]}</span><span style={{ fontFamily:'var(--font-mono)', fontWeight:600, color:'var(--text-strong)' }}>{row[1]}</span>
            </div>
          ))}
          <div style={{ height:1, background:'var(--border-subtle)', margin:'12px 0' }}></div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 0 14px' }}>
            <span style={{ font:'var(--fw-semibold) var(--fs-sm)/1 var(--font-body)', color:'var(--ink-900)' }}>Projected margin</span>
            <span style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-mono)', color:'var(--price-accent)' }}>{INR(margin)}</span>
          </div>
          <Button variant="primary" size="lg" full onClick={onPlace} iconRight={<i data-lucide="arrow-right" style={{width:18,height:18}}></i>}>Place order</Button>
          <p style={{ font:'var(--fw-regular) var(--fs-2xs)/1.4 var(--font-body)', color:'var(--text-faint)', textAlign:'center', margin:'12px 0 0' }}>Net 30 terms · dispatched ex-works Greater Noida</p>
        </div>
        <div style={{ background:'var(--cyan-50)', border:'1px solid var(--cyan-200)', borderRadius:'var(--radius-md)', padding:'18px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <i data-lucide="percent" style={{width:22,height:22,color:'var(--brand-strong)'}}></i>
          <span style={{ font:'var(--fw-regular) var(--fs-xs)/1.45 var(--font-body)', color:'var(--text-body)' }}>Blended margin on this order: <b style={{color:'var(--ink-900)',fontFamily:'var(--font-mono)'}}>{retailVal>0?((margin/retailVal)*100).toFixed(1):0}%</b></span>
        </div>
      </div>
    </div>
  );
}
export default OrderBuilder;
