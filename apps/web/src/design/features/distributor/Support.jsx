// Finspeed Distributor Portal — Support (rep, raise ticket, tickets, FAQ)
import React from 'react';
import { Button, Input, Select, Badge, Accordion, IconButton } from '../../ui/index.js';
import { distributorFaq, distributorRepresentative, distributorTickets } from '../../data/distributor.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function TicketStatus({ s }) {
  const map = { 'Open':'brand', 'In progress':'warning', 'Resolved':'success' };
  return <Badge tone={map[s]||'neutral'} dot>{s}</Badge>;
}

function Support({ notify }) {
  const REP = distributorRepresentative;
  const FAQ = distributorFaq;
  const [tickets, setTickets] = React.useState(distributorTickets);
  const [form, setForm] = React.useState({ category:'Order issue', subject:'', message:'' });

  useLucideIcons();

  function set(k,v){ setForm(f=>({ ...f, [k]:v })); }
  function submit(e){
    e.preventDefault();
    if(!form.subject.trim()){ notify && notify('Add a subject before submitting','danger'); return; }
    const id = 'TK-' + (3400 + Math.floor(Math.random()*99) + 23);
    setTickets(t => [{ id, subject:form.subject, category:form.category, status:'Open', updated:'just now' }, ...t]);
    setForm({ category:'Order issue', subject:'', message:'' });
    notify && notify('Ticket ' + id + ' raised — we\u2019ll reply within 4 hours', 'success');
  }

  const faqItems = FAQ.map(f => ({
    title: f.q,
    icon: <i data-lucide="help-circle" style={{width:16,height:16}}></i>,
    content: <span style={{ font:'var(--fw-regular) var(--fs-sm)/1.65 var(--font-body)', color:'var(--text-body)' }}>{f.a}</span>,
  }));

  return (
    <div style={{ padding:'28px 32px', display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:24, alignItems:'start' }}>
      {/* left column */}
      <div style={{ display:'flex', flexDirection:'column', gap:24, minWidth:0 }}>
        {/* raise a ticket */}
        <div style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)' }}>
          <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border-subtle)' }}>
            <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:0 }}>Raise a ticket</h3>
            <p style={{ font:'var(--fw-regular) var(--fs-xs)/1.3 var(--font-body)', color:'var(--text-muted)', margin:'6px 0 0' }}>Orders, warranty, billing and logistics — we route it to the right desk.</p>
          </div>
          <form onSubmit={submit} style={{ padding:22, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <Select label="Category" value={form.category} onChange={e=>set('category',e.target.value)}
                options={['Order issue','Warranty','Billing','Spares','Logistics','Other']} />
              <Input label="Reference (optional)" placeholder="PO / INV no." value={form.ref||''} onChange={e=>set('ref',e.target.value)} />
            </div>
            <Input label="Subject" placeholder="Short summary of the issue" value={form.subject} onChange={e=>set('subject',e.target.value)} />
            <div>
              <div style={{ font:'var(--fw-semibold) var(--fs-xs)/1 var(--font-body)', color:'var(--text-strong)', marginBottom:7 }}>Message</div>
              <textarea value={form.message} onChange={e=>set('message',e.target.value)} rows={4} placeholder="Describe the issue, models and quantities involved…"
                style={{ width:'100%', boxSizing:'border-box', padding:'12px 14px', border:'1px solid var(--border-strong)', borderRadius:'var(--radius-sm)', font:'var(--fw-regular) var(--fs-sm)/1.5 var(--font-body)', color:'var(--text-strong)', resize:'vertical', outline:'none', background:'var(--surface-card)' }}
                onFocus={e=>{e.currentTarget.style.borderColor='var(--focus-ring)';e.currentTarget.style.boxShadow='0 0 0 3px var(--cyan-100)';}}
                onBlur={e=>{e.currentTarget.style.borderColor='var(--border-strong)';e.currentTarget.style.boxShadow='none';}} />
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <Button type="submit" variant="primary" iconRight={<i data-lucide="send" style={{width:15,height:15}}></i>}>Submit ticket</Button>
            </div>
          </form>
        </div>

        {/* tickets list */}
        <div style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
          <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border-subtle)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:0 }}>Your tickets</h3>
            <span style={{ font:'var(--fw-medium) var(--fs-xs)/1 var(--font-mono)', color:'var(--text-muted)' }}>{tickets.filter(t=>t.status!=='Resolved').length} open</span>
          </div>
          {tickets.map((t,i)=>(
            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'15px 22px', borderTop: i===0?'none':'1px solid var(--border-subtle)' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                  <span style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--ink-900)' }}>{t.id}</span>
                  <span style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-faint)' }}>{t.category}</span>
                </div>
                <div style={{ font:'var(--fw-medium) var(--fs-sm)/1.35 var(--font-body)', color:'var(--text-body)', marginTop:5 }}>{t.subject}</div>
              </div>
              <div style={{ textAlign:'right', flex:'none' }}>
                <TicketStatus s={t.status} />
                <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-faint)', marginTop:7 }}>{t.updated}</div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'8px 22px 14px' }}>
          <h3 style={{ font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:'14px 0 4px' }}>Common questions</h3>
          <Accordion items={faqItems} />
        </div>
      </div>

      {/* right column — rep + channels */}
      <div style={{ position:'sticky', top:110, display:'flex', flexDirection:'column', gap:16 }}>
        <div style={{ background:'var(--cyan-50)', border:'1px solid var(--cyan-200)', borderRadius:'var(--radius-md)', padding:24, color:'var(--ink-900)' }}>
          <div style={{ font:'var(--fw-semibold) var(--fs-3xs)/1 var(--font-mono)', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--brand-strong)' }}>Your success manager</div>
          <div style={{ display:'flex', alignItems:'center', gap:14, margin:'16px 0' }}>
            <div style={{ width:52, height:52, flex:'none', borderRadius:'50%', background:'linear-gradient(135deg,var(--cyan-400),var(--cyan-700))', display:'flex', alignItems:'center', justifyContent:'center', font:'var(--fw-bold) 18px/1 var(--font-display)', color:'var(--ink-900)' }}>{REP.name.split(' ').map(w=>w[0]).join('')}</div>
            <div>
              <div style={{ font:'var(--fw-bold) var(--fs-lg)/1.1 var(--font-display)', color:'var(--ink-900)' }}>{REP.name}</div>
              <div style={{ font:'var(--fw-regular) var(--fs-xs)/1.3 var(--font-body)', color:'var(--text-muted)', marginTop:4 }}>{REP.title}</div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <a href={'tel:'+REP.phone.replace(/\s/g,'')} style={{ display:'flex', alignItems:'center', gap:11, textDecoration:'none', color:'var(--ink-900)', font:'var(--fw-medium) var(--fs-sm)/1 var(--font-mono)' }}>
              <i data-lucide="phone" style={{width:16,height:16,color:'var(--brand-strong)'}}></i>{REP.phone}
            </a>
            <a href={'mailto:'+REP.email} style={{ display:'flex', alignItems:'center', gap:11, textDecoration:'none', color:'var(--ink-900)', font:'var(--fw-medium) var(--fs-sm)/1 var(--font-mono)' }}>
              <i data-lucide="mail" style={{width:16,height:16,color:'var(--brand-strong)'}}></i>{REP.email}
            </a>
          </div>
          <div style={{ height:1, background:'var(--cyan-200)', margin:'18px 0' }}></div>
          <div style={{ display:'flex', alignItems:'center', gap:10, font:'var(--fw-regular) var(--fs-2xs)/1.4 var(--font-body)', color:'var(--text-muted)' }}>
            <i data-lucide="clock" style={{width:14,height:14}}></i>{REP.hours}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:8, font:'var(--fw-regular) var(--fs-2xs)/1.4 var(--font-body)', color:'var(--text-muted)' }}>
            <i data-lucide="zap" style={{width:14,height:14}}></i>{REP.sla}
          </div>
        </div>

        {/* quick channels */}
        <div style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:8 }}>
          {[['phone-call','Call distributor desk','1800-208-4477'],['message-square','WhatsApp orders','+91 99580 11234'],['book-open','Dealer handbook','PDF · 4.2 MB']].map((c,i)=>(
            <button key={i} onClick={()=>notify&&notify('Opening '+c[1],'info')} style={{ width:'100%', display:'flex', alignItems:'center', gap:13, padding:'13px 14px', border:'none', background:'transparent', cursor:'pointer', textAlign:'left', borderRadius:'var(--radius-sm)', transition:'var(--transition-base)' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface-sunken)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{ width:36, height:36, flex:'none', borderRadius:'var(--radius-sm)', background:'var(--cyan-50)', color:'var(--brand-strong)', display:'flex', alignItems:'center', justifyContent:'center' }}><i data-lucide={c[0]} style={{width:17,height:17}}></i></span>
              <span style={{ flex:1, minWidth:0 }}>
                <span style={{ display:'block', font:'var(--fw-semibold) var(--fs-sm)/1.2 var(--font-body)', color:'var(--ink-900)' }}>{c[1]}</span>
                <span style={{ display:'block', font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-muted)', marginTop:3 }}>{c[2]}</span>
              </span>
              <i data-lucide="chevron-right" style={{width:16,height:16,color:'var(--text-faint)'}}></i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Support;
