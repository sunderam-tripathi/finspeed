// Finspeed storefront — Checkout
import React from 'react';
import { Button, Input, Breadcrumb } from '../../ui/index.js';
import { productImage, products } from '../../data/storefront.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function Checkout({ items, onQty, onRemove, onNav, onProduct, onPlaced }) {
  const P = products;
  const lines = Object.entries(items).map(([id,qty])=>({ p:P.find(x=>x.id===id), qty })).filter(l=>l.p);
  const subtotal = lines.reduce((s,l)=>s + l.p.price*l.qty, 0);
  const count = lines.reduce((s,l)=>s+l.qty,0);
  const shipping = 0;
  const total = subtotal + shipping;
  const [placed, setPlaced] = React.useState(false);
  const [pay, setPay] = React.useState('cod');
  const [orderNo] = React.useState(()=> 'FS' + Math.floor(100000 + Math.random()*900000));
  const inr = (n)=> '₹' + n.toLocaleString('en-IN');

  useLucideIcons();

  // ---- success ----
  if (placed) {
    return (
      <div style={{ background:'var(--bg-page)', minHeight:'70vh' }}>
        <div className="store-page-shell store-checkout-state" style={{ maxWidth:620, margin:'0 auto', padding:'var(--space-9) var(--space-7)', textAlign:'center' }}>
          <span style={{ display:'inline-flex', width:72, height:72, borderRadius:'50%', alignItems:'center', justifyContent:'center', background:'var(--success-bg)', color:'var(--success)', marginBottom:'var(--space-5)' }}>
            <i data-lucide="check" style={{width:34,height:34}}></i>
          </span>
          <h1 style={{ font:'var(--fw-bold) var(--fs-4xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'0 0 var(--space-3)' }}>Order confirmed</h1>
          <p style={{ font:'var(--text-body-md)', color:'var(--text-muted)', margin:'0 0 var(--space-2)' }}>Thanks for riding with Finspeed. A confirmation is on its way.</p>
          <p style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', color:'var(--brand-ink)', margin:'0 0 var(--space-7)' }}>Order {orderNo}</p>
          <div style={{ display:'flex', gap:'var(--space-3)', justifyContent:'center', flexWrap:'wrap' }}>
            <Button variant="primary" size="lg" onClick={()=>onNav('account')} iconLeft={<i data-lucide="map-pin" style={{width:18,height:18}}></i>}>Track order</Button>
            <Button variant="outline" size="lg" onClick={()=>onNav('shop')} iconRight={<i data-lucide="arrow-right" style={{width:18,height:18}}></i>}>Continue shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  // ---- empty ----
  if (lines.length===0) {
    return (
      <div style={{ background:'var(--bg-page)', minHeight:'70vh' }}>
        <div className="store-page-shell store-checkout-state" style={{ maxWidth:620, margin:'0 auto', padding:'var(--space-9) var(--space-7)', textAlign:'center', color:'var(--text-muted)' }}>
          <i data-lucide="shopping-cart" style={{width:38,height:38}}></i>
          <h1 style={{ font:'var(--fw-bold) var(--fs-2xl)/1.1 var(--font-display)', color:'var(--ink-900)', margin:'var(--space-4) 0 var(--space-2)' }}>Your cart is empty</h1>
          <p style={{ font:'var(--text-body-sm)', margin:'0 0 var(--space-5)' }}>Add a cycle to the cart before checking out.</p>
          <Button variant="dark" onClick={()=>onNav('shop')}>Browse the fleet</Button>
        </div>
      </div>
    );
  }

  function place(e){
    e.preventDefault(); window.scrollTo(0,0); setPlaced(true);
    const order = {
      no: orderNo.replace(/^FS/,'FS'),
      date: new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),
      step: 0, eta: 'Arriving in 4\u20136 days',
      items: lines.map(l=>({ id:l.p.id, qty:l.qty })),
      total,
    };
    onPlaced && onPlaced(order);
  }

  const sectionTitle = (n, t) => (
    <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', marginBottom:'var(--space-5)' }}>
      <span style={{ width:28, height:28, flex:'none', borderRadius:'var(--radius-sm)', background:'var(--ink-900)', color:'var(--cyan-electric)', display:'inline-flex', alignItems:'center', justifyContent:'center', font:'var(--fw-bold) var(--fs-xs)/1 var(--font-mono)' }}>{n}</span>
      <h2 style={{ font:'var(--fw-semibold) var(--fs-xl)/1 var(--font-display)', letterSpacing:'var(--tracking-tight)', color:'var(--ink-900)', margin:0 }}>{t}</h2>
    </div>
  );

  const cardStyle = { background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', padding:'var(--space-6)' };
  const payTile = (key, label, sub, icon) => {
    const active = pay===key;
    return (
      <button type="button" onClick={()=>setPay(key)} style={{ flex:'1 1 180px', textAlign:'left', cursor:'pointer', display:'flex', gap:'var(--space-3)', alignItems:'flex-start', padding:'var(--space-4)', background:active?'var(--cyan-50)':'var(--surface-card)', border:'var(--border-width-bold) solid '+(active?'var(--brand)':'var(--border-strong)'), borderRadius:'var(--radius-md)', transition:'var(--transition-base)' }}>
        <i data-lucide={icon} style={{width:20,height:20,flex:'none',color:active?'var(--brand-ink)':'var(--text-muted)',marginTop:2}}></i>
        <span>
          <span style={{ display:'block', font:'var(--fw-semibold) var(--fs-sm)/1.2 var(--font-body)', color:'var(--text-strong)' }}>{label}</span>
          <span style={{ display:'block', font:'var(--fw-regular) var(--fs-2xs)/1.3 var(--font-body)', color:'var(--text-muted)', marginTop:3 }}>{sub}</span>
        </span>
      </button>
    );
  };

  return (
    <div style={{ background:'var(--bg-page)' }}>
      <div className="store-page-shell store-checkout-page" style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-5) var(--space-7) var(--space-9)' }}>
        <div style={{ padding:'var(--space-4) 0' }}>
          <Breadcrumb items={[{label:'Home',onClick:()=>onNav('home')},{label:'Shop',onClick:()=>onNav('shop')},{label:'Checkout'}]} />
        </div>
        <h1 style={{ font:'var(--fw-bold) var(--fs-4xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'4px 0 var(--space-7)' }}>Checkout</h1>

        <form className="store-checkout-layout" onSubmit={place} style={{ display:'grid', gridTemplateColumns:'1.4fr 0.9fr', gap:'var(--space-7)', alignItems:'start' }}>
          {/* left — details */}
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
            <div className="store-checkout-card" style={cardStyle}>
              {sectionTitle('1','Contact')}
              <div className="store-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)' }}>
                <Input label="Full name" placeholder="Arjun Mehta" required />
                <Input label="Phone" placeholder="+91 98765 43210" required />
                <div style={{ gridColumn:'1 / -1' }}><Input label="Email" type="email" placeholder="you@email.com" required /></div>
              </div>
            </div>

            <div className="store-checkout-card" style={cardStyle}>
              {sectionTitle('2','Shipping address')}
              <div className="store-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)' }}>
                <div style={{ gridColumn:'1 / -1' }}><Input label="Address" placeholder="Flat / house, street, area" required /></div>
                <Input label="City" placeholder="Greater Noida" required />
                <Input label="State" placeholder="Uttar Pradesh" required />
                <Input label="PIN code" placeholder="201306" required />
                <Input label="Landmark (optional)" placeholder="Near Sarin Farm Market" />
              </div>
            </div>

            <div className="store-checkout-card" style={cardStyle}>
              {sectionTitle('3','Payment')}
              <div className="store-payment-options" style={{ display:'flex', gap:'var(--space-4)', flexWrap:'wrap' }}>
                {payTile('cod','Cash on delivery','Pay when your cycle arrives','banknote')}
                {payTile('upi','UPI on delivery','Scan & pay at handover','smartphone')}
              </div>
            </div>
          </div>

          {/* right — order summary */}
          <div className="store-checkout-card store-checkout-summary" style={{ ...cardStyle, position:'sticky', top:'var(--space-5)' }}>
            <h2 style={{ font:'var(--fw-semibold) var(--fs-xl)/1 var(--font-display)', letterSpacing:'var(--tracking-tight)', color:'var(--ink-900)', margin:'0 0 var(--space-5)' }}>Order summary <span style={{ font:'var(--fw-regular) var(--fs-sm)/1 var(--font-mono)', color:'var(--text-muted)' }}>({count})</span></h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)', marginBottom:'var(--space-5)' }}>
              {lines.map(({p,qty})=>(
                <div className="store-checkout-item" key={p.id} style={{ display:'flex', gap:'var(--space-3)', alignItems:'center' }}>
                  <div style={{ position:'relative', width:64, height:54, flex:'none', background:'linear-gradient(180deg,#fff,var(--steel-50))', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', padding:5, cursor:'pointer' }} onClick={()=>onProduct(p.id)}>
                    <img src={productImage(p.id)} alt={p.name} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
                    <span style={{ position:'absolute', top:-7, right:-7, minWidth:18, height:18, padding:'0 5px', display:'inline-flex', alignItems:'center', justifyContent:'center', background:'var(--ink-900)', color:'#fff', font:'var(--fw-bold) var(--fs-3xs)/1 var(--font-mono)', borderRadius:'var(--radius-pill)' }}>{qty}</span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ font:'var(--fw-bold) var(--fs-sm)/1.1 var(--font-display)', color:'var(--ink-900)' }}>{p.name}</div>
                    <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-muted)', marginTop:2 }}>{p.wheels} · {p.speed}</div>
                  </div>
                  <span style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--ink-900)' }}>{inr(p.price*qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop:'1px solid var(--border-subtle)', paddingTop:'var(--space-4)', display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
              <OrderSummaryRow k="Subtotal" v={inr(subtotal)} />
              <OrderSummaryRow k="Shipping" v="Free" accent />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderTop:'1px solid var(--border-subtle)', paddingTop:'var(--space-4)', marginTop:'var(--space-1)' }}>
                <span style={{ font:'var(--fw-semibold) var(--fs-md)/1 var(--font-body)', color:'var(--text-strong)' }}>Total</span>
                <span style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-mono)', color:'var(--ink-900)' }}>{inr(total)}</span>
              </div>
            </div>
            <div style={{ marginTop:'var(--space-5)' }}>
              <Button type="submit" variant="primary" size="lg" full iconRight={<i data-lucide="lock" style={{width:17,height:17}}></i>}>Place order</Button>
            </div>
            <p style={{ font:'var(--fw-regular) var(--fs-2xs)/1.4 var(--font-body)', color:'var(--text-faint)', textAlign:'center', margin:'var(--space-3) 0 0' }}>Free delivery across India · 1-year warranty</p>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrderSummaryRow({ k, v, accent }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
      <span style={{ font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-muted)' }}>{k}</span>
      <span style={{ font:'var(--fw-semibold) var(--fs-sm)/1 var(--font-mono)', color: accent ? 'var(--success)' : 'var(--text-strong)' }}>{v}</span>
    </div>
  );
}
export default Checkout;
