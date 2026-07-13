// Finspeed storefront — Account (orders + tracking, addresses, profile)
import React from 'react';
import { Button, Input, Tabs, Badge, Breadcrumb, EmptyState } from '../../ui/index.js';
import { addresses, productImage, products, trackingStages } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function Account({ user, orders, onNav, onProduct, onSignOut }) {
  const [tab, setTab] = React.useState('orders');
  const [openOrder, setOpenOrder] = React.useState(null);
  const P = products;
  const STAGES = trackingStages;
  const inr = (n)=> '₹' + Number(n).toLocaleString('en-IN');
  useLucideIcons([tab, openOrder]);

  const statusFor = (step) => step>=4 ? {tone:'success',label:'Delivered'} : step>=2 ? {tone:'brand',label:'In transit'} : {tone:'neutral',label:'Processing'};
  const card = { background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', padding:'var(--space-6)' };

  function OrderRow({ o }) {
    const st = statusFor(o.step);
    const lines = o.items.map(it=>({ p:P.find(x=>x.id===it.id), qty:it.qty })).filter(l=>l.p);
    return (
      <button onClick={()=>setOpenOrder(o)} style={{ ...card, textAlign:'left', cursor:'pointer', width:'100%', display:'block', transition:'var(--transition-base)' }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-strong)';e.currentTarget.style.boxShadow='var(--shadow-sm)';}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border-subtle)';e.currentTarget.style.boxShadow='none';}}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'var(--space-4)' }}>
          <div>
            <div style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', color:'var(--ink-900)' }}>Order {o.no}</div>
            <div style={{ font:'var(--fw-regular) var(--fs-xs)/1 var(--font-body)', color:'var(--text-muted)', marginTop:6 }}>Placed {o.date} · {o.eta}</div>
          </div>
          <Badge tone={st.tone} dot>{st.label}</Badge>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', marginTop:'var(--space-5)' }}>
          <div style={{ display:'flex' }}>
            {lines.map(({p},i)=>(
              <span key={p.id} style={{ width:52, height:44, marginLeft:i?-10:0, background:'linear-gradient(180deg,#fff,var(--steel-50))', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', padding:4 }}>
                <img src={productImage(p.id)} alt={p.name} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
              </span>
            ))}
          </div>
          <div style={{ flex:1, minWidth:0, font:'var(--fw-medium) var(--fs-sm)/1.3 var(--font-body)', color:'var(--text-body)' }}>{lines.map(l=>l.p.name+(l.qty>1?' ×'+l.qty:'')).join(', ')}</div>
          <div style={{ font:'var(--fw-bold) var(--fs-md)/1 var(--font-mono)', color:'var(--ink-900)' }}>{inr(o.total)}</div>
          <i data-lucide="chevron-right" style={{width:18,height:18,color:'var(--text-faint)'}}></i>
        </div>
      </button>
    );
  }

  function OrderDetail({ o }) {
    const st = statusFor(o.step);
    const lines = o.items.map(it=>({ p:P.find(x=>x.id===it.id), qty:it.qty })).filter(l=>l.p);
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
        <button onClick={()=>setOpenOrder(null)} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'none', border:'none', padding:0, cursor:'pointer', font:'var(--fw-semibold) var(--fs-sm)/1 var(--font-body)', color:'var(--text-muted)', alignSelf:'flex-start' }}>
          <i data-lucide="arrow-left" style={{width:16,height:16}}></i> All orders
        </button>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'var(--space-3)' }}>
          <div>
            <h2 style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-display)', letterSpacing:'-0.01em', color:'var(--ink-900)', margin:0 }}>Order {o.no}</h2>
            <p style={{ font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-muted)', margin:'8px 0 0' }}>Placed {o.date} · {o.eta}</p>
          </div>
          <Badge tone={st.tone} dot>{st.label}</Badge>
        </div>

        {/* tracking */}
        <div style={card}>
          <h3 style={{ font:'var(--fw-semibold) var(--fs-md)/1 var(--font-body)', color:'var(--text-strong)', margin:'0 0 var(--space-6)' }}>Tracking</h3>
          <div style={{ display:'flex', justifyContent:'space-between', position:'relative' }}>
            <div style={{ position:'absolute', top:13, left:14, right:14, height:3, background:'var(--border-subtle)', borderRadius:2 }}></div>
            <div style={{ position:'absolute', top:13, left:14, height:3, background:'var(--brand)', borderRadius:2, width:`calc((100% - 28px) * ${o.step/(STAGES.length-1)})` }}></div>
            {STAGES.map((s,i)=>{
              const done = i<=o.step;
              return (
                <div key={s} style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', flex:1, textAlign:'center' }}>
                  <span style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:done?'var(--brand)':'var(--surface-card)', border:'2px solid '+(done?'var(--brand)':'var(--border-strong)'), color:done?'#fff':'var(--text-faint)', zIndex:1 }}>
                    {done ? <i data-lucide="check" style={{width:14,height:14}}></i> : <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--text-faint)' }}></span>}
                  </span>
                  <span style={{ font:'var(--fw-medium) var(--fs-2xs)/1.2 var(--font-body)', color:done?'var(--ink-900)':'var(--text-faint)', marginTop:8, maxWidth:72 }}>{s}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 0.9fr', gap:'var(--space-5)', alignItems:'start' }}>
          {/* items */}
          <div style={card}>
            <h3 style={{ font:'var(--fw-semibold) var(--fs-md)/1 var(--font-body)', color:'var(--text-strong)', margin:'0 0 var(--space-4)' }}>Items</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
              {lines.map(({p,qty})=>(
                <div key={p.id} style={{ display:'flex', gap:'var(--space-3)', alignItems:'center' }}>
                  <div onClick={()=>onProduct(p.id)} style={{ width:64, height:54, flex:'none', background:'linear-gradient(180deg,#fff,var(--steel-50))', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', padding:5, cursor:'pointer' }}>
                    <img src={productImage(p.id)} alt={p.name} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ font:'var(--fw-bold) var(--fs-sm)/1.1 var(--font-display)', color:'var(--ink-900)' }}>{p.name}</div>
                    <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-muted)', marginTop:3 }}>Qty {qty} · {p.wheels} · {p.speed}</div>
                  </div>
                  <span style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--ink-900)' }}>{inr(p.price*qty)}</span>
                </div>
              ))}
            </div>
          </div>
          {/* summary / actions */}
          <div style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'var(--space-4)' }}>
              <span style={{ font:'var(--fw-semibold) var(--fs-md)/1 var(--font-body)', color:'var(--text-strong)' }}>Total</span>
              <span style={{ font:'var(--fw-bold) var(--fs-xl)/1 var(--font-mono)', color:'var(--ink-900)' }}>{inr(o.total)}</span>
            </div>
            <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1.5 var(--font-mono)', color:'var(--text-muted)', marginBottom:'var(--space-5)' }}>Free delivery · Cash on delivery</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
              <Button variant="outline" full iconLeft={<i data-lucide="file-text" style={{width:16,height:16}}></i>}>Download invoice</Button>
              <Button variant="ghost" full iconLeft={<i data-lucide="life-buoy" style={{width:16,height:16}}></i>}>Need help?</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:'var(--bg-page)', minHeight:'70vh' }}>
      <div style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-5) var(--space-7) var(--space-9)' }}>
        <div style={{ padding:'var(--space-4) 0' }}>
          <Breadcrumb items={[{label:'Home',onClick:()=>onNav('home')},{label:'My account'}]} />
        </div>

        {/* greeting */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'var(--space-4)', margin:'4px 0 var(--space-6)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-4)' }}>
            <span style={{ width:56, height:56, flex:'none', borderRadius:'50%', background:'var(--ink-900)', color:'var(--cyan-electric)', display:'inline-flex', alignItems:'center', justifyContent:'center', font:'var(--fw-bold) var(--fs-lg)/1 var(--font-display)' }}>{(user&&user.name||'A').split(' ').map(w=>w[0]).slice(0,2).join('')}</span>
            <div>
              <h1 style={{ font:'var(--fw-bold) var(--fs-3xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:0 }}>{(user&&user.name)||'My account'}</h1>
              <p style={{ font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-muted)', margin:'8px 0 0' }}>Member since {(user&&user.since)||'2024'}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onSignOut} iconLeft={<i data-lucide="log-out" style={{width:16,height:16}}></i>}>Sign out</Button>
        </div>

        <div style={{ marginBottom:'var(--space-6)' }}>
          <Tabs tabs={[{value:'orders',label:'Orders'},{value:'addresses',label:'Addresses'},{value:'profile',label:'Profile'}]} value={tab} onChange={(v)=>{ setTab(v); setOpenOrder(null); }} />
        </div>

        {tab==='orders' && (openOrder ? <OrderDetail o={openOrder} /> : (
          orders.length===0
            ? <EmptyState icon={<i data-lucide="package" style={{width:30,height:30}}></i>} title="No orders yet" message="When you place an order it'll show up here with live tracking." action={<Button variant="dark" onClick={()=>onNav('shop')}>Browse the fleet</Button>} />
            : <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>{orders.map(o=><OrderRow key={o.no} o={o} />)}</div>
        ))}

        {tab==='addresses' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'var(--space-4)' }}>
            {addresses.map(a=>(
              <div key={a.id} style={{ ...card, position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', marginBottom:'var(--space-3)' }}>
                  <span style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-display)', color:'var(--ink-900)' }}>{a.label}</span>
                  {a.primary && <Badge tone="brand">Default</Badge>}
                </div>
                <p style={{ font:'var(--fw-regular) var(--fs-sm)/1.6 var(--font-body)', color:'var(--text-body)', margin:0 }}>{a.name}<br/>{a.line}<br/>{a.city}, {a.state} {a.pin}<br/>{a.phone}</p>
                <div style={{ display:'flex', gap:'var(--space-4)', marginTop:'var(--space-4)', borderTop:'1px solid var(--border-subtle)', paddingTop:'var(--space-4)' }}>
                  <button style={{ background:'none', border:'none', padding:0, cursor:'pointer', font:'var(--fw-semibold) var(--fs-sm)/1 var(--font-body)', color:'var(--brand-ink)' }}>Edit</button>
                  {!a.primary && <button style={{ background:'none', border:'none', padding:0, cursor:'pointer', font:'var(--fw-medium) var(--fs-sm)/1 var(--font-body)', color:'var(--text-muted)' }}>Remove</button>}
                </div>
              </div>
            ))}
            <button style={{ ...card, border:'1px dashed var(--border-strong)', background:'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, color:'var(--text-muted)', minHeight:160 }}>
              <i data-lucide="plus" style={{width:24,height:24}}></i>
              <span style={{ font:'var(--fw-semibold) var(--fs-sm)/1 var(--font-body)' }}>Add new address</span>
            </button>
          </div>
        )}

        {tab==='profile' && (
          <div style={{ ...card, maxWidth:560 }}>
            <h3 style={{ font:'var(--fw-semibold) var(--fs-lg)/1 var(--font-display)', color:'var(--ink-900)', margin:'0 0 var(--space-5)' }}>Personal details</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)' }}>
              <div style={{ gridColumn:'1 / -1' }}><Input label="Full name" defaultValue={(user&&user.name)||''} /></div>
              <div style={{ gridColumn:'1 / -1' }}><Input label="Email" type="email" defaultValue={(user&&user.email)||''} /></div>
              <Input label="Phone" defaultValue={(user&&user.phone)||''} />
              <Input label="Password" type="password" defaultValue="password" />
            </div>
            <div style={{ display:'flex', gap:'var(--space-3)', marginTop:'var(--space-6)' }}>
              <Button variant="primary">Save changes</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Account;
