// Finspeed storefront — Cart drawer
import React from 'react';
import { Button, IconButton, QuantityStepper } from '../../ui/index.js';
import { productImage, products } from '../../data/storefront.js';

function CartDrawer({ open, items, onClose, onQty, onRemove, onProduct, onCheckout }) {
  const P = products;
  const lines = Object.entries(items).map(([id,qty]) => ({ p:P.find(x=>x.id===id), qty })).filter(l=>l.p);
  const subtotal = lines.reduce((s,l)=>s + l.p.price*l.qty, 0);
  const count = lines.reduce((s,l)=>s+l.qty,0);

  return (
    <>
      <div className="store-cart-backdrop" onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(10,14,18,0.5)', backdropFilter:'blur(2px)', opacity:open?1:0, pointerEvents:open?'auto':'none', transition:'opacity var(--dur-base) var(--ease-out)', zIndex:1000 }}></div>
      <aside className="store-cart-drawer" aria-hidden={!open} style={{ position:'fixed', top:0, right:0, height:'100%', width:420, maxWidth:'92vw', background:'var(--surface-card)', boxShadow:'var(--shadow-lg)', transform:open?'none':'translateX(100%)', transition:'transform var(--dur-slow) var(--ease-out)', zIndex:1001, display:'flex', flexDirection:'column' }}>
        <div className="store-cart-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'var(--space-5) var(--space-5)', borderBottom:'1px solid var(--border-subtle)' }}>
          <h3 style={{ font:'var(--fw-bold) var(--fs-xl)/1 var(--font-display)', color:'var(--ink-900)', margin:0 }}>Your cart <span style={{font:'var(--fw-regular) var(--fs-sm)/1 var(--font-mono)',color:'var(--text-muted)'}}>({count})</span></h3>
          <IconButton variant="ghost" size="sm" aria-label="Close cart" onClick={onClose} icon={<i data-lucide="x" style={{width:18,height:18}}></i>} />
        </div>

        <div className="store-cart-body" style={{ flex:1, overflowY:'auto', padding:'var(--space-4) var(--space-5)' }}>
          {lines.length===0 && (
            <div style={{ textAlign:'center', padding:'var(--space-9) 0', color:'var(--text-muted)' }}>
              <i data-lucide="shopping-cart" style={{width:36,height:36}}></i>
              <p style={{ font:'var(--fw-medium) var(--fs-sm)/1.4 var(--font-body)', marginTop:12 }}>Your cart is empty.</p>
            </div>
          )}
          {lines.map(({p,qty})=>(
            <div className="store-cart-item" key={p.id} style={{ display:'flex', gap:14, padding:'var(--space-4) 0', borderBottom:'1px solid var(--border-subtle)' }}>
              <div className="store-cart-item-image" style={{ width:84, height:72, flex:'none', background:'linear-gradient(180deg,#fff,var(--steel-50))', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', padding:6, cursor:'pointer' }} onClick={()=>onProduct(p.id)}>
                <img src={productImage(p.id)} alt={p.name} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
                  <div>
                    <div style={{ font:'var(--fw-bold) var(--fs-md)/1.1 var(--font-display)', color:'var(--ink-900)' }}>{p.name}</div>
                    <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-muted)', marginTop:3 }}>{p.wheels} · {p.speed}</div>
                  </div>
                  <button onClick={()=>onRemove(p.id)} aria-label="Remove" style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-faint)', padding:2 }}><i data-lucide="trash-2" style={{width:16,height:16}}></i></button>
                </div>
                <div className="store-cart-item-controls" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
                  <QuantityStepper value={qty} min={1} max={5} onChange={(v)=>onQty(p.id,v)} style={{ transform:'scale(0.92)', transformOrigin:'left' }} />
                  <span style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--price-accent)' }}>₹{(p.price*qty).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {lines.length>0 && (
          <div className="store-cart-footer" style={{ padding:'var(--space-5)', borderTop:'1px solid var(--border-subtle)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'var(--space-4)' }}>
              <span style={{ font:'var(--fw-medium) var(--fs-sm)/1 var(--font-body)', color:'var(--text-muted)' }}>Subtotal</span>
              <span style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-mono)', color:'var(--ink-900)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <Button variant="primary" size="lg" full onClick={onCheckout} iconRight={<i data-lucide="arrow-right" style={{width:18,height:18}}></i>}>Checkout</Button>
            <p style={{ font:'var(--fw-regular) var(--fs-2xs)/1.4 var(--font-body)', color:'var(--text-faint)', textAlign:'center', margin:'var(--space-3) 0 0' }}>Free delivery across India · 1-year warranty</p>
          </div>
        )}
      </aside>
    </>
  );
}
export default CartDrawer;
