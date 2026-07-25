// Finspeed Distributor Portal — Sign in / Apply to become a dealer
import React from 'react';
import { Button, Input } from '../../ui/index.js';
import { useLucideIcons } from '../../lib/useLucideIcons.js';

function DistAuth({ onEnter }) {
  const [mode, setMode] = React.useState('signin'); // 'signin' | 'apply'
  const [submitted, setSubmitted] = React.useState(false);
  const [ref] = React.useState(()=> 'APP-' + Math.floor(10000 + Math.random()*90000));
  useLucideIcons();

  function submit(e){ e.preventDefault(); onEnter && onEnter(); }
  function apply(e){ e.preventDefault(); setSubmitted(true); }

  const stat = (n,l) => (
    <div>
      <div style={{ font:'var(--fw-bold) var(--fs-2xl)/1 var(--font-mono)', color:'var(--cyan-electric)' }}>{n}</div>
      <div style={{ font:'var(--fw-regular) var(--fs-2xs)/1.3 var(--font-body)', color:'rgba(255,255,255,0.6)', marginTop:6 }}>{l}</div>
    </div>
  );

  return (
    <div className="dist-auth" style={{ minHeight:'100vh', width:'100%', display:'grid', gridTemplateColumns:'1fr 1.05fr', background:'var(--bg-page)' }}>
      {/* left — dark brand / value panel */}
      <div className="dist-auth-brand" style={{ position:'relative', overflow:'hidden', background:'var(--fin-dark, var(--ink-900))', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'var(--space-9) var(--space-8)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(110% 80% at 25% 30%, rgba(25,213,242,0.20), transparent 60%)', pointerEvents:'none' }}></div>
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:10 }}>
          <img src="/assets/logos/finspeed-mark-light.png" alt="Finspeed" style={{ height:34 }} onError={(e)=>{e.currentTarget.src='/assets/logos/finspeed-mark.png';}} />
          <div>
            <div style={{ font:'var(--fw-bold) 20px/1 var(--font-display)', letterSpacing:'0.06em', textTransform:'uppercase', color:'#fff' }}>Finspeed</div>
            <div style={{ font:'var(--fw-medium) 9px/1.2 var(--font-mono)', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--cyan-electric)', marginTop:3 }}>Distributor portal</div>
          </div>
        </div>
        <div className="dist-auth-value" style={{ position:'relative' }}>
          <span style={{ font:'var(--fw-medium) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--cyan-electric)' }}>Partner with Finspeed</span>
          <h2 style={{ font:'var(--fw-bold) var(--fs-4xl)/1.02 var(--font-display)', letterSpacing:'-0.02em', color:'#fff', margin:'var(--space-4) 0 var(--space-4)' }}>Join the<br/>Network.</h2>
          <p style={{ font:'var(--text-body-md)', color:'rgba(255,255,255,0.7)', maxWidth:400, margin:0 }}>Net-30 terms, healthy margins and ex-works dispatch from Greater Noida. Stock the fleet riders ask for by name.</p>
          <div className="dist-auth-stats" style={{ display:'flex', gap:'var(--space-8)', marginTop:'var(--space-8)' }}>
            {stat('38%','Avg. dealer margin')}
            {stat('5-yr','Frame warranty')}
            {stat('13','Models in matrix')}
          </div>
        </div>
        <div className="dist-auth-footer" style={{ position:'relative', font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', color:'rgba(255,255,255,0.4)' }}>FINSPEED · MK ELECTRIC · GREATER NOIDA</div>
      </div>

      {/* right — form */}
      <div className="dist-auth-form-panel" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'var(--space-8) var(--space-7)' }}>
        <div className="dist-auth-form" style={{ width:'100%', maxWidth:430 }}>
          {submitted ? (
            <div>
              <span style={{ display:'inline-flex', width:64, height:64, borderRadius:'50%', alignItems:'center', justifyContent:'center', background:'var(--success-bg)', color:'var(--success)', marginBottom:'var(--space-5)' }}><i data-lucide="check" style={{width:30,height:30}}></i></span>
              <h1 style={{ font:'var(--fw-bold) var(--fs-3xl)/1.05 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'0 0 var(--space-3)' }}>Application received</h1>
              <p style={{ font:'var(--text-body-md)', color:'var(--text-muted)', margin:'0 0 var(--space-5)' }}>Thanks for your interest in stocking Finspeed. Our distributor team reviews every application within 2 working days.</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', background:'var(--steel-50)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', marginBottom:'var(--space-6)' }}>
                <span style={{ font:'var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)', letterSpacing:'var(--tracking-wide)', textTransform:'uppercase', color:'var(--text-faint)' }}>Reference</span>
                <span style={{ font:'var(--fw-bold) var(--fs-sm)/1 var(--font-mono)', color:'var(--ink-900)' }}>{ref}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)', marginBottom:'var(--space-6)' }}>
                {[['mail-check','We’ll email a confirmation to the address you provided.'],['phone-call','Your success manager will call to verify business details.'],['key-round','On approval, you’ll receive portal credentials and pricing.']].map(([ic,t])=>(
                  <div key={t} style={{ display:'flex', gap:12, alignItems:'flex-start', font:'var(--fw-regular) var(--fs-sm)/1.5 var(--font-body)', color:'var(--text-body)' }}>
                    <i data-lucide={ic} style={{width:18,height:18,color:'var(--brand-strong)',marginTop:2,flex:'none'}}></i>{t}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="lg" full onClick={()=>{ setSubmitted(false); setMode('signin'); }} iconLeft={<i data-lucide="arrow-left" style={{width:17,height:17}}></i>}>Back to sign in</Button>
            </div>
          ) : (<React.Fragment>
          {/* segmented toggle */}
          <div style={{ display:'inline-flex', padding:4, background:'var(--steel-50)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', marginBottom:'var(--space-6)' }}>
            {[['signin','Sign in'],['apply','Apply']].map(([k,l])=>(
              <button key={k} onClick={()=>setMode(k)} style={{ padding:'9px 20px', border:'none', cursor:'pointer', borderRadius:'var(--radius-sm)', font:'var(--fw-semibold) var(--fs-sm)/1 var(--font-body)',
                background: mode===k?'var(--surface-card)':'transparent', color: mode===k?'var(--ink-900)':'var(--text-muted)', boxShadow: mode===k?'var(--shadow-sm)':'none', transition:'var(--transition-base)' }}>{l}</button>
            ))}
          </div>

          {mode==='signin' ? (
            <React.Fragment>
              <h1 style={{ font:'var(--fw-bold) var(--fs-3xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'0 0 var(--space-2)' }}>Distributor sign in</h1>
              <p style={{ font:'var(--text-body-sm)', color:'var(--text-muted)', margin:'0 0 var(--space-6)' }}>Access pricing, order builder and invoices.</p>
              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
                <Input label="Dealer ID or email" placeholder="ravi@ravistores.in" autoComplete="username" required iconLeft={<i data-lucide="building-2" style={{width:17,height:17}}></i>} />
                <Input label="Password" type="password" placeholder="••••••••" autoComplete="current-password" required iconLeft={<i data-lucide="lock" style={{width:17,height:17}}></i>} />
                <div className="dist-auth-options" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'calc(-1 * var(--space-1))' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', font:'var(--fw-regular) var(--fs-sm)/1 var(--font-body)', color:'var(--text-body)' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor:'var(--brand)', width:16, height:16 }} /> Keep me signed in
                  </label>
                  <button type="button" style={{ background:'none', border:'none', padding:0, cursor:'pointer', font:'var(--fw-semibold) var(--fs-sm)/1 var(--font-body)', color:'var(--brand-ink)' }}>Forgot password?</button>
                </div>
                <div style={{ marginTop:'var(--space-2)' }}>
                  <Button type="submit" variant="primary" size="lg" full iconRight={<i data-lucide="arrow-right" style={{width:18,height:18}}></i>}>Enter portal</Button>
                </div>
              </form>
              <p style={{ display:'flex', gap:8, alignItems:'flex-start', font:'var(--fw-regular) var(--fs-xs)/1.5 var(--font-body)', color:'var(--text-faint)', margin:'var(--space-4) 0 0' }}>
                <i data-lucide="info" style={{ width:15, height:15, marginTop:2, flex:'none' }}></i>
                Preview only. Credentials are not verified and no live dealer account is opened. The portal shows sample pricing and orders that stay in this browser.
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h1 style={{ font:'var(--fw-bold) var(--fs-3xl)/1 var(--font-display)', letterSpacing:'-0.02em', color:'var(--ink-900)', margin:'0 0 var(--space-2)' }}>Become a dealer</h1>
              <p style={{ font:'var(--text-body-sm)', color:'var(--text-muted)', margin:'0 0 var(--space-6)' }}>Tell us about your store. We review applications within 2 working days.</p>
              <form className="dist-auth-apply" onSubmit={apply} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)' }}>
                <div style={{ gridColumn:'1 / -1' }}><Input label="Business name" placeholder="Ravi Cycle Mart" required /></div>
                <Input label="Contact person" placeholder="Ravi Kumar" required />
                <Input label="Phone" placeholder="+91 98100 45678" required />
                <div style={{ gridColumn:'1 / -1' }}><Input label="Email" type="email" placeholder="you@store.in" required /></div>
                <Input label="City" placeholder="Noida" required />
                <Input label="GSTIN" placeholder="09AABCR1234F1Z5" required />
                <div style={{ gridColumn:'1 / -1', marginTop:'var(--space-2)' }}>
                  <Button type="submit" variant="primary" size="lg" full iconRight={<i data-lucide="send" style={{width:17,height:17}}></i>}>Submit application</Button>
                </div>
              </form>
            </React.Fragment>
          )}

          <p style={{ font:'var(--fw-regular) var(--fs-xs)/1.5 var(--font-body)', color:'var(--text-faint)', textAlign:'center', margin:'var(--space-6) 0 0' }}>
            Not a dealer? <a href="/" style={{ color:'var(--brand-ink)', fontWeight:600, textDecoration:'none' }}>Shop the storefront →</a>
          </p>
          </React.Fragment>)}
        </div>
      </div>
    </div>
  );
}
export default DistAuth;
