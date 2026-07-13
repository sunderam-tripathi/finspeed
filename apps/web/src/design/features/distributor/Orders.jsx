// Finspeed Distributor Portal — Orders (confirmation + history + tracking)
import React from 'react';
import { Button, Badge, IconButton } from '../../ui/index.js';
import {
  distributorOrderDetails,
  distributorOrders,
  distributorProductImage,
  distributorProducts,
  distributorStatus,
  distributorTrackingStages,
  formatInr,
} from '../../data/distributor.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function DistOrders({ justPlaced, placedOrders = [], onClearPlaced, onNav, onReorder }) {
  const INR = formatInr;
  const STAGES = distributorTrackingStages;
  const SMAP = distributorStatus;
  const DET = distributorOrderDetails;
  const [open, setOpen] = React.useState(null);
  useLucideIcons();

  // Newest first; persisted placed orders sit above the seeded history.
  const base = distributorOrders.slice().reverse();
  const list = [...placedOrders, ...base];
  const card = { background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)' };

  function stepFor(o){ return (SMAP[o.status]||{step:1}).step; }
  function toneFor(o){ return (SMAP[o.status]||{tone:'neutral'}).tone; }

  function Tracker({ step }) {
    return (
      <div className="dist-tracker" style={{ display:'flex', justifyContent:'space-between', position:'relative', padding:'4px 6px' }}>
        <div style={{ position:'absolute', top:17, left:20, right:20, height:3, background:'var(--border-subtle)', borderRadius:2 }}></div>
        <div style={{ position:'absolute', top:17, left:20, height:3, background:'var(--brand-strong)', borderRadius:2, width:`calc((100% - 40px) * ${step/(STAGES.length-1)})` }}></div>
        {STAGES.map((s,i)=>{
          const done = i<=step;
          return (
            <div key={s} style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', flex:1, textAlign:'center' }}>
              <span style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:done?'var(--brand-strong)':'var(--surface-card)', border:'2px solid '+(done?'var(--brand-strong)':'var(--border-strong)'), color:done?'#fff':'var(--text-faint)', zIndex:1 }}>
                {done ? <i data-lucide="check" style={{width:14,height:14}}></i> : <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--text-faint)' }}></span>}
              </span>
              <span style={{ font:'var(--fw-medium) var(--fs-2xs)/1.2 var(--font-body)', color:done?'var(--ink-900)':'var(--text-faint)', marginTop:8, maxWidth:76 }}>{s}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="dist-page dist-order-history" style={{ padding:'24px 32px', display:'flex', flexDirection:'column', gap:20 }}>
      {/* confirmation banner */}
      {justPlaced && (
        <div className="dist-order-confirmation" style={{ display:'flex', alignItems:'center', gap:16, padding:'18px 22px', background:'var(--cyan-50)', border:'1px solid var(--cyan-200)', borderRadius:'var(--radius-md)' }}>
          <span style={{ width:44, height:44, flex:'none', borderRadius:'50%', background:'var(--surface-card)', border:'1px solid var(--cyan-200)', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'var(--brand-strong)' }}>
            <i data-lucide="check-circle-2" style={{width:24,height:24}}></i>
          </span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ font:'var(--fw-bold) var(--fs-md)/1 var(--font-display)', color:'var(--ink-900)' }}>Order {justPlaced.no} placed</div>
            <div style={{ font:'var(--fw-regular) var(--fs-xs)/1.4 var(--font-body)', color:'var(--text-body)', marginTop:5 }}>{justPlaced.units} units · {INR(justPlaced.value)} · Net-30 · a confirmation has been emailed to your accounts team.</div>
          </div>
          <Button variant="outline" size="sm" iconLeft={<i data-lucide="file-text" style={{width:15,height:15}}></i>}>PO copy</Button>
          <IconButton variant="ghost" size="sm" aria-label="Dismiss" onClick={onClearPlaced} icon={<i data-lucide="x" style={{width:16,height:16}}></i>} />
        </div>
      )}

      {/* summary stats */}
      <div className="dist-order-stats" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {[
          ['Open orders', list.filter(o=>o.status!=='Delivered').length, 'package'],
          ['In transit', list.filter(o=>o.status==='In transit').length, 'truck'],
          ['Delivered (90d)', list.filter(o=>o.status==='Delivered').length, 'check-circle-2'],
        ].map(([l,v,ic])=>(
          <div key={l} style={{ ...card, padding:'18px 20px', display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ width:40, height:40, flex:'none', borderRadius:'var(--radius-sm)', background:'var(--cyan-50)', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'var(--brand-strong)' }}><i data-lucide={ic} style={{width:20,height:20}}></i></span>
            <div>
              <div style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-mono)', color:'var(--ink-900)' }}>{v}</div>
              <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-body)', color:'var(--text-muted)', marginTop:4 }}>{l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* orders list */}
      <div className="dist-history-card" style={{ ...card, overflow:'hidden' }}>
        <div className="dist-history-header" style={{ padding:'18px 22px', borderBottom:'1px solid var(--border-subtle)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:0 }}>Order history</h3>
          <Button variant="primary" size="sm" onClick={()=>onNav('orders')} iconLeft={<i data-lucide="plus" style={{width:15,height:15}}></i>}>New order</Button>
        </div>
        {list.map((o)=>{
          const isOpen = open===o.no;
          const det = o.detail || DET[o.no];
          const step = stepFor(o);
          return (
            <div key={o.no} style={{ borderTop:'1px solid var(--border-subtle)' }}>
              <button className="dist-history-row" onClick={()=>setOpen(isOpen?null:o.no)} style={{ width:'100%', display:'grid', gridTemplateColumns:'1.1fr 1fr 0.8fr 1fr auto', alignItems:'center', gap:14, padding:'16px 22px', background:isOpen?'var(--steel-50)':'transparent', border:'none', cursor:'pointer', textAlign:'left' }}>
                <div className="dist-history-id">
                  <div style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', color:'var(--ink-900)' }}>{o.no}</div>
                  <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-body)', color:'var(--text-muted)', marginTop:5 }}>{o.date}</div>
                </div>
                <div className="dist-history-eta" style={{ font:'var(--fw-regular) var(--fs-xs)/1 var(--font-body)', color:'var(--text-body)' }}>{det?det.eta:'\u2014'}</div>
                <div className="dist-history-units" style={{ font:'var(--fw-medium) var(--fs-sm)/1 var(--font-mono)', color:'var(--text-strong)' }}>{o.units} units</div>
                <div className="dist-history-value" style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--ink-900)' }}>{INR(o.value)}</div>
                <div className="dist-history-status" style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'flex-end' }}>
                  <Badge tone={toneFor(o)} dot>{o.status}</Badge>
                  <i data-lucide={isOpen?'chevron-up':'chevron-down'} style={{width:18,height:18,color:'var(--text-faint)'}}></i>
                </div>
              </button>
              {isOpen && (
                <div className="dist-history-expanded" style={{ padding:'8px 22px 24px', display:'flex', flexDirection:'column', gap:20 }}>
                  <Tracker step={step} />
                  <div className="dist-history-detail" style={{ display:'grid', gridTemplateColumns:'1.4fr 0.8fr', gap:20, alignItems:'start' }}>
                    <div style={{ border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', overflow:'hidden' }}>
                      {(det?det.lines:[]).map(([id,variant,qty],i)=>{
                        const r = distributorProducts.find(x=>x.id===id);
                        return (
                          <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', borderTop:i?'1px solid var(--border-subtle)':'none' }}>
                            <div style={{ width:52, height:42, flex:'none', background:'linear-gradient(180deg,#fff,var(--steel-50))', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', padding:4 }}>
                              <img src={distributorProductImage(id)} alt="" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ font:'var(--fw-bold) var(--fs-sm)/1.1 var(--font-display)', color:'var(--ink-900)' }}>{r?r.model:id}</div>
                              <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-muted)', marginTop:3 }}>{variant}</div>
                            </div>
                            <span style={{ font:'var(--fw-medium) var(--fs-sm)/1 var(--font-mono)', color:'var(--text-strong)' }}>×{qty}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      <Button variant="outline" full iconLeft={<i data-lucide="file-text" style={{width:16,height:16}}></i>}>Invoice</Button>
                      <Button variant="ghost" full onClick={()=>onReorder&&onReorder(o)} iconLeft={<i data-lucide="rotate-ccw" style={{width:16,height:16}}></i>}>Reorder</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default DistOrders;
