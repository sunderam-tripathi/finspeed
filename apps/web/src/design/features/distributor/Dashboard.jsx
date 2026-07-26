// Finspeed Distributor Portal — Dashboard
import React from 'react';
import { Badge } from '../../ui/index.js';
import { distributorProductImage, formatInr } from '../../data/distributor.js';

function StatusBadge({ s }) {
  const map = { 'Delivered':'success', 'In transit':'brand', 'Processing':'warning' };
  return <Badge tone={map[s]||'neutral'} dot>{s}</Badge>;
}

function Dashboard({ portal, onNav }) {
  const { orders: distributorOrders, products: distributorProducts } = portal;
  const D = distributorProducts, INR = formatInr;
  const avgMargin = (D.reduce((s,r)=>s+r.margin,0)/D.length).toFixed(1);
  const kpis = [
    { label:'Avg distributor margin', value:avgMargin+'%', icon:'percent', tone:'cyan', delta:'+1.4 pts' },
    { label:'Active SKUs', value:D.length, icon:'package', delta:'13 models' },
    { label:'Orders this quarter', value:'167', icon:'clipboard-list', delta:'+22%' },
    { label:'Portfolio value', value:'₹8.0L', icon:'wallet', delta:'retail ₹4.8k–10.5k' },
  ];
  const topMargin = [...D].sort((a,b)=>b.margin-a.margin).slice(0,4);

  return (
    <div className="dist-page dist-dashboard" style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:24 }}>
      {/* KPIs */}
      <div className="dist-kpi-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18 }}>
        {kpis.map((k,i)=>(
          <div key={i} style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:20, boxShadow:'var(--shadow-xs)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ width:40, height:40, borderRadius:'var(--radius-sm)', display:'inline-flex', alignItems:'center', justifyContent:'center', background:k.tone==='cyan'?'var(--cyan-50)':'var(--surface-sunken)', color:k.tone==='cyan'?'var(--brand-strong)':'var(--text-muted)' }}>
                <i data-lucide={k.icon} style={{width:20,height:20}}></i>
              </span>
              <span style={{ font:'var(--fw-medium) var(--fs-2xs)/1 var(--font-mono)', color:'var(--success)' }}>{k.delta}</span>
            </div>
            <div style={{ font:'var(--fw-bold) var(--fs-3xl)/1 var(--font-mono)', color:'var(--ink-900)', marginTop:16, letterSpacing:'-0.01em' }}>{k.value}</div>
            <div style={{ font:'var(--fw-regular) var(--fs-xs)/1.3 var(--font-body)', color:'var(--text-muted)', marginTop:6 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="dist-dashboard-panels" style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:24 }}>
        {/* Recent orders */}
        <div className="dist-recent-card" style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:'1px solid var(--border-subtle)' }}>
            <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:0 }}>Recent orders</h3>
            <button onClick={()=>onNav('orderhistory')} style={{ background:'none', border:'none', cursor:'pointer', font:'var(--fw-semibold) var(--fs-xs)/1 var(--font-body)', color:'var(--brand-ink)' }}>View all →</button>
          </div>
          <div className="dist-table-scroll">
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ font:'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-faint)' }}>
                <th style={{ textAlign:'left', padding:'12px 22px' }}>Order</th>
                <th style={{ textAlign:'left', padding:'12px 8px' }}>Date</th>
                <th style={{ textAlign:'right', padding:'12px 8px' }}>Units</th>
                <th style={{ textAlign:'right', padding:'12px 8px' }}>Value</th>
                <th style={{ textAlign:'right', padding:'12px 22px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {distributorOrders.map((o,i)=>(
                <tr key={i} style={{ borderTop:'1px solid var(--border-subtle)' }}>
                  <td style={{ padding:'14px 22px', font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--ink-900)' }}>{o.no}</td>
                  <td style={{ padding:'14px 8px', font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-muted)' }}>{o.date}</td>
                  <td style={{ padding:'14px 8px', textAlign:'right', font:'var(--fw-medium) var(--fs-sm)/1 var(--font-mono)', color:'var(--text-body)' }}>{o.units}</td>
                  <td style={{ padding:'14px 8px', textAlign:'right', font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--ink-900)' }}>{INR(o.value)}</td>
                  <td style={{ padding:'14px 22px', textAlign:'right' }}><StatusBadge s={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Top margin */}
        <div style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'18px 22px' }}>
          <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:'0 0 6px' }}>Highest-margin models</h3>
          <p style={{ font:'var(--fw-regular) var(--fs-xs)/1.3 var(--font-body)', color:'var(--text-muted)', margin:'0 0 16px' }}>Where you earn the most per unit.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {topMargin.map((r,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:52, height:42, flex:'none', background:'linear-gradient(180deg,#fff,var(--steel-50))', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', padding:4, border:'1px solid var(--border-subtle)' }}>
                  <img src={distributorProductImage(r.id)} alt={r.model} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ font:'var(--fw-bold) var(--fs-sm)/1.1 var(--font-display)', color:'var(--ink-900)' }}>{r.model}</div>
                  <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-muted)', marginTop:3 }}>{r.variant}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ font:'var(--fw-bold) var(--fs-md)/1 var(--font-mono)', color:'var(--price-accent)' }}>{r.margin}%</div>
                  <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-faint)', marginTop:3 }}>{INR(r.retail-r.dp)}/unit</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
