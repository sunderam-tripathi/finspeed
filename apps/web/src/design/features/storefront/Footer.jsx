// Finspeed storefront — Footer
import React from 'react';

function Footer({ onNav, tone = 'light' }) {
  const dark = tone === 'dark';
  const go = onNav || (()=>{});
  const cols = [
    { h:'Shop', items:[['Mountain',()=>go('shop','mountain')],['City',()=>go('shop','city')],['Hybrid',()=>go('shop','hybrid')],['Geared Elite',()=>go('shop','mountain')],['All cycles',()=>go('shop','all')]] },
    { h:'Support', items:[['Find a store',()=>go('stores')],['Warranty',()=>go('warranty')],['Assembly guide',()=>go('assembly')],['Contact',()=>go('contact')]] },
    { h:'Company', items:[['About Finspeed',()=>go('about')],['The Fleet',()=>go('shop','all')],['Distributors',()=>{window.location.href='/distributor';}],['Careers',()=>go('contact')]] },
  ];
  return (
    <footer className={`store-footer${dark ? ' fin-dark store-footer--dark' : ''}`} style={{ background:dark ? 'var(--ink-900)' : 'var(--steel-100)', color:'var(--text-body)', padding:'var(--space-9) var(--space-7) var(--space-6)', borderTop:'1px solid var(--border-subtle)' }}>
      <div className="store-footer-grid" style={{ maxWidth:'var(--container-max)', margin:'0 auto', display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr', gap:'var(--space-7)' }}>
        <div className="store-footer-brand">
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:'var(--space-4)' }}>
            <img src={dark ? '/assets/logos/finspeed-mark-light.png' : '/assets/logos/finspeed-mark.png'} alt="Finspeed" style={{ height:40 }} />
            <span style={{ font:'var(--fw-bold) 22px/1 var(--font-display)', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--text-strong)' }}>Finspeed</span>
          </div>
          <p style={{ font:'var(--fw-regular) var(--fs-sm)/1.6 var(--font-body)', color:'var(--text-muted)', maxWidth:300, margin:0 }}>
            We build cycles for dreamers who seek adventure and push their limits. Beyond limits, beyond boundaries.
          </p>
          <div className="store-footer-social" style={{ display:'flex', gap:12, marginTop:'var(--space-5)' }}>
            {['share-2','radio','video'].map(s=>(
              <span key={s} style={{ width:38, height:38, borderRadius:'var(--radius-sm)', border:'1px solid var(--border-strong)', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'var(--text-body)' }}>
                <i data-lucide={s} style={{width:17,height:17}}></i>
              </span>
            ))}
          </div>
        </div>
        {cols.map((c,i)=>(
          <div key={i}>
            <h4 style={{ font:'var(--fw-semibold) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--brand-strong)', margin:'0 0 var(--space-4)' }}>{c.h}</h4>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
              {c.items.map((it,j)=>(
                <li key={j}><a onClick={it[1]} style={{ font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-body)', textDecoration:'none', cursor:'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--text-strong)'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--text-body)'}>{it[0]}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="store-footer-bottom" style={{ maxWidth:'var(--container-max)', margin:'var(--space-7) auto 0', paddingTop:'var(--space-5)', borderTop:'1px solid var(--border-subtle)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <span style={{ font:'var(--fw-bold) var(--fs-xs)/1 var(--font-display)', letterSpacing:'var(--tracking-widest)', textTransform:'uppercase', color:'var(--text-muted)' }}>Ride Beyond Boundaries</span>
        <span style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', color:'var(--text-muted)' }}>© 2026 Finspeed · MK Electric · Greater Noida</span>
      </div>
    </footer>
  );
}
export default Footer;
