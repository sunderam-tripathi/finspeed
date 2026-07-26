// Finspeed Distributor Portal — Invoices (Net-30 ledger)
import React from 'react';
import { Badge, Button, IconButton, Tag } from '../../ui/index.js';
import { formatInr } from '../../data/distributor.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function InvStatus({ s }) {
  const map = { 'Paid':'success', 'Due':'brand', 'Overdue':'danger', 'Partial':'warning' };
  return <Badge tone={map[s]||'neutral'} dot>{s}</Badge>;
}

function Invoices({ portal, notify }) {
  const { account: distributorAccount, invoices: distributorInvoices } = portal;
  const INR = formatInr;
  const A = distributorAccount;
  const [rows, setRows] = React.useState(distributorInvoices);
  const [filter, setFilter] = React.useState('Outstanding');

  useLucideIcons();

  const outstanding = rows.reduce((s,r)=>s + (r.amount - r.paid), 0);
  const overdue = rows.filter(r=>r.status==='Overdue').reduce((s,r)=>s + (r.amount - r.paid), 0);
  const available = Math.max(A.creditLimit - outstanding, 0);
  const usedPct = Math.min((outstanding / A.creditLimit) * 100, 100);

  const isOpen = (r) => r.status!=='Paid';
  const filters = ['Outstanding','Overdue','Paid','All'];
  const shown = rows.filter(r => filter==='All' ? true
    : filter==='Outstanding' ? isOpen(r)
    : filter==='Overdue' ? r.status==='Overdue'
    : r.status==='Paid');

  // aging buckets on open balance
  const aging = [
    { label:'Not yet due', tone:'var(--text-strong)', amt: rows.filter(r=>r.status==='Due').reduce((s,r)=>s+(r.amount-r.paid),0) },
    { label:'1–30 days',   tone:'var(--warning)',     amt: rows.filter(r=>r.status==='Partial').reduce((s,r)=>s+(r.amount-r.paid),0) },
    { label:'31–60 days',  tone:'var(--danger)',      amt: rows.filter(r=>r.status==='Overdue').reduce((s,r)=>s+(r.amount-r.paid),0) },
    { label:'60+ days',    tone:'var(--danger)',      amt: 0 },
  ];
  const agingTotal = aging.reduce((s,b)=>s+b.amt,0) || 1;

  function payInvoice(no) {
    setRows(rs => rs.map(r => r.no===no ? { ...r, paid:r.amount, status:'Paid' } : r));
    notify && notify('Payment recorded for ' + no, 'success');
  }
  function download(no) { notify && notify(no + '.pdf is downloading', 'info'); }

  const kpis = [
    { label:'Outstanding balance', value:INR(outstanding), icon:'wallet', tone:'cyan', sub:rows.filter(isOpen).length + ' open invoices' },
    { label:'Overdue', value:INR(overdue), icon:'alert-triangle', tone: overdue>0?'danger':'plain', sub: overdue>0 ? 'Action needed' : 'All current' },
    { label:'Credit available', value:INR(available), icon:'gauge', tone:'plain', sub:'of ' + INR(A.creditLimit) + ' limit' },
  ];

  return (
    <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:24 }}>
      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
        {kpis.map((k,i)=>(
          <div key={i} style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:20, boxShadow:'var(--shadow-xs)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ width:40, height:40, flex:'none', borderRadius:'var(--radius-sm)', display:'inline-flex', alignItems:'center', justifyContent:'center',
                background:k.tone==='cyan'?'var(--cyan-50)':k.tone==='danger'?'var(--danger-soft, #fdecea)':'var(--surface-sunken)',
                color:k.tone==='cyan'?'var(--brand-strong)':k.tone==='danger'?'var(--danger)':'var(--text-muted)' }}>
                <i data-lucide={k.icon} style={{width:20,height:20}}></i>
              </span>
              <span style={{ font:'var(--fw-regular) var(--fs-xs)/1.2 var(--font-body)', color:'var(--text-muted)' }}>{k.label}</span>
            </div>
            <div style={{ font:'var(--fw-bold) var(--fs-3xl)/1 var(--font-mono)', color: k.tone==='danger'&&k.value!=='₹0'?'var(--danger)':'var(--ink-900)', marginTop:16, letterSpacing:'-0.01em' }}>{k.value}</div>
            <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1.3 var(--font-mono)', color:'var(--text-faint)', marginTop:7 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:24 }}>
        {/* credit usage bar */}
        <div style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'20px 22px' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12, flexWrap:'wrap', gap:8 }}>
            <h3 style={{ font:'var(--fw-bold) var(--fs-md)/1 var(--font-display)', color:'var(--ink-900)', margin:0 }}>Credit line · {A.terms}</h3>
            <span style={{ font:'var(--fw-regular) var(--fs-xs)/1 var(--font-mono)', color:'var(--text-muted)' }}>{INR(outstanding)} used · {INR(available)} available</span>
          </div>
          <div style={{ height:10, borderRadius:'var(--radius-pill)', background:'var(--surface-sunken)', overflow:'hidden', display:'flex' }}>
            <div style={{ width:usedPct+'%', background: overdue>0?'linear-gradient(90deg,var(--danger),#ff7a5c)':'linear-gradient(90deg,var(--cyan-700),var(--cyan-electric))' }}></div>
          </div>
          {/* aging */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginTop:20 }}>
            {aging.map((b,i)=>(
              <div key={i}>
                <div style={{ height:4, borderRadius:'var(--radius-pill)', background: b.amt>0?b.tone:'var(--border-subtle)', marginBottom:8 }}></div>
                <div style={{ font:'var(--fw-bold) var(--fs-md)/1 var(--font-mono)', color: b.amt>0?'var(--ink-900)':'var(--text-faint)' }}>{INR(b.amt)}</div>
                <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1.2 var(--font-mono)', color:'var(--text-muted)', marginTop:4 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ledger */}
      <div style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, padding:'16px 22px', borderBottom:'1px solid var(--border-subtle)', flexWrap:'wrap' }}>
          <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:0 }}>Invoices</h3>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {filters.map(f => <Tag key={f} selected={filter===f} onClick={()=>setFilter(f)}>{f}</Tag>)}
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', minWidth:820, borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ font:'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-faint)' }}>
                <th style={{ textAlign:'left', padding:'12px 22px' }}>Invoice</th>
                <th style={{ textAlign:'left', padding:'12px 8px' }}>Issued</th>
                <th style={{ textAlign:'left', padding:'12px 8px' }}>Due</th>
                <th style={{ textAlign:'left', padding:'12px 8px' }}>PO</th>
                <th style={{ textAlign:'right', padding:'12px 8px' }}>Amount</th>
                <th style={{ textAlign:'left', padding:'12px 8px' }}>Status</th>
                <th style={{ textAlign:'right', padding:'12px 22px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r)=>{
                const bal = r.amount - r.paid;
                return (
                  <tr key={r.no} style={{ borderTop:'1px solid var(--border-subtle)' }}>
                    <td style={{ padding:'14px 22px', font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--ink-900)', whiteSpace:'nowrap' }}>{r.no}</td>
                    <td style={{ padding:'14px 8px', font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{r.issued}</td>
                    <td style={{ padding:'14px 8px', font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color: r.status==='Overdue'?'var(--danger)':'var(--text-muted)', whiteSpace:'nowrap' }}>{r.due}</td>
                    <td style={{ padding:'14px 8px', font:'var(--fw-regular) var(--fs-sm)/1 var(--font-mono)', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{r.po}</td>
                    <td style={{ padding:'14px 8px', textAlign:'right', whiteSpace:'nowrap' }}>
                      <div style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--ink-900)' }}>{INR(r.amount)}</div>
                      {r.status==='Partial' && <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--warning)', marginTop:4 }}>{INR(bal)} due</div>}
                    </td>
                    <td style={{ padding:'14px 8px' }}><InvStatus s={r.status} /></td>
                    <td style={{ padding:'10px 22px', textAlign:'right', whiteSpace:'nowrap' }}>
                      <div style={{ display:'inline-flex', gap:6, alignItems:'center' }}>
                        {bal>0 && <Button variant="outline" size="sm" onClick={()=>payInvoice(r.no)}>Pay</Button>}
                        <IconButton variant="ghost" size="sm" aria-label="Download PDF" onClick={()=>download(r.no)} icon={<i data-lucide="download" style={{width:16,height:16}}></i>} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {shown.length===0 && (
                <tr><td colSpan={7} style={{ padding:'40px 22px', textAlign:'center', font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-faint)' }}>No invoices in this view.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Invoices;
