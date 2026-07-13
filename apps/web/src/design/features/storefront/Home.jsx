// Finspeed storefront — Home
import React from 'react';
import { Button, Badge, ProductCard } from '../../ui/index.js';
import { productImage, products } from '../../data/storefront.js';

function Home({ onNav, onAdd, onProduct }) {
  const P = products;
  const featured = ['bull-shark','mako-shark','tiger-shark','sunset-marlin'].map(id => P.find(p=>p.id===id));
  const series = [
    { label:'Mountain', filter:'mountain', img:'tiger-shark', note:'Trail-ready hardtails' },
    { label:'City', filter:'city', img:'red-snapper', note:'Daily commuters' },
    { label:'Hybrid', filter:'hybrid', img:'sunset-marlin', note:'700C road standards' },
  ];
  return (
    <div>
      {/* HERO */}
      <section className="store-home-hero" style={{ position:'relative', background:'radial-gradient(120% 95% at 82% 12%, var(--cyan-50) 0%, var(--steel-50) 48%, var(--white) 100%)', color:'var(--ink-900)', overflow:'hidden' }}>
        <div className="store-home-hero-inner" style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-9) var(--space-7)', display:'grid', gridTemplateColumns:'1fr 1fr', alignItems:'center', gap:'var(--space-6)' }}>
          <div className="store-home-hero-copy">
            <span style={{ font:'var(--fw-semibold) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--brand-ink)' }}>Engineered for exploration</span>
            <h1 className="store-home-hero-title" style={{ font:'var(--fw-bold) var(--fs-6xl)/0.98 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'var(--space-4) 0 var(--space-5)' }}>Ride Beyond<br/>Boundaries</h1>
            <p style={{ font:'var(--fw-regular) var(--fs-lg)/1.55 var(--font-body)', color:'var(--text-body)', maxWidth:420, margin:'0 0 var(--space-6)' }}>
              High-tensile frames, disc-brake confidence and broad all-terrain rubber. The fleet that turns the commute into an expedition.
            </p>
            <div className="store-home-hero-actions" style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap' }}>
              <Button variant="primary" size="lg" bevel onClick={()=>onNav('shop')} iconRight={<i data-lucide="arrow-right" style={{width:18,height:18}}></i>}>Shop the fleet</Button>
              <Button variant="outline" size="lg" onClick={()=>onProduct('mako-shark')}>Meet the Mako</Button>
            </div>
            <div className="store-home-stats" style={{ display:'flex', gap:'var(--space-7)', marginTop:'var(--space-8)' }}>
              {[['12','Models in the fleet'],['₹4,800','Starting price'],['29"','Max wheel size']].map((s,i)=>(
                <div key={i}>
                  <div style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-mono)', color:'var(--price-accent)' }}>{s[0]}</div>
                  <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1.3 var(--font-body)', color:'var(--text-muted)', marginTop:4, maxWidth:90 }}>{s[1]}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="store-home-hero-visual" style={{ position:'relative', display:'flex', justifyContent:'center', alignItems:'center' }}>
            <div className="store-home-hero-glow" style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(62,184,211,0.20), transparent 66%)', filter:'blur(8px)' }}></div>
            <img className="store-home-hero-image" src="/assets/products/cutouts/mako-shark.png" alt="Mako Shark" style={{ position:'relative', width:'100%', maxWidth:540, filter:'drop-shadow(0 26px 40px rgba(10,14,18,0.22))' }} />
          </div>
        </div>
      </section>

      {/* SERIES STRIP */}
      <section className="store-content-section store-terrain-section" style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-9) var(--space-7) var(--space-7)' }}>
        <div className="store-section-heading-row" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'var(--space-6)' }}>
          <div>
            <span className="fin-eyebrow">Shop by terrain</span>
            <h2 style={{ font:'var(--fw-bold) var(--fs-3xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'8px 0 0' }}>Find your ride</h2>
          </div>
        </div>
        <div className="store-terrain-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-5)' }}>
          {series.map((s,i)=>(
            <button key={i} onClick={()=>onNav('shop', s.filter)} style={{ textAlign:'left', cursor:'pointer', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', overflow:'hidden', background:'var(--surface-card)', padding:0, transition:'var(--transition-base)' }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-md)';e.currentTarget.style.transform='translateY(-3px)';}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none';}}>
              <div style={{ height:170, background:'linear-gradient(180deg,#fff,var(--steel-50))', display:'flex', alignItems:'center', justifyContent:'center', padding:14 }}>
                <img src={productImage(s.img)} alt={s.label} style={{ maxHeight:'100%', maxWidth:'100%', objectFit:'contain', mixBlendMode:'multiply' }} />
              </div>
              <div style={{ padding:'var(--space-4) var(--space-5)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ font:'var(--fw-bold) var(--fs-xl)/1 var(--font-display)', color:'var(--ink-900)' }}>{s.label}</div>
                  <div style={{ font:'var(--fw-regular) var(--fs-xs)/1.3 var(--font-body)', color:'var(--text-muted)', marginTop:4 }}>{s.note}</div>
                </div>
                <i data-lucide="arrow-right" style={{width:20,height:20,color:'var(--brand-strong)'}}></i>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="store-content-section store-featured-section" style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-5) var(--space-7) var(--space-9)' }}>
        <div className="store-section-heading-row" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'var(--space-6)' }}>
          <div>
            <span className="fin-eyebrow">The lineup</span>
            <h2 style={{ font:'var(--fw-bold) var(--fs-3xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'8px 0 0' }}>Featured cycles</h2>
          </div>
          <Button variant="ghost" onClick={()=>onNav('shop')} iconRight={<i data-lucide="arrow-right" style={{width:16,height:16}}></i>}>View all</Button>
        </div>
        <div className="store-featured-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--space-5)' }}>
          {featured.map(p=>(
            <ProductCard key={p.id} name={p.name} series={p.series} image={productImage(p.id)} price={p.price} mrp={p.mrp} rating={p.rating} ratingCount={p.reviews} badge={p.badge} badgeTone={p.badge==='New'?'success':'brand'} soldOut={p.stock===0} onAdd={()=>onAdd(p.id)} onClick={()=>onProduct(p.id)} />
          ))}
        </div>
      </section>

      {/* FEATURE BAND */}
      <section style={{ background:'var(--steel-50)', color:'var(--ink-900)', borderTop:'1px solid var(--border-subtle)' }}>
        <div className="store-feature-grid" style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:'var(--space-9) var(--space-7)', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-7)' }}>
          {[['shield-check','High-tensile frames','Aerospace-grade steel built to take the hit and keep rolling.'],['disc','Disc-brake confidence','Stop hard, stop sure — in the wet, on the descent, every time.'],['truck','Assembled & delivered','85% pre-assembled, shipped across India. Ride within the hour.']].map((f,i)=>(
            <div key={i}>
              <span style={{ display:'inline-flex', width:48, height:48, borderRadius:'var(--radius-md)', alignItems:'center', justifyContent:'center', background:'var(--cyan-50)', color:'var(--brand-strong)', marginBottom:'var(--space-4)' }}>
                <i data-lucide={f[0]} style={{width:22,height:22}}></i>
              </span>
              <h3 style={{ font:'var(--fw-semibold) var(--fs-xl)/1.1 var(--font-display)', color:'var(--ink-900)', margin:'0 0 8px' }}>{f[1]}</h3>
              <p style={{ font:'var(--fw-regular) var(--fs-sm)/1.6 var(--font-body)', color:'var(--text-muted)', margin:0 }}>{f[2]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export default Home;
